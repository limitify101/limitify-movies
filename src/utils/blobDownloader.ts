/**
 * Blob Download Utility
 * Automatically intercepts and downloads video blobs from iframe embeds
 */

export interface BlobDownloadOptions {
  filename: string;
  iframeRef: HTMLIFrameElement | null;
  onProgress?: (progress: number) => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Intercepts blob URLs from network requests and triggers download
 * This works by monitoring fetch/XMLHttpRequest in the iframe context
 */
export const downloadBlobFromIframe = async (options: BlobDownloadOptions): Promise<void> => {
  const { filename, iframeRef, onProgress, onSuccess, onError } = options;

  if (!iframeRef) {
    onError?.('Iframe reference not found');
    return;
  }

  try {
    // Method 1: Try to access iframe's window (will fail for cross-origin)
    try {
      const iframeWindow = iframeRef.contentWindow;
      if (iframeWindow) {
        // Inject download script into iframe
        const script = iframeWindow.document.createElement('script');
        script.textContent = `
          (function() {
            const originalFetch = window.fetch;
            const originalXHR = window.XMLHttpRequest.prototype.open;

            // Intercept fetch
            window.fetch = async function(...args) {
              const response = await originalFetch.apply(this, args);
              const url = args[0];

              if (url.includes('.m3u8') || url.includes('.mp4') || url.includes('blob:')) {
                window.parent.postMessage({
                  type: 'VIDEO_URL_FOUND',
                  url: url,
                  responseUrl: response.url
                }, '*');
              }

              return response;
            };

            // Intercept XMLHttpRequest
            XMLHttpRequest.prototype.open = function(method, url, ...rest) {
              if (url.includes('.m3u8') || url.includes('.mp4') || url.includes('blob:')) {
                window.parent.postMessage({
                  type: 'VIDEO_URL_FOUND',
                  url: url
                }, '*');
              }
              return originalXHR.apply(this, [method, url, ...rest]);
            };

            // Monitor blob creation
            const originalCreateObjectURL = URL.createObjectURL;
            URL.createObjectURL = function(blob) {
              const url = originalCreateObjectURL.call(this, blob);
              if (blob.type.includes('video')) {
                window.parent.postMessage({
                  type: 'BLOB_CREATED',
                  url: url,
                  size: blob.size,
                  type: blob.type
                }, '*');
              }
              return url;
            };
          })();
        `;
        iframeWindow.document.head.appendChild(script);
      }
    } catch (crossOriginError) {
      // Cross-origin iframe - use alternative method
      console.log('Cross-origin iframe detected, using alternative method');
    }

    // Method 2: Listen for messages from iframe
    const messageHandler = async (event: MessageEvent) => {
      if (event.data.type === 'VIDEO_URL_FOUND' || event.data.type === 'BLOB_CREATED') {
        const videoUrl = event.data.url || event.data.responseUrl;

        if (videoUrl) {
          try {
            onProgress?.(50);

            // Fetch the blob
            const response = await fetch(videoUrl);
            const blob = await response.blob();

            onProgress?.(75);

            // Create download link
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);

            onProgress?.(100);
            onSuccess?.();

            // Remove listener
            window.removeEventListener('message', messageHandler);
          } catch (fetchError) {
            onError?.('Failed to download video blob');
          }
        }
      }
    };

    window.addEventListener('message', messageHandler);

    // Timeout after 30 seconds
    setTimeout(() => {
      window.removeEventListener('message', messageHandler);
      onError?.('Download timeout - video source not detected');
    }, 30000);

  } catch (error) {
    onError?.(`Download failed: ${error}`);
  }
};

/**
 * Alternative method: Extract video URL from iframe src and fetch directly
 */
export const downloadFromEmbedUrl = async (
  embedUrl: string,
  _filename: string,
  _onProgress?: (progress: number) => void,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> => {
  try {
    // For services like vidsrc or multiembed, we can't directly download
    // Instead, open the embed in a new window with download instructions
    const downloadWindow = window.open(embedUrl, '_blank', 'width=800,height=600');

    if (downloadWindow) {
      // Inject a download helper script
      setTimeout(() => {
        try {
          const script = downloadWindow.document.createElement('div');
          script.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: #f3b83ae8; color: black; padding: 15px; border-radius: 8px; z-index: 99999; font-family: Arial; max-width: 300px;">
              <strong>Download Instructions:</strong><br/>
              1. Open DevTools (F12)<br/>
              2. Go to Network tab<br/>
              3. Filter by "media" or ".m3u8"<br/>
              4. Right-click video URL → Open in new tab<br/>
              5. Video will auto-download
            </div>
          `;
          downloadWindow.document.body.appendChild(script);
          onSuccess?.();
        } catch (e) {
          // Cross-origin restriction
          onError?.('Opened in new tab - use browser tools to download');
        }
      }, 1000);
    } else {
      onError?.('Popup blocked - please allow popups');
    }
  } catch (error) {
    onError?.(`Failed to open download window: ${error}`);
  }
};

/**
 * Automatic download detector that monitors the page for blob URLs
 */
export class AutoBlobDownloader {
  private observers: Set<Function> = new Set();
  private isMonitoring: boolean = false;
  private originalCreateObjectURL: typeof URL.createObjectURL | null = null;
  private detectedBlobs: Set<string> = new Set();

  start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Store original function
    this.originalCreateObjectURL = URL.createObjectURL;

    // Override URL.createObjectURL with a non-intrusive wrapper
    const self = this;
    URL.createObjectURL = function(blob: Blob | MediaSource) {
      // Call original function first to get the URL
      const url = self.originalCreateObjectURL!.call(URL, blob);

      // Only notify if it's a video blob and we haven't seen it before
      if (blob instanceof Blob && blob.type.includes('video') && !self.detectedBlobs.has(url)) {
        self.detectedBlobs.add(url);

        // Notify observers asynchronously to not block video playback
        setTimeout(() => {
          self.notifyObservers({ url, blob });
        }, 0);
      }

      // Always return the URL immediately for normal playback
      return url;
    };
  }

  stop() {
    // Restore original function
    if (this.originalCreateObjectURL) {
      URL.createObjectURL = this.originalCreateObjectURL;
    }

    this.isMonitoring = false;
    this.observers.clear();
    this.detectedBlobs.clear();
  }

  onBlobDetected(callback: (data: { url: string; blob: Blob }) => void) {
    this.observers.add(callback);
  }

  private notifyObservers(data: { url: string; blob: Blob }) {
    this.observers.forEach(callback => callback(data));
  }
}

import { useState } from 'react';
import { Download, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { FONTS, COLORS } from '../config/theme';

interface DownloadButtonProps {
  title: string;
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

function DownloadButton({ title, type, season, episode }: DownloadButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleDownloadClick = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Download Button */}
      <button
        onClick={handleDownloadClick}
        className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-black font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl ${FONTS.condensed}`}
      >
        <Download />
        <span className="text-lg">Download Video</span>
      </button>

      {/* Download Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-zinc-800"
            >
              {/* Header */}
              <div className="bg-zinc-900 border-b border-zinc-800 p-6 flex items-start justify-between">
                <div>
                  <h2 className={`text-2xl font-bold text-white mb-1 ${FONTS.heading}`}>
                    Download Instructions
                  </h2>
                  <p className={`text-gray-400 text-sm ${FONTS.body}`}>
                    {title}
                    {type === 'tv' && ` - S${season} E${episode}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Close />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Instructions */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-5">
                  <h3 className={`text-white text-lg font-bold mb-3 ${FONTS.condensed}`}>
                    How to Download This Video
                  </h3>
                  <ol className={`text-blue-100 text-sm space-y-2 ${FONTS.body} list-decimal list-inside`}>
                    <li><strong>Open Developer Tools:</strong> Press <code className="bg-black/30 px-2 py-1 rounded">F12</code> or <code className="bg-black/30 px-2 py-1 rounded">Ctrl+Shift+I</code> (Windows/Linux) / <code className="bg-black/30 px-2 py-1 rounded">Cmd+Option+I</code> (Mac)</li>
                    <li><strong>Go to Network Tab:</strong> Click on the "Network" tab in DevTools</li>
                    <li><strong>Filter Media:</strong> In the filter box, type <code className="bg-black/30 px-2 py-1 rounded">media</code> or <code className="bg-black/30 px-2 py-1 rounded">m3u8</code></li>
                    <li><strong>Play the Video:</strong> Start playing the video above</li>
                    <li><strong>Find Video File:</strong> Look for files ending in <code className="bg-black/30 px-2 py-1 rounded">.m3u8</code>, <code className="bg-black/30 px-2 py-1 rounded">.mp4</code>, or <code className="bg-black/30 px-2 py-1 rounded">.ts</code></li>
                    <li><strong>Open in New Tab:</strong> Right-click the video file → "Open in new tab"</li>
                    <li><strong>Save Video:</strong> Right-click on the video → "Save video as..."</li>
                  </ol>
                </div>

                {/* Alternative Method */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className={`text-yellow-200 font-bold mb-2 ${FONTS.condensed}`}>
                    💡 Alternative: Use a Browser Extension
                  </h4>
                  <p className={`text-yellow-100 text-sm ${FONTS.body}`}>
                    For easier downloads, install a video downloader extension like "Video DownloadHelper" (Firefox/Chrome) or "Stream Recorder" which can automatically detect and save streaming videos.
                  </p>
                </div>

                {/* Technical Note */}
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <p className={`text-gray-400 text-xs ${FONTS.body} italic`}>
                    <strong>Note:</strong> Due to browser security restrictions, we cannot automatically download videos from third-party embed services. The manual method above is the most reliable way to save videos for offline viewing.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-black px-6 py-2 rounded-lg transition-colors font-semibold ${FONTS.condensed}`}
                >
                  Got It!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default DownloadButton;

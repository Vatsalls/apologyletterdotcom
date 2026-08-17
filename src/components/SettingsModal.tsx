import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminData, PhotoItem } from '../types';
import { X, Eye, Clock, Heart, Trash2, Check, Settings as SettingsIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminData: AdminData | null;
  photos: PhotoItem[];
  onDeletePhoto: (id: string) => void;
  onUpdateLetter: (newText: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  adminData,
  photos,
  onDeletePhoto,
  onUpdateLetter,
}) => {
  const [letterDraft, setLetterDraft] = useState('');
  const [letterSaved, setLetterSaved] = useState(false);

  useEffect(() => {
    if (isOpen && adminData?.customLetter) {
      setLetterDraft(adminData.customLetter);
    }
  }, [isOpen, adminData?.customLetter]);

  if (!isOpen) return null;

  const handleSaveLetter = () => {
    onUpdateLetter(letterDraft);
    setLetterSaved(true);
    setTimeout(() => setLetterSaved(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-amber-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#FFFDF6] p-6 sm:p-8 rounded-3xl max-w-3xl w-full border-4 border-[#CA8A04] polaroid-shadow relative my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-full border border-amber-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 border-b-2 border-dashed border-amber-300 pb-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#FEF08A] border-2 border-[#CA8A04] flex items-center justify-center text-2xl shrink-0">
              <SettingsIcon className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h3 className="font-cute text-2xl font-bold text-amber-950">
                Settings
              </h3>
              <p className="font-handwritten text-lg text-amber-800">
                Visitor stats, the letter, gallery photos & received notes 
              </p>
            </div>
          </div>

          {/* Visit Stat */}
          <div className="bg-amber-100/60 p-4 rounded-2xl border-2 border-amber-300 flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-200 rounded-xl text-amber-900">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="font-cute text-xs text-amber-800 uppercase font-bold">Total Visits</span>
              <p className="font-cute text-3xl font-bold text-amber-950">
                {adminData?.visitorCount ?? 0} <span className="text-sm font-normal">times viewed</span>
              </p>
            </div>
          </div>

          {/* Edit Letter */}
          <div className="mb-8">
            <h4 className="font-cute text-lg font-bold text-amber-900 mb-2">
              Edit The Letter
            </h4>
            <textarea
              value={letterDraft}
              onChange={(e) => setLetterDraft(e.target.value)}
              rows={6}
              className="w-full p-4 font-handwritten text-xl text-[#4A3E3D] bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveLetter}
                className="px-4 py-2 bg-[#EAB308] hover:bg-[#CA8A04] text-white font-cute font-bold rounded-lg flex items-center gap-1 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" /> {letterSaved ? 'Saved!' : 'Save Letter'}
              </button>
            </div>
          </div>

          {/* Manage Photos */}
          <div className="mb-8">
            <h4 className="font-cute text-lg font-bold text-amber-900 mb-2">
              Manage Gallery Photos ({photos.length})
            </h4>
            {photos.length === 0 ? (
              <div className="p-6 text-center bg-amber-50 rounded-2xl border border-dashed border-amber-300 font-handwritten text-xl text-amber-800">
                No photos in the gallery yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative rounded-xl overflow-hidden border-2 border-amber-200 group">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-24 object-cover"
                    />
                    <button
                      onClick={() => onDeletePhoto(photo.id)}
                      className="absolute inset-0 bg-red-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      title="Delete photo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages Received Section */}
          <div className="space-y-4">
            <h4 className="font-cute text-lg font-bold text-amber-900 flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              Received Notes ({adminData?.messages?.length || 0})
            </h4>

            {(!adminData?.messages || adminData.messages.length === 0) ? (
              <div className="p-8 text-center bg-amber-50 rounded-2xl border border-dashed border-amber-300 font-handwritten text-2xl text-amber-800">
                No notes sent yet. When she writes a message, it will show up right here! 
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {adminData.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-xs relative"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-cute font-bold text-amber-950 text-base flex items-center gap-1.5">
                        {msg.senderName}
                      </span>
                      <span className="font-cute text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="font-handwritten text-2xl text-amber-900 mt-2 whitespace-pre-wrap">
                      "{msg.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visitor Log Summary */}
          {adminData?.visitors && adminData.visitors.length > 0 && (
            <div className="mt-6 pt-4 border-t border-dashed border-amber-300">
              <h5 className="font-cute text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700" /> Recent Visits
              </h5>
              <div className="bg-amber-50 p-3 rounded-xl max-h-32 overflow-y-auto text-xs font-mono text-amber-900 space-y-1">
                {adminData.visitors.slice(0, 10).map((v, i) => (
                  <div key={i} className="flex justify-between border-b border-amber-200/50 pb-1">
                    <span>{new Date(v.time).toLocaleTimeString()}</span>
                    <span className="truncate max-w-[220px] opacity-70">{v.userAgent}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#EAB308] hover:bg-[#CA8A04] text-white font-cute font-bold rounded-xl shadow-xs transition-colors"
            >
              Close Settings
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

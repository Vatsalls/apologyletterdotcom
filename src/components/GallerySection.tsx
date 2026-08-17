import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoItem } from '../types';
import { Plus, Sparkles, X, Upload, Check } from 'lucide-react';

interface GallerySectionProps {
  photos: PhotoItem[];
  onAddPhoto: (photo: Omit<PhotoItem, 'id'>) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  onAddPhoto,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for new photo
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newFrameStyle, setNewFrameStyle] = useState<PhotoItem['frameStyle']>('polaroid');
  const [newSticker, setNewSticker] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = filePreview || newUrl;
    if (!finalUrl) return;

    onAddPhoto({
      url: finalUrl,
      caption: newCaption || '',
      date: 'Today',
      frameStyle: newFrameStyle,
      sticker: newSticker,
    });

    setIsAddModalOpen(false);
    // Reset
    setNewUrl('');
    setNewCaption('');
    setFilePreview(null);
  };

  // Helper renderer for different cute doodle border styles
  const getFrameClasses = (style: PhotoItem['frameStyle']) => {
    switch (style) {
      case 'polaroid':
        return 'bg-white p-3 pb-8 rounded-lg shadow-md border-2 border-amber-200 relative group hover:rotate-1 transition-transform';
      case 'sunflower':
        return 'bg-[#FEF08A]/60 p-4 rounded-3xl border-4 border-dashed border-[#CA8A04] shadow-md relative group hover:-rotate-1 transition-transform';
      case 'scribble':
        return 'bg-[#FFFDF6] p-3 rounded-2xl doodle-border-sm shadow-md relative group hover:scale-[1.02] transition-transform';
      case 'notebook':
        return 'bg-amber-50/90 p-4 rounded-xl border-2 border-amber-300 shadow-md relative group hover:rotate-1 transition-transform';
      case 'tape':
      default:
        return 'bg-white p-3.5 pb-6 rounded-md shadow-md border border-amber-200 relative group hover:-rotate-1 transition-transform';
    }
  };

  return (
    <section id="gallery-section" className="py-12 md:py-20 px-4 max-w-6xl mx-auto">

      {/* Section Title & Description */}
      <div className="text-center mb-10">
        <div className="inline-block border-2 border-dashed border-amber-400 bg-[#FEF08A]/70 px-6 py-1.5 rounded-full mb-3">
          <span className="font-handwritten text-xl font-bold text-amber-900 flex items-center gap-2 justify-center">
            <span>📷</span> Photo Gallery
          </span>
        </div>

        <h2 className="font-cute text-3xl sm:text-5xl font-bold text-[#78350F]">
          Bhummmiieeeeeeeee's Photo Gallery
        </h2>

        <p className="font-handwritten text-xl sm:text-2xl text-[#92400E] max-w-xl mx-auto mt-2">
          This Was the only way to Share Your Cuteeeestttt Photos to you 
        </p>

        {/* Action Control: Add Photo */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#FDE047] hover:bg-[#FACC15] text-[#78350F] border-2 border-[#CA8A04] font-cute font-bold rounded-full shadow-sm hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-amber-900" />
            <span>Add Photo 📸</span>
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-16 px-4 bg-amber-50/60 rounded-3xl border-2 border-dashed border-amber-300">
          <p className="font-handwritten text-2xl text-amber-800">
            Tap "Add Our Memory Photo" 
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={getFrameClasses(photo.frameStyle)}
            >
              {/* Cute Top Tape Decoration */}
              {photo.frameStyle === 'polaroid' && (
                <div className="washi-tape-yellow absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-0.5 text-xs font-handwritten text-amber-900 z-10">
                  PINNED WITH LOVE
                </div>
              )}
              {photo.frameStyle === 'tape' && (
                <>
                  <div className="washi-tape-pink absolute -top-2 -left-2 px-4 py-0.5 text-[10px] z-10" />
                  <div className="washi-tape-yellow absolute -bottom-2 -right-2 px-4 py-0.5 text-[10px] z-10" />
                </>
              )}
              {photo.frameStyle === 'sunflower' && (
                <div className="absolute -top-3 -right-3 text-3xl z-10 animate-bounce">
                  
                </div>
              )}

              {/* Photo Image Container - sized to the image itself, no cropping */}
              <div
                className="overflow-hidden rounded-md border border-amber-200 cursor-pointer relative group bg-black/5 flex items-center justify-center"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[420px] object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-amber-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-cute font-bold text-sm gap-1">
                  <Sparkles className="w-4 h-4" /> Tap to view 
                </div>
              </div>

              {/* Sticker Stamp */}
              {photo.sticker && (
                <span className="absolute bottom-12 right-2 text-2xl drop-shadow-sm select-none">
                  {photo.sticker}
                </span>
              )}

              {/* Caption & Hearts */}
              <div className="mt-3 flex items-start justify-between gap-2 px-1">
                <div>
                  <p className="font-handwritten text-xl text-[#573902] leading-tight">
                    {photo.caption}
                  </p>
                  {photo.date && (
                    <span className="text-xs font-cute text-amber-700/80 block mt-0.5">
                      {photo.date}
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Expanded Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-amber-950/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDF6] p-6 sm:p-8 rounded-3xl max-w-2xl w-full border-4 border-amber-400 polaroid-shadow relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full border border-amber-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="washi-tape-yellow mx-auto mb-4 px-8 py-1 font-handwritten text-sm text-amber-900 inline-block">
                 Polaroid View 
              </div>

              <div className="rounded-2xl overflow-hidden border-2 border-amber-300 max-h-[65vh] flex items-center justify-center bg-black/5">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="mt-4 text-center">
                <p className="font-handwritten text-3xl text-amber-900">
                  "{selectedPhoto.caption}"
                </p>
                <p className="font-cute text-sm text-amber-700 mt-1">
                  {selectedPhoto.date || 'Forever Memory'} {selectedPhoto.sticker}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Photo Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-amber-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="bg-[#FFFDF6] p-6 sm:p-8 rounded-3xl max-w-lg w-full border-4 border-[#EAB308] polaroid-shadow relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-3xl">📸</span>
                <h3 className="font-cute text-2xl font-bold text-amber-900">
                  Add A New Photo
                </h3>
                <p className="font-handwritten text-lg text-amber-700">
                  Upload a photo from your phone/device
                </p>
              </div>

              <form onSubmit={handleCreatePhoto} className="space-y-4">

                {/* File Upload or URL */}
                <div>
                  <label className="block font-cute text-xs font-bold text-amber-900 mb-1">
                    Upload Photo From Device
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full p-3 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer text-amber-900 font-cute text-sm transition-colors">
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>Choose photo file...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {filePreview ? (
                  <div className="relative max-w-full mx-auto rounded-xl overflow-hidden border-2 border-amber-400 flex items-center justify-center bg-black/5">
                    <img src={filePreview} alt="Preview" className="max-h-48 w-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => setFilePreview(null)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}

                {/* Caption (optional) */}
                <div>
                  <label className="block font-cute text-xs font-bold text-amber-900 mb-1">
                     Caption
                  </label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-handwritten text-xl text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Doodle Frame Style */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-cute text-xs font-bold text-amber-900 mb-1">
                      Frame Border Style
                    </label>
                    <select
                      value={newFrameStyle}
                      onChange={(e) => setNewFrameStyle(e.target.value as PhotoItem['frameStyle'])}
                      className="w-full p-2 bg-white border border-amber-300 rounded-xl font-cute text-xs text-amber-900"
                    >
                      <option value="polaroid">Polaroid + Tape</option>
                      <option value="sunflower">Sunflower Wreath</option>
                      <option value="scribble">Doodle Scribble</option>
                      <option value="notebook">Lined Notebook</option>
                      <option value="tape">Corner Tapes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-cute text-xs font-bold text-amber-900 mb-1">
                      Cute Sticker
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#EAB308] hover:bg-[#CA8A04] text-white font-cute font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <Check className="w-5 h-5" />
                  <span>Pin Photo To Gallery!</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

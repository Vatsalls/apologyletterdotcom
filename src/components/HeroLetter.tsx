import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Sun } from 'lucide-react';

interface HeroLetterProps {
  letterText: string;
  heroImage?: string;
  envelopeImage?: string;
}

export const HeroLetter: React.FC<HeroLetterProps> = ({
  letterText,
  heroImage,
  envelopeImage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="letter-section" className="relative py-12 md:py-20 px-4 max-w-4xl mx-auto text-center">

      {/* Decorative Doodle Floating Sunflowers */}
      <div className="absolute top-4 left-4 sm:left-12 opacity-80 animate-float pointer-events-none select-none">
        <span className="text-4xl sm:text-5xl"></span>
      </div>
      <div className="absolute top-12 right-4 sm:right-12 opacity-80 animate-float [animation-delay:2s] pointer-events-none select-none">
        <span className="text-4xl sm:text-5xl">✨</span>
      </div>

      {/* Main Header */}
      <div className="inline-block mb-6 relative">
        <span className="washi-tape-yellow px-4 py-1 font-handwritten text-lg text-amber-900 inline-block mb-2">
          My Some Unsaid Words
        </span>
        <h2 className="font-cute text-3xl sm:text-5xl font-bold text-[#78350F] tracking-tight">
          Blisssssssss 🫶🏻 
        </h2>
        <p className="font-handwritten text-xl sm:text-2xl text-[#92400E] mt-2">
          Click the envelope below to unseal the Letter
        </p>
      </div>

      {/* Interactive Envelope Container */}
      <div className="mt-8 relative max-w-2xl mx-auto">

        {!isOpen ? (
          /* Envelope Sealed State */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-[#FEF08A] border-4 border-dashed border-[#CA8A04] rounded-2xl p-8 sm:p-12 polaroid-shadow relative overflow-hidden group transition-all"
          >
            {/* Top Washi Tape */}
            <div className="washi-tape-pink absolute -top-3 left-1/2 -translate-x-1/2 px-8 py-1.5 font-handwritten text-sm text-pink-900 font-bold shadow-sm">
              Tap To Open
            </div>

            {/* Envelope Artwork */}
            <div className="flex flex-col items-center justify-center my-4">
              {envelopeImage ? (
                <img
                  src={envelopeImage}
                  alt="Envelope with Sunflower Seal"
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 object-cover rounded-2xl border-2 border-amber-300 shadow-md group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-amber-200 border-4 border-amber-400 flex items-center justify-center text-6xl shadow-inner group-hover:rotate-12 transition-transform">
                
                </div>
              )}

              <div className="mt-6 flex items-center gap-2 bg-white/90 px-6 py-2.5 rounded-full border-2 border-amber-400 text-amber-900 font-cute font-bold shadow-sm group-hover:bg-amber-300 transition-colors">
                <Heart className="w-5 h-5 fill-amber-600 text-amber-600 animate-pulse" />
                <span>Open Letter</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
            </div>

            {/* Doodle Stamp Details */}
            <div className="absolute bottom-3 right-4 font-handwritten text-amber-800 text-sm border-2 border-amber-400 p-1.5 rounded rotate-3 bg-white/70">
              STAMP: With Love 🫶🏻 
            </div>
          </motion.div>
        ) : (
          /* Opened Letter Paper State */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#FFFDF6] border-4 border-[#EAB308] rounded-2xl p-6 sm:p-10 polaroid-shadow relative text-left"
            >
              {/* Paper Washi Tapes */}
              <div className="washi-tape-yellow absolute -top-4 left-6 px-6 py-1 font-handwritten text-xs text-amber-900">
                🫶🏻  
              </div>
              <div className="washi-tape-pink absolute -top-4 right-6 px-6 py-1 font-handwritten text-xs text-pink-900">
                🫶🏻  
              </div>


                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-cute text-amber-900 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 transition-colors"
                >
                  Fold Up 
                </button>

              {/* Letter Content */}
              <div className="whitespace-pre-wrap font-handwritten text-2xl sm:text-3xl text-[#573902] leading-relaxed tracking-wide">
                {letterText}
              </div>

             
              

            </motion.div>
          </AnimatePresence>
        )}

      </div>

    </section>
  );
};

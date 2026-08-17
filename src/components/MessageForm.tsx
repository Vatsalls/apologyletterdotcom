import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Heart, Sun } from 'lucide-react';

interface MessageFormProps {
  onSendMessage: (senderName: string, message: string, mood: string) => Promise<any>;
}

export const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage }) => {
  const [senderName, setSenderName] = useState('Your Sunflower ');
  const [message, setMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);

    try {
      await onSendMessage(senderName, message, selectedMood);
      setSentSuccess(true);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="message-section" className="py-12 md:py-20 px-4 max-w-3xl mx-auto">

      {/* Container Box with Sunflower Border */}
      <div className="bg-[#FFFDF6] border-4 border-[#CA8A04] rounded-3xl p-6 sm:p-10 polaroid-shadow relative overflow-hidden">

        {/* Top Decorative Tape */}
        <div className="washi-tape-yellow absolute -top-4 left-8 px-6 py-1 font-handwritten text-sm text-amber-900 font-bold">
          DIRECT NOTE  
        </div>

        {/* Section Header */}
        <div className="text-center my-4">
          <div className="w-16 h-16 rounded-full bg-[#FEF08A] border-2 border-[#CA8A04] mx-auto flex items-center justify-center text-3xl shadow-sm mb-3 animate-float">
            
          </div>
          <h2 className="font-cute text-3xl sm:text-4xl font-bold text-[#78350F]">
            Write A Note 
          </h2>
          <p className="font-handwritten text-xl sm:text-2xl text-[#92400E] mt-1">
            Write anything you want
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* Sender Name & Mood */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-cute text-sm font-bold text-amber-900 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
               
                className="w-full p-3 bg-white border-2 border-amber-300 rounded-xl font-handwritten text-xl text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block font-cute text-sm font-bold text-amber-900 mb-1">
                Mood
              </label>
              <div className="flex items-center gap-2 pt-1">
                {moods.map((m) => (
                  <button
                    key={m.emoji}
                    type="button"
                    onClick={() => setSelectedMood(m.emoji)}
                    className={`p-2 rounded-xl border-2 text-xl transition-all ${
                      selectedMood === m.emoji
                        ? 'bg-[#FEF08A] border-[#CA8A04] scale-110 shadow-xs'
                        : 'bg-white border-amber-200 opacity-70 hover:opacity-100'
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block font-cute text-sm font-bold text-amber-900 mb-1">
              Your Message 
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full p-4 bg-white border-2 border-amber-300 rounded-2xl font-handwritten text-2xl text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-4 bg-[#EAB308] hover:bg-[#CA8A04] text-white font-cute font-bold text-lg rounded-2xl shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Sun className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>

        </form>

      </div>

      {/* Success Modal Confirmation */}
      <AnimatePresence>
        {sentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-amber-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85 }}
              className="bg-[#FFFDF6] p-8 rounded-3xl max-w-md w-full border-4 border-[#EAB308] polaroid-shadow text-center relative"
            >
             

              <h3 className="font-cute text-3xl font-bold text-amber-900">
                Message Sent! 
              </h3>

              <button
                onClick={() => setSentSuccess(false)}
                className="mt-6 px-6 py-2.5 bg-[#EAB308] hover:bg-[#CA8A04] text-white font-cute font-bold rounded-xl shadow-sm transition-colors"
              >
                Yay! Return To Page 
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

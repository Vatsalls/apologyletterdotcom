import React, { useState } from 'react';
import { Heart, Image as ImageIcon, Mail } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
}

const SECRET_CLICKS_REQUIRED = 22;

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleSunflowerClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= SECRET_CLICKS_REQUIRED) {
      setClickCount(0);
      onOpenSettings();
    } else {
      setClickCount(nextCount);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF6]/90 backdrop-blur-md border-b-2 border-dashed border-[#FDE047] px-4 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Brand Logo with Sunflower Doodle */}
        <div
          className="flex items-center gap-2 select-none cursor-pointer"
          onClick={handleSunflowerClick}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#FEF08A] border-2 border-[#CA8A04] shadow-sm">
            <span className="text-2xl animate-spin-slow">🌻</span>
          </div>
          <div>
            <h1 className="font-cute text-xl font-bold text-[#854D0E] tracking-tight flex items-center gap-1">
              To Bhumieeeeeee <Heart className="w-4 h-4 fill-amber-500 text-amber-500 inline animate-bounce" />
            </h1>
            <p className="font-handwritten text-xs text-[#A16207]">LOML</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => scrollTo('letter-section')}
            className="px-3 py-1.5 rounded-full font-cute text-sm font-medium text-[#78350F] hover:bg-[#FEF08A]/70 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Letter</span>
          </button>

          <button
            onClick={() => scrollTo('gallery-section')}
            className="px-3 py-1.5 rounded-full font-cute text-sm font-medium text-[#78350F] hover:bg-[#FEF08A]/70 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => scrollTo('message-section')}
            className="px-3 py-1.5 rounded-full bg-[#FDE047] hover:bg-[#FACC15] text-[#78350F] border-2 border-[#CA8A04] font-cute text-sm font-bold shadow-sm hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-amber-700 text-amber-700" />
            <span>Send Msg</span>
          </button>
        </nav>

      </div>
    </header>
  );
};

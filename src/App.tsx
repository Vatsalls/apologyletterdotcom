import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroLetter } from './components/HeroLetter';
import { GallerySection } from './components/GallerySection';
import { MessageForm } from './components/MessageForm';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';

import { PhotoItem, AdminData } from './types';
import { DEFAULT_LETTER } from './data/initialData';

import heroImg from './assets/images/sunflower_doodle_hero_1785576747436.jpg';
import envelopeImg from './assets/images/sunflower_envelope_seal_1785576762412.jpg';

export default function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [letterText, setLetterText] = useState<string>(DEFAULT_LETTER);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load photos + track visit on initial load
  useEffect(() => {
    fetchPhotos();
    fetch('/api/visit', { method: 'POST' })
      .then((res) => res.json())
      .then(() => fetchAdminData())
      .catch((err) => console.log('Visit logged locally:', err));
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
        if (data.customLetter) {
          setLetterText(data.customLetter);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleUpdateLetter = async (newText: string) => {
    setLetterText(newText);
    try {
      await fetch('/api/admin/update-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letter: newText }),
      });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to sync letter to server:', err);
    }
  };

  const handleAddPhoto = async (newPhoto: Omit<PhotoItem, 'id' | 'likes'>) => {
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto),
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) => [data.photo, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add photo:', err);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const handleLikePhoto = (id: string) => {
    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );
  };

  const handleSendMessage = async (
    senderName: string,
    message: string,
    mood: string
  ) => {
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderName, message, mood }),
    });

    const data = await res.json();
    fetchAdminData();
    return data;
  };

  const handleOpenSettings = () => {
    fetchAdminData();
    setIsSettingsOpen(true);
  };

  return (
    <div className="min-h-screen paper-bg font-body text-[#4A3E3D] relative overflow-x-hidden">

      {/* Sticky Header Navigation */}
      <Navbar onOpenSettings={handleOpenSettings} />

      <main className="space-y-6">
        {/* Landing Hero & Interactive Letter */}
        <HeroLetter
          letterText={letterText}
          heroImage={heroImg}
          envelopeImage={envelopeImg}
        />

        {/* Gallery Section with Cute Doodle Borders */}
        <GallerySection
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onLikePhoto={handleLikePhoto}
        />

        {/* Message Form */}
        <MessageForm onSendMessage={handleSendMessage} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Hidden Settings Panel - opened via 22 clicks on the sunflower logo */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        adminData={adminData}
        photos={photos}
        onDeletePhoto={handleDeletePhoto}
        onUpdateLetter={handleUpdateLetter}
      />

    </div>
  );
}

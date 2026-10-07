'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AIChatModal from './AIChatModal';

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // State សម្រាប់ទីតាំងអណ្តែតចល័ត (Draggable Position)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);
  const dragStartPos = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const hasMoved = useRef(false);

  // កំណត់ទីតាំងលំនាំដើមពេលទើបបើកដំបូង (ឱ្យនៅខាងស្តាំ ពីលើបាតក្រោម)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = window.innerWidth - 150; // កៀកគែមស្តាំ
      const defaultY = window.innerHeight - 130; // លើ Bottom Nav
      setPosition({ x: Math.max(10, defaultX), y: Math.max(80, defaultY) });
    }
  }, []);

  // ដំណើរការពេលចាប់ផ្តើមអូស (Touch លើទូរស័ព្ទ ឬ Mouse លើកុំព្យូទ័រ)
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    hasMoved.current = false;
    dragStartPos.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  // ដំណើរការពេលកំពុងអូសផ្លាស់ទី
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartPos.current.startX;
    const deltaY = clientY - dragStartPos.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMoved.current = true;
    }

    const newX = dragStartPos.current.initialX + deltaX;
    const newY = dragStartPos.current.initialY + deltaY;

    // ទប់កុំឱ្យអូសហួសគែមអេក្រង់
    const maxX = typeof window !== 'undefined' ? window.innerWidth - 140 : 300;
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 70 : 600;

    setPosition({
      x: Math.min(Math.max(10, newX), maxX),
      y: Math.min(Math.max(60, newY), maxY),
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    // បើគ្រាន់តែចុច Tap មិនមែនអូសទេ ទើបបើកផ្ទាំង Chat
    if (!hasMoved.current) {
      setIsChatOpen(true);
    }
  };

  return (
    <>
      <div className="flex-1 pb-16 sm:pb-0">{children}</div>

      {/* ប៊ូតុងអណ្តែតដែលអាចយកដៃចុចអូសចល័តបានតាមចិត្ត */}
      <button
        ref={dragRef}
        onClick={handleClick}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: 'none',
        }}
        className={`fixed z-50 flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-full shadow-2xl border-2 border-white/50 backdrop-blur-sm select-none cursor-grab active:cursor-grabbing font-bold text-xs sm:text-sm transition-shadow ${
          isDragging ? 'scale-105 shadow-emerald-950/40 ring-2 ring-emerald-300' : ''
        }`}
        title="ចុចដើម្បីឆាត ឬអូសផ្លាស់ប្តូរទីតាំង"
      >
        <span className="text-base sm:text-xl animate-bounce pointer-events-none">🤖</span>
        <span className="pointer-events-none">ដើមកសិកម្ម AI</span>
      </button>

      {/* Bottom Navigation Bar លើទូរស័ព្ទដៃ */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around items-center py-2 z-40 shadow-lg">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 active:scale-95 transition"
        >
          <span className="text-lg">🏠</span>
          <span>ទំព័រដើម</span>
        </Link>

        <Link
          href="/sell"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 active:scale-95 transition"
        >
          <span className="text-lg">➕</span>
          <span>ដាក់លក់</span>
        </Link>

        <Link
          href="/my-products"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 active:scale-95 transition"
        >
          <span className="text-lg">📦</span>
          <span>ទំនិញខ្ញុំ</span>
        </Link>

        {/* ភ្ជាប់ទៅកាន់ Daem Vet AI Streamlit App */}
        <a
          href="https://daem-vet-ai.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-emerald-700 active:scale-95 transition cursor-pointer"
        >
          <span className="text-lg">🤖</span>
          <span>AI ពេទ្យសត្វ</span>
        </a>
      </nav>

      {/* ផ្ទាំង Popup AI Gemini Chat */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AIChatModal from './AIChatModal';

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="flex-1 pb-16 sm:pb-0">{children}</div>

      {/* ប៊ូតុងអណ្តែត AI បង្ហាញទាំងលើទូរស័ព្ទដៃ និងកុំព្យូទ័រ */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-emerald-900/30 transition-all transform hover:-translate-y-1 font-bold text-xs sm:text-sm border-2 border-white/40 backdrop-blur-sm cursor-pointer"
        title="ជជែកជាមួយ ដើមកសិកម្ម AI"
      >
        <span className="text-base sm:text-xl animate-bounce">🤖</span>
        <span>ដើមកសិកម្ម AI</span>
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

        {/* ចុចលើនេះក៏បើក Chatbot Gemini បានដូចគ្នា */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-emerald-700 active:scale-95 transition cursor-pointer"
        >
          <span className="text-lg">🤖</span>
          <span>AI ពេទ្យសត្វ</span>
        </button>
      </nav>

      {/* ផ្ទាំង Popup AI Gemini Chat */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function PchumBenBanner() {
  const [showBanner, setShowBanner] = useState(true);

  // ពិនិត្យមើលថាតើអ្នកប្រើប្រាស់ធ្លាប់ចុចបិទឬនៅ (បើបិទហើយ មិនរំខានទៀតទេក្នុងថ្ងៃនេះ)
  useEffect(() => {
    const isClosed = sessionStorage.getItem('hide_pchum_ben_banner');
    if (isClosed === 'true') {
      setShowBanner(false);
    }
  }, []);

  const handleClose = () => {
    setShowBanner(false);
    sessionStorage.setItem('hide_pchum_ben_banner', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white px-4 py-2 sm:py-2.5 shadow-md border-b border-amber-400/40 text-center animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold tracking-wide">
        <span className="text-base sm:text-lg animate-bounce">🪷</span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={15} className="text-amber-200 hidden sm:inline" />
          <span>រីករាយពិធីបុណ្យភ្ជុំបិណ្ឌ ប្រពៃណីជាតិខ្មែរ! សូមបួងសួងឱ្យលោកអ្នក និងក្រុមគ្រួសារ ជួបតែសេចក្តីសុខ ចម្រុងចម្រើន និងលាភសំណាងល្អ។</span>
        </span>
        <span className="text-base sm:text-lg animate-bounce">🪷</span>
      </div>

      {/* ប៊ូតុងបិទ Banner */}
      <button
        onClick={handleClose}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/80 hover:text-white hover:bg-black/10 transition cursor-pointer"
        title="បិទផ្ទាំងជូនពរ"
      >
        <X size={16} />
      </button>
    </div>
  );
}
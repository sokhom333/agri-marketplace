'use client';

import React, { useState } from 'react';
import { Phone, Send, X } from 'lucide-react';

export default function ProductContactActions({ sellerPhone }: { sellerPhone: string }) {
  const [showCallPicker, setShowCallPicker] = useState(false);

  // បំបែកលេខទូរស័ព្ទតាមសញ្ញា / ឬក្បៀស (,)
  const phoneList = sellerPhone
    ? sellerPhone.split(/[/,]/).map((p) => p.trim()).filter(Boolean)
    : [];

  const primaryPhone = phoneList[0] || '';
  const telegramNumber = primaryPhone.replace(/^0/, '').replace(/\s+/g, '');

  const handleCallClick = () => {
    if (phoneList.length <= 1) {
      window.location.href = `tel:${primaryPhone.replace(/\s+/g, '')}`;
    } else {
      setShowCallPicker(true);
    }
  };

  return (
    <>
      {/* ប៊ូតុងទាំងពីររាបស្មើគ្នា គ្មានពាក្យវែងធ្លាក់ជួរ */}
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        <button
          type="button"
          onClick={handleCallClick}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
        >
          <Phone size={12} />
          <span>ខល</span>
        </button>

        <a
          href={`https://t.me/+855${telegramNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition"
        >
          <Send size={12} />
          <span>Telegram</span>
        </a>
      </div>

      {/* ផ្ទាំង Popup រើសខ្សែទូរស័ព្ទ */}
      {showCallPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Phone size={15} className="text-blue-600" />
                <span>ជ្រើសរើសខ្សែសម្រាប់ខល</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCallPicker(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {phoneList.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 transition group"
                >
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-medium block leading-tight">
                      ខ្សែទី {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                      {phone}
                    </span>
                  </div>
                  <span className="bg-emerald-600 text-white p-1.5 rounded-lg text-xs shadow-xs">
                    <Phone size={13} />
                  </span>
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowCallPicker(false)}
              className="w-full py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              បិទវិញ
            </button>
          </div>
        </div>
      )}
    </>
  );
}
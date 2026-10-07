import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AIPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1.5 hover:bg-emerald-800 rounded-lg transition">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-base font-bold">ដើមកសិកម្ម AI - ជំនួយការពេទ្យសត្វ និងដំណាំ</h1>
          </div>
          <a
            href="https://daem-vet-ai.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-600"
          >
            បើកផ្ទាំងពេញ ↗
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-2 sm:p-4">
        <iframe
          src="https://daem-vet-ai.streamlit.app/?embedded=true"
          className="w-full h-[85vh] rounded-2xl border border-slate-200 shadow-sm bg-white"
          title="Daem Kasikorm AI"
        />
      </main>
    </div>
  );
}
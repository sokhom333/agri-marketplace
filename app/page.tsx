'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, PlusCircle, PhoneCall, Send, MapPin, Shield, QrCode, X, Copy, Check, PackageCheck } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ទាំងអស់');

  // State សម្រាប់គ្រប់គ្រងផ្ទាំង KHQR Modal
  const [selectedProductForQR, setSelectedProductForQR] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (prodData) setProducts(prodData);
    }
    loadData();
  }, []);

  const formatTelegramLink = (phone: string) => {
    if (!phone) return '#';
    const formattedPhone = phone.startsWith('0') ? '855' + phone.slice(1) : phone;
    return `https://t.me/+${formattedPhone}`;
  };

  // មុខងារច្រោះទិន្នន័យ (Search & Category Matching)
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ទាំងអស់' ||
      p.category === selectedCategory ||
      (p.category && selectedCategory.includes(p.category)) ||
      (p.category && p.category.includes(selectedCategory));

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 sm:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img 
              src="/logo.png" 
              alt="Logo ផ្សារដើមកសិកម្ម" 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm border border-emerald-400/50 bg-white"
            />
            <div>
              <h1 className="text-base sm:text-xl font-bold leading-tight">ផ្សារដើមកសិកម្ម</h1>
              <p className="text-[10px] sm:text-[11px] text-emerald-100 hidden xs:block">ផ្គត់ផ្គង់ថ្នាំសត្វ ចំណីសត្វ និងកសិផលធម្មជាតិ</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/admin"
              className="text-xs text-emerald-100 hover:text-white p-1.5 sm:p-2 flex items-center gap-1 transition"
              title="Admin Panel"
            >
              <Shield size={16} />
              <span className="hidden md:inline">Admin</span>
            </Link>

            <Link
              href="/my-products"
              className="text-xs text-emerald-100 hover:text-white px-2 py-1.5 rounded-lg border border-emerald-600/60 hover:border-emerald-400 hover:bg-emerald-800/40 transition flex items-center gap-1"
            >
              <PackageCheck size={14} />
              <span className="hidden sm:inline">ទំនិញខ្ញុំ</span>
            </Link>

            <Link
              href="/sell"
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-white border border-emerald-600 transition shadow-sm"
            >
              <PlusCircle size={14} />
              <span>ដាក់លក់</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-2.5 sm:pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះកសិផល អ្នកលក់ ឬខេត្ត..."
              className="w-full bg-white text-slate-800 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm outline-none shadow-inner placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <span className="bg-amber-400 text-emerald-950 font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              កសិកម្មឌីជីថល
            </span>
            <h2 className="text-lg sm:text-2xl font-bold mt-1.5 sm:mt-2">
              ទិញ-លក់ ផលិតផលកសិកម្ម
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              ផ្សារដើមកសិកម្ម ផ្គត់ផ្គង់ចំណី ថ្នាំសត្វស្តង់ដា និងបើកឱកាសឱ្យកសិករដាក់លក់ទិន្នផលផ្ទាល់ជូនអ្នកទិញ។
            </p>
          </div>
        </div>

        {/* Categories */}
        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-2.5 flex items-center gap-2">
            <span>📂</span> ប្រភេទផលិតផល
          </h2>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            <div
              onClick={() => setSelectedCategory('ទាំងអស់')}
              className={`p-2 sm:p-3 rounded-xl border transition cursor-pointer flex-shrink-0 flex items-center gap-2 min-w-[110px] sm:min-w-[130px] ${
                selectedCategory === 'ទាំងអស់'
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-emerald-500'
              }`}
            >
              <div className="text-lg sm:text-2xl p-1 bg-slate-100 rounded-lg">🌐</div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800">ទាំងអស់</h3>
            </div>

            {categories.map((c: any) => (
              <div
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`p-2 sm:p-3 rounded-xl border transition cursor-pointer flex-shrink-0 flex items-center gap-2 min-w-[125px] sm:min-w-[150px] ${
                  selectedCategory === c.name
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-emerald-500'
                }`}
              >
                <div className="text-lg sm:text-2xl p-1 bg-slate-100 rounded-lg">{c.icon || '📦'}</div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{c.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid (២ ជួរលើទូរស័ព្ទ, ៣ ជួរលើ Tablet, ៤ ជួរលើកុំព្យូទ័រ) */}
        <section>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span>🔥</span> {selectedCategory === 'ទាំងអស់' ? 'ផលិតផលពេញនិយម' : `ទំនិញប្រភេទ "${selectedCategory}"`}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p: any) => {
                const priceInRiel = (p.price * 4000).toLocaleString('en-US');

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full"
                  >
                    {/* រូបភាពផលិតផល */}
                    <Link href={`/products/${p.id}`} className="relative w-full aspect-square bg-slate-100 shrink-0 block cursor-pointer group">
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                    </Link>

                    {/* ព័ត៌មាន និងប៊ូតុង */}
                    <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                      <div>
                        <Link href={`/products/${p.id}`}>
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug hover:text-emerald-700 transition cursor-pointer">
                            {p.title}
                          </h3>
                        </Link>
                        <div className="flex flex-col gap-0.5 mt-1 text-[10px] sm:text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 truncate">
                            <ShieldCheck size={11} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{p.seller_name}</span>
                          </span>
                          {p.location && (
                            <span className="flex items-center gap-1 text-slate-500 font-medium truncate">
                              <MapPin size={11} className="text-rose-500 shrink-0" />
                              <span className="truncate">{p.location}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400">តម្លៃ</span>
                            <p className="text-xs sm:text-base font-extrabold text-emerald-700 leading-tight">
                              {priceInRiel} ៛
                              <span className="text-[9px] sm:text-[10px] font-normal text-slate-400">/{p.unit}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedProductForQR(p)}
                            className="p-1 sm:p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold"
                            title="ស្កេនទូទាត់ KHQR"
                          >
                            <QrCode size={12} />
                            <span>KHQR</span>
                          </button>
                        </div>

                        <div className="flex gap-1.5 sm:gap-2">
                          <a
                            href={`tel:${p.seller_phone}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-[11px] font-bold py-1.5 sm:py-2 rounded-xl transition shadow-sm flex items-center justify-center gap-1"
                          >
                            <PhoneCall size={12} />
                            <span>ខល</span>
                          </a>
                          <a
                            href={formatTelegramLink(p.seller_phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-[10px] sm:text-[11px] font-bold py-1.5 sm:py-2 rounded-xl transition shadow-sm flex items-center justify-center gap-1"
                          >
                            <Send size={12} />
                            <span>Telegram</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center py-12 text-slate-400 text-xs sm:text-sm bg-white rounded-2xl border border-dashed border-slate-200">
                🔍 រកមិនឃើញផលិតផលនេះទេ!
              </p>
            )}
          </div>
        </section>
      </main>

      {/* ផ្ទាំង Popup ស្កេនបង់ប្រាក់ KHQR */}
      {selectedProductForQR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 relative shadow-2xl text-center">
            <button
              onClick={() => setSelectedProductForQR(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
            >
              <X size={18} />
            </button>

            <div className="inline-block bg-rose-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-2.5">
              Bakong KHQR
            </div>

            <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">{selectedProductForQR.title}</h3>
            <p className="text-emerald-700 font-extrabold text-lg sm:text-xl mt-0.5">
              {(selectedProductForQR.price * 4000).toLocaleString('en-US')} ៛
            </p>

            <div className="mt-3 p-3 bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl inline-block">
              <img
                src={
                  selectedProductForQR.qr_code_url ||
                  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=KHQR_PAYMENT_FOR_${selectedProductForQR.id}`
                }
                alt="KHQR"
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl mx-auto bg-white p-2 object-contain"
              />
              <span className="text-[9px] text-slate-500 block mt-1.5 font-medium">ស្កេនទូទាត់តាមកម្មវិធីធនាគារណាក៏បាន</span>
            </div>

            <div className="mt-3 bg-slate-50 p-2.5 rounded-xl text-left text-[11px] sm:text-xs space-y-1 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">អ្នកទទួលប្រាក់៖</span>
                <span className="font-semibold text-slate-700">{selectedProductForQR.seller_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">លេខទូរស័ព្ទ៖</span>
                <div className="flex items-center gap-1 font-semibold text-slate-700">
                  <span>{selectedProductForQR.seller_phone}</span>
                  <button
                    onClick={() => handleCopyPhone(selectedProductForQR.seller_phone)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 transition"
                  >
                    {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 mt-3">
              * បន្ទាប់ពីស្កេនរួច សូមផ្ញើ Slip ទៅ Telegram អ្នកលក់ដើម្បីបញ្ជាក់។
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
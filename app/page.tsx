'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, PlusCircle, MapPin, Shield, QrCode, X, Copy, Check, PackageCheck } from 'lucide-react';
import { supabase } from './lib/supabase';
import ProductContactActions from './components/ProductContactActions';

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
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-20 sm:pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo ផ្សារដើមកសិកម្ម" 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm border border-emerald-400/50 bg-white"
            />
            <div>
              <h1 className="text-base sm:text-xl font-bold leading-tight">ផ្សារដើមកសិកម្ម</h1>
              <p className="text-[10px] sm:text-xs text-emerald-100 hidden sm:block">ផ្គត់ផ្គង់ថ្នាំសត្វ ចំណីសត្វ និងកសិផលធម្មជាតិ</p>
            </div>
          </div>

          {/* Search Bar នៅលើ Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះកសិផល អ្នកលក់ ឬខេត្ត..."
              className="w-full bg-white text-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs outline-none shadow-inner placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs text-emerald-100 hover:text-white p-2 flex items-center gap-1 transition"
              title="Admin Panel"
            >
              <Shield size={16} />
              <span className="hidden lg:inline">Admin</span>
            </Link>

            <Link
              href="/my-products"
              className="text-xs text-emerald-100 hover:text-white px-3 py-1.5 rounded-lg border border-emerald-600/60 hover:border-emerald-400 hover:bg-emerald-800/40 transition flex items-center gap-1"
            >
              <PackageCheck size={14} />
              <span className="hidden sm:inline">ទំនិញខ្ញុំ</span>
            </Link>

            <Link
              href="/sell"
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded-lg text-xs font-semibold text-white border border-emerald-600 transition shadow-sm"
            >
              <PlusCircle size={15} />
              <span>ដាក់លក់</span>
            </Link>
          </div>
        </div>

        {/* Search Bar នៅលើទូរស័ព្ទដៃ */}
        <div className="md:hidden max-w-7xl mx-auto px-4 pb-2.5">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះកសិផល អ្នកលក់ ឬខេត្ត..."
              className="w-full bg-white text-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs outline-none shadow-inner placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Categories */}
        <section>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            <div
              onClick={() => setSelectedCategory('ទាំងអស់')}
              className={`px-3 py-2 rounded-xl border transition cursor-pointer flex-shrink-0 flex items-center gap-2 ${
                selectedCategory === 'ទាំងអស់'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-emerald-500'
              }`}
            >
              <span className="text-base">🌐</span>
              <span className="text-xs sm:text-sm font-semibold">ទាំងអស់</span>
            </div>

            {categories.map((c: any) => (
              <div
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3 py-2 rounded-xl border transition cursor-pointer flex-shrink-0 flex items-center gap-2 ${
                  selectedCategory === c.name
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:border-emerald-500'
                }`}
              >
                <span className="text-base">{c.icon || '📦'}</span>
                <span className="text-xs sm:text-sm font-semibold">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="text-rose-500">🔥</span> {selectedCategory === 'ទាំងអស់' ? 'ផលិតផលពេញនិយម' : `ទំនិញប្រភេទ "${selectedCategory}"`}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p: any) => {
                const priceInRiel = (p.price * 4000).toLocaleString('en-US');

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
                  >
                    {/* រូបភាពកាត់សមាមាត្រការ៉េស្មើ */}
                    <Link href={`/products/${p.id}`} className="relative w-full aspect-square bg-slate-100 shrink-0 block overflow-hidden">
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-emerald-700/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {p.category}
                      </span>
                    </Link>

                    {/* ព័ត៌មានផលិតផល */}
                    <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
                      <div>
                        <Link href={`/products/${p.id}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition" title={p.title}>
                            {p.title}
                          </h3>
                        </Link>
                        <div className="flex flex-col gap-0.5 mt-1 text-[10px] sm:text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 truncate">
                            <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{p.seller_name}</span>
                          </span>
                          {p.location && (
                            <span className="flex items-center gap-1 text-slate-500 font-medium truncate">
                              <MapPin size={12} className="text-rose-500 shrink-0" />
                              <span className="truncate">{p.location}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* តម្លៃ និងប៊ូតុងទំនាក់ទំនង */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-400">តម្លៃ</span>
                            <p className="text-xs sm:text-sm font-black text-emerald-700 leading-tight">
                              {priceInRiel} ៛
                              <span className="text-[9px] font-normal text-slate-400">/{p.unit}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedProductForQR(p)}
                            className="px-2 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                            title="ស្កេនទូទាត់ KHQR"
                          >
                            <QrCode size={13} />
                            <span>KHQR</span>
                          </button>
                        </div>

                        {/* ប៊ូតុង ខល (រើសខ្សែ) និង Telegram */}
                        <ProductContactActions sellerPhone={p.seller_phone} />
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
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
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
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 transition cursor-pointer"
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
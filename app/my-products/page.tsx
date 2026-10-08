'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Phone, Search, Package, AlertCircle, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function MyProductsPage() {
  const [phoneInput, setPhoneInput] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // មុខងារស្វែងរកទំនិញតាមលេខទូរស័ព្ទអ្នកលក់
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_phone', phoneInput.trim())
      .order('created_at', { ascending: false });

    if (data) setProducts(data);
    if (error) console.error(error);
    setLoading(false);
  };

  // មុខងារលុបទំនិញផ្ទាល់ខ្លួន
  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = confirm(`តើអ្នកពិតជាចង់លុបទំនិញ "${title}" នេះចោលមែនទេ?`);
    if (!confirmDelete) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('មិនអាចលុបទំនិញបានទេ៖ ' + error.message);
    } else {
      alert('បានលុបទំនិញដោយជោគជ័យ!');
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 hover:bg-emerald-800 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-base font-bold">គ្រប់គ្រងទំនិញរបស់ខ្ញុំ</h1>
            <p className="text-[11px] text-emerald-100">ស្វែងរក កែសម្រួល និងលុបទំនិញដែលអ្នកបានបង្ហោះ</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        {/* ប្រអប់ស្វែងរកលេខទូរស័ព្ទ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              បញ្ចូលលេខទូរស័ព្ទដែលអ្នកធ្លាប់ដាក់លក់ *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  required
                  placeholder="ឧ. 012 345 678"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-slate-50 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600"
                />
                <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Search size={15} />
                <span>{loading ? 'កំពុងស្វែងរក...' : 'ស្វែងរក'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              * ប្រព័ន្ធនឹងបង្ហាញតែទំនិញដែលត្រូវគ្នានឹងលេខទូរស័ព្ទនេះប៉ុណ្ណោះ។
            </p>
          </form>
        </div>

        {/* បញ្ជីទំនិញដែលបានរកឃើញ */}
        {searched && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Package size={16} className="text-emerald-600" />
              <span>ទំនិញរបស់អ្នក ({products.length})</span>
            </h2>

            {loading ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                កំពុងទាញយកទិន្នន័យ...
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                <AlertCircle className="mx-auto text-amber-500" size={28} />
                <p className="text-xs text-slate-500 font-medium">
                  មិនមានទំនិញណាមួយដែលបានបង្ហោះក្រោមលេខទូរស័ព្ទនេះទេ!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {products.map((p) => {
                  const priceInRiel = (p.price * 4000).toLocaleString('en-US');
                  return (
                    <div
                      key={p.id}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500'}
                          alt={p.title}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                            {p.title}
                          </h3>
                          <p className="text-emerald-700 font-bold text-xs mt-0.5">
                            {priceInRiel} ៛ <span className="text-[10px] text-slate-400 font-normal">/{p.unit}</span>
                          </p>
                          <span className="inline-block text-[10px] text-slate-400 mt-0.5">
                            ប្រភេទ៖ {p.category}
                          </span>
                        </div>
                      </div>

                      {/* ប៊ូតុង កែប្រែ និង លុប */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/my-products/edit/${p.id}`}
                          className="px-2.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 transition flex items-center gap-1 text-xs font-semibold"
                          title="កែសម្រួលទំនិញនេះ"
                        >
                          <Pencil size={14} />
                          <span className="hidden sm:inline">កែប្រែ</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition flex items-center gap-1 text-xs font-semibold"
                          title="លុបទំនិញនេះ"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">លុប</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
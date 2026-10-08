'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, QrCode } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

function EditProductForm() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('គីឡូក្រាម');
  const [location, setLocation] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    async function fetchData() {
      // ទាញយកប្រភេទផលិតផល
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // ទាញយកព័ត៌មានផលិតផលបច្ចុប្បន្ន
      if (productId) {
        const { data: p } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (p) {
          setTitle(p.title || '');
          setCategory(p.category || '');
          setPrice(p.price ? p.price.toString() : '');
          setUnit(p.unit || 'គីឡូក្រាម');
          setLocation(p.location || '');
          setSellerName(p.seller_name || '');
          setSellerPhone(p.seller_phone || '');
          setImageUrl(p.image_url || '');
          setQrCodeUrl(p.qr_code_url || '');
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [productId]);

  // Upload រូបភាពទៅ Supabase Storage
  const handleFileUpload = async (file: File, bucketName: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      alert(`Upload បរាជ័យ៖ ${uploadError.message}`);
      return null;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !sellerPhone) {
      alert('សូមបំពេញព័ត៌មានសំខាន់ៗឱ្យបានគ្រប់គ្រាន់!');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title,
          category,
          price: parseFloat(price),
          unit,
          location,
          seller_name: sellerName,
          seller_phone: sellerPhone,
          image_url: imageUrl,
          qr_code_url: qrCodeUrl,
        })
        .eq('id', productId);

      if (error) throw error;

      alert('កែប្រែព័ត៌មានផលិតផលបានជោគជ័យ!');
      router.push('/my-products');
    } catch (err: any) {
      alert(`មានបញ្ហាក្នុងការកែប្រែ៖ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs sm:text-sm">
        កំពុងទាញយកព័ត៌មានផលិតផល...
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
      {/* ឈ្មោះទំនិញ */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះផលិតផល / ទំនិញ *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
        />
      </div>

      {/* ប្រភេទផលិតផល */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ប្រភេទកសិផល</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* ទីតាំង / ខេត្ត */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ទីតាំង (ខេត្ត/ក្រុង)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ឧ. សៀមរាប, បាត់ដំបង..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* តម្លៃ និង ខ្នាត */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">តម្លៃ ($ ឬ ដុល្លារ) *</label>
          <input
            type="number"
            step="any"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            ≈ {price ? (parseFloat(price) * 4000).toLocaleString('en-US') : 0} ៛
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">គិតជា (ខ្នាត) *</label>
          <input
            type="text"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="ឧ. គីឡូក្រាម, បាវ, ដប..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* ឈ្មោះអ្នកលក់ និងលេខទូរស័ព្ទ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះកសិដ្ឋាន / អ្នកលក់</label>
          <input
            type="text"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">លេខទូរស័ព្ទ (Telegram) *</label>
          <input
            type="text"
            required
            value={sellerPhone}
            onChange={(e) => setSellerPhone(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* កែប្រែរូបភាពផលិតផល */}
      <div className="pt-2">
        <label className="block text-xs font-bold text-slate-700 mb-1.5">រូបភាពផលិតផល</label>
        <div className="flex items-center gap-3">
          {imageUrl && (
            <img src={imageUrl} alt="Product" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
          )}
          <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-slate-50 transition text-xs font-medium text-slate-600">
            <Upload size={16} />
            <span>ជ្រើសរើសរូបភាពថ្មីដើម្បីប្តូរ</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const url = await handleFileUpload(e.target.files[0], 'product-images');
                  if (url) setImageUrl(url);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* កែប្រែរូបភាព KHQR Code */}
      <div className="pt-2">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <QrCode size={14} className="text-rose-600" />
          <span>រូបភាព QR កូដទូទាត់ (KHQR)</span>
        </label>
        <div className="flex items-center gap-3">
          {qrCodeUrl && (
            <img src={qrCodeUrl} alt="KHQR" className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-slate-200" />
          )}
          <label className="flex-1 border-2 border-dashed border-rose-200 hover:border-rose-500 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-rose-50/40 transition text-xs font-medium text-slate-600">
            <Upload size={16} className="text-rose-600" />
            <span>ជ្រើសរើសរូបភាព KHQR ថ្មី</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const url = await handleFileUpload(e.target.files[0], 'qr-codes');
                  if (url) setQrCodeUrl(url);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* ប៊ូតុង Save */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
        >
          <Save size={16} />
          <span>{saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការកែប្រែ'}</span>
        </button>
      </div>
    </form>
  );
}

export default function EditProductPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 sm:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-emerald-700 text-white px-4 py-3 shadow-md flex items-center gap-3">
        <Link href="/my-products" className="p-1 hover:bg-emerald-800 rounded-lg transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-base sm:text-lg font-bold">កែសម្រួលព័ត៌មានទំនិញ</h1>
      </header>

      {/* Main Form wrapped in Suspense */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Suspense fallback={<div className="py-20 text-center text-slate-400 text-xs">កំពុងដំណើរការ...</div>}>
          <EditProductForm />
        </Suspense>
      </main>
    </div>
  );
}
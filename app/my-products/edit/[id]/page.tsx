'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, QrCode } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

// ប្រភេទដូចគ្នានឹងទំព័រ Sell និង Admin បេះបិទ
const CATEGORIES = [
  'ថ្នាំសត្វ & វ៉ាក់សាំង',
  'ចំណីសត្វ',
  'ពូជសត្វ & ពូជដំណាំ',
  'កសិផលស្រស់',
  'សម្ភារៈកសិកម្ម', // ថែមថ្មីនៅទីនេះ
];

const PROVINCES = [
  'ភ្នំពេញ', 'កណ្ដាល', 'តាកែវ', 'កំពង់ស្ពឺ', 'កំពង់ឆ្នាំង', 'ពោធិ៍សាត់', 'បាត់ដំបង', 'បន្ទាយមានជ័យ', 'ប៉ៃលិន', 'ឧត្តរមានជ័យ', 'សៀមរាប', 'ព្រះវិហារ', 'កំពង់ធំ', 'កំពង់ចាម', 'ត្បូងឃ្មុំ', 'ព្រៃវែង', 'ស្វាយរៀង', 'ក្រចេះ', 'ស្ទឹងត្រែង', 'រតនគិរី', 'មណ្ឌលគិរី', 'កំពត', 'កែប', 'ព្រះសីហនុ', 'កោះកុង'
];

function EditProductForm() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('កសិផលស្រស់');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('គីឡូក្រាម');
  const [location, setLocation] = useState('ភ្នំពេញ');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!productId) return;

      const { data: p, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (p) {
        setTitle(p.title || '');
        setCategory(p.category || 'កសិផលស្រស់');
        const priceRiel = p.price ? Math.round(p.price * 4000) : '';
        setPrice(priceRiel.toString());
        setUnit(p.unit || 'គីឡូក្រាម');
        setLocation(p.location || 'ភ្នំពេញ');
        setSellerName(p.seller_name || '');
        setSellerPhone(p.seller_phone || '');
        setDescription(p.description || '');
        setImageUrl(p.image_url || '');
        setQrCodeUrl(p.qr_code_url || '');
      }
      if (error) console.error(error);
      setLoading(false);
    }
    fetchData();
  }, [productId]);

  // Upload ចូល Bucket 'products' តែមួយគត់ដូច Admin និង Sell
  const uploadFileToStorage = async (file: File, folder: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) {
        alert(`Upload បរាជ័យ៖ ${uploadError.message}`);
        return null;
      }

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err: any) {
      alert(`មានកំហុសបច្ចេកទេស៖ ${err.message}`);
      return null;
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !sellerPhone) {
      alert('សូមបំពេញព័ត៌មានសំខាន់ៗឱ្យបានគ្រប់គ្រាន់!');
      return;
    }

    setSaving(true);
    try {
      const priceInRiel = parseFloat(price);
      const priceInUSD = priceInRiel / 4000;

      const { error } = await supabase
        .from('products')
        .update({
          title,
          category,
          price: priceInUSD,
          unit,
          location,
          seller_name: sellerName,
          seller_phone: sellerPhone,
          description,
          image_url: imageUrl,
          qr_code_url: qrCodeUrl || null,
        })
        .eq('id', productId);

      if (error) throw error;

      alert('កែប្រែព័ត៌មានផលិតផលបានជោគជ័យ!');
      router.back();
    } catch (err: any) {
      alert(`មានបញ្ហាក្នុងការរក្សាទុក៖ ${err.message}`);
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

      {/* ប្រភេទផលិតផល និង ទីតាំង */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ប្រភេទកសិផល *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ទីតាំង (ខេត្ត/ក្រុង) *</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          >
            {PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* តម្លៃគិតជារៀល និង ខ្នាត */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">តម្លៃ (រៀល ៛) *</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">គិតជា (ខ្នាត) *</label>
          <input
            type="text"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* ឈ្មោះអ្នកលក់ និងលេខទូរស័ព្ទ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះកសិដ្ឋាន / អ្នកលក់ *</label>
          <input
            type="text"
            required
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">លេខទូរស័ព្ទ (រហូតដល់ ៣ ខ្សែ) *</label>
          <input
            type="text"
            required
            value={sellerPhone}
            onChange={(e) => setSellerPhone(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* ការពិពណ៌នា */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">ការពិពណ៌នាអំពីផលិតផល</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:bg-white"
        />
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
            <span>{uploadingImage ? 'កំពុង Upload...' : 'ជ្រើសរើសរូបភាពថ្មីដើម្បីប្តូរ'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  setUploadingImage(true);
                  const url = await uploadFileToStorage(e.target.files[0], 'product');
                  if (url) setImageUrl(url);
                  setUploadingImage(false);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* កែប្រែរូបភាព KHQR Code (Upload ចូល bucket 'products' ដូច Admin និង Sell) */}
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
            <span>{uploadingQr ? 'កំពុង Upload QR...' : 'ជ្រើសរើសរូបភាព KHQR ថ្មី'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  setUploadingQr(true);
                  const url = await uploadFileToStorage(e.target.files[0], 'qr');
                  if (url) setQrCodeUrl(url);
                  setUploadingQr(false);
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
          disabled={saving || uploadingImage || uploadingQr}
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
      <header className="sticky top-0 z-40 bg-emerald-700 text-white px-4 py-3 shadow-md flex items-center gap-3">
        <Link href="/my-products" className="p-1 hover:bg-emerald-800 rounded-lg transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-base sm:text-lg font-bold">កែសម្រួលព័ត៌មានទំនិញ</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Suspense fallback={<div className="py-20 text-center text-slate-400 text-xs">កំពុងដំណើរការ...</div>}>
          <EditProductForm />
        </Suspense>
      </main>
    </div>
  );
}
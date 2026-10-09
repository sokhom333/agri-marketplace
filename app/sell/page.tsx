'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UploadCloud, CheckCircle2, ImagePlus, MapPin, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PROVINCES = [
  'ភ្នំពេញ', 'កណ្ដាល', 'តាកែវ', 'កំពង់ស្ពឺ', 'កំពង់ឆ្នាំង', 'ពោធិ៍សាត់', 'បាត់ដំបង', 'បន្ទាយមានជ័យ', 'ប៉ៃលិន', 'ឧត្តរមានជ័យ', 'សៀមរាប', 'ព្រះវិហារ', 'កំពង់ធំ', 'កំពង់ចាម', 'ត្បូងឃ្មុំ', 'ព្រៃវែង', 'ស្វាយរៀង', 'ក្រចេះ', 'ស្ទឹងត្រែង', 'រតនគិរី', 'មណ្ឌលគិរី', 'កំពត', 'កែប', 'ព្រះសីហនុ', 'កោះកុង'
];

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // State សម្រាប់រូបភាពផលិតផល
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // State សម្រាប់រូបភាព QR Code របស់កសិករ
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'កសិផលស្រស់',
    price: '',
    unit: 'គីឡូក្រាម',
    seller_name: '',
    seller_phone: '',
    location: 'ភ្នំពេញ',
    description: '',
    edit_pin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleQrSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const uploadFileToStorage = async (file: File, folder: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error(`Error uploading ${folder}:`, error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500';
      let finalQrUrl = '';

      // Upload រូបភាពផលិតផល
      if (imageFile) {
        const uploadedUrl = await uploadFileToStorage(imageFile, 'product');
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      // Upload រូបភាព QR Code របស់កសិករ (បើមាន)
      if (qrFile) {
        const uploadedQrUrl = await uploadFileToStorage(qrFile, 'qr');
        if (uploadedQrUrl) finalQrUrl = uploadedQrUrl;
      }

      const priceInRiel = parseFloat(formData.price);
      const priceInUSD = priceInRiel / 4000;

      const { error } = await supabase.from('products').insert([
        {
          title: formData.title,
          category: formData.category,
          price: priceInUSD,
          unit: formData.unit,
          seller_name: formData.seller_name,
          seller_phone: formData.seller_phone,
          location: formData.location,
          image_url: finalImageUrl,
          qr_code_url: finalQrUrl || null,
          description: formData.description,
          edit_pin: formData.edit_pin || '1234',
          is_approved: true,
        },
      ]);

      if (error) {
        alert('មានបញ្ហាក្នុងការរក្សាទុក៖ ' + error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert('មានកំហុសបច្ចេកទេស សូមព្យាយាមម្តងទៀត!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 hover:bg-emerald-800 rounded-lg transition" title="ត្រឡប់ទៅទំព័រដើម">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="Logo ផ្សារដើមកសិកម្ម" 
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-emerald-400/50 bg-white"
            />
            <div>
              <h1 className="text-base font-bold leading-tight">ទម្រង់ដាក់លក់ផលិតផលកសិកម្ម</h1>
              <p className="text-[11px] text-emerald-100">ផ្សារដើមកសិកម្ម - ផ្ទាល់ពីកសិករ និងដេប៉ូ</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          {success ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="mx-auto text-emerald-600" size={56} />
              <h2 className="text-lg font-bold text-slate-800">បានចុះបញ្ជីផលិតផលដោយជោគជ័យ!</h2>
              <p className="text-xs text-slate-500">កំពុងនាំអ្នកត្រឡប់ទៅទំព័រដើម...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ១. Upload រូបភាពផលិតផល */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  រូបភាពផលិតផល (ចុចដើម្បីរើសរូប) *
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="product-image-file" className="flex flex-col items-center justify-center w-full h-44 border-2 border-emerald-300 border-dashed rounded-xl cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 transition overflow-hidden relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 mb-2 text-emerald-500" />
                        <p className="mb-1 text-sm text-slate-600 font-semibold">ចុចទីនេះ ដើម្បី Upload រូបភាពផលិតផល</p>
                        <p className="text-xs text-slate-400">ពីទូរស័ព្ទ ឬកុំព្យូទ័រ</p>
                      </div>
                    )}
                    <input id="product-image-file" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  </label>
                </div>
              </div>

              {/* ២. Upload រូប QR Code ធនាគាររបស់កសិករ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <QrCode size={14} className="text-rose-600" /> រូបភាព QR Code ទទួលប្រាក់ (ABA / Bakong KHQR) - មិនបង្ខំ
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="qr-image-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-rose-200 border-dashed rounded-xl cursor-pointer bg-rose-50/40 hover:bg-rose-50 transition overflow-hidden relative">
                    {qrPreview ? (
                      <img src={qrPreview} alt="QR Preview" className="h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center px-4">
                        <QrCode className="w-6 h-6 mb-1 text-rose-500" />
                        <p className="text-xs text-slate-600 font-semibold">ចុច Upload រូបភាព QR Code ធនាគារ</p>
                        <p className="text-[11px] text-slate-400">សម្រាប់ឱ្យអ្នកទិញស្កេនបង់ប្រាក់ផ្ទាល់ (ទុកទទេបើគ្មាន)</p>
                      </div>
                    )}
                    <input id="qr-image-file" type="file" accept="image/*" className="hidden" onChange={handleQrSelect} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះផលិតផល ឬកសិផល *</label>
                <input type="text" name="title" required placeholder="ឧ. ស្ពៃក្តោបសរីរាង្គ, មាន់ស្រែរស់..." value={formData.title} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ប្រភេទ *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600 bg-white">
  <option value="កសិផលស្រស់">កសិផលស្រស់</option>
  <option value="ចំណីសត្វ">ចំណីសត្វ</option>
  <option value="ថ្នាំសត្វ & វ៉ាក់សាំង">ថ្នាំសត្វ & វ៉ាក់សាំង</option>
  <option value="ពូជសត្វ & ពូជដំណាំ">ពូជសត្វ & ពូជដំណាំ</option>
  {/* ថែមប្រភេទថ្មីនៅទីនេះ */}
  <option value="សម្ភារៈកសិកម្ម">សម្ភារៈកសិកម្ម</option>
</select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">តម្លៃ (រៀល ៛) *</label>
                    <input type="number" name="price" required placeholder="ឧ. 10000" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">គិតជា (ឯកតា)</label>
                    <input type="text" name="unit" placeholder="គីឡូក្រាម, បាវ, ដប..." value={formData.unit} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះម្ចាស់ចម្ការ / អ្នកលក់ *</label>
                  <input type="text" name="seller_name" required placeholder="ឧ. កសិដ្ឋាន ពូ ហេង" value={formData.seller_name} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
                </div>

                {/* ប្រអប់បញ្ចូលលេខទូរស័ព្ទរហូតដល់ ៣ ខ្សែ */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    លេខទូរស័ព្ទទំនាក់ទំនង (អាចដាក់បានរហូតដល់ ៣ ខ្សែ) *
                  </label>
                  <input
                    type="text"
                    name="seller_phone"
                    required
                    value={formData.seller_phone}
                    onChange={handleChange}
                    placeholder="ឧ. 012 345 678 / 097 923 3833 / 088 111 222"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-emerald-600 bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    * អាចប្រើសញ្ញា / ឬក្បៀស (,) ដើម្បីបំបែកលេខខ្សែនីមួយៗ
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin size={14} className="text-emerald-600"/> ទីតាំងភូមិសាស្ត្រ (ខេត្ត/ក្រុង) *
                </label>
                <select name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600 bg-white">
                  {PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ការពិពណ៌នាអំពីផលិតផល</label>
                <textarea name="description" rows={3} placeholder="រៀបរាប់ពីប្រភព គុណភាព ទីតាំងចម្ការ លក្ខខណ្ឌដឹកជញ្ជូន..." value={formData.description} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
              </div>
              
              {/* ប្រអប់បញ្ចូលលេខកូដសម្ងាត់ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  លេខកូដសម្ងាត់សម្រាប់គ្រប់គ្រង/លុបទំនិញ (PIN ៤ ខ្ទង់) *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  name="edit_pin"
                  required
                  placeholder="ឧ. 1234"
                  value={formData.edit_pin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600"
                />
                <span className="text-[10px] text-slate-400">
                  ចំណាំ៖ សូមចងចាំលេខកូដនេះ ដើម្បីប្រើពេលចង់លុបទំនិញរបស់អ្នកចោលវិញ។
                </span>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                <UploadCloud size={18} />
                <span>{loading ? 'កំពុងបង្ហោះចូលប្រព័ន្ធ...' : 'បង្ហោះដាក់លក់ឥឡូវនេះ'}</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
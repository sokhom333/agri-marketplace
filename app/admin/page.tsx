'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, EyeOff, Trash2, MapPin, RefreshCw, Lock, KeyRound, Plus, X, UploadCloud, ImagePlus, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ADMIN_SECRET_PIN = '271993'; 

const PROVINCES = [
  'ភ្នំពេញ', 'សៀមរាប', 'បាត់ដំបង', 'កំពង់ចាម', 'កំពង់ធំ', 
  'តាកែវ', 'កំពត', 'បន្ទាយមានជ័យ', 'ពោធិ៍សាត់', 'ព្រៃវែង', 
  'ស្វាយរៀង', 'កំពង់ស្ពឺ', 'កណ្តាល', 'មណ្ឌលគិរី', 'រតនគិរី', 'ផ្សេងៗ'
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State សម្រាប់គ្រប់គ្រងទម្រង់ផុសទំនិញថ្មី (Add Modal)
  const [showAddModal, setShowAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'ថ្នាំសត្វ & វ៉ាក់សាំង',
    price: '',
    unit: 'ដប',
    seller_name: 'ដេប៉ូ ដើមកសិកម្ម', // កំណត់ឈ្មោះដេប៉ូជាលំនាំដើម
    seller_phone: '012 345 678',   // លេខទូរស័ព្ទដេប៉ូ
    location: 'សៀមរាប',
    description: '',
  });

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_SECRET_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPinError(false);
      fetchProducts();
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    if (error) console.error(error);
    setLoading(false);
  };

  const toggleApprove = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('products').update({ is_approved: !currentStatus }).eq('id', id);
    if (error) alert('មានបញ្ហា៖ ' + error.message);
    else setProducts(products.map((p) => (p.id === id ? { ...p, is_approved: !currentStatus } : p)));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('តើអ្នកពិតជាចង់លុបទំនិញនេះចោលមែនទេ?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('មិនអាចលុបបានទេ៖ ' + error.message);
    else setProducts(products.filter((p) => p.id !== id));
  };

  // -----------------------------------------------------
  // មុខងារសម្រាប់ផុសទំនិញថ្មីពី Admin
  // -----------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleQrSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrFile(e.target.files[0]);
      setQrPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadFileToStorage = async (file: File, folder: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error(`Error uploading ${folder}:`, error);
      return null;
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let finalImageUrl = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500';
      let finalQrUrl = '';

      if (imageFile) {
        const uploadedUrl = await uploadFileToStorage(imageFile, 'product');
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

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
          is_approved: true, // ផុសពី Admin គឺ Approve អូតូ
          edit_pin: 'admin', // មិនបាច់ប្រើ PIN ក៏បានព្រោះ Admin អាចលុបបានស្រាប់
        },
      ]);

      if (error) {
        alert('មានបញ្ហាក្នុងការរក្សាទុក៖ ' + error.message);
      } else {
        alert('បង្ហោះទំនិញដេប៉ូជោគជ័យ!');
        setShowAddModal(false);
        fetchProducts(); // ទាញយកទិន្នន័យថ្មីមកបង្ហាញ
        
        // Clear form
        setFormData({ ...formData, title: '', price: '', description: '' });
        setImageFile(null); setImagePreview('');
        setQrFile(null); setQrPreview('');
      }
    } catch (err) {
      console.error(err);
      alert('មានកំហុសបច្ចេកទេស!');
    } finally {
      setFormLoading(false);
    }
  };

  // -----------------------------------------------------

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">តំបន់គ្រប់គ្រងរបស់ម្ចាស់ផ្សារ</h2>
          <p className="text-xs text-slate-400 mb-6">សូមបញ្ចូលលេខកូដសម្ងាត់ដើម្បីចូលទៅកាន់ Admin Panel</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input type="password" placeholder="បញ្ចូលលេខកូដសម្ងាត់ (PIN)..." value={pinInput} onChange={(e) => setPinInput(e.target.value)} autoFocus className={`w-full bg-slate-900 text-white text-center tracking-widest text-lg px-4 py-3 rounded-xl border outline-none transition ${pinError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-700 focus:border-emerald-500'}`} />
              <KeyRound className="absolute left-3 top-3.5 text-slate-500" size={20} />
            </div>
            {pinError && <p className="text-xs text-rose-400">លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ! សូមព្យាយាមម្តងទៀត។</p>}
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-900/20">ផ្ទៀងផ្ទាត់ និងចូល</button>
          </form>
          <Link href="/" className="inline-block mt-6 text-xs text-slate-400 hover:text-white transition">← ត្រឡប់ទៅកាន់ទំព័រដើមវិញ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1.5 hover:bg-slate-800 rounded-lg transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-base font-bold">ផ្ទាំងគ្រប់គ្រងផ្សារ (Admin Dashboard)</h1>
              <p className="text-[11px] text-slate-400">ត្រួតពិនិត្យ និងអនុម័តផលិតផលកសិករ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* ប៊ូតុងបន្ថែមទំនិញដេប៉ូ */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition shadow-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">បន្ថែមទំនិញដេប៉ូ</span>
            </button>
            <button onClick={fetchProducts} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">ទាញទិន្នន័យ</span>
            </button>
            <button onClick={handleLogout} className="bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition">Lock</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800">បញ្ជីផលិតផលទាំងអស់ ({products.length})</h2>
          </div>
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">កំពុងផ្ទុកទិន្នន័យ...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">មិនទាន់មានផលិតផលនៅឡើយទេ</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">រូបភាព & ឈ្មោះ</th>
                    <th className="py-3 px-4">ប្រភេទ</th>
                    <th className="py-3 px-4">តម្លៃ (រៀល)</th>
                    <th className="py-3 px-4">អ្នកលក់ & ទីតាំង</th>
                    <th className="py-3 px-4">ស្ថានភាព</th>
                    <th className="py-3 px-4 text-center">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {products.map((p) => {
                    const priceInRiel = (p.price * 4000).toLocaleString('en-US');
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={p.image_url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500'} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">{p.title}</p>
                            <p className="text-[10px] text-slate-400">ID: {p.id.slice(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="py-3 px-4"><span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-md text-[10px]">{p.category}</span></td>
                        <td className="py-3 px-4 font-bold text-emerald-700">{priceInRiel} ៛ <span className="text-[10px] font-normal text-slate-400">/{p.unit}</span></td>
                        <td className="py-3 px-4">
                          <p className={`font-medium ${p.seller_name === 'ដេប៉ូ ដើមកសិកម្ម' ? 'text-emerald-600' : 'text-slate-800'}`}>{p.seller_name}</p>
                          <p className="text-[10px] text-slate-400">{p.seller_phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          {p.is_approved ? <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"><CheckCircle size={10} /> កំពុងបង្ហាញ</span> : <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"><EyeOff size={10} /> កំពុងលាក់</span>}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => toggleApprove(p.id, p.is_approved)} className={`p-1.5 rounded-lg border transition ${p.is_approved ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`} title={p.is_approved ? 'លាក់ពីទំព័រដើម' : 'អនុម័តឱ្យបង្ហាញ'}>{p.is_approved ? <EyeOff size={14} /> : <CheckCircle size={14} />}</button>
                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition" title="លុបទំនិញនេះចោល"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal សម្រាប់ផុសទំនិញដេប៉ូ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <div className="sticky top-0 bg-white p-4 border-b border-slate-100 flex items-center justify-between z-10">
              <h2 className="text-base font-bold text-slate-800">បន្ថែមទំនិញរបស់ដេប៉ូ</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Product Image */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">រូបផលិតផល *</label>
                  <label htmlFor="admin-product-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-300 border-dashed rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition relative overflow-hidden">
                    {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="text-center text-emerald-500"><ImagePlus size={24} className="mx-auto" /><span className="text-[10px]">Upload រូប</span></div>}
                    <input id="admin-product-image" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  </label>
                </div>
                {/* QR Image */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">រូប QR Code</label>
                  <label htmlFor="admin-qr-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition relative overflow-hidden">
                    {qrPreview ? <img src={qrPreview} className="h-full object-contain p-2" /> : <div className="text-center text-slate-400"><QrCode size={24} className="mx-auto" /><span className="text-[10px]">Upload QR</span></div>}
                    <input id="admin-qr-image" type="file" accept="image/*" className="hidden" onChange={handleQrSelect} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះផលិតផល *</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ប្រភេទ *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600 bg-white">
                    <option value="ថ្នាំសត្វ">ថ្នាំសត្វ & វ៉ាក់សាំង</option>
                    <option value="ចំណីសត្វ">ចំណីសត្វ</option>
                    <option value="ពូជសត្វ & ពូជដំណាំ">ពូជសត្វ & ពូជដំណាំ</option>
                    <option value="កសិផលស្រស់">កសិផលស្រស់</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ទីតាំង *</label>
                  <select name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600 bg-white">
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">តម្លៃ (រៀល) *</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">គិតជា (ឯកតា)</label>
                  <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះអ្នកលក់</label>
                  <input type="text" name="seller_name" value={formData.seller_name} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-emerald-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">លេខទូរស័ព្ទ</label>
                  <input type="text" name="seller_phone" value={formData.seller_phone} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-emerald-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ការពិពណ៌នា</label>
                <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-emerald-600" />
              </div>

              <button type="submit" disabled={formLoading} className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                <UploadCloud size={18} />
                <span>{formLoading ? 'កំពុងបង្ហោះ...' : 'បង្ហោះចូលផ្សារ'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
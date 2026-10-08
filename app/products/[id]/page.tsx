'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Send, MapPin, ShieldCheck, QrCode, X, Copy, Check, MessageSquare, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function ProductDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setProduct(data);
      if (error) console.error(error);
      setLoading(false);
    }
    fetchDetail();
  }, [id]);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartChat = async () => {
    const userPhone = prompt('សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នកដើម្បីឆាតជាមួយអ្នកលក់៖');
    if (!userPhone) return;

    let { data: convo } = await supabase
      .from('conversations')
      .select('id')
      .eq('product_id', product.id)
      .eq('buyer_phone', userPhone)
      .single();

    if (!convo) {
      const { data: newConvo } = await supabase
        .from('conversations')
        .insert({
          product_id: product.id,
          buyer_phone: userPhone,
          seller_phone: product.seller_phone,
        })
        .select()
        .single();
      convo = newConvo;
    }

    if (convo) {
      window.location.href = `/chat/${convo.id}?phone=${userPhone}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
        កំពុងផ្ទុកព័ត៌មានលម្អិត...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <p className="text-slate-600 font-semibold">រកមិនឃើញផលិតផលនេះទេ!</p>
        <Link href="/" className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-xl">
          ← ត្រឡប់ទៅទំព័រដើមវិញ
        </Link>
      </div>
    );
  }

  const priceInRiel = (product.price * 4000).toLocaleString('en-US');
  const phoneList = product.seller_phone
    ? product.seller_phone.split(/[/,]/).map((p: string) => p.trim()).filter(Boolean)
    : [];
  const primaryPhone = phoneList[0] || '';
  const telegramPhone = primaryPhone.replace(/^0/, '').replace(/\s+/g, '');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 sm:pb-12">
      <header className="sticky top-0 z-40 bg-emerald-700 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 hover:bg-emerald-800 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-base font-bold">ព័ត៌មានលម្អិតពីផលិតផល</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="relative w-full aspect-video sm:aspect-[16/9] bg-slate-100">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm">
              {product.category}
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 leading-snug">{product.title}</h2>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    {product.seller_name}
                  </span>
                  {product.location && (
                    <span className="flex items-center gap-1 text-rose-500 font-medium">
                      <MapPin size={14} />
                      {product.location}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">តម្លៃលក់</span>
                <p className="text-2xl font-black text-emerald-700 leading-tight">
                  {priceInRiel} ៛
                  <span className="text-xs font-normal text-slate-500"> /{product.unit}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                ការពិពណ៌នា
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {product.description || 'មិនមានការពិពណ៌នាបន្ថែមសម្រាប់ផលិតផលនេះទេ។'}
              </p>
            </div>

            {/* ប៊ូតុងសកម្មភាព និងទំនាក់ទំនង */}
            <div className="space-y-2.5 pt-2">
              {/* ១. ប៊ូតុងឆាតផ្ទាល់ក្នុងវេបសាយ */}
              <button
                type="button"
                onClick={handleStartChat}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>ឆាតផ្ទាល់ក្នុងវេបសាយ</span>
              </button>

              {/* ២. ប៊ូតុងខល និង Telegram រៀបជា ២ ជួរឈរទន្ទឹមគ្នាស្មើស្អាត */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (phoneList.length <= 1) {
                      window.location.href = `tel:${primaryPhone.replace(/\s+/g, '')}`;
                    } else {
                      setShowCallModal(true);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Phone size={15} />
                  <span>ខលទាក់ទង</span>
                </button>

                <a
                  href={`https://t.me/+855${telegramPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Send size={15} />
                  <span>ផ្ញើសារតាម Telegram</span>
                </a>
              </div>

              {/* ៣. ប៊ូតុងស្កេនទូទាត់ KHQR */}
              <button
                type="button"
                onClick={() => setShowQR(true)}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <QrCode size={16} />
                <span>ស្កេនទូទាត់ប្រាក់ (KHQR)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Popup រើសខ្សែទូរស័ព្ទ */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Phone size={15} className="text-blue-600" />
                <span>ជ្រើសរើសខ្សែសម្រាប់ខល</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {phoneList.map((phone: string, idx: number) => (
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
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              បិទវិញ
            </button>
          </div>
        </div>
      )}

      {/* Modal ស្កេន KHQR */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 relative shadow-2xl text-center">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="inline-block bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-3">
              Bakong KHQR
            </div>
            <h3 className="font-bold text-slate-800 text-base">{product.title}</h3>
            <p className="text-emerald-700 font-extrabold text-xl mt-1">{priceInRiel} ៛</p>

            <div className="mt-4 p-4 bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl inline-block">
              <img
                src={
                  product.qr_code_url ||
                  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=KHQR_PAYMENT_FOR_${product.id}`
                }
                alt="KHQR"
                className="w-44 h-44 rounded-xl mx-auto bg-white p-2 object-contain"
              />
              <span className="text-[10px] text-slate-500 block mt-2 font-medium">
                ស្កេនទូទាត់តាមកម្មវិធីធនាគារណាក៏បាន
              </span>
            </div>

            <div className="mt-4 bg-slate-50 p-3 rounded-xl text-left text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">អ្នកទទួលប្រាក់៖</span>
                <span className="font-semibold text-slate-700">{product.seller_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">លេខទូរស័ព្ទ៖</span>
                <div className="flex items-center gap-1 font-semibold text-slate-700">
                  <span>{primaryPhone}</span>
                  <button
                    onClick={() => handleCopyPhone(primaryPhone)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 transition cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">កំពុងដំណើរការ...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
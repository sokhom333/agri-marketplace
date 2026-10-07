'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function ChatContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const conversationId = params?.id as string;
  const myPhone = searchParams.get('phone') || '';

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    supabase
      .from('conversations')
      .select('*, products(title)')
      .eq('id', conversationId)
      .single()
      .then(({ data }) => setConversation(data));

    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !myPhone) return;

    const text = inputText;
    setInputText('');

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_phone: myPhone,
      content: text,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow p-3 flex items-center gap-3">
        <Link href="/" className="p-1 hover:bg-emerald-800 rounded">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-sm font-bold">
            {conversation?.products?.title || 'ការសន្ទនា'}
          </h1>
          <p className="text-[11px] text-emerald-200">
            គណនីរបស់អ្នក៖ {myPhone || 'មិនទាន់បញ្ជាក់លេខ'}
          </p>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto space-y-3 max-w-2xl w-full mx-auto">
        {messages.map((msg) => {
          const isMe = msg.sender_phone === myPhone;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      <form
        onSubmit={sendMessage}
        className="sticky bottom-0 bg-white border-t border-slate-200 p-3 flex gap-2 max-w-2xl w-full mx-auto"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="សរសេរសារនៅទីនេះ..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-600"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">កំពុងដំណើរការ...</div>}>
      <ChatContent />
    </Suspense>
  );
}
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#047857",
};

export const metadata: Metadata = {
  title: "ផ្សារដើមកសិកម្ម",
  description: "ផ្គត់ផ្គង់ថ្នាំសត្វ ចំណីសត្វ និងកសិផលធម្មជាតិ ផ្ទាល់ពីកសិករ និងដេប៉ូ",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="km"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-slate-50 text-slate-800">
        {/* ខ្លឹមសារទំព័រនានា */}
        <div className="flex-1 pb-16 sm:pb-0">{children}</div>

        {/* ប៊ូតុងអណ្តែត AI បង្ហាញទាំងលើទូរស័ព្ទ (bottom-20) និងកុំព្យូទ័រ (sm:bottom-6) */}
        <a
          href="https://daem-vet-ai.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 font-semibold text-xs sm:text-sm border-2 border-white/30 backdrop-blur-sm"
          title="ពិគ្រោះជំងឺសត្វ និងដំណាំជាមួយ ដើមកសិកម្ម AI"
        >
          <span className="text-base sm:text-xl animate-bounce">🤖</span>
          <span>ដើមកសិកម្ម AI</span>
        </a>

        {/* Bottom Navigation Bar សម្រាប់ទូរស័ព្ទដៃ (លាក់លើកុំព្យូទ័រដោយ sm:hidden) */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around items-center py-2 z-40 shadow-lg">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 active:scale-95 transition"
          >
            <span className="text-lg">🏠</span>
            <span>ទំព័រដើម</span>
          </Link>

          <Link
            href="/sell"
            className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 active:scale-95 transition"
          >
            <span className="text-lg">➕</span>
            <span>ដាក់លក់</span>
          </Link>

          <Link
            href="/my-products"
            className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 active:scale-95 transition"
          >
            <span className="text-lg">📦</span>
            <span>ទំនិញខ្ញុំ</span>
          </Link>

          <a
            href="https://daem-vet-ai.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-emerald-700 active:scale-95 transition"
          >
            <span className="text-lg">🤖</span>
            <span>AI ពេទ្យសត្វ</span>
          </a>
        </nav>
      </body>
    </html>
  );
}
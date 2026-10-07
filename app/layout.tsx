import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className="min-h-full flex flex-col relative">
        {children}

        {/* ប៊ូតុងអណ្តែតផ្លូវកាត់ទៅកាន់ ដើមកសិកម្ម AI */}
        <a
          href="https://daem-vet-ai.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 font-semibold text-sm border-2 border-white/30 backdrop-blur-sm"
          title="ពិគ្រោះជំងឺសត្វ និងដំណាំជាមួយ ដើមកសិកម្ម AI"
        >
          <span className="text-xl animate-bounce">🤖</span>
          <span>ដើមកសិកម្ម AI</span>
        </a>
      </body>
    </html>
  );
}
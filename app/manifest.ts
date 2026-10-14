import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ផ្សារដើមកសិកម្ម',
    short_name: 'ដើមកសិកម្ម',
    description: 'ផ្គត់ផ្គង់ថ្នាំសត្វ ចំណីសត្វ និងកសិផលធម្មជាតិ ផ្ទាល់ពីកសិករ និងដេប៉ូ',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#047857',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
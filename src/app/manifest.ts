import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ADOFOM E-PLATFORM',
    short_name: 'ADOFOM',
    description:
      'Secure digital platform for the Administrative Officers Forum, Ondo State. An independent initiative by Treabyn Inc.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#001f3f',
    theme_color: '#15803d',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react()
  ],
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            'react-three-fiber': ['@react-three/fiber'],
            'react-three-drei': ['@react-three/drei'],
            'react-three-rapier': ['@react-three/rapier'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier', '@n8n/chat'],
    },
  },
});
import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react()
  ],
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
        onwarn(warning, warn) {
          if (warning.code === 'EVAL' && 
             (warning.id.includes('three-stdlib/libs/lottie.js') || 
              warning.id.includes('@chevrotain/utils/lib/src/to-fast-properties.js'))) {
            return;
          }
          warn(warning);
        },
      },
      chunkSizeWarningLimit: 1000, // Increase to 1000 kB or any suitable value
    },
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier', '@n8n/chat'],
    },
  },
});
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': projectRoot,
      },
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 1. Vendor Chunks
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            if (
              id.includes('src/components/CodeEditor') ||
              id.includes('@codemirror') ||
              id.includes('codemirror') ||
              id.includes('@lezer') ||
              id.includes('style-mod') ||
              id.includes('w3c-keyname') ||
              id.includes('crelt')
            ) {
              return 'feature-editor';
            }
            if (id.includes('node_modules/motion/') || id.includes('node_modules/framer-motion/')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons';
            }

            // 2. Non-critical Application Feature Chunks (Lazy loaded on demand)
            if (id.includes('src/components/AdminDashboard') || id.includes('src/components/OwnerCodeModal')) {
              return 'feature-admin';
            }
            if (id.includes('src/components/GlobalSearchModal')) {
              return 'feature-search';
            }
            if (id.includes('src/components/AchievementsModal') || id.includes('src/types/achievements')) {
              return 'feature-achievements';
            }
            if (id.includes('src/components/OnboardingModal')) {
              return 'feature-onboarding';
            }
            if (id.includes('src/components/CodePlayground') || id.includes('src/components/LiveBrowserPreview')) {
              return 'feature-playground';
            }
            if (id.includes('src/components/BugHunter')) {
              return 'feature-bughunter';
            }
            if (id.includes('src/data/codingChallenges')) {
              return 'data-challenges';
            }
            if (id.includes('src/data/partExamsData') || id.includes('src/data/partSummaryDetails')) {
              return 'data-exams';
            }
            if (id.includes('src/components/ChallengesList')) {
              return 'feature-challenges';
            }
          },
        },
      },
    },
    server: {
      // Keep the development page stable; reload manually after changing files.
      hmr: false,
      watch: null,
    },
  };
});

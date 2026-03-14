import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'zidly',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'zidly/index.html'),
        buy: resolve(__dirname, 'zidly/buy.html'),
        demo: resolve(__dirname, 'zidly/demo.html'),
        blog: resolve(__dirname, 'zidly/blog.html'),
        'blog-ai-receptionist': resolve(__dirname, 'zidly/blog-ai-receptionist.html'),
        'blog-google-reviews': resolve(__dirname, 'zidly/blog-google-reviews.html'),
        'blog-missed-calls': resolve(__dirname, 'zidly/blog-missed-calls.html'),
        contact: resolve(__dirname, 'zidly/contact.html'),
        privacy: resolve(__dirname, 'zidly/privacy.html'),
        terms: resolve(__dirname, 'zidly/terms.html'),
      }
    }
  }
})

import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        buy: resolve(__dirname, 'buy.html'),
        demo: resolve(__dirname, 'demo.html'),
        blog: resolve(__dirname, 'blog.html'),
        'blog-ai-receptionist': resolve(__dirname, 'blog-ai-receptionist.html'),
        'blog-google-reviews': resolve(__dirname, 'blog-google-reviews.html'),
        'blog-missed-calls': resolve(__dirname, 'blog-missed-calls.html'),
        contact: resolve(__dirname, 'contact.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
      }
    }
  }
})

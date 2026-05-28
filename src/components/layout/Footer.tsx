'use client';

import React from 'react';
import NextImage from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-cream border-t border-[#e2ede7] py-12 text-center mt-auto" id="kontak">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-6">

        {/* Footer Logo */}
        <div className="relative w-56 h-14 select-none">
          <NextImage
            src="/images/logo_v4.png"
            alt="Botani Mart Logo"
            fill
            className="object-contain brightness-95"
          />
        </div>

        {/* Social Media Link Icons with Real Brand Colors */}
        <div className="flex gap-6 items-center justify-center">

          {/* TikTok - Original Neon Brand Accent */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white hover:scale-110 active:scale-95 shadow-md flex items-center justify-center group transition-all duration-300"
            aria-label="Botani Mart di TikTok"
          >
            <svg className="w-5.5 h-5.5 text-zinc-900 group-hover:text-black transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.42-.42-.61-.65v7.17c.02 1.37-.3 2.77-.97 3.97-.93 1.66-2.52 2.91-4.37 3.42-2.14.61-4.52.41-6.5-.59-1.99-1.01-3.48-2.92-4.04-5.13-.64-2.52-.16-5.32 1.34-7.4 1.44-2.02 3.75-3.32 6.24-3.49v4.03c-1.31.09-2.6.64-3.47 1.62-.91 1.02-1.24 2.45-1.02 3.8.21 1.25.96 2.38 2.02 3.06 1.09.7 2.42.87 3.65.55 1.1-.28 2.05-1.04 2.58-2.05.41-.78.56-1.68.54-2.56V.02h.01z" />
            </svg>
          </a>

          {/* Instagram - Vibrant Sunset Gradient Logo */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white hover:scale-110 active:scale-95 shadow-md flex items-center justify-center group transition-all duration-300 relative overflow-hidden"
            aria-label="Botani Mart di Instagram"
          >
            <span className="absolute inset-0 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="w-5.5 h-5.5 text-zinc-900 group-hover:text-white transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>

          {/* WhatsApp - Glowing Green Logo */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white hover:scale-110 active:scale-95 shadow-md flex items-center justify-center group transition-all duration-300 relative overflow-hidden"
            aria-label="Botani Mart di WhatsApp"
          >
            <span className="absolute inset-0 bg-[#25d366] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="w-5.5 h-5.5 text-zinc-900 group-hover:text-white transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.885 1.503 5.485.002 9.948-4.436 9.951-9.886.002-2.641-1.02-5.124-2.877-6.984C16.691 1.928 14.22 1.91 12.012 1.91 6.524 1.91 2.06 6.348 2.057 11.8.055 13.526.564 15.223 1.56 16.892l-.997 3.637 3.734-.969a9.7 9.7 0 001.35.59z" />
            </svg>
          </a>

        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-brand-sage font-semibold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Botani Mart Bogor. Hak Cipta Dilindungi.
          </p>
          <p className="text-[9px] text-[#50685c]/60 font-medium">
            Dirancang dengan penuh dedikasi untuk kebun rumah impian Anda.
          </p>
        </div>

      </div>
    </footer>
  );
}

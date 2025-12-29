"use client";

import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 text-center animate-footer">
        <h2 className="text-2xl font-semibold tracking-wide mb-3">
          Dsport
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mx-auto">
          Dsport is a trusted online sports store offering high-quality sports
          equipment, apparel, and accessories. We focus on durability,
          performance, and customer satisfaction to support athletes and
          fitness enthusiasts at every level.
        </p>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400 animate-footer-delay">
        © {new Date().getFullYear()} Dsport. All rights reserved.
      </div>
    </footer>
  );
}

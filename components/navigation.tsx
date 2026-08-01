'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Coffee } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'FLAVOURS', href: '#flavours' },
    { name: 'FORMULA', href: '#formula' },
    { name: 'ACTIVATIONS', href: '#activations' },
    { name: 'SOCIAL', href: '#social' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#121212]/80 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#AFFF00] flex items-center justify-center text-[#121212] font-black group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#121212] dark:text-white">
            BITE<span className="text-[#AFFF00]">EAT</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-mono font-bold tracking-widest text-[#121212]/70 dark:text-white/70 hover:text-[#121212] dark:hover:text-[#AFFF00] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#flavours"
            className="bg-[#AFFF00] hover:bg-[#bbf028] text-[#121212] px-5 py-2 rounded-full font-bold text-xs tracking-wider transition-all hover:scale-105 shadow-md"
          >
            ORDER NOW
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#121212] dark:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#121212] border-b border-white/10 px-6 py-6 space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-mono font-bold tracking-widest text-white/80 hover:text-[#AFFF00]"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-white/10">
              <a
                href="#flavours"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-[#AFFF00] text-[#121212] font-bold text-xs py-2.5 rounded-full text-center"
              >
                ORDER NOW
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

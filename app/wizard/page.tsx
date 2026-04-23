"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

// --- 🌿 NATURE INSPIRED PALETTES (60-30-10 Rule) ---
// 60% = Background (bg)
// 30% = Secondary/Overlay (sec)
// 10% = Call to Action / Accent (cta)
// Text = High Contrast Text Color (text)
const PALETTES = [
  { 
    id: 'forest', name: 'Midnight Forest', 
    colors: { bg: '#0B1C10', sec: '#1A3C22', cta: '#4CAF50', text: '#E8F5E9' } 
  },
  { 
    id: 'stone', name: 'Earth & Stone', 
    colors: { bg: '#252323', sec: '#403A36', cta: '#D36135', text: '#EAE0D5' } 
  },
  { 
    id: 'ocean', name: 'Deep Lake', 
    colors: { bg: '#0A1128', sec: '#1C2E4A', cta: '#00B4D8', text: '#F0F8FF' } 
  },
  { 
    id: 'autumn', name: 'Autumn Warmth', 
    colors: { bg: '#2A1A1F', sec: '#472B31', cta: '#E36414', text: '#FCEFEF' } 
  },
];

export default function Wizard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: { 
      template: 1, 
      paletteId: 'forest',
      businessName: 'Apex Landscaping', 
      heroText: 'NATURE, REDEFINED.' 
    }
  });

  const liveBusinessName = watch("businessName");
  const liveHeroText = watch("heroText");
  const selectedTemplate = watch("template");
  const selectedPaletteId = watch("paletteId");
  
  // Find the actual palette object based on the selected ID
  const activePalette = PALETTES.find(p => p.id === selectedPaletteId) || PALETTES[0];

  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    // In production, ensure you update your Prisma Schema to accept the paletteId!
    const res = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const newSite = await res.json();
    window.location.href = `/site/${newSite.id}`; 
  };

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white overflow-hidden">
      
      {/* ========================================= */}
      {/* LEFT PANEL: Form Controls                 */}
      {/* ========================================= */}
      <div className="w-full md:w-[400px] bg-neutral-900 border-r border-neutral-800 p-8 flex flex-col h-full overflow-y-auto z-10 custom-scrollbar">
        <h1 className="text-2xl font-bold mb-8 text-green-400">Site Builder</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 flex-1">
          
          {/* 1. Template Selection */}
          <div>
            <label className="text-sm text-neutral-400 font-bold mb-3 block uppercase tracking-wider">1. Template</label>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map(t => (
                <div 
                  key={t} 
                  onClick={() => setValue("template", t)}
                  className={`p-4 border-2 cursor-pointer rounded-xl transition-all text-center ${
                    selectedTemplate === t ? 'border-green-500 bg-green-500/10' : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <p className="font-bold text-sm">Template {t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Color Palette Picker */}
          <div className="relative">
            <label className="text-sm text-neutral-400 font-bold mb-3 block uppercase tracking-wider">2. Brand Colors</label>
            
            {/* Selected Palette Button */}
            <button
              type="button"
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full border border-neutral-800" style={{ backgroundColor: activePalette.colors.bg }} />
                  <div className="w-6 h-6 rounded-full border border-neutral-800" style={{ backgroundColor: activePalette.colors.sec }} />
                  <div className="w-6 h-6 rounded-full border border-neutral-800 z-10" style={{ backgroundColor: activePalette.colors.cta }} />
                </div>
                <span className="font-bold text-sm">{activePalette.name}</span>
              </div>
              <svg className={`w-5 h-5 transition-transform ${isPaletteOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Dropdown Options */}
            <AnimatePresence>
              {isPaletteOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 w-full mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {PALETTES.map(palette => (
                    <div 
                      key={palette.id}
                      onClick={() => { setValue("paletteId", palette.id); setIsPaletteOpen(false); }}
                      className={`p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-700 transition-colors ${selectedPaletteId === palette.id ? 'bg-neutral-700/50' : ''}`}
                    >
                      <span className="text-sm font-bold">{palette.name}</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: palette.colors.bg }} />
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: palette.colors.sec }} />
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: palette.colors.cta }} />
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: palette.colors.text }} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Text Content */}
          <div className="flex flex-col gap-4">
            <label className="text-sm text-neutral-400 font-bold uppercase tracking-wider">3. Content</label>
            <div>
              <span className="text-xs text-neutral-500 mb-1 block">Business Name</span>
              <input 
                {...register("businessName", { required: true })}
                type="text" 
                className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>
            <div>
              <span className="text-xs text-neutral-500 mb-1 block">Hero Catchphrase</span>
              <input 
                {...register("heroText", { required: true })}
                type="text" 
                className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              {isGenerating ? "Publishing Site..." : "Publish & Go Live"}
            </button>
          </div>
        </form>
      </div>

      {/* ========================================= */}
      {/* RIGHT PANEL: Live Real-Time Preview       */}
      {/* ========================================= */}
      <div className="flex-1 bg-neutral-950 relative flex items-center justify-center p-8 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950">
        
        {/* Decorative Browser Bar */}
        <div className="absolute top-8 w-full max-w-5xl px-4 flex justify-between items-center z-20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="bg-neutral-800 px-4 py-1 rounded-full text-xs text-neutral-400 font-mono">
            live-preview.landscapersaas.com
          </div>
          <div className="w-12"></div>
        </div>

        {/* 
          THE CANVAS: Dynamic Styles Applied Here
          Uses the activePalette colors dynamically!
        */}
        <div 
          className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col transition-colors duration-500"
          style={{ backgroundColor: activePalette.colors.bg, color: activePalette.colors.text }}
        >
          
          {/* Mock Header (Uses 30% Secondary Color) */}
          <header 
            className="w-full p-6 absolute top-0 left-0 z-50 flex justify-between items-center transition-colors duration-500"
            style={{ backgroundColor: `${activePalette.colors.sec}E6`, backdropFilter: 'blur(8px)' }} // E6 adds 90% opacity hex
          >
            <h2 className="text-xl font-bold tracking-widest uppercase truncate max-w-[200px]">
              {liveBusinessName || "Your Brand"}
            </h2>
            <div className="hidden md:flex gap-6 text-sm font-bold opacity-80">
              <span>Services</span>
              <span>About</span>
              {/* Text highlighting using CTA color */}
              <span style={{ color: activePalette.colors.cta }}>Contact</span>
            </div>
          </header>

          {/* Mock Hero Section */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=3000&auto=format&fit=crop" 
                 className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                 alt="Background"
               />
               {/* 60% Dominant Background Gradient Overlay */}
               <div 
                  className="absolute inset-0 bg-gradient-to-t opacity-90"
                  style={{ backgroundImage: `linear-gradient(to top, ${activePalette.colors.bg}, transparent)` }}
               ></div>
            </div>
            
            <div className="relative z-10 text-center px-4 max-w-3xl">
              <motion.h1 
                key={liveHeroText}
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4 uppercase drop-shadow-lg"
              >
                {liveHeroText || "YOUR HERO TEXT"}
              </motion.h1>
              <p className="text-sm md:text-lg opacity-80">
                Premium landscaping and design by {liveBusinessName || "your brand"}.
              </p>
              
              {/* Call To Action Button (Uses 10% CTA Color) */}
              <button 
                className="mt-8 px-8 py-4 rounded-sm font-bold text-sm hover:scale-105 transition-transform shadow-lg uppercase tracking-wider"
                style={{ backgroundColor: activePalette.colors.cta, color: activePalette.colors.bg }}
              >
                Get a Free Quote
              </button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
"use client";
import { useEffect, useRef, useState, use } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

// Note: Next.js 15 requires params to be a Promise
export default function CinematicTemplate({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // Unwraps the Next.js 15 promise
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  
  // State to hold our database data
  const [siteData, setSiteData] = useState<{businessName: string, heroText: string} | null>(null);

  // 1. Fetch data from the database on load
  useEffect(() => {
    fetch(`/api/sites/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => setSiteData(data));
  }, [resolvedParams.id]);

  // 2. Parallax Setup
  useEffect(() => {
    if (!siteData) return; // Wait until data loads to animate
    gsap.to(imageRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [siteData]);

  // 3. Loading State
  if (!siteData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-2xl animate-pulse">Generating your award-winning site...</p>
      </div>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <main className="bg-[#0a0a0a] text-white min-h-[200vh] font-sans">
        
        <header className="absolute top-0 left-0 w-full p-8 z-50">
          <h2 className="text-2xl font-bold tracking-widest uppercase">{siteData.businessName}</h2>
        </header>

        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
             <img 
               ref={imageRef}
               src="https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=3000&auto=format&fit=crop" 
               className="w-full h-[130%] object-cover opacity-60 scale-105"
               alt="Landscaping Cinematic"
             />
          </div>
          
          <div className="relative z-10 text-center px-4">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-4 uppercase"
            >
              {/* Injecting the text from the form! */}
              {siteData.heroText}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto"
            >
              Premium landscaping and design by {siteData.businessName}.
            </motion.p>
          </div>
        </section>

        <section className="py-32 px-8 max-w-4xl mx-auto relative z-20 bg-[#0a0a0a]">
          <h2 className="text-4xl font-bold mb-12 text-center">Transform Your Space</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <input className="bg-neutral-800 p-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Name" />
            <input className="bg-neutral-800 p-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Phone" />
            <textarea className="bg-neutral-800 p-4 rounded-lg col-span-1 md:col-span-2 h-32 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Tell us about your project..." />
            <button className="bg-white text-black font-bold py-4 rounded-lg col-span-1 md:col-span-2 hover:bg-neutral-200 transition-colors">
              Request Consultation
            </button>
          </form>
        </section>
        
      </main>
    </ReactLenis>
  );
}
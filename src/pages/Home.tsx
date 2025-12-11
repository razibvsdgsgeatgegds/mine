import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Dynamic background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-center px-6 max-w-5xl mx-auto z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer">
          <Sparkles size={14} />
          <span className="font-medium tracking-wide">AI-Powered Experience</span>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 mb-8 leading-[0.9]">
          Design <br/> Without Limits.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The next generation of digital creation is here. Describe your vision, and watch it come to life with pixel-perfect precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">Start Building <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></span>
            <div className="absolute inset-0 rounded-full bg-indigo-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
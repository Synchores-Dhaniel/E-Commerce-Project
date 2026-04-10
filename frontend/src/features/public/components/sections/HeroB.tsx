"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { HeroData } from "@/data/heroData";


export default function HeroB({ data }: { data: HeroData["versionB"] }) {
  const { scenes, headlinePart1, headlineItalic, heroDescriptionShort, ctaPrimary, ctaSecondary } = data;
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [activePointerId, setActivePointerId] = useState<string | null>(null);
  const [lockedPointerId, setLockedPointerId] = useState<string | null>(null);
  const [hasHover, setHasHover] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const deactivateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentScene = scenes[currentSceneIndex];

  // Screen size and interaction type detection
  useEffect(() => {
    const handleCheck = () => {
      setHasHover(window.matchMedia("(hover: hover)").matches);
      setIsDesktopLayout(window.innerWidth >= 1024);
    };
    handleCheck();
    window.addEventListener("resize", handleCheck);
    return () => {
      window.removeEventListener("resize", handleCheck);
      if (deactivateTimeoutRef.current) clearTimeout(deactivateTimeoutRef.current);
    };
  }, []);

  // Handle Video Synchronization
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;

    const matchingIndex = scenes.findIndex((s, idx) => {
      const isLast = idx === scenes.length - 1;
      return currentTime >= s.startTime && (isLast ? true : currentTime < s.endTime);
    });

    if (matchingIndex !== -1 && matchingIndex !== currentSceneIndex) {
      setCurrentSceneIndex(matchingIndex);
      setActivePointerId(null);
      setLockedPointerId(null);
    }
  };

  const clearDeactivateTimeout = () => {
    if (deactivateTimeoutRef.current) {
      clearTimeout(deactivateTimeoutRef.current);
      deactivateTimeoutRef.current = null;
    }
  };

  const handleActivate = (id: string) => {
    clearDeactivateTimeout();
    setActivePointerId(id);
  };

  const handleDeactivate = (id: string) => {
    if (lockedPointerId === id) return;
    
    // Small delay to prevent flickering when mouse transitions between elements
    deactivateTimeoutRef.current = setTimeout(() => {
      setActivePointerId(null);
    }, 150);
  };

  const handleToggle = (id: string) => {
    clearDeactivateTimeout();
    if (lockedPointerId === id) {
      setLockedPointerId(null);
      setActivePointerId(null);
    } else {
      setLockedPointerId(id);
      setActivePointerId(id);
    }
  };

  const handleVideoError = () => {
    console.error("Hero B Video Background failed to load.");
  };

  return (
    <section className="relative w-full min-h-screen lg:h-[95vh] lg:min-h-[750px] overflow-hidden bg-black flex flex-col lg:flex-row items-center justify-center pt-20 lg:pt-0">

      {/* 
          SHARED STAGE CONTAINER (order-2 on mobile, absolute on desktop)
          - Important: REMOVED z-index from this container to allow children to participate 
            in the section's global stacking order (Video at bottom, Hotspots at top).
      */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-full lg:absolute lg:inset-0 order-2 lg:order-none pointer-events-none">
        
        {/* Video Background Layer (z-0 - Sits below content) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onError={handleVideoError}
            className="w-full h-full object-cover"
          >
            <source src="/assets/hero/videobgsample.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/40 lg:bg-black/20 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-black/80 via-black/40 lg:via-black/40 to-black/60 lg:to-transparent z-10 pointer-events-none" />
        </div>

        {/* Hotspot Interaction Layer (z-40 - Sits ABOVE content and video) */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div
            className={cn("absolute inset-0", !hasHover ? "pointer-events-auto" : "pointer-events-none")}
            onClick={() => {
              if (!hasHover) {
                setActivePointerId(null);
                setLockedPointerId(null);
              }
            }}
          />

          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSceneIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {currentScene.pointers.map((pointer) => (
                  <HotspotPointer
                    key={pointer.id}
                    pointer={pointer}
                    isActive={activePointerId === pointer.id}
                    isLocked={lockedPointerId === pointer.id}
                    hasHover={hasHover}
                    isDesktopLayout={isDesktopLayout}
                    onActivate={() => handleActivate(pointer.id)}
                    onDeactivate={() => handleDeactivate(pointer.id)}
                    onToggle={() => handleToggle(pointer.id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content Layer (z-20 - Sits between Video and Hotspots) */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-20 h-full flex items-center order-1 lg:order-none py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-12 xl:col-span-12 pb-10 lg:pb-32 relative z-30 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-[100px] font-display font-black text-white leading-[0.95] mb-6 md:mb-8 tracking-tighter drop-shadow-lg">
              {headlinePart1} <br />
              <span className="text-primary italic">{headlineItalic}</span>
            </h1>

            <p className="text-white/80 text-sm md:text-lg lg:text-xl font-medium leading-relaxed mb-8 md:mb-12 max-w-sm drop-shadow-md">
              {heroDescriptionShort}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-5">
              <Link href="/catalog" className="bg-primary hover:bg-black text-white px-6 md:px-10 py-4 md:py-6 h-auto rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 flex items-center gap-3">
                {ctaPrimary.text}
                <ArrowRight size={18} />
              </Link>

              <Link 
                href="/#product-catalog" 
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "/#product-catalog");
                  }
                }}
                className="bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 px-6 md:px-10 py-4 md:py-6 h-auto rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest transition-all duration-300 shadow-sm hover:scale-105 active:scale-95"
              >
                {ctaSecondary.text}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Hotspot Pointer with dynamic viewport-aware positioning
 */
function HotspotPointer({ 
  pointer, 
  isActive, 
  isLocked,
  hasHover, 
  isDesktopLayout,
  onActivate, 
  onDeactivate, 
  onToggle 
}: { 
  pointer: any; 
  isActive: boolean; 
  isLocked: boolean;
  hasHover: boolean; 
  isDesktopLayout: boolean;
  onActivate: () => void; 
  onDeactivate: () => void; 
  onToggle: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [xOffset, setXOffset] = useState(0);

  useEffect(() => {
    if (isActive && popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      const margin = 20;
      const viewportWidth = window.innerWidth;

      let offset = 0;
      if (rect.right > viewportWidth - margin) {
        offset = viewportWidth - rect.right - margin;
      } else if (rect.left < margin) {
        offset = margin - rect.left;
      }
      setXOffset(offset);
    } else {
      setXOffset(0);
    }
  }, [isActive]);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group pointer-events-auto cursor-pointer"
      style={{
        top: pointer.top,
        left: pointer.left,
        zIndex: isActive ? 1002 : 1000,
        width: "60px",
        height: "60px"
      }}
      onMouseEnter={() => hasHover && onActivate()}
      onMouseLeave={() => hasHover && onDeactivate()}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <div className="relative w-10 h-10 flex items-center justify-center p-2">
        <div className="relative w-8 h-8 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 w-full h-full bg-white rounded-full animate-ping opacity-60" />
          <div className="relative w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] md:group-hover:scale-125 transition-transform duration-300" />
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            ref={popoverRef}
            initial={{ 
              opacity: 0, 
              scale: 0.9, 
              y: isDesktopLayout ? "-40%" : 10, 
              x: !isDesktopLayout ? "-50%" : 0 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: isDesktopLayout ? "-50%" : 0, 
              x: !isDesktopLayout ? `calc(-50% + ${xOffset}px)` : `${xOffset}px` 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "absolute mb-6 w-[260px] md:w-[300px] bg-white/98 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 border border-white/50 flex gap-4 z-[1003] pointer-events-auto",
              "bottom-full left-1/2 lg:left-auto lg:right-full lg:mr-8 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
            )}
            style={{}}
          >
            <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2">
              <img
                src={pointer.image}
                alt={pointer.productName}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center w-full">
              <h4 className="text-secondary font-bold text-xs md:text-[13px] mb-1 leading-tight">{pointer.productName}</h4>
              <p className="text-gray-500 text-[10px] md:text-[11px] leading-relaxed line-clamp-2 mb-2">
                {pointer.description}
              </p>
              <a
                href={pointer.link}
                className="text-primary font-extrabold text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all w-max"
              >
                View Details <ArrowRight size={10} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
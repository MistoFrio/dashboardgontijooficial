"use client"

import React from "react"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-100" />
      
      {/* Animated geometric shapes */}
      <div className="absolute inset-0">
        {/* Large red circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-200/30 rounded-full animate-float-slow" />
        <div className="absolute top-32 right-20 w-24 h-24 bg-red-300/40 rounded-full animate-float-medium" />
        <div className="absolute bottom-20 left-32 w-40 h-40 bg-red-100/50 rounded-full animate-float-fast" />
        <div className="absolute bottom-32 right-10 w-28 h-28 bg-red-200/35 rounded-full animate-float-slow" />
        
        {/* Medium circles */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-red-400/25 rounded-full animate-float-medium" />
        <div className="absolute top-2/3 right-1/3 w-20 h-20 bg-red-300/30 rounded-full animate-float-fast" />
        <div className="absolute bottom-1/4 left-1/2 w-12 h-12 bg-red-500/20 rounded-full animate-float-slow" />
        
        {/* Small circles */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-red-400/40 rounded-full animate-float-fast" />
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-red-300/50 rounded-full animate-float-medium" />
        <div className="absolute top-3/4 right-1/2 w-10 h-10 bg-red-200/45 rounded-full animate-float-slow" />
        
        {/* Geometric lines and shapes */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200/30 to-transparent animate-pulse-slow" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-red-200/20 to-transparent animate-pulse-medium" />
        
        {/* Diagonal lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-300/25 to-transparent transform rotate-12 animate-slide-right" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200/30 to-transparent transform -rotate-12 animate-slide-left" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div
                key={i}
                className="border border-red-200 animate-pulse-slow"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${3 + (i % 3)}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Floating data points */}
        <div className="absolute top-20 left-1/3 w-3 h-3 bg-red-500/60 rounded-full animate-bounce-slow" />
        <div className="absolute top-40 right-1/4 w-2 h-2 bg-red-400/70 rounded-full animate-bounce-medium" />
        <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-red-300/50 rounded-full animate-bounce-fast" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-red-600/40 rounded-full animate-bounce-slow" />
        
        {/* Chart-like bars */}
        <div className="absolute bottom-10 left-1/4 flex space-x-1">
          <div className="w-1 bg-red-300/40 animate-grow-slow" style={{ height: '20px', animationDelay: '0s' }} />
          <div className="w-1 bg-red-400/50 animate-grow-medium" style={{ height: '35px', animationDelay: '0.5s' }} />
          <div className="w-1 bg-red-500/40 animate-grow-fast" style={{ height: '25px', animationDelay: '1s' }} />
          <div className="w-1 bg-red-300/60 animate-grow-slow" style={{ height: '40px', animationDelay: '1.5s' }} />
          <div className="w-1 bg-red-400/45 animate-grow-medium" style={{ height: '30px', animationDelay: '2s' }} />
        </div>
        
        <div className="absolute top-1/2 right-1/4 flex flex-col space-y-1">
          <div className="h-1 bg-red-300/40 animate-grow-slow" style={{ width: '25px', animationDelay: '0.2s' }} />
          <div className="h-1 bg-red-400/50 animate-grow-medium" style={{ width: '40px', animationDelay: '0.7s' }} />
          <div className="h-1 bg-red-500/40 animate-grow-fast" style={{ width: '30px', animationDelay: '1.2s' }} />
          <div className="h-1 bg-red-300/60 animate-grow-slow" style={{ width: '35px', animationDelay: '1.7s' }} />
        </div>
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
    </div>
  )
}

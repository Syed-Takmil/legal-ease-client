'use client';

import React from 'react';
import Link from 'next/link';
import { MotionConfig } from 'framer-motion';
import Image from 'next/image';
import { motion } from 'framer-motion';
export default function FeaturedLawyersGrid({ lawyers }) {
  
  // Framer Motion layout configuration matrices
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  if (!lawyers || lawyers.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-[#0d0d0d] border border-neutral-900 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {lawyers.slice(0, 6).map((lawyer) => (
        <motion.div
          key={lawyer._id}
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl overflow-hidden hover:border-orange-500/20 transition-colors duration-300 flex flex-col group shadow-lg shadow-black/40"
        >
          {/* Avatar frame */}
          <div className="h-35 grid justify-center bg-neutral-950 relative overflow-hidden">
            <Image
            width={50}
            height={50}
              src={lawyer.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'} 
              alt={lawyer.name}
              className="w-20 h-fit object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
            <span className="absolute bottom-3 right-3 text-xs font-mono font-black text-orange-400 bg-neutral-950/80 px-2.5 py-1 border border-neutral-800 rounded-lg">
              ${lawyer.fee || '150'}/hr
            </span>
          </div>

          {/* Metadata content */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-neutral-950 px-2 py-0.5 border border-neutral-900 rounded-md">
                {lawyer.specialization || 'General Practice'}
              </span>
              <h3 className="text-base font-bold text-white tracking-tight pt-1">{lawyer.name}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 font-normal leading-relaxed">
                {lawyer.bio || 'No representation parameters mapped to profile.'}
              </p>
            </div>

            <Link 
              href={`/browse/${lawyer._id}`}
              className="h-10 w-full rounded-xl border border-neutral-800 text-zinc-400 font-bold text-xs hover:text-orange-400 hover:bg-neutral-950 transition-all flex items-center justify-center tracking-wide"
            >
              Analyze Credentials &rarr;
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
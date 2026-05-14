"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="pt-[140px] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#1444b4] via-[#2a5bd0] to-[#4974dd] rounded-3xl md:rounded-[2.5rem] overflow-hidden relative min-h-[auto] md:min-h-[600px] flex flex-col shadow-2xl">

        {/* Marquee Banner */}
        <div className="bg-[#4974dd] text-white py-3 border-b border-white/10 relative z-20">
          <Marquee autoFill gradient={false} speed={40}>
            <span className="mx-8 font-bold tracking-wider text-sm">SHARE INSTANTLY ↗</span>
            <span className="mx-8 font-bold tracking-wider text-sm">NO APP NEEDED ↗</span>
            <span className="mx-8 font-bold tracking-wider text-sm">WORKS ON IPHONE & ANDROID ↗</span>
            <span className="mx-8 font-bold tracking-wider text-sm">CUSTOM BRANDING ↗</span>
          </Marquee>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center p-6 md:p-16 relative z-10">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left text-white max-w-xl mx-auto lg:mx-0"
          >
            <p className="font-mono text-white/80 mb-6 tracking-widest text-sm uppercase">THE FUTURE OF NETWORKING</p>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[0.95]">
              Share Smarter. <br />
              Connect Faster.
            </h1>

            <p className="text-lg text-white/90 mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
              The smartest way to share your contact details. No app needed. Works on iPhone & Android.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-blue font-bold text-lg h-14 !px-6 rounded-full transition-all uppercase tracking-wide"
              >
                <Link href="https://sharecard.co.in/gowtham" target="_blank">
                  View Demo
                  {/* <ChevronRight className="ml-2 h-5 w-5" /> */}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual/Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full min-h-[250px] md:min-h-[400px] flex items-center justify-center"
          >
            <div className="relative w-72 h-48 md:w-96 md:h-60 bg-white rounded-3xl transform rotate-12 flex items-center justify-center p-8 transition-transform hover:scale-105 duration-500">
              <Image src="/logo.svg" width={180} height={50} alt="ShareCard" />
            </div>
          </motion.div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-400/20 blur-[100px] pointer-events-none" />
      </div>
    </section>
  );
};

"use client";

import React, { useState } from "react";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Wrench, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  BatteryCharging,
  Cpu,
  ChevronRight,
  Clock
} from "lucide-react";

export default function MobileStoreProfilePage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<"repairs" | "showcase" | "guarantee">("repairs");

  // Interactive Live Estimator State
  const [selectedDevice, setSelectedDevice] = useState<string>("iPhone 15 Pro Max");
  const [selectedRepair, setSelectedRepair] = useState<string>("oled");

  // Pricing Matrix Database Simulation
  const pricingMatrix: Record<string, Record<string, { price: number; eta: string; originalPrice: number }>> = {
    "iPhone 15 Pro Max": {
      oled: { price: 18500, originalPrice: 24000, eta: "20 Mins" },
      battery: { price: 4800, originalPrice: 6500, eta: "15 Mins" },
      glass: { price: 6500, originalPrice: 9000, eta: "30 Mins" },
      water: { price: 3500, originalPrice: 5000, eta: "45 Mins" }
    },
    "iPhone 14 Pro": {
      oled: { price: 14500, originalPrice: 19500, eta: "20 Mins" },
      battery: { price: 4200, originalPrice: 5800, eta: "15 Mins" },
      glass: { price: 5500, originalPrice: 7500, eta: "30 Mins" },
      water: { price: 3000, originalPrice: 4500, eta: "45 Mins" }
    },
    "Samsung Galaxy S24 Ultra": {
      oled: { price: 21000, originalPrice: 27500, eta: "25 Mins" },
      battery: { price: 5200, originalPrice: 7000, eta: "20 Mins" },
      glass: { price: 7500, originalPrice: 11000, eta: "35 Mins" },
      water: { price: 4000, originalPrice: 6000, eta: "45 Mins" }
    },
    "OnePlus 12 Flagship": {
      oled: { price: 12500, originalPrice: 16500, eta: "20 Mins" },
      battery: { price: 3800, originalPrice: 5000, eta: "15 Mins" },
      glass: { price: 4500, originalPrice: 6500, eta: "25 Mins" },
      water: { price: 2800, originalPrice: 4000, eta: "40 Mins" }
    }
  };

  const currentEstimate = pricingMatrix[selectedDevice]?.[selectedRepair] || { price: 0, originalPrice: 0, eta: "N/A" };

  // Showcase Products Database Simulation
  const showcaseProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro (256GB) - Natural Titanium",
      type: "Certified Pre-Owned Flagship",
      condition: "Pristine Grade A+ • 100% Battery",
      price: "₹82,500",
      savings: "Save ₹45,400 vs New",
      imageTag: "📱",
      badge: "Best Seller",
      specs: ["A17 Pro Chip", "Action Button Enabled", "Apple Care Certified"]
    },
    {
      id: 2,
      name: "iMobiles MagSafe Armor Hub (15W Fast Wireless)",
      type: "Premium Accessories Collection",
      condition: "Brand Sealed • 2-Year Direct Replacement",
      price: "₹2,499",
      savings: "50% Launch Discount",
      imageTag: "⚡",
      badge: "MagSafe Certified",
      specs: ["Strong Magnetic Lock", "Multi-Device Safety Sensor", "Braided Core Line"]
    },
    {
      id: 3,
      name: "Military-Grade Kevlar Drop Shell Case",
      type: "Heavy Duty Device Defense",
      condition: "Precision Cutouts • Raised Camera Bezel",
      price: "₹1,299",
      savings: "Includes Free High-Alumina Temper",
      imageTag: "🛡️",
      badge: "Drop Tested",
      specs: ["Shockproof Air Cushion", "Anti-Yellowing UV Coat", "Tactile CNC Keys"]
    }
  ];

  // Testimonials Array Simulation
  const testimonials = [
    {
      name: "Ravi Shankar",
      service: "iPhone 15 Pro Max Screen Replacement",
      rating: 5,
      date: "Yesterday",
      comment: "Absolutely mesmerizing speed! Dropped my phone at 10:15 AM, and by 10:35 AM the new OLED display was fully calibrated with TrueTone intact. Premium genuine parts at transparent costs."
    },
    {
      name: "Priyanka Desai",
      service: "Samsung S24 Ultra Battery Restore",
      rating: 5,
      date: "3 days ago",
      comment: "The live estimate calculator exactly matched the final invoice. No hidden service charges, fully certified OEM cells. My battery life is back to original factory stamina!"
    },
    {
      name: "Dr. Karthik Rajan",
      service: "Ultrasonic Water Recovery Protocol",
      rating: 5,
      date: "Last week",
      comment: "My phone fell into salt water and died instantly. iMobiles logic board team performed deep ultrasonic recovery and saved all my critical hospital medical logs. Truly life savers!"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-white pb-24">
      {/* Dynamic Embedded Styling Token System */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes floatEffect {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-status-beacon {
          animation: subtlePulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-device-float {
          animation: floatEffect 5s ease-in-out infinite;
        }
        /* Custom styled smooth scrollbars */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #020617;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />

      {/* Decorative Background Gradients Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/60 to-slate-950 pointer-events-none z-0" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Banner Notice */}
      <div className="relative z-10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-cyan-600/20 border-b border-cyan-500/20 py-2.5 px-4 text-center text-xs md:text-sm font-medium tracking-wide text-cyan-300 backdrop-blur-md flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>⚡ <strong>Special Client Offer:</strong> Free High-Alumina Tempered Glass Protection with every screen repair booked today</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* Profile Card Main Container */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          
          {/* Header Profile Identity */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            
            {/* Store Dynamic Avatar Wrapper */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-status-beacon" />
              <div className="relative w-24 h-24 md:w-28 md:h-28 bg-slate-950 rounded-2xl flex items-center justify-center border-2 border-slate-800 overflow-hidden shadow-inner">
                <span className="text-4xl md:text-5xl select-none animate-device-float">🛠️</span>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent py-1">
                  <p className="text-[9px] text-cyan-400 font-bold tracking-widest text-center uppercase">PREMIUM</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full ring-4 ring-slate-900 shadow-md" title="Store Operational Status">
                <ShieldCheck className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* Store Information Overview */}
            <div className="flex-grow">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-status-beacon" />
                <span>Store Open • Express Line Ready</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center md:justify-start gap-2.5">
                iMobiles Smart Care
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-md border border-cyan-500/30 font-mono tracking-normal align-middle">PRO</span>
              </h1>
              
              <p className="text-slate-400 text-sm md:text-base mt-1.5 max-w-xl leading-relaxed">
                Premium multi-brand smartphone hardware engineers & original flagship sales direct network. Delivering transparent estimates and surgical hardware replacements.
              </p>

              {/* Verified Trust Tokens */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <strong>4.9/5</strong> Verified Reviews
                </span>
                <span className="flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Grade A+ TrueTone Hardware
                </span>
                <span className="flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  20-Min Turnaround
                </span>
              </div>
            </div>

          </div>

          {/* Action Triggers Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-800/80">
            
            {/* Call Dispatch Action Trigger */}
            <a 
              href="tel:918220370550" 
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] transition-all duration-200"
            >
              <Phone className="w-5 h-5 fill-white/10" />
              <div className="text-left leading-tight">
                <div className="text-xs font-medium text-cyan-100">Direct Store Helpline</div>
                <div className="text-sm">Call Dispatch Now</div>
              </div>
            </a>

            {/* WhatsApp Direct Integration Trigger */}
            <a 
              href="https://wa.me/918220370550?text=Hi%20iMobiles%20Care,%20I%20am%20looking%20for%20an%20instant%20repair%20estimate%20for%20my%20smartphone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 fill-white/10" />
              <div className="text-left leading-tight">
                <div className="text-xs font-medium text-emerald-100">Fast Picture Consult</div>
                <div className="text-sm">WhatsApp Estimate</div>
              </div>
            </a>

            {/* Store Navigation Map Trigger */}
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-3 px-4 rounded-xl border border-slate-700 shadow active:scale-[0.98] transition-all duration-200"
            >
              <MapPin className="w-5 h-5 text-rose-400" />
              <div className="text-left leading-tight">
                <div className="text-xs font-medium text-slate-400">Offline Location</div>
                <div className="text-sm">Get Store Map</div>
              </div>
            </a>

          </div>

        </div>

        {/* Dynamic Nav Switcher Tabs Container */}
        <div className="mt-8">
          
          {/* iOS-Style Pill Switcher */}
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 max-w-xl mx-auto shadow-inner">
            <button
              onClick={() => setActiveTab("repairs")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "repairs" 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md" 
                : "text-slate-400 hover:text-slate-200"}`}
            >
              <Wrench className="w-4 h-4" />
              <span>Instant Repairs</span>
            </button>
            <button
              onClick={() => setActiveTab("showcase")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "showcase" 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md" 
                : "text-slate-400 hover:text-slate-200"}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Devices & Gears</span>
            </button>
            <button
              onClick={() => setActiveTab("guarantee")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "guarantee" 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md" 
                : "text-slate-400 hover:text-slate-200"}`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Quality & Reviews</span>
            </button>
          </div>

          {/* Interactive Views Rendering Container */}
          <div className="mt-6">
            
            {/* TAB 1: INSTANT REPAIRS & ESTIMATOR */}
            {activeTab === "repairs" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Immersive Live Estimator Module */}
                <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono px-3 py-1 rounded-bl-xl border-l border-b border-cyan-500/20 font-bold uppercase tracking-wider">
                    Client Interactive Tool
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Live Hardware Cost Estimator</h3>
                  </div>

                  <p className="text-xs text-slate-400 mb-6">
                    Select your flagship device and required hardware diagnostic layer below. Pricing automatically incorporates genuine factory parts and real-time technician bench setups.
                  </p>

                  {/* Device and Repair Selector Controls Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Device Choice Select */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                        1. Target Flagship Model
                      </label>
                      <select 
                        value={selectedDevice} 
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition cursor-pointer"
                      >
                        {Object.keys(pricingMatrix).map((device) => (
                          <option key={device} value={device}>{device}</option>
                        ))}
                      </select>
                    </div>

                    {/* Repair Choice Select */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                        2. Certified Hardware Repair Line
                      </label>
                      <select 
                        value={selectedRepair} 
                        onChange={(e) => setSelectedRepair(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition cursor-pointer"
                      >
                        <option value="oled">🖥️ Grade A+ OLED/Display Assembly</option>
                        <option value="battery">🔋 OEM Cell Replacement (100% Core)</option>
                        <option value="glass">💎 Back Cover Laser Glass Restoration</option>
                        <option value="water">🌊 Deep Ultrasonic Liquid Recovery</option>
                      </select>
                    </div>

                  </div>

                  {/* Result Live Banner Matrix */}
                  <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div className="text-center sm:text-left">
                      <div className="text-xs text-slate-400 font-medium">Estimated Guaranteed Upfront Invoice</div>
                      <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
                        <span className="text-2xl md:text-3xl font-black text-cyan-400">
                          ₹{currentEstimate.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ₹{currentEstimate.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                          Parts Included
                        </span>
                      </div>
                    </div>

                    <div className="h-px sm:h-10 w-full sm:w-px bg-slate-800" />

                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20 text-blue-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-slate-400 font-medium">Turnaround Speed</div>
                        <div className="text-sm font-bold text-white tracking-wide">{currentEstimate.eta} Express Dispatch</div>
                      </div>
                    </div>

                  </div>

                  {/* Booking Trigger Link */}
                  <div className="mt-5 text-center">
                    <a 
                      href={`https://wa.me/918220370550?text=Lock%20Estimate:%20${selectedDevice}%20(${selectedRepair})%20-%20%E2%82%B9${currentEstimate.price}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold tracking-wide transition group"
                    >
                      <span>Lock this dynamic setup direct via secure chat dispatch</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                </div>

                {/* Grid Overview of Primary Tier Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Service Item 1 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                    <div className="flex items-start justify-between">
                      <div className="bg-slate-950 p-2.5 rounded-xl text-cyan-400 border border-slate-800">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/50 px-2 py-0.5 rounded">
                        TrueTone Transfer
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-3">Display Assembly Calibrations</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Surgical multi-layer hardware switch protecting touch responsive sensors, biometrics, and active TrueTone IC protocols seamlessly.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span>Lifetime Touch Coverage</span>
                      <strong className="text-white">From ₹4,500</strong>
                    </div>
                  </div>

                  {/* Service Item 2 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                    <div className="flex items-start justify-between">
                      <div className="bg-slate-950 p-2.5 rounded-xl text-blue-400 border border-slate-800">
                        <BatteryCharging className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono bg-blue-950 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded">
                        100% Certified Core
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-3">High-Density Battery Restorations</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Replacement of depleted single and dual configuration polymer packs restoring optimal system processing throttle and multi-day standby duration.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span>Includes Waterproof Seal</span>
                      <strong className="text-white">From ₹2,800</strong>
                    </div>
                  </div>

                  {/* Service Item 3 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                    <div className="flex items-start justify-between">
                      <div className="bg-slate-950 p-2.5 rounded-xl text-emerald-400 border border-slate-800">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded">
                        Micro-Soldering
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-3">Logic Board Level Recovery</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Advanced short circuit trace repairs, charging control PMIC adjustments, and internal data continuity mapping via precise heat tools.
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span>No Fix, Zero Cost Strategy</span>
                      <strong className="text-white">Upon Diagnostic</strong>
                    </div>
                  </div>

                  {/* Service Item 4 */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="bg-slate-950 p-2.5 rounded-xl text-rose-400 border border-slate-800">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono bg-rose-950 text-rose-400 border border-rose-800/50 px-2 py-0.5 rounded">
                          Urgent Priority
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-3">Laser Back-Panel Replacements</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Precision CNC guided rear crystal disassembly perfectly protecting underlying wireless inductive rings and rear sensor lenses.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span>Original Factory Match</span>
                      <strong className="text-white">From ₹3,500</strong>
                    </div>
                  </div>

                </div>

              </div>
            )}


            {/* TAB 2: CERTIFIED SHOWCASE PRODUCTS */}
            {activeTab === "showcase" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>🛍️ Displaying original inspected units & extreme armor accessories directly available for physical audit</span>
                  <span className="font-semibold text-slate-300">3 Verified Listings</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {showcaseProducts.map((product) => (
                    <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:border-slate-700 transition">
                      
                      {/* Product Preview Icon Placeholder */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-3xl flex-shrink-0 self-center sm:self-auto">
                        {product.imageTag}
                      </div>

                      {/* Details Segment */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                            {product.type}
                          </span>
                          <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-medium">
                            {product.badge}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white tracking-tight">{product.name}</h4>
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">{product.condition}</p>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {product.specs.map((spec, index) => (
                            <span key={index} className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                              • {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing and Direct Hold Link */}
                      <div className="sm:border-l sm:border-slate-800 sm:pl-5 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-850 flex-shrink-0 gap-3">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-slate-500 line-through block font-medium">{product.savings}</div>
                          <div className="text-xl font-black text-white">{product.price}</div>
                        </div>
                        <a 
                          href={`https://wa.me/918220370550?text=Hold%20Listing:%20${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs py-2 px-3.5 rounded-lg transition tracking-wide text-center"
                        >
                          Hold Item
                        </a>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* TAB 3: QUALITY GUARANTEE & VERIFIED REVIEWS */}
            {activeTab === "guarantee" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Immersive Store Quality Standards Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Direct Sourced Spares</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All micro-chips and laminated displays pass clean serial validation before bench release to preserve exact manufacturing standards.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Transparent Strategy</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Surgical inspection done right in front of client view. Old extracted core displays and sub-panels returned back directly to customers.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1.5">
                      <Star className="w-4 h-4" />
                      <span>Lifetime Warranty Link</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Zero latency hardware validation guarantees fast replacement support if parts fail under continuous thermal operation limits.
                    </p>
                  </div>

                </div>

                {/* Verified Testimonials Display */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span>Recent Customer Work Records</span>
                    <span className="h-px flex-grow bg-slate-800" />
                  </h3>

                  <div className="space-y-3">
                    {testimonials.map((t, index) => (
                      <div key={index} className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 relative">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-bold text-white block">{t.name}</span>
                            <span className="text-[11px] text-cyan-400 font-medium">{t.service}</span>
                          </div>
                          <div className="text-right">
                            <div className="flex gap-0.5 text-amber-400">
                              {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{t.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          &quot;{t.comment}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Offline Call Dispatch Trigger Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center space-y-3">
                  <h4 className="text-sm font-bold text-slate-200">Have a customized diagnostic concern?</h4>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto">
                    Direct access available directly via smartphone call queues. Offline technicians handle thermal board tests and liquid recoveries instantly.
                  </p>
                  <div className="pt-2">
                    <a 
                      href="tel:918220370550"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow transition hover:bg-slate-200 active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Direct Store Dial Connection</span>
                    </a>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Standalone Sleek Bottom Footprint */}
      <footer className="absolute bottom-0 inset-x-0 py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 iMobiles Premium Care Direct Client Delivery. All hardware registered to respective flagships.</p>
      </footer>
    </div>
  );
}

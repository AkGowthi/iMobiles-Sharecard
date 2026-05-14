"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ScanLine } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  // Hide Navbar on specific routes
  if (pathname === "/create-card") {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const sections = ["features", "products", "comparison"];

  // Define pages where features navigation should be hidden
  const hideFeaturesNav = ["/help-center", "/terms", "/privacy"].includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better detection
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-xl border-b border-white/20 mx-4 md:mx-40 shadow-lg rounded-b-3xl md:rounded-b-[2.5rem]">
      <div className="max-w-5xl md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-[100px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex justify-between items-center gap-2"
            onClick={() => setActiveSection("")}
          >
            <Image
              src="/logo.svg"
              alt="ShareCard Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Links */}
          {!hideFeaturesNav && (
            <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
              {[
                { name: "Features", href: "#features", id: "features" },
                { name: "About", href: "#products", id: "products" },
                { name: "Why Us", href: "#comparison", id: "comparison" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors font-bold text-[17px] tracking-tight ${activeSection === item.id
                    ? "text-primary-blue"
                    : "text-gray-900 hover:text-primary-blue"
                    } `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden md:flex items-center gap-6">

            {/* Scan Icon Link */}
            {/* <Link
              href="/scan"
              className="flex items-center gap-2 text-gray-900 hover:text-primary-blue transition-colors font-bold text-[17px]"
              title="Scan Visiting Card"
            >
              <ScanLine className="w-6 h-6" />
              <span className="hidden lg:inline">Scan</span>
            </Link> */}

            <Button
              asChild
              className="bg-primary-blue hover:bg-secondary-blue text-white rounded-full px-8 h-12 font-bold text-base shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="https://wa.me/918220370550?text=Hi%2C%20I%20am%20interested%20in%20ShareCard" target="_blank">
                Get Your Card
              </Link>
            </Button>


          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 cursor-pointer"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white rounded-b-3xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {!hideFeaturesNav && (
                <>
                  {[
                    { name: "Features", href: "#features", id: "features" },
                    { name: "About", href: "#products", id: "products" },
                    { name: "Why Us", href: "#comparison", id: "comparison" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-medium ${activeSection === item.id
                        ? "text-primary-blue"
                        : "text-gray-900 hover:text-primary-blue"
                        } `}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              <Button asChild className="bg-primary-blue hover:bg-secondary-blue rounded-full w-full">
                <Link href="https://wa.me/918220370550?text=Hi%2C%20I%20am%20interested%20in%20ShareCard" target="_blank">
                  Get Your Card
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

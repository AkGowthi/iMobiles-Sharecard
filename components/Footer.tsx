"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { FaThreads } from "react-icons/fa6";

export const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/create-card") {
    return null;
  }

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="ShareCard Logo"
                width={120}
                height={35}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              The last business card you'll ever need. Connect instantly, share
              limitlessly, and make a lasting impression.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#products" className="hover:text-primary-blue">
                  PVC Cards
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-primary-blue">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#comparison" className="hover:text-primary-blue">
                  Why Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help-center" className="hover:text-primary-blue">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-blue">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-blue">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <div className="flex gap-4 text-gray-600">
              <Link href="https://linkedin.com/company/share-card/" target="_blank" className="hover:text-primary-blue transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="https://www.instagram.com/_sharecard/" target="_blank" className="hover:text-primary-blue transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="https://www.threads.com/@_sharecard" target="_blank" className="hover:text-primary-blue transition-colors">
                <FaThreads size={20} />
              </Link>
              <Link href="https://www.youtube.com/@share_card" target="_blank" className="hover:text-primary-blue transition-colors">
                <Youtube size={20} />
              </Link>
              <Link href="https://www.facebook.com/sharecardnutz" target="_blank" className="hover:text-primary-blue transition-colors">
                <Facebook size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ShareCard. All rights reserved.
          </p>
          <div className="font-ubuntu text-gray-400 text-sm flex items-center gap-1">
            a product by{" "}
            <Link
              href="https://nutz.in"
              target="_blank"
              className="text-gray-600 font-bold hover:text-primary-blue transition-colors"
            >
              nutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

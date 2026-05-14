import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { ProductDetails } from "@/components/sections/ProductDetails";
import { Comparison } from "@/components/sections/Comparison";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <Features />
      <ProductDetails />
      <Comparison />
      <CTA />
    </div>
  );
}

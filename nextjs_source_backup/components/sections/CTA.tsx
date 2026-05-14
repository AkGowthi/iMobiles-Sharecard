import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary-blue to-secondary-blue rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to Upgrade Your Network?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals who have switched to the smarter way of connecting. Get your ShareCard today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary-blue hover:bg-gray-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl">
              <Link href="https://wa.me/918220370550?text=Ready%20to%20upgrade%20to%20ShareCard" target="_blank">
                Order Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white h-14 px-10 rounded-full text-lg font-medium">
              <Link href="tel:+918220370550">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

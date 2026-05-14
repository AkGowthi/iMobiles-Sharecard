import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Shield, Wifi, Zap } from "lucide-react";

export const ProductDetails = () => {
  return (
    <section id="products" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-secondary-blue mb-4">
            Premium PVC NFC Cards
          </h2>
          <p className="text-gray-600 text-lg">
            Durable, waterproof, and completely customizable. Choose the perfect plan for you or your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-400 group-hover:from-primary-blue group-hover:to-secondary-blue transition-all" />

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-900">Standard Card</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">₹750</span>
                <span className="text-gray-500">/card</span>
              </div>
              <p className="text-sm text-gray-500">Perfect for individuals and freelancers starting their networking journey.</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "High-Quality PVC Material",
                "Custom Branding",
                "QR Code fallback",
                "Free Digital Profile",
                "Lifetime Validity"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-primary-blue">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button asChild className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:text-primary-blue font-semibold h-12 rounded-xl">
              <Link href="https://rzp.io/rzp/bHuVEXc5" target="_blank">
                Choose Standard
              </Link>
            </Button>
          </div>

          {/* Bulk/Team Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-primary-blue/10 relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Best Value
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-primary-blue">Bulk Orders</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">₹600</span>
                <span className="text-gray-500">/card</span>
              </div>
              <p className="text-sm text-gray-500">For teams of 25+. Unified branding and management for your organization.</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Everything in Standard",
                "Significant Cost Savings",
                "Dedicated Account Manager",
                "Centralized Dashboard",
                "Priority Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-primary-blue">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button asChild className="w-full bg-gradient-to-r from-primary-blue to-secondary-blue text-white hover:opacity-90 font-semibold h-12 rounded-xl shadow-lg shadow-blue-500/20">
              <Link href="https://rzp.io/rzp/Rkfslf3" target="_blank">
                Choose Bulk Plan
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        {/* <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wifi, title: "NFC Technology", desc: "Share instantly with a tap." },
            { icon: Zap, title: "Dynamic QR", desc: "Update content anytime." },
            { icon: Shield, title: "Secure Data", desc: "Bank-grade encryption." },
            { icon: Check, title: "Offline Ready", desc: "Works without internet." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer">
              <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-primary-blue mb-4">
                <item.icon size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

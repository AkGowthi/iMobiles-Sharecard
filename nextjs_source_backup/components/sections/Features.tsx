import { Laptop, Palette, Link2, RefreshCw, ScanLine, UserPlus, CalendarDays, ShoppingBag } from "lucide-react";

export const Features = () => {
  const features = [
    {
      title: "Custom Branding",
      description: "Complete design freedom with full-color custom printing.",
      icon: Palette,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Integrated Link Hub",
      description: "Connect your social media, portfolio, and website instantly.",
      icon: Link2,
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      title: "Update Anytime",
      description: "Update your digital profile instantly. The card stays the same.",
      icon: RefreshCw,
      gradient: "from-amber-400 to-orange-500"
    },
    {
      title: "Cross-Platform",
      description: "Works seamlessly on iOS and Android without installing any app.",
      icon: Laptop,
      gradient: "from-emerald-400 to-green-500"
    },
    {
      title: "Smart Card Scanner",
      description: "Scan physical business cards and save them directly to your contacts.",
      icon: ScanLine,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Instant Lead Capture",
      description: "Capture prospect details directly from your profile effortlessly.",
      icon: UserPlus,
      gradient: "from-teal-400 to-emerald-500"
    },
    {
      title: "Appointment Booking",
      description: "Let clients schedule meetings with you directly from your card.",
      icon: CalendarDays,
      gradient: "from-red-400 to-rose-500"
    },
    {
      title: "Product Showcases",
      description: "Add direct shopping links to your special products and boost sales.",
      icon: ShoppingBag,
      gradient: "from-fuchsia-500 to-pink-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Choose ShareCard?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine premium hardware with powerful software to give you the ultimate networking tool.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group relative p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

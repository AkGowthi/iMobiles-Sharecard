import React from "react";
import Image from "next/image";
import { Mail, MapPin, Phone, Instagram, Linkedin, Youtube, Facebook, Globe, Link as LinkIcon, Building2, Wrench, Image as ImageIcon, Eye, Star } from "lucide-react";
import { FaWhatsapp, FaBehance, FaXTwitter } from "react-icons/fa6";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { AddToContactsButton } from "@/components/features/public-profile/add-to-contacts-button";
import { ExchangeContactModal } from "@/components/features/public-profile/exchange-contact-modal";
import { BookingModal } from "@/components/features/public-profile/booking-modal";

interface SocialHandle {
    id: number;
    type_id: number;
    soc_link: string;
}

interface PositionItem {
    title: string;
    org: string;
}

interface ProductItem {
    prod_name: string;
    prod_description: string;
    prod_type: string;
    prod_price: number;
    prod_images: string[];
    prod_url: string;
}

interface GalleryItem {
    image_url: string;
}

interface StaticProfile {
    id: number;
    f_name: string;
    l_name: string;
    profession: string;
    company_name: string;
    company_description: string;
    company_website: string;
    bio: string;
    address: string;
    map_url: string;
    email: string;
    phone_no: string;
    userImage: string;
    business_logo: string;
    socialHandles: SocialHandle[];
    positions: PositionItem[];
    services: string[];
    products: ProductItem[];
    gallery: GalleryItem[];
    brochure: string;
    theme_color: string;
    button_color: string;
    card_layout: string;
    booking_url: string;
}

export default function RootPublicProfilePage() {
    // Static Pre-populated Profile matching ShareCard db spec for completely backend-less static deployment
    const profile: StaticProfile = {
        id: 1,
        f_name: "Karthikeyan",
        l_name: "",
        profession: "Managing Partner",
        company_name: "iMobile Multibrand Showroom",
        company_description: "At iMobiles, it's not just about selling phones — it's about building future Entrepreneurs.",
        company_website: "https://www.imobilesonline.com/",
        bio: "Start your own mobile business with a trusted brand. Safe investment, high returns, and complete business support.",
        address: "iMobiles Smart Care Center",
        map_url: "https://maps.app.goo.gl/iXrCRcqG3aG7WL2P7",
        email: "franchiseimobiles@gmail.com",
        phone_no: "9443383084",
        userImage: "/karthikeyan_dp.jpg",
        business_logo: "", 
        socialHandles: [
            { id: 1, type_id: 1, soc_link: "9443383084" }, // Whatsapp
            { id: 2, type_id: 2, soc_link: "https://www.instagram.com/imobiles.india?igsh=YWdzdnliZ2JpY25y" }, // Instagram
        ],
        positions: [
            { title: "Chennai | Pondicherry | Cuddalore | Madurai | Coimbatore | Erode | Tiruppur | Namakkal | Trichy | Dharmapuri | Denkanikottai | Hosur | Bhavani | Tiruchengode | Perundurai | Pallipalayam", org: "iMobile Showrooms" }
        ],
        services: [
            "Franchise Opportunity: Start Your own Mobile Business with a Trusted Brand",
            "Safe investment – High returns",
            "Complete business support",
            "Strong brand presence",
            "Ideal for entrepreneurs & investors",
            "Grade A+ OLED/Display Assembly Surgical Calibration",
            "Certified OEM Cell Replacement (100% Core Health)",
            "Laser Back Cover Glass Restoration Protocol",
            "Deep Ultrasonic Liquid Recovery & Medical Data Rescue"
        ],
        products: [
            {
                prod_name: "iPhone 15 Pro (256GB) - Natural Titanium",
                prod_description: "Pristine Grade A+ • 100% Battery Health. Apple Care Certified.",
                prod_type: "Physical",
                prod_price: 82500,
                prod_images: [],
                prod_url: "https://wa.me/919443383084?text=Inquiry:%20iPhone%2015%20Pro"
            },
            {
                prod_name: "iMobiles MagSafe Armor Hub (15W)",
                prod_description: "Brand Sealed • 2-Year Direct Replacement Guarantee.",
                prod_type: "Physical",
                prod_price: 2499,
                prod_images: [],
                prod_url: "https://wa.me/919443383084?text=Inquiry:%20MagSafe%20Hub"
            }
        ],
        gallery: [
            { image_url: "/gallery/store_front.jpeg" },
            { image_url: "/gallery/interior_view.jpeg" },
            { image_url: "/gallery/service_center.jpeg" },
            { image_url: "/gallery/premium_showcase.jpeg" },
            { image_url: "/gallery/accessories_rack.jpeg" },
            { image_url: "/gallery/client_lounge.jpeg" }
        ],
        brochure: "/iMobiles_50L_Plan Brochure.pdf",
        theme_color: "#FFFFFF",
        button_color: "#1B54E0",
        card_layout: "accordion",
        booking_url: ""
    };

    const { id, f_name, profession, company_name, company_description, company_website, map_url, email, phone_no, userImage, business_logo, socialHandles, gallery, brochure, theme_color, button_color, booking_url } = profile;
    const fullName = `${f_name}`.trim();

    // Default colors
    const bgTheme = theme_color || "#FFFFFF";
    const btnColor = button_color || "#1B54E0";

    const servicesList: string[] = profile.services || [];
    const positionsList: PositionItem[] = profile.positions || [];

    return (
        <div className="min-h-screen flex justify-center font-sans text-gray-900 dark:text-gray-100" style={{ backgroundColor: bgTheme }}>
            <div className="w-full max-w-md min-h-screen relative pb-4 transition-colors duration-300" style={{ backgroundColor: bgTheme }}>

                {/* Top Header without edit mode triggers */}
                <div className="h-16 flex items-center justify-between sticky top-0 bg-opacity-80 backdrop-blur-md px-5 z-50 transition-colors duration-300" style={{ backgroundColor: bgTheme === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : bgTheme }}>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-gray-900 dark:text-gray-100 cursor-default">
                            ShareCard
                        </span>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="mt-4 px-5">
                    <div className="flex justify-between items-start gap-2 mb-4">
                        {/* Left: User Image */}
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-zinc-800">
                            {userImage ? (
                                <Image src={userImage} alt={fullName} width={96} height={96} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-3xl font-bold">
                                    {f_name?.[0]}
                                </div>
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold my-1">{fullName}</h1>
                    {profession && <p className="text-gray-600 dark:text-gray-400 text-base font-medium pb-1">{profession}</p>}
                    {company_name && <p className="text-gray-500 dark:text-gray-500 text-sm">{company_name}</p>}

                    {/* Contact & Social Icons Row decoupled from server analytics actions */}
                    {(phone_no || email || (socialHandles && socialHandles.length > 0)) && (
                        <div className="flex flex-nowrap gap-2 mt-4 mb-6 overflow-x-auto pb-2 brand-scrollbar">
                            {/* Phone Icon */}
                            {phone_no && (
                                <a
                                    href={`tel:${phone_no}`}
                                    className="w-14 h-14 rounded-full border border-gray-500 dark:border-zinc-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                >
                                    <Phone className="w-6 h-6" style={{ color: btnColor }} />
                                </a>
                            )}

                            {/* Social Icons */}
                            {socialHandles && socialHandles.length > 0 && socialHandles.map((handle: SocialHandle) => {
                                const typeId = Number(handle.type_id);
                                let icon = <LinkIcon className="w-6 h-6" style={{ color: btnColor }} />;
                                let href = handle.soc_link;

                                switch (typeId) {
                                    case 1: icon = <FaWhatsapp className="w-6 h-6" style={{ color: btnColor }} />; break;
                                    case 2: icon = <Instagram className="w-6 h-6" style={{ color: btnColor }} />; break;
                                    case 3: icon = <Globe className="w-6 h-6" style={{ color: btnColor }} />; break;
                                    case 4: icon = <Linkedin className="w-6 h-6" style={{ color: btnColor }} />; break;
                                    case 5: icon = <Youtube className="w-6 h-6" style={{ color: btnColor }} />; break;
                                    case 6: icon = <Facebook className="w-6 h-6" style={{ color: btnColor }} />; break;
                                    case 7: icon = <FaXTwitter className="w-6 h-6" style={{ color: btnColor }} />; break;
                                    case 8: icon = <FaBehance className="w-6 h-6" style={{ color: btnColor }} />; break;
                                }

                                if (typeId === 1) {
                                    const cleanNum = handle.soc_link.replace(/\D/g, '');
                                    href = `https://wa.me/91${cleanNum}`;
                                } else {
                                    if (!href.startsWith('http')) {
                                        href = `https://${href}`;
                                    }
                                }

                                return (
                                    <a
                                        key={handle.id}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 rounded-full border border-gray-500 dark:border-zinc-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                    >
                                        {icon}
                                    </a>
                                );
                            })}

                            {/* Mail Icon */}
                            {email && (
                                <a
                                    href={`mailto:${email}`}
                                    className="w-14 h-14 rounded-full border border-gray-500 dark:border-zinc-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                >
                                    <Mail className="w-6 h-6" style={{ color: btnColor }} />
                                </a>
                            )}
                        </div>
                    )}

                    <div className="mb-4">
                        {booking_url && (
                            <div className="mb-3">
                                <BookingModal bookingUrl={booking_url} buttonColor={btnColor} />
                            </div>
                        )}
                        <AddToContactsButton
                            profile={profile}
                            buttonColor={btnColor}
                            profileId={String(id)}
                        />
                        <ExchangeContactModal profileId={String(id)} profileName={fullName} buttonColor={btnColor} />
                    </div>
                </div>

                {/* Content Sections - Authentic ShareCard Accordion layout design */}
                <Accordion type="multiple" className="w-full px-5">
                    {/* About Us Section */}
                    <AccordionItem value="about-us" className="">
                        <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gray-600" />
                                About Us
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="pb-4 space-y-6">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-blue-600 uppercase text-xs tracking-wider">Our Story</h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-3 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Trusted Since 2012:</strong> We have over a decade of experience as a leading multi-brand mobile showroom.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Quality You Can Trust:</strong> Our mission is to provide 100% genuine products and the latest technology to every customer.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Strong Leadership:</strong> Led by our Founder, Mr. Sasikumar, we prioritize honesty, sincerity, and real value.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Customer First:</strong> We are known for our reliable service and the dedicated support we offer to every shopper.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Growing Together:</strong> We are now expanding through our new Franchise Model, helping new entrepreneurs start their own successful businesses.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                        <h5 className="text-xs font-bold text-gray-500 uppercase mb-1">Current Reach</h5>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">22+ Current Stores</p>
                                        <p className="text-xs text-blue-600">6 Upcoming Stores</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                        <h5 className="text-xs font-bold text-gray-500 uppercase mb-1">Vision 2027</h5>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">100+ Outlets</p>
                                        <p className="text-xs text-blue-600">in Tamilnadu</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <h5 className="text-xs font-bold text-blue-600 uppercase mb-1">Our Mission</h5>
                                    <p className="text-base font-bold text-gray-900">600 Outlets across India</p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Business Info Section */}
                    {(business_logo || company_name || company_description || company_website || brochure) ? (
                        <AccordionItem value="business-info" className="">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-gray-600" />
                                    Business Info
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="pb-4">
                                    {business_logo && (
                                        <div className="flex justify-start pt-2 pb-4">
                                            <Image
                                                src={business_logo}
                                                alt="Company Logo"
                                                width={200}
                                                height={64}
                                                className="h-16 w-auto object-contain max-w-[200px]"
                                            />
                                        </div>
                                    )}
                                    {company_name && (
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 pb-2">
                                            {company_name}
                                        </div>
                                    )}
                                    {company_description && (
                                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pb-3">
                                            <p>{company_description}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 pb-4">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: btnColor }} />
                                            <span className="text-xs text-gray-500 font-medium">Helpline:</span>
                                            <a href="tel:9888644442" className="text-sm font-bold text-gray-900 dark:text-gray-100 hover:underline">
                                                9888644442
                                            </a>
                                        </div>
                                    </div>
                                    {company_website && (
                                        <div className="flex gap-4 flex-wrap">
                                            <a
                                                href={company_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 font-medium hover:underline cursor-pointer"
                                                style={{ color: btnColor }}
                                            >
                                                <Globe className="w-4 h-4" />
                                                Visit Website
                                            </a>
                                            {map_url && (
                                                <a
                                                    href={map_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-[#1b54e0] font-medium hover:underline cursor-pointer"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    View Location
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {brochure && (
                                        <div className="pt-4 flex justify-start">
                                            <a
                                                href={brochure}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gray-500 dark:border-zinc-800 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer text-gray-900 dark:text-gray-100"
                                            >
                                                <Eye className="w-5 h-5" />
                                                View Brochure
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ) : null}

                    {/* Branches Section */}
                    {positionsList.length > 0 ? (
                        <AccordionItem value="positions" className="">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    Branches
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pb-4">
                                    {positionsList.map((pos: PositionItem, i: number) => (
                                        <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50/50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                            <div>
                                                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">Chennai | Pondicherry | Cuddalore | Madurai | Coimbatore | Erode | Tiruppur | Namakkal | Trichy | Dharmapuri | Denkanikottai | Hosur | Bhavani | Tiruchengode | Perundurai | Pallipalayam</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ) : null}

                    <AccordionItem value="why-imobiles" className="">
                        <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-gray-600" />
                                Why iMobiles Franchise
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="pb-4 space-y-4">
                                <p className="font-bold text-blue-600">When you become a IMOBILES Franchise Partner:</p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-xs text-blue-600">1</div>
                                        <span className="text-base text-gray-700 dark:text-gray-300">Profitable Location Choosing</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-xs text-blue-600">2</div>
                                        <span className="text-base text-gray-700 dark:text-gray-300">Store Setup- Interior</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-xs text-blue-600">3</div>
                                        <span className="text-base text-gray-700 dark:text-gray-300">Smart Inventry(Stocks)</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-xs text-blue-600">4</div>
                                        <span className="text-base text-gray-700 dark:text-gray-300">Onsite Training</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-xs text-blue-600">5</div>
                                        <span className="text-base text-gray-700 dark:text-gray-300">Manpower Support- From Head Office</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-xs text-blue-600">6</div>
                                        <span className="text-base text-gray-700 dark:text-gray-300">Day to Day Tracking & Sales Drive</span>
                                    </li>
                                </ul>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Services Section */}
                    {servicesList.length > 0 ? (
                        <AccordionItem value="services" className="">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Wrench className="w-5 h-5 text-gray-600" />
                                    Services
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-base text-gray-700 dark:text-gray-300 marker:text-gray-400 pb-4">
                                    {servicesList.map((service: string, i: number) => (
                                        <li key={i} className="pl-1">{service}</li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ) : null}

                    {/* Gallery Section */}
                    {gallery && gallery.length > 0 ? (
                        <AccordionItem value="gallery" className="border-b-0">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-gray-600" />
                                    Gallery
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-4">
                                    {gallery.map((img: GalleryItem, i: number) => (
                                        <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 relative">
                                            <Image src={img.image_url} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ) : null}
                </Accordion>

                {/* Footer Actions */}
                <div className="mt-8 space-y-6">
                    <div className="text-center pb-6">
                        <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1.5">
                            Powered by
                            <a href="https://sharecard.co.in" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                <Image
                                    src="/ShareCard Logo.svg"
                                    alt="ShareCard"
                                    width={80}
                                    height={20}
                                    className="h-5 w-auto grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all"
                                    style={{ width: 'auto' }}
                                />
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

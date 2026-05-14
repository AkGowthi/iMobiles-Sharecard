import React from "react";
import Image from "next/image";
import { Mail, MapPin, Phone, Briefcase, Instagram, Linkedin, Youtube, Facebook, Globe, Link as LinkIcon, Building2, Wrench, Package, Image as ImageIcon, ExternalLink, Eye } from "lucide-react";
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
        company_name: "iMobiles Premium Care",
        company_description: "Premium multi-brand smartphone hardware engineers & original flagship sales direct network. Delivering upfront transparent estimates and certified surgical logic board hardware replacements.",
        company_website: "https://www.instagram.com/imobiles.india?igsh=YWdzdnliZ2JpY25y",
        bio: "Authorized direct delivery setup handling liquid diagnostic protocols and micro-chip spares.",
        address: "iMobiles Smart Care Center",
        map_url: "https://maps.google.com",
        email: "franchiseimobiles@gmail.com",
        phone_no: "9443383084",
        userImage: "/karthikeyan_dp.jpg",
        business_logo: "", 
        socialHandles: [
            { id: 1, type_id: 1, soc_link: "9443383084" }, // Whatsapp
            { id: 2, type_id: 2, soc_link: "https://www.instagram.com/imobiles.india?igsh=YWdzdnliZ2JpY25y" }, // Instagram
        ],
        positions: [
            { title: "Managing Partner", org: "iMobiles Smart Care Network" }
        ],
        services: [
            "🖥️ Grade A+ OLED/Display Assembly Surgical Calibration",
            "🔋 Certified OEM Cell Replacement (100% Core Health)",
            "💎 Laser Back Cover Glass Restoration Protocol",
            "🌊 Deep Ultrasonic Liquid Recovery & Medical Data Rescue"
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

    const { id, f_name, profession, company_name, company_description, company_website, map_url, email, phone_no, userImage, business_logo, socialHandles, products, gallery, brochure, theme_color, button_color, booking_url } = profile;
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

                    {/* Positions Section */}
                    {positionsList.length > 0 ? (
                        <AccordionItem value="positions" className="">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-gray-600" />
                                    Positions
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pb-4">
                                    {positionsList.map((pos: PositionItem, i: number) => (
                                        <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50/50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                            <div>
                                                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{pos.title}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{pos.org}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ) : null}

                    {/* Products Section */}
                    {products && products.length > 0 ? (
                        <AccordionItem value="products" className="">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-600" />
                                    Products
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-2 gap-3 pb-4">
                                    {products.map((prod: ProductItem, i: number) => {
                                        const images = prod.prod_images || [];

                                        return (
                                            <a
                                                key={i}
                                                href={prod.prod_url || '#'}
                                                target={prod.prod_url ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                className={`${!prod.prod_url ? 'cursor-default pointer-events-none' : 'cursor-pointer'} group block`}
                                            >
                                                <div className="h-full dark:bg-zinc-900 dark:border-zinc-800">
                                                    <div>
                                                        {images && images[0] ? (
                                                            <div className="aspect-square relative mb-2 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                                <Image src={images[0]} alt={prod.prod_name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                                                            </div>
                                                        ) : (
                                                            <div className="aspect-square relative mb-2 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                                                <Package className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <h4 className="font-semibold text-base line-clamp-1 text-gray-900 dark:text-gray-100" title={prod.prod_name}>{prod.prod_name}</h4>
                                                        {prod.prod_description && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1 line-clamp-2" title={prod.prod_description}>
                                                                {prod.prod_description}
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-2 flex items-center gap-1">
                                                            {(prod.prod_type === 'Physical' && prod.prod_price > 0) ? `₹${prod.prod_price} • ` : ''}
                                                            <span className="group-hover:underline">View Product</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ) : null}

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

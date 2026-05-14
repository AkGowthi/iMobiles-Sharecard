
import { getProfileBySlug } from "@/lib/data/user-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Briefcase, MoveLeft, ArrowRight, Instagram, Linkedin, Youtube, Facebook, Globe, Link as LinkIcon, Building2, Wrench, Package, Image as ImageIcon, ExternalLink, CloudDownload, Eye } from "lucide-react";
import { FaWhatsapp, FaBehance, FaXTwitter } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { auth } from "@/auth";
import { ProfileActions } from "@/components/features/public-profile/profile-actions";
import { AddToContactsButton } from "@/components/features/public-profile/add-to-contacts-button";
import { ExchangeContactModal } from "@/components/features/public-profile/exchange-contact-modal";
import { ViewTracker } from "@/components/features/analytics/view-tracker";
import { TrackingLink } from "@/components/features/analytics/tracking-link";
import { FloatingContactButton } from "@/components/features/public-profile/floating-contact-button";
import { EmptySectionPlaceholder } from "@/components/features/public-profile/empty-section-placeholder";
import { BookingModal } from "@/components/features/public-profile/booking-modal";

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let session = null;
    try {
        session = await auth();
    } catch (e) {
        console.error("Auth session failed (likely stale cookie):", e);
        // proceed as logged out
    }
    const profile = await getProfileBySlug(slug);
    console.log("PublicProfilePage loaded slug:", slug, "Profile found:", !!profile);

    if (!profile) {
        console.log("PublicProfilePage: Profile not found for slug:", slug);
        notFound();
    }

    // Check ownership
    const isOwner = session?.user?.email === profile.email;

    const { id, f_name, l_name, profession, company_name, company_description, company_website, bio, address, map_url, email, phone_no, userImage, business_logo, socialHandles, products, gallery, services, brochure, theme_color, button_color, card_layout = 'accordion', booking_url } = profile;
    const fullName = `${f_name} ${l_name}`;

    // Default colors if not present in DB
    const bgTheme = theme_color || "#FFFFFF";
    const btnColor = button_color || "#1B54E0";

    // Helper to parse services if it's a string, or use as is if array
    let servicesList: string[] = [];
    try {
        if (typeof services === 'string') {
            servicesList = JSON.parse(services);
        } else if (Array.isArray(services)) {
            servicesList = services;
        }
    } catch (e) {
        servicesList = [];
    }

    // Parse positions similarly if it's a string
    let positionsList: any[] = [];
    const positionsData = profile.positions;
    try {
        if (typeof positionsData === 'string') {
            positionsList = JSON.parse(positionsData);
        } else if (Array.isArray(positionsData)) {
            positionsList = positionsData;
        }
    } catch (e) {
        positionsList = [];
    }


    return (
        <div className="min-h-screen flex justify-center font-sans text-gray-900 dark:text-gray-100" style={{ backgroundColor: bgTheme }}>
            <ViewTracker profileId={String(id)} />
            <div className="w-full max-w-md min-h-screen relative pb-4 transition-colors duration-300" style={{ backgroundColor: bgTheme }}>

                {/* Top Header */}
                <div className="h-16 flex items-center justify-between sticky top-0 bg-opacity-80 backdrop-blur-md px-5 z-50 transition-colors duration-300" style={{ backgroundColor: bgTheme === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : bgTheme }}>
                    <div className="flex items-center gap-2">
                        <Link href="/" className="font-bold text-xl hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">
                            ShareCard
                        </Link>
                    </div>

                    {/* Public Profile Actions (Edit, QR, Share, Logout, Leads) */}
                    <div className="flex gap-2">
                        <ProfileActions username={slug} isOwner={isOwner || false} profileId={String(id)} profile={profile} />
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
                                    {f_name[0]}{l_name[0]}
                                </div>
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold my-1">{fullName}</h1>
                    {profession && <p className="text-gray-600 dark:text-gray-400 text-base font-medium pb-1">{profession}</p>}
                    {company_name && <p className="text-gray-500 dark:text-gray-500 text-sm">{company_name}</p>}

                    {/* Contact & Social Icons Row */}
                    {(phone_no || email || (socialHandles && socialHandles.length > 0)) && (
                        <div className="flex flex-nowrap gap-2 mt-4 mb-6 overflow-x-auto pb-2 brand-scrollbar">
                            {/* Phone Icon */}
                            {phone_no && (
                                <TrackingLink
                                    href={`tel:${phone_no}`}
                                    profileId={String(id)}
                                    eventType="CLICK_CONTACT"
                                    eventData={{ type: 'phone', value: phone_no }}
                                    className="w-14 h-14 rounded-full border border-gray-500 dark:border-zinc-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                >
                                    <Phone className="w-6 h-6" style={{ color: btnColor }} />
                                </TrackingLink>
                            )}

                            {/* Social Icons */}
                            {socialHandles && socialHandles.length > 0 && socialHandles.map((handle: any) => {
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

                                let typeName = 'social';
                                switch (typeId) {
                                    case 1: typeName = 'whatsapp'; break;
                                    case 2: typeName = 'instagram'; break;
                                    case 3: typeName = 'website'; break;
                                    case 4: typeName = 'linkedin'; break;
                                    case 5: typeName = 'youtube'; break;
                                    case 6: typeName = 'facebook'; break;
                                    case 7: typeName = 'twitter'; break;
                                    case 8: typeName = 'behance'; break;
                                }

                                return (
                                    <TrackingLink
                                        key={handle.id}
                                        href={href}
                                        profileId={String(id)}
                                        eventType="CLICK_SOCIAL"
                                        eventData={{ type: typeName, value: href }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 rounded-full border border-gray-500 dark:border-zinc-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                    >
                                        {icon}
                                    </TrackingLink>
                                );
                            })}

                            {/* Mail Icon */}
                            {email && (
                                <TrackingLink
                                    href={`mailto:${email}`}
                                    profileId={String(id)}
                                    eventType="CLICK_CONTACT"
                                    eventData={{ type: 'email', value: email }}
                                    className="w-14 h-14 rounded-full border border-gray-500 dark:border-zinc-800 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                >
                                    <Mail className="w-6 h-6" style={{ color: btnColor }} />
                                </TrackingLink>
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
                        {!isOwner && (
                            <ExchangeContactModal profileId={String(id)} profileName={fullName} buttonColor={btnColor} />
                        )}
                    </div>
                </div>

                {/* Content Sections - Conditional Layout */}
                {card_layout === 'full_page' ? (
                    <div className="w-full px-5 space-y-8 pb-8">
                        {/* Business Info Section */}
                        {(business_logo || company_name || company_description || company_website || brochure) && (
                            <div className="pb-6 last:pb-0">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100">
                                    <Building2 className="w-5 h-5 text-gray-600" />
                                    Business Info
                                </h2>
                                <div>
                                    {business_logo && (
                                        <div className="flex justify-start pt-2 pb-4">
                                            <img src={business_logo} alt="Company Logo" className="h-16 w-auto object-contain max-w-[200px]" />
                                        </div>
                                    )}
                                    {company_name && <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 pb-2">{company_name}</div>}
                                    {company_description && (
                                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pb-4">
                                            <p>{company_description}</p>
                                        </div>
                                    )}
                                    {company_website && (
                                        <div className="flex gap-4 flex-wrap">
                                            <TrackingLink
                                                href={company_website}
                                                profileId={String(id)}
                                                eventType="CLICK_LINK"
                                                eventData={{ type: 'company_website', value: company_website }}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 font-medium hover:underline cursor-pointer"
                                                style={{ color: btnColor }}
                                            >
                                                <Globe className="w-4 h-4" />
                                                Visit Website
                                            </TrackingLink>
                                            {map_url && (
                                                <TrackingLink
                                                    href={map_url}
                                                    profileId={String(id)}
                                                    eventType="CLICK_LINK"
                                                    eventData={{ type: 'map_location', value: map_url }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-[#1b54e0] font-medium hover:underline cursor-pointer"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    View Location
                                                </TrackingLink>
                                            )}
                                        </div>
                                    )}
                                    {brochure && (
                                        <div className="pt-4 flex justify-start">
                                            <TrackingLink
                                                href={brochure.startsWith('http') ? brochure : `/api/brochure/${id}`}
                                                profileId={String(id)}
                                                eventType="CLICK_LINK"
                                                eventData={{ type: 'brochure_view' }}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gray-500 dark:border-zinc-800 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                            >
                                                <Eye className="w-5 h-5" />
                                                View Brochure
                                            </TrackingLink>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {(isOwner && !(business_logo || company_name || company_description || company_website || brochure)) && (
                            <EmptySectionPlaceholder title="Business Info" description="Add company details, logo, and brochure." actionLink="/create-card" />
                        )}

                        {/* Positions Section */}
                        {positionsList.length > 0 ? (
                            <div className="pb-6 last:pb-0">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100">
                                    <Briefcase className="w-5 h-5 text-gray-600" />
                                    Positions
                                </h2>
                                <div className="space-y-3">
                                    {positionsList.map((pos: any, i: number) => (
                                        <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50/50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                                            <div>
                                                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{pos.title}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{pos.org}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : isOwner ? (
                            <EmptySectionPlaceholder title="Positions" description="List your roles and experience." actionLink="/create-card" />
                        ) : null}

                        {/* Services Section */}
                        {servicesList.length > 0 ? (
                            <div className="pb-6 last:pb-0">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100">
                                    <Wrench className="w-5 h-5 text-gray-600" />
                                    Services
                                </h2>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-base text-gray-700 dark:text-gray-300 marker:text-gray-400">
                                    {servicesList.map((service, i) => (
                                        <li key={i} className="pl-1">{service}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : isOwner ? (
                            <EmptySectionPlaceholder title="Services" description="Highlight what you offer." actionLink="/create-card" />
                        ) : null}

                        {/* Products Section */}
                        {products && products.length > 0 ? (
                            <div className="pb-6 last:pb-0">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100">
                                    <Package className="w-5 h-5 text-gray-600" />
                                    Products
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {products.map((prod: any, i: number) => {
                                        let images: string[] = [];
                                        try {
                                            if (Array.isArray(prod.prod_images)) {
                                                images = prod.prod_images;
                                            } else if (typeof prod.prod_images === 'string') {
                                                images = JSON.parse(prod.prod_images);
                                            }
                                        } catch (e) {
                                            images = [];
                                        }

                                        return (
                                            <TrackingLink
                                                key={i}
                                                href={prod.prod_url || '#'}
                                                profileId={String(id)}
                                                eventType="CLICK_LINK"
                                                eventData={{ type: 'product', value: prod.prod_name }}
                                                target={prod.prod_url ? "_blank" : "_self"}
                                                className={`${!prod.prod_url ? 'cursor-default pointer-events-none' : 'cursor-pointer'} group`}
                                            >
                                                <div className="h-full dark:bg-zinc-900 dark:border-zinc-800">
                                                    <div>
                                                        {images && images[0] ? (
                                                            <div className="aspect-square relative mb-2 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                                <img src={images[0]} alt={prod.prod_name} className="object-cover w-full h-full" />
                                                            </div>
                                                        ) : (
                                                            <div className="aspect-square relative mb-2 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                                                <Package className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <h4 className="font-semibold text-base line-clamp-1" title={prod.prod_name}>{prod.prod_name}</h4>
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
                                            </TrackingLink>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : isOwner ? (
                            <EmptySectionPlaceholder title="Products" description="Showcase your items." actionLink="/create-card" />
                        ) : null}

                        {/* Gallery Section */}
                        {gallery && gallery.length > 0 ? (
                            <div className="last:border-0 last:pb-0">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100">
                                    <ImageIcon className="w-5 h-5 text-gray-600" />
                                    Gallery
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {gallery.map((img: any, i: number) => (
                                        <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                                            <img src={img.image_url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : isOwner ? (
                            <EmptySectionPlaceholder title="Gallery" description="Add photos of your work." actionLink="/create-card" />
                        ) : null}
                    </div>
                ) : (
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
                                                <img
                                                    src={business_logo}
                                                    alt="Company Logo"
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
                                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pb-4">
                                                <p>{company_description}</p>
                                            </div>
                                        )}
                                        {company_website && (
                                            <div className="flex gap-4 flex-wrap">
                                                <TrackingLink
                                                    href={company_website}
                                                    profileId={String(id)}
                                                    eventType="CLICK_LINK"
                                                    eventData={{ type: 'company_website', value: company_website }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 font-medium hover:underline cursor-pointer"
                                                    style={{ color: btnColor }}
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    Visit Website
                                                </TrackingLink>
                                                {map_url && (
                                                    <TrackingLink
                                                        href={map_url}
                                                        profileId={String(id)}
                                                        eventType="CLICK_LINK"
                                                        eventData={{ type: 'map_location', value: map_url }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-[#1b54e0] font-medium hover:underline cursor-pointer"
                                                    >
                                                        <MapPin className="w-4 h-4" />
                                                        View Location
                                                    </TrackingLink>
                                                )}
                                            </div>
                                        )}
                                        {brochure && (
                                            <div className="pt-4 flex justify-start">
                                                <TrackingLink
                                                    href={brochure.startsWith('http') ? brochure : `/api/brochure/${id}`}
                                                    profileId={String(id)}
                                                    eventType="CLICK_LINK"
                                                    eventData={{ type: 'brochure_view' }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gray-500 dark:border-zinc-800 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 cursor-pointer"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                    View Brochure
                                                </TrackingLink>
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ) : isOwner ? (
                            <EmptySectionPlaceholder title="Business Info" description="Add company details, logo, and brochure." actionLink="/create-card" />
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
                                        {positionsList.map((pos: any, i: number) => (
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
                        ) : isOwner ? (
                            <AccordionItem value="positions" className="">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-gray-600" />
                                        Positions
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <EmptySectionPlaceholder title="Positions" description="List your roles and experience." actionLink="/create-card" />
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
                                        {servicesList.map((service, i) => (
                                            <li key={i} className="pl-1">{service}</li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ) : isOwner ? (
                            <AccordionItem value="services" className="">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Wrench className="w-5 h-5 text-gray-600" />
                                        Services
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <EmptySectionPlaceholder title="Services" description="Highlight what you offer." actionLink="/create-card" />
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
                                        {products.map((prod: any, i: number) => {
                                            // Safe parse prod_images
                                            let images: string[] = [];
                                            try {
                                                if (Array.isArray(prod.prod_images)) {
                                                    images = prod.prod_images;
                                                } else if (typeof prod.prod_images === 'string') {
                                                    images = JSON.parse(prod.prod_images);
                                                }
                                            } catch (e) {
                                                images = [];
                                            }

                                            return (
                                                <TrackingLink
                                                    key={i}
                                                    href={prod.prod_url || '#'}
                                                    profileId={String(id)}
                                                    eventType="CLICK_LINK"
                                                    eventData={{ type: 'product', value: prod.prod_name }}
                                                    target={prod.prod_url ? "_blank" : "_self"}
                                                    className={`${!prod.prod_url ? 'cursor-default pointer-events-none' : 'cursor-pointer'} group`}
                                                >
                                                    <div className="h-full dark:bg-zinc-900 dark:border-zinc-800">
                                                        <div>
                                                            {images && images[0] ? (
                                                                <div className="aspect-square relative mb-2 rounded-md overflow-hidden bg-gray-100 border border-gray-20000">
                                                                    <img src={images[0]} alt={prod.prod_name} className="object-cover w-full h-full" />
                                                                </div>
                                                            ) : (
                                                                <div className="aspect-square relative mb-2 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                                                    <Package className="w-8 h-8 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <h4 className="font-semibold text-base line-clamp-1" title={prod.prod_name}>{prod.prod_name}</h4>
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
                                                </TrackingLink>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ) : isOwner ? (
                            <AccordionItem value="products" className="">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-gray-600" />
                                        Products
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <EmptySectionPlaceholder title="Products" description="Showcase your items." actionLink="/create-card" />
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
                                        {gallery.map((img: any, i: number) => (
                                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                                                <img src={img.image_url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ) : isOwner ? (
                            <AccordionItem value="gallery" className="border-b-0">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-gray-600" />
                                        Gallery
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <EmptySectionPlaceholder title="Gallery" description="Add photos of your work." actionLink="/create-card" />
                                </AccordionContent>
                            </AccordionItem>
                        ) : null}
                    </Accordion>
                )}

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

                    {/* <FloatingContactButton profile={profile} profileId={String(id)} buttonColor={btnColor} /> */}

                </div>
            </div>

        </div>
    );
}

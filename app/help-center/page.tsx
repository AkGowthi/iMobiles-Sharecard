"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Mail, Phone, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const faqs = [
    {
        category: "Getting Started",
        items: [
            {
                question: "What is ShareCard?",
                answer: "ShareCard is a plastic NFC card that allows you to instantly share your contact details, social links, and business information by tapping the card or scanning the QR code.",
            },
            {
                question: "How does ShareCard work?",
                answer: "Simply tap the ShareCard on a smartphone or scan the QR code printed on the card. Your digital profile opens instantly, without requiring any app.",
            },
            {
                question: "Do I need an app to use ShareCard?",
                answer: "No. ShareCard works on most modern smartphones without installing any app.",
            },
        ],
    },
    {
        category: "NFC & Device Compatibility",
        items: [
            {
                question: "Which phones support ShareCard?",
                answer: "Most Android smartphones with NFC enabled and iPhones (XR and newer) support NFC tap. The QR code works on all smartphones.",
            },
            {
                question: "What if a phone does not support NFC?",
                answer: "You can still share your details using the QR code printed on the ShareCard.",
            },
        ],
    },
    {
        category: "Digital Profile",
        items: [
            {
                question: "What information can I add to my digital profile?",
                answer: "You can add your name, designation, phone number, email address, company details, website, social media links, location, and custom links.",
            },
            {
                question: "Can I edit my profile after purchasing ShareCard?",
                answer: "Yes. You can log in to your dashboard at any time and update your profile. Changes are reflected instantly.",
            },
            {
                question: "Is there any limit on profile updates?",
                answer: "No. You can update your digital profile as many times as you want.",
            },
        ],
    },
    {
        category: "Orders & Payments",
        items: [
            {
                question: "How do I place an order?",
                answer: "Select your ShareCard, complete the checkout process, make the payment, and we will process your order.",
            },
            {
                question: "What payment methods are accepted?",
                answer: "We accept secure online payments through UPI, debit/credit cards, net banking, and other supported payment options.",
            },
            {
                question: "Can I cancel my order?",
                answer: "Orders can be cancelled only before processing. Once the card is processed or shipped, cancellation is not possible.",
            },
        ],
    },
    {
        category: "Shipping & Delivery",
        items: [
            {
                question: "How long does delivery take?",
                answer: "Delivery usually takes a few business days, depending on your location and courier service availability.",
            },
            {
                question: "How can I track my order?",
                answer: "Once your order is shipped, tracking details will be shared with you via WhatsApp or SMS.",
            },
        ],
    },
    {
        category: "Returns & Refunds",
        items: [
            {
                question: "Is ShareCard refundable?",
                answer: "Digital services are non-refundable. Physical NFC cards are eligible for replacement only in case of manufacturing defects. Contact support within 7 days of delivery with order details and photo/video proof.",
            },
            {
                question: "What should I do if my card is damaged or not working?",
                answer: "Contact support within 7 days of delivery with order details and photo/video proof. Replacement is not applicable for damage caused by tearing, bending, misuse, water damage, or normal wear and tear.",
            },
        ],
    },
    {
        category: "Privacy & Security",
        items: [
            {
                question: "Is my data safe with ShareCard?",
                answer: "Yes. We follow standard security practices to protect your data. Only you can access and edit your digital profile.",
            },
        ],
    },
    {
        category: "Troubleshooting",
        items: [
            {
                question: "My ShareCard is not opening the profile. What should I do?",
                answer: "Make sure NFC is enabled on the phone, tap the card near the top or back of the device, or use the QR code as an alternative. If the issue continues, please contact support.",
            },
        ],
    },
];

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = faqs
        .map((category) => ({
            ...category,
            items: category.items.filter(
                (item) =>
                    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((category) => category.items.length > 0);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Help Center
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Welcome to the ShareCard Help Center. Here you’ll find answers to
                            common questions about our NFC cards, digital profiles, orders,
                            and support.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-16">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search for questions..."
                            className="pl-12 py-6 text-xl rounded-2xl shadow-sm border-gray-200 focus:border-primary-blue focus:ring-primary-blue transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* FAQ Content */}
                    <div className="space-y-6">
                        {filteredFaqs.length > 0 ? (
                            <Accordion type="multiple" className="w-full space-y-4">
                                {filteredFaqs.map((category, catIndex) => (
                                    <AccordionItem
                                        key={catIndex}
                                        value={`cat-${catIndex}`}
                                        className="border-t-0 border-b-0"
                                    >
                                        <AccordionTrigger className="text-2xl font-bold text-gray-900 py-6 px-8 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:no-underline transition-all cursor-pointer">
                                            {category.category}
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-6 pb-2 px-4 md:px-8">
                                            <Accordion type="single" collapsible className="w-full">
                                                {category.items.map((item, itemIndex) => (
                                                    <AccordionItem
                                                        key={`${catIndex}-${itemIndex}`}
                                                        value={`item-${catIndex}-${itemIndex}`}
                                                        className="border-b-0 mt-2 mb-2"
                                                    >
                                                        <AccordionTrigger className="text-left hover:no-underline py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50 data-[state=open]:text-primary-blue font-semibold text-lg cursor-pointer">
                                                            {item.question}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="px-6 pb-4 pt-2 text-gray-600 text-base leading-relaxed">
                                                            {item.answer}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-500">
                                    No questions found matching your search.
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="mt-4 text-primary-blue font-semibold hover:underline cursor-pointer"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Support Section */}
                    <div className="mt-24 p-8 md:p-12 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Support & Contact
                                </h2>
                                <p className="text-gray-600 mb-8 text-lg">
                                    If you need further assistance, please reach out to us. We&apos;re here to help!
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                                            <Mail className="w-5 h-5 text-primary-blue" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Email</p>
                                            <a href="mailto:contact@nutz.in" className="font-bold hover:text-primary-blue transition-colors">
                                                contact@nutz.in
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                                            <Phone className="w-5 h-5 text-primary-blue" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Phone / WhatsApp</p>
                                            <a href="https://wa.me/918220370550" target="_blank" className="font-bold hover:text-primary-blue transition-colors text-lg">
                                                +91 8220 370 550
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary-blue" />
                                        Support Hours
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Monday - Friday</span>
                                            <span className="font-semibold text-gray-900">10:00 AM – 5:30 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Saturday - Sunday</span>
                                            <span className="text-red-500 font-semibold italic">Closed</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                            * All times are in Indian Standard Time (IST).
                                        </p>
                                        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                            We respond to all queries within 12-24 business hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

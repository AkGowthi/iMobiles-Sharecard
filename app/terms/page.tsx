import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-gray-500 text-sm">Last Updated: January 13, 2026</p>
                    </div>

                    <div className="prose prose-gray max-w-none space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. ABOUT SHARECARD</h2>
                            <p className="text-gray-600 leading-relaxed">
                                ShareCard is a digital business identity solution that provides NFC-enabled physical cards along with digital profile software. Our services allow users to share contact details, social links, and business information through a simple tap or QR scan.
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                By accessing our website or using our products or services, you agree to these Terms of Service (“Terms”). If you do not agree, please do not use our website or services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. ACCEPTANCE OF TERMS</h2>
                            <p className="text-gray-600 leading-relaxed">
                                By visiting our website, placing an order (including orders via WhatsApp or mobile), or using ShareCard services, you confirm that you have read, understood, and accepted these Terms. These Terms apply to all users, including visitors and customers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. ELIGIBILITY & USER RESPONSIBILITY</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">You confirm that:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>You are legally eligible to enter into this agreement under Indian law</li>
                                <li>All information provided by you is accurate and complete</li>
                                <li>You will use ShareCard products and services only for lawful purposes</li>
                                <li>You are responsible for maintaining the security of your account and all activities carried out using your ShareCard profile.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. PRODUCTS & SERVICES</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">ShareCard offers:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>NFC-enabled physical cards</li>
                                <li>Access to a digital profile/dashboard</li>
                                <li>Tools to share personal or business information digitally</li>
                            </ul>
                            <p className="text-gray-600 leading-relaxed mt-4 text-sm italic">
                                We reserve the right to modify, update, or discontinue any product or feature at any time without prior notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. ORDERS, PRICING & PAYMENTS</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Prices are subject to change without notice</li>
                                <li>We reserve the right to accept, reject, or cancel any order</li>
                                <li>Orders are processed only after successful payment</li>
                                <li>In case of pricing or listing errors, we may cancel or correct the order</li>
                                <li>Orders placed through WhatsApp or mobile are also governed by these Terms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. SHIPPING & DELIVERY</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Delivery timelines are estimates and may vary depending on location and courier availability</li>
                                <li>We are not responsible for delays caused by third-party courier services</li>
                                <li>Ownership and risk transfer to the customer upon delivery</li>
                            </ul>
                        </section>

                        <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                            <h2 className="text-2xl font-bold text-red-900 mb-4 font-ubuntu">7. RETURNS, REFUNDS & REPLACEMENT</h2>
                            <p className="text-red-800 leading-relaxed font-semibold">
                                We do not offer any returns or refunds.
                            </p>
                            <p className="text-red-700 leading-relaxed mt-4">
                                Since ShareCard provides custom-printed NFC cards and digital profile services that are activated immediately upon purchase, we cannot accept returns or provide refunds once an order is processed.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-6 mb-4">
                                Replacement will be provided only for confirmed manufacturing defects and must be reported within 7 days of delivery. To request a replacement, customers must:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Contact our support team within 7 days of delivery</li>
                                <li>Share clear photos or videos showing the defect</li>
                                <li>Provide order details</li>
                            </ul>
                            <p className="text-gray-500 text-sm mt-6 italic">
                                Replacement is not applicable for damage caused due to tearing, bending, misuse, water damage, or normal wear and tear.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. DIGITAL PROFILE CONTENT</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                You are solely responsible for all content added to your ShareCard digital profile. You agree not to upload or display:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Illegal, misleading, or fraudulent content</li>
                                <li>Content that infringes intellectual property rights</li>
                                <li>Offensive, abusive, or harmful material</li>
                            </ul>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                We reserve the right to remove content or suspend access if these Terms are violated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. INTELLECTUAL PROPERTY</h2>
                            <p className="text-gray-600 leading-relaxed">
                                All website content, software, designs, and digital features are owned by or licensed to ShareCard. The name “ShareCard” is used as a brand name and is not currently registered as a trademark. Unauthorized copying, resale, or misuse of our content or software is prohibited.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. THIRD-PARTY SERVICES</h2>
                            <p className="text-gray-600 leading-relaxed">
                                ShareCard may integrate with third-party services such as payment gateways or social media platforms. We are not responsible for availability or performance of third-party services, their data practices, or any loss/damage arising from their use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. SERVICE AVAILABILITY</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We do not guarantee uninterrupted or error-free service. Temporary downtime may occur due to maintenance, updates, or technical issues.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. LIMITATION OF LIABILITY</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>To the maximum extent permitted by law, ShareCard shall not be liable for indirect, incidental, or consequential damages</li>
                                <li>We do not guarantee business growth, leads, or outcomes from using our products or services</li>
                                <li>Use of ShareCard products and services is at your own risk</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. TERMINATION</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We reserve the right to suspend or terminate access if these Terms are violated, the platform is misused, or illegal activities are identified. Termination does not release you from any outstanding payment obligations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. PRIVACY</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Your personal information is handled in accordance with our Privacy Policy. By using ShareCard, you consent to the collection and use of your data as required to provide our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. CHANGES TO TERMS</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We may update these Terms at any time. Continued use of the website or services after changes indicates acceptance of the revised Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. GOVERNING LAW</h2>
                            <p className="text-gray-600 leading-relaxed">
                                These Terms shall be governed by and interpreted in accordance with the laws of India.
                            </p>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. CONTACT INFORMATION</h2>
                            <div className="space-y-2 text-gray-700">
                                <p>Email: <a href="mailto:contact@nutz.in" className="font-bold hover:text-primary-blue transition-colors">contact@nutz.in</a></p>
                                <p>Phone / WhatsApp: <a href="https://wa.me/918220370550" className="font-bold hover:text-primary-blue transition-colors">+91 8220 370 550</a></p>
                                <p>Support Hours: Monday to Friday, 10:00 AM – 5:30 PM (IST)</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-ubuntu">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-500 text-sm">Last Updated: January 13, 2026</p>
                    </div>

                    <div className="prose prose-gray max-w-none space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">1. INTRODUCTION</h2>
                            <p className="text-gray-600 leading-relaxed">
                                At ShareCard, we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, use, and protect your information when you use our website, mobile application, and NFC-enabled products.
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                By using ShareCard services, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">2. INFORMATION WE COLLECT</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">We collect information to provide a better experience for our users. This includes:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li className="font-ubuntu"><strong>Personal Information:</strong> Name, email address, phone number, and designation provided during account creation or profile setup.</li>
                                <li className="font-ubuntu"><strong>Business Details:</strong> Company name, website, social media links, and location that you choose to display on your digital profile.</li>
                                <li className="font-ubuntu"><strong>Order Information:</strong> Shipping address and contact details for fulfilling product orders.</li>
                                <li className="font-ubuntu"><strong>Usage Data:</strong> Information on how the service is accessed and used, including device information and interaction with your digital profile.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">3. HOW WE USE YOUR INFORMATION</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>To provide and maintain our services</li>
                                <li>To process and deliver your orders</li>
                                <li>To allow you to create and share your digital profile</li>
                                <li>To notify you about changes to our services or products</li>
                                <li>To provide customer support and respond to inquiries</li>
                                <li>To improve our website and user experience</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">4. DATA SECURITY</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We prioritize the security of your data. We use industry-standard encryption and security protocols to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">5. DATA SHARING & THIRD PARTIES</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We do not sell or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                This includes payment gateways for processing transactions and courier services for delivering physical cards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">6. USER RIGHTS & CONTROL</h2>
                            <p className="text-gray-600 leading-relaxed">
                                You have full control over the information displayed on your digital profile. You can update or delete your information at any time by logging into your dashboard. If you wish to delete your account entirely, please contact our support team.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">7. CHANGES TO THIS POLICY</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                            </p>
                        </section>

                        <section className="bg-primary-blue/5 p-8 rounded-3xl border border-primary-blue/10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-ubuntu">8. CONTACT US</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy or how your data is handled, please contact us at:
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p>Email: <a href="mailto:contact@nutz.in" className="font-bold hover:text-primary-blue transition-colors">contact@nutz.in</a></p>
                                <p>Phone / WhatsApp: <a href="https://wa.me/918220370550" className="font-bold hover:text-primary-blue transition-colors">+91 8220 370 550</a></p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

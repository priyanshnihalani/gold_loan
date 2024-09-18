// src/PrivacyPolicy.js
import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
const PrivacyPolicy = () => {
    return (
        <>
        <Header />
            <div className="min-h-screen bg-gray-100 p-8 ">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow mt-20">
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                    <section className="mb-8 border-b">
                        <h2 className="text-2xl font-semibold mb-4 text-left">Introduction</h2>
                        <p className="text-lg mb-4 text-justify">
                            Welcome to our Privacy Policy page. This policy explains how we collect, use, and protect
                            your personal information when you use our services. We are committed to safeguarding your
                            data and ensuring your privacy.
                        </p>
                    </section>
                    <section className="mb-8 border-b pb-5">
                        <h2 className="text-2xl font-semibold mb-4 text-left">Information We Collect</h2>
                        <p className="mb-4 text-justify">
                            We collect personal information that you provide directly to us, such as your name, email
                            address, and phone number.
                        </p>
                        <p className='mb-4 text-justify'>
                        Financial Information relates to a user's financial status and loan-related data,  collected through online forms for verification forms.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-left">Financial Information</h3>
                        <p className="mb-4 text-justify">
                            We collect financial information relevant to loan applications, such as bank account
                            details and loan amounts.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-left">Usage Data</h3>
                        <p className="mb-4 text-justify">
                            We gather data on how you interact with our website, including IP addresses and browsing
                            activity.
                        </p>
                        <p className='text-justify'>
                            We use cookies and similar tracking technologies to enhance your experience and analyze
                            site usage.
                        </p>
                    </section>
                    <section className="mb-8 border-b pb-5">
                        <h2 className="text-2xl font-semibold mb-4 text-left">How We Use Your Information</h2>
                        <p className="mb-4 text-justify">
                            We use your information to process your loan applications, provide customer support, and
                            improve our services.
                        </p>
                        <p className='text-justify'>
                            The processing of your data is based on your consent, the performance of a contract, or
                            legal obligations.
                        </p>
                    </section>
                    <section className="mb-8 border-b pb-5">
                        <h2 className="text-2xl font-semibold mb-4 text-left">Information Sharing</h2>
                        <p className="mb-4 text-justify">
                            We may share your information with third-party service providers who assist us in operating
                            our services. We do not sell your information to third parties.
                        </p>
                        <p className='text-justify'>
                            We may also disclose your information to comply with legal requirements or protect our
                            rights.
                        </p>
                    </section>
                    <section className="mb-8 border-b pb-5">
                        <h2 className="text-2xl font-semibold mb-4 text-left">Data Security</h2>
                        <p className="mb-4 text-justify">
                            We implement security measures to protect your personal data from unauthorized access,
                            alteration, or destruction. This includes encryption and secure storage practices.
                        </p>
                    </section>
                    <section className="mb-8 border-b pb-5">
                        <h2 className="text-2xl font-semibold mb-4 text-left">Your Rights</h2>
                        <p className="mb-4 text-justify">
                            You have the right to access, correct, or delete your personal data. You may also request
                            restrictions on processing or object to processing under certain conditions.
                        </p>
                    </section>
                    <section className="mb-8 border-b pb-5">
                        <h2 className="text-2xl font-semibold mb-4 text-left">Changes to This Policy</h2>
                        <p className="mb-4 text-justify">
                            We may update this Privacy Policy from time to time. Any changes will be posted on this
                            page, and we will notify you of significant updates.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-left">Contact Us</h2>
                        <p className='text-justify'>
                            If you have any questions about this Privacy Policy or our data practices, please contact
                            us at support@goldloan.com.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </>

    );
};

export default PrivacyPolicy;

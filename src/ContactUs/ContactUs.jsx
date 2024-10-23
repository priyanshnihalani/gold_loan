import { FaClock, FaEnvelope, FaLocationArrow, FaMobile, FaUser, FaPhone } from "react-icons/fa";
import LeafletMapComponent from "../Map/Map";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ContactForm from "../ContactForm/ContactForm";

function ContactUs() {
    return (
        <>
            <Header />

            {/* FAQ Section */}
            <section className="">

                <div className="px-5 md:px-20  p-5  bg-gradient-to-t from-gray-100 to-white  rounded-md py-10">
                    <h2 className="text-xl lg:text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="text-start border rounded-md p-4">
                            <summary className="cursor-pointer text-lg font-semibold text-yellow-600 flex items-center">
                                <FaClock className="mr-3" /> Normal Emi Payment Days?
                            </summary>
                            <p className="mt-2 text-gray-600">
                                Every Month after the loan taken until payment with interest complete.
                            </p>
                        </details>
                        <details className="text-start border rounded-md p-4">
                            <summary className="cursor-pointer text-lg font-semibold text-yellow-600 flex items-center">
                                <FaEnvelope className="mr-3" /> How do I contact customer service?
                            </summary>
                            <p className="mt-2 text-gray-600">
                                You can reach us via email at mannat.gold.loan@gmial.com or call us at +91 7041958565.
                            </p>
                        </details>
                        <details className="text-start border rounded-md p-4">
                            <summary className="cursor-pointer text-lg font-semibold text-yellow-600 flex items-center">
                                <FaClock className="mr-3" /> What are your business hours?
                            </summary>
                            <p className="mt-2 text-gray-600">
                                We are open from Monday to Saturday, 9:00 AM to 6:00 PM.
                            </p>
                        </details>
                    </div>
                </div>

            </section>

            {/* Contact Form and Information Section */}
            <section id="contact" className="py-16 bg-gradient-to-t from-white to-gray-100 flex flex-col lg:flex-row items-center justify-center px-5 lg:px-0 ">
                {/* Form */}
                <ContactForm />

                {/* Contact Information */}
                <div className="mt-32 md:mt-10 lg:mt-0 w-full lg:w-1/2 space-y-7 lg:pl-10 lg:py-20 text-center lg:text-left">
                    {/* Office Address */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 lg:space-x-5 space-y-5 lg:space-y-0">
                        <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-1">
                            <span className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 flex rounded-full p-4">
                                <FaLocationArrow className="text-white text-2xl" />
                            </span>
                        </div>
                        <div className="text-gray-800">
                            <h1 className="text-xl lg:text-2xl">Our Office Address</h1>
                            <p>Talav street-4, Bantwa, Gujrat, 362620.</p>
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 lg:space-x-5 space-y-5 lg:space-y-0">
                        <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-1">
                            <span className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 flex rounded-full p-4">
                                <FaEnvelope className="text-white text-2xl" />
                            </span>
                        </div>
                        <div className="text-gray-800">
                            <h1 className="text-xl lg:text-2xl">General Enquiries</h1>
                            <p>mannat@gmail.in</p>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 lg:space-x-5 space-y-5 lg:space-y-0">
                        <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-1">
                            <span className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 flex rounded-full p-4">
                                <FaMobile className="text-white text-2xl" />
                            </span>
                        </div>
                        <div className="text-gray-800">
                            <h1 className="text-xl lg:text-2xl">Call Us</h1>
                            <p>+91 7041958565</p>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 lg:space-x-5 space-y-5 lg:space-y-0">
                        <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-1">
                            <span className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 flex rounded-full p-4">
                                <FaClock className="text-white text-2xl" />
                            </span>
                        </div>
                        <div className="text-gray-800">
                            <h1 className="text-xl lg:text-2xl">Our Timing</h1>
                            <p>Mon-Sat: 9.00 AM - 6.00 PM</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section id="map">
                <div className="flex flex-col lg:flex-row w-full items-center lg:items-stretch" style={{ height: '100%' }}>
                    <div className="w-full bg-white lg:w-[100%] p-8 lg:p-20 rounded-lg shadow-lg">
                        <LeafletMapComponent />
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default ContactUs;

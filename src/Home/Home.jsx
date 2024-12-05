import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import LeafletMapComponent from "../Map/Map";
import CountUp from 'react-countup'
import { FaClock, FaEnvelope, FaLocationArrow, FaMobile } from "react-icons/fa";
import './Home.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDollarSign, faEye } from "@fortawesome/free-solid-svg-icons";
import { auth, firestoredb } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import ContactForm from "../ContactForm/ContactForm";


function Home() {
    const navigate = useNavigate();
    const [first, setFirst] = useState(false);
    const [data, setData] = useState({});
    const [display, setDisplay] = useState(false);
    const [userId, setUserId] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startCount, setStartCount] = useState(false);
    const customerRef = useRef(null);

    // Function to fetch data from Firestore
    const fetchData = async (collection, uid, setData) => {
        const docRef = doc(firestoredb, collection, uid);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    };

    // Scroll event handling
    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll('.scroll-animate');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight) {
                    el.classList.add('show');
                }
            });

            // Check for customer section visibility
            if (customerRef.current) {
                const customerRect = customerRef.current.getBoundingClientRect();
                if (customerRect.top <= window.innerHeight && customerRect.bottom >= 0) {
                    setStartCount(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [customerRef]);

    // Fetch user data on auth state change
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserId(user.uid);
                await fetchData('users', user.uid, setData);
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const calculateMonthsPassed = (lastSalaryDate, currentDate) => {
        const lastSalaryYear = lastSalaryDate.getFullYear();
        const lastSalaryMonth = lastSalaryDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        return (currentYear - lastSalaryYear) * 12 + (currentMonth - lastSalaryMonth);
    };

    // Fetch account data based on userId
    useEffect(() => {
        if (userId) {
            fetchData('account', userId, setAccountData);
        }
    }, [userId]);

    // Update account data when accountData is available
    useEffect(() => {
        const updateAccountData = async () => {
            if (accountData) {
                const lastSalaryDate = accountData.lastSalaryDate?.toDate();
                const docRef = doc(firestoredb, 'account', userId);
                if (!lastSalaryDate) {
                    await setDoc(docRef, {
                        ...accountData,
                        lastSalaryDate: new Date()
                    });
                } else {
                    const balance = Number(accountData.Balance);
                    const salary = Number(accountData.salary);
                    const monthsPassed = calculateMonthsPassed(lastSalaryDate, new Date());
                    await setDoc(docRef, {
                        ...accountData,
                        Balance: Number(balance + (salary * monthsPassed)).toFixed(2),
                        lastSalaryDate: new Date()
                    });
                }
            }
        };
        updateAccountData();
    }, [accountData, userId]);

    console.log(accountData);

    const handleApply = () => {
        if (userId) {
            if (!data?.loan_info?.hasOwnProperty('status') ||  data.loan_info?.status?.loanStatus === 'rejected...') {

                navigate('/personal_info');
            } else {
                let remainingEmi = Number(data.loan_info.remainEmi);
                if ( data.loan_info?.status.loanStatus === 'pending...' || remainingEmi > 0 ) {
                    setDisplay(true);
                }
            }
        } else {
            navigate('/sign_in');
        }
    };

    const visibility = () => {
        setFirst(!first);
    };

    if (loading) {
        return (
            <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="200"
                    height="200"
                    style={{
                        display: 'block',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <style>
                        {`
              @keyframes rotateRing {
                0%, 100% { transform: rotate(0deg) translateX(0); }
                50% { transform: rotate(180deg) translateX(-15px); }
              }
              @keyframes rotateBangle {
                0%, 100% { transform: rotate(0deg) translateX(0); }
                50% { transform: rotate(-180deg) translateX(15px); }
              }
              .jewelry {
                filter: url(#glow);
              }
              #ring {
                animation: rotateRing 4s ease-in-out infinite;
                transform-origin: center;
              }
              #bangle {
                animation: rotateBangle 4s ease-in-out infinite;
                transform-origin: center;
              }
            `}
                    </style>

                    <g id="ring" className="jewelry">
                        <circle cx="50" cy="50" r="20" fill="none" stroke="url(#goldGradient)" strokeWidth="4" />
                        <circle cx="50" cy="35" r="5" fill="url(#goldGradient)" />
                    </g>

                    <g id="bangle" className="jewelry">
                        <circle cx="50" cy="50" r="25" fill="none" stroke="url(#goldGradient)" strokeWidth="6" />
                    </g>
                </svg>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <div className="relative w-full bg-[url('/Designer2.jpeg')] bg-center bg-cover min-h-screen flex items-center justify-center text-center px-6 lg:px-12">
                        <div className="absolute inset-0 min-h-screen bg-black bg-opacity-70 backdrop-blur-sm"></div>
                        <div className="space-y-6 text-white z-10">
                            {/* Hero Section */}
                            <section className="py-16 text-center">
                                <div className="container mx-auto px-4">
                                    <h1 className="text-4xl font-bold text-white mb-6">Get the Best Value for Your Gold</h1>
                                    <p className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto text-xl text-gray-200 mb-8 text-justify leading-relaxed">
                                        Enjoy quick approval, low interest rates, and no hidden charges with our hassle-free gold loan process. Your gold is safe with us, and you get the highest value for it.
                                    </p>
                                    <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                                        <div>

                                            <button className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold text-lg rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 px-8 py-3" onClick={handleApply}>
                                                <span className="flex items-center justify-center">Apply Now</span>
                                            </button>
                                        </div>
                                        <div>
                                            <button onClick={visibility} className="bg-gray-800 text-white px-8 py-3 rounded-lg shadow-lg transition-colors duration-300 hover:bg-gray-700">
                                                Get a Quote
                                            </button>
                                        </div>
                                    </div>
                                    {display ? <p className="text-red-600 font-medium mt-4">Loan Has Already Been Applied!</p> : <></>}
                                    <div className={`absolute mt-12 ${first ? 'block' : 'hidden'} bg-gray-800 p-6 rounded-lg shadow-lg`}>
                                        <h2 className="text-2xl font-semibold mb-4">Get a Personalized Quote</h2>
                                        <p className="mb-4">Wondering how much your gold is worth? Get a quick and accurate estimate by simply providing a few details. We’ll offer you a personalized quote that reflects the true value of your assets.</p>
                                        <h3 className="font-semibold text-lg mb-2">How It Works:</h3>
                                        <ul className="list-disc list-inside mb-4">
                                            <li><strong>Provide Your Details:</strong> Enter the weight and purity of your gold along with some basic information.</li>
                                            <li><strong>Instant Estimate:</strong> Our advanced valuation system will calculate the best possible loan amount based on the current market rates.</li>
                                            <li><strong>No Obligation:</strong> Receive your quote without any commitment. Explore your options before making a decision.</li>
                                        </ul>
                                        <h3 className="font-semibold text-lg mb-2">Why Get a Quote?</h3>
                                        <ul className="list-disc list-inside">
                                            <li><strong>Transparency:</strong> Understand the loan amount you can get before committing.</li>
                                            <li><strong>Flexibility:</strong> Compare different loan options and find one that suits your needs.</li>
                                            <li><strong>Confidence:</strong> Know the exact value of your gold and the terms of the loan.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>

                    <section id="key-benefits" className="py-16 bg-gradient-to-b from-white to-gray-100 scroll-animate">
                        <div className="container mx-auto px-6 lg:px-12">
                            <h2 className="text-4xl font-extrabold text-center text-yellow-800 mb-12">Why Choose Our Gold Loan?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {/* Quick Approval */}
                                <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-1 pb-2">
                                    <div className="text-center p-6 bg-white rounded-xl shadow hover:shadow-2xl transition-shadow duration-300">
                                        <div className="flex justify-center">
                                            <div className="p-1 rounded-full mb-4 flex bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500">
                                                <div className="w-12 h-12 flex justify-center items-center bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full">
                                                    <FontAwesomeIcon icon={faClock} className="text-2xl mx-auto text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-yellow-900 mb-4">Instant Approval</h3>
                                        <p className="text-gray-800">Get your gold loan approved in minutes with minimal paperwork and quick processing.</p>
                                    </div>
                                </div>

                                {/* Low Interest Rates */}
                                <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-1 pb-2">
                                    <div className="text-center p-6 bg-white rounded-xl shadow hover:shadow-2xl transition-shadow duration-300">
                                        <div className="flex justify-center">
                                            <div className="p-1 rounded-full mb-4 flex bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500">
                                                <div className="w-12 h-12 flex justify-center items-center bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full">
                                                    <FontAwesomeIcon icon={faDollarSign} className="text-2xl mx-auto text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-yellow-900 mb-4">Competitive Rates</h3>
                                        <p className="text-gray-800">Benefit from low interest rates and flexible repayment options on your gold loan.</p>
                                    </div>
                                </div>

                                {/* No Hidden Charges */}
                                <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-1 pb-2">
                                    <div className="text-center p-6 bg-white rounded-xl shadow hover:shadow-2xl transition-shadow duration-300">
                                        <div className="flex justify-center">
                                            <div className="p-1 rounded-full mb-4 flex bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500">
                                                <div className="w-12 h-12 flex justify-center items-center bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full">
                                                    <FontAwesomeIcon icon={faEye} className="text-2xl mx-auto text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-yellow-900 mb-4">Transparent Terms</h3>
                                        <p className="text-gray-800">Enjoy transparent terms and no hidden charges, ensuring complete peace of mind.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="about" className="scroll-animate">
                        <div className="p-6 lg:flex lg:py-20 lg:pl-40 lg:justify-center lg:items-center  ">
                            <div className=" md:w-1/2 md:mx-auto  lg:w-1/3 h-[400px] bg-cover bg-center bg-[url('/about.jpg')]">

                            </div>
                            <div className="lg:w-[68%] text-justify md:px-10 py-12 space-y-4">
                                <h1 className="font-bold text-2xl text-black">
                                    Who We Are?
                                </h1>
                                <p className="max-w-2xl leading-relaxed text-xl">
                                    Founded in 2004, Mannat Gold Loans has been a trusted name in the financial sector, offering quick and secure gold loan services to countless satisfied customers. With a commitment to transparency and customer satisfaction, we provide financial solutions tailored to your needs.
                                </p>
                                <button className="p-3  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-bold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105" onClick={() => navigate('/aboutus')}>
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </section>
                    <section id="customer" className="py-16 my-20 md:mb-30 scroll-animate mx-auto px-4" ref={customerRef}>
                        <div className="flex flex-col items-center space-y-16 lg:flex-row lg:justify-center lg:space-y-0 lg:space-x-10 xl:space-x-20">
                            {/* Growth Section */}
                            <div className="text-center max-w-xs md:max-w-sm lg:max-w-none">
                                <div className="mb-6 lg:mb-0">
                                    <div className="flex items-center justify-center">
                                        <div className="p-10 sm:p-12 lg:px-12 lg:py-2 border-b">
                                            {startCount && (
                                                <CountUp
                                                    start={0}
                                                    end={65}
                                                    duration={2}
                                                    suffix="%"
                                                    className="font-extrabold text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 bg-clip-text text-transparent"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h1 className="font-bold mt-10 lg:mt-6 text-xl lg:text-2xl text-gray-800">Growth</h1>
                            </div>

                            {/* Happy Clients Section */}
                            <div className="text-center max-w-xs md:max-w-sm lg:max-w-none">
                                <div className="mb-6 lg:mb-0">
                                    <div className="flex items-center justify-center">
                                        <div className="px-12 py-2 border-b">
                                            {startCount && (
                                                <CountUp
                                                    start={0}
                                                    end={1000}
                                                    suffix="+"
                                                    duration={2}
                                                    className="font-extrabold text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 bg-clip-text text-transparent"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h1 className="font-bold mt-10 lg:mt-6 text-xl lg:text-2xl text-gray-800">Happy Clients</h1>
                            </div>

                            {/* Star Ratings Section */}
                            <div className="text-center max-w-xs md:max-w-sm lg:max-w-none">
                                <div className="mb-6 lg:mb-0">
                                    <div className="flex items-center justify-center">
                                        <div className="px-14 py-2 border-b">
                                            {startCount && (
                                                <CountUp
                                                    start={0}
                                                    end={4.8}
                                                    duration={2}
                                                    decimals={1}
                                                    className="font-extrabold text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 bg-clip-text text-transparent"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h1 className="font-bold mt-10 lg:mt-6 text-xl lg:text-2xl text-gray-800">Ratings</h1>
                            </div>
                        </div>
                    </section>

                    <section id="howitworks" className="scroll-animate bg-white py-16 px-5 lg:px-20">

                        <div className="text-center space-y-3">
                            <h1 className="font-bold text-4xl ">How It Works</h1>
                            <p className="text-gray-600 text-lg">
                                Follow these simple steps to get your gold loan approved
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start justify-center">

                            <div className="flex flex-col items-center bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                                <div className=" bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full text-white p-1 mb-4">
                                    <span className="text-2xl font-bold flex bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 px-6 py-3 rounded-full">1</span>
                                </div>
                                <h1 className="font-semibold text-2xl  mb-2">Create Account</h1>
                                <p className="text-gray-600 text-center">
                                    Sign in to your account or create a new one.
                                </p>
                            </div>
                            <div className="flex flex-col items-center bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full text-white p-1 mb-4">
                                    <span className="text-2xl font-bold flex bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 px-6 py-3 rounded-full">2</span>
                                </div>
                                <h1 className="font-semibold text-2xl  mb-2">Fill The Form</h1>
                                <p className="text-gray-600 text-center">
                                    Fill in all your details in the form and click the next button.
                                </p>
                            </div>

                            <div className="flex flex-col items-center bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full text-white p-1 mb-4">
                                    <span className="text-2xl font-bold flex bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 px-6 py-3 rounded-full">3</span>
                                </div>
                                <h1 className="font-semibold text-2xl  mb-2">Enter Ornaments Details</h1>
                                <p className="text-gray-600 text-center">
                                    Enter all the details of your ornaments like caratage, weight, name, and image.
                                </p>
                            </div>

                            <div className="flex flex-col items-center bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full text-white p-1 mb-4">
                                    <span className="text-2xl font-bold flex bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 px-6 py-3 rounded-full">4</span>
                                </div>
                                <h1 className="font-semibold text-2xl  mb-2">Review & Finalize</h1>
                                <p className="text-gray-600 text-center">
                                    Review all the details and see the final loan amount along with interest.
                                </p>
                            </div>
                        </div>
                    </section>


                    <section id="contact" className="py-16 bg-gradient-to-t  from-white to-gray-100 scroll-animate flex flex-col lg:flex-row items-center justify-center px-5 lg:px-0">
                        {/* <form className=" flex justify-center lg:justify-end w-full lg:w-1/2 mt-10 lg:mt-20 lg:px-5">
                            <div className="w-full md:w-3/4 lg:w-1/2 px-5 md:px-10 lg:px-0">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        className="w-full border p-3 rounded-md bg-gray-100"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="w-full border p-3 rounded-md bg-gray-100"
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        className="w-full border p-3 rounded-md bg-gray-100"
                                    />
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        className="w-full rounded-md border bg-gray-100 p-3"
                                        placeholder="Message"
                                    />
                                    <button className="py-3 px-5  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-bold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form> */}
                        <ContactForm />

                        <div className="mt-32 md:mt-10 lg:mt-0 w-full lg:w-1/2 space-y-7 lg:pl-10 lg:py-20 text-center lg:text-left">
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


                    <section id="map" className="scroll-animate">
                        <div className="flex flex-col lg:flex-row w-full items-center lg:items-stretch" style={{ height: '100%' }}>
                            <div className="w-full bg-white  lg:w-[100%] p-8 lg:p-20">
                                <LeafletMapComponent />
                            </div>
                        </div>
                    </section>

                </main>
                <Footer className="scroll-animate" />
            </div>
        </>
    );
}
export default Home;
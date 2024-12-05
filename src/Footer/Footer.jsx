import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>

            <footer className="text-black mt-0  w-full shadow-xl  ">
                <div className='py-[1rem] bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500  mx-[0.10rem] shadow-xl'>
                    {/* <div className='bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 opacity-50 backdrop:blur p-1 rounded-tr-xl rounded-tl-xl mx-1 '></div> */}
                </div>

                <div className='py-5 bg-white '>
                    <div className="px-5 w-full">
                        <div className="flex flex-col md:flex-row justify-center space-x-10  my-5 items-center">
                            <div className='w-full md:w-1/4  flex-col items-center md:items-end mr-0 md:mr-0'>
                                <h1 className='font-bold text-xl'>Follow Us</h1>
                                <div className="flex justify-center mt-5 space-x-3 lg:space-x-8">
                                    <div className='rounded-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 p-1'>
                                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex text-white  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 p-3 lg:p-4 rounded-full hovers">
                                            <FaFacebookF size={16} />
                                        </a>
                                    </div>
                                    <div className='rounded-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 p-1'>
                                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="flex text-white  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 p-3 lg:p-4 rounded-full hovers">
                                            <FaTwitter size={16} />
                                        </a>
                                    </div>
                                    <div className='rounded-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 p-1'>
                                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex text-white  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 p-3 lg:p-4 rounded-full hovers">
                                            <FaInstagram size={16} />
                                        </a>
                                    </div>
                                    <div className='rounded-full bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 p-1'>
                                        <a href="https://www.linkedin.com/in/priyansh-nihalani/" target="_blank" rel="noopener noreferrer" className="flex text-white  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 p-3 lg:p-4 rounded-full hovers">
                                            <FaLinkedinIn size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='w-full border border-black' />
                        <div className='flex flex-col md:flex-row justify-between pt-3 items-center'>
                            <div className='flex flex-col md:flex-row justify-center space-x-3 mb-3 md:mb-0'>
                                <div>
                                    <Link to="/terms-and-conditions">Terms & Conditions</Link>
                                </div>
                                <div>
                                    <Link to="/privacy_policy">Privacy Policy</Link>
                                </div>
                            </div>
                            <div className='flex flex-col items-center md:items-end'>
                                <p>&copy; 2024 Gold Loan Co. All rights reserved.</p>
                            </div>
                            <div className='mt-3'>
                                <form className='flex space-x-1'>
                                    <input
                                        type="email"
                                        placeholder="Subscribe to Our Newsletter"
                                        className='p-2 border border-gray-300 rounded-l text-sm'
                                    />
                                    <button className="py-1 px-2 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-semibold text-md rounded-sm shadow-lg transform transition-transform duration-200 hover:scale-105">
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;

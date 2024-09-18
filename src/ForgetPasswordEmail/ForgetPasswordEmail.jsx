import { Link } from "react-router-dom";
import { auth } from '../firebase'
import { useState } from "react";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
function ForgetPasswordEmail() {

    const [email, setEmail] = useState("")
    const [emailerror, setEmailError] = useState(false)
    const [message, setMessage] = useState("")

    async function handleReset(e) {
        e.preventDefault();
        setEmailError(false);
    
        if (email === "") {
            setEmailError(true);
            return;
        }
    
        try {    
            await sendPasswordResetEmail(auth, email);
            setMessage("A password reset email has been sent to your email address.");
    
        } catch (error) {
            console.error("Error:", error);
            setMessage(`Error: ${error.message}`);
        }
    }
    
    


    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="mb-8 text-center max-w-md w-full">
                    <p className="text-gray-700 italic text-lg">
                        "Don't worry! It happens to the best of us. Just enter your email, and we'll help you reset your password."
                    </p>
                </div>
                <div className="bg-white/90 rounded-lg shadow-lg p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forgot Your Password?</h2>
                    <form className="flex flex-col space-y-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        {emailerror && <p className="text-red-500">Please Enter Your Email To Reset Your Password !</p>}
                        <button className="w-full p-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-bold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105" onClick={handleReset}>
                            Reset Password
                        </button>
                        {message && <p>{message}</p>}
                    </form>
                </div>
                <footer className='mt-10 relative lg:w-1/2 mx-auto border-t  flex justify-center text-black font-medium py-3'>
                    <div className='flex-col  md:w-1/2 px-0'>
                        <div className='flex flex-col md:flex-row md:space-x-3 mb-4 md:mb-0'>
                            <p><Link to={"/privacy_policy"} className='cursor-pointer'>Privacy Policy</Link></p>
                            <p><Link to={"/terms_conditions"} className='cursor-pointer'>Terms & Conditions</Link></p>
                        </div>
                    </div>
                    <div className='flex justify-end mt-0'>
                        <p>&copy; 2024 Gold Loan Co. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default ForgetPasswordEmail;

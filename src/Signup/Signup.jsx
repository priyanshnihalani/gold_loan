import './Signup.css';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { nameandphone } from '../Redux/formReducer';
import { firestoredb } from '../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
function Signup() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function onSubmit(data) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((credentials) => {
                dispatch(nameandphone({ fullname: data.fullname, phone: data.phone, email: data.email }))
                navigate('/verify-email', { state: { user: credentials.user.uid } });
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    alert("User already exists with this email.");
                } else {
                    alert("Something went wrong, please try again.");
                }
            });
    }
    function handleLogin() {
        signInWithPopup(auth, provider).then(async (users) => {
            const profile = doc(firestoredb, "users", users.user.uid);
            let collection = {
                "profile": {
                    "fullname": users.user.displayName,
                    "phone": users.user.phoneNumber,
                    "email": users.user.email
                }
            }
            await setDoc(profile, collection, {merge: true})
            navigate('/')
        })
            .catch((error) => {

                console.error(error);
            })
    }
    return (
        <>
            <div className=" py-5 bg-gray-100  min-h-screen bg-cover md:flex md:flex-col justify-center space-y-10">
                <div className="bg-cover flex items-center justify-center px-5 lg:px-0">

                    <div className=" shadow-lg relative z-10 w-full  md:w-3/4 lg:w-[50%] mx-auto bg-white py-8 flex flex-col justify-center rounded-lg px-5 lg:px-10">
                        <h1 className="font-bold text-2xl text-center ">Sign Up</h1>
                        <p className='italic mt-2 mb-10'>"Sign up today to unlock the best value for your gold and start your journey with us"</p>
                        <form className="space-y-5 " onSubmit={handleSubmit(onSubmit)}>
                            <div className='md:flex md:space-x-5 space-y-3 md:space-y-0'>
                                <div className="w-full flex flex-col items-start space-y-1">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" id="fullName" className="border rounded-md w-full py-2 pl-3" {...register('fullname', { required: 'Full Name Required' })} />
                                    {errors.fullname && <p className='text-red-500'>{errors.fullname.message}</p>}
                                </div>
                                <div className="w-full flex flex-col items-start space-y-1">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" className="border rounded-md w-full py-2 pl-3" {...register('email', { required: 'Email Required' })} />
                                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                                </div>
                            </div>
                            <div className='md:flex md:space-x-5 space-y-3 md:space-y-0'>
                                <div className="w-full flex flex-col items-start space-y-1">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id="password" className="border rounded-md w-full py-2 pl-3" {...register('password', { required: 'Password Required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                                    {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                                </div>
                                <div className="w-full flex flex-col items-start space-y-1">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input type="password" id="confirmPassword" className="border rounded-md w-full py-2 pl-3" {...register('confirmpassword', { required: 'Confirm Your Password', minLength: { value: 6, message: 'Confirm Your Password with Same Length' }, validate: (value) => value === watch('password') || "Passwords Doesn't Match" })} />
                                    {errors.confirmpassword && <p className='text-red-500'>{errors.confirmpassword.message}</p>}
                                </div>
                            </div>
                            <div className='md:flex md:space-x-5 space-y-3 md:space-y-0 items-center justify-center'>
                                <div className=" w-full flex flex-col items-start space-y-1">
                                    <label htmlFor="phoneNumber">Phone Number </label>
                                    <input type="tel" id="phoneNumber" className="border rounded-md w-full py-2 pl-3" {...register('phone', {
                                        required: 'Phone Number Required', pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Please enter a valid 10-digit phone number'
                                        }
                                    })} />
                                    {errors.phone && <p className='text-red-500'>{errors.phone.message}</p>}
                                </div>
                                <div className="w-full flex-col justify-start items-start space-y-1">
                                    <div className='w-full flex item-center space-x-3'>
                                        <input type="checkbox" id="terms" className="w-4 h-4" {...register('t_c', { required: 'Please accept terms & condition' })} />
                                        <label htmlFor="terms" className="text-sm text-gray-700">
                                            I agree to the <a href="/terms" className="text-yellow-500 font-bold">Terms and Conditions</a>
                                        </label>
                                    </div>
                                    {errors.t_c && <p className='text-red-500'>{errors.t_c.message}</p>}
                                </div>
                            </div>
                            <div className='md:flex md:space-x-5 space-y-3 md:space-y-0 items-center'>
                                <div className='w-full'>
                                    <button type='submit' className="w-full p-3  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-bold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105">
                                        Sign Up
                                    </button>
                                </div>
                                {/* <div className="flex items-center space-x-6 justify-center">
                            <hr className="w-1/4 mr-6" /> Or sign up with <hr className="w-1/4" />
                            </div> */}
                                <div className="w-full">
                                    <button type='button' className="w-full flex justify-center items-center font-bold border-2 rounded-md py-2 mx-auto" onClick={handleLogin}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40px" height="40px">
                                            <path fill="#4285F4" d="M24 9.5c1.4 0 2.7.3 3.9.9l2.9-2.9c-1.8-1-4-1.6-6.8-1.6C15.5 5.9 9 12.5 9 20.8c0 8.3 6.5 14.9 14.8 14.9 8.1 0 13.9-5.6 13.9-13.9 0-1-.1-1.7-.3-2.5H24v4.7h8.6c-.5 2.6-3.3 6.4-8.6 6.4-5.1 0-9.2-4.1-9.2-9.2s4.1-9.2 9.2-9.2z" />
                                            <path fill="#34A853" d="M14.4 24.4c-.1-.4-.2-.9-.2-1.4s.1-1 .2-1.4l-4.8-3.7c-.9 1.8-1.4 3.8-1.4 5.9s.5 4.1 1.4 5.9l4.8-3.7z" />
                                            <path fill="#FBBC05" d="M24 33.7c-2.4 0-4.5-.7-6.2-2l-4.8 3.7c2.8 2.7 6.5 4.3 11 4.3 4.2 0 7.7-1.5 10.3-4.1l-4.7-3.7c-1.3 1-3 1.8-5.6 1.8z" />
                                            <path fill="#EA4335" d="M38.7 20.8c0-.9-.1-1.8-.3-2.6H24v5h8.7c-.4 2.1-1.5 3.8-2.9 4.8l4.7 3.7c2.9-2.7 4.6-6.7 4.6-11.9z" />
                                        </svg>
                                        <span className="ml-2">Google</span>
                                    </button>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/sign_in" className="underline text-yellow-500 font-bold hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
                <footer className='relative lg:w-1/2 mx-auto border-t-2  flex justify-center text-black font-medium py-3'>
                    <div className='flex-col  md:w-1/2 px-0'>
                        <div className='flex flex-col md:flex-row md:space-x-3 mb-4 md:mb-0'>
                            <p><Link to={"/privacy_policy"} className='cursor-pointer'>Privacy Policy</Link></p>
                            <p><Link className='cursor-pointer'>Terms & Conditions</Link></p>
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

export default Signup;

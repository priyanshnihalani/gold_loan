import './Signin.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';

function Signin() {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmit = (data) => {
        signInWithEmailAndPassword(auth, data.email, data.password).then(() => navigate('/', {replace: true}))
        .catch((error) => {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                alert("Username or Password is incorrect")
              }
              else{
                alert("Someting went wrong, Try again.")
                console.log(error)
              }
        })
      };
      function handleLogin(){
        signInWithPopup(auth, provider).then(() => navigate('/', {replace: true}))
        .catch((error) => {
            console.error(error);
        })
      }
    return (
        <>
            <div className="bg-gray-100 min-h-screen bg-cover flex flex-col space-y-10 items-center justify-center px-5 lg:px-0">

                <div className="relative z-10 w-full md:w-3/4 lg:w-[30%] mx-auto shadow-lg bg-white py-5 flex flex-col justify-center rounded-lg px-5 lg:px-10">
                    <h1 className="font-bold text-2xl ml-0 mt-5  ">Sign in</h1>
                    <p className='mt-2 italic'>"Access your gold loan account and manage your finances with ease."</p>
                    <form className="py-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col items-start space-y-1">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" className="border rounded-md w-full py-2 pl-3" {...register('email', {required: 'Email Address Required'})}/>
                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                        </div>
                        <div className="flex flex-col items-start space-y-1">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" className="border rounded-md w-full py-2 pl-3" {...register('password', {required: 'Password Required', minLength: {value:6, message:'Password must be at least 6 characters'}})} />
                            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}

                        </div>
                        <div>
                        <button  className="w-full  p-3  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-bold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105" type='submit'>
                                            Sign In
                                    </button>
                        </div>
                        <div className="flex items-center space-x-6 justify-center">
                            <hr className="w-1/4 mr-6" /> Or continue with <hr className="w-1/4" />
                        </div>
                        <div className="w-full">
                            <button onClick={handleLogin} type='button' className="w-full flex justify-center items-center font-bold border-2 rounded-md py-2 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40px" height="40px">
                                    <path fill="#4285F4" d="M24 9.5c1.4 0 2.7.3 3.9.9l2.9-2.9c-1.8-1-4-1.6-6.8-1.6C15.5 5.9 9 12.5 9 20.8c0 8.3 6.5 14.9 14.8 14.9 8.1 0 13.9-5.6 13.9-13.9 0-1-.1-1.7-.3-2.5H24v4.7h8.6c-.5 2.6-3.3 6.4-8.6 6.4-5.1 0-9.2-4.1-9.2-9.2s4.1-9.2 9.2-9.2z" />
                                    <path fill="#34A853" d="M14.4 24.4c-.1-.4-.2-.9-.2-1.4s.1-1 .2-1.4l-4.8-3.7c-.9 1.8-1.4 3.8-1.4 5.9s.5 4.1 1.4 5.9l4.8-3.7z" />
                                    <path fill="#FBBC05" d="M24 33.7c-2.4 0-4.5-.7-6.2-2l-4.8 3.7c2.8 2.7 6.5 4.3 11 4.3 4.2 0 7.7-1.5 10.3-4.1l-4.7-3.7c-1.3 1-3 1.8-5.6 1.8z" />
                                    <path fill="#EA4335" d="M38.7 20.8c0-.9-.1-1.8-.3-2.6H24v5h8.7c-.4 2.1-1.5 3.8-2.9 4.8l4.7 3.7c2.9-2.7 4.6-6.7 4.6-11.9z" />
                                </svg>
                                <span className="ml-2">Google</span>
                            </button>
                        </div>
                        <div className='md:flex justify-center items-center space-y-2 underline mt-10 md:space-x-6 md:space-y-0'>
                            <div>
                                <Link to={'/forgetpassword'}>Forget Password?</Link>
                            </div>
                            <div>
                                <Link to={'/sign_up'}>Create a new account</Link>
                            </div>
                        </div>
                    </form>
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
            {/* <div className="mx-auto px-5 lg:px-0 lg:w-[80%] xl:w-1/2 text-left space-y-3 py-5">
                <h1 className="text-2xl font-semibold text-yellow-500">Account Recovery</h1>
                <p className="text-sm">
                    <span className="text-xl text-gray-700">Forgot your password?</span><br />
                    Don’t worry, it happens to the best of us. Simply click the "Forgot Password?" link above, and we’ll guide you through the process to securely reset your password. If you need further assistance, our support team is here to help. Contact us at [support email] or call [support phone number].
                </p>
                <p className="text-sm">
                    <span className="text-xl text-gray-700">Trouble accessing your account?</span><br />
                    If you're having trouble signing in or accessing your account, we're here to assist you. Please reach out to our customer support team, and we’ll work with you to resolve any issues as quickly as possible.
                </p>
            </div>

            <div className="mx-auto px-5 lg:px-0 lg:w-[80%] xl:w-1/2 text-left space-y-3 py-5">
                <h1 className=" text-2xl font-semibold text-yellow-500">Security Assurance</h1>
                <p className="text-sm">
                    <span className="text-xl text-gray-700">Your Security is our Priority.</span><br />
                    At Gold Loan Co., we take the protection of your personal information very seriously. Our website uses advanced encryption technologies to ensure that your data is safe and secure. You can trust that every interaction on our platform is safeguarded with the highest levels of security.
                </p>
                <p className="text-sm">
                    <span className="text-xl text-gray-700">We value your privacy</span><br />
                    Your privacy is important to us. We are committed to protecting your personal information and ensuring that your data is handled with the utmost care. For more details on how we manage your data, please review our Privacy Policy.
                </p>
            </div> */}
        </>
    );
}

export default Signin;
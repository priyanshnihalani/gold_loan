import { sendEmailVerification, reload as reloadUser } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestoredb } from "../firebase";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";

function EmailVerify() {
    const nameandphone = useSelector((state) => state.form.form1);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [sentEmail, setSentEmail] = useState(false);
    const countRef = useRef(0); 

    useEffect(() => {
        const  unsubscribe = auth.onAuthStateChanged( async (currentUser) => {
            if (currentUser) {
                if (!sentEmail) {
                    handleVerification(currentUser);
                } else if (currentUser.emailVerified) {
                    navigate('/', {replace: true});
                }
            } else {
                setError("No user is currently authenticated.");
            }
        }, []);

        async function handleVerification(user) {
            try {
                if (!sentEmail) {
                    await sendEmailVerification(user);
                    setSentEmail(true);

                    countRef.current = 0; 
                    const maxAttempts = 12;

                    const intervalId = setInterval(() => {
                        reloadUser(user)
                            .then(async () => {
                                if (user.emailVerified) {
                                    clearInterval(intervalId);
                                    const profile = doc(firestoredb, "users", user.uid);
                                    let collection = {
                                        "profile":nameandphone
                                    }
                                    await setDoc(profile, collection, {merge:true})
                                    navigate('/');
                                    console.log(user)
                                }
                            })
                            .catch((error) => {
                                if (error.code === 'auth/user-token-expired') {
                                    setError("Your session has expired. Please log in again.");
                                    clearInterval(intervalId);
                                    user.delete()
                                } else {
                                    console.error('Error reloading user:', error);
                                }
                            });

                        countRef.current++;
                        if (countRef.current >= maxAttempts) {
                            setError("Please try again...");
                            user.delete()
                            clearInterval(intervalId);
                        }
                    }, 5000);
                }
            } catch (error) {
                setError("Failed to send verification email. Please try again.");
                console.error('Error sending verification email:', error);
                user.delete()
            }
        }

        return () => unsubscribe();
    }, [navigate, sentEmail]); 

    return (
        <div className="w-full flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
                <h1 className="text-2xl font-bold mb-4">Verification Email Sent</h1>
                <p className="text-gray-700 mb-6">We have sent an email verification link to your email address. Please check your inbox and follow the instructions to verify your email.</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
            </div>
        </div>
    );
}

export default EmailVerify;

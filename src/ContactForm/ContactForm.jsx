import { useForm } from "react-hook-form";
import { auth, firestoredb } from "../firebase";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore"; // Import collection and addDoc
import Swal from "sweetalert2";
import { useState } from "react";

function ContactForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const countRef = doc(firestoredb, 'contact', 'count');
                    const snapshot = await getDoc(countRef);
                    
                    let count = 1;
                    if (snapshot.exists()) {
                        count = snapshot.data().count + 1;
                    }

                    // Instead of using user.uid for the document ref,
                    // add the data to a subcollection for that user
                    const userContactRef = collection(firestoredb, `contact`); // Create a subcollection
                    await addDoc(userContactRef, data); // Use addDoc to create a new document

                    // Update the counter in Firestore directly
                    await setDoc(countRef, { count });

                    // Show success message
                    Swal.fire({
                        title: 'Success',
                        text: 'Form Data Submitted Successfully',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } catch (error) {
                    console.error(error);
                }
            } else {
                Swal.fire({
                    title: 'Warning',
                    text: 'Please Login To Contact Us',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    return (
        <form className="flex justify-center lg:justify-end w-full lg:w-1/2 mt-10 lg:mt-20 lg:px-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full md:w-3/4 lg:w-1/2 px-5 md:px-10 lg:px-0">
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full border p-3 rounded-md bg-gray-100"
                        {...register("name", { required: "Full Name Required" })}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded-md bg-gray-100"
                        {...register("email", { required: "Email Required" })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="w-full border p-3 rounded-md bg-gray-100"
                        {...register("phone", { required: "Phone Required" })}
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                    <textarea
                        name="message"
                        id="message"
                        rows={4}
                        className="w-full rounded-md border bg-gray-100 p-3"
                        placeholder="Message"
                        {...register("message", { required: "Message Required" })}
                    />
                    {errors.message && <p className="text-red-500">{errors.message.message}</p>}
                    <button className="py-3 px-5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-bold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ContactForm;

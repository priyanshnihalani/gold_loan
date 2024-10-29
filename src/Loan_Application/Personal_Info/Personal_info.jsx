import { useRef } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import './Personal_info.css';
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { auth, firestoredb } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function PersonalInfo() {
    const sigCanvas = useRef({});
    const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm()
    const clearSignature = () => {
        sigCanvas.current.clear();
        setValue('signature', '');
        trigger('signature');
    };

    const navigate = useNavigate();

    async function onSubmit(data) {
        try {
            const canvas = sigCanvas.current.getTrimmedCanvas();
            
            await new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to convert canvas to Blob'));
                }, 'image/png');
            });
    
            const user = auth.currentUser;
            if (user) {
                const personalInfo = doc(firestoredb, "users", user.uid); 
                const collection = {
                    personal_Info : {...data}
                }                
                await setDoc(personalInfo, collection, {merge: true});
    
                navigate('/gold_info');
            } else {
                throw new Error('User is not authenticated');
            }
        } catch (error) {
            alert(error.message);
        }
    }
    
    return (
        <>

            <Header />
            <div className="w-full bg-white min-h-screen p-4 md:p-6">
                <div className=" mt-28 md:mx-auto lg:w-1/2 text-balance md:text-justify px-8 space-y-2">
                    <h2 className="text-2xl font-bold text-justify text-yellow-500">How Gold Loan is Important?</h2>
                    <p className="text-justify text-lg">
                        A gold loan is a quick and reliable way to access funds by leveraging your gold assets without having to sell them. It offers lower interest rates, flexible repayment options, and immediate loan disbursement, making it an ideal choice for urgent financial needs.
                    </p>
                </div>
                <form className="mx-auto md:w-[80%] py-4 rounded-lg my-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto overflow-x-auto space-x-6 pb-4 mt-5 bg-white shadow rounded-lg scroller">
                        <div className="flex-shrink-0 w-full p-4 rounded-lg min-w-[300px]">
                            {/* Loan Request Details Section */}
                            <section>
                                <h2 className="text-xl font-semibold mb-10">Loan Request Details</h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        
                                        <div>
                                            {errors.loanamount && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.loanamount.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Loan Period:</label>
                                            <input
                                                type="text"
                                                className="flex-1 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                placeholder="Months"
                                                {...register('loanperiod', {
                                                    required: "No. of Months required",
                                                    validate: value => !isNaN(value) && value >= 0 || 'Month must be in positive integer'
                                                })}
                                            />
                                        </div>
                                        <div>
                                            {errors.loanperiod && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.loanperiod.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Purpose of Loan:</label>
                                            <input
                                                type="text"
                                                className="flex-1 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                {...register('purpose', { required: "Purpose of Loan Required" })}
                                            />
                                        </div>
                                        <div>
                                            {errors.purpose && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.purpose.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Personal Information Section */}
                            <section className="mt-8">
                                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Name:</label>
                                            <input
                                                type="text"
                                                className="flex-1 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                {...register('name', { required: "Name Required" })}
                                            />
                                        </div>
                                        <div>
                                            {errors.name && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Son/Daughter/Wife of:</label>
                                            <input
                                                type="text"
                                                className="flex-1 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                {...register('nominee', { required: "Name of Nominee Required" })}
                                            />
                                        </div>
                                        <div>
                                            {errors.nominee && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.nominee.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-gray-700">Present Address</label>
                                                <textarea
                                                    className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                    rows="4"
                                                    {...register('presentaddress', { required: "Your Present Address Required" })}
                                                ></textarea>
                                            </div>
                                            <div>
                                                {errors.presentaddress && (
                                                    <p className="text-red-500">
                                                        <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                        {errors.presentaddress.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-gray-700">Permanent Address</label>
                                                <textarea
                                                    className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                    rows="4"
                                                    {...register('permanentaddress', { required: "Your Permanent Address Required" })}
                                                ></textarea>
                                            </div>
                                            <div>
                                                {errors.permanentaddress && (
                                                    <p className="text-red-500">
                                                        <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                        {errors.permanentaddress.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Age:</label>
                                            <input
                                                type="text"
                                                className="w-20 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                {...register('age', {
                                                    valueAsNumber: true,
                                                    required: "Your Age Required",
                                                    min: { value: 20, message: "The Age Shouldn't Be less than 20" },
                                                    max: { value: 60, message: "The Age Shouldn't exceed 60" },
                                                    validate: value => !isNaN(value) || "The value must be numeric, between 20 and 60."
                                                })}
                                            />
                                        </div>
                                        <div>
                                            {errors.age && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.age.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Occupation:</label>
                                            <input
                                                type="text"
                                                className="flex-1 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                {...register('occupation', { required: "Your Occupation Required." })}
                                            />
                                        </div>
                                        <div>
                                            {errors.occupation && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.occupation.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Bank Info and Signature Section */}
                        <div className="flex-shrink-0 w-full p-4 rounded-lg min-w-[300px]">
                            <section className="px-2 lg:px-4">
                                <h2 className="text-xl font-semibold mb-6">Bank Info</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Select Bank:</label>
                                            <select className="w-full border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500" {...register('bank', { required: "Select Your Bank" })}>
                                                <option value="" defaultChecked>Bank</option>
                                                <option value="SBI">State Bank of India</option>
                                                <option value="HDFC">HDFC Bank</option>
                                                <option value="PNB">Punjab National Bank</option>
                                                <option value="Kotak">Kotak Bank</option>
                                            </select>
                                        </div>
                                        <div>
                                            {errors.bank && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.bank.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">Account Number:</label>
                                            <input
                                                type="text"
                                                className="flex-1 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                {...register('accountnumber', { required: "Your Account Number Required." })}
                                            />
                                        </div>
                                        <div>
                                            {errors.accountnumber && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.accountnumber.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-gray-700">IFSC Code:</label>
                                            <input
                                                type="text"
                                                className="flex-1 border-b-2 border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                                                {...register('ifsc', { required: "Your IFSC Code Required" })}
                                            />
                                        </div>
                                        <div>
                                            {errors.ifsc && (
                                                <p className="text-red-500">
                                                    <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                                    {errors.ifsc.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Signature Section */}
                            <section className="mt-8 flex flex-col items-center">
                                <label className="block font-bold text-lg mb-3">Signature of Pawner:</label>
                                <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white max-w-full">
                                    <div className="relative">
                                        <ReactSignatureCanvas
                                            ref={sigCanvas}
                                            penColor="black"
                                            canvasProps={{
                                                width: 620,
                                                height: 150,
                                                className: "w-full h-full max-h-[150px]"
                                            }}
                                            onEnd={() => {
                                                setValue('signature', sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
                                                trigger("signature");
                                            }}
                                        />
                                    </div>
                                    <input {...register('signature', { required: 'Signature is required' })} type="hidden" />
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-4"
                                    >
                                        Clear Signature
                                    </button>
                                </div>
                                {errors.signature && (
                                    <p className="text-red-500 mt-2">
                                        <FontAwesomeIcon icon={faWarning} className="mr-2"></FontAwesomeIcon>
                                        {errors.signature.message}
                                    </p>
                                )}
                            </section>
                        </div>
                    </div>

                    <div className="flex justify-center my-8">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-semibold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105"
                        >
                            <span className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 flex justify-center w-full rounded-sm px-8 py-2">
                                Next
                            </span>
                        </button>
                    </div>
                </form>


                <div className="additional-instructions">
                    <div className=" md:mx-auto lg:w-1/2 space-y-2 md:text-justify text-lg">
                        <h2 className="text-2xl  font-bold text-yellow-500 ">Additional Instructions</h2>
                        <div className="">
                            <li>
                                Please complete all sections of the form.
                            </li>
                        </div>
                        <div className="text-clip">
                            <div>
                                <li>
                                    Bring the following documents and items when you visit our office:
                                </li>
                            </div>
                            <div className="ml-5 md:ml-10">
                                <p>
                                    Gold ornaments/jewelry to be pledged.
                                </p>
                                <p>
                                    Government-issued ID (e.g., driver's license, Aadhaar card, passport).
                                </p>
                                <p>
                                    Recent utility bill or other proof of address.
                                </p>
                            </div>
                        </div>
                        <div>
                            <li>
                                Ensure that the gold items are free from any encumbrance or legal disputes.
                            </li>
                            <li>
                                Processing of the loan will be initiated once the gold's purity and weight have been verified.
                            </li>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default PersonalInfo;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Footer from '../Footer/Footer';
import './Loan_Info.css';
import goldApi from '../goldApi.json';
import Header from '../Header/Header';
import { auth, firestoredb, storage } from '../firebase';
import { useNavigate } from 'react-router';
import emailjs from 'emailjs-com'
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Loan_Info = () => {

    const [data, setData] = useState({});
    const [carat, setCarat] = useState([]);
    const [weight, setWeight] = useState([]);
    const [weightPrice, setWeightPrice] = useState([]);
    const [caratPrice, setCaratPrice] = useState([]);
    const form2Data = useSelector((state) => state.form.form2);
    const [goldPrice, setGoldPrice] = useState(0);
    const [eligibleAmount, setEligibleAmount] = useState([])
    const [interest, setInterest] = useState([])
    const [grandTotal, setGrandTotal] = useState(0)
    const [grandInterest, setGrandInterest] = useState(0)
    const [finalData, setFinalData] = useState([])
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const itemCarat = form2Data.map((item) => item.itemCarat.slice(0, 2));
        setCarat(itemCarat);
        const itemWeight = form2Data.map((item) => item.itemWeight);
        setWeight(itemWeight);
        async function fetchInfo() {
            try {
                setData(goldApi);
            } catch (error) {
                console.error(error);
            }
        }
        fetchInfo();
    }, [form2Data]);

    useEffect(() => {
        const goldprice = ((Number(data.price_gram_24k) + (Number(data.price_gram_24k) * 6 / 100)).toFixed(2) * 10);
        let caratPrice = carat.map((item) => {
            return (Number(item / 24 * goldprice)).toFixed(2);
        });
        let weightPrice = weight.map((item, index) => {
            return (item * Number(caratPrice[index] / 10)).toFixed(2)
        });

        let eligiblePrice = weightPrice.map((item) => {
            return Number(item * 75 / 100).toFixed(2);
        });

        setGoldPrice(goldprice);
        setCaratPrice(caratPrice);
        setWeightPrice(weightPrice);
        setEligibleAmount(eligiblePrice);

    }, [data, carat]);

    useEffect(() => {
        let interest = eligibleAmount.map((item) => {
            return Number(item * 18 / 100).toFixed(2)
        })
        let total = eligibleAmount.reduce((prev, next) => {
            return (Number(prev) + Number(next)).toFixed(2);
        }, 0)
        let interest_total = interest.reduce((prev, next) => {
            return (Number(prev) + Number(next)).toFixed(2);
        }, 0)
        setInterest(interest)
        setGrandTotal(total)
        setGrandInterest(interest_total)
    }, [eligibleAmount])

    useEffect(() => {
        const updatedData = form2Data.map((item, index) => ({
            image: item.image,
            ornamentName: item.itemName,
            carats: item.itemCarat,
            weight: item.itemWeight,
            goldPrice: goldPrice,
            caratPrice: caratPrice[index],
            weightplusCarat: caratPrice[index],
            eligibleAmount: eligibleAmount[index],
            interest: interest[index]
        }));

        setFinalData(updatedData);
    }, [form2Data, goldPrice, caratPrice, eligibleAmount, interest]);



    async function handleApply(e) {
        e.preventDefault();
        setLoading(true)
        const user = auth.currentUser;
        if (user && grandTotal > 0) {
            try {
                const document = doc(firestoredb, "account", user.uid)

                function randomValue(min, max) {
                    return Math.round(Math.random() * (max - min + 1) + min);
                }
                setDoc(document, { Balance: randomValue(100000, 1000000), salary: randomValue(50000, 100000) }).then(
                    console.log("Document added with ID: ", document.id)
                )
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    })

                const itemPromises = finalData.map(async (item, index) => {
                    const mortgate_ornaments = doc(firestoredb, "users", user.uid);
                    const collection = {
                        "loan_info": {
                            "ornaments": {
                                [`${index}`]: item
                            }
                        }
                    }

                    try {
                        await setDoc(mortgate_ornaments, collection, { merge: true });
                    } catch (error) {
                        console.error("Error setting item:", error);
                    }
                });

                // Wait for all item updates to complete
                await Promise.all(itemPromises);

                // Reference and set the TotalAmountInterest document
                const total = doc(firestoredb, "users", user.uid);
                const collection1 = {
                    "loan_info": {
                        "TotalAmountInterest": {
                            TotalAmount: grandTotal, TotalInterest: grandInterest
                        }
                    }
                }
                await setDoc(total, collection1, { merge: true });


                const status = doc(firestoredb, "users", user.uid);
                const collection2 = {
                    "loan_info": {
                        "status": {
                            loanStatus: 'pending...'
                        }
                    }
                }
                await setDoc(status, collection2, { merge: true });

                const templateForm = {
                    to_email: user.email,
                    to_name: user.displayName || 'Valued Customer',
                    from_name: 'Mannat Gold Loans',
                };

                await emailjs.send('service_6ua5b5v', 'template_295do08', templateForm, 'B8P7nWodrCWRWJC27')
                    .then(() => {
                        navigate('/');
                        setLoading(false)
                    })
                    .catch((error) => {
                        alert("Error sending email:", error);
                    });

            } catch (error) {
                console.error("Error in handleApply:", error);
            }
        } else {
            alert("No authenticated user found.");
        }
    }


    return (
        <>
            <Header />
            <div className="shadow min-h-screen">
                <div className="w-full py-5  space-y-10 lg:flex lg:justify-center lg:space-y-0  ">
                    <div className=" mt-10 md:mt-24 lg:mt-20 mx-0 md:mx-auto flex flex-col">
                        <div className='text-justify my-10'>
                            <div className='flex-col space-y-3 px-10'>
                                <h1 className='font-bold text-xl text-yellow-500'>Why Gold Loan?</h1>
                                <p className='text-lg'>
                                    A gold loan offers a valuable financial solution for individuals seeking quick access  to funds <br /> without selling their precious assets.
                                    <br /> <br /> By pledging gold jewelry or coins as collateral, borrowers can secure loans at relatively low <br /> interest   rates compared to unsecured loans. This is due to the inherent value of gold, <br />which  provides  lenders  with a tangible asset to mitigate risk
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col justify-center md:flex-row  space-x-5'>
                            <div className=''>
                                {form2Data.map((item, index) => (
                                    <div key={index} className="my-2 p-4 shadow  border flex flex-col md:flex-row items-center md:items-center md:justify-center">
                                        <div className="flex flex-col items-center md:items-start">
                                            <img src={item.image} alt="gold-item-image" className="w-60 h-60 object-cover rounded mb-4" />
                                            <div className="border-b-2 space-y-1 border-yellow-500 p-3 pb-1 w-full md:w-60 ">
                                                <label htmlFor="name" className="block text-left text-xs lg:text-sm font-bold mt-1">Name of Item</label>
                                                <p className="text-left text-pink-950 text-sm w-full bg-transparent">{item.itemName}</p>
                                            </div>
                                            <div className="border-b-2 space-y-1 border-yellow-500 p-3 pb-1 mt-4 w-full md:w-60">
                                                <label htmlFor="carats" className="block text-left text-xs lg:text-sm font-bold mt-1">Carats of Item</label>
                                                <p className="text-left text-pink-950 text-sm w-full bg-transparent">{item.itemCarat}</p>
                                            </div>
                                            <div className="border-b-2 space-y-1 border-yellow-500 p-3 pb-1 mt-4  w-full md:w-60">
                                                <label htmlFor="weight" className="block text-left text-xs lg:text-sm font-bold mt-1">Weight of Item</label>
                                                <p className="text-left text-pink-950 text-sm w-full bg-transparent">{item.itemWeight}g</p>
                                            </div>
                                        </div>
                                        <hr className='w-full border-4 md:mt-5 md:hidden' />
                                        <div className="flex flex-col p-4 justify-end items-end md:ml-6 min-h-full">
                                            <div className="text-center md:text-left ">
                                                <div className="mb-4 border-b-2 space-y-2 border-yellow-500 p-3 pb-1">
                                                    <span className="font-bold">Current Gold Rate:</span>
                                                    <p className="text-pink-950">₹ {Number(goldPrice)}</p>
                                                </div>
                                                <div className="mb-4 border-b-2 space-y-2 border-yellow-500 p-3 pb-1">
                                                    <span className="font-bold">Gold Rate as Per your Jewellery Carats :</span>
                                                    <p className="text-pink-950">
                                                        ₹ {Number(caratPrice[index])}
                                                    </p>
                                                </div>
                                                <div className="mb-4 border-b-2 space-y-2  border-yellow-500 p-3 pb-1">
                                                    <span className="font-bold">Price of Gold as per your Jewellery Weight :</span>
                                                    <p className="text-pink-950">
                                                        ₹ {weightPrice[index]}
                                                    </p>
                                                </div>
                                                <div className="mb-4 border-b-2 space-y-2  border-yellow-500 p-3 pb-1">
                                                    <span className="font-bold"> Eligible Amount 75%  :</span>
                                                    <p className="text-pink-950">
                                                        ₹ {eligibleAmount[index]}
                                                    </p>
                                                </div>
                                                <div className="mb-4 border-b-2 space-y-2 border-yellow-500 p-3 pb-1">
                                                    <span className="font-bold"> 18% interest amount :</span>
                                                    <p className="text-pink-950">
                                                        ₹ {interest[index]}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='lg:mx-0 flex flex-col justify-start md:w-1/2 lg:w-1/3 space-y-5 '>
                                <h1 className='font-bold text-2xl'><span className='text-yellow-500'>Break-up of </span> Ornaments Value</h1>
                                <div className='my-2 shadow p-3 border'>
                                    <div className="mb-4 border-b-2 space-y-2 border-yellow-500 p-3 pb-1">
                                        <span className="font-bold"> Total Loan Amount  </span>
                                        <p className='text-pink-950'>
                                            ₹ {grandTotal}
                                        </p>
                                    </div>
                                    <div className="mb-4 border-b-2 space-y-2 border-yellow-500 p-3 pb-1">
                                        <span className="font-bold"> Total Interest Amount </span>
                                        <p className='text-pink-950'>
                                            ₹ {grandInterest}
                                        </p>
                                    </div>
                                    <button className='w-full mt-2 mb-4 border-2 rounded border-yellow-500 p-3  text-black font-bold ' onClick={handleApply}>
                                        {loading ?  <div className="loader mx-auto"></div> : <span>Apply For Loan</span>  }
                                     
                                        </button>
                                </div>
                            </div>
                        </div>
                        <div className='text-justify my-10 px-10'>
                            <div className='flex-col space-y-3'>
                                <h1 className='font-bold text-xl text-yellow-500'>Frequently Asked Questions (FAQs)</h1>
                                <p className='text-lg'>
                                    <span className='font-bold'>Can I pledge gold coins for a gold loan? </span> <br />
                                    Yes, some lenders accept gold coins, but usually, they should be of 24 karats and a certain weight. <br /><br />
                                    <span className='font-bold'> What happens if I cannot repay the gold loan? </span> <br />The lender may auction the pledged gold to recover the outstanding loan amount. <br /><br />
                                    <span className='font-bold'>
                                        Is there any maximum amount I can borrow? </span> <br /> The loan amount depends on the gold's value, and lenders often have a maximum limit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Loan_Info;
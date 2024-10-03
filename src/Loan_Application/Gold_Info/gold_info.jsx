import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import imageCompression from 'browser-image-compression';
import { faTrashAlt as faAnimatedTrash, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Footer from "../../Footer/Footer.jsx";
import './gold_info.css'
import goldApi from '../../goldApi.json';
import Header from "../../Header/Header.jsx";
import { useDispatch } from "react-redux";
import { goldinfo } from '../../Redux/formReducer.js'
import { useNavigate } from "react-router";
import { auth, firestoredb } from "../../firebase.js";
import { doc, setDoc } from "firebase/firestore";

function Gold_info() {

  const navigate = useNavigate()
  const [goldPrice, setGoldPrice] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [totalValue, setTotalValue] = useState({})
  const [eligibleValue, setEligibleValue] = useState(0)
  const [goldInfo, setGoldInfo] = useState([
    {
      image: "",
      itemName: "",
      itemCarat: "",
      itemWeight: ""
    },
  ])
  const [goldError, setGoldError] = useState([{
    image: false,
    itemName: false,
    itemCarat: false,
    itemWeight: false
  }])
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchInfo() {
      try {
        setData(goldApi);
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false)
      }
    }
    setTimeout(() => {
      fetchInfo();
    }, 3000)

  }, [])
  useEffect(() => {
    if (data) {
      const goldPrice = ((Number(data.price_gram_24k) + (Number(data.price_gram_24k) * 6 / 100)).toFixed(2) * 10);
      setGoldPrice(goldPrice)
    }
  }, [data])

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


  function handleChange(e, index) {
    const { name, value } = e.target;

    const updatedJewellery = goldInfo.map((details, i) =>
      i === index ? { ...details, [name]: value } : details
    );

    const newTotalValue = ((((Number(updatedJewellery[index].itemCarat.slice(0, 2)) / 24) * goldPrice).toFixed(2)) / 10) * Number(updatedJewellery[index].itemWeight);

    const newEligibleValue = (Number(newTotalValue) * 75 / 100).toFixed(2);

    setGoldInfo(updatedJewellery);
    setTotalValue(prevItems => ({
      ...prevItems,
      [index]: newTotalValue.toFixed(2)
    }));
    setEligibleValue(prevItems => ({
      ...prevItems,
      [index]: newEligibleValue
    }));
  }

  console.log(totalValue)
  console.log(eligibleValue)


  function handleImageChange(e, index) {
    const file = e.target.files[0];

    if (file) {
      const options = {
        maxSizeKb: 300,
        maxWidthOrHeight: 600,
        useWebWorker: true
      };

      imageCompression(file, options)
        .then((compressedFile) => {
          const reader = new FileReader();

          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => {
            const newItems = [...goldInfo];
            newItems[index].image = reader.result.toString();
            setGoldInfo(newItems);
          };
        })
        .catch((error) => {
          console.error('Error compressing the image:', error);
        });
    }
  }

  const jewelleryCard = (index) => (
    <div className="md:w-[80%] xl:w-1/2 md:mx-auto flex flex-col text-xs space-y-4 shadow px-4 py-4 rounded ">
      <div className="flex md:ml-10 lg:ml-[6rem] xl:ml-[3rem] -space-x-8">
        <div className="flex-col items-center space-y-2">
          <input
            type="file"
            name="image"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => handleImageChange(e, index)}
          />
          <div>
            {goldError[index].image && <span className="error text-red-500">
              <FontAwesomeIcon icon={faWarning} />
              Image is required
            </span>}
          </div>
        </div>
        <button type="button" onClick={() => deleteItem(index)}>
          <FontAwesomeIcon icon={faAnimatedTrash} size="2x" color="red" />
        </button>
      </div>
      <div className="md:flex md:space-x-3 md:justify-start md:ml-10">
        <div className="parent-div flex flex-col items-start px-2 py-[5px] space-y-2 rounded-md focus-within:border-pink-950 focus-within:border-2">
          <label htmlFor={`itemName${index}`} className="block text-left text-xs md:text-sm lg:text-lg font-bold text-gray-800 mt-1">
            Ornaments*
          </label>
          <input
            type="text"
            name="itemName"
            id={`itemName${index}`}
            placeholder="Chain"
            className="text-gray-400 text-lg focus:outline-none border-b border-pink-950"
            onChange={(e) => handleChange(e, index)}
            value={goldInfo[index].itemName}
          />
          {goldError[index].itemName && <span className="error text-red-500">
            <FontAwesomeIcon icon={faWarning} />
            Ornament Name Required</span>}
        </div>
        <div className="parent-div flex flex-col items-start px-2 py-[5px] space-y-2 rounded-md focus-within:border-pink-950 focus-within:border-2">
          <label htmlFor={`itemCarat${index}`} className="block text-left text-xs md:text-sm lg:text-lg font-bold text-gray-800 mt-1">
            Caratage *
          </label>
          <select className="border-b border-pink-950 text-lg w-1/2 md:w-full"
            name="itemCarat"
            id={`itemCarat${index}`}
            onChange={(e) => handleChange(e, index)}
            value={goldInfo[index].itemCarat}
          >
            <option value="10k">10K</option>
            <option value="14k">14K</option>
            <option value="18k">18K</option>
            <option value="20k">20K</option>
            <option value="22k">22K</option>
            <option value="24k">24K</option>
          </select>
          {goldError[index].itemCarat && <span className="error text-red-500">
            <FontAwesomeIcon icon={faWarning} />
            Ornament Carats Required</span>}

        </div>
        <div className="parent-div  flex flex-col items-start px-2 py-[5px] space-y-2 rounded-md focus-within:border-pink-950 focus-within:border-2">
          <label htmlFor={`itemWeight${index}`} className="block text-left text-xs md:text-sm lg:text-lg font-bold text-gray-800 mt-1">
            Weight in grams *
          </label>
          <input
            type="text"
            name="itemWeight"
            id={`itemWeight${index}`}
            placeholder="20"
            className="text-gray-400 text-lg focus:outline-none border-b border-pink-950"
            onChange={(e) => handleChange(e, index)}
            value={goldInfo[index].itemWeight}
          />
          {goldError[index].itemWeight && <span className="error text-red-500">
            <FontAwesomeIcon icon={faWarning} />
            Ornament Weight Required</span>}
        </div>
      </div>
      <div className="md:flex lg:ml-[3rem] space-y-3 md:space-y-0 md:space-x-5">
        <div className="text-lg border rounded px-3">
          <p>Total Value: ₹ {totalValue[index] ? totalValue[index] : 0.00}</p>
        </div>
        <div className="text-lg border rounded px-3">
          Eligible Amount: ₹  {eligibleValue[index] ? eligibleValue[index] : 0.00}
        </div>
      </div>
    </div>
  );

  const deleteItem = (index) => {
    setGoldInfo((prevItems) => {
      return prevItems.filter((_, i) => i !== index);
    });
    setGoldError((prevItems) => {
      return prevItems.filter((_, i) => i !== index);
    });
  };

  function addItem() {
    setGoldInfo([
      ...goldInfo,
      {
        image: "",
        itemName: "",
        itemCarat: "",
        itemWeight: ""
      }
    ])
    setGoldError([
      ...goldError,
      {
        image: false,
        itemName: false,
        itemCarat: false,
        itemWeight: false
      }
    ])
  }
  function handleSubmit(e) {
    e.preventDefault()

      const newGoldError = goldError.map(error => ({ ...error }));
      let hasError = false; 
    
      
      goldInfo.forEach((item, index) => {
        if (!item.image) {
          newGoldError[index].image = true; 
          hasError = true; 
        } else {
          newGoldError[index].image = false;
        }
    
        if (!item.itemName) {
          newGoldError[index].itemName = true; 
          hasError = true; 
        } else {
          newGoldError[index].itemName = false; 
        }
    

        if (!item.itemCarat) {
          newGoldError[index].itemCarat = true; 
          hasError = true; 
        } else {
          newGoldError[index].itemCarat = false; 
        }
    
        // Check if the item weight is empty
        if (!item.itemWeight) {
          newGoldError[index].itemWeight = true; 
          hasError = true; // Mark as error
        } else {
          newGoldError[index].itemWeight = false; 
        }
      });
    
      setGoldError(newGoldError);
    

      if (hasError) {
        return; 
      }
    
      // Continue with Firestore logic if there are no errors
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const promises = goldInfo.map(async (item, index) => {
            try {
              const goldInfoDoc = doc(firestoredb, "users", user.uid);
              const collection = {
                'gold_info': {
                  [`${index}`]: item
                }
              };
              await setDoc(goldInfoDoc, collection, { merge: true });
              dispatch(goldinfo(goldInfo));
            } catch (error) {
              console.error("Error saving to Firestore:", error);
            }
          });
    
          await Promise.all(promises); // Wait for all Firestore writes to finish
          navigate('/loan_info'); // Navigate after successful submission
        }
      });
    }
    

  return (
    <>
      <div className="parent-container ">
        <Header />
        <form onSubmit={(e) => e.preventDefault()} className="form-container mt-28 mb-28 min-h-full flex flex-col items-center justify-center ">

          <div className="flex md:flex-col justify-center flex-wrap w-[100%] lg:w-[100%] lg:-space-y-10 ">
            {goldInfo.map((_, index) => (
              <div key={index} className="mt-10 mb-5">
                {jewelleryCard(index)}
              </div>
            ))}
          </div>
          <div className="flex space-x-3  md:-mt-8">
            <div className="my-8  text-center">
              <button className=" p-1  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-semibold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105" onClick={addItem}>
                <span className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 flex justify-center w-full rounded-sm px-5 py-2 ">
                  Add
                </span>
              </button>
            </div>
            <div className="my-8  text-center">
              <button className="  p-1  bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-semibold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105" onClick={handleSubmit}>
                <span className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 flex justify-center w-full rounded-sm px-5 py-2 ">
                  Submit
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center space-y-5 my-10">

            <div className="px-5 lg:w-[80%] xl:w-1/2 text-left space-y-3">
              <h1 className="text-bold text-2xl font-semibold text-gray-700">What is Gold Loan Calculator?</h1>
              <p className="text-md">
                A Gold Loan Calculator is an online tool that estimates the loan amount you can get against your gold assets. It typically requires inputs like gold weight, purity, and current market price, then applies a loan-to-value ratio to calculate the potential loan amount. This tool helps borrowers quickly assess their options without visiting a lender.
              </p>
            </div>
            <div className="px-5 lg:w-[80%] xl:w-1/2 text-left space-y-3">
              <h1 className="text-bold text-2xl font-semibold text-gray-700">How Gold loan calculator works?</h1>
              <p className="text-md">
                A Gold Loan Calculator works by taking inputs such as the weight and purity of gold, along with the current market price. It then multiplies these factors to determine the gold's value, and applies the lender's loan-to-value ratio to estimate the maximum loan amount available to the borrower.
              </p>
            </div>

            <div className="px-5 lg:w-[80%] xl:w-1/2 text-left space-y-3">
              <h1 className="text-bold text-2xl font-semibold text-gray-700">Advangates of Gold Loan Calculator</h1>
              <p className="text-md">
                The <span className="text-yellow-500 font-semibold">gold loan calculator</span> allows users to compare different loan options and interest rates easily. It helps in understanding the repayment schedule by calculating monthly installments, ensuring better financial planning. The tool is user-friendly, making it accessible even to those with limited financial knowledge. It also offers transparency by clearly showing how the loan amount is determined, building trust with the lender. Overall, it empowers users to make well-informed choices tailored to their specific financial needs.
              </p>
            </div>
          </div>
        </form>
        <Footer />
      </div>
    </>
  );
}

export default Gold_info;
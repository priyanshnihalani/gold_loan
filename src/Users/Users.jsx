import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router";
import { auth, firestoredb } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Users.css'
function Users() {
  const location = useLocation();
  const id = location.state?.userid;
  const navigate = useNavigate();
  const [ornaments, setOrnaments] = useState([]);

  const [userData, setUserData] = useState(null);
  const [emi, setEmi] = useState(0);
  const [remainEmi, setRemainEmi] = useState(0)

  useEffect(() => {
    async function fetchUserData() {
      if (!id) return;
      const docRef = doc(firestoredb, "users", id);
      try {
        const docSnap = await getDoc(docRef);
        setUserData(docSnap.data());
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (userData?.personal_Info && userData?.loan_info) {
      const months = Number(userData.personal_Info.loanperiod) || 0;
      const interestAmount = Number(userData.loan_info.TotalAmountInterest?.TotalInterest) || 0;
      const totalAmount = Number(userData.loan_info.TotalAmountInterest?.TotalAmount) || 0;
      const remainEmi = Number(userData.loan_info.remainEmi)
      setOrnaments(userData.loan_info.ornaments)
      if (months > 0) {
        const emiInterest = Math.round(interestAmount / months);
        const emiAmount = Math.round(totalAmount / months);
        const totalEmi = emiAmount + emiInterest;
        setRemainEmi(remainEmi)
        setEmi(totalEmi);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    let lastEmiDate = userData.loan_info?.lastEmiDate?.toDate();
    const currentDate = new Date();

    if (!lastEmiDate) {
      async function setLastDate() {
        try {
          const docRef = doc(firestoredb, "users", id);
          await setDoc(docRef, {
            ...userData,
            loan_info: {
              ...userData.loan_info,
              lastEmiDate: new Date()
            }
          }, { merge: true });
        } catch (error) {
          console.error("Error updating Firestore:", error);
        }
      }
      setLastDate()
    }
    else {
      async function checkEmi(){

        const monthsPassed = calculateMonthsPassed(lastEmiDate, currentDate);
        
        if (monthsPassed > 0 && remainEmi > 0) {
          updateFirestore(monthsPassed);
        }
        if (remainEmi <= 0){
          alert("Loan Paid Successfully!")
        }
      }
      checkEmi
    }

  }, [emi, userData, remainEmi]);

  function calculateMonthsPassed(lastEmiDate, currentDate) {
    const lastEmiYear = lastEmiDate.getFullYear();
    const lastEmiMonth = lastEmiDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const monthsPassed = (currentYear - lastEmiYear) * 12 + (currentMonth - lastEmiMonth);

    return Math.max(monthsPassed, 0);
  }

  async function updateFirestore(monthsPassed) {
    if (!id || !userData) return;

    const docRef = doc(firestoredb, "users", id);
    const newEmiNo = (userData.loan_info.emiNo || 0) + monthsPassed;
    const paidAmount = (userData.loan_info.paidEmi || 0) + (emi * monthsPassed);
    const remainingAmount = Math.max((userData.loan_info.remainEmi || 0) - (emi * monthsPassed), 0);

    try {
      await setDoc(docRef, {
        ...userData,
        loan_info: {
          ...userData.loan_info,
          emiNo: newEmiNo,
          paidEmi: paidAmount,
          remainEmi: remainingAmount.toFixed(2),
          lastEmiDate: new Date()
        }
      }, { merge: true });
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  }

  const logout = () => {
    auth.signOut();
    navigate('/', { state: { data: false } });
  };

  if (!userData) {
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
    <div className="w-full min-h-screen flex flex-col lg:flex-row justify-between bg-gray-50 py-8 md:pb-80 lg:py-8 px-4 lg:px-20 lg:space-x-5">
      <div className="w-full lg:w-[40%] bg-white shadow-lg rounded-lg p-6 flex flex-col border border-gray-200 mb-0 lg:mb-0">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-4">
          {userData.profile && (
            <>
              <FontAwesomeIcon icon={faUserCircle} size="7x" className="text-gray-400 mb-4" />
              <p className="text-lg font-bold text-gray-800">{userData.profile.fullname}</p>
              <p className="text-md text-gray-600">{userData.profile.phone || auth.currentUser.email}</p>
            </>
          )}
        </div>

        {/* Loan Details Section */}
        <div className="w-full ">
          {userData.loan_info ? (
            <div>
              <div className="mb-4 text-justify">
                <p className="border-2 p-2 text-lg font-semibold text-gray-800">
                  Loan Amount: <span className="text-gold-600">₹ {userData.loan_info?.TotalAmountInterest?.TotalAmount}</span>
                </p>
                <p className="border-2 p-2 text-lg font-semibold text-gray-800">
                  Repayment In: <span className="text-gray-600">30 Days</span>
                </p>
                <p className="border-2 p-2 text-lg font-semibold text-gray-800">
                  Total Interest: <span className="text-gold-600">₹ {userData.loan_info?.TotalAmountInterest?.TotalInterest}</span>
                </p>
                <p className="border-2 p-2 text-lg font-semibold text-gray-800">
                  Monthly EMI: <span className="text-gold-600">₹ {emi}</span>
                </p>
              </div>

              <div className="mb-0 text-justify">
                <p className="border-2 p-2 text-lg font-semibold text-gray-800">
                  EMI's Paid: <span className="text-gray-600">{userData.loan_info?.emiNo || 0}</span>
                </p>
                <p className="border-2 p-2 text-lg font-semibold text-gray-800">
                  Paid Amount (inc. interest): <span className="text-gold-600">₹ {userData.loan_info?.paidEmi}</span>
                </p>
                <p className="border-2 p-2 text-lg font-semibold text-gray-800">
                  Remaining Amount (inc. interest): <span className="text-gold-600">₹ {userData.loan_info?.remainEmi}</span>
                </p>
              </div>
            </div>
          ) : <p className="border-2 p-6 font-bold text-3xl">Currently No Loan is Taken</p>}
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full p-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white font-bold text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105">
            Logout
          </button>
        </div>
      </div>

      {/* Ornaments Section */}
      <div className="flex flex-col min-h-10 overflow-scroll px-2 w-full lg:w-[60%] space-y-6 scroller">
        <h1 className='font-bold text-3xl m-0'>Ornament Information</h1>
        {Object.keys(ornaments).map((item) => {
          const ornament = userData.loan_info.ornaments[item];
          return (
            <div key={item} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center bg-white shadow-md hover:shadow-2xl transition-shadow p-4 rounded-md">
              <div>
                <img src={ornament.image} alt="" className="w-32 h-32 sm:w-44 sm:h-44" />
              </div>
              <div className="text-center sm:text-left">
                <p>Ornament Name: {ornament.ornamentName}</p>
                <p>Ornament Weight: {ornament.weight} g</p>
                <p>Ornament Carats: {ornament.carats} </p>
                <p>Amount You Have Get For Ornament: ₹ {ornament.eligibleAmount} </p>
                <p>Interest You Have To Pay For This: ₹ {ornament.interest}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users;

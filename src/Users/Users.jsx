import { auth } from "../firebase"
import { useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react";
import { firestoredb } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Users() {

    const location = useLocation();
    const id = location.state?.userid;
    const [data, setData] = useState({})
    const [emi, setEmi] = useState(0)
    const [emino, setEmiNo] = useState(0)
    const [paidEmi, setPaidEmi] = useState(0)
    const [remainEmi, setremainEmi] = useState(0)
    useEffect(() => {
        async function fetchInfo() {
            try {
                const docRef = doc(firestoredb, "users", id);
                const docSnap = await getDoc(docRef);
                setData(docSnap.data())
                console.log(docSnap.data())
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchInfo()
    }, [id])
    useEffect(() => {
        if (data && data.personal_Info && data.loan_info) {

            const months = Number(data.personal_Info.loanperiod) || 0;
            const interestAmount = Number(data.loan_info.TotalAmountInterest?.TotalInterest) || 0;
            const totalAmount = Number(data.loan_info.TotalAmountInterest?.TotalAmount) || 0;

            if (months > 0) {
                const emiInterest = Math.round(interestAmount / months);
                const emiAmount = Math.round(totalAmount / months);
                const totalEmi = emiAmount + emiInterest;
                console.log(emiAmount);
                setEmi(totalEmi);
                setremainEmi(totalAmount + interestAmount)

            } else {
                console.log("Invalid months value");
                setEmi(0);
            }
        }
    }, [data]);
    const navigate = useNavigate();

    const logout = () => {
        auth.signOut()
        navigate('/', { state: { data: false } })
    }



    return (
        <>
            <div className="w-full flex flex-col text-justify">
                <div className="mx-auto">
                    {data && data.profile && <p><span className="font-semibold">Name: </span> {data.profile.fullname}</p>}
                    {data && data.profile && <p><span className="font-semibold">Phone No: </span> +91 {data.profile.phone}</p>}
                    {data && data.profile && <p><span className="font-semibold">Loan Amount: </span>₹ {data.profile.LoanAmount}</p>}
                    <p><span className="font-semibold">Repayment In: </span>30 Days</p>
                    <p>
                        <span className="font-semibold">Total Interest You Have To Pay: </span>
                        ₹ {data && data.loan_info && data.loan_info.TotalAmountInterest && data.loan_info.TotalAmountInterest.TotalInterest}
                    </p>
                    <p>
                        <span className="font-semibold">Per Month Emi: </span> ₹ {emi}
                    </p>
                    <p>
                        <span className="font-semibold">Emi's You Have Paid: </span> {emino}
                    </p>
                    <p>
                        <span className="font-semibold">Amount You've Paid inc. interest: </span> ₹ {paidEmi}
                    </p>

                    <p>
                        <span className="font-semibold">Remaining Amount inc. interest: </span> ₹ {remainEmi}
                    </p>
                    
                </div>

            </div>
            <button onClick={logout}>Logout</button>
        </>
    )
}
export default Users
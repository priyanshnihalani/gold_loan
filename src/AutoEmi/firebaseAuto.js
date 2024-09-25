import { firestore as adminFirestore } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { schedule } from 'firebase-functions';

// Initialize Firebase Admin SDK
initializeApp();

// This function will automatically run every 30 days
export const deductEMI = schedule('every 1 minute').onRun(async (context) => {
    const firestore = adminFirestore();

    try {
        // Fetch all users with active loans
        const usersSnapshot = await firestore.collection("users").get();
        usersSnapshot.forEach(async (userDoc) => {
            const userData = userDoc.data();

            if (userData.loan_info && userData.loan_info.active) {
                const months = Number(userData.personal_Info.loanperiod) || 0;
                const interestAmount = Number(userData.loan_info.TotalAmountInterest?.TotalInterest) || 0;
                const totalAmount = Number(userData.loan_info.TotalAmountInterest?.TotalAmount) || 0;

                if (months > 0) {
                    const emiInterest = Math.round(interestAmount / months);
                    const emiAmount = Math.round(totalAmount / months);
                    const totalEmi = emiAmount + emiInterest;

                    // Deduct EMI from the remaining amount
                    const newRemainingAmount = (userData.remainingEmi || totalAmount + interestAmount) - totalEmi;

                    // Update Firestore with the new remaining amount
                    await firestore.collection("users").doc(userDoc.id).update({
                        remainingEmi: newRemainingAmount,
                        paidEmi: (userData.paidEmi || 0) + totalEmi,
                        emiPaid: (userData.emiPaid || 0) + 1
                    });

                    console.log(`Updated EMI for user: ${userDoc.id}`);
                }
            }
        });
    } catch (error) {
        console.error("Error deducting EMI: ", error);
    }
    return null;
});

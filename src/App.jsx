import { Route, Routes } from 'react-router'
import './App.css'
import Home from './Home/Home'
import Loan_Info from './Loan_Info/Loan_Info'
import PersonalInfo from './Loan_Application/Personal_Info/Personal_info'
import Gold_info from './Loan_Application/Gold_Info/gold_info'
import Signin from './SignIn/Signin'
import Signup from './Signup/Signup'
import PrivacyPolicy from './Privacy&Policy/Privacy_Policy'
import Page from './404_Page/Page'
import ForgetPasswordEmail from './ForgetPasswordEmail/ForgetPasswordEmail'
import EmailVerify from './email_verification/EmailVerfiy'
import Users from './Users/Users'
import Aboutus from './Aboutus/Aboutus'
import ContactUs from './ContactUs/ContactUs'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='loan_info' element={<Loan_Info />} />
        <Route path='personal_info' element={< PersonalInfo />} />
        <Route path='gold_info' element={< Gold_info />} />
        <Route path='sign_in' element={< Signin />} />
        <Route path='sign_up' element={< Signup />} />
        <Route path='privacy_policy' element={< PrivacyPolicy />} />
        <Route path='forgetpassword' element={<ForgetPasswordEmail />} />
        <Route path='verify-email' element={<EmailVerify />} />
        <Route path='users' element={<Users/>} />
        <Route path="*" element={<Page />}/>
        <Route path='aboutus' element={<Aboutus />} />
        <Route path='contactus' element={<ContactUs />} />
      </Routes>
    </>
  )
}

export default App

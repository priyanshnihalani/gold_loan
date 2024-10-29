import './Header.css'
import { Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Header() {

    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [userExist, setUserExist] = useState(false)
    const [userId, setUserId] = useState(null)

    function toggleMenu() {
        setIsOpen(!isOpen);
    }
    const [color, setColor] = useState(false);
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUserExist(true)
                setUserId(user.uid)
            }
            else{
                setUserExist(false)
            }
            // console.log(user)
        })
    }, [])  
    useEffect(() => {
        if (location.pathname == '/' || location.pathname == '/aboutus') {
            setColor(true)
        }
    },[location.pathname])

    return (
        <div className={`z-20 ${color ? 'absolute' : 'relative'} w-full ${color ? 'bg-transparent' : 'bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700'}  `}>
            <header className="lg:flex items-center justify-between min-h-16 p-4 md:p-6 shadow-md">
                <div className="flex items-center w-full md:w-auto">
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white text-2xl"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to="/" className="mx-auto mb-0 lg:mb-0  text-white text-xl font-bold">
                        Mannat Gold Loans
                    </Link>
                </div>

                <nav className={`relative top-8 left-0 w-full p-10 md:p-2 bg-white md:text-white md:static md:w-auto md:bg-transparent md:flex md:items-center md:justify-center md:space-x-20 lg:space-x-40 ${isOpen ? 'block' : 'hidden'} md:block `}>
                    <ul className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-center md:text-left font-medium text-lg">
                        <li><Link to="/" className="hover:text-yellow-500">Home</Link></li>
                        <li><Link to="/aboutus" className="hover:text-yellow-500">About Us</Link></li>
                        <li><Link to="/contactus" className="hover:text-yellow-500">Contact Us</Link></li>
                        <li><Link to="/privacy_policy" className="hover:text-yellow-500">Privacy Policy</Link></li>
                    </ul>
                    {
                        userExist ? <button onClick={() => navigate('/users', {state: {userid: userId}})}><FontAwesomeIcon icon={faUserCircle} size='2x'/></button> :
                        <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0 text-lg">
                            <Link to="/sign_in" className="md:text-white hover:underline">Sign in</Link>
                            <span className="text-black">|</span>
                            <Link to="/sign_up" className="md:text-white hover:underline">Sign up</Link>
                        </div>
                    }
                </nav>
            </header>
        </div>
    );
}

export default Header;

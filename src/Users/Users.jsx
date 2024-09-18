import { auth } from "../firebase"
import { useNavigate } from "react-router"

function Users(){
    const navigate = useNavigate();

    const logout = () => {
        auth.signOut()
        navigate('/', {state: {data:false}})
    }

    return(
        <>
            <button onClick={logout}>Logout</button>
        </>
    )
}
export default Users
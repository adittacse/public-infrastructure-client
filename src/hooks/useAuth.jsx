import { useContext } from "react";
import AuthContext from "../Contexts/AuthContexts/AuthContext.jsx";

const useAuth = () => {
    const authInfo = useContext(AuthContext);
    return authInfo;
}

export default useAuth;
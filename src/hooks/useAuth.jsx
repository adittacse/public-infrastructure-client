import { useContext } from "react";
import AuthContext from "../Contexts/AuthContexts/AuthContext.jsx";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;
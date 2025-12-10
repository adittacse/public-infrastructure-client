import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth.jsx";
// import { auth } from "../firebase/firebase.init.js";
import axios from "axios";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // request intercept
        const requestInterceptor = axiosInstance.interceptors.request.use(async (config) => {
                const token = user?.accessToken;
                // const token = await auth.currentUser.getIdToken();
                if (token) {
                    config.headers.authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // response interceptor
        const responseInterceptor = axiosInstance.interceptors.response.use(res => {
            return res;
        }, error => {
            const status = error.response.status || error.status;
            if (status === 401 || status === 403) {
                // log out the user for bad intention request
                logOut()
                    .then(() => {
                        navigate("/login");
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error.message}`,
                        });
                    });
            }
            return Promise.reject(error);
        });

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        }
    }, [user, logOut, navigate]);

    return axiosInstance;
};

export default useAxiosSecure;
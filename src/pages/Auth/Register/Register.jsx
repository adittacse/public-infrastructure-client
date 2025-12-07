import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth.jsx";
import SocialLogin from "../SocialLogin/SocialLogin.jsx";
import axios from "axios";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import Swal from "sweetalert2";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();
    const { registerUser, updateUserProfile, setUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();
    const navigate = useNavigate();

    const handleRegistration = (data) => {
        const imageFile = data.image[0];
        if (!imageFile || !imageFile.type.startsWith("image/")) {
            return;
        }

        registerUser(data.email, data.password)
            .then((result) => {
                // 1. store the image in form data
                const formData = new FormData();
                formData.append("image", imageFile);

                // 2. send the image to store and get the URL
                axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`, formData)
                    .then(res => {
                        const photoURL = res.data.data.url;

                        // create user in the database
                        const userInfo = {
                            displayName: data.name,
                            email: data.email,
                            photoURL: photoURL
                        }

                        axiosSecure.post("/users", userInfo)
                            .then((res) => {
                                if (res.data.insertedId) {
                                    // user created in the database
                                    // update user profile
                                    updateUserProfile({
                                        displayName: data.name,
                                        photoURL: photoURL
                                    })
                                        .then(() => {
                                            // Registered Successfully
                                            setUser(result.user);
                                            Swal.fire({
                                                position: "top-end",
                                                icon: "success",
                                                title: "Registered Successfully!",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                            navigate(location?.state || "/", { replace: true });
                                        })
                                        .catch((error) => {
                                            Swal.fire({
                                                icon: "error",
                                                title: "Oops...",
                                                text: `${error.message}`
                                            });
                                        });
                                }
                            });
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error.message}`
                        });
                    });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                });
            });
    }

    return (
        <div className="card bg-base-100 w-3/12 mx-auto shadow-2xl shrink-0 my-5">
            <div className="card-body">
                <h3 className="text-4xl font-bold text-center mb-1">Create an Account</h3>

                <form onSubmit={handleSubmit(handleRegistration)}>
                    <fieldset className="fieldset">
                        {/* name */}
                        <label className="label">Name</label>
                        <input {...register("name", {required: true})} type="text" className="input w-full"
                               placeholder="Name"/>
                        {errors.name?.type === "required" &&
                            <p className="text-red-500 font-medium">Name is Required</p>}

                        {/* image file */}
                        <label className="label">Image</label>
                        <input {...register("image", {required: "Image is Required", validate: {
                                isImage: (files) => {
                                    const file = files && files[0];
                                    return file && file.type.startsWith("image/") || "Only image files are allowed"
                                }
                            }})} type="file" className="file-input w-full" />
                        {errors.image &&
                            <p className="text-red-500 font-medium">{errors.image.message}</p>}

                        {/* email */}
                        <label className="label">Email</label>
                        <input {...register("email", {required: true})} type="email" className="input w-full"
                               placeholder="Email"/>
                        {errors.email?.type === "required" &&
                            <p className="text-red-500 font-medium">Email is Required</p>}

                        {/* password */}
                        <label className="label">Password</label>
                        <input {...register("password", {
                            required: true,
                            minLength: 6,
                            pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.[A-Za-z0-9]).+$/
                        })} type="password" className="input w-full" placeholder="Password"/>
                        {errors.password?.type === "required" &&
                            <p className="text-red-500 font-medium">Password is Required</p>}
                        {errors.password?.type === "minLength" &&
                            <p className="text-red-500 font-medium">Password must be at least 6 character</p>}
                        {errors.password?.type === "pattern" &&
                            <p className="text-red-500 font-medium">Password must have at leat one uppercase, at least
                                one lowercase, at least one number, and at least one special character</p>}

                        <button className="btn btn-neutral mt-4">Register</button>
                    </fieldset>
                </form>

                <p className="text-zinc-500">Already have an account? Please <Link state={location?.state} to="/login" className="link link-hover text-green-8">Login</Link>
                </p>

                <SocialLogin />
            </div>
        </div>
    );
};

export default Register;
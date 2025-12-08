import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import axios from "axios";
import Swal from "sweetalert2";

const AdminProfile = () => {
    const [imageError, setImageError] = useState("");
    const axiosSecure = useAxiosSecure();
    const { user, updateUserProfile, setLoading } = useAuth();
    const { role } = useRole();
    const { register,
        handleSubmit,
        formState: {errors}
    } = useForm();

    const { data: profile, isLoading, refetch } = useQuery({
        queryKey: ["admin-profile", user?.email],
        enabled: role === "admin" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/profile?email=${user.email}`);
            return res.data;
        }
    });

    const handleUpdateProfile = async (data) => {
        updateUserProfile(user, {
            displayName: data.displayName,
            photoURL: data?.photoURL
        })
            .then(async () => {
                await axiosSecure.patch(`/admin/profile/${profile._id}`, data)
                    .then(async (res) => {
                        if (res.data.modifiedCount) {
                            await refetch();
                            setLoading(false);
                            Swal.fire({
                                icon: "success",
                                title: "Profile updated",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                        }
                    })
                    .catch((error) => {
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

    const onSubmit = async (data) => {
        setImageError("");
        const imageFile = data?.photoURL[0];

        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                setImageError("Only image files are allowed");
                return;
            }

            // 1. store the image in form data
            const formData = new FormData();
            formData.append("image", imageFile);

            // 2. send the image to store and get the URL
            axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`, formData)
                .then(async (res) => {
                    const photoURL = res.data.data.url;
                    const updatedProfile = {
                        displayName: data.displayName,
                        photoURL: photoURL
                    };

                    await handleUpdateProfile(updatedProfile);
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${error.message}`
                    });
                });
        } else {
            const updatedProfile = {
                displayName: data.displayName
            };

            await handleUpdateProfile(updatedProfile);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Admin Profile</h1>

            <div className="card bg-base-100 shadow items-center mb-6">
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img src={profile?.photoURL} alt={profile?.displayName} />
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold">
                                {profile?.displayName}
                            </div>
                            <div className="text-sm text-gray-500">
                                {user?.email}
                            </div>
                            <div className="mt-1">
                                <span className="badge badge-primary">
                                    Admin
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow">
                <fieldset className="fieldset card-body space-y-1 py-10">
                    {/* display name */}
                    <label className="label">
                        <span className="label-text">Display Name</span>
                    </label>
                    <input {...register("displayName", { required: true })} defaultValue={profile?.displayName} className="input input-bordered w-full" />
                    {errors.displayName?.type === "required" && <p className="text-red-500 font-medium">Name is Required</p>}

                    {/* profile picture */}
                    <label className="label">Profile Picture</label>
                    <input {...register("photoURL")} type="file" className="file-input w-full" />
                    {imageError && <p className="text-red-500 font-medium">{imageError}</p>}

                    <label className="label">Email</label>
                    <input {...register("email")} defaultValue={profile?.email} className="input input-bordered w-full" disabled />

                    <div className="card-actions justify-end">
                        <button type="submit" className="btn btn-primary">Update Profile</button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default AdminProfile;

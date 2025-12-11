import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import axios from "axios";
import Swal from "sweetalert2";

const StaffProfile = () => {
    const [imageError, setImageError] = useState("");
    const axiosSecure = useAxiosSecure();
    const { user, updateUserProfile, setUser, setLoading } = useAuth();
    const { role } = useRole();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const { data: profile, isLoading, refetch } = useQuery({
        queryKey: ["staff-profile", user?.email],
        enabled: role === "staff" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/staff/profile?email=${user.email}`);
            return res.data;
        }
    });

    const handleUpdateProfile = async (data) => {
        try {
            // 1) Firebase profile update
            await updateUserProfile({
                displayName: data.displayName,
                photoURL: data.photoURL || user?.photoURL
            });

            // 2) Backend DB update
            const res = await axiosSecure.patch(`/staff/profile/${profile._id}`, data);

            if (res.data.modifiedCount) {
                // 3) React Query cache update
                queryClient.setQueryData(["staff-profile", user.email], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        displayName: data.displayName,
                        photoURL: data.photoURL || old.photoURL
                    };
                });

                // 4) Auth context user update (navbar avatar etc)
                setUser((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        displayName: data.displayName,
                        photoURL: data.photoURL || prev.photoURL
                    };
                });

                setLoading(false);

                Swal.fire({
                    icon: "success",
                    title: "Profile updated",
                    timer: 1500,
                    showConfirmButton: false,
                });

                await refetch();
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data?.message || error.message
            });
        }
    };

    const onSubmit = async (data) => {
        setImageError("");
        const imageFile = data?.photoFile?.[0];

        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                setImageError("Only image files are allowed");
                return;
            }

            const formData = new FormData();
            formData.append("image", imageFile);

            axios
                .post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`,
                    formData
                )
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
                        text: error.message
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
            <h1 className="text-2xl font-bold text-center mb-4">
                Staff Profile
            </h1>

            {/* Profile Card */}
            <div className="card bg-base-100 shadow items-center mb-6">
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img
                                    src={profile?.photoURL || user?.photoURL}
                                    alt={profile?.displayName || user?.displayName}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold">
                                {profile?.displayName || user?.displayName}
                            </div>
                            <div className="text-sm text-gray-500">
                                {profile?.email || user?.email}
                            </div>
                            <div className="mt-1">
                                <span className="badge badge-secondary">
                                    Staff
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow">
                <fieldset className="fieldset card-body space-y-1 py-10">
                    {/* display name */}
                    <label className="label">
                        <span className="label-text">Display Name</span>
                    </label>
                    <input
                        {...register("displayName", { required: true })}
                        defaultValue={profile?.displayName || user?.displayName}
                        className="input input-bordered w-full"
                    />
                    {errors.displayName?.type === "required" && (
                        <p className="text-red-500 font-medium">
                            Name is required
                        </p>
                    )}

                    {/* profile picture */}
                    <label className="label">Profile Picture</label>
                    <input
                        {...register("photoFile")}
                        type="file"
                        className="file-input w-full"
                    />
                    {imageError && (
                        <p className="text-red-500 font-medium">{imageError}</p>
                    )}

                    {/* email (read-only) */}
                    <label className="label">Email</label>
                    <input
                        className="input input-bordered w-full"
                        defaultValue={profile?.email || user?.email}
                        disabled
                    />

                    <div className="card-actions justify-end mt-4">
                        <button type="submit" className="btn btn-primary">
                            Update Profile
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default StaffProfile;

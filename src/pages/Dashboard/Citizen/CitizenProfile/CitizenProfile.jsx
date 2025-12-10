import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import axios from "axios";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const CitizenProfile = () => {
    const [imageError, setImageError] = useState("");
    const axiosSecure = useAxiosSecure();
    const { user, updateUserProfile, setLoading } = useAuth();
    const { role, isPremium, isBlocked } = useRole()
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // citizen profile data from backend
    const { data: profile, isLoading } = useQuery({
        queryKey: ["citizen-profile", user?.email],
        enabled: role === "citizen" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/citizen/profile?email=${user.email}`);
            return res.data;
        },
    });

    // 🔹 Stripe subscription (1000৳) – only if not premium & not blocked
    const handleSubscribe = async () => {
        if (!user?.email) return;

        try {
            const res = await axiosSecure.post("/create-checkout-session", {
                paymentType: "subscription",
                amount: 1000,
                currency: "bdt",
                customerEmail: user.email,
            });

            if (res.data?.url) {
                window.location.href = res.data.url;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Payment init failed",
                    text: "Could not initialize payment. Please try again.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Payment error",
                text: error.response?.data?.message || error.message,
            });
        }
    };

    const handleUpdateProfile = async (data) => {
        // update in firebase auth
        await updateUserProfile({
            displayName: data.displayName,
            photoURL: data.photoURL
        });

        // update in database -> users collection
        const updatedData = {
            displayName: data.displayName,
            photoURL: data.photoURL,
        };

        await axiosSecure.patch(`/citizen/profile/${profile._id}`, updatedData)
            .then((res) => {
                if (res.data.modifiedCount) {
                    // query cache আপডেট
                    queryClient.setQueryData(
                        ["citizen-profile", user.email],
                        (old) => {
                            if (!old) return old;
                            return {
                                ...old,
                                displayName: data.displayName,
                                photoURL: data.photoURL || old.photoURL,
                            };
                        }
                    );
                    Swal.fire({
                        icon: "success",
                        title: "Profile updated",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                });
            });
    };

    const onSubmit = async (formDataValues) => {
        setImageError("");
        setLoading(true);

        const imageFile = formDataValues?.photo?.[0];

        try {
            let photoURL = profile?.photoURL || user?.photoURL || "";

            // যদি নতুন ইমেজ সিলেক্ট করা হয়
            if (imageFile) {
                if (!imageFile.type.startsWith("image/")) {
                    setImageError("Only image files are allowed");
                    setLoading(false);
                    return;
                }

                const imgForm = new FormData();
                imgForm.append("image", imageFile);

                const uploadRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`,
                    imgForm
                );
                photoURL = uploadRes.data.data.url;
            }

            const updatedProfile = {
                displayName: formDataValues.displayName,
                photoURL,
            };

            await handleUpdateProfile(updatedProfile);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
            setLoading(false);
        }
    };

    if (isLoading || !user) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">My Profile</h1>

            <div className="max-w-2xl mx-auto">
                {/* Top profile card */}
                <div className="card bg-base-100 shadow items-center mb-6">
                    <div className="card-body w-full">
                        <div className="flex items-center mx-auto gap-4">
                            <div className="avatar">
                                <div className="w-16 rounded-full border">
                                    <img src={profile?.photoURL} alt={profile?.displayName} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold flex items-center gap-2 flex-wrap">
                                    <span>{profile?.displayName}</span>
                                    {/* Premium badge */}
                                    {
                                        isPremium && <span className="badge badge-warning badge-outline">
                                        PREMIUM
                                    </span>
                                    }
                                </div>
                                <div className="text-sm text-gray-500">
                                    {profile?.email}
                                </div>
                                <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
                                    <span className="badge badge-outline">Role: Citizen</span>
                                    {
                                        isBlocked && <span className="badge badge-error badge-outline">
                                        BLOCKED
                                    </span>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Subscription / status info */}
                        <div className="mt-4 border-t pt-3 text-sm space-y-1">
                            {
                                !isPremium && <p>
                                    <span className="font-semibold">Current Plan:</span>{" "}
                                    <span className="badge badge-ghost">Free</span>
                                </p>
                            }
                            {
                                isPremium && <p>
                                    <span className="font-semibold">Current Plan:</span>{" "}
                                    <span className="badge badge-success">Premium</span>
                                    <span className="ml-2 text-xs text-gray-500">
                                    Unlimited issue submission.
                                </span>
                                </p>
                            }

                            {
                                !isPremium && <p className="text-gray-600 text-xs md:text-sm">
                                    As a free user, you can submit only{" "}
                                    <span className="font-semibold">3 issues</span>.
                                    Upgrade to premium for unlimited issue submissions and better support.
                                </p>
                            }

                            {
                                isBlocked && <div className="mt-2 p-3 rounded bg-red-50 text-red-700 text-xs md:text-sm">
                                    You are currently <span className="font-semibold">blocked</span> by
                                    the authorities. You cannot submit or boost issues.
                                    Please contact the relevant authority for further assistance.
                                </div>
                            }

                            {/* Subscribe button – only if not premium & not blocked */}
                            {
                                !isPremium && !isBlocked && <div className="mt-3">
                                    <button onClick={handleSubscribe} className="btn btn-sm btn-warning">
                                        Subscribe for 1000৳
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {/* Update profile form */}
                <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow">
                    <fieldset className="fieldset card-body space-y-2 py-8">
                        {/* display name */}
                        <label className="label">
                            <span className="label-text">Display Name</span>
                        </label>
                        <input {...register("displayName", { required: true })} defaultValue={profile?.displayName} className="input input-bordered w-full" />
                        {errors.displayName?.type === "required" && <p className="text-red-500 font-medium">Name is Required</p>}

                        {/* profile picture */}
                        <label className="label mt-2">Profile Picture</label>
                        <input {...register("photo")} type="file" className="file-input w-full" />
                        {imageError && <p className="text-red-500 font-medium">{imageError}</p>}

                        {/* email – show only, not editable */}
                        <label className="label mt-2">Email</label>
                        <input value={profile?.email} className="input input-bordered w-full" disabled />

                        <div className="card-actions justify-end mt-4">
                            <button type="submit" className="btn btn-primary">
                                Update Profile
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default CitizenProfile;

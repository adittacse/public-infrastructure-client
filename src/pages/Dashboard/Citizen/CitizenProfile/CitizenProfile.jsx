import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import Loading from "../../../../components/Loading/Loading.jsx";

const CitizenProfile = () => {
    const [imageError, setImageError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user, updateUserProfile, setLoading } = useAuth();
    const { isPremium, isBlocked } = useRole();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const { data: profile, isLoading, refetch } = useQuery({
        queryKey: ["user-profile", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/citizen/profile?email=${user.email}`);
            return res.data;
        }
    });

    const handleUpdateProfile = async (data) => {
        await updateUserProfile(user, {
            displayName: data.displayName,
            photoURL: data?.photoURL
        })
            .then(async () => {
                await axiosSecure.patch(`/citizen/profile/${profile._id}`, data)
                    .then(async (res) => {
                        if (res.data.modifiedCount) {
                            await refetch();
                            reset();
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
        setIsSubmitting(true);

        try {
            const imageFile = data?.photoURL?.[0];

            const updatedProfile = {
                displayName: data.displayName,
            };

            if (imageFile) {
                if (!imageFile.type.startsWith("image/")) {
                    setImageError("Only image files are allowed");
                    setIsSubmitting(false);
                    return;
                }

                const formData = new FormData();
                formData.append("image", imageFile);

                const res = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`,
                    formData
                );

                updatedProfile.photoURL = res.data.data.url;
            }

            await handleUpdateProfile(updatedProfile);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    // 🔹 Stripe subscription (1000৳) – only if not premium & not blocked
    const handleSubscribe = async () => {
        const data = {
            paymentType: "subscription",
            amount: 1000,
            currency: "bdt",
            customerEmail: user.email,
        };

        const res = await axiosSecure.post("/create-checkout-session", data);

        window.location.assign(res.data.url);
    };

    if (isLoading) {
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
                        <input {...register("photoURL")} type="file" className="file-input w-full" />
                        {imageError && <p className="text-red-500 font-medium">{imageError}</p>}

                        {/* email – show only, not editable */}
                        <label className="label mt-2">Email</label>
                        <input value={profile?.email} className="input input-bordered w-full" disabled />

                        <div className="card-actions justify-end mt-4">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {
                                    isSubmitting ? "Updating..." : "Update Profile"
                                }
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default CitizenProfile;
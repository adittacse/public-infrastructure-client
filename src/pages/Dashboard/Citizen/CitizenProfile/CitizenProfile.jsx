import { Link } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import useProfileUpdate from "../../../../hooks/useProfileUpdate.jsx";

const CitizenProfile = () => {
    const { user } = useAuth();
    const { role, isPremium, isBlocked } = useRole();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const { data: profile, isLoading, refetch: profileRefetch } = useQuery({
        queryKey: ["user-profile", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/citizen/profile?email=${user.email}`);
            return res.data;
        }
    });

    const { onSubmit, imageError, isSubmitting } = useProfileUpdate({
        role: role,
        profile,
        refetch: profileRefetch
    });

    // stripe subscription – only if not premium & not blocked
    const handleSubscribe = async () => {
        const data = {
            paymentType: "subscription",
            amount: 1000,
            currency: "bdt",
            customerName: user?.displayName,
            customerEmail: user?.email,
            customerImage: user?.photoURL
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

            <div className="max-w-lg mx-auto">
                {/* top profile card */}
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

                            <div className="flex flex-col md:flex-row items-center justify-between">
                                {/* Subscribe button – only if not premium & not blocked */}
                                {
                                    !isPremium && !isBlocked && <div className="mt-3">
                                        <button onClick={handleSubscribe} className="btn btn-sm btn-warning">
                                            Subscribe for 1000৳
                                        </button>
                                    </div>
                                }


                                <div className="mt-3">
                                    <Link to="/dashboard/citizen-payments" className="btn btn-sm btn-primary">
                                        View payment history & invoices
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* update profile form */}
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
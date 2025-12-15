import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar.jsx";
import useProfileUpdate from "../../../../hooks/useProfileUpdate.jsx";

const StaffProfile = () => {
    const { user } = useAuth();
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const { data: profile, isLoading, refetch: profileRefetch } = useQuery({
        queryKey: ["staff-profile", user?.email],
        enabled: role === "staff",
        queryFn: async () => {
            const res = await axiosSecure.get(`/staff/profile?email=${user?.email}`);
            return res.data;
        }
    });

    const { onSubmit, imageError, isSubmitting } = useProfileUpdate({
        role: role,
        profile,
        refetch: profileRefetch
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Staff Profile</h1>

            <div className="max-w-lg mx-auto">
                {/* profile card */}
                <div className="card bg-base-100 shadow-xl rounded-2xl items-center mb-10">
                    <div className="card-body">
                        <div className="flex items-center gap-4">
                            <UserAvatar photoURL={profile?.photoURL}
                                        name={profile?.displayName}
                                        w="w-16"
                                        h="h-16"
                                        radius="rounded-full"
                                        border="border" />

                            <div>
                                <div className="font-semibold">
                                    {profile?.displayName}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {profile?.email}
                                </div>
                                <div className="mt-1">
                                    <span className="badge badge-secondary capitalize">
                                        {profile?.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* update form */}
                <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow">
                    <fieldset className="fieldset card-body space-y-1 py-10">
                        {/* display name */}
                        <label className="label">
                            <span className="label-text">Display Name</span>
                        </label>
                        <input {...register("displayName", { required: true })} defaultValue={profile?.displayName} className="input input-bordered w-full" />
                        {errors.displayName?.type === "required" && <p className="text-red-500 font-medium">Name is required</p>}

                        {/* profile picture */}
                        <label className="label">Profile Picture</label>
                        <input {...register("photoURL")} type="file" className="file-input w-full" />
                        {imageError && <p className="text-red-500 font-medium">{imageError}</p>}

                        {/* email (read-only) */}
                        <label className="label">Email</label>
                        <input className="input input-bordered w-full" defaultValue={profile?.email} disabled />

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

export default StaffProfile;

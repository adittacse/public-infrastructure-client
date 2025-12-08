import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../hooks/useAuth.jsx";
import useRole from "../../../hooks/useRole.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const AdminProfile = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role } = useRole();
    const { register, handleSubmit, reset } = useForm();

    const { data: profile, isLoading, refetch } = useQuery({
        queryKey: ["admin-profile", user?.email],
        enabled: role === "admin" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/profile?email=${user.email}`);
            return res.data;
        },
        onSuccess: (data) => {
            reset({
                displayName: data.displayName || user?.displayName || "",
                photoURL: data.photoURL || user?.photoURL || "",
                phone: data.phone || "",
            });
        },
    });

    const onSubmit = async (formData) => {
        await axiosSecure.patch("/admin/profile", formData)
            .then((res) => {
                if (res.data.modifiedCount || res.data.success) {
                    refetch();
                    Swal.fire({
                        icon: "success",
                        title: "Profile updated",
                        timer: 1200,
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
                <div className="card-body space-y-3">
                    <div>
                        <label className="label">
                            <span className="label-text">
                                Display Name
                            </span>
                        </label>
                        <input {...register("displayName")} className="input input-bordered w-full" />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">
                                Photo URL
                            </span>
                        </label>
                        <input {...register("photoURL")} className="input input-bordered w-full" />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">
                                Phone (optional)
                            </span>
                        </label>
                        <input {...register("phone")} className="input input-bordered w-full" />
                    </div>

                    <div className="card-actions justify-end">
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminProfile;

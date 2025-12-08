import {useRef, useState} from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const ManageStaff = () => {
    const [selectedStaff, setSelectedStaff] = useState(null);
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();
    const staffModalRef = useRef(null);

    const { data: staffList = [], isLoading, refetch, isFetching } = useQuery({
        queryKey: ["admin-manage-staff"],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/staff");
            return res.data;
        },
    });

    const openAddModal = () => {
        setSelectedStaff(null);
        // document.getElementById("staff_modal").showModal();
        staffModalRef.current.showModal();
    };

    const openEditModal = (staff) => {
        setSelectedStaff(staff);
        // document.getElementById("staff_modal").showModal();
        staffModalRef.current.showModal();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const staffData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            photoURL: form.photoURL.value,
            password: form.password.value,
        };

        const isEdit = !!selectedStaff;

        try {
            if (isEdit) {
                const res = await axiosSecure.patch(
                    `/admin/staff/${selectedStaff._id}`,
                    {
                        name: staffData.name,
                        phone: staffData.phone,
                        photoURL: staffData.photoURL,
                    }
                );
                if (res.data.modifiedCount || res.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Staff updated",
                        timer: 1200,
                        showConfirmButton: false,
                    });
                }
            } else {
                await axiosSecure.post("/admin/staff", staffData)
                    .then((res) => {
                        if (res.data.insertedId || res.data.success) {
                            Swal.fire({
                                icon: "success",
                                title: "Staff added",
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
            }

            // document.getElementById("staff_modal").close();
            staffModalRef.current.close();
            form.reset();
            setSelectedStaff(null);
            refetch();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error.response?.data?.message ||
                    "Could not save staff information.",
            });
        }
    };

    const handleDelete = (staff) => {
        Swal.fire({
            title: "Delete this staff?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete",
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            await axiosSecure.delete(`/admin/staff/${staff._id}`)
                .then((res) => {
                    if (res.data.deletedCount || res.data.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Staff deleted",
                            timer: 1200,
                            showConfirmButton: false,
                        });
                        refetch();
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${error.message}`
                    });
                });
        });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Staff</h1>
                <button onClick={openAddModal} className="btn btn-primary btn-sm" disabled={isFetching}>
                    Add Staff
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Staff</th>
                        <th>Email</th>
                        <th>Work Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        staffList.map((staff, index) => <tr key={staff._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <div className="avatar">
                                        <div className="w-8 rounded-full">
                                            <img src={staff?.photoURL} alt={staff?.displayName} />
                                        </div>
                                    </div>
                                    <span>{staff?.displayName}</span>
                                </div>
                            </td>
                            <td>{staff?.email}</td>
                            <td className="capitalize">
                                {staff?.workStatus || "unknown"}
                            </td>
                            <td className="space-x-2">
                                <button onClick={() => openEditModal(staff)} className="btn btn-xs btn-outline btn-primary">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(staff)} className="btn btn-xs btn-outline btn-error">
                                    Delete
                                </button>
                            </td>
                        </tr>)
                    }

                    {
                        staffList.length === 0 && <tr>
                            <td colSpan={6} className="text-center">
                                No staff found.
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Staff Modal */}
            <dialog ref={staffModalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">
                        {
                            selectedStaff ? "Edit Staff" : "Add Staff"
                        }
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input name="name" defaultValue={selectedStaff?.displayName || ""} className="input input-bordered w-full" required />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={selectedStaff?.email || ""}
                                className="input input-bordered w-full"
                                required
                                disabled={!!selectedStaff}
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Phone
                                </span>
                            </label>
                            <input name="phone" defaultValue={selectedStaff?.phone || ""} className="input input-bordered w-full" />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Photo URL
                                </span>
                            </label>
                            <input name="photoURL" defaultValue={selectedStaff?.photoURL || ""} className="input input-bordered w-full"/>
                        </div>

                        {/* Password only for add */}
                        {
                            !selectedStaff && <div>
                                <label className="label">
                                    <span className="label-text">
                                        Password
                                    </span>
                                </label>
                                <input type="password" name="password" className="input input-bordered w-full" required />
                            </div>
                        }

                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={() => staffModalRef.current.close()}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {
                                    selectedStaff ? "Save" : "Add"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ManageStaff;

import {useRef, useState} from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const ManageStaff = () => {
    const [staffFiltered, setStaffFiltered] = useState([]);
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();
    const searchRef = useRef(null);

    const { data: staffList = [], isLoading, refetch } = useQuery({
        queryKey: ["admin-manage-staff"],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/staff");
            setStaffFiltered(res.data);
            return res.data;
        },
    });

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

    const handleSearch = () => {
        const text = searchRef.current.value.trim().toLowerCase();
        setTimeout(() => {
            if (text === "") {
                setStaffFiltered(staffList);
            } else {
                const result = staffList.filter(staff => staff.displayName.toLowerCase().includes(text));
                if (result.length === 0) {
                    const result = staffList.filter(staff => staff.email.toLowerCase().includes(text));
                    setStaffFiltered(result);
                } else {
                    setStaffFiltered(result);
                }
            }
        }, 0);
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Manage Staff</h1>

            <label className="input mb-5">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input ref={searchRef} onChange={handleSearch} type="search" placeholder="Search by name or email" />
            </label>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Sl.</th>
                        <th>Staff</th>
                        <th>Email</th>
                        <th>Work Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            staffFiltered.length === 0 && <tr>
                                <td colSpan={6} className="text-center">
                                    No staff found.
                                </td>
                            </tr>
                        }

                        {
                            staffFiltered.map((staff, index) => <tr key={staff._id}>
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
                                <td className="capitalize">{staff?.workStatus}</td>
                                <td className="space-x-2">
                                    <button onClick={() => handleDelete(staff)} className="btn btn-xs btn-outline btn-error">
                                        Delete
                                    </button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStaff;

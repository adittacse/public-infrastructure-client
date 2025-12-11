import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAxios from "../../../../hooks/useAxios.jsx";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

// second auth for create new staff user
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../../firebase/firebase.init.js";
import { createUserWithEmailAndPassword, getAuth, signOut, updateProfile } from "firebase/auth";

const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

const ManageStaff = () => {
    const [searchText, setSearchText] = useState("");
    const [staffFiltered, setStaffFiltered] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [imageError, setImageError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const axiosInstance = useAxios();
    const axiosSecure = useAxiosSecure();
    const { registerUser, updateUserProfile, logOut } = useAuth();
    const { role } = useRole();
    const staffModalRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();

    const { data: staffList = [], isLoading, refetch, isFetching } = useQuery({
        queryKey: ["admin-manage-staff", searchText],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/staff?searchText=${searchText}`);
            setStaffFiltered(res.data);
            return res.data;
        },
    });

    const openAddModal = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setSelectedStaff(null);
        staffModalRef.current.showModal();
    };

    const openEditModal = (staff) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setSelectedStaff(staff);
        staffModalRef.current.showModal();
    };


    const handleRegisterStaff = (staffName, staffImage, staffEmail, staffPassword) => {
        createUserWithEmailAndPassword(secondaryAuth, staffEmail, staffPassword)
            .then((result) => {
                return updateProfile(result.user, {
                    displayName: staffName,
                    photoURL: staffImage
                });
            })
            .then(() => {
                const userInfo = {
                    displayName: staffName,
                    email: staffEmail,
                    photoURL: staffImage,
                    role: "staff"
                };

                return axiosInstance.post("/users", userInfo);
            })
            .then((res) => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Staff Registered Successfully!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    staffModalRef.current.close();
                    refetch();
                }

                return signOut(secondaryAuth);
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error?.message}`
                });
            });
    };

    const handleUpdateStaff = async (staffEmail, data) => {
        await axiosSecure.patch(`/admin/staff/${staffEmail}`, data)
            .then((res) => {
                if (res.data.modifiedCount) {
                    Swal.fire({
                        icon: "success",
                        title: "Staff Profile Updated",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    staffModalRef.current.close();
                    refetch();
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error?.message}`
                });
            });
    }

    const handleRegistration = async (e) => {
        e.preventDefault();
        setImageError("");
        setIsSubmitting(true);

        const isEdit = !!selectedStaff;
        const imageFile = e.target?.image?.files[0];
        const staffEmail = e.target.email.value;

        if (imageFile) {
            if (!imageFile || !imageFile.type.startsWith("image/")) {
                setImageError("Only image files are allowed");
                return;
            }

            // 1. store the image in form data
            const formData = new FormData();
            formData.append("image", imageFile);

            // 2. send the image to store and get the URL
            axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`, formData)
                .then(async (res) => {
                    const staffName = e.target.name.value;
                    const staffImage = res.data.data.url;

                    const updatedUser = {
                        displayName: staffName,
                        photoURL: staffImage
                    };

                    if (isEdit) {
                        // edit existing staff
                        await handleUpdateStaff(staffEmail, updatedUser);
                        setIsSubmitting(false);
                    } else {
                        // new staff register
                        const staffPassword = e.target.password.value;
                        await handleRegisterStaff(staffName, staffImage, staffEmail, staffPassword);
                        setIsSubmitting(false);
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${error?.message}`
                    });
                });
        } else {
            // existing staff only name update, no image
            const updatedUser = {
                displayName: e.target.name.value
            };

            if (isEdit) {
                await handleUpdateStaff(staffEmail, updatedUser);
                setIsSubmitting(false);
            }
        }
    }

    const handleDelete = (staff) => {
        Swal.fire({
            title: "Delete this staff?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.delete(`/admin/users/${staff._id}`)
                    .then((res) => {
                        if (res.data.deletedCount) {
                            Swal.fire({
                                icon: "success",
                                title: "Deleted!",
                                text: "User has been deleted.",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                            refetch();
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error?.message}`
                        });
                    });
            }
        });
    };

    if (!staffList) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Manage Staff</h1>

            <div className="flex justify-between items-center mb-5">
                <label className="input mb-5">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="search" placeholder="Search by name or email" />
                </label>

                <button onClick={openAddModal} className="btn btn-primary btn-sm" disabled={isFetching}>
                    Add Staff
                </button>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Sl.</th>
                        <th>Staff</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
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
                                <td className="capitalize">{staff?.role}</td>
                                <td className="space-x-2">
                                    <button onClick={() => openEditModal(staff)} className="btn btn-sm btn-outline btn-primary">
                                        Update
                                    </button>
                                    <button onClick={() => handleDelete(staff)} className="btn btn-sm btn-outline btn-error">
                                        Delete
                                    </button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>

            {/* add / edit staff modal */}
            <dialog ref={staffModalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">
                        {selectedStaff ? "Update Staff" : "Add Staff"}
                    </h3>

                    <form onSubmit={handleRegistration} className="space-y-3">
                        <fieldset className="fieldset">
                            {/* staff name */}
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input name="name" defaultValue={selectedStaff?.displayName || ""} className="input input-bordered w-full" required />

                            {/* staff email */}
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input name="email" type="email" defaultValue={selectedStaff?.email || ""} className="input input-bordered w-full" disabled={!!selectedStaff} />

                            {/* staff image file */}
                            <label className="label">
                                <span className="label-text">Staff Image</span>
                            </label>
                            <input name="image" type="file" className="file-input w-full" />
                            {
                                imageError && <p className="text-red-500">{imageError}</p>
                            }

                            {/* password only for add */}
                            {
                                !selectedStaff && <>
                                    <label className="label">Password</label>
                                    <input name="password" type="password" className="input w-full" placeholder="Password" required />
                                </>
                            }

                        <div className="modal-action">
                            <button type="button" className="btn btn-ghost" onClick={() => staffModalRef.current.close()}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {selectedStaff ? isSubmitting ? "Updating..." : "Update Staff" : isSubmitting ? "Adding..." : "Add Staff"}
                            </button>
                        </div>
                        </fieldset>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ManageStaff;

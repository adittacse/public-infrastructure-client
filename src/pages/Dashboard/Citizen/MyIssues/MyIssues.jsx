import { useRef, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";
import axios from "axios";

const MyIssues = () => {
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [editData, setEditData] = useState(null);
    const [imageError, setImageError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const { isBlocked } = useRole();
    const axiosSecure = useAxiosSecure();
    const issueModalRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // get categories to show in filter dropdown
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axiosSecure.get("/categories");
            return res.data;
        },
    });

    // get locations to show in filter dropdown
    const { data: locations = [] } = useQuery({
        queryKey: ["my-issue-locations", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get("/citizen/my-issue-locations");
            return res.data;
        }
    });

    const { data: issues = [], isLoading: isIssuesLoading, refetch, isFetching } = useQuery({
        queryKey: ["my-issues", user?.email, status, category, location],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/citizen/my-issues?email=${user?.email}&status=${status}&category=${category}&location=${location}`);
            return res.data;
        },
    });

    const handleUpdateIssue = (issue) => {
        if (isBlocked) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You are currently blocked",
                footer: "Please contact the relevant authority for further assistance."
            });
            return;
        }

        setEditData({
            id: issue._id,
            title: issue.title,
            description: issue.description,
            category: issue.category,
            image: issue.image,
            location: issue.location,
        });
        issueModalRef.current.showModal();
    };

    const handlePatchData = async (id, data) => {
        await axiosSecure.patch(`/citizen/issues/${id}`, data)
            .then((res) => {
                if (res.data.modifiedCount) {
                    setIsSubmitting(false);
                    Swal.fire({
                        icon: "success",
                        title: "Issue updated",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    issueModalRef.current.close();
                    setEditData(null);
                    refetch();
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error?.message}`
                });
            });
    }

    const handleEditSubmit = async (data) => {
        setIsSubmitting(true);
        setImageError("");
        const issueId = data.issueId;

        const imageFile = data?.image[0];
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

                    const updatedIssue = {
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        image: photoURL,
                        location: data.location,
                    };

                    await handlePatchData(issueId, updatedIssue);
                })
                .catch((error) => {
                    setIsSubmitting(false);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${error?.message}`
                    });
                });
        } else {
            const updatedIssue = {
                title: data.title,
                description: data.description,
                category: data.category,
                location: data.location,
            };

            await handlePatchData(issueId, updatedIssue);
        }
    };

    const handleDelete = async (id) => {
        if (isBlocked) {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You are currently blocked",
                footer: "Please contact the relevant authority for further assistance."
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure
                    .delete(`/citizen/issues/${id}`)
                    .then((res) => {
                        if (res.data.deletedCount) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your issue has been deleted.",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false
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
        });
    };

    if (isIssuesLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">My Issues</h1>

            {/* filter data */}
            <div className="flex flex-wrap gap-2 mb-5 items-center">
                {/* Status filter */}
                <select
                    className="select select-bordered"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Status (All)</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="working">Working</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                </select>

                <select
                    className="select select-bordered"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Categories (All)</option>
                    {
                        categories.map((category) => <option key={category._id} value={category.categoryName}>
                            {category?.categoryName}
                        </option>)
                    }
                </select>

                <select
                    className="select select-bordered"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">My Reported Location (All)</option>
                    {
                        locations.map((location) =>
                            <option key={location} value={location}>
                                {location}
                            </option>
                        )
                    }
                </select>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Sl.</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        issues.length === 0 && <tr>
                            <td colSpan={5} className="text-center">
                                No issues found.
                            </td>
                        </tr>
                    }
                    {
                        issues.map((issue, index) => <tr key={issue._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="avatar">
                                    <div className="mask mask-squircle h-12 w-12">
                                        <img src={issue?.image} alt={issue?.title} />
                                    </div>
                                </div>
                            </td>
                            <td>{issue?.title}</td>
                            <td>{issue?.location}</td>
                            <td>{issue?.category}</td>
                            <td className="capitalize">{issue?.status?.split("_").join(" ")}</td>
                            <td className="capitalize">{issue?.priority}</td>
                            <td className="space-x-2">
                                <Link to={`/issues/${issue._id}`} className="btn btn-sm btn-primary">
                                    View
                                </Link>
                                {
                                    issue?.status === "pending" && (
                                        <button onClick={() => handleUpdateIssue(issue)} className="btn btn-sm btn-outline btn-primary">
                                            Edit
                                        </button>
                                    )
                                }
                                <button onClick={() => handleDelete(issue._id)} className="btn btn-sm btn-error">
                                    Delete
                                </button>
                            </td>
                        </tr>)
                    }
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <dialog ref={issueModalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Edit Issue</h3>
                    {
                        editData && <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-3">
                            {/* issue id */}
                            <input {...register("issueId")} type="hidden" value={editData.id} />

                            {/* report title */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input {...register("title", { required: true })} defaultValue={editData.title} className="input input-bordered w-full" required />
                                {errors.title &&
                                    <p className="text-red-500 text-sm">Title is required</p>}
                            </div>

                            {/* description */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea {...register("description", { required: true })} defaultValue={editData.description} className="textarea textarea-bordered w-full" rows={3} required></textarea>
                                {errors.description &&
                                    <p className="text-red-500 text-sm">Description is required</p>}
                            </div>

                            {/* category */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select {...register("category", { required: true })} defaultValue={editData.category} className="select select-bordered w-full">
                                    <option value="" disabled>Select Category</option>
                                    {
                                        categories.map((category) => (
                                            <option key={category._id} value={category?.categoryName}>
                                                {category?.categoryName}
                                            </option>))
                                    }
                                </select>
                                {errors.category &&
                                    <p className="text-red-500 text-sm">Category is required</p>}
                            </div>

                            {/* location */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Location</span>
                                </label>
                                <input {...register("location", { required: true })} defaultValue={editData.location} className="input input-bordered w-full" />
                                {errors.location &&
                                    <p className="text-red-500 text-sm">Location is required</p>}
                            </div>

                            {/* image */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Image</span>
                                </label>
                                <input {...register("image")} type="file" className="file-input w-full" />
                                {
                                    imageError && <p className="text-red-500">{imageError}</p>
                                }
                            </div>

                            <div className="modal-action">
                                <button onClick={() => issueModalRef.current.close()} type="button" className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {
                                        isSubmitting ? "Updating..." : "Update Issue"
                                    }
                                </button>
                            </div>
                        </form>
                    }
                </div>
            </dialog>
        </div>
    );
};

export default MyIssues;

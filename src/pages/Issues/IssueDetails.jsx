import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../hooks/useRole.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import Timeline from "../../components/Timeline/Timeline.jsx";
import axios from "axios";
import Swal from "sweetalert2";

const IssueDetails = () => {
    const [editData, setEditData] = useState(null);
    const [imageError, setImageError] = useState("");
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role, isPremium, isBlocked } = useRole();
    const navigate = useNavigate();
    const issueModalRef = useRef(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["issue-details", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/issues/${id}`);
            return res.data;
        }
    });

    const issue = data?.issue;
    const logs = data?.timelines || [];

    if (isLoading) {
        return <Loading />;
    }

    if (!issue) {
        return (
            <div className="p-6">
                <p>Issue not found.</p>
            </div>
        );
    }

    const isOwner = issue.reporterEmail === user?.email;
    const canEdit = isOwner && !isBlocked && issue.status === "pending";
    const canDelete = isOwner && !isBlocked;
    const canBoost = isOwner && !issue.isBoosted && !isBlocked;

    const handleBoost = async () => {
        const data = {
            paymentType: "boost_issue",
            issueId: issue._id,
            issueTitle: issue.title,
            customerName: user.displayName,
            customerEmail: user.email,
        }

        const res = await axiosSecure.post("/create-checkout-session", data);
        window.location.assign(res.data.url);
    };

    const handleUpdateIssue = () => {
        setEditData({
            title: issue.title,
            description: issue.description,
            category: issue.category,
            image: issue.image,
            location: issue.location,
        });
        issueModalRef.current.showModal();
    };

    const handlePatchData = async (data) => {
        await axiosSecure.patch(`/citizen/issues/${id}`, data)
            .then((res) => {
                if (res.data.modifiedCount) {
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
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                });
            });
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setImageError("");

        const imageFile = e.target?.image?.files[0];
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
                        title: e.target.title.value,
                        description: e.target.description.value,
                        category: e.target.category.value,
                        image: photoURL,
                        location: e.target.location.value,
                    };

                    await handlePatchData(updatedIssue);
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${error.message}`
                    });
                });
        } else {
            const updatedIssue = {
                title: e.target.title.value,
                description: e.target.description.value,
                category: e.target.category.value,
                location: e.target.location.value,
            };

            await handlePatchData(updatedIssue);
        }
    };

    const handleDelete = () => {
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
                await axiosSecure.delete(`/citizen/issues/${id}`)
                    .then((res) => {
                        if (res.data.deletedCount) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your issue has been deleted.",
                                icon: "success"
                            });
                            navigate("/dashboard/my-issues");
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
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <div className="mb-4">
                        <img src={issue?.image} alt={issue?.title} className="w-full h-64 object-cover rounded-md" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2">
                        {issue?.title}
                    </h1>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge badge-outline">
                            {issue?.category}
                        </span>
                        <span
                            className={`badge capitalize ${
                                issue?.status === "pending" ? "badge-warning"
                                    : issue?.status === "resolved" ||
                                    issue?.status === "closed" ? "badge-success" : "badge-info"
                            }`}
                        >
                            {
                                issue?.status?.split("_").join(" ")
                            }
                        </span>
                        <span className={`badge ${issue?.priority === "high" ? "badge-error" : "badge-ghost"}`}
                        >
                            {
                                issue?.priority === "high" ? "High Priority" : "Normal Priority"
                            }
                        </span>
                        <span className="badge badge-ghost">
                            Upvotes: {issue?.upvoteCount || 0}
                        </span>
                    </div>

                    <p className="mb-4 text-gray-700">
                        {issue?.description}
                    </p>

                    {
                        issue?.location && <p className="mb-2 text-gray-600">
                            <span className="font-semibold">
                                Location:
                            </span>{" "}
                            {issue?.location}
                        </p>
                    }

                    <p className="mb-2 text-gray-600 text-sm">
                        Reported by{" "}
                        <span className="font-semibold">
                            {issue?.reporterName} -
                        </span>{" "}
                        ({issue?.reporterEmail})
                    </p>

                    {
                        issue?.assignedStaffEmail && <p className="mb-4 text-gray-600 text-sm">
                            <span className="font-semibold">
                                Assigned Staff:
                            </span>{" "}
                            {issue?.assignedStaffName} - ({issue?.assignedStaffEmail})
                        </p>
                    }

                    {/* Timeline */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Issue Timeline
                        </h2>
                        <Timeline logs={logs} />
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {
                        isOwner && <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="font-semibold">
                                    Your Actions
                                </h3>

                                {
                                    isPremium && <p className="mt-2 text-xs text-green-600">
                                        You are a premium citizen. Your issues receive priority support.
                                    </p>
                                }

                                {
                                    canEdit && <button onClick={handleUpdateIssue} className="btn btn-sm btn-outline btn-primary mt-2">
                                        Edit (Pending only)
                                    </button>
                                }
                                {
                                    canDelete && <button onClick={handleDelete} className="btn btn-sm btn-outline btn-error mt-2">
                                        Delete Issue
                                    </button>
                                }

                                {
                                    canBoost && <>
                                        <div className="mt-3 text-sm text-gray-500">
                                            Boost this issue for priority handling. Cost: 100৳
                                        </div>
                                        <button onClick={handleBoost} className="btn btn-sm btn-warning mt-2">
                                            Boost Priority
                                        </button>
                                    </>
                                }

                                {
                                    issue.isBoosted && <p className="mt-2 text-sm text-green-600">
                                        This issue is already boosted.
                                    </p>
                                }

                                {
                                    isBlocked && <p className="mt-3 text-sm text-error font-medium">
                                        You are blocked by admin. You can't edit, delete or boost issues.
                                    </p>
                                }
                            </div>
                        </div>
                    }

                    {
                        role === "staff" && issue.assignedStaffEmail === user?.email && (
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold">
                                    Staff Panel
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Status changes available in staff dashboard.
                                </p>
                            </div>
                        </div>)
                    }

                    {
                        role === "admin" && <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold">
                                    Admin Panel
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Use Admin dashboard to assign staff or reject this issue.
                                </p>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {/* Edit Modal */}
            <dialog ref={issueModalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Edit Issue</h3>
                    {
                        editData && <form onSubmit={handleEditSubmit} className="space-y-3">
                            {/* report title */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input name="title" defaultValue={editData.title} className="input input-bordered w-full" required />
                            </div>

                            {/* description */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea name="description" defaultValue={editData.description} className="textarea textarea-bordered w-full" rows={3} required></textarea>
                            </div>

                            {/* category */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select
                                    name="category"
                                    defaultValue={editData.category}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Streetlight">Streetlight</option>
                                    <option value="Road / Pothole">Road / Pothole</option>
                                    <option value="Water Leakage">Water Leakage</option>
                                    <option value="Garbage">Garbage</option>
                                    <option value="Footpath">Footpath</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* image */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Image</span>
                                </label>
                                <input name="image" type="file" className="file-input w-full" />
                                {
                                    imageError && <p className="text-red-500">{imageError}</p>
                                }
                            </div>

                            {/* location */}
                            <div>
                                <label className="label">
                                    <span className="label-text">Location</span>
                                </label>
                                <input name="location" defaultValue={editData.location} className="input input-bordered w-full" />
                            </div>

                            <div className="modal-action">
                                <button onClick={() => issueModalRef.current.close()} type="button" className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Update Issue
                                </button>
                            </div>
                        </form>
                    }
                </div>
            </dialog>
        </div>
    );
};

export default IssueDetails;

import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useRole from "../../hooks/useRole.jsx";
import Swal from "sweetalert2";
import Loading from "../../components/Loading/Loading.jsx";
import Timeline from "../../components/Timeline/Timeline.jsx";

const IssueDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role, isPremium, isBlocked } = useRole();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [editData, setEditData] = useState(null);

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
    const canEdit = isOwner && issue.status === "pending";
    const canDelete = isOwner;
    const canBoost = isOwner && !issue.isBoosted && !isBlocked;

    const handleDelete = async () => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete Issue?",
            text: "This action cannot be undone.",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it",
        });

        if (!result.isConfirmed) return;

        try {
            await axiosSecure.delete(`/citizen/issues/${id}`);
            Swal.fire({
                icon: "success",
                title: "Deleted",
                timer: 1200,
                showConfirmButton: false,
            });
            await queryClient.invalidateQueries(["all-issues"]);
            navigate("/dashboard/my-issues");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error.response?.data?.message ||
                    "Could not delete this issue.",
            });
        }
    };

    const handleBoost = async () => {
        if (!isOwner) return;

        try {
            const res = await axiosSecure.post("/create-checkout-session", {
                paymentType: "boost_issue",
                issueId: issue._id,
                issueTitle: issue.title,
                customerEmail: user.email,
            });

            if (res.data?.url) {
                window.location.href = res.data.url;
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Payment init failed",
                text: "Please try again.",
            });
        }
    };

    const handleEditClick = () => {
        setEditData({
            title: issue.title,
            description: issue.description,
            category: issue.category,
            image: issue.image,
            location: issue.location,
        });
        document.getElementById("edit_issue_modal").showModal();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updated = {
            title: form.title.value,
            description: form.description.value,
            category: form.category.value,
            image: form.image.value,
            location: form.location.value,
        };

        try {
            await axiosSecure.patch(`/citizen/issues/${id}`, updated);
            Swal.fire({
                icon: "success",
                title: "Issue updated",
                timer: 1200,
                showConfirmButton: false,
            });
            document.getElementById("edit_issue_modal").close();
            setEditData(null);
            refetch();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error.response?.data?.message ||
                    "Could not update this issue.",
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {issue.image && (
                        <div className="mb-4">
                            <img
                                src={issue.image}
                                alt={issue.title}
                                className="w-full h-64 object-cover rounded-md"
                            />
                        </div>
                    )}

                    <h1 className="text-3xl font-bold mb-2">
                        {issue.title}
                    </h1>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge badge-outline">
                            {issue.category}
                        </span>
                        <span
                            className={`badge ${
                                issue.status === "pending"
                                    ? "badge-warning"
                                    : issue.status === "resolved" ||
                                    issue.status === "closed"
                                        ? "badge-success"
                                        : "badge-info"
                            }`}
                        >
                            {issue.status}
                        </span>
                        <span
                            className={`badge ${
                                issue.priority === "high"
                                    ? "badge-error"
                                    : "badge-ghost"
                            }`}
                        >
                            {issue.priority === "high" ? "High Priority" : "Normal Priority"}
                        </span>
                        <span className="badge badge-ghost">
                            Upvotes: {issue.upvoteCount || 0}
                        </span>
                    </div>

                    <p className="mb-4 text-gray-700">
                        {issue.description}
                    </p>

                    {issue.location && (
                        <p className="mb-2 text-gray-600">
                            <span className="font-semibold">
                                Location:
                            </span>{" "}
                            {issue.location}
                        </p>
                    )}

                    <p className="mb-2 text-gray-600 text-sm">
                        Reported by{" "}
                        <span className="font-semibold">
                            {issue.reporterName || "Citizen"}
                        </span>{" "}
                        ({issue.reporterEmail})
                    </p>

                    {issue.assignedStaffEmail && (
                        <p className="mb-4 text-gray-600 text-sm">
                            <span className="font-semibold">
                                Assigned Staff:
                            </span>{" "}
                            {issue.assignedStaffName} (
                            {issue.assignedStaffEmail})
                        </p>
                    )}

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
                    {isOwner && (
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold">
                                    Your Actions
                                </h3>

                                {isPremium && (
                                    <p className="mt-2 text-xs text-green-600">
                                        You are a premium citizen. Your issues receive priority support.
                                    </p>
                                )}

                                {canEdit && (
                                    <button
                                        onClick={handleEditClick}
                                        className="btn btn-sm btn-outline btn-primary mt-2"
                                    >
                                        Edit (Pending only)
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-sm btn-outline btn-error mt-2"
                                    >
                                        Delete Issue
                                    </button>
                                )}

                                {canBoost && (
                                    <>
                                        <div className="mt-3 text-sm text-gray-500">
                                            Boost this issue for priority
                                            handling. Cost: 100৳
                                        </div>
                                        <button
                                            onClick={handleBoost}
                                            className="btn btn-sm btn-warning mt-2"
                                        >
                                            Boost Priority
                                        </button>
                                    </>
                                )}

                                {issue.isBoosted && (
                                    <p className="mt-2 text-sm text-green-600">
                                        This issue is already boosted.
                                    </p>
                                )}

                                {isBlocked && (
                                    <p className="mt-3 text-sm text-error">
                                        You are blocked by admin. You cannot
                                        boost or submit issues.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {role === "staff" && issue.assignedStaffEmail === user?.email && (
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold">
                                    Staff Panel
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Status changes available in staff dashboard.
                                </p>
                            </div>
                        </div>
                    )}

                    {role === "admin" && (
                        <div className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <h3 className="font-semibold">
                                    Admin Panel
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Use Admin dashboard to assign staff or
                                    reject this issue.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <dialog id="edit_issue_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Edit Issue</h3>
                    {editData && (
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <div>
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    name="title"
                                    defaultValue={editData.title}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Description
                                    </span>
                                </label>
                                <textarea
                                    name="description"
                                    defaultValue={editData.description}
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Category
                                    </span>
                                </label>
                                <input
                                    name="category"
                                    defaultValue={editData.category}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Image URL
                                    </span>
                                </label>
                                <input
                                    name="image"
                                    defaultValue={editData.image}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Location
                                    </span>
                                </label>
                                <input
                                    name="location"
                                    defaultValue={editData.location}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "edit_issue_modal"
                                            )
                                            .close()
                                    }
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default IssueDetails;

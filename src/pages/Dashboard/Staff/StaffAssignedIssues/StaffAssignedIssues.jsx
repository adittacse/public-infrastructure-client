import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const StaffAssignedIssues = () => {
    const [issuesFiltered, setIssuesFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role } = useRole();

    const { data: assignedIssues = [], refetch } = useQuery({
        queryKey: ["staff-assigned-issues", user?.email, statusFilter, priorityFilter],
        enabled: role === "staff" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/staff/issues?status=${statusFilter}&priority=${priorityFilter}`);
            setIssuesFiltered(res.data);
            return res.data;
        },
    });

    const getNextStatuses = (currentStatus) => {
        switch (currentStatus) {
            case "pending":
                return ["in_progress"];
            case "in_progress":
                return ["working"];
            case "working":
                return ["resolved"];
            case "resolved":
                return ["closed"];
            default:
                return [];
        }
    };

    const handleChangeStatus = (issue, newStatus) => {
        if (!newStatus) return;

        Swal.fire({
            title: "Change status?",
            text: `Change status from ${issue.status} to ${newStatus}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change"
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
                const body = {
                    newStatus,
                    issueId: issue._id
                };
                const res = await axiosSecure.patch(`/staff/issues/${issue._id}/status`, body);

                if (res.data.modifiedCount || res.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Status updated",
                        timer: 1200,
                        showConfirmButton: false,
                    });
                    await refetch();
                } else {
                    Swal.fire({
                        icon: "info",
                        title: "No change",
                        text: "Status was not updated.",
                    });
                }
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error?.response?.data?.message || error?.message}`
                });
            }
        });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        refetch();
    };

    if (!assignedIssues) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Assigned Issues</h1>

            {/* Filter form */}
            <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-2 mb-5 items-center">
                <select
                    className="select select-bordered select-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Status (All)</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="working">Working</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>

                <select
                    className="select select-bordered select-sm"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="">Priority (All)</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                </select>

            </form>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Sl.</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Change Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            issuesFiltered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        No assigned issues found.
                                    </td>
                                </tr>
                            )
                        }
                        {
                            issuesFiltered.map((issue, index) => {
                                const nextStatuses = getNextStatuses(issue.status);
                                return (
                                    <tr key={issue._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img src={issue?.image} alt={issue?.title} />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {
                                                    issue.isBoosted && (
                                                    <span className="badge badge-error badge-sm">
                                                        Boosted
                                                    </span>)
                                                }
                                                <span>{issue?.title}</span>
                                            </div>
                                        </td>
                                        <td>{issue?.location}</td>
                                        <td>
                                            <span className={`badge ${issue?.priority === "high" ? "badge-error" : "badge-ghost"}`}>
                                                {issue?.priority === "high" ? "High" : "Normal"}
                                            </span>
                                        </td>
                                        <td className="capitalize">{issue?.status}</td>
                                        <td>
                                            {nextStatuses.length > 0 ? (
                                                <select
                                                    className="select select-bordered select-xs"
                                                    defaultValue=""
                                                    onChange={(e) =>
                                                        handleChangeStatus(issue, e.target.value)
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Change...
                                                    </option>
                                                    {nextStatuses.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.replace("_", " ")}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    Final status
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/issues/${issue._id}`}
                                                className="btn btn-xs btn-primary"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffAssignedIssues;

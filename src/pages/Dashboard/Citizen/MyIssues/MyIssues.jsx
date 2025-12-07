import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import Swal from "sweetalert2";
import Loading from "../../../../components/Loading/Loading.jsx";

const MyIssues = () => {
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: issues = [], isLoading, refetch } = useQuery({
        queryKey: ["my-issues", user?.email, status, category],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/citizen/my-issues?status=${status}&category=${category}`);
            return res.data;
        },
    });

    const handleDelete = async (id) => {
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
            refetch();
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

    const handleFilter = (e) => {
        e.preventDefault();
        refetch();
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Issues</h1>

            <form onSubmit={handleFilter} className="flex flex-wrap gap-2 mb-4">
                <select
                    className="select select-bordered"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="working">Working</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                </select>

                <input
                    type="text"
                    placeholder="Category"
                    className="input input-bordered"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button type="submit" className="btn btn-primary btn-sm">
                    Filter
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        issues.map((issue, idx) => <tr key={issue._id}>
                            <td>{idx + 1}</td>
                            <td>{issue?.title}</td>
                            <td>{issue?.status}</td>
                            <td>{issue?.priority}</td>
                            <td className="space-x-2">
                                <Link to={`/issues/${issue._id}`} className="btn btn-xs btn-primary">
                                    View
                                </Link>
                                {
                                    issue.status === "pending" && <Link to={`/issues/${issue._id}`} className="btn btn-xs btn-outline">
                                        Edit
                                    </Link>
                                }
                                <button onClick={() => handleDelete(issue._id)} className="btn btn-xs btn-error">
                                    Delete
                                </button>
                            </td>
                        </tr>)
                    }

                    {
                        issues.length === 0 && <tr>
                            <td colSpan={5} className="text-center">
                                No issues found.
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyIssues;

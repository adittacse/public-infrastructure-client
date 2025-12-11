import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const MyIssues = () => {
    const [status, setStatus] = useState("");
    const [location, setLocation] = useState("");
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // get locations to show in filter dropdown
    const { data: locations = [], isLoading: isLocationsLoading } = useQuery({
        queryKey: ["my-issue-locations", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get("/citizen/my-issue-locations");
            return res.data;
        }
    });

    const { data: issues = [], isLoading: isIssuesLoading, refetch, isFetching } = useQuery({
        queryKey: ["my-issues", user?.email, status, location],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/citizen/my-issues?email=${user?.email}&status=${status}&location=${location}`);
            return res.data;
        },
    });

    const handleDelete = async (id) => {
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
                                icon: "success"
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

    if (isIssuesLoading || isLocationsLoading) {
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">Location (All)</option>
                    {
                        locations.map((location) =>
                            <option key={location} value={location}>
                                {location}
                            </option>
                        )
                    }
                </select>

                {
                    isFetching && <span className="text-xs text-gray-500">Updating…</span>
                }
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Sl.</th>
                        <th>Title</th>
                        <th>Location</th>
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
                        issues.map((issue, idx) => <tr key={issue._id}>
                            <td>{idx + 1}</td>
                            <td>{issue?.title}</td>
                            <td>{issue?.location}</td>
                            <td className="capitalize">{issue?.status?.split("_").join(" ")}</td>
                            <td className="capitalize">{issue?.priority}</td>
                            <td className="space-x-2">
                                <Link to={`/issues/${issue._id}`} className="btn btn-xs btn-primary">
                                    View
                                </Link>
                                <button onClick={() => handleDelete(issue._id)} className="btn btn-xs btn-error">
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

export default MyIssues;

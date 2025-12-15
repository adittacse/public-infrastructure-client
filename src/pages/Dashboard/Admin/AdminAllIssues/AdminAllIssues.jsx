import { useRef, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const AdminAllIssues = () => {
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [searchText, setSearchText] = useState("");

    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState("");

    const axiosSecure = useAxiosSecure();
    const { role } = useRole();
    const assignStaffRef = useRef(null);

    // all categories
    const { data: categories = [] } = useQuery({
        queryKey: ["admin-categories"],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get("/categories");
            return res.data;
        },
    });

    // all issues including filter
    const { data: issues = [], isLoading, isFetching, refetch } = useQuery({
        queryKey: ["admin-issues", status, priority, category, searchText],
        enabled: role === "admin",
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const url = `/admin/issues?status=${status}&priority=${priority}&category=${category}&search=${searchText}`;
            const res = await axiosSecure.get(url);
            return res.data;
        }
    });

    // staff list to assign staff modal
    const { data: staffList = [], isLoading: staffLoading } = useQuery({
        queryKey: ["admin-staff-list"],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/staff");
            return res.data;
        }
    });

    const handleOpenAssignModal = (issue) => {
        setSelectedIssue(issue);
        setSelectedStaffId("");
        assignStaffRef.current.showModal();
    };

    const handleAssignStaff = async (e) => {
        e.preventDefault();
        if (!selectedIssue || !selectedStaffId) {
            return;
        }

        await axiosSecure.patch(`/admin/issues/${selectedIssue._id}/assign-staff`, {
            staffId: selectedStaffId
        })
            .then((res) => {
                if (res.data.modifiedCount) {
                    assignStaffRef.current.close();
                    setSelectedIssue(null);
                    setSelectedStaffId("");
                    refetch();
                    Swal.fire({
                        icon: "success",
                        title: "Staff assigned",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`,
                });
            });
    };

    const handleRejectIssue = (issueId) => {
        Swal.fire({
            title: "Reject this issue?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, reject",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.patch(`/admin/issues/${issueId}/reject`)
                    .then((res) => {
                        if (res.data.modifiedCount) {
                            refetch();
                            Swal.fire({
                                icon: "success",
                                title: "Issue rejected",
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
        });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">All Issues</h1>

            {/* filter data */}
            {/*<div className="flex flex-wrap gap-2 mb-4 items-center">*/}
            <div className="grid grid-cols-4 items-center gap-5 mb-5">
                <select
                    className="select select-bordered"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="working">Working</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                </select>

                <select
                    className="select select-bordered"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                </select>

                <select
                    className="select select-bordered"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {
                        categories.map((category) => <option key={category._id} value={category.categoryName}>
                            {category?.categoryName}
                        </option>)
                    }
                </select>

                <input
                    type="text"
                    placeholder="Search by title / location"
                    className="input input-bordered"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {
                    isFetching && <span className="text-xs text-gray-500">Updating…</span>
                }
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Sl.</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Assigned Staff</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            issues.length === 0 && <tr>
                                <td colSpan={7} className="text-center">
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
                                <td>{issue?.category}</td>
                                <td className="capitalize">
                                    {issue?.status?.split("_").join(" ")}
                                </td>
                                <td>
                                    {
                                        issue.priority === "high" ? <>
                                            <span className="badge badge-error">High</span>
                                        </>
                                        : <>
                                            <span className="badge badge-ghost">Normal</span>
                                        </>
                                    }
                                </td>
                                <td className="text-sm">
                                    {
                                        issue.assignedStaffEmail ? <>
                                            <div>{issue?.assignedStaffName}</div>
                                            <div className="text-xs text-gray-500">
                                                {issue?.assignedStaffEmail}
                                            </div>
                                        </> : <>
                                            <span className="text-xs text-gray-400">
                                                Not assigned
                                            </span>
                                        </>
                                    }
                                </td>
                                <td className="space-x-2">
                                    {
                                        !issue.assignedStaffEmail &&
                                        <button
                                            onClick={() => handleOpenAssignModal(issue)}
                                            className="btn btn-xs btn-primary"
                                        >
                                            Assign Staff
                                        </button>
                                    }
                                    {
                                        issue.status === "pending" &&
                                        <button
                                            onClick={() => handleRejectIssue(issue._id)}
                                            className="btn btn-xs btn-error"
                                        >
                                            Reject
                                        </button>
                                    }
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>

            {/* Assign Staff Modal */}
            <dialog ref={assignStaffRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Assign Staff</h3>
                    {
                        selectedIssue && (
                        <form onSubmit={handleAssignStaff} className="space-y-3">
                            <p className="text-sm">
                                Issue:{" "}
                                <span className="font-semibold">
                                    {selectedIssue?.title}
                                </span>
                            </p>
                            <div>
                                <label className="label">
                                    <span className="label-text mb-1">Select Staff</span>
                                </label>
                                {staffLoading ? (
                                    <p className="text-sm text-gray-500">
                                        Loading staff...
                                    </p>
                                ) : (
                                    <select
                                        className="select select-bordered w-full"
                                        value={selectedStaffId}
                                        onChange={(e) =>
                                            setSelectedStaffId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Choose a staff</option>
                                        {
                                            staffList.map((staff) => (
                                                <option key={staff._id} value={staff._id}>
                                                    {staff?.displayName} ({staff?.email})
                                                </option>)
                                            )
                                        }
                                    </select>
                                )}
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => assignStaffRef.current.close()}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={!selectedStaffId}>
                                    Assign
                                </button>
                            </div>
                        </form>)
                    }
                </div>
            </dialog>
        </div>
    );
};

export default AdminAllIssues;

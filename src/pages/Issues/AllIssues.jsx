import { useState } from "react";
import { useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios.jsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading.jsx";
import IssueCard from "../../components/IssueCard/IssueCard.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import Swal from "sweetalert2";

const AllIssues = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");

    const axiosInstance = useAxios();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    const safeLimit = limit === 0 ? 0 : limit > 0 ? limit : 10;

    const { data, refetch } = useQuery({
        queryKey: ["issues", currentPage, safeLimit, search, status, priority, category, location],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const url = `/issues?page=${currentPage}&limit=${safeLimit}&search=${search}&status=${status}&priority=${priority}&category=${category}&location=${location}`;
            const res = await axiosInstance.get(url);
            const data = res.data || {};

            return {
                issues: data.result,
                pagination: {
                    total: data.total || 0,
                    per_page: data.per_page || (safeLimit === 0 ? data.total : safeLimit),
                    from: data.from || 0,
                    to: data.to || 0,
                    current_page: data.current_page || 1,
                    last_page: data.last_page || 1,
                }
            };
        }
    });

    const issues = data?.issues || [];
    const pagination = data?.pagination || {
        total: 0,
        per_page: safeLimit,
        from: 0,
        to: 0,
        current_page: currentPage,
        last_page: 1,
    };

    // get categories to show in filter dropdown
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axiosInstance.get("/categories");
            return res.data;
        },
    });

    // get locations to show in filter dropdown
    const { data: locations = [] } = useQuery({
        queryKey: ["my-issue-locations"],
        queryFn: async () => {
            const res = await axiosInstance.get("/locations/issue-locations");
            return res.data;
        }
    });

    const handleUpvote = async (id) => {
        if (!user) {
            Swal.fire({
                icon: "info",
                title: "Login required",
                text: "Please login to upvote an issue.",
                confirmButtonText: "Go to Login",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }

        await axiosSecure.patch(`/issues/${id}/upvote`)
            .then(async (res) => {
                if (res.data.modifiedCount) {
                    await Swal.fire({
                        icon: "success",
                        title: "Upvoted",
                        text: "Thanks for your upvote.",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    await refetch();
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error?.response?.data?.message || error?.message}`,
                });
            });
    };

    if (!data) {
        return <Loading />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">All Issues</h1>

            {/* search & filter */}
            <div className="grid gap-2 md:grid-cols-6 mb-6">
                <select
                    className="select select-bordered w-full"
                    value={status}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setStatus(e.target.value);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In-Progress</option>
                    <option value="working">Working</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>

                <select
                    className="select select-bordered w-full"
                    value={priority}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setPriority(e.target.value);
                    }}
                >
                    <option value="">All Priorities</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>

                <select
                    className="select select-bordered"
                    value={category}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setCategory(e.target.value);
                    }}
                >
                    <option value="">All Categories</option>
                    {
                        categories.map((category) => <option key={category._id} value={category.categoryName}>
                            {category?.categoryName}
                        </option>)
                    }
                </select>

                <select
                    className="select select-bordered"
                    value={location}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setLocation(e.target.value);
                    }}
                >
                    <option value="">All Locations</option>
                    {
                        locations.map((location) =>
                            <option key={location} value={location}>
                                {location}
                            </option>
                        )
                    }
                </select>

                <select
                    className="select select-bordered w-full"
                    value={limit}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0) {
                            setCurrentPage(1);
                            setLimit(v);
                        }
                    }}
                >
                    <option value={0}>All Issues</option>
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>

                <input
                    type="text"
                    placeholder="Search by issue title"
                    className="input input-bordered w-full"
                    value={search}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setSearch(e.target.value);
                    }}
                />
            </div>

            {/* count info */}
            <p className="mb-4 text-sm text-gray-600">
                ({pagination.total}) issues found
            </p>

            {/* list */}
            {
                issues.length === 0 ? <>
                    <p className="text-center text-gray-500 py-10">
                        No issues found.
                    </p>
                </> : <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            issues.map((issue) => <IssueCard key={issue._id}
                                                             issue={issue}
                                                             onUpvote={handleUpvote} />)
                        }
                    </div>
                </>
            }

            {
                safeLimit !== 0 && <Pagination pagination={pagination} onPageChange={setCurrentPage} />
            }
        </div>
    );
};

export default AllIssues;

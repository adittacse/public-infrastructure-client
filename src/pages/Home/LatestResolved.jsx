import useAuth from "../../hooks/useAuth.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import IssueCard from "../../components/IssueCard/IssueCard.jsx";

const LatestResolved = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    const { data: latestIssues = [], isLoading, refetch } = useQuery({
        queryKey: ["latest-resolved-issues"],
        queryFn: async () => {
            const res = await axios.get("/issues/latest-resolved");
            return res.data;
        }
    });
    const navigate = useNavigate();

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

    return (
        <section className="py-10 max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Latest Resolved Issues</h2>

                <button
                    onClick={() => navigate("/all-issues")}
                    className="btn btn-ghost btn-sm"
                >
                    View All
                </button>
            </div>

            {
                isLoading ? (
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            latestIssues.map((issue) => <IssueCard key={issue._id}
                                issue={issue}
                                onUpvote={handleUpvote}
                            />)
                        }
                        {
                            latestIssues.length === 0 && (
                                <p className="text-gray-500">
                                    No resolved issues found yet.
                                </p>
                            )
                        }
                    </div>
                )
            }
        </section>
    );
};

export default LatestResolved;
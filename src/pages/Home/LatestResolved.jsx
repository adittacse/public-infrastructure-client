import useAuth from "../../hooks/useAuth.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import IssueCard from "../../components/IssueCard/IssueCard.jsx";
import Loading from "../../components/Loading/Loading.jsx";

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

    if (isLoading) {
        return <Loading />;
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center mb-8">Latest Resolved Issues</h2>

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

            <div className="flex justify-center mt-10">
                <button onClick={() => navigate("/all-issues")} className="btn btn-primary">
                    All Issues
                </button>
            </div>
        </section>
    );
};

export default LatestResolved;
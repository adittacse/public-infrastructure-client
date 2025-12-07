import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";

const CitizenOverview = () => {
    const axiosSecure = useAxiosSecure();

    const { data, isLoading } = useQuery({
        queryKey: ["citizen-stats"],
        queryFn: async () => {
            const res = await axiosSecure.get("/citizen/stats");
            return res.data;
        }
    });

    if (isLoading) {
        return <Loading />;
    }

    const statusStats = data?.statusStats || [];
    const totalPayments = data?.totalPayments || 0;

    const getCount = (status) =>
        statusStats.find((s) => s._id === status)?.count || 0;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Dashboard Overview
            </h1>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-base-100 shadow">
                    <div className="stat-title">Total Issues</div>
                    <div className="stat-value text-primary">
                        {
                            statusStats.reduce((sum, s) => sum + s.count, 0)
                        }
                    </div>
                </div>
                <div className="stat bg-base-100 shadow">
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-warning">
                        {
                            getCount("pending")
                        }
                    </div>
                </div>
                <div className="stat bg-base-100 shadow">
                    <div className="stat-title">In Progress</div>
                    <div className="stat-value text-info">
                        {
                            getCount("in_progress") + getCount("working")
                        }
                    </div>
                </div>
                <div className="stat bg-base-100 shadow">
                    <div className="stat-title">Resolved</div>
                    <div className="stat-value text-success">
                        {
                            getCount("resolved") + getCount("closed")
                        }
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow mb-6">
                <div className="card-body">
                    <h2 className="card-title">
                        Payments & Boost History
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                        Total payments: {totalPayments}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CitizenOverview;

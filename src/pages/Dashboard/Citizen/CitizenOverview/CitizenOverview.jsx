import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

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
    const payments = data?.payments || 0;
    const totalPayments = data?.totalPayments || 0;
    const paymentsCount = data?.paymentsCount || 0;

    const getCount = (status) =>
        statusStats.find((s) => s._id === status)?.count || 0;

    const statusChartData = [
        { name: "Pending", count: getCount("pending") },
        { name: "In Progress", count: getCount("in_progress") + getCount("working") },
        { name: "Resolved", count: getCount("resolved") + getCount("closed") },
        { name: "Rejected", count: getCount("rejected") },
    ];

    const paymentsChartData = payments
        .slice()
        .reverse()
        .map((payment, index) => ({
            name: new Date(payment?.paidAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
            }),
            amount: payment?.amount || 0,
        }));

    const totalIssues = statusStats.reduce((sum, s) => sum + s.count, 0);
    const inProgress = getCount("in_progress") + getCount("working");
    const resolved = getCount("resolved") + getCount("closed");

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Dashboard Overview</h1>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-base-100 shadow">
                    <div className="stat-title">Total Issues</div>
                    <div className="stat-value text-primary">
                        {totalIssues}
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
                        {inProgress}
                    </div>
                </div>
                <div className="stat bg-base-100 shadow">
                    <div className="stat-title">Resolved</div>
                    <div className="stat-value text-success">
                        {resolved}
                    </div>
                </div>
            </div>

            {/* payments summary card */}
            <div className="card bg-base-100 shadow mb-6">
                <div className="card-body">
                    <h2 className="card-title">
                        Payments & Boost History
                    </h2>
                    <p className="text-sm text-gray-700 mb-2">
                        <span>You paid for {paymentsCount} time</span>
                        <span className="flex items-center">Total payments: BDT {totalPayments} <FaBangladeshiTakaSign /></span>
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* status distribution chart */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-sm md:text-base">
                            Issue Status Overview
                        </h2>
                        <div className="w-full h-64 min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* payments over time chart */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-sm md:text-base">
                            Payments Over Time
                        </h2>
                        {
                            paymentsChartData.length === 0 ? <>
                                <p className="text-sm text-gray-500">
                                    No payments yet.
                                </p>
                            </>: <>
                                <div className="w-full h-64 min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={paymentsChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="amount" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenOverview;

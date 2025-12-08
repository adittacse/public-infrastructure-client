import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import StatusBar from "../../../../components/StatusBar/StatusBar.jsx";
import StatsCards from "./StatsCards.jsx";
import LatestIssues from "./LatestIssues.jsx";
import LatestPayments from "./LatestPayments.jsx";
import LatestUsers from "./LatestUsers.jsx";

const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();

    const { data, isLoading } = useQuery({
        queryKey: ["admin-overview"],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/overview");
            return res.data;
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    const stats = data?.stats || {};
    const latestIssues = data?.latestIssues || [];
    const latestPayments = data?.latestPayments || [];
    const latestUsers = data?.latestUsers || [];

    const totalIssues = stats.totalIssues || 0;
    const pending = stats.pending || 0;
    const inProgress = stats.inProgress || 0;
    const working = stats.working || 0;
    const resolved = stats.resolved || 0;
    const closed = stats.closed || 0;
    const rejected = stats.rejected || 0;
    const totalPayments = stats.totalPayments || 0;

    const statusTotal = pending + inProgress + working + resolved + closed + rejected || 1;

    const percent = (value) => {
        return Math.round((value / statusTotal) * 100) || 0;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Admin Overview</h1>

            {/* Stats cards */}
            <StatsCards
                totalIssues={totalIssues}
                pending={pending}
                resolved={resolved}
                totalPayments={totalPayments} />

            {/* Status distribution (simple chart) */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title">Issue Status Distribution</h2>
                    <div className="space-y-2 mt-4">
                        <StatusBar label="Pending" value={pending} color="bg-warning" percent={percent(pending)} />
                        <StatusBar label="In Progress" value={inProgress} color="bg-info" percent={percent(inProgress)} />
                        <StatusBar label="Working" value={working} color="bg-accent" percent={percent(working)} />
                        <StatusBar label="Resolved" value={resolved} color="bg-success" percent={percent(resolved)} />
                        <StatusBar label="Closed" value={closed} color="bg-success" percent={percent(closed)} />
                        <StatusBar label="Rejected" value={rejected} color="bg-error" percent={percent(rejected)} />
                    </div>
                </div>
            </div>

            {/* Latest data */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Latest issues */}
                <LatestIssues latestIssues={latestIssues} />

                {/* Latest payments */}
                <LatestPayments latestPayments={latestPayments} />

                {/* Latest users */}
                <LatestUsers latestUsers={latestUsers} />
            </div>
        </div>
    );
};

export default AdminOverview;

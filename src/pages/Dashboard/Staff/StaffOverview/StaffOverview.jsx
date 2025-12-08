import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";

const StaffOverview = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role } = useRole();

    const { data: overview = {}, isLoading } = useQuery({
        queryKey: ["staff-overview", user?.email],
        enabled: role === "staff" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get("/staff/overview");
            return res.data;
        }
    });

    if (isLoading) {
        return <Loading />;
    }

    const {
        assignedCount = 0,
        inProgressCount = 0,
        workingCount = 0,
        resolvedCount = 0,
        closedCount = 0,
        todayTasksCount = 0,
        boostedIssuesCount = 0,
        totalIssues = 0
    } = overview;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Staff Dashboard Overview
            </h1>

            {/* Top Stats */}
            <div className="stats shadow w-full mb-6">
                <div className="stat">
                    <div className="stat-title">Total Assigned Issues</div>
                    <div className="stat-value text-primary">
                        {assignedCount}
                    </div>
                    <div className="stat-desc">
                        Total assigned to you
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">Today&apos;s Tasks</div>
                    <div className="stat-value text-secondary">
                        {todayTasksCount}
                    </div>
                    <div className="stat-desc">
                        Due today or recently updated
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">Boosted Issues</div>
                    <div className="stat-value text-error">
                        {boostedIssuesCount}
                    </div>
                    <div className="stat-desc text-xs">
                        Boosted issues should be prioritized
                    </div>
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-sm">In Progress</h2>
                        <p className="text-3xl font-bold">{inProgressCount}</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-sm">Working</h2>
                        <p className="text-3xl font-bold">{workingCount}</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-sm">Resolved</h2>
                        <p className="text-3xl font-bold text-success">
                            {resolvedCount}
                        </p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-sm">Closed</h2>
                        <p className="text-3xl font-bold text-success">
                            {closedCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Card */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title">Summary</h2>
                    <p className="text-sm text-gray-600">
                        You are currently assigned to <span className="font-semibold">{assignedCount}</span> issues.
                        Out of them, <span className="font-semibold">{inProgressCount}</span> are marked as <span className="badge badge-info">In Progress</span>,{" "}
                        <span className="font-semibold">{workingCount}</span> are <span className="badge badge-warning">Working</span>,{" "}
                        <span className="font-semibold">{resolvedCount}</span> are <span className="badge badge-success">Resolved</span> and{" "}
                        <span className="font-semibold">{closedCount}</span> issues are <span className="badge badge-success">Closed</span>.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Total issues handled: <span className="font-semibold">{totalIssues}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffOverview;

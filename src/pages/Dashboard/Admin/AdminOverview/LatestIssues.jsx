import Loading from "../../../../components/Loading/Loading.jsx";

const LatestIssues = ({ latestIssues }) => {
    if (!latestIssues) {
        return <Loading />;
    }

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="card-title">Latest Issues</h2>
                <div className="mt-2 space-y-2">
                    {
                        latestIssues.length === 0 && <p className="text-sm text-gray-500">
                            No recent issues.
                        </p>
                    }
                    {
                        latestIssues.map((issue) => <div key={issue._id} className="border rounded-md p-2 text-sm flex flex-col gap-1">
                            <div className="font-semibold">
                                {issue.title}
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="badge badge-outline">
                                    {issue.category}
                                </span>
                                <span className="badge badge-ghost capitalize">
                                    {issue.status}
                                </span>
                                {
                                    issue.priority === "high" && <span className="badge badge-error">
                                        High
                                    </span>
                                }
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default LatestIssues;
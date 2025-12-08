import Loading from "../../../../components/Loading/Loading.jsx";

const LatestUsers = ({ latestUsers }) => {
    if (!latestUsers) {
        return <Loading />;
    }

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="card-title">Latest Citizens</h2>
                <div className="mt-2 space-y-2">
                    {
                        latestUsers.length === 0 && <p className="text-sm text-gray-500">
                            No recent users.
                        </p>
                    }
                    {
                        latestUsers.map((user) => <div key={user._id} className="border rounded-md p-2 text-sm flex flex-col gap-1">
                            <div className="font-semibold">
                                {user?.displayName}
                            </div>

                            <div className="text-xs text-gray-500">
                                {user?.email}
                            </div>

                            <div className="text-xs">
                                {
                                    user?.isPremium && <span className="badge badge-success badge-sm mr-1">
                                        Premium
                                    </span>
                                }
                                {
                                    user?.isBlocked && <span className="badge badge-error badge-sm">
                                        Blocked
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

export default LatestUsers;
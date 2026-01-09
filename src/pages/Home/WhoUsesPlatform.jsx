const WhoUsesPlatform = () => {
    const roles = [
        {
            role: "Citizens",
            desc: "Report issues, track progress, upvote important problems.",
        },
        {
            role: "Staff",
            desc: "Receive assigned issues and update work progress.",
        },
        {
            role: "Admins",
            desc: "Manage issues, assign staff, monitor overall performance.",
        },
    ];

    return (
        <section className="py-12 bg-base-200">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Who Is This Platform For?
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {roles.map((r) => (
                        <div key={r.role} className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="font-semibold text-lg">
                                    {r.role}
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    {r.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhoUsesPlatform;

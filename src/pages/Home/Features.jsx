import React from "react";

const Features = () => {
    return (
        <section className="py-10 bg-base-100">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4">Key Features</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="card bg-base-200 p-4">
                        <h3 className="font-semibold mb-2">
                            Real-time Issue Tracking
                        </h3>
                        <p className="text-sm text-gray-600">
                            Track every step from report to closure with a
                            clear timeline.
                        </p>
                    </div>
                    <div className="card bg-base-200 p-4">
                        <h3 className="font-semibold mb-2">
                            Priority Support
                        </h3>
                        <p className="text-sm text-gray-600">
                            Boost important issues for faster attention
                            from authorities.
                        </p>
                    </div>
                    <div className="card bg-base-200 p-4">
                        <h3 className="font-semibold mb-2">
                            Role-based Dashboard
                        </h3>
                        <p className="text-sm text-gray-600">
                            Separate dashboards for citizens, staff, and
                            admins to keep workflow simple.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
import React from "react";

const Pricing = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">
                Pricing & Plans
            </h1>
            <p className="text-center text-sm md:text-base text-gray-500 mb-10">
                Choose the plan that matches your usage. You can upgrade anytime.
            </p>

            {/* 3 Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Free Plan */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-1">Free Plan</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Designed for occasional users.
                        </p>

                        <div className="text-3xl font-bold mb-2">৳0</div>
                        <p className="text-xs text-gray-500 mb-4">Up to 3 issues per account.</p>

                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Submit maximum <b>3 issues</b></li>
                            <li>• Track issue status</li>
                            <li>• Basic dashboard</li>
                            <li>• Can boost issues by paying</li>
                        </ul>

                        <button className="btn btn-outline btn-sm w-full mt-5" disabled>
                            Default Plan
                        </button>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="card bg-base-100 shadow-xl border border-primary">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-1">Premium Plan</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            For active users who submit issues regularly.
                        </p>

                        <div className="text-3xl font-bold mb-2">৳1000</div>
                        <p className="text-xs text-gray-500 mb-4">One-time payment.</p>

                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <b>Unlimited</b> issue submission</li>
                            <li>• Premium badge next to your name</li>
                            <li>• Higher visibility to staff & admin</li>
                            <li>• Boost feature also available</li>
                        </ul>

                        <button className="btn btn-primary btn-sm w-full mt-5">
                            Upgrade from Profile
                        </button>
                    </div>
                </div>

                {/* Boost Issue (NEW package) */}
                <div className="card bg-base-100 shadow-xl border border-warning">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-1">Boost Issue</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Get faster attention for any specific issue.
                        </p>

                        <div className="text-3xl font-bold mb-2">৳100</div>
                        <p className="text-xs text-gray-500 mb-4">
                            Pay per issue to increase priority.
                        </p>

                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Boost a single issue</li>
                            <li>• Staff sees boosted issues first</li>
                            <li>• Highlighted as <b>High Priority</b></li>
                            <li>• Works for both Free and Premium users</li>
                        </ul>

                        <button className="btn btn-warning btn-sm w-full mt-5">
                            Boost From Issue Details
                        </button>
                    </div>
                </div>

            </div>

            <div className="mt-10 text-xs md:text-sm text-gray-500 text-center max-w-3xl mx-auto">
                * Pricing is for demo purposes. The authority may adjust the values anytime.
            </div>
        </div>
    );
};

export default Pricing;
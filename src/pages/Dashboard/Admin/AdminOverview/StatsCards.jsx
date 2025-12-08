import React from "react";

const StatsCards = ({ totalIssues, pending, resolved, totalPayments }) => {
    return (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Total Issues</div>
                <div className="stat-value text-primary">
                    {totalIssues}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Pending</div>
                <div className="stat-value text-warning">
                    {pending}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Resolved</div>
                <div className="stat-value text-success">
                    {resolved}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Total Payments</div>
                <div className="stat-value text-info">
                    {totalPayments}৳
                </div>
            </div>
        </div>
    );
};

export default StatsCards;
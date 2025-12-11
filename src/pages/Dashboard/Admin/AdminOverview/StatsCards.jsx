import React from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const StatsCards = ({ totalIssues, pending, inProgress, working, resolved, closed, rejected, totalPayments }) => {
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
                <div className="stat-title">In Progress</div>
                <div className="stat-value text-secondary">
                    {inProgress}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Working</div>
                <div className="stat-value text-info">
                    {working}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Resolved</div>
                <div className="stat-value text-success">
                    {resolved}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Closed</div>
                <div className="stat-value text-info-content">
                    {closed}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Rejected</div>
                <div className="stat-value text-error">
                    {rejected}
                </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Total Payments</div>
                <div className="stat-value text-success-content flex items-center">
                    {totalPayments} <FaBangladeshiTakaSign />
                </div>
            </div>
        </div>
    );
};

export default StatsCards;
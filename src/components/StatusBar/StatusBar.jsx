import React from "react";

const StatusBar = ({ label, value, color, percent }) => {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span>{label}</span>
                <span>
                    {value} ({percent}%)
                </span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
};

export default StatusBar;
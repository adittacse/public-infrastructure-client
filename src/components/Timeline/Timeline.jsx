import React from "react";

const Timeline = ({ logs }) => {
    if (!logs || logs.length === 0) {
        return (
            <p className="text-gray-500 text-sm">
                No timeline updates yet.
            </p>
        );
    }

    return (
        <div className="mt-4 border-l-2 border-primary pl-4 space-y-4">
            {
                logs.map((log) => <div key={log._id} className="relative">
                    <div className="w-3 h-3 rounded-full bg-primary absolute -left-[9px] top-1"></div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                        <div>
                            <span
                                className={`badge badge-sm mr-2 ${
                                    log?.status === "pending" ? "badge-warning"
                                        : log?.status === "resolved" ||
                                        log?.status === "closed"
                                            ? "badge-success"
                                            : "badge-info"
                                }`}
                            >
                                {log?.status}
                            </span>
                            <span className="font-medium">
                                {log?.message}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                            <p>
                                By: {log?.updatedByName} ({log?.updatedByRole})
                            </p>
                            <p>
                                {log?.updatedByEmail}
                            </p>
                            <p>
                                {
                                    new Date(log?.createdAt).toLocaleString()
                                }
                            </p>
                        </div>
                    </div>
                </div>)
            }
        </div>
    );
};

export default Timeline;

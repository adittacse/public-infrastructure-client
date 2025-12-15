import React from "react";

const CommunityImpact = () => {
    const stats = [
        {
            label: "Issues Reported",
            value: "1.2K+",
            description: "Real problems submitted by local citizens.",
        },
        {
            label: "Resolved Issues",
            value: "900+",
            description: "Successfully fixed with staff & authorities.",
        },
        {
            label: "Active Citizens",
            value: "500+",
            description: "People who regularly use the platform.",
        },
        {
            label: "Average Response Time",
            value: "< 24h",
            description: "From report to first action taken.",
        },
    ];

    return (
        <section className="py-12 md:py-16 bg-base-200">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-3xl font-bold text-center mb-8">Community Impact</h2>

                <p className="text-center text-sm md:text-base text-gray-600 mb-8">
                    Our platform connects citizens with authorities to improve roads, streetlights, waste management and more.
                </p>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {
                        stats.map((item) =>
                            <div key={item.label} className="card bg-base-100 shadow-md border border-base-300">
                                <div className="card-body items-center text-center py-6">
                                    <div className="text-2xl md:text-3xl font-bold text-primary">
                                        {item?.value}
                                    </div>
                                    <div className="mt-1 font-semibold text-sm md:text-base">
                                        {item?.label}
                                    </div>
                                    <p className="mt-1 text-xs md:text-sm text-gray-500">
                                        {item?.description}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
};

export default CommunityImpact;
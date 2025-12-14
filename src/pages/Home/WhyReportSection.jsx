import React from "react";

const WhyReportSection = () => {
    const features = [
        {
            title: "One Central Place",
            description:
                "Report all your local problems like road damage, streetlight or garbage issues in one single platform.",
            icon: "📌",
        },
        {
            title: "Transparent Tracking",
            description:
                "Track every update of your issue — pending, in progress, working or resolved — from your own dashboard.",
            icon: "📊",
        },
        {
            title: "Faster Response",
            description:
                "Admin and staff get a clear view of all issues, helping them prioritize and respond more quickly.",
            icon: "⚡",
        },
        {
            title: "Boost Important Issues",
            description:
                "Upgrade to premium and boost high priority issues so that they get more attention from the authorities.",
            icon: "🚀",
        },
    ];

    return (
        <section className="py-12 md:py-16 bg-base-100">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                    Why Use This Platform?
                </h2>
                <p className="text-center text-sm md:text-base text-gray-500 mb-8">
                    Empower citizens and authorities to work together for better roads, lights, cleanliness and public safety.
                </p>

                <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 md:gap-6">
                    {
                        features.map((item) => <>
                            <div key={item.title} className="card bg-base-200 shadow-sm border border-base-300 h-full">
                                <div className="card-body items-start">
                                    <div className="text-3xl mb-2">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-semibold text-base md:text-lg">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </>)
                    }
                </div>
            </div>
        </section>
    );
};

export default WhyReportSection;

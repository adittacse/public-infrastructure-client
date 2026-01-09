const IssueCategories = () => {
    const categories = [
        { name: "Road & Pothole", icon: "🛣️" },
        { name: "Streetlight", icon: "💡" },
        { name: "Water Leakage", icon: "🚰" },
        { name: "Garbage & Waste", icon: "🗑️" },
        { name: "Footpath & Drain", icon: "🚶" },
        { name: "Other Public Issues", icon: "🏙️" },
    ];

    return (
        <section className="py-12 bg-base-100">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Types of Issues You Can Report
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.name} className="card bg-base-200 border shadow-sm">
                            <div className="card-body items-center text-center">
                                <div className="text-4xl">{cat.icon}</div>
                                <h3 className="font-semibold mt-2">
                                    {cat.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IssueCategories;

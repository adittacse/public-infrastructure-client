const TransparencySection = () => {
    return (
        <section className="py-12 bg-base-100">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">
                    Transparency & Accountability
                </h2>

                <p className="text-gray-600 max-w-3xl mx-auto">
                    Every reported issue follows a transparent workflow.
                    Citizens can see when an issue is reviewed, assigned,
                    worked on, and finally resolved — building trust
                    between people and authorities.
                </p>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <div className="card bg-base-200 p-4">Clear Status Updates</div>
                    <div className="card bg-base-200 p-4">Public Timelines</div>
                    <div className="card bg-base-200 p-4">Upvote Visibility</div>
                    <div className="card bg-base-200 p-4">Audit-friendly Records</div>
                </div>
            </div>
        </section>
    );
};

export default TransparencySection;

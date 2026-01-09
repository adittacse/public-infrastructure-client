import { useNavigate } from "react-router";

const CallToAction = () => {
    const navigate = useNavigate();

    return (
        <section className="py-14 bg-primary text-primary-content">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">
                    Make Your City Better Today
                </h2>

                <p className="mb-6 text-sm md:text-base">
                    Join thousands of citizens improving public infrastructure
                    by reporting real-world issues.
                </p>

                <button
                    onClick={() => navigate("/dashboard/report-issue")}
                    className="btn btn-secondary"
                >
                    Report an Issue Now
                </button>
            </div>
        </section>
    );
};

export default CallToAction;

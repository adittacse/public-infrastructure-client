import React from "react";

const HowItWorks = () => {
    return (
        <section className="py-10 bg-base-200">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4">
                    How It Works
                </h2>
                <div className="steps steps-vertical md:steps-horizontal">
                    <div className="step step-primary">
                        Submit Issue
                    </div>
                    <div className="step step-primary">
                        Admin Review &amp; Assign Staff
                    </div>
                    <div className="step step-primary">
                        Staff Updates Progress
                    </div>
                    <div className="step step-primary">
                        Issue Resolved &amp; Closed
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
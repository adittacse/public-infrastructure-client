import React from "react";

const HowItWorks = () => {
    return (
        <section className="py-10 bg-base-200">
            <h2 className="text-3xl font-bold text-center mb-5">How It Works</h2>

            <div className="flex justify-center">
                <ul className="steps steps-vertical md:steps-horizontal">
                    <li className="step step-primary">Submit Issue</li>
                    <li className="step step-primary">Admin Review & Assign Staff</li>
                    <li className="step step-primary">Staff Updates Progress</li>
                    <li className="step step-primary">Issue Resolved & Closed</li>
                </ul>
            </div>
        </section>
    );
};

export default HowItWorks;
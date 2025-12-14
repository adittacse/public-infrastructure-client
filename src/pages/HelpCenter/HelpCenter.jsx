// src/pages/HelpCenter.jsx

const faqs = [
    {
        q: "How many issues can I submit with a free account?",
        a: "With a free account you can submit up to 3 issues. After that, you need to upgrade to a premium plan to submit more issues.",
    },
    {
        q: "How do I become a premium user?",
        a: "Go to Dashboard → Profile page. If you are not premium, you will see a button to Subscribe for 1000৳. After successful payment, your account becomes premium and the limit is removed.",
    },
    {
        q: "What is 'Boost Issue' and why should I use it?",
        a: "Boost Issue is a paid feature that increases the priority of your issue. Admin and staff will see boosted issues at the top so they can take action faster.",
    },
    {
        q: "I am blocked. What does it mean?",
        a: "If you are blocked by admin, you cannot submit new issues, boost issues or interact with the system. Usually this happens for fake or abusive reports. You should contact the authority for more information.",
    },
    {
        q: "Can staff or admin edit my issue?",
        a: "Staff and admin can update the status (pending, in progress, working, resolved, closed, rejected) and add internal timeline logs. They usually do not edit your original description unless it’s required for clarity.",
    },
    {
        q: "How can I track the status of my issues?",
        a: "Go to Dashboard → My Issues. You will see the current status of each issue and whether any staff is assigned to it.",
    },
    {
        q: "Is my payment information stored in the system?",
        a: "The application stores basic payment information like amount, currency, transactionId, and payment type (subscription or boost). It does not store your full card details; those are handled securely by Stripe.",
    },
];

const HelpCenter = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">
                Help Center & FAQ
            </h1>
            <p className="text-center text-sm md:text-base text-gray-500 mb-8">
                Find answers to common questions about reporting issues, premium subscription and
                account status.
            </p>

            {/* quick help boxes */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="card bg-base-100 shadow border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base">New to this platform?</h2>
                        <p className="text-sm text-gray-600">
                            Create an account, log in as a citizen and start reporting local
                            infrastructure problems with photos and location.
                        </p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base">Premium & Boost</h2>
                        <p className="text-sm text-gray-600">
                            Upgrade to premium from your profile page and use boost to highlight
                            critical issues.
                        </p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base">Need more help?</h2>
                        <p className="text-sm text-gray-600">
                            If you face any technical problem, contact the support team of your
                            city authority.
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ list */}
            <div className="space-y-3">
                {faqs.map((item, idx) => (
                    <details
                        key={idx}
                        className="collapse collapse-arrow bg-base-100 border border-base-300"
                    >
                        <summary className="collapse-title text-sm md:text-base font-medium">
                            {item.q}
                        </summary>
                        <div className="collapse-content text-sm md:text-[15px] text-gray-700 leading-relaxed">
                            <p>{item.a}</p>
                        </div>
                    </details>
                ))}
            </div>

            {/* small footer note */}
            <div className="mt-10 text-xs text-gray-500 text-center">
                Still confused? Contact your local authority or system admin for more detailed help.
            </div>
        </div>
    );
};

export default HelpCenter;

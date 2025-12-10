import { Link } from "react-router";

const PaymentCancelled = () => {
    return (
        <div className="max-w-lg mx-auto mt-10 card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="text-2xl font-bold text-red-500 mb-2">
                    Payment Cancelled
                </h2>

                <p className="text-sm text-gray-700 mb-3">
                    Your payment was cancelled or did not complete successfully.
                </p>

                <p className="text-xs text-gray-500 mb-4">
                    If this was a mistake, you can try again. If money was deducted
                    from your account but you still see this message, please contact
                    support with your transaction details.
                </p>

                <div className="flex gap-2">
                    <Link to="/dashboard" className="btn btn-ghost btn-sm">
                        Back to Dashboard
                    </Link>
                    <Link to="/dashboard/profile" className="btn btn-primary btn-sm">
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;

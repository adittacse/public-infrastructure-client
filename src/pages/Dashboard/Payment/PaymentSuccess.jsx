import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const axiosSecure = useAxiosSecure();

    const [paymentInfo, setPaymentInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!sessionId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError("Missing session_id in URL");
            setLoading(false);
            return;
        }

        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then((res) => {
                    setPaymentInfo(res.data?.paymentInfo);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.response?.data?.message || error.message);
                })
        }
    }, [sessionId, axiosSecure]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="max-w-lg mx-auto mt-10 card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="text-xl font-bold text-red-500 mb-2">
                        Failed to load payment info
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {error}
                    </p>
                    <Link to="/dashboard" className="btn btn-primary btn-sm">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-10 card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="text-2xl font-bold text-green-600 text-center mb-2">
                    Payment Successful
                </h2>

                {/* Payment summary */}
                <p className="flex items-center text-sm text-gray-700 mb-1">
                    Amount:{" "}
                    <span className="font-semibold">
                        {paymentInfo?.currency?.toUpperCase()} {paymentInfo?.amount}
                    </span> <FaBangladeshiTakaSign />
                </p>
                <p className="text-xs text-gray-700 mb-1">
                    Paid by: <span className="font-semibold">{paymentInfo?.customerName} - ({paymentInfo?.customerEmail})</span>
                </p>

                <p className="text-xs text-gray-700 mb-3">
                    Your transaction Id: <span className="font-semibold">{paymentInfo?.transactionId}</span>
                </p>

                {
                    paymentInfo?.paymentType === "boost_issue" && <div className="mb-3">
                        <p className="text-sm">
                            Boosted issue:{" "}
                            <span className="font-semibold">
                                {paymentInfo?.issueTitle || "Unknown issue title"}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Your issue will now receive higher visibility and priority.
                        </p>
                    </div>
                }

                {
                    paymentInfo?.paymentType === "subscription" && (
                    <div className="mb-3">
                        <p className="text-sm font-semibold">
                            Premium Subscription Activated
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            You are now a premium citizen. You can submit unlimited issues.
                        </p>
                    </div>)
                }

                <div className="mt-4 flex gap-2">
                    <Link to="/dashboard" className="btn btn-primary btn-sm">
                        Go to Overview
                    </Link>
                    {
                        paymentInfo?.paymentType === "boost_issue" && (
                        <Link to="/dashboard/my-issues" className="btn btn-ghost btn-sm">
                            View My Issues
                        </Link>)
                    }
                    {
                        paymentInfo?.paymentType === "subscription" && (
                        <Link to="/dashboard/profile" className="btn btn-ghost btn-sm">
                            View Profile
                        </Link>)
                    }
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;

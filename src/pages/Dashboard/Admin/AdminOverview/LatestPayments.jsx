import Loading from "../../../../components/Loading/Loading.jsx";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const LatestPayments = ({ latestPayments }) => {
    if (!latestPayments) {
        return <Loading />;
    }

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="card-title">Latest Payments</h2>
                <div className="mt-2 space-y-2">
                    {
                        latestPayments.length === 0 &&
                            <p className="text-sm text-gray-500">
                                No recent payments.
                            </p>
                    }
                    {
                        latestPayments.map((payment) => <div key={payment._id} className="border rounded-md p-2 text-sm flex flex-col gap-1">
                            <div className="flex justify-between">
                                <span>
                                    {payment?.customerEmail}
                                </span>
                                <span className="font-semibold flex items-center">
                                    {payment?.amount} <FaBangladeshiTakaSign />
                                </span>
                            </div>

                            <div className="text-xs text-gray-500">
                                {payment?.paymentType || "payment"}
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default LatestPayments;
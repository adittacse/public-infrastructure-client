import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../../../hooks/useRole.jsx";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const Payments = () => {
    const [searchText, setSearchText] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: payments = [], isFetching } = useQuery({
        queryKey: ["admin-payments", searchText, paymentType],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/payments?searchText=${searchText}&paymentType=${paymentType}`);
            return res.data;
        }
    });

    const handleDownloadInvoice = (payment) => {
        navigate(`/dashboard/invoice/${payment._id}`);
    };

    if (!payments) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Payments</h1>

            {/* filter data */}
            <div className="flex flex-wrap gap-2 mb-5 items-center">
                <input
                    type="text"
                    placeholder="Filter by customer name / email"
                    className="input input-bordered"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <select
                    className="select select-bordered"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                >
                    <option value="">Payment Type (All)</option>
                    <option value="boost_issue">Boost Issue</option>
                    <option value="subscription">Subscription</option>
                </select>

                {
                    isFetching && <span className="text-xs text-gray-500">Filtering…</span>
                }
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Sl.</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Issue / Subscription</th>
                            <th>Date</th>
                            <th>Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            payments.length === 0 && <tr>
                                <td colSpan={7} className="text-center">
                                    No payments found.
                                </td>
                            </tr>
                        }

                        {
                            payments.map((payment, idx) => <tr key={payment._id}>
                                <td>{idx + 1}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src={payment?.customerImage}
                                                    alt={payment?.customerName} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{payment?.customerName}</div>
                                            <div className="text-sm opacity-50">{payment?.customerEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="flex items-center">
                                        {payment?.amount} <FaBangladeshiTakaSign />
                                    </span>
                                </td>
                                <td className="capitalize">
                                    {payment?.paymentType.split("_").join(" ")}
                                </td>
                                <td>
                                    {payment?.issueTitle || payment?.subscriptionLabel || "Profile"}
                                </td>
                                <td className="text-xs">
                                    {new Date(payment?.paidAt).toLocaleString()}
                                </td>
                                <td>
                                    <button onClick={() => handleDownloadInvoice(payment)} className="btn btn-xs btn-outline">
                                        Download
                                    </button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;

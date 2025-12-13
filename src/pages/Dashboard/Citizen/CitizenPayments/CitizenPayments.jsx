import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import InvoiceDocument from "../../../../components/Invoice/InvoiceDocument.jsx";

const CitizenPayments = () => {
    const [searchText, setSearchText] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { role } = useRole();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ["citizen-payments", user?.email, searchText, paymentType],
        enabled: role === "citizen",
        queryFn: async () => {
            const res = await axiosSecure.get(`/citizen/payments?email=${user.email}&searchText=${searchText}&paymentType=${paymentType}`);
            return res.data;
        },
    });

    if (!payments) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">My Payments</h1>

            {/* filter data */}
            <div className="flex flex-wrap gap-2 mb-5 items-center">
                <input
                    type="text"
                    placeholder="Filter by transaction id"
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
                    isLoading && <span className="text-xs text-gray-500">Filtering…</span>
                }
            </div>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Sl.</th>
                        <th>Paid At</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Issue / Subscription</th>
                        <th>Transaction</th>
                        <th>Invoice</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center">
                                No payments found.
                            </td>
                        </tr>
                    )}

                    {payments.map((payment, index) => (
                        <tr key={payment._id}>
                            <td>{index + 1}</td>
                            <td>
                                {new Date(payment?.paidAt).toLocaleString("en-BD", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                                })}
                            </td>
                            <td>
                                {payment?.amount} {payment?.currency?.toUpperCase()}
                            </td>
                            <td className="capitalize">
                                {payment?.paymentType?.split("_").join(" ")}
                            </td>
                            <td>
                                {payment?.issueTitle || "Profile"}
                            </td>
                            <td>{payment?.transactionId}</td>
                            <td>
                                <PDFDownloadLink
                                    document={<InvoiceDocument payment={payment} user={user} />}
                                    fileName={`invoice-${payment._id}.pdf`}
                                >
                                    {
                                        ({ loading }) => (
                                            <button className="btn btn-sm btn-primary">
                                                {loading ? "Generating..." : "Download"}
                                            </button>
                                        )
                                    }
                                </PDFDownloadLink>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CitizenPayments;

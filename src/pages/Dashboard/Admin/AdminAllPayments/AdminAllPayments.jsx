import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useRole from "../../../../hooks/useRole.jsx";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar.jsx";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import InvoiceDocument from "../../../../components/Invoice/InvoiceDocument.jsx";

const AdminAllPayments = () => {
    const [searchText, setSearchText] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading, isFetching } = useQuery({
        queryKey: ["admin-payments", searchText, paymentType],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/payments?searchText=${searchText}&paymentType=${paymentType}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">All Payments</h1>

            {/* filter data */}
            <div className="flex flex-wrap gap-2 mb-5 items-center">
                <input
                    type="text"
                    placeholder="Filter by name / email / transaction id"
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
                            <th>Type & Amount</th>
                            <th>Issue / Subscription</th>
                            <th>Date</th>
                            <th>Transaction Id</th>
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
                                                <UserAvatar photoURL={payment?.customerImage} name={payment?.customerName} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{payment?.customerName}</div>
                                            <div className="text-sm opacity-50">{payment?.customerEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p className="capitalize">{payment?.paymentType.split("_").join(" ")}</p>
                                    <p className="flex items-center">{payment?.amount} <FaBangladeshiTakaSign /></p>
                                </td>
                                <td>
                                    {payment?.issueTitle || "Profile"}
                                </td>
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
                                <td>{payment?.transactionId}</td>
                                <td>
                                    <PDFDownloadLink
                                        document={<InvoiceDocument payment={payment} />}
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
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAllPayments;

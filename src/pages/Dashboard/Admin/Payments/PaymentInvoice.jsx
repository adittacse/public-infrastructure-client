import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const PaymentInvoice = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let objectUrl;

        const fetchInvoice = async () => {
            try {
                setLoading(true);
                setError("");

                await axiosSecure.get(`/admin/payments/${id}/invoice`, {
                    responseType: "blob"
                })
                    .then((res) => {
                        // Blob → object URL
                        const blob = new Blob([res?.data], {
                            type: "application/pdf",
                        });
                        objectUrl = URL.createObjectURL(blob);
                        setPdfUrl(objectUrl);
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error?.message}`
                        });
                    });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load invoice PDF");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();

        // cleanup: prevent memory leak
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [id, axiosSecure]);

    if (error) {
        return (
            <div className="max-w-3xl mx-auto mt-10">
                <div className="card bg-base-100 shadow p-8 text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-2">
                        Failed to load invoice
                    </h2>
                    <p className="mb-4 text-sm text-gray-600">{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-5xl mx-auto mt-6">
            <h1 className="text-2xl font-bold mb-5">Payment Invoice</h1>

            <button className="btn btn-primary mb-5" onClick={() => navigate("/dashboard/payments")}>
                Back to Payments
            </button>

            <div>
                {
                    pdfUrl ? <>
                        <div className="w-full h-[80vh] border rounded-lg overflow-hidden">
                            {/* show pdf here */}
                            <iframe src={pdfUrl} title="Invoice PDF" className="w-full h-full" />
                        </div>
                    </> : <>
                        <p className="text-center text-gray-600">
                            No invoice available.
                        </p>
                    </>
                }
            </div>
        </div>
    );
};

export default PaymentInvoice;

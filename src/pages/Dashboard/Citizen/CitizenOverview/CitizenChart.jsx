import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from "recharts";

const CitizenChart = ({ statusChartData, paymentsChartData }) => {
    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* status distribution chart */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title text-sm md:text-base">Issue Status Overview</h2>
                    <div className="w-full h-64 min-w-0">
                        <BarChart className="w-full h-full max-w-full max-h-full"
                                  style={{ aspectRatio: 1.618 }}
                                  responsive
                                  data={statusChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" />
                        </BarChart>
                    </div>
                </div>
            </div>

            {/* payments over time chart */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title text-sm md:text-base">Payments Over Time</h2>
                    {
                        paymentsChartData.length === 0 ? <>
                            <p className="text-sm text-gray-500">
                                No payments yet.
                            </p>
                        </>: <>
                            <div className="w-full h-64 min-w-0">
                                <LineChart className="w-full h-full max-w-full max-h-full"
                                           style={{ aspectRatio: 1.618 }}
                                           responsive
                                           data={paymentsChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" />
                                </LineChart>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default CitizenChart;
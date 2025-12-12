import { BarChart, Bar, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const StaffChart = ({ statusChartData }) => {
    return (
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
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default StaffChart;
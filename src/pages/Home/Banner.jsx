import { useNavigate } from "react-router";

const Banner = () => {
    const navigate = useNavigate();

    return (
        <section className="hero min-h-[60vh] bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img src="https://i.ibb.co.com/0RKC7j99/city.avif" className="w-md rounded-lg shadow-2xl" alt="city" />
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Report Public Issues &amp; Track Resolutions
                    </h1>
                    <p className="py-4 text-gray-600">
                        Broken streetlights, potholes, water leakage, garbage overflow – report them in minutes and see how your city responds.
                    </p>
                    <button onClick={() => navigate("/dashboard/report-issue")} className="btn btn-primary">
                        Report an Issue
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Banner;
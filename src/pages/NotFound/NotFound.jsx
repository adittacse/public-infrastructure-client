import { Link, useLocation, useNavigate } from "react-router";

const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const path = location?.pathname || "";

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
                <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                    {/* top banner */}
                    <div className="bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100/70 border border-base-300 text-sm">
                                    <span className="badge badge-primary badge-sm" />
                                    Route not found
                                </div>

                                <h1 className="mt-4 text-5xl md:text-6xl font-extrabold tracking-tight">
                                    404
                                </h1>
                                <p className="mt-2 text-lg md:text-xl text-base-content/70">
                                    Oops! The page you’re looking for doesn’t exist.
                                </p>

                                {
                                    path && <p className="mt-3 text-sm text-base-content/60">
                                        You tried to visit:{" "}
                                        <span className="font-mono bg-base-200 px-2 py-1 rounded">
                                          {path}
                                        </span>
                                    </p>
                                }
                            </div>

                            {/* illustration */}
                            <div className="w-full md:w-auto">
                                <div className="rounded-2xl bg-base-100/70 border border-base-300 p-5">
                                    <svg
                                        width="180"
                                        height="140"
                                        viewBox="0 0 240 180"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mx-auto"
                                    >
                                        <path
                                            d="M30 150C60 90 85 75 120 75C155 75 180 90 210 150"
                                            stroke="currentColor"
                                            strokeOpacity="0.25"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                        />
                                        <circle
                                            cx="90"
                                            cy="95"
                                            r="14"
                                            fill="currentColor"
                                            fillOpacity="0.2"
                                        />
                                        <circle
                                            cx="150"
                                            cy="95"
                                            r="14"
                                            fill="currentColor"
                                            fillOpacity="0.2"
                                        />
                                        <path
                                            d="M110 120C116 126 124 126 130 120"
                                            stroke="currentColor"
                                            strokeOpacity="0.35"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M60 40H180"
                                            stroke="currentColor"
                                            strokeOpacity="0.2"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M80 20H160"
                                            stroke="currentColor"
                                            strokeOpacity="0.18"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <p className="text-center text-xs text-base-content/60 mt-2">
                                        Looks like we hit a dead end.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* body */}
                    <div className="flex flex-wrap justify-center gap-3 mt-5">
                        <Link to="/" className="btn btn-primary">
                            Go Home
                        </Link>

                        <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
                            Go Back
                        </button>
                    </div>

                    <div className="divider"></div>

                    {/* footer */}
                    <div className="bg-base-100 text-center mb-5">
                        <p className="text-xs text-base-content/50">
                            © {new Date().getFullYear()} — Public Infrastructure Issue Reporting System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

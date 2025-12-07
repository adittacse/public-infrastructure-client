import { Link } from "react-router";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="mb-4 text-gray-600">
                The page you are looking for does not exist.
            </p>
            <Link to="/" className="btn btn-primary">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;

import { Link } from "react-router";
import { FaMapMarkerAlt, FaThumbsUp } from "react-icons/fa";

const IssueCard = ({ issue, onUpvote }) => {
    const { _id, title, image, category, status, priority, location, upvoteCount } = issue;

    return (
        <div className="card bg-base-100 shadow-md border">
            {
                image && <figure className="h-44 overflow-hidden">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </figure>
            }
            <div className="card-body">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="badge badge-outline">{category}</div>
                    <div className="flex gap-2">
                        <span
                            className={`badge ${status === "pending" ? "badge-warning" : 
                                    status === "resolved" ? "badge-success" : "badge-info"}`}>
                            {status}
                        </span>
                        <span
                            className={`badge ${priority === "high" ? "badge-error" : "badge-ghost"}`}>
                            {
                                priority === "high" ? "High" : "Normal"
                            }
                        </span>
                    </div>
                </div>

                <h2 className="card-title text-lg">{title}</h2>

                {
                    location && <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt /> {location}
                    </p>
                }

                <div className="card-actions justify-between items-center mt-3">
                    <button onClick={() => onUpvote && onUpvote(_id)} className="btn btn-ghost btn-sm gap-2">
                        <FaThumbsUp /> {upvoteCount || 0}
                    </button>

                    <Link to={`/issues/${_id}`} className="btn btn-primary btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
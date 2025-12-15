import useSafePhotoURL from "../../hooks/useSafePhotoURL.js";

const FALLBACK_AVATAR = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const UserAvatar = ({ photoURL, name, w, h, radius, border }) => {
    const safeUrl = useSafePhotoURL(photoURL, FALLBACK_AVATAR);
    const widthClass = w || "w-12";
    const heightClass = h || "h-12";
    const radiusClass = radius || "mask mask-squircle";
    const borderClass = border || "";

    return (
        <div className="avatar">
            <div className={`${radiusClass} ${widthClass} ${heightClass} ${borderClass}`}>
                <img
                    src={safeUrl}
                    alt={name || "User"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                />
            </div>
        </div>
    );
};

export default UserAvatar;

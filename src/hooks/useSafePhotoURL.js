import { useState, useEffect } from "react";

const useSafePhotoURL = (photoURL, fallback) => {
    const [safeURL, setSafeURL] = useState(fallback);

    useEffect(() => {
        if (!photoURL || typeof photoURL !== "string") {
            setSafeURL(fallback);
            return;
        }

        try {
            if (photoURL.includes("googleusercontent.com")) {
                const url = new URL(photoURL);

                if (!url.searchParams.get("sz")) {
                    url.searchParams.set("sz", "200");
                }

                setSafeURL(url.toString());
                return;
            }

            setSafeURL(photoURL);
        } catch (error) {
            setSafeURL(fallback);
        }
    }, [photoURL, fallback]);

    return safeURL;
};

export default useSafePhotoURL;

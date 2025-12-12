import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure.jsx";
import useAuth from "./useAuth.jsx";

const useProfileUpdate = ({ role, profile, refetch, reset }) => {
    const [imageError, setImageError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user, updateUserProfile, setLoading } = useAuth();

    const handleUpdateProfile = async (data) => {
        await updateUserProfile(user, {
            displayName: data.displayName,
            photoURL: data?.photoURL
        })
            .then(async () => {
                await axiosSecure.patch(`/${role}/profile/${profile._id}`, data)
                    .then(async (res) => {
                        if (res.data.modifiedCount) {
                            await refetch();
                            if (reset) {
                                reset();
                            }
                            setLoading(false);
                            await Swal.fire({
                                icon: "success",
                                title: "Profile updated",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error?.message}`
                        });
                    });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error?.message}`
                });
            });
    };

    const onSubmit = async (data) => {
        setImageError("");
        setIsSubmitting(true);

        try {
            const imageFile = data?.photoURL?.[0];

            const updatedProfile = {
                displayName: data.displayName,
            };

            if (imageFile) {
                if (!imageFile.type.startsWith("image/")) {
                    setImageError("Only image files are allowed");
                    setIsSubmitting(false);
                    return;
                }

                const formData = new FormData();
                formData.append("image", imageFile);

                const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`, formData);
                updatedProfile.photoURL = res.data.data.url;
            }

            await handleUpdateProfile(updatedProfile);
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error?.response?.data?.message || error?.message}`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        onSubmit,
        imageError,
        setImageError,
        isSubmitting
    };
};

export default useProfileUpdate;

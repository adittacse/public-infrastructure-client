import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../../../hooks/useAuth.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import axios from "axios";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const ReportIssue = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const { isBlocked } = useRole();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    // load categories from database
    const { data: categories = [], isLoading: categoryLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axiosSecure.get("/categories");
            return res.data;
        },
    });

    // submit issue
    const handleSubmitIssue = async (data) => {
        setIsSubmitting(true);

        axiosSecure.get(`/issues/${user?.email}/limit`)
            .then((res) => {
                if (res.data?.allowPosting) {
                    const imageFile = data.image[0];
                    if (!imageFile || !imageFile.type.startsWith("image/")) {
                        return;
                    }

                    // 1. store the image in form data
                    const formData = new FormData();
                    formData.append("image", imageFile);

                    axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`, formData)
                        .then(async (res) => {
                            const photoURL = res.data.data.url;

                            const newIssue = {
                                title: data.title,
                                description: data.description,
                                category: data.category,
                                image: photoURL,
                                location: data.location,
                            };

                            await axiosSecure.post("/issues", newIssue)
                                .then((res) => {
                                    if (res.data.insertedId) {
                                        setIsSubmitting(false);
                                        Swal.fire({
                                            icon: "success",
                                            title: "Issue reported",
                                            text: "Your issue has been submitted.",
                                            timer: 1500,
                                            showConfirmButton: false,
                                        });
                                        reset();
                                        navigate("/dashboard/my-issues");
                                    }
                                })
                                .catch((error) => {
                                    setIsSubmitting(false);
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: `${error.message}`
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
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                if (error?.response?.data?.message) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${error?.response?.data?.message}`
                    });
                    navigate("/dashboard/profile", { replace: true });
                }
            });
    };

    if (!user || categoryLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-5">Report a New Issue</h1>

            {
                isBlocked && (
                    <div className="rounded bg-red-50 text-red-700 text-center text-xs md:text-sm mb-5 p-3">
                        You are currently <span className="font-semibold">blocked</span> by
                        the authorities. You cannot submit or boost issues.
                        Please contact the relevant authority for further assistance.
                    </div>
                )
            }

            <form onSubmit={handleSubmit(handleSubmitIssue)} className="grid gap-4 md:grid-cols-2">
                {/* issue title */}
                <div className="md:col-span-2">
                    <label className="label">
                        <span className="label-text">Issue Title</span>
                    </label>
                    <input
                        {...register("title", { required: true })}
                        className="input input-bordered w-full"
                    />
                    {
                        errors.title && <p className="text-red-500 text-sm">
                            Title is required
                        </p>
                    }
                </div>

                {/* description */}
                <div className="md:col-span-2">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        {...register("description", { required: true })}
                        className="textarea textarea-bordered w-full"
                        rows={4}
                    ></textarea>
                    {
                        errors.description && <p className="text-red-500 text-sm">
                            Description is required
                        </p>
                    }
                </div>

                {/* category */}
                <div>
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <select
                        {...register("category", { required: true })}
                        defaultValue=""
                        className="select select-bordered w-full"
                    >
                        <option value="" disabled>Select Category</option>
                        {
                            categories.map((category) => (
                            <option key={category._id} value={category?.categoryName}>
                                {category?.categoryName}
                            </option>))
                        }
                    </select>
                    {
                        errors.category && <p className="text-red-500 text-sm">
                            Category is required
                        </p>
                    }
                </div>

                {/* location */}
                <div>
                    <label className="label">
                        <span className="label-text">Location</span>
                    </label>
                    <input
                        {...register("location", { required: true })}
                        className="input input-bordered w-full"
                    />
                    {
                        errors.location && <p className="text-red-500 text-sm">
                            Location is required
                        </p>
                    }
                </div>

                {/* image file */}
                <div>
                    <label className="label">Image</label>
                    <input {...register("image", {required: "Image is Required", validate: {
                            isImage: (files) => {
                                const file = files && files[0];
                                return file && file.type.startsWith("image/") || "Only image files are allowed"
                            }
                        }})} type="file" className="file-input w-full" />
                    {
                        errors.image && <p className="text-red-500 font-medium">
                            {errors.image.message}
                        </p>
                    }
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting || isBlocked}>
                        {
                            isSubmitting ? "Submitting..." : "Submit Issue"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportIssue;

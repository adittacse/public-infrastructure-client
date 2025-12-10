import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useRole from "../../../../hooks/useRole";
import Loading from "../../../../components/Loading/Loading";
import Swal from "sweetalert2";

const ManageCategories = () => {
    const [selectedCategory, setSelectedCategory] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();

    // add form useForm
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    // update form useForm
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors }
    } = useForm();

    const { data: categories = [], isLoading, refetch } = useQuery({
        queryKey: ["categories"],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get("/categories");
            return res.data;
        },
    });

    // Create category
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        axiosSecure.post("/categories", data)
            .then((res) => {
                if (res.data.insertedId) {
                    reset();
                    refetch();
                    setIsSubmitting(false);
                    Swal.fire({
                        icon: "success",
                        title: "Category added",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                });
            });
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        resetEdit({
            categoryName: category?.categoryName
        });
        setIsEditOpen(true);
    }

    // update category
    const handleUpdateCategory = async (data) => {
        setIsUpdating(true);
        const name = {
            categoryName: data.name
        };

        axiosSecure.patch(`/categories/${selectedCategory._id}`, name)
            .then((res) => {
                if (res.data.modifiedCount) {
                    refetch();
                    setIsEditOpen(false);
                    setIsUpdating(false);
                    Swal.fire({
                        icon: "success",
                        title: "Updated",
                        timer: 1200,
                        showConfirmButton: false,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                });
            });
    }

    // Delete category
    const handleDelete = (category) => {
        Swal.fire({
            title: `Delete ${category.categoryName} category?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/categories/${category._id}`)
                    .then((res) => {
                        if (res.data.deletedCount) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Category has been deleted.",
                                icon: "success"
                            });
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error.message}`
                        });
                    });
            }
        });
    }

    if (isLoading) return <Loading />;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Manage Categories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10">

                {/* add category */}
                <div className="mb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-2xl flex gap-2 py-6">
                        <h2 className="text-xl font-semibold text-center mb-2">Add New Category</h2>
                        <fieldset className="fieldset card-body space-y-1">
                            <label className="label mb-1">
                                <span className="label-text">Category Name</span>
                            </label>
                            <input {...register("categoryName", { required: true })} type="text" placeholder="Type category name"
                                   className="input input-bordered w-full" />
                            {errors.categoryName?.type === "required" &&
                                <p className="text-red-500 font-medium">Category Name is Required</p>}

                            <button type="submit" className="btn btn-primary mt-1" disabled={isSubmitting}>
                                {
                                    isSubmitting ? "Adding..." : "Add Category"
                                }
                            </button>
                        </fieldset>
                    </form>
                </div>

                {/* table */}
                <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                    <h2 className="text-xl font-semibold text-center my-5">Category List</h2>
                    <table className="table table-zebra ">
                        <thead>
                            <tr>
                                <th>Sl.</th>
                                <th>Category Name</th>
                                <th>Total Issues</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                categories.length === 0 && <tr>
                                    <td colSpan={3} className="text-center">
                                        No categories found.
                                    </td>
                                </tr>
                            }
                            {
                                categories.map((category, index) => <tr key={category._id}>
                                    <td>{index + 1}</td>
                                    <td>{category?.categoryName}</td>
                                    <td>{category?.issuesCount}</td>
                                    <td className="flex gap-2">
                                        <button className="btn btn-xs btn-info" onClick={() => openEditModal(category)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-xs btn-error" onClick={() => handleDelete(category)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <dialog className="modal" open={isEditOpen}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">
                        Edit {selectedCategory?.categoryName} Category
                    </h3>

                    <form onSubmit={handleSubmitEdit(handleUpdateCategory)} className="space-y-3">
                        <fieldset className="fieldset">
                            <label className="label">
                                <span className="label-text mb-1">Name</span>
                            </label>
                            <input {...registerEdit("name", { required: true })} defaultValue={selectedCategory?.categoryName} className="input input-bordered w-full" />
                            {editErrors.name?.type === "required" &&
                                <p className="text-red-500 font-medium">Category Name is Required</p>}
                        </fieldset>

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => {
                                    resetEdit();
                                    setIsEditOpen(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                                {
                                    isUpdating ? "Updating..." : "Update Category Name"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ManageCategories;

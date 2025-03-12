import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => { 
    const queryClient = useQueryClient();

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await axios.put(`/api/user/update`, formData);
                if (!res.data) throw new Error("Something went wrong!");
                return res.data;
            } catch (error) {
                // Handle Axios error and return response data for Zod validation errors
                if (axios.isAxiosError(error) && error.response?.data?.errors) {
                    throw error.response.data.errors; // Throw validation errors for onError handling
                }
                throw new Error(error.response?.data?.message || "An unexpected error occurred.");
            }
        },
        onSuccess: () => {
            toast.success("Profile updated successfully!");
            Promise.all([
                queryClient.invalidateQueries(["authProfile"]),
                queryClient.invalidateQueries(["userProfile"]),
            ]);
        },
        onError: (errors) => {
            if (Array.isArray(errors) && errors.length > 0) {
                toast.error(errors[0].message); // Show only the first validation error
            } else {
                toast.error(errors || "Failed to update profile.");
            }
        },
    });

    return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile; // ✅ Move 'export default' here

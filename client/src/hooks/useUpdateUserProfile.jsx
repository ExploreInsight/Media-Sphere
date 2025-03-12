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
                if (axios.isAxiosError(error)) {
                    const errors = error.response?.data?.errors; 
                    if (Array.isArray(errors) && errors.length > 0) {
                        throw errors; // Throw validation errors as an array
                    }
                    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
                }
                throw new Error("Something went wrong!");
            }
        },
        onSuccess: async () => {
            toast.success("Profile updated successfully!");
            await Promise.all([
                queryClient.invalidateQueries(["authProfile"]),
                queryClient.invalidateQueries(["userProfile"]),
            ]);
        },
        onError: (errors) => {
            if (Array.isArray(errors) && errors.length > 0) {
                toast.error(errors[0]?.message || "Validation failed.");
            } else {
                toast.error(errors?.message || "Failed to update profile.");
            }
        },
    });

    return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;

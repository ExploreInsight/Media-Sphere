import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React from 'react'
import toast from 'react-hot-toast';

const useFollow = () => {
 
    const queryClient = useQueryClient();

    const {mutate:follow, isPending , error} = useMutation({
    mutationFn: async (userId) =>{
        try {
            const res = await axios.post(`/api/user/follow/${userId}`);
            if(!res.data){
                throw new Error("Something went wrong!");
            }
            return res.data
        } catch (error) {
            throw new Error(error);      
        }
    },
    onSuccess: () =>{
        toast.success(`User followed successfully`);

        // invalidate the cache to refetch the followed user 
        Promise.all([
            queryClient.invalidateQueries(['suggestedUsers']),
         queryClient.invalidateQueries(['authProfile'])
        ])
    },
    onError : (error) =>{
        toast.error(error.message);
    }
    });

    return {follow, isPending};
}

export default useFollow
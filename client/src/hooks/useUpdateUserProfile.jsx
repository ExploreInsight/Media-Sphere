import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
      const {mutateAsync:updateProfile , isPending:isUpdatingProfile} = useMutation({
            mutationFn: async (formData)=>{
                try {
                    const res = await axios.put(`/api/user/update`,{formData});
                    if(!res.data) throw new Error(" Something went Wrong!");
                    return res.data
                    
                } catch (error) {
                    throw new Error(error);
                    
                }
            },
            onSuccess:()=>{
                toast.success("Profile updated successfully!");
                Promise.all([
                    queryClient.invalidateQueries(['authProfile']),
                    queryClient.invalidateQueries(['userProfile'])
                ])
            },
            onError: (error) =>{
                toast.error(error.message);
            }
         });
         return {updateProfile,isUpdatingProfile}
 
}

export default useUpdateUserProfile
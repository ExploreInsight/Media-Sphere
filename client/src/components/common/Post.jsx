import { FaRegComment, FaRegHeart, FaTrash, FaRegBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { Link } from "react-router-dom";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { useState } from "react";
import useAuthUser from "../../hooks/useAuthUser.js";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner.jsx";
import axios from "axios";

const Post = ({ post }) => {
 
  const [comment , setComment] = useState('');
  const {data: authUser} = useAuthUser();
  const queryClient  = useQueryClient();

  const {mutate:deletePost , isPending} = useMutation({
    mutationFn: async () =>{
      try {
        const res = await axios.delete(`/api/post/${post._id}`);
        if(!res.data){
          throw new Error("Something went wrong!")
        }
        return res.data
      } catch (error) {
        throw new Error("Something went wrong! Please try again.")
      }
    },
    onSuccess:()=>{
      toast.success("Post Deleted Successfully!");

      // invalidate the cache to refetch the post after successful deletion 
      queryClient.invalidateQueries(['posts']);
    }
  })


  const isMyPost = authUser.user._id === post.user._id; 

  const formattedDate = '1h'; 
  const isLiked = false;
  const isCommenting = false;

  
  const handleDeletePost = () =>{
    deletePost();
  };
  const handlePostComment = (e) =>{e.preventDefault();};
  const handleLikePost = () => {};

  return (
    <div className='flex gap-2 items-start p-4 border-b border-gray-900'>
      <div className='avatar'>
        <Link to={`/profile/${post.user.username}`} className='w-8 rounded-full overflow-hidden'>
          <img src={post.user.profileImg || "/avatar-placeholder.png"} alt="profile" />
        </Link>
      </div>
      <div className='flex flex-col flex-1'>
        <div className='flex gap-2 items-center'>
          <Link to={`/profile/${post.user.username}`} className='font-bold'>
            {post.user.fullName}
          </Link>
          <span className='text-gray-700 flex gap-1 text-sm'>
            <Link to={`/profile/${post.user.username}`}>@{post.user.username}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className='flex justify-end flex-1'>
              {!isPending && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />}
              {isPending && <LoadingSpinner size="sm" />}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-3 overflow-hidden'>
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className='h-80 object-contain rounded-lg border border-gray-700'
              alt='post content'
            />
          )}
        </div>
        <div className='flex justify-between mt-3'>
          <div className='flex gap-4 items-center w-2/3 justify-between'>
            <div className='flex gap-1 items-center cursor-pointer group'>
              <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
              <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                {post.comments.length}
              </span>
            </div>
            
            <div className='flex gap-1 items-center group cursor-pointer'>
              <BiRepost className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
              <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
            </div>
            
            <div className='flex gap-1 items-center group cursor-pointer'>
              <FaRegHeart className={`w-4 h-4 ${isLiked ? 'text-pink-600' : 'text-slate-500'} group-hover:text-pink-600`} />
              <span className={`text-sm ${isLiked ? 'text-pink-600' : 'text-slate-500'} group-hover:text-pink-600`}>
                {post.likes.length}
              </span>
            </div>
          </div>
          
          <div className='flex w-1/3 justify-end gap-2 items-center'>
            <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
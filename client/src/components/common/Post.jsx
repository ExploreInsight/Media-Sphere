import {
  FaRegComment,
  FaRegHeart,
  FaTrash,
  FaRegBookmark,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAuthUser from "../../hooks/useAuthUser.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import { formatPostDate } from "../../utilis/date/date.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useAuthUser();

  const isMyPost = authUser.user._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);
  // const isLiked = post?.likes?.includes(authUser.user._id);
  const isLiked =
    Array.isArray(post?.likes) && post.likes.includes(authUser.user._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete(`/api/post/${post._id}`);
        if (!res.data) {
          throw new Error("Something went wrong!");
        }
        return res.data;
      } catch (error) {
        throw new Error("Something went wrong! Please try again.");
      }
    },
    onSuccess: () => {
      toast.success("Post Deleted Successfully!");

      // invalidate the cache to refetch the post after successful deletion
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const { mutate: likePost, isLoading: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.put(`/api/post/like/${post._id}`);

        if (!res.data) throw new Error("Something went wrong!");
        return res.data;
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Something went wrong!";
        throw new Error(errorMsg);
      }
    },
    onSuccess: (updatedLikes) => {
      // didn't use invalidate query as it refetch the cahce and its not best for the UI experience
      // as user just need a way to like in which only the likes update not the whole page
      // queryClient.invalidateQueries(['posts'])  //this is not very good way here
      // instead of invalidating the whole cache we can update the cache manually
      queryClient.setQueryData(["posts"], (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map((p) => {
         if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isLoading: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/post/comment/${post._id}`, {
          text: comment,
        });

        if (!res.data) throw new Error("Something went wrong!");

        return res.data;
      } catch (error) {
        throw new Error(
          error?.response?.data?.message || "Something went wrong!"
        );
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment(""); // clear the comment the box after commenting
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return; // if already liked then return i.e stop the excection of the function ,yeah no need like again
    likePost();
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-900">
      <div className="avatar">
        <div className="w-8 rounded-full overflow-hidden">
          <Link to={`/profile/${post.user.username}`}>
            <img
              src={post.user.profileImg || "/avatar-placeholder.png"}
              alt="profile"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${post.user.username}`} className="font-bold">
            {post.user.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${post.user.username}`}>
              @{post.user.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting && (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              )}
              {isDeleting && <LoadingSpinner size="sm" />}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt="post content"
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            {/* comments modal  */}
            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImg ||
                              "/avatar-placeholder.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">
                            {comment.user.fullName}
                          </span>
                          <span className="text-gray-700 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>

            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">
                0
              </span>
            </div>

            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleLikePost}
            >
              {isLiking && <LoadingSpinner size="sm" />}
              {!isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
              )}
              {isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
              )}
              <span
                className={`text-sm ${
                  isLiked ? "text-pink-600" : "text-slate-500"
                } group-hover:text-pink-600`}
              >
                {post.likes.length}
              </span>
            </div>
          </div>

          <div className="flex w-1/3 justify-end gap-2 items-center">
            <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

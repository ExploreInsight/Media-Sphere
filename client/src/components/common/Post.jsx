import { FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { POSTS } from "../../utilis/db/dummy.js";

const Post = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      {POSTS.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-slate-900 text-white p-4 rounded-lg mb-4 shadow-md">
      <div className="flex items-center gap-3">
        <img src={post.user.profileImg} alt="avatar" className="w-10 h-10 rounded-full" />
        <div>
          <Link to={`/profile/${post.user.username}`} className="font-bold">
            {post.user.fullName}
          </Link>
          <p className="text-gray-400 text-sm">@{post.user.username}</p>
        </div>
      </div>
      <p className="mt-3">{post.text}</p>
      {post.img && <img src={post.img} alt="post" className="mt-3 w-full rounded-lg" />}

      <div className="flex justify-between items-center mt-3 text-gray-400">
        <button onClick={handleLike} className="flex items-center gap-1">
          <FaRegHeart className={isLiked ? "text-red-500" : "text-gray-400"} />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-1">
          <FaRegComment />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-red-600">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default Post;

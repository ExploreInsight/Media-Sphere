import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import {POSTS} from "../../utilis/db/dummy.js";
import {useQuery} from "@tanstack/react-query"
import axios from 'axios';
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
  
//   const posts = POSTS;
//   const isLoading = false;
//  const isRefetching = false;
const getPostApi = () => {
  switch (feedType) {
    case "forYou":
      return "/api/post/all";
    case "following":
      return "/api/post/following";
    default:
      return "/api/post/all"; 
  }
};
 const post_API = getPostApi();  

  const {data:posts , isLoading , isRefetching , refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await axios.get(post_API);
        if(!res.data){
          throw new Error("Something went Wrong!")
        }
        return res.data
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Something went wrong! Please try again.");
      }
    }
  })
 
  useEffect(()=>{
    refetch();
  },[feedType,refetch])

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;

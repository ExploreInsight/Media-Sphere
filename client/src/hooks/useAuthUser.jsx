import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAuthUser = () => {
  return useQuery({
    queryKey: ["authProfile"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });

        return res.data || null;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to get data");
      }
    },
    retry: false,
  });
};

export default useAuthUser;

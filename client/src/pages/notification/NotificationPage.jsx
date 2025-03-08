import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaUser, FaHeart, FaTrash } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const NotificationPage = () => {
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notification"],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/notification");
                if (!res.data) throw new Error("No notifications found");
                return res.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || "An error occurred");
            }
        },
    });

    console.log("notifications", notifications);

    const { mutate: deleteNotification } = useMutation({
        mutationFn: async () => {
            try {
                const res = await axios.delete(`/api/notification/delete`);
                if (!res.data) throw new Error("Something went wrong!");
                return res.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || "An error occurred");
            }
        },
        onSuccess: () => {
            toast.success("Notification deleted successfully");
            queryClient.invalidateQueries(["notification"]);
        },
        onError: (error) => {
			toast.error(error.message);
		},
    });

    return (
        <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center font-bold">
                <span>Notifications</span>
                <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="m-1 ">
                    <IoSettingsOutline className='w-4' />
                    </button>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li> 
                        <a onClick={deleteNotification}> Delete all Notifications</a>
                      </li>
                    </ul>
                </div>
            </div>
            {isLoading && (
                <div className="flex justify-center h-full items-center">
                    <LoadingSpinner size="lg" />
                </div>
            )}
            {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
            {Array.isArray(notifications) &&
                notifications.map((notification) => (
                    <div className=" flex justify-between border-b border-gray-700 p-4" key={notification._id}>
                        <div className="flex gap-2 items-center">
                            {notification.type === "follow" && <FaUser className="w-7 h-7 text-primary" />}
                            {notification.type === "like" && <FaHeart className="w-7 h-7 text-red-500" />}
                            <Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
                          
                        </div>
                      <span className="btn btn-sm rounded-xl hover:text-red-600">   <FaTrash> {notification}</FaTrash></span>
                    </div>
                ))}
        </div>
    );
};

export default NotificationPage;

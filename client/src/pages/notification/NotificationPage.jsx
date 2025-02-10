import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaUser, FaHeart, FaTrash} from "react-icons/fa";

const NotificationPage = () => {
    const isLoading = false;
    const notifications = [
        { _id: 1, type: "follow", from: { username: "john_doe", profileImg: "/avatar-placeholder.png" } },
        { _id: 2, type: "like", from: { username: "jane_doe", profileImg: "/avatar-placeholder.png" } },
    ];

    const deleteNotification = (id) => {
        // Logic to delete a notification by id goes here
    };

    return (
        <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
            <div className='p-4 border-b border-gray-700 flex justify-between items-center font-bold'>
                <span>Notifications</span>
                <div className='dropdown dropdown-end'>
                    <button tabIndex={0} className='btn btn-sm border-gray-700 rounded-xl hover:text-red-600'>
                    <FaTrash />
                    </button>
                    <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'>
                        {notifications.map((notification) => (
                            <li key={notification._id}>
                                <button onClick={() => deleteNotification(notification._id)}>
                                    <FaTrash /> Delete @{notification.from.username}'s Notification
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {isLoading && (
                <div className='flex justify-center h-full items-center'>
                    <LoadingSpinner size='lg' />
                </div>
            )}
            {notifications?.map((notification) => (
                <div className='border-b border-gray-700 p-4' key={notification._id}>
                    <div className='flex gap-2 items-center'>
                        <img
                            src={notification.from.profileImg}
                            alt='Profile'
                            className='w-10 h-10 rounded-full'
                        />
                        {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
                        {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                        <span className='font-bold'>@{notification.from.username}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationPage;

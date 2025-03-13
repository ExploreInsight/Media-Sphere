import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (userId, setNotifications) => {
  useEffect(() => {
    const socket = io("http://localhost:4050");

    socket.emit("join", userId);

    socket.on("notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => socket.disconnect();
  }, [userId, setNotifications]);
};

export default useSocket;

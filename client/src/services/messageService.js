import axios from "axios";

const API_URL = "https://chatapplication-z7kn.onrender.com/api/messages";

// get messages between logged-in user & selected user
export const getMessages = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// send message
export const sendMessage = async (receiverId, text) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    { receiverId, text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const clearChat = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `https://chatapplication-z7kn.onrender.com/api/messages/clear/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

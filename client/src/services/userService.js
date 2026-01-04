import axios from "axios";
const API_URL = "http://localhost:5000/api/users";

// ethun apan sagle user fetch karnar ahot
export const getUsers = async()=>{
    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const blockUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/block/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
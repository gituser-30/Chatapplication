import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register API

export const registerUser = async (userData)=>{
    const response = await axios.post(`${API_URL}/register`,userData);
    return response.data;
};

// Login API
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  // save token
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};
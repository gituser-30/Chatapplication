// import axios from "axios";
// const API_BASE =
//   import.meta.env.PROD
//     ? "https://dbatuscholarhub-chatapp.onrender.com"
//     : "http://localhost:5000";

// // ethun apan sagle user fetch karnar ahot
// // export const getUsers = async()=>{
// //     const token = localStorage.getItem("token");

// //     const response = await axios.get(API_BASE,{
// //         headers: {
// //             Authorization: `Bearer ${token}`,
// //         },
// //     });
// //     return response.data;
// // };

// export const getUsers = async () => {
//   const token = localStorage.getItem("token");

//   const response = await axios.get(`${API_BASE}/api/users`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };

// export const blockUser = async (userId) => {
//   const token = localStorage.getItem("token");

//   const response = await axios.put(
//     `${API_BASE}/api/users/block/${userId}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data;
// };


import axios from "axios";

/**
 * Backend API URL (IMPORTANT)
 */
const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://chatapplication-z7kn.onrender.com"
    : "http://localhost:5000";

/* =========================
   GET USERS
========================= */
export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_BASE}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* =========================
   BLOCK USER
========================= */
export const blockUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_BASE}/api/users/block/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};



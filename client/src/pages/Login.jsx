import { useState } from "react";
import { loginUser } from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData);
      window.location.href = "/";
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    // <div className="container mt-5">
    //   <div className="row justify-content-center">
    //     <div className="col-md-4">
    //       <h3 className="text-center mb-3">Login</h3>

    //       <form onSubmit={handleSubmit}>
    //         <input
    //           className="form-control mb-2"
    //           placeholder="Email"
    //           name="email"
    //           onChange={handleChange}
    //           required
    //         />

    //         <input
    //           className="form-control mb-3"
    //           placeholder="Password"
    //           name="password"
    //           type="password"
    //           onChange={handleChange}
    //           required
    //         />

    //         <button className="btn btn-success w-100">
    //           Login
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <div className="container vh-100 d-flex align-items-center justify-content-center">
  <div className="col-md-4">
    <div className="auth-card">
      <h3 className="text-center mb-4">Welcome Back 👋</h3>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Email"
          type="email"
          name="email"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-4"
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
          required
        />

        <button className="btn btn-success w-100">
          Login
        </button>

        <p className="text-center mt-3 text-muted">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  </div>
</div>

  );
};

export default Login;

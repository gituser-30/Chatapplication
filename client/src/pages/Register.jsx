import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ REQUIRED

    try {
      await registerUser(formData);
      alert("Registered successfully. Please login.");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-4">
        <div className="auth-card">
          <h3 className="text-center mb-4">Create Account ✨</h3>

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              placeholder="Full Name"
              name="name"
              onChange={handleChange}
              required
            />

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

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>

            <p className="text-center mt-3 text-muted">
              Already have an account?{" "}
              <Link to="/" className="text-decoration-none">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

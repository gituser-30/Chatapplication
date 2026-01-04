import { useState } from "react";
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
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registered successfully. Please login.");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    // <div className="container mt-5">
    //   <div className="row justify-content-center">
    //     <div className="col-md-4">
    //       <h3 className="text-center mb-3">Register</h3>

    //       <form onSubmit={handleSubmit}>
    //         <input
    //           className="form-control mb-2"
    //           placeholder="Name"
    //           name="name"
    //           onChange={handleChange}
    //           required
    //         />

    //         <input
    //           className="form-control mb-2"
    //           placeholder="Email"
    //           name="email"
    //           type="email"
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

    //         <button className="btn btn-primary w-100">
    //           Register
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </div>

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

        <button className="btn btn-primary w-100">
          Register
        </button>

        <p className="text-center mt-3 text-muted">
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  </div>
</div>

  );
};

export default Register;

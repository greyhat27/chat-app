import "./Login.scss";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase";

//Login Page
export const Login = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  //method to authenticate user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.log("error occured", err);
      setError(true);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <span className="logo">ChatHub</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" name="" id="" placeholder="Enter your email" />
          <input type="password" name="" id="" placeholder="Enter password" />
          <button>Sign In</button>
          {error && <span>Something went wrong</span>}
        </form>
        <p>
          You don't have an account? <Link to="/register">Sign up here</Link>.
        </p>
      </div>
    </div>
  );
};

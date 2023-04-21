import "./Register.scss";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../../firebase";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

//Register page
export const Register = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  //method to add register new user into firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setError(true);
          console.log("error occurred", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(response.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", response.user.uid), {});
          });
          navigate("/");
        }
      );
    } catch (err) {
      console.log("error occured", err);
      setError(true);
    }
  };
  return (
    <div className="register">
      <div className="formContainer">
        <span className="logo">ChatHub</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter your name" />
          <input type="email" name="" id="" placeholder="Enter your email" />
          <input type="password" name="" id="" placeholder="Enter password" />
          <input type="file" id="file" style={{ display: "none" }} />
          <label htmlFor="file">
            <AddPhotoAlternateOutlinedIcon />
            <span>Add an Avatar</span>
          </label>
          <button>Sign Up</button>
          {error && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Sign in here</Link>.
        </p>
      </div>
    </div>
  );
};

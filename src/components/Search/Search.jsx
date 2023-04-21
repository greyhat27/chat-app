import { useContext, useState } from "react";
import "./Search.scss";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "./../../context/AuthContext";

export const Search = () => {
  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);

  //method to handle search input
  const handleSearch = async () => {
    //method to search user into firestore collection
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchUser)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      console.log("error occurred", err);
      setError(true);
    }
  };

  const handleKeyDown = (e) => {
    e.code === "Enter" && handleSearch();
  };

  //method to select user chat
  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const response = await getDoc(doc(db, "chats", combinedId));

      if (!response.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log("Error occurred", err);
    }
    setUser(null);
    setSearchUser("");
  };

  return (
    <div className="search">
      <div className="form">
        <input
          type="text"
          placeholder="Search user"
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchUser(e.target.value)}
          value={searchUser}
        />
      </div>
      {error && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

//component to render the recent chats on the sidebar
import { useState } from "react";
import "./Chats.scss";
import { useEffect } from "react";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import PhotoIcon from "@mui/icons-material/Photo";

export const Chats = ({ onChatClick }) => {
  const [chats, setChats] = useState([]);
  const [selectedUserChat, setSelectedUserChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    // method to get chats from firebase firestore and assigning to chats
    const getChats = async () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  //method to select chat or open particular chat
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setSelectedUserChat(u);
    onChatClick();
  };
  //sorting our recent chat based on time
  const sortedChats = Object.entries(chats ?? {}).sort(
    (a, b) => b[1].date - a[1].date
  );
  return (
    <div className="chats">
      {sortedChats?.map((chat) => (
        <div
          className={`userChat ${
            selectedUserChat?.uid === chat[1].userInfo?.uid ? "selected" : ""
          }`}
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>
              {chat[1].lastMessage?.text !== "" ? (
                chat[1].lastMessage?.text
              ) : (
                <PhotoIcon className="photoIcon" />
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

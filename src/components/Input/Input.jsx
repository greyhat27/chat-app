import "./Input.scss";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useState, useContext } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  //method to send messages
  const handleSend = async () => {
    if (!text && !image) {
      alert("Please add message to send");
      return;
    }
    //method to upload image of firebase storage
    if (image) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // console.log("Upload progress", snapshot.bytesTransferred, snapshot.totalBytes);
        },
        (error) => {
          console.log("error occurred", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            });
          });
        }
      );
    }
    //to update text message
    else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImage(null);
    console.log("text", text);
  };
  //method to add emoji
  const onClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setText(text + emojiData.emoji);
  };

  return (
    <div className="inputSec">
      <input
        type="text"
        placeholder="Message"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="inputIcons">
        {showPicker && (
          <EmojiPicker
            onEmojiClick={onClick}
            autoFocusSearch={false}
            height={350}
            width="30%"
          />
        )}
        <EmojiEmotionsIcon onClick={() => setShowPicker(!showPicker)} />
        <input
          type="file"
          name="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="file">
          <AttachFileIcon />
        </label>
        <input
          type="file"
          name="file1"
          id="file1"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="file1">
          <ImageIcon />
        </label>

        <SendIcon onClick={handleSend} />
      </div>
    </div>
  );
};

import "./Message.scss";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

export const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  //smooth effect scrolling after new msg
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  //message time
  const messageDate = new Date(message.date.seconds * 1000);
  const formattedMessageDate = messageDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "self"}`}
    >
      <div className="msgInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{formattedMessageDate}</span>
      </div>
      <div className="msgContent">
        {message.text && <p>{message.text}</p>}
        {message.image && <img src={message.image} alt="" />}
      </div>
    </div>
  );
};

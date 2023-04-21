import "./Messages.scss";
import { Message } from "./../Message/Message";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { onSnapshot, doc } from "@firebase/firestore";
import { db } from "../../firebase";

export const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  //method to check meessages in the firestore and assign to messages
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data()?.messages ?? []);
    });
    return () => {
      unsub();
    };
  }, [data.chatId]);
  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

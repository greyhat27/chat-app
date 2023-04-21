import "./Home.scss";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Chat } from "../../components/Chat/Chat";
import { useState } from "react";

//Home page
export const Home = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);

  // to show/hide chat window for mobile devices
  const handleChatClick = () => {
    setShowChatWindow(true);
  };

  const handleBackClick = () => {
    setShowChatWindow(false);
    console.log("back clicked");
  };

  return (
    <div className="home">
      <div className="homeContainer">
        <Sidebar onChatClick={handleChatClick} />
        <Chat onBackClick={handleBackClick} chatWindow={showChatWindow} />
      </div>
    </div>
  );
};

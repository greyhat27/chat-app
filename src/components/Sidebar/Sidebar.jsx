import "./Sidebar.scss";
import { Navbar } from "../Navbar/Navbar";
import { Search } from "../Search/Search";
import { Chats } from "../Chats/Chats";

//Sidebar component
export const Sidebar = ({ onChatClick }) => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats onChatClick={onChatClick} />
    </div>
  );
};

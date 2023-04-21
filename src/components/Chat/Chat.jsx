import "./Chat.scss";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Messages } from "../Messages/Messages";
import { Input } from "../Input/Input";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const Chat = ({ onBackClick, chatWindow }) => {
  const { data } = useContext(ChatContext);

  return (
    // particular chat section
    <div className="chat" style={{ display: chatWindow ? "block" : "" }}>
      <div className="chatInfo">
        <div className="userDetail">
          <ArrowBackIcon className="back" onClick={onBackClick} />
          {data.user?.photoURL && <img src={data.user?.photoURL} alt="" />}
          <span>{data.user?.displayName}</span>
        </div>
        {/* options */}
        <div className="chatIcons">
          <VideoCallIcon />
          <PersonAddIcon />
          <MoreHorizIcon />
        </div>
      </div>
      {/* imported messages component to display messages  */}
      <Messages />
      <Input />
    </div>
  );
};

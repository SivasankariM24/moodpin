import Image from "../image/image";
import { format } from "timeago.js";
import "./comments.css";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <Image src={comment.user?.img } path = "/general/noAvatar.png"/>
      <div className="commentContent">
        <span className="commentUsername">
          {comment.user?.displayName || "Unknown User"}
        </span>
        <p className="commentText">
          {comment.description || "No comment text"}
        </p>

        <span className="commentTime">{format(comment.createdAt)}</span>
      </div>
    </div>
  );
};

export default Comment;
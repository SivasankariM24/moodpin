import "./profilePage.css";
import Image from "../../components/image/image.jsx";
import React, { useState } from "react";
import Gallery from "../../components/gallery/gallery.jsx";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import apiRequest from "../../utils/apiRequest.js";
import Boards from "../../components/boards/boards.jsx";
import FollowButton from "./followButton.jsx"

const ProfilePage = () => {

  const [type, setType] = useState("saved");
  const { username } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => apiRequest.get(`/users/${username}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (!data) return "User not found!";
  return (
<div className="profilePage">
        <Image
        className="profileImg"
        w={100}
        h={100}
        src={data.img || "/general/noAvatar.png"}
      />
      <h1 className="profileName">{data.displayName}</h1>
      <span className="profileUsername">@{data.username}</span>
      <div className="followCounts">
        {data.followerCount} followers . {data.followingCount} followings
      </div>
      <div className="profileInteractions">
        <Image path="/general/share.svg" />
        <div className="profileButtons">
          <button>Message</button>
          <FollowButton
            isFollowing={data.isFollowing}
            username={data.username}
          />
        </div>
        <Image path="/general/more.svg" />
      </div>
      <div className="profileOptions">
        <span
          onClick={() => setType("created")}
          className={type === "created" ? "active" : ""}
        >
          Created
        </span>
        <span
          onClick={() => setType("saved")}
          className={type === "saved" ? "active" : ""}
        >
          Saved
        </span>
      </div>
      {type === "created" ? (
        <Gallery userId={data._id} />
      ) : (
        <Boards userId={data._id} />
      )}
    </div>
  );
};

export default ProfilePage;
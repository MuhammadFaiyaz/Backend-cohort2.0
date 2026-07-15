import React from "react";
import "../style/userListItem.scss"
const UserListItem = ({user}) => {
  return (
    <div className="user-list-item">
      <div className="user-avatar">
        <img
          src="https://ik.imagekit.io/muhammadfaiyaz/profile.webp?updatedAt=1783571915971"
          alt="user-avatar"
        />
      </div>

      <div className="user-info">
        <h4 className="username">{user.username}</h4>
        <p className="bio">{user.bio}</p>
      </div>

      <button className="follow-btn">Follow</button>
    </div>
  );
};

export default UserListItem;

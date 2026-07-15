import UserListItem from "./UserListItem";
import "../style/userList.scss"
const UserList = ({ title, users }) => {
  return (
    <div className="user-list-section">
      <h3>{title}</h3>
      {users.map((user) => (
        <UserListItem key={user.username} user={user} />
      ))}
    </div>
  );
};

export default UserList;
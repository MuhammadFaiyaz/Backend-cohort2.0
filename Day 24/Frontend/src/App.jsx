import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import "./features/shared/global.scss";
import { AuthProvider } from "./features/auth/Auth.context";
import { PostContextProvider } from "./features/post/post.context";
import { FollowProvider } from "./features/user/context/Follow.context";
const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <FollowProvider>
          <RouterProvider router={router} />
        </FollowProvider>
      </PostContextProvider>
    </AuthProvider>
  );
};

export default App;

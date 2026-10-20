import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import {useSelector} from "react-redux"
import { useEffect } from "react";
import {useAuth} from "../features/auth/hook/useAuth"
const App = () => {
  const {handleGetMe} = useAuth();

  const user = useSelector(state => state.authReducer.user);
  console.log(user);

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
    <RouterProvider router={routes} />
    </>
  )
}

export default App;
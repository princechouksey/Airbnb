import { useSelector } from "react-redux";
import {
  currentUserService,
  loginService,
  logOutService,
  signUpService,
} from "../../API/userService";
import { login, logout } from "../userSlice";


// export const asyncCurrentUser = (user) => async (dispatch) => {
//   const res = await currentUserService(user);
//   dispatch(login(res));
//   return res;
// };

export const asyncSignUp = (user) => async (dispatch) => {
  const res = await signUpService(user);
  dispatch(asyncCurrentUser(res));
  return res;
};

export const asyncLogin = (user) => async (dispatch) => {
  const res = await loginService(user);
  console.log('res.data --->', res.data);
  dispatch(login(res));
  return res;
};

export const asyncLogout = (user) => async (dispatch) => {
  const res = await logOutService();
  dispatch(logout());
  return res;
};
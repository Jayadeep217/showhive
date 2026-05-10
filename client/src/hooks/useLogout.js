import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api.js";
import { setUserData } from "../redux/userSlice.js";

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }
    dispatch(setUserData(null));
    navigate("/login");
  };
}

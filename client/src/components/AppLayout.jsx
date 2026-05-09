import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getUser } from "../api/auth.api";
import { setUserData } from "../redux/userSlice";

function AppLayout({ children }) {
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      getUser()
        .then((res) => dispatch(setUserData(res?.data || null)))
        .catch(() => {});
    }
  }, [userData, dispatch]);

  const onLogout = () => {
    dispatch(setUserData(null));
    navigate("/login");
  };

  return (
    <>
      <Navbar userData={userData} onSearch={() => {}} onLogout={onLogout} />
      <div style={{ padding: "24px", minHeight: "calc(100vh - 64px)", background: "#f0f2f5" }}>
        {children}
      </div>
    </>
  );
}

export default AppLayout;

import React, { useEffect, useState } from "react";
import { getUser } from "../api/auth.calls.js";

function HomePage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to ShowHive, {userData?.name || "Guest"}!</h1>

      <p>
        Your ultimate platform for discovering and booking movies and events.
      </p>
    </div>
  );
}

export default HomePage;
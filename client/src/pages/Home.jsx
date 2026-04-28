import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUser } from "../api/auth.api.js";
import { setUserData } from "../redux/userSlice.js";

import Navbar from "../components/Navbar.jsx";
import MovieCard from "../components/Moviecard.jsx";
import { getAllMovies } from "../api/movie.api.js";

function Home() {
  const [movies, setMovies] = React.useState([]);
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        dispatch(setUserData(data.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMovies = async () => {
      try {
        const moviesData = await getAllMovies();
        console.log(moviesData);
        
        setMovies(moviesData.movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchUser();
    fetchMovies();
  }, []);

  const onSearch = (value) => {
    console.log("Search:", value);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUserData(null));
    navigate("/login");
  };

  return (
    <>
      <Navbar userData={userData} onSearch={onSearch} onLogout={onLogout} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
        {movies.map((movieObj) => (
          <MovieCard
            key={movieObj._id || movieObj.id}
            title={movieObj.title}
            posterUrl={movieObj.posterPath}
            language={movieObj.language}
            rating={movieObj.ratings}
            genre={movieObj.genre}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
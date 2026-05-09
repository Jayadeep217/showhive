import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Spin, Button } from "antd";
import {
  StarFilled,
  CalendarOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  TagOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getMovieById } from "../../api/movie.api.js";
import Navbar from "../../components/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../api/auth.api.js";
import { setUserData } from "../../redux/userSlice.js";

function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        dispatch(setUserData(res.data || null));
      } catch {}
    };

    const fetchMovie = async () => {
      try {
        const res = await getMovieById(id);
        setMovie(res.movie || res.data || res);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchMovie();
  }, [id, dispatch]);

  const onLogout = () => {
    dispatch(setUserData(null));
    navigate("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar userData={userData} onLogout={onLogout} />
        <div className="movie-page-loading">
          <Spin size="large" />
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Navbar userData={userData} onLogout={onLogout} />
        <div className="movie-page-error">Movie not found.</div>
      </>
    );
  }

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const releaseFormatted = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Navbar userData={userData} onLogout={onLogout} />

      <div className="movie-page">
        {/* ── Cinematic hero ── */}
        <div className="movie-hero">
          <div
            className="movie-hero-backdrop"
            style={{ backgroundImage: `url(${movie.posterPath})` }}
          />
          <div className="movie-hero-overlay" />

          <div className="movie-hero-content">
            <button
              className="movie-hero-back"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftOutlined /> Back
            </button>

            <div className="movie-hero-body">
              {/* Poster */}
              <div className="movie-hero-poster-wrap">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="movie-hero-poster"
                />
                {movie.ratings && (
                  <div className="movie-hero-rating-badge">
                    <StarFilled />
                    <span>{movie.ratings}</span>
                    <small>/10</small>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="movie-hero-info">
                <h1 className="movie-hero-title">
                  {movie.title}
                  {releaseYear && (
                    <span className="movie-hero-year"> ({releaseYear})</span>
                  )}
                </h1>

                <div className="movie-hero-tags">
                  {movie.genre && (
                    <span className="movie-hero-tag genre-tag">
                      <TagOutlined /> {movie.genre}
                    </span>
                  )}
                  {movie.language && (
                    <span className="movie-hero-tag lang-tag">
                      <GlobalOutlined /> {movie.language}
                    </span>
                  )}
                  {movie.duration && (
                    <span className="movie-hero-tag dur-tag">
                      <ClockCircleOutlined /> {movie.duration} min
                    </span>
                  )}
                  {releaseFormatted && (
                    <span className="movie-hero-tag date-tag">
                      <CalendarOutlined /> {releaseFormatted}
                    </span>
                  )}
                </div>

                {movie.description && (
                  <p className="movie-hero-description">{movie.description}</p>
                )}

                <Button
                  type="primary"
                  size="large"
                  className="movie-hero-cta"
                  onClick={() => {}}
                >
                  Book Tickets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoviePage;

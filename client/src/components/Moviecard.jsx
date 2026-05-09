import React from "react";
import { Tag, Button } from "antd";
import { StarFilled, PlayCircleOutlined } from "@ant-design/icons";

function MovieCard({ title, posterUrl, rating, genre, language }) {
  return (
    <div className="movie-card">
      <div className="movie-card-poster-wrap">
        <img src={posterUrl} alt={title} className="movie-card-poster" />

        {rating && (
          <div className="movie-card-rating">
            <StarFilled style={{ color: "#ffd700", fontSize: 12 }} />
            <span>{rating}</span>
          </div>
        )}

        <div className="movie-card-overlay">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            className="movie-card-book-btn"
          >
            Book Now
          </Button>
        </div>
      </div>

      <div className="movie-card-info">
        <p className="movie-card-title">{title}</p>
        <div className="movie-card-tags">
          {genre && <Tag color="volcano">{genre}</Tag>}
          {language && <Tag color="blue">{language}</Tag>}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;

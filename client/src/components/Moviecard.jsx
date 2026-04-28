// MovieCard.jsx
import React from "react";
import { Card, Typography, Rate, Tag } from "antd";

const { Title, Text } = Typography;

function MovieCard({ title, posterUrl, rating, genre, language }) {
  return (
    <Card
      hoverable
      style={{ width: 200, borderRadius: 10, overflow: "hidden" }}
      cover={
        <img
          src={posterUrl}
          alt={title}
          style={{ height: 280, objectFit: "cover" }}
        />
      }
    >
      <Title level={5} style={{ marginBottom: 6 }}>
        {title}
      </Title>

      <div style={{ marginBottom: 8 }}>
       
        <Text strong>{rating}/10</Text>
      </div>

      <Tag color="blue">{genre}</Tag>
      <Tag>{language}</Tag>
    </Card>
  );
}

export default MovieCard;
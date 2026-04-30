import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api/movie.api";
import { Table } from "antd";
import moment from "moment";

function MovieManagement() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const moviesData = await getAllMovies();
        setMovies(moviesData.movies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    })();
  }, []);

  const tableHeadings = [
    {
      title: "Poster Path",
      dataIndex: "posterPath",
      render: (text, data) => {
        return <img width="100" height="auto" src={data.posterPath} />;
      },
    },
    { title: "Title", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    { title: "Language", dataIndex: "language" },
    { title: "Genre", dataIndex: "genre" },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, data) => {
        return moment(data.releaseDate).format("DD-MM-YYYY");
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => {
        return `${text} min`;
      },
    },
    { title: "Ratings", dataIndex: "ratings" },
  ];

  return (
    <>
      <Table dataSource={movies} columns={tableHeadings} />
    </>
  );
}

export default MovieManagement;

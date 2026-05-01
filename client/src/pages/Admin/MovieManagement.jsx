import React, { useEffect, useState } from "react";
import { deleteMovie, getAllMovies } from "../../api/movie.api";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import MovieForm from "./MovieForm";

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedMovie, setSelectedMovie] = useState(null);

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
    {
      title: "Actions",
      render: (text, data) => {
        return (
          <>
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setSelectedMovie(data);
                setFormType("edit");
              }}
            >
              <EditOutlined />
            </Button>
            <Button
            onClick={
              deleteMovie(data)
            }
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button
          color="default"
          variant="outlined"
          style={{ marginBottom: "20px" }}
          onClick={() => {
            setIsModalOpen(true);
            setSelectedMovie(null);
            setFormType("edit");
          }}
        >
          Add New Movie
        </Button>
      </div>
      <Table dataSource={movies} columns={tableHeadings} />
      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formType={formType}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
        />
      )}
    </>
  );
}

export default MovieManagement;

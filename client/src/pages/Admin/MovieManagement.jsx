import React, { useEffect, useState } from "react";
import { deleteMovie, getAllMovies } from "../../api/movie.api";
import { Table, Button, notification, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import MovieForm from "./MovieForm";

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pure fetch function (NO state updates)
  const fetchMovies = async () => {
    try {
      const response = await getAllMovies();
      return response?.movies || [];
    } catch (error) {
      notification.error({
        title: "Fetch Failed",
        description: error.message,
      });
      return [];
    }
  };

  // State updater (used outside useEffect too)
  const loadMovies = async () => {
    try {
      setLoading(true);
      const moviesData = await fetchMovies();
      setMovies(moviesData);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    let ignore = false;

    const init = async () => {
      try {
        setLoading(true);
        const moviesData = await fetchMovies();

        if (!ignore) {
          setMovies(moviesData);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (movie) => {
    try {
      await deleteMovie(movie._id);

      notification.success({
        title: "Movie Deleted",
        description: `"${movie.title}" deleted successfully.`,
      });

      await loadMovies();
    } catch (error) {
      notification.error({
        title: "Delete Failed",
        description: error.message,
      });
    }
  };

  const handleAddMovie = () => {
    setFormType("add");
    setSelectedMovie(null);
    setIsModalOpen(true);
  };

  const handleEditMovie = (movie) => {
    setFormType("edit");
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setFormType("add");
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "posterPath",
      render: (_, movie) => (
        <img width="100" src={movie.posterPath} alt={movie.title} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (_, movie) => moment(movie.releaseDate).format("DD-MM-YYYY"),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (duration) => `${duration} min`,
    },
    {
      title: "Ratings",
      dataIndex: "ratings",
    },
    {
      title: "Actions",
      render: (_, movie) => (
        <div className="d-flex gap-2">
          <Button onClick={() => handleEditMovie(movie)}>
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete Movie"
            description={`Are you sure you want to delete "${movie.title}"?`}
            onConfirm={() => handleDelete(movie)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button type="primary" onClick={handleAddMovie}>
          Add New Movie
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={movies}
        loading={loading}
      />

      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={handleCloseModal}
          formType={formType}
          selectedMovie={selectedMovie}
          refreshMovies={loadMovies}
        />
      )}
    </>
  );
}

export default MovieManagement;

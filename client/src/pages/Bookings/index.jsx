import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Empty, Tag } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../api/auth.api.js";
import { setUserData } from "../../redux/userSlice.js";
import { useLogout } from "../../hooks/useLogout.js";
import { getUserBookings } from "../../api/booking.api.js";
import dayjs from "dayjs";

function BookingsPage() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getUser();
        dispatch(setUserData(res.data || null));
      } catch {}
      try {
        const res = await getUserBookings();
        setBookings(res.bookings || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [dispatch]);

  const onLogout = useLogout();

  return (
    <>
      <Navbar userData={userData} onLogout={onLogout} />

      <div className="bookings-page">
        <div className="bookings-header">
          <button
            className="booking-back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeftOutlined /> Back
          </button>
          <h1 className="bookings-title">My Bookings</h1>
        </div>

        {loading ? (
          <div className="booking-loading">
            <Spin size="large" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty">
            <Empty description="No bookings yet. Go book a show!" />
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const show = booking.show || {};
              const movie = show.movie || {};
              const theater = show.theater || {};
              const dateStr = show.date
                ? dayjs(show.date).format("ddd, D MMM YYYY")
                : "—";

              return (
                <div key={booking._id} className="booking-card">
                  <div className="booking-card-poster-wrap">
                    {movie.posterPath ? (
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="booking-card-poster"
                      />
                    ) : (
                      <div className="booking-card-poster-placeholder" />
                    )}
                  </div>

                  <div className="booking-card-info">
                    <h2 className="booking-card-movie">
                      {movie.title || "Unknown Movie"}
                    </h2>

                    <div className="booking-card-meta">
                      <span>
                        <EnvironmentOutlined /> {theater.name || "—"}
                      </span>
                      <span>
                        <CalendarOutlined /> {dateStr}
                      </span>
                      <span>
                        <ClockCircleOutlined /> {show.time || "—"}
                      </span>
                    </div>

                    <div className="booking-card-seats">
                      <span className="booking-card-seats-label">Seats:</span>
                      {booking.seats?.map((s) => (
                        <Tag key={s} className="seat-tag">
                          {s}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div className="booking-card-right">
                    <Tag
                      color={
                        booking.status === "confirmed" ? "success" : "error"
                      }
                      className="booking-status-tag"
                    >
                      {booking.status?.toUpperCase()}
                    </Tag>
                    <div className="booking-card-amount">
                      ₹{booking.totalAmount}
                    </div>
                    <div className="booking-card-seats-count">
                      {booking.seats?.length} seat
                      {booking.seats?.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default BookingsPage;

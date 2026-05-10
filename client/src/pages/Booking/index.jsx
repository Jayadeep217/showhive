import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Spin, message, Modal } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../api/auth.api.js";
import { useLogout } from "../../hooks/useLogout.js";
import { setUserData } from "../../redux/userSlice.js";
import { getAllTheatersbyMovie } from "../../api/show.api.js";
import { parseTime } from "../../utils/time.js";
import { createBooking } from "../../api/booking.api.js";
import TicketModal from "../../components/TicketModal.jsx";
import dayjs from "dayjs";

const DATE_STRIP_DAYS = 7;

function BookingPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie;

  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [theaterGroups, setTheaterGroups] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);

  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        dispatch(setUserData(res.data || null));
      } catch {}
    };
    fetchUser();
  }, [dispatch]);

  const fetchShows = useCallback(
    async (date) => {
      setLoadingShows(true);
      setTheaterGroups([]);
      try {
        const res = await getAllTheatersbyMovie(
          movieId,
          date.format("YYYY-MM-DD"),
        );
        const shows = res.shows || [];

        // Group shows by theater
        const map = {};
        shows.forEach((show) => {
          const tid = show.theater?._id;
          if (!tid) return;
          if (!map[tid]) map[tid] = { theater: show.theater, shows: [] };
          map[tid].shows.push(show);
        });
        setTheaterGroups(Object.values(map));
      } catch {
        message.error("Failed to load shows. Please try again.");
      } finally {
        setLoadingShows(false);
      }
    },
    [movieId],
  );

  useEffect(() => {
    fetchShows(selectedDate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    fetchShows(date);
  };

  const handleShowTimeClick = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
    setSeatModalOpen(true);
  };

  const handleSeatToggle = (seat) => {
    if (selectedShow.bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeats.length) {
      message.warning("Please select at least one seat.");
      return;
    }
    setBookingLoading(true);
    try {
      const res = await createBooking({
        showId: selectedShow._id,
        seats: selectedSeats,
      });
      setSeatModalOpen(false);
      setConfirmedBooking(res.booking);
      setTicketModalOpen(true);
    } catch (err) {
      message.error(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const onLogout = useLogout();

  const generateSeats = (totalSeats) => {
    const seats = [];
    const cols = 10;
    for (let r = 0; r < Math.ceil(totalSeats / cols); r++) {
      const row = String.fromCharCode(65 + r);
      for (let c = 1; c <= cols && seats.length < totalSeats; c++) {
        seats.push(`${row}${c}`);
      }
    }
    return seats;
  };

  const dateStrip = Array.from({ length: DATE_STRIP_DAYS }, (_, i) =>
    dayjs().add(i, "day"),
  );

  const totalAmount = selectedSeats.length * (selectedShow?.ticketPrice || 0);

  return (
    <>
      <Navbar userData={userData} onLogout={onLogout} />

      <div className="booking-page">
        {/* Header */}
        <div className="booking-header">
          <button className="booking-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeftOutlined /> Back
          </button>
          {movie && (
            <div className="booking-movie-strip">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="booking-movie-thumb"
              />
              <div>
                <h1 className="booking-movie-name">{movie.title}</h1>
                <p className="booking-movie-meta">
                  {[
                    movie.genre,
                    movie.language,
                    movie.duration && `${movie.duration} min`,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Date strip */}
        <div className="booking-date-strip">
          {dateStrip.map((date) => {
            const active = date.isSame(selectedDate, "day");
            return (
              <button
                key={date.format("YYYY-MM-DD")}
                className={`booking-date-btn ${active ? "active" : ""}`}
                onClick={() => handleDateSelect(date)}
              >
                <span className="date-btn-day">{date.format("ddd")}</span>
                <span className="date-btn-num">{date.format("D")}</span>
                <span className="date-btn-month">{date.format("MMM")}</span>
              </button>
            );
          })}
        </div>

        {/* Theater + show list */}
        <div className="booking-content">
          {loadingShows ? (
            <div className="booking-loading">
              <Spin size="large" />
            </div>
          ) : theaterGroups.length === 0 ? (
            <div className="booking-no-shows">
              <p>No shows available on {selectedDate.format("MMMM D")}.</p>
              <p style={{ color: "#bbb", fontSize: 13 }}>Try another date.</p>
            </div>
          ) : (
            theaterGroups.map(({ theater, shows }) => (
              <div key={theater._id} className="theater-card">
                <div className="theater-card-header">
                  <div className="theater-name">
                    <EnvironmentOutlined /> {theater.name}
                  </div>
                  {theater.address && (
                    <div className="theater-address">{theater.address}</div>
                  )}
                </div>
                <div className="theater-showtimes">
                  {[...shows]
                    .sort((a, b) => parseTime(a.time) - parseTime(b.time))
                    .map((show) => {
                      const seatsLeft =
                        show.totalSeats - show.bookedSeats.length;
                      const soldOut = seatsLeft <= 0;
                      return (
                        <button
                          key={show._id}
                          className={`showtime-btn ${soldOut ? "sold-out" : ""}`}
                          onClick={() => !soldOut && handleShowTimeClick(show)}
                          disabled={soldOut}
                        >
                          <span className="showtime-time">{show.time}</span>
                          <span className="showtime-price">
                            ₹{show.ticketPrice}
                          </span>
                          {seatsLeft < 20 && !soldOut && (
                            <span className="showtime-seats-low">
                              {seatsLeft} left
                            </span>
                          )}
                          {soldOut && (
                            <span className="showtime-sold-out">Sold Out</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Seat selection modal */}
      <Modal
        open={seatModalOpen}
        onCancel={() => setSeatModalOpen(false)}
        footer={null}
        width={680}
        title={
          selectedShow && (
            <div className="seat-modal-title">
              <span>{selectedShow.theater?.name}</span>
              <span className="seat-modal-time">{selectedShow.time}</span>
            </div>
          )
        }
        destroyOnClose
        className="seat-selection-modal"
      >
        <div className="seat-modal-body">
          <div className="booking-screen-wrap">
            <div className="booking-screen-label">SCREEN</div>
            <div className="screen-div" />
          </div>

          <div className="booking-seat-legend">
            <span className="legend-item">
              <span className="legend-box legend-available" /> Available
            </span>
            <span className="legend-item">
              <span className="legend-box legend-selected" /> Selected
            </span>
            <span className="legend-item">
              <span className="legend-box legend-booked" /> Booked
            </span>
          </div>

          {selectedShow && (
            <ul className="seat-ul">
              {generateSeats(selectedShow.totalSeats).map((seat) => {
                const isBooked = selectedShow.bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);
                return (
                  <li key={seat}>
                    <button
                      className={`seat-btn ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSeatToggle(seat)}
                      disabled={isBooked}
                    >
                      {seat}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {selectedSeats.length > 0 && (
            <div className="seat-modal-summary">
              <div>
                <p className="m-0">
                  Seats: <strong>{selectedSeats.join(", ")}</strong>
                </p>
                <p className="m-0 mt-8" style={{ color: "#888", fontSize: 13 }}>
                  {selectedSeats.length} × ₹{selectedShow?.ticketPrice}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="seat-total-label">Total</span>
                <span className="seat-total-amount">₹{totalAmount}</span>
              </div>
            </div>
          )}

          <Button
            type="primary"
            size="large"
            className="booking-confirm-btn"
            loading={bookingLoading}
            disabled={!selectedSeats.length}
            onClick={handleConfirmBooking}
            style={{ width: "100%", marginTop: 16 }}
          >
            {selectedSeats.length
              ? `Confirm ${selectedSeats.length} Seat${selectedSeats.length > 1 ? "s" : ""}`
              : "Select Seats to Continue"}
          </Button>
        </div>
      </Modal>

      <TicketModal
        open={ticketModalOpen}
        booking={confirmedBooking}
        onClose={() => {
          setTicketModalOpen(false);
          navigate("/home");
        }}
      />
    </>
  );
}

export default BookingPage;

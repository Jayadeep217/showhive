import React from "react";
import { Modal, Tag } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

function TicketModal({ open, onClose, booking }) {
  if (!booking) return null;

  const show = booking.show || {};
  const movie = show.movie || {};
  const theater = show.theater || {};
  const dateStr = show.date ? dayjs(show.date).format("ddd, D MMM YYYY") : "—";
  const bookingRef = booking._id?.slice(-10).toUpperCase();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
      destroyOnClose
      className="ticket-modal"
    >
      <div className="ticket-wrap">
        <div className="ticket-header">
          <CheckCircleOutlined className="ticket-success-icon" />
          <h2 className="ticket-success-title">Booking Confirmed!</h2>
        </div>

        <div className="ticket-body">
          <div className="ticket-movie-row">
            {movie.posterPath && (
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="ticket-poster"
              />
            )}
            <div className="ticket-movie-info">
              <h3 className="ticket-movie-title">{movie.title || "—"}</h3>
              {movie.genre && (
                <p className="ticket-movie-genre">{movie.genre}</p>
              )}
              <Tag
                color={booking.status === "confirmed" ? "success" : "error"}
                className="ticket-status-tag"
              >
                {booking.status?.toUpperCase()}
              </Tag>
            </div>
          </div>

          <div className="ticket-divider">
            <span className="ticket-notch ticket-notch-left" />
            <div className="ticket-dashes" />
            <span className="ticket-notch ticket-notch-right" />
          </div>

          <div className="ticket-id-strip">
            <span className="ticket-id-label">BOOKING ID</span>
            <span className="ticket-id-value">{bookingRef}</span>
          </div>

          <div className="ticket-details">
            <div className="ticket-detail-row">
              <EnvironmentOutlined className="ticket-icon" />
              <div>
                <p className="ticket-detail-label">Theater</p>
                <p className="ticket-detail-value">{theater.name || "—"}</p>
              </div>
            </div>

            <div className="ticket-detail-row">
              <CalendarOutlined className="ticket-icon" />
              <div>
                <p className="ticket-detail-label">Date & Time</p>
                <p className="ticket-detail-value">
                  {dateStr} · {show.time || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="ticket-seats-section">
            <p className="ticket-detail-label">Seats</p>
            <div className="ticket-seats">
              {booking.seats?.map((s) => (
                <span key={s} className="ticket-seat-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="ticket-footer">
            <p className="ticket-detail-label">
              {booking.seats?.length} seat
              {booking.seats?.length !== 1 ? "s" : ""}
            </p>
            <p className="ticket-total-amount">₹{booking.totalAmount}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TicketModal;

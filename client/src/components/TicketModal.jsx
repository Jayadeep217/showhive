import React from "react";
import { Modal, Button } from "antd";
import {
  CheckCircleFilled,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const ACCENT = "#e94560";

const label = {
  margin: "0 0 2px",
  fontSize: 10,
  fontWeight: 700,
  color: "#9ca3af",
  letterSpacing: 1,
  textTransform: "uppercase",
};
const value = { margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" };

function TicketModal({ open, onClose, booking }) {
  const userEmail = useSelector((state) => state.user.user?.email);

  if (!booking) return null;

  const show      = booking.show    || {};
  const movie     = show.movie      || {};
  const theater   = show.theater    || {};
  const dateStr   = show.date ? dayjs(show.date).format("ddd, D MMM YYYY") : "—";
  const bookingRef = booking._id ? `#${booking._id.slice(-8).toUpperCase()}` : "—";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      centered
      destroyOnClose
      styles={{ content: { padding: 0, borderRadius: 12, overflow: "hidden", background: "#f9fafb" } }}
    >
      {/* Top bar */}
      <div style={{
        background: "#ffffff",
        padding: "13px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e5e7eb",
        borderRadius: "12px 12px 0 0",
      }}>
        <span style={{ color: ACCENT, fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
          ShowHive
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "#dcfce7", color: "#15803d",
          fontSize: 11, fontWeight: 700, padding: "3px 10px",
          borderRadius: 20, letterSpacing: 0.5,
        }}>
          <CheckCircleFilled style={{ fontSize: 10 }} />CONFIRMED
        </span>
      </div>

      {/* Body */}
      <div style={{ background: "#f9fafb", padding: "16px 20px" }}>

        {/* Movie row */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
          {movie.posterPath && (
            <img
              src={movie.posterPath}
              alt={movie.title}
              style={{ width: 52, height: 72, objectFit: "cover", borderRadius: 6, flexShrink: 0, boxShadow: "0 2px 8px #00000018" }}
            />
          )}
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
              {movie.title || "—"}
            </p>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6b7280" }}>
              {[movie.genre, movie.language, movie.duration && `${movie.duration} min`]
                .filter(Boolean).join(" · ")}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
              Ref: <strong style={{ fontFamily: "monospace", color: "#6b7280" }}>{bookingRef}</strong>
            </p>
          </div>
        </div>

        {/* Perforated divider */}
        <div style={{ borderTop: "2px dashed #e5e7eb", margin: "0 -20px 14px", position: "relative" }}>
          <div style={{ position: "absolute", left: -10, top: -9, width: 18, height: 18, borderRadius: "50%", background: "#f9fafb", border: "1px solid #e5e7eb" }} />
          <div style={{ position: "absolute", right: -10, top: -9, width: 18, height: 18, borderRadius: "50%", background: "#f9fafb", border: "1px solid #e5e7eb" }} />
        </div>

        {/* Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: 12 }}>

          {/* Theater + Seats side by side */}
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={label}><EnvironmentOutlined style={{ marginRight: 3 }} />Theater</p>
              <p style={value}>{theater.name || "—"}</p>
              {theater.address && (
                <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{theater.address}</p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={label}>Seats</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
                {booking.seats?.map((s) => (
                  <span key={s} style={{
                    background: "#fff", border: "1px solid #e5e7eb",
                    color: "#374151", borderRadius: 5,
                    padding: "2px 7px", fontSize: 12, fontWeight: 700,
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <p style={label}><CalendarOutlined style={{ marginRight: 3 }} />Date</p>
            <p style={value}>{dateStr}</p>
          </div>

          {/* Time */}
          <div>
            <p style={label}><ClockCircleOutlined style={{ marginRight: 3 }} />Time</p>
            <p style={value}>{show.time || "—"}</p>
          </div>

          {/* Payment ID */}
          {booking.paymentId && (
            <div style={{ gridColumn: "1 / -1" }}>
              <p style={label}><CreditCardOutlined style={{ marginRight: 3 }} />Payment ID</p>
              <p style={{ margin: 0, fontSize: 11, fontFamily: "monospace", color: "#6b7280", wordBreak: "break-all" }}>
                {booking.paymentId}
              </p>
            </div>
          )}
        </div>

        {/* Amount strip */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#ffffff", borderRadius: 8, padding: "10px 14px",
          border: "1px solid #e5e7eb", marginBottom: 12,
        }}>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
            {booking.seats?.length} seat{booking.seats?.length !== 1 ? "s" : ""} × ₹{show.ticketPrice}
          </p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: ACCENT }}>₹{booking.totalAmount}</p>
        </div>

        {/* Email note */}
        {userEmail && (
          <p style={{ margin: "0 0 10px", fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
            <MailOutlined style={{ marginRight: 4 }} />
            Confirmation sent to <strong style={{ color: "#6b7280" }}>{userEmail}</strong>
          </p>
        )}

        {/* Done button */}
        <Button
          type="primary"
          block
          style={{
            background: ACCENT, borderColor: ACCENT,
            borderRadius: 8, height: 40, fontWeight: 700, fontSize: 14,
            boxShadow: "none",
          }}
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}

export default TicketModal;

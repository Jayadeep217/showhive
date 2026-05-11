const nodemailer = require("nodemailer");

const recipient = (user) => process.env.EMAIL_TO_OVERRIDE || user.email;

const getTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587,
    auth: {
      user: "resend",
      pass: process.env.EMAIL_PASS,
    },
  });

const sendBookingConfirmation = async (user, booking, show) => {
  const movie = show.movie;
  const theater = show.theater;
  const dateStr = new Date(show.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const bookingRef = `#${String(booking._id).slice(-8).toUpperCase()}`;
  const paymentLine = booking.paymentId
    ? `<tr><td style="padding:8px 0;color:#888;width:130px;vertical-align:top">Payment ID</td><td style="font-family:monospace;font-size:12px;color:#555;word-break:break-all">${booking.paymentId}</td></tr>`
    : "";

  await getTransporter().sendMail({
    from: `"ShowHive" <onboarding@resend.dev>`,
    to: recipient(user),
    subject: `Payment Confirmed – ${movie.title} · ${bookingRef}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif">

<div style="max-width:560px;margin:0 auto">

  <!-- Brand bar -->
  <div style="background:#0f172a;border-radius:12px 12px 0 0;padding:20px 28px;display:flex;align-items:center;justify-content:space-between">
    <span style="color:#e94560;font-size:20px;font-weight:800;letter-spacing:1px">ShowHive</span>
    <span style="background:#14532d;color:#4ade80;font-size:11px;font-weight:700;letter-spacing:1px;padding:4px 12px;border-radius:20px">✓ PAYMENT CONFIRMED</span>
  </div>

  <!-- Hero -->
  <div style="background:#1e293b;padding:24px 28px;border-bottom:1px solid #ffffff10">
    <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#fff">Hi ${user.name},</p>
    <p style="margin:0;font-size:14px;color:#94a3b8">Your tickets for <strong style="color:#e2e8f0">${movie.title}</strong> are confirmed. See you at the movies!</p>
  </div>

  <!-- Ticket card -->
  <div style="background:#fff;border:1px solid #e2e8f0">

    <!-- Movie info -->
    <div style="padding:24px 28px;display:flex;gap:16px;align-items:flex-start;border-bottom:1px solid #f1f5f9">
      ${movie.posterPath ? `<img src="${movie.posterPath}" alt="${movie.title}" style="width:60px;height:85px;object-fit:cover;border-radius:6px;flex-shrink:0;box-shadow:0 2px 8px #0002">` : ""}
      <div style="flex:1">
        <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#0f172a">${movie.title}</p>
        <p style="margin:0 0 12px;font-size:13px;color:#94a3b8">${[movie.genre, movie.language].filter(Boolean).join(" · ")}</p>
        <p style="margin:0;font-size:12px;color:#64748b">Booking Ref: <strong style="font-family:monospace;color:#0f172a">${bookingRef}</strong></p>
      </div>
    </div>

    <!-- Perforated line -->
    <div style="position:relative;padding:0;height:0;border-top:2px dashed #e2e8f0;margin:0 24px"></div>

    <!-- Details grid -->
    <div style="padding:20px 28px;border-bottom:1px solid #f1f5f9">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr>
          <td style="padding:7px 0;color:#64748b;width:130px;vertical-align:top">📍 Theater</td>
          <td style="font-weight:600;color:#0f172a">${theater.name}</td>
        </tr>
        ${theater.address ? `<tr><td style="padding:7px 0;color:#64748b;vertical-align:top">Address</td><td style="color:#475569">${theater.address}</td></tr>` : ""}
        <tr>
          <td style="padding:7px 0;color:#64748b;vertical-align:top">📅 Date</td>
          <td style="font-weight:600;color:#0f172a">${dateStr}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;vertical-align:top">🕐 Time</td>
          <td style="font-weight:600;color:#0f172a">${show.time}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748b;vertical-align:top">🎟 Seats</td>
          <td>
            ${booking.seats.map((s) => `<span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;border-radius:5px;padding:2px 8px;font-size:13px;font-weight:700;margin:2px 3px 2px 0">${s}</span>`).join("")}
          </td>
        </tr>
        ${paymentLine}
      </table>
    </div>

    <!-- Amount row -->
    <div style="background:#0f172a;padding:16px 28px;display:flex;justify-content:space-between;align-items:center;border-radius:0 0 0 0">
      <div>
        <p style="margin:0;font-size:13px;color:#64748b">${booking.seats.length} seat${booking.seats.length > 1 ? "s" : ""} × ₹${show.ticketPrice}</p>
        <p style="margin:2px 0 0;font-size:11px;color:#22c55e;font-weight:600">✓ Payment successful</p>
      </div>
      <p style="margin:0;font-size:28px;font-weight:800;color:#e94560">₹${booking.totalAmount}</p>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:20px 28px;text-align:center">
    <p style="margin:0 0 4px;font-size:13px;color:#64748b">Enjoy the movie! 🍿</p>
    <p style="margin:0;font-size:12px;color:#94a3b8">— The ShowHive Team</p>
  </div>

</div>
</body>
</html>
    `,
  });
};

const sendPasswordOTP = async (user, otp) => {
  await getTransporter().sendMail({
    from: `"ShowHive" <onboarding@resend.dev>`,
    to: recipient(user),
    subject: "Your OTP for Password Change",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">
        <div style="background:#1a1a2e;padding:24px 32px">
          <h1 style="color:#e94560;margin:0;font-size:22px">ShowHive</h1>
        </div>
        <div style="padding:32px;text-align:center">
          <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a2e">Password Change Request</h2>
          <p style="margin:0 0 32px;color:#666">Hi ${user.name}, use the OTP below to confirm your password change.</p>

          <div style="background:#f7f7f7;border-radius:8px;padding:24px;margin-bottom:24px;display:inline-block;min-width:200px">
            <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px">One-Time Password</p>
            <p style="margin:0;font-size:40px;font-weight:700;letter-spacing:12px;color:#1a1a2e;font-family:monospace">${otp}</p>
          </div>

          <p style="margin:0 0 8px;font-size:13px;color:#e94560;font-weight:600">Expires in 10 minutes</p>
          <p style="margin:0;font-size:12px;color:#aaa">If you didn't request this, ignore this email — your password won't change.</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendBookingConfirmation, sendPasswordOTP };

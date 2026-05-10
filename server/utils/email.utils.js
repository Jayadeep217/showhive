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

  await getTransporter().sendMail({
    from: `"ShowHive" <onboarding@resend.dev>`,
    to: recipient(user),
    subject: `Booking Confirmed – ${movie.title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">
        <div style="background:#1a1a2e;padding:24px 32px">
          <h1 style="color:#e94560;margin:0;font-size:22px">ShowHive</h1>
        </div>
        <div style="padding:32px">
          <h2 style="margin:0 0 4px;font-size:20px;color:#1a1a2e">Booking Confirmed!</h2>
          <p style="margin:0 0 24px;color:#666">Hi ${user.name}, your tickets are ready.</p>

          <div style="background:#f7f7f7;border-radius:8px;padding:20px 24px;margin-bottom:24px">
            <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a1a2e">${movie.title}</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;color:#444">
              <tr><td style="padding:6px 0;color:#888;width:120px">Theater</td><td style="font-weight:600">${theater.name}</td></tr>
              <tr><td style="padding:6px 0;color:#888">Address</td><td>${theater.address || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#888">Date</td><td style="font-weight:600">${dateStr}</td></tr>
              <tr><td style="padding:6px 0;color:#888">Time</td><td style="font-weight:600">${show.time}</td></tr>
              <tr><td style="padding:6px 0;color:#888">Seats</td><td><strong>${booking.seats.join(", ")}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#888">Booking ID</td><td style="font-family:monospace;font-size:12px">${booking._id}</td></tr>
            </table>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;background:#1a1a2e;border-radius:8px;padding:16px 24px">
            <span style="color:#fff;font-size:14px">${booking.seats.length} seat${booking.seats.length > 1 ? "s" : ""} × ₹${show.ticketPrice}</span>
            <span style="color:#e94560;font-size:22px;font-weight:700">₹${booking.totalAmount}</span>
          </div>

          <p style="margin:24px 0 0;font-size:13px;color:#aaa;text-align:center">Enjoy the movie! — ShowHive Team</p>
        </div>
      </div>
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

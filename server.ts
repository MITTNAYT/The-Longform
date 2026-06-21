import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from 'resend';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/notify-follow", async (req, res) => {
    const { followerName, followingEmail, followingName } = req.body;
    
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set, skipping email notification');
      return res.status(200).json({ status: 'skipped', message: 'API key not configured' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: 'The Longform <notifications@resend.dev>',
        to: followingEmail,
        subject: 'New Follower on The Longform',
        html: `
          <div style="font-family: serif; color: #141414; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee;">
            <h1 style="font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 20px;">New Connection</h1>
            <p style="font-size: 18px; line-height: 1.6;">Hello ${followingName},</p>
            <p style="font-size: 18px; line-height: 1.6;">
              <strong>${followerName}</strong> has just started following your archive on The Longform.
            </p>
            <p style="font-size: 18px; line-height: 1.6;">
              Your words continue to resonate.
            </p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #999;">
              Sent with care from The Longform Archive.
            </div>
          </div>
        `
      });
      res.json({ status: "ok" });
    } catch (error) {
      console.error('Failed to send email:', error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

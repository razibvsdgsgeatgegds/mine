const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

app.get("/", (req, res) => res.send("🔥 Pusher Chat Server Running!"));
app.post("/send", (req, res) => {
  pusher.trigger("my-channel", "my-event", { message: req.body.message });
  res.send({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Listening on port ${PORT}`));

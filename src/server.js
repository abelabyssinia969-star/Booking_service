const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectMongo } = require('./config/mongo');
const apiRoutes = require('./routes');
const { attachSocketHandlers } = require('./sockets');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api', apiRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*'} });
attachSocketHandlers(io);

const PORT = process.env.PORT || 4000;
connectMongo().then(() => {
  server.listen(PORT, () => console.log(`Server listening on :${PORT}`));
}).catch((e) => {
  console.error('Failed to connect Mongo', e);
  process.exit(1);
});

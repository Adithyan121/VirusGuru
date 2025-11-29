require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/files');
const scanRoutes = require('./routes/scans');
require('./bot');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes);
app.use('/api', scanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

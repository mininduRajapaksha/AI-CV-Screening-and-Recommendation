const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../frontend/dist')));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
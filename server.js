const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Government schemes routes
app.get('/api/schemes/all', (req, res) => {
  res.json([{ id: '1', name: 'PM-KISAN', category: 'subsidy' }]);
});

app.get('/api/schemes/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Sample Scheme' });
});

app.post('/api/schemes/eligibility', (req, res) => {
  res.json([{ id: '1', name: 'Eligible Scheme' }]);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
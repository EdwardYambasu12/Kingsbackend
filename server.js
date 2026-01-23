import express from 'express';
import cors from 'cors';
import {
  getProposals,
  addProposal,
  updateProposalStatus,
  deleteProposal,
  getPhotos,
  addPhoto,
  deletePhoto,
  getQuotes,
  addQuote,
  deleteQuote
} from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ===== PROPOSALS ROUTES =====
app.get('/api/proposals', async (req, res) => {
  try {
    const proposals = await getProposals();
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

app.post('/api/proposals', async (req, res) => {
  try {
    const { name, email, phone, projectType, description } = req.body;
    
    if (!name || !email || !projectType || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const proposal = await addProposal({
      name,
      email,
      phone: phone || '',
      projectType,
      description
    });

    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add proposal' });
  }
});

app.patch('/api/proposals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const proposal = await updateProposalStatus(id, status);
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

app.delete('/api/proposals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProposal(id);
    res.json({ message: 'Proposal deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
});

// ===== PHOTOS ROUTES =====
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await getPhotos();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

app.post('/api/photos', async (req, res) => {
  try {
    const { src, title, category } = req.body;

    if (!src || !title || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const photo = await addPhoto({ src, title, category });
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

app.delete('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deletePhoto(id);
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// ===== QUOTES ROUTES =====
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await getQuotes();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

app.post('/api/quotes', async (req, res) => {
  try {
    const { clientName, clientTitle, clientImage, quoteText, projectType } = req.body;

    if (!clientName || !clientTitle || !clientImage || !quoteText || !projectType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const quote = await addQuote({
      clientName,
      clientTitle,
      clientImage,
      quoteText,
      projectType
    });

    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add quote' });
  }
});

app.delete('/api/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteQuote(id);
    res.json({ message: 'Quote deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
});

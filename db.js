import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// File paths
const proposalsFile = path.join(dataDir, 'proposals.json');
const photosFile = path.join(dataDir, 'photos.json');
const quotesFile = path.join(dataDir, 'quotes.json');

// Initialize empty files if they don't exist
async function initializeFiles() {
  await ensureDataDir();
  
  const files = [
    { file: proposalsFile, default: [] },
    { file: photosFile, default: [] },
    { file: quotesFile, default: [] }
  ];

  for (const { file, default: defaultData } of files) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
    }
  }
}

// Helper to read JSON file
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

// Helper to write JSON file
async function writeJSON(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    throw err;
  }
}

// ===== PROPOSALS =====
export async function getProposals() {
  return await readJSON(proposalsFile);
}

export async function addProposal(data) {
  const proposals = await getProposals();
  const newProposal = {
    id: uuidv4(),
    ...data,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  proposals.push(newProposal);
  await writeJSON(proposalsFile, proposals);
  return newProposal;
}

export async function updateProposalStatus(id, status) {
  const proposals = await getProposals();
  const proposal = proposals.find(p => p.id === id);
  if (proposal) {
    proposal.status = status;
    await writeJSON(proposalsFile, proposals);
  }
  return proposal;
}

export async function deleteProposal(id) {
  const proposals = await getProposals();
  const filtered = proposals.filter(p => p.id !== id);
  await writeJSON(proposalsFile, filtered);
}

// ===== PHOTOS =====
export async function getPhotos() {
  return await readJSON(photosFile);
}

export async function addPhoto(data) {
  const photos = await getPhotos();
  const newPhoto = {
    id: uuidv4(),
    ...data,
    addedAt: new Date().toISOString()
  };
  photos.push(newPhoto);
  await writeJSON(photosFile, photos);
  return newPhoto;
}

export async function deletePhoto(id) {
  const photos = await getPhotos();
  const filtered = photos.filter(p => p.id !== id);
  await writeJSON(photosFile, filtered);
}

// ===== QUOTES =====
export async function getQuotes() {
  return await readJSON(quotesFile);
}

export async function addQuote(data) {
  const quotes = await getQuotes();
  const newQuote = {
    id: uuidv4(),
    ...data,
    addedAt: new Date().toISOString()
  };
  quotes.push(newQuote);
  await writeJSON(quotesFile, quotes);
  return newQuote;
}

export async function deleteQuote(id) {
  const quotes = await getQuotes();
  const filtered = quotes.filter(q => q.id !== id);
  await writeJSON(quotesFile, filtered);
}

// Initialize files on startup
await initializeFiles();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { Grid } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:sam@study.byjskdg.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for the book collection
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  subject: String,
  file: String,
});

// Create a model based on the schema
const Book = mongoose.model('Book', bookSchema);

// Connect to GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
});

// Create storage engine for Multer
const storage = new GridFsStorage({
  url: 'mongodb+srv://admin:sam@study.byjskdg.mongodb.net/?retryWrites=true&w=majority',
  file: (req, file) => {
    const { originalname } = file;
    return {
      filename: originalname,
    };
  },
});
const upload = multer({ storage });

// Enable CORS for specific routes
app.post('/api/upload', cors(), upload.single('file'), async (req, res) => {
  const { title, author, subject } = req.body;
  const { filename } = req.file;

  try {
    // Create a new book document
    const book = new Book({
      title,
      author,
      subject,
      file: filename,
    });

    // Save the book to the database
    await book.save();

    // Send a response back to the client
    res.json({ success: true, message: 'Book saved successfully.' });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ success: false, error: 'Failed to save book.' });
  }
});

// Serve uploaded files
app.get('/api/responses/:filename', (req, res) => {
  const { filename } = req.params;

  // Set the appropriate content type for the file
  res.set('Content-Type', 'application/octet-stream');

  // Set the content disposition to "attachment" to trigger file download
  res.set('Content-Disposition', `attachment; filename="${filename}"`);

  // Retrieve the file from the database
  const downloadStream = gfs.openDownloadStreamByName(filename);
  downloadStream.pipe(res);

  // Handle any errors during the file retrieval
  downloadStream.on('error', (error) => {
    console.error('Error retrieving file:', error);
    res.status(404).json({ success: false, error: 'File not found.' });
  });
});

// Retrieve responses from the database
app.get('/api/responses', async (req, res) => {
  try {
    const responses = await Book.find();

    res.json({ success: true, responses });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch responses.' });
  }
});


// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});


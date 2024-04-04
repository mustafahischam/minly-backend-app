const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path'); 

const app = express();
const port = process.env.PORT || 3000;

app.use("/image", express.static(path.resolve(__dirname, "uploads")))
console.log(__dirname)
// Connect to local MongoDB instance
mongoose.connect('mongodb://localhost:27017/media_platform')
  .then(() => {
    console.log('Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.error('MongoDB connection error. Please make sure MongoDB is running.', err);
    process.exit(1);
  });

const storage = multer.diskStorage({
  destination: 'uploads', 
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage }); 

// Define your media schema
const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  filePath: { type: String, required: true }, 
  likes: { type: Number, default: 0 },
});

const MediaModel = mongoose.model('Media', mediaSchema);

app.use(bodyParser.json());

// Route to get all media
app.get('/media', async (req, res) => {
  try {

    const allMedia = await MediaModel.find();
    res.json(allMedia);
  } catch (error) {
    res.status(500).json({ error: 'error getting media' });
  }
});

app.post('/media', upload.single('mediafile'), async (req, res) => {
  try {
    const { type } = req.body;
    console.log(req.file)
    console.log()
    const newMedia = await MediaModel.create({
      type,
      filePath: req.file.filename, 
    });
    res.status(201).json(newMedia);
  } catch (error) {
    res.status(500).json({ error: 'error creating media' });
  }
});

app.put('/media/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMedia = await MediaModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!updatedMedia) {
      res.status(404).json({ error: 'Media content not found' });
    } else {
      res.json(updatedMedia);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating media content' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

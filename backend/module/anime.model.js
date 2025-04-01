const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  videoPath: { type: String, required: true },
});

const AnimeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: [String], required: true },
  country: { type: String, required: true },
  premiered: { type: String, required: true },
  malRating: { type: Number, required: true },
  image: { type: String, required: true },
  videoPath: { type: String, required: true },

  episodes: {
    sub: [episodeSchema], // ✅ Separate sub episodes
    dub: [episodeSchema], // ✅ Separate dub episodes
  },
  posterImage: { type: String, required: true },
  carousel: { type: Boolean, default: false },
  isAdult: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  duration: { type: String },
  type: { type: String, required: true },
  producers: { type: String },
  studio: { type: String },
  dateAired: { type: String },
  broadcast: { type: String },
  status: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Anime", AnimeSchema);

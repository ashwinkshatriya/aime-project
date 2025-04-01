const express = require("express");
const router = express.Router();
const Anime = require("../module/anime.model");

// ✅ Search anime by title (this is the new search endpoint)
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) {
      return res.json([]); // Return empty if no query or less than 2 characters
    }
    const results = await Anime.find({
      title: { $regex: query, $options: 'i' }, // Case-insensitive search
    }).limit(10); // Limit results to 10 suggestions
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/carousel', async (req, res) => {
  try {
    const carouselAnimes = await Anime.find({ carousel: true });
    res.json(carouselAnimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ✅ Get all anime (with sorting by genre & type)
router.get("/", async (req, res) => {
  try {
    const { genre, type, status, sort } = req.query;
    let query = {};

    // Filter by genre if provided
    if (genre) {
      const genresArray = genre.split(",");
      query.genres = { $in: genresArray.map((g) => new RegExp(g, "i")) };
    }

    // Filter by type if provided
    if (type) {
      const typesArray = type.split(",");
      query.type = { $in: typesArray.map((t) => new RegExp(t, "i")) };
    }

    // Filter by status if provided
    if (status) {
      const statusesArray = status.split(",");
      query.status = { $in: statusesArray };  // Filtering by status (assumes status is stored as a string)
    }

    // Sort options
    const sortOptions = {
      updatedAt: { updatedAt: -1 },    // Sort by Recently Updated
      malRating: { malRating: -1 },    // Sort by MAL Score
      release: { DateAired: -1 },      // Sort by Release Date
      mostWatched: { mostWatched: -1 } // Sort by Most Watched
    };

    const sortQuery = sortOptions[sort] || { updatedAt: -1 }; // Default to sorting by recently updated

    // Fetch anime with the applied filters
    const animes = await Anime.find(query).sort(sortQuery).select("title image episodes type duration status isAdult").lean();

    // Modify response to include episode counts
    const animeList = animes.map((anime) => {
      console.log('anime.isAdult:', anime.isAdult);  // Log the value of isAdult
      const animeData = {
        _id: anime._id,
        title: anime.title,
        image: anime.image,
        subEpisodes: anime.episodes?.sub?.length || 0,
        dubEpisodes: anime.episodes?.dub?.length || 0,
        type: anime.type,
        duration: anime.duration,
        status: anime.status,  // Include the status in the response
      };
    
      // Include `isAdult` field only if it is true
      if (anime.isAdult) {
        animeData.isAdult = anime.isAdult;
      }
    
      return animeData;
    });

    res.json(animeList);
  } catch (error) {
    console.error("Error fetching animes:", error.message);
    res.status(500).json({ error: "Failed to fetch animes" });
  }
});

// ✅ Get trending anime
router.get("/trending", async (req, res) => {
  try {
    const trendingAnime = await Anime.find({ isTrending: true }).lean();
    res.json(trendingAnime);
  } catch (err) {
    console.error("Error fetching trending anime:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get sidebar anime (Only where isSidebar is true)
router.get("/sidebar-anime", async (req, res) => {
  try {
    console.log("🔍 Fetching sidebar anime...");

    const sidebarAnime = await Anime.find({ isSidebar: true }).sort({ updatedAt: -1 }).limit(10).lean();

    if (!sidebarAnime.length) {
      console.warn("⚠️ No sidebar anime found.");
      return res.status(404).json({ error: "No sidebar anime found" });
    }

    console.log("✅ Sidebar anime fetched successfully.");
    res.json(sidebarAnime);
  } catch (err) {
    console.error("❌ Error fetching sidebar anime:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get single anime by ID
router.get("/:id", async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id).lean();
    if (!anime) {
      return res.status(404).json({ error: "Anime not found" });
    }
    res.json(anime);
  } catch (err) {
    console.error(`Error fetching anime with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Add new anime
router.post("/", async (req, res) => {
  try {
    const newAnime = new Anime({ ...req.body, updatedAt: new Date() });
    const savedAnime = await newAnime.save();
    res.status(201).json(savedAnime);
  } catch (err) {
    console.error("Error adding new anime:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update an existing anime
router.put("/:id", async (req, res) => {
  try {
    // Validate the incoming data
    const { error } = animeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedAnime = await Anime.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    ).lean();

    if (!updatedAnime) {
      return res.status(404).json({ error: "Anime not found" });
    }

    res.json(updatedAnime);
  } catch (err) {
    console.error("Error updating anime:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

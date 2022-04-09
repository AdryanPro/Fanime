const router = require("express").Router();
const Anime = require("../models/Anime.model");
const User = require("../models/User.model");
const axios = require("axios");

// function range(start, end) {
//   return Array(end - start + 1)
//     .fill()
//     .map((_, idx) => start + idx);
// }
//let num = range(1, 1977);
//console.log(num);
router.get("/home", async (req, res, next) => {
  try {
    //const number = Math.floor(Math.random() * 20) + 5;
    // const animes = await axios.get(
    //   `https://kitsu.io/api/edge/anime?page[limit]=20`
    // );
    const popularity = await axios.get(
      "https://kitsu.io/api/edge/anime?sort=popularityRank;page[limit]=20"
    );
    const popularityAnime = popularity.data.data;

    const shounen = await axios.get(
      `https://kitsu.io/api/edge/anime?sort=popularityRank;filter[categories]=shounen;page[limit]=20`
    );
    const shounenAnime = shounen.data.data;

    const seinen = await axios.get(
      "https://kitsu.io/api/edge/anime?sort=popularityRank;filter[categories]=seinen;page[limit]=20"
    );
    const seinenAnime = seinen.data.data;

    const shoujo = await axios.get(
      "https://kitsu.io/api/edge/anime?sort=popularityRank;filter[categories]=shoujo;page[limit]=20"
    );
    const shoujoAnime = shoujo.data.data;

    const sports = await axios.get(
      "https://kitsu.io/api/edge/anime?sort=popularityRank;filter[categories]=sports;page[limit]=20"
    );
    const sportsAnime = sports.data.data;

    res.json({
      popularityAnime,
      shounenAnime,
      seinenAnime,
      shoujoAnime,
      sportsAnime,
    });
  } catch (err) {
    res.status(400).json({
      errorMessage: "Error in fetching animes from server! " + err.message,
    });
  }
});

router.post("/saveFavoriteAnime", async (req, res) => {
  //console.log(req.body);
  try {
    const newAnime = await new Anime({
      canonicalTitle: req.body.canonicalTitle,
      synopsis: req.body.synopsis,
      coverImage: req.body.coverImage,
    });
    await newAnime.save();
    //  console.log(newAnime);
    const userId = req.session.currentUser._id;
    // const userId= '624edb94825a668c62728cc8'
    const user = await User.findById(userId);
    console.log(newAnime._id);
    user.favoriteAnimes.push(newAnime._id);
    await user.save();
    res.json("Favourite Anime added");
  } catch (err) {
    res.status(400).json({
      errorMessage: "Error in adding to favorites" + err.message,
    });
  }
});

// router.post("/createanime", async (req, res, next) => {
//   try {
//     const {  canonicalTitle,  synopsis } = req.body;
//     console.log("Should create a new anime with", canonicalTitle,  synopsis);
//     const newAnime = new Anime({ canonicalTitle,  synopsis });
//     await newAnime.save();
//     res.json({ message: "Succesfully created anime", anime: newAnime });
//   } catch (err) {
//     res.status(400).json({
//       errorMessage: "Please provide correct request body! " + err.message,
//     });
//   }
// });

router.delete("/deleteAnime", async (req, res, next) => {
  console.log(req.body);
  try {
    const { id } = req.body;
    await Anime.findByIdAndDelete(id);
    res.json({ message: "Successfully delete anime " + id });
  } catch (err) {
    res
      .status(400)
      .json({ errorMessage: "Error in deleting anime! " + err.message });
  }
});

module.exports = router;

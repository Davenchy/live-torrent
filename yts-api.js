const router = require("express").Router();
const axios = require("axios").default;

router.get("/list", (req, res) => {
  const { query: q } = req;
  axios
    .get("https://yts.lt/api/v2/list_movies.json", {
      params: {
        query_term: q.query || q.q || 0,
        page: q.page || q.p || 1,
        genre: q.genre || q.g || "all",
        limit: q.limit || q.l || 20,
        minimum_rating: q.rate || q.r || 0,
        sort_by: q.sort || q.s || "date_added",
        order_by: q.order || q.o || "desc",
        with_rt_ratings: true
      }
    })
    .then(r => res.send(r.data))
    .catch(err => res.status(400).send(err));
});

router.get("/movie/:id", (req, res) =>
  axios
    .get("https://yts.lt/api/v2/movie_details.json", {
      params: {
        with_images: true,
        with_cast: true,
        movie_id: req.params.id
      }
    })
    .then(r => res.send(r.data))
    .catch(err => res.status(400).send(err))
);

router.get("/movie/:id/suggestions", (req, res) =>
  axios
    .get("https://yts.lt/api/v2/movie_suggestions.json", {
      params: {
        movie_id: req.params.id
      }
    })
    .then(r => res.send(r.data))
    .catch(err => res.status(400).send(err))
);

module.exports = router;

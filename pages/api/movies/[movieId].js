import nextConnect from 'next-connect'
import { dbMiddleware } from "../../../middlewares/dbMiddleware"
import { getMovie, putMovie, deleteMovie } from "../../../controllers/movieController"

const handler = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(async (req, res, next) => {
    await dbMiddleware(req, res, next);
  })
  .get(async (req, res) => {
    const result = await getMovie(req.query.movieId);
    res.send(result);
  })
  .put(async (req, res) => {
    const result = await putMovie(req);
    res.send(result);
  })
  .delete(async (req, res) => {
    const result = await deleteMovie(req);
    res.send(result);
    // try {
    //   const deletedMovie = await deleteMovie(req);
    //   if (!deletedMovie) {
    //     return res.status(400).end()
    //   }
    //   res.send(result);
    // } catch (error) {
    //   res.status(400).end()
    // }
  })

  export default handler;
import nextConnect from 'next-connect'
import { dbMiddleware } from "../../../middlewares/dbMiddleware"
import { getSessions, postSession } from "../../../controllers/sessionController"

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
    const result = await getSessions(req.query.cinemaId);
    res.send(result);
  })
  .post(async (req, res) => {
    const result = await postSession(req);
    res.send(result);
  });

  export default handler;
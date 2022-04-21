import { removeCinemaFromMovie, updateMoviesByCinemas } from "../../../controllers/movieController";

import { dbMiddleware } from "../../../middlewares/dbMiddleware";
import nextConnect from "next-connect";

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
	.put(async (req, res) => {
		const result = await updateMoviesByCinemas(req);
		res.send(result);
	})
	.delete(async (req, res) => {
		const result = await removeCinemaFromMovie(req);
		res.send(result);
	});

export default handler;

import { deleteSession, getMovieSession, putSession } from "../../../controllers/sessionController";

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
	.get(async (req, res) => {
		const result = await getMovieSession(req.query.sessionId);
		res.send(result);
	})
	.put(async (req, res) => {
		const result = await putSession(req);
		res.send(result);
	})
	.delete(async (req, res) => {
		const result = await deleteSession(req);
		res.send(result);
	});

export default handler;

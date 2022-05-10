import { deleteRoom, getRoom, putRoom } from "../../../../../../controllers/roomController";

import { dbMiddleware } from "../../../../../../middlewares/dbMiddleware";
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
		const result = await getRoom(req.query.roomId);
		res.send(result);
	})
	.put(async (req, res) => {
		const result = await putRoom(req);
		res.send(result);
	})
	.delete(async (req, res) => {
		const result = await deleteRoom(req);
		res.send(result);
	});

export default handler;

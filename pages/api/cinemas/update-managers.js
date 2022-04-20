import nextConnect from "next-connect";
import { dbMiddleware } from "../../../middlewares/dbMiddleware";
import { updateCinemas } from "../../../controllers/cinemaController";

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
		const result = await updateCinemas(req);
		res.send(result);
	});

export default handler;

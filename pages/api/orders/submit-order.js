import { dbMiddleware } from "../../../middlewares/dbMiddleware";
import nextConnect from "next-connect";
import { submitOrder } from "../../../controllers/orderController";

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
	.post(async (req, res) => {
		const result = await submitOrder(req);
		res.send(result);
	});

export default handler;

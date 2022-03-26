import dbConnect from "../lib/dbConnect";

export function jsonify(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export async function dbMiddleware(req, res, next) {
  try {
    await dbConnect();
  } catch (error) {
    res.json(500).end("Failed connecting to database.");
  }
  next();
}

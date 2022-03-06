import dbConnect from '../../../lib/dbConnect'
import Cinema from '../../../models/Cinema'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const cinemas = await Cinema.find({}) /* find all the data in our database */
        res.status(200).json({ success: true, data: cinemas })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const cinema = await Cinema.create(
          req.body
        ) /* create a new model in the database */
        res.status(201).json({ success: true, data: cinema })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
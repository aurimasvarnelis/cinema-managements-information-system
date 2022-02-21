import dbConnect from '../../../lib/dbConnect'
import Theater from '../../../models/Theater'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const theaters = await Theater.find({}) /* find all the data in our database */
        res.status(200).json({ success: true, data: theaters })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const theater = await Theater.create(
          req.body
        ) /* create a new model in the database */
        res.status(201).json({ success: true, data: theater })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
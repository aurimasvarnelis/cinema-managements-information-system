import dbConnect from '../../../lib/dbConnect'
import Theater from '../../../models/Theater'

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const theater = await Theater.findById(id)
        if (!theater) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: theater })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its ID */:
      try {
        const theater = await Theater.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!theater) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: theater })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedTheater = await Theater.deleteOne({ _id: id })
        if (!deletedTheater) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}
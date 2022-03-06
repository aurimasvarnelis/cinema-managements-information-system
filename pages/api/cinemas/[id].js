import dbConnect from '../../../lib/dbConnect'
import Cinema from '../../../models/Cinema'

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const cinema = await Cinema.findById(id)
        if (!cinema) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: cinema })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its ID */:
      try {
        const cinema = await Cinema.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!cinema) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: cinema })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedCinema = await Cinema.deleteOne({ _id: id })
        if (!deletedCinema) {
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
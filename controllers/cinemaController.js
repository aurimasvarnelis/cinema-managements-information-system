import Cinema from "../models/Cinema"

async function getCinemas() {
  const cinemas = await Cinema.find({})
  return cinemas;
}

async function getCinema(cinemaId) {
  const cinema = await Cinema.findById(cinemaId)
  return cinema;
}

async function postCinema(req) {
  const cinema = await Cinema.create(
    req.body
  )
  return cinema;
}

async function putCinema(req) {
  const cinema = await Cinema.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  })
  return cinema;
}

async function deleteCinema(req) {
  const deletedCinema = await Cinema.deleteOne({ _id: req.query.id })
  return deletedCinema;
}

module.exports = {
  getCinemas,
  getCinema,
  postCinema,
  putCinema,
  deleteCinema
}
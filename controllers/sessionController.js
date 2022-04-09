import Session from "../models/Session"

export async function getSessions(cinemaId) {
  const sessions = await Session.find({ cinema_id: cinemaId }).exec();
  return sessions;
}

export async function getSession(req) {
  const session = await Session.findById(req.query.sessionId)
  return session;
}

export async function postSession(req) {
  const session = await Session.create({
    ...req.body,
    cinema_id: req.query.cinemaId,
  })
  return session;
}

export async function putSession(req) {
  const session = await Session.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  })
  return session;
}

export async function deleteSession(req) {
  const deletedSession = await Session.deleteOne({ _id: req.query.id })
  return deletedSession;
}

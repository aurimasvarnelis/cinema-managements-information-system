import Session from "../models/Session";

export async function getSessions(cinemaId) {
	const sessions = await Session.find({ cinema_id: cinemaId }).exec();
	return sessions;
}

export async function getSessionsByMovie(cinemaId, movieId) {
	const sessions = await Session.find({
		cinema_id: cinemaId,
		movie_id: movieId,
	}).exec();
	return sessions;
}

export async function getMovieSession(sessionId) {
	const session = await Session.findById(sessionId).lean();
	return session;
}

export async function postSession(req) {
	const session = await Session.create(req.body);
	return session;
}

export async function putSession(req) {
	const session = await Session.findByIdAndUpdate(req.query.sessionId, req.body, {
		new: true,
		runValidators: true,
	});
	return session;
}

export async function deleteSession(req) {
	const deletedSession = await Session.deleteOne({ _id: req.query.sessionId });
	return deletedSession;
}

export async function getTicketTypes() {
	const ticketTypes = await Session.schema.path("ticket_types.ticket_type_name").options.enum;
	return ticketTypes;
}

export async function getSessionsByCinemas(cinemasIds) {
	const filteredSessions = [];
	for (let i = 0; i < cinemasIds.length; i++) {
		const sessions = await Session.find({
			cinema_id: cinemasIds[i],
		});
		filteredSessions.push(sessions);
	}

	return filteredSessions;
}

import { db } from '$lib/server/db/db';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	// Fetch users from database
	const currentUser = db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, params.id)
	});

	if (!currentUser) {
		throw redirect(302, '/users');
	}

	return { currentUser };
};

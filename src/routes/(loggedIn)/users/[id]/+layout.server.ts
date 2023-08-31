import { authGuard } from '$lib/server/authGuard.js';
import { db } from '$lib/server/db/db';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const user = authGuard({ locals, requireAdmin: false });
	// Fetch users from database
	const currentUser = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, params.id),
		with: { userOrderConfig: true }
	});

	if (!currentUser) {
		if (user.admin) {
			throw redirect(302, '/users');
		}
		throw redirect(302, '/home');
	}
	if (user.userId !== currentUser.id && !user.admin) {
		throw redirect(302, '/home');
	}

	return { currentUser };
};

import { useCombinedAuthGuard, type AuthRouteOptions } from '$lib/server/authGuard.js';
import { db } from '$lib/server/db/db';
import { logging } from '$lib/server/logging.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, route, params }) => {
	useCombinedAuthGuard({
		locals,
		route: route as AuthRouteOptions,
		customValidation: (valid) => {
			logging.info('customValidation', valid);

			return {
				admin: valid.admin || locals.user?.userId === params.id,
				user: valid.user
			};
		}
	});

	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const user = locals.user;

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

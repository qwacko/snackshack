import { authGuard } from '$lib/server/authGuard.js';

export const load = async ({ locals }) => {
	authGuard({ locals, requireAdmin: false });

	return { loggedInUser: locals.user };
};

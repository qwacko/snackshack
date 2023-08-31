import { authGuard } from '$lib/server/authGuard.js';
import { db } from '$lib/server/db/db';

export const load = async ({ locals }) => {
	authGuard({ locals, requireAdmin: true });

	// Fetch users from database
	const users = await db.query.user.findMany({
		orderBy: (userTable, { asc }) => [asc(userTable.username)],
		with: { userOrderConfig: true }
	});

	return { users };
};

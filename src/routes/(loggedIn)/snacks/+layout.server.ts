import { authGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';
import { snackGroup } from '$lib/server/db/schema/snackSchema.js';
import { asc } from 'drizzle-orm';

export const load = ({ locals }) => {
	authGuard({ locals, requireAdmin: true });

	return {
		snackGroups: db.query.snackGroup.findMany({
			orderBy: [asc(snackGroup.title)]
		})
	};
};

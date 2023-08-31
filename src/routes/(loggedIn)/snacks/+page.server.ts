import { authGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';

export const load = async ({ locals }) => {
	authGuard({ locals, requireAdmin: true });
	return {
		snacks: db.query.snack.findMany({
			orderBy: (snackTable, { asc }) => [asc(snackTable.title)],
			with: {
				snackGroup: true
			}
		})
	};
};

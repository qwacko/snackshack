import { authGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';

export const load = ({ locals }) => {
	authGuard({ locals, requireAdmin: true });

	return {
		groups: db.query.snackGroup.findMany({
			orderBy: (snackGroupTable, { asc }) => [asc(snackGroupTable.title)]
		})
	};
};

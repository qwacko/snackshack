import { useCombinedAuthGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route });
	return {
		snacks: db.query.snack.findMany({
			orderBy: (snackTable, { asc }) => [asc(snackTable.title)],
			with: {
				snackGroup: true
			}
		})
	};
};

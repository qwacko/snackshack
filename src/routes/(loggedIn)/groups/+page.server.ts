import { useCombinedAuthGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route });

	return {
		groups: db.query.snackGroup.findMany({
			orderBy: (snackGroupTable, { asc }) => [asc(snackGroupTable.title)]
		})
	};
};

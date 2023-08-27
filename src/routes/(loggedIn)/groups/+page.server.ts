import { db } from '$lib/server/db/db';

export const load = () => ({
	groups: db.query.snackGroup.findMany({
		orderBy: (snackGroupTable, { asc }) => [asc(snackGroupTable.title)]
	})
});

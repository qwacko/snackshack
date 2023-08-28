import { db } from '$lib/server/db/db';

export const load = () => ({
	snackGroups: db.query.snackGroup.findMany({
		orderBy: (snackGroupTable, { asc }) => [asc(snackGroupTable.title)]
	})
});

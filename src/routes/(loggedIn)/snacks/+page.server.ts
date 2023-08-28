import { db } from '$lib/server/db/db';

export const load = async () => ({
	snacks: db.query.snack.findMany({
		orderBy: (snackTable, { asc }) => [asc(snackTable.title)],
		with: {
			snackGroup: true
		}
	})
});

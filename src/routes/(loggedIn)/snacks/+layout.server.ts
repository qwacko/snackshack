import { useCombinedAuthGuard, type AuthRouteOptions } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';
import { snackGroup } from '$lib/server/db/schema/snackSchema.js';
import { asc } from 'drizzle-orm';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route: route as AuthRouteOptions });

	return {
		snackGroups: db.query.snackGroup.findMany({
			orderBy: [asc(snackGroup.title)]
		})
	};
};

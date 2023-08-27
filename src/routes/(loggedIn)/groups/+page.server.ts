import { db } from '$lib/server/db/db';
import { snackGroup } from '$lib/server/db/schema';

export const load = () => ({
	groups: db.select().from(snackGroup).all()
});

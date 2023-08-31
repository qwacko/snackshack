import { dbAdminCount, dbUserCount } from '$lib/server/db/actions/firstUser';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	const userCountValue = await dbUserCount();
	const adminCountValue = await dbAdminCount();
	return {
		user,
		userCount: userCountValue,
		adminCount: adminCountValue
	};
};

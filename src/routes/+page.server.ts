import { logging } from '$lib/server/logging.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = await locals.auth.validate();

	logging.info("Running '/' Load Function");

	if (user) {
		throw redirect(302, '/groups');
	} else {
		throw redirect(302, '/login');
	}

	return { user };
};

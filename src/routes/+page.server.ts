import { logging } from '$lib/server/logging.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.user;

	logging.info("Running '/' Load Function");

	if (user) {
		throw redirect(302, '/home');
	} else {
		throw redirect(302, '/login');
	}

	return { user };
};

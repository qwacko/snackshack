import { useCombinedAuthGuard, type AuthRouteOptions } from '$lib/server/authGuard';
import { initateCronJobs } from '$lib/server/cron/cron';
import { dbNoAdmins } from '$lib/server/db/actions/firstUser';
import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runningJobs = initateCronJobs();

export const handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware

	event.locals.auth = auth.handleRequest(event);

	const [user, noAdmin] = await Promise.all([event.locals.auth.validate(), dbNoAdmins()]);

	event.locals.user = user?.user;

	if (!event.route.id) {
		throw redirect(302, '/(loggedOut)/login');
	}
	if (event.route.id !== '/(loggedOut)/firstUser' && noAdmin) {
		throw redirect(302, '/(loggedOut)/firstUser');
	}

	if (event.route.id) {
		useCombinedAuthGuard({ locals: event.locals, route: event.route as AuthRouteOptions });
	}

	// if (event.route.id === '/') {
	// 	if (noAdmin) {
	// 		return Response.redirect(`${event.url.origin}/firstUser`, 302);
	// 	}
	// 	if (user) {
	// 		return Response.redirect(`${event.url.origin}/home`, 302);
	// 	} else {
	// 		return Response.redirect(`${event.url.origin}/login`, 302);
	// 	}
	// }

	// if (noAdmin && !event.route.id?.startsWith('/(loggedOut)/firstUser')) {
	// 	logging.info('No Admin Exists - Redirecting to First User Creation');
	// 	return Response.redirect(`${event.url.origin}/firstUser`, 302);
	// }

	// if (!noAdmin && event.route.id?.startsWith('/(loggedOut)/firstUser')) {
	// 	logging.info('Admin Exists - Redirecting to Home');
	// 	if (user) {
	// 		return Response.redirect(`${event.url.origin}/home`, 302);
	// 	} else {
	// 		return Response.redirect(`${event.url.origin}/login`, 302);
	// 	}
	// }

	// if (event.route.id?.startsWith('/(loggedIn)') && !user) {
	// 	logging.info('User Not Logged In - Redirecting to Login');
	// 	return Response.redirect(`${event.url.origin}/login`, 302);
	// }

	// if (event.route.id?.startsWith('/(loggedOut)') && user) {
	// 	logging.info('User Logged In - Redirecting to User');
	// 	return Response.redirect(`${event.url.origin}/home`, 302);
	// }

	return await resolve(event);
};

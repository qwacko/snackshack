import {  useCombinedAuthGuard, type AuthRouteOptions } from '$lib/server/authGuard.js';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route: route as AuthRouteOptions });

	return { loggedInUser: locals.user };
};

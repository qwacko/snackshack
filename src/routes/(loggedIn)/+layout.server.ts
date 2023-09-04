import { useCombinedAuthGuard, type AuthRouteOptions } from '$lib/server/authGuard.js';
import { orderingPeriodText } from '$lib/server/generateOrderingPeriodText.js';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route: route as AuthRouteOptions });

	return { loggedInUser: locals.user, orderingTexts: orderingPeriodText };
};

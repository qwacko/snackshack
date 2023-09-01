import { redirect } from '@sveltejs/kit';

export const authGuard = ({
	locals,
	requireAdmin = true,
	redirectNonAdmin = '/home',
	redirectNonUser = '/login'
}: {
	locals: App.Locals;
	requireAdmin?: boolean;
	redirectNonAdmin?: string;
	redirectNonUser?: string;
}) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, redirectNonUser);
	}
	if (requireAdmin && !user.admin) {
		throw redirect(302, redirectNonAdmin);
	}

	return user;
};

type RouteConfig = {
	nonUserRedirect?: string;
	nonAdminRedirect?: string;
	userRedirect?: string;
	adminRedirect?: string;
	hasCustomValidation?: boolean;
};

type UserValidationOutput = { admin?: boolean; user?: boolean };

const combinedAuthGuard = <T extends { [key: string]: RouteConfig }, U extends keyof T>(
	config: T,
	validation: (locals: App.Locals) => UserValidationOutput
) => {
	return ({
		route,
		locals,
		customValidation
	}: {
		route: { id: U };
		locals: App.Locals;
		customValidation?: (prev: UserValidationOutput) => UserValidationOutput;
	}) => {
		const { admin, user } =
			customValidation === undefined ? validation(locals) : customValidation(validation(locals));
		const routeConfig = config[route.id];

		if (!routeConfig) {
			return;
		}

		if (routeConfig.hasCustomValidation && !customValidation) {
			return;
		}

		if (user !== undefined) {
			if (routeConfig.nonUserRedirect && !user) {
				throw redirect(302, routeConfig.nonUserRedirect);
			}
			if (routeConfig.userRedirect && user) {
				throw redirect(302, routeConfig.userRedirect);
			}
		}

		if (admin !== undefined) {
			if (routeConfig.nonAdminRedirect && !admin) {
				throw redirect(302, routeConfig.nonAdminRedirect);
			}
			if (routeConfig.adminRedirect && admin) {
				throw redirect(302, routeConfig.adminRedirect);
			}
		}
	};
};

const adminOnlyConfig: RouteConfig = { nonAdminRedirect: '/home', nonUserRedirect: '/login' };
const userOnlyConfig: RouteConfig = { nonUserRedirect: '/login' };
const openConfig: RouteConfig = {};
const loggedOutConfig: RouteConfig = { userRedirect: '/home' };

export const useCombinedAuthGuard = combinedAuthGuard(
	{
		'/(loggedIn)/home': userOnlyConfig,

		'/(loggedIn)/users': adminOnlyConfig,
		'/(loggedIn)/users/create': adminOnlyConfig,
		'/(loggedIn)/users/[id]': { ...adminOnlyConfig, hasCustomValidation: true },
		'/(loggedIn)/users/[id]/delete': adminOnlyConfig,
		'/(loggedIn)/users/[id]/password': { ...adminOnlyConfig, hasCustomValidation: true },

		'/(loggedIn)/backup': adminOnlyConfig,

		'/(loggedIn)/groups': adminOnlyConfig,
		'/(loggedIn)/groups/[id]': adminOnlyConfig,
		'/(loggedIn)/groups/add': adminOnlyConfig,

		'/(loggedIn)/signout': userOnlyConfig,

		'/(loggedIn)/snacks': adminOnlyConfig,
		'/(loggedIn)/snacks/[id]': adminOnlyConfig,
		'/(loggedIn)/snacks/add': adminOnlyConfig,
		'/(loggedIn)/snacks/images': adminOnlyConfig,

		'/(loggedIn)/weeks': adminOnlyConfig,

		'/(loggedOut)/login': loggedOutConfig,
		'/(loggedOut)/signup': loggedOutConfig,
		'/(loggedOut)/firstUser': loggedOutConfig,

		'/(open)/params': openConfig
	},
	(locals) => {
		return {
			admin: locals.user?.admin || false,
			user: locals.user !== undefined
		};
	}
);

export type AuthRouteOptions = Parameters<typeof useCombinedAuthGuard>[0]['route'];

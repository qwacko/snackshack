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

import { useCombinedAuthGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db.js';
import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const passwordSchema = z
	.object({
		password: z
			.string()
			.min(8)
			.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
			}),
		confirmPassword: z.string().min(8)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword']
	});

export type passwordSchemaType = typeof passwordSchema;

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route });
	const form = await superValidate(passwordSchema);

	return { form };
};

export const actions = {
	default: async ({ locals, params, request }) => {
		const form = await superValidate(request, passwordSchema);
		const currentUser = locals.user;
		const targetUserId = params.id;

		if (!form.valid) {
			return { form };
		}

		//Admin Cannot Do This
		if (!currentUser) {
			return message(form, "You're not logged in");
		}

		if (!(currentUser.userId === targetUserId) && !currentUser.admin) {
			return message(form, "You're not allowed to do this");
		}

		const targetUser = await db.query.user.findFirst({
			where: (userTable, { eq }) => eq(userTable.id, targetUserId)
		});

		if (!targetUser) {
			return message(form, 'User Not Found');
		}

		try {
			await auth.updateKeyPassword(
				'username',
				targetUser.username.toLowerCase(),
				form.data.password
			);
		} catch (e) {
			return message(form, 'Error Updating Password', { status: 400 });
		}

		throw redirect(302, `/users/${targetUserId}`);
	}
};

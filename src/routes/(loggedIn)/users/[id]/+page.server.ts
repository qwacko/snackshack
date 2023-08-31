import { updateNameSchema } from '$lib/schema/updatePasswordSchema copy.js';
import { updateUserOrderingConfigSchema } from '$lib/schema/userOrderingConfigSchema.js';
import { authGuard } from '$lib/server/authGuard.js';
import { db } from '$lib/server/db/db';
import { user, userOrderConfig } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { setMessage, superValidate } from 'sveltekit-superforms/server';

export const load = async ({ parent, locals }) => {
	authGuard({ locals, requireAdmin: false });
	const parentData = await parent();
	const orderingData = parentData.currentUser.userOrderConfig;

	const form = superValidate(orderingData, updateUserOrderingConfigSchema);
	const usernameForm = superValidate({ name: parentData.currentUser.name }, updateNameSchema);

	return {
		form,
		usernameForm
	};
};

export const actions = {
	setAdmin: async ({ params, locals }) => {
		const authUser = locals.user;
		if (!authUser || !authUser.admin || authUser.userId === params.id) {
			return;
		}

		db.update(user).set({ admin: true }).where(eq(user.id, params.id)).run();

		return;
	},
	removeAdmin: async ({ params, locals }) => {
		const authUser = locals.user;
		if (!authUser || !authUser.admin || authUser.userId === params.id) {
			return;
		}

		db.update(user).set({ admin: false }).where(eq(user.id, params.id)).run();

		return;
	},
	addOrderConfig: async ({ params, locals }) => {
		const authUser = locals.user;
		if (!authUser || !authUser.admin) {
			return;
		}

		const targetUser = await db.query.user.findFirst({
			where: (userTable, { eq }) => eq(userTable.id, params.id),
			with: { userOrderConfig: true }
		});

		if (!targetUser) {
			return;
		}

		if (targetUser.userOrderConfig) {
			db.update(userOrderConfig)
				.set({ enabled: true })
				.where(eq(userOrderConfig.id, targetUser.userOrderConfig.id))
				.run();
		} else {
			db.insert(userOrderConfig).values({ userId: params.id, id: nanoid() }).run();
		}

		return;
	},
	disableOrderConfig: async ({ params, locals }) => {
		const authUser = locals.user;
		if (!authUser || !authUser.admin) {
			return;
		}

		const targetUser = await db.query.user.findFirst({
			where: (userTable, { eq }) => eq(userTable.id, params.id),
			with: { userOrderConfig: true }
		});

		if (!targetUser) {
			return;
		}

		const currentUserOrderConfig = targetUser.userOrderConfig;

		if (!currentUserOrderConfig) {
			return;
		}

		db.update(userOrderConfig)
			.set({ enabled: false })
			.where(eq(userOrderConfig.id, currentUserOrderConfig.id))
			.run();

		return;
	},
	updateOrderingConfig: async ({ params, request, locals }) => {
		const form = await superValidate(request, updateUserOrderingConfigSchema);

		const authUser = locals.user;
		if (!authUser) {
			return setMessage(form, 'You must be logged in to do that');
		}

		if (!authUser.admin) {
			return setMessage(form, 'You must be an admin to do that');
		}

		const targetUser = await db.query.user.findFirst({
			where: (userTable, { eq }) => eq(userTable.id, params.id),
			with: { userOrderConfig: true }
		});

		if (!targetUser) {
			return setMessage(form, 'User not found');
		}

		if (!targetUser.userOrderConfig) {
			return setMessage(form, 'User does not have an ordering config');
		}

		db.update(userOrderConfig)
			.set(form.data)
			.where(eq(userOrderConfig.id, targetUser.userOrderConfig.id))
			.run();

		return { form };
	},
	updateName: async ({ params, request, locals }) => {
		const usernameForm = await superValidate(request, updateNameSchema);

		const authUser = locals.user;
		if (!authUser) {
			return setMessage(usernameForm, 'You must be logged in to do that');
		}

		if (!authUser.admin) {
			return setMessage(usernameForm, 'You must be an admin to do that');
		}

		db.update(user).set({ name: usernameForm.data.name }).where(eq(user.id, params.id)).run();

		return { usernameForm };
	}
};

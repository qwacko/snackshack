import { db } from '$lib/server/db/db';
import { snackGroup } from '$lib/server/db/schema';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { updateGroupSchema } from '$lib/schema/updateGroupSchema';
import { logging } from '$lib/server/logging';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { useCombinedAuthGuard } from '$lib/server/authGuard';

export const load = async ({ locals, route, params }) => {
	useCombinedAuthGuard({ locals, route });

	const groupInfo = await db.query.snackGroup.findFirst({
		where: (snackGroupInt, { eq }) => eq(snackGroupInt.id, params.id)
	});

	if (!groupInfo) {
		throw redirect(302, '/groups');
	}

	const form = await superValidate(
		{ title: groupInfo.title, limit: groupInfo.limit || undefined },
		updateGroupSchema
	);

	return {
		groupInfo,
		form
	};
};

export const actions = {
	update: async ({ request, params }) => {
		const form = await superValidate(request, updateGroupSchema);

		if (!form.valid) {
			return { form };
		}

		try {
			await db
				.update(snackGroup)
				.set({ ...form.data })
				.where(eq(snackGroup.id, params.id))
				.execute();
		} catch (e) {
			logging.error('Error Updating Group', e);
			return setError(form, 'title', 'Update Error');
		}
		throw redirect(302, '/groups');
	},
	delete: async ({ params }) => {
		await db.delete(snackGroup).where(eq(snackGroup.id, params.id)).execute();
		throw redirect(302, '/groups');
	}
};

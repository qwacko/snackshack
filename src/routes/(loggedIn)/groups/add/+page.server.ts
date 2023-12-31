import { db } from '$lib/server/db/db';
import { snackGroup } from '$lib/server/db/schema';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { nanoid } from 'nanoid';
import { addGroupSchema } from '$lib/schema/addGroupSchema';
import { logging } from '$lib/server/logging';
import { redirect } from '@sveltejs/kit';
import { useCombinedAuthGuard } from '$lib/server/authGuard.js';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route });

	return {
		addForm: superValidate(addGroupSchema)
	};
};

export const actions = {
	add: async ({ request }) => {
		const form = await superValidate(request, addGroupSchema);

		if (!form.valid) {
			return { form };
		}

		try {
			await db
				.insert(snackGroup)
				.values({ ...form.data, id: nanoid() })
				.execute();
		} catch (e) {
			logging.error('Error Adding Group', e);
			return setError(form, 'title', 'Group Name Already Exists');
		}
		throw redirect(302, '/groups');
	}
};

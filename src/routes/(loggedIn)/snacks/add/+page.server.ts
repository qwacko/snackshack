import { db } from '$lib/server/db/db';
import { snack } from '$lib/server/db/schema';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { nanoid } from 'nanoid';
import { addSnackSchema } from '$lib/schema/addSnackSchema';
import { logging } from '$lib/server/logging';
import { redirect } from '@sveltejs/kit';
import { useCombinedAuthGuard } from '$lib/server/authGuard.js';

export const load = async ({ locals, route }) => {
	useCombinedAuthGuard({ locals, route });

	return {
		form: superValidate(addSnackSchema)
	};
};

export const actions = {
	add: async ({ request }) => {
		const form = await superValidate(request, addSnackSchema);

		if (!form.valid) {
			return { form };
		}

		try {
			await db
				.insert(snack)
				.values({ ...form.data, id: nanoid() })
				.execute();
		} catch (e) {
			logging.error('Error Adding Snack', e);
			return setError(form, 'title', 'Snack Name Already Exists (Or Other Error)');
		}
		throw redirect(302, '/snacks');
	}
};

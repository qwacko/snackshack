import { db } from '$lib/server/db/db.js';
import { redirect } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { updateSnackSchema } from '$lib/schema/updateSnackSchema.js';
import { snack } from '$lib/server/db/schema/snackSchema.js';
import { eq } from 'drizzle-orm';
import { logging } from '$lib/server/logging.js';

export const load = async ({ params }) => {
	const snack = await db.query.snack.findFirst({
		where: (snackTable, { eq }) => eq(snackTable.id, params.id),
		with: {
			snackGroup: true
		}
	});

	if (!snack) {
		throw redirect(302, '/snacks');
	}

	const form = await superValidate(snack, updateSnackSchema);

	return {
		form,
		snack
	};
};

export const actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, updateSnackSchema);

		if (!form.valid) {
			return { form };
		}

		try {
			await db.update(snack).set(form.data).where(eq(snack.id, params.id));
		} catch (e) {
			logging.error('Error Updating Snack', e);
			return setError(form, 'title', 'Update Error');
		}

		throw redirect(302, '/snacks');
	}
};

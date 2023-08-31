import { db } from '$lib/server/db/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { updateSnackSchema } from '$lib/schema/updateSnackSchema.js';
import { snack } from '$lib/server/db/schema/snackSchema.js';
import { eq } from 'drizzle-orm';
import { logging } from '$lib/server/logging.js';
import { writeFileSync } from 'fs';
import { nanoid } from 'nanoid';
import { serverEnv } from '$lib/server/serverEnv.js';
import { authGuard } from '$lib/server/authGuard';

export const load = async ({ params, locals }) => {
	authGuard({ locals, requireAdmin: true });
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
	updateSnack: async ({ request, params }) => {
		const form = await superValidate(request, updateSnackSchema);

		if (!form.valid) {
			return { form };
		}

		try {
			//Deleted because it defaults to null which means this is cleared when it shouldn't be.
			delete form.data.imageFilename;
			await db.update(snack).set(form.data).where(eq(snack.id, params.id));
		} catch (e) {
			logging.error('Error Updating Snack', e);
			return setError(form, 'title', 'Update Error');
		}

		throw redirect(302, '/snacks');
	},
	updateImage: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		const formID = formData.id as string;

		if (!formID) {
			return fail(400, {
				error: true,
				message: 'You must provide a snack ID'
			});
		}

		if (!(formData.file as File).name || (formData.file as File).name === 'undefined') {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		if (formData.file instanceof File) {
			const imageId = nanoid();
			const imageFilename = `${imageId}-${formData.file.name}`;
			writeFileSync(
				`${serverEnv.UPLOAD_LOCATION}${imageFilename}`,
				Buffer.from(await formData.file.arrayBuffer())
			);

			await db.update(snack).set({ imageFilename }).where(eq(snack.id, formID));
		}
	}
};

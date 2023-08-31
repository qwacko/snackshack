import { backupDB, deleteBackup, getBackupList, restoreDB } from '$lib/server/db/db.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const parentData = await parent();

	if (!parentData.loggedInUser?.user.admin) {
		throw redirect(302, '/home');
	}
	const backupFiles = getBackupList();

	return { backupFiles };
};

export const actions = {
	backup: async ({ request }) => {
		const formData = await request.formData();
		const backupName = formData.get('backupName')?.toString();

		const backupNameValidated = backupName && backupName.length > 0 ? backupName : 'Manual Backup';

		await backupDB(backupNameValidated);
	},
	restore: async ({ request }) => {
		const formData = await request.formData();
		const backupName = formData.get('backupName')?.toString();

		if (backupName) {
			await restoreDB(backupName);
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const backupName = formData.get('backupName')?.toString();

		if (backupName) {
			await deleteBackup(backupName);
		}
	}
};

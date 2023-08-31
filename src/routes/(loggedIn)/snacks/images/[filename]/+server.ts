import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync } from 'fs';
import { logging } from '$lib/server/logging';
import { serverEnv } from '$lib/server/serverEnv';

export const GET = (async ({ params }) => {
	let img: Buffer;

	try {
		img = readFileSync(`${serverEnv.UPLOAD_LOCATION}${params.filename}`);
	} catch (e) {
		logging.error('Getting Image : Error reading file', e);
		throw error(500, 'Image not found');
	}

	return new Response(img);
}) satisfies RequestHandler;

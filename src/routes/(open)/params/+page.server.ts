import { useCombinedAuthGuard } from '$lib/server/authGuard';
import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { searchSchema } from './searchSchema';

export const load = async ({ locals, route, url }) => {
	useCombinedAuthGuard({ locals, route });
	const processedParams = validateSearchParams(url, searchSchema.passthrough().parse);

	const data = processedParams;

	return { searchData: data };
};

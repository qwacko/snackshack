export const load = async ({ locals }) => ({ loggedInUser: await locals.auth.validate() });

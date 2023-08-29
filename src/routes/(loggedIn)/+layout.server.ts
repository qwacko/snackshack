export const load = async ({ locals }) => ({ loggedInUser: locals.auth.validate() });

/**
 * Where the landing page hands a visitor over to the product.
 *
 * The page used to end at a form: name, email, WhatsApp, and a promise to be
 * told when we launch. That made sense before the platform existed. It is now
 * live, so collecting an address in order to email somebody a link is a step
 * that exists only to be waited through — the link is the thing, and every CTA
 * here is now that link.
 *
 * A plain constant rather than an env var. The landing site redeploys whenever
 * its content changes anyway, and NEXT_PUBLIC_* values are frozen into the
 * bundle at build time regardless — so an env var would buy nothing here except
 * a second place to look when this is wrong.
 */
export const PLATFORM_URL = "https://elmadhi-platform.vercel.app";

/**
 * The exact door. `?mode=signup` opens the signup form rather than the sign-in
 * one: everybody arriving from here is new by definition, and landing them on
 * "Sign in" asks them to find the small "create one" link before they can do
 * the thing they just clicked a button to do.
 */
export const JOIN_URL = `${PLATFORM_URL}/login?mode=signup`;

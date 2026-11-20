// Partner / affiliate slots and Amazon tag. Everything stays invisible until a url / tag is set.
// Add the approved tracking link to "url" (and the programme name to "partner"), commit, push: Cloudflare deploys it.
export type OfferSlotId = "password-manager";
export type OfferSlot = { heading: string; body: string; cta: string; url: string; partner: string };
export const OFFER_SLOTS: Record<OfferSlotId, OfferSlot> = {
  // Proton partners programme: shown on password-manager status pages.
  "password-manager": {
    heading: "Looking for an alternative to {context}?",
    body: "Proton Pass is an end-to-end encrypted password manager from Proton, the Swiss company behind Proton Mail. It has a free plan and can import from other password managers.",
    cta: "See Proton Pass",
    url: "",
    partner: "Proton",
  },
};
/** Status pages (service ids) that show the password-manager slot. */
export const PASSWORD_MANAGER_PAGES = new Set(["lastpass", "onepassword"]);
export const OFFER_LINKS: Record<string, string> = {};
export const AMAZON = { tag: "", domain: "www.amazon.com" };

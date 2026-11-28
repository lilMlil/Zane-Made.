# Zane Made

A React, TypeScript and Vite storefront for handmade textiles from Latvia. The catalog, photography and prices are samples.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Run `npm run build` for TypeScript checking and a production build, then `npm run preview` to serve that build locally. Static hosting should serve `dist/` and rewrite application URLs such as `/product/sunday` to `index.html`.

## Update the storefront

- Edit [src/catalog.ts](src/catalog.ts) to change product names, sample EUR prices, materials, colors, dimensions, production times, and image keys. Keep product IDs stable so saved cart items can still resolve.
- Replace the generated WebP images in [public/images](public/images) with your own photography. The product gallery uses a full photo and a detail image. Image keys in the catalog match filenames without the `.webp` extension.
- Update the announcement, founder story, and contact email in the `brand` object in [src/catalog.ts](src/catalog.ts).
- Review the homepage and Our Story copy in [src/editorial.tsx](src/editorial.tsx). Finalize policy drafts and FAQ in [src/forms.tsx](src/forms.tsx).
- Set the homepage metadata in [index.html](index.html). Route-specific metadata is set through `PageMeta`.

## Integrations before launch

- **Inventory and orders.** Connect a catalog and order backend. Validate product IDs, options, quantities and availability on the server and calculate all prices there. The current cart stores only product IDs, colors and quantities in browser storage.
- **Checkout and payments.** Implement the `CommerceProvider` contract in [src/services.ts](src/services.ts), connect it to the checkout form, and redirect customers to a hosted payment page such as Stripe Checkout or Shopify. Verify payment-provider webhooks server-side before confirming orders. The preview checkout collects no payment details and does not retain or transmit delivery data.
- **International sales.** Configure carrier rates, coverage, currency conversion and supported presentment currencies, tax and duty handling, delivery estimates, and tracking. The sample storefront displays EUR.
- **Email and inquiries.** Set `VITE_FORM_ENDPOINT` to a form API controlled by the brand. The front end sends multipart form data with a `kind` of `contact`, `custom` or `newsletter`. Validate all fields and uploads server-side, apply spam controls, and connect the endpoint to the appropriate mailbox. Until configured, the forms validate locally and explain the preview state.
- **Launch content.** Replace all sample products and placeholder details. Review and finalize the Shipping & Returns page before accepting orders.

## Settings and profiles

- Open `/settings` to choose light, dark, or device appearance and English, Russian, or Latvian. Preferences are saved on the current browser. Store translations are in `src/translations.ts`. When you change sample copy, add the corresponding translated entries.
- Open `/profile` to use the local preview profile. This mode saves only a display name in the current browser.
- To enable registration and sign-in, create a Supabase project with email/password auth and set `VITE_ZANE_SUPABASE_URL` and `VITE_ZANE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` or the build environment. Use the public publishable key. Enable email confirmation, add the deployed origin and its `/profile` URL to Supabase Auth's URL configuration, configure transactional email, and rebuild.
- Auth profiles use Supabase session management and user metadata. The storefront does not yet store order history or sync carts and preferences across devices.

## Restore storefront photos

Photography is temporarily disabled. Replace the sample files in `public/images` with your photos, update image keys in `src/catalog.ts` as needed, and set `showPhotography` to `true` in `src/storefront.ts`. Rebuild to restore the galleries, product photos, and editorial imagery.

Display currency is saved in the current browser. EUR is the catalog currency. Other prices use the dated ECB reference rates in `src/currency.ts`, which can be refreshed independently of the catalog. The conversion is for display. A live checkout must use amounts and exchange rates confirmed by the commerce provider.

## Edit website text

Open `/edit-text` from Settings. Find a phrase using the search box, select its language, and save. Drafts are stored in the current browser, and they appear in the storefront immediately on that device.

Use Download changes to export the draft as JSON, or Import changes to merge it into another browser. To publish, merge the exported per-language entries into `src/published-copy.json`, then build and deploy. Keep placeholders such as `{price}` intact. The editor changes copy, including names, descriptions, labels and notices. Product prices, inventory, and other structured data are managed separately.

Set `showProductPlaceholders` to `false` in `src/storefront.ts` when the individual product names, descriptions and prices are ready to display. The template labels are editable in the text editor.

## Launch checklist and hosting

- Complete the Privacy Policy, Terms of Sale, Legal Notice and the Shipping & Returns draft with the seller's details and reviewed policies before accepting live orders. Verify fiber care and sizing against the actual products.
- `.openai/hosting.json` identifies the existing ChatGPT Sites preview and its output directory. GitHub Pages uses `.github/workflows/pages.yml`. Set the optional build-time `ZANE_SITE_URL` to the canonical site URL with a trailing slash if the public address changes. On a subpath such as GitHub Pages, submit the generated sitemap URL directly to search engines. Crawlers read robots.txt from the host root.
- Use `.env.example` as a template. The form API must accept the additional `newsletter` kind with an `email` field. The server must send a time-limited confirmation link and activate the subscription only after confirmation. Custom-order `budget` values are `under-low`, `low-middle`, `middle-high`, `over-high` or empty. Interpret them using the EUR thresholds in `src/catalog.ts` regardless of display currency.
- Run `npm run lint` and `npm test` before publishing. If analytics is added later, implement consent first and load analytics only after opt-in.

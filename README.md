# BiteFlow — Vanilla JS Ordering & Pricing Engine

BiteFlow modernizes the original 2023 fast-food landing page into a dependency-free ordering demo built around explicit cart state and transparent pricing rules.

## What changed

The original project was mostly a restaurant landing page: menu cards were repeated manually, basket buttons did not manage order state, content relied heavily on Lorem Ipsum, Swiper and Bootstrap Icons were loaded from CDNs, and the JavaScript contained a stray `F` in the scroll handler.

BiteFlow turns the project into a small commerce/order-state system.

## Features

- structured menu data
- category filtering
- menu search
- persistent cart
- quantity editing
- remove-from-cart behavior
- Pickup / Delivery modes
- free-delivery threshold
- sales-tax calculation
- promo-code eligibility
- capped discount rule
- live subtotal / discount / delivery / tax / total
- localStorage persistence
- safe corrupted-state recovery
- responsive order drawer
- keyboard-visible focus
- reduced-motion support
- zero runtime dependencies

## Pricing rules

```text
cart lines
   ↓
subtotal
   ↓
promo discount
   ↓
delivery rule
   ↓
tax
   ↓
final total
```

Current demo rules:

- tax: 8.5%
- delivery fee: $4.99
- free delivery at $30 discounted subtotal
- promo: `LUNCH10`
- promo: 10% off from $20
- maximum promo discount: $5

These rules live in `assets/js/pricing.js` and are tested independently from the DOM.

## Architecture

```text
menu-data.js
     │
     ▼
order-store.js
     │
     ├── cart quantities
     ├── pickup / delivery
     └── promo state
     │
     ▼
pricing.js
     │
     ▼
persistence.js
     │
     ▼
main.js
     │
     ▼
DOM
```

## Local development

No runtime package install is required.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Tests

```bash
npm test
```

Run the complete quality gate:

```bash
npm run check
```

Coverage includes cart transitions, combined menu filtering, pickup pricing, delivery fees, promo eligibility/caps, persistence round-trips, and corrupted-storage recovery.

## CI

Every pull request and push to `main` runs JavaScript syntax checks and the Node test suite.

## GitHub Pages

Enable **Settings → Pages → Source → GitHub Actions**, then run **Actions → Deploy Pages → Run workflow**.

## Scope

BiteFlow is a front-end ordering and pricing demo. It does not process payments, transmit orders, create customer accounts, or connect to a restaurant backend.

## License

MIT.

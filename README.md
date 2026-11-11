# Velvet & Bean Co.

A single-page website for an artisanal coffee roastery in Kigali, Rwanda. Customers can browse the menu, customise drinks, build a pickup order, and send it to the cafe via WhatsApp with an MTN MoMo payment prompt. Includes a store map, customer reviews, and a demo owner portal.

## Project structure

```
velvet-and-bean/
├── index.html              # Page markup
├── css/
│   └── styles.css          # Custom styles (map sizing)
├── js/
│   ├── tailwind-config.js  # Tailwind theme: colours and fonts
│   └── app.js              # Menu, cart, checkout, reviews, map
├── images/
│   └── placeholder.svg     # Fallback shown when an image fails to load
└── README.md
```

## Running it

No build step. Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

An internet connection is required: Tailwind CSS, Google Fonts, Leaflet, OpenStreetMap tiles and the Unsplash photos are all loaded from CDNs.

## Things to customise

| What | Where |
|------|-------|
| Cafe WhatsApp number | `CAFE_WHATSAPP_NUMBER` at the top of `js/app.js` (format `2507XXXXXXXX`, no `+`) |
| Menu items and prices (RWF) | `menuItems` array in `js/app.js` |
| Brand colours and fonts | `js/tailwind-config.js` |
| Map location | `L.map(...).setView([lat, lng], zoom)` in `js/app.js` |
| Address, hours, promo code | `index.html` |
| Tax rate (8%) | `0.08` in `updateCartUI()` and `submitOrderViaMoMo()` in `js/app.js` |

## Using local images

Menu and hero photos currently load from Unsplash. To host them yourself:

1. Download the photos into the `images/` folder (for example `images/nitro-cold-brew.jpg`).
2. In `js/app.js`, change each item's `image` to the local path.
3. In `index.html`, change the hero `<img src>` the same way.

If any image fails to load, `images/placeholder.svg` is shown instead.

## Important notes

- **Payments are simulated.** The MoMo "USSD push" is only an alert; no real payment is processed. Real MTN MoMo collections need a backend using the MTN MoMo API.
- **The WhatsApp message says "Payment confirmed" regardless.** Do not use this in production without verifying payment server-side.
- **The Owner Portal is a static demo.** It has no login and shows a hard-coded sample order.
- **Reviews and the cart live in memory only.** They reset on page reload.
- The "Our Craft" nav link points to `#story`, which does not exist yet.

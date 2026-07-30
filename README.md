# GoHighLevelMastery

A launch-ready GoHighLevel learning roadmap by JM Brandify. The site includes a phase-by-phase mastery path, resource downloads, certification offers, scheduling forms, PayPal payment entry points, and Google Sheet lead capture hooks.

## Launch Files

- `index.html` - main public launch page
- `ghl-roadmap.html` - older backup roadmap page
- `resources/` - downloadable PDFs and CSV fallback data
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow

## Local Preview

Run a local web server from the repository root so CSV loading and browser APIs behave like production:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Pre-Launch Checklist

- Confirm `index.html` loads as the homepage.
- Confirm mobile layout for the hero, roadmap cards, pricing cards, and modals.
- Click several checklist items and confirm progress saves after refresh.
- Test the reset progress button.
- Confirm all PDF download links in `resources/` work.
- Confirm `resources/roadmap_sheet.csv` loads as a fallback if the live Google Sheet is unavailable.
- Submit the Operations Architecture Call form with a test lead.
- Confirm the Google Apps Script receives that lead.
- Confirm the calendar link opens correctly.
- Test both PayPal certification selections.
- Confirm the certification form unlocks after the payment flow starts/completes.
- Submit a certification test entry and confirm the Apps Script receives it.

## GitHub Pages Launch

1. Push the repo to GitHub.
2. In GitHub, open **Settings > Pages**.
3. Set the source to **GitHub Actions**.
4. Push to `main` or run the `GitHub Pages` workflow manually.
5. Open the published Pages URL and run the pre-launch checklist again.

## Live Integrations To Verify

The launch page currently references:

- Google Sheet CSV source: `1vfGGbV2wOdOCqrp0W_02poc6df7aNq1eXRpo_k63s5s`
- Booking calendar: `https://calendar.app.google/f9rWn4rqWSkt83v66`
- Operations lead Google Apps Script endpoint
- Certification submission Google Apps Script endpoint
- PayPal hosted buttons for GHL Mastery Practitioner and Operations Architect Certification

Keep those URLs current before launch.

## Privacy Note

The page collects names, emails, phone numbers, payment-related certification intent, and portfolio submission details. Before public launch, add a clear privacy/contact note and make sure your Google Sheet, Apps Script, and PayPal settings are configured for production use.

## Author

Maria Fe Blanca  
System Architect & AI Automation Developer

- LinkedIn: [Maria Fe Blanca](https://www.linkedin.com/in/maria-fe-blanca-754a1a267)
- Work inquiries: [maria@jmbrandify.com](mailto:maria@jmbrandify.com)

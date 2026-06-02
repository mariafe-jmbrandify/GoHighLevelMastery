# GoHighLevelMastery
A comprehensive, step-by-step learning path to mastering GoHighLevel (GHL) from scratch. This repository tracks my technical progression through sub-account architectures, custom landing page builds, advanced Zapier automations, and scalable snapshot deployments."
> 💡 **Pro-Tip:** If you don't have an account yet, you can use [**this link to get a 14-Day Free Trial**](https://www.gohighlevel.com?fp_ref=va-logistics45). This gives you full access to a sandbox sub-account so you can build out the funnels and workflows in Phase 2 and Phase 3!

[🚀 Upgrade to Pro Sandbox Access](https://www.gohighlevel.com?fp_ref=va-logistics45)

## 🗺️ The 12-Week Roadmap Breakdown

### 📍 Phase 1: Interface & Contacts Setup
 * **The Goal:** Master the core infrastructure of GoHighLevel. 
 * **Overview:** Learn how to comfortably navigate the agency dashboard versus sub-account views. You will master contact management, smart lists, importing/exporting lead data, and configuring essential compliance settings so your data stays organized from day one.

### 📍 Phase 2: Funnels, Pipelines & Calendars
 * **The Goal:** Build the customer-facing frontend and sales tracking backend.
 * **Overview:** Dive into the drag-and-drop page builder to create high-converting landing pages and lead forms. You'll also learn how to map out visual sales pipelines to track deals, and set up automated team calendars that eliminate back-and-forth scheduling emails.

### 📍 Phase 3: Workflows & Automation Logic ⚡
 * **The Goal:** Eliminate repetitive tasks and build hands-free business operations.
 * **Overview:** This is the heart of RevOps. You will learn to use the GHL Workflow Builder to create automated text/email follow-ups, set up conditional "if/then" logic, assign leads to team members automatically, and build triggers based on customer actions.

### 📍 Phase 4: Snapshots, SaaS Mode & Scaling
 * **The Goal:** Productize your setups and turn GHL into a scalable business model.
 * **Overview:** Learn how to bundle your entire sub-account setup (funnels, workflows, and pipelines) into a "Snapshot" that you can clone for new clients in seconds. You'll also explore SaaS Mode architecture to automatically provision accounts and resell the software.

### 📍 Phase 5: API v2, Webhooks & Custom Integrations
 * **The Goal:** Break past GHL's boundaries and connect with the external tech stack.
 * **Overview:** Transition into advanced automation by learning how to use webhooks to push data out of GHL, catch data coming from external apps, and utilize GHL’s API v2 alongside platforms like Zapier to create complex, multi-platform software ecosystems.
---

## 👩‍💻 About the Author

<table>
  <tr>
    <td width="150px">
      <!-- This line pulls your uploaded profile photo and displays it as a clean circle -->
      <img src="Maria.png" width="150px" style="border-radius: 50%;" alt="Maria Fe Blanca"/>
    </td>
    <td>
      <strong>Maria Fe Blanca</strong><br/>
      <em>Operations & Automation Specialist & Logistics Coordinator</em><br/><br/>
      I am a professional with over 8 years of experience helping businesses run smoothly by keeping projects on schedule, tracking vital documents, and managing remote teams.<br/><br/>
      I specialize in technical automation and no-code workflows. I design lead funnels, build custom CRM integrations, and deploy scalable systems using platforms like <strong>GoHighLevel</strong>, <strong>Zapier</strong>, and <strong>HubSpot</strong> to cut down office delays, eliminate messy paperwork, and ensure zero dropped balls.
    </td>
  </tr>
</table>

* 💼 **Connect with me on LinkedIn:** [Maria Fe Blanca](https://www.linkedin.com/in/maria-fe-blanca-754a1a267)
* 📬 **Work Inquiries:** [maria@jmbrandify.com](mailto:maria@jmbrandify.com)

## 📌 Preview the Roadmap

Open `index.html` in your browser to view the interactive GoHighLevel roadmap locally.

## GHL Glossary

- **Sub-Account** — a separate client workspace inside GoHighLevel that keeps CRM, funnels, and automations segmented.
- **Workflow** — an automation sequence that uses triggers, actions, delays, and conditional paths.
- **Snapshot** — a reusable backup of funnels, workflows, pipelines, and settings that can be cloned into another account.
- **Pipeline** — a visual sales board for tracking opportunities across stages.
- **Smart List** — a dynamic contact list filtered by tags, behaviors, and field values.
- **SaaS Mode** — the reseller layer that lets agencies provision and monetize sub-accounts.
- **Custom Field** — a user-defined data field for storing unique contact or opportunity details.
- **Webhook** — a push notification from GoHighLevel to an external app or service.
- **API v2** — the GoHighLevel developer API for integrations, data access, and custom apps.
- **White-label** — branding the GHL platform with your own agency identity.

## GitHub Pages Deployment

This repo now includes a GitHub Actions workflow at `.github/workflows/pages.yml` that deploys the site to the `gh-pages` branch whenever `main` is pushed.

## Spreadsheet Data Integration

A new script, `scripts/fetch_spreadsheet.py`, downloads your shared Google Sheet into `resources/roadmap_sheet.csv`. The HTML page now reads that CSV and displays a live lead tracker section when the page is loaded from a web server.

The current spreadsheet source is `1vfGGbV2wOdOCqrp0W_02poc6df7aNq1eXRpo_k63s5s`, and the schedule button uses the booking destination `https://calendar.app.google/f9rWn4rqWSkt83v66`.

## Certification Resources

The `resources/certificates/` folder now includes certification management assets:
- `certification-review-scorecard.md` — scored reviewer scorecard for certification submissions
- `certification_email_template.md` — email template for issued certifications
- `certification_followup_template.md` — follow-up email template for failed or revision-needed reviews
- `JMBrandify_GHL Practitioner_Certificate.pdf` — updated practitioner certificate with visible Certificate ID and Verification Reference
- `JMBrandify_OperationsArchitect_Certificate.pdf` — updated operations architect certificate with visible Certificate ID and Verification Reference

To use the certification automation scripts, install the Python dependencies:

```bash
pip install -r requirements.txt
```

Then run `scripts/send_cert_emails.py` with `--dry-run` first to verify behavior.

A webhook stub is also available at `scripts/webhook_stub.py` for payment and enrollment automation. It can run as a local Flask endpoint or process a sample webhook payload from disk.

## Scheduling Notifications

When the schedule form is submitted, the page looks up the lead in `resources/roadmap_sheet.csv` and restores the lead details from the spreadsheet. It also opens an email draft addressed to `maria@jmbrandify.com` so the owner can be notified right away about the new lead.

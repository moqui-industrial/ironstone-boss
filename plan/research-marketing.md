# IronStone BOSS — Marketing app research

Oct 18, 2026

Deeper research pass on the **IronStone Marketing** app (campaigns; segments and lists;
email and newsletters; promotions and coupons; content — blogs and landing pages;
surveys; campaign analytics), cataloguing every relevant screen/page found in the
reference apps. Companion to [3p-app-reference.md](3p-app-reference.md); feeds the
Marketing row in [initial-design.md](initial-design.md), the marketing face of the
shared Customer 360, and the marketing side of any channel shared with Sales, Commerce
or Comms.

**Organization.** Sorted by functional area (not by app): all campaign-planning screens
together, all audience screens together, all email composition/tracking screens
together, etc. Within each area, sub-tables per reference app.

**Scope.** Business UI only: marketing homes and calendars, campaign containers and
automation, audience lists/segments and consent, email/newsletter/SMS composition,
sending, delivery and tracking, promotions/coupons/loyalty, CMS pages, blogs, landing
pages and web forms, marketing events, surveys, campaign analytics and attribution, and
marketing configuration. Sales pipeline screens are covered by
[research-sales.md](research-sales.md); storefront merchandising by
[research-commerce.md](research-commerce.md); the mail client, calendar, contacts and
file surfaces by [research-drawers-commons.md](research-drawers-commons.md). This pass
keeps only the marketing management side of those shared records.

**Path conventions.** Paths are relative to each repository's own root, as in
3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — community addons under `odoo/addons/<addon>/`; views in `views/`, JS/OWL in `static/src/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — paths start `erpnext/<module>/` |
| **Frappe framework** | `/home/jonesde/work/moquiwork/3p_other/frappe/frappe` — doctypes under `frappe/<area>/doctype/`, website under `frappe/website/` |
| **Frappe apps** (CRM, Insights) | `/home/jonesde/work/moquiwork/3p_other/frappe` — paths start with the app: CRM SPA at `crm/frontend/src/`, Insights SPA at `insights/frontend/src2/` |
| **Twenty** | `/home/jonesde/work/moquiwork/3p_other/twenty` — paths relative to the repo root (`packages/twenty-front/src`, `packages/twenty-server/src`) |
| **Nextcloud** | `/home/jonesde/work/moquiwork/3p_other/nextcloud` — apps in `<app>/src/` (Vue 3) with PHP templates alongside; bundled apps under `server/apps/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — module pages under `htdocs/<module>/`, admin/setup under `htdocs/admin/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament resources/pages/clusters under `plugins/webkul/<plugin>/src/Filament/` |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — business windows defined in `backend/de.metas.*` SQL migrations, React WebUI in `frontend/src/` |
| **Moqui components** | `/home/jonesde/work/moquiwork/3p_moqui/<component>` — XML screens in `screen/` |

**Not used here.** Zimbra, Carbon, Ever Gauzy and Akaunting ship no
marketing/campaign/newsletter screens in this checkout; the absence is recorded in
[§11](#11-gaps--notables). No source other than Odoo covers more than a slice of the
marketing surface, so the Odoo tables are deliberately the deepest.

Sections: [1 home & calendar](#1-marketing-home-campaign-calendar--overview) ·
[2 campaigns & automation](#2-campaigns-planning--automation) ·
[3 audiences & consent](#3-segments-lists-audiences--consent) ·
[4 email, newsletters, SMS](#4-email-newsletters-sms--delivery) ·
[5 promotions & loyalty](#5-promotions-coupons-loyalty--referrals) ·
[6 content](#6-content-blogs-landing-pages-web-forms--social) ·
[7 events](#7-marketing-events--webinars) ·
[8 surveys](#8-surveys-forms--quizzes) ·
[9 analytics & attribution](#9-campaign-analytics-utm--attribution) ·
[10 configuration](#10-configuration--admin) ·
[11 gaps & notables](#11-gaps--notables)

---

## 1. Marketing home, campaign calendar & overview

### Odoo — menu-root hubs plus a real mailing calendar

Odoo has no single "Marketing" app. The marketing surface is a set of separate apps
(Email Marketing, SMS Marketing, Events, Surveys, Website, Marketing Card) that share
`utm.campaign` as the campaign key. Email Marketing is the de facto hub.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Email Marketing (root menu) | Hub with Mailings, Recipients (Mailing Lists, Mailing Contacts, Dynamic Lists), Templates, Campaigns, Reporting (Mailing Analysis, Opt-Out Report) and Configuration (Settings, Campaign Stages, UTM Tags, Link Tracker, Blacklisted Email Addresses, Optout Reasons) | `odoo/addons/mass_mailing/views/mailing_menus.xml` |
| Mailings | List/kanban/calendar/form over `mailing.mailing`; default filter "My Mailings"; path `email-marketing` | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml` (`mailing_mailing_action_mail`) |
| Mailings calendar | Month calendar coloured by state; scheduled date drives the calendar entry | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml` (`mailing_mailing_view_calendar`) |
| Campaigns | Campaign kanban grouped by stage (quick-create), list and form; shows tags, responsible and (with CRM/Sales installed) lead and revenue counters | `odoo/addons/utm/views/utm_campaign_views.xml`; `odoo/addons/mass_mailing/views/mailing_menus.xml` |
| SMS Marketing (root menu) | Parallel hub: SMS Marketing, Mailing Lists, Mailing Contacts, Campaigns, Reporting, Configuration (blacklisted phones, link tracker) | `odoo/addons/mass_mailing_sms/views/mailing_sms_menus.xml` |
| Marketing Card → Campaigns | Share-card campaign list/kanban; no calendar | `odoo/addons/marketing_card/views/card_menus.xml`; `card_campaign_views.xml` |
| Website → Reporting | Analytics and eCommerce dashboards, Visitors, Page Views | `odoo/addons/website/views/website_views.xml`; `website_visitor_views.xml` |
| Events → Reporting | Reporting hub over event registrations (Attendees) | `odoo/addons/event/views/event_menu_views.xml`; `event/views/event_registration_views.xml` |
| Surveys | List/kanban of surveys, with Share/Results/Live Session actions | `odoo/addons/survey/views/survey_survey_views.xml` |

### Frappe — campaign links in the ERPNext workspace, generic dashboards elsewhere

| Screen/page | What it is | Key files |
| --- | --- | --- |
| CRM workspace sidebar | "Campaign" section linking Campaign, Email Campaign, SMS Center, SMS Log and Email Group, plus a Campaign Efficiency report link | `erpnext/crm/workspace/crm/crm.json` |
| CRM dashboard | Generic leads/deals dashboard, not marketing-specific | `crm/frontend/src/pages/Dashboard.vue` |
| Insights dashboard | Configurable dashboard page that can host campaign charts | `insights/frontend/src2/dashboard/DashboardPage.vue`, `DashboardBuilder.vue` |

### Twenty — no marketing home; campaigns are composed from the mail side

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Compose Campaign (command menu) | Global command that opens the campaign composer | `packages/twenty-front/src/modules/command-menu-item/engine-command/global/components/ComposeCampaignCommand.tsx` |
| Message campaign record views | Generic object index (table + list) named "All Campaigns" plus record page widgets | `packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-campaign-views.util.ts` |
| Dashboards | Generic widget/layout dashboards, no marketing dashboard | `packages/twenty-front/src/modules/dashboards/`; `packages/twenty-front/src/modules/page-layout/widgets/` |

### Nextcloud — dashboard host only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboard | Widget host (API widgets); no marketing widgets | `server/apps/dashboard/src/DashboardApp.vue`, `components/ApiDashboardWidget.vue` |

### Dolibarr — module home pages act as dashboards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Mailing area home (`MailingArea`) | Target statistics, last mailings, quick links to all emailings | `htdocs/comm/mailing/index.php` |
| OpenSurvey list | Survey home: list, status (draft/opened/closed), expiry, new-survey wizard entry | `htdocs/opensurvey/list.php`; `htdocs/opensurvey/index.php` |
| Donations home | Donation/donor module landing page | `htdocs/don/index.php` |

### AureusERP — website dashboard with blog widgets

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Website dashboard | Stats overview plus blog widgets: `BlogChart`, `BlogStatusPieChart`, `BlogAuthorsChart`, `CategoriesPieChart`, `RecentBlogsTable`, `TopCategoriesTable` | `plugins/webkul/website/src/Filament/Admin/Pages/WebsiteDashboard.php`; `plugins/webkul/website/src/Filament/Admin/Widgets/` |

### metasfresh — campaign window, no marketing dashboard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Marketing Campaign / Marketing Platform windows | AD window/menu entries rendered by the generic WebUI window shell; no aggregate marketing dashboard | `backend/de.metas.marketing/base/src/main/sql/postgresql/system/90-de.metas.marketing.base/5492750_sys_gh4015-app_add_basic_tables_windows_etc.sql`; `frontend/src/components/window/` |

No material: Moqui (the coarchy and resistmanagement public sites are marketing
*surfaces*, not marketing management screens).

**BOSS implications.** No reference app has a marketing home that answers "what is
running, what is next, what is performing". Odoo comes closest with the mailings
calendar plus the campaign kanban, but they are separate menus. IronStone Marketing's
landing page should combine a campaign calendar (scheduled and live sends, events,
content drops), KPI tiles (audience growth, sends, open/click, attributed revenue) and
shortcuts, in the style of the ERPNext/AureusERP workspace pages but marketing-specific.

---

## 2. Campaigns, planning & automation

### Odoo — campaign container separate from send records

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Campaigns (`utm.campaign`) | Campaign record: title, responsible, tags, stage, colour, auto-generated flag; list + kanban grouped by stage with quick-create; opens from Email Marketing and SMS Marketing | `odoo/addons/utm/views/utm_campaign_views.xml` |
| Campaign form, CRM extension | Adds lead/opportunity count button (label switches by `use_leads`) | `odoo/addons/crm/views/utm_campaign_views.xml` |
| Campaign form, Sales extension | Adds quotation count and invoiced revenue buttons | `odoo/addons/sale/views/utm_campaign_views.xml` |
| Mailings | The send record: `mailing_type` (mail/SMS), subject, recipients, body, campaign/medium/source, A/B settings, state `draft → in_queue → sending → done` | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml` |
| Mailing test wizard | Test-send dialog | `odoo/addons/mass_mailing/wizard/mailing_mailing_test_views.xml` |
| Schedule-date wizard | Send-now vs schedule-at date picker | `odoo/addons/mass_mailing/wizard/mailing_mailing_schedule_date_views.xml` |
| A/B testing | Enable per mailing; sample percentage; winner criterion; winner scheduling; variant name; "A/B Tests" and "A/B Tests to review" filters; send winner to the remaining audience | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml`; `odoo/addons/mass_mailing/models/mailing.py` (`ab_testing_*`) |
| Card Campaign | Share-card campaign: design/template, recipient preview record, target URL, post suggestion, request/reward text, tags, responsible; counters for mailings, cards, clicks, opens and shares; Send/Preview | `odoo/addons/marketing_card/views/card_campaign_views.xml`; `marketing_card/models/card_campaign.py` |
| Events | Event records with stage kanban/calendar, tickets, communication, questions | `odoo/addons/event/views/event_event_views.xml`; `event_menu_views.xml` |
| Marketing automation | **Absent from this checkout**; only documentation pages remain (enterprise feature) | `documentation/content/applications/marketing/marketing_automation/` |
| Budget fields | **Absent** from `utm.campaign`, `mailing.mailing` and `card.campaign` (grep for `budget` / `cost` produces nothing in those models) | — |

A/B specifics: `ab_testing_pc` defaults to 10% of recipients; the campaign carries the
winner criterion (default "opened ratio") and the A/B schedule; a mailing is flagged as
the winner and can be sent to the rest of the audience.

### Frappe — Campaign ↔ Email Campaign ↔ schedule rows

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Campaign (Desk form) | Campaign name, naming series, `campaign_schedules` child rows, description; "View Leads" jumps to the mirrored UTM campaign | `erpnext/crm/doctype/campaign/campaign.json`, `campaign.js` |
| Campaign Email Schedule | Child row: `send_after_days`, `email_template` — a simple drip sequence | `erpnext/crm/doctype/campaign_email_schedule/campaign_email_schedule.json` |
| Email Campaign | Binds a Campaign to a recipient type (Lead / Contact / Email Group), a concrete recipient, a sender, start/end dates and status `Scheduled / In Progress / Completed / Unsubscribed` | `erpnext/crm/doctype/email_campaign/email_campaign.json` |
| Campaign Efficiency report | Report over campaign-driven leads/opportunities | `erpnext/crm/report/campaign_efficiency/` |
| Workflow Automations | Generic trigger → condition → step builder with trial run and run history, usable for drip/nurture | `crm/frontend/src/components/Settings/WorkflowAutomations/WorkflowAutomationBuilder.vue`, `WorkflowAutomationPage.vue`, `WorkflowAutomationRuns.vue` |
| Stages / A/B / budgets | Not present | — |

### Twenty — campaign composer with message-campaign records

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Message Campaign object | Fields: name, subject, body template, from address, lifecycle status (`DRAFT / SCHEDULED / SENDING / SENT / SENT_WITH_ERRORS / CANCELED`), scheduled/sent timestamps, sent/delivered/failed/bounced/complained/skipped counts, unique opens/clicks and rates, unsubscribe topic, message list, messages and recipients | `packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-campaign-standard-flat-field-metadata.util.ts` |
| Send Campaign side panel | Campaign composer page (details + recipients) | `packages/twenty-front/src/modules/side-panel/pages/send-campaign/components/SidePanelSendCampaignPage.tsx`, `SendCampaignForm.tsx` |
| Send Test side panel | Test-send variant page | `packages/twenty-front/src/modules/side-panel/pages/send-campaign-test/components/SidePanelSendCampaignTestPage.tsx` |
| Campaign commands | Send, send test, duplicate, cancel | `packages/twenty-front/src/modules/command-menu-item/engine-command/record/single-record/message-campaign/components/` |
| Workflow builder | Generic automation (triggers, conditions, steps, versions) | `packages/twenty-front/src/modules/workflow/` |
| Stages / A/B / budgets | Not present | — |

### Dolibarr — one-shot emailings, no campaign object

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Emailing card | Create/edit an emailing: ref, sender, subject, message, recipients, status; Test and Send actions | `htdocs/comm/mailing/card.php` |
| Emailings list | List/filter/search of past emailings | `htdocs/comm/mailing/list.php` |
| Targeting screens | Basic and advanced recipient selection (see §3) | `htdocs/comm/mailing/targetemailing.php`, `advtargetemailing.php` |
| Stages / automation / A-B / budget | Not present | — |

### metasfresh — campaign window plus an external marketing platform

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Marketing Campaign window | Campaign record with marketing platform and external record ID | `backend/de.metas.adempiere.adempiere/migration/src/main/sql/postgresql/system/10-de.metas.adempiere/5493640_sys_gh4030-marketing-campaign-window-webui.sql` |
| Marketing Platform window | Gateway configuration: client, organisation, customer number, credentials, active flag | `backend/de.metas.adempiere.adempiere/migration/src/main/sql/postgresql/system/10-de.metas.adempiere/5493510_sys_gh4030-marketing-windows-webui.sql` |
| Contact/campaign assignment processes | "Contacts of selected business partners into campaign", "Selected contacts into campaign", import/export to platform | `backend/de.metas.marketing/base/src/main/java/de/metas/marketing/base/process/` |
| Serial letters | Mail-merge letters generated from marketing contact persons | `backend/de.metas.marketing/serialletter/`; `frontend/src/components/letter/NewLetter.js` |
| Campaign as accounting dimension | `C_Campaign` carried on fact lines/summaries | `backend/de.metas.acct.base/src/main/java-gen/de/metas/acct/model/I_Fact_Acct_Summary.java` |

No material: Nextcloud, AureusERP, Moqui.

**BOSS implications.** A campaign must be a container, not a send: Odoo's separation of
`utm.campaign` from `mailing.mailing` is the right model, and its CRM/Sales counters show
what a campaign record is for. Reference apps omit budgets; BOSS should add planned vs
actual cost per campaign and per touch. A/B testing needs explicit variant rows, a
sample percentage, a winner criterion and a "send winner to remaining" action; nothing
outside Odoo models this. Neither Frappe nor Twenty has marketing-specific automation —
they expose generic workflow builders, which BOSS can reuse rather than inventing a
second automation engine. Stage and tag vocabularies belong to shared configuration so
Sales and Marketing see the same campaign pipeline.

---

## 3. Segments, lists, audiences & consent

### Odoo — static lists, dynamic lists and opt-out governance

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Mailing Lists | Static lists: name, public flag, recipients, mailings, bounce/opt-out/blacklist percentages; Merge action; Import Contacts | `odoo/addons/mass_mailing/views/mailing_list_views.xml` |
| Mailing Contacts | Contact records with subscription/opt-out state, list membership and import | `odoo/addons/mass_mailing/views/mailing_contact_views.xml` |
| Dynamic Lists (`mailing.filter`) | Saved audience rule: name, recipient model, domain expression, created-by; kanban cards show recipient model and mailing count | `odoo/addons/mass_mailing/views/mailing_filter_views.xml` |
| Mailing form recipients | Recipient model (any mailing model), static lists, dynamic lists or a domain; "Use Exclusion List / Exclude Blacklisted Recipients"; live recipient count | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml` |
| Subscription preferences | Portal pages to manage subscriptions, blocklist and feedback | `odoo/addons/mass_mailing/views/mailing_templates_portal_management.xml`, `mailing_templates_portal_unsubscribe.xml`; `static/src/xml/mailing_portal_*` |
| Opt-out reasons | Dictionary (name, allow feedback) used by the unsubscribe form | `odoo/addons/mass_mailing/views/mailing_subscription_optout_views.xml` |
| Blacklisted email addresses | Global suppression list | `odoo/addons/mass_mailing/views/mail_blacklist_views.xml`; `odoo/addons/mail/views/mail_blacklist_views.xml` |
| SMS lists/contacts + phone blacklist | SMS equivalents of list, contacts and suppression | `odoo/addons/mass_mailing_sms/views/mailing_list_views.xml`, `odoo/addons/mass_mailing_sms/views/mailing_contact_views.xml`, `odoo/addons/mass_mailing_sms/views/mailing_sms_menus.xml` |
| Partner marketing fields | Subscription/opt-out information added to partner forms | `odoo/addons/mass_mailing/views/res_partner_views.xml` |

### Frappe — Email Group is the audience primitive

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Email Group | Subscriber list (title, subscriber count, welcome and confirmation email templates, welcome URL) | `frappe/email/doctype/email_group/email_group.json` |
| Email Group Member | Member rows with email and subscription status | `frappe/email/doctype/email_group_member/email_group_member.json` |
| Email Unsubscribe | Unsubscribe records used by the mailer | `frappe/email/doctype/email_unsubscribe/` |
| Lead/contact filters | CRM SPA filters and group-by controls, not reusable saved segments | `crm/frontend/src/components/Filter.vue`, `GroupBy.vue` |
| Segment builder | Not present | — |

### Twenty — message lists plus a suppression-aware audience preview

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Message List object | Name, description, members, campaigns; generic record list and detail | `packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-list-standard-flat-field-metadata.util.ts` |
| Add to Message List side panel | Adds people/records to a list from the record UI | `packages/twenty-front/src/modules/side-panel/pages/add-to-message-list/components/SidePanelAddToMessageListPage.tsx` |
| List commands | Duplicate list; add a view's records to a list | `packages/twenty-front/src/modules/command-menu-item/engine-command/record/single-record/message-list/components/DuplicateMessageListSingleRecordCommand.tsx`; `packages/twenty-front/src/modules/command-menu-item/engine-command/record/no-selection/components/AddViewToMessageListNoSelectionRecordCommand.tsx` |
| Audience preview | Returns total members and sendable count plus explicit exclusion buckets: missing email, duplicate emails, hard-suppressed, globally unsubscribed, topic-unsubscribed, tracking-refused | `packages/twenty-front/src/modules/activities/emails/hooks/useCampaignAudiencePreview.ts`; `packages/twenty-front/src/generated-metadata/graphql.ts` (`CampaignAudiencePreviewDTO`) |
| Unsubscribers / Unsubscribe Topics | Suppression list with reason badges/filters and topic management | `packages/twenty-front/src/modules/settings/unsubscribers/components/SettingsUnsubscribersList.tsx`; `packages/twenty-front/src/modules/settings/unsubscribe-topics/components/SettingsWorkspaceUnsubscribeTopicSection.tsx` |

The preview contract is worth copying: before a send, the UI states how many recipients
are sendable and why the rest are excluded, rather than silently dropping them.

### Dolibarr — criteria targeting and saved advanced filters

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Target emailing | Basic recipient targeting over third parties/contacts; download selected targets as CSV | `htdocs/comm/mailing/targetemailing.php` |
| Advanced target emailing | Filters over extra fields, categories and attributes; save and delete named filter sets | `htdocs/comm/mailing/advtargetemailing.php`; `htdocs/comm/mailing/class/advtargetemailing.class.php` |
| Members list | Member audience | `htdocs/adherents/list.php`; `htdocs/adherents/index.php` |

### metasfresh — marketing contact persons with explicit consent

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Marketing Contact Person | Contact record synced to a marketing platform: address, language, attributes, platform/external ID, last sync status, deactivated flag | `backend/de.metas.marketing/base/` (model, repository, services) |
| Consent tab | Marketing-consent records attached to contact persons (per platform/purpose) | `backend/de.metas.marketing/base/src/main/sql/postgresql/system/90-de.metas.marketing.base/5492750_sys_gh4015-app_add_basic_tables_windows_etc.sql` (`Einverständnis` tabs) |
| Campaign contact view | Contacts with campaign membership, used by campaign composition | `backend/de.metas.marketing/base/src/main/sql/postgresql/ddl/views/MKTG_ContactPerson_With_Campaign_V.sql` |
| Newsletter flag | `AD_User.IsNewsletter` and a default newsletter campaign | `backend/de.metas.marketing/base/src/main/sql/postgresql/system/90-de.metas.marketing.base/5493140_sys_gh4031_NewsletterFlag_In_AD_User_DDL.sql`; `backend/de.metas.marketing/base/src/main/sql/postgresql/system/90-de.metas.marketing.base/5493080_sys_gh4031_DefaultNewsletter_In_MKTG_Campaign.sql` |

### AureusERP — partners only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Partners/Contacts | Contact records; no segmentation UI | `plugins/webkul/contacts/src/Filament/Resources/PartnerResource.php`; `plugins/webkul/website/src/Filament/Admin/Resources/PartnerResource.php` |

No material: Nextcloud (forms responses are not an audience list; Contacts has groups but
no marketing screens).

**BOSS implications.** Two audience kinds are needed: a static list (imported, merged,
curated) and a dynamic segment (saved query over Party/ContactMech and business records).
Odoo is the only app that has both as reusable objects (Dolibarr's advanced filters are
saved per emailing, not curated lists). Consent is the differentiator: metasfresh keeps an
explicit consent entity, Odoo keeps opt-out reasons plus a global blacklist, Twenty keeps
suppression reasons plus topics, Frappe keeps unsubscribe records. BOSS should keep a
per-channel consent ledger on the Party (email, SMS, marketing purpose, source, timestamp)
and evaluate it at send time, returning the same exclusion-bucket preview Twenty shows.

---

## 4. Email, newsletters, SMS & delivery

### Odoo — builder, template library, traces and SMS

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Template Library | Kanban/form of reusable mailings (`is_template`), "Use this" converts a template into a mailing | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml` (`mailing_mailing_action_templates`) |
| Email builder | Drag-and-drop HTML body editor in an iframe, snippet palette, theme selector, mobile preview, preview text, from/reply-to, attachments | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml`; `odoo/addons/mass_mailing/static/src/builder/`; `odoo/addons/mass_mailing/static/src/snippets/`; `odoo/addons/mass_mailing/static/src/themes/theme_selector/`; `odoo/addons/mass_mailing/static/src/iframe/` |
| Email themes | Over a dozen designed templates (event, blogging, coupon, magazine, promotion, newsletter, catalog, roadshow, …) | `odoo/addons/mass_mailing_themes/views/mass_mailing_themes_templates.xml` |
| Send / test / schedule | Send, Test, Schedule, Preview, Duplicate, Cancel, Retry failed; statusbar `draft → sending → done`; queue counters (scheduled/process) | `odoo/addons/mass_mailing/views/mailing_mailing_views.xml`; wizard views |
| Mailing traces | Per-recipient trace: scheduled, processing, sent, delivered, opened, clicked, replied, bounced, error, canceled; retry failed; filters and group-bys | `odoo/addons/mass_mailing/views/mailing_trace_views.xml` |
| Mailing Analysis report | Trace report with list/graph/pivot | `odoo/addons/mass_mailing/report/mailing_trace_report_views.xml` |
| Opt-Out Report | Subscription/opt-out analysis | `odoo/addons/mass_mailing/views/mailing_subscription_views.xml` (`mailing_subscription_action_report_optout`) |
| SMS Marketing | SMS mailings, lists, traces, templates; phone blacklist | `odoo/addons/mass_mailing_sms/views/mailing_mailing_views.xml`, `mailing_trace_views.xml`; `odoo/addons/sms/views/sms_template_views.xml`, `sms_sms_views.xml` |
| Transactional mail templates | Server-side email templates and scheduled messages | `odoo/addons/mail/views/mail_template_views.xml`; `mail_scheduled_message_views.xml` |
| Website newsletter capture | Newsletter block and benefits popup snippets; subscription goes to a mailing list | `odoo/addons/website_mass_mailing/static/snippets/snippets_templates.xml`; `controllers/` |
| Subscription portal | Public subscribe/unsubscribe/preferences pages with feedback | `odoo/addons/mass_mailing/views/mailing_templates_portal_unsubscribe.xml`, `mailing_templates_portal_management.xml` |

Sending configuration: `mass_mailing` settings expose campaign grouping, "split contact
name" (first/last name placeholders), blacklist buttons, periodic reports and a global
dedicated outgoing mail server (`mass_mailing_outgoing_mail_server` +
`mass_mailing_mail_server_id`) — `odoo/addons/mass_mailing/views/res_config_settings_views.xml`.

### Frappe — templates and queue, but no Newsletter UI

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Email Template (Desk) | Subject/response templates with Jinja context; list/form | `frappe/email/doctype/email_template/` |
| Email Campaign | Scheduled series of emails to Leads/Contacts/Email Groups with start/end and status | `erpnext/crm/doctype/email_campaign/email_campaign.json` |
| Campaign Email Schedule | Per-campaign delay + template rows | `erpnext/crm/doctype/campaign_email_schedule/campaign_email_schedule.json` |
| Email Queue | Outbound queue with recipient rows and newsletter-aware flags | `frappe/email/doctype/email_queue/`; `email_queue_recipient/` |
| Email Account / Email Domain | Sender accounts and domains | `frappe/email/doctype/email_account/`; `email_domain/` |
| CRM composer + template picker | Rich composer with a template selector modal | `crm/frontend/src/components/EmailEditor.vue`; `components/Modals/EmailTemplateSelectorModal.vue` |
| CRM Email Templates | List, new, edit pages | `crm/frontend/src/components/Settings/EmailTemplate/EmailTemplates.vue`, `NewEmailTemplate.vue`, `EditEmailTemplate.vue` |
| Newsletter doctype/screens | **Absent from this checkout** (docs/role/queue flag only) | `frappe/email/`; `crm/frontend/src/pages/` |

### Twenty — composer, variables, scheduling and delivery stats

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Campaign composer | Body/details/recipients; variables inserted as chips; preview | `packages/twenty-front/src/modules/activities/emails/components/CampaignComposer.tsx`, `CampaignDetailsFields.tsx`, `CampaignBodyField.tsx`; `packages/twenty-front/src/modules/activities/emails/editor/extensions/campaign-variables/` |
| Envelope/preview | Sent envelope, sent preview, send-campaign info (recipient count, opt-out/tracking caveat) | `CampaignEnvelopeBox.tsx`, `CampaignSentPreview.tsx`; `packages/twenty-front/src/modules/side-panel/components/SidePanelSendCampaignInfo.tsx` |
| Send/test/schedule/cancel | Hooks and GraphQL mutations | `packages/twenty-front/src/modules/activities/emails/hooks/useSendMessageCampaign.ts`, `useSendMessageCampaignTest.ts`, `useCancelMessageCampaign.ts` |
| Delivery stats | Counts/rates on the message campaign record (sent, delivered, failed, bounced, complained, skipped, unique opens/clicks) | `compute-message-campaign-standard-flat-field-metadata.util.ts` |
| Open/click tracking | Workspace-level switches | `packages/twenty-front/src/modules/settings/workspace/components/OpenTrackingSwitch.tsx`, `ClickTrackingSwitch.tsx` |
| Template library | **Not present** | — |

### Nextcloud — mail client, not a campaign sender

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Mail home / composer | Personal mail client; no bulk sending, lists or traces | `mail/src/views/Home.vue`; `mail/src/components/Composer.vue` |
| Forms confirmation email | Toggle and rate limit for respondent confirmation emails | `forms/src/FormsSettings.vue` |

### Dolibarr — HTML emailing with read pixel and unsubscribe placeholders

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Emailing card/editor | Subject, HTML body, attachments, substitution variables, test send | `htdocs/comm/mailing/card.php` |
| Read tracking + unsubscribe | `__CHECK_READ__` pixel and `__UNSUBSCRIBE__`/`__UNSUBSCRIBE_URL__` substitutions | `htdocs/comm/mailing/card.php` |
| Emailing log | Per-recipient send information | `htdocs/comm/mailing/info.php` |
| Email templates | Shared email templates | `htdocs/admin/mails_templates.php` |
| Sender profiles / emailing setup | Sender profiles and module options | `htdocs/admin/mails_senderprofile_list.php`; `htdocs/admin/mails_emailing.php`; `htdocs/admin/mailing.php` |
| Click tracking UI | **Not found** in `htdocs/comm/mailing` | — |

### metasfresh — compose email/letter, delegate sending

| Screen/page | What it is | Key files |
| --- | --- | --- |
| New Email | Email compose component | `frontend/src/components/email/NewEmail.js` |
| New Letter | Serial-letter compose | `frontend/src/components/letter/NewLetter.js` |
| CleverReach integration | External email-marketing sync; no in-app designer | `backend/de.metas.marketing/cleverreach/` |

No material: AureusERP, Moqui (only transactional notification templates).

**BOSS implications.** mr-moqui owns SMTP send and receive; IronStone Marketing owns
composition, templates, scheduling, traces and unsubscribe. The minimum screen set is:
template library, composer with variables and preview/test, send/schedule dialog, and a
per-recipient trace list with retry. Odoo's trace vocabulary (delivered/opened/clicked/
replied/bounced/error/canceled) is a good fixed status set. Two BOSS-specific rules:
sending must re-check consent at dispatch (not only at audience selection), and every
message needs an unsubscribe/preference link that resolves without login. Twenty's
workspace-level open/click switches and custom emailing-domain DNS verification are the
right privacy/deliverability controls.

---

## 5. Promotions, coupons, loyalty & referrals

### Odoo — full promotion/loyalty model

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Discount & Loyalty | Program list/form (`path discount-loyalty`) | `odoo/addons/loyalty/views/loyalty_program_views.xml` |
| Program types | Coupons, Gift Card, Loyalty Cards, Promotions, eWallet, Discount Code, Buy X Get Y, Next Order Coupons; applies-on current/future/both; validity dates, usage limits, once-per-user, participating partners, pricelists | `odoo/addons/loyalty/models/loyalty_program.py`; `views/loyalty_program_views.xml` |
| Gift cards & eWallet | Separate program variant list/form (`path gift-cards-ewallet`) | `odoo/addons/loyalty/views/loyalty_program_views.xml`; `website_sale_loyalty/views/loyalty_program_views.xml` |
| Rules & Rewards | Rule kanban/form (discount code, minimum quantity/amount, product scope, points) and reward kanban/form (discount/product, points cost, description) | `odoo/addons/loyalty/views/loyalty_rule_views.xml`, `loyalty_reward_views.xml` |
| Communications | Per-program communication plan (email templates), excluded for current-order programs | `odoo/addons/loyalty/views/loyalty_mail_views.xml`; `loyalty_program_views.xml` |
| Coupons / loyalty cards | Coupon list/form with code, balance, partner, expiry, program, "Send"; history lines | `odoo/addons/loyalty/views/loyalty_card_views.xml`, `loyalty_history_views.xml` |
| Website/POS integration | Coupon/gift-card entry in eCommerce, POS and Sales | `odoo/addons/website_sale_loyalty/views/website_sale_templates.xml`; `pos_loyalty/`; `sale_loyalty/` |
| Referrals | No referral program in this checkout | — |

### Frappe — loyalty points, coupon codes and promotional schemes

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Loyalty Program | Program form + dashboard (rules, collection rules, redemption, conversion factor, expiry) | `erpnext/accounts/doctype/loyalty_program/loyalty_program.json`, `loyalty_program_dashboard.py` |
| Loyalty Point Entry | Point ledger | `erpnext/accounts/doctype/loyalty_point_entry/loyalty_point_entry.json` |
| Coupon Code | Coupon records | `erpnext/accounts/doctype/coupon_code/coupon_code.json` |
| Promotional Scheme | Promotional price/discount rules | `erpnext/accounts/doctype/promotional_scheme/`; `promotional_scheme_price_discount/`; `promotional_scheme_product_discount/` |
| Customer Acquisition and Loyalty report | Acquisition/loyalty reporting | `erpnext/selling/report/customer_acquisition_and_loyalty/` |

### Dolibarr — price rules, not promotions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Price rules | Discount/price-rule configuration | `htdocs/product/admin/price_rules.php` |
| Dynamic prices | Formula/global-variable based pricing | `htdocs/product/admin/dynamic_prices.php`; `htdocs/product/dynamic_price/class/` |
| Price levels | Product/customer price levels | `htdocs/product/price.php`; `htdocs/societe/price.php` |

### AureusERP — price lists only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Price Lists | List/create/edit/view price lists | `plugins/webkul/products/src/Filament/Resources/PriceListResource.php` |

### metasfresh — campaign pricing dimension

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Campaign pricing | `C_Campaign` carried through pricing/accounting; campaign price conditions | `backend/de.metas.acct.base/src/main/java-gen/de/metas/acct/model/I_Fact_Acct_Summary.java`; `backend/de.metas.fresh/.../5727390_sys_gh18309_Add_PricingSystem_Product_Campaign_Price.sql` |

No material: Twenty, Nextcloud, Moqui. No coupons/gift cards/loyalty/referrals in
Dolibarr/AureusERP/metasfresh UIs.

**BOSS implications.** Promotions are a sales-pricing concern that Marketing *uses*, not
a campaign subtype. Odoo keeps programs (rules + rewards + codes + validity) in a
separate pricing app with no campaign link, and Frappe's promotional schemes and
Dolibarr's price rules follow the same split; that keeps checkout, POS and quotes
consistent. Coupon codes need a lifecycle (issued, assigned, redeemed, expired) and an
owner; gift cards and eWallet are liabilities and must post to Accounting. Referral
programs are absent everywhere in the reference set; treat them as a later, separate
program type rather than inventing one from a screen catalog.

---

## 6. Content: blogs, landing pages, web forms & social

### Odoo — website CMS, blog, share cards and events

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Website → Site | Homepage, Menu Editor, Content (Pages, Model Pages, System Pages), This page (Properties, Optimize SEO, HTML/CSS Editor, Edit Menu) | `odoo/addons/website/views/website_views.xml`; `website_pages_views.xml`; `website_controller_pages_views.xml` |
| Pages | Website page list/kanban with publish state, tracking and "Not SEO optimized" filters | `odoo/addons/website/views/website_pages_views.xml` |
| Page editor | In-context website builder: block palette, page properties, SEO metadata, HTML/CSS editor | `odoo/addons/website/static/src/builder/`; `views/website_views.xml` |
| Website → Configuration | Settings, Apps, Websites, Menus, Redirects, Themes/Configurator | `odoo/addons/website/views/res_config_settings_views.xml`; `website_rewrite.xml`; `website_views.xml` |
| Blog | Blogs, Tags, Tag Categories configuration | `odoo/addons/website_blog/views/website_blog_views.xml` |
| Blog Post Pages | Post list (title, author, blog, tags, published) + kanban with publish toggle; form has blog, teaser, tags, author, content, SEO meta title/description/keywords, scheduled publish (`publish_on`) | `odoo/addons/website_blog/views/website_pages_views.xml`; `website_blog_views.xml`; `models/website_blog.py` |
| Link Tracker | Short link/UTM creation from the website editor; click stats; QR download | `odoo/addons/website_links/views/link_tracker_views.xml`; `link_tracker_views.xml` |
| Marketing Card / share campaign | Card designer and preview; public share page for X, LinkedIn, WhatsApp and Pinterest; LinkedIn post composer; click/open/share counters | `odoo/addons/marketing_card/views/card_card_views.xml`, `card_frontend_templates.xml`; `static/src/interactions/linkedin_message_editor.js` |
| Events | Events, Registration Desk (barcode), Event Templates, Stages, Tags Categories, Questions, Tickets, Slots | `odoo/addons/event/views/event_menu_views.xml`; `event_event_views.xml`; `event_registration_views.xml`; `event_question_views.xml`; `event_ticket_views.xml`; `event_slot_views.xml` |
| Social posting | **Absent**; `social_media` only adds company social URLs | `odoo/addons/social_media/views/res_company_views.xml` |

### Frappe — web pages, web forms and a CRM lead-capture form builder

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Web Page | CMS page record with route, published flag, blocks; rendered by the website renderer | `frappe/website/doctype/web_page/`; `web_page_block/` |
| Web Form | Form builder record: route, document type, fields, login requirement, allow multiple/edit/delete/print/comments, introduction, success message/URL | `frappe/website/doctype/web_form/web_form.json`; `web_form_field/` |
| Web Form Request | Submitted responses | `frappe/website/doctype/web_form_request/` |
| Website Settings / Theme / Sidebar / Slideshow | Site configuration, theme, sidebar and slideshow content | `frappe/website/doctype/website_settings/`, `website_theme/`, `website_sidebar/`, `website_slideshow/` |
| CRM Forms | "Capture leads and deals from public forms": form list + builder with publish/preview/edit tabs | `crm/frontend/src/components/Settings/Forms/FormsList.vue`, `FormBuilderPanel.vue` |
| Blog Post | **No blog doctype in this checkout** | — |

### Nextcloud — wiki-style content (Collectives)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Collectives home / collective view | Collective list and per-collective page tree | `collectives/src/views/HomeView.vue`, `CollectiveView.vue`, `PagePicker.vue` |
| Page editor / versions | Markdown editor, subpages, favorites, trash, versions, tags, templates, print view | `collectives/src/components/Page/TextEditor.vue`; `components/PageList/`; `components/PageVersion.vue`; `stores/templates.js` |
| Mail | Mail client, not a marketing CMS | `mail/src/views/Home.vue`; `mail/src/components/Composer.vue` |

### Dolibarr — website builder, portal and agenda

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Websites | Website list/editor, pages, menus, aliases, media | `htdocs/website/index.php`; `htdocs/core/modules/modWebsite.class.php` |
| Website settings/options | Global website configuration | `htdocs/admin/website.php`; `htdocs/admin/website_options.php` |
| Web portal | Customer portal controllers (orders, invoices, tickets, member card) | `htdocs/webportal/controllers/`; `htdocs/webportal/admin/setup.php` |
| Events/agenda | Agenda list/card for events and actions | `htdocs/comm/action/index.php`, `list.php`, `card.php` |

### AureusERP — pages, blogs and customer site

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Pages | CMS page list/create/edit/view | `plugins/webkul/website/src/Filament/Admin/Resources/PageResource.php` |
| Website partners | Partner pages/manage addresses/contacts | `plugins/webkul/website/src/Filament/Admin/Resources/PartnerResource.php` |
| Blog posts | Post list/create/edit/view; title, slug, sub-title, rich content, image, SEO meta title/keywords/description, category, tags | `plugins/webkul/blogs/src/Filament/Admin/Resources/PostResource/Schemas/PostForm.php`; `Pages/` |
| Blog categories/tags | Configuration cluster resources | `plugins/webkul/blogs/src/Filament/Admin/Clusters/Configurations/Resources/` |
| Customer site | Homepage, login, register, customer blog/category pages | `plugins/webkul/website/src/Filament/Customer/Pages/Homepage.php`; `Auth/Login.php`, `Auth/Register.php`; `plugins/webkul/blogs/src/Filament/Customer/Resources/` |

### Moqui — hand-built public sites only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| coarchy.com public site | Home, content, organizations, login, signup | `screen/coarchy-com/Home.xml`, `c.xml`, `content.xml`, `c/Organizations.xml`, `c/Login.xml`, `c/SignUp.xml` |
| coarchy internal | Home, Vision, Process, Actors, Value Statements, checklists | `screen/coarchy/cointernal/Home.xml`, `Vision.xml`, `Process.xml`, `ViewActors.xml`, `ValueStatements.xml` |
| resistmanagement.com public site | Content, login | `screen/resistmanagement.com/content.xml`, `Login.xml` |

No material: Twenty (no CMS), metasfresh.

**BOSS implications.** "Content" spans three different things: the public site (pages,
landing pages, forms), the blog (posts, taxonomy, authors, SEO), and internal knowledge
(Commons wiki). Odoo is the only reference that joins the first two with campaign link
tracking and email capture. The page list's SEO/tracking filters are a useful curation
view. BOSS should define one page/route/block model shared with Commerce, keep blog posts
as content records with SEO fields and scheduled publish, and keep the wiki in Commons.
Social publishing is absent from every open-source reference here — the only social
surface is Odoo's share-card composer (outbound links and a LinkedIn post form), so do
not plan a social scheduler from these sources.

---

## 7. Marketing events & webinars

### Odoo — full event management

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Events | List/kanban (by stage)/calendar/form; date range, template/type, tags, seats, stage | `odoo/addons/event/views/event_event_views.xml` |
| Tickets | Ticket types with price, seats and registration limits | `odoo/addons/event/views/event_ticket_views.xml` |
| Communication | Event mail schedulers (e.g. before/after event), template reference, per-registration mail log | `odoo/addons/event/views/event_mail_views.xml`; `event_event_views.xml` (`Communication` page) |
| Questions | Reusable registration questions, answers per registration | `odoo/addons/event/views/event_question_views.xml`, `event_registration_answer_views.xml` |
| Registration desk | Attendee list/kanban/form, barcode interface, confirm/attend/cancel actions | `odoo/addons/event/views/event_registration_views.xml` |
| Reporting | Attendees action with graph/pivot/kanban/list | `odoo/addons/event/views/event_registration_views.xml` (`action_registration`) |
| Configuration | Event Templates, Stages, Mail Schedulers, Tags Categories, Questions | `odoo/addons/event/views/event_menu_views.xml` |
| Website events | Public event pages and registration | `odoo/addons/website_event/views/event_templates_page.xml`, `event_templates_page_registration.xml`; `website_pages_views.xml` |

### Dolibarr — agenda events and booking

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Agenda | Event/action list and card | `htdocs/comm/action/index.php`, `list.php`, `card.php` |
| BookCal | Public booking calendars | `htdocs/bookcal/` |

No material: Frappe (no event marketing screen), Twenty, Nextcloud (calendar is
groupware, see research-drawers-commons.md), AureusERP, metasfresh, Moqui.

**BOSS implications.** Events are already a Commons/calendar concern and a CRM activity
concern. Marketing's addition is registration with questions, tickets, and scheduled
event emails; Odoo binds those to the event lifecycle. BOSS can reuse Commons events and
Customer Service requests for registration, adding a marketing registration form and an
event-email schedule rather than a separate event store.

---

## 8. Surveys, forms & quizzes

### Odoo — surveys, live sessions and certifications

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Surveys | List/kanban/form; Share, See results, Test, Close/Reopen; Create/Open/Close Live Session | `odoo/addons/survey/views/survey_survey_views.xml` |
| Survey types | Survey, Live session, Assessment, Custom | `odoo/addons/survey/models/survey_survey.py` |
| Question/section editor | Inline one2many of sections and questions; add question/section; pagination (per question/section/all), random selection per section, progress display | `odoo/addons/survey/views/survey_survey_views.xml` (`Questions` page) |
| Options | Access (public link vs invited only), login requirement, attempts limit, time limit, free navigation, background image, languages | `odoo/addons/survey/views/survey_survey_views.xml` (`Options` page) |
| Scoring / certification | Scoring with/without answers, required score, certification email template, badge, report layout | `odoo/addons/survey/views/survey_survey_views.xml`; `odoo/addons/survey/views/survey_user_views.xml` |
| Live session | Session code/link, speed rating, session manager, leaderboard and charts | `odoo/addons/survey/views/survey_survey_views.xml`; `odoo/addons/survey/static/src/interactions/survey_session_manage.js`, `survey_session_leaderboard.js`, `survey_session_chart.js` |
| Results | Statistics page: questions/registered/completed/success rate/avg duration/avg score, per-question charts, print | `odoo/addons/survey/views/survey_templates_statistics.xml`; `odoo/addons/survey/static/src/interactions/survey_result.js`, `survey_result_chart.js` |
| Questions & Answers config | Questions, Suggested Values (answer options with score/correct flag), Detailed Answers, Participants | `odoo/addons/survey/views/survey_menus.xml`; `odoo/addons/survey/views/survey_question_views.xml`; `odoo/addons/survey/views/survey_user_views.xml` |
| Participant form | State, attempts, score, email/partner, answers list, resend invitation, print | `odoo/addons/survey/views/survey_user_views.xml` |

### Frappe — Web Form as a survey primitive

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Web Form | Field builder (table of `web_form_field`), route, gating (login, multiple, edit, delete, print, comments), success message/URL | `frappe/website/doctype/web_form/web_form.json`; `web_form_field/` |
| Web Form Request | Submitted responses | `frappe/website/doctype/web_form_request/` |
| CRM Forms | Lead-capture form list + builder | `crm/frontend/src/components/Settings/Forms/FormsList.vue`, `FormBuilderPanel.vue` |
| Quiz/scoring/live sessions | Not present | — |

### Nextcloud — full forms app

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Forms list/create | Form title/description, question palette, drag-reorder, sections; question types: short/long text, multiple choice, dropdown, grid, ranking, linear scale, date, file | `forms/src/Forms.vue`; `forms/src/views/Create.vue`; `components/Questions/`; `components/AddQuestionMenu.vue` |
| Results | Summary and per-submission views; pagination; export to spreadsheet | `forms/src/views/Results.vue`; `components/Results/ResultsSummary.vue`, `Submission.vue`, `Answer.vue` |
| Submit | Public submission page | `forms/src/views/Submit.vue`; `forms/src/FormsSubmit.vue` |
| Sharing/QR/archive | Share links, QR dialog, archived-forms modal | `forms/src/components/SidebarTabs/SharingSidebarTab.vue`; `components/QRDialog.vue`; `components/ArchivedFormsModal.vue` |
| Admin settings | Restrict creation to groups; confirmation emails; rate limit | `forms/src/FormsSettings.vue` |

### Dolibarr — OpenSurvey

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Surveys | Survey list/home with draft/opened/closed states and expiry | `htdocs/opensurvey/index.php`, `list.php` |
| New survey wizard | Multi-step survey creation (classic vs date-based) | `htdocs/opensurvey/wizard/index.php`, `create_survey.php`, `choix_date.php`, `choix_autre.php` |
| Survey card | Edit/manage a survey; add columns, dates/hour ranges | `htdocs/opensurvey/card.php` |
| Results / export | Result table and CSV export | `htdocs/opensurvey/results.php`, `exportcsv.php` |

No material: Twenty, AureusERP, metasfresh, Moqui.

**BOSS implications.** Surveys are forms with response aggregates, not a separate data
model. Odoo adds scoring, certifications and live sessions; Nextcloud has the best
general-purpose question palette and a clean results summary; Frappe has the strongest
embedding/gating model (login, multiple responses, edit/print). BOSS should build one form
engine (fields, sections, conditional display, responses) and layer survey scoring and
certification on top, reusing Commons/Comms for distribution.

---

## 9. Campaign analytics, UTM & attribution

### Odoo — UTM + link tracking + mailing traces + web analytics

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Campaigns / Mediums / Sources | UTM dictionaries; campaign kanban by stage; medium and source lists | `odoo/addons/utm/views/utm_campaign_views.xml`, `utm_medium_views.xml`, `utm_source_views.xml` |
| Campaign Stages / UTM Tags | Stage and tag vocabularies | `odoo/addons/utm/views/utm_stage_views.xml`, `utm_tag_views.xml` |
| Link Tracker | Short link list/form: target URL, title, code, UTM campaign/medium/source/reference, click count, QR download, "Visit Page" | `odoo/addons/link_tracker/views/link_tracker_views.xml` |
| Link Tracker statistics | Click list (link, country, date) and graph; website link builder with charts | `odoo/addons/link_tracker/views/link_tracker_views.xml`; `odoo/addons/website_links/views/website_links_graphs.xml`; `static/src/interactions/website_links_charts.js` |
| Mailing Analysis | Trace report: list/graph/pivot over delivered/opened/clicked/replied/bounced | `odoo/addons/mass_mailing/report/mailing_trace_report_views.xml` |
| Opt-Out Report | Subscription/opt-out analysis | `odoo/addons/mass_mailing/views/mailing_subscription_views.xml` |
| Website Analytics | `backend_dashboard` client action (website analytics: visitors, sales, conversion) | `odoo/addons/website/views/website_views.xml` (`backend_dashboard`, `ir_actions_server_website_analytics`); `odoo/addons/website/static/src/client_actions/website_dashboard/website_dashboard.js` |
| Visitors / Page Views | Visitor list (country, language, visits, page views, last page, connected) and page-view list/graph | `odoo/addons/website/views/website_visitor_views.xml` |
| Campaign attribution | Campaign lead/opportunity count on campaign; campaign field on leads; quotation count and invoiced revenue on campaign | `odoo/addons/crm/views/utm_campaign_views.xml`; `odoo/addons/sale/views/utm_campaign_views.xml` |
| Event reporting | Attendee graph/pivot/kanban/list | `odoo/addons/event/views/event_registration_views.xml` |
| Survey reporting | Per-survey results statistics | `odoo/addons/survey/views/survey_templates_statistics.xml` |

### Frappe — campaign efficiency and dashboards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Campaign Efficiency report | Campaign-driven leads/opportunities | `erpnext/crm/report/campaign_efficiency/` |
| Opportunities via Campaigns chart | Dashboard chart | `erpnext/crm/dashboard_chart/opportunities_via_campaigns/opportunities_via_campaigns.json` |
| UTM Campaign / Medium / Source | UTM records | `frappe/website/doctype/utm_campaign/`, `utm_medium/`, `utm_source/` |
| Insights workbook/dashboard | Query → chart → dashboard builder | `insights/frontend/src2/workbook/Workbook.vue`, `WorkbookQuery.vue`, `WorkbookDashboard.vue`; `src2/dashboard/DashboardPage.vue`, `DashboardBuilder.vue` |

### Twenty — generic analytics only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Analytics module | Chart/aggregate hooks and components | `packages/twenty-front/src/modules/analytics/` |
| Dashboards | Widget/grid dashboard pages (graph, table, iframe, rich text widgets) | `packages/twenty-front/src/modules/dashboards/`; `packages/twenty-front/src/modules/page-layout/widgets/` |
| UTM/attribution | Not present | — |

### Dolibarr — send logs and donation stats, no attribution

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Emailing log | Per-recipient send log | `htdocs/comm/mailing/info.php` |
| Donation statistics | Donation stats page | `htdocs/don/stats/index.php` |
| UTM/attribution | Not present | — |

### AureusERP — blog widgets only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Blog charts/tables | `BlogChart`, `BlogStatusPieChart`, `BlogAuthorsChart`, `CategoriesPieChart`, `TopCategoriesTable`, `RecentBlogsTable`, `StatsOverview` | `plugins/webkul/website/src/Filament/Admin/Widgets/` |
| Analytics plugin | Model/API only; **no Filament screen** | `plugins/webkul/analytics/src/Models/Record.php`; `AnalyticsServiceProvider.php` |

### metasfresh — campaign as an accounting dimension

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Campaign dimension | `C_Campaign` on fact lines/summaries and financial reports | `backend/de.metas.acct.base/src/main/java-gen/de/metas/acct/model/I_Fact_Acct_Summary.java`; `backend/de.metas.acct.base/src/main/java-legacy/org/compiere/acct/FactLine.java` |
| Attribution UI | Not present | — |

No material: Nextcloud (form results only), Moqui.

**BOSS implications.** Odoo is the only reference that closes the loop from campaign →
send → open/click → lead/opportunity → quotation → invoiced revenue. BOSS should carry
one campaign identifier from Marketing through Sales, Commerce and Accounting (Odoo's
`utm.campaign` is exactly that key), store per-touch events, and build the dashboards in
Insights rather than inside Marketing. The link tracker is the shared primitive for
email, content, social posts and QR codes; UTM medium/source/stage/tag vocabularies
belong to shared configuration. Multi-touch attribution and funnels are absent from every
reference — treat them as Insights work, not Marketing screens.

---

## 10. Configuration & admin

### Odoo — settings, vocabularies and suppression config

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Email Marketing → Settings | Campaign group toggle, split contact names, blacklist buttons, periodic reports, dedicated outgoing mail server | `odoo/addons/mass_mailing/views/res_config_settings_views.xml` |
| Campaign Stages / UTM Tags | Stage and tag vocabularies | `odoo/addons/mass_mailing/views/mailing_menus.xml`; `odoo/addons/utm/views/utm_stage_views.xml`, `utm_tag_views.xml` |
| Link Tracker config entry | Global link tracker | `odoo/addons/mass_mailing/views/mailing_menus.xml`; `odoo/addons/link_tracker/views/link_tracker_views.xml` |
| Blacklisted Email Addresses / Optout Reasons | Suppression list and reason dictionary | `odoo/addons/mass_mailing/views/mail_blacklist_views.xml`, `mailing_subscription_optout_views.xml` |
| SMS config | Blacklisted phone numbers, link tracker | `odoo/addons/mass_mailing_sms/views/mailing_sms_menus.xml` |
| Website config | Settings, Apps, Websites, Menus, Redirects, Themes | `odoo/addons/website/views/res_config_settings_views.xml`; `website_views.xml`; `website_rewrite.xml` |
| Event config | Event Templates, Stages, Mail Schedulers, Tags Categories, Questions | `odoo/addons/event/views/event_menu_views.xml` |
| Survey config | Questions, Suggested Values, Detailed Answers | `odoo/addons/survey/views/survey_menus.xml`; `survey_question_views.xml` |

### Frappe — site, email and UTM configuration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Website Settings | Home page, theme/brand, top bar, banner/footer, integrations, route redirects, indexing/view-tracking switches | `frappe/website/doctype/website_settings/` |
| Email Account / Email Domain / Email Template / Email Group | Sender and audience configuration | `frappe/email/doctype/email_account/`, `email_domain/`, `email_template/`, `email_group/` |
| UTM Campaign / Medium / Source | UTM configuration records | `frappe/website/doctype/utm_campaign/`, `utm_medium/`, `utm_source/` |
| CRM email settings | Email account list/config/add/edit | `crm/frontend/src/components/Settings/EmailAccountList.vue`, `EmailConfig.vue`, `EmailAdd.vue`, `EmailEdit.vue` |

### Twenty — sending domains, suppression and tracking

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Emailing Domains | Custom sending domain, DNS records, verification, AI setup prompt | `packages/twenty-front/src/modules/settings/emailing-domains/components/SettingsEmailingDomainDnsRecords.tsx`, `SettingsEmailingDomainVerifyButton.tsx`, `SettingsEmailingDomainAiSetup.tsx` |
| Unsubscribers | Suppression list with reason badges and filters | `packages/twenty-front/src/modules/settings/unsubscribers/components/SettingsUnsubscribersList.tsx`, `SettingsUnsubscribePreview.tsx` |
| Unsubscribe Topics | CRUD for unsubscribe topics | `packages/twenty-front/src/modules/settings/unsubscribe-topics/components/SettingsWorkspaceUnsubscribeTopicSection.tsx` |
| Communications settings | Workspace communications/unsubscribe pages | `packages/twenty-front/src/pages/settings/communications/SettingsWorkspaceCommunications.tsx`, `SettingsWorkspaceUnsubscribe.tsx` |
| Tracking switches | Workspace open/click tracking toggles | `packages/twenty-front/src/modules/settings/workspace/components/OpenTrackingSwitch.tsx`, `ClickTrackingSwitch.tsx` |

### Nextcloud — forms admin only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Forms admin settings | Restrict form creation to groups; allow confirmation emails; rate limit | `forms/src/FormsSettings.vue` |

### Dolibarr — module setup, sender profiles and templates

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Emailing setup | Emailing module options | `htdocs/admin/mailing.php`; `htdocs/admin/mails_emailing.php` |
| Email templates | Shared templates | `htdocs/admin/mails_templates.php` |
| Sender profiles | From-address profiles | `htdocs/admin/mails_senderprofile_list.php` |
| Website setup | Website options | `htdocs/admin/website.php`; `htdocs/admin/website_options.php` |

### AureusERP — website/blog configuration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Website Configurations cluster | Website settings cluster | `plugins/webkul/website/src/Filament/Admin/Clusters/Configurations.php`; `PluginSettings.php` |
| Manage Contacts | Email/phone/social links | `plugins/webkul/website/src/Filament/Admin/Clusters/Settings/Pages/ManageContacts.php` |
| Blog tags/categories | Configuration resources | `plugins/webkul/blogs/src/Filament/Admin/Clusters/Configurations/Resources/` |

### metasfresh — marketing platform gateway

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Marketing Platform window | Gateway ID, client, organisation, customer number, password, active | `backend/de.metas.adempiere.adempiere/migration/src/main/sql/postgresql/system/10-de.metas.adempiere/5493510_sys_gh4030-marketing-windows-webui.sql` |
| Campaign sync fields | Contacts in campaigns carry platform, external record ID, last sync status/detail and uploaded/downloaded timestamps | `backend/de.metas.marketing/base/src/main/java-gen/de/metas/marketing/base/model/X_MKTG_Campaign_ContactPerson.java`; `backend/de.metas.adempiere.adempiere/migration/src/main/sql/postgresql/system/10-de.metas.adempiere/5493640_sys_gh4030-marketing-campaign-window-webui.sql` |
| CleverReach | Integration module (config + sync) | `backend/de.metas.marketing/cleverreach/` |

No material: Moqui.

**BOSS implications.** Marketing configuration has four distinct scopes: sending
infrastructure (accounts, domains, DNS, dedicated server), consent/suppression (topics,
reasons, blacklist), vocabularies (stages, tags, UTM medium/source), and channel
templates (email, SMS, landing pages, forms). Odoo's per-app settings split is sound but
scattered; a BOSS Marketing settings area should group all four, with permission
boundaries between campaign managers and system administrators. Sending-domain
verification (Twenty) is a hard requirement for self-hosted installs.

---

## 11. Gaps & notables

### Explicit gaps across the reference set

| Area | Gap | Evidence |
| --- | --- | --- |
| Marketing home | No source has a marketing dashboard combining calendar + KPIs; Odoo has separate hubs | Odoo menu roots; Twenty/Nextcloud dashboards are generic |
| Campaign budgets | No budget/cost fields on campaigns or sends in Odoo, Frappe, Twenty, Dolibarr | grep for `budget` / `cost` in `mass_mailing`, `utm`, `marketing_card`; doctype JSONs |
| Marketing automation | Odoo's `marketing_automation` is absent (docs only); Frappe/Twenty offer generic workflow builders, not marketing drip templates | `documentation/content/applications/marketing/marketing_automation/`; `crm/.../WorkflowAutomations/`; `twenty-front/.../workflow/` |
| A/B testing | Only Odoo (sample %, winner criterion, winner send) | `mass_mailing/models/mailing.py` |
| Segment builder | Only Odoo (static lists + saved dynamic domains); Dolibarr has per-mailing saved advanced filters | `mailing_filter_views.xml`; `advtargetemailing.php` |
| Consent ledger | No source has a per-channel, per-purpose consent entity on the party; metasfresh is closest (consent tab), Odoo uses opt-out reasons + blacklist | Odoo/Frappe/Twenty/metasfresh tables above |
| Deliverability / bounces | No bounce processing or reputation UI beyond traces/queues/logs | Odoo traces, Frappe queue, Dolibarr log |
| Social publishing/scheduling | Absent everywhere; Odoo community only stores social URLs and renders share cards | `social_media/views/res_company_views.xml`; `marketing_card/` |
| Referral programs | Absent everywhere | — |
| Multi-touch attribution / funnels | Absent; Odoo ties campaigns to leads/quotes/revenue, Frappe has a report, others nothing | §9 |
| Event marketing | Only Odoo (tickets, questions, communication schedules, registration desk) | `event/` |
| SMS marketing | Only Odoo (full) and Dolibarr (`smsing` target in mailing) | `mass_mailing_sms/`; `comm/mailing/index.php` |
| Email templates | Twenty has no template library; Dolibarr/Frappe/Odoo do | §4 |
| Blog/CMS | Frappe checkout has web pages and web forms but **no blog doctype**; Twenty/metasfresh have no CMS | `frappe/website/doctype/` |
| Survey scoring/certification | Only Odoo; Nextcloud/Frappe/Dolibarr are forms only | `survey/` |
| Campaign stages | Only Odoo has configurable campaign stages (UTM stages); Frappe uses fixed Email Campaign statuses, others use per-record status | `utm_stage_views.xml`; `email_campaign.json` |

### Notables

- **One campaign key across the suite.** Odoo's `utm.campaign` is referenced by mailings,
  SMS, link trackers, leads and sales orders. That single identifier is what makes
  campaign revenue reporting possible, and it is the strongest structural idea for BOSS:
  every touch (email, SMS, content, event, coupon) carries the campaign id.
- **Send records are separate from campaign records.** Odoo models one campaign with many
  mailings; Frappe models one campaign with many campaign-email schedules; Twenty models
  one campaign with many messages/recipients. This is the right grain for A/B variants,
  retries and per-touch analytics.
- **Audience preview before send.** Twenty's `CampaignAudiencePreviewDTO` explicitly
  returns sendable plus missing-email, duplicate, hard-suppressed, globally-unsubscribed,
  topic-unsubscribed and tracking-refused buckets. No other reference exposes exclusions
  this clearly; it is the best contract for BOSS's send confirmation.
- **Static + dynamic audiences.** Odoo's pairing of mailing lists with saved domain
  filters covers both curated lists and rule-based segments without a separate
  segmentation product.
- **Template library + builder + themes.** Odoo's combination of reusable template
  records, an iframe drag-and-drop builder and a theme catalog is the most complete
  authoring model; the themes also encode common campaign intents (promotion, newsletter,
  event, coupon, catalog).
- **Receiver-side consent is not optional.** Odoo (opt-out reasons + feedback + portal),
  Twenty (unsubscribe topics + suppression reasons) and metasfresh (consent records) all
  treat unsubscribe/preference management as first-class; this belongs in BOSS's Comms
  data model, not in a marketing-only table.
- **Promotions are pricing, not campaigns.** Odoo's loyalty program is independent of
  `utm.campaign`; Frappe's promotional schemes and Dolibarr's price rules likewise live
  in pricing. Marketing links to them; it should not own checkout price evaluation.
- **Website analytics is visitor-centric.** Odoo's visitor/page-view model (country,
  language, visit count, last page, connected flag) is a useful minimal web-analytics
  schema; event- and form-level analytics reuse it.
- **Self-hosted sending needs domain verification.** Twenty is the only reference with a
  first-class sending-domain/DNS verification UI; BOSS needs this because many target
  businesses self-host.
- **No source builds "marketing" as one app.** Odoo splits it across five apps, Frappe
  across Desk/CRM, Dolibarr across independent modules, and metasfresh delegates sending
  to CleverReach. IronStone Marketing should therefore be a composition layer over shared
  Commons/Comms/Sales records, not a new monolith.

### BOSS screen set implied by this research

| BOSS area | Screens to build | Shared with |
| --- | --- | --- |
| Marketing home | Campaign calendar, KPI tiles, shortcuts, "needs attention" (A/B review, failed sends, expiring promotions) | Insights |
| Campaigns | Campaign list/kanban by stage, campaign detail with touches and budget, A/B variant setup, automation steps | Sales (campaign key), Insights |
| Customer 360 (engagement face) | Campaign/touch timeline, opens/clicks, survey responses, consent and opt-out state, suppression controls | Commons contacts, Comms, Sales/CS |
| Audiences | Static list editor, dynamic segment builder, consent/suppression, audience preview with exclusion buckets | Commons contacts, Comms |
| Email/SMS | Template library, composer/editor, send/schedule/test, per-recipient traces, unsubscribe/preferences | Comms (CommunicationEvent, SMTP) |
| Promotions | Program list, rules/rewards, coupon batch/code detail, redemption history | Sales/Commerce pricing, Accounting |
| Content | Page/landing-page editor, blog posts and taxonomy, forms, link tracker/UTM | Commerce site, Commons wiki |
| Events | Event/registration setup, event email schedule, attendee list | Commons calendar, Projects/CS requests |
| Surveys | Form/survey builder, question bank, responses and summary, scoring/certification | Commons forms |
| Analytics | Campaign performance, link clicks, web traffic, attributed pipeline/revenue | Insights |
| Configuration | Sending domains/accounts, consent topics, stages/tags/UTM vocabularies, templates | Admin |

### Explicit absence list

| Source | Verified absence | Evidence |
| --- | --- | --- |
| **Zimbra** | No marketing/campaign/newsletter screens; mail, calendar, admin console only | `Zimbra/zm-web-client/`; `zm-admin-console/` |
| **Carbon** | No marketing/campaign/newsletter screens | grep in `carbon/apps/erp` |
| **Ever Gauzy** | No marketing/campaign/newsletter screens | grep in `ever-co/ever-gauzy/apps/gauzy/src` |
| **Akaunting** | No marketing modules | `akaunting/modules/` |
| **Moqui** | No marketing screens; public sites are content surfaces only | `coarchy/screen/`, `resistmanagement/screen/`, `WeCreate/screen/` |
| **Nextcloud** | No campaigns/newsletters/automation; Mail is a client; Forms/Collectives only | `mail/src/`, `forms/src/`, `collectives/src/` |
| **AureusERP** | No campaigns, email/newsletter, loyalty, coupons or surveys; analytics plugin has no UI | `plugins/webkul/` |
| **metasfresh** | No in-app email designer/newsletter workspace or attribution UI | `backend/de.metas.marketing/`; `frontend/src/components/` |
| **Odoo** | No marketing automation module, no social publishing, no campaign budgets, no referrals | addon listing; `social_media/`; grep in marketing models |
| **Frappe** | No Newsletter doctype, no blog doctype, no campaign UI in the CRM SPA | `frappe/email/doctype/`; `frappe/website/doctype/`; `crm/frontend/src/pages/` |
| **Twenty** | No bespoke marketing home, no segment builder, no template library, no UTM/attribution | `packages/twenty-front/src/modules/side-panel/pages/send-campaign/`; `packages/twenty-front/src/modules/` (no marketing module) |
| **Dolibarr** | No campaign stages/automation/A-B, no coupons/gift cards/loyalty, no click tracking | `htdocs/comm/mailing/`; `htdocs/core/modules/` |

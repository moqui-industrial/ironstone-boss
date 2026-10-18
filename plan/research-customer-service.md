# IronStone BOSS — Customer Service app research

Oct 18, 2026

Deeper research pass on the **IronStone Customer Service** app (Cases/Requests, order
lookup & changes, returns/RMA, availability lookup, Customer 360, knowledge-base links),
cataloguing every relevant screen/page found in the reference apps. Companion to
[3p-app-reference.md](3p-app-reference.md); feeds the Customer Service row in
[initial-design.md](initial-design.md) plus the service face of the shared Customer 360
and Order detail screens.

**Organization.** Sorted by functional area (not by app): all case queues together, all
case-detail surfaces together, etc. Within each area, sub-tables per reference app.
Style mirrors [research-drawers-commons.md](research-drawers-commons.md) and
[research-accounting.md](research-accounting.md).

**Scope.** Business UI only: queues, case forms, conversations, SLA displays, customer
records, order lookup, return flows, availability views, knowledge-base screens. Backend
models are noted only where they shape a screen (status categories, SLA clocks,
returnable-quantity caps, allocation of stock).

**Path conventions.** Paths are relative to each repository's own root, as in
3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Frappe Helpdesk** | `/home/jonesde/work/moquiwork/3p_other/frappe/helpdesk` — agent/customer SPA in `desk/src/` (Vue 3 + frappe-ui), backend doctypes in `helpdesk/helpdesk/doctype/`, portal pages in `helpdesk/helpdesk/www/`, templates in `helpdesk/helpdesk/templates/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — support under `erpnext/support/`, portal pages under `erpnext/templates/pages/`, sales/stock/account doctypes under `erpnext/{selling,stock,accounts}/doctype/` |
| **Frappe framework** | `/home/jonesde/work/moquiwork/3p_other/frappe/frappe` — Help Article/Category live under `frappe/website/doctype/` |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — paths below use `odoo/addons/<addon>/…`; each addon's views in `<addon>/views/`, JS in `<addon>/static/src/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — module pages under `htdocs/<module>/`, shared ticket form in `htdocs/core/class/html.formticket.class.php`, customer tabs in `htdocs/core/lib/company.lib.php` |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — React Router modules under `apps/erp/app/modules/` and route files under `apps/erp/app/routes/x+/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament resources/clusters under `plugins/webkul/<plugin>/src/Filament/` |
| **Akaunting** | `/home/jonesde/work/moquiwork/3p_other/akaunting` — Blade views in `resources/views/` |
| **Moqui Sales** | `/home/jonesde/work/moquiwork/3p_moqui/Sales` — Moqui XML screens in `screen/Sales/`, paired QVue components beside them |
| **Twenty** | `/home/jonesde/work/moquiwork/3p_other/twenty` — paths relative to the repo root (`packages/twenty-front`) |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — React WebUI in `frontend/src/`; business windows and service/repair processes in backend `de.metas.*` modules |

Not used here: Nextcloud, Zimbra, Ever Co and Signal ship no customer-service/case
functionality in this checkout. Nextcloud/Zimbra groupware screens are covered by
[research-drawers-commons.md](research-drawers-commons.md).

Sections: [1 service home & queues](#1-service-home--queues) · [2 case intake & channels](#2-case-intake--channels) · [3 case detail & conversation](#3-case-detail--conversation) · [4 assignment, teams & SLA](#4-assignment-teams--sla) · [5 customer 360](#5-customer-360) · [6 order lookup & changes](#6-order-lookup--changes) · [7 returns / RMA](#7-returns--rma) · [8 availability lookup](#8-availability-lookup) · [9 knowledge base & self-service](#9-knowledge-base--self-service) · [10 feedback, reporting & settings](#10-feedback-reporting--settings) · [11 gaps & notables](#11-gaps--notables)

---

## 1. Service home & queues

### Frappe Helpdesk — agent home + manager dashboard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Agent home | Per-agent, user-arranged chart dashboard: greeting, draggable/resizable chart grid, add/remove charts, save/reset layout. Empty state offers "Add charts to get started". | `desk/src/pages/home/Home.vue`, `desk/src/pages/home/components/{AgentTicketsCard,AvgTimeMetrics,PendingTickets,RecentActivity,RecentFeedback}.vue`, `desk/src/components/frappe-ui/GridLayout` |
| Manager/agent dashboard | Date-preset filter (Today, 7/30/60/90 days, custom range), team and agent filters (managers only), "My Organization" vs "My Stats" toggle, 5 KPI cards, trend charts, master-data charts, tag charts; permission-gated by `Agent Manager` role and agent/team filter. | `desk/src/pages/dashboard/Dashboard.vue`, `helpdesk/api/dashboard.py`, `helpdesk/api/dashboard_tags.py` |
| KPI cards | Tickets created, % SLA fulfilled, Avg. First Response (hrs), Avg. Resolution (days), Avg. Feedback Rating (/5); each shows delta vs the previous equal-length period. | `helpdesk/api/dashboard.py` `get_number_card_data()` |
| Trend charts | Ticket trend (created vs resolved), feedback trend (plotted on resolution date), tickets by team/type/priority/channel, top tags and tag trend. | `helpdesk/api/dashboard.py`, `helpdesk/api/dashboard_tags.py` |
| Ticket queue (agent) | Header view switcher (standard/user/pinned/public views), create button, list builder with row-click open, saved columns, filters, sort; selection banner exposes Reply, Assign, Export, Edit for agents. | `desk/src/pages/ticket/Tickets.vue`, `desk/src/components/ListViewBuilder.vue`, `desk/src/components/view-controls/`, `desk/src/components/ticket-agent/{BulkReplyModal,BulkAssignModal,BulkEditModal}.vue` |
| Ticket queue (customer portal) | Same list component with customer-safe columns; create button routes to customer ticket form; bulk agent actions hidden. | `desk/src/pages/ticket/Tickets.vue` (`isCustomerPortal` gates) |
| Call logs | `TP Call Log` list with caller/receiver avatars, incoming/outgoing type/status, new-call-log modal and detail modal. | `desk/src/pages/call-logs/{CallLogs,CallLogModal,CallLogDetailModal}.vue` |
| Notifications | Mobile notification list; desktop uses the header notifications component. | `desk/src/pages/MobileNotifications.vue`, `desk/src/components/notifications/` |

**BOSS implications.** The queue should be the app's default landing, not a dashboard:
Frappe separates an agent's personal chart home from the manager's operational
dashboard, and the queue is where work actually starts. BOSS can reuse the standard
Moqui `form-list` + saved-find/column model for the case queue, and reserve a small KPI
strip (open/overdue/unassigned, first-response, resolution, CSAT) for the Customer
Service landing page. Adopt Frappe's KPI delta wording ("vs prev. N days") and its split
between "My Stats" and "My Organization"; both map cleanly onto Moqui authz and the
shared Insights widgets.

### ERPNext — Support workspace + issue analytics

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Support workspace | Desk module page: Open/Overdue/Resolved issue number cards, shortcuts to Issue, Maintenance Schedule, Maintenance Visit, Warranty Claim, setup links (Issue Type, Issue Priority, Service Level Agreement), reports and Support Settings. | `erpnext/support/workspace/support/support.json` |
| Issue dashboard charts | "Issues Opened" line chart plus standard number cards; charts are Frappe Dashboard Chart records over `Issue`. | `erpnext/support/dashboard_chart/issues_opened/`, `erpnext/support/number_card/{open_issues,overdue_issues,resolved_issues}/` |
| Issue reports | Issue Summary, Issue Analytics, First Response Time for Issues, Support Hour Distribution. | `erpnext/support/report/{issue_summary,issue_analytics,first_response_time_for_issues,support_hour_distribution}/` |
| Support settings | Close issue after N days, SLA tracking toggle, allow resetting SLA, greeting title/subtitle, search sources, optional forum feed. | `erpnext/support/doctype/support_settings/support_settings.json`; `erpnext/templates/pages/help.py` |

**BOSS implications.** ERPNext is the thinner, record-first alternative: a workspace of
shortcuts and counters rather than a chart canvas. For BOSS, use the workspace pattern
for the app landing page and Frappe Helpdesk's queue for the working screen. The
"Overdue" and "Resolved" number cards are the minimum KPI set worth exposing without a
full BI dependency.

### Carbon — sales/inventory workbenches, no service desk

Carbon ships no case/helpdesk module. Its nearest landing surfaces are the sales
dashboard/order tables and the inventory availability table (see §6–§8). Those are
useful layout references for dense operational lists but not for case management.

### Gaps in the other references

- **Dolibarr:** ticket module has a list and statistics page, but no manager dashboard;
  the module menu exposes Tickets, Categories, and Statistics.
- **Odoo:** no `helpdesk` addon in this community checkout (Helpdesk is Enterprise).
  Service work is split across CRM activities, Repair, and stock returns.
- **AureusERP:** the `support` plugin is shared infrastructure (activities, calendars,
  UOM, companies), not a support desk. No ticket UI exists.
- **Akaunting / Moqui Sales / Twenty / metasfresh:** no case queue. Twenty's record
  index and Moqui's saved finds are useful list-shell references.

---

## 2. Case intake & channels

### Frappe Helpdesk — one ticket model, several entry points

| Screen/page | What it is | Key files |
| --- | --- | --- |
| New ticket (agent) | Template-aware form: template `about` text, visible custom fields (with field dependencies), subject + rich description, attachments, submit. Agent can create without the customer-portal KB search. | `desk/src/pages/ticket/TicketNew.vue`, `desk/src/components/UniInput`, `desk/src/components/Settings/FieldDependency/` |
| New ticket (customer portal) | Same form, but after 3 subject characters it runs article search and shows "These articles may already cover what you are looking for" with matching article title/headings/snippet; "View All" opens the public KB; empty state suggests rephrasing. | `desk/src/pages/ticket/TicketNew.vue`, `desk/src/components/SearchArticles.vue` |
| Web form | Public `HD Ticket` web form with subject, description, priority and custom fields; separate `email_feedback` web form for feedback. | `helpdesk/helpdesk/web_form/tickets/tickets.json`, `helpdesk/helpdesk/web_form/email_feedback/` |
| Email intake | Email Account setup screens (new/edit/list, provider icons); inbound mail creates/threads tickets and outbound replies use the account. Email notifications are configured separately (acknowledgement, reply-to-agents, reply-via-agent, share-feedback). | `desk/src/components/Settings/{EmailAccountList,EmailAccountCard,EmailAdd,EmailEdit,EmailConfig}.vue`, `desk/src/components/Settings/EmailNotifications/`, `helpdesk/templates/emails/` |
| Telephony | Exotel and Twilio settings, in-ticket call UI, call actions, call log list/detail. | `desk/src/components/Settings/Telephony/`, `desk/src/components/telephony/{CallUI,ExotelCallUI,TwilioCallUI}.vue`, `desk/src/components/ticket/TicketCallActions.vue`, `desk/src/pages/call-logs/` |
| Ticket templates | Named templates with "about" copy and template fields; route accepts `templateId` so a portal/queue button can start a pre-shaped case. | `desk/src/router/index.ts` (`/tickets/new/:templateId?`), `helpdesk/helpdesk/doctype/hd_ticket_template/`, `hd_ticket_template_field` |
| Ticket field layout | Per-agent/team field layout and form scripts; customizations fetched per ticket before render. | `helpdesk/helpdesk/doctype/hd_field_layout/`, `hd_form_script/`, `helpdesk/helpdesk/doctype/hd_ticket/api.py` (`get_ticket_customizations`) |
| Customer portal notice | Banner/permission messages for portal users, including outside-working-hours warning on the customer ticket page. | `desk/src/components/banners/CustomerPortalPermissionBanner.vue`, `desk/src/pages/ticket/TicketCustomer.vue` |

**Ticket record fields (screen-shaping subset).** Subject, raised-by email, status,
priority, type, team, description, template, SLA + response/resolution due dates and
agreement status, first-response/resolution times, contact, customer, email account,
via-customer-portal flag, feedback option/rating/extra, merged/split links, last
agent/customer response, raised-outside-working-hours, and failed-by durations.
(`helpdesk/helpdesk/doctype/hd_ticket/hd_ticket.json`.)

**BOSS implications.** IronStone cases are `Request` records, so the intake form should
be a request-type-driven form, not a ticket-only form: the same screen must serve
Customer Service, Projects request intake and Commons "requests assigned". Adopt
Frappe's template + field-dependency model for request types, and its mandatory
article suggestion before submit on the customer-facing form. The most important gap
to close in BOSS is channel capture: Frappe ties email accounts and telephony directly
to the ticket, which is exactly what the Comms/SystemMessage layer should provide as a
shared capability.

### ERPNext — Issue + warranty intake

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Issue form | Subject, raised-by email, status (Open/Replied/On Hold/Resolved/Closed), priority, issue type, description, SLA link and clocks, lead/contact/customer, project, company, resolution details, opening date/time, attachment, via-customer-portal, split-from, average response/resolution, hold time. | `erpnext/support/doctype/issue/issue.json`, `issue.js` |
| Issue web form | Public issue submission form. | `erpnext/support/web_form/issues/` |
| Support portal | Public Help page: search box, "Get Started" sections from Support Settings, latest forum posts, the user's recent tickets, "See all open tickets", "Open a new ticket"; `/kb/support` and `/issues` are website routes. | `erpnext/templates/pages/help.html`, `help.py`, `erpnext/hooks.py` website route rules |
| Warranty Claim | Complaint date, serial no, customer, item, complaint/description, warranty/AMC status + expiry, resolution date/by/details, contact and service address, raised-by, company. | `erpnext/support/doctype/warranty_claim/warranty_claim.json` |
| Maintenance Visit / Schedule | Field-service visits and schedules linked from the Support workspace; useful when a case needs an on-site step. | `erpnext/maintenance/doctype/{maintenance_visit,maintenance_schedule}/` |

**BOSS implications.** ERPNext confirms that warranty/AMC is a separate record from the
case. BOSS should model a case subtype or linked record for warranty claims rather than
stuffing serial/warranty fields into every request. The public help page is the right
shape for a customer-facing support portal: search first, articles second, tickets
third, and a single "open a new ticket" action.

### Dolibarr — ticket form with knowledge suggestions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| New/edit ticket | Reference, company, contact, type, category, severity, subject, message, attachments, notify third party, extra fields. The category selector triggers an AJAX knowledge-base lookup and shows matching articles for the ticket group. | `htdocs/ticket/card.php`, `htdocs/core/class/html.formticket.class.php` |
| Public ticket portal | Public index with Create Ticket / View My Ticket List / Show Ticket With Track ID; separate create/list/view pages and document download. | `htdocs/public/ticket/{index,create_ticket,list,view,document}.php` |
| Ticket list | Filters incl. company, contact, type/category/severity, assignee, status; mass actions; statistics view. | `htdocs/ticket/list.php`, `htdocs/ticket/stats/index.php` |

**BOSS implications.** Dolibarr's category→KB suggestion is a lighter alternative to
Frappe's full-text article search: when a request type/category is chosen, show the
articles linked to that category. That is cheap to implement on Mantle categories and
useful even when no free-text search service is configured.

---

## 3. Case detail & conversation

### Frappe Helpdesk — activity-centric ticket page

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Ticket header | Breadcrumb + view context, active viewers (presence avatars), custom actions, status dropdown (agent vs customer labels/colors), merge action, subject edit, kebab menu. | `desk/src/components/ticket-agent/TicketHeader.vue`, `TicketSubjectModal.vue`, `desk/src/components/ticket/TicketMergeModal.vue` |
| Activity panel | Tabs: Activity, Emails, Comments, Calls (when telephony enabled), Analytics. Each tab reuses the timeline filtered by communication type; a persistent communication area at the bottom sends email replies. | `desk/src/components/ticket-agent/TicketActivityPanel.vue`, `desk/src/components/ticket-agent/timeline/TicketTimeline.vue`, `desk/src/components/CommunicationArea.vue` |
| Timeline | Shared activity-timeline feed (`HD Ticket`, visible types), pinned-comments bar, per-row comments, reactions, email reply hooks. | `desk/src/components/ticket-agent/timeline/{TicketTimeline,TimelineCommentRow,TimelineReactions,PinnedCommentsBar}.vue`, `helpdesk/api/timeline.py` |
| Sidebar | Contact card, SLA cards, feedback block (once rated), Overview (assignee, core fields, tags), More Details (custom fields), Recent Tickets, Similar Tickets; resizable split. | `desk/src/components/ticket-agent/{TicketSidebar,TicketDetailsTab,TicketSLA,TicketContact}.vue`, `desk/src/components/customer/TicketStats.vue` |
| Communication composer | Rich text, attachments with upload tracking, Ctrl/Cmd+Enter send, email/comment modes, canned replies selector, saved-reply action chips. | `desk/src/components/{CommunicationArea,TicketTextEditor,EmailEditor,SavedRepliesSelectorModal}.vue`, `desk/src/components/SavedReplyActions/` |
| Split / merge | Split a ticket into a new one; merge duplicates into a target, with merged-with link and subject modal. | `desk/src/components/ticket/{TicketSplitModal,TicketMergeModal}.vue`, `hd_ticket_split_from` / `is_merged` / `merged_with` fields |
| Customer ticket page | Simpler conversation + attachments composer, Close button, Details tab on mobile, customer-side template fields, feedback dialog, outside-hours banner, customer sidebar. | `desk/src/pages/ticket/{TicketCustomer,TicketConversation,TicketCustomerTemplateFields,TicketFeedback}.vue`, `desk/src/components/ticket/TicketCustomerSidebar.vue` |
| Ticket analytics tab | Per-ticket analytics: metric cards, conversation summary, ticket timeline. | `desk/src/components/ticket-agent/analytics/{TicketAnalyticsTab,AnalyticsMetricCards,ConversationSummary,TicketTimeline}.vue` |

**BOSS implications.** This is the strongest case-detail reference in the checkout.
Copy the structure: one record header with status + owner, one activity timeline that
can filter by channel, one fixed composer, and a right sidebar split into customer,
SLA, fields, tags and related cases. Map the tabs directly onto CommunicationEvent
types (email, comment/note, call, chat) rather than inventing case-only activity. The
"Recent / Similar Tickets" block is cheap and valuable; similarity can start as
same-customer + same-type + recent, without any ML.

### ERPNext — Issue conversation

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Issue detail | Standard Frappe form with status/priority/type/SLA fields and the framework's timeline/comment/attachment sidebar; resolution details captured before close. | `erpnext/support/doctype/issue/issue.js`, `issue.json` |
| Issue list row | Compact portal row with subject, status and modified date. | `erpnext/templates/includes/issue_row.html` |
| Support reports | Issue Summary and Issue Analytics provide queue-level conversation/response analysis rather than per-case views. | `erpnext/support/report/issue_summary/`, `issue_analytics/` |

**BOSS implications.** ERPNext's case detail is just the generic Frappe form + timeline;
BOSS can do better by making the communication timeline the primary column and fields
secondary, as Frappe Helpdesk does.

### Dolibarr — ticket card with message log

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Ticket card | Header with ref/status/assignee, message thread, private/public notes, linked documents, contacts, project/company links, status actions (assign, in progress, need more info, on hold, close, cancel, reopen), event log. | `htdocs/ticket/card.php`, `htdocs/ticket/messaging.php`, `htdocs/ticket/note.php`, `htdocs/ticket/document.php`, `htdocs/ticket/contact.php` |
| Ticket agenda | Events linked to the ticket. | `htdocs/ticket/agenda.php` |
| Status model | Not read → read → assigned → in progress → need more info → on hold → closed (solved) / canceled; short and long labels for each. | `htdocs/ticket/class/ticket.class.php` (`STATUS_*`) |

**BOSS implications.** Dolibarr's status ladder is a good default for a small-business
request workflow, and it separates "need more information" (waiting on customer) from
"on hold" (waiting internally). BOSS should make both pauses explicit because they have
different SLA semantics: customer-wait normally pauses the clock, internal hold may or
may not.

### Odoo — chatter, activities and repair orders

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chatter | Message/note/activity/attachment timeline on any record, including partners and sale orders; activity kanban/list widgets expose scheduled next actions. | `odoo/addons/mail/views/*.xml` (`<chatter/>`), `odoo/addons/mail/views/res_partner_views.xml`, `odoo/addons/sale/views/sale_order_views.xml` |
| Repair order | Repair Order list/kanban/form/graph/pivot: customer/product/lot, schedule, state (draft → confirmed → done/cancel), parts and operations, reserve/unreserve, quote/invoice actions, forecasted availability widget on parts, repair notes, Responsible/Technician, tags, late/ready filters. | `odoo/addons/repair/views/repair_views.xml`, `odoo/addons/repair/models/repair.py` |
| Repair reports | Repair quotation/order report templates (no customer portal in this addon). | `odoo/addons/repair/report/repair_reports.xml`, `repair_templates_repair_order.xml` |

**BOSS implications.** Repair is a different workflow from a case, but Customer Service
often needs it. BOSS should keep "case" and "repair/return order" as linked records:
the case holds communication and SLA, the repair order holds parts, operations and
stock. Do not merge them into one form.

### Carbon — operational record pages

Carbon has no case detail. Its record-page pattern (header + sidebar + route tabs) is
visible in customers and orders and is a useful shell reference; see §5–§7.

---

## 4. Assignment, teams & SLA

### Frappe Helpdesk — assignment rules, teams, agent availability

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Assignment rules list/editor | Rules have name, priority (Low → High), disabled switch, description, condition builder (assign + unassign), and a rule mode. Editor supports legacy Python conditions and the structured condition builder. | `desk/src/components/Settings/Assignment Rules/{AssignmentRules,AssignmentRulesListView,AssignmentRuleView,AssignmentRulesList,AssignmentRuleListItem,AssignmentConditionsFilter}.vue`, `helpdesk/api/assignment_rule.py` |
| Rule distribution | Frappe core Assignment Rule modes: Round Robin, Load Balancing, Based on Field, Weighted Distribution; users table, last user, assignment days, due-date field, close condition. | `3p_other/frappe/frappe/frappe/automation/doctype/assignment_rule/assignment_rule.json` |
| Teams | Team name, users (multi-select), assignment rule, "ignore restrictions" switch, disabled switch. Team modal, edit, rename, member selector. | `helpdesk/helpdesk/doctype/hd_team/`, `hd_team_member`, `desk/src/components/Settings/Teams/{TeamsList,TeamEdit,NewTeam,AgentSelector}.vue` |
| Agents | Agent user link, display name, active flag, image, availability status and who/when changed. Availability options carry Active/Away/Unavailable categories, ordering and colors. | `helpdesk/helpdesk/doctype/hd_agent/`, `hd_agent_status/`, `desk/src/components/Settings/Agents.vue`, `AgentCard.vue` |
| SLA list/editor | Service level name, holiday list, start/end dates, working-hours table, per-priority response/resolution times, default SLA/priority, rank, enabled, apply-to-resolution switch, condition, reopen status, default status. | `helpdesk/helpdesk/doctype/hd_service_level_agreement/`, `hd_service_level_priority/`, `hd_service_day/`, `desk/src/components/Settings/Sla/{SlaPolicies,SlaPolicyView,SlaPolicyList,SlaPriorities,SlaWorkDays,SlaHolidays}.vue` |
| SLA display | First Response and Resolution cards: fulfilled in X, due by, on-hold since, actual responded/resolved timestamps, delay in working hours and total delay; color shifts to danger on failure. | `desk/src/components/ticket-agent/TicketSLA.vue`, `desk/src/composables/useSLA.ts` |
| Holidays | Holiday list with from/to date, total, weekly-off day, generate weekly-off dates, recurring holidays, holiday rows and color; calendar and table views. | `helpdesk/helpdesk/doctype/hd_service_holiday_list/`, `hd_holiday/`, `desk/src/components/Settings/Holiday/` |

**BOSS implications.** Copy the data model, not just the UI: SLA = calendar (working
hours + holidays) × per-priority response/resolution targets × statuses that pause or
fulfil the clock. BOSS already has `Request` and party/role data, so the SLA record
should attach to request type/customer/team and compute response/resolution due dates
server-side; the ticket screen only displays the computed clocks. Assignment must be
rule-based and auditable: priority-ordered conditions, explicit assign/unassign
conditions, and one of round-robin / load-balancing / weighted distribution. Agent
availability belongs in the header presence model, not a case-only table.

### ERPNext — Service Level Agreement + pause/fulfil status lists

| Screen/page | What it is | Key files |
| --- | --- | --- |
| SLA form | Service level name, holiday list, start/end, working hours (service days), priorities (response/resolution times), entity (Customer/Customer Group/Territory), default SLA/priority, pause-on statuses, apply-on document type, fulfilled-on statuses, apply-for-resolution, condition. | `erpnext/support/doctype/service_level_agreement/service_level_agreement.json` |
| SLA child tables | Service Day (weekday/start/end), Service Level Priority (priority, response time, resolution time, default), Pause SLA On Status, SLA Fulfilled On Status. | `erpnext/support/doctype/{service_day,service_level_priority,pause_sla_on_status,sla_fulfilled_on_status}/` |
| Issue priority/type masters | Simple name + description masters; no per-priority colour or customer label. | `erpnext/support/doctype/{issue_priority,issue_type}/` |
| Support settings | `track_service_level_agreement`, `allow_resetting_service_level_agreement`, `close_issue_after_days`. | `erpnext/support/doctype/support_settings/support_settings.json` |

**BOSS implications.** ERPNext's pause/fulfil status lists are the important detail:
SLA behaviour is driven by request status, so statuses must be classified once
(open/paused/resolved/closed) and reused by every SLA and dashboard. For BOSS, store the
category on the status record, as Frappe Helpdesk does (`HD Ticket Status.category`),
and derive pause/fulfil behaviour from the category plus optional per-SLA overrides.

### Dolibarr / Odoo / Carbon

- **Dolibarr** has no SLA engine and no assignment rules; tickets have a single assignee
  and a fixed status ladder. It is a useful example of keeping the model simple for
  small teams.
- **Odoo** community has no helpdesk SLA. Activities and teams can emulate assignment,
  but there is no response/resolution clock. Sales/repair use standard activities for
  follow-up.
- **Carbon** has no service desk or SLA; its order/return assignee fields and status
  machines are the closest analogue.

---

## 5. Customer 360

### Frappe Helpdesk — customer and contact records

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customer page | Header with image/name/type/domain/primary contact; Edit and delete actions; ticket stats strip; tabs Tickets and Contacts with counts; ticket list filterable by contact when a customer has multiple contacts. | `desk/src/pages/customer/{Customer,Customers}.vue`, `desk/src/components/customer/{TicketsTab,CustomerContactTab,ContactCard}.vue` |
| Customer stats | Four compact charts/cards: avg. feedback received (with review count), failed SLAs, avg. first response time, avg. resolution time; scoped to the customer or contact. | `desk/src/components/customer/TicketStats.vue`, `helpdesk/api/ticket_stats.py` |
| Contact page | Contact info (email/phone/country), invitation badge/actions, ticket stats, tabs Tickets and Feedback with counts; linked customers, invite/reset-password actions. | `desk/src/pages/contact/Contact.vue`, `desk/src/components/contact/{ContactCustomers,ContactFeedback,EditContactDialog}.vue` |
| Customer/contact dialogs | New/edit customer, invite contact, revoke invite, new/edit contact; customer deletion explicitly removes references from related tickets. | `desk/src/components/customer/{NewCustomerDialog,EditCustomerDialog,InviteContactDialog,RevokeInviteButton,DeleteWithTicketsDialog}.vue`, `desk/src/components/contact/{NewContactDialog,EditContactDialog}.vue` |
| ERPNext integration | Union-merge HD Customers with ERPNext Customers, link both directions, mirror DocShares so portal users see the same customer in both apps; sync settings with in-sync gate and "Sync now". | `helpdesk/integrations/erpnext/{api,customer,doc_share}.py`, `desk/src/components/erpnext-integration/ERPNextIntegrationSettings.vue` |

**BOSS implications.** This is almost exactly the shared Customer 360 surface BOSS
needs, minus orders and money. Reuse one party record with tabs whose content is
role-driven: Customer Service shows tickets/contacts/feedback; Sales adds opportunities;
Accounting adds invoices/credit; Commerce adds store orders. The stats strip should be
permission-gated (a support agent sees service metrics, not receivables). The ERPNext
integration is a warning as much as a reference: BOSS must not create a second customer
master; Customer Service should read the same Party as Sales/Accounting.

### ERPNext — customer overview + dashboard links

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customer form Overview tab | Period selector (Current Fiscal Year, Last 12 Months, This Quarter, Last Fiscal Year) and company selector; position KPIs (net sales + invoice count + YoY delta), sales trend chart, receivables/ageing chart, Open Pipeline stat cards (open quotations, open orders, unpaid invoices), recent transactions; sections hide when the viewer lacks accounts permissions. | `erpnext/selling/doctype/customer/customer_overview.py`, `erpnext/public/js/{party_overview,customer_overview}.js`, `erpnext/selling/doctype/customer/customer.json` (`overview_html`) |
| Customer dashboard links | Transaction groups: Pre Sales (Opportunity, Quotation), Orders (Sales Order, Delivery Note, Sales Invoice), Payments (Payment Entry, Bank Account, Dunning), Support (Issue, Maintenance Visit, Installation Note, Warranty Claim), Projects, Pricing, Subscriptions. | `erpnext/selling/doctype/customer/customer_dashboard.py` |
| Customer portal | `/orders`, `/invoices`, `/shipments`, `/issues` website routes; document detail pages render the submitted document, attachments, payment button and print action. | `erpnext/hooks.py` portal route rules, `erpnext/templates/pages/order.{html,py}`, `erpnext/controllers/website_list_for_contact.py` |

**BOSS implications.** ERPNext's Overview tab is the best evidence for how much should
be visible on Customer 360 without leaving the page: commercial position, trend,
receivables/ageing, pipeline and recent transactions. For BOSS, make each block a
reusable screen/query with its own authz so the same Customer 360 can be embedded in
Sales, Customer Service and Accounting with different blocks. The dashboard links are
the navigation contract: every linked document type should open the shared record screen.

### Dolibarr — third-party card as the 360 hub

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Third-party card | Header + tab strip assembled from enabled modules and permissions: Third Party, Contacts/Addresses, Prospect/Customer, Customer Prices, Supplier, Accounting, Projects, Resources, Referring Items, Bank Accounts, Web Site Accounts, Partnerships, Tickets, Event Organization, Notifications, Notes, Documents, Events. Badges show counts for contacts, projects, tickets, notes, documents. | `htdocs/societe/card.php`, `htdocs/core/lib/company.lib.php` `societe_prepare_head()` |
| Customer/prospect tab | Prospect/customer status and commercial settings; orders/invoices/proposals/contracts/interventions are added as module tabs by hooks. | `htdocs/comm/card.php`, `htdocs/societe/card.php` |
| Ticket tab | Direct link into the ticket list filtered by `socid`, with open-ticket count badge. | `htdocs/core/lib/company.lib.php`; `htdocs/ticket/list.php` |
| Notes/documents/events | Notes, attached files, agenda/events and notifications tabs on the same card. | `htdocs/societe/{note,document,agenda}.php` |

**BOSS implications.** Dolibarr proves the tabbed third-party hub works for small
businesses and that tabs should be module-contributed with count badges. BOSS's version
should be a shared `Party` 360 with tab registration from each app: Service adds Cases
and Feedback, Sales adds Opportunities/Orders, Accounting adds Invoices/Balance, Commons
adds Files/Notes/Calendar. Keep the badge counts cheap; Dolibarr caches some counts
because the card otherwise queries every module.

### Odoo — partner form, stat buttons and chatter

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Partner form | Standard contact/company form with stat buttons from installed modules: Sales (sale order count), Invoicing (total invoiced, vendor bills), stock lots/serials; sales/purchase and accounting settings pages; chatter with activities. | `odoo/addons/sale/views/res_partner_views.xml`, `odoo/addons/account/views/partner_view.xml`, `odoo/addons/stock/views/res_partner_views.xml`, `odoo/addons/mail/views/res_partner_views.xml` |
| Sale order form | Status bar, customer/address/payment/terms, order lines, delivery/invoice/pickup progress, chatter, stat buttons to deliveries/invoices. | `odoo/addons/sale/views/sale_order_views.xml` |
| Repair order partner link | Repairs are visible from the partner's repair orders; the repair form links sale order, invoice and product moves. | `odoo/addons/repair/views/{repair_views,res_partner_views}.xml` |

**BOSS implications.** Odoo's stat-button pattern is the cleanest "one record, many
apps" navigation: a count button in the header jumps to a filtered list. BOSS should
adopt that for Party 360 and for Order detail (cases, shipments, invoices, returns),
using the shared context plumbing so Assist and the header tray can see the current
record.

### Carbon — customer record with module tabs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customer record | Header with status, tags, type, contacts/phone chrome, audit log and delete; sidebar tabs: Details, Contacts, Locations, Payment, Bank Accounts, Documents, Tax, Shipping, Risks, RFQs, Quotes, Orders, Invoices (filtered lists). | `apps/erp/app/routes/x+/customer+/`, `apps/erp/app/modules/sales/ui/Customer/{CustomerHeader,CustomerSidebar}`, `apps/erp/app/modules/sales/ui/Customer/CustomerSidebar/useCustomerSidebar.tsx` |
| Customer forms | Details, contacts, locations, shipping, tax, payment, bank accounts, risk register. | `apps/erp/app/modules/sales/ui/Customer/{CustomerForm,CustomerContactForm,CustomerLocationForm,CustomerShippingForm,CustomerTaxForm,CustomerPaymentForm,CustomerBankAccountForm,CustomerRiskRegister}.tsx` |
| Customer list | Searchable/filterable table with types/statuses; create/edit routes. | `apps/erp/app/modules/sales/ui/Customers/CustomersTable.tsx`, `apps/erp/app/routes/x+/sales+/customers.tsx` |

**BOSS implications.** Carbon's sidebar is the right density for a 360 record: each tab
is a focused form/list, not a dashboard. For Customer Service, the equivalent tabs are
Cases, Contacts, Orders, Returns, Invoices (read-only), Files and Notes. Risk/credit
tabs belong to Accounting but can be surfaced read-only when the viewer has permission.

### Twenty — configurable record page

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Record show page | Configurable page layout per object: fields, timeline, notes, tasks, emails/email thread, files, calendar, chat, call recording; header with record title/identifier bar, actions and navigation between records. | `packages/twenty-front/src/pages/object-record/{RecordShowPage,RecordShowPageShell,RecordShowPageContent}.tsx`, `packages/twenty-front/src/modules/page-layout/widgets/` |
| Timeline widget | Aggregated activity history with type filters, month grouping, linked-record metadata and diff rendering. | `packages/twenty-front/src/modules/activities/timeline-activities/{components,hooks,utils}/` |
| Company/People record pages | Standard objects use the same record shell; companies show people/opportunities, people show company/activities. | `packages/twenty-front/src/modules/{companies,people}/` |

**BOSS implications.** Twenty is the reference for user-arrangeable record pages. For
BOSS, do not build a separate Customer 360; build a Party record page whose widgets are
registered by app, then let users arrange them. The timeline widget is the same shared
activity feed needed by cases and orders, so it should be one component, not three.

### Akaunting / Moqui Sales — lighter customer surfaces

- **Akaunting:** customer show page is a contact card plus tabs/actions from the
  contacts module; the customer *portal* dashboard shows contact info, last payment,
  outstanding balance, latest invoices, invoice history and payment history. Useful for
  the customer-facing balance view, not for service.
- **Moqui Sales:** `ViewAccount` shows contact methods, related contacts, opportunities
  and orders in a three-column layout with a tabbed center panel; it is a working
  pattern for a Moqui-native 360 but stops short of cases, invoices or balances.

---

## 6. Order lookup & changes

### ERPNext — sales order desk + customer portal

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales Order list | Searchable list by customer/status/date; list settings and standard filters. | `erpnext/selling/doctype/sales_order/`, `erpnext/selling/doctype/sales_order/sales_order_list.js` |
| Sales Order form | Customer/address/contact, order date + delivery date, order lines, taxes, status, delivery/billing progress (`per_delivered`, `per_billed`, `per_picked`, `delivery_status`, `billing_status`), advance payment status, stock reservation state, delivery schedule dialog, Create buttons (Delivery Note, Sales Invoice, Payment, etc.). | `erpnext/selling/doctype/sales_order/{sales_order.json,sales_order.js}`, `erpnext/selling/doctype/sales_order/test_sales_order.py` |
| Portal order list | `/orders` route renders the customer's Sales Orders with order number, date, shipping status (pending/started/partial/full), total and status; pagination and search. | `erpnext/hooks.py` (`/orders` -> `Sales Order`), `erpnext/controllers/website_list_for_contact.py` |
| Portal order detail | `/orders/<name>` renders the submitted order: header status, customer/contact, item table, taxes, addresses, payment button when a payment request is allowed, print action, attachments, sidebar invoices. | `erpnext/templates/pages/order.{html,py}`, `erpnext/templates/includes/order/order_taxes.html`, `erpnext/hooks.py` |
| Portal invoices/shipments | `/invoices` and `/shipments` route to Sales Invoice / Delivery Note lists and detail pages with the same document shell. | `erpnext/hooks.py` portal route rules |
| Credit note / return | Sales Invoice has `Is Return (Credit Note)`, `Return Against`, `Is Rate Adjustment Entry (Debit Note)`; a submitted invoice exposes "Return / Credit Note". Delivery Note exposes "Sales Return" and carries `Is Return` + `Return Against Delivery Note`. | `erpnext/accounts/doctype/sales_invoice/{sales_invoice.json,sales_invoice.js,mapper.py}`, `erpnext/stock/doctype/delivery_note/{delivery_note.json,delivery_note.js,mapper.py}`, `erpnext/controllers/sales_and_purchase_return.py` |

**BOSS implications.** The order screen for Customer Service should be the shared
Order detail with a service action set, exactly as ERPNext reuses one Sales Order form
but shows different Create buttons by permission. The portal list must show delivery
and invoice progress at a glance; the detail must show items, addresses, tracking,
invoices and returns. Editing rules belong to the order status: draft can change,
submitted can only be amended/cancelled per policy, and service staff should get an
explicit "request change" action rather than silent edit rights.

### Odoo — portal order page + back-office sale order

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Portal order list | `/my/orders`: search, sort by order date, order number/date/shipping status/total; quotations page is the same shell. | `odoo/addons/sale/controllers/portal.py`, `odoo/addons/sale/views/sale_portal_templates.xml` (`portal_my_orders`) |
| Portal order detail | Order status, order lines, totals, delivery/invoice sidebar, addresses, payment/sign modals, "Order Again", download/print, invoice download; `sale_stock` adds delivery tracking and a Return button. | `odoo/addons/sale/views/sale_portal_templates.xml` (`sale_order_portal_template`, `sale_order_portal_content`), `odoo/addons/sale_stock/views/sale_stock_portal_template.xml`, `odoo/addons/sale_stock/controllers/portal.py` |
| Back-office sale order | Status bar, customer/address/payment terms, order lines with availability/forecast, delivery and invoice stat buttons, chatter, confirm/cancel/lock actions. | `odoo/addons/sale/views/sale_order_views.xml` |
| Order-again flow | Portal action re-adds the same lines to a new cart/order. | `odoo/addons/sale/views/sale_portal_templates.xml` |
| Repair order | For service-repair cases: draft → confirmed → done, parts/services, reserve/unreserve, quote/invoice, forecasted availability. | `odoo/addons/repair/views/repair_views.xml`, `odoo/addons/repair/models/repair.py` |

**BOSS implications.** Odoo's portal is the best customer-facing order reference:
shipping status pills, invoice sidebar, reorder, payment and a return entry point. BOSS
should expose the same read-only order view inside Customer Service and add the
service actions (case link, return, address change request) without granting general
sales edit rights. "Order Again" is a Sales/Commerce action, not a service action.

### Dolibarr — order card and shipment tracking

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Order list | Filters by ref/customer/date/status/warehouse/project; create order; mass actions; export. | `htdocs/commande/list.php` |
| Order card | Header with ref/customer/status, lines, availability delay selector, warehouse selector, shipping method, notes, linked documents/events; actions Validate, Modify, Create Shipment, Create Bill, Classify Shipped, Close, Cancel, Reopen. | `htdocs/commande/card.php`, `htdocs/commande/class/commande.class.php` (`STATUS_*`) |
| Shipment card | Lines with qty shipped/to ship, warehouse stock warnings, tracking number and tracking URL, shipping date, signed status, documents/notes/events. | `htdocs/expedition/card.php`, `htdocs/expedition/class/expedition.class.php` |
| Customer order/shipment tabs | Customer card links to filtered orders/invoices/shipments through module tabs. | `htdocs/core/lib/company.lib.php`, `htdocs/societe/card.php` |

**BOSS implications.** Dolibarr's order card is a good model for the service action set:
Validate, Create Shipment, Create Bill, Classify Shipped, Close, Cancel and Reopen are
explicit buttons rather than a free-form status dropdown. For Customer Service, surface
only the read-only subset plus Cancel/Return/Address change requests. Tracking number
and tracking URL belong on the shipment, not the order.

### Carbon — order table and route-level actions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales order list | Table columns: Sales Order Number, Customer, Status, Jobs, Customer PO, Order Date, Order Total, Assignee, Promised Date, Shipping Method, Location, Payment Terms, Drop Shipment, Created/Updated By/At. Favorite filter route. | `apps/erp/app/modules/sales/ui/SalesOrder/SalesOrdersTable.tsx`, `apps/erp/app/routes/x+/sales+/orders.tsx`, `orders.favorite.tsx` |
| Sales order detail routes | Shell + tabs: details, lines, line jobs, line shipment, shipment, payment, invoice summary, status, confirm, cancel preview, contract, exchange rate; delete line/order. | `apps/erp/app/routes/x+/sales-order+/` (`$orderId.*`), `apps/erp/app/modules/sales/ui/SalesOrder/` |
| Order status | Draft, In Progress (jobs incomplete), Needs Approval, To Ship and Invoice, To Ship, To Invoice, Completed, Cancelled, Closed; status badge colors and job-derived "In Progress". | `apps/erp/app/modules/sales/sales.models.ts` (`salesOrderStatusType`), `ui/SalesOrder/SalesStatus.tsx` |
| Customer portal | Portal configuration per customer (create/edit/delete) and portal line/operation progress UI; portal implementation is Enterprise (`ee`). | `apps/erp/app/routes/x+/sales+/customer-portals*.tsx`, `apps/erp/app/modules/sales/ui/CustomerPortals/*.ee.tsx`, `ui/CustomerPortal/` |

**BOSS implications.** Carbon's route-per-action model is worth copying: confirm,
cancel, shipment, payment and invoice are separate routes with their own permissions and
validation, not one giant form. For Customer Service, order detail can reuse the shell
but only mount the read-only tabs plus service actions; the route-level separation makes
that authz easy.

### Moqui Sales — Find/View Order (alpha)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Find Order | Saved finds, CSV/XLSX export, selectable columns, filters by account, order ID/name, status, total range; create-order dialog (store, customer); row links to account/order. | `screen/Sales/Order/FindOrder.xml` (and `.qvue`) |
| View Order | Order header (status, created, grand total, customer email), ship-to/bill-to blocks with address selection and editing, shipping method + live shipping options, payment information; explicitly marked "alpha" with placeholder text "Put order buttons here (change status, etc)". | `screen/Sales/Order/ViewOrder.xml` (and `.qvue`) |
| Account → orders | `ViewAccount` lists the account's orders and links each to View Order. | `screen/Sales/Account/ViewAccount.xml` |

**BOSS implications.** Moqui Sales proves the data path (Mantle order views, party
contact info, shipping options) but not the finished UI: the order screen openly lacks
status actions, shipments, invoices and returns. BOSS can reuse the Mantle lookups and
build the missing action set; do not port the alpha screen as-is.

### Akaunting — invoices, not orders

Akaunting has no sales-order entity in this checkout. Its customer portal shows invoices,
payments and outstanding balance (`resources/views/portal/`), and the back office has
Sales → Customers/Invoices. It is a reference for the *billing* side of order lookup,
not for order lifecycle.

---

## 7. Returns / RMA

### Carbon — complete RMA workflow

| Screen/page | What it is | Key files |
| --- | --- | --- |
| RMA list | Table columns: RMA Number, Customer, Status, Customer Reference, Order Date, Received, Credited, Assignee, Created At; searchable/filterable. | `apps/erp/app/modules/sales/ui/SalesReturnOrders/SalesReturnOrdersTable.tsx`, `apps/erp/app/routes/x+/sales+/rmas.tsx` |
| New/edit RMA | Customer, contact, location, source sales order, RMA ID, order date, expiration, currency, status; description: "A return merchandise authorization (RMA) authorizes a customer to return goods for credit, replacement, or repair." | `ui/SalesReturnOrders/SalesReturnOrderForm.tsx`, `apps/erp/app/routes/x+/sales-return-order+/new.tsx` |
| Returnable lines picker | Loads delivered, returnable shipment lines; snapshots item/price/UoM/sales-order line; quantity clamped to `returnableQuantity`; submits all selected lines. | `ui/SalesReturnOrders/ReturnableLinesModal.tsx`, `apps/erp/app/routes/x+/sales-return-order+/returnable-lines.tsx` |
| RMA detail / summary | Header actions Confirm, Cancel, Receive, Ship, Issue Credit, Create Replacement/Replacement Order, Reopen, Delete; line summary with ordered/received quantities, restock fee, subtotal/total. | `ui/SalesReturnOrders/{SalesReturnOrderHeader,SalesReturnOrderSummary,SalesReturnOrderStatus}.tsx`, `apps/erp/app/routes/x+/sales-return-order+/$id.tsx` |
| Line details | Source linkage (shipment/order/invoice line), item, return quantity, unit price, restock fee percent, return reason, disposition; "Resume/Stop Receiving". | `ui/SalesReturnOrders/SalesReturnOrderLineForm.tsx`, `apps/erp/app/routes/x+/sales-return-order+/$id.$lineId.details.tsx` |
| Disposition / issue | Line disposition: Pending, Return to Customer, Rework, Scrap, Use As Is; Scrap/Rework go through an issue/escalation route; receiving is opened/closed per line. | `sales.models.ts` (`salesReturnDispositionType`), `routes/x+/sales-return-order+/$id.$lineId.{disposition,issue,receiving}.tsx` |
| Credit | Credits received-but-not-yet-credited quantity per line; creates a credit memo; caps enforced server-side with row locking. | `ui/SalesReturnOrders/SalesReturnOrderCreditModal.tsx`, `routes/x+/sales-return-order+/$id.credit.tsx` |
| Replacement | Creates a replacement sales order from the RMA. | `routes/x+/sales-return-order+/$id.replacement.tsx`, `SalesReturnOrderHeader.tsx` |
| Return reasons | Return reason master with "Zero Inventory Value" flag (returned goods re-enter inventory at zero value). | `ui/ReturnReasons/{ReturnReasonForm,ReturnReasonsTable}.tsx`, `routes/x+/sales+/return-reasons*` |

**BOSS implications.** This is the reference implementation to follow. Model an RMA as
its own record linked to order/shipment/invoice lines, with a per-line disposition and
separate received/credited quantities. The state machine is Draft → To Receive →
Completed/Cancelled, with actions Confirm, Receive, Ship (return to customer), Issue
Credit, Create Replacement, Cancel. Critical invariants: returnable quantity comes from
delivered lines, credit is capped by received quantity, and cancellation releases the
authorized quantities back to the source documents.

### Odoo — portal returns, stock returns and repair

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Portal return entry | `/my/order/return_data` builds returnable lines from done outgoing moves and return reasons; portal shows a Return button when `allow_spontaneous_returns` and within `return_validity_days`. | `odoo/addons/sale_stock/controllers/return_order.py`, `odoo/addons/sale_stock/models/sale_order.py` (`_is_portal_return_allowed`) |
| Return label | Downloads a PDF return label grouped by picking, logs the returned products + reason in the order chatter. | `sale_stock/controllers/return_order.py`, `sale_stock/views/sale_stock_portal_template.xml`, report `sale_stock.action_report_return_label` |
| Return reasons | Return reason master + settings (allow spontaneous returns, validity days, link to reasons). | `sale_stock/views/return_reason_views.xml`, `sale_stock/views/res_config_settings_views.xml` |
| Stock return | Delivery/picking form exposes Return and Exchange; return creates a reverse transfer linked by `return_id`; "Returns" stat button lists them; return report grouped by reason. | `stock/views/stock_picking_views.xml`, `stock/models/stock_picking.py` (`action_return`, `action_exchange`, `action_see_returns`), `sale_stock/views/stock_picking_views.xml` |
| Repair order | Repair workflow for returned/defective goods: confirm, reserve parts, parts/services, end repair, quote/invoice, cancel/reopen. | `repair/views/repair_views.xml`, `repair/models/repair.py` |
| Returns reporting | Graph/pivot over incoming pickings with `return_id`, grouped by return reason. | `sale_stock/views/stock_picking_views.xml` (`action_stock_picking_return_report`) |

**BOSS implications.** Odoo separates three things BOSS must keep separate: a
customer-initiated return request (portal, reason, label), the physical return transfer
(stock), and the repair/replacement/credit outcome. For Customer Service, the case
should link to the return request and show its status; Warehouse owns the physical
receipt; Accounting owns the credit. "Allow spontaneous returns" and a validity window
are valuable policy switches.

### ERPNext — delivery return + credit note + warranty claim

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales Return from Delivery Note | Submitted Delivery Note → Create → Sales Return; creates a return Delivery Note with `is_return`, `return_against`, inverted quantities and warehouse. | `erpnext/stock/doctype/delivery_note/delivery_note.js`, `delivery_note/mapper.py` (`make_sales_return`), `erpnext/controllers/sales_and_purchase_return.py` (`make_return_doc`) |
| Return / Credit Note from Invoice | Submitted Sales Invoice → Return / Credit Note; `is_return`, `return_against`, optional debit note; updates outstanding and stock when applicable. | `erpnext/accounts/doctype/sales_invoice/sales_invoice.js`, `mapper.py` (`make_sales_return`) |
| Warranty Claim | Separate record for serialized/defective goods with warranty/AMC status, complaint, resolution, contact and service address. | `erpnext/support/doctype/warranty_claim/warranty_claim.json` |
| Return reports | Standard Accounts Receivable and stock reports reflect returns/credit notes; no dedicated RMA entity. | `erpnext/accounts/report/`, `erpnext/stock/report/` |

**BOSS implications.** ERPNext has no RMA record: returns are negative Delivery Notes
and Credit Notes. That works for accounting but loses the authorization/reason/disposition
story. BOSS should keep the Carbon RMA model and post ERPNext-style return documents
behind it, so stock and accounting stay standard while Customer Service gets a real RMA.

### Dolibarr / metasfresh / others

- **Dolibarr** has no RMA module in this checkout. Returns are handled as credit notes
  (`compta/facture` with negative lines), stock movements, and shipment corrections;
  `fichinter` covers interventions but not return authorization.
- **metasfresh** has a real service/repair domain: `de.metas.servicerepair` service
  projects, warranty cases, customer-return handling units (`HUsToReturn`), spare-parts
  return calculation and repair manufacturing orders. The UI is backend-window based,
  so it is a model reference rather than a screen reference.
- **Akaunting / AureusERP / Moqui Sales / Twenty** have no RMA UI in this
  checkout. AureusERP inventories has receipts/deliveries/scrap but no customer-return
  resource.

---

## 8. Availability lookup

### Odoo — forecasted report + product/stock stat buttons

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Forecasted report | Client action with warehouse filter; header cards On Hand, Incoming, Outgoing, Forecasted; graph over `report.stock.quantity`; details table with Available, Outgoing, used-by document links, `Not Available`, and future forecast including draft transfers; Replenish and Update Quantity buttons. | `odoo/addons/stock/static/src/stock_forecasted/{stock_forecasted.xml,forecasted_header.xml,forecasted_details.xml,forecasted_graph.xml,forecasted_buttons.xml,forecasted_warehouse_filter.xml}`, `odoo/addons/stock/views/stock_forecasted.xml` |
| Product form/list | On Hand, Free to Use, Incoming, Outgoing, Forecasted; stat button to open quants/forecast; list filters "Available Products" and "Negative Forecasted Quantity"; forecast widget on lines. | `odoo/addons/stock/views/product_views.xml`, `odoo/addons/sale/views/product_views.xml`, `odoo/addons/stock/static/src/widgets/forecast_widget.xml` |
| Stock move/picking lines | `forecast_availability` widget shows availability inline on operations. | `odoo/addons/stock/views/stock_picking_views.xml` |
| Replenishment | Replenish wizard and replenishment info; used from forecast and reordering rules. | `odoo/addons/stock/wizard/{product_replenish,stock_replenishment_info}.{py,xml}` |

**BOSS implications.** This is the availability screen to emulate for Customer Service:
one product/warehouse view with On Hand, Incoming, Outgoing, Forecasted and the list of
documents consuming/producing stock, plus promise dates. Customer Service needs it
read-only; Purchasing/Warehouse get the replenish actions. The "Forecasted with Pending"
row is important because it answers the customer's real question ("can you still ship
it?") rather than only what is physically on the shelf.

### ERPNext — Stock Balance + Item Dashboard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock Balance page | Item/warehouse/item-group filters, sortable by Projected Qty, Reserved Qty, Reserved for Production/Subcontract/Production Plan, Reserved Stock, Ordered Qty, Requested Qty, Planned Qty, Actual Qty; item dashboard drill-down. | `erpnext/stock/page/stock_balance/stock_balance.js`, `erpnext/stock/dashboard/item_dashboard.py` |
| Item dashboard | Per-item warehouse breakdown with actual/projected/reserved quantities and links to stock ledger entries. | `erpnext/stock/dashboard/{item_dashboard.js,item_dashboard_list.html}`, `erpnext/stock/doctype/item/item_dashboard.py` |
| Stock projected qty report | Projected quantity report (actual + incoming − outgoing/reserved) by item/warehouse. | `erpnext/stock/report/stock_projected_qty/` |
| Stock Balance report | Detailed balance report with opening/balance/value; supports dimensions and stock ageing. | `erpnext/stock/report/stock_balance/stock_balance.py` |

**BOSS implications.** ERPNext exposes the full set of quantity buckets, which is more
than a support agent needs. For Customer Service, show On Hand, Reserved, Incoming,
Projected and the next expected receipt date; keep Ordered/Requested/Planned for
Purchasing. The "projected" definition must match the rest of BOSS (Mantle inventory),
not be recalculated in the service screen.

### Carbon — inventory quantities table + item details

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory table | Searchable item list with On Hand, Days remaining, Lead Time, Reorder Policy, Replenishment, Usage/Day (30d/90d), On Purchase Order, On Jobs, On Production Demand, On Sales Order, Demand Forecast, UoM, item attributes, storage types/units. | `apps/erp/app/modules/inventory/ui/Inventory/InventoryTable.tsx`, `apps/erp/app/routes/x+/inventory+/{_index,quantities}.tsx` |
| Item quantity details | Quantity panel: On Hand, On Purchase Order, On Sales Order, On Production Order, On Production Demand; storage units and ledger activity tabs. | `apps/erp/app/modules/inventory/ui/Inventory/{InventoryDetails,InventoryStorageUnits,InventoryActivity}.tsx` |
| Stock movements / traceability | Movement list and traceability graph for lot/serial and document lineage. | `ui/StockMovements/`, `ui/Traceability/` |
| Replenishment | Reordering policies and replenishment system fields on the inventory table. | `ui/Inventory/InventoryTable.tsx` |

**BOSS implications.** Carbon's table is excellent for a warehouse/purchasing user but
too dense for support. For Customer Service, reuse the same query with a fixed column
set: On Hand, On Sales Order, On Purchase Order, On Jobs, Days remaining, Lead time,
Demand forecast. The "Days remaining" and "Lead Time" pair is the fastest way to answer
"when can I get more?".

### Dolibarr — product stock card and stock-at-date

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product stock card | Per-product/per-warehouse stock, alert threshold, desired stock, lot/serial detail, stock movements. | `htdocs/product/stock/product.php`, `htdocs/product/stock/class/productstockentrepot.class.php` |
| Stock list / movements | Stock by warehouse, movement list, mass stock move, valuation, lots/serials. | `htdocs/product/stock/{index,movement_list,massstockmove,valo,productlot_list}.php` |
| Stock at date | Historical stock lookup by date. | `htdocs/product/stock/stockatdate.php` |
| Replenishment | Replenishment orders and replenishment planning pages. | `htdocs/product/stock/{replenish,replenishorders}.php` |

**BOSS implications.** Dolibarr's stock-at-date is a cheap feature with high support
value ("what did we have when the order was promised?"). Keep it read-only in Customer
Service and link it from the order/availability view.

### AureusERP / Moqui Sales / Akaunting

- **AureusERP** has a Quantity resource with Location, Storage Category, Product,
  Product Category, Lot, Package, Available Quantity, On Hand, UoM, Counted, Difference,
  Scheduled At and group/filter by all of those. It is an Odoo-derived inventory
  quantity view, not a customer-facing availability lookup.
- **Moqui Sales** has no availability screen in the Sales component; availability is
  expected from the Mantle/SimpleScreens inventory side (see
  [usl-inventory.md](usl-inventory.md) and [ss-inventory.md](ss-inventory.md)).
- **Akaunting** has items but no stock ledger or availability lookup in this checkout.

---

## 9. Knowledge base & self-service

### Frappe Helpdesk — article library, public KB and in-form suggestions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Agent KB list | Knowledge Base header + Create menu (Category / Article); list builder grouped by category, row click opens article; category actions (edit, move articles, merge category, delete); article bulk actions. | `desk/src/pages/knowledge-base/KnowledgeBaseAgent.vue`, `desk/src/components/knowledge-base/{CategoryFolder,CategoryFolderContainer,CategoryModal,MoveToCategoryModal,MergeCategoryModal,ArticleCard}.vue` |
| Article view/edit | Title (inline textarea), category link, rich-text editor, Draft/Published/Archived badge, Publish/Unpublish, views, likes/dislikes, author/time, delete, discard/save. | `desk/src/pages/knowledge-base/Article.vue`, `NewArticle.vue`, `desk/src/components/editor/config.ts` |
| Public customer KB | Search popover ("Ask a question..."), category folders, article cards; article page with title, author, modified time, content and "Was this article helpful?" thumbs up/down; if not resolved, link to create a ticket. | `desk/src/pages/knowledge-base/{KnowledgeBaseCustomer,Articles,Article}.vue`, `desk/src/components/knowledge-base/ArticleFeedback.vue`, `desk/src/components/SearchPopover.vue` |
| Article search | Full-text search over published articles; results include title, matched headings and a snippet; filters stale hits whose article is no longer published; falls back through AND/OR/noun-phrase query variants. | `helpdesk/api/article.py`, `helpdesk/search.py`, `desk/src/components/SearchArticles.vue` |
| Article stats/feedback | Views, likes, dislikes and per-user article feedback; ticket rating presets live in `hd_ticket_feedback_option`. | `helpdesk/api/article.py`, `helpdesk/helpdesk/doctype/{hd_article,hd_article_feedback,hd_ticket_feedback_option}/` |
| KB settings | Workflow/Knowledgebase settings (prefer knowledge base before ticket creation), branding, ticket settings. | `desk/src/components/Settings/General/components/{WorkflowKnowledgebaseSettings,Branding,TicketSettings}.vue`, `helpdesk/api/config.py` |
| Article categories | Category name, published article count, General reserved category, merge/move actions, move guard (cannot leave a category empty). | `helpdesk/api/knowledge_base.py`, `helpdesk/helpdesk/doctype/hd_article_category/` |

**BOSS implications.** This is the target shape for Customer Service KB links: a
category tree, full-text search, article view with helpful/not-helpful feedback, and an
inline suggestion block on case intake. BOSS should store articles in Commons
knowledge (Wiki/content) and expose a service-scoped read view rather than creating a
parallel KB. The two features worth copying exactly are (1) suggestions after the
customer types a subject, not only after submit, and (2) "if this did not help, create a
ticket" on every article. The `preferKnowledgeBase` switch is a useful policy knob.

### ERPNext / Frappe — Help Articles + support search sources

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Help Article | Title, category, published flag, author, level (Beginner/Intermediate/Expert), rich content, likes, route, helpful/not-helpful counts; web-viewable. | `frappe/website/doctype/help_article/help_article.json`, `templates/{help_article,help_article_list,help_article_row}.html` |
| Help Category | Category tree/master for articles. | `frappe/website/doctype/help_category/` |
| Support portal | Greeting title/subtitle, "Get Started" sections, favorite/most-viewed articles, help article list, latest forum posts, user's recent issues, create-ticket CTA. | `erpnext/templates/pages/help.{html,py}`, `erpnext/www/support/index.py` |
| Help search | `/search_help` search page over articles and optional external sources. | `erpnext/templates/pages/search_help.html`, `support_search_source` child table |
| Search sources | Each source has name/type (API or Link), base URL, query route, search-term parameter, response result key path, post route/keys, or a source DocType with title/preview/route fields. | `erpnext/support/doctype/support_search_source/support_search_source.json` |
| Support settings | Greeting title/subtitle, get-started sections, forum URL/query/key mapping, search APIs, SLA toggles, close-after-days. | `erpnext/support/doctype/support_settings/support_settings.json` |

**BOSS implications.** ERPNext's external search sources are directly relevant to a
business-in-a-box: the KB search can federate the wiki, product docs, forum and even an
external knowledge API without copying content. Use one search interface with
per-source route/preview mappings. The "most viewed articles" list is a cheap
self-service default when there is no query.

### Dolibarr — knowledge records tied to ticket categories

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Knowledge list | Search/filter by question, language, category, status (Draft/Validated/Obsolete); mass actions; create. | `htdocs/knowledgemanagement/knowledgerecord_list.php` |
| Knowledge card | Question, language, categories, answer (rich text, with layout/AI fill helpers), suggested ticket category, status, notes/documents, agenda, contacts. | `htdocs/knowledgemanagement/knowledgerecord_card.php`, `knowledgerecord.class.php` |
| Ticket form integration | On selecting a ticket category, AJAX loads matching knowledge records and lists them under "Knowledge found for ticket group"; can open the article in a dialog. | `htdocs/core/class/html.formticket.class.php` |
| Knowledge dashboard | Module home with recent/draft records and quick links; no public customer portal in this checkout. | `htdocs/knowledgemanagement/knowledgemanagementindex.php` |

**BOSS implications.** Dolibarr's category→article link is the low-cost integration to
copy: each request type/category can list relevant KB articles even without full-text
search. Its language field matters for BOSS's multilingual support; articles should be
keyed by language and category, not just title.

### Frappe Wiki / Nextcloud Collectives — shared knowledge source

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Wiki spaces | All Spaces list with search, restricted-access markers, create space, space details. | `wiki/frontend/src/pages/{AllSpaces,SpaceDetails}.vue`, `components/{SpaceSidebar,SpaceTreePanel,SpaceWelcome}.vue` |
| Wiki page editor/viewer | Rich-text editor, table of contents, version/diff viewer, contributions and review queue, assignment, page settings. | `wiki/frontend/src/components/{WikiEditor,WikiContentViewer,WikiDocumentPanel,DiffViewer,ContributionsPanel,DraftContributionPanel,SubmitForReviewButton}.vue`, `pages/{Contributions,ContributionReview}.vue` |
| Command palette | Jump to pages/spaces and run actions. | `wiki/frontend/src/components/CommandPalette.vue` |
| Nextcloud Collectives | Wiki/knowledge base inside Nextcloud with its own page tree and editor; catalogued in [research-drawers-commons.md](research-drawers-commons.md). | `collectives/src/`, `collectives/templates/` |

**BOSS implications.** Knowledge articles for Customer Service should be authored in
the Commons wiki, not in a service-only editor. The service app needs a read/search
surface plus "link this case to this article" and "suggest an article edit" actions.
Frappe Wiki's contribution review is a good pattern if articles are editable by many
staff.

### Moqui WorkManagement — native wiki and task surfaces

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Wiki spaces | Moqui screen rendered as a QVue app; space list/detail for wiki content. | `screen/wiki/WikiSpaces.xml`, `screen/wiki/WikiDetail.xml` |
| Wiki blog posts | Blog-post list/detail alongside the wiki; useful when KB content is published as articles/blog entries. | `screen/wiki/WikiBlogs.xml` |
| Task screen | QVue task workspace: saved finds by person/role/project/status, text search, assignee/project/status/priority editing, due date, mark complete, task comments. | `screen/wm/Task.xml`, `screen/wm/Task/Task.qvue`, `screen/Sales/Task/EditTask.xml` |

**BOSS implications.** This is the Moqui-native proof that a wiki list/detail and a
task workspace can be built with screens plus QVue. Reuse the saved-find pattern for
service queues and the task screen for follow-up actions created from a case. The
wiki screens are thin compared with Frappe Wiki, so BOSS's real KB authoring belongs
in Commons.

---

## 10. Feedback, reporting & settings

### Frappe Helpdesk — CSAT + operational analytics

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Ticket feedback | Customer "Rate this ticket" dialog: 1–5 stars, preset options filtered by rating, free-text "Tell us more"; stored on the ticket (`feedback_rating`, `feedback`, `feedback_extra`) and shown in the agent sidebar. | `desk/src/pages/ticket/TicketFeedback.vue`, `desk/src/components/ticket-agent/TicketFeedback.vue`, `hd_ticket_feedback_option`, `hd_email_feedback` |
| Feedback options | Rating, label, disabled; per-rating preset choices. | `helpdesk/helpdesk/doctype/hd_ticket_feedback_option/` |
| CSAT metrics | Avg. Feedback Rating card (/5) with delta; feedback trend chart plotted on resolution date; customer/contact stats card with review count. | `helpdesk/api/dashboard.py`, `helpdesk/api/ticket_stats.py`, `desk/src/components/customer/TicketStats.vue` |
| Operational metrics | Tickets created, % SLA fulfilled, Avg. First Response, Avg. Resolution, failed SLAs, channel/team/type/priority/tag charts. | `helpdesk/api/dashboard.py`, `dashboard_tags.py`, `ticket_analytics.py` |
| Ticket analytics tab | Per-ticket metric cards, conversation summary and timeline. | `desk/src/components/ticket-agent/analytics/` |
| Export | Queue export modal (export selected vs all) and CSV/XLSX flows. | `desk/src/pages/ticket/Tickets.vue`, `desk/src/components/ticket/ExportModal.vue` |

**BOSS implications.** CSAT should be a first-class field on the request, not an
afterthought: rating + preset reason + free text, captured at close and visible on the
case and Customer 360. Report CSAT by resolution date, not creation date. The minimum
service dashboard is tickets, SLA %, first response, resolution and CSAT; channel/team/
type/tag breakdowns are the next layer.

### ERPNext / Dolibarr — reporting and settings

| Screen/page | What it is | Key files |
| --- | --- | --- |
| ERPNext support reports | Issue Summary, Issue Analytics, First Response Time, Support Hour Distribution; standard filters/export. | `erpnext/support/report/` |
| ERPNext support workspace | Number cards + shortcuts described in §1; no per-agent home. | `erpnext/support/workspace/support/support.json` |
| Dolibarr ticket statistics | Ticket statistics page with grouping/filters; module list and dashboard. | `htdocs/ticket/stats/index.php`, `htdocs/ticket/class/ticketstats.class.php` |
| Dolibarr ticket setup | Ticket module admin (categories, types, severities, notification defaults, public portal settings). | `htdocs/admin/ticket.php`, `htdocs/ticket/admin/` (if present in checkout) |

### Helpdesk settings inventory (the configuration surface to plan for)

| Area | Settings that shape screens/behaviour | Files |
| --- | --- | --- |
| General / branding | Logo, brand color/name, ticket settings (auto-close, allow anyone to create, default type, restrict by agent group, prefer KB, skip email workflow). | `desk/src/components/Settings/General/`, `helpdesk/api/config.py` |
| Agents & teams | Agents, active flag, availability, teams, team members, assignment rule per team. | `helpdesk/helpdesk/doctype/{hd_agent,hd_team}/`, `desk/src/components/Settings/{Agents,Teams}/` |
| Assignment rules | Priority, conditions, assign/unassign, distribution mode, users, days, close condition. | Frappe core Assignment Rule, `desk/src/components/Settings/Assignment Rules/` |
| SLA | Policies, priorities, working hours, holidays, pause/fulfil statuses, default/reopen status. | `helpdesk/helpdesk/doctype/hd_service_level_agreement/`, `desk/src/components/Settings/Sla/` |
| Saved replies | Title, message, scope (Global/Team/Personal), teams, actions (set fields, assign, tags, comment). | `helpdesk/helpdesk/doctype/hd_saved_reply/`, `desk/src/components/Settings/SavedReplies/`, `desk/src/components/SavedReplyActions/` |
| Email | Email accounts, inbound/outbound config, notifications (acknowledgement, reply-to-agents, reply-via-agent, share-feedback). | `desk/src/components/Settings/{EmailAccountList,EmailAccountCard,EmailAdd,EmailEdit,EmailConfig}.vue`, `desk/src/components/Settings/EmailNotifications/` |
| Telephony | Exotel/Twilio credentials and call UI settings; call logs. | `desk/src/components/Settings/Telephony/`, `desk/src/pages/call-logs/` |
| Fields/templates | Ticket templates, template fields, field layout, form scripts, field dependencies. | `helpdesk/helpdesk/doctype/{hd_ticket_template,hd_ticket_template_field,hd_field_layout,hd_form_script}/`, `desk/src/components/Settings/FieldDependency/` |
| KB | Article categories, articles, article feedback, KB preference. | `helpdesk/helpdesk/doctype/{hd_article,hd_article_category,hd_article_feedback}/`, `desk/src/pages/knowledge-base/` |
| Preferences/profile | Theme, language/timezone, profile, password, user email settings. | `desk/src/components/Settings/{Preferences,Profile}/` |

**BOSS implications.** Most of this maps onto existing Moqui patterns: users/groups
for agents/teams, status/type masters for request classification, a calendar/holiday
record for SLA, saved finds for queues, content for KB, and settings records for
branding/email. The only genuinely new service-specific masters are request templates
with field dependencies, SLA policies, saved replies with actions, and assignment
rules. Plan those as first-class records, not JSON blobs.

---

## 11. Gaps & notables

### Gaps in the reference set

- **One purpose-built service desk.** Frappe Helpdesk is the most complete
  agent + customer-portal + SLA + KB + reporting implementation in the checkout.
  ERPNext Support is the second, but its UI is generic Frappe forms. Dolibarr Tickets is
  a credible small-business third. Everything else is partial or absent.
- **No Odoo Helpdesk.** Helpdesk is Enterprise and is not in this community checkout.
  Odoo's service-relevant screens are CRM activities, Repair and stock returns.
- **No RMA in ERPNext or Dolibarr.** Carbon is the only complete RMA screen set;
  Odoo has portal-initiated returns and stock returns; metasfresh has a backend
  service/repair domain. No reference RMA maps directly onto Mantle, but Mantle already
  has the record (`ReturnHeader`/`ReturnItem`, see [research-crosscut.md](research-crosscut.md) §5); BOSS designs the screens and policies.
- **No shared Customer 360 across service + orders + accounting** in any single app
  except ERPNext's Customer Overview, which is sales/accounts-centric and has no cases.
  BOSS's shared Party 360 is still a new design.
- **No order-change request flow.** References allow back-office edits/cancels or
  portal reorder/returns, but none model "customer asks for an address/quantity change
  and service approves it". This is a BOSS-specific workflow to design.
- **Availability promise dates are only strong in Odoo.** ERPNext exposes projected
  quantities, Carbon exposes days remaining/lead time, Dolibarr exposes stock-at-date;
  none combines them into a customer-facing promise date as cleanly as Odoo's forecast.
- **No multilingual KB outside Dolibarr.** Frappe Helpdesk articles have no language
  field; ERPNext Help Articles have a level but no language. BOSS should add language.
- **No case-to-KB authoring workflow.** Helpdesk lets agents write articles, but not
  "convert this resolved case into an article" with redaction/review. This is a valuable
  BOSS feature and a gap in all references.

### Notables worth carrying forward

- **Frappe Helpdesk saved-reply actions** are more than canned text: a reply can set
  status, priority, team, type, assign an agent or the sender, add/remove tags, and add
  a comment. This is the right model for service macros.
- **Frappe Helpdesk SLA display** distinguishes working-hours delay from total delay
  and shows on-hold time; that nuance prevents misleading breach reports.
- **Carbon RMA invariants**: returnable quantity from delivered lines, received vs
  credited quantities per line, credit capped by received, cancellation releases
  authorized quantities, locked statuses stop edits. These should become BOSS tests.
- **Odoo portal return** gives customers a reason + return label and logs the action in
  the order chatter; a low-cost, high-value self-service flow.
- **ERPNext Customer Overview** hides accounting sections when the viewer lacks
  permission rather than showing zeros; BOSS should do the same on the shared 360.
- **Dolibarr ticket category → KB suggestion** is cheap and works without a search
  service; pair it with full-text suggestions when available.
- **Moqui Sales Order is explicitly alpha** and lacks status/shipment/invoice/return
  actions; do not treat it as an implementation reference beyond the Mantle data path.
- **metasfresh service/repair** is the only reference with handling-unit-level customer
  returns, warranty cases and repair projects; use it when designing serialized/asset
  returns, not for the primary UI.

### Checkout path quirks

- Frappe Helpdesk backend paths are `helpdesk/helpdesk/doctype/...` (repo contains a
  `helpdesk/` app directory and a `desk/` front end); portal pages are
  `helpdesk/helpdesk/www/`, templates `helpdesk/helpdesk/templates/`.
- ERPNext paths above are relative to the `erpnext/` app inside the
  `3p_other/frappe/erpnext` checkout; Frappe framework paths are relative to
  `3p_other/frappe/frappe`.
- Odoo paths are relative to `3p_other/odoo`: `odoo/addons/<addon>/...` is `3p_other/odoo/odoo/addons/<addon>/`.
- Carbon route paths use React Router's `x+/` convention; `$id`/`$lineId` are route
  params, not literal directories.
- Moqui Sales `FindAccount.xml` is absent in this checkout; the account find screen is
  `FindAccount.qvue` only. `ViewAccount.xml` remains the XML reference.
- Dolibarr's ticket form is shared with the public portal through
  `FormTicket`; `htdocs/public/ticket/` is the customer-facing entry point.

---


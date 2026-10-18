# IronStone BOSS — Sales app research

Oct 18, 2026

Deeper research pass on the **IronStone Sales** app (Pipeline: leads and opportunities;
accounts and contacts; quotes; orders; agreements and price lists; sales reports),
cataloguing every relevant screen/page found in the reference apps. Companion to
[3p-app-reference.md](3p-app-reference.md); feeds the Sales row in
[initial-design.md](initial-design.md) plus the sales face of the shared Customer 360,
Order detail and inline-availability screens.

**Organization.** Sorted by functional area (not by app): all pipeline screens together,
all quote screens together, etc. Within each area, sub-tables per reference app.

**Scope.** Business UI only: pipeline boards, lead and opportunity forms, account and
contact records, quote builders, order entry and detail, agreements and price lists,
sales reports and targets, plus the sales-facing configuration screens. Backend models
are noted only where they shape a screen (stage sequences, probability, price rules,
credit limits, approval gates).

**Path conventions.** Paths are relative to each repository's own root, as in
3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Moqui Sales** | `/home/jonesde/work/moquiwork/3p_moqui/Sales` — Moqui XML screens in `screen/Sales/`, QVue components beside them |
| **Frappe CRM** | `/home/jonesde/work/moquiwork/3p_other/frappe/crm` — Vue 3 SPA in `frontend/src/` (pages, components, router), backend in `crm/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — selling under `erpnext/selling/`, CRM under `erpnext/crm/`, accounts/stock doctypes used by sales under `erpnext/{accounts,stock}/` |
| **Frappe framework** | `/home/jonesde/work/moquiwork/3p_other/frappe/frappe` — Desk list/form/report shell in `frappe/desk/` and `frappe/public/js/` |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — paths below use `odoo/addons/<addon>/…` (that is `3p_other/odoo/odoo/addons/<addon>/`); views in `views/`, JS/OWL in `static/src/`; a bare `<addon>/views/…` tail means `odoo/addons/<addon>/views/…` |
| **Twenty** | `/home/jonesde/work/moquiwork/3p_other/twenty` — paths relative to the repo root (`packages/twenty-front`) |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — React Router app under `apps/erp/app/`; sales module in `modules/sales/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — module pages under `htdocs/<module>/`, shared classes/forms in `htdocs/core/` |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — React WebUI in `frontend/src/`; business windows defined in backend `de.metas.*` modules |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament resources/pages under `plugins/webkul/<plugin>/src/Filament/` |
| **Ever Gauzy** | `/home/jonesde/work/moquiwork/3p_other/ever-co/ever-gauzy` — Angular SPA in `apps/gauzy/` |
| **Akaunting** | `/home/jonesde/work/moquiwork/3p_other/akaunting` — Blade views in `resources/views/` |

Not used here: Nextcloud, Zimbra, Ever Teams and Signal ship no sales/pipeline
functionality in this checkout; their groupware surfaces are covered by
[research-drawers-commons.md](research-drawers-commons.md). Customer-service screens
(cases, RMAs, customer 360) are covered by
[research-customer-service.md](research-customer-service.md); this pass keeps only the
sales face of those shared records.

Sections: [1 sales home & pipeline](#1-sales-home--pipeline) ·
[2 leads](#2-leads) · [3 opportunities & deal detail](#3-opportunities--deal-detail) ·
[4 accounts & contacts](#4-accounts--contacts) ·
[5 quotes, price lists & product selection](#5-quotes-price-lists--product-selection) ·
[6 orders & fulfillment handoff](#6-orders--fulfillment-handoff) ·
[7 agreements, contracts & subscriptions](#7-agreements-contracts--subscriptions) ·
[8 activities, chatter & next actions](#8-activities-chatter--next-actions) ·
[9 reports, targets & commissions](#9-reports-targets--commissions) ·
[10 configuration & admin](#10-configuration--admin) ·
[11 gaps & notables](#11-gaps--notables)

---

## 1. Sales home & pipeline

### Odoo — two app roots and switchable pipeline views

Odoo splits the top-level work into **CRM** (leads, opportunities, teams, forecast) and
**Sales** (quotations, orders, products, reporting); both are reachable from the same
web client and cross-link through the partner record.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| CRM app menu | CRM root: Sales (My Pipeline, My Activities, Teams, Customers), Leads, Reporting (Forecast, Pipeline, Leads, Activities), Configuration | `crm/views/crm_menu_views.xml` |
| My Pipeline | The rep's opportunity kanban grouped by stage; drag a card to change stage; quick-create card form | `crm/views/crm_lead_views.xml` (`crm_lead_action_pipeline`, `view_crm_lead_kanban`, `crm_case_kanban_view_leads`), `crm/static/src/views/crm_kanban/` |
| Pipeline view switcher | Same dataset as kanban, list, calendar (by expected close date), pivot and graph; saved filters for my/team/unassigned | `crm_lead_action_pipeline_view_{kanban,tree,calendar,pivot,graph}`, `crm/static/src/views/{crm_list,crm_graph,crm_pivot,crm_calendar}/` |
| Teams pipeline | Aggregate pipeline for a sales team, with the team's own stages and members | `crm_menu_views.xml` (`sales_team_menu_team_pipeline`), `crm/views/crm_team_views.xml` |
| Forecast | Expected revenue by close date and stage, prorated by probability; kanban/graph/pivot/list | `crm_lead_action_forecast`, `crm_lead_view_kanban_forecast`, `crm_lead_view_tree_forecast`, `crm/static/src/views/forecast_*` |
| Sales app menu | Orders (Quotations, Orders, Customers), Products (Products, Attributes, Pricelists), Reporting (Sales, Salespersons, Products, Customers), Configuration | `sale/views/sale_menus.xml` |
| Quotation/order dashboard list | Quotations and orders open on list/kanban views with a dashboard header (`sale_dashboard_list`, `sale_dashboard_kanban`) showing period totals and filters | `sale/views/sale_order_views.xml` (`sale_order_list_with_dashboard`, `sale_order_kanban_with_dashboard`), `sale/static/src/views/{dashboard_list_view,dashboard_kanban_view}/` |
| Quotation onboarding | Empty-state kanban/list with onboarding steps for a fresh database | `sale/views/sale_order_views.xml` (`view_quotation_kanban_with_onboarding`, `view_quotation_tree_with_onboarding`) |

### Frappe CRM — editable dashboard and kanban pipeline

| Screen/page | What it is | Key files |
| --- | --- | --- |
| CRM dashboard | Admin-editable chart grid with date presets, add/reset charts and a saved layout | `frontend/src/pages/Dashboard.vue`, `frontend/src/components/Dashboard/{DashboardGrid,AddChartModal}.vue` |
| Deals pipeline | Deals rendered as saved list, grouped list or kanban; drag between statuses; group summaries and bulk actions | `frontend/src/pages/Deals.vue`, `frontend/src/components/Kanban/KanbanView.vue`, `frontend/src/components/ViewControls.vue` |

### ERPNext — workspace pages, dashboards and a sales funnel

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Selling workspace | Module home: onboarding block, sales-order chart, Deliver/Bill/Annual Sales number cards and report shortcuts | `erpnext/selling/workspace/selling/selling.json` |
| Selling dashboard | Standard dashboard with annual sales, active customers, deliver/bill cards and four charts | `erpnext/selling/selling_dashboard/selling/selling.json` |
| CRM workspace | Incoming-leads chart plus Open/New/Won opportunity number cards | `erpnext/crm/workspace/crm/crm.json` |
| CRM dashboard | Lead/opportunity trends, territory, campaign and lead-source charts | `erpnext/crm/crm_dashboard/crm/crm.json`, `erpnext/crm/dashboard_chart/incoming_leads/incoming_leads.json` |
| Sales funnel | Company/date-filtered funnel plus pipeline and UTM source/campaign/medium charts; restricted to Sales Manager | `erpnext/selling/page/sales_funnel/sales_funnel.{js,json}` |
| Frappe Desk workspace | Card, shortcut, onboarding and chart blocks that compose a module home page | `frappe/public/js/frappe/views/workspace/workspace.js` |

### Twenty — generic record index and page dashboards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Opportunity index | Generic object index rendered as table, list, kanban or calendar with saved views | `packages/twenty-front/src/pages/object-record/RecordIndexPage.tsx`, `packages/twenty-front/src/modules/object-record/record-board/components/RecordBoard.tsx` |
| Dashboards | Standalone page layouts composed of chart, record-table, iframe and rich-text widgets | `packages/twenty-front/src/pages/page-layout/StandalonePageLayoutPage.tsx`, `packages/twenty-front/src/modules/page-layout/components/PageLayoutRenderer.tsx`, `packages/twenty-front/src/modules/page-layout/widgets/graph/components/GraphWidget.tsx` |

### Carbon — `/sales` dashboard and a role-based module map

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales dashboard | Landing page: Open Quotes / Open Sales Orders / Open RFQs counters with "view" links, documents assigned to me, KPI chart (Quotes, Sales Funnel, Sales Orders, Sales Revenue), date range and previous-period comparison, drill-down document rows with status | `apps/erp/app/routes/x+/sales+/_index.tsx`, `api+/sales.kpi.$key.ts`, `modules/sales/ui/{Quotes/QuoteStatus,SalesOrder/SalesStatus,SalesRFQ/SalesRFQStatus}.tsx` |
| Sales navigation | Grouped module rail: Customers (Customers, Portals), Quoting (RFQs, Quotes), Orders (Sales Orders, Returns), Agreements (Service Contracts, Rental Agreements), Pricing (Price Lists, Pricing Rules), Configure (Sales Rules, No Quote Reasons, Return Reasons, Statuses, Types) | `apps/erp/app/modules/sales/ui/useSalesSubmodules.tsx` |
| Favorites views | Separate saved-list routes for quotes, RFQs and orders ("favorite" tables) | `apps/erp/app/routes/x+/sales+/{quotes,rfqs}.favorite.tsx`, `x+/sales-order+/orders.favorite.tsx` |
| Assigned-to-me list | Cross-document list of RFQs/quotes/orders assigned to the current user, shown on the dashboard | `modules/sales/sales.service.ts` (`getSalesDocumentsAssignedToMe`) |

### Dolibarr — commercial and prospection areas

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Commercial area | Module home dashboard: boxes for last-modified proposals/orders/contracts, late items, drafts, customers/prospects/suppliers; entry points to each sales module | `htdocs/comm/index.php` |
| Prospection area | Prospect-focused home: prospects by status, draft and open proposals, totals, search by ref; links to third parties and proposals | `htdocs/comm/prospect/index.php` |
| Module list pages | Each module opens as list, kanban ("ViewKanban" toggle) or statistics; toolbar carries mass actions | `htdocs/commande/list.php`, `htdocs/comm/propal/list.php`, `htdocs/contrat/list.php` |
| Commercial actions | Customer recap and discount/price-level helpers | `htdocs/comm/recap-client.php`, `htdocs/comm/remise.php`, `htdocs/comm/multiprix.php` |

### metasfresh — window shell, board and dashboard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Navigation tree | Left module tree built from backend window/menu metadata; every business screen is a window reference | `frontend/src/containers/NavigationTree.js`, `frontend/src/containers/App.js` |
| Board | Kanban board with lanes and cards, board selector in the sidebar | `frontend/src/containers/Board.js`, `frontend/src/components/board/{Lanes,Lane,Card,Sidenav}.js` |
| Dashboard | Drag-and-drop chart widget canvas with widget configuration | `frontend/src/containers/Dashboard.js`, `frontend/src/components/dashboard/{ChartWidget,DndWidget,DraggableWrapper,ChartOptions}.js` |
| Document list / master window | Generic list and record shells every sales window reuses | `frontend/src/containers/DocumentListContainer.js`, `MasterWindowContainer.js`, `frontend/src/components/window/` |
| Sales order candidates window | Dedicated order-candidate workbench ("Auftragsdisposition"), including a legacy EDI-import variant | backend window data in `backend/de.metas.fresh/.../5771770_sys_gh25519_New_Sales_Order_Candidates_Window.sql` (`AD_Window_ID=541952`) |
| Sales statistics window | Dedicated statistics window over sales facts | backend window data in `5787570_sys_gh27873_Sales_Statistics_Window.sql` (`AD_Window_ID=542070`) |

### Ever Gauzy — pipelines as first-class CRM objects

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Pipelines list | Table of pipelines (name, description, stages, status) with create/edit action | `apps/gauzy/src/app/pages/pipelines/pipelines.component.{ts,html}`, `pipelines/pipelines.routing.ts` |
| Pipeline deals | Deals table for the selected pipeline: title, stage, created by, probability; add/edit deal | `apps/gauzy/src/app/pages/pipelines/pipeline-deals/pipeline-deals.component.{ts,html}` |
| Pipeline form | Name, description, active toggle | `apps/gauzy/src/app/pages/pipelines/pipeline-form/pipeline-form.component.{ts,html}` |
| Stage form | Stage name and description inside a pipeline | `apps/gauzy/src/app/pages/pipelines/stage-form/stage-form.component.{ts,html}` |
| Stage/deal probability | Probability rendered as a 0-low / 5-high indicator column | `apps/gauzy/src/app/pages/pipelines/table-components/pipeline-deal-probability/` |

### Moqui Sales — app roots, no pipeline board

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales app root | Subscreen popup panel defaulting to Account; menu items for Account, Contact, Opportunity, Agreement, Order | `screen/Sales.xml`, `screen/Sales/Account.xml`, `screen/Sales/{Contact,Opportunity,Agreement,Order}.xml` |
| SalesAdmin root | Separate admin app root; currently only exposes "Manage Parties" (SimpleScreens party admin) | `screen/SalesAdmin.xml` |
| QVue implementations | Large `.qvue` components for find/view screens exist but are commented out of the XML screens; the XML/QVT path is the live one | `screen/Sales/*/` (`*.qvue`), `screen/Sales/*.xml` |
| No dashboard/pipeline | There is no landing dashboard, kanban, graph or forecast view anywhere in the component | — |

### Akaunting — no pipeline

- **Akaunting:** sales home is the invoice list plus general dashboard widgets
  (`resources/views/common/dashboards/`, `resources/views/widgets/`); no pipeline or
  opportunity screens.

**BOSS implications.** Odoo is the reference for the *dataset*: one opportunity record
with switchable list/kanban/calendar/pivot/graph views, stage-grouped kanban, and a
separate forecast view that prorates expected revenue by probability. Carbon is the
reference for the *landing page*: open-document counters, "assigned to me", a chosen KPI
with previous-period comparison, and a role-grouped module rail — a better fit for a
small-business app home than a bare chart canvas. Dolibarr and metasfresh show the
generic list/kanban/statistics triad; Gauzy shows the minimal pipeline model (pipeline →
stage → deal with a coarse probability), which is close to Mantle's
`SalesOpportunity` + `SalesOpportunityStage` shape. Frappe CRM adds the third landing
shape — an admin-arranged chart dashboard — while ERPNext's workspace pages and separate
Sales Funnel page show shortcut/counter blocks and funnel analysis working side by side;
Twenty confirms that index view switching and saved views should be generic across
objects, not pipeline-specific. Moqui Sales has the data model
(stages carry `sequenceNum` and `defaultProbability`) but no board, dashboard or
forecast, so the pipeline board and sales home are net-new BOSS screens. Build them as
one shared opportunity dataset with view switching, keep forecast as a distinct
planned-revenue view, and make the app landing the pipeline board with a compact
open-document/assigned-to-me strip (Carbon) rather than a chart wall.

## 2. Leads

### Odoo — leads and opportunities share one model

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Leads menu | All records with `type = lead`: list, kanban, pivot and graph views; actions `crm_lead_all_leads` | `crm/views/crm_lead_views.xml` (`crm_lead_all_leads_view_{tree,kanban,pivot,graph}`), `crm_menu_views.xml` |
| Lead form | Stage statusbar with days-in-stage ("rotting"), expected and recurring revenue, automated/manual probability, contact and address block, source/medium/campaign (UTM), tags, properties, notes, duplicate-lead counter | `crm/views/crm_lead_views.xml` (`crm_lead_view_form`) |
| Convert to Opportunity | Header button on a lead; sets the account/contact and switches the record to opportunity; mass-convert wizard for a selection | `crm_lead_view_form` (`action_convert_to_opportunity`), `crm/wizard/crm_lead_to_opportunity_mass_views.xml` |
| Mark Lost | Lost wizard captures a lost reason and closing note; lost reason is stored on the record and shown on the form | `crm/wizard/crm_lead_lost_views.xml`, `crm/views/crm_lost_reason_views.xml`, `crm_lead_view_form` (`lost_reason_id`) |
| Merge duplicates | Side-by-side merge wizard for opportunities/leads, keeping selected field values | `crm/wizard/crm_merge_opportunities_views.xml` |
| Update probabilities | Bulk wizard to recompute stage probabilities for a selection | `crm/wizard/crm_lead_pls_update_views.xml` |
| Lead activities | Dedicated activity view and activity-enriched list for leads/opportunities | `crm_lead_view_activity`, `crm_lead_view_list_activities`, `crm/static/src/views/crm_activity/` |
| Email actions | Compose mail and mass-mail actions over selected leads | `crm_lead_views.xml` (`action_lead_mail_compose`, `action_lead_mass_mail`) |

### Frappe CRM — leads with rich intake and explicit conversion

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Leads list | Defaults to unconverted leads; list/group/kanban with saved views, filters and bulk actions | `frontend/src/pages/Leads.vue`, `frontend/src/components/ListViews/LeadsListView.vue` |
| Lead detail | Tabs for activity, email, comments, calls, tasks, notes, attachments and WhatsApp; "Convert to Deal" action | `frontend/src/pages/Lead.vue`, `frontend/src/components/Modals/ConvertToDealModal.vue` |
| Lead intake web form | Publishable/embeddable Web Form for CRM Lead or Deal, with draft preview | `crm/www/crm_form.py`, `crm/www/crm_form.html`, `crm/api/form.py` |
| Data import wizard | Import history with status filters plus resumable mapping and preview steps | `frontend/src/pages/{DataImports,DataImport}.vue` |
| Lead sync and assignment | Facebook lead sources with failure logs; assignment rules with schedules | `frontend/src/components/Settings/LeadSyncing/LeadSyncSources.vue`, `frontend/src/components/Settings/AssignmentRules/AssignmentRules.vue`, `crm/lead_syncing/doctype/lead_sync_source/lead_sync_source.json` |

### ERPNext — lead with several conversion targets

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Lead list | Saved filters for open, unassigned, new-this-week and converted leads; status kanban | `erpnext/crm/doctype/lead/lead_list.js`, `erpnext/crm/doctype/lead/lead_kanban.js`, `erpnext/crm/doctype/lead/list_filter/lead_open.json` |
| Lead form | Converts to customer, opportunity, quotation or prospect; linked-document dashboard | `erpnext/crm/doctype/lead/lead.js`, `erpnext/crm/doctype/lead/lead_dashboard.py` |
| Prospect | Company-level prospect aggregating its leads and opportunities | `erpnext/crm/doctype/prospect/prospect.json` |
| Frappe Desk list view | Generic filtered list with bulk operations, sidebar stats and export, used by Lead | `frappe/public/js/frappe/list/{list_view,bulk_operations,list_filter}.js` |

### Carbon — RFQ intake instead of a lead pipeline

| Screen/page | What it is | Key files |
| --- | --- | --- |
| RFQ list | Inbound requests for quote: RFQ number, customer, due date, sales person, status; favorite/saved view | `modules/sales/ui/SalesRFQ/SalesRFQsTable.tsx`, `apps/erp/app/routes/x+/sales+/rfqs.tsx`, `rfqs.favorite.tsx` |
| RFQ form | Customer, customer RFQ reference, purchasing/engineering contacts, customer location, RFQ date, due date, sales person; header + lines | `modules/sales/ui/SalesRFQ/{SalesRFQForm,SalesRFQHeader,SalesRFQLineForm}.tsx`, routes `x+/sales-rfq+/` |
| RFQ auto-fill | Drop a customer document onto the RFQ and map extracted lines into quote lines; PDF/CSV extraction | `modules/sales/ui/SalesRFQ/useSalesRfqAutoFill.ts`, `useOptimiticDocumentDrag.tsx`, `MapExtractedLinesModal.tsx`, route `api+/sales-rfq.$rfqId.map-lines.ts` |
| No quote reason | Structured lost/declined reason captured on a quote | `modules/sales/ui/NoQuoteReasons/`, routes `x+/sales+/no-quote-reasons.*` |

### Dolibarr — prospects are third-party roles, not a separate record

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Prospect creation | Third-party created with the prospect flag; company/address/contact fields plus prospect status and source | `htdocs/societe/card.php?action=create&prospect=3`, `htdocs/societe/list.php` |
| Prospection area | Prospects grouped by status, draft/open proposals, totals and search | `htdocs/comm/prospect/index.php` |
| Prospect → customer | The same third-party card toggles customer/prospect/supplier roles; conversion keeps history and documents | `htdocs/societe/card.php` |
| Prospect status dictionary | Configurable prospect statuses and sources used by the prospection area | `htdocs/admin/dict.php`, `htdocs/comm/prospect/index.php` |

### Ever Gauzy — deals without a conversion step

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Deal form | Title, stage, client, probability (0-low / 5-high); created directly as a deal, no lead object or conversion | `apps/gauzy/src/app/pages/pipelines/pipeline-deals/pipeline-deal-form/pipeline-deal-form.component.html` |

### Moqui Sales — no lead entity

- **Moqui Sales:** opportunities are created directly from the Find Opportunity
  dialog; there is no lead record, conversion step, dedupe check or lead source field
  (`screen/Sales/Opportunity/FindOpportunity.xml`).

### Akaunting — no leads

- **Akaunting:** customers only; no lead, prospect or opportunity screens.

**BOSS implications.** Odoo's single table with a `type` discriminator is the cheapest
model: a lead becomes an opportunity by filling the account/contact and flipping the
type, so no data is copied and conversion stays reversible. Carbon covers the other
intake path that matters in B2B — a customer RFQ document arrives and must become a
quote; its extract-and-map flow is worth keeping as an optional RFQ intake on the quote
screen. BOSS should add what Moqui Sales lacks: source/campaign fields, duplicate
detection, a lost reason, and a conversion action that promotes a lead onto an account.
Do not build a second record type unless the workflow genuinely differs; the Mantle
`SalesOpportunity` plus a lead/opportunity flag and a stage/probability model covers
both. Frappe CRM adds two intake surfaces BOSS should expose as configuration rather
than code: a publishable web form that creates a lead, and scheduled assignment rules
(round-robin by team/territory) — plus an explicit conversion modal that records when
and by whom the record became a deal. ERPNext's multi-target conversion (customer,
opportunity, quotation, prospect) is more than BOSS needs; keep one conversion target.

## 3. Opportunities & deal detail

### Odoo — record-centric deal with document roll-up

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Opportunity kanban | Stage columns with drag-to-stage, per-column expected revenue, quick-create card; "Won" triggers a rainbow-man animation | `crm/views/crm_lead_views.xml` (`crm_case_kanban_view_leads`), `crm/static/src/views/crm_kanban/`, `crm/static/src/views/check_rainbowman_message.js` |
| Opportunity form | Statusbar stages with days-in-stage, Won/Lost buttons, expected and recurring revenue, probability (automatic by stage or manual), salesperson/team, close date, priority, tags, properties, notes tab, extra-info tab (address, contact, UTM), duplicate counter | `crm/views/crm_lead_views.xml` (`crm_lead_view_form`) |
| Deal list / calendar / pivot / graph | The same opportunity dataset in list, calendar (expected close), pivot and graph views | `crm_lead_opportunities_view_{kanban,tree,graph,pivot,calendar}`, `crm_lead_view_{graph,pivot}` |
| Linked quotations and orders | Smart buttons for quotation count, order count and sum of confirmed orders; "New Quotation" prefills customer, salesperson, team, source, tags and origin from the opportunity; expected revenue is raised to the linked order amount | `sale_crm/models/crm_lead.py` (`quotation_count`, `sale_order_count`, `sale_amount_total`, `action_new_quotation`), `sale_crm/views/sale_order_views.xml` |
| Merge opportunities | Merge wizard choosing the surviving record and field values; linked orders are re-attached | `crm/wizard/crm_merge_opportunities_views.xml`, `sale_crm/models/crm_lead.py` (`_merge_get_fields_specific`) |
| Opportunity reporting | Pivot/graph report actions for opportunities and leads, with date, salesperson, team and stage filters | `crm/views/crm_lead_views.xml` (`crm_opportunity_report_action`, `crm_opportunity_report_action_lead`) |
| Activity and email actions | Schedule/complete activities, send email and SMS from the record | `crm/views/mail_activity_views.xml`, `crm/views/crm_lead_views.xml` (mail actions) |

### Frappe CRM — deal record with product rows and quotation tab

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Deal detail | Header with status and assignees; tabs for activity, email, comments, calls, tasks, notes, attachments and WhatsApp; Quotations tab | `frontend/src/pages/Deal.vue`, `frontend/src/components/Activities/Activities.vue` |
| Deal products | Editable product rows that drive the deal value; optional bidirectional ERPNext item sync | `crm/fcrm/doctype/crm_deal/crm_deal.json`, `crm/fcrm/doctype/crm_product/crm_product.json`, `frontend/src/components/Settings/ERPNextSettings.vue` |
| Lost reason | Modal capturing reason and description when a deal is marked lost | `frontend/src/components/Modals/LostReasonModal.vue`, `crm/fcrm/doctype/crm_lost_reason/crm_lost_reason.json` |

### ERPNext — opportunity with items and explicit win/loss

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Opportunity list | List/kanban by stage with saved filters and probability/amount columns | `erpnext/crm/doctype/opportunity/opportunity_list.js`, `erpnext/crm/doctype/opportunity/opportunity_kanban.js` |
| Opportunity form | Stage, probability, expected close date, opportunity items, quotation/customer actions | `erpnext/crm/doctype/opportunity/opportunity.js`, `erpnext/crm/doctype/opportunity_item/opportunity_item.json` |
| Win/loss actions | Close/reopen and lost-reason actions with linked quotations and customer creation | `erpnext/crm/doctype/opportunity/opportunity.js`, `erpnext/crm/doctype/opportunity_lost_reason/opportunity_lost_reason.json` |

### Twenty — record page and duplicate merge

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Opportunity record | Record page showing amount, close date, stage, company, point of contact and owner | `packages/twenty-front/src/pages/object-record/RecordShowPage.tsx`, `packages/twenty-server/src/modules/opportunity/standard-objects/opportunity.workspace-entity.ts` |
| Record merge | Side-by-side duplicate merge with per-field selection and preview | `packages/twenty-front/src/modules/object-record/record-merge/components/MergeRecordsContainer.tsx` |

### Frappe Desk — generic form shell

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Form view | Tabbed form with child grids, linked documents, assignees, attachments and timeline | `frappe/public/js/frappe/form/form.js`, `frappe/public/js/frappe/form/sidebar/form_sidebar.js` |

### Carbon — opportunity as a document pipeline (RFQ → Quote → Order)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Opportunity state stepper | A synthetic opportunity groups the customer's RFQs, quotes and orders; renders three states (RFQ, Quote, Order) with started/completed markers and per-state document menus, including quote revisions | `modules/sales/ui/Opportunity/OpportunityState.tsx` |
| Opportunity notes | Free-text notes attached to an opportunity | `modules/sales/ui/Opportunity/OpportunityNotes.tsx` |
| Opportunity documents | File attachments at opportunity and opportunity-line level; line notes | `modules/sales/ui/Opportunity/OpportunityDocuments.tsx`, `OpportunityLineDocuments.tsx`, `OpportunityLineNotes.tsx` |
| No opportunity form | There is no separate amount/stage/probability form; the deal's value and status live on the RFQ, quote or order document itself | `modules/sales/types.ts` (`Opportunity`) |

### Ever Gauzy — deal record

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Deal record | Title, stage, client, probability; edited in a modal form from the deals table; no line items, amount, contacts or documents | `apps/gauzy/src/app/pages/pipelines/pipeline-deals/pipeline-deal-form/pipeline-deal-form.component.{ts,html}` |

### Moqui Sales — opportunity with manual sections

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Find Opportunity | Searchable list (account, name, estimated amount, close date, sales person) with saved finds, column selection, CSV/XLSX export and a create dialog | `screen/Sales/Opportunity/FindOpportunity.xml` |
| View Opportunity — summary | Read view plus an Edit dialog: sales account, currency, amount, stage, close date, sales person, name, description | `screen/Sales/Opportunity/ViewOpportunity.xml` (`OpportunitySummarySection`) |
| View Opportunity — sales team | Add/remove sales representatives (`SalesRepresentative` role) | `ViewOpportunity.xml` (`SalesTeamSection`) |
| View Opportunity — contacts | Add/remove existing contacts already linked to the sales account (`Contact` role) | `ViewOpportunity.xml` (`ContactSection`) |
| View Opportunity — attachments and notes | Wiki attachment upload; a `Note` subscreen is the default tab | `ViewOpportunity.xml` (`AttachmentSection`, `<subscreens default-item="Note">`) |
| Quote and request sections | Section placeholders exist but are empty (no linked quote or request list is rendered) | `ViewOpportunity.xml` (`QuoteSection`, `RequestSection`) |
| Stage seed data | Six demo stages (Stage 1–4, Closed Won, Closed Lost) with sequence and default probability | `data/SalesDemoData.xml` |

### Dolibarr / Akaunting — no opportunity record

- **Dolibarr:** the proposal is the deal; there is no opportunity object, stage or
  probability. See §5.
- **Akaunting:** invoices only; no opportunity or deal record.

**BOSS implications.** Odoo's opportunity is the stronger fit for a rep's daily work:
one record carrying amount, stage, probability, close date, team and linked documents,
with quotation/order roll-up and expected-revenue feedback from confirmed orders.
Carbon's document-pipeline view is a useful *secondary* presentation — it answers "where
is this deal in the RFQ → quote → order flow?" without duplicating the documents. BOSS
can build both on Mantle: `SalesOpportunity` supplies the record fields; the linked
`Order`/quote documents supply the stepper. The gaps to close versus Moqui Sales are the
quote/request sections (currently placeholders), probability and forecast fields,
merge/dedupe, and a won/lost outcome with reason. Frappe CRM shows a lighter version
worth copying: editable product rows that drive the deal value, a read-only Quotations
tab, and a lost-reason modal that forces a reason at the moment of loss; ERPNext adds
opportunity line items and explicit close/reopen. Twenty's side-by-side merge is the
best dedupe reference. Keep the opportunity form compact: summary + stage + linked
documents + activity timeline, with account, contacts and team as collapsible sections.

## 4. Accounts & contacts

### Odoo — partner record as the single customer master

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customers action | CRM menu "Customers" opens the shared partner form (`base.action_partner_form`), filtered to customers | `crm/views/crm_menu_views.xml` (`res_partner_menu_customer`), `sale/views/sale_menus.xml` (`res_partner_menu`) |
| Partner form — sales buttons | Smart buttons for Opportunities and Sales (quotations/orders), each filtered to the partner subtree | `crm/views/res_partner_views.xml` (`opportunity_count`), `sale/views/res_partner_views.xml` (`sale_order_count`) |
| Partner form — sales defaults | Pricelist, payment terms, incoterm and location, salesperson/team, fiscal position, credit limit | `sale/views/res_partner_views.xml`, `sale/views/account_views.xml`, `account` partner property view |
| Sales warning | "Warning on Sales Orders and Invoices" free-text block shown on the order/invoice | `sale/views/res_partner_views.xml` (`sale_warn_msg`) |
| Partner list | List/kanban of partners with country and optional pricelist column | `sale/views/res_partner_views.xml` (`view_partner_tree_inherit`) |
| Contact record | Person record with parent company, job title, address, email/phone, salesperson and tags; child contacts roll up under the company | `base/views/res_partner_views.xml` (Odoo base module) |

### Frappe CRM — organizations and contacts

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Organizations list | Saved list/group views of companies with owner, territory and deal roll-ups | `frontend/src/pages/Organizations.vue`, `frontend/src/components/ListViews/OrganizationsListView.vue` |
| Organization detail | Deals and Contacts tabs, website enrichment and add-contact action | `frontend/src/pages/Organization.vue`, `frontend/src/components/EnrichFromWebsite.vue` |
| Contacts list/detail | Contact list plus detail page with a linked Deals tab | `frontend/src/pages/{Contacts,Contact}.vue` |

### ERPNext — customer 360 with commercial defaults

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customer form | Overview, addresses/contacts, credit limit, loyalty program, sales partner, linked transactions | `erpnext/selling/doctype/customer/customer.json`, `erpnext/selling/doctype/customer/customer_dashboard.py` |
| Address and Contacts report | Lists addresses and contacts for a selected party or territory | `erpnext/selling/report/address_and_contacts/address_and_contacts.json` |

### Twenty — companies and people

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Company record | Domain, account owner, linked people and opportunities | `packages/twenty-front/src/pages/object-record/RecordShowPage.tsx`, `packages/twenty-server/src/modules/company/standard-objects/company.workspace-entity.ts` |
| Person record | Emails, phones, job title, company and linked opportunities | `packages/twenty-front/src/pages/object-record/RecordShowPage.tsx`, `packages/twenty-server/src/modules/person/standard-objects/person.workspace-entity.ts` |

### Carbon — customer 360 with sales tabs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customers table | Customer ID, name, status, type, account manager, tags, currency, phone, fax, website, created/updated audit columns; row actions | `modules/sales/ui/Customers/CustomersTable.tsx`, route `x+/sales+/customers.tsx` |
| Customer form | Name, status, type, account manager, sales contact, currency, tax percent, website, tags; ID immutable after creation | `modules/sales/ui/Customer/CustomerForm.tsx` |
| Customer sidebar | Record tabs: Details, Contacts, Locations, Shipping, Tax, Payment, Bank Accounts, Accounting, Documents, Risks, plus Quotes, RFQs, Orders and Invoices | `modules/sales/ui/Customer/CustomerSidebar/useCustomerSidebar.tsx`, routes `x+/customer+/$customerId.*` |
| Contacts | Per-customer contact list and inline add/edit (name, email, phone, role) | `modules/sales/ui/Customer/{CustomerContacts,CustomerContactForm}.tsx`, routes `x+/customer+/$customerId.contacts*` |
| Locations | Multiple customer locations (billing/shipping) with postal address and contacts | `CustomerLocations.tsx`, `CustomerLocationForm.tsx`, routes `$customerId.locations*` |
| Shipping defaults | Shipping customer/contact/location, shipping method, incoterm and incoterm location | `CustomerShippingForm.tsx` |
| Payment defaults | Invoice customer/contact/location, payment term | `CustomerPaymentForm.tsx` |
| Tax profile | Tax ID, VAT number, EORI, tax-exempt flag, exemption reason, certificate upload | `CustomerTaxForm.tsx` |
| Bank accounts | Customer bank accounts with country-specific routing fields (IBAN/ABA/BSB/IFSC/sort code/transit) and masked account number | `CustomerBankAccounts.tsx`, `CustomerBankAccountForm.tsx` |
| Risk register | Per-customer risk entries used in quote/line risk checks | `CustomerRiskRegister.tsx`, route `$customerId.risks.tsx` |
| Customer statuses/types | Configurable status and type lists used by the customer form and table | `modules/sales/ui/{CustomerStatuses,CustomerTypes}/`, routes `x+/sales+/customer-{statuses,types}.*` |
| Customer portals | Portal definitions per customer (enterprise feature) | `modules/sales/ui/CustomerPortals/`, routes `x+/sales+/customer-portals.*` |

### Dolibarr — third-party card with role-specific tabs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Third-party list | Filterable list of customers, prospects and suppliers; mass actions, export | `htdocs/societe/list.php` |
| Third-party card | Company identity, customer/prospect/supplier roles with separate codes, address, contacts, price level, discounts, outstanding balance, bank accounts, tags | `htdocs/societe/card.php` |
| Card tabs | Contacts/addresses, proposals, orders, invoices, payments, contracts, projects, agenda, notes, documents | `htdocs/societe/card.php`, `htdocs/societe/{contact,agenda,note,document}.php`, `htdocs/core/lib/company.lib.php` |
| Contact list / card | Independent contacts linked to third parties; roles, address, phone/email, agenda, projects, documents | `htdocs/contact/list.php`, `htdocs/contact/card.php` |
| Price and discount assignment | Customer price level (`multiprix`) and absolute/relative discounts (`remise`) applied to proposals/orders | `htdocs/comm/multiprix.php`, `htdocs/comm/remise.php`, `htdocs/societe/price.php` |

### Ever Gauzy — lightweight contacts

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Contacts list | Table of contacts with type (client/contact/lead), name, email, phone, city, country, projects; invite action | `apps/gauzy/src/app/pages/contacts/contacts.component.{ts,html}` |
| Contact view | Read-only contact profile with projects and activity | `apps/gauzy/src/app/pages/contacts/contact-view/contact-view.component.{ts,html}` |
| Contact editor | Name, contact type, primary email/phone, website, fax, fiscal information, projects, budget type and amount | `apps/gauzy/src/app/pages/contacts/contact-mutation/contact-mutation.component.html` |
| Invite contact | Invite an email address into the organization as a user/contact | `apps/gauzy/src/app/pages/contacts/invite-contact/` |

### Moqui Sales — account and contact screens

| Screen/page | What it is | Key files |
| --- | --- | --- |
| View Account | Party summary with email/phone/web contact mechanisms (add/remove), related contacts, opportunities and orders lists; links into each record | `screen/Sales/Account/ViewAccount.xml` |
| View Contact | Contact summary with contact mechanisms, related sales accounts, add-to-account and remove actions | `screen/Sales/Contact/ViewContact.xml` |
| Find Account / Find Contact | Search lists with saved finds, column selection and export (XML and QVue variants) | `screen/Sales/Account/FindAccount.qvue`, `screen/Sales/Contact/FindContact.xml` |
| Account party details | Shared SimpleScreens party edit subscreens (contact info, addresses, etc.) | `screen/Sales/Account/ViewAccount.xml` (`UpdateContactInfo` subscreen) |

### AureusERP — customer resource with relation managers

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customer list/form | Filament customer resource with create/edit/view pages | `plugins/webkul/sales/src/Filament/Clusters/Orders/Resources/CustomerResource.php`, `.../CustomerResource/Pages/` |
| Customer addresses / contacts / bank accounts | Relation-manager pages on the customer record | `.../CustomerResource/Pages/{ManageAddresses,ManageContacts,ManageBankAccounts}.php` |

### metasfresh — business partner window

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Business partner window | Metadata-defined BPartner window with CRM fields added by the Fresh module (contacts, sales rep, greeting, etc.) | backend SQL `backend/de.metas.fresh/.../5444280_sys_Fresh_128_Provide_CRM_Features.sql`, generic shell `frontend/src/containers/MasterWindowContainer.js` |

### Akaunting — customers and portal profile

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customers | Customer list, create/edit forms and customer detail page | `resources/views/sales/customers/{index,create,edit,show}.blade.php` |
| Portal profile | Customer-portal profile edit | `resources/views/portal/profile/edit.blade.php` |

**BOSS implications.** The account record must carry the commercial defaults, not just
identity: pricelist, payment terms, currency, tax profile, shipping/billing locations,
incoterm, salesperson/team and credit/risk state. Carbon's tab set is the strongest
inventory of what those tabs should be, and Odoo shows how little chrome is needed when
the same partner record is reused across sales, accounting and service. BOSS's shared
Customer 360 (see [research-customer-service.md](research-customer-service.md)) should
keep the sales tabs (RFQs, quotes, orders, agreements, opportunities) alongside the
service and accounting tabs, with the sales app emphasising pipeline and order history.
Moqui Sales already links account → contacts/opportunities/orders, but has no quotes,
invoices, agreements or 360 summary and no account creation flow; those are the gaps.
Frappe CRM and Twenty both keep organization and person as separate records with
explicit links, which avoids Odoo's sometimes awkward parent/child partner tree; BOSS
should model account and contact separately (Mantle Party plus roles) and let the
account show roll-up counters. ERPNext's customer form is the best checklist for the
360 header: addresses/contacts, credit limit, loyalty, sales partner and linked
transactions.

## 5. Quotes, price lists & product selection

### Odoo — quotation form, templates, pricelists and online acceptance

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quotations list | Quotation and order lists with list/kanban/calendar/pivot/graph views, saved filters (my quotations, to invoice, late), and a dashboard header | `sale/views/sale_order_views.xml` (`action_quotations`, `view_quotation_tree`, `sale_order_list_with_dashboard`), `sale/static/src/views/dashboard_list_view/` |
| Quotation form | Statusbar (draft → sent → sale), customer + invoice/shipping addresses, validity date, commitment/expected dates, currency, payment terms, pricelist, fiscal position, incoterm, client order reference, tags, origin, salesperson/team, UTM fields | `sale/views/sale_order_views.xml` (`view_order_form`) |
| Order lines grid | Product, description, quantity, delivered, invoiced, unit price, discount %, taxes, customer lead time, analytic distribution; drag to reorder; subtotal and tax totals | `sale/views/sale_order_views.xml` (`Order Lines` page), `sale/views/sale_order_line_views.xml` |
| Optional products | Order lines flagged optional are offered as upsell choices on the quotation/online quote; template lines can be marked optional | `sale_management/views/sale_order_views.xml` (`is_optional`), `sale_management/views/sale_order_template_views.xml` |
| Product picker | Catalog/card picker, variant configurator, combo configurator and quantity availability at line entry | `sale/static/src/js/{product,product_card,product_list,product_configurator_dialog,combo_configurator_dialog}/`, `quantity_availability/` |
| Quote actions | Send by email, preview PDF, confirm/sign, share link, create invoice, cancel; signature requirement toggle on the quote | `sale/views/sale_order_views.xml` (`require_signature`), `sale/report/ir_actions_report_templates.xml` |
| Quotation templates | Named templates with header/terms, line sections/notes, optional products, validity days, signature requirement and invoicing settings | `sale_management/views/sale_order_template_views.xml`, menu `sale_management/views/sale_management_menus.xml` |
| Pricelists | Pricelist list/kanban/form; items with applied-on (product/category/variant), minimum quantity, validity dates, compute method (fixed/percentage/formula), round/margins | `product/views/product_pricelist_views.xml`, `product/views/product_pricelist_item_views.xml` |
| Online quotation | Customer portal list and quote page with accept/sign, optional products and payment; "quotation viewed" tracking | `sale/views/sale_portal_templates.xml`, `sale/controllers/portal.py`, `sale/static/src/interactions/{sale_portal,portal_prepayment}.js` |
| PDF quote builder | Per-quote document pages, headers/footers, dynamic form fields and product documents merged into the PDF | `sale_pdf_quote_builder/views/{sale_order_views,quotation_document_views,sale_pdf_form_field_views}.xml`, `sale_pdf_quote_builder/report/` |
| Discount and margin | Whole-order discount wizard; margin fields on order lines when margin is installed | `sale/wizard/sale_order_discount_views.xml`, `sale_margin/` |

### Frappe CRM — quotation window, not a quote editor

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quotations tab | Read-only ERPNext quotations linked to the deal with status, amount, date and deep link | `frontend/src/components/Activities/QuotationsList.vue`, `frontend/src/pages/Deal.vue` |
| CRM products | CRM product rows with optional bidirectional ERPNext item sync and failure logs | `crm/fcrm/doctype/crm_product/crm_product.json`, `frontend/src/components/Settings/ERPNextSettings.vue` |

### ERPNext — quotation with revisions, taxes and bundles

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quotation | Quote for a customer, lead, prospect or CRM deal: items, taxes, validity, revisions, create sales order | `erpnext/selling/doctype/quotation/quotation.js`, `erpnext/selling/doctype/quotation/quotation.json` |
| Quotation list | Saved filters for draft, open, expiring and lost quotations; quotation-trends report | `erpnext/selling/doctype/quotation/quotation_list.js`, `erpnext/selling/doctype/quotation/list_filter/quotation_lost.json` |
| Print formats | Classic, modern, bordered and image variants for quotation and sales-order PDFs | `erpnext/selling/print_format/quotation_modern/quotation_modern.json`, `erpnext/selling/print_format/sales_order_classic/sales_order_classic.json` |
| Pricing | Price lists, item prices and pricing rules applied to quote and order lines | `erpnext/stock/doctype/price_list/price_list.json`, `erpnext/stock/doctype/item_price/item_price.json`, `erpnext/accounts/doctype/pricing_rule/pricing_rule.json` |
| Tax and terms | Sales taxes and charges template, payment terms template and currency carried through quote → order → invoice | `erpnext/accounts/doctype/sales_taxes_and_charges_template/sales_taxes_and_charges_template.json`, `erpnext/accounts/doctype/payment_terms_template/payment_terms_template.json` |
| Product Bundle | Bundle item expands into component rows in quotes and orders | `erpnext/selling/doctype/product_bundle/product_bundle.json` |

### Frappe Desk — print and PDF shell

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Print format picker / PDF | Generic print-format picker and PDF renderer used by sales documents | `frappe/public/js/frappe/form/print_utils.js` |

### Carbon — costing-first quote builder with price provenance

| Screen/page | What it is | Key files |
| --- | --- | --- |
| RFQ → quote conversion | RFQ lines are copied into a quote; quote header carries customer RFQ, purchasing/engineering contacts, customer location, sales person, estimator, due/expiration dates, currency and revision ID | `modules/sales/ui/Quotes/QuoteForm.tsx`, `QuoteHeader.tsx`, routes `x+/quote+/` |
| Quote list | Quote number, customer, customer RFQ, status, sales person, estimator, due/expiration dates, location, assignee, line-completion count ("n of m lines complete") | `modules/sales/ui/Quotes/QuotesTable.tsx`, `x+/sales+/quotes.tsx` |
| Quote line form | Item, short description, method (make/buy), line status, quantity, customer part number/revision, tax percent, no-quote reason; embedded pricing and costing panels | `modules/sales/ui/Quotes/QuoteLineForm.tsx`, `QuoteLinePricing.tsx`, `QuoteLineCosting.tsx` |
| Line costing / method | Per-line material and operation costs; make-method routing steps, parameters and operation ordering; BoM and BoP explorers | `modules/sales/ui/Quotes/{QuoteMaterialForm,QuoteLineMethodForm,QuoteMakeMethodTools,QuoteBillOfMaterial,QuoteBillOfProcess}.tsx`, routes `x+/quote+/methods/` |
| Price trace and history | "How this price was calculated" modal plus per-line price history and precision recalculation | `modules/sales/ui/Quotes/QuoteLinePriceTraceModal.tsx`, `QuoteLinePricingHistory.tsx`, routes `$quoteId.$lineId.price-trace.tsx`, `update-precision.tsx`, `recalculate-price.tsx` |
| Lead time and risk | Line lead-time dialog; quote-line risk register checks | `QuoteLeadTimeModal.tsx`, `QuoteLineRiskRegister.tsx`, route `$quoteId.$lineId.lead-time.tsx` |
| Revisions and duplication | New revision from a quote, duplicate quote, drag line order, exchange-rate override | `modules/sales/ui/Quotes/QuoteHeader.tsx`, routes `$quoteId.duplicate.tsx`, `$quoteId.drag.tsx`, `$quoteId.exchange-rate.tsx` |
| Finalize and send | Finalize modal with Send Via and CC; PDF generation; digital quote share link | `QuoteFinalizeModal.tsx`, `file+/quote+/$id[.]pdf.tsx`, `share+/quote.$id.tsx`, `api+/sales.digital-quote.$id.tsx` |
| Convert to order | Drawer to create a sales order from a quote, capturing the customer PO number and linking the opportunity | `QuoteToOrderDrawer.tsx`, route `$quoteId.convert.tsx` |
| Price lists / overrides | Price list table with item, customer/customer-type scope, quantity price breaks, resolved price and source, valid period, duplicate-to, preview quantity | `modules/sales/ui/Pricing/{PriceOverridesTable,PriceOverrideForm,DuplicatePriceListModal}.tsx`, routes `x+/sales+/price-list.*` |
| Pricing rules | Named rules with rule type, amount type/amount, active, scope (all customers, specific customers, customer type), item/item-group scope and date range; duplicate/delete | `modules/sales/ui/Pricing/{PricingRulesTable,PricingRuleForm,ScopePicker}.tsx`, routes `x+/sales+/pricing-rules.*` |

### Dolibarr — proposals with list/kanban/statistics and mass actions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Proposal list | List, kanban and statistics modes; filters; mass actions: send by mail, validate, sign/no-sign, classify billed, delete | `htdocs/comm/propal/list.php` |
| Proposal card | Customer and customer reference, contact, discounts, date, validity duration (days), payment terms/mode, bank account, source, shipping method, warehouse, availability period, delivery date, project, notes | `htdocs/comm/propal/card.php` |
| Proposal lines | Product/service lines with quantity, unit price, discount, VAT; minimum-price warnings; line descriptions and titles | `htdocs/comm/propal/card.php` |
| PDF and signature | Generate/regenerate PDF, merge documents, record customer signature/no-signature | `htdocs/comm/propal/card.php`, `htdocs/comm/propal/list.php`, `htdocs/core/modules/propal/` |
| Proposal statistics | Turnover/status statistics over proposals | `htdocs/comm/propal/stats/index.php` |
| Price levels and discounts | Customer price level (`multiprix`) and discounts (`remise`) used by proposal line pricing | `htdocs/comm/multiprix.php`, `htdocs/comm/remise.php` |

### Moqui Sales — no quote screen

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Agreement items as the only price surface | Agreement items carry product, quantity, list price, negotiated price, item type and from/thru dates; there is no quotation document | `screen/Sales/Agreement/ViewAgreement.xml` (`AgreementItemForm`) |
| Opportunity quote section | Placeholder section; no quotation list or create action is rendered | `screen/Sales/Opportunity/ViewOpportunity.xml` (`QuoteSection`) |
| Order line pricing (alpha) | The order screen edits an order part but has no dedicated price-list or quote-line model | `screen/Sales/Order/ViewOrder.xml` |

### Akaunting — invoices, not quotes

- **Akaunting:** no quotation object; sales invoices and recurring invoices are the
  documents (`resources/views/sales/invoices/`, `resources/views/sales/recurring_invoices/`).

**BOSS implications.** The quote screen is the heart of IronStone Sales and the largest
gap in the Moqui reference. Start from Odoo's line grid plus templates: header defaults
from the account and opportunity, line entry with catalog picker, quantity/price/discount/
tax, optional upsell lines, validity date, terms and signature requirement. Add Carbon's
two differentiators where the business needs them: a **price explanation** ("how this
price was calculated") backed by a price list + customer override + quantity-break +
date-validity chain, and **quote revisions** with a finalize/send step and a share link
that converts to an order with the customer's PO number. Costing (materials, operations,
lead time) belongs behind a manufacturing flag, not in the default quote form. ERPNext
adds two cheap wins: quote revisions as a first-class action and product bundles that
expand into component lines; its print-format variants and tax/terms templates also
deserve to be data, not hard-coded PDFs. Do not copy Akaunting's invoice-only model: a
quote is a distinct lifecycle state before the order, and Moqui's `Order` entity can
carry it (draft → sent → accepted → ordered) without a second document table.

## 6. Orders & fulfillment handoff

### Odoo — order lifecycle with delivery and invoice smart buttons

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Orders list | Confirmed orders in list/kanban/calendar/pivot/graph with dashboard header; filter by invoice/delivery status | `sale/views/sale_order_views.xml` (`action_orders`, `sale_order_tree`, `sale_order_view_kanban`), `sale/static/src/views/dashboard_list_view/` |
| Order form | Statusbar (draft/sent/sale, locked/cancelled), locked badge, invoice and payment smart buttons, customer/addresses, payment terms, pricelist, incoterm, dates, source, tags | `sale/views/sale_order_views.xml` (`view_order_form`, `action_view_invoice`, `action_view_payment_transaction`) |
| Order lines | Per-line delivered and invoiced quantities, invoice status, discount, taxes, analytic distribution; line-level invoice/delivery state drives the "to invoice" filters | `sale/views/sale_order_views.xml` (`Order Lines`), `sale/report/sale_report_views.xml` (`filter to_invoice`, `fully_invoiced`) |
| Order actions | Send by email, preview, confirm, lock/unlock, cancel, set back to quotation, create invoice (advance/regular), send pro-forma | `sale/views/sale_order_views.xml` (buttons), `sale/wizard/sale_make_invoice_advance_views.xml` |
| Delivery handoff | Confirmed orders create stock moves/pickings; delivery status appears on the order and in the delivery views | `sale_stock/`, `sale/views/sale_order_views.xml` |
| Portal orders | Customer portal order and quotation lists plus order detail with invoice/payment links | `sale/views/sale_portal_templates.xml`, `sale/controllers/portal.py` (`portal_my_orders`) |
| Mass cancel | Bulk cancel wizard for selected orders | `sale/wizard/mass_cancel_orders_views.xml` |
| Payment link | Generate a payment link for an order | `sale/wizard/payment_link_wizard_views.xml` |

### ERPNext — order with delivery/billing percentages and document links

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales order | Confirmed order with status, per-delivered/per-billed percentages, hold/close and update-items actions | `erpnext/selling/doctype/sales_order/sales_order.js`, `erpnext/selling/doctype/sales_order/sales_order.json` |
| Sales order list / calendar | List indicators plus a delivery-date calendar view | `erpnext/selling/doctype/sales_order/sales_order_list.js`, `erpnext/selling/doctype/sales_order/sales_order_calendar.js` |
| Delivery note | Shipment against a sales order with serial/batch and packing details | `erpnext/stock/doctype/delivery_note/delivery_note.json` |
| Sales invoice | Customer bill linked to order/delivery with payment terms and outstanding status | `erpnext/accounts/doctype/sales_invoice/sales_invoice.json` |
| Proforma invoice | Pre-shipment invoice copy generated from a sales order | `erpnext/selling/doctype/proforma_invoice/proforma_invoice.json` |
| Payment-terms status | Payment terms template plus a report showing schedule status per sales order | `erpnext/accounts/doctype/payment_terms_template/payment_terms_template.json`, `erpnext/selling/report/payment_terms_status_for_sales_order/payment_terms_status_for_sales_order.json` |
| Installation note | Captures installation work against a delivered order | `erpnext/selling/doctype/installation_note/installation_note.json` |

- **Frappe CRM:** no dedicated order screen (nearest: read-only quotation links in
  `frontend/src/components/Activities/QuotationsList.vue`).
- **Twenty:** no dedicated order or fulfillment screen (nearest: opportunity amount and
  custom objects in the data model).

### Carbon — order execution with jobs, shipments and drop-ship

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales order list | Order number, customer, customer PO, status, order total, order date, promised date, location, payment terms, shipping method, drop-ship flag, assignee, audit columns | `modules/sales/ui/SalesOrder/SalesOrdersTable.tsx`, `x+/sales-order+/orders.tsx` |
| Order form | Customer, customer PO, purchasing/engineering contacts, customer location, quote accepted by/email, requested/promised dates, shipping location, sales person, currency | `modules/sales/ui/SalesOrder/{SalesOrderForm,SalesOrderHeader}.tsx` |
| Order lines | Line details plus per-line jobs, shipments, job operations (job ID, quantity, scrap, due date, location) and shipment status | `modules/sales/ui/SalesOrder/{SalesOrderLineForm,SalesOrderLineJobs,SalesOrderLineShipments}.tsx`, routes `$orderId.$lineId.{job,shipment}.tsx` |
| Shipment details | Shipping method, incoterm, shipment location/date, tracking number, shipping cost, drop-ship flag | `modules/sales/ui/SalesOrder/{SalesOrderShipmentForm,SalesOrderSummary}.tsx`, route `$orderId.shipment.tsx` |
| Payment details | Invoice customer/contact/location and payment term on the order | `modules/sales/ui/SalesOrder/SalesOrderPaymentForm.tsx`, route `$orderId.payment.tsx` |
| Order actions | Confirm, cancel with preview, create jobs/convert lines to jobs, convert to service contract, exchange-rate override, invoice summary, PDF, email | `modules/sales/ui/SalesOrder/{SalesOrderHeader,SalesOrderSummary}.tsx`, routes `$orderId.{confirm,cancel-preview,contract,exchange-rate,status}.tsx`, `file+/sales-order+/$id[.]pdf.tsx` |
| Customer portal | Portal job-operation progress and line status per order | `modules/sales/ui/CustomerPortal/{JobOperationProgress,PortalLineStatus}.tsx`, `share+/customer.$id.tsx` |
| Sales returns | Return-order list/form with returnable lines, disposition, replacement, receiving, credit | `modules/sales/ui/SalesReturnOrders/`, routes `x+/sales-return-order+/` |

### Dolibarr — order lifecycle and invoice/shipment creation

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Order list | List, kanban and statistics modes; filters for status and shippable; mass actions | `htdocs/commande/list.php` |
| Order card | Customer/contact, customer reference, dates, payment terms/mode, warehouse, source, project, discounts, notes; status sequence draft → validated/sent → to process → shipped → to bill → billed/closed/cancelled | `htdocs/commande/card.php` |
| Order actions | Validate, send by mail, close, cancel, classify shipped/delivered, create invoice, create shipment, clone | `htdocs/commande/card.php`, `htdocs/commande/list.php` |
| Order lines | Product/service, quantity, unit price, discount, VAT, warehouse allocation; line status | `htdocs/commande/card.php` |
| Statistics | Order statistics by period/status | `htdocs/commande/stats/index.php` |

### Moqui Sales — alpha order screen

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Find Order | Search list with create-order dialog; links to account and order detail | `screen/Sales/Order/FindOrder.xml` |
| View Order (alpha) | Header form, customer email and payment terms, ship-to/bill-to selection and validation, shipping method selection, order-part edit; an `Item` subscreen; toolbar placeholders "Put order buttons here (change status, etc.)" and "Put payment buttons here" | `screen/Sales/Order/ViewOrder.xml`, `screen/Sales/Order/ViewOrder/Item.xml` |
| Shipping options | AJAX transition returning shipping options for an order part | `ViewOrder.xml` (`getShippingOptions`) |
| No fulfillment/invoice views | No shipment, invoice, return or payment screens exist in the component | — |

### metasfresh — document shell plus planning and allocation views

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Document list / master window | Generic list and record shells for sales orders and related documents | `frontend/src/containers/{DocumentListContainer,MasterWindowContainer}.js`, `frontend/src/components/window/` |
| Order candidates | Workbench for processing imported/created order candidates into sales orders | backend module `de-metas-salesorder` (`de.metas.salesorder`: `ProcessOLCands*`, `AutoProcessingOLCandService`), window SQL above |
| Delivery planning | Dedicated delivery-planning view header and rows | `frontend/src/components/deliveryPlanning/`, `frontend/src/containers/` |
| Payment allocation | Invoice-to-payment allocation view | `frontend/src/components/paymentAllocation/` |
| Document references | Cross-document reference groups (order → delivery → invoice) shown on records | `frontend/src/components/documentReferences/{DocumentReferences,DocumentReferenceGroup,DocumentReferenceItem}.js` |
| Complete ship and invoice | Background workpackage that completes shipping and invoicing for an order | `backend/de-metas-salesorder/.../async/{CompleteShipAndInvoiceWorkpackageProcessor,CompleteShipAndInvoiceEnqueuer}.java` |

### AureusERP — order cluster with delivery/invoice relation managers

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quotation resource | Quotation list/form with actions Send by Email, Confirm, Preview, Create Invoice, Lock/Unlock, Cancel, Back to Quotation; deliveries and invoices relation managers | `plugins/webkul/sales/src/Filament/Clusters/Orders/Resources/QuotationResource.php`, `.../QuotationResource/{Actions,Pages}/` |
| Sales order resource | Order list/form with deliveries, invoices and payments managers | `.../Resources/OrderResource.php`, `.../OrderResource/Pages/{ManageDeliveries,ManageInvoices}.php` |
| Delivery / invoice resources | Delivery and invoice record pages with stock moves and payments | `.../Resources/{QuotationDeliveryResource,OrderDeliveryResource,QuotationInvoiceResource,OrderInvoiceResource}.php` |
| To-invoice / upsell | Dedicated clusters for orders to invoice and orders to upsell | `Filament/Clusters/ToInvoice/Resources/{OrderToInvoiceResource,OrderToUpsellResource}.php` |

### Akaunting — invoices and recurring invoices

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales invoices | Invoice list/create/edit/show with line items, taxes, discounts, payment terms; print templates | `resources/views/sales/invoices/{index,create,edit,show,print_*}.blade.php` |
| Recurring invoices | Recurring invoice list/create/edit/show | `resources/views/sales/recurring_invoices/` |
| Portal invoices / payments | Customer portal invoice list/detail/preview/signed and payment pages | `resources/views/portal/{invoices,payments}/` |

**BOSS implications.** The order screen is a shared business screen (initial-design:
"one screen with role-based action sets for Sales, Customer Service, Warehouse and
Accounting"), so it should not be rebuilt per app. Take Odoo's lifecycle and smart
buttons (invoices, payments, delivery) and Carbon's execution detail for fulfillment
(jobs, shipments, drop-ship, tracking) behind capability flags. ERPNext states the handoff
contract most clearly: per-line delivered and billed percentages, partial delivery and
partial billing, and back-links from each invoice/delivery to the order. The minimum
sales face is: customer/PO/terms/addresses, lines with delivered and invoiced
quantities, a status bar, and links to the quote, shipments, invoices and payments.
Moqui Sales has the address/payment-terms/shipping-method skeleton and an `Item`
subscreen, but no status actions, fulfillment, invoicing or returns; those are the gaps.
Keep order actions role-scoped and put destructive transitions (cancel, lock) behind
confirmation with a preview, as Carbon and Odoo both do.

## 7. Agreements, contracts & subscriptions

### Carbon — service contracts with billing and revenue schedules

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Service contract list | Contract number, customer, type (Existing, New Sales, Expansion, Reactivation), status, contract value, invoiced to date, next invoice date, start/end (or open-ended), created date | `modules/sales/ui/Contracts/ContractsTable.tsx`, route `x+/sales+/contracts.tsx` |
| Contract setup wizard | Stepped setup: Details → Services → Invoicing → Revenue → Review; contract type, dates, currency, payment terms, billing cycle/timing, revenue method | `modules/sales/ui/Contracts/{ContractSetupSteps,ContractDetailsForm,ContractProductsGrid,ContractBillTo,ContractRevenue}.tsx`, routes `x+/contract+/$id.setup.*` |
| Contract record | Header, summary, status, amounts, products grid (recurring/one-time, per day/week/month/quarter/year, qty, rate, discount, start/end), invoice grid, revenue grid, project link, properties | `modules/sales/ui/Contracts/{ContractHeader,ContractSummary,ContractProductsGrid,ContractInvoiceGrid,ContractRevenueGrid,ContractProject,ContractProperties}.tsx`, route `$id.tsx` |
| Contract actions | Confirm, cancel, revert cancellation, close, amend, invoice now, schedule view | `modules/sales/ui/Contracts/{ContractConfirmModal,ContractCancelModal,ContractAmendModal,ContractAmountsModal}.tsx`, routes `$id.{confirm,cancel,amend,invoice,schedule}.tsx` |
| Amendments | Line-level changes with quantity/rate/discount/tax/description deltas and effective timing ("from the change date" vs "from the next billing period"); amendment history | `modules/sales/ui/Contracts/{ContractAmendModal,ContractAmendments}.tsx`, route `$id.amend.tsx` |
| Revenue recognition | Per-period revenue rows with method, revenue start/end, "Even Period" vs "Go-Live", delete/recalculate | `ContractRevenueGrid.tsx`, route `$id.revenue.tsx` |
| Invoicing | Invoice list per contract with invoice dates and amounts; "Invoice now" creates the due invoice | `ContractInvoiceGrid.tsx`, routes `$id.invoice.tsx`, `$id.invoices.tsx` |

### Carbon — rental agreements with unit-level accounting

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Rental agreement list/record | Rental agreements with explorer, header, summary, properties, status and money panels | `modules/sales/ui/Rentals/{RentalAgreementsTable,RentalAgreementExplorer,RentalAgreementHeader,RentalAgreementSummary,RentalAgreementProperties}.tsx`, routes `x+/rental-agreement+/` |
| Rental setup wizard | Details → Billing → Units → Accounting → Review | `modules/sales/ui/Rentals/RentalSetupSteps.tsx`, routes `$id.setup.*` |
| Billing configuration | Billing cycle (monthly/weekly/28 days), timing (advance/arrears), payment terms, invoicing action (post, post and email, post via Stripe), deposit handling | `RentalAgreementBilling.tsx` |
| Billing periods | Period rows with day/month labels and invoice action | `RentalBillingPeriods.tsx`, route `$id.billing.tsx` |
| Units and rates | Rental lines: fleet unit, rate, rate frequency (daily/weekly/monthly), customer- or customer-type-specific rate, economic life, fair value, residuals | `RentalAgreementLineForm.tsx`, `RentalUnitsGrid.tsx` |
| Lease classification | Ownership transfer, purchase option (and certainty), specialized asset, fair value, guaranteed/unguaranteed residual, discount rate, economic life | `RentalAgreementAccounting.tsx`, `RentalLeaseClassification.tsx` |
| Charges and deposits | One-off charges (amount, tax, invoice separately) and deposits | `RentalAgreementChargeForm.tsx`, `RentalAgreementCharges.tsx`, `RentalDeposits.tsx` |
| Lifecycle | Activate (checks unit availability, classifies accounting, cuts first billing periods), cancel (voids and releases units; blocked once on rent/invoiced), close (all units returned/sold and periods invoiced) | `RentalAgreementHeader.tsx` |

### Dolibarr — contracts with service lines and recurring invoices

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Contract list | Contract ref, customer, contract type, start/end dates, late flag, sales representative, PDF/send actions; statistics view | `htdocs/contrat/list.php`, `htdocs/contrat/stats/index.php` |
| Contract card | Customer/contact, dates (planned/real start and end), status, sign/validate/close actions, notes, documents, linked orders/proposals/projects | `htdocs/contrat/card.php` |
| Contract lines | Service lines with product/service, quantity, unit price, VAT, dates and service status; only service-type lines are billed | `htdocs/contrat/card.php`, `htdocs/contrat/services_list.php` |
| Recurring invoicing | Contract invoice generation on a schedule, with related invoices shown on the contract | `htdocs/contrat/card.php`, `htdocs/compta/facture/` |
| Bulk operations | Activate all, close all, clone/move lines between contracts | `htdocs/contrat/card.php` |

### Moqui Sales — agreement record with items and subscriptions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Find Agreement | Searchable agreement list with saved finds and export | `screen/Sales/Agreement/FindAgreement.xml` |
| Agreement header | Status, transacting entity, currency, start/end dates, description; edit form | `screen/Sales/Agreement/ViewAgreement.xml` (`HeaderForm`, `updateAgreement`) |
| Subscription section | Conditional section listing subscriptions with internal/external IDs and description (read-only) | `ViewAgreement.xml` (`SubscriptionSection`) |
| Parties | Add/remove agreement parties with a role type; party links to the account | `ViewAgreement.xml` (`AgreementPartyForm`) |
| Addresses and payment | Ship-to and bill-to selection/validation; payment method selection | `ViewAgreement.xml` (`ShipToAddress`, `BillToAddress`, `AddPaymentInfo`) |
| Agreement items | Add/edit/delete items: product, quantity, unit amount (or calculated price), item type, from/thru dates; list price/price/line amount columns | `ViewAgreement.xml` (`AgreementItemForm`) |
| No billing schedule | No invoice schedule, renewal, amendment or revenue-recognition UI | — |

### ERPNext — contracts and subscriptions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Contract | Party agreement with status, signee, signed-on/IP, terms and fulfilment checklist | `erpnext/crm/doctype/contract/contract.json`, `erpnext/crm/doctype/contract/contract.js` |
| Contract template | Reusable contract terms and fulfilment requirements applied to a contract | `erpnext/crm/doctype/contract_template/contract_template.json` |
| Contract list | Unsigned/active/inactive status indicators and filters | `erpnext/crm/doctype/contract/contract_list.js` |
| Subscription | Recurring billing record with plans, periods, trial, cancellation and generated invoices | `erpnext/accounts/doctype/subscription/subscription.json` |
| Subscription plan | Item, price list, billing interval and payment gateway for a subscription | `erpnext/accounts/doctype/subscription_plan/subscription_plan.json` |

- **Frappe CRM:** no dedicated contract or subscription screen.
- **Twenty:** no dedicated contract or subscription screen (nearest: custom objects and
  record page layouts).

### Odoo — no community subscription or rental UI

- **Odoo:** `sale_subscription` and `sale_renting` are not in this community
  checkout. The `mysubscription` addon is a stub (models and translations only, no
  views or menus), so there is no subscription screen to reference.

### AureusERP / Akaunting — no agreements

- **AureusERP:** sales cluster stops at quotations/orders/deliveries/invoices; no
  contract resource in `plugins/webkul/sales`.
- **Akaunting:** recurring invoices only; no contract or agreement record.

**BOSS implications.** Moqui Sales already models the core: an `Agreement` with
parties, addresses, payment method, subscriptions and dated items — enough for price
agreements and simple service contracts. What is missing is the *billing and lifecycle*
layer that Carbon and Dolibarr demonstrate: activation/confirmation, a billing schedule
(cycle, advance/arrears, next invoice date), amendments with effective dates, renewal or
open-ended terms, and revenue recognition where the business needs it. ERPNext completes the
picture with two reusable pieces: a contract template plus signature audit (signee,
signed-on, IP) and a subscription plan that binds item, price list and billing interval.
Build service contracts and price agreements on the same agreement record, with a
billing schedule child; treat rentals as a separate mode (units, deposits, lease classification) and do
not pull that complexity into the default Sales app. Keep the agreement-to-order and
agreement-to-invoice links first-class, because the agreement is the source of the
customer's negotiated prices.

## 8. Activities, chatter & next actions

### Odoo — chatter plus scheduled activities on every record

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chatter | Message thread, attachments and followers on leads, opportunities, quotations and orders; log note, send message, schedule activity | `mail/` (models `mail.thread`, `mail.activity`), `mail/views/mail_activity_views.xml` |
| Schedule activity | Modal per record: activity type (call, email, meeting, to-do), due date, summary, assignment to a user; appears in the assignee's activity list | `mail/views/mail_activity_views.xml`, `crm/views/mail_activity_views.xml` |
| My Activities | Cross-record list of activities assigned to the current user, with overdue colouring; also an "Activities" report | `crm/views/crm_lead_views.xml` (`crm_lead_action_my_activities`, `crm_lead_action_my_activities_view_tree`), `crm_activity_report_action` |
| Activity plans | Reusable sequences of activities applied to a record; configured per sales team | `crm/views/mail_activity_plan_views.xml`, `crm/views/crm_menu_views.xml` (`Activity Plans`) |
| Activity calendar | Calendar view over opportunities/leads and their scheduled activities | `crm/views/calendar_views.xml`, `crm_lead_view_activity`, `crm/static/src/views/crm_calendar/` |
| Email and SMS | Compose/mass-mail actions and SMS on leads; messages are threaded on the record | `crm/views/crm_lead_views.xml` (`action_lead_mail_compose`, `action_lead_mass_mail`), `crm_sms/` |

### Frappe CRM — typed activity feed and standalone task/note/call lists

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Activities | Unified feed with email, comment, call, task, note, attachment and WhatsApp composers | `frontend/src/components/Activities/Activities.vue`, `frontend/src/components/Activities/ActivityHeader.vue` |
| Tasks | List/kanban tasks with inline creation and record linking | `frontend/src/pages/Tasks.vue`, `frontend/src/components/ListViews/TasksListView.vue` |
| Notes | Card grid of notes with editor and record links | `frontend/src/pages/Notes.vue`, `frontend/src/components/Activities/NoteArea.vue` |
| Call logs | Call history list, detail modal and telephony call UI | `frontend/src/pages/CallLogs.vue`, `frontend/src/components/Modals/CallLogDetailModal.vue`, `frontend/src/components/Telephony/CallUI.vue` |

### ERPNext — notes and appointment booking

| Screen/page | What it is | Key files |
| --- | --- | --- |
| CRM Note | Standalone timestamped note with author | `erpnext/crm/doctype/crm_note/crm_note.json` |
| Appointment | Booked meeting with lead/customer plus a public booking page and slots | `erpnext/crm/doctype/appointment/appointment.json`, `erpnext/www/book_appointment/index.js` |
| Frappe Desk activity sidebar | Comments, emails, assignment, attachments, tags and timeline on every form | `frappe/desk/form/activity.py`, `frappe/public/js/frappe/form/sidebar/form_sidebar.js` |

### Twenty — auto timeline and record cards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Timeline | Auto-generated timeline activities plus note, task, email and file widgets on records | `packages/twenty-front/src/modules/activities/timeline-activities`, `packages/twenty-front/src/modules/activities/notes/components/NotesCard.tsx` |
| Record cards and calendar | Task, email and file cards; month/week calendar with drag reschedule | `packages/twenty-front/src/modules/activities/tasks/components/TasksCard.tsx`, `packages/twenty-front/src/modules/activities/files/components/FilesCard.tsx`, `packages/twenty-front/src/modules/object-record/record-calendar/components/RecordCalendar.tsx` |

### Carbon — notes and audit, no activity scheduler

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Opportunity notes | Free-text notes on the opportunity, with document attachments at opportunity and line level | `modules/sales/ui/Opportunity/{OpportunityNotes,OpportunityDocuments,OpportunityLineNotes,OpportunityLineDocuments}.tsx` |
| Quote/order line notes | Per-line internal notes carried with the document line | `modules/sales/ui/Quotes/QuoteLineForm.tsx`, `modules/sales/ui/SalesOrder/SalesOrderLineForm.tsx` |
| Activity feed component | Generic avatar + message + relative-time feed used where an audit trail is shown | `apps/erp/app/components/Activity.tsx`, `AuditLog` component, `ChangelogPanel.tsx` |
| Assignee | A single assignee per RFQ/quote/order (not a scheduled next action) | `modules/sales/ui/Quotes/QuotesTable.tsx` (`assignee`), `components/Assignee.tsx` |

### Dolibarr — agenda, notes and private messaging per record

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Agenda / events | Event card with type, label, start/end, assigned user, status (done/not done), company/contact/project links, reminders and recurrence | `htdocs/comm/action/card.php`, `htdocs/comm/action/index.php`, `htdocs/comm/action/list.php` |
| Event views | Agenda by day/week/month, per user, per type, and report views | `htdocs/comm/action/{index,peruser,pertype,rapport}.php` |
| Record notes | Public and private notes on third parties, contacts, proposals, orders and contracts | `htdocs/{societe,contact,comm/propal,commande,contrat}/note.php` |
| Messaging | Per-record message threads (internal) | `htdocs/{societe,contact,comm/propal,commande,contrat}/messaging.php` |
| Documents | Per-record document storage with generated PDFs | `htdocs/{societe,contact,comm/propal,commande,contrat}/document.php` |

### Moqui Sales — wiki notes and attachments only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Notes subscreen | Each opportunity/order/account defaults to a `Note` subscreen (Wiki page) | `screen/Sales/Opportunity/ViewOpportunity.xml` (`<subscreens default-item="Note">`) |
| Attachments | Wiki attachment upload on opportunities | `ViewOpportunity.xml` (`AttachmentSection`) |
| No activities or chatter | No scheduled next action, reminder, assignment, timeline or message thread anywhere in the component | — |

### AureusERP — shared chatter plugin

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chatter panel | Livewire chatter panel with messages, followers, mentions and attachments, reusable on any resource | `plugins/webkul/chatter/src/Livewire/ChatterPanel.php`, `src/Traits/{HasChatter,HasLogActivity}.php`, `src/Models/{Message,Follower,Attachment}.php` |
| Chatter UI | Filament actions, infolists, pages and widgets that mount the panel | `plugins/webkul/chatter/src/{Actions,Infolists,Pages,Widgets}/` |
| Activity plans | Configurable activity plans/templates used by sales resources | `plugins/webkul/sales/src/Filament/Clusters/Configuration/Resources/ActivityPlanResource.php` |

### metasfresh — comments, inbox and document references

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Comments | Per-record comment component | `frontend/src/components/comments/` |
| Inbox / email | Email inbox and record-linked email view | `frontend/src/containers/InboxAll.js`, `frontend/src/components/{inbox,email}/` |
| Document references | Cross-record reference chain shown on records (order ↔ delivery ↔ invoice) | `frontend/src/components/documentReferences/` |

### Ever Gauzy / Akaunting — no sales activity timeline

- **Ever Gauzy:** deals carry no activity, note or next-action timeline; tasks live in
  the separate Tasks module.
- **Akaunting:** no CRM activities; only invoice/payment history.

**BOSS implications.** The initial design already puts activities and Chatter in the
shared layer: activities roll up into the header "Today" panel, and Chatter is the
Odoo-style message/activity/attachment timeline shared with Comms. This research
confirms the minimum record contract: a message thread with followers, scheduled
activities (type, due date, assignee, summary), a user-level "my activities" queue, and
attachments. Moqui Sales offers only wiki notes and attachments, so the timeline and
activity scheduling are net-new. Keep one activity model on every record type
(opportunity, quote, order, agreement, account) rather than per-app tables, and let the
record expose a compact "next action" field so the pipeline board and Today panel can
show overdue work without opening the record. Frappe CRM and Twenty validate the typed
activity model (email, comment, call, task, note, attachment all rendered through one
feed); ERPNext's appointment record and public booking page are worth adding for field
sales, and telephony/WhatsApp should be optional activity types, not separate screens.

## 9. Reports, targets & commissions

### Odoo — sales analysis pivot, CRM reports and forecast

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales Analysis | Pivot/graph/list over sales-order lines with date, quotation/order, invoice-status filters; group by salesperson, team, customer, country, industry, tags or product | `sale/report/sale_report_views.xml`, `sale/report/sale_report.py` |
| Reporting menu | Sales, Salespersons, Products and Customers report actions over the sales-analysis model | `sale/views/sale_menus.xml` (`menu_reporting_{sales,salespeople,product,customer}`) |
| CRM reports | Forecast, Pipeline, Leads and Activities report actions with kanban/graph/pivot/list views | `crm/views/crm_menu_views.xml`, `crm/views/crm_lead_views.xml` (`crm_opportunity_report_action*`) |
| Forecast | Expected revenue by close date prorated by stage probability (see §1) | `crm_lead_action_forecast`, `crm/static/src/views/forecast_*` |
| No targets or commissions | The community checkout has no sales-target or commission report; only a settings hint about partner commission plans | `crm/views/res_config_settings_views.xml` |

### ERPNext — the fullest target, commission and pipeline report set

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales Analytics | Pivot-style report across orders and quotations by customer, item, territory and period | `erpnext/selling/report/sales_analytics/sales_analytics.json` |
| Order and quotation trends | Sales Order Analysis, Quotation Trends and Lost Quotations | `erpnext/selling/report/sales_order_analysis/sales_order_analysis.json`, `erpnext/selling/report/quotation_trends/quotation_trends.json`, `erpnext/selling/report/lost_quotations/lost_quotations.json` |
| Target variance | Sales Person and Territory target-versus-actual, broken down by item group | `erpnext/selling/report/sales_person_target_variance_based_on_item_group/sales_person_target_variance_based_on_item_group.json`, `erpnext/selling/report/territory_target_variance_based_on_item_group/territory_target_variance_based_on_item_group.json` |
| Commissions | Sales Person and Sales Partner commission summaries | `erpnext/selling/report/sales_person_commission_summary/sales_person_commission_summary.json`, `erpnext/selling/report/sales_partner_commission_summary/sales_partner_commission_summary.json` |
| Customer reports | Acquisition/loyalty, inactive customers, no-transaction customers and credit balance | `erpnext/selling/report/{customer_acquisition_and_loyalty,inactive_customers,customers_without_any_sales_transactions,customer_credit_balance}/` |
| CRM reports | Lead details, conversion time, owner efficiency, first response, lost opportunity, stage summary, pipeline analytics | `erpnext/crm/report/{lead_details,lead_conversion_time,lead_owner_efficiency,first_response_time_for_opportunity,lost_opportunity,opportunity_summary_by_sales_stage,sales_pipeline_analytics}/` |

- **Frappe CRM:** no report set; the CRM Dashboard (§1) is the only analysis surface.

### Frappe Desk — generic query report

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Query report | Script/SQL report runner with filters, charts, column selection and export | `frappe/public/js/frappe/views/reports/query_report.js`, `frappe/desk/reportview.py` |

### Twenty — dashboard widgets only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboards | Graph and record-table widgets; no packaged sales reports or commissions | `packages/twenty-front/src/modules/page-layout/widgets/graph/components/GraphWidget.tsx`, `packages/twenty-front/src/modules/page-layout/widgets/record-table` |

### Carbon — sales KPI dashboard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales dashboard KPIs | Quotes, Sales Funnel, Sales Orders and Sales Revenue with a date range, previous-period comparison and drill-down document list | `apps/erp/app/routes/x+/sales+/_index.tsx`, `api+/sales.kpi.$key.ts` |

### Dolibarr — module statistics and margin analysis

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Module statistics | Dedicated statistics pages for proposals, orders and contracts | `htdocs/comm/propal/stats/index.php`, `htdocs/commande/stats/index.php`, `htdocs/contrat/stats/index.php` |
| Margin area | Margin dashboard with per-sales-rep, per-customer, per-product and per-third-party tabs; refresh/recalculate; margin and mark rates | `htdocs/margin/index.php`, `htdocs/margin/{agentMargins,customerMargins,productMargins}.php`, `htdocs/margin/tabs/{productMargins,thirdpartyMargins}.php` |
| Margin checks | Consistency checks between invoice/cost data | `htdocs/margin/checkMargins.php` |
| Customer recap | Per-customer commercial recap | `htdocs/comm/recap-client.php` |

### metasfresh — sales statistics and commission calculation

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales statistics window | Dedicated statistics window over sales facts | backend window data `backend/de.metas.fresh/.../5787570_sys_gh27873_Sales_Statistics_Window.sql` (`AD_Window_ID=542070`) |
| Commission calculation | Database process calculating commissions | `backend/de.metas.fresh/.../5748230_sys_gh20195_Commission_Calculation_Process.sql` |

### Ever Gauzy — generic reports

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Reports | Time, expense, payment and project/client-budget report pages; no sales-specific pipeline, target or commission pages | `apps/gauzy/src/app/pages/reports/` |

### Akaunting — financial reports only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Reports | Profit/loss and tax-summary reports plus report classes; no sales-pipeline or commission reporting | `resources/views/reports/{profit_loss,tax_summary}/`, `app/Reports/` |

### Moqui Sales — none

- **Moqui Sales:** no dashboard, report, target or commission screen in the component.

**BOSS implications.** Separate three things that references blur together: operational
counters (Carbon/ERPNext number cards), analytical reports (Odoo/ERPNext pivot and
saved reports), and targets/commissions (ERPNext only). Targets and commission rates
belong on salesperson, team and territory records, with variance reported by item group
and period; commission summaries should be generated from orders/invoices, not typed.
Dolibarr's margin-by-rep/customer/product view is the useful profitability companion.
Because Moqui has no reporting layer in Sales, BOSS should build reports on a generic
query/pivot surface (Frappe Desk's query report + Twenty's dashboard widgets) and save
them as views, rather than hard-coding each report screen.

## 10. Configuration & admin

### Odoo — separate CRM and Sales configuration menus

| Screen/page | What it is | Key files |
| --- | --- | --- |
| CRM Configuration menu | Settings, Opportunities, Sales Teams, Team Members, Activities (types, plans), Recurring Plans, Pipeline (Stages, Tags, Lost Reasons), Import & Synchronize | `crm/views/crm_menu_views.xml` |
| Sales Configuration menu | Settings, Teams, Payments, Sales Orders/Quotations configuration, Templates | `sale/views/sale_menus.xml`, `sale_management/views/sale_management_menus.xml` |
| Stage editor | Name, sequence, fold-by-default, requirements; stage order drives the kanban | `crm/views/crm_stage_views.xml` |
| Sales team | Team form with team leader, members, active/sequence, email alias/assignment domain and a team-level pipeline | `crm/views/crm_team_views.xml`, `sales_team/views/crm_team_views.xml` |
| Team member assignment | "Only assign if" and "Give priority if" domains per member; lead-assignment page | `crm/views/crm_team_member_views.xml` (`Lead Assignment` page) |
| Lost reasons, tags, recurring plans | Master lists used on opportunities | `crm/views/{crm_lost_reason_views,crm_recurring_plan_views}.xml`, `sales_team/views/crm_tag_views.xml` |
| Sales settings | Pricelist configuration, quotation validity days, online signature/payment, sale warnings, PDF quote builder, discount lines, proforma, invoicing policy, partner commission | `sale/wizard/res_config_settings_views.xml` (`quotation_validity_days`, `online_signature`, `online_payment`, `order_warnings`, `sale_pdf_quote_builder`, `setting_commission`) |
| CRM settings | Leads (duplicate detection, enrich/mining), predictive lead scoring, partnerships | `crm/views/res_config_settings_views.xml` |

### ERPNext — many master records, one settings page per area

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Selling Settings | Defaults, default price list, required sales order/delivery note, editable rates, zero-quantity and discount-accounting rules | `erpnext/selling/doctype/selling_settings/selling_settings.json` |
| CRM Settings | Lead duplication, auto-contact creation, opportunity auto-close and Frappe CRM sync | `erpnext/crm/doctype/crm_settings/crm_settings.json` |
| Sales Team | Child table of sales people with allocated contribution on quotes and orders | `erpnext/selling/doctype/sales_team/sales_team.json` |
| Sales Person | Tree of sellers with commission rate and targets | `erpnext/setup/doctype/sales_person/sales_person.json` |
| Territory | Tree of regions with manager and targets | `erpnext/setup/doctype/territory/territory.json` |
| Sales Partner | Channel partner with commission rate, territory and targets | `erpnext/setup/doctype/sales_partner/sales_partner.json` |
| Stage/loss/type vocabulary | Sales Stage, Opportunity Lost Reason and Opportunity Type masters | `erpnext/crm/doctype/sales_stage/sales_stage.json`, `erpnext/crm/doctype/lost_reason_detail/lost_reason_detail.json`, `erpnext/crm/doctype/opportunity_type/opportunity_type.json` |
| Pricing masters | Price List, Item Price and Pricing Rule (used on quote/order lines) | `erpnext/stock/doctype/price_list/price_list.json`, `erpnext/stock/doctype/item_price/item_price.json`, `erpnext/accounts/doctype/pricing_rule/pricing_rule.json` |

### Frappe CRM — role-gated settings modal plus master data

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Settings | Role-gated modal: profile/preferences, general/dashboard/defaults/brand, users/hierarchy, email, automation/SLA/forms, telephony/WhatsApp/ERPNext/lead sync | `frontend/src/components/Settings/Settings.vue`, `frontend/src/components/Settings/GeneralSettings.vue`, `frontend/src/components/Settings/Sla/SlaConfig.vue` |
| Deal/lead statuses | Status with colour, probability and position; drives kanban and probability | `crm/fcrm/doctype/crm_deal_status/crm_deal_status.json`, `crm/fcrm/doctype/crm_lead_status/crm_lead_status.json` |
| Lost reasons, territories, sources | Master data used by deals/leads | `crm/fcrm/doctype/crm_lost_reason/crm_lost_reason.json`, `crm/fcrm/doctype/crm_territory/crm_territory.json` |
| Assignment rules | Team/round-robin assignment configuration | `frontend/src/components/Settings/AssignmentRules/AssignmentRules.vue` |
| Data import | Import wizard and history | `frontend/src/pages/{DataImport,DataImports}.vue` |

### Carbon — sales rules engine and small master-data screens

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales rules | Named predicate rules evaluated when an item is added to a quote/order/invoice line: message, severity, surfaces, item type/group filters, condition AST, active flag | `modules/sales/ui/SalesRules/{SalesRuleForm,SalesRulesTable}.tsx`, `modules/sales/sales.models.ts` (`salesRuleValidator`) |
| Rule assignments | Assign rules to item groups/types/customers; acknowledgement allows a gated form to proceed | `modules/sales/ui/SalesRules/{SalesRuleAssignmentsList,SalesRulesGroups}.tsx`, `salesRuleAcknowledgementValidator` |
| Sales settings | Digital quote and RFQ notification groups, sales-rule notification group, default category markups, customer contact requirement, show/hide customer IDs | `apps/erp/app/routes/x+/settings+/sales.tsx` |
| No quote / return reasons | Configurable reason lists | `modules/sales/ui/{NoQuoteReasons,ReturnReasons}/`, routes `x+/sales+/{no-quote,return}-reasons.*` |
| Customer statuses/types | Configurable customer classification | `modules/sales/ui/{CustomerStatuses,CustomerTypes}/` |
| Price lists and pricing rules | Price override and rule maintenance (see §5) | `modules/sales/ui/Pricing/`, routes `x+/sales+/{price-list,pricing-rules}.*` |
| Customer portals | Portal setup per customer (enterprise) | `modules/sales/ui/CustomerPortals/` |

### Twenty — workspace, data model and permissions settings

| Screen/page | What it is | Key files |
| --- | --- | --- |
| General | Workspace-level general preferences | `packages/twenty-front/src/pages/settings/general/SettingsGeneral.tsx` |
| Data model | Object, field, index and validation-rule editors for custom sales objects | `packages/twenty-front/src/pages/settings/data-model/{SettingsObjects,SettingsObjectDetailPage}.tsx` |
| Members and roles | Invite members; role plus object-level permissions | `packages/twenty-front/src/pages/settings/members/SettingsWorkspaceMembers.tsx`, `packages/twenty-front/src/pages/settings/members/roles/SettingsRoleEdit.tsx` |
| Accounts | Connect email/calendar accounts that feed record activities | `packages/twenty-front/src/pages/settings/accounts/SettingsAccounts.tsx` |
| Layout | Navigation, view and page-layout customization | `packages/twenty-front/src/pages/settings/layout/SettingsLayout.tsx` |
| Platform settings | Billing, AI, developer API/webhooks and security | `packages/twenty-front/src/pages/settings/{billing,ai,developers}/` |

### Dolibarr — dictionaries and module setup

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dictionaries | Prospect statuses, sources, payment terms/modes, contract types and other sales vocabularies | `htdocs/admin/dict.php` |
| Proposal setup | Proposal defaults, validity duration, numbering, PDF models, signatures | `htdocs/admin/propal.php`, `htdocs/core/modules/propal/` |
| Company/third-party setup | Customer/prospect codes, price levels, discounts | `htdocs/admin/company.php`, `htdocs/societe/admin/` |
| Delivery setup | Shipping methods and delivery defaults | `htdocs/admin/delivery.php` |

### AureusERP — configuration cluster and settings pages

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Configuration cluster | Activity plans/types, currencies, packaging, product attributes/categories, quotation templates, tags, teams, UOM categories | `plugins/webkul/sales/src/Filament/Clusters/Configuration/Resources/` |
| Sales settings pages | Manage invoice, pricing, products and quotation/order settings | `plugins/webkul/sales/src/Filament/Pages/Settings/{ManageInvoice,ManagePricing,ManageProducts,ManageQuotationAndOrder}.php` |

### metasfresh — metadata administration

- **metasfresh:** no end-user sales-configuration screen in the React WebUI; windows,
  fields, roles and quick-start entries are defined in backend SQL/metadata (e.g.
  `backend/de.metas.fresh/.../5441356_system_trl_en_US_ad_window_role_quickstart.sql`).

### Ever Gauzy — minimal sales configuration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Pipelines and stages | Pipelines and their stages are created/edited inline from the Pipelines module; no separate sales-settings page | `apps/gauzy/src/app/pages/pipelines/{pipeline-form,stage-form}/` |

### Akaunting — company and document settings

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Settings | Company, currencies, taxes, categories, invoice defaults, email templates, localisation, schedule and modules | `resources/views/settings/{company,currencies,taxes,categories,invoice,email-templates,localisation,schedule,modules}/` |

### Moqui Sales — no configuration UI

| Screen/page | What it is | Key files |
| --- | --- | --- |
| SalesAdmin | Only exposes "Manage Parties"; no sales settings | `screen/SalesAdmin.xml` |
| Stages | Seeded in demo data (six stages with sequence/probability); no stage editor | `data/SalesDemoData.xml` |

**BOSS implications.** Configuration is where small-business ERPs diverge most: Odoo
hides CRM settings in a settings page but exposes teams, stages, tags and lost reasons
as separate masters; ERPNext exposes every master; Frappe CRM consolidates everything
into one role-gated modal; Carbon treats sales rules as a small predicate engine with
severity and acknowledgement. BOSS should keep the *UX* consolidated (one Sales
Settings page plus a small master-data section) while keeping pipelines, stages,
teams, targets, territories, lost reasons, price lists and sales rules as first-class
data so per-team variation does not require code. The Carbon sales-rule pattern —
evaluate on line add, message + severity, allow proceed with acknowledgement — is the
right model for discount/price/credit guardrails; do not hard-code those checks into
the quote form.

## 11. Gaps & notables

### Gaps in the reference set

- **No single reference covers the whole Sales app.** Odoo has the best all-round
  patterns (CRM record, pipeline, quotations, orders, pricelists, portal) but its
  community checkout lacks subscriptions, rentals, sales targets and commissions.
  ERPNext has the broadest functional set (leads, opportunities, quotes, orders,
  contracts, subscriptions, targets, commissions, portals) behind a dated Desk UI.
  Frappe CRM and Twenty have the strongest modern CRM record/pipeline UX but **no quote
  or order editor** — Frappe CRM only reads ERPNext quotations.
- **Moqui Sales is alpha, not a reference implementation.** It has the Mantle data model
  and useful find/view screens (saved finds, column selection, export, inline edit
  dialogs), but no quote screen, dashboard, kanban, forecast, activities, reports,
  configuration, fulfillment, invoicing or returns. Several sections are placeholders
  (`QuoteSection`, `RequestSection`) and the order screen is explicitly "alpha" with
  "put buttons here" toolbars.
- **Moqui Sales QVue screens are dead code.** Substantial `.qvue` components exist for
  every find/view screen (e.g. `Order/ViewOrder.qvue`, 118 KB), but the XML screens
  render the QVT path and the QVue `render-mode` blocks are commented out. Do not treat
  the QVue files as evidence of shipped behavior.
- **Carbon's sales module is manufacturing-shaped.** Its best ideas (line costing,
  make/buy methods, BoM/BoP, lead-time, price trace, jobs, rentals) assume discrete
  manufacturing. Customer portals are explicitly enterprise (`.ee.tsx`), sales rules
  carry an upgrade overlay, and many routes are feature-gated.
- **Odoo community gaps.** `sale_subscription` and `sale_renting` are absent;
  `mysubscription` is a stub with models/translations and no views; there are no
  sales-target or commission reports (only partner commission settings).
- **AureusERP is shallow on CRM.** The sales cluster covers quotations, orders,
  deliveries, invoices and customers, but there is no lead/opportunity/campaign or
  contract resource. It is a useful Filament action/relation-manager reference, not a
  CRM feature map.
- **Gauzy's pipeline is minimal.** Pipeline → stage → deal with title/client/probability
  only; no amounts, line items, quotes, orders, activities, targets or commissions.
- **Akaunting is invoice-only.** No leads, opportunities, quotes, orders or contracts;
  useful only for invoice/portal and settings patterns.
- **metasfresh's UI is metadata.** Sales windows, fields and roles live in backend SQL,
  so the React tree shows generic containers rather than named sales screens.

### Notables worth carrying forward

| Pattern | Why it matters | Best reference |
| --- | --- | --- |
| One dataset, switchable views | List/kanban/calendar/pivot/graph over the same records, with saved filters and column choices | Odoo (`crm_lead_views`, `sale_order_views`), Twenty (`RecordIndexPage`) |
| Stage model with sequence, fold and probability | Kanban column order, closed-stage folding and forecast math come from one stage table | Odoo (`crm_stage_views`), Moqui (`SalesOpportunityStage` seed) |
| Explicit lead → opportunity conversion | Preserves source and conversion timestamp; avoids copy-on-convert | Frappe CRM (`ConvertToDealModal.vue`), Odoo (`action_convert_to_opportunity`) |
| Lost reason at the moment of loss | Makes win/loss analysis possible without later cleanup | Odoo, Frappe CRM, ERPNext |
| Quote line grid with optional products and templates | The minimum viable quote editor | Odoo (`sale_order_views`, `sale_order_template_views`) |
| Price provenance ("how this price was calculated") | Trust in negotiated pricing; debuggable discounts | Carbon (`PriceTraceModal`, `QuoteLinePriceTraceModal`) |
| Quote revisions + accept/share + PO capture | Matches how B2B quotes actually circulate | Carbon (`QuoteHeader`, `QuoteToOrderDrawer`), ERPNext (revisions) |
| Price lists + customer overrides + quantity breaks | Covers most SMB pricing without a rules engine | Odoo pricelists, ERPNext Item Price/Pricing Rule, Carbon overrides |
| Sales-rule guardrails with severity/acknowledgement | Encodes discount/credit/price floors without hard-coding forms | Carbon (`SalesRules`, `salesRuleValidator`) |
| Per-delivered / per-billed order state | Partial fulfillment and partial invoicing are the norm | ERPNext (`sales_order`, `per_delivered`, `per_billed`) |
| Smart buttons for linked documents | Keeps the record as the hub (invoices, payments, deliveries) | Odoo (`action_view_invoice`, `transaction_count`) |
| Contract template + signature audit | Repeatable agreements with proof of acceptance | ERPNext (`contract`, `contract_template`) |
| Billing/revenue schedules and amendments | Service contracts need dated changes, not edits in place | Carbon (`ContractAmendments`, `ContractRevenueGrid`) |
| Agreement items with from/thru dates | Price agreements and simple subscriptions without a new document | Moqui Sales (`AgreementItemForm`) |
| Typed activity feed + "my activities" queue | One activity table powers record timelines and the header Today panel | Odoo/Frappe CRM/Twenty |
| Targets and commissions as data | Variance and commission reports need per-person/team/territory rates | ERPNext (`sales_person`, `territory`, `sales_partner`, commission reports) |
| Landing = counters + assigned work, not a chart wall | Reps start from what needs action | Carbon (`/sales` dashboard), ERPNext workspace |
| Customer 360 tabs per role | The same account serves sales, service and accounting | Carbon (`CustomerSidebar`), ERPNext (`customer_dashboard`) |
| Print/PDF formats as data | Quotes/orders need branding and locale variants without code changes | ERPNext print formats, Odoo PDF quote builder |
| Customer portal for quotes/orders | Acceptance, signature and payment without email round-trips | Odoo portal, Carbon digital quote, Akaunting portal |

### Checkout path quirks

- **Moqui Sales:** `screen/Sales/*.xml` is the live QVT path; `.qvue` files are included
  but their render modes are commented out. Data model entities live in Mantle
  (`mantle.sales.opportunity.*`, `mantle.party.agreement.*`), not in this component.
- **Frappe CRM:** the Vue SPA is `frontend/src/`; backend doctypes are under
  `crm/fcrm/doctype/` (not `crm/doctype/`). The quotation tab depends on ERPNext being
  installed; there is no quote editor in the CRM app itself.
- **ERPNext:** selling doctypes live under `erpnext/selling/`, but the Contract and lead
  reports live under `erpnext/crm/`, and Subscription/Pricing Rule under
  `erpnext/accounts/`. Quote-to-order-to-invoice spans three modules.
- **Odoo:** app addons are at `3p_other/odoo/odoo/addons/`, written `odoo/addons/` here. CRM and Sales are
  separate app roots; `sale_crm` supplies the cross-links (opportunity field on orders,
  quotation/order counts on opportunities).
- **Twenty:** standard object definitions are in `packages/twenty-server/.../*.workspace-entity.ts`;
  the front end renders them generically, so there are no sales-specific page files.
- **Carbon:** routes live in `apps/erp/app/routes/x+/...`, UI components in
  `apps/erp/app/modules/sales/ui/...`; enterprise-only files use `.ee.tsx` and upgrade
  overlays.
- **metasfresh:** window/menu definitions are data in `backend/**/migration/*.sql`, so
  code search finds generic containers rather than named sales screens.
- **Akaunting:** the `modules/` directory in the checkout is empty, so add-on sales
  modules are not reviewable here.

**BOSS implications.** The reference set is strongest exactly where Moqui Sales is
weakest: quote editing, pricing provenance, pipeline UX, activity scheduling and
targets/commissions. Build the Sales app around one opportunity/order dataset with
switchable views and saved finds; put pricing behind a resolver that can explain itself;
keep quotes as a lifecycle of the order document rather than a parallel entity; make
activities, targets and sales rules data; and reuse the shared Customer 360 and Order
detail screens rather than cloning them. Everything else in this document is evidence
for those choices.


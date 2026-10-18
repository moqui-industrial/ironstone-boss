# IronStone BOSS — Research cross-cut: conventions, ownership & shared screens

Oct 18, 2026

The research files (`research-*.md`) were first written independently, one per app or
suite area. This file holds what they must agree on: how paths are written, how each file
ends, which app owns each shared screen and each overlapping feature, which Mantle records
back them, and the names used for references and BOSS concepts. When a research file and
this file disagree, this file wins; when a research file argues for a different choice, it
says so under its **Open questions** and the choice is recorded in §8 below.

Inputs: [initial-design.md](initial-design.md) (its **Decided** table is fixed),
[3p-app-reference.md](3p-app-reference.md), [ss-inventory.md](ss-inventory.md),
[usl-inventory.md](usl-inventory.md), and the Mantle entity definitions in
`runtime/component/mr-mantle-udm/entity/`.

Sections: [1 paths](#1-path-conventions) · [2 file skeleton](#2-research-file-skeleton) ·
[3 shared screens](#3-shared-screens) · [4 feature ownership](#4-feature-ownership-for-overlaps) ·
[5 Mantle basis](#5-mantle-basis-for-recurring-records) · [6 names](#6-names-and-terms) ·
[7 reference coverage](#7-reference-coverage-by-app) · [8 open questions](#8-open-questions)

---

## 1. Path conventions

**Rule.** Every backticked path in a research file resolves against the **Checkout** given
for its prefix in that file's path-conventions table. Each file's table must therefore use
the checkout and path start below. Paths inside a table row may be shortened to a tail
(`views/maintenance_views.xml`) only when the same cell or the row's first cell already
names the full directory. A shorthand prefix (for example `tf/` for
`packages/twenty-front/src`) must be defined in the file before first use. Placeholders use
angle brackets (`<addon>`); route parameters (`$id`) and React Router folders (`x+/`) are
literal parts of Carbon paths, not placeholders.

All checkouts are under `/home/jonesde/work/moquiwork/` (written `3p_other/…`, `3p_moqui/…`
and `mr-moqui-base/…` below).

| Prefix | Checkout | Paths start with |
| --- | --- | --- |
| **Odoo** | `3p_other/odoo` (bundle: `odoo/` repo + `industry/` repo) | `odoo/addons/<addon>/…` for apps; `odoo/odoo/addons/{base,…}/` for the core framework addons; `industry/<package>/` for verticals |
| **ERPNext** | `3p_other/frappe/erpnext` | `erpnext/<module>/…` (e.g. `erpnext/stock/doctype/item/`) |
| **Frappe framework** (desk) | `3p_other/frappe/frappe` | `frappe/<area>/…` (e.g. `frappe/desk/`, `frappe/public/js/`) |
| **Frappe CRM** | `3p_other/frappe/crm` | `frontend/src/…`, backend `crm/fcrm/doctype/…` |
| **Frappe Helpdesk** | `3p_other/frappe/helpdesk` | `desk/src/…`, backend `helpdesk/helpdesk/doctype/…` |
| **Frappe HR** (hrms) | `3p_other/frappe/hrms` | `hrms/<area>/doctype/…`, PWA `frontend/src/…`, roster `roster/src/…` |
| **Frappe Insights** | `3p_other/frappe/insights` | `frontend/src2/…`, backend `insights/insights/…` |
| **Frappe LMS / Wiki / Gameplan** | `3p_other/frappe/{lms,wiki,gameplan}` | `frontend/src/…`, backend `<app>/<app>/…` |
| **Frappe suite** / **Frappe Central** | `3p_other/frappe/{suite,central}` | `frontend/src/apps/<app>/…` / `dashboard/src/…` |
| **Twenty** | `3p_other/twenty` | `packages/twenty-front/src/…`, `packages/twenty-server/src/…`, `packages/twenty-ui/src/…` |
| **Carbon** | `3p_other/carbon` | `apps/erp/app/{modules,routes}/…`, MES `apps/mes/app/…`, `packages/…` |
| **AureusERP** | `3p_other/aureuserp` | `plugins/webkul/<plugin>/src/Filament/…` |
| **Dolibarr** | `3p_other/dolibarr` | `htdocs/<module>/…` |
| **Dolibarr community modules** | `3p_other/dolibarr-community-modules` | `<module>/…` |
| **metasfresh** | `3p_other/metasfresh` | `frontend/src/…`, `backend/de.metas.<module>/…` |
| **Akaunting** | `3p_other/akaunting` | `resources/views/…`, `app/…` |
| **Ever Gauzy** | `3p_other/ever-co/ever-gauzy` | `apps/gauzy/src/app/pages/…`, `packages/…` |
| **Ever Teams** / **Ever Rec** | `3p_other/ever-co/{ever-teams,ever-rec}` | repo root |
| **Nextcloud** | `3p_other/nextcloud` (bundle of app repos) | `<app>/src/…` (e.g. `calendar/src/`), bundled server apps `server/apps/<app>/…` |
| **Zimbra** | `3p_other/Zimbra` (bundle) | `zm-web-client/WebRoot/js/zimbraMail/…`, `zm-admin-console/WebRoot/js/zimbraAdmin/…`, `zd-full/ZimbraWebClient/…`, `zm-mailbox/…` |
| **Signal** | `3p_other/signalapp` (bundle) | `Signal-Desktop/ts/…`, `Signal-Server/…`, `libsignal/…`, `ringrtc/…` |
| **OpenProject** | `3p_other/openproject` | `app/…`, `modules/<module>/…`, `frontend/src/app/features/…` |
| **Redmine** | `3p_other/redmine` | `app/{views,controllers,models}/…` |
| **Moqui components** (Sales, WorkManagement, WeCreate, coarchy, resistmanagement, ServiceJobMonitor, ridgecrest) | `3p_moqui/<component>` | `screen/…`, `service/…`, `entity/…` |
| **Moqui baseline** | `mr-moqui-base/runtime` | `component/MrSimpleScreens/screen/SimpleScreens/…`, `component/MrMarbleERP/screen/…`, `component/mr-mantle-udm/entity/…`, `component/mr-mantle-usl/service/mantle/…`, `base-component/tools/screen/…`, `base-component/framework/entity/…`, `component/ironstone-boss/screen/…` |

Notes that trip people up:

- Odoo app addons are at `3p_other/odoo/odoo/addons/<addon>`, which this convention writes
  as `odoo/addons/<addon>`. Only `base` and the other core addons live one level deeper
  (`odoo/odoo/addons/base`). `odoo/addons/` (bundle-relative) is not the same directory as
  the core `odoo/odoo/addons/`.
- Odoo industry packages are at `3p_other/odoo/industry/`, not under `odoo/`.
- Frappe app repos contain a Python package of the same name, so backend paths repeat the
  name (`helpdesk/helpdesk/…`, `insights/insights/…`), except ERPNext and the framework,
  whose paths above already start inside the repo (`erpnext/…`, `frappe/…`).
- A file that cites several Frappe apps side by side (suite, Gameplan, Wiki, CRM, Insights)
  may use one **Frappe apps** row with checkout `3p_other/frappe` and paths that start with
  the app directory (`suite/frontend/…`). ERPNext and the Frappe framework always use their
  own rows above.
- Nextcloud Assistant is not in the checkout; drawers-commons cites it from the published
  repository and says so.

## 2. Research file skeleton

Front matter (in this order): title `# IronStone BOSS — <App> app research`, date line, a
paragraph naming the app sections from initial-design and the shared-screen faces it feeds,
**Organization**, **Scope**, **Path conventions** (table per §1), a **Not used here** line
naming checked references that ship nothing relevant, and a section nav.

Body: numbered `## N. <functional area>` sections, each with per-reference sub-tables
(`| Screen/page | What it is | Key files |`) and a closing **BOSS implications** paragraph.

Closing sections (the last numbered sections, in this order, with these headings):

| Heading | Contents |
| --- | --- |
| `## N. Cross-app surfaces` | Table `Surface \| <App> face \| Reference evidence`, faces as assigned in §3–§4 of this file |
| `## N+1. Current Moqui baseline (MrSimpleScreens / MarbleERP / Mantle)` | `### Screens`, `### Data model available`, `### Services` tables with verified paths (relative to the Moqui baseline checkout); what exists, what is missing |
| `## N+2. Gaps & BOSS implications` | The sub-sections below, in order |

Sub-sections of **Gaps & BOSS implications**:

1. `### Gaps in the reference set` — what no checkout covers, Enterprise-only or absent features.
2. `### Notable gaps in the Moqui baseline` — what BOSS must add over the baseline.
3. `### What each reference contributes` — table `Reference | Take`.
4. `### Recommended screen inventory (IronStone <App>)` — table `Area | Screens`, marking shared screens as **(shared: owner)**.
5. `### Data-model implications` — reuse of Mantle records (names verified against `mr-mantle-udm`), and new records needed.
6. `### First-release cut` — what ships first, what is deferred.
7. `### Open questions` — including disagreements with this file or initial-design.

`### Checkout path quirks` may follow as a last sub-section. A closing **Bottom line**
paragraph is optional. `research-drawers-commons.md` applies the closing skeleton three
times, once each for **Header & drawers**, **Commons** and **Comms**, as sub-sections of
its Gaps & BOSS implications section.

## 3. Shared screens

One owning app builds and maintains each shared screen; other apps open the same screen
with an app/role context that selects tabs and the allowed action set (initial-design,
"Shared business screens"). The screen identity is in the URL; the action set is in context.

| Shared screen | Owner | Faces in other apps | Mantle basis |
| --- | --- | --- | --- |
| **Contact / party record** | Commons (Contacts) | Every app opens it; Admin adds the user-account face; People adds the employee face | `Party`, `Person`/`Organization`, `ContactMech`, `PartyRelationship`, `PartyRole` |
| **Customer 360** | Sales (Accounts & contacts) | Customer Service: cases, returns, orders; Marketing: engagement, consent, campaigns; Accounting: balance, credit, aging, statements; Commerce: store account, carts, online orders | `Party` with customer role + `OrderHeader`, `Request`, `ReturnHeader`, `Invoice`, `CommunicationEvent` |
| **Supplier 360** | Purchasing | Accounting: AP balance, bills, payments; Products: supplier prices; Warehouse: inbound receipts | `Party` with supplier role + `ProductPrice` rows with `vendorPartyId` (supplier price, lead time, supplier item id), `OrderHeader` (purchase), `Invoice` |
| **Employee 360** | People | Admin: user account; Projects: allocations, timesheets; Commons: directory card | `Person` + `PartyRelationship` `PrtEmployee` + `Employment`, `EmplPositionParty` |
| **Product 360** | Products | Commerce: merchandising, store categories, SEO; Purchasing: supplier prices, lead times; Manufacturing: BOM, where-used; Warehouse: stock, lots, locations; Accounting: cost history; Sales: price and availability | `Product`, `ProductAssoc`, `ProductPrice`, `ProductParty`, `ProductFacility` |
| **Order detail** (sales and purchase) | Sales (sales orders, quotes); Purchasing (purchase orders) — one screen, two owners of action sets | Customer Service: changes, returns, cases; Warehouse: fulfillment (shipments, pick, ship); Accounting: invoices, payments; Commerce: channel filters on the shared order list | `OrderHeader`, `OrderPart`, `OrderItem` (quotes are `OrderHeader` in `OrderOpen`/`OrderProposed`) |
| **Inventory availability** | Warehouse | Customer Service: read-only availability and promise dates; Purchasing: shortfall and reorder; Sales: inline on quote/order lines; Manufacturing: component availability | `Asset`, `AssetReservation`, `ProductFacility`; one service family `mantle.product.AssetServices.get#AvailableInventory*` |
| **Shipment detail** | Warehouse | Customer Service and Sales: tracking, promise dates; Purchasing: inbound against PO; Accounting: cost and invoice links | `Shipment` (`ShpTp*`), `ShipmentItem`, `ShipmentItemSource`, `ShipmentPackage` |
| **Facility & equipment record** | Maintenance | Warehouse: storage locations and setup; Manufacturing: production equipment and work centers; Commons: schedules and booking; Accounting: fixed-asset books | `Facility`, `FacilityLocation`, `Asset` (`AstTpEquipment`, fixed-asset types) |
| **Request / case** | Customer Service (intake form, queues, SLA) | Commons: requests assigned; Projects: converted work; Purchasing: purchase requests (type `RqtPurchase`); Sales: requests for quote (`RqtQuote`) | `Request`, `RequestItem`, `RequestParty`, `RequestCommEvent`, `RequestWorkEffort` |
| **Task / work item** | Projects | Commons: tasks assigned; Customer Service, Sales: follow-up tasks; People: onboarding checklists | `WorkEffort` (`WetTask`), `WorkEffortParty`, `WorkEffortAssoc` |
| **Calendar & schedules** | Commons | Maintenance: scheduling admin (policies, approvals); Projects: plan views; People: leave and shift views | `WorkEffort` (`WetEvent`), `WorkEffortFacility`, `WorkEffortAssetAssign` |
| **Chatter & activities** | Commons / Comms (one component on every record) | Every app's record screens; activities roll up into the header Today panel | Messages: `CommunicationEvent` with record joins (`OrderCommunicationEvent`, `RequestCommEvent`, `WikiPageCommunicationEvent`, …); activities: `WorkEffort` (`WetTask`, purposes `WepToDo`, `WepPhoneCall`, `WepMeeting`, `WepEmail`) |
| **Approvals waiting** | Header Notifications panel (suite) | People inbox (leave, expenses, timesheets), Purchasing (PO and request approvals), Accounting (bill approval) are filtered faces | Status transitions on the source records; notification topics |
| **Dashboard widgets** (number cards, charts) | Insights (widget types and builder) | Every app's landing page places widgets | New dashboard/widget records over `DataDocument` + saved finds |

## 4. Feature ownership for overlaps

| Feature | Owner | Other faces | Notes |
| --- | --- | --- | --- |
| Customer returns / RMA | Customer Service (authorization, reasons, case link) | Warehouse: return receipt and disposition (`ShpTpSalesReturn`); Accounting: credit/refund (`ReturnItemBilling`) | Mantle already has the RMA record: `ReturnHeader`/`ReturnItem` with statuses Requested → Approved → Shipped → Received → Completed |
| Supplier returns | Purchasing | Warehouse: outbound return shipment (`ShpTpPurchaseReturn`); Accounting: debit note | |
| Price lists & base prices | Products (product prices, costs, price rules) | Sales: customer-specific price agreements; Commerce: per-store prices | `ProductPrice`, `ProductPriceModify`; one price resolver that explains its result |
| Customer agreements & price agreements | Sales | Accounting: terms; Customer Service: read | `Agreement`, `AgreementItem` |
| Subscriptions & recurring contracts | Sales | Accounting: recurring invoicing; Commerce: subscription products in the store | `Subscription`, `ProductSubscriptionResource`, `Agreement` |
| Promotions, coupons, loyalty | Marketing (program screens) | Commerce: store binding and checkout; Sales: manual discounts on quotes | `ProductStorePromotion`, `ProductStorePromoCode`, `OrderPromoCode`; evaluation is in the shared price resolver, not in Marketing |
| Fixed assets | Maintenance (register, lifecycle, custodian) | Accounting: depreciation, capitalization, disposal | Same `Asset` record; `AssetDepreciation` |
| Expense claims | People (capture, approval) | Accounting: posting, tax, payment | Employee-from `Invoice` or payroll reimbursement (`PrphExpenses`) |
| Time entry & timesheets | Projects (entry, approval) | People: attendance, pay; Accounting: billing | `TimeEntry`, `Timesheet`; attendance (clock in/out) is People |
| Booking rooms & equipment | Commons (book, availability) | Maintenance: policies, approvals, blackout windows | Decided in initial-design |
| Knowledge base articles | Commons (wiki authoring) | Customer Service: search, suggest, link to case, suggest edit | `WikiPage`, `WikiPageRequest` |
| Surveys & forms | Marketing (builder, responses) | Customer Service: CSAT; People: interview scorecards, training quizzes | Framework `DbForm` + `FormResponse` (SimpleScreens `Survey/`) |
| Quality inspection | Warehouse (inspection record, templates, receiving and returns inspection) | Manufacturing: in-process and final inspection gates; Purchasing: supplier quality score | No Mantle entity yet |
| Supplier invoices & 3-way match | Accounting (AP bills) | Purchasing: match exceptions and holds against PO/receipt | `Invoice` (purchase) |
| Carriers, ship methods, labels | Warehouse | Commerce: checkout shipping options and rates per store | `CarrierShipmentMethod`, `ShippingGateway*`, `ProductStoreShipOption` |
| Landing pages & KPIs | Each app owns its landing page | Insights: widget types, cross-app dashboards, management digest | |
| Per-app settings | Each app owns its settings section | Admin: settings index linking to them | |
| User accounts, groups, app access | Admin | People and Commons: read face on the party | `UserAccount`, `UserGroup`, `ArtifactGroup` |
| Email/SMS sending | Comms (accounts, sending, tracking, unsubscribe) | Marketing: campaign sends, audiences; Customer Service: case email | `CommunicationEvent`, `EmailMessage`; consent belongs with Comms, not Marketing alone |
| Events & webinars | Commons (calendar event) | Marketing: registration, tickets, communication schedule | |
| Leads & opportunities | Sales | Marketing: lead sources, campaign attribution | `SalesOpportunity`, `MarketingCampaign`, `TrackingCode` |

## 5. Mantle basis for recurring records

Verified against `runtime/component/mr-mantle-udm/entity/` on Oct 18, 2026. Research files
cite these names exactly; a claim that "Mantle has no X" must be checked against this list
and the entity files.

| Concept | Mantle record (entity file) | Notes |
| --- | --- | --- |
| Quote | `OrderHeader` in `OrderOpen` / `OrderProposed` (OrderEntities) | No separate quote entity; `Request` type `RqtQuote` is a request for quote |
| Sales / purchase order | `OrderHeader`, `OrderPart`, `OrderItem` (OrderEntities) | Purchase vs sales is per `OrderPart` (vendor/customer) |
| Return / RMA | `ReturnHeader`, `ReturnItem`, `ReturnItemBilling` (OrderEntities) | Statuses `ReturnRequested`, `ReturnApproved`, `ReturnShipped`, `ReturnReceived`, `ReturnCompleted`, `ReturnManResp`, `ReturnCancelled` |
| Case / request | `Request`, `RequestItem`, `RequestParty`, `RequestCommEvent`, `RequestWorkEffort`, `RequestCategory` (RequestEntities) | Types `RqtSupport`, `RqtInformation`, `RqtBugFix`, `RqtNewFeature`, `RqtPurchase`, `RqtQuote`, `RqtProposal`, `RqtInventory`, `RqtContact` |
| Purchase requirement | `Requirement`, `RequirementOrderItem`, `RequirementRequestItem` (RequestEntities) | Planning output that becomes a PO |
| Task, project, milestone, event | `WorkEffort` with `WetTask`, `WetProject`, `WetMilestone`, `WetEvent`, `WetRelease`, `WetTimeOff` (WorkEffortEntities) | Milestones already exist as a WorkEffort type |
| Work effort purposes | `WepMaintenance`, `WepProductionRun`, `WepRouting`, `WepRoutingTask`, `WepSubcontracting`, `WepAssetUsage`, `WepToDo`, `WepPhoneCall`, `WepMeeting`, `WepEmail`, `WepTraining`, `WepTimesheet`, … | Routing purposes exist in the data model even though no screens use them |
| Assignments and relations | `WorkEffortParty`, `WorkEffortAssoc`, `WorkEffortFacility`, `WorkEffortAssetAssign` | Not `WorkEffortPartyAssignment` |
| Time | `TimeEntry`, `Timesheet`, `TimesheetParty` (WorkEffortEntities) | |
| Budgets | `Budget`, `BudgetItem`, `BudgetRevision`, `BudgetScenario`, … (`mantle.other.budget`, AccountingOtherEntities) | |
| Subscriptions | `Subscription`, `SubscriptionDelivery`, `ProductSubscriptionResource` (ProductDefinitionEntities) | |
| Pricing | `ProductPrice`, `ProductPriceModify`, `ProductStorePromotion`, `ProductStorePromoCode`, `OrderPromoCode` | One `ProductPrice` table carries list, store (`productStoreId`), customer (`customerPartyId`), agreement (`agreementId`) and supplier (`vendorPartyId`, `standardLeadTimeDays`, `otherPartyItemId`) prices; there is no separate supplier-product entity |
| Agreements | `Agreement`, `AgreementItem`, `AgreementTerm`, `AgreementParty`, … (PartyEntities) | |
| Messages | `CommunicationEvent` (+ `Party`, `Content`, `Product`, `Purpose`) (PartyEntities) | Record joins exist per record type (orders, requests, wiki pages) |
| Marketing | `MarketingCampaign`, `ContactList`, `MarketSegment`, `TrackingCode` (MarketingEntities) | |
| Equipment & maintenance | `Asset`, `AssetMaintenance`, `ProductMaintenance`, `AssetMeter` (ProductAssetEntities) | |
| Facilities | `Facility`, `FacilityLocation`, `FacilityParty`, … (FacilityEntities) | |
| HR | `Employment`, `EmplPosition`, `EmplPositionClass`, `EmploymentLeave`, `PerformanceReview`, … (HumanResourcesEntities) | |
| Surveys & forms | `moqui.screen.form.DbForm`, `FormResponse` (framework ScreenEntities) | Not a Mantle entity |
| Wiki & blog | `moqui.resource.wiki.WikiSpace`, `WikiPage`, `WikiBlog` (framework ResourceEntities) | Blog posts exist in the framework wiki |

## 6. Names and terms

**Reference names** (use these, not variants such as "Ever Co (gauzy)" or "Frappe/ERPNext"):
Odoo, ERPNext, Frappe framework, Frappe CRM, Frappe Helpdesk, Frappe HR, Frappe Insights,
Frappe LMS, Frappe Wiki, Gameplan, Frappe suite, Frappe Central, Twenty, Carbon (Carbon MES
for `apps/mes`), AureusERP, Dolibarr, metasfresh, Akaunting, Ever Gauzy, Ever Teams,
Nextcloud (with the app: Nextcloud Calendar, Nextcloud Talk, …), Zimbra (zm-web-client,
zm-admin-console, zd-full), Signal Desktop, OpenProject, Redmine, Moqui Sales, Moqui
WorkManagement, WeCreate, coarchy, resistmanagement, ServiceJobMonitor, ridgecrest, and
**Moqui baseline** for MrSimpleScreens + MrMarbleERP + Mantle + tools together.

**BOSS terms.**

| Term | Meaning |
| --- | --- |
| Case | A Customer Service `Request`; say "ticket" only when quoting a reference |
| Customer 360 / Supplier 360 / Employee 360 / Product 360 / Equipment 360 | The shared record screens in §3; "Party 360" is not used |
| Chatter | The message, activity and attachment timeline beside a record |
| Activity | A scheduled next action (call, email, to-do, meeting) on a record; a `WorkEffort` |
| Today panel | The header panel of tasks due, today's events, activities and overdue items |
| Maintenance work order | A `WorkEffort` with purpose `WepMaintenance` |
| Work order / production run | A Manufacturing production order, a `WorkEffort` with purpose `WepProductionRun` |
| Work item | A Projects task (`WetTask`); Projects uses "work item", Commons uses "task" for the same record |
| Landing page | An app's home screen; "dashboard" means an Insights dashboard |

## 7. Reference coverage by app

Checked-out references most likely to matter for each file, including ones the first pass
under-used. A file's **Not used here** line must name the ones it checked and found empty.

| Research file | Primary references | Also check |
| --- | --- | --- |
| accounting | Odoo, ERPNext, Carbon, Dolibarr, Akaunting, AureusERP | Dolibarr community modules, metasfresh, Frappe `payments`, `lending` |
| admin | Zimbra admin, Nextcloud server settings, Odoo, Frappe framework, Twenty, Carbon, Dolibarr | Frappe Central, ServiceJobMonitor, OpenProject and Redmine admin |
| commerce | Odoo website/website_sale, Dolibarr, ERPNext portal, Ever Gauzy plugins | ridgecrest (Moqui storefront on PopRestStore), Frappe `payments` |
| customer-service | Frappe Helpdesk, ERPNext support, Dolibarr tickets, Carbon RMA, Odoo | Redmine mail handler, Nextcloud Collectives, Frappe Wiki |
| drawers-commons | Nextcloud apps, Zimbra, Frappe suite, Twenty, Ever Gauzy, Signal | Frappe Wiki, Gameplan, OpenProject/Redmine wiki and news |
| insights | Frappe Insights, ERPNext/Frappe workspaces, Odoo, Twenty, Carbon | OpenProject reporting and grids |
| maintenance | Odoo, ERPNext, Carbon, AureusERP, Dolibarr, Ever Gauzy | Nextcloud Calendar resources, Zimbra resources |
| manufacturing | Odoo, ERPNext, Carbon (ERP and MES), AureusERP, Dolibarr, metasfresh | — |
| marketing | Odoo, Frappe framework, ERPNext, Twenty, Dolibarr | Nextcloud Forms, Frappe LMS (events), Moqui baseline wiki blogs |
| people | Frappe HR, Odoo, AureusERP, Ever Gauzy, Dolibarr, Carbon | Frappe LMS (training), OpenProject working times |
| products | Odoo, ERPNext, Carbon, AureusERP, Dolibarr | metasfresh, Ever Gauzy catalog plugin |
| projects | OpenProject, Redmine, Odoo, ERPNext, AureusERP, Dolibarr, Ever Gauzy | Moqui WorkManagement, WeCreate, Gameplan |
| purchasing | Odoo, ERPNext, Carbon, AureusERP, Dolibarr, metasfresh | Akaunting (bills only) |
| sales | Odoo, Frappe CRM, ERPNext, Twenty, Carbon, Moqui Sales | Dolibarr, Ever Gauzy pipeline |
| warehouse | Odoo, ERPNext, Carbon (ERP and MES), AureusERP, Dolibarr, metasfresh | ridgecrest (fulfillment screens) |

**Odoo Enterprise-only, verified absent from the community checkout:** `account_asset`,
`account_reports`, `quality_control`, `stock_barcode`, `helpdesk`, `hr_payroll`,
`hr_appraisal`, `sale_subscription`, `mrp_mps`, `marketing_automation`. Present: `website_sale`
and eight `website_sale_*` addons, `maintenance`, `repair`, `fleet`, `mass_mailing*`, `survey`,
`event*`, `loyalty`.

## 8. Open questions

Cross-file questions that need a design decision. Per-file questions stay in each file.

- **Survey and form builder owner.** initial-design puts Surveys in Marketing, but People
  (scorecards, quizzes) and Customer Service (CSAT) use the same builder. Keep Marketing as
  owner, or move it to Commons beside notes and files?
- **Quality inspection.** Assigned to Warehouse here so that a business without
  Manufacturing still has it. Is a separate quality face (templates, non-conformance,
  corrective action) needed once Manufacturing quality gates exist?
- **Price ownership split.** initial-design gives "Agreements & price lists" to Sales and
  "Pricing & costs" to Products. This file splits it as base prices and rules (Products) vs
  customer agreements (Sales). Confirm, and decide whether customer-specific price lists
  are agreements or price rules.
- **Generic record links for Chatter and activities.** Mantle has per-record join entities
  (`OrderCommunicationEvent`, `RequestCommEvent`, …) but no generic "any record" link.
  Chatter on every record needs either more join entities or a generic link record.
- **Approvals.** Is the suite-wide approvals list a header Notifications face only, or also
  a standalone inbox screen (People research proposes one)?
- **Order detail with two owners.** Sales and Purchasing both own action sets on one Order
  detail screen. Keep one screen, or split sales and purchase order screens that share
  sub-screens?

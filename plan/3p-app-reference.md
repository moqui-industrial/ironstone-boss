# Third-party app reference

High-level reference for the design of IronStone BOSS: what third-party ERP / CRM /
groupware systems are available to review, which apps (modules) each one ships, and
where that app's screens / UI files live in the checkout.

- **Sources.** `../3p_moqui/` (Moqui components others have built) and `../3p_other/`
  (open-source ERP/CRM/etc. systems plus Nextcloud apps).
- **Paths** in every table are relative to that repository's own root (the directory
  named in the section heading). For a repository that bundles several projects
  (Frappe, Nextcloud, Ever Co, Odoo, Zimbra) each bundled project gets its own sub-section.
- **UI location.** Only the top-level screen/UI locations are recorded, not every
  file. Paths were spot-checked; a path lists a directory that contains the app's
  screens/views, or a small set of named files. The research files follow the path
  conventions in [research-crosscut.md](research-crosscut.md) §1.

## Repository index

| Repository | Location | What it is | Stack | License |
| --- | --- | --- | --- | --- |
| Sales | `3p_moqui/Sales` | B2B CRM on Moqui (accounts, contacts, opportunities, orders, agreements) | Moqui XML + QVue | none in checkout |
| WorkManagement | `3p_moqui/WorkManagement` | Projects, tasks and wiki on Moqui | Moqui XML + QVue | none in checkout |
| WeCreate | `3p_moqui/WeCreate` | Creative-collaboration app (talent, projects, messages) | Moqui XML | CC0 + patent grant |
| coarchy | `3p_moqui/coarchy` | Values/process/vision documentation, plus public site | Moqui XML | CC0 + patent grant |
| resistmanagement | `3p_moqui/resistmanagement` | Profiles/talent social management + public site | Moqui XML | CC0 + patent grant |
| ServiceJobMonitor | `3p_moqui/ServiceJobMonitor` | Monitor bounds, alerts and charts over ServiceJob results | Moqui XML | CC0 + patent grant |
| ridgecrest | `3p_moqui/ridgecrest` | Herbal-products ERP + eCommerce site on PopRestStore | Moqui XML + FTL | none in checkout |
| Akaunting | `3p_other/akaunting` | Small-business accounting & invoicing | PHP / Laravel / Blade | Business Source License 1.1 |
| AureusERP | `3p_other/aureuserp` | Modular ERP built on Filament | PHP / Laravel / Filament | MIT |
| Carbon | `3p_other/carbon` | Manufacturing ERP + MES | Rust / React (React Router) | AGPL-3 (+ commercial `ee`) |
| Dolibarr | `3p_other/dolibarr` | ERP/CRM suite | PHP | GPL-3.0 |
| Dolibarr community modules | `3p_other/dolibarr-community-modules` | Add-on modules for Dolibarr | PHP | per module |
| Ever Co | `3p_other/ever-co` | 3 repos: Gauzy ERP/HR, Ever Rec, Ever Teams | TypeScript / Angular / NestJS / Next.js | AGPL-3 |
| Frappe apps | `3p_other/frappe` | 15 Frappe/ERPNext-family apps | Python + Vue | mixed (MIT/GPL-3/AGPL-3) |
| metasfresh | `3p_other/metasfresh` | ERP with React WebUI | Java / Spring + React | GPL-2.0 |
| Nextcloud | `3p_other/nextcloud` | Groupware suite (apps + server core) | PHP + Vue/JS | AGPL-3 |
| Odoo | `3p_other/odoo` | ERP/CRM with 640+ community modules + industry packages | Python + OWL/JS | LGPL-3.0 |
| OpenProject | `3p_other/openproject` | Project management: work packages, Gantt, boards, backlogs, team planner, budgets, costs, wiki, meetings | Ruby on Rails + Angular | GPL-3.0 |
| Redmine | `3p_other/redmine` | Compact project and issue tracker: issues, Gantt/calendar, roadmap, time log, wiki, forums, email intake | Ruby on Rails + ERB | GPL-2.0 |
| Signal | `3p_other/signalapp` | Messaging: Signal-Desktop, -Server, -Android, -iOS, plus `libsignal`, `ringrtc`, `boring` crates | TypeScript / Electron, Java, Rust | AGPL-3.0 (`boring`: Apache-2.0/MIT) |
| Twenty | `3p_other/twenty` | Modern CRM | TypeScript / React / NestJS | AGPL-3 |
| Zimbra | `3p_other/Zimbra` | Email/collaboration suite (6 repos: mailbox, web client, admin console, desktop, OnlyOffice, build) | Java + JS | GPL-2.0 / CPAL 1.0 / GPL-3.0 / AGPL-3.0 |

---

## 3p_moqui — Moqui components

Moqui-native components, closest in shape to IronStone BOSS. Screens are Moqui
`screen/` XML trees; some apps pair a screen with a `.qvue` Vue component.

### Sales

B2B CRM by Xolve Group: accounts, contacts, opportunities, orders and agreements.
**IronStone relevance:** direct reference for IronStone Sales; also the source of the
`Sales`/`SalesAdmin` app-root split used for authz-gated apps.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Sales app root | `screen/Sales.xml`, `screen/Sales/` |
| Accounts | `screen/Sales/Account.xml`, `screen/Sales/Account/` (FindAccount, ViewAccount) |
| Contacts | `screen/Sales/Contact.xml`, `screen/Sales/Contact/` (FindContact, ViewContact) |
| Opportunities | `screen/Sales/Opportunity.xml`, `screen/Sales/Opportunity/` (Find/View) |
| Orders | `screen/Sales/Order.xml`, `screen/Sales/Order/` (FindOrder, ViewOrder) |
| Agreements | `screen/Sales/Agreement.xml`, `screen/Sales/Agreement/` (Find/View) |
| Tasks | `screen/Sales/Task/EditTask.xml` |
| Admin | `screen/SalesAdmin.xml` |
| Client scripts | `screen/Sales/Scripts/` |

### WorkManagement

Project and task management on Moqui, with a wiki/blog module.
**IronStone relevance:** IronStone Projects and Commons tasks; the wiki module informs
Commons knowledge management.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Work app root | `screen/Work.xml`, `screen/wm.xml` |
| Projects | `screen/wm/Project.xml`, `screen/wm/Project/Project.qvue` |
| Tasks | `screen/wm/Task.xml`, `screen/wm/Task/Task.qvue` |
| Wiki / blogs | `screen/wiki/WikiDetail.xml`, `screen/wiki/WikiSpaces.xml`, `screen/wiki/WikiBlogs.xml`, `screen/wiki/` |
| Email templates | `screen/EmailTemplates/` |
| Client scripts | `screen/wm/Scripts/` |

### WeCreate

Creative-collaboration app (talent accounts, projects, messaging), derived from the
resistmanagement codebase; depends on SimpleScreens.
**IronStone relevance:** talent/People and project screens; the internal-vs-static
screen split (`wcinternal` / `wcstatic`) is a useful pattern.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| App root | `screen/wcapp.xml`, `screen/wcinternal.xml` |
| Accounts / talent | `screen/wcinternal/Account.xml`, `screen/wcinternal/Account/` (FindAccount, FindTalent, ViewAccount) |
| Projects | `screen/wcinternal/Project.xml`, `screen/wcinternal/Project/` (FindProject, FindProjectPositions, ViewProject) |
| Messages | `screen/wcinternal/Message.xml`, `screen/wcinternal/Message/` (FindMessage, FindMessageParty) |
| Settings | `screen/wcinternal/Settings.xml`, `screen/wcinternal/Settings/` |
| Static assets | `screen/wcstatic/`, `screen/includes/` |

### coarchy

Values / process / vision documentation app on Moqui (depends on mantle-usl), with an
internal app, a public site, and a billing/settings area.
**IronStone relevance:** process and vision documentation for Insights/Commons; the
internal + public-site + settings screen layout is a useful multi-face pattern.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| App root | `screen/coarchy/coapp.xml`, `screen/coarchy/cointernal.xml` |
| Processes / value statements / vision | `screen/coarchy/cointernal/` (Process.xml, ValueStatements.xml, Vision.xml) |
| Checklists | `screen/coarchy/cointernal/Checklist.xml`, `FindChecklist.xml` |
| Actors | `screen/coarchy/cointernal/Actor.xml`, `ViewActors.xml` |
| Home | `screen/coarchy/cointernal/Home.xml` |
| Public site | `screen/coarchy-com/c.xml`, `screen/coarchy-com/c/` (Home, Login, SignUp, Organizations, content) |
| Billing / settings | `screen/settings/settings.xml`, `screen/settings/settingsinternal/` (Checkout, BuyPremium, EditOrganization, OrderHistory, TransactionHistory) |
| Email templates | `screen/coarchy/TaskNotificationEmail.xml`, `TaskAssignedNotificationEmail.xml`, `TaskNeedsAssignmentNotificationEmail.xml`, `UserInviteEmail.xml`, `UserInviteResetPasswordEmail.xml` |
| Vue / includes / static | `screen/coarchy/includes/`, `screen/coarchy/costatic/`, `screen/coarchy-com/includes/`, `screen/coarchy-com/cstatic/`, `screen/settings/settingsstatic/` |

### resistmanagement

Profile/talent social-management built on WeCreate, plus a public webroot site and a
profile-type admin dashboard.
**IronStone relevance:** profile and classification admin patterns; talent-type
classification screens.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| App root | `screen/resistmanagement.xml`, `screen/rapps.xml` |
| Public site | `screen/resistmanagement.com.xml`, `screen/resistmanagement.com/` (Login, content, resources, js/images) |
| Profiles | `screen/resistmanagement/DefaultProfilePicture.xml`, `screen/resistmanagement.xml` |
| Admin dashboard | `screen/resistadmin.xml`, `screen/resistadmin/dashboard.xml` |
| Profile / talent types | `screen/resistadmin/dashboard/ProfileType.xml`, `screen/resistadmin/dashboard/ProfileType/TalentTypeDetail.xml` |
| Custom overrides | `screen/custom.xml` |

### ServiceJobMonitor

Tailorsoft service monitor: ServiceJob specifications with expected bounds, alerting on
results outside them, and charts over job results.
**IronStone relevance:** IronStone Admin job health and alerting (see research-admin.md §10).

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Admin root | `screen/MonitorAdmin.xml`, `screen/MonitorAdmin/` |
| Monitors, alerts, charts | `screen/MonitorAdmin/{Monitor,Alerts,Charts}.xml`, `screen/MonitorAdmin/{Monitor,Charts}/` |
| Static assets | `screen/sjmstatic.xml`, `screen/sjmstatic/` |

### ridgecrest

RidgeCrest Herbals ERP and eCommerce, built on PopRestStore: a Moqui-native storefront
(FTL pages) plus a small admin for retailers, order import and reports.
**IronStone relevance:** the only Moqui storefront in the checkout, for IronStone Commerce
(cart, checkout, account, blog pages) and order import / retailer screens.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Storefront | `screen/rcherbals.xml`, `screen/rcherbals/` (home, details, cart, checkout, account, blog, contact) |
| PopRestStore overlays | `screen/{popdynamic,popstatic,poptemplate}/` |
| Admin | `screen/rcadmin.xml`, `screen/rcadmin/` (dashboard, retailers, reports, OrderFileImporter, InventoryFileImporter, OrderVelocity) |

---

## 3p_other — third-party systems

### Akaunting

Small-business accounting and invoicing (Laravel, Blade views).
**IronStone relevance:** reference UI for IronStone Accounting (banking, invoices,
bills, reports, reconciliation). Note: the `modules/` directory in this checkout is
empty — Akaunting add-on apps are installed at runtime — so the built-in view areas
below are the apps to track.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Banking | `resources/views/banking/` (accounts, reconciliations, recurring_transactions, transactions, transfers) |
| Sales | `resources/views/sales/` (customers, invoices, recurring_invoices) |
| Purchases | `resources/views/purchases/` (bills, recurring_bills, vendors) |
| Reports | `resources/views/reports/` (profit_loss, tax_summary), `app/Reports/` |
| Dashboards / widgets | `resources/views/common/dashboards/`, `resources/views/widgets/`, `app/Widgets/` |
| Settings | `resources/views/settings/` (company, currencies, taxes, categories, invoice, email-templates, localisation, schedule, modules) |
| Common | `resources/views/common/` (companies, items, reports, import) |
| Customer portal | `resources/views/portal/` |
| Auth / users | `resources/views/auth/` |
| Installer / wizard | `resources/views/install/`, `resources/views/wizard/` |
| Modals | `resources/views/modals/` |
| Built-in module views | `resources/views/modules/` (home, my, item, api_key, tiles) |
| Controllers (by area) | `app/Http/Controllers/{Banking,Sales,Purchases,Settings,Common,Portal,Modules}/` |

### AureusERP

Modular ERP built on Laravel + Filament by Webkul. Each business area is a plugin under
`plugins/webkul/`; its UI is Filament resources/pages/clusters in `src/Filament/`
(plus occasional Blade in `resources/views/`).
**IronStone relevance:** a broad, modern modular-ERP feature map (sales, purchase,
inventory, manufacturing, accounting, projects, HR, support, website) useful across most
IronStone apps.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Sales | `plugins/webkul/sales/src/Filament/` |
| Purchases | `plugins/webkul/purchases/src/Filament/` |
| Invoices | `plugins/webkul/invoices/src/Filament/` |
| Payments | `plugins/webkul/payments/` |
| Accounting | `plugins/webkul/accounting/src/Filament/` |
| Accounts | `plugins/webkul/accounts/src/Filament/` |
| Inventories | `plugins/webkul/inventories/src/Filament/` |
| Products | `plugins/webkul/products/src/Filament/` |
| Manufacturing | `plugins/webkul/manufacturing/src/Filament/` |
| Maintenance | `plugins/webkul/maintenance/src/Filament/` |
| Projects | `plugins/webkul/projects/src/Filament/` |
| Timesheets | `plugins/webkul/timesheets/src/Filament/` |
| Time off | `plugins/webkul/time-off/src/Filament/` |
| Employees | `plugins/webkul/employees/src/Filament/` |
| Recruitments | `plugins/webkul/recruitments/src/Filament/` |
| Contacts | `plugins/webkul/contacts/src/Filament/`, `plugins/webkul/partners/src/Filament/` |
| Support | `plugins/webkul/support/src/Filament/` |
| Point of sale | `plugins/webkul/point-of-sale/src/Filament/` |
| Website | `plugins/webkul/website/src/Filament/` |
| Blogs | `plugins/webkul/blogs/src/Filament/` |
| Analytics | `plugins/webkul/analytics/` |
| Barcode | `plugins/webkul/barcode/` |
| Chatter | `plugins/webkul/chatter/` |
| Full calendar | `plugins/webkul/full-calendar/` |
| Security | `plugins/webkul/security/` |
| Table views | `plugins/webkul/table-views/` |
| Custom fields | `plugins/webkul/fields/` |
| Plugin manager | `plugins/webkul/plugin-manager/` |

### Carbon

Manufacturing ERP and MES (Rust backend, React Router front end). Monorepo: `apps/` for
deployable apps, `packages/` for shared libraries (incl. `packages/ee/` commercial code).
**IronStone relevance:** Manufacturing / Warehouse / Projects reference, and a modern
module layout for a single suite.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| ERP — Sales | `apps/erp/app/modules/sales/` |
| ERP — Purchasing | `apps/erp/app/modules/purchasing/` |
| ERP — Inventory | `apps/erp/app/modules/inventory/` |
| ERP — Production | `apps/erp/app/modules/production/` |
| ERP — Quality | `apps/erp/app/modules/quality/` |
| ERP — Accounting | `apps/erp/app/modules/accounting/` |
| ERP — Invoicing | `apps/erp/app/modules/invoicing/` |
| ERP — Items | `apps/erp/app/modules/items/` |
| ERP — People | `apps/erp/app/modules/people/` |
| ERP — Documents | `apps/erp/app/modules/documents/` |
| ERP — Resources | `apps/erp/app/modules/resources/` |
| ERP — Users | `apps/erp/app/modules/users/` |
| ERP — Settings | `apps/erp/app/modules/settings/` |
| ERP — Workflows | `apps/erp/app/modules/workflows/` |
| ERP — Agent (AI) | `apps/erp/app/modules/agent/` |
| ERP — routes / shell | `apps/erp/app/routes/`, `apps/erp/app/components/` |
| MES (shop floor) | `apps/mes/app/routes/` |
| Academy (training) | `apps/academy/app/routes/` |
| Assembler / Starter | `apps/assembler/`, `apps/starter/` |
| Shared UI packages | `packages/react/`, `packages/form/`, `packages/viewer/`, `packages/documents/`, `packages/planning/` |

### Dolibarr

ERP/CRM suite (PHP). Each business module is a directory under `htdocs/<module>/`
holding that module's PHP pages; descriptors/backends live in `htdocs/core/modules/`.
**IronStone relevance:** a broad, long-lived ERP/CRM module map (sales, purchase,
accounting, HR, projects, manufacturing, website, portal) useful for scoping apps.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Third parties & CRM | `htdocs/societe/`, `htdocs/contact/`, `htdocs/categories/`, `htdocs/comm/`, `htdocs/partnership/` |
| Members & donations | `htdocs/adherents/`, `htdocs/don/` |
| Sales & customer orders | `htdocs/commande/`, `htdocs/compta/facture/`, `htdocs/expedition/`, `htdocs/margin/`, `htdocs/subtotals/`, `htdocs/takepos/` |
| Purchasing | `htdocs/fourn/`, `htdocs/supplier_invoice/`, `htdocs/supplier_order/`, `htdocs/supplier_proposal/`, `htdocs/reception/` |
| Accounting & finance | `htdocs/compta/` (bank, journal, paiement, tva), `htdocs/accountancy/`, `htdocs/tax/`, `htdocs/multicurrency/`, `htdocs/salaries/`, `htdocs/intracommreport/`, `htdocs/loan/` |
| Online payments / integrations | `htdocs/stripe/`, `htdocs/paypal/`, `htdocs/zapier/` |
| Products & inventory | `htdocs/product/` (stock, inventory, price, composition), `htdocs/variants/`, `htdocs/barcode/`, `htdocs/asset/` |
| Manufacturing | `htdocs/mrp/`, `htdocs/bom/`, `htdocs/core/modules/mrp/`, `htdocs/core/modules/workstation/` |
| Projects & services | `htdocs/projet/`, `htdocs/contrat/`, `htdocs/fichinter/`, `htdocs/expensereport/`, `htdocs/eventorganization/` |
| HR | `htdocs/hrm/`, `htdocs/holiday/`, `htdocs/recruitment/`, `htdocs/user/` |
| Website & content | `htdocs/website/`, `htdocs/webportal/`, `htdocs/knowledgemanagement/`, `htdocs/bookcal/`, `htdocs/bookmarks/`, `htdocs/opensurvey/` |
| Collaboration & integrations | `htdocs/collab/`, `htdocs/ecm/`, `htdocs/dav/`, `htdocs/ftp/`, `htdocs/webhook/`, `htdocs/webservices/`, `htdocs/emailcollector/`, `htdocs/mailmanspip/`, `htdocs/quickmemo/`, `htdocs/ai/` |
| Admin & core | `htdocs/admin/`, `htdocs/api/`, `htdocs/conf/`, `htdocs/install/`, `htdocs/custom/`, `htdocs/theme/`, `htdocs/modulebuilder/`, `htdocs/cron/`, `htdocs/printing/`, `htdocs/imports/`, `htdocs/exports/`, `htdocs/datapolicy/`, `htdocs/blockedlog/` |
| Shared core | `htdocs/core/` (module descriptors, class, templates), `htdocs/includes/` (libraries) |

### Dolibarr community modules

A collection of independently maintained Dolibarr add-on modules; each directory is a
full module checkout.
**IronStone relevance:** add-on patterns for e-invoicing, payment gateways and security
hardening.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| dolisecure (security hardening) | `dolisecure/` (admin, core, class) |
| einvoicing (electronic invoicing) | `einvoicing/` (document_list/card, einvoice_tracking, xmlpreview) |
| helloasso | `helloasso/` |
| ksef (Polish e-invoicing, metadata only) | `ksef/` |
| stancer (payment gateway) | `stancer/` (payments/payouts/refunds/disputes lists) |
| dev (build tooling) | `dev/` |

### Ever Co

Three AGPL-3 TypeScript repositories aimed at ERP/HR, recording, and teams/chat.
**IronStone relevance:** Gauzy informs People/Projects/Accounting; Ever Teams informs
Comms (chat, meet, boards); Ever Rec is a media/recording reference.

#### ever-gauzy — ERP / HRM / timesheets

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Dashboard | `apps/gauzy/src/app/pages/dashboard/` |
| Sales / CRM (pipelines, contacts) | `apps/gauzy/src/app/pages/pipelines/`, `apps/gauzy/src/app/pages/contacts/` |
| Accounting | `apps/gauzy/src/app/pages/accounting-templates/`, `income/`, `expenses/`, `expense-recurring/`, `recurring-expense-employee/`, `invoices/`, `payments/` |
| HR | `apps/gauzy/src/app/pages/employees/`, `employee-levels/`, `employment-types/`, `departments/`, `positions/`, `candidates/`, `approvals/`, `approval-policy/`, `time-off/` |
| Projects & tasks | `apps/gauzy/src/app/pages/projects/`, `tasks/`, `goals/`, `goal-settings/`, `teams/` |
| Inventory & equipment | `apps/gauzy/src/app/pages/inventory/`, `equipment/`, `equipment-sharing/`, `equipment-sharing-policy/` |
| Organizations & users | `apps/gauzy/src/app/pages/organizations/`, `apps/gauzy/src/app/pages/users/` |
| Documents & templates | `apps/gauzy/src/app/pages/documents/`, `email-templates/` |
| Reports | `apps/gauzy/src/app/pages/reports/` |
| Integrations | `apps/gauzy/src/app/pages/integrations/` |
| Settings | `apps/gauzy/src/app/pages/settings/` |
| Help / tags | `apps/gauzy/src/app/pages/help/`, `help-center/`, `tags/` |
| Desktop apps | `apps/desktop/`, `apps/desktop-timer/`, `apps/desktop-activity/` |
| Shared UI | `packages/ui-core/`, `packages/ui-react/`, `packages/desktop-ui-lib/` |

#### ever-teams — team workspace / chat

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Web app routes | `apps/web/app/[locale]/(main)/` (dashboard, projects, task, kanban, board, calendar, meet, reports, team, settings) |
| Auth | `apps/web/app/[locale]/auth/` |
| Shared UI | `packages/ui/`, `packages/toolkit-ui/` |
| Desktop / mobile | `apps/desktop/`, `apps/mobile/` |

#### ever-rec — screen recording / media

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Portal pages | `apps/portal/pages/` (video, media, whiteboard, image, workspace, settings, edit, integration, auth) |
| Desktop / extensions | `apps/desktop/`, `apps/extensions/` |

### Frappe apps

A collection of 15 Frappe / ERPNext-family applications. Most pair a Python backend with
a Vue front end (`frontend/` or a `desk/` app); several are metadata-driven in the Frappe
Desk. Licenses differ per app (noted below).
**IronStone relevance:** ERPNext/Business workspace landing pages; `crm` for IronStone
Sales; `helpdesk` for Customer Service; `hrms` for People; `wiki` and `gameplan` for
Commons knowledge; `suite` for Office/Comms; `insights` for Insights.

| App | What it is / license | Screen / UI files (relative path) |
| --- | --- | --- |
| frappe | Framework (MIT) | `frappe/frappe/desk/`, `frappe/frappe/public/js/`, `frappe/frappe/website/`, `frappe/frappe/public/` |
| erpnext | ERP (GPL-3) | `erpnext/erpnext/<module>/` (accounts, buying, selling, stock, manufacturing, assets, projects, support, maintenance, quality_management, subcontracting, crm, shopping_cart, erpnext_integrations), portal `erpnext/erpnext/www/`, Desk JS `erpnext/erpnext/public/js/` |
| crm | CRM (AGPL-3) | `crm/frontend/src/pages/` (Leads, Deals, Contacts, Organizations, CallLogs, Notes, Tasks, Dashboard), backend `crm/crm/` |
| helpdesk | Support desk (AGPL-3) | `helpdesk/desk/src/`, backend `helpdesk/helpdesk/` |
| hrms | HR & payroll (GPL-3) | `hrms/frontend/src/views/` (attendance, leave, salary_slip, expense_claim, employee_advance), backend `hrms/hrms/` |
| lms | Learning (AGPL-3) | `lms/frontend/src/pages/` (Courses, Batches, Programs, ProgrammingExercises) |
| lending | Loan management (GPL-3) | `lending/lending/` (loan_management, loan_origination, loan_integrations) |
| payments | Payment gateways (MIT) | `payments/payments/` (payment_gateways), `payments/payments/public/` |
| insights | BI / dashboards (AGPL-3) | `insights/frontend/src2/`, backend `insights/insights/` |
| gameplan | Discussions / tasks (AGPL-3) | `gameplan/frontend/src/` (pages, components, AppRail), backend `gameplan/gameplan/` |
| wiki | Wiki / knowledge (MIT) | `wiki/frontend/src/` (pages, components incl. Tiptap), backend `wiki/wiki/` |
| central | SaaS control plane (AGPL-3) | `central/dashboard/src/`, backend `central/central/` |
| suite | Mail/calendar/drive/office (AGPL-3) | `suite/frontend/src/apps/` (mail, calendar, drive, writer, sheets, slides, meet) |
| stalwart | Mail server (Rust) — no end-user UI | server/CLI only (`stalwart/`) |
| frappe-ui | Shared Vue component library | `frappe-ui/` |

### metasfresh

Java/Spring ERP with a React WebUI (GPL-2.0). The backend is ~110 `de.metas.*` modules;
the WebUI in `frontend/src/` is largely metadata-driven — business screens are defined
as windows in the backend modules, while the front end supplies the shell.
**IronStone relevance:** ERP document-window and list/detail UI patterns for Accounting
and Supply Chain.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Dashboard | `frontend/src/containers/Dashboard.js`, `frontend/src/components/dashboard/` |
| Board (kanban) | `frontend/src/containers/Board.js`, `frontend/src/components/board/` |
| Document windows / lists | `frontend/src/containers/DocumentListContainer.js`, `MasterWindowContainer.js`, `frontend/src/components/window/` |
| Inbox (email) | `frontend/src/containers/InboxAll.js`, `frontend/src/components/inbox/` |
| Navigation / shell | `frontend/src/containers/NavigationTree.js`, `frontend/src/containers/App.js` |
| Login | `frontend/src/containers/Login.js`, `frontend/src/components/login/` |
| Widgets | `frontend/src/containers/WidgetWrapper.js`, `frontend/src/components/widget/` |
| Feature areas | `frontend/src/components/` (paymentAllocation, deliveryPlanning, documentReferences, charts, letter, ppOrderCandidate, comments, email) |
| Backend business modules | `backend/de.metas.*` (~110 modules; window/menu definitions and processes) |

### Nextcloud

Groupware suite (AGPL-3): PHP backend + Vue/JS front end. Each app lives in its own
directory with JS/Vue UI in `src/`, server-rendered PHP templates in `templates/`, and
a manifest at `appinfo/info.xml`. This checkout mixes standalone app repos with the
`server/` core (which bundles 34 apps) and a few non-app repos.
**IronStone relevance:** the primary reference for Commons (files, contacts, calendar,
notes, tasks, forms, tables) and Comms (mail, talk, whiteboard, office).

#### Standalone app repositories

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Activity | `activity/src/`, `activity/templates/` |
| Calendar | `calendar/src/`, `calendar/templates/` |
| Collectives | `collectives/src/`, `collectives/templates/` |
| Contacts | `contacts/src/`, `contacts/templates/` |
| Cookbook | `cookbook/src/`, `cookbook/templates/` |
| Deck (kanban) | `deck/src/`, `deck/templates/` |
| End-to-end encryption | `end_to_end_encryption/src/`, `end_to_end_encryption/templates/` |
| External sites | `external/src/`, `external/templates/` |
| Files antivirus | `files_antivirus/src/`, `files_antivirus/templates/` |
| Files email viewer | `files_emailviewer/src/` |
| Forms | `forms/src/`, `forms/templates/` |
| Health | `health/src/`, `health/templates/` |
| Dropbox / Google integrations | `integration_dropbox/src/`, `integration_google/src/` |
| Mail | `mail/src/`, `mail/templates/` |
| Notes | `notes/src/`, `notes/templates/` |
| Office | `office/src/`, `office/templates/` |
| Photos | `photos/src/`, `photos/templates/` |
| Privacy | `privacy/src/`, `privacy/templates/` |
| Richdocuments (Collabora) | `richdocuments/src/`, `richdocuments/templates/` |
| Talk (spreed) | `spreed/src/`, `spreed/templates/` |
| Tables | `tables/src/`, `tables/templates/` |
| Tasks | `tasks/src/`, `tasks/templates/` |
| Text | `text/src/`, `text/templates/` |
| Viewer | `viewer/src/` |
| Whiteboard | `whiteboard/src/`, `whiteboard/templates/` |

#### Bundled server apps (`server/apps/`)

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Files | `server/apps/files/src/`, `server/apps/files/templates/` |
| DAV (CalDAV/CardDAV/WebDAV) | `server/apps/dav/src/`, `server/apps/dav/templates/` |
| Dashboard | `server/apps/dashboard/src/`, `server/apps/dashboard/templates/` |
| App store | `server/apps/appstore/src/`, `server/apps/appstore/templates/` |
| Settings | `server/apps/settings/src/`, `server/apps/settings/templates/` |
| Theming | `server/apps/theming/src/`, `server/apps/theming/templates/` |
| Sharing / federated sharing | `server/apps/files_sharing/src/`, `server/apps/sharebymail/src/`, `server/apps/sharing/`, `server/apps/federatedfilesharing/src/`, `server/apps/federation/src/` |
| Trash / versions / reminders | `server/apps/files_trashbin/src/`, `server/apps/files_versions/src/`, `server/apps/files_reminders/src/` |
| External storage | `server/apps/files_external/src/`, `server/apps/files_external/templates/` |
| Comments / system tags | `server/apps/comments/src/`, `server/apps/systemtags/src/` |
| Workflow engine | `server/apps/workflowengine/src/`, `server/apps/workflowengine/templates/` |
| User status / profile | `server/apps/user_status/src/`, `server/apps/profile/src/` |
| Auth, LDAP, OAuth2, 2FA | `server/apps/oauth2/`, `server/apps/user_ldap/`, `server/apps/twofactor_backupcodes/` |
| Encryption | `server/apps/encryption/src/`, `server/apps/encryption/templates/` |
| Provisioning / webhooks / federation APIs | `server/apps/provisioning_api/`, `server/apps/webhook_listeners/`, `server/apps/cloud_federation_api/` |
| Update notification / weather / viewer | `server/apps/updatenotification/`, `server/apps/weather_status/`, `server/apps/viewer/` |
| Admin audit / testing | `server/apps/admin_audit/`, `server/apps/testing/` |

#### Non-app repos in this checkout

| Repo | Role |
| --- | --- |
| `server/` | Nextcloud server core (holds the 34 bundled apps above) |
| `desktop/` | Desktop sync client |
| `all-in-one/` | Docker/AIO deployment packaging |
| `documentation/` | Documentation site |
| `calendar-availability-vue`, `cdav-library` | Shared JS libraries |
| `nextcloud-talk-recording`, `talk-desktop` | Talk recording helper and Talk desktop client |
| `talk/` | Empty directory in this checkout (Talk lives in `spreed/`) |

### Odoo

Odoo 18 community (Python + OWL/JS, LGPL-3.0). The core is under `odoo/`; `odoo/addons/`
holds ~642 community modules and `industry/` ~116 vertical packages. Modules are
individual addons; each addon keeps its views in `<addon>/views/` and its web assets in
`<addon>/static/src/`. Because the addon count is large, modules are grouped by
functional area below (with representative module globs).
**IronStone relevance:** the primary UI-pattern source — chatter, activities, switchable
views (list/kanban/calendar/pivot/graph), app launcher and status bar — across Sales,
Comms, Commons and every business app.

| App / Module (area) | Screen / UI files (relative path) |
| --- | --- |
| Core framework / web client | `odoo/odoo/addons/base/`, `odoo/odoo/addons/web/`, `odoo/odoo/` |
| Sales & CRM | `odoo/addons/sale*/views/`, `odoo/addons/crm*/views/`, `odoo/addons/sale*/static/src/` (sale, sale_management, crm, sales_team, product, loyalty) |
| Point of sale | `odoo/addons/point_of_sale/views/`, `odoo/addons/pos_*/views/`, `odoo/addons/pos_*/static/src/` |
| Accounting | `odoo/addons/account*/views/`, `odoo/addons/analytic/views/`, `odoo/addons/payment*/views/` |
| Inventory & purchase (supply chain) | `odoo/addons/stock*/views/`, `odoo/addons/purchase*/views/`, `odoo/addons/barcodes*/views/`, `odoo/addons/product_expiry/` |
| Manufacturing & maintenance | `odoo/addons/mrp*/views/`, `odoo/addons/maintenance/views/`, `odoo/addons/repair/views/` |
| Projects & timesheets | `odoo/addons/project*/views/`, `odoo/addons/hr_timesheet*/views/`, `odoo/addons/sale_timesheet*/views/` |
| Human resources | `odoo/addons/hr*/views/`, `odoo/addons/fleet*/views/`, `odoo/addons/lunch/views/`, `odoo/addons/gamification/views/` |
| Marketing | `odoo/addons/mass_mailing*/views/`, `odoo/addons/marketing_card*/views/`, `odoo/addons/event*/views/`, `odoo/addons/survey*/views/`, `odoo/addons/social_media/views/` |
| Website & eCommerce | `odoo/addons/website*/views/`, `odoo/addons/website_sale*/views/`, `odoo/addons/website_slides*/views/`, `odoo/addons/im_livechat/views/` |
| Productivity / discuss | `odoo/addons/mail*/views/`, `odoo/addons/calendar*/views/`, `odoo/addons/board/views/`, `odoo/addons/spreadsheet*/views/`, `odoo/addons/digest/` |
| Administration / auth / technical | `odoo/addons/auth_*/`, `odoo/addons/base_*/`, `odoo/addons/iap*/`, `odoo/addons/iot_*/`, `odoo/addons/web_*/` |
| Localization (account charts, EDI, POS) | `odoo/addons/l10n_*/views/`, `odoo/addons/l10n_*/static/src/` |
| Industry verticals | `industry/<vertical>/` (116 packages, e.g. `agriculture_shop`, `construction`, `hotel`, `restaurant`) |

### OpenProject

Project-management-first application (GPL-3.0): Rails backend with ERB/Primer views and
view components, an Angular front end for work packages, and feature modules.
**IronStone relevance:** primary reference for IronStone Projects (work packages, saved
queries, boards, Gantt, team planner, resource management, budgets, costs, phases); also
admin and wiki patterns.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Projects, portfolios, phases | `app/views/projects/`, `app/components/projects/`, `app/components/portfolios/`, `app/views/project_phases/` |
| Work packages | `frontend/src/app/features/work-packages/`, `app/components/work_packages/`, `app/views/work_packages/` |
| Boards, backlogs, Gantt, calendar, team planner | `modules/{boards,backlogs,gantt,calendar,team_planner}/`, `frontend/src/app/features/{boards,backlogs,calendar,team-planner}/` |
| Time, costs, budgets, reporting | `modules/{costs,budgets,reporting}/` |
| Resource management | `modules/resource_management/` |
| My page, overview grids | `modules/{my_page,overviews,grids}/`, `frontend/src/app/features/{my-page,overview}/` |
| Meetings, wiki, documents, news, forums | `modules/{meeting,wikis,documents}/`, `app/views/{news,forums,wiki}/` |
| Admin, users, roles, workflows | `app/views/admin/`, `app/components/admin/`, `app/views/{users,roles,workflows,custom_fields}/` |

### Redmine

Long-lived, minimal project tracker (GPL-2.0), Rails + ERB.
**IronStone relevance:** compact issue/query UI and email-driven issue intake for IronStone
Projects and Customer Service; non-working dates for People.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Projects, members, settings | `app/views/projects/`, `app/views/members/`, `app/views/settings/` |
| Issues, queries, relations | `app/views/issues/`, `app/views/queries/`, `app/views/issue_relations/` |
| Gantt, calendar, roadmap | `app/views/gantts/`, `app/views/calendars/`, `app/views/versions/` |
| Time log, reports | `app/views/timelog/`, `app/views/reports/` |
| Wiki, forums, news, files | `app/views/{wiki,boards,messages,news,files}/` |
| Email intake | `app/views/mail_handler/`, `app/models/mail_handler.rb` |
| Admin, workflows, custom fields | `app/views/{admin,workflows,custom_fields,trackers,issue_statuses,roles}/` |

### Signal

Signal messaging projects (AGPL-3.0). Signal ships no web client; the desktop app is
Electron/React.
**IronStone relevance:** messaging and calling UX for Comms chat and calls (Signal-Desktop);
candidate Rust crates `libsignal` (protocol) and `ringrtc` (WebRTC calling). Catalogued in
research-drawers-commons.md §6–7.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Desktop UI | `Signal-Desktop/ts/components/`, `Signal-Desktop/ts/state/` |
| Calling | `Signal-Desktop/ts/calling/`, `ringrtc/` |
| Server (no UI) | `Signal-Server/` |
| Protocol crates | `libsignal/rust/`, `boring/` |

### Twenty

Modern CRM (TypeScript monorepo): React front end in `packages/twenty-front`, NestJS
server in `packages/twenty-server`, AGPL-3 (with some restrictions). The CRM is built
from standard objects and a generic record UI; apps/extensions live in
`packages/twenty-apps/`.
**IronStone relevance:** the reference for the modern CRM record and pipeline UI in
IronStone Sales.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Companies | `packages/twenty-front/src/modules/companies/` |
| People | `packages/twenty-front/src/modules/people/` |
| Opportunities (pipeline) | `packages/twenty-front/src/modules/object-record/`, `packages/twenty-front/src/modules/views/` |
| Record pages | `packages/twenty-front/src/pages/object-record/`, `packages/twenty-front/src/pages/object-core/` |
| Notes / tasks / timeline | `packages/twenty-front/src/modules/activities/`, `packages/twenty-front/src/modules/mention/` |
| Dashboards / analytics | `packages/twenty-front/src/modules/dashboards/`, `packages/twenty-front/src/modules/analytics/` |
| Workflows / automation | `packages/twenty-front/src/modules/workflow/` |
| AI agent chat | `packages/twenty-front/src/modules/ai/` |
| Settings / admin | `packages/twenty-front/src/pages/settings/`, `packages/twenty-front/src/modules/settings/` |
| Email / calendar sync | `packages/twenty-front/src/modules/activities/{emails,calendar}/`, account settings `packages/twenty-front/src/modules/settings/accounts/`, server `packages/twenty-server/src/modules/{messaging,calendar}/`; standard objects `message`, `calendarEvent` |
| Apps / extensions | `packages/twenty-apps/public/`, `packages/twenty-apps/examples/` |
| Shared UI | `packages/twenty-ui/`, `packages/twenty-front-component-renderer/` |

### Zimbra

Zimbra Collaboration Suite (FOSS) — email, calendar, contacts, tasks, files and admin —
delivered as several repositories rather than one tree. Licenses differ per repo (noted
below).
**IronStone relevance:** a full reference implementation of Comms (mail, calendar,
contacts, tasks, briefcase/files) and of a separate admin console; `zm-onlyoffice` is a
concrete OnlyOffice document-server deployment relevant to the Office/WOPI decision.

#### zm-web-client — Zimbra Web Client

The standard and advanced (Ajax) web client. App UI is JavaScript under
`WebRoot/js/zimbraMail/<app>/`, page templates under `WebRoot/templates/<app>/`, and
skins under `WebRoot/skins/`. License: CPAL 1.0 (Zimbra).

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Mail | `WebRoot/js/zimbraMail/mail/`, `WebRoot/templates/mail/` |
| Calendar | `WebRoot/js/zimbraMail/calendar/`, `WebRoot/templates/calendar/` |
| Address Book / contacts | `WebRoot/js/zimbraMail/abook/`, `WebRoot/templates/abook/` |
| Tasks | `WebRoot/js/zimbraMail/tasks/`, `WebRoot/templates/tasks/` |
| Briefcase (files) | `WebRoot/js/zimbraMail/briefcase/`, `WebRoot/templates/briefcase/` |
| Preferences | `WebRoot/js/zimbraMail/prefs/`, `WebRoot/templates/prefs/` |
| Portal / mashups | `WebRoot/js/zimbraMail/portal/` |
| Documents / offline / quick command | `WebRoot/js/zimbraMail/docs/`, `WebRoot/js/zimbraMail/offline/`, `WebRoot/js/zimbraMail/quickCommand/` |
| Voice mail | `WebRoot/js/zimbraMail/voicemail/`, `WebRoot/templates/voicemail/` |
| Sharing | `WebRoot/js/zimbraMail/share/`, `WebRoot/templates/share/` |
| Core client / DWT toolkit | `WebRoot/js/zimbraMail/core/`, `WebRoot/js/zimbraMail/package/`, `WebRoot/templates/dwt/` |
| Skins | `WebRoot/skins/` (bare, beach, carbon, harmony, hotrod, lake, …) |
| Rich-text editor | `tiny_mce/` |

#### zm-admin-console — Administration Console

The administrator web console. UI is JavaScript under `WebRoot/js/zimbraAdmin/<area>/`,
with templates and admin skins alongside. License: CPAL 1.0 (Zimbra).

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Accounts | `WebRoot/js/zimbraAdmin/accounts/` |
| Domains | `WebRoot/js/zimbraAdmin/domains/` |
| Class of service | `WebRoot/js/zimbraAdmin/cos/` |
| Servers | `WebRoot/js/zimbraAdmin/servers/` |
| Global config | `WebRoot/js/zimbraAdmin/globalconfig/` |
| MTA | `WebRoot/js/zimbraAdmin/mta/` |
| Distribution lists | `WebRoot/js/zimbraAdmin/dl/` |
| Resources | `WebRoot/js/zimbraAdmin/resource/` |
| Help desk / search | `WebRoot/js/zimbraAdmin/helpdesk/`, `WebRoot/js/zimbraAdmin/search/` |
| Statistics / status | `WebRoot/js/zimbraAdmin/statistics/`, `WebRoot/js/zimbraAdmin/status/` |
| Zimlets / extensions | `WebRoot/js/zimbraAdmin/zimlets/`, `WebRoot/js/zimbraAdmin/adminext/` |
| Common / home / config | `WebRoot/js/zimbraAdmin/common/`, `WebRoot/js/zimbraAdmin/home/`, `WebRoot/js/zimbraAdmin/config/` |
| Templates / skins | `WebRoot/templates/admin/`, `WebRoot/admin_skins/` |

#### zm-mailbox — Server / platform

Core platform code (server, store, SOAP API, native). No end-user app screens; the only
web UI is a handful of servlet pages. License: GPL-2.0 (parts Zimbra Public License).

| Area | Screen / UI files (relative path) |
| --- | --- |
| Document editor servlet | `store/WebRoot/document/editor.jsp` |
| Error / SPNEGO pages | `store/WebRoot/error/`, `store/WebRoot/spnego/` |
| SOAP API | `soap/src/java/com/zimbra/soap/` |
| Store / server | `store/src/java/com/zimbra/` |
| Common / client libraries | `common/src/`, `client/src/` |

#### zd-full — Zimbra Desktop

Legacy cross-platform desktop client (web client + bundled offline store + IM), now
mostly superseded by the web client but useful as a desktop-shell reference.
License: GPL-3.0.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Mail | `ZimbraWebClient/WebRoot/js/zimbraMail/mail/`, `ZimbraWebClient/WebRoot/templates/mail/` |
| Calendar | `ZimbraWebClient/WebRoot/js/zimbraMail/calendar/`, `ZimbraWebClient/WebRoot/templates/calendar/` |
| Address Book | `ZimbraWebClient/WebRoot/js/zimbraMail/abook/`, `ZimbraWebClient/WebRoot/templates/abook/` |
| Tasks / briefcase | `ZimbraWebClient/WebRoot/js/zimbraMail/tasks/`, `ZimbraWebClient/WebRoot/js/zimbraMail/briefcase/` |
| Notebook / slides / spreadsheets | `ZimbraWebClient/WebRoot/js/zimbraMail/notebook/`, `…/slides/`, `…/spreadsheets/` |
| Instant messaging | `ZimbraWebClient/WebRoot/js/zimbraMail/im/`, `ZimbraIM/` |
| Offline shell | `ZimbraOffline/WebRoot/` |
| Portal / zimlets | `ZimbraWebClient/WebRoot/portals/`, `ZimbraWebClient/WebRoot/zimlets/` |

#### zm-onlyoffice — OnlyOffice Document Server

The OnlyOffice document server (Ascensio System) bundled by Zimbra for online document
editing. Server-side components only — the editor UI assets are built/backend-provided
and are not in this checkout. License: AGPL-3.0.

| App / Module | Screen / UI files (relative path) |
| --- | --- |
| Document / co-editing service | `DocService/sources/` (server, `wopiClient.js`, `routes/static.js`) |
| File conversion | `FileConverter/sources/` |
| Spell checker | `SpellChecker/sources/` |
| Shared server code | `Common/sources/` |
| Metrics | `Metrics/` |

#### zm-build — Build tooling

Build scripts and packaging that assemble a FOSS build of the suite; no application UI
(`zm-build/` — `build.pl`, `instructions/`, `RE/`).

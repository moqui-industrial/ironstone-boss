# IronStone BOSS — Accounting app research

Oct 18, 2026

Deeper research pass on the **IronStone Accounting** app (receivables & collections, payables & payment runs, banking & reconciliation, general ledger & period close, tax, budgets, financial reports), cataloguing every relevant screen/page found in the reference apps. Companion to [3p-app-reference.md](3p-app-reference.md); feeds the design of the Accounting row in [initial-design.md](initial-design.md) plus the accounting face of the shared Customer 360 and Order detail screens.

**Organization.** Sorted by functional area (not by app): all invoicing screens together, all banking screens together, etc. Within each area, sub-tables per reference app. Style mirrors [research-drawers-commons.md](research-drawers-commons.md).

**Scope.** Business UI only: screens, dialogs, lists, report pages and their components/engines — the invoice → payment → reconciliation chain a bookkeeper actually uses. Backend posting logic is noted only where it shapes a screen (post/draft states, locks, matching).

**Path conventions.** Paths are relative to each repository's own root, as in 3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Akaunting** | `/home/jonesde/work/moquiwork/3p_other/akaunting` — Blade views in `resources/views/`, controllers in `app/Http/Controllers/`, report classes in `app/Reports/`, widgets in `app/Widgets/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament resources/clusters under `plugins/webkul/<plugin>/src/Filament/` |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — React Router modules under `apps/erp/app/modules/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — module pages under `htdocs/<module>/`; print/document generators under `htdocs/core/modules/` |
| **Dolibarr community modules** | `/home/jonesde/work/moquiwork/3p_other/dolibarr-community-modules` — notably `einvoicing/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — accounting under `erpnext/accounts/` (doctype dirs with `<name>.js`/`<name>.py` + templates), reports under `erpnext/accounts/report/`, plus `erpnext/public/js/` |
| **Ever Gauzy** | `/home/jonesde/work/moquiwork/3p_other/ever-co/ever-gauzy` — paths relative to the monorepo root (`apps/gauzy` + `packages/*`) |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — React WebUI in `frontend/src/` (business windows are metadata-defined in the backend `de.metas.*` modules) |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — paths below use `odoo/addons/<addon>/…`; in this checkout that resolves to `3p_other/odoo/odoo/addons/<addon>/` (each addon's views in `<addon>/views/`, JS in `<addon>/static/src/`) |

Not used here: Twenty, Zimbra, Nextcloud, Signal and the groupware sources from the drawers-commons pass ship no accounting functionality at all, so this pass draws only on the ERP/accounting systems listed above.

Sections: [1 accounting home & dashboards](#1-accounting-home--dashboards) · [2 chart of accounts, journals & fiscal years](#2-chart-of-accounts-journals--fiscal-years) · [3 journal entries & the general ledger](#3-journal-entries--the-general-ledger) · [4 invoices & receivables (AR)](#4-invoices--receivables-ar) · [5 collections & dunning](#5-collections--dunning) · [6 bills & payables (AP)](#6-bills--payables-ap) · [7 payments & payment runs](#7-payments--payment-runs) · [8 banking & reconciliation](#8-banking--reconciliation) · [9 period close & locks](#9-period-close--locks) · [10 tax & e-invoicing compliance](#10-tax--e-invoicing-compliance) · [11 budgets & forecasts](#11-budgets--forecasts) · [12 financial reports & the report engine](#12-financial-reports--the-report-engine) · [13 customer & vendor balance, credit & aging](#13-customer--vendor-balance-credit--aging) · [14 accounting settings & configuration](#14-accounting-settings--configuration) · [15 gaps & notables in the checkout](#15-gaps--notables-in-the-checkout)

---

## 1. Accounting home & dashboards

### Akaunting — a configurable dashboard assembled from widget records

- The home screen is user-configurable: multiple dashboards (create/edit/clone/delete, per-user with search), each a grid of draggable widget cards whose order is persisted (`sort`, `width`, per-widget settings JSON).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboard CRUD & show | List/create/edit/delete, `show.blade.php` renders the widget grid with a SortableJS-style drag ordering and a widget-picker search box; header has dashboard switcher + "New dashboard" | `resources/views/common/dashboards/{index,create,edit,show}.blade.php`, `app/Http/Controllers/Common/Dashboards.php` |
| Widget load & reorder API | `index()` lists widgets+dashboards, `show()` returns one widget's HTML async into a placeholder card, `update()` persists drag order, `getData()` refreshes charts | `app/Http/Controllers/Common/Widgets.php` |
| Finance widget classes & views | 8 finance widgets (CashFlow income-vs-expense line chart, AccountBalance bar chart per bank/cash account, Currencies, Receivables & Payables invoice-status chips + totals, ProfitLoss, ExpensesByCategory, BankFeeds counts); shared chart templates (`line_chart`, `bar_chart`, `donut_chart`) with JS series building | `app/Widgets/{CashFlow,AccountBalance,Currencies,Receivables,Payables,ProfitLoss,ExpensesByCategory,BankFeeds}.php`, `resources/views/widgets/{line_chart,bar_chart,donut_chart,cash_flow,account_balance,currencies,receivables_payables,bank_feeds}.blade.php`, base object `app/Abstracts/Widget.php` |

### AureusERP — Filament "Accounting overview" page

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounting Overview | Filament custom page `accounting/overview` (group "Accounting"), permission-gated via `page_accounting_overview` (Filament Shield), header widgets only | `plugins/webkul/accounting/src/Filament/Pages/Overview.php` |
| Journal charts | "Journal Charts" widget sets render per-journal trend charts; the module's only dashboard widget | `plugins/webkul/accounting/src/Filament/Widgets/JournalChartsWidget.php`, `JournalChartWidget.php` |
| Overview page view | Blade shell that hosts the header widgets | `plugins/webkul/accounting/resources/views/filament/pages/overview.blade.php` |
| Chart-of-accounts entries list | The de-facto landing list for bookkeepers lives under the `accounts` plugin's AccountResource (see §2) | `plugins/webkul/accounts/src/Filament/Resources/AccountResource.php` |

### Carbon — invoicing dashboard + AR/AP "workbench"

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Invoicing dashboard | As-of-date aging totals card (current + 4 buckets + unapplied), metric cards (overdue, received/paid), GL-vs-subledger reconciliation tie-out panel (variance flagged), recent payments table with Receipt/Disbursement status chips; depends on `accountingSetUp` gate | `apps/erp/app/modules/invoicing/ui/Dashboard/InvoicingDashboard.tsx` |
| AR/AP workbench | Pick-based allocation workbench: customer/supplier sections with checkbox line selection, collapse/expand per party, as-of date + currency popover, bulk allocate action; links every line to its document | `apps/erp/app/modules/invoicing/ui/Workbench/ARAPWorkbench.tsx` |
| Accounting submodule registry | The module surface is declared in code: submodule nav + beta feature gating for the whole accounting module (submodules listed in §2–§12) | `apps/erp/app/modules/accounting/ui/useAccountingSubmodules.tsx`, `apps/erp/app/modules/accounting/ui/AccountingBetaGate.tsx` |

### Dolibarr — boxes-based home boards

- No dedicated "accounting dashboard": the global home page is a grid of user-configurable "boxes" (box widgets), several of which are finance widgets; each module also has its own `index.php` summary list.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Home boxes board | Global dashboard: per-user two-column boxes with edit mode (enable/disable/order each box); boxes configured in admin and per-user | `htdocs/index.php`, `htdocs/admin/boxes.php`, registration `htdocs/core/boxes/modules_boxes.php` |
| Customer-invoice box | Latest customer invoices with status/amount paid pills | `htdocs/core/boxes/box_factures.php`, `box_factures_imp.php` |
| Supplier-invoice boxes | Latest supplier invoices (paid / unpaid variants) | `htdocs/core/boxes/box_factures_fourn.php`, `box_factures_fourn_imp.php` |
| Third-party finance boxes | Top customers by turnover, customers with outstanding bill limit reached, invoice disputes | `htdocs/core/boxes/box_goodcustomers.php`, `box_customers_outstanding_bill_reached.php`, `box_invoices_dispute.php` |
| Bank/cash box | Open bank accounts balances | `htdocs/core/boxes/box_comptes.php` |
| Graph boxes | Invoices per month/year (customer & supplier) mini-graphs | `htdocs/core/boxes/box_graph_invoices_permonth.php`, `box_graph_invoices_peryear.php`, `box_graph_invoices_supplier_permonth.php` |
| Accountancy entry boxes | Last manual journal entries + suspense account alert (needs manual matching) | `htdocs/core/boxes/box_accountancy_last_manual_entries.php`, `box_accountancy_suspense_account.php` |

### ERPNext — Desk "Accounting" workspace + configurable dashboards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounting workspace | Sidebar module page: shortcut grid (Sales Invoice, Purchase Invoice, Journal Entry, Payment Entry, Chart of Accounts…), glue links into detailed reports | `erpnext/accounts/workspace/accounting/accounting.json`, plus `financial_reports.json`, `invoicing.json`, `payments.json` in `erpnext/accounts/workspace/` |
| Accounts & payments dashboards | Pre-canned "Account Split by..." dashboards (JSON canvas: number cards + charts) for accounts vs payments | `erpnext/accounts/accounts_dashboard/accounts/accounts.json`, `erpnext/accounts/accounts_dashboard/payments/payments.json` |
| Standard dashboard charts | Data-driven chart sources: AR/AP ageing, bank balance, budget variance, incoming/outgoing bills, P&L | `erpnext/accounts/dashboard_chart/{accounts_receivable_ageing,accounts_payable_ageing,bank_balance,budget_variance,incoming_bills_(purchase_invoice),outgoing_bills_(sales_invoice),profit_and_loss}.json` |
| Number cards | "Total incoming/outgoing bills" & "total incoming/outgoing payment" KPI cards used in workspaces/dashboards | `erpnext/accounts/number_card/{total_incoming_bills,total_incoming_payment,total_outgoing_bills,total_outgoing_payment}.json` |
| Onboarding | Accounting module onboarding steps/checklist records | `erpnext/accounts/module_onboarding/`, `erpnext/accounts/onboarding_step/` |

### Ever Gauzy — org dashboard & custom dashboards (income/expense-centric)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Org dashboard | Organization home: accounting tab + HR tab split; income/expense bar charts w/ selectable date ranges & org/team/project/employee selectors; KPI cards | `apps/gauzy/src/app/pages/dashboard/dashboard.component.ts` (+ `.html`), `pages/dashboard/accounting/accounting.component.ts` |
| Dashboard switcher | Segmented switcher between Accounting / HR dashboards | `apps/gauzy/src/app/pages/dashboard/dashboard-switcher/` |
| Custom dashboards | User-defined dashboards: canvas + tab strip + widget palette + widget-config dialog; widget catalog spans accounting/charts/projects/HR | `apps/gauzy/src/app/pages/dashboard/custom-dashboard/{dashboard-canvas,widget-palette,widget-config-dialog}.component.ts`, shared engine `packages/ui-core/shared/src/lib/dashboard/{widget,widget-host,window-layout}/` |
| Data-entry shortcuts | Quick-add income/expense tiles over the dashboard | `apps/gauzy/src/app/pages/dashboard/data-entry-shortcuts/` |

### metasfresh — generic window + a chart-widget dashboard shell

- The React WebUI is a thin shell; an accounting "dashboard" is a backend-defined window with chart widgets, not dedicated React.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboard widget components | Chart widget host (antd-based), ChartOptions editor, drag-and-drop wrapper, side navigation for dashboard pages | `frontend/src/components/dashboard/{ChartWidget.js,ChartOptions.js,DndWidget.js,DraggableWrapper.js,Sidenav.js,Placeholder.js,EntityType.js}` |
| Generic document window | Every accounting doc (invoices, payments, allocation) renders in this one shell — list container + master window container are the real "screens" | `frontend/src/containers/{DocumentListContainer,MasterWindowContainer}.js`, `frontend/src/components/window/` |

### Odoo — the journals kanban is the accounting home

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Journals kanban dashboard | One card per journal (bank/cash/sale/purchase/general) with type-specific body (bank: to-reconcile/new statement buttons + liquidity graph; sale: to invoice/confirm buttons; general: misc links), KPI strip, sample data state, "fetch e-invoices" actions | `odoo/addons/account/views/account_journal_dashboard_view.xml` |
| Dashboard KPI bar | `account_dashboard_kpis` OWL widget rendering A/R to collect, A/P to pay, customer+vendor totals, bank/cash balances above the kanban with quick-create links | `odoo/addons/account/static/src/components/account_dashboard_kpis/{account_dashboard_kpis.js,account_dashboard_kpis.xml,account_dashboard_kpi_card.xml}`, `odoo/addons/account/views/account_journal_dashboard_view.xml` |
| Journal dashboard JS | OWL kanban controller `account_dashboard_kanban` + per-journal "New" menu logic & graph widget | `odoo/addons/account/static/src/components/account_dashboard_kpis/account_dashboard_kpis.js`, `odoo/addons/account/models/account_journal.py` (dashboard values builder) |

**BOSS implications.** Every reference puts one action-first home in front of the bookkeeper: Akaunting's user-arranged widget board (drag-reorder persisted server-side, async fill-in of widget HTML) is the simplest model to copy on a Moqui XML screen with portlet records; the KPI strip should face money (AR ageing / bank balance / vendor payable) like Odoo's `account_dashboard_kpis` and Carbon's tie-out panel. Home tiles must deep-link straight into the working screens (Odoo journal-card buttons jump to statements/move lists; BOSS should likewise route tiles to the Journal, Invoice and Payment screens), and per-area gating (AureusERP's `page_accounting_overview` shield permission, Carbon's `AccountingBetaGate`) is the pattern for role-locked Accounting tiles inside the shared Customer 360 screens.

---

## 2. Chart of accounts, journals & fiscal years

### Akaunting — **absent**: no double-entry COA, journals or fiscal years

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | Cash-account-based bookkeeping: "chart of accounts" is a flat bank/cash account list, no GL account tree, no journal definitions, no fiscal-year entity in this codebase | bank accounts live in `resources/views/banking/accounts/`, ledger-ish via `resources/views/banking/transactions/` (see §8) |

### AureusERP — Odoo-derived Filament resources for accounts & journals

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chart of accounts | AccountResource list/detail/create/edit (Account model = Odoo `account.account` port: code, account type, group) | `plugins/webkul/accounts/src/Filament/Resources/AccountResource.php` (+ `AccountResource/Pages/`) |
| Account tags | Tagging accounts for filtering/report grouping | `plugins/webkul/accounts/src/Filament/Resources/AccountTagResource.php` |
| Journals | JournalResource CRUD (bank/cash/sale/purchase/general journal types per Odoo model) | `plugins/webkul/accounts/src/Filament/Resources/JournalResource.php` (+ `JournalResource/Pages/`) |
| Fiscal positions | Tax/ledger mapping per country/locale (fiscal position + its tax/ledger mappings); the accounting plugin provides a Configuration-cluster twin | `plugins/webkul/accounts/src/Filament/Resources/FiscalPositionResource.php`, `plugins/webkul/accounting/src/Filament/Clusters/Configuration/Resources/FiscalPositionResource/` |
| Fiscal years | **Absent** — no FiscalYearResource in either plugin (period discipline lives in settings; flag §15) | — |

### Carbon — first-class tree UI for COA + fiscal year & periods

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chart-of-accounts tree | Hierarchical tree table with expand/collapse groups, inline account rows, filters bar; named account/group forms and a "Move account" dialog for re-parenting | `apps/erp/app/modules/accounting/ui/ChartOfAccounts/{ChartOfAccountsTree.tsx,ChartOfAccountsTableFilters.tsx,GroupAccountForm.tsx,MoveAccountForm.tsx,ChartOfAccountForm.tsx}` |
| COA CSV import | Upload → column-mapped import review screen → per-row error report | `apps/erp/app/modules/accounting/ui/ChartOfAccounts/{AccountImportReview.tsx,AccountImportCsvErrors.tsx}`, logic `apps/erp/app/modules/accounting/account-import-csv.ts` |
| Fiscal year & bookkeeping setup | Fiscal-year settings form (year start/end, year-number bookkeeping switch) | `apps/erp/app/modules/accounting/ui/FiscalYear/FiscalYearSettingsForm.tsx`, defaults engine `apps/erp/app/modules/accounting/accounting.defaults.ts` |
| Accounting defaults | Mapping table of posting defaults (receivable/payable inventory/suspense/cash-overage etc.) per company | `apps/erp/app/modules/accounting/ui/AccountDefaults/AccountDefaultsForm.tsx` |
| Supporting masters | Exchange rates, payment terms, cost centers, tracking dimensions, project dimensions — separate submodule UIs under the module registry | `apps/erp/app/modules/accounting/ui/{ExchangeRates,PaymentTerms,CostCenters,Dimensions,Projects}/` |

### Dolibarr — accountancy admin + generated journal pages

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chart-of-accounts admin | Generic data tables (list & card) over `llx_accounting_account` with chart-model choice (`accountmodel.php`), per-country chart activation, account categories CRUD (`categories.php`, `categories_list.php`), short/auxiliary account admin (`subaccount.php`), product→account mapping (`productaccount.php`), journals dictionary list (`journals_list.php`), report-account list config (`report_list.php`), default account mapping per type (`defaultaccounts.php`) | `htdocs/accountancy/admin/{account,accountmodel,card,subaccount,categories,categories_list,productaccount,journals_list,report_list,defaultaccounts}.php`, shared rows `htdocs/accountancy/tpl/` |
| Bundled country charts | Install-time chart data per country (42 `llx_accounting_account_<iso>.sql` files: AD/AT/AU/BE/CA/…) | `htdocs/install/mysql/data/llx_accounting_account_*.sql`, `htdocs/install/mysql/data/llx_accounting_journal.sql` |
| Generated journals | Rendered bookkeeping journals from transferred entries: sells, purchases, bank, treasury, cashsells, expensereports, various — each a summary table with per-entry drill-down + CSV export | `htdocs/accountancy/journal/{sellsjournal,purchasesjournal,bankjournal,treasuryjournal,cashsellsjournal,expensereportsjournal,variousjournal}.php` |
| Fiscal years | Fiscal-year admin list + card + start/end year handling | `htdocs/accountancy/admin/fiscalyear.php`, `fiscalyear_card.php`, `fiscalyear_info.php` |

### ERPNext — doctype-driven masters with tree & importer

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chart of accounts (Account doctype) | Tree-view master (`is_group`, root types: Assets/Liabilities/Income/Expense/Equity), account type & account number fields, per-company currency | `erpnext/accounts/doctype/account/account.{js,json,py}`, tree list `erpnext/accounts/doctype/account/account_list.js` |
| COA importer/builder | Standard chart selection + CSV import + live tree re-parent tool | `erpnext/accounts/doctype/chart_of_accounts_importer/chart_of_accounts_importer.{js,json,py}` |
| Fiscal year & books | Fiscal-year master (auto-year-start/company dates in `fiscal_year_company`), multi-currency finance books (per book GL isolation) | `erpnext/accounts/doctype/fiscal_year/fiscal_year.{js,json,py}`, `fiscal_year/fiscal_year_dashboard.py`, `erpnext/accounts/doctype/finance_book/finance_book.{js,json,py}` |
| Accounting dimensions | Runtime-defined extra dimensions (branch/project/cost center/user-defined), filters + constraint UI | `erpnext/accounts/doctype/accounting_dimension/accounting_dimension.{js,py}`, helpers `accounting_dimension_filter/`, `allowed_dimension/` |
| Cost centers & categories | Cost-center tree with allocation percentages; account_category layer | `erpnext/accounts/doctype/cost_center/cost_center.{js,py}`, `erpnext/accounts/doctype/cost_center_allocation/…`, `erpnext/accounts/doctype/account_category/account_category.{js,json,py}` |
| Period closing prep | Accounting period (posting permissions per doctype) + period closing voucher (§9) | `erpnext/accounts/doctype/accounting_period/accounting_period.{js,py}` |

### Ever Gauzy — **absent** (no GL/COA anywhere)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | Gauzy is income/expense-centric; nearest analogs are expense categories & report categories (see §14), no accounts/journals/fiscal-year entities | — |

### metasfresh — metadata-defined windows (backend owns the UI)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| COA/journal windows | No per-screen React: accounting windows (accounts, accounting schemas, journals) are defined in the backend AD; React renders the generic document window/list shell | `frontend/src/containers/{MasterWindowContainer,DocumentListContainer}.js`, `frontend/src/components/window/`; backend window owners `backend/de.metas.acct.base`, `backend/de.metas.acct.webui` |
| Fiscal calendar | Fiscal calendar/period windows likewise backend-defined (C_Calendar/period control) | `backend/de.metas.acct.base` (+ `de.metas.adempiere.adempiere` core AD model) |

### Odoo — accounts / journals / analytic plans core + l10n chart data

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chart of accounts & tags | Account list/group (code+name+type columns, group tree), account tags, account-type selection widget (`account_type_selection` OWL component) | `odoo/addons/account/views/account_account_views.xml`, `odoo/addons/account/views/account_account_tag_views.xml`, `odoo/addons/account/static/src/components/account_type_selection/` |
| Journals | Journal list/form incl. bank-journal "statement source" (online_sync/manual), currency, sequence properties; journal dashboard see §1 | `odoo/addons/account/views/account_journal_views.xml` |
| Analytic plans/accounts | Analytic plan tree (plans-in-plans), analytic accounts + distribution model ("analytics distribution" widget) | `odoo/addons/analytic/views/{analytic_account_views.xml,analytic_plan_views.xml}`, `odoo/addons/account/views/account_analytic_{account,plan,distribution_model}_views.xml` |
| Fiscal years | **Absent** — no fiscal-year entity in community; discipline replaced by locking dates (tax/lock dates on company) + hard locks (§9) | lock dates: `odoo/addons/account/models/company.py` (`fiscalyear_lock_date` etc.), `odoo/addons/account/views/res_company_views.xml` |
| Country chart templates (pattern) | Each l10n addon ships its COA + tax templates + accounts templates + report/declaration adapters (BE/DE/US verified) | `odoo/addons/l10n_be/data/account*.xml`, `odoo/addons/l10n_de/data/*.xml`, `odoo/addons/l10n_us/data/*.xml` |

**BOSS implications.** Only Carbon and ERPNext treat the chart of accounts as a first-class screens surface (tree + drag re-parent + CSV-import review); that is the UI shape worth copying on a Moqui screen (`AccountChart` tree screen backed by `glAccount` rollups). Fiscal years in this sample are mostly config-ish single screens (Dolibarr fiscalyear card, Carbon one form, ERPNext doctype) — BOSS can do a single FiscalYears screen plus posting-period form (noted §9). Journal definitions dictionary (Dolibarr's `journals_list`/accountancy journal pages, Odoo journal form with statement source) should become BOSS `AcctgJournal` maintenance; the per-country bundled chart (Dolibarr SQL data, Odoo l10n_*) maps to seeding BOSS built-in charts, and account categories (Dolibarr) / account tags (AureusERP, Odoo) suggest a lightweight tag layer over accounts for report grouping. Akaunting and gauzy prove you can ship a finance app without exposing GL/COA at all — BOSS's Accounting app must expose it, and posting defaults (Carbon's AccountDefaults) are what keep bookkeepers from hand-picking accounts per entry.

---

## 3. Journal entries & the general ledger

### Akaunting — **absent** (no journals/manual entries)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No journal-entry form nor general-ledger browsing; transactions ledger (§8) is the closest surface | — |

### AureusERP — JournalEntry/JournalItem resources under the accounting cluster

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Journal entries | JournalEntryResource (list w/ status filter, create/edit wizard) + JournalItemResource (per-line list) | `plugins/webkul/accounting/src/Filament/Clusters/Accounting/Resources/JournalEntryResource/JournalEntryResource.php` (+ sub-pages), `…/JournalItemResource/` |
| Ledger by account | "Journal Entries" per journal/account view (lines grouped, running totals) | `plugins/webkul/accounting/src/Filament/Clusters/Accounting/Resources/` (view pages), `plugins/webkul/accounts/src/Filament/Resources/AccountResource.php` (account → entries relation manager) |

### Carbon — draftable entry form + ledger browsing

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Journal entry form | Draft/Posted status model with journal-driven header (journal/date/currency/dimension), line rows with debit/credit cells and a running balance check, attachments; status chip component | `apps/erp/app/modules/accounting/ui/JournalEntries/{JournalEntryForm.tsx,JournalEntryHeader.tsx,JournalLineRow.tsx,JournalEntryStatus.tsx,JournalEntryDocuments.tsx}` |
| Entries table | Filterable table (journal/status/date range) w/ table row expansion into document links | `apps/erp/app/modules/accounting/ui/JournalEntries/JournalEntriesTable.tsx` |
| GL browsing / reports | Reports submodule: trial balance to CSV, per-account ledger, period summaries | `apps/erp/app/modules/accounting/ui/Reports/`, CSV builders `apps/erp/app/modules/accounting/trial-balance-csv.ts` |
| Period discipline ties in | Periods table + "unposted documents in period" popover drives eligibility to post/close | `apps/erp/app/modules/accounting/ui/Periods/{PeriodsTable.tsx,PeriodCloseUnpostedDocumentsPopover.tsx}` |

### Dolibarr — MCAT bookkeeping ledger + manual-entry back doors

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bookkeeping (MCAT) ledger | Flat ledger of manual/transfered entries: list, list-by-account, account balance over ledger lines, card (multi-line entry with journal selection), CSV import/export | `htdocs/accountancy/bookkeeping/{list.php,listbyaccount.php,balance.php,card.php,export.php}`, shared templates `htdocs/accountancy/tpl/` |
| Various payments | Manual cash disbursement/receipt entries that auto-generate ledger lines on transfer | `htdocs/compta/bank/various_payment/{card,list}.php` |
| Bank entries list | The general bank journal linear browser with inline edit & transfer-to-bookkeeping action | `htdocs/compta/bank/bankentries_list.php` |
| Accounting recap | "Compta recap" summary of movement per journal | `htdocs/compta/recap-compta.php` |

### ERPNext — gl_entry + journal_entry doctype family (posting states, templates, merges)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Journal Entry | Full-featured desk form: entry-type driven (OpenInvoice/Closing/Depreciation/Deferred...), multi-currency rows, `get_outstanding_invoices()` quick rows, submission posts GL at `posting_date` against `accounting_entries` table; list filters by entry type/voucher | `erpnext/accounts/doctype/journal_entry/journal_entry.{js,json,py}`, list js `journal_entry_list.js`, row doctype `erpnext/accounts/doctype/journal_entry_account/` |
| JE templates | Reusable multi-row entry templates (auto-recurring entries) | `erpnext/accounts/doctype/journal_entry_template/journal_entry_template.{js,json,py}` (+ `_account`) |
| GL & ledger entries | Server-side ledger entities shaping every list: gl_entry (value/time-stamped rows, is_cancelled flags), payment_ledger_entry, advance_payment_ledger_entry, ledger merge tool, repost stacks | `erpnext/accounts/doctype/gl_entry/gl_entry.py`, `payment_ledger_entry/`, `ledger_merge/`, `repost_accounting_ledger/`, `repost_payment_ledger/` |
| Closing balances | Per-account-year closing balance snapshot (fast start-of-year totals) | `erpnext/accounts/doctype/account_closing_balance/account_closing_balance.json` |
| Ledger surgery | Bisect ledger rebuild tool + transaction deletion record via Data Deletion | `erpnext/accounts/doctype/bisect_accounting_statements/…`, `transaction_deletion_record_details/` |

### Ever Gauzy — **absent**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No journals/GL; income & expense records only (§4/§6) | — |

### metasfresh — backend windows (accounting schema/fact windows)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| GL via windows | Fact_Acct/period endpoints rendered by the generic window shell; document posting states shown as status labels in the window header (see §9) | `frontend/src/components/window/`, backend owner `backend/de.metas.acct.base`, `de.metas.acct.webui` |

### Odoo — account.move is *the* GL surface (entry==invoice==statement)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Move views (monolith) | All move forms/list/kanban/pivot/graph: invoice form w/ notebook (Invoice Lines, Payment Terms, Other Info), status-wizard header (Draft→Posted→Cancelled), "Journal Items" list w/ `view_account_move_line_filter`, kanban w/ status chips, graph/pivot for invoices (~2.3k lines) | `odoo/addons/account/views/account_move_views.xml` |
| Move form JS/OWL | `account_move_form` OWL form (dynamic notebook), tax autocomplete, `tax_totals` widget, `account_number_widget`, resequence dialog, review-state badge & `account_statusbar_secured` | `odoo/addons/account/static/src/components/account_move_form/`, `…/tax_autocomplete/`, `…/tax_totals/`, `…/account_resequence/`, `…/account_review_state_selection/`, `…/account_statusbar_secured/` |
| Grouped-entries view | "Journal items" grouped list with a special grouped_view_widget rendering account-move sub-rows inside group headers | `odoo/addons/account/static/src/components/grouped_view_widget/{grouped_view_widget.js,grouped_view_widget.xml}` |
| Automatic entries wizard | Change account/amortize/one-time expense (drafts reversed moves) on selected move lines | `odoo/addons/account/wizard/account_automatic_entry_wizard.py` + `_views.xml` |
| Merge & resequence | Merge moves wizard, renumbering (resequence) dialog | `odoo/addons/account/wizard/account_merge_wizard.py`, `odoo/addons/account/wizard/account_resequence.py` |
| Validation & locking helpers | Bulk post/confirm wizard, secure-entries wizard (immutable-lock hash), unreconcile wizard | `odoo/addons/account/wizard/account_validate_account_move.py`, `odoo/addons/account/wizard/account_secure_entries_wizard.py`, `odoo/addons/account/wizard/account_unreconcile_view.xml`, deep-link widgets `odoo/addons/account/static/src/components/open_move_widget/`, `open_move_line_move_widget/` |

**BOSS implications.** The GL in modern references is a *line/entry* surface, not a document list: Dolibarr's bookkeeping list + list-by-account and Odoo's grouped journal-items list are the mechanics a bookkeeper lives in — BOSS needs a Journal Entries table screen that can filter by journal/account/status and jump to lines. Draft→Posted→Locked posting state with a soft "under-locked" handler (Odoo's `account_statusbar_secured` + secure-entries wizard, ERPNext's `repost_*` stack) is the state model for BOSS `AcctgEntry`. Reusable templates (ERPNext JE templates, recurring bill payment wizards) are a big bookkeeping accelerator; and Carbon shows a compact single-screen form including document attachment + dimension selector that maps almost 1:1 onto a Moqui XML form screen.

---

## 4. Invoices & receivables (AR)

### Akaunting — classic document flow + a full customer portal

- One generic "Document" pipeline (invoice/estimate/bill): 3 document-style templates to pick per invoice (`print_default/classic/modern`), and the customer portal (guest, tokenized) for payment/sign.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Invoice list | Search, tab filter chips (all/draft/sent/received/partial/paid/overdue), bulk actions, revenue charts sidebar | `resources/views/sales/invoices/index.blade.php`, controller `app/Http/Controllers/Sales/Invoices.php` |
| Invoice create/edit | Uploads items table w/ tax & discount rows, currency, dates, attachments/recurring/connect knobs; template style selector & note block; same form parts power bills (componentized) | `resources/views/sales/invoices/{create,edit}.blade.php`, shared form components `resources/views/components/documents/{form,show}/` + `resources/views/common/items/` |
| Invoice show & print | Document detail: activity timeline + received payments list, add-payment dialog, 3 print layouts, email/receipt/share modals | `resources/views/sales/invoices/{show,print_default,print_classic,print_modern}.blade.php`, modals `resources/views/modals/{documents,invoices}/` (e.g. `modals/invoices/{email,share}.blade.php`), shared form parts `resources/views/common/documents/` |
| Recurring invoices | "Recurring documents" maintenance list (frequency/interval/limit fields + auto-sent schedule) | `resources/views/sales/recurring_invoices/`, controller `app/Http/Controllers/Sales/RecurringInvoices.php` |
| Customer portal (AR face) | Tokenized guest portal: dashboard of paid/due invoices & totals, invoice preview/show/pay, pay finish page (payment processing), signature/sign page, own payment methods; controllers per page | `resources/views/portal/{dashboard,invoices,payments,profile}/`, `app/Http/Controllers/Portal/{Dashboard,Invoices,Payments}.php` |

### AureusERP — two parallel invoice UIs (classic plugin + Odoo-style accounting plugin)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| AR invoices (classic plugin) | InvoiceResource list/create/edit/view + embedded payments manager; customers cluster also has credit-note and payment resources | `plugins/webkul/invoices/src/Filament/Clusters/Customers/Resources/InvoiceResource/InvoiceResource.php` (+ `Pages/{ListInvoices,CreateInvoice,EditInvoice,ViewInvoice,ManagePayments}.php`), `CreditNoteResource/`, `PaymentResource/` |
| AR invoices (accounts plugin) | Direct Odoo port: `account.move` invoice resources incl `RefundResource` and debit-note style flows (`CreditNoteResource`) | `plugins/webkul/accounts/src/Filament/Resources/{InvoiceResource,CreditNoteResource,RefundResource}.php` (+ `Pages/`) |
| Invoice PDF/print | Blade print templates inside the invoices plugin `resources/views/` | `plugins/webkul/invoices/resources/views/` |

### Carbon — poster-style invoice lifecycle with e-payment integration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| AR invoice form | Full form: header (invoice no., contact, contract, dates, currency & fx), line forms (incl. rental & contract-billed line types w/ shipment links), ShipmentForm for invoice-from-shipment, properties panel, totals summary w/ tax grid | `apps/erp/app/modules/invoicing/ui/SalesInvoice/{SalesInvoiceForm.tsx,SalesInvoiceHeader.tsx,SalesInvoiceLineForm.tsx,SalesInvoiceShipmentForm.tsx,SalesInvoiceSummary.tsx,SalesInvoiceProperties.tsx}`, line-type helpers `useRentalLineTypeLabel.ts`, `RentalInvoiceLineSummary.tsx` |
| Post/void modals | Posting modal (date, journal, fx-rate check → posts GL) and void modal; status chips Draft/Posted/Paid/Voided | `apps/erp/app/modules/invoicing/ui/SalesInvoice/{SalesInvoicePostModal.tsx,SalesInvoiceVoidModal.tsx,SalesInvoiceStatus.tsx}`, table `SalesInvoicesTable.tsx`, explorer `SalesInvoiceExplorer.tsx` |
| Stripe customer panel | Per-invoice Stripe customer panel (id mapping/sync) | `apps/erp/app/modules/invoicing/ui/SalesInvoice/StripeCustomerPanel.tsx`, mapper `apps/erp/app/modules/invoicing/stripe-customer.mapper.ts` |
| Credit memos / debits | Memo doc workbench: form/header/status + "Applications" panel allocating memo balance to invoices | `apps/erp/app/modules/invoicing/ui/Memo/{MemoForm,MemoHeader,MemoStatus,MemoDocuments,MemosTable,MemoApplicationsPanel}.tsx` |
| Charges (re-billables) | Charge doc: status chips + table (re-bill costs to customers, creates AR memo) | `apps/erp/app/modules/invoicing/ui/Charge/{ChargesTable,ChargeStatus}.tsx`, service `apps/erp/app/modules/invoicing/invoicing.service.charge.test.ts` |

### Dolibarr — facture pages with fiche-recurring + generator engine

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customer invoices | List (`list.php`) w/ status filter chips & bulk PDF/email; card (`card.php`) full edit w/ approval buttons (validate/cancel/set paid), credit-note/replace-from, lines & payment records panel | `htdocs/compta/facture/{list,card}.php`, shared row/page components `htdocs/compta/facture/tpl/` |
| Recurring invoices | "Template invoices" list + scheduled generation into drafts | `htdocs/compta/facture/invoicetemplate_list.php` |
| Per-invoice extras | Documents & history pages: `document.php` (attachments), `contact.php`, `info.php` (lifecycle events), `messaging.php` (comment log), `agenda.php` (+ `card-rec.php`/`note-rec.php` for template recurring rec) | `htdocs/compta/facture/{document,contact,info,messaging,agenda,card-rec,note-rec}.php` |
| Standalone credit notes | Direct "Avoir" factures (credit notes) created from invoice card (AVOIR type selects negative lines & credit-note numbering via mercure) | `htdocs/compta/facture/card.php` + numbering `htdocs/core/modules/facture/mod_facture_mercure.php` |
| Document generators | PDF/doc generator classes (Crabe/Mercury etc. — `doc/` subclasses + num-ref mods Mars/Mercury/Terre) | `htdocs/core/modules/facture/mod_facture_{mars,mercure,terre}.php`, `htdocs/core/modules/facture/doc/` |

### ERPNext — Sales Invoice desk capsule with payment-request & e-tools

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales Invoice doctype | Giant client script: quick code paths for non-standard invoices (multi-currency, is_return/credit-note reversed qty), "update stock" toggle, partial payments (`set_total_advance_paid`), fetch-from-SO/purchase-order helpers; server-side ledger income_account/expense_account resolution, POS-flavored subtotal handling | `erpnext/accounts/doctype/sales_invoice/sales_invoice.{js,json,py}` (+ `regional/` overrides), items/payments/taxes child doctypes `sales_invoice_{item,payment,taxes}/` |
| List & dashboard glue | List view script + dashboard charting hook (incoming bills per month) | `doctype/sales_invoice/sales_invoice_list.js` (+ `list_filter/`), `sales_invoice_dashboard.py` |
| Payment request | Send-as-email "Payment Request" w/ payment-gateway link, auto draft PE (also makes `payment_request` QR/PDF inserts) | `erpnext/accounts/doctype/payment_request/payment_request.{js,json,py}` |
| Invoice tooling | Opening-invoice creation tool (migration), merged/mb batch creation; package bulk serial | `erpnext/accounts/doctype/opening_invoice_creation_tool/opening_invoice_creation_tool.{js,py}` (+ `_item`) |
| Dunning prep | Dunning linked from overdue invoices (see §5) | `erpnext/accounts/doctype/dunning/dunning.{js,py}` |

### Ever Gauzy — invoice suite w/ e-payment & email surface

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Invoices module | Table + card/tabbed single-invoice views: add/edit, estimate-linked (`invoice-estimates`), view metadata, received invoices tab | `apps/gauzy/src/app/pages/invoices/{invoices.components.ts,table-components/}`, `pages/invoices/{invoice-add,invoice-edit,invoice-view,invoices-received}/` |
| Send/download/email | Send-invoice dialog & email history step, public-link generator, PDF download flow | `pages/invoices/{invoice-send,invoice-email,invoice-download,public-link}/` |
| Invoice PDF & templates | Invoice print/pdf preview driven by selectable HTML templates; org-level template management page ("accounting templates") | `apps/gauzy/src/app/pages/invoices/invoice-pdf/`, `apps/gauzy/src/app/pages/accounting-templates/accounting-templates.component.ts`, shared module `packages/ui-core/shared/src/lib/invoice/` |
| Payments tab per invoice | Invoice-payments view listing received payments + add-payment dialog (also standalone Payments page) | `pages/invoices/invoice-payments/`, `pages/payments/` |

### metasfresh — AR invoices are backend windows

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Invoice windows | C_Invoice windows rendered by the generic shell; paymentAllocation component is the AR face inside the UI (see §7) | `frontend/src/components/window/`, `frontend/src/components/paymentAllocation/`; window owners `backend/de.metas.adempiere.adempiere` (core C_Invoice window) + `backend/de.metas.fresh` (invoice extensions), gateway bridges `backend/de.metas.invoice_gateway.{api,spi}` |

### Odoo — invoices inside account.move + send/portal surface

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Invoice/bill views | Moves lists/kanban of type out_invoice/in_invoice in `account_move_views.xml` (§3) with special filters & batch actions; tax grid `account_document_tax_mode_selector` | `odoo/addons/account/views/account_move_views.xml`, `odoo/addons/account/static/src/components/account_document_tax_mode_selector/` |
| Send by email | `account_move_send` wizard (single & batch; email template, attachments checklist) + `bill_guide` OWL helper for the "upload your supplier bills" onboarding | `odoo/addons/account/wizard/{account_move_send_wizard.py,account_move_send_batch_wizard.py}` (+ `_views.xml`), `odoo/addons/account/static/src/components/{bill_guide,invoice_guide}/` |
| Print/report | Customer `report_invoice` QWeb (+ payment receipts) & portal `account_portal_templates` | `odoo/addons/account/views/report_invoice.xml`, `odoo/addons/account/views/report_payment_receipt_templates.xml`, `odoo/addons/account/views/account_portal_templates.xml` |
| Down payments | Down-payment invoice creation is a sale-side wizard (`sale_make_invoice_advance`) that lands as an `account.move`; move side carries the down-payment flags | `odoo/addons/sale/wizard/sale_make_invoice_advance.py` (in this checkout's addons tree), move fields in `odoo/addons/account/views/account_move_views.xml` |

**BOSS implications.** Four lifecycle states repeat everywhere (draft → sent/posted → part-paid → paid, plus credited/void), best modeled as BOSS status with explicit transitions in the Invoice screen header — including void/post modals requiring a reason (Carbon) and permission-gated posting (all references). Invoice lines need the standard unit/price/tax/discount columns; the MEMO/charge patterns for credits (Carbon's memo-applications panel, Dolibarr Avoir, ERPNext `is_return`) should be first-party screens with application-to-invoice logic, not separate hacks. The recurring/template-invoice maintenance list (Akaunting recurring invoices, Dolibarr `invoicetemplate_list`) is a cheap high-value screen. The customer portal is a proven differentiator: tokenized guest view + sign & pay happens off-session (Akaunting) — BOSS should ship it as an anonymous Moqui screen; payment-request emails with a gateway link (ERPNext) are its accelerator. Per-invoice PDF template selection (Akaunting's 3 styles, gauzy's accounting-templates, ERPNext print formats) argues for BOSS template records seeded in data, not hardcoded layouts.

---

## 5. Collections & dunning

### Akaunting — **absent** (no dunning/follow-up workflow)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | `overdue` is only a list filter/tab and an invoice-status email snapshot in the portal; no match/reminder schedule or letter wizard | `resources/views/sales/invoices/index.blade.php` (overdue tab), `resources/views/portal/invoices/show.blade.php` (overdue badge) |

### AureusERP — **absent**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No dunning, follow-up or reminder module in any webkul plugin (no `account_followup` port) | — |

### Carbon — collections live in the receivables workbench (aging first, not letters)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Receivables workbench | The ARAP workbench filtered to receivables: per-customer open-invoice groups with checkboxes, as-of aging buckets, bulk allocate/apply credit memos; no dunning schedule | `apps/erp/app/modules/invoicing/ui/Workbench/ARAPWorkbench.tsx`, route registry `apps/erp/app/modules/invoicing/ui/useInvoicingSubmodules.tsx` (name "Receivables") |
| Credit memos in collections | Credit-memo allocation panel as the informal "discount & forgive" tool | `apps/erp/app/modules/invoicing/ui/Memo/MemoApplicationsPanel.tsx` |

### Dolibarr — direct-debit driving + per-invoice reminder

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Direct debit (Prélèvement) | Bank-transfer pull collections: create-from-invoices batch (Sepa generation), pending demands, rejections list w/ card, per-line cards, statistics page | `htdocs/compta/prelevement/{create,demandes,factures,requests,rejets,fiche-rejet,line,list,orders_list,stats,index}.php`, admin `htdocs/admin/prelevement.php` |
| Overdue reminder | "Send reminder email" action & template hooks on the invoice card (mass send runs via the generic mail-form engine) | `htdocs/compta/facture/card.php`, `htdocs/core/class/html.formmail.class.php` |
| Disputes box | Invoice-dispute widget surfaces stuck payments on the dashboard | `htdocs/core/boxes/box_invoices_dispute.php` |

### ERPNext — a proper Dunning doctype (+ auto overdue streams)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dunning | Dunning document: pick type & sales invoice → pulls `overdue_amount`/outstanding & interest auto-calc, statuses Draft/Resolved/Unresolved/Cancelled, generates letter PDF from `Dunning Letter Text` template, email send on print | `erpnext/accounts/doctype/dunning/dunning.{js,json,py}`, `dunning_list.js` |
| Dunning masters | Dunning Type (levels, letter text, interest rates & dues term) + reusable letter texts | `erpnext/accounts/doctype/dunning_type/dunning_type.{js,json,py}`, `erpnext/accounts/doctype/dunning_letter_text/dunning_letter_text.{js,json,py}` |
| Auto overdue flag | Invoice→dunning feeder: overdue payments records & payment-schedule overdue rows | `erpnext/accounts/doctype/overdue_payment/overdue_payment.{json,py}` |
| Statement of accounts batch | Scheduled mass emails of the Statement of Accounts report (passive collections) | `erpnext/accounts/doctype/process_statement_of_accounts/process_statement_of_accounts.{js,py}` (+ `_cc` variant) |

### Ever Gauzy — **absent** (no credit-communication page in this checkout)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | Invoice send/email resend exists but no dunning/credit-reminder flow; `forms of payment` are covered in §7 | `apps/gauzy/src/app/pages/invoices/invoice-send/` |

### metasfresh — dunning as a backend window + gateway SPI

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dunning windows | Dunning run/letters are backend-defined windows (mass dunning process); no dedicated React surface | `backend/de.metas.dunning`, SPI `backend/de.metas.dunning_gateway.{api,spi}`, rendering shell `frontend/src/components/window/` |

### Odoo — follow-up module absent; debit notes & chatter as stopgaps

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | `account_followup` not in this community tree (Enterprise line-history match reminders) | — |
| Debit notes | Debit-note wizard creating corrective moves from an original (adjacent tool, §15) | `odoo/addons/account_debit_note/` (wizard + views) |
| Activities-based chasing | Scheduled activities on overdue customers (mail module drives them) — no automatic matching | `odoo/addons/account/views/account_move_views.xml` (activity fields), `odoo/addons/account/models/account_move.py` (`activity_state`) |

**BOSS implications.** Collections split into two tiers everywhere: the *workbench* (aging buckets + open items by customer + credit-memo application, Carbon/Dolibarr) and the *letter engine* (schedule levels with interest & letter templates, ERPNext dunning/dunning_type, Dolibarr prelevement for direct-debit). BOSS should ship the aging workbench inside Customer 360 (credit face) and a Dunning screen driven by a `DunningLevel`/letter-template pair; direct-debit-style mass collections (`prelevement`) are a later add gated on a gateway. The absences (Akaunting, AureusERP, gauzy, Odoo community) confirm dunning is Enterprise-tier functionality — it is a differentiator for BOSS, not table stakes.

---

## 6. Bills & payables (AP)

### Akaunting — bill flow mirroring invoices

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bill list/create/edit/show/print | Same Document engine as invoices with reversed semantics (paid/due, vendor bill PDF via single `print.blade.php` style) | `resources/views/purchases/bills/{index,create,edit,show,print}.blade.php`, controller `app/Http/Controllers/Purchases/Bills.php`, modals `resources/views/modals/documents/` |
| Recurring bills | Auto-draft schedule maintenance (same frequency/interval/limit form as AR recurring) | `resources/views/purchases/recurring_bills/`, controller `app/Http/Controllers/Purchases/RecurringBills.php` |
| Vendor master | Vendor CRUD with contacts & billing info feeding bill dropdowns | `resources/views/purchases/vendors/`, controller `app/Http/Controllers/Purchases/Vendors.php` |

### AureusERP — bill resources + vendor refunds

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Vendor bills (accounts plugin) | Odoo `in_invoice` port: BillResource CRUD + payments manager | `plugins/webkul/accounts/src/Filament/Resources/BillResource/BillResource.php` (+ `Pages/`) |
| Bills (classic invoices plugin) | Second BillResource in the Vendors cluster (with its own Settings pages) + RefundResource for vendor credits | `plugins/webkul/invoices/src/Filament/Clusters/Vendors/Resources/{BillResource,RefundResource,PaymentResource}.php` |

### Carbon — purchase invoices with OCR-style extraction & expense reimbursements

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Purchase invoice form | Header/line/properties/summary/mirror of the AR form, plus delivery (receipt) linkage and autofill hook | `apps/erp/app/modules/invoicing/ui/PurchaseInvoice/{PurchaseInvoiceForm,PurchaseInvoiceHeader,PurchaseInvoiceLineForm,PurchaseInvoiceDeliveryForm,PurchaseInvoiceProperties,PurchaseInvoiceSummary}.tsx`, `usePurchaseInvoiceAutoFill.ts` |
| Line extraction mapping | "Map extracted invoice lines" modal for mapping vendor-feature lines onto PO lines (auto-merge) | `apps/erp/app/modules/invoicing/ui/PurchaseInvoice/MapExtractedInvoiceLinesModal.tsx` |
| Post/void/status | PurchaseInvoicePostModal (journal+date), VoidModal, status chips, table + explorer | `apps/erp/app/modules/invoicing/ui/PurchaseInvoice/{PurchaseInvoicePostModal,PurchaseInvoiceVoidModal,PurchaseInvoicingStatus,PurchaseInvoicesTable,PurchaseInvoiceExplorer}.tsx` |
| Reimbursements | Employee-expense → payable doc: edit form, pay-expense modal, documents panel | `apps/erp/app/modules/invoicing/ui/Reimbursement/{ReimbursementEditForm,PayExpenseModal,ReimbursementDocuments,ReimbursementsTable}.tsx` |
| Suppliers receivable link | Supplier credit memos in §4 Memo module (`table: memo`) | `apps/erp/app/modules/invoicing/ui/Memo/MemosTable.tsx` |

### Dolibarr — fourn/facture + supplier document portal

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Supplier invoices | `htdocs/fourn/facture/card.php` — rich edit with create-from-supplier-order, reception-matched lines, payment status chips, per-bill documents/contacts/lifecycle info; list with filters & bulk PDF | `htdocs/fourn/facture/{card,list}.php`, per-bill `htdocs/fourn/facture/{document,contact,info}.php`, `htdocs/fourn/recap-fourn.php` |
| Supplier orders | Order card + bill-from-order conversion | `htdocs/fourn/commande/{card,list}.php` |
| Reception & templates | Reception steps and third-party purchase index | `htdocs/reception/`, `htdocs/fourn/index.php` |
| Supplier invoice generators | Numbering/doc generator modules for supplier invoices | `htdocs/core/modules/supplier_invoice/` |

### ERPNext — Purchase Invoice doctype

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Purchase invoice form | Mirror of Sales Invoice with is_return (debit note), update-stock, "hold invoice"/partial payment hold (hold scheme with Fiscal Year hold), interchange `warehouse` post stock | `erpnext/accounts/doctype/purchase_invoice/purchase_invoice.{js,json,py}` (+ `regional/`), children `purchase_invoice_{item,payment,taxes,advance}/` |
| List filters & glue | list js + dashboard chart | `purchase_invoice_list.js` (+ `list_filter/`), `purchase_invoice_dashboard.py` |
| Debit notes | `is_return` flows on purchase invoice (via merge credit/debit note descend) | `erpnext/accounts/doctype/purchase_invoice/purchase_invoice.py` (`make_debit_note`) |

### Ever Gauzy — expense-centric AP

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Expenses | Expense add/list with vendor, category, employee/org/project selectors and receipts; feeds the income/expense dashboard pair (§1) | `apps/gauzy/src/app/pages/expenses/expense.component.ts`, expense grid in `packages/ui-core/shared/src/lib/` |
| Vendor expense records | Expenses paid to vendor records flow as the AP-side entries (vendor picker on expense rows) | `apps/gauzy/src/app/pages/expenses/`, vendor selector `packages/ui-core/shared/src/lib/vendor-select/` |
| Recurring expenses | Org-level & employee-level recurring expense maintenance | `apps/gauzy/src/app/pages/expense-recurring/{expense-recurring.component.ts,expense-recurring.component.html}`, `apps/gauzy/src/app/pages/recurring-expense-employee/expense-employee.component.ts` |
| Vendor master | Vendor list page feeding picker | `apps/gauzy/src/app/pages/vendors/vendors.component.ts` |

### metasfresh — vendor invoice windows (backend shells)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Vendor invoice / bill windows | C_Invoice vendor-side + purchase-invoice candidate windows via the generic shell; no dedicated React | `frontend/src/components/window/`; window owners `backend/de.metas.adempiere.adempiere`, `backend/de.metas.fresh`, `backend/de.metas.einvoice.base` |

### Odoo — vendor bills inside account.move

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bill views | in_invoice views inside the move monolith with `bill_guide` onboarding ("Upload your supplier bills") and the PDF/bill preview panel | `odoo/addons/account/views/account_move_views.xml`, `odoo/addons/account/static/src/components/bill_guide/`, `odoo/addons/account/views/bill_preview_template.xml` |
| Autoposting bills | Autopost scheduled received bills w/ demo-based currency batches | `odoo/addons/account/wizard/account_autopost_bills_wizard.py` + `_views.xml` |
| Accrued expenses / orders | `accrued_orders` wizard toggling accrued revenue/expense entries from external order docs | `odoo/addons/account/wizard/accrued_orders.py` |

**BOSS implications.** The AP face is the AR face reversed: same state model (draft→posted→paid), same line editor, plus three AP-only features to buy first in BOSS: bill-line extraction/mapping (Carbon's MapExtractedInvoiceLinesModal + Odoo bill_guide), vendor-bill hold/half-payment controls (ERPNext hold-scheme), and employee reimbursements as a payable type (Carbon + gauzy recurring expenses). Akaunting gives the vendor symmetric CRUD but no vendor portal — the tokenized portal is customer-only in this version. The pay-run slice of AP belongs to §7 but the bill screen needs the "schedule for payment" action visible on Bill records as in all references.

---

## 7. Payments & payment runs

### Akaunting — transactions ledger + transfers + (empty) gateway modules

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Transactions | Money-in/out ledger list with type filters & monthly/annual grouping, batch actions, create/edit/show/print, CSV import screen | `resources/views/banking/transactions/{index,create,edit,show,print_default,import}.blade.php`, controller `app/Http/Controllers/Banking/Transactions.php` |
| Transfers between accounts | Transfer doc with three print variants (voucher/cheque-like) | `resources/views/banking/transfers/{index,create,edit,show,print_default,print_second,print_third}.blade.php`, controller `app/Http/Controllers/Banking/Transfers.php` |
| Recurring transactions | Scheduled auto transactions (same recurring engine) | `resources/views/banking/recurring_transactions/`, controller `app/Http/Controllers/Banking/RecurringTransactions.php` |
| Add-payment modal | Payment capture dialog from invoice/bill document with split of amount & date | `resources/views/modals/documents/payment.blade.php` (+ `item_columns.blade.php`), portal twin `resources/views/portal/payments/` |

### AureusERP — PaymentResource ×2 + minimal payments plugin

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Account payments | PaymentResource (Odoo `account.payment` port) attached to the accounting cluster (AR/AP register) | `plugins/webkul/accounts/src/Filament/Resources/PaymentResource/PaymentResource.php` (+ `Pages/`) |
| Invoices-plugin payments | PaymentResources in both Customers & Vendors clusters of the invoices plugin | `plugins/webkul/invoices/src/Filament/Clusters/{Customers,Vendors}/Resources/PaymentResource/` |
| Payments plugin | Models-only plugin (providers abstractions, `PaymentPlugin` service provider); no Filament screens in this checkout | `plugins/webkul/payments/src/{Models/PaymentPlugin.php,PaymentServiceProvider.php}` |

### Carbon — payment as settlement document with an application workbench

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Payment doc | PaymentForm/Header/Status (Receipt vs Disbursement vs Internal), documents panel, per-invoice payments panel | `apps/erp/app/modules/invoicing/ui/Payment/{PaymentForm,PaymentHeader,PaymentStatus,PaymentDocuments,InvoicePaymentsPanel,PaymentsTable}.tsx` |
| Application/applied credits | PaymentApplyTable + PaymentApplications: apply a payment across invoices w/ running "available credit" pool, settlement docs service hook, modal grids and tests | `apps/erp/app/modules/invoicing/ui/Payment/{PaymentApplyTable,PaymentApplications,AvailableCreditsTable,useSettlementDocuments}.tsx`, settlement logic `apps/erp/app/modules/invoicing/invoicing.settlements.ts` |
| Payment runs | No scheduled payment-run engine; pay-run-like batches happen on workbench selection | `apps/erp/app/modules/invoicing/ui/Workbench/ARAPWorkbench.tsx` |

### Dolibarr — paiement CRUD + cheque deposits

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customer payments | paiement list/card (multi-invoice allocation grid: amount column per line), "to validate" queue (`tovalidate.php`), documents/infos, monthly report (`rapport.php` with print) | `htdocs/compta/paiement/{list,card,tovalidate,document,info,index,rapport}.php`, quick-create from doc `htdocs/compta/paiement.php` |
| Supplier payments | fourn/paiement list/card (bill allocations) + docs | `htdocs/fourn/paiement/{list,card,document,info}.php` |
| Cheque deposit | Deposit card building bank entries from batched cheque payments | `htdocs/compta/paiement/cheque/{card,list,index}.php`, classes `htdocs/compta/paiement/class/{paiement,cpaiement}.class.php` |
| Payment order/callback utilities | to-validate queue & various payment types (`paiement_charge.php` for social contribution payments) | `htdocs/compta/paiement_charge.php`, `htdocs/compta/paiement_vat.php` |

### ERPNext — Payment Entry + the reconciliation workhorse

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Payment Entry | Payment type Received/Paid/Internal Transfer: references tabs (invoices/orders/bills auto-pulled, `set_remaining_amount`), unallocated amount & write-off handling, taxes differential, exchange gain/loss rows per reference, bank charges | `erpnext/accounts/doctype/payment_entry/payment_entry.{js,json,py}` (+ `payment_entry_list.js`, children `payment_entry_reference`/`payment_entry_deduction`) |
| Payment reconciliation | Allocate invoices ↔ payments/orders: party/account/currency filters, fetch outstanding, auto-allocate button + manual per-invoice allocation grid with over/under notes | `erpnext/accounts/doctype/payment_reconciliation/payment_reconciliation.{js,json,py}` |
| Payment orders/schedule | Payment Order (schedule batch of outstanding invoices to pay) + its references | `erpnext/accounts/doctype/payment_order/payment_order.{js,json,py}` (+ `_reference`) |
| Modes & gateways | Mode of Payment w/ accounts map; Payment Gateway Account; gateway implementations live in the separate `payments` app (checkout `3p_other/frappe/payments`) | `erpnext/accounts/doctype/mode_of_payment/mode_of_payment.{js,json,py}`, `erpnext/accounts/doctype/payment_gateway_account/payment_gateway_account.{js,json,py}`, gateways in `payments/payments/payment_gateways/` (stripe integration etc.) |

### Ever Gauzy — payment capture on invoices (Stripe-side)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Payments page | Org-level payments list (per invoice/customer) w/ date filters & totals; add payment dialog partially from invoice | `apps/gauzy/src/app/pages/payments/payments.component.ts`, invoice-scoped `apps/gauzy/src/app/pages/invoices/invoice-payments/` |
| Estimate payments | Estimate-invoice conversions with per-task payments — not part of this pass (§4) | `apps/gauzy/src/app/pages/invoices/invoice-estimates/` |

### metasfresh — payment allocation flow + payment adapter windows

| Screen/page | What it is | Key files |
| --- | --- | --- |
| PaymentAllocation components | Header + amount indicator for the "Invoice to allocate" allocation workflow (allocation, diff-reason, writeoff folds live in backend processes) | `frontend/src/components/paymentAllocation/{InvoiceToAllocateViewHeader.js,AmountIndicator.js}` |
| Payment adapters/windows | de.metas banking payment windows + SEPA/ESR/PayPal/Revolut/SumUp payment adapter backends (banking windows render through generic shell) | `backend/de.metas.banking`, `backend/de.metas.payment.{sepa,esr,paypal,revolut,sumup}` (+ `de.metas.payment.sumup.rest-api`) |

### Odoo — payment register wizard + payment/payment provider pages

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Payment document | `account.payment` views (list/tree with partner/amount/status, payments from moves) | `odoo/addons/account/views/account_payment_view.xml` |
| Register payment wizard | Bulk "Register Payment" wizard from selected move lines — flexible journal, payment difference handling (in/out), write-off dialog, multi term checks | `odoo/addons/account/wizard/account_payment_register.py` + `odoo/addons/account/wizard/account_payment_register_views.xml` |
| Providers & tokens | payment provider list/form (states, token setup, journal mapping), saved tokens & transactions (all MVC views) + express checkout templates | `odoo/addons/payment/views/payment_provider_views.xml`, `odoo/addons/payment/views/payment_token_views.xml`, `odoo/addons/payment/views/payment_transaction_views.xml`, `odoo/addons/payment/views/express_checkout_templates.xml` |
| Portal pay page | payment portal templates (pay-in link UI) & account_payment portal glue | `odoo/addons/payment/views/portal_templates.xml`, `odoo/addons/account_payment/views/` |
| Check printing | Check print layouts & register (community addon) | `odoo/addons/account_check_printing/views/`, models |

**BOSS implications.** One mental model wins: a *Payment* document with a type (receipt / disbursement / internal transfer), an allocation table against open invoices/bills, and per-line write-off & FX rows — exactly Carbon's `PaymentApplyTable`/`useSettlementDocuments` and ERPNext Payment Entry references tabs; BOSS's Payment screen should make that allocation grid the main event. Dolibarr's `tovalidate` queue shows the bookkeeper-safe two-step payment flow (entered→validated→posted) worth copying as a permission divider. Payment-run/batch scheduling is rarer than expected (ERPNext Payment Order, metasfresh allocation runs) — ship a simple "Payment Run" generator on top of checked bills rather than a full scheduler. Gateway surface belongs at the provider-records level (Odoo `payment` addon views, ERPNext payments app) so BOSS can grow portals and online pay pages (Akaunting portal + Odoo portal templates) without rework.

---

## 8. Banking & reconciliation

### Akaunting — bank accounts + a dedicated reconciliation screen

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bank accounts | Account (bank/cash) CRUD with opening balance, currency, account number; show page lists the account's transactions | `resources/views/banking/accounts/{index,create,edit,show}.blade.php`, controller `app/Http/Controllers/Banking/Accounts.php` |
| Reconciliations | Pick account + statement period → side-by-side statement amount vs ledger amounts, ending-balance difference, inline match-out lines against transactions; create/edit/index screens | `resources/views/banking/reconciliations/{index,create,edit}.blade.php`, controller `app/Http/Controllers/Banking/Reconciliations.php` |
| Bank feeds context | "Bank feeds" widget + "new transaction" quick modal from the show page | `app/Widgets/BankFeeds.php`, `resources/views/widgets/bank_feeds.blade.php` |

### AureusERP — bank accounts only, no reconciliation engine

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bank accounts | BankAccountResource CRUD (journal-linked, account number, currency) | `plugins/webkul/accounts/src/Filament/Resources/BankAccountResource/BankAccountResource.php` |
| Reconciliation | **Absent** — no statement-matching screen in this version; reconciliation state rides on payments/journal-item fields only | — |

### Carbon — no banking module; reconciliation via tie-out panel only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sync tie-out | Table comparing subledger balances to GL balances per period with drift rules | `apps/erp/app/modules/accounting/ui/SyncTieOut/SyncTieOutTable.tsx` |
| Dashboard tie-out | GL-vs-subledger variance panel from §1 | `apps/erp/app/modules/invoicing/ui/Dashboard/InvoicingDashboard.tsx` |
| Statement import/feeds | **Absent** in this checkout (no bank-statement screens) | — |

### Dolibarr — bank journal is a browsable ledger with per-line matching

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bank accounts & entries | Bank account card/list; the main `bankentries_list.php` linear ledger with editable lines, reconciliation checkbox columns (rappro), third-party/type filters, quick new-entry row; `releve.php` printable statement; dashboard graphs `bilan.php`/`graph.php` | `htdocs/compta/bank/{card,list,bankentries_list,releve,bilan,graph,categ,transfer,treso}.php` |
| Statement document | Upload/attach bank statement PDF against account | `htdocs/compta/bank/account_statement_document.php` |
| Cheque/transfer in-paths | Cheque deposit flow (§7) feeding entries; accounts listing `list.php` | `htdocs/compta/paiement/cheque/card.php`, `htdocs/compta/bank/list.php` |

### ERPNext — bank accounts/transactions/rules + statement import + tool

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bank account layers | Bank (record per physical bank), Bank Account (per bank GL/IBAN/subtype), balance history (`bank_account_balance`) | `erpnext/accounts/doctype/bank/bank.{js,json,py}`, `erpnext/accounts/doctype/bank_account/bank_account.{js,json,py}`, `bank_account_balance/` |
| Bank statement import | Upload/import bank statements (bank_statement_import + logs w/ column mapping) generating Bank Transactions | `erpnext/accounts/doctype/bank_statement_import/bank_statement_import.{js,css,py}` (+ `bank_statement_import_list.js`), `bank_statement_import_log/` |
| Bank transactions & rules | Bank Transaction doc (transaction type, amounts, party autofit), auto-match-party hook, upload helper; rules engine with description conditions & account mapping (auto reconcile via rules) | `erpnext/accounts/doctype/bank_transaction/{bank_transaction.js,bank_transaction_list.js,bank_transaction_upload.py,auto_match_party.py}`, `erpnext/accounts/doctype/bank_transaction_rule/bank_transaction_rule.{js,json,py}` (+ `_accounts`, `_description_conditions`, `bank_transaction_mapping/`) |
| Bank reconciliation tool | Legacy/manual reconciliation page matching unmatched transactions to payments & entries (whole-transaction matching UI) | `erpnext/accounts/doctype/bank_reconciliation_tool/bank_reconciliation_tool.{js,json,py}` |
| Cash side | Bank Clearance (sequence of entries with running balance) + cashier closing drawer | `erpnext/accounts/doctype/bank_clearance/bank_clearance.{js,json,py}`, `erpnext/accounts/doctype/cashier_closing/…` |

### Ever Gauzy — **absent**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No bank accounts/statements; payment capture only (§7) | — |

### metasfresh — banking module backends render through the generic window

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Banking windows | Bank/statement/payment windows (statement line import feeding the payment-allocation flow) via generic shell | `frontend/src/components/window/`; owners `backend/de.metas.banking`, `backend/de.metas.payment.esr` (Swiss inbound matching) |

### Odoo — bank statements & feeds (reconciliation widget reserved wiring on enterprise)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bank statement views | account.bank.statement/lines list+form (draft/open/validated states) with partial-reconcile flags via `account.partial.reconcile` model | `odoo/addons/account/views/account_bank_statement_views.xml`, `odoo/addons/account/views/account_full_reconcile_views.xml`, `odoo/addons/account/views/account_reconcile_model_views.xml` (reconcile model maintenance) |
| Partner bank | `res.partner.bank` views + `many2many_tags_banks`/`manyone_banks`/`auto_save_res_partner_bank` OWL components (IBAN UX) | `odoo/addons/account/views/res_partner_bank_views.xml`, `odoo/addons/account/static/src/components/{many2many_tags_banks,manyone_banks,auto_save_res_partner_bank}/` |
| Reconciliation widget | **Absent in community** — the bank-reconciliation matching widget ships with the Enterprise `account_accountant`; community keeps statements+models only | flag in §15 |

**BOSS implications.** Banking splits into three building blocks everywhere: (1) bank-account master w/ opening balance & currency (Akaunting, Dolibarr, ERPNext, AureusERP), (2) a ledger-browsable statement surface — Dolibarr's `bankentries_list` with inline matching columns is the single best reference for a Moqui XML screen, (3) matching/reconciliation automation opener (ERPNext statement-import→rule-based auto-reconcile→manual tool; Akaunting's simple two-column statement screen). BOSS's Accounting app should ship 1+2 as first screens with a simple statement-import → matching-item queue; the reconcile widget (Odoo enterprise) is out of reach of community references — model matching as `PaymentApplication` candidates rather than a bespoke widget, feeding the §7 allocation screen. Dolibarr's suspense-account dashboard box (§1) is the mechanical stub: unmatched GL lines need a visible landing.

---

## 9. Period close & locks

### Akaunting / gauzy — **absent**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No period/fiscal-locks concept anywhere in either suite | — |

### AureusERP — **absent** beyond fiscal positions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No period close/lock screens in the accounts/accounting plugins | — |

### Carbon — periods table driving close

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Periods table | Fiscal periods grid (open/closed per year & month), close-state toggles | `apps/erp/app/modules/accounting/ui/Periods/PeriodsTable.tsx` |
| Pre-close checklist popover | "Unposted documents in period" popover listing blocking docs before closing | `apps/erp/app/modules/accounting/ui/Periods/PeriodCloseUnpostedDocumentsPopover.tsx`, service `apps/erp/app/modules/accounting/accounting.periods.ts` (logic + tests) |

### Dolibarr — single closure screen + per-fiscalyear close

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bookkeeping closure | "Closure" action page: validate all unrecorded movements, close the fiscal period, insert accounting reversal entries (per the accountancy closure setup in admin) | `htdocs/accountancy/closure/index.php`, closure setup options `htdocs/accountancy/admin/closure.php` |
| Fiscal year end rules | fiscalyear pages with per-year closure fields (§2) | `htdocs/accountancy/admin/fiscalyear*.php` |

### ERPNext — accounting period gates + closing voucher chain

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounting Periods | Period master: closed periods + which doc types (and which transaction types) are frozen | `erpnext/accounts/doctype/accounting_period/accounting_period.{js,json,py}` |
| Period closing voucher | Year-end closing: `account_closing_balance` snapshot generating journal entry; process helper queues the work in background | `erpnext/accounts/doctype/period_closing_voucher/period_closing_voucher.{js,json,py}`, `process_period_closing_voucher/`, closing balances `account_closing_balance/` |
| Accounts settings (locks) | Global freeze controls: freeze up to date, frozen user-exceptions (role exempt list), credit-debit control dates (also `rep_m` related settings) | `erpnext/accounts/doctype/accounts_settings/accounts_settings.{js,json,py}` |
| Repost hygiene | Repost queue doctypes monitoring day-end consistency repairs (see §3) | `erpnext/accounts/doctype/repost_accounting_ledger/` |

### metasfresh — period control in the core AD model

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Period control | C_Period/C_PeriodControl windows (open/closed/hard-close per table) opened through the generic shell | generic shell `frontend/src/components/window/`; backend `backend/de.metas.adempiere.adempiere` (legacy `PeriodClosedException` flow), GL posting gates in `backend/de.metas.acct.base` |

### Odoo — lock dates + hard lock, with a legal override registry

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Lock dates | Company-level `fiscalyear_lock_date`, `tax_lock_date`, `sale_lock_date`, `purchase_lock_date`, `hard_lock_date` (UI in company form & settings) | `odoo/addons/account/models/company.py`, `odoo/addons/account/views/res_company_views.xml`, `odoo/addons/account/views/res_config_settings_views.xml` |
| Lock exceptions | `ir.lock.exception` registry letting approved users post into locked windows until a date | `odoo/addons/account/views/account_lock_exception_views.xml`, models tie-in `odoo/addons/account/models/account_move.py` |
| Entry immutability | Secure-entries wizard hashing posted entries (anti-tamper) | `odoo/addons/account/wizard/account_secure_entries_wizard.py` |

**BOSS implications.** Close is a *period status + checklist + gate*, not one big screen: Carbon's periods table + unposted-documents popover models exactly what a Moqui screen needs (period grid with per-type lock checkboxes, pre-close validation list). Odoo's five lock-date axes (GL/tax/PO/SO/hard) plus lock-exception registry map onto BOSS `AcctgPeriod`/`AcctgPeriodStatus`-plus user-exception table; ERPNext's accounting-period-per-doctype freezing is a nice generic mechanism (close "outstanding POs" without closing GL). Post-closing immutability should be BE-structured: BOSS can reuse the posted-entry hash idea (Odoo secure entries) when a hard-close lands.

---

## 10. Tax & e-invoicing compliance

- Tax screens come in two shapes: per-rate master (Akaunting/AureusERP/ERPNext templates) vs declaration drafts (Dolibarr's VAT menus, Odoo report tags). E-invoicing is add-on tier everywhere.

### Akaunting — flat tax rates + percentages grouping

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Taxes CRUD | Flat rate list (name/rate/type incl. compound), create/edit; assignable to items & documents | `resources/views/settings/taxes/{index,create,edit}.blade.php`, controller `app/Http/Controllers/Settings/Taxes.php`, modal `resources/views/modals/taxes/` |
| Document tax grid | Document-level tax summary block (name/rate/amount columns) + totals on invoice/bill forms | `resources/views/components/documents/form/{tax-rate,totals}.blade.php`, show-side `resources/views/components/documents/show/` |

### AureusERP — Odoo-ported Tax & TaxGroup resources

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Taxes | TaxResource (rate scopes, distribution for invoice/refund repartition lines) + TaxGroupResource | `plugins/webkul/accounts/src/Filament/Resources/{TaxResource,TaxGroupResource}.php` (+ `Pages/`) |
| Fiscal positions (tax switching) | Country/city mapping switching tax accounts & taxes per document (§2) | `plugins/webkul/accounts/src/Filament/Resources/FiscalPositionResource.php` |

### Carbon — no standalone tax screens; tax inside documents

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Tax handling | Tax grid on invoice/PO summaries, tax autocomplete inside JE lines; no tax master surface discovered | `apps/erp/app/modules/invoicing/ui/SalesInvoice/SalesInvoiceSummary.tsx`, `apps/erp/app/modules/accounting/ui/JournalEntries/JournalLineRow.tsx` |

### Dolibarr — the full declaration workspace

| Screen/page | What it is | Key files |
| --- | --- | --- |
| VAT declarations | Main VAT ledger (list/card with payment month deadlines), payments page, per-client turnover reports (`clients.php`), declarations detail/norms | `htdocs/compta/tva/{index,card,list,payments,clients,document,info}.php`, paid-through `htdocs/compta/payment_vat/` |
| Quadri detail (declaration lines) | Detail per rate/product for periodic declaration printing (incl. `quadri` variants) | `htdocs/compta/tva/quadri_detail.php` (+ sibling `initdatesforvat.inc.php`) |
| Local taxes | `localtax` pages (same pattern per local tax type) | `htdocs/compta/localtax/{index,card,list,...}.php` |
| Social contributions | Sociales contributors (payroll-tax analog) with their own payment pages | `htdocs/compta/sociales/`, payments via `htdocs/compta/paiement_charge.php` |
| Intrastat/report feeds | European tax report tooling | `htdocs/intracommreport/` |
| E-invoicing community module | E-invoice document list/cards, e-invoice tracking statuses, XML preview & pending-sync queue, product mapping | `dolibarr-community-modules/einvoicing/{document_list,document_card,einvoice_tracking,xmlpreview,sync_pending_list,product_mapping}.php` |
| KSeF (Poland) | **Metadata-only** in this checkout (README + index.yaml, no code) | `dolibarr-community-modules/ksef/{README.md,index.yaml}` |

### ERPNext — tax templates/withholding + regional e-invoice modules

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Items/sales/purchase tax templates | item_tax_template (+detail), sales & purchase taxes-and-charges templates driving default document taxes; tax_category wrapper | `erpnext/accounts/doctype/item_tax_template/item_tax_template.{js,json,py}`, `erpnext/accounts/doctype/sales_taxes_and_charges_template/…`, `erpnext/accounts/doctype/tax_category/…` |
| Withholding | tax_withholding_category (+rates & entries) & per-party accounts | `erpnext/accounts/doctype/tax_withholding_category/tax_withholding_category.{js,json,py}` (+ `_rate`, `_entry`) |
| Tax rules & setting | tax_rule (priority/shipping rules composition) + accounts_settings tax-related toggles | `erpnext/accounts/doctype/tax_rule/tax_rule.{js,json,py}`, `erpnext/accounts/doctype/accounts_settings/` |
| Italy e-invoice | E-invoice XML payload builders + setup hooks (regional package activated per company country) | `erpnext/regional/italy/{setup.py,utils.py,e-invoice.xml}` |
| Other regions | Regional overrides load: australia, south_africa, turkey, uae, us | `erpnext/regional/{australia,south_africa,turkey,united_arab_emirates,united_states}/` |

### Ever Gauzy — tax rates are org settings

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Org tax settings | VAT/taxId fields & rates under organizations (feeds invoice tax columns) | org settings pages under `apps/gauzy/src/app/pages/organizations/` (see §14), shared selectors in `packages/ui-core` |

### metasfresh — e-invoice gateway modules, no tax screens

| Screen/page | What it is | Key files |
| --- | --- | --- |
| E-invoice module | `de.metas.einvoice.base` owns invoice EDI config/DOIs (backend windows); DATEV export interface lives beside it | `backend/de.metas.einvoice.base`, `backend/de.metas.datev` |

### Odoo — the EDI framework is the star

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Taxes UI | account_tax views (rate grids with distribution for invoice & credit-note repartition), tax groups widget (`many2x_tax_tags`), tax rounding/repartition via `account_tax_repartition_line_factor_percent` component; python-code-defined taxes via `account_tax_python` | `odoo/addons/account/views/account_tax_views.xml`, `odoo/addons/account/static/src/components/{many2x_tax_tags,tax_autocomplete,account_tax_repartition_line_factor_percent}/`, `odoo/addons/account_tax_python/` |
| EDI framework | `account_edi` base: CRON send/receive, EDI documents & format dispatch UI; `account_edi_ubl_cii` (UBL/CII builders), `account_edi_proxy_client` (operator proxy), `account_peppol` (network enrollment UI) | `odoo/addons/account_edi/views/`, `odoo/addons/account_edi_ubl_cii/`, `odoo/addons/account_edi_proxy_client/`, `odoo/addons/account_peppol/` |
| QR codes & country EDIs | Payment QR codes (SEPA & EMV) and per-country EDI bundles | `odoo/addons/account_qr_code_sepa/`, `odoo/addons/account_qr_code_emv/`, Italian EDI bundle `odoo/addons/l10n_it_edi` (+ `odoo/addons/l10n_it_edi_sale`, `odoo/addons/l10n_it_edi_doi`) |
| Fetch external e-invoices | `fetch_einvoices`/`account_file_uploader` component pair (pull inbound e-invoices on dashboard) | `odoo/addons/account/static/src/components/{fetch_einvoices,account_file_uploader}/` |

**BOSS implications.** Ship BOSS Tax as a flat master-plus-declaration split: tax-rate master with per-document tax grid (Akaunting/AureusERP style) and a declaration draft screen fed by tax-per-line tables — Dolibarr's `tva/quadri_detail` is the clearest reference for a Moqui XML declaration screen, and its to-validate tax payment queue is worth copying too. E-invoicing deserves an outbound document record (statuses: pending/sent/acked, like the einvoicing module's `einvoice_tracking`) and an EDI-format dispatch framework rather than country hardcoding — Odoo's layered `account_edi` stack is the architectural template; inbound e-invoice fetching is already a proven small screen (Odoo `fetch_einvoices`).

---

## 11. Budgets & forecasts

### Akaunting / AureusERP / Carbon / gauzy / metasfresh — **absent**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | None of the five ships a budget/forecast screen in this checkout (AureusERP & Odoo community both lack a budget module) — compare Odoo Enterprise `account_budget`, not present here | — |

### Dolibarr — cash-flow forecast page only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bank budget/forecast | Previsional cash budget: future income/expense by month with running balance per account | `htdocs/compta/bank/budget.php` |
| Loan schedules | Loan principal+interest schedule pages (planned payments as forecast lines) | `htdocs/loan/` |

### ERPNext — full Budget doctype + variance reporting

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Budget | Budget doc against account/cost center/finance-book per month/period via Monthly Distribution; `budget_account` child & action flags (stop/warn across companies); also `budget_distribution` group | `erpnext/accounts/doctype/budget/budget.{js,json,py}`, children `budget_account/`, `monthly_distribution/` (+ `_percentage`), `budget_distribution/` |
| Variance reporting | Budget Variance report + the budget-variance dashboard chart source (§1) | `erpnext/accounts/report/budget_variance_report/`, `erpnext/accounts/dashboard_chart/budget_variance.json` |

### Odoo — **absent in community**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No `budget`/`account_budget` addon in this tree (Enterprise-only flavor) — analytic plans carry the comparative-analysis burden | — |

**BOSS implications.** Budgeting is the thinnest area across the whole reference set — one good implementation (ERPNext: budget doc + variance report + distribution calendar) covers the requirement. BOSS should model Budget as GL-account/period matrix with a variance report sharing the §12 report engine, and use it as a warning/stop gate utility (ERPNext's stop/warn actions) rather than a full planning suite. Forecasts beyond the bank cash view (Dolibarr `budget.php`) can wait.

---

## 12. Financial reports & the report engine

### Akaunting — report classes + read-only report pages with export pipeline

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Profit & loss / tax summary pages | Category-comparison tables with period switcher; only two report views shipped (others are category-based analytics) | `resources/views/reports/{profit_loss,tax_summary}/` (`content/`, `table/` partials), controllers `app/Http/Controllers/Common/Reports.php` |
| Report classes | Server-side row builders: ProfitLoss, IncomeExpenseSummary, Income/ExpenseSummary, TaxSummary, DiscountSummary | `app/Reports/{ProfitLoss,IncomeExpenseSummary,IncomeSummary,ExpenseSummary,TaxSummary,DiscountSummary}.php` |
| Export engine | Bulk XLSX/PDF exports per page area (Sales/Purchases/Banking/Common/Settings) | `app/Exports/{Sales,Purchases,Banking,Common,Settings}/`, base `app/Abstracts/Export.php` |

### AureusERP — a full statements cluster (the references' best financial-report pass)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Trial balance & GL | TrialBalance, GeneralLedger (+ PartnerLedger per customer/vendor) pages with filters; per-row drill-in | `plugins/webkul/accounting/src/Filament/Clusters/Reporting/Pages/{TrialBalance,GeneralLedger,PartnerLedger}.php` |
| Statements | ProfitLoss and BalanceSheet pages rendering standard statements from journal lines | `plugins/webkul/accounting/src/Filament/Clusters/Reporting/Pages/{ProfitLoss,BalanceSheet}.php` |
| Ageing reports | AgedReceivable / AgedPayable pages bucketed per period | `plugins/webkul/accounting/src/Filament/Clusters/Reporting/Pages/{AgedReceivable,AgedPayable}.php` |
| Report exports | Cluster-wide Exports folder + shared Concerns (column/config reuse) | `plugins/webkul/accounting/src/Filament/Clusters/Reporting/Exports/`, `Concerns/` |

### Carbon — an in-app pivot/reporting engine reading straight off the GL

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Pivot engine | PivotTree (row/column grouping tree), ColumnStepper (define columns across comparison periods), PivotLinesDrawer & PivotControlBar, ReportFilters + CompanySelector, SaveViewModal (save views) | `apps/erp/app/modules/accounting/ui/Reports/{PivotTree,PivotControlBar,PivotLinesDrawer,ColumnStepper,ReportFilters,CompanySelector,SaveViewModal}.tsx`, data layer `apps/erp/app/modules/accounting/ui/Reports/executivePnl.ts` + `pivotData.test.ts` |
| Statement renders | MultiPeriodStatementTree (balance-sheet-like trees), ExecutivePnlSummary | `apps/erp/app/modules/accounting/ui/Reports/{MultiPeriodStatementTree,ExecutivePnlSummary}.tsx` |
| Trial balance & ledger | TrialBalanceTable/Tree + AccountLedgerDrawer per-account drill-in; export helper `exportReport.ts` | `apps/erp/app/modules/accounting/ui/Reports/{TrialBalanceTable,TrialBalanceTree,AccountLedgerDrawer,exportReport}.tsx` |
| Invoicing analytics | Sales/purchase analysis + taxes computed for the dashboard & CFO quick numbers | `apps/erp/app/modules/invoicing/invoicing.reports.ts` (+ tests) |

### Dolibarr — dozens of PHP result/stat pages

| Screen/page | What it is | Key files |
| --- | --- | --- |
| P&L (result) | Result pages: revenue-expenditure matrix per year (index/result), customer/supplier split (`clientfourn.php`), per-project view | `htdocs/compta/resultat/{index,result,clientfourn,projects}.php` |
| Turnover stats | Customer/supplier turnover aggregates: per-product, per-country, per-user, per-third-party | `htdocs/compta/stats/{index,casoc,cabyprodserv,cabyuser,byratecountry,supplier_turnover,supplier_turnover_by_prodserv,supplier_turnover_by_thirdparty}.php` |
| Fiscal exports | Bookkeeping export formats (FEC / taxes), centralized on the bookkeeping export page (see §3) | `htdocs/accountancy/bookkeeping/export.php` |
| Bank trend pages | Bank flows graphs & cash positions (§8 files) double as reports | `htdocs/compta/bank/{bilan,graph,treso}.php` |

### ERPNext — the largest report surface (60+ accounting reports)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Ledger reports | General Ledger (w/ group filters & is-group drill), Trial Balance (+`_simple`, `_for_party`), Payment Ledger, Advance ledger & GL/payment comparison | `erpnext/accounts/report/{general_ledger,trial_balance,trial_balance_simple,trial_balance_for_party,payment_ledger,general_and_payment_ledger_comparison}/` |
| Statements | Profit and Loss Statement, Balance Sheet, Cash Flow (with `financial_statements` engine), Consolidated variants | `erpnext/accounts/report/{profit_and_loss_statement,balance_sheet,cash_flow,financial_statements.py,consolidated_financial_statement,consolidated_trial_balance,consolidated_accounts_{receivable,payable}}/` |
| Register & summary reports | Sales/Purchase Register (`item_wise_*_register`, payable/receivable summaries + consolidated), AR/AP ageing (§13) | `erpnext/accounts/report/{sales_register,purchase_register,item_wise_sales_register,item_wise_purchase_register,accounts_receivable_summary,accounts_payable_summary}/` |
| Financial templates | Pre-defined statement layouts (IFRS P&L/Balance/Cash Flow; horizontal variants, ratios) configurable tree data | `erpnext/accounts/financial_report_template/` (incl. `financial_ratios_analysis`, `standard_balance_sheet_(ifrs)`, `horizontal_profit_and_loss_(columnar)`) |
| Report framework | Shared scripted-report UI (filters, save/print variants) from the Frappe core report engine; accounting pinch-point glue in `utils.py` | `erpnext/accounts/report/utils.py` |
| Insights workbook | External BI seeding for accounting dashboards | `erpnext/accounts/insights_workbook/{accounts,payments}/` |

### Ever Gauzy — report gallery page + reusable report components

| Screen/page | What it is | Key files |
| --- | --- | --- |
| All reports index | Grid of available reports (finance: expenses, payment, amounts owed, client/project budgets; plus time/HR reports) | `apps/gauzy/src/app/pages/reports/all-report/all-report.component.ts` |
| Finance reports | Expenses report w/ chart+grid stack; Payment report; Amounts owed (customer/vendor outstanding); Client & Project budget reports | `apps/gauzy/src/app/pages/reports/{expenses-report,amounts-owed-report,payment-report,client-budgets-report,project-budgets-report}/` |
| Report infra | Report service + shared chart/grid components (income statement pages?), org/employee/date selectors global | `apps/gauzy/src/app/pages/reports/all-report/report.service.ts`, chart primitives in `packages/ui-core`/`packages/ui-dashboard-charts` |

### metasfresh — AD reporting windows + SQL views

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Report windows | All statements are windows/jasperwizard exports via the generic shell; owning backend `de.metas.acct.base`, `de.metas.fresh` (fresh/domain report extensions), ESR report | shell `frontend/src/components/window/`, charts `frontend/src/components/charts/` |

### Odoo — SQL-view reports in community; statement UI is Enterprise

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Invoice analysis (SQL view) | `account.invoice.report` pivot/graph configured as dashboard KPIs; registration by `account_report.xml` | `odoo/addons/account/report/account_invoice_report.py`, `odoo/addons/account/report/account_invoice_report_view.xml`, `odoo/addons/account/views/account_report.xml` |
| Financial statements | **Absent** — the P&L/BS/aged-trial-balance pivot screen suite (`account_reports`) is Enterprise; community ships only the tax report engine hooks | `odoo/addons/account/views/account_report.xml` (custom report model bits), flag in §15 |
| Hash integrity | CSV/GC-cryptographic integrity templates (fiscal tamper detection) | `odoo/addons/account/report/account_hash_integrity_templates.py` (+ `.xml`) |

**BOSS implications.** Financial reporting is where the references divide: PHP file-per-report suites (Dolibarr, ERPNext) vs a document-engine (Odoo's report model + SQL-view report pages) vs in-app pivot builders (Carbon, AureusERP's Reporting cluster). For BOSS, implement standard statements (Trial Balance, GL, AR/AP ledger & aged, P&L, Balance Sheet, Cash Flow) as XML screens over the GL views — AureusERP's Reporting/Pages set is the shape and ERPNext's `financial_report_template` JSON trees the data model. A shared drill-down widget (click a report row → open account ledger filtered) is the single biggest UX win identified across Carbon (AccountLedgerDrawer) and ERPNext alike; saved views + export columns (Carbon SaveViewModal/ColumnStepper, Akaunting Exports) should be engine features, not per-report code.

---

## 13. Customer & vendor balance, credit & aging

### Akaunting — balance rollups on the contact card

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customers | Contact CRUD list w/ due-balance column + documents/payments/transactions tabs on the show page; contacts widget on dashboard | `resources/views/sales/customers/show.blade.php` (+ `index/create/edit`), controller `app/Http/Controllers/Sales/Customers.php` (balance roll-up queries) |
| Vendors | Same surface for purchase side | `resources/views/purchases/vendors/`, controller `app/Http/Controllers/Purchases/Vendors.php` |
| Customer portal face | Guest sees own totals/paid/due on portal dashboard & invoice pages (§4) | `resources/views/portal/dashboard/`, controller `app/Http/Controllers/Portal/Dashboard.php` |

### AureusERP — partner resources w/ related accounts

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Customers & vendors | PartnerResource-style Customer/Vendor resources in both plugins w/ invoice/bill relation tabs (no credit field in this version) | `plugins/webkul/accounts/src/Filament/Resources/{CustomerResource,VendorResource}/`, twins in `plugins/webkul/invoices/src/Filament/Clusters/{Customers,Vendors}/Resources/{CustomerResource,VendorResource}.php` |

### Carbon — party-grouped aging workbench

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Aging workbench | ARAP workbench groups open items per customer/supplier with expandable balance rows and cooperative allocation (§7) | `apps/erp/app/modules/invoicing/ui/Workbench/ARAPWorkbench.tsx` |
| Aging totals on dashboard | Current/1-30/31-60/61-90/over-90 buckets + unapplied credit & tie-out | `apps/erp/app/modules/invoicing/ui/Dashboard/InvoicingDashboard.tsx` (`AgingTotals` type) |
| Customer/supplier stores | `useCustomers`/`useSuppliers` currency-aware, backing the party pickers | `apps/erp/app/stores/` (imported from `~/stores` in InvoicingDashboard) |

### Dolibarr — open-bill lists & third-party recaps (no formal aging engine)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Unpaid invoice views | Thirdparty-scoped unpaid bills with "late"/"to pay" filters; global unpaid lists | `htdocs/compta/facture/list.php` (status/soc filters), `htdocs/fourn/facture/list.php` |
| Third-party recap | Per-thirdparty compta recap (charges/payments per account) | `htdocs/compta/recap-compta.php`, supplier side `htdocs/fourn/recap-fourn.php` |
| Credit-ish warnings | Outstanding bill limit box on dashboard swings when a customer exceeds allowed unpaid amount | `htdocs/core/boxes/box_customers_outstanding_bill_reached.php`, `box_goodcustomers.php` |

### ERPNext — party balance primitives + credit limits + ageing reports

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Party utils | `party.py` — account resolution, balance & gl helpers (party-wise balances backend) | `erpnext/accounts/party.py` |
| AR/AP ageing | Accounts Receivable/Payable reports (w/ ageing & range-based details) + consolidated summaries | `erpnext/accounts/report/{accounts_receivable,accounts_payable,accounts_receivable_summary,accounts_payable_summary,consolidated_accounts_receivable,consolidated_accounts_payable}/` |
| Ledger summaries | Customer & supplier ledger summary (emailable/`process_statement_of_accounts`-ready) | `erpnext/accounts/report/{customer_ledger_summary,supplier_ledger_summary}/` |
| Credit limits | Customer Credit Limit doctype (per company/currency, warnings or stops pending amount) + customer credit balance report | `erpnext/selling/doctype/customer_credit_limit/customer_credit_limit.{js,json,py}`, `erpnext/selling/report/customer_credit_balance/` |

### Ever Gauzy — amounts-owed & budgets reports

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Amounts owed | Customer/vendor outstanding report pages (no bucket aging) | `apps/gauzy/src/app/pages/reports/amounts-owed-report/` |
| Budgets per client/project | Additional exposure limiting surfaces | `apps/gauzy/src/app/pages/reports/{client-budgets-report,project-budgets-report}/` |

### metasfresh — Open Items view header shell

| Screen/page | What it is | Key files |
| --- | --- | --- |
| AcctOpenItems | Shared header component of the open-items (AR/AP balance) views rendered inside windows; full aging comes from backend dunning/open-items windows | `frontend/src/components/acctOpenItems/OIViewHeader.js` |

### Odoo — partner accounting via moves (community lacks partner ledger screen)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Partner accounting tabs | Fiscal position & partner-level accounting settings on partner forms (no follow-up fields in community); partner payments widget (`account_payment_field`) shows paid amounts on documents | `odoo/addons/account/views/partner_view.xml`, `odoo/addons/account/static/src/components/account_payment_field/` |
| Open links | `open_move_widget`/`open_move_line_move_widget` badges deep-linking source docs from GL line views | `odoo/addons/account/static/src/components/{open_move_widget,open_move_line_move_widget}/` |
| Followup/ledger reports | **Absent** (Enterprise `account_reports` + `account_followup` own them) | flag in §15 |

**BOSS implications.** The Customer 360 balance face should fuse what these references keep separate: a party header with due/current (Akaunting), bucket aging (Carbon/ERPNext both bucket), credit limit with stop/warn behavior (ERPNext customer_credit_limit) and a payments/open-items tab linking into allocation (§7). Vendor side needs the same minus credit (or with vendor contracts) — Carbon's single ARAP workbench proves one screen can carry both faces with a party-type switch. Deep-link badges from balances to source documents (Odoo `open_move_widget`) is the connecting tissue for the shared-screen values: BOSS Journal lines, invoices and payments must all be jump-reachable from the party card.

---

## 14. Accounting settings & configuration

### Akaunting — settings pages + first-run wizard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Settings sweep | Company, localisation (tax ids & fiscal-year start), invoice defaults (numbering, prefixes, due terms), categories & defaults for account/types, currencies, email & templates, recurring schedule, tax settings (§10) | `app/Http/Controllers/Settings/{Company,Localisation,Invoice,Currencies,Defaults,Categories,Email,EmailTemplates,Schedule}.php`, views `resources/views/settings/{company,localisation,invoice,currencies,default,categories,email,email-templates,schedule}/` |
| Modules store | Module install/activate UI (relies on paid marketplace → empty in this checkout) | `app/Http/Controllers/Settings/Modules.php`, `resources/views/settings/modules/` |
| First-run wizard | Company → currencies → finish steps | `resources/views/wizard/{companies,currencies,finish}/`, controllers `app/Http/Controllers/Install/` |

### AureusERP — per-cluster Settings pages

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounting settings | ManageCustomerInvoice (numbering & terminology), ManageDefaultAccounts, ManageProducts, ManageTaxes | `plugins/webkul/accounting/src/Filament/Pages/Settings/{ManageCustomerInvoice,ManageDefaultAccounts,ManageProducts,ManageTaxes}.php` |
| Plugin settings shell | Cluster-level PluginSettings page per plugin | `plugins/webkul/accounting/src/Filament/Clusters/PluginSettings.php` (pattern shared by all webkul plugins) |

### Carbon — activation wizard + posting defaults + fintech knobs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Activation wizard | Readiness checklist, opening-balance (trial-balance) editor, fixed-asset & inventory-cost preview tables, migration clearing table, apply button | `apps/erp/app/modules/accounting/ui/Activation/{ReadinessChecklist,TrialBalanceEditor,FixedAssetDepreciationTable,InventoryCostTable,MigrationClearingTable,ApplyCarbonButton,ActivationSteps}.tsx` |
| Posting defaults & masters | AccountDefaults, PaymentTerms, ExchangeRates, FiscalYearSettings (§2) | `apps/erp/app/modules/accounting/ui/{AccountDefaults,PaymentTerms,ExchangeRates,FiscalYear}/` |

### Dolibarr — admin pages per document type

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Invoice admin | Numbering modules, invoice terms & situation, templates links | `htdocs/admin/invoice.php`, `htdocs/admin/invoice_situation.php` |
| Payment admin | Bank accounts config + payment-by-transfer config | `htdocs/admin/bank.php`, `htdocs/admin/payment.php`, `htdocs/admin/paymentbybanktransfer.php` |
| Company & currency | Company/socials + multicurrency rates | `htdocs/admin/company.php`, `htdocs/admin/multicurrency.php` (+ `htdocs/multicurrency/` rate pages) |
| Dictionary/entity config | Common dictionaries & accountancy module options | `htdocs/admin/dict.php`, `htdocs/admin/accounting.php` |

### ERPNext — Accounts Settings + gateway/deferral automation

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounts Settings | Single settings doctype: values & controls incl. freeze/lock dates (§9), default send remarks, warehouse flags | `erpnext/accounts/doctype/accounts_settings/accounts_settings.{js,json,py}` |
| Currency/deferral automation | Currency exchange settings (auto-fetch), deferred-revenue process runner | `erpnext/accounts/doctype/currency_exchange_settings/…`, `erpnext/accounts/doctype/process_deferred_accounting/…` |
| Numbering/sequencing | Document naming settings global (frappe `Document Naming Settings` consumed per doctype) | `erpnext/accounts/doctype/*` naming via `naming.py` patterns (e.g. `erpnext/accounts/doctype/sales_invoice/sales_invoice.py` naming hook) |

### Ever Gauzy — org settings + accounting templates

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounting templates | Manage invoice PDF templates at org level (see §4) | `apps/gauzy/src/app/pages/accounting-templates/` |
| Org/general settings | Org settings sections (finance-relevant: taxes/VAT ids, expense categories, payment processing integrations) | settings pages `apps/gauzy/src/app/pages/settings/{general-setting,feature,file-storage,billing,...}/`, org sections in `packages/ui-core` organization settings component tree |

### metasfresh — accounting setups as backend windows

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounting schema/config windows | Accounting schema + journal/GL configuration are backend AD windows rendered in the generic shell | `backend/de.metas.acct.base`, `de.metas.acct.webui` |

### Odoo — settings page + chart setup wizard + sequences

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Accounting settings | `res.config.settings` subpage with groups leading the setup (COA picker, lock dates, currency, bank sync) | `odoo/addons/account/views/res_config_settings_views.xml`, `odoo/addons/account/wizard/setup_wizards.py` |
| Company accounting fields | Default income/expense/deferred accounts, terms on company form | `odoo/addons/account/views/res_company_views.xml`, `odoo/addons/account/models/company.py` |
| Sequences | Sequence.mixed for journal entries + numbering per journal (report print formats res_config) | `odoo/addons/account/models/sequence.py`, `odoo/addons/account/views/base_document_layout_views.xml` |

**BOSS implications.** Settings should be one Accounts/Configuration app section with per-area tabs mirroring the references: document defaults & numbering (Akaunting invoice settings, Dolibarr admin/invoice, Odoo sequences), payment terms & language/currency (every suite), first-run activation wizard with readiness checklist + opening balances (Carbon Activation is unmatched — the strongest guidance for onboarding a company into BOSS accounting), posting defaults (Carbon AccountDefaults, AureusERP ManageDefaultAccounts) to keep bookkeepers from picking accounts line-by-line, and module-gated add-ons (Akaunting Modules page vs its empty marketplace). Currency exchange automation (ERPNext currency_exchange_settings) is a lightweight high-value config screen for multi-company BOSS.

---

## 15. Gaps & notables in the checkout

- **Akaunting `modules/` is empty at runtime** (`.gitkeep` only): the payment-gateway/extension UI (`Settings/Modules.php`) surfaces a store that cannot ship anything here — gateways beyond manual payments are absent; the customer portal, however, is core code and fully working (token links in `resources/views/portal/`).
- **AureusERP ships two parallel accounting plugin trees**: `invoices` (classic, Customers/Vendors clusters) extends the Odoo-style `accounts` resources (`use Webkul\Account\Filament\Resources\InvoiceResource as BaseInvoiceResource`) — a compose-over-base layering pattern interesting for BOSS modules; also worth noting: accounting Overview page (§1) has exactly one widget, and there are **no fiscal years, follow-ups or budgets** in either tree.
- **Carbon's Accounting module is beta-gated** (`AccountingBetaGate.tsx`) and has **no banking, no tax-rate master, no invoicing taxes surface** — its value is the document model (settlement applications, credit-memo applications) and the strongest subledger↔GL *tie-out* panel anywhere (dashboard + `SyncTieOutTable`).
- **Dolibarr's `htdocs/supplier_invoice/` is a stub** (only `admin/`); the real supplier screens live in `htdocs/fourn/facture/`. Dolibarr is file-per-screen PHP throughout (dozens of pages), the only suite here with a real mass direct-debit module (`htdocs/compta/prelevement/`), a one-page accountancy "Closure" action (`htdocs/accountancy/closure/index.php`) and one-click FEC-style bookkeeping exports (`htdocs/accountancy/bookkeeping/export.php`).
- **ERPNext `accounts/` has ~192 doctype dirs** plus (behind them) `erpnext/assets/`, `erpnext/edi/`, `erpnext/portal/` modules — assets are a separate module (`erpnext/assets/`), so invoice-linked asset depreciation flows via doctypes. Banking reality in this version: statement import (`bank_statement_import{,_log}`) → `bank_transaction` + rule-based auto-match + the legacy `bank_reconciliation_tool` page; **no live bank feeds** and no plain `bank_statement` doctype dir. Ledger-surgery screens (`bisect_accounting_statements`, `ledger_merge`, `repost_*`, `transaction_deletion_record_details`) are unusual ops-surface finds worth noting for BOSS admin tooling.
- **Odoo community in this checkout lacks the Enterprise-generation accounting extras**: no `account_reports`, `account_batch_payment`, `account_followup`, `account_fiscal_year`, `account_asset/account_asset_management`, `account_predictive_bills`, no `budget` addon — meaning no bank-reconciliation widget, no partner-ledger/aged-balance screens, no automated asset depreciation UI. Present instead: `account_debit_note`, `account_edi*` (+`account_peppol`), `account_check_printing`, `account_qr_code_{sepa,emv}`, `account_tax_python`, `analytic` — community's statement views + reconcile models are all a bookkeeper gets.
- **metasfresh's React WebUI is a thin generic shell** over AD windows: only 2 React files in `paymentAllocation/`, a `OIViewHeader.js` for open items, and the dashboard/chart widgets — every accounting screen is a backend window definition in `de.metas.*` modules (notably `de.metas.banking`, `de.metas.payment.esr` Swiss ESR, `de.metas.einvoice.base`, `de.metas.dunning`, `de.metas.acct.{base,webui}`). Useful as a counter-example: BOSS's Moqui screen XML plays the same role the AD window definition plays here.
- **Ever-gauzy is invoice/expense-centric with no GL/banking/dunning at all**; its relevance is the Accounting-templates gallery (org-level editable invoice templates), the amounts-owed/budgets report pages and the shared `packages/ui-core` component layer.
- **Dolibarr community modules inventory**: `einvoicing/` is a complete multi-feature module (document list/cards, `einvoice_tracking`, XML preview, pending-sync queue, product mapping); `ksef/` (Poland) is **metadata-only** (README + index.yaml, no code); `stancer/` provides a full gateway back-office (payments/payouts/refunds/disputes/bookkeeping pages) — all three are the best "community add-on shape" references for BOSS plugins.
- **Cross-cutting patterns**: multi-company everywhere (ERPNext per-company COA/lock dates, Odoo company-level defaults & tables, Akaunting company switcher), currency FX as a first-class screen (Dolibarr `multicurrency/`, ERPNext exchange-rate revaluation, Carbon ExchangeRates), document-numbering per sequence (Dolibarr `mod_facture_*`, Odoo `sequence.mixed`, ERPNext naming series), and the recurring-engine triplet (invoices, bills, transactions) reused across Akaunting.
- **Checkout path quirks**: Akaunting has no `resources/views/common/documents` (document forms live in `resources/views/components/documents/{form,show}/`); ERPNext paths above are relative to `erpnext/` inside the `frappe/erpnext` checkout; Odoo paths are relative to `3p_other/odoo`, so `odoo/addons/<addon>/...` is `3p_other/odoo/odoo/addons/<addon>/...`.

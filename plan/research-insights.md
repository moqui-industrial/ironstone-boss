# IronStone BOSS — Insights app research

Oct 18, 2026

Deeper research pass on the **IronStone Insights** app (dashboards & KPIs, report builder,
saved reports, and the business flow map as clickable documentation), cataloguing every
relevant screen/page found in the reference apps. Companion to
[3p-app-reference.md](3p-app-reference.md); feeds the Insights row in
[initial-design.md](initial-design.md) and the decision that Marble's flow map becomes
clickable documentation in Insights. Style mirrors
[research-maintenance.md](research-maintenance.md) and
[research-people.md](research-people.md).

**Organization.** Sorted by functional area (not by app): all dashboard viewers together,
all report builders together, etc. Within each area, sub-tables per reference app.

**Scope.** Owner/management-facing analytics UI: dashboard lists and canvases, KPI tiles,
chart and query builders, pivot/graph views, canned report catalogs, saved reports and
views, scheduled delivery and alerts, sharing/embedding, analytics data sources and
permissions, and process/flow documentation. Per-app reports are covered only as the
shape of a report page or catalog; each business app's research file covers its own
report list. Module landing pages (workspaces) are covered where the same widgets
(number cards, charts) are reused, since Insights should own those widgets.

**Path conventions.** Paths are relative to each repository's own root, as in
3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Frappe Insights** | `/home/jonesde/work/moquiwork/3p_other/frappe/insights` — Vue 3 SPA in `frontend/src2/` (dashboard, workbook, query, charts, data_source, data_store, settings, teams, islands), backend doctypes in `insights/insights/doctype/`, API in `insights/insights/api/`; glossary `CONTEXT.md`, feature list `docs/features.md`, ADRs `docs/adr/` |
| **Frappe (desk)** | `/home/jonesde/work/moquiwork/3p_other/frappe/frappe` — paths relative to `frappe/` package: desk doctypes `frappe/desk/doctype/`, core doctypes `frappe/core/doctype/`, `frappe/email/doctype/auto_email_report/`, desk JS `frappe/public/js/frappe/views/{reports,workspace,dashboard}/`, `frappe/public/js/frappe/widgets/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — paths relative to `erpnext/`: per-module `report/`, `dashboard_chart/`, `dashboard_chart_source/`, `number_card/`, `<module>_dashboard/`, `workspace/`, `page/` |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — `odoo/addons/<addon>/`; analytics addons `board`, `spreadsheet`, `spreadsheet_dashboard*` (13), `digest`; generic views `web/static/src/views/{pivot,graph}/`, search `web/static/src/search/`; SQL-view report models `<addon>/report/*_report.py` |
| **Twenty** | `/home/jonesde/work/moquiwork/3p_other/twenty` — `packages/twenty-front/src/modules/{page-layout,dashboards,side-panel/pages/page-layout,command-menu-item}/`, server enums `packages/twenty-server/src/engine/metadata-modules/page-layout-widget/` |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — `apps/erp/app/routes/x+/reports+/`, `routes/x+/accounting+/reports.tsx`, module KPI APIs `routes/api+/*.kpi.$key.ts`, models `apps/erp/app/modules/*/*.models.ts` |
| **Ever Gauzy** | `/home/jonesde/work/moquiwork/3p_other/ever-co/ever-gauzy` — pages `apps/gauzy/src/app/pages/{dashboard,reports}/`, widget registry `packages/ui-core/shared/src/lib/dashboard/`, contracts `packages/contracts/src/lib/dashboard*.model.ts` |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — `frontend/src/components/{dashboard,charts}/`, `frontend/src/containers/Dashboard.js`, backend `backend/de.metas.ui.web.base/src/main/java/de/metas/ui/web/{dashboard,kpi}/` |
| **Akaunting** | `/home/jonesde/work/moquiwork/3p_other/akaunting` — `app/Widgets/`, `app/Reports/`, `app/Abstracts/Report.php`, `resources/views/common/{dashboards,reports}/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — `htdocs/index.php` (home board), `htdocs/core/boxes/` (66 widgets), `htdocs/core/customreports.php`, per-module `stats/` pages, `htdocs/compta/{stats,resultat}/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament widgets under `plugins/webkul/<plugin>/src/Filament/**/Widgets/`; `plugins/webkul/analytics/` (record model only) |
| **coarchy** | `/home/jonesde/work/moquiwork/3p_moqui/coarchy` — process stories `screen/coarchy/cointernal/Process*.xml`, `Process/` |
| **Moqui baseline** | `/home/jonesde/work/moquiwork/mr-moqui-base/runtime` — `component/MrMarbleERP/screen/marble/dashboard.xml`, `component/MrSimpleScreens/screen/SimpleScreens/{SimpleReport,Accounting/Reports}/`, `base-component/tools/screen/{Tools/DataView,System/DataDocument}/`, `base-component/framework/entity/{ScreenEntities,EntityEntities,OlapEntities}.xml` |

Not used here: Zimbra and Nextcloud have no BI screens (Nextcloud's `server/apps/dashboard/`
widget board is the personal Today/start page, covered in
[research-drawers-commons.md](research-drawers-commons.md) §4); Sales, WorkManagement,
WeCreate and resistmanagement in `3p_moqui/` have no analytics screens beyond small
landing counters. Frappe `crm`, `helpdesk` and `hrms` dashboards are per-app and covered
in their apps' research files.

Sections: [1 home & dashboard list](#1-insights-home--dashboard-list) · [2 dashboard viewer & KPI tiles](#2-dashboard-viewer--kpi-tiles) · [3 dashboard builder](#3-dashboard-builder--layout) · [4 chart builder](#4-chart-builder--chart-types) · [5 query / report builder](#5-query--report-builder) · [6 pivot & graph views](#6-pivot--graph-views-over-list-data) · [7 canned report catalogs](#7-canned-report-catalogs--report-pages) · [8 saved reports & views](#8-saved-reports-views--favorites) · [9 scheduled delivery & alerts](#9-scheduled-delivery-digests--alerts) · [10 sharing & embedding](#10-sharing-public-links--embedding) · [11 data sources & data store](#11-data-sources-data-store--semantic-layer) · [12 analytics permissions](#12-analytics-content-permissions) · [13 flow map & process docs](#13-business-flow-map--process-documentation) · [14 AI & agents](#14-ai--agent-assisted-analytics) · [15 cross-app surfaces](#15-cross-app-surfaces) · [16 current Moqui baseline](#16-current-moqui-baseline) · [17 gaps & BOSS implications](#17-gaps--boss-implications)

---

## 1. Insights home & dashboard list

### Frappe Insights — home redirects to the dashboard list; workbooks are the authoring unit

Insights splits **reading** (Dashboards) from **authoring** (Workbooks). `/` redirects to
`/dashboards`; a workbook holds queries, charts and dashboards together and opens full
screen without the sidebar.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| App shell & routes | Sidebar app: Dashboards · Workbooks · Data Sources · Data Store · Settings; guest routes for shared chart/dashboard; Not Found / Not Permitted pages | `frontend/src2/router.ts`, `frontend/src2/App.vue`, `frontend/src2/auth/NotFound.vue`, `frontend/src2/not_permitted.ts` |
| Home | Quick actions (new workbook, connect data source, upload CSV) and recent workbooks, most recently modified first (`workbook.home-recent`) | `frontend/src2/home/{Home,HomeQuickActions,HomeWorkbookList}.vue` |
| Dashboard list | Card/list of dashboards readable by the user, search, favorites (`dashboard.favorite`), preview image, "Load more" paging | `frontend/src2/dashboard/DashboardList.vue`, `dashboards.ts`; `insights_dashboard_v3.preview_image` |
| Workbook list | Workbooks the user was granted; admins also list ones nobody gave them (`workbook.list-everyone`); read-only shield for viewers | `frontend/src2/workbook/WorkbookList.vue`, `workbooks.ts` |

### Odoo — Dashboards app grouped by section

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboards root menu | **Dashboards** app opens the dashboard action; **Configuration** → Dashboards, Sections, Share links; technical **User-defined Dashboard Filters** | `odoo/addons/spreadsheet_dashboard/views/menu_views.xml` |
| Dashboard action (reader) | Left list of dashboards grouped by **section** (`spreadsheet.dashboard.group`), favorites on top, the selected spreadsheet dashboard rendered read-only on the right; mobile search panel | `odoo/addons/spreadsheet_dashboard/static/src/bundle/dashboard_action/` (`dashboard_action.{js,xml}`, `mobile_search_panel/`, `mobile_figure_container/`) |
| Shipped dashboards | Each `spreadsheet_dashboard_<app>` addon ships JSON spreadsheets (e.g. Sales, Product) plus a **sample** version shown until real data exists (`sample_dashboard_file_path`) | `odoo/addons/spreadsheet_dashboard_sale/data/{dashboards.xml,files/*.json}`; same pattern in `_account`, `_stock_account`, `_hr_expense`, `_hr_timesheet`, `_website_sale`, `_pos_hr`, `_event_sale`, … |
| My Dashboard (legacy board) | Per-user board of saved list/graph/pivot views added from any action via **Add to my dashboard** | `odoo/addons/board/static/src/{board_action.js,board_controller.*,add_to_board/}`, `views/board_views.xml` |

### ERPNext / Frappe desk — dashboards per module plus the Home workspace

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Home workspace | Org-wide landing: Profit and Loss chart; number cards Annual Sales, Annual Purchase, Total Stock Value | `erpnext/setup/workspace/home/home.json` |
| Dashboard view | Desk `/app/dashboard-view/<name>`: number cards row then charts (Full/Half width), per-chart filters and time range; user chart config saved per user | `frappe/public/js/frappe/views/dashboard/`, `frappe/desk/doctype/dashboard/`, `dashboard_settings/` (`chart_config` per user) |
| Module dashboards | Shipped `Dashboard` records per module (Selling, Buying, Stock, Accounts, Manufacturing, Projects, CRM, Assets) | `erpnext/{selling,buying,stock,accounts,manufacturing,projects,crm,assets}/*_dashboard/` |

### Ever Gauzy, metasfresh, Akaunting, Dolibarr — one home dashboard, switchable

| App | Screen/page | Key files |
| --- | --- | --- |
| Gauzy | Dashboard with a **switcher** between built-in boards (Accounting, Human Resources, Project Management, Team, Employee charts) and **custom dashboards** (tab strip of user dashboards, default flag) | `apps/gauzy/src/app/pages/dashboard/{dashboard.component.*,dashboard-switcher/,accounting/,human-resources/,project-management/,team/,employee-charts/,custom-dashboard/}` |
| metasfresh | Home is a per-user dashboard of KPI and target-indicator widgets with a side nav to add more | `frontend/src/containers/Dashboard.js`, `frontend/src/components/dashboard/{DndWidget,DraggableWrapper,Sidenav,ChartWidget}.js` |
| Akaunting | Multiple named dashboards per company/user (create/edit/show), each a set of widget instances | `resources/views/common/dashboards/{index,create,edit,show}.blade.php`, `app/Widgets/` |
| Dolibarr | Home page = global **work board** (counts of items to process per module, late flags) + user-selected **boxes** | `htdocs/index.php` (`load_board()` per object), `htdocs/core/boxes/`, `htdocs/admin/boxes.php` |

---

## 2. Dashboard viewer & KPI tiles

### Frappe Insights — dashboard reader

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboard page | Responsive grid of chart, filter and text items; refresh with/without cache (`dashboard.refresh`); export PNG; jump to workbook or to the chart in the workbook for users with access | `frontend/src2/dashboard/{Dashboard,DashboardPage,DashboardBody,StaticGridLayout,DashboardActions}.vue`, `view.ts` |
| Dashboard filters | Dashboard-level filter controls linked to columns of charts; default operator/value; icon; one **filter picker** (column → operator → value) used everywhere | `frontend/src2/dashboard/{DashboardFilter,DashboardFilterEditor,FilterIconPicker}.vue`, `filter_storage.ts`, `frontend/src2/components/filter_picker/` |
| Card filters & actions | Per-card filter, find rows in table cards, reset all filters reaching a card, expand full size, view SQL (authors), export rows CSV/XLSX (if permitted) | `frontend/src2/dashboard/{DashboardItemActions,TableCardActions}.vue`, `card_filters.test.ts`; chart features `charts.expand`, `charts.reset-filters`, `charts.export-rows` in `docs/features.md` |
| Number cards | One card per **reading**: value, format, **Period** comparison (`month to date`, `last 3 months`, …), target with gap, "negative is better", sparkline one grain finer | `frontend/src2/charts/components/{NumberCards,NumberReading,NumberValueContext,NumberWindowPicker}.vue`, `charts/window.ts`; ADR `docs/adr/a-number-card-groups-by-its-period.md` |
| Drill-down | Click a bar/wedge/point → **rows** behind the segment (ranked by the clicked measure) or **breakdown** by another dimension; breadcrumb levels; drilled rows link to the desk record; "open as query" | `frontend/src2/charts/drill/{ChartDrillDown,DrillDialog,DrillMenu,DrillBreakdown,DrillRowsView}.vue`, `drill_stack.ts`, `segment_click.ts`; `frontend/src2/charts/record_link.ts` |
| Text items | Markdown/text blocks between charts | `frontend/src2/dashboard/DashboardText.vue` |

### Frappe desk — Number Card and Dashboard Chart (reused on workspaces and dashboards)

| Widget | What it is | Key files |
| --- | --- | --- |
| Number Card | Count/Sum/Average/Min/Max over a DocType with filters (static + dynamic), or a Report field, or a custom method; **percentage stats** vs previous Daily/Weekly/Monthly/Yearly interval; color; currency | `frappe/desk/doctype/number_card/`, `frappe/public/js/frappe/widgets/number_card_widget.js` |
| Dashboard Chart | Chart type Count/Sum/Average/Group By/Custom/Report over a DocType or report; timeseries with timespan (Last Year/Quarter/Month/Week/range) and interval; Line/Bar/Percentage/Pie/Donut/Heatmap; per-chart role restriction; last synced | `frappe/desk/doctype/dashboard_chart/`, `dashboard_chart_source/`, `frappe/public/js/frappe/widgets/chart_widget.js` |
| Chart sources | Code-backed sources for charts that need logic (e.g. account balance timeline, warehouse-wise stock value) | `erpnext/accounts/dashboard_chart_source/`, `erpnext/stock/dashboard_chart_source/` |

### Other KPI tiles

| App | Widget | Key files |
| --- | --- | --- |
| Odoo | Spreadsheet dashboards: KPI cells, pivots, charts, lists, all driven by **global filters** (date, relation, text) with a facet search bar and saved favorite filter sets per user | `odoo/addons/spreadsheet_dashboard/static/src/bundle/{dashboard_action/dashboard_date_filter,dashboard_facet,dashboard_filter_list,dashboard_search_bar,global_filter_widget,pivot,chart,list}/`, `models/spreadsheet_dashboard_favorite_filters.py` |
| Carbon | Module home pages (Sales, Purchasing, Production, Quality, Resources) with a KPI selector: Quotes, RFQs, Sales Funnel, Sales Orders, Sales Revenue; date range and CSV export | `apps/erp/app/routes/x+/sales+/_index.tsx`, `routes/api+/{sales,purchasing,production,quality,resources}.kpi.$key.ts`, `modules/sales/sales.models.ts` (`KPIs`) |
| metasfresh | KPI = SQL or Elasticsearch datasource with chart type Area/Bar/Pie/**Metric**/URLs, comparison offset, staleness seconds, zoom-into-details window; **Target indicator** widget | `backend/de.metas.ui.web.base/.../kpi/descriptor/{KPI,KPIChartType,KPIDatasourceType}.java`, `.../dashboard/DashboardWidgetType.java`, `frontend/src/components/charts/{Indicator,BarChartComponent,PieChartComponent}.js` |
| Akaunting | Widgets: Account Balance, Bank Feeds, Cash Flow, Currencies, Expenses by Category, Payables, Profit & Loss, Receivables | `app/Widgets/*.php`, `resources/views/widgets/` |
| Dolibarr | 66 boxes: lists (last orders/invoices/tickets), graphs (invoices/orders per month/year, product distribution, tickets by severity, **funnel of prospection**), alerts (stock alert, invoices in dispute, customers over outstanding limit), state board | `htdocs/core/boxes/box_*.php`, `htdocs/core/boxes/box_dolibarr_state_board.php`, `htdocs/core/class/dolgraph.class.php` |
| AureusERP | Filament stats-overview and chart widgets per plugin (Projects task-by-stage/state, top assignees/projects; Inventories operation-type cards; Accounting journal charts; POS session stats/top products; Website blog stats) | `plugins/webkul/projects/src/Filament/**/Widgets/`, `inventories/…/Widgets/`, `accounting/…/Widgets/`, `point-of-sale/…/Widgets/`, `website/…/Widgets/` |
| Twenty | Dashboard GRAPH widget: AGGREGATE_CHART (single number), BAR, LINE, PIE over any object with filters and group-by; too-many-groups guard | `packages/twenty-server/src/engine/metadata-modules/page-layout-widget/enums/graph-type.enum.ts`, `packages/twenty-front/src/modules/page-layout/widgets/graph/` |

---

## 3. Dashboard builder & layout

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe Insights | Dashboard builder (in workbook) | Edit mode: add charts (chart selector with search, select all/none), filters, text; drag/resize with push-out; **breakpoints** (arrange per width, narrow grid stacks unarranged cells); number chart = one cell per reading; vertical compaction; discard layout changes | `frontend/src2/workbook/WorkbookDashboard.vue`, `frontend/src2/dashboard/{DashboardBuilder,EditableGridLayout,DashboardChartSelectorDialog,DashboardEditActions}.vue`, `grid_placement.ts`, `builder.ts` |
| Twenty | Dashboard page layout | Dashboards are records (`DASHBOARD` page-layout type) with **tabs**; edit mode via command menu (Edit / Save / Cancel / Duplicate dashboard); grid with drag selector, resize handles; side panel to pick widget type and configure chart, record table or iframe; widget types include GRAPH, RECORD_TABLE, VIEW, IFRAME, rich text, tasks, notes, timeline | `packages/twenty-front/src/modules/page-layout/components/{PageLayoutGridLayout,PageLayoutGridLayoutDragSelector,PageLayoutGridResizeHandle,DashboardPageLayoutEditModeProvider,PageLayoutTabList}.tsx`, `side-panel/pages/page-layout/components/{SidePanelPageLayoutDashboardWidgetTypeSelect,ChartSettings,ChartTypeSelectionSection,ChartFiltersSettings}.tsx`, `side-panel/pages/page-layout/components/dashboard/`, `command-menu-item/engine-command/record/single-record/dashboard/` |
| Ever Gauzy | Custom dashboard canvas | Tab strip of dashboards; **widget palette** fed by a registry (id, title, description, default/min/max size, supported widths, required context org/date range/employee, permission); widget config dialog; layout persisted to DB or local storage | `apps/gauzy/src/app/pages/dashboard/custom-dashboard/{dashboard-canvas,dashboard-tab-strip,widget-palette,widget-config-dialog}.component.ts`, `packages/ui-core/shared/src/lib/dashboard/widgets/{charts,hr,project-management,teams}/*.widgets.ts`, `concretes/strategies/{database,local-storage}-strategy.class.ts`, `packages/contracts/src/lib/dashboard{,-widget}.model.ts` |
| Frappe desk | Workspace editor | Block editor for module pages: header, paragraph, **shortcut** (with count badge), **number card**, **chart**, **quick list**, **links card**, onboarding, custom HTML block; public vs per-user workspaces; parent/child sidebar | `frappe/public/js/frappe/views/workspace/{workspace.js,blocks/}`, `frappe/public/js/frappe/widgets/{shortcut,number_card,chart,quick_list,links,custom_block,onboarding}_widget.js`, `frappe/desk/doctype/workspace/` |
| metasfresh | Dashboard edit | Drag widgets from side nav into the dashboard; per-item chart options (time range, caption) | `frontend/src/components/dashboard/{Sidenav,DndWidget,ChartOptions}.js`, backend `UserDashboardItemAddRequest.java`, `UserDashboardItemChangeRequest.java` |
| Akaunting | Dashboard edit | Name, users who can see it, add/remove/reorder widgets with width | `resources/views/common/dashboards/edit.blade.php`, `resources/views/modals/` |
| Odoo | Spreadsheet editor | Dashboards are authored as spreadsheets (cells, charts, pivots with `ODOO.PIVOT` formulas, global filters) and published; community ships the reader, editing published dashboards uses the spreadsheet engine | `odoo/addons/spreadsheet/static/src/`, `odoo/addons/spreadsheet_dashboard/models/spreadsheet_dashboard.py` (`is_published`, `group_ids`, `company_ids`, `main_data_model_ids`) |
| Dolibarr | Box setup | Admin enables boxes and default positions; each user reorders/hides boxes on the home page | `htdocs/admin/boxes.php`, `htdocs/core/boxes/modules_boxes.php` |

---

## 4. Chart builder & chart types

### Frappe Insights — chart builder over a workbook query

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Chart builder | Pick query; pick type; dimensions (with **grain** day/week/month/quarter/year), measures (sum, count, avg, min, max, distinct count, expression), split-by, tooltip-only measures; preview with rows and SQL; style changes re-render without re-running | `frontend/src2/charts/{ChartBuilder,ChartView}.vue`, `charts/components/{ChartQuerySelector,ChartTypeSelector,DimensionPicker,MeasurePicker,SplitByConfig,TooltipConfig,ChartFilterConfig,ChartSortConfig}.vue`, `chart_preview.ts` |
| Chart types | Number, Bar, Line, Row, Donut, Funnel, Table, Map, Bubble, Sankey, Heatmap | `frontend/src2/types/chart.types.ts` (`CHARTS`); config forms `charts/components/*ChartConfigForm.vue` |
| Axis & series options | Secondary axis, data labels, axis min/max, stacked/normalized bars, smooth lines, **reference lines** (constant or avg/median/min/max/sum), **trend line**, sort, limit | `charts/components/{XAxisConfig,YAxisConfig,ReferenceLinesConfig}.vue`; features `charts.series-align`, `charts.reference-lines`, `charts.bar-normalize` |
| Table chart | Rows × pivot columns × values; pinned and fixed-width columns; color scale; header sort; pager | `charts/components/{TableChart,TableChartConfigForm}.vue` |
| Number format | Shorten large numbers, decimals, prefix/suffix; currency carried by the measure | `charts/components/{NumberFormatFields,NumberFormatSection}.vue`, `charts/number_format.ts` |
| Map | Region map with region-name mapping dialog | `charts/components/{MapChart,MapChartConfigForm,RegionMappingDialog}.vue`, `insights/insights/api/maps.py` |
| Description & info | Short description under the title; longer info behind a mark | `charts/components/{TitleMark,ChartChrome}.vue` |

### Other chart builders

| App | Screen/page | Key files |
| --- | --- | --- |
| Frappe desk | Dashboard Chart form: source DocType or report, based on date field, value-based-on, group-by field + aggregate, number of groups, timespan/interval, heatmap year, color, show values | `frappe/desk/doctype/dashboard_chart/dashboard_chart.{json,js}` |
| Frappe desk | Report-view **Set Chart** / **Create Chart** / **Create Card**: turn the current list or report into a chart or number card and add it to a workspace | `frappe/public/js/frappe/views/reports/report_view.js`, `query_report.js` |
| Twenty | Chart settings side panel: data source object + view, aggregate field/operation, group-by (primary + secondary), date granularity, filters, chart limit banner | `packages/twenty-front/src/modules/side-panel/pages/page-layout/components/{ChartSettings,ChartFiltersSettings,ChartLimitInfoBanner}.tsx`, `chart-settings/` |
| Odoo | Graph view: Bar/Line/Pie, measures, stacked, cumulative, sort ascending/descending, group-bys from search | `odoo/addons/web/static/src/views/graph/{graph_controller.xml,graph_renderer.js,graph_arch_parser.js}` |
| Akaunting | Report chart config (bar/donut) attached to each report class | `app/Abstracts/Report.php` (`chart` options) |
| Dolibarr | Custom report graph type and measures (see §5) | `htdocs/core/customreports.php` |

---

## 5. Query / report builder

### Frappe Insights — workbook query editor (builder, SQL, script)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Workbook shell | Tabs for queries, charts, dashboards; sidebar with folders; lineage graph (table → query → chart → dashboard); duplicate; share; export to app | `frontend/src2/workbook/{Workbook,WorkbookNavbar,WorkbookSidebar,WorkbookSidebarFolders,WorkbookTabSwitcher,WorkbookLineageDialog,WorkbookShareDialog,WorkbookExportToAppDialog}.vue` |
| Query interface picker | New query opens as **builder**, **SQL** or **script** | `frontend/src2/query/components/{QueryBuilder,NativeQueryEditor,ScriptQueryEditor}.vue`; `CONTEXT.md` "Query interface" |
| Builder pipeline | Ordered **operations**: source (table or another query), join (inner/left/right/full, expression joins, suggested joins from table links), union, filter group (And/Or, relative dates incl. fiscal years), select/rename/remove/cast, mutate (calculated column), summarize (grain), order by, limit, window ops, pivot wider, custom operation | `frontend/src2/types/query.types.ts`, `query/components/{AddOperationPopover,QueryOperations,JoinSelectorDialog,UnionSelectorDialog,FiltersSelectorDialog,SummarySelectorDialog,PivotSelectorDialog,NewColumnSelectorDialog,ColumnsSelectorDialog}.vue` |
| Result grid | Paged result with row count; column header menu: quick filter, sort, rename, type change, remove; conditional formatting; schema explorer; view SQL | `query/components/{QueryDataTable,QueryBuilderTable,ColumnFilter,ColumnSort,ColumnRename,ColumnTypeChange,ConditonalFormattingDialog,SchemaExplorer,ViewSQLDialog}.vue`, `query/result_table.ts` |
| Expression editor | Ibis-based expressions with autocomplete and function list; period helpers (`previous_period_value`, `percentage_change`), `date_diff`; sandboxed, cannot write or reach files; trusted-code rules for scripts/`.sql` | `query/components/{ExpressionEditor,InlineExpression}.vue`; `docs/adr/code-in-a-query-follows-the-server-script-model.md` |
| Source selector | Pick data source → table, or a workbook query | `query/components/source_selector/{SourceSelectorDialog,DataSourceSelector,DataSourceTableList,WorkbookQueryList}.vue` |
| Query variables | Named secrets/values for script queries | `insights/insights/doctype/insights_query_variable/` |

### Frappe desk — Report Builder, Query Report, Script Report

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Report Builder (report view) | Any list as a grid: Pick Columns (incl. child-table fields), Add Column, Group By with aggregates, Show Totals, sort, filters, **Save As** named report, Export, Print, Setup Auto Email, Set Chart | `frappe/public/js/frappe/views/reports/report_view.js`, `frappe/core/doctype/report/` (`report_type` Report Builder/Query/Script/Custom) |
| Query/Script report page | Filter bar defined by the report, result grid with tree/indent, optional chart on top, totals row, print with letter head, export, **prepared report** (queued in background, Generate New Report) | `frappe/public/js/frappe/views/reports/query_report.js`, `frappe/core/doctype/prepared_report/` (status Queued/Started/Completed/Error, peak memory) |
| Report permissions | Report → roles; disabled flag; timeout; `add_total_row` | `frappe/core/doctype/report/report.json` |

### Other builders

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Dolibarr | **Custom reports** | Pick object type; measures (count/sum/avg of fields), X axis, group-by; table and graph modes; also embeddable as a tab on an object | `htdocs/core/customreports.php` (`search_measures`, `search_xaxis`, `search_groupby`, `search_graph`) |
| Akaunting | Custom report from report class | Name, class (Income, Expense, Income vs Expense, Profit & Loss, Tax, Discount), description, class-specific fields: date field/range, basis (cash/accrual), period (monthly/quarterly/yearly), group, filters (category, account, contact, item, tax, warehouse, currency) | `resources/views/common/reports/{create,edit,index}.blade.php`, `app/Abstracts/Report.php` (strip/display/filter sections), `app/Reports/*.php` |
| ERPNext | Financial Report Template | Row-based custom financial statements (account categories, formulas) feeding Custom Financial Statement report | `erpnext/accounts/doctype/{financial_report_template,financial_report_row,account_category}/`, `erpnext/accounts/report/custom_financial_statement/` |
| Moqui baseline | SimpleReport / Data Views | See §16: DataDocument-based "Edit and Report Builder" and DbViewEntity data views | `component/MrSimpleScreens/screen/SimpleScreens/SimpleReport/`, `base-component/tools/screen/Tools/DataView/` |

---

## 6. Pivot & graph views over list data

The design already calls for switchable views on every find screen (list, kanban,
calendar, pivot, graph). Insights should own the pivot/graph engine used there.

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | Pivot view | Row/column group-bys from search, Measures menu (incl. Count), Expand all / collapse, Flip axis, Download xlsx, totals; header click drills into the list | `odoo/addons/web/static/src/views/pivot/{pivot_controller.xml,pivot_model.js,pivot_renderer.js}` |
| Odoo | Graph view | Bar/Line/Pie, Stacked, Cumulative, sort, measures | `odoo/addons/web/static/src/views/graph/` |
| Odoo | Analysis report models | Each app's **Reporting** menu is pivot/graph over a SQL-view model: `sale.report`, `account.invoice.report`, `purchase.report`, `crm.activity.report`, `project.report`, `report.stock.quantity`, `pos.order.report`, `timesheets.analysis.report`, `hr.leave.report`, `mailing.trace.report`, `fleet.vehicle.cost.report`, `vendor.delay.report`, … | `odoo/addons/{sale,account,purchase,crm,project,stock,point_of_sale,hr_timesheet,hr_holidays,mass_mailing,fleet,purchase_stock}/report/*_report.py` (`_auto = False`) |
| Carbon | Analytics pivot reports | `/x/reports/analytics/<key>`: revenue (by customer), expenses/assets/inventory-change (by location), scrap (by scrap reason); up to 2 row dimensions, column axis by period (month/quarter/year) or dimension, measure amount/quantity/count, percent of column total, sort, filters, all in URL; saved **report views** (Private/Company); CSV export | `apps/erp/app/routes/x+/reports+/analytics.$reportKey.tsx`, `apps/erp/app/modules/accounting/accounting.models.ts` (`analyticsReports`, `pivotStateValidator`, `reportViewValidator`) |
| Frappe desk | Group-by sidebar & report view group-by | List sidebar counts by field; report view Group By with aggregates | `frappe/public/js/frappe/views/reports/report_view.js`, `frappe/desk/doctype/list_view_settings/` (`disable_sidebar_stats`) |
| Twenty | View aggregates | Per-column aggregate footer (count, sum, avg, min, max, percent empty) and group-by in record table views; kanban grouped by select field | `packages/twenty-front/src/modules/object-record/`, `packages/twenty-front/src/modules/views/` |
| Dolibarr | Module stats pages | Fixed per-module statistics: counts/amounts by month and year with graphs, filter by user/third party/status | `htdocs/{commande,comm/propal,compta/facture,expedition,reception,contrat,fichinter,ticket,projet,expensereport,salaries,don,adherents,product}/stats/` |

---

## 7. Canned report catalogs & report pages

| App | Catalog | What's in it | Key files |
| --- | --- | --- | --- |
| ERPNext | Per-module report lists on workspaces (Card Breaks such as Sales Reports, Customer Reports, Sales Team Reports) | ~220 reports: 62 Accounts (P&L, Balance Sheet, Cash Flow, Trial Balance, Financial Ratios, AR/AP aging, Gross Profit, Profitability Analysis, Budget Variance, consolidated statements, …), 59 Stock, 24 Selling (Sales Analytics with tree type Customer/Item/Territory/Project, Quotation Trends, Sales Order Analysis, target variance by person/partner/territory, inactive customers, …), 23 Manufacturing, 11 Buying, 10 CRM, 6 Projects, 5 Support | `erpnext/<module>/report/`, `erpnext/selling/workspace/selling/selling.json`, `erpnext/selling/report/sales_analytics/sales_analytics.js` |
| ERPNext | Analytic pages | Sales Funnel page; Stock Balance and Warehouse Capacity Summary pages; Production Plan visualizer; BOM comparison | `erpnext/selling/page/sales_funnel/`, `erpnext/stock/page/{stock_balance,warehouse_capacity_summary}/`, `erpnext/manufacturing/page/{production_plan_visualizer,bom_comparison_tool}/` |
| Carbon | **Reports hub** inside Accounting with **pins** (pin/unpin per report) and saved views; full-screen report pages: Income Statement, Balance Sheet, Trial Balance (drill to account), **Executive P&L**, AR/AP aging, Inventory valuation (+ reconcile), Purchases, Revenue waterfall, Lease liabilities / net investment, Rental utilization | `apps/erp/app/routes/x+/accounting+/reports.tsx` (`getReportPins`, `upsertReportPin`, `getReportViews`), `apps/erp/app/routes/x+/reports+/*.tsx` |
| Ever Gauzy | Reports menu | All reports, time reports, weekly time, manual time, time-limit, apps & URLs (activity), amounts owed, payment, expenses, project budgets, client budgets | `apps/gauzy/src/app/pages/reports/*/` |
| Akaunting | Reports index | Income Summary, Expense Summary, Income vs Expense, Profit & Loss, Tax Summary, Discount Summary; each with chart, filter bar, print, export | `app/Reports/*.php`, `resources/views/common/reports/index.blade.php`, `resources/views/reports/` |
| Dolibarr | Accounting results & turnover | Results (client/supplier, by project), turnover by product/service, by user, by customer, by country/VAT rate, supplier turnover by product/third party | `htdocs/compta/resultat/{index,clientfourn,projects,result}.php`, `htdocs/compta/stats/*.php` |
| Odoo | App **Reporting** menus | Pivot/graph analysis per app (see §6) plus PDF/QWeb printable reports | `odoo/addons/*/report/` |

---

## 8. Saved reports, views & favorites

| App | Feature | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | Favorites (`ir.filters`) | Save current search (domain, group-by, sort, context) as a favorite on an action; private or shared with users; default filter | `odoo/odoo/addons/base/models/ir_filters.py`, `odoo/addons/web/static/src/search/{custom_favorite_item,search_bar_menu}/` |
| Odoo | Add to my dashboard | Push the current list/graph/pivot (with its search) onto the user's board | `odoo/addons/board/static/src/add_to_board/` |
| Odoo | Dashboard favorite filters | Named global-filter sets per dashboard; default; shared with users | `odoo/addons/spreadsheet_dashboard/models/spreadsheet_dashboard_favorite_filters.py` |
| Frappe desk | Saved reports & list settings | Report Builder **Save As** creates a `Report` (type Report Builder, JSON settings); per-user list view settings; sidebar saved filters; kanban boards saved per DocType | `frappe/core/doctype/report/`, `frappe/desk/doctype/{list_view_settings,list_filter,kanban_board}/` |
| Frappe Insights | Favorites & folders | Favorite dashboards; folders inside workbooks for queries and charts | `frontend/src2/dashboard/DashboardList.vue`, `insights/insights/doctype/insights_folder/` |
| Carbon | Report views & pins | Named pivot configs, Private or Company visibility; pinned reports on the hub | `apps/erp/app/modules/accounting/accounting.models.ts` (`reportViewValidator`, `reportPinValidator`), `routes/x+/reports+/views.$viewId.delete.tsx` |
| Twenty | Views | Saved views per object (table/kanban/calendar), filters, sorts, visible fields, group-by; views feed dashboard widgets (VIEW, RECORD_TABLE) | `packages/twenty-front/src/modules/views/` |
| Moqui baseline | Saved finds | `form-list saved-finds="true"` stores column sets and parameters as `FormListFind` per user/group; `FormConfig` per user | `base-component/framework/entity/ScreenEntities.xml` (`FormListFind*`, `FormConfig*`) |

---

## 9. Scheduled delivery, digests & alerts

| App | Feature | What it is | Key files |
| --- | --- | --- | --- |
| Frappe desk | **Auto Email Report** | Report + filters + dynamic date period (Daily … Yearly, first day of period), frequency Daily/Weekdays/Weekly/Monthly, day of week, format HTML/XLSX/CSV/PDF, row limit, **send only if data**, recipients, sender account | `frappe/email/doctype/auto_email_report/auto_email_report.json` |
| Frappe Insights | **Alerts** | On a query: frequency Hourly/Daily/Weekly/Monthly/Cron, condition (builder or custom code), Markdown message with field tokens, channel **Email/Telegram/Webhook** (versioned payload, token header, row cap), runs with the permissions of whoever enabled it; last/next execution | `insights/insights/doctype/insights_alert/`, `frontend/src2/query/components/{AlertSetupDialog,QueryAlerts,QueryAlertsDialog}.vue`, `frontend/src2/query/alert.ts`; ADR `docs/adr/outbound-http-to-user-chosen-urls.md` |
| Odoo | **Digest emails** | Periodic KPI email (daily/weekly/monthly/quarterly) to selected users; KPIs are Boolean toggles contributed by modules: Revenue, New Leads, Opportunities Won, New Employees, Open Tasks, Deliveries, Receipts, POS Sales, Visitors, Tracked Page Views, Livechat conversations/rating/response time, Connected Users, Messages Sent; subscribe/unsubscribe; tips | `odoo/addons/digest/models/digest.py`, `views/digest_views.xml`, `views/digest_templates.xml`, `data/ir_cron_data.xml`; KPI fields in the 13 `odoo/addons/*/models/digest.py` overrides (crm, account, stock, project, …) |
| metasfresh | KPI staleness | `KPI_AllowedStaledTimeInSec` cache; websocket push of dashboard updates | `backend/de.metas.ui.web.base/.../dashboard/websocket/` |
| Moqui baseline | **ScreenScheduled** | Scheduled render of a report screen (with a saved find) by cron to CSV/xlsx/PDF, email to a user or user group via EmailTemplate, or save to a resource location; abort if no results | `base-component/framework/entity/ScreenEntities.xml` (`ScreenScheduled`, `ScreenScheduledLock`) |
| ServiceJobMonitor (3p_moqui) | Monitor bounds & alerts | Watches ServiceJob results against bounds; alerts and charts | `3p_moqui/ServiceJobMonitor/screen/MonitorAdmin/{Alerts,Charts,Monitor}.xml` |

---

## 10. Sharing, public links & embedding

| App | Feature | What it is | Key files |
| --- | --- | --- | --- |
| Frappe Insights | Visibility & share dialog | Chart/dashboard **Visibility** Private/Roles/Everyone/Public; share to named users (read); copy public link or iframe snippet; only workbook editors can widen; visitors get no drill, rows or files; amounts in site currency | `frontend/src2/dashboard/DashboardShareDialog.vue`, `frontend/src2/charts/components/{ChartShareDialog.vue,chart_share.ts}`, `frontend/src2/workbook/WorkbookShareDialog.vue`, `frontend/src2/{dashboard/SharedDashboard,charts/SharedChart}.vue`; `insights_dashboard_v3.visibility` |
| Frappe Insights | **Islands** | Insights dashboards/charts mount inside desk Dashboards/Dashboard Charts and workspace pages (shadow root), so the module dashboard can be an Insights one | `frontend/src2/islands/{DashboardIsland,ChartIsland}.vue`, `docs/features.md` §desk |
| Odoo | Dashboard share links | Token links (`spreadsheet.dashboard.share`) with frozen Excel export; public dashboard page | `odoo/addons/spreadsheet_dashboard/models/spreadsheet_dashboard_share.py`, `static/src/public/public_dashboard.{js,xml}` |
| Odoo | Dashboard access | Per dashboard: access groups, allowed users, companies, published flag | `odoo/addons/spreadsheet_dashboard/models/spreadsheet_dashboard.py` |
| Twenty | Dashboard iframe widget | IFRAME widget embeds external pages into dashboards | `packages/twenty-front/src/modules/page-layout/widgets/iframe/`, `side-panel/pages/page-layout/components/dashboard/SidePanelDashboardIframeSettings.tsx` |
| Akaunting | Dashboard users | Dashboards assigned to users | `resources/views/common/dashboards/edit.blade.php` |

---

## 11. Data sources, data store & semantic layer

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe Insights | Data source list & connect dialogs | Site DB plus external MariaDB, PostgreSQL (schema), DuckDB, ClickHouse, BigQuery, SQLite, **REST API** sources (auth types); SSL/CA; credentials never reach non-admins; CSV upload as table | `frontend/src2/data_source/{DataSourceList,Connect*Dialog,UploadCSVFileDialog}.vue`, `insights/insights/doctype/insights_data_source_v3/` |
| Frappe Insights | Tables & links | Table list per source with search and re-sync; **table links** (stored joins) suggest joins | `frontend/src2/data_source/{DataSourceTableList,DataSourceTable}.vue`, `doctype/insights_table_v3/`, `doctype/insights_table_link_v3/` |
| Frappe Insights | **Data store** | Site-local DuckDB copy of source tables with cron import schedule, scripted import jobs (sandboxed), atomic import, compaction; settings for max memory/records | `frontend/src2/data_store/{DataStoreList,ImportTableDialog}.vue`, `doctype/insights_table_import_job/`, `doctype/insights_table_import_log/`, `frontend/src2/settings/DataStoreSettings.vue` |
| Frappe Insights | Settings | Auto-execute, query result limit/expiry, subquery, permissions toggle, allow download + max export rows, fiscal year start, week start, max execution time, Telegram token, allowed embed origins | `insights/insights/doctype/insights_settings/`, `frontend/src2/settings/{GeneralSettings,PermissionsSettings,UsersSettings}.vue` |
| metasfresh | KPI definition | SQL from/where/group-and-order, details where clause, source table, Elasticsearch index/query/time range, apply security settings | `backend/de.metas.ui.web.base/src/main/java-gen/de/metas/ui/web/base/model/I_WEBUI_KPI.java`, `I_WEBUI_KPI_Field.java` |
| Odoo | Reporting models | Analysis = SQL views registered as read-only models (see §6); spreadsheet data sources reference models + domains | `odoo/addons/*/report/*_report.py`, `odoo/addons/spreadsheet/` |
| Moqui baseline | Data documents, data views, OLAP dimensions | `DataDocument` (primary entity + fields + conditions, per user group), `DbViewEntity` (user-built joins), `moqui.olap` `DateDayDimension`/`CurrencyDimension` and Mantle dimensions (Party, PartyClass, Product, ProductClass, EmplPositionClass, MarketSegment) | `base-component/framework/entity/{EntityEntities,OlapEntities}.xml`, `component/mr-mantle-udm/entity/` |

---

## 12. Analytics content permissions

| App | Model | Key files |
| --- | --- | --- |
| Frappe Insights | Roles Insights Admin / User; **teams** granted data sources and tables (table restrictions); workbook share as viewer/editor; member write follows workbook; **Run as owner** check on charts (rows filtered by owner vs reader); permlevel columns "held back"; denied = Not Found; viewers get no operations/SQL | `insights/insights/doctype/{insights_team,insights_team_member,insights_resource_permission}/`, `frontend/src2/teams/{TeamList,CreateTeamDialog,ManageTeamDialog,TeamResourceSelector}.vue`, `insights/insights/permissions.py`, `docs/features.md` §permissions |
| Frappe desk | Report → roles; Dashboard Chart → roles; Number Card is_public; workspace roles; user permissions applied to report rows | `frappe/core/doctype/report/`, `frappe/desk/doctype/{dashboard_chart,number_card,workspace}/` |
| Odoo | Dashboard groups/users/companies; record rules apply to pivots | `odoo/addons/spreadsheet_dashboard/models/spreadsheet_dashboard.py` |
| Carbon | `requirePermissions(view: "accounting")` on reports; report view Private/Company | `apps/erp/app/routes/x+/reports+/*.tsx` |
| metasfresh | KPI permissions provider + "apply security settings" | `backend/de.metas.ui.web.base/.../kpi/data/KPIPermissionsProvider.java` |
| Moqui baseline | `DataDocumentUserGroup`; artifact authz on screens; `EntityFilterSet` row filters | `base-component/framework/entity/{EntityEntities,SecurityEntities}.xml` |

---

## 13. Business flow map & process documentation

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Moqui baseline | **MarbleERP dashboard flow map** | Top: search box and quick counters (Sales Placed/Approved/Held orders; customer Requests Submitted/In Progress). Body: three **sequence diagrams** (actor + arrowed items): **Customers** → Customer Requests, Sales Orders & Quotes, Sales Shipments, Shipping pick & pack, Receivable Invoices, Customer Credit Memos, Customer Payments, Sales Returns & RMA, Customer Return Shipments, Payable Return Invoices, Outgoing Refund Payments; **Internal** → HR/Employees, Requests, Products/Catalog, Assets/Inventory, Manufacturing, Projects/Tasks, All Parties, Facilities, Stores, Content (Wiki, Blogs, Surveys), Accounting/Reports, Custom Reports/Report Builder; **Suppliers** → Purchase Requests, Purchase Orders & Quotes, Purchase Shipments, Payable Invoices, Supplier Credit Memos, Supplier Payments, Purchase Returns, Supplier Return Shipments, Receivable Return Invoices, Incoming Refund Payments. Every item is a link with a parameter map into a find screen | `component/MrMarbleERP/screen/marble/dashboard.xml` (styles `diagram-sequence`, `diagram-sequence-actor`, `diagram-sequence-item`) |
| coarchy | **Process stories** | Nested process stories (substories, show/hide), activities with actor and action, value statements, checklists, recurrence (every day, Mon–Fri, monthly), copy/move between organizations | `3p_moqui/coarchy/screen/coarchy/cointernal/{Process.xml,Process/,Actor.xml,ViewActors.xml,ValueStatements.xml,Checklist.xml}` |
| ERPNext / Frappe | Module onboarding & workspace link cards | Onboarding steps per module and link-card groups act as a map of what to do in what order | `frappe/desk/doctype/{module_onboarding,onboarding_step}/`, `erpnext/*/workspace/*/` |
| Frappe Insights | Lineage graph | Table → query → chart → dashboard graph with click-to-open (a data-flow map) | `frontend/src2/workbook/WorkbookLineageDialog.vue`, `insights/insights/api/ai/lineage.py` |

No reference app ships a clickable business-process map with live counts on each step;
the Marble diagram is the closest and is unique.

---

## 14. AI & agent-assisted analytics

| App | Feature | Key files |
| --- | --- | --- |
| Frappe Insights | Agent tooling: workbook skill, run an unsaved pipeline, profile a column (row/null/distinct counts, range, top values), verify a workbook (every query/chart runs, every dashboard item readable), query lineage in one call; all respect caller access | `insights/insights/api/ai/{lineage,search,verify}.py`, `skills/`, `docs/features.md` §tooling |
| Twenty | AI agent chat over CRM data | `packages/twenty-front/src/modules/ai/`, `packages/twenty-front/src/pages/ai-chat/` |
| Carbon | ERP agent module | `apps/erp/app/modules/agent/` |

---

## 15. Cross-app surfaces

- **Module landing pages.** ERPNext workspaces and Carbon module homes reuse number cards
  and charts; Insights should own the widget types and let each IronStone app's landing
  page place them (initial-design "Configurable workspace pages per module").
- **Switchable views.** Odoo pivot/graph on every action and Twenty view aggregates show
  pivot/graph belongs to the generic find screen; Insights provides the engine and the
  "save to dashboard" action (Odoo board, Frappe Create Card/Chart).
- **Today panel.** Header Today panel counts (tasks due, overdue) are KPI readings; the
  same number-card definition can feed both.
- **Assist.** Insights' agent APIs (profile, verify, lineage) are what Assist would call to
  answer "why did revenue drop" without clicking.
- **Drill to records.** Insights drill rows link to desk records; in BOSS drill rows should
  open the shared record screens (Order detail, Customer 360, Product 360).

---

## 16. Current Moqui baseline

### Screens

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Marble dashboard | Search + counters + clickable flow map (§13) | `component/MrMarbleERP/screen/marble/dashboard.xml` |
| Marble root | Mounts SimpleScreens apps (Accounting, Asset, Catalog, Customer, Facility, HumanRes, Manufacturing, Order, Party, Project, ProductStore, Gateway, Request, Return, Shipment, Shipping, Supplier, Survey, Task, Wiki) | `component/MrMarbleERP/screen/marble.xml` |
| Accounting report list | Balance Sheet, Income Statement, Cash Flow, Retained Earnings, Financial Ratios, Sales Summary, Sales Order Analysis, Sales Invoice Analysis, Customer Statement PDF, Order Item Summary, Order Issued and Invoiced, Invoice Item Summary, Quick Aging, Invoice Aging Detail, AR Aging Summary, Invoice Reconciliation, Account Ledger, Account Balance History (year/quarter/month), Posted Amount/Balance Summary, Inventory Valuation, Receipt Transactions, asset on-hand reports, shipment package summary | `component/MrSimpleScreens/screen/SimpleScreens/Accounting/Reports/ReportList.xml`, `Accounting/Reports/*.xml` |
| Sales summary charts | Chart.js charts and stats panels for sales summary | `component/MrSimpleScreens/screen/SimpleScreens/Accounting/Reports/SalesSummary{Charts,Stats}.html.{ftl,fancy}`, `component/MrSimpleScreens/template/account/LedgerCharts.xml` |
| Accounting dashboard | Org internal summary | `component/MrSimpleScreens/screen/SimpleScreens/Accounting/{dashboard.xml,dashboard/OrgInternalSummary.xml}` |
| Other module dashboards | Link pages for HumanRes, Asset, Manufacturing, Catalog, Shipping | `component/MrSimpleScreens/screen/SimpleScreens/*/dashboard.xml` |
| Budget report, project progress | Single-purpose reports | `component/MrSimpleScreens/screen/SimpleScreens/Accounting/Budget/BudgetReport.xml`, `Project/ProjectProgressReport.xml` |
| **SimpleReport** (Edit and Report Builder) | Find/create a report = `DataDocument` (name, primary entity, user group); edit fields and conditions; view as dynamic form-list with CSV/XLSX export and saved finds; quick view | `component/MrSimpleScreens/screen/SimpleScreens/SimpleReport/{FindReport,EditReport,EditReport/FieldList,ViewReport,QuickViewReport}.xml` |
| Tools Data Views | Build a `DbViewEntity` (member entities, aliases, key maps) and view results | `base-component/tools/screen/Tools/DataView/{FindDbView,EditDbView,ViewDbView}.xml` |
| System Data Documents | Edit/search/export data documents; feed index | `base-component/tools/screen/System/DataDocument/{Edit,Search,Export,Index,ViewDocument}.xml` |
| Scheduled finds (My Account) | User's list of scheduled report renders: screen path + saved find, cron (with picker), render mode, email template/subject, save-to location, no-results abort, from/thru | `component/MrSimpleScreens/screen/MyAccount/User/{ScheduledFinds.xml,ScheduledFinds/EditScheduledFind.xml}` (copied to `component/ironstone-boss/screen/Base/User/ScheduledFinds/`) |
| IronStone BOSS today | `boss.xml` root mounts QuickSearch, Search, QuickLookup and **SalesSummary**; copies of SalesSummary/SalesAnalysis reports with fancy charts and of SimpleReport already live in the component | `component/ironstone-boss/screen/{boss.xml,Reports/,SimpleReport/}` |

### Data model available

| Entity | What it gives Insights | Key files |
| --- | --- | --- |
| `moqui.entity.document.DataDocument` (+ Field, Condition, RelAlias, Link, UserGroup) | A named, permissioned dataset over a primary entity with relationship paths | `base-component/framework/entity/EntityEntities.xml` |
| `moqui.entity.view.DbViewEntity` (+ Member, Alias, KeyMap) | User-defined joins/aliases | same |
| `moqui.screen.form.FormListFind*`, `FormConfig*` | Saved finds (columns, parameters, sort) per user/group | `base-component/framework/entity/ScreenEntities.xml` |
| `moqui.screen.ScreenScheduled` | Scheduled report renders to email/resource | same |
| `moqui.olap.DateDayDimension`, `CurrencyDimension`; Mantle `*Dimension` entities | Star-schema dimensions for analytics | `base-component/framework/entity/OlapEntities.xml`, `component/mr-mantle-udm/entity/` |
| `moqui.server.ArtifactHit*`, `Visit` | Usage stats (also Admin) | `base-component/framework/entity/ServerEntities.xml` |

---

## 17. Gaps & BOSS implications

### Notable gaps in the Moqui baseline

- **No dashboard object.** Module dashboards are hand-written screens; there is no
  user-arrangeable dashboard, no widget registry, no number-card or chart definition
  stored as data.
- **No chart builder.** Charts exist only in a few FTL templates; nothing lets a manager
  turn a list into a chart (Frappe Create Chart, Odoo graph view, Twenty GRAPH widget).
- **Report builder is flat.** SimpleReport (DataDocument) gives columns + conditions + CSV
  but no group-by/aggregate, pivot, calculated measure, period comparison or chart.
- **No pivot/graph view mode** on find screens.
- **No alerts.** ScreenScheduled can email a report on cron (My Account → Scheduled
  Finds), but it is per user, buried in My Account, and there is no condition-based alert
  (Insights alerts, Odoo digest).
- **Flow map is static XML** with a few hand-coded counters; it is not data-driven, not
  editable, and does not show counts on each step.

### What each reference contributes

| Reference | Take |
| --- | --- |
| Frappe Insights | Reader vs author split (dashboards vs workbooks); query as operation pipeline; chart types incl. Number readings with period, target and sparkline; drill rows/breakdown with record links; dashboard filters linked to chart columns; visibility levels + run-as-owner; alerts over email/webhook; data store; agent verify/profile/lineage APIs; ship standard dashboards as files |
| Frappe desk / ERPNext | Number Card and Dashboard Chart as reusable data definitions; workspace block editor; Report Builder (save as, group by, totals); query reports with prepared (background) runs; Auto Email Report with "send only if data" |
| Odoo | Pivot/graph on every list; SQL-view analysis models per app; favorites and "add to my dashboard"; dashboards in sections with sample data until real data exists; global filters with saved sets; digest email with module-contributed KPIs; share links |
| Twenty | Dashboards as records with tabs; widget side panel; chart over a saved view; iframe widget |
| Carbon | Pinned reports hub; URL-encoded pivot state with saved views (Private/Company); executive P&L and revenue waterfall pages; per-module KPI selector |
| Ever Gauzy | Widget registry with size constraints, required context and permission; multiple custom dashboards per user |
| metasfresh | KPI with comparison offset and staleness; target indicator widget; zoom-into-details |
| Dolibarr | Global work board ("to process / late" counts per module) as the owner's first screen; custom report screen embeddable as a tab |
| Akaunting | Small-business report set with basis/period/grouping and a filter bar |
| coarchy | Process stories with actors and substories as editable process documentation |

### Recommended screen inventory (IronStone Insights)

| Area | Screens |
| --- | --- |
| Home | Insights home: favorite and recent dashboards, pinned reports, "needs attention" work board (counts to process / late per app, Dolibarr-style), digest preview |
| Dashboards | Dashboard list (sections, favorites, search); dashboard viewer (filters, number cards with period/target/sparkline, charts, tables, text, drill); dashboard editor (grid, breakpoints, add widget from registry, link filters) |
| Widgets | Number card editor and chart editor over a dataset (entity/DataDocument/report), chart types Number, Bar, Line, Row, Donut, Funnel, Table/pivot, Heatmap, Map later; "add to dashboard" from any find screen |
| Report builder | Dataset editor (primary entity + related fields, conditions, calculated fields); analysis view (group-by, measures, pivot, totals, chart); SQL/script mode for admins only |
| Saved reports | Report catalog by app with pins; saved views (private / group / everyone); per-app canned reports registered into the catalog |
| Delivery & alerts | Scheduled report (promote the Scheduled Finds screen: cron, format, recipients incl. groups, send only if data); KPI alert (condition on a reading → notification, email, chat, webhook); management digest (periodic KPI email) |
| Sharing | Share dialog (users, groups, public link with token, embed), read-only public dashboard page |
| Flow map | Business flow map viewer (actors, steps, live counts, links into apps) and editor (steps as data, linked to find screens and saved views); process story pages linked from steps |
| Data | Datasets and dimensions admin (DataDocuments, view entities, OLAP dimensions); data refresh jobs |

### Data-model implications

- Store dashboards, widgets (number card, chart, table, text, link list) and widget
  placement as entities; use `DataDocument` + `FormListFind` as the dataset/saved-find
  basis instead of inventing a query store, and extend with aggregates, group-by and
  calculated fields.
- Reuse `ScreenScheduled` for scheduled reports; add an alert entity (dataset/reading,
  condition, frequency, channel, recipients, last/next run) that posts through
  NotificationMessage / SystemMessage.
- Flow map as data: map → lanes (actor) → steps (label, target screen + parameter map or
  saved find, count query, sequence). Marble's three lanes are the seed data.
- Permissions: dataset → user group (exists), dashboard visibility levels, and a
  run-as-viewer default so row-level `EntityFilterSet` rules apply.

### First-release cut

Dashboard list + viewer + editor with number cards, bar/line/donut/table charts over
DataDocuments; "add chart/card to dashboard" from find screens; report catalog with pins
seeded from the SimpleScreens accounting reports; saved views; scheduled reports (the
existing Scheduled Finds screen, reachable from each report); the Marble flow map converted to data with live counts. Defer SQL/script
queries, external data sources and data store, map/sankey/bubble charts, public links,
alert conditions beyond thresholds, and the agent APIs to a second pass.

### Open questions

- Is the Insights widget the same object as each app's landing-page tile (one registry), or
  do apps keep hand-built landing screens that embed Insights widgets?
- How far does the report builder go: DataDocument + aggregates, or a pipeline model like
  Insights operations?
- Do we need a site-local analytics store (DuckDB-like) for heavy reports, or are Moqui
  view-entities and OLAP dimensions on the main DB enough for target businesses?
- Should the flow map be one fixed suite map, or editable per business (coarchy-style
  process stories) with the suite map as the default?
- Public/anonymous dashboard links: allowed at all given the self-hosting audience?

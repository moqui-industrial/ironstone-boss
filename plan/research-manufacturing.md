# IronStone BOSS — Manufacturing app research

Oct 18, 2026

Deeper research pass on the **IronStone Manufacturing** app (work orders and production
runs, BOMs and routings, planning/MRP, and the shop floor: material issue and time),
cataloguing every relevant screen/page found in the reference apps. Companion to
[3p-app-reference.md](3p-app-reference.md); feeds the Manufacturing row in
[initial-design.md](initial-design.md) plus the manufacturing faces of the shared
Product 360, Inventory and Maintenance screens.

**Organization.** Sorted by functional area (not by app): all BOM screens together, all
shop-floor screens together, etc. Within each area, sub-tables per reference app. Style
mirrors [research-warehouse.md](research-warehouse.md) and
[research-accounting.md](research-accounting.md).

**Scope.** Business UI only: screens, lists, forms, kanban/calendar boards, dialogs,
scan flows and report pages a production planner or shop-floor user actually touches.
Scheduling algorithms, MRP netting logic and costing math are noted only where they shape
a screen (statuses, quantity fields, exceptions, validation gates). Purchasing,
warehouse receiving/picking and accounting valuation screens are covered only where
Manufacturing links into them.

**Path conventions.** Paths are relative to each repository's own root, as in
3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — `odoo/addons/<addon>/views/` (XML views/actions/menus), `<addon>/models/`, `<addon>/wizard/`, `<addon>/static/src/` (OWL) |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — paths relative to `erpnext/`; manufacturing in `erpnext/manufacturing/` (doctype dirs with `.json`/`.js`/`.py`, `workspace/`, `report/`, `dashboard_chart/`, `number_card/`), quality in `erpnext/quality_management/`, subcontracting in `erpnext/subcontracting/` |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — ERP UI under `apps/erp/app/modules/production/ui/` and `apps/erp/app/routes/x+/…`; MES/shop floor under `apps/mes/app/`; shared planning primitives in `packages/planning/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament resources/pages under `plugins/webkul/manufacturing/src/Filament/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — manufacturing pages under `htdocs/mrp/`, BOM under `htdocs/bom/`, workstations under `htdocs/workstation/`, descriptors in `htdocs/core/modules/{mrp,bom,workstation}/` |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — React WebUI in `frontend/src/`; manufacturing backend modules under `backend/de.metas.manufacturing*`, planning candidate UI in `frontend/src/components/ppOrderCandidate/` |

Not used here: Nextcloud, Zimbra, Signal, Twenty, Akaunting, Ever Co and the groupware
sources from the drawers-commons pass ship no production/manufacturing UI. Moqui
components in the checkout (Sales, WorkManagement, WeCreate, coarchy, resistmanagement,
ServiceJobMonitor) have no manufacturing module; ServiceJobMonitor is a service-job
worklist, not production. Frappe's `erpnext` manufacturing module is the only Frappe app
with production screens.

Sections: [1 home & work queues](#1-manufacturing-home--work-queues) · [2 BOMs](#2-boms-product-structures) · [3 routings, operations & work centers](#3-routings-operations--work-centers) · [4 work orders / production orders](#4-work-orders--production-orders) · [5 shop floor execution](#5-shop-floor-execution) · [6 planning & mrp](#6-planning--mrp) · [7 subcontracting](#7-subcontracting) · [8 quality, downtime & scrap](#8-quality-downtime--scrap) · [9 costing & variance](#9-costing--variance) · [10 reports & analytics](#10-reports--analytics) · [11 configuration & settings](#11-configuration--settings) · [12 cross-app surfaces](#12-cross-app-surfaces) · [13 current Moqui baseline](#13-current-moqui-baseline-mrsimplescreens) · [14 gaps & BOSS implications](#14-gaps--boss-implications)

---

## 1. Manufacturing home & work queues

### Odoo — menu tree, no dashboard; the MO list is the home

Manufacturing is a standard app with five top-level menus and no landing dashboard. The
default entry is the manufacturing-order list; work is found by filtering that list or the
work-order planning board.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Manufacturing root menu | **Operations** (Manufacturing Orders, Work Orders, Unbuild, Scrap, Lots/Serial Numbers) · **Planning** · **Products** (Bills of Materials) · **Reporting** (Work Orders, work-center productivity/OEE) · **Configuration** (Settings, Work Centers, Operations); whole app gated to `group_mrp_user` / `group_mrp_manager` | `odoo/addons/mrp/views/mrp_views_menus.xml` (menuitems `menu_mrp_root`, `menu_mrp_manufacturing`, `mrp_planning_menu_root`, `menu_mrp_bom`, `menu_mrp_reporting`, `menu_mrp_configuration`); `mrp/views/stock_move_views.xml` adds Scrap + Lots; `mrp/views/mrp_workcenter_views.xml` and `mrp/views/mrp_routing_views.xml` add Configuration items |
| Manufacturing Orders list | `mrp.production` list/card/kanban/calendar/pivot/graph over one dataset; filters for To Do, state, MO readiness, late, component availability, starred, My MOs; list exposes product, quantity, BOM, assigned user, components availability, scheduled date, deadline, state | `odoo/addons/mrp/views/mrp_production_views.xml` (`mrp_production_tree_view`, `mrp_production_card_view`, `mrp_production_kanban_view`, `view_production_calendar`, `view_production_pivot`, `view_production_graph`, `view_mrp_production_filter`, actions `mrp_production_action`, `mrp_production_action_picking_deshboard`) |
| Work Orders planning board | `mrp.workorder` in list, kanban, form, calendar, pivot and graph; the kanban defaults grouped by work center and is the planner's board; search defaults to work center + ready/blocked/planned/in-progress | `odoo/addons/mrp/views/mrp_workorder_views.xml` (`workcenter_line_kanban`, action `action_mrp_workorder_workcenter`, filters `view_mrp_production_workorder_form_view_filter`) |
| Work-center load | Pivot and graph over work orders (expected vs real duration, cost) plus a **Workcenter Load** report action | `mrp_workorder_views.xml` (`view_workcenter_load_pivot`, `view_work_center_load_graph`, `action_mrp_workcenter_load_report_graph`, `action_mrp_workcenter_load_report_pivot`) |
| Unbuild orders | Separate list/kanban/form for disassembly; source MO or manual, quantity, destination location, stock moves | `odoo/addons/mrp/views/mrp_unbuild_views.xml` (`mrp_unbuild_tree_view`, `mrp_unbuild_kanban_view`, `mrp_unbuild_form_view`) |

### ERPNext — workspace with KPI strip, chart and report cards

The Manufacturing workspace is a proper landing page: onboarding, one analysable chart,
three number cards and six link cards. The cards are navigation, not widgets.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Manufacturing workspace | Onboarding block, **Work Order Analysis** chart, number cards **Open Work Orders**, **WIP Work Orders**, **Monthly Completed Work Order**; cards **Production Reports**, **Planning Reports**, **BOM Reports**, **Planning**, **Tools**, **Setup** | `erpnext/manufacturing/workspace/manufacturing/manufacturing.json` |
| Production Reports card | Work Order Summary, Open Work Orders, Work Orders in Progress, Completed, Consumed Materials, Stock Report, Issued Items, Job Card Summary, Downtime Analysis, Process Loss, Cost of Poor Quality, Quality Inspection Summary | same workspace; report dirs under `erpnext/manufacturing/report/` |
| Planning Reports card | Production Planning Report, Production Plan Summary, Material Requirements Planning Report, Exponential Smoothing Forecasting | same workspace; `erpnext/manufacturing/report/` |
| BOM Reports card | BOM Search, BOM Explorer, BOM Stock Analysis, BOM Variance, BOM Operations Time | same workspace; `erpnext/manufacturing/report/` |
| Planning card | **Master Production Schedule**, **Sales Forecast**, both DocTypes | `erpnext/manufacturing/doctype/master_production_schedule/`, `sales_forecast/` |
| Tools card | **Visual Plant Floor**, **BOM Comparison Tool** pages | `erpnext/manufacturing/page/visual_plant_floor/`, `bom_comparison_tool/` |
| Setup card | Workstation Type, Item, Warehouse | `erpnext/manufacturing/doctype/workstation_type/` |

### AureusERP — four clusters, MO list as the operational home

Manufacturing is a Filament plugin with clusters **Operations**, **Products**,
**Configurations** and **Settings**. The manufacturing-order resource is the working
list; a separate read-only **Overview** page is the record's production dashboard.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Operations cluster | Manufacturing Orders, Work Orders, Transfers; each resource has list/view/edit plus record actions | `plugins/webkul/manufacturing/src/Filament/Clusters/Operations.php`, `.../Operations/Resources/{ManufacturingOrderResource,WorkOrderResource,TransferResource}.php` |
| Manufacturing Orders list | Columns: reference, start, end, deadline, product, lot/serial, BOM, source/origin, responsible, MO readiness, component status, quantity, UoM, consumption efficiency, expected/real duration, company, state; group by state/product/BOM/responsible/deadline; bulk delete | `.../ManufacturingOrderResource/Tables/ManufacturingOrdersTable.php` |
| Manufacturing Order overview | Read-only dashboard for one MO: product/UoM, available and on-hand quantity, receipt date, order status, component rows (reserved, status available/waiting, receipt label, unit/total/real cost), work-order rows (unit cost) | `.../ManufacturingOrderResource/Pages/OverviewManufacturingOrder.php`, `resources/views/filament/clusters/operations/resources/manufacturing-order/pages/overview-manufacturing-order.blade.php` |
| Work Orders list/form | Operation, work center, product, quantity remaining/produced, start/end, expected/real duration, status; form has time tracking, components, work instruction, blocked-by | `.../WorkOrderResource/Tables/WorkOrdersTable.php`, `.../Schemas/WorkOrderForm.php` |
| Products cluster | Bills of Materials, Lots, Products; BOM has a read-only **Bill of Material Overview** page in addition to the form | `.../Products/Resources/BillsOfMaterialResource/Pages/BillOfMaterialOverview.php` |
| Configurations cluster | Operations and Work Centers, with **Manage Operations** on a work center | `.../Configurations/Resources/{OperationResource,WorkCenterResource}.php` |

### Carbon — production dashboard plus separate ERP and MES navigation

Carbon's ERP sidebar groups **Production** (Jobs, Batches), **Planning** (Demand
Forecasts, Material Planning, Resource Planning), **Scheduling** (Forecast, Priorities,
Outbound), **Work Instructions** (Assemblies, Procedures) and **Configure** (Scrap
Reasons). The MES app is a second nav surface for operators.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Production dashboard `/x/production` | Landing page: counts of active jobs, jobs assigned to the current user, unbatched batchable operations, work-center blocking state, and a stream of active production events; KPI chart switches **Work Center Utilization / Estimates vs Actuals / Completion Time** over week/month/quarter/year with CSV export | `apps/erp/app/routes/x+/production+/_index.tsx`, `apps/erp/app/modules/production/production.models.ts` (`KPIs`), `apps/erp/app/routes/api+/production.kpi.$key` |
| Production navigation | Module map used by the sidebar: Production, Planning, Scheduling, Work Instructions, Configure | `apps/erp/app/modules/production/ui/useProductionSubmodules.tsx` |
| Jobs list `/x/production/jobs` | Work-order table with item revision, tracking, status, batches, customer, sales order, assignee, dates, and order/inventory/production/scrap/completed/shipped/received quantities | `apps/erp/app/routes/x+/production+/jobs.tsx`, `ui/Jobs/JobsTable.tsx` |
| Batches list `/x/production/batches` | Batch status, process, work center, member count, summed quantity, last activity; release/unrelease/dissolve actions | `apps/erp/app/routes/x+/production+/batches.tsx`, `ui/Batches/BatchesTable.tsx` |
| MES queue home `/x/operations` | Operator landing Kanban by work center with batch cards collapsed and live status | `apps/mes/app/routes/x+/operations.tsx`, `apps/mes/app/components/AppSidebar.tsx` |

### Dolibarr — two separate modules, MO list is the home

Dolibarr splits manufacturing across **MRP** (manufacturing orders) and **BOM**
(bills of materials), each with its own list/card. There is no combined landing page.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Manufacturing Orders list | Searchable, column-configurable list with status filters (including "late"), mass actions, category filter, export; link to cards | `htdocs/mrp/mo_list.php`, `htdocs/mrp/class/mo.class.php` |
| Manufacturing Order card | Header plus cost summary, notes, documents, and a link into the **Production** screen; actions Validate, Cancel, Clone, Delete, Close | `htdocs/mrp/mo_card.php`, `htdocs/mrp/mo_production.php` |
| BOM list/card | Separate module; list with type/status filters, card with components, costing and **Net Needs** | `htdocs/bom/bom_list.php`, `htdocs/bom/bom_card.php`, `htdocs/bom/bom_net_needs.php` |
| Workstations list/card | Separate module enabled beside MRP; workstation type, operators required, hourly operator/machine cost, enabled/disabled | `htdocs/workstation/workstation_list.php`, `htdocs/workstation/workstation_card.php` |

### metasfresh — the PP Order Candidate window is the planner's home

metasfresh has no React production module; manufacturing screens are metadata-defined
windows rendered by the generic document-list shell. The one dedicated planning surface
is the **PP Order Candidate** window (ID `541316`), with a custom header that aggregates
selected rows.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| PP Order Candidate window | Master-planning candidate list; header shows selected **Number of Resources**, **Qty to Process** and **Qty Processed** per UoM (summed over the current page/selection) | `frontend/src/components/ppOrderCandidate/PPOrderCandidateViewHeader.js` (`PP_ORDER_CANDIDATE_WINDOW_ID = '541316'`) |
| Candidate processes | **Set Start Date** and **Set Workstation** processes invoked from the candidate window | `backend/de.metas.manufacturing.webui/src/main/java/de/metas/manufacturing/webui/process/PP_Order_Candidate_SetStartDate.java`, `PP_Order_Candidate_SetWorkstation.java` |
| Manufacturing order windows | Standard document windows over `PP_Order` / `PP_Order_BOM` / `PP_Order_Workflow`; no custom React page, so list/detail layout comes from the generic window container | `frontend/src/containers/DocumentListContainer.js`, `MasterWindowContainer.js`, `frontend/src/components/window/`; business objects in `backend/de.metas.manufacturing/src/main/java/de/metas/manufacturing/order/` |

**BOSS implications.** No reference lands on a chart wall: Odoo and Dolibarr land on the
MO list, ERPNext on a KPI/report workspace, metasfresh on the planning-candidate window.
IronStone Manufacturing should do both in one root: a queue board (work orders by
status / work center, with ready, late, blocked, pending counts) plus a small KPI strip
(open, WIP, completed this month, component shortages). The queue must deep-link into
pre-filtered lists using screen parameters, mirroring Odoo's action contexts and
AureusERP's grouped tables; the landing page itself should not be a separate aggregation
table.

---

## 2. BOMs (product structures)

### Odoo — one BOM form, operations inline, structure report

A BoM is a header (product, quantity, type) plus components, operations and by-products.
There is no separate "routing" document: operations are rows on the BoM, each naming a
work center. Two types matter: **Manufacture this product** (`normal`) and **Kit**
(`phantom`; exploded into components instead of being produced).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bills of Materials list | Editable multi-edit list: product, code, type, variant, company, quantity, UoM; filters Manufacture/Kit/Archived; group by product/type/UoM; kanban card shows product + quantity and code | `odoo/addons/mrp/views/mrp_bom_views.xml` (`mrp_bom_tree_view`, `mrp_bom_kanban_view`, `view_mrp_bom_filter`, action `mrp_bom_form_action`) |
| BoM form | Header: product/variant, quantity + UoM, reference code, radio type (normal/phantom), company. Smart buttons: **Components** + **Sub Assemblies** count, **Operations Performance**, **BoM Overview** | `mrp_bom_views.xml` (`mrp_bom_form_view`, `action_mrp_routing_time`, `action_report_mrp_bom`) |
| Components tab | Editable bottom list: component, quantity, UoM, consumed-in-operation, apply-on-variant, cost share; catalog button; optional zero-quantity lines | same view, page `components` |
| Operations tab | Operation rows (`mrp.routing.workcenter`) with an inline shop-floor diagram annotation (time clock, quality control, feedback loop) when empty; per-operation duration/time mode | same view, page `operations`; `mrp/views/mrp_routing_views.xml` |
| By-Products tab | Additional outputs with product, quantity, UoM, operation, cost share | `mrp_bom_views.xml` (`mrp_bom_byproduct_form_view`), group `group_mrp_byproducts` |
| Miscellaneous tab | Manufacturing lead time (`produce_delay`), days to prepare MO, batch size, readiness (`all_available` vs `asap`), operation dependencies, internal note; chatter | same view, page `miscellaneous` |
| BoM Structure & Cost report | Client action rendering the multi-level BOM tree with quantities and costs; also the **BoM Overview** report | `odoo/addons/mrp/report/mrp_report_bom_structure.xml`, `mrp_report_views_main.xml`; action `action_report_mrp_bom` |
| Used-in-BOMs / exploded lines | List of BOM lines using a component, plus an exploded-components list and pivot (quantity, cost) | `mrp_bom_views.xml` (`mrp_bom_line_action_used_in_boms`, `mrp_bom_line_view_list_exploded_components`, `mrp_bom_line_view_pivot`) |

### ERPNext — deepest BOM model: costing, explosion, website, BOM Creator

ERPNext separates **BOM**, **Routing**, **Operation**, **Workstation** and **Workstation
Type**, and adds a BOM Creator builder plus a comparison tool.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| BOM form | Header: item to manufacture, image, UoM, output quantity, active/default, **With Operations**, **Inspection Required**, alternative items, quality-inspection template. Cost section: company, transfer material against (Work Order / Job Card), currency, rate basis, buying price list | `erpnext/manufacturing/doctype/bom/bom.json`, `bom.js` |
| Components table | `BOM Item`: item, operation, quantity/percentage, UoM, rate/amount, source warehouse, `include_item_in_manufacturing`, `do_not_explode`, alternative item, sub-assembly/phantom flags | `.../doctype/bom_item/bom_item.json` |
| Operations table | `BOM Operation`: operation, workstation, description, hour rate, time in minutes + fixed time, operating cost, batch size, sequence, subcontracted, quality inspection required, WIP/FG warehouses | `.../doctype/bom_operation/bom_operation.json` |
| Tabs | **Costing** (operating, raw material, total, base totals, project), **Exploded Items**, **Website** (publish, route, images, descriptions), **Connections**, **More Info** (process loss, semi-finished tracking), **BOM Configuration** (backflush basis) | `bom.json` |
| BOM Creator | Tree-building page to assemble a new multi-level BOM from items; saves `BOM Creator` / `BOM Creator Item` | `.../doctype/bom_creator/`, `bom_creator_item/` |
| BOM Comparison Tool | Page that compares two BOMs line by line (quantity/rate/cost differences) | `erpnext/manufacturing/page/bom_comparison_tool/bom_comparison_tool.js` |
| BOM update batch/log | Tracked bulk updates of BOMs (rate/quantity) with a log per batch | `.../doctype/bom_update_tool/`, `bom_update_batch/`, `bom_update_log/` |

### AureusERP — Odoo-shaped BOM form in Filament

The BOM resource mirrors Odoo's model closely: general section, tabs for Components,
Operations and By-products, a Miscellaneous area with readiness/routing/consumption, and a
separate read-only overview page.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bills of Materials list | Reference, product, quantity, UoM, type, company, updated-at; filters product/type/company; view/edit/delete + restore | `plugins/webkul/manufacturing/src/Filament/Clusters/Products/Resources/BillsOfMaterialResource/Tables/BillsOfMaterialTable.php` |
| BOM form | **General**: reference, product, variant, quantity, UoM, type (normal/phantom), company. **Miscellaneous**: kit information, manufacturing lead time (days), days to prepare MO | `.../Schemas/BillOfMaterialForm.php`; labels in `resources/lang/en/filament/clusters/products/resources/bill-of-material.php` |
| Components tab | Repeater: component, apply-on-variants, consumed-in-operation, highlight-consumption, quantity, UoM; validation that component ≠ product | same form, `Repeater::make('lines')` |
| Operations tab | Repeater: operation, work center, duration computation (auto/manual), computed on last N, company, apply-on-variants, duration (minutes); **Copy Existing Operations** action; per-line edit action | same form, `Repeater::make('operations')` |
| By-products tab | Repeater: product, quantity, UoM, produced-in-operation | same form, `Repeater::make('byproducts')` |
| BOM Overview page | Read-only overview built from the BOM and its lines/operations | `.../BillsOfMaterialResource/Pages/BillOfMaterialOverview.php` |
| Product → BOMs | Product record page with a **Bills of Materials** management tab | `.../ProductResource/Pages/ManageBillsOfMaterials.php` |

### Carbon — versioned make method with Bill of Process and Bill of Material

Carbon splits the BOM into a **make method** (a versioned manufacturing definition). Each
method has a **Bill of Process** (routing) and a **Bill of Material**; only `Draft` is
editable, and `Active`/`Archived` are read-only until a new version is created.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Part method page `/x/part/:itemId/make/:makeMethodId` | Master page: method/version switcher (`MakeMethodTools`), Bill of Process, Bill of Material, item CAD model | `apps/erp/app/routes/x+/part+/$itemId.make.$makeMethodId.tsx`, `apps/erp/app/modules/items/ui/Item/{MakeMethodTools,BillOfProcess,BillOfMaterial}.tsx` |
| Bill of Material editor | Sortable material rows with a material drawer: part, quantity, UoM, sourcing type, method type, location + storage unit (WIP vs default), optional operation association, per-step assignment, configuration rules | `apps/erp/app/modules/items/ui/Item/BillOfMaterial.tsx` |
| BoM explorer | Multi-level method tree with search, expand/collapse, CSV/JSON export, Onshape sync entry, per-method version status | `apps/erp/app/modules/items/ui/Item/BoMExplorer.tsx`, `apps/erp/app/components/BoMExplorer/BoMExplorer.tsx` |
| Make-method versions | Create/activate/delete versions; `Draft → Active → Archived`; draft-only editing | `apps/erp/app/modules/items/ui/Item/{MakeMethodTools,MakeMethodVersionStatus}.tsx`, `apps/erp/app/modules/items/items.service.ts` |
| Job BOM/BoP editors | The same editors applied to a job's copied method, with job-specific steps, slides, tools, procedure/assembly sync and batch badges | `apps/erp/app/modules/production/ui/Jobs/{JobBillOfMaterial,JobBillOfProcess,JobMakeMethodTools}.tsx` |
| Procedures / assembly instructions | Versioned rich-text work instructions (`Draft/Active/Archived`) and 3D assembly instructions (`Draft/Published/Archived`) attached to operations | `apps/erp/app/routes/x+/procedure+/$id.tsx`, `x+/assembly+/$id.tsx`, `ui/Procedures/*`, `ui/Assemblies/*` |

### Dolibarr — BOM module with net-needs explosion

| Screen/page | What it is | Key files |
| --- | --- | --- |
| BOM list | Reference, label, type (Manufacturing / Disassemble), product, quantity, status (Draft/Enabled/Disabled), user/date; category filter and mass actions | `htdocs/bom/bom_list.php`, `htdocs/bom/class/bom.class.php` |
| BOM card | Header with product, quantity, type, warehouse, estimated duration, cost summary; component lines; validation/cancel actions | `htdocs/bom/bom_card.php`, `htdocs/bom/class/bom.class.php` |
| BOM Net Needs | Multi-level explosion against stock: grouped **by product** or **tree view**, columns quantity, physical stock, virtual stock, produced-by; expand/collapse all; warning where BOM supply is insufficient | `htdocs/bom/bom_net_needs.php` |
| BOM documents/notes/agenda | Standard Dolibarr tabs beside the card | `htdocs/bom/bom_document.php`, `bom_note.php`, `bom_agenda.php` |

### metasfresh

No BOM editor UI in the React frontend; BOMs are `PP_Order_BOM` / `PP_Order_BOMLine`
records managed in metadata windows. Planning candidates carry the resulting BOM
explosion. Treat metasfresh as a planning reference only.

**BOSS implications.** The useful consensus is a BOM header + three line collections
(components, operations, by-products) with a read-only exploded view and a cost roll-up.
Odoo and AureusERP prove the form layout; ERPNext proves the fields that make it usable
(operation binding per component, phantom/kit, lead times, inspection requirement,
exploded-items table); Dolibarr's net-needs tree is the cheapest usable MRP view and maps
directly onto a Moqui screen with a recursive service call. IronStone Manufacturing
should add BOM version/status (none of Odoo community or AureusERP exposes a clean
version lifecycle; ERPNext uses active/default + amendment) because production orders
must pin the BOM revision they were created from.

---

## 3. Routings, operations & work centers

### Odoo — operations live on the BoM; work centers are resources with calendars

Odoo has no standalone routing document. Each **operation** (`mrp.routing.workcenter`) is
a BoM line naming a work center; sequencing comes from the line order, and optional
blocked-by dependencies express precedence.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Operations on a BoM | Editable list ordered by sequence: operation name, work center, duration, total duration, blocked-by operations; **Add a line**, **Copy Existing Operations**; drag handle for order | `odoo/addons/mrp/views/mrp_routing_views.xml` (`mrp_routing_workcenter_tree_view`, `mrp_routing_workcenter_bom_tree_view`, `mrp_routing_workcenter_kanban_view`, `mrp_routing_workcenter_filter`) |
| Operation form | Operation name, work center, cost mode, blocked-by, time mode (manual vs auto from last N work orders), default cycle time, computed total duration; chatter | `mrp_routing_views.xml` (`mrp_routing_workcenter_form_view`) |
| Work Centers list/kanban | Name, code, tags, alternative work centers, calendar, time efficiency, OEE target, cost/hour; kanban shows status color and OEE % against target | `odoo/addons/mrp/views/mrp_workcenter_views.xml` (`mrp_workcenter_tree_view`, `mrp_workcenter_view_kanban`, `mrp_workcenter_action`, `mrp_workcenter_kanban_action`) |
| Work Center form | Smart buttons **Operations**, **OEE %**, **Lost hours**, **Load minutes**, **Performance %**; general info (efficiency, OEE target, start/stop times, cost/hour); **Product Capacities** tab (product or all products, capacity, UoM, setup/cleanup windows) | `mrp_workcenter_views.xml` (`mrp_workcenter_view`) |
| OEE reports | OEE pie, productivity-loss form/list/kanban, OEE search/form/tree/graph/pivot over `mrp.workcenter.productivity.loss` (productive, blocked, performance losses) | `mrp_workcenter_views.xml` (`oee_pie_view`, `oee_loss_form_view`, `oee_loss_tree_view`, `oee_loss_kanban`, `oee_search_view`, `oee_form_view`, `oee_tree_view`, `oee_graph_view`, `oee_pivot_view`) |

### ERPNext — standalone Routing, Operation, Workstation, Plant Floor

ERPNext normalizes the concepts: operations are master data (optionally with
sub-operations and a work instruction), routings are reusable ordered lists of
operations, workstations are resources, and plant floors group workstations visually.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Operation form | Workstation default, description, rich **work instruction**, sub-operations, total operation time, batch size, create-job-card-per-batch, corrective-operation flag, quality-inspection template | `erpnext/manufacturing/doctype/operation/operation.json`, `operation.js`; `sub_operation/` |
| Routing form | Named ordered list of **BOM Operation** rows; disabled flag | `.../doctype/routing/routing.json` |
| Workstation form | Workstation name, type, plant floor, warehouse, production capacity, hour rate, working hours (child table), holiday list, status (Production / Off / Idle / Problem / Maintenance / Setup) with on/off images, cost rows | `.../doctype/workstation/workstation.json`, `workstation.js`, `workstation_cost/`, `workstation_working_hour/` |
| Workstation Type | Shared hour rate and cost rows; groups workstations | `.../doctype/workstation_type/workstation_type.json` |
| Plant Floor | Named floor with a **plant dashboard** (HTML/visual layout), warehouse link, stock summary; feeds **Visual Plant Floor** page | `.../doctype/plant_floor/plant_floor.json`; page `erpnext/manufacturing/page/visual_plant_floor/` |
| Visual Plant Floor | Visual grid of workstations/floors showing live status; rendered by `frappe.ui.VisualPlantFloor` | `erpnext/manufacturing/page/visual_plant_floor/visual_plant_floor.js`, `erpnext/public/js/plant_floor_visual/visual_plant.js` |

### AureusERP — Operations and Work Centers as configuration resources

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Operations list/form | Operation, BoM, work center, apply-on-variants, company, blocked-by; **Settings** (duration computation auto/manual, based on last N work orders, default duration); **Work Sheet** (PDF, Google Slide link, description) | `plugins/webkul/manufacturing/src/Filament/Clusters/Configurations/Resources/OperationResource/Schemas/OperationForm.php`, `Tables/OperationsTable.php`; labels `resources/lang/en/filament/clusters/configurations/resources/operation.php` |
| Work Centers list/form | Name, code, tags/color, alternative work centers, working-hours calendar, company, note; **General Information** (default capacity, time efficiency, OEE target, cost/hour, setup/cleanup minutes); **Specific Capacity** repeater (product, UoM, capacity, setup, cleanup) | `.../WorkCenterResource/Schemas/WorkCenterForm.php`, `Tables/WorkCentersTable.php`; labels `.../work-center.php` |
| Work Center → Operations | Managed tab on the work-center record listing its operations with a **Create** action | `.../WorkCenterResource/Pages/ManageOperations.php` |

### Carbon — Bill of Process, operation dependencies and work-center masters

Carbon keeps the routing in a **Bill of Process** on the make method. Operations are
ordered rows with an explicit type (Process / Assembly / Inspection / Outside
Processing), optional procedure/assembly/inspection pointer, and step/parameter editors.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bill of Process editor | Sortable operation list with **Add Operation**; per operation tabs **Instructions / Parameters / Steps** (badges show inheritance from a Procedure, Assembly Instruction or Inspection Plan); fields Process, Operation Type, Work Center, Description, Operation Order (`After Previous` / `With Previous`), Setup/Labor/Machine time + unit, outside-processing supplier/cost/lead time | `apps/erp/app/modules/items/ui/Item/BillOfProcess.tsx` |
| Operation steps | Step types `Task, Value, Measurement, Checkbox, Timestamp, Person, List, File, Inspection`, with min/max, list options, slides, parts, tools; parameters are key/value rows | `BillOfProcess.tsx`, `apps/erp/app/modules/shared/shared.models.ts` |
| Operation DAG | React-Flow graph of operations and dependency edges; used on the job detail (`/dag`) and MES job view | `apps/erp/app/routes/x+/job+/$jobId.dag.tsx`, shared `JobDag` |
| Work Center master `/x/resources/work-centers` | Name, processes, location, department, default unit, description; labor/machine/overhead rates; capital-cost table (asset, NBV, monthly depreciation); scheduling mode (lights-out vs shifts) with shifts; batching capacity and minimum batch quantity | `apps/erp/app/routes/x+/resources+/work-centers.$id.tsx`, `apps/erp/app/modules/resources/ui/WorkCenters/WorkCenterForm.tsx` |
| Process master `/x/resources/processes` | Process name/type, default unit, allowed work centers, **Requires Ability**, **Batchable**, kanban scan-completes-all; batch type and property compatibility rules; supplier processes | `apps/erp/app/routes/x+/resources+/processes.$id.tsx`, `apps/erp/app/modules/resources/ui/Processes/ProcessForm.tsx` |
| Scheduling availability | Work-center shift mode, location shifts, maintenance downtime and a shared availability ladder consumed by the scheduler, Gantt shading and capacity series | `apps/erp/app/modules/production/ui/Schedule/{ForecastHeader,WorkCenterAvailabilityPopover}.tsx`, `packages/planning/src/scheduling/machine-availability.ts` |

### Dolibarr — workstation is a lightweight resource, not a routing

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Workstation list/card | Reference, label, type **HUMAN / MACHINE / BOTH**, operators required, estimated hourly operator and machine cost, enabled/disabled, user groups/resources | `htdocs/workstation/workstation_list.php`, `htdocs/workstation/class/workstation.class.php` |
| Workstation use in production | The MO production screen lets each produced/consumed line pick a workstation and computes line cost from `thm_operator_estimated + thm_machine_estimated` | `htdocs/mrp/mo_production.php` (workstation selects around the production line table) |

Dolibarr has no operation sequence or routing entity; the workstation is an attribute of a
production line. That is the minimum viable model and a useful fallback if routings are
deferred.

### metasfresh

No routing master UI; work centers are resources (`S_Resource`) selected on planning
candidates through the **Set Workstation** process and carried onto `PP_Order_Workflow`
nodes.

**BOSS implications.** Odoo's "operations are BoM lines" and ERPNext's "routing is
reusable master data" are the two viable shapes. For BOSS, keep operations on the BOM
(simplest to plan and copy) but make the operation catalogue reusable: name, default work
center, work instruction, standard duration, setup/cleanup. Work centers need calendar,
capacity, efficiency and cost/hour because scheduling, OEE and costing all read them.
Do not build a separate routing document until a business needs to reuse the same
sequence across many BOMs; a "copy operations from another BOM" action covers the common
case, as both Odoo and AureusERP discovered.

---

## 4. Work orders / production orders

### Odoo — `mrp.production` is the order, `mrp.workorder` its operations

A manufacturing order is one document covering the finished product, components and
(sub)operations. The order header owns the lifecycle; work orders are generated from the
BoM operations and scheduled separately.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| MO list views | List/card/kanban/calendar/pivot/graph. List header actions **Plan**, **Reserve**, **Cancel**; columns priority, reference, scheduled/end/deadline (late highlighted), product, lot/serial, BoM, next activity, origin, responsible, **components availability** (available/expected/late/not available), readiness, quantity, UoM, expected/real duration, state | `odoo/addons/mrp/views/mrp_production_views.xml` (`mrp_production_tree_view`, `mrp_production_card_view`, `mrp_production_kanban_view`, `view_production_calendar`, `view_production_pivot`, `view_production_graph`, `view_mrp_production_filter`) |
| MO form header | Status bar **Draft → Confirmed → In Progress → To Close → Done** (without work orders: Draft → Confirmed → In Progress → Done). Buttons **Confirm**, **Plan/Unplan**, **Start**, **Produce**, **Cancel**, **Reset to Draft**, **Set to In Progress**; Produce hotkey `g` | `mrp_production_views.xml` (`mrp_production_form_view`, header) |
| MO smart buttons | Allocation, Child MO, Source MO, Backorders, Unbuilds, Scraps, Transfers, **Overview**, Product Moves, Traceability, Detailed Operations, Packages, Serial Numbers | same view, `oe_button_box` |
| MO header fields | Product, optional variant description, BoM (+ **Generate BOM**, **Update BoM** when outdated), quantity / quantity producing + UoM, scheduled or actual dates, responsible, origin, lot/serial generation (Generate Lot Number / Generate Serial Numbers / Clear) | same view, sheet groups |
| Components tab | Editable raw-move list: component, required vs consuming quantity, lot/serial, source location, availability decorations; catalog/add line; show-details dialog; reserve/unreserve | same view, page `components`; actions `action_reserve`, `action_unreserve_tree` |
| Work Orders tab | Inline work-order list with operation, work center, expected/real duration, status/start/pause/done controls; same rows also served by the planning board | same view, page `operations`; `mrp/views/mrp_workorder_views.xml` |
| By-Products tab / Miscellaneous | By-product moves (product, quantity, operation) behind `group_mrp_byproducts`; miscellaneous picking type, source/destination locations, deadline, company, note; chatter | same view, pages `finished_products`, `miscellaneous` |
| MO Overview | Printable/client report that lays out the order, component availability and cost summary | `odoo/addons/mrp/report/mrp_report_mo_overview.xml`, `mrp_report_mo_overview.py`; action `action_report_mo_overview` |
| Split / merge / backorder | Wizards for changing quantity, splitting an MO, creating backorders, generating serial numbers, consumption warnings, insufficient-stock warning | `odoo/addons/mrp/wizard/{change_production_qty,mrp_production_split,mrp_production_backorder,mrp_production_serial_numbers,mrp_consumption_warning,stock_warn_insufficient_qty}.*` |

### ERPNext — Work Order with explicit material-transfer and finish steps

ERPNext's Work Order is submit-based and deliberately stages material movement:
**Material Transfer for Manufacture** into WIP, then **Manufacture** to finish goods.
Job Cards are separate documents per operation.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Work Order form | Tabs **Production Item** (item, BOM, qty, produced qty, material transferred, WIP/FG/scrap warehouses, required items, planned/actual dates, operations, costs) · **More Info** (description, material request, sales order/project/production plan links, batch/serial, process loss) · **Connections** · **Scheduling & Costing** (MPS, subcontracting, max producible) · **Job Cards** · **Material Requests** · **Stock Entries** | `erpnext/manufacturing/doctype/work_order/work_order.json`, `work_order.js` |
| Work Order list/report | Status filter covers Draft, Submitted, Not Started, In Process, Stock Reserved, Stock Partially Reserved, Completed, Stopped, Closed, Cancelled; list shows progress and material status | `.../work_order/work_order_list.js`, `.../work_order/work_order.json` |
| Work Order actions | Submit → **Start** → **Stop/Re-open** → **Finish** (posts Manufacture stock entry) → **Close**; **Pick List**, **Material Request**, **Additional Material Transfer**, **Material Consumption**, **Operator Dashboard**, **Alternate Item**, **Return Components**, **Change Finished Item**, make Job Cards, make BOM, make disassembly | `.../work_order/work_order.js` (`erpnext.work_order.set_custom_buttons`, `add_start_button`, `make_job_card`, `make_consumption_se`), `work_order.py` |
| Job Card form | Work order, final BOM, workstation, operation, posting date, qty to manufacture, WIP warehouse, **Time Logs** (from/to, minutes, completed qty, employee), **Items** (required, transferred, consumed), status, operation row, quality inspection, sub-operations, corrective-job-card fields, scheduled time logs, actual dates | `.../job_card/job_card.json`, `job_card.js` |
| Job Card operator dashboard | Embedded HTML dashboard with a live stopwatch, Start/Pause/Complete, employee selection, and **Make Stock Entry**; completion dialog captures completed, pending and process-loss quantity plus end time | `job_card.js` (`start_job`, `complete_job_card`, `start_timer`, `pause_job`, `job_card_dashboard`) |
| Material Request Plan / Production links | Work Order can be created from Production Plan, Sales Order, Material Request, or MPS; the source fields stay on the form | `work_order.json` (`production_plan`, `production_plan_item`, `sales_order`, `material_request`, `mps`) |

### Carbon — Job (work order) with method explorer and execution tabs

Carbon's **Job** is the work order. The detail page is a three-pane record: method tree on
the left, route content in the middle, properties on the right. Scheduling fields are
server-owned; planners move dates/priorities, they do not type start times.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Jobs list `/x/production/jobs` | Job ID + item thumbnail, item (readable ID + revision), tracking, status, batches, quantity, customer, sales order, assignee, start/due, deadline type, tags, order/inventory/production/scrap/completed/shipped/received quantities, location | `apps/erp/app/routes/x+/production+/jobs.tsx`, `apps/erp/app/modules/production/ui/Jobs/JobsTable.tsx` |
| Job detail shell `/x/job/:jobId` | Header actions: status change, release, complete/receive, cancel, delete, read-only expedite forecast, audit log. Left `JobBoMExplorer`, right `JobProperties`, middle `RecordOutlet` | `apps/erp/app/routes/x+/job+/$jobId.tsx`, `modules/production/ui/Jobs/JobHeader.tsx` |
| Job details tab `/details` | Make-method tools, notes, **Bill of Process**, **Bill of Material**, purchase-orders card, **Estimates vs Actuals** (time per operation, issued material qty/cost), documents, risk register | `apps/erp/app/routes/x+/job+/$jobId.details.tsx`, `ui/Jobs/JobEstimatesVsActuals.tsx` |
| Job execution tabs | `/materials` (required, on storage unit, on hand, incoming PO, shortfall), `/operations` (status control, MES deep link, target/complete/scrap/rework), `/quantities` (Production/Scrap/Rework records with scrap reason), `/events` (Setup/Labor/Machine), `/dag` (operation dependency graph), `/make/:makeMethodId` (subassembly method) | `apps/erp/app/routes/x+/job+/$jobId.{materials,operations,quantities,events,dag,make.$methodId}.tsx` |
| Job status | `Draft → Planned → Ready → In Progress → Paused → Completed → Closed → Cancelled`; UI renders `Ready` as **Released**; Completed/Closed/Cancelled are locked | `apps/erp/app/modules/production/production.models.ts` (job status map), `ui/Jobs/JobStatus.tsx` |
| Batches | First-class grouping of job operations: list/detail, batch builder (candidate operations, material-property compatibility, due windows, capacity), release/unrelease/dissolve; member jobs stay independent | `apps/erp/app/routes/x+/production+/batches*.tsx`, `ui/Batches/*` |

### AureusERP — Odoo-shaped MO with record actions and a read-only overview

| Screen/page | What it is | Key files |
| --- | --- | --- |
| MO form | **General**: product, BoM, quantity, UoM, scheduled start/end, responsible. Tabs **Components** (raw-material moves: from/to, to-consume, quantity, UoM, forecast), **Work Orders** (operation, work center, product, qty remaining/produced, start/end, expected/real duration, status), **By-products**, **Miscellaneous** (operation type, source/finished locations, company) | `plugins/webkul/manufacturing/src/Filament/Clusters/Operations/Resources/ManufacturingOrderResource/Schemas/ManufacturingOrderForm.php` |
| MO actions | **Confirm**, **Plan**, **Unplan**, **Start**, **Done** (consumption-check dialog), **Cancel**, print MO, print labels | `.../Operations/Actions/{ConfirmAction,PlanAction,UnplanAction,StartAction,DoneAction,CancelAction}.php`, `.../Actions/Print/` |
| MO overview | Read-only production dashboard: product/UoM, available/on-hand qty, receipt date, order status, component rows (reserved, available/waiting, receipt, unit/total/real cost), work-order rows with unit cost | `.../ManufacturingOrderResource/Pages/OverviewManufacturingOrder.php` |
| Work Order form | General section (operation, work center, dates, expected duration, product, quantity, lot/serial, parent MO); tabs **Time Tracking** (productivity logs: user, duration, start/end, productivity, loss), **Components**, **Work Instruction**, **Blocked By** | `.../WorkOrderResource/Schemas/WorkOrderForm.php` |
| Transfers | Material-transfer records linked to MOs, with edit/view and move management | `.../TransferResource.php`, `Pages/ManageMoves.php` |

### Dolibarr — MO card plus a dedicated consumption/production screen

| Screen/page | What it is | Key files |
| --- | --- | --- |
| MO list | Reference, BOM, type (Manufacturing / Disassemble), product, quantity, label, warehouse, planned start/end, status (Draft / Validated / In Progress / Produced / Canceled); "late" filter, mass cancel/close, date changes | `htdocs/mrp/mo_list.php`, `htdocs/mrp/class/mo.class.php` |
| MO card | Header and actions **Validate**, **Cancel**, **Clone**, **Delete**, **Close**, **Reopen**; public/private notes, documents, project/category classification | `htdocs/mrp/mo_card.php` |
| Production screen | Two side-by-side tables: **Consumption** (products to consume) and **Production** (products to produce). Columns product, qty, UoM, already consumed/produced, warehouse or workstation, stock (warning when short), batch; per-line action and **split**; global **Consume or produce** and **Consume and produce all** dialogs | `htdocs/mrp/mo_production.php` |
| Production dialog | Source warehouse (or workstation), quantity, lot/batch, cost; posts stock movements and advances the MO to In Progress/Produced | `htdocs/mrp/mo_production.php` (consume/produce action handling) |

### metasfresh

Manufacturing orders are metadata-defined windows; the operational list/detail shell is
the generic document window. Planning candidates are converted to orders and then
scheduled/issued through REST workflows. No custom order form to catalogue.

**BOSS implications.** Odoo is the cleanest record shape: one order header, four line
collections (components, work orders, by-products, misc), a status bar, and smart buttons
for every linked document. ERPNext is the strongest process gate: material transfer and
manufacture are explicit stock postings, and the UI tells the user which one is next.
Carbon's execution tabs (`materials`, `operations`, `quantities`, `events`, `dag`) are the
best decomposition for a work-order detail page and should be copied as sub-screens rather
than tabs that fetch everything at once. The minimum BOSS workflow is Confirm → Plan →
Start → Issue/Consume → Produce → Close, with backorder/split and scrap as wizards; the
order must record the BOM and routing revision it was created from, and every quantity
field needs a pending/remaining companion so partial production is first-class.

---

## 5. Shop floor execution

### ERPNext — a dedicated, keyboard-first Shop Floor app

ERPNext has the most complete standalone shop-floor surface in the checkout. It is a
single page with two role-dependent views over the same data: a **manager board** of work
orders and an **operator** view of job cards at a workstation or work order.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Shop Floor page | Kiosk-style page (`hide_sidebar`), full-screen body class, loaded through `frappe.ui.ShopFloor`; route options select workstation/work-order; role view comes from `get_shop_floor_context` (`manager` if allowed, else `operator`) | `erpnext/manufacturing/page/shop_floor/shop_floor.js`, `.py`, `.json`; `erpnext/public/js/shop_floor/shop_floor.js` |
| Manager board | Two buckets **Pending / In Progress** and **Completed** with counts; debounced work-order search; **With job cards only** toggle; paginated 20-per-page cards showing item, reference, progress, operation chips, planned date, material status | `shop_floor.js` (`MANAGER_BUCKETS`, `render_shell_controls`, `load_bucket`, `render_board`, `work_order_card`) |
| Work-order detail pane | Drilling into a card opens the work order's job cards in the operator pane; current operation is the first not-completed operation in the routing | `shop_floor.js` (`open_wo`, `compute_state`); `shop_floor.py` (`get_work_orders`, `_count_work_orders`) |
| Operator view | Workstation/work-order mode; slots for active jobs with **Start / Pause / Resume / End Session / Submit / Make Entry / Transfer**; live timers; summary counts (active, paused, completed); **OEE** panel | `shop_floor.js` (`load_operator`, `render_operator`, `bind_events`), `erpnext/public/js/templates/shop_floor_template.html` |
| Materials panel | Per-job collapsible material list with ready/available/short dots, quantities and **Transfer** action to move materials to WIP | template `mes-materials-*`; `shop_floor.js` (`transfer_materials`) |
| Work instructions panel | Per-job collapsible instructions with description and rich work-instruction HTML | template `mes-instructions-*` |
| End-session dialog | Captures **Qty to Manufacture in this Cycle**, **Completed**, **Pending** and **Process Loss** quantities (they must reconcile), end time, and optional employees; then posts completion | `shop_floor.js` (`end_session`, `prompt_manufacture_entry`, `submit_job_card`, `make_manufacture_entry`) |
| Quality check | Inline **QC Required / QC Available / QC Passed / QC Rejected** pills; dialog runs the inspection and blocks completion when required | `shop_floor.js` (`run_quality_check`, `show_qc_dialog`) |
| Scanner | Scan button/shortcut opens a job-card scanner; scanned cards route to start/resume/complete depending on state | `shop_floor.js` (`open_scanner`, `handle_scanned_job_card`, `route_scanned_action`) |
| Keyboard model | `?` help, `/` search, `r` refresh, `b` scan, `1/2` switch buckets, `g m`/`g o` switch manager/operator, arrows/`j k` move focus, Enter activate, `s` start, `p` pause, `e` end session, `t` transfer, `Shift+S` submit | `shop_floor.js` (`bind_keys`, `handle_key`, `show_help`) |

### Carbon MES — a separate operator app with queue, execution and transactions

Carbon goes further: MES is its own React Router app with queue Kanbans, operation/
assembly/inspection execution, material issue, picking, timecard, maintenance and
wall displays.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Operations queue `/x/operations` | Kanban by work center (empty centers included), search and filters (process, work center, customer, assignee, tag, material), display settings; batched operations collapse into one card with member count and summed quantity | `apps/mes/app/routes/x+/operations.tsx`, `apps/mes/app/components/AppSidebar.tsx` |
| Assigned / Active / Recent | Personal queues: assigned operations, live active operations with durations, recently touched | `apps/mes/app/routes/x+/{assigned,active,recent}.tsx` |
| Jobs + DAG `/x/jobs`, `/x/job/:jobId` | Open-job list; job view renders the operation dependency DAG with a status legend | `apps/mes/app/routes/x+/{jobs,job.$jobId}.tsx` |
| Operation view `/x/operation/:operationId` | Primary operator screen. Tabs **Details / Model / Instructions / Chat**; quantity progress, Setup/Labor/Machine meters with Start/Pause; completed/scrapped/due cards; step list; parameters; materials with **Issue Material**; files; serial numbers with Scan/Select; bottom **Log completed** / **Complete batch**; **More actions** for Complete Batch, Scrap, Rework, Mark as Done, Maintenance, Quality Issue | `apps/mes/app/routes/x+/operation.$operationId.tsx`, `components/JobOperation/JobOperation.tsx` |
| Assembly view `/x/assembly/:operationId` | 3D animated build with step rail, reference slides, per-step parts/tools, record modal; Space/Enter fire the step, arrows navigate; completing a step auto-advances and starts labor | `apps/mes/app/routes/x+/assembly.$operationId.tsx`, `components/AssemblyView.tsx` |
| Inspection view `/x/inspection/:operationId` | Sampling plan, inspection document with balloons, gauges, measurements, sample/disposition actions | `apps/mes/app/routes/x+/inspection.$operationId.tsx` + `inspection-lot.$id.*` |
| Picking `/x/picking` | Assigned picking lists grouped into kits; per-line Pick / Short / Scan / Unpick, tracked-lot picker, substitute notice, no-stock warning; Start/Finish list controls | `apps/mes/app/routes/x+/picking*` |
| Material issue `/x/issue` | Tracked/untracked issue flow: serial/batch tabs, scan/select, quantity per lot, expiry policy (`Warn` / `Block` / `BlockWithOverride`), scrap/unconsume/adjustment tabs; FEFO/FIFO auto-seed | `apps/mes/app/routes/x+/{issue,issue-tracked-entity,unconsume,adjustment,event}.tsx`, `components/JobOperation/components/IssueMaterialModal.tsx` |
| Scrap / rework / complete / finish | Quantity-modal transactions: scrap posts a production-quantity row, backflush, tracked-entity terminal status and WIP→scrap journal; complete/rework post non-scrap quantities; finish ends active events; warnings for unissued tracked material, short quantity, missing steps | `apps/mes/app/routes/x+/{scrap,rework,complete,finish}.tsx`, `components/JobOperation/components/QuantityModal.tsx` |
| Timecard | "My Hours" week view with total hours, Clock In/Out, per-entry edit/delete, active badge | `apps/mes/app/routes/x+/timecard.tsx` |
| Maintenance | All / Today / Assigned / Blocking dispatch tabs; dispatch detail with time entries, spare parts, procedure, Complete | `apps/mes/app/routes/x+/maintenance.tsx`, `dispatch.$dispatchId.tsx` |
| Wall displays | Chrome-free `/display/:workCenterId/work` and `/maintenance` boards for work centers | `apps/mes/app/routes/display+/$workCenterId.{work,maintenance}.tsx` |
| Scanning / shortcuts | Global keyboard-wedge accepts MES/ERP URLs; operation/assembly watch the kanban `completedBarcodeOverride`; labels PDF/ZPL; `alt+1…7` queues, Space/Enter primary step, arrows navigate | `apps/mes/app/routes/x+/_layout.tsx`, `apps/mes/app/shortcuts.ts`, `apps/mes/app/utils/path.ts` |

### Odoo — work-order list controls, no community shop-floor app

Odoo Community has no dedicated Shop Floor kiosk (the enterprise app is absent from this
checkout). Execution happens in the **Work Orders** list/form: each row has Start, Pause
and Done buttons and a live timer, and the form has a **Time Tracking** tab.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Work Orders list | Editable list with operation, work center, product, quantity/to produce/produced/remaining, start/end dates, expected/real duration (timer widget), state, planning-conflict icon; buttons **Start** (red when the work center is blocked, green otherwise), **Pause**, **Done** | `odoo/addons/mrp/views/mrp_workorder_views.xml` (`mrp_production_workorder_tree_editable_view`, `mrp_production_workorder_to_plan_list`) |
| Work Order form | Product, parent MO, produced/to-produce quantity, start/end, work center, operation, state; **Time Tracking** tab (user, duration, start/end, productivity loss) for managers; **Components** tab; **Blocked By** tab; conflict/planning-issue banners linking to planning | `mrp_workorder_views.xml` (`mrp_production_workorder_form_view_inherit`, pages `time_tracking`, `components`, `dependencies`) |
| Work Orders planning board | Kanban grouped by work center with remaining time in red when negative, scheduled date color-coded, last working user avatar and status bubble; list/calendar/pivot/graph also available | `mrp_workorder_views.xml` (`workcenter_line_kanban`, `action_mrp_workorder_workcenter`) |

### AureusERP — work order with a time-tracking tab, no kiosk

The Work Order form carries a **Time Tracking** tab with productivity logs (user,
duration, start/end, productivity, loss) and a components tab. Execution is record-based;
there is no dedicated operator page or scanner. Useful as the minimal model.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Work Order form / time tracking | Productivity-log repeater and components repeaters inside the Work Order form | `plugins/webkul/manufacturing/src/Filament/Clusters/Operations/Resources/WorkOrderResource/Schemas/WorkOrderForm.php` |
| Manufacturing Order "Done" action | Completion dialog checks consumption issues before posting | `.../Operations/Actions/DoneAction.php` |

### Dolibarr — production screen is the shop-floor UI

No kiosk, scanner or time clock. The operator opens the MO and uses the **Production**
screen: per-line consume/produce actions, global consume/produce-all, warehouse or
workstation selection, quantity and batch fields. Workstation hourly rates feed cost.

### metasfresh — mobile manufacturing workflows over REST

The shop floor is a mobile workflow app driven by REST activity handlers rather than a
web screen in this checkout: raw-material issue, issue-only-what-was-received,
adjustment, material receipt, HU QR-code generation/printing, locator validation, scale
scanning, work report and confirmation. Business commands live under
`de/metas/manufacturing/job/service/commands/{issue,receive,create_job}`.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Raw-material issue workflow | Activity handler for issuing materials to a manufacturing job (including "issue only what was received" and adjustments) | `backend/de.metas.manufacturing.rest-api/src/main/java/de/metas/manufacturing/workflows_api/activity_handlers/issue/RawMaterialsIssueActivityHandler.java`, `.../issue/RawMaterialsIssueAdjustmentActivityHandler.java` |
| Goods receipt / work report / confirmation | Receive finished goods, report work, confirm activity; HU QR generation and printing; scale/locator validation | `.../activity_handlers/receive/MaterialReceiptActivityHandler.java`, `.../work_report/WorkReportActivityHandler.java`, `.../confirmation/ConfirmationActivityHandler.java`, `.../generateHUQRCodes/`, `.../printReceivedHUQRCodes/` |

**BOSS implications.** Shop floor is a different product surface from the planner's
screens and must not be a tab on the work-order form. ERPNext proves the minimum: queue
board + operator card with Start/Pause/End, live timer, material panel with a transfer
action, instructions, quantity reconciliation (completed + pending + process loss), and a
scanner. Carbon proves the next tier: operation DAG, per-unit tracking, assembly and
inspection execution, material-issue modal, wall displays, and a keyboard-wedge that
accepts scanned URLs. For BOSS, build the ERPNext-shaped kiosk first (one screen, two
views, keyboard + scanner, large touch targets), then add Carbon's operation-DAG and
issue-modal patterns. Quantity reconciliation and material availability must be visible
before the operator can start, and every action must post through a service call that
returns the updated state, never mutate rows client-side.

---

## 6. Planning & MRP

### ERPNext — Production Plan, MPS, forecast, MRP report and a visualizer

ERPNext has the broadest planning surface: a demand document (Production Plan), a master
schedule (MPS), sales forecasts, a bucket-view MRP report, and a Gantt-like visualizer.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Production Plan form | **Get Items From** Sales Order or Material Request; filters item/customer/warehouse/project/date; **Get Sales Orders**, **Get Finished Goods**; **Assembly Items** table (planned/ordered/produced/pending qty, planned start/end, BOM, warehouse); **Raw Materials** table (required/qty, ordered, projected); sub-assembly tables; **Get Items for Purchase Only**, **Get Items for Purchase / Transfer**, **Get Sub Assembly Items**; options include safety stock, projected qty, minimum order qty, reserve stock, shifts | `erpnext/manufacturing/doctype/production_plan/production_plan.json`, `production_plan.js` |
| Production Plan status | Draft → Submitted → Not Started → In Process → Completed / Closed / Cancelled / Material Requested | `.../production_plan/production_plan.json` |
| Production Plan Visualizer | Page that picks one plan and renders a **Finished Goods** pane plus a timeline grouped **By Workstation** or by supplier, with schedule blocks, status badges, progress and detail; backed by `Production Plan Schedule` rows (row type, planned row, operation, workstation, supplier, from/to, duration) | `erpnext/manufacturing/page/production_plan_visualizer/production_plan_visualizer.js`; `.../doctype/production_plan_schedule/` |
| Master Production Schedule | Items table with item, warehouse, delivery date, planned qty, **order release date**, BOM, cumulative lead time; **Get Actual Demand** (sales orders) and **Get Forecast Demand**; demand tabs for sales orders and material requests | `.../doctype/master_production_schedule/master_production_schedule.json`, `master_production_schedule_item/` |
| Sales Forecast | Item/UoM/delivery date/demand qty/warehouse rows feeding forecast demand | `.../doctype/sales_forecast/`, `sales_forecast_item/` |
| Material Requirements Planning Report | Bucketed report (daily/weekly) with filters including MPS, type of material, warehouse, from/to date; columns cover projected qty, actual/planned orders, shortfall; optional chart | `.../report/material_requirements_planning_report/material_requirements_planning_report.py`, `.js` |
| Production Planning Report / Summary | Additional planning reports linked from the workspace | `.../report/production_planning_report/`, `production_plan_summary/` |

### Carbon — MRP planning grid and a finite scheduler

Carbon separates **MRP** (what to make/buy) from **finite scheduling** (when/where it
runs). Both engines are server-only; the UI exposes the resulting actions and boards.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Material Planning `/x/production/planning` | Item × week grid over 48 periods. Row action **Make N** opens the order drawer; bulk **Create Jobs** and **Apply Suggested Changes**; location picker and **Recalculate** (MRP). Grid shows time fence, first negative date, latest order date, on-hand and planning actions | `apps/erp/app/routes/x+/production+/planning.tsx`, `modules/production/ui/Planning/ProductionPlanningTable.tsx`, `Planning/planningColumns.tsx` |
| Planning order drawer | Planning-policy summary and editable time fence; **Suggested Jobs** (quantity + Start By) from open Make actions; **Open Jobs** change actions; **Plan** a Draft job or **Make** a new one; "N More After <fence>" | `.../ui/Planning/ProductionPlanningOrderDrawer.tsx`, `PlanningDrawerParts.tsx`, `PlanningActionLines.tsx` |
| Demand Forecasts `/x/production/demand-forecasts` | 52-week demand per item/location, editable weekly columns with summary chart and quarter grouping | `apps/erp/app/routes/x+/production+/demand-forecasts.tsx`, `ui/DemandProjection/*` |
| Forecast (Gantt) `/x/scheduling/forecast` | Resource timeline of capacity reservations per work center; Day/Week/Shift, Compact/Detailed, non-working shading, maintenance downtime, empty lanes for every work center; **Regenerate** runs the scheduler | `apps/erp/app/routes/x+/scheduling+/forecast.tsx`, `ui/Schedule/{ForecastHeader,resourceTimeline,TimelineDetail}.tsx`, `packages/planning/src/scheduling/` |
| Priorities — job dates `/x/priority/dates` | Job cards across date columns (week/month) plus **unscheduled / next-week / next-month** sentinels; drag to set/reschedule | `apps/erp/app/routes/x+/priority+/dates.tsx`, `ui/Schedule/Kanban/DateKanban.tsx` |
| Priorities — operations `/x/priority/operations` | Operation cards across work-center columns; drag reassigns work center and priority; batch cards move as a unit | `apps/erp/app/routes/x+/priority+/operations.tsx`, `ui/Schedule/Kanban/Kanban.tsx` |
| Resource Planning | People board (people × work centers, drag assignment, absences, overtime/time off), matrix, and capacity table with Scheduled/Available/Load/Due series | `apps/erp/app/routes/x+/priority+/people.tsx`, `ui/Schedule/People/*` |
| Outbound `/x/scheduling/outbound` | Sales-order jobs projected to complete, with promised vs completion lateness and progress | `apps/erp/app/routes/x+/scheduling+/outbound.tsx` |
| Engines | `runMrp` (72-week horizon, BOM explosion, netting, forecast consumption, supply dates, planning actions) and `runLocationSchedule` (deterministic forward-ASAP finite scheduler; availability ladder lights-out → work-center shifts → location shifts → Mon–Fri 8 h) | `packages/planning/src/mrp/mrp.ts`, `planning-actions.ts`, `scheduling/run-schedule.ts`, `machine-availability.ts`, `slot-allocator.ts` |

### Dolibarr — BOM net needs is the whole MRP story

No MRP run, no master schedule, no capacity board. **BOM Net Needs** explodes the BOM
against stock and marks shortages; the MO list's planned dates and "late" filter are the
rest of the planning UI.

### Odoo — no MRP engine in community; planning is reordering + the work-order board

Odoo's **Planning** menu is effectively empty in this checkout (only a hidden scheduler
cron is attached); master production scheduling is an enterprise add-on. Planning in
practice is:

- Inventory → Operations → **Replenishment** (orderpoints, with an optional BOM column),
  driven by stock rules; a BOM can be attached to an orderpoint.
- The **Work Orders** planning board (kanban grouped by work center) and its
  **has_conflicts** / **has_planning_issues** indicators, plus **Plan/Unplan** on the MO
  and work-order rows.
- MO list filters for late/today and the rescheduling popover.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Replenishment / orderpoints | Editable list with an optional BOM column, forecast warning links, snooze; the orderpoint is the only "what to make" trigger | `odoo/addons/stock/views/stock_orderpoint_views.xml`, `mrp/views/stock_orderpoint_views.xml` |
| Work-order planning indicators | `has_conflicts` (overlapping work orders in a work center) and `has_planning_issues` (planned before a blocking work order) with link to the planning board; `remaining_time` | `odoo/addons/mrp/models/mrp_workorder.py`, `mrp/views/mrp_workorder_views.xml` |
| MRP cron | Hidden server action; no user-facing MRP screen | `mrp/views/stock_move_views.xml` (`menu_procurement_compute_mrp`, `groups="base.group_no_one"`) |

### AureusERP — no planning module, only lead-time settings

AureusERP ships no MRP, MPS or scheduling screens. The only planning surface is the
settings page **Manage Planning** (manufacturing lead time) and per-BOM lead-time fields.
The MO list and work-order list are the queues. Treat it as an execution-only reference.

### metasfresh — PP Order Candidate as the planning worklist

Planning is candidate-driven: MRP produces `PP_Order_Candidate` rows, the planner edits
start date and workstation, then converts candidates to manufacturing orders. The header
aggregates selected candidates (resource count, qty to process, qty processed).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| PP Order Candidate window | Candidate list with aggregated selection header; process actions **Set Start Date**, **Set Workstation** | `frontend/src/components/ppOrderCandidate/PPOrderCandidateViewHeader.js`, `backend/de.metas.manufacturing.webui/.../process/PP_Order_Candidate_SetStartDate.java`, `PP_Order_Candidate_SetWorkstation.java` |
| Manufacturing mobile/workflow | Job creation/issue/receive commands used by the mobile workflows | `backend/de.metas.manufacturing.rest-api/.../job/service/commands/{create_job,issue,issue_what_was_received,receive}` |

**BOSS implications.** Do not conflate two different screens: **MRP** answers "what do we
need, and by when" (Carbon's planning grid, ERPNext's Production Plan/MPS, metasfresh's
candidate list), while **scheduling** answers "which work center and when" (Carbon's
Gantt/kanban and Odoo's work-order board). For BOSS, start with the ERPNext/Metafresh
shape: a planning worklist of suggested make/buy actions with a time fence, age, required
date and a single **Create work order** action; then add a work-center timeline. A full
finite scheduler is a later, server-side concern. Dolibarr's net-needs explosion is the
minimum first release and is cheap to implement on Moqui; avoid Odoo's gap where
community users have no MRP screen at all.

---

## 7. Subcontracting

### Odoo — BOM type `subcontract`, simplified MO, portal

Installing `mrp_subcontracting` adds a third BoM type, **Subcontract**, with one or more
subcontractors on the BoM. The resulting manufacturing order is deliberately reduced: no
operations, by-products or miscellaneous tab; it records component transfers to the
subcontractor and receipt of the finished product.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Subcontract BoM | BoM form gains `subcontractor_ids` (required when type = subcontract); operations/readiness hidden | `odoo/addons/mrp_subcontracting/views/mrp_bom_views.xml` |
| Subcontract MO form | Reduced form: status bar Draft → Confirmed → Done; smart buttons only Transfers and Overview; raw components shown as move lines; no work orders/by-products/misc | `mrp_subcontracting/views/mrp_production_views.xml` (`mrp_production_subcontracting_form_view`) |
| Subcontracting portal | Customer-facing **My Productions** list and subcontracting view for portal users | `mrp_subcontracting/views/subcontracting_portal_templates.xml`, `subcontracting_portal_views.xml` |
| Subcontractor partner/product setup | Subcontractor flag on partner, subcontracting supplier info on products | `mrp_subcontracting/views/res_partner_views.xml`, `supplier_info_views.xml` |

### ERPNext — two directions: subcontracting out and inward processing

ERPNext separates buying a subcontract service (Subcontracting Order/Receipt) from doing
work on a customer's material (Subcontracting Inward Order).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Subcontracting Order | Purchase-order-like document: supplier, supplier warehouse, PO link, items, **service items**, **supplied items**, reserve stock, status/per-received, additional costs, project | `erpnext/subcontracting/doctype/subcontracting_order/subcontracting_order.json` |
| Subcontracting Receipt | Receipt of finished goods with accepted/rejected warehouse, items, **supplied items**, status, return fields | `.../subcontracting_receipt/subcontracting_receipt.json` |
| Subcontracting Inward Order | Customer-owned material processing: customer, items, service items, received items, per-delivered/per-produced/per-process-loss/per-raw-material-returned, delivery warehouse | `.../subcontracting_inward_order/subcontracting_inward_order.json` |
| Job Card / Work Order links | Job Card has `is_subcontracted` and subcontracting fields; Work Order action **Make Subcontracting PO** | `.../job_card/job_card.json`; `manufacturing/doctype/work_order/work_order.js` |
| Material transfer | Subcontracting stock entries move supplied components to the supplier warehouse | `subcontracting/doctype/subcontracting_order/`, stock entry mapping in `subcontracting/` |

### Carbon — Outside Processing is an operation type

Carbon models subcontracting as an operation, not a document type: `Outside Processing`
operations carry supplier, minimum cost, unit cost and lead time, and are mixed freely
with in-house operations in the Bill of Process. This is the simplest integration with
routing, scheduling and costing.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Bill of Process — Outside Processing | Operation type `Outside Processing`; supplier + minimum/unit cost + lead time fields; switching an operation in/out of outside processing changes the form | `apps/erp/app/modules/items/ui/Item/BillOfProcess.tsx`, `apps/erp/app/modules/shared/shared.models.ts` (operation type enum) |

**BOSS implications.** Model subcontracting as an operation with a supplier (Carbon) or a
BoM type (Odoo), not as a separate order app. The required screens are: supplier-assigned
operation on the routing, a component-transfer document to the supplier, and a
finished-goods receipt with accepted/rejected quantities. ERPNext's inward order is a
different business (customer-owned material) and can wait; do not fold it into the same
document. Subcontracting should be deferred until the in-house order lifecycle is stable.

---

## 8. Quality, downtime & scrap

### ERPNext — Quality Inspection is a first-class document wired into Job Cards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quality Inspection form | Reference type/name (Job Card, Work Order, Purchase Receipt, etc.), item, serial/batch, sample size, inspection template, readings, status **Passed/Failed**, inspected/verified by, manual-inspection flag, remarks | `erpnext/stock/doctype/quality_inspection/quality_inspection.json` |
| Quality Inspection Template | Named checklist of readings/parameters reused by inspections | `erpnext/stock/doctype/quality_inspection_template/` |
| Job Card QC | `quality_inspection` link, `quality_inspection_template`, `quality_inspection_required` on BOM operation; Job Card blocks completion until inspection passes when required | `manufacturing/doctype/job_card/job_card.json`, `bom_operation.json`; Shop Floor QC pills in `public/js/shop_floor/shop_floor.js` |
| Non-conformance / quality management | Separate module: Non Conformance, Quality Action (+ resolutions), Quality Review (+ objectives), Quality Feedback (+ template/parameters), Quality Goal, Quality Meeting (+ agenda/minutes), Quality Procedure (+ processes) | `erpnext/quality_management/doctype/` |
| Quality reports | **Quality Inspection Summary** and **Cost of Poor Quality** reports linked from the Manufacturing workspace | `manufacturing/report/quality_inspection_summary/`, `cost_of_poor_quality_report/` |
| Downtime Entry | Workstation/operation downtime with reason, from/to; feeds **Downtime Analysis** report and the Visual Plant Floor status | `manufacturing/doctype/downtime_entry/downtime_entry.json`; `manufacturing/report/downtime_analysis/` |
| Process loss / scrap | Process loss quantity on Job Card, Work Order and Production Plan; **Process Loss Report**; scrap warehouse on Work Order | `job_card.json`, `work_order.json`, `manufacturing/report/process_loss_report/` |

### Carbon — full quality module plus MES inspection execution

Carbon's quality module is the widest in the checkout and is linked to items, lots and
production operations.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inspections `/x/quality/inspections`, `/x/inspection/:id` | Inspection list and execution: sample, measurement, gauge, document, accept/reject/partial; readings against an inspection document; status **Pending / Passed / Failed** | `apps/erp/app/routes/x+/quality+/inspections.tsx`, `x+/inspection+/$id*.tsx`; `modules/quality/ui/Inspections/*` |
| Inspection plans | Plan per item/operation defining characteristics, sample size and gauges | `x+/quality+/inspection-plans.tsx`, `inspection-plans.new.tsx` |
| Inbound inspections | Receiving-side inspection queue and detail | `x+/quality+/inbound-inspections.tsx`, `inbound-inspections.$id.tsx` |
| Item/tool/material quality views | Quality tab on part/material/tool/service records (inspection plans, documents, history) | `x+/part+/$itemId.quality.tsx`, `material+/$itemId.quality.tsx`, `tool+/$itemId.quality.tsx`, `service+/$itemId.quality.tsx` |
| Gauges and calibrations | Gauge master, gauge types, calibration records with status | `x+/quality+/{gauges,gauge-types,calibrations}*` |
| Issues / issue types / workflows / required actions / risks | Quality issue tracking, issue-type config, workflow, corrective actions, risk register | `x+/quality+/{issues,issue-types,issue-workflows,required-actions,risks}*`; `modules/quality/ui/*` |
| Quality documents / inspection documents | Controlled documents and drawing/balloon inspection documents | `x+/quality-document+`, `x+/inspection-document+`; `modules/quality/ui/{Documents,InspectionDocument}/*` |
| MES inspection execution | Operator-side inspection route; sample/measurement/gauge/disposition/complete-passed steps | `apps/mes/app/routes/x+/inspection.$operationId.tsx`, `inspection-lot.$id.{sample,measurement,gauge,disposition,complete-passed}.tsx` |
| Scrap / rework from the floor | Scrap reasons config; operation **More actions → Scrap / Rework / Quality Issue**; scrap quantity and reason on production-quantity rows | `x+/production+/scrap-reasons*`; `apps/mes/app/components/JobOperation/components/{QuantityModal,ScrapTab,ScrapEntityModal,ReworkModal}.tsx` |

### Odoo — only scrap and OEE loss reasons; no quality module

No `quality*` addon is present in this community checkout. The available controls are:

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Scrap | Stock scrap action registered under Manufacturing → Operations; scrap moves counted on the MO smart button | `odoo/addons/mrp/views/stock_move_views.xml`, `mrp_production_views.xml` (`action_see_move_scrap`) |
| Productivity loss / OEE | Work-center productivity-loss records (productive, blocked, performance) feed OEE reports and the lost-time smart button | `mrp/models/mrp_workcenter.py`, `mrp/views/mrp_workcenter_views.xml` |

### AureusERP, Dolibarr, metasfresh

No production quality-inspection or downtime screens. AureusERP has no quality cluster in
the manufacturing plugin; Dolibarr relies on generic notes/documents; metasfresh's
manufacturing mobile workflows have no inspection activity in this checkout.

**BOSS implications.** Treat quality as its own screen set, not a tab: **Inspection**
(linked to work order/operation/lot, with a template of readings and a Pass/Fail/
conditional disposition), **Non-conformance** and **Corrective action**. Wire the
inspection into the operation gate (ERPNext Shop Floor's QC pill) so the floor cannot
complete a required inspection silently. Scrap and process loss belong on the quantity
dialog, not a separate app: scrap quantity, reason, disposition (scrap/rework), and a
backflush-aware stock posting. Downtime needs a reason code and from/to interval because
it feeds OEE; Odoo's productivity-loss model is the minimum. Full gauge calibration and
risk registers are Carbon-only and out of first-release scope.

---

## 9. Costing & variance

| App | Screen | What it shows | Key files |
| --- | --- | --- | --- |
| Odoo | BoM Structure & Cost | Multi-level component costs, by-product cost, BOM total and per-unit cost in the BOM currency | `odoo/addons/mrp/report/mrp_report_bom_structure.xml`, `.py` |
| Odoo | MO Overview | Unit cost and MO cost, split into component cost and operation cost; cost breakdown per component/operation when the MO is done | `mrp/report/mrp_report_mo_overview.xml`, `.py` |
| Odoo | Work center | `costs_hour` and time efficiency feed operation cost; OEE/productivity losses explain lost time | `mrp/models/mrp_workcenter.py`, `mrp/views/mrp_workcenter_views.xml` |
| Odoo | Valuation | `mrp_account` posts manufacturing valuation entries; no user-facing cost screen in this module | `odoo/addons/mrp_account/` |
| ERPNext | BOM **Costing** tab | Operating cost, raw-material cost, total/base totals, project; rate basis (valuation/last purchase/price list) | `erpnext/manufacturing/doctype/bom/bom.json` |
| ERPNext | Work Order cost fields | Planned/actual/additional/total operating cost; consumed material cost; finished-goods valuation | `.../work_order/work_order.json`, `work_order.js` (`calculate_total_cost`) |
| ERPNext | BOM Variance / Process Loss reports | Planned vs actual BOM cost and quantity loss | `manufacturing/report/bom_variance_report/`, `process_loss_report/` |
| Carbon | Job **Estimates vs Actuals** | Estimated vs actual time per operation, estimated vs issued material quantity and cost | `apps/erp/app/modules/production/ui/Jobs/JobEstimatesVsActuals.tsx` |
| Carbon | Work center rates | Labor, machine, overhead rates and capital-cost/depreciation table | `apps/erp/app/modules/resources/ui/WorkCenters/WorkCenterForm.tsx` |
| Dolibarr | BOM card / MO production | BOM `calculateCosts()` unit cost; MO line cost from workstation hourly rates; optional cost columns in the production table | `htdocs/bom/class/bom.class.php`, `htdocs/mrp/mo_production.php` |
| AureusERP | MO Overview | Component unit/total/real cost and work-order unit cost | `.../Pages/OverviewManufacturingOrder.php` |
| metasfresh | No cost UI in this checkout | Costing is backend/accounting; not a planning screen | — |

**BOSS implications.** Cost must be visible where decisions happen: a BOM cost roll-up on
the BOM overview, and a work-order cost panel split into material vs operation. Odoo's
two-report split (BOM structure cost vs MO overview) is the clearest. Keep valuation
posting in Accounting and expose only estimates/actuals in Manufacturing; a variance
column is enough for the first release.

---

## 10. Reports & analytics

| App | Reports / analytics surface | Key files |
| --- | --- | --- |
| ERPNext | 21 manufacturing report definitions: Production Analytics, Work Order Summary, Open/In Progress/Completed, Work Order Consumed Materials, Work Order Stock, Issued Items, Job Card Summary, Downtime Analysis, Process Loss, Cost of Poor Quality, Quality Inspection Summary, Production Planning, Production Plan Summary, MRP, Exponential Smoothing Forecasting, BOM Explorer/Stock Analysis/Variance/Operations Time, plus dashboards | `erpnext/manufacturing/report/`, `workspace/manufacturing/manufacturing.json` |
| Odoo | Pivot/graph views over MOs and work orders; **BoM Overview**; **MO Overview**; **Workcenter Load** pivot/graph; OEE pie/form/list/graph/pivot; traceability; lots/serials | `mrp/views/mrp_production_views.xml`, `mrp_workorder_views.xml`, `mrp_workcenter_views.xml`, `mrp/report/` |
| Carbon | Production dashboard with **Work Center Utilization**, **Estimates vs Actuals**, **Completion Time** KPIs (week/month/quarter/year) and CSV export; capacity Load/Due series; OEE machine-time review | `apps/erp/app/routes/x+/production+/_index.tsx`, `production.models.ts` (`KPIs`), `ui/Schedule/People/PeopleCapacity.tsx`, `ui/MachineTime/*` |
| AureusERP | No report pages; the MO Overview page is the only analytical surface. Lists support column selection/grouping/filters. | `.../Pages/OverviewManufacturingOrder.php`, `Tables/ManufacturingOrdersTable.php` |
| Dolibarr | No manufacturing report pages; list exports, status filters, BOM net needs and cost cards | `htdocs/mrp/mo_list.php`, `htdocs/bom/bom_net_needs.php` |
| metasfresh | Candidate header aggregates only (resources, qty to process, qty processed); reporting is generic/backend | `frontend/src/components/ppOrderCandidate/PPOrderCandidateViewHeader.js` |

**BOSS implications.** Copy ERPNext's report taxonomy rather than inventing names; most
of those are saved finds over the same entities. Start with five: open/late work orders,
work-order material status, operation load by work center, OEE/lost time, and
scrap/process loss. Carbon's dashboard KPIs belong on the Manufacturing landing page.
Reports should be normal Moqui find screens with saved parameters, not a separate report
engine.

---

## 11. Configuration & settings

| App | Screen | Contents | Key files |
| --- | --- | --- | --- |
| Odoo | Manufacturing Settings | **Work Orders** (routings group), subcontracting module, barcode module, **Quality Control** module + worksheet, unlocked quantity edits, by-products group, MPS module | `odoo/addons/mrp/views/res_config_settings_views.xml` |
| Odoo | Work Centers / Operations | Capacity, efficiency, OEE target, cost/hour, calendars, alternatives; operation time modes | `mrp_views_menus.xml` (`menu_mrp_configuration`), `mrp_workcenter_views.xml`, `mrp_routing_views.xml` |
| ERPNext | Manufacturing Settings | Overtime/holiday production, capacity planning days, minutes between operations, overproduction % (sales order/work order), backflush basis, material consumption, auto-update BOM costs, disable capacity planning, serial/batch from work order, corrective operation cost, job-card excess transfer, RM cost from consumption, component quantity validation, enforce time logs, extra material %, edit items/quantities in WO, alternative finished goods, sub-assembly cost | `erpnext/manufacturing/doctype/manufacturing_settings/manufacturing_settings.json` |
| ERPNext | Masters | Operation, Routing, Workstation, Workstation Type, Plant Floor, BOM Update Tool | `manufacturing/doctype/{operation,routing,workstation,workstation_type,plant_floor,bom_update_tool}/` |
| Carbon | Configure | Scrap Reasons; work centers and processes under Resources | `apps/erp/app/modules/production/ui/useProductionSubmodules.tsx`, `routes/x+/resources+/{work-centers,processes}*` |
| AureusERP | Configurations + Settings | Operation and Work Center resources; **Manage Operations**, **Manage Planning** (manufacturing lead time), **Manage Operations** settings page | `plugins/webkul/manufacturing/src/Filament/Clusters/{Configurations,Settings}/` |
| Dolibarr | Module setup | Enable MRP/BOM/Workstation modules, numbering models, extrafields, default warehouses | `htdocs/core/modules/{mrp,bom,workstation}/`, `htdocs/admin/` |
| metasfresh | Metadata windows | Work centers/resources, BOM/order windows, planning candidate processes | `backend/de.metas.manufacturing*`, `frontend/src/components/window/` |

**BOSS implications.** Settings should be small and explicit: enable operations/work
centers, default backflush/consumption policy, overproduction tolerance, auto-update BOM
cost, capacity planning horizon, and time-log enforcement. Put master data (operations,
work centers, scrap reasons) in the app's Configuration section, not in Admin; they are
operational, not system, settings.

---

## 12. Cross-app surfaces

| Surface | Manufacturing face | Reference evidence |
| --- | --- | --- |
| **Warehouse / Inventory** | Component issue and finished-goods receipt; availability and reservation on the MO; transfers to/from WIP; scrap warehouse; lot/serial traceability | Odoo raw/finished moves and Transfers smart button (`mrp_production_views.xml`); ERPNext Material Transfer for Manufacture / Manufacture stock entries (`work_order.js`); Carbon materials/issue/picking MES (`job.$jobId.materials.tsx`, `x+/issue`); Dolibarr consumption/production tables (`mo_production.php`) |
| **Purchasing** | MRP suggestions become purchase orders or material requests; BOM component shortage triggers buying; subcontracting PO | ERPNext **Get Items for Purchase Only** on Production Plan, MRP report, Subcontracting Order; Carbon planning **Make** actions and purchase-order card on the job; Odoo orderpoints/BOM column |
| **Sales** | Sales order creates/links a work order; promised date drives priority and outbound | ERPNext Work Order `sales_order`/`sales_order_item`, Production Plan from sales orders; Carbon jobs list customer/sales order and **Outbound** screen; Odoo MO `origin` |
| **Products** | BOM and operations live on the product; product 360 shows BOM/where-used and cost | Odoo BoM form + product BoM actions (`product_views.xml`, `template_open_bom`); ERPNext BOM; Aureus Product → **Bills of Materials** tab |
| **Maintenance** | Work centers/equipment downtime blocks or delays operations; maintenance dispatches from the floor | Carbon MES maintenance + work center `takesWorkCenterOffline` in the scheduler; Odoo `mrp_repair` (repair orders, separate from production); ERPNext downtime entry |
| **Accounting** | Material and operation cost postings; WIP and finished-goods valuation; variance | Odoo `mrp_account`; ERPNext stock entries and BOM variance; Dolibarr stock movements |
| **People / Projects** | Operators and time logs; production time can feed project or job costing | ERPNext Job Card Time Log employee; Carbon timecard and people board; Odoo work-order time tracking user |
| **Commons / Comms** | Notes, documents, chatter/timeline on BOMs, MOs and work orders; tasks for follow-up | Odoo chatter on BoM/MO/work center; ERPNext document attachments and comments; Carbon job notes/documents |
| **Insights** | OEE, utilization, completion time, scrap rate, on-time delivery, WIP value | Carbon dashboard KPIs; Odoo OEE/workcenter load; ERPNext workspace chart/cards |

**BOSS implications.** Manufacturing must reuse the shared Warehouse shipment/receipt
screens for material issue and finished-goods receipt, and the shared Product 360 BOM tab.
Do not build a second inventory screen. Maintenance owns equipment downtime; Manufacturing
reads it to block scheduling. Insights owns the cross-app KPIs; Manufacturing supplies
counts, not charts of its own beyond the landing strip.

---

## 13. Current Moqui baseline (MrSimpleScreens)

The existing Moqui implementation is a production-run worklist, not a manufacturing app.
It is the migration starting point, not a design reference.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Manufacturing menu | Top-level **Manufacturing** with a popup subscreen panel; default item is the dashboard | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Manufacturing.xml` |
| Manufacturing dashboard | Links to **Production Runs**, inventory assets and equipment assets | `.../Manufacturing/dashboard.xml` |
| Production Runs list | `WorkEffortProductionRunFind` list with status filter (planning/approved/in-progress/on-hold), facility, start date, produce/consume product columns; **New Production Run** dialog (name, facility, start, estimated hours, product to produce, estimated quantity/amount); saved finds, column selection | `.../Manufacturing/Run/FindRun.xml` |
| Production Run detail | Update header (name, facility, start, estimated hours), **Run Pick PDF**, **Clone Run**, notes, equipment assignments, parties assigned (role Worker) | `.../Manufacturing/Run/EditRun.xml` |
| Run Products | Two boxes: **Products to Produce** (add product, receive/produce asset, ATP/QOH, estimated vs produced) and **Products to Consume** (BOM suggestion with remaining quantity, add/issue asset, over-consumption warning) | `.../Manufacturing/Run/RunProducts.xml`, `RunProducts/{ConsumeAsset,ConsumeProduct,ProduceAsset}.xml` |
| Assets Consumed | Issued-asset list per run: product, quantity, UoM, asset, ATP/QOH, issuance, receive/return action | `.../Manufacturing/Run/RunConsumed.xml` |
| Assets Produced | Received-asset list per run: product, quantity, UoM, asset, ATP/QOH, receipt, issue/return action; receive form reused from Run Products | `.../Manufacturing/Run/RunProduced.xml` |
| Pick document | Printable run pick document (XSL-FO/HTML) | `.../Manufacturing/Run/RunPickDocument.xml`, `template/work/ProductionRunPick.{print.html.fancy,xsl-fo.ftl}` |

**Mantle services.** `mantle.work.ManufacturingServices` owns the domain:
`get#ProductionRunDisplayInfo`, `create#ProductionRun`, `create#ShipmentAssemblyWorkEffort`,
`set#ProducedProductQuantity`, `recreate#ConsumeProductsFromProduce`,
`produce#AvailableAssemblies`, `breakDown#Assembly`, `unissue#AssemblyComponents`,
`unissue#Component`, `cancel#AssemblyWorkEffort`, `get#ConsumedAssetRemaining`,
`get#ProducedProductComplete`, `get#ProductionRunProduceConsumeDetail`,
`get#ProductBomDetail`, `get#ProductionRunPickInfo`
(`runtime/component/mr-mantle-usl/service/mantle/work/ManufacturingServices.xml`). The
spec `runtime/component/mr-mantle-usl/test/ManufacturingServices.spec.js` exercises BOM
lookup, run creation, quantity change, issue/receive, break-down, unissue and cancel.

**Data model actually used.**

- A production run is a `mantle.work.effort.WorkEffort` with `purposeEnumId =
  WepProductionRun` and statuses `WeInPlanning`, `WeApproved`, `WeInProgress`, `WeOnHold`,
  etc.
- Produce/consume lines are `mantle.work.effort.WorkEffortProduct` rows with
  `typeEnumId = WeptProduce` / `WeptConsume`.
- The BOM is *not* a document: `get#ProductBomDetail` reads
  `mantle.product.ProductAssoc` rows with `productAssocTypeEnumId = PatMfgBom`, plus
  `PatVariant` associations so either the virtual or a variant can be consumed.
- Material issue/receipt is asset-based: `AssetIssuance` / `AssetReceipt` through
  `mantle.product.AssetServices.issue#AssetToWorkEffort` and `receive#Asset`.
- BOM editing is generic **Associated** editing on the product (`EditAssocs.xml`,
  association type `PatMfgBom`), not a BOM screen.

**Gaps against the reference apps.**

- No BOM header, revision/status, operations, by-products, phantom kits, or BOM cost
  roll-up. The association table cannot be versioned or copied as a unit.
- No work centers, routings, operation sequence, blocked-by dependencies, standard
  durations, capacity, calendars, or OEE.
- No scheduling or finite capacity; no MRP, net-needs explosion, master schedule,
  forecasting, or planning worklist.
- No shop-floor surface: no operator queue, start/pause timer, per-operation completion,
  material-issue scan, scrap/rework, QC gate, or wall display.
- No time logs tied to operations, no operator/employee attribution beyond a generic
  party assignment.
- No scrap, process-loss, downtime, or quality inspection records.
- No subcontracting, no by-products, no WIP warehouse concept.
- UI is form/list-centric with no kanban/calendar/timeline and no kiosk.

---

## 14. Gaps & BOSS implications

### Notable gaps in the checkout

- **Odoo Community**: no shop-floor kiosk, no quality-control addon, no MRP/MPS engine
  (`mrp_mps` is enterprise and absent), no reusable routing document. The manufacturing
  app is an order/work-order manager plus reporting.
- **ERPNext**: broadest end-to-end manufacturing coverage, but MRP is a report rather than
  a persisted planning engine; finite scheduling is absent (the Production Plan
  Visualizer renders planned rows, it does not solve capacity).
- **Carbon**: deepest execution and scheduling, but planning and MES are separate apps,
  the scheduler is server-only, and several modules (OEE machine time) are enterprise/
  integration-gated.
- **AureusERP**: execution and master data only; no planning, quality, downtime or
  subcontracting screens.
- **Dolibarr**: no routing/operations, no shop floor, no MRP engine; BOM net needs and
  the production screen are the whole story.
- **metasfresh**: planning is candidate/metadata-driven; no web MES or custom production
  form in this checkout (mobile workflows are REST activity handlers).
- **Moqui baseline**: production runs only; no BOM header, routing, work centers, time
  logs, planning or shop-floor surface.

### What each reference contributes

| Concern | Best reference | Copy |
| --- | --- | --- |
| Order record shape | Odoo | Header + Components / Work Orders / By-Products tabs, status bar, smart buttons for every linked document |
| Process gating | ERPNext | Explicit material transfer → manufacture → finish, with the next action always visible |
| Execution decomposition | Carbon | Separate `materials`, `operations`, `quantities`, `events`, DAG, and per-subassembly make-method routes |
| Shop floor | ERPNext for minimum, Carbon for depth | One kiosk screen with manager board + operator card; Start/Pause/End, live timer, materials, instructions, quantity reconciliation, scanner, keyboard |
| Planning worklist | ERPNext / metasfresh | Suggested make/buy actions with time fence, required date, and one-click work-order creation |
| Finite scheduling | Carbon | Work-center timeline, availability ladder, drag date/priority kanban; engine server-side |
| BOM editor | Odoo / AureusERP for layout; Carbon for versioning | Three line collections, copy-operations action, exploded view, cost roll-up; versioned make method with Draft/Active/Archived |
| Quality gate | ERPNext / Carbon | Inspection template → pass/fail → operation cannot complete until required inspection passes |
| Scrap / downtime | ERPNext / Carbon | Quantity dialog with reason + disposition; downtime reason interval feeding OEE |
| Subcontracting | Carbon / Odoo | Outside-processing operation with supplier, component transfer, finished-goods receipt |

### Recommended screen inventory for IronStone Manufacturing

**Landing / queues**

- Manufacturing home: KPI strip (open, WIP, late, component-short, completed this month)
  plus a work-order queue grouped by status/work center and a **Component shortages**
  list. Deep-links into pre-filtered work orders.
- Work Orders find: list/kanban/calendar/pivot over one dataset; saved filters for ready,
  late, blocked, assigned to me, by work center, by product.
- Shop Floor kiosk: manager board (pending/in progress, completed) and operator view
  (start/pause/end, timer, materials, instructions, QC), scanner input, large touch
  targets, keyboard shortcuts.

**Master data**

- BOM find + editor: header (product, quantity, type normal/kit, revision, status),
  Components, Operations, By-Products, exploded view, cost roll-up, where-used.
- Operation catalogue and Work Center editor: calendar, capacity, efficiency, cost/hour,
  alternatives, OEE target.
- Routing: initially operations on the BOM; add a reusable routing document only when
  customers need it.
- Scrap reasons, downtime reasons, inspection templates.

**Execution**

- Work Order detail: header + overview; Components (required/issued/remaining/
  availability), Operations (sequence, work center, status, expected/actual), Materials
  (issue/return), Time logs, By-products, Scrap, Quality, Documents/Notes.
- Production run/operation execution screen: start/pause/end, quantity reconciliation,
  material issue, output receipt.
- Split / merge / backorder / change quantity wizards.
- Scrap and rework dialog; quality inspection screen; non-conformance and corrective
  action (later).

**Planning**

- MRP/net-needs worklist: item, required date, on hand, incoming, shortfall, suggested
  make/buy qty, time fence; **Create work order** / **Create purchase request**.
- Demand/supply view per item (weeks) and a work-center load/timeline view.
- Subcontracting operation + transfer/receipt screens (later release).

### Data-model implications

- Keep `WorkEffort` (`WepProductionRun`) as the production-run header; it already carries
  facility, dates, status, parties, equipment and produce/consume lines.
- Add a real BOM header and version (product, quantity, revision, status, effective
  dates) with component lines that can bind to an operation. The existing
  `ProductAssoc`/`PatMfgBom` rows can be migrated into component lines; do not keep two
  BOM sources.
- Add operation records under the run (sequence, operation definition, work center,
  planned/actual start/end, status, expected/actual duration) and time logs (user,
  start/end, duration, loss reason). Carbon and ERPNext both prove operations must be
  first-class rows, not BOM text.
- Keep produce/consume lines as `WorkEffortProduct` (`WeptProduce`/`WeptConsume`), and
  post material movements through the existing asset issuance/receipt services so the
  Warehouse and Accounting apps see the same stock.
- Add quantity companions everywhere: `estimated`, `issued/consumed`, `completed`,
  `pending`, `scrapped`, `reworked`. Partial completion must not require closing the run.
- Pin the BOM revision and operation set on the run at creation; show an "outdated BOM"
  warning like Odoo rather than silently re-reading master data.
- Scrap/downtime/quality need their own records linked to run + operation + asset/lot;
  do not encode them as negative quantities only.

### First-release cut

1. BOM header/editor + exploded view + cost roll-up.
2. Work centers + operations on the BOM.
3. Work order lifecycle (confirm, plan, start, issue, produce, close) with split/
   backorder.
4. Work-order detail with components/operations/materials/time.
5. Shop-floor kiosk with start/pause/end, quantity reconciliation, material transfer,
   instructions.
6. Net-needs worklist and **Create work order**.
7. Scrap/process loss + downtime reasons.

Defer: finite scheduling, OEE dashboards, quality management module, subcontracting,
assembly 3D instructions, gauge calibration, multi-level planning beyond net needs.

### Open questions for the design

- Does a work order always have operations, or is a no-routing "simple production run"
  still first-class? Dolibarr and the current Mantle model say yes; Odoo hides work orders
  unless routings are enabled. BOSS should support both and let the BOM decide.
- Is a "production run" one work order, or a batch of work orders sharing a setup? Carbon
  makes batches first-class; Odoo/ERPNext do not. Start with one run = one work order and
  add batching only when a real setup-saving case appears.
- Where does scheduling live: Manufacturing or a shared Planning screen used by
  Purchasing/Warehouse? The reference implementations keep it in Manufacturing; BOSS's
  shared-screens rule suggests a `/Manufacturing/Schedule` subscreen that other apps can
  link into read-only.
- Which quantity is authoritative for completion: produced good quantity, or issued
  material consumption? Adopt ERPNext's three-way reconciliation (completed + pending +
  process loss) and never let one silently overwrite the other.
- Do we support kit/phantom BOMs in the first release? They are cheap to implement
  (explode at issue/receipt) and prevent a common workaround (fake assemblies).

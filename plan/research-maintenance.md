# IronStone BOSS — Maintenance app research

Oct 18, 2026

Deeper research pass on the **IronStone Maintenance** app (facilities, equipment & assets,
maintenance work orders, and facility and equipment scheduling admin), cataloguing every
relevant screen/page found in the reference apps. Companion to
[3p-app-reference.md](3p-app-reference.md); feeds the Maintenance row in
[initial-design.md](initial-design.md) plus the maintenance faces of the shared
"Facilities and assets" screens (locations in Warehouse, production equipment in
Manufacturing, facility and equipment schedules in Commons).

**Organization.** Sorted by functional area (not by app): all equipment registers
together, all maintenance-request screens together, etc. Within each area, sub-tables per
reference app. Style mirrors [research-manufacturing.md](research-manufacturing.md) and
[research-warehouse.md](research-warehouse.md).

**Scope.** Business UI only: screens, lists, forms, kanban/calendar boards, dialogs,
mobile/kiosk flows and report pages a facilities or equipment manager, technician or
requester actually touches. Depreciation math, scheduling algorithms and accounting
postings are noted only where they shape a screen. Warehouse locations, production
routing and fixed-asset accounting are covered only where Maintenance links into them.

**Path conventions.** Paths are relative to each repository's own root, as in
3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — `odoo/addons/<addon>/views/` (XML views/actions/menus), `<addon>/models/`, `<addon>/static/src/` (OWL); addons `maintenance`, `hr_maintenance`, `stock_maintenance`, `fleet`, `fleet_maintenance`, `hr_fleet`, `account_fleet`, `repair`, `mrp_repair`, `purchase_repair`, `pos_repair`; industry packages under `industry/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — paths relative to `erpnext/`; assets and asset maintenance in `erpnext/assets/` (doctype dirs with `.json`/`.js`/`.py`, `workspace/`, `sidebar/`, `assets_dashboard/`, `report/`, `dashboard_chart/`, `number_card/`), customer-equipment service in `erpnext/maintenance/`, downtime in `erpnext/manufacturing/`, warranty in `erpnext/support/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — maintenance plugin `plugins/webkul/maintenance/` (Filament clusters/resources/widgets under `src/Filament/`, migrations under `database/migrations/`) |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — ERP maintenance/locations/failure modes in `apps/erp/app/modules/resources/` and routes `apps/erp/app/routes/x+/{resources+,maintenance+}/`; fixed assets and fleet in `apps/erp/app/modules/accounting/ui/FixedAssets/` and `routes/x+/{fixed-asset+,accounting+}/`; technician/MES screens in `apps/mes/app/routes/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — `htdocs/asset/` (fixed assets), `htdocs/fichinter/` (interventions), `htdocs/resource/` (resources), `htdocs/bookcal/` (online booking) |
| **Ever Gauzy** | `/home/jonesde/work/moquiwork/3p_other/ever-co/ever-gauzy` — pages `apps/gauzy/src/app/pages/{equipment,equipment-sharing,equipment-sharing-policy}/`, dialogs `packages/ui-core/shared/src/lib/equipment/`, models `packages/contracts/src/lib/` |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — `backend/de.metas.servicerepair.{base,webui}/`; legacy models in `backend/de.metas.adempiere.adempiere/base/src/main/java-gen/org/compiere/model/` |
| **Nextcloud** | `/home/jonesde/work/moquiwork/3p_other/nextcloud` — `calendar/src/components/Editor/Resources/`, `server/apps/dav/lib/CalDAV/ResourceBooking/`, `server/lib/public/Calendar/{Room,Resource}/` |
| **Zimbra** | `/home/jonesde/work/moquiwork/3p_other/Zimbra` — `zm-admin-console/WebRoot/js/zimbraAdmin/resource/` |
| **Moqui baseline** | `/home/jonesde/work/moquiwork/mr-moqui-base` — `runtime/component/MrSimpleScreens/screen/SimpleScreens/{Asset,Facility}/`, `runtime/component/MrMarbleERP/screen/`, `runtime/component/mr-mantle-udm/entity/`, `runtime/component/mr-mantle-usl/service/mantle/` |

Not used here: Twenty, Akaunting and the other Frappe apps ship no maintenance
or facility UI (HRMS only adds a **Full and Final Asset** row for assets returned at employee exit, `hrms/hr/doctype/full_and_final_asset/`). The Moqui components in `3p_moqui/` (Sales, WorkManagement, WeCreate,
coarchy, resistmanagement, ServiceJobMonitor, ridgecrest) have no asset, equipment,
facility or maintenance screens.

Sections: [1 home & work queues](#1-maintenance-home--work-queues) · [2 facilities & locations](#2-facilities--locations) · [3 equipment & asset register](#3-equipment--asset-register) · [4 requests / work orders](#4-maintenance-requests--work-orders) · [5 preventive & schedules](#5-preventive-maintenance--schedules) · [6 technician & field execution](#6-technician--mobile--field-execution) · [7 booking & scheduling admin](#7-facility--equipment-booking--scheduling-admin) · [8 fixed assets](#8-fixed-assets-lifecycle) · [9 fleet](#9-fleet--vehicles) · [10 failure, downtime & reliability](#10-failure-modes-downtime--reliability) · [11 reports](#11-reports--analytics) · [12 configuration](#12-configuration--settings) · [13 cross-app surfaces](#13-cross-app-surfaces) · [14 current Moqui baseline](#14-current-moqui-baseline-mrsimplescreens--marbleerp--mantle) · [15 gaps & BOSS implications](#15-gaps--boss-implications)

---

## 1. Maintenance home & work queues

### Odoo — team kanban dashboard; request kanban is the work queue

The **Maintenance** app opens on a team dashboard (`maintenance.team` kanban, action path
`/maintenance`). Each team card carries live counters that deep-link into the filtered
request queue. The request kanban grouped by stage is where technicians actually work.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Maintenance root menu | **Dashboard** · **Maintenance** (Maintenance Requests) · **Equipment** · **Reporting** (Maintenance Requests analysis; placeholder sub-menus **Overall Equipment Effectiveness (OEE)** and **Losses Analysis** for the MRP bridge) · **Configuration** (Settings, Maintenance Teams, Equipment Categories, Maintenance Stages in debug mode); gated by `group_equipment_manager` / `base.group_user` | `odoo/addons/maintenance/views/maintenance_views.xml` (menuitems `menu_maintenance_title`, `menu_m_dashboard`, `menu_m_request`, `menu_m_request_form`, `menu_equipment_form`, `menu_m_reports`, `menu_m_reports_oee`, `menu_m_reports_losses`, `maintenance_reporting`, `menu_maintenance_configuration`, `menu_maintenance_teams`, `menu_maintenance_cat`, `menu_maintenance_stage_configuration`); `views/res_config_settings_views.xml` |
| Team dashboard | Kanban of teams; card shows **N To Do** button plus conditional links: scheduled count (opens calendar), high priority, changes requested, unscheduled; card menu has Requests → All / To Do / Done / Cancelled and Reporting → Maintenance Requests; color picker | `maintenance_views.xml` (`maintenance_team_kanban`, action `maintenance_dashboard_action`, drill action `hr_equipment_todo_request_action_from_dashboard`); counters `todo_request_count*` on `maintenance.team` in `models/maintenance.py`; styling `static/src/scss/maintenance_team_dashboard.scss` |
| Request queue | `maintenance.request` in kanban (default group by stage, card shows priority, assignees, equipment, activity), list, form, pivot, graph, calendar and activity views; search filters **My Maintenances**, Open/Done/Cancelled, In Progress/Changes Requested/Approved, **High-priority**, **Unscheduled**, unread messages, activity filters; group by Assigned to, Category, Stage, Created By | `maintenance_views.xml` (`hr_equipment_request_view_kanban`, `hr_equipment_request_view_card`, `hr_equipment_request_view_tree`, `hr_equipment_request_view_search`, `maintenance_request_view_activity`, action `hr_equipment_request_action`) |
| Activity view | Per-request activities (to-do, call, upload) by assignee; maintenance-specific activity type | `maintenance_views.xml` (`maintenance_request_view_activity`); `data/mail_activity_type_data.xml`; `views/mail_activity_views.xml` |

### ERPNext — Assets workspace with number cards; maintenance is a sidebar section

There is no separate maintenance app: equipment maintenance lives inside the **Assets**
module. The workspace is an accounting-flavored landing page (value cards and charts);
maintenance queues are the **Asset Maintenance Log** list and calendar.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Assets sidebar | Home · Dashboard · Asset · Depreciation Schedule · Asset Movement · Fixed Asset Register · **Reports** (Asset Depreciation Ledger, Asset Depreciations and Balances, Asset Activity) · **Value Changes** (Asset Capitalization, Asset Value Adjustment) · **Maintenance** (Asset Maintenance, Asset Maintenance Log, Asset Repair, Asset Maintenance Team) · **Setup** (Asset Category, Location, Accounts Settings) | `erpnext/assets/sidebar/assets/assets.json` |
| Assets workspace | Number cards **Total Assets**, **Asset Value**, **New Assets (This Year)**; chart **Asset Value Analytics**; report links incl. **Asset Maintenance Report**; setup links Item, Asset Shift Factor, Asset Shift Allocation | `erpnext/assets/workspace/assets/assets.json`; `assets/number_card/{total_assets,asset_value,new_assets_(this_year)}/`; `assets/dashboard_chart/asset_value_analytics/` |
| Asset dashboard | Charts Asset Value Analytics, **Category-wise Asset Value**, **Location-wise Asset Value** plus the three cards | `erpnext/assets/assets_dashboard/asset/asset.json`; `assets/dashboard_chart/{category_wise_asset_value,location_wise_asset_value}/` |
| Maintenance work queue | Asset Maintenance Log list (status Planned/Completed/Cancelled/Overdue, due date, assignee) and a **calendar** on `due_date` filterable by Asset Maintenance | `erpnext/assets/doctype/asset_maintenance_log/asset_maintenance_log_list.js`, `asset_maintenance_log_calendar.js` |

### AureusERP — Filament clone of Odoo maintenance; calendar page is the landing

Two clusters: **Maintenance** (Calendar page sort 1, Requests resource) and
**Configurations** (Teams, Equipment Categories, Stages), plus a top-level **Equipment**
resource. No team dashboard and no KPI widgets beyond the calendar.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Maintenance calendar page | Full-calendar widget of requests on `scheduled_at`; event popover shows name, stage, technician, priority, type; create/edit actions from the calendar | `plugins/webkul/maintenance/src/Filament/Clusters/Maintenance/Pages/Calendar.php`, `plugins/webkul/maintenance/src/Filament/Widgets/MaintenanceCalendarWidget.php` |
| Requests list | Columns name, created by, technician, category, stage, company; group by Stage, Assigned to, Category, Created by | `plugins/webkul/maintenance/src/Filament/Clusters/Maintenance/Resources/MaintenanceRequestResource/Tables/MaintenanceRequestsTable.php`, `.../Pages/ListMaintenanceRequests.php` |

### Carbon — Resources home with maintenance KPIs; dispatch list is the queue

Maintenance lives in the **Resources** module next to work centers, processes and
training. Its landing page is a maintenance dashboard; the dispatch table is the queue.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Resources sidebar | **Maintenance** (Dispatches, Schedules, Failure Modes) · **Infrastructure** (Locations, Processes, Work Centers) · **People** (Abilities, Training, Assignments, Suggestions) | `apps/erp/app/modules/resources/ui/useResourcesSubmodules.tsx` |
| Resources dashboard | Count tiles **Open Dispatches**, **Open Scheduled**, **Open Reactive** (each with a View link); KPI card with selectable metric (**Mean Time To Repair**, **Mean Time Between Failures**, **Spare Part Cost**, **Worst Performing Machines**, **Spare Part Consumption**), work-center filter, bar chart, **Export CSV**; lists **Recently Created** and **Assigned to Me** | `apps/erp/app/routes/x+/resources+/_index.tsx`; `MaintenanceKPIs` in `apps/erp/app/modules/resources/resources.models.ts` |
| Dispatches table | Columns dispatch ID, status, priority, severity, source, OEE impact, work center, suspected/actual failure mode, planned/actual start-end, assignee, location, created/updated; filters by status and priority | `apps/erp/app/modules/resources/ui/Maintenance/MaintenanceDispatchesTable.tsx`; route `apps/erp/app/routes/x+/resources+/maintenance.tsx` |

---

## 2. Facilities & locations

### Odoo — no facility registry; equipment points at a stock location

Core maintenance has no site/building/room concept. `stock_maintenance` adds a
"Used in location" field (internal `stock.location`) and an equipment-count smart button
on the location form, so the warehouse location tree doubles as the facility tree.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Equipment location field | `location_id` (domain `usage = internal`) on the equipment form; serial-number smart button linking to the matching lot | `odoo/addons/stock_maintenance/views/maintenance_views.xml` (`maintenance_stock_equipment_view_form`); `stock_maintenance/models/maintenance.py` |
| Location → equipment | Smart button **Equipment** on the stock location form (`action_view_equipments_records`) | `odoo/addons/stock_maintenance/views/stock_location.xml` (`stock_location_form_maintenance_equipments`); `models/stock_location.py` (`equipment_count`) |
| Vehicle location | Free-text `location` (garage) on vehicles | `odoo/addons/fleet/models/fleet_vehicle.py` |

### ERPNext — `Location` tree for assets (geo + area)

`Location` is a nested-set tree used only by assets (warehouses are separate). It is the
closest reference for a facility/site/building/room hierarchy owned by Maintenance.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Location tree | Tree view with **Parent Location**, **Is Group**, **Is Container**; details: Latitude, Longitude, Area + Area UOM, and a geolocation map field | `erpnext/assets/doctype/location/location.json`, `location_tree.js`, `location.js` |
| Location on asset | Asset has required **Location**; also Custodian (Employee), Department, Cost Center | `erpnext/assets/doctype/asset/asset.json` |
| Location-wise value | Dashboard chart of asset value per location | `erpnext/assets/dashboard_chart/location_wise_asset_value/` |

### Carbon — company Locations (sites) with address, timezone and geo

`Location` is a site (plant/office) used by work centers, inventory and dispatches;
there is no building/room hierarchy below it.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Locations list/form | Location Name, Code, Address lines, City, State/Province, Country, **Timezone**, Latitude/Longitude (both or neither) | `apps/erp/app/modules/resources/ui/Locations/{LocationsTable.tsx,LocationForm.tsx}`; routes `apps/erp/app/routes/x+/resources+/locations*.tsx`; `locationValidator` in `resources.models.ts` |
| Work centers per location | Work Centers sit under Infrastructure, each with a location and an optional link to its fixed asset | `apps/erp/app/modules/resources/ui/WorkCenters/WorkCenterForm.tsx`; `apps/erp/app/routes/x+/resources+/work-centers*.tsx` |

### Nextcloud / Zimbra — room metadata, not a facility tree

Both describe a bookable room by flat attributes rather than a hierarchy: Zimbra
**Site / Building / Floor / Room / Capacity** on a resource account; Nextcloud building
name/address/story, room number, room type, seating capacity and features. Useful as the
attribute set for a Room-type facility (details in section 7).

---

## 3. Equipment & asset register

### Odoo — `maintenance.equipment`: light registry focused on who has it and how it fails

Equipment is not a product or a fixed asset; it is its own model with owner, technician
and failure statistics. Assignment target is pluggable (`equipment_assign_to`): employee,
department (hr_maintenance), vehicle (fleet_maintenance) or other.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Equipment list/kanban | Kanban (default) and list: name, owner, serial, technician, category, vendor (hidden), company, activity; search **My Equipment**, Assigned / Unassigned, **Under Maintenance** (open request count), Archived; group by Technician, Category, Owner, Vendor, Properties | `odoo/addons/maintenance/views/maintenance_views.xml` (`hr_equipment_view_kanban`, `hr_equipment_view_tree`, `hr_equipment_view_search`, action `hr_equipment_action` path `/equipments`) |
| Equipment form | Smart button **Maintenance** (request count, opens requests filtered to the equipment); archived ribbon; header: Category, Company, Used By (`equipment_assign_to`), Owner, Maintenance Team, Technician, Assigned Date, Scrap Date; custom **properties** per category; tabs **Description**, **Product Information** (Vendor, Vendor Reference, Model, Serial Number, Effective Date, Cost, Warranty Expiration Date), **Maintenance** (Expected MTBF, MTBF, Estimated Next Failure, Latest Failure, MTTR); chatter | `maintenance_views.xml` (`hr_equipment_view_form`); `models/maintenance.py` (`maintenance.equipment`, `maintenance.mixin` with `expected_mtbf`, `mtbf`, `mttr`, `estimated_next_failure`, `latest_failure_date`, `effective_date`) |
| Employee / department assignment | Adds **Assigned Employee** / **Assigned Department**; employee form smart button **Equipment** (count); public employee form too; request "Created By" becomes employee and the equipment dropdown filters to that employee's equipment; departure wizard unassigns all equipment and posts chatter | `odoo/addons/hr_maintenance/models/equipment.py`, `hr_maintenance/views/hr_views.xml` (`hr_employee_view_form`, `hr_employee_public_view_form`), `hr_maintenance/views/maintenance_views.xml`, `hr_maintenance/models/hr_employee_departure.py` |
| Vehicle assignment | **Used By = Vehicle** with `vehicle_id`; vehicle form smart button **Equipment Assigned**; equipment search group by Vehicle | `odoo/addons/fleet_maintenance/views/{maintenance_equipment_views.xml,fleet_vehicle_views.xml}`, `fleet_maintenance/models/maintenance_equipment.py` |
| Equipment categories | Category form with smart buttons **Equipment** and **Maintenance**, Responsible (technician), note; list and kanban | `maintenance_views.xml` (`hr_equipment_category_view_form`, `hr_equipment_category_view_tree`, `view_maintenance_equipment_category_kanban`, action `hr_equipment_category_action`) |

### ERPNext — `Asset` is the financial fixed asset; maintenance attaches to it

Every maintainable thing is an `Asset` tied to an Item and an Asset Category; the form is
dominated by purchase and depreciation. `Maintenance Required` toggles maintenance.
Customer-owned serialized goods are a separate track (Serial No + Warranty Claim).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Asset list | Status indicators Draft, Submitted, Partially/Fully Depreciated, Sold, Scrapped, Capitalized, Work In Progress, **In Maintenance**, **Out of Order**, Issue, Receipt | `erpnext/assets/doctype/asset/asset_list.js` |
| Asset form | Asset Name, Item Code, Asset Category, Asset Type (Existing/Composite Asset/Composite Component), Asset Owner (Company/Supplier/Customer), Location, Custodian (Employee), Department, Cost Center, Purchase Date, Available for Use Date, Asset Quantity, Split From; **Insurance** section (policy, insurer, insured value, start/end, comprehensive); **Maintenance Required**; tabs Depreciation, More Info, Connections (Asset Movement); buttons **Transfer Asset**, **Maintain Asset**, **Asset Repair**, **Asset Value Adjustment**, **Capitalize Asset**, **Split Asset**, **Sell Asset**, **Scrap Asset** / **Restore Asset**, Accounting Ledger | `erpnext/assets/doctype/asset/asset.json`, `asset.js`, `asset_dashboard.py` |
| Asset Category | Name, Finance Books, Accounts per company, Enable CWIP Accounting, Non Depreciable Category | `erpnext/assets/doctype/asset_category/asset_category.json` |
| Asset Activity | Append-only activity log (asset, subject, date, user) and a Report Builder report | `erpnext/assets/doctype/asset_activity/asset_activity.json`, `assets/report/asset_activity/asset_activity.json` |
| Serial No / Warranty Claim | Customer-side serial with warranty/AMC expiry; claim with Status Open/Work In Progress/Closed/Cancelled, Warranty / AMC Status, resolution | `erpnext/stock/doctype/serial_no/`, `erpnext/support/doctype/warranty_claim/warranty_claim.json` |

### AureusERP — Odoo-shaped equipment record

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Equipment list/form/view | Name, category, company, owner, maintenance team, technician, vendor + vendor ref, model, serial no, **location** (free text), effective date, cost, warranty date, expected MTBF, note; stored counters `maintenance_count`, `maintenance_open_count`; view page with Edit | `plugins/webkul/maintenance/src/Filament/Resources/EquipmentResource/{Schemas/EquipmentForm.php,Schemas/EquipmentInfolist.php,Tables/EquipmentTable.php,Pages/}`; `plugins/webkul/maintenance/database/migrations/2026_05_18_000004_create_maintenance_equipments_table.php` |
| Equipment categories | Name, note, technician, company; list/create/edit/view pages | `plugins/webkul/maintenance/src/Filament/Clusters/Configurations/Resources/EquipmentCategoryResource/` |

### metasfresh — legacy ADempiere `A_Asset` with maintenance dates

No dedicated equipment screens; the inherited `A_Asset` table (generic window) has
parent asset, product, serial/lot, locator, business partner/location, owned / in
possession, lease partner and termination, guarantee date, use life months/years/units,
and **LastMaintenanceDate / NextMaintenenceDate / LastMaintenanceUnit /
NextMaintenenceUnit / LastMaintenanceNote** — a meter-or-date PM hint without a plan.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Asset (generic window) | Columns as above | `backend/de.metas.adempiere.adempiere/base/src/main/java-gen/org/compiere/model/I_A_Asset.java` |
| Resource unavailability | Resource with DateFrom / DateTo unavailable windows (production resources) | `backend/de.metas.adempiere.adempiere/base/src/main/java-gen/org/compiere/model/I_S_ResourceUnAvailable.java` |

### Carbon — no equipment register; the work center is the machine

Maintenance targets **work centers**; the work-center form lists linked **fixed assets**
(hyperlinked to the asset) so the physical machine record lives in Accounting
(section 8). There is no separate equipment list with technician, warranty or meters.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Work center ↔ fixed asset | Work-center form shows its fixed assets; fixed-asset form has a Work Center field | `apps/erp/app/modules/resources/ui/WorkCenters/WorkCenterForm.tsx`; `apps/erp/app/modules/accounting/ui/FixedAssets/FixedAssetForm.tsx` |

### Ever Gauzy — equipment registry built for sharing

Equipment list with type, serial, manufactured year, initial cost, max share period and
auto-approve; no maintenance fields (section 7).

---

## 4. Maintenance requests / work orders

### Odoo — `maintenance.request`: one record for corrective and preventive, stage-driven

A request is a lightweight ticket: subject, equipment, team, assignees, planned window
and a configurable stage pipeline. Parts, labor cost and invoicing are not on it; those
belong to the separate **Repairs** app (`repair.order`), which is product/customer-oriented.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Request form | Header: **Cancel**, **Reopen Request**, clickable stage statusbar; title (e.g. "Screen not working"), **priority** stars (Very Low/Low/Normal/High), `state` widget (In Progress, Changes Requested, Approved, Done, Cancelled — the kanban-state light); fields Requested By, **Equipment** (required), Category, Close Date (when done), **Maintenance Type** radio (Corrective / Preventive), request properties, **Team**, **Assignees** (many users), **Planned Date** range (`schedule_date`–`schedule_end`), duration (hours); recurrence block for preventive; tabs **Notes**, **Instructions** (HTML); chatter | `odoo/addons/maintenance/views/maintenance_views.xml` (`hr_equipment_request_view_form`); `models/maintenance.py` (`maintenance.request`: `stage_id`, `priority`, `state`, `maintenance_type`, `schedule_date`, `schedule_end`, `duration`, `instruction_text`, `close_date`); state widget `static/src/widgets/maintenance_request_state_selection.js` |
| Request from equipment / category | Same views scoped by `equipment_id` or category, defaulting team and company | `maintenance_views.xml` (`hr_equipment_request_action_from_equipment`, `hr_equipment_request_action_link`) |
| Email-in requests | Each team has a mail alias; inbound email creates a request | `maintenance_views.xml` (`maintenance_team_view_form` alias fields); `maintenance.team` inherits `mail.alias.mixin` |
| Repair order (Repairs app) | `repair.order` states New / Confirmed / Done / Cancelled (**Confirm Repair** then **End Repair**); fields product, lot/serial, customer, **Under Warranty**, schedule date, deadline, responsible, tags, priority, parts availability; tabs **Parts** (add/remove/recycle lines via `repair_line_type`, **Catalog** picker, Reserve/Unreserve), **Services**, **Repair Notes**; buttons **Confirm Repair**, **Quote** (create sale order), **Invoice**; kanban grouped by picking type; graph/pivot | `odoo/addons/repair/views/repair_views.xml` (`view_repair_order_form`, `view_repair_order_tree`, `view_repair_kanban`, `view_repair_order_form_filter`, `view_repair_graph`, `view_repair_pivot`, menus `menu_repair_order`, `repair_order_menu`, `repair_menu_reporting`, `repair_menu_config`, `repair_menu_tag`); `repair/models/repair.py`; consumption warning `repair/wizard/repair_consumption_warning_views.xml`; repair picking-type dashboard `repair/views/stock_picking_views.xml` (`stock_repair_type_kanban`) |
| Repair bridges | MO ↔ repair smart buttons (**Repairs** / **Manufacturing**), PO ↔ repair (**Repair Orders** / **Purchase Orders**); POS repair settles repair sale orders at the till | `odoo/addons/mrp_repair/views/{production_views.xml,repair_views.xml}`; `purchase_repair/views/{purchase_views.xml,repair_views.xml}`; `pos_repair/models/` |

### ERPNext — Asset Repair (corrective) is a submittable cost document

Corrective work is an **Asset Repair**: failure date, downtime, error description,
actions performed, consumed stock items and purchase invoices, with optional
capitalization of the repair cost. There is no request/triage step before it.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Asset Repair | Asset, Failure Date, Completion Date, **Repair Status** (Pending/Completed/Cancelled), Error Description, Actions Performed, **Downtime**, Repair Cost, **Stock Items** consumed (serial/batch picker), **Repair Purchase Invoices**, Total Repair Cost, **Capitalize Repair Cost** + Increase In Asset Life (Months), Cost Center, Project; Accounting Ledger view | `erpnext/assets/doctype/asset_repair/asset_repair.json`, `asset_repair.js`; child tables `asset_repair_consumed_item/`, `asset_repair_purchase_invoice/` |
| Maintenance Visit (customer) | After-sales visit to a customer: Maintenance Date/Time, **Maintenance Type** (Scheduled/Unscheduled/Breakdown), Completion Status (Partially/Fully Completed), Purposes table (item, serial, sales person, work done, against document), Customer Feedback; **Get Items From** Maintenance Schedule / Sales Order / **Warranty Claim** | `erpnext/maintenance/doctype/maintenance_visit/maintenance_visit.json`, `maintenance_visit.js`; `maintenance_visit_purpose/` |
| Warranty Claim | Customer issue against a serial no; Under Warranty/Out of Warranty/Under AMC/Out of AMC; resolution by user | `erpnext/support/doctype/warranty_claim/warranty_claim.json` |

### AureusERP — same request model as Odoo, with instruction attachments

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Request form | Stage selector, name, equipment, category, **requested at**, maintenance type (Corrective/Preventive), recurrence; team, technician (`user_id`, single), scheduled at, duration, priority, company; tabs description and **instructions** with `instruction_type` text / PDF / Google Slide and a preview; chatter action | `plugins/webkul/maintenance/src/Filament/Clusters/Maintenance/Resources/MaintenanceRequestResource/Schemas/MaintenanceRequestForm.php`, `.../Pages/{EditMaintenanceRequest,ViewMaintenanceRequest}.php`; `plugins/webkul/maintenance/resources/views/filament/clusters/maintenance/resources/maintenance-request/instruction-preview.blade.php`; `plugins/webkul/maintenance/src/Enums/MaintenanceRequestType.php` |

### Carbon — Maintenance Dispatch: work-center-centric work order with OEE impact

A dispatch is a maintenance work order against a **work center** (the machine), not a
separate equipment record. It carries production-impact fields that feed scheduling.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| New/Edit dispatch | **Status** (Open / Assigned / In Progress / Completed / Cancelled; Completed and Cancelled lock the record), **Priority** (Low/Medium/High/Critical), **Severity** (Preventive / Operator Performed / Support Required / OEM Required), **Source** (Scheduled / Reactive / Non-Conformance), **OEE Impact** (Down / Planned / Impact / No Impact), work center, **Suspected Failure Mode**, planned start/end, **Takes work center offline** ("the work center is unavailable to the schedule until the planned end time, or until the dispatch is completed"), assignee, description | `apps/erp/app/modules/resources/ui/Maintenance/{MaintenanceDispatchForm,MaintenanceStatus,MaintenancePriority,MaintenanceSeverity,MaintenanceSource,MaintenanceOeeImpact}.tsx`; `maintenanceDispatchValidator` in `apps/erp/app/modules/resources/resources.models.ts`; routes `apps/erp/app/routes/x+/maintenance+/{new,update}.tsx` |
| Dispatch detail | Header (ID copy, status menu, delete) + explorer; properties panel (status, priority, severity, source, OEE impact, work center, suspected and **Actual Failure Mode**, actual start/end, procedure, location); tabs **Events** (time entries: employee, start/end, notes, start/stop), **Items** (spare parts: item, qty, UoM, unit cost; **Add and issue** with tracked-entity/serial picks), **Comments** | `apps/erp/app/modules/resources/ui/Maintenance/{MaintenanceDispatchHeader,MaintenanceDispatchExplorer,MaintenanceDispatchProperties,MaintenanceDispatchNotes,MaintenanceAddPartModal}.tsx`; routes `apps/erp/app/routes/x+/maintenance+/$dispatchId.{tsx,events.tsx,event.new.tsx,items.tsx,item.new.tsx,add-and-issue.tsx,comments.tsx,status.tsx}` |

### metasfresh — service/repair project for customer-returned goods

Customer repair is a **project** (`C_Project` of service/repair type) started from a
request. Tasks are spare-parts or repair-order lines; the actual repair runs as a
manufacturing order; cost collectors decide what is invoiced. No in-house equipment
maintenance module exists (generic WebUI windows only).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Request → project | Action **Start Project** on a request (`R_Request`) | `backend/de.metas.servicerepair.webui/src/main/java/de/metas/servicerepair/request/process/R_Request_StartProject.java` |
| Project tasks | Task **Type** Spare Parts / Service Repair Order; **Status** Not Started / In Progress / Completed; part ownership Owned by company / Owned by customer | `backend/de.metas.servicerepair.base/src/main/java/de/metas/servicerepair/project/model/{ServiceRepairProjectTask,ServiceRepairProjectTaskType,ServiceRepairProjectTaskStatus,PartOwnership}.java`; `backend/de.metas.servicerepair.base/src/main/java-gen/de/metas/servicerepair/repository/model/I_C_Project_Repair_Task.java` |
| Project actions | **Start Repair Order** (creates PP_Order), **Create Quotation**, **Open HUs to issue** → issue HUs view, **Release reserved HUs**, **Recalculate summary** (consumption summary) | `backend/de.metas.servicerepair.webui/src/main/java/de/metas/servicerepair/project/process/{C_Project_StartRepairOrder,C_Project_CreateQuotation,C_Project_OpenHUsToIssue,HUsToIssueView_IssueHUs,C_Project_ReleaseReservedHUs,C_Project_RecalculateSummary}.java`; `backend/de.metas.servicerepair.webui/src/main/java/de/metas/servicerepair/project/hu_to_issue/` |
| Cost collectors | Spare Parts To Be Invoiced, Spare Parts Owned By Customer, Repaired Product To Return, Repairing Consumption | `backend/de.metas.servicerepair.base/src/main/java/de/metas/servicerepair/project/model/ServiceRepairProjectCostCollectorType.java` |
| Customer returns / warranty | Add spare parts to a customer return, select/return HUs, warranty case | `backend/de.metas.servicerepair.webui/src/main/java/de/metas/servicerepair/customerreturns/process/`; `backend/de.metas.servicerepair.base/src/main/java/de/metas/servicerepair/customerreturns/{RepairCustomerReturnsService,WarrantyCase}.java` |

---

## 5. Preventive maintenance & schedules

### Odoo — recurrence on the preventive request; calendar with recurrence

Preventive maintenance is a request with `maintenance_type = preventive` and a
recurrence rule. Closing one spawns the next. No meter/usage triggers in core; the
`usage_based_maintenance` industry package adds run-time meters via Studio models.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Recurrence block | On preventive requests: **Recurrent**, Repeat Every (`repeat_interval`) + unit (Days/Weeks/Months/Years) + Until (Forever / Until date) | `maintenance_views.xml` (`hr_equipment_request_view_form`); `models/maintenance.py` (`recurring_maintenance`, `repeat_interval`, `repeat_unit`, `repeat_type`, `repeat_until`) |
| Maintenance calendar | Calendar on `schedule_date`–`schedule_end` colored by assignee, default To Do filter; custom `calendar_with_recurrence` view shows future occurrences (incl. year view popover) | `maintenance_views.xml` (`hr_equipment_view_calendar`, action `hr_equipment_request_action_cal`); `static/src/views/calendar_with_recurrence/` (`calendar_with_recurrence_view.js`, `..._model.js`, `..._year_renderer.js`, `..._year_popover.js`); tour `static/tests/tours/tour_calendar_with_recurrence.js` |
| Usage-based maintenance (industry) | Studio models `x_run_time_meter` (date, run-time h, serial) and `x_recurring_maintenance_rules` (product, run-time increment h, run-time meter when done); automation creates field-service tasks when a serial's run-time passes the threshold; used by `machine_tool_rental` | `odoo/industry/usage_based_maintenance/data/{ir_model.xml,ir_model_fields.xml,base_automation.xml,ir_ui_menu.xml,ir_ui_view.xml}`; `industry/machine_tool_rental/data/x_recurring_maintenance_rules.xml` |

### ERPNext — Asset Maintenance plan with periodic tasks, logs generated per due date

**Asset Maintenance** (one per asset) holds a team and a task table; each task has a
type, periodicity and assignee. The system creates **Asset Maintenance Log** entries for
each due date; completing a log advances Next Due Date.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Asset Maintenance | Asset, Asset Category, Item, Company, **Maintenance Team**, Maintenance Manager; **Maintenance Tasks** table; dashboard section **Maintenance Log** with counts per status | `erpnext/assets/doctype/asset_maintenance/asset_maintenance.json`, `asset_maintenance.js` |
| Maintenance task row | Maintenance Task, **Maintenance Type** (Preventive Maintenance / Calibration), Maintenance Status (Planned/Overdue/Cancelled), Start Date, **Periodicity** (Daily … 3 Yearly), End Date, **Certificate Required**, Assign To, Next Due Date, Last Completion Date, Description | `erpnext/assets/doctype/asset_maintenance_task/asset_maintenance_task.json` |
| Asset Maintenance Log | Submittable: task, type, periodicity, assignee, Due Date, Completion Date, **Maintenance Status** (Planned/Completed/Cancelled/Overdue), Has Certificate + Certificate attachment, Actions Performed; calendar view | `erpnext/assets/doctype/asset_maintenance_log/asset_maintenance_log.json`, `asset_maintenance_log_calendar.js` |
| Maintenance Schedule (customer) | After-sales schedule per customer: Items table (item, start/end, **Periodicity** Weekly…Yearly/Random, No of Visits, sales person, serial no, sales order) → **Generate Schedule** fills Schedules (scheduled date, actual date, completion status); **Create → Maintenance Visit** | `erpnext/maintenance/doctype/maintenance_schedule/maintenance_schedule.json`, `maintenance_schedule.js`; `maintenance_schedule_item/`, `maintenance_schedule_detail/`; query report `maintenance/report/maintenance_schedules/` |

### AureusERP — recurrence fields on the request

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Recurrence | `recurring_maintenance`, `repeat_interval`, `repeat_unit` (day/week/month/year), `repeat_type` (forever/until), `repeat_until` | `plugins/webkul/maintenance/src/Enums/{MaintenanceRepeatUnit,MaintenanceRepeatType}.php`; `plugins/webkul/maintenance/database/migrations/2026_05_18_000005_create_maintenance_requests_table.php` |

### Carbon — Scheduled Maintenance per work center, capacity-aware

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Scheduled maintenances | List and form: Schedule Name, work center, **Frequency** (Daily/Weekly/Monthly/Quarterly/Annual), day-of-week checkboxes for daily, **Skip Holidays**, priority, **Estimated Duration (minutes)**, **Takes Work Center Offline** (reserves capacity; requires duration), **Next Due Date**, active, **Procedure**, planned spare-part items | `apps/erp/app/modules/resources/ui/MaintenanceSchedule/{MaintenanceSchedulesTable,MaintenanceScheduleForm}.tsx`; `maintenanceScheduleValidator`, `maintenanceFrequency` in `resources.models.ts`; routes `apps/erp/app/routes/x+/resources+/scheduled-maintenance*.tsx` |
| Capacity reservation | Offline PMs subtract their window from work-center capacity in the scheduler | `packages/database/supabase/migrations/20260817041453_scheduled-maintenance-offline.sql`, `20260720121629_capacity-planning.sql` |



---

## 6. Technician / mobile / field execution

### Carbon MES — technician maintenance board, dispatch execution, work-center display

The MES (shop-floor app) gives technicians and operators their own maintenance screens.
This is the strongest reference for a technician-facing execution flow.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Maintenance board | Tabs **Assigned to Me** / **Active** / **All** / **Today** (scheduled today) / **Blocking** (work centers currently down, "No work centers are blocked"); search, status filter; cards with priority, OEE impact, work center | `apps/mes/app/routes/x+/maintenance.tsx` |
| Dispatch execution | Description, **Procedure**, **Time Entries** (start/stop events, "Time Worked"), **Spare Parts** (add; **Add and issue** from inventory with serial/batch), **Complete** confirmation ("This marks the dispatch as completed") | `apps/mes/app/routes/x+/dispatch.$dispatchId.tsx`, `dispatch.$dispatchId.item.tsx`, `dispatch.$dispatchId.add-and-issue.tsx`, `maintenance-event.tsx` |
| Operator-raised dispatch | New dispatch from the floor (work center, priority, OEE impact, description) | `apps/mes/app/routes/x+/dispatch.new.tsx` |
| Work-center display tile | Andon-style panel per work center: **Machine down for maintenance now?** (Down for planned maintenance / Unplanned downtime), **Overdue PMs?** (PM schedule lapsed), **Due today?**, **Due in the next N days?**, **Last completed** by whom; "All clear" state | `apps/mes/app/routes/display+/$workCenterId.maintenance.tsx` |

### Odoo — no technician app in community; worksheets are an upsell

Technicians use the same request kanban (**My Maintenances** filter) on mobile web.
Settings offer **Custom Maintenance Worksheets** (`module_maintenance_worksheet`,
enterprise). Field-service style execution comes from the enterprise `planning` /
`industry_fsm` worksheet stack used by industry packages (`hvac_services`,
`usage_based_maintenance`).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Worksheet setting | Upgrade toggle "Create custom worksheet templates" | `odoo/addons/maintenance/views/res_config_settings_views.xml` |
| Field-service industry packs | HVAC services: worksheet templates, projects, planning; usage-based maintenance creates FSM tasks | `odoo/industry/hvac_services/data/worksheet_template.xml`, `odoo/industry/usage_based_maintenance/data/base_automation.xml` |

### ERPNext — Maintenance Visit is the field record (customer site)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Maintenance Visit | Technician (Sales Person) logs work done per serial at a customer, with completion status and customer feedback; created from a schedule, sales order or warranty claim | `erpnext/maintenance/doctype/maintenance_visit/` |

### Dolibarr — Interventions (`fichinter`): billable field-service report

An intervention is a signed, billable work report for a third party: header plus timed
lines. It is the reference for a printable/signable technician report and for recurring
service visits, not for in-house equipment.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Intervention card | Third party, project, **contract**, customer ref, description; lines with date, **duration**, description (plus title/subtotal/text lines); **Total Duration**; actions Validate, **Sign** / Unsign (signed status), **Classify Done**, **Classify Billed** / Unbilled, Create invoice, Reopen, Clone, Send email, PDF; **Change into repeatable intervention**; status Draft / Validated / Billed / Closed / Canceled | `htdocs/fichinter/card.php`; `htdocs/fichinter/class/{fichinter.class.php,fichinterligne.class.php}` (`STATUS_DRAFT`…`STATUS_CANCELED`) |
| Recurring interventions | Template interventions generating new ones on a frequency | `htdocs/fichinter/card-rec.php`, `htdocs/fichinter/class/fichinterrec.class.php` |
| List, index, stats, tabs | List with filters; module index with latest/drafts; statistics; contacts, documents, notes, agenda tabs | `htdocs/fichinter/{list.php,index.php,contact.php,document.php,note.php,agenda.php}`, `htdocs/fichinter/stats/` |

---

## 7. Facility & equipment booking / scheduling admin

### Odoo — resources and working calendars; bookable rooms only via enterprise appointments

Core `resource` defines **Material** resources (equipment/rooms) alongside people, each
with a working calendar and time off ("leaves"). Booking rooms/desks is the enterprise
**Appointments** app; the `coworking` industry pack seeds resources like Meeting Room 1
(capacity 6), Meeting Room 2 (capacity 10), Seat 1–4.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Resources | List/form with **Type** Human / Material, working time, timezone, efficiency; filters Human/Material | `odoo/addons/resource/views/resource_resource_views.xml` (`view_resource_resource_search`, `resource_resource_form`, `resource_resource_tree`); `resource/models/resource_resource.py` (`resource_type`) |
| Working schedules | Calendar form with attendance lines, multi-create; time off / closing days per resource (calendar + list) | `odoo/addons/resource/views/{resource_calendar_views.xml,resource_calendar_attendance_views.xml,resource_calendar_leaves_views.xml}` (`resource_calendar_form`, `view_resource_calendar_attendance_calendar`, `resource_calendar_closing_days`, `resource_calendar_resources_leaves`); menus `views/menuitems.xml` |
| Room/seat resources (industry) | Appointment resources with capacity | `odoo/industry/coworking/data/appointment_resource.xml` |
| Vehicle availability | **Future Driver**, **Available From**, **Apply New Driver** on the vehicle | `odoo/addons/fleet/views/fleet_vehicle_views.xml` (`fleet_vehicle_view_form`) |

### Carbon — work-center offline windows are the equipment schedule

No booking UI; equipment availability is the work-center capacity calendar, reduced by
dispatches and scheduled maintenances flagged **Takes Work Center Offline**. Rental
fleet units have Reserved / On Rent statuses (section 9).

### ERPNext — none

No room/equipment booking. `Asset Shift Allocation` is about depreciation shifts, not
booking.

### Dolibarr — Resources linked to agenda events, with conflict check; BookCal for public booking

**Resources** are typed things (room, vehicle, projector — the type is a dictionary) with
location, max users, contact details. They are attached to agenda events or other
elements; attaching a busy resource raises "resources already in use". **BookCal**
publishes availability ranges for online appointment booking.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Resource card/list | Ref, **Resource Type** (dictionary), description, location/address, country, phone, email, **Max Users**; tabs contacts, documents, notes, agenda | `htdocs/resource/{card.php,list.php,contact.php,document.php,note.php,agenda.php}`; `htdocs/resource/class/dolresource.class.php` (`fk_code_type_resource`, `max_users`) |
| Resources linked to element | Box on events/interventions to attach resources, with **Busy** / **Available** state; double-booking error `ErrorResourcesAlreadyInUse` | `htdocs/resource/element_resource.php`; `htdocs/resource/class/html.formresource.class.php` |
| Agenda per resource | Calendar views (day/week/per user) filterable by resource | `htdocs/resource/agenda.php` |
| BookCal calendars & availabilities | Calendar (label, owner, type, third party, project) and availability ranges (calendar, start/end date, **duration of range**, status); booking list | `htdocs/bookcal/{calendar_card.php,calendar_list.php,availabilities_card.php,availabilities_list.php,booking_list.php}`; `htdocs/bookcal/class/{calendar.class.php,availabilities.class.php}`; `htdocs/bookcal/README.md` |

### Ever Gauzy — equipment registry with share requests, approval and policies

The cleanest reference for **employee-facing equipment booking with admin approval**.
Equipment carries a max share period and an auto-approve flag; a share request names the
equipment, the requesting employees or teams, a policy and a date window.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Equipment | Grid/table: name, type, serial number, manufactured year, initial cost + currency, **max share period**, **auto approve** (badge component), tags, image; add/edit dialog | `apps/gauzy/src/app/pages/equipment/{equipment.component.ts,equipment.component.html,equipment-record-view.ts,auto-approve/}`; dialog `packages/ui-core/shared/src/lib/equipment/equipment-mutation.component.html`; model `packages/contracts/src/lib/equipment.model.ts` |
| Equipment sharing (requests) | Table: equipment name, share request date, share start/end date, created by, status, policy; row actions **Approve** / **Refuse**; dialog: request name, equipment, sharing policy, employees/teams, request day, start day, end day; status **REQUESTED / APPROVED / REFUSED** | `apps/gauzy/src/app/pages/equipment-sharing/{equipment-sharing.component.ts,equipment-sharing.component.html,table-components/equipment-sharing-action/,table-components/equipment-sharing-status/,table-components/equipment-sharing-policy-table/}`; dialog `packages/ui-core/shared/src/lib/equipment/equipment-sharing/equipment-sharing-mutation.component.html`; `EquipmentSharingStatusEnum`, `EquipmentSharingParticipantEnum` (EMPLOYEE/TEAM) in `packages/contracts/src/lib/equipment-sharing.model.ts` |
| Sharing policies | Name + description list; selected on each request | `apps/gauzy/src/app/pages/equipment-sharing-policy/`; `packages/ui-core/shared/src/lib/equipment/equipment-sharing-policy/equipment-sharing-policy-mutation.component.html` |

### Nextcloud — room/resource booking inside the event editor

Rooms and resources are CalDAV principals supplied by backends (admin-managed, often via
an external app or LDAP). The everyone-facing face is the event editor's **Resources**
section: search rooms, filter, check availability, add to the event.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Room selection | Search "Name, building or room number"; filters **Minimum seating capacity**, **Room type**, features **Projector**, **Whiteboard**, **Wheelchair accessible**; **Check availability** with available/unavailable state; room cards (building, floor, capacity); add/remove resource | `calendar/src/components/Editor/Resources/{RoomSelectionModal.vue,ResourceRoomCard.vue,ResourceRoomType.vue,ResourceSeatingCapacity.vue,ResourceList.vue,ResourceListItem.vue,ResourceListSearch.vue}` |
| Room / resource metadata | Room type, seating capacity, building name/address/story, room number, features | `server/lib/public/Calendar/Room/IRoomMetadata.php`, `server/lib/public/Calendar/Resource/IResourceMetadata.php` |
| Principal backends | Rooms and resources exposed as CalDAV principals (schedulable inbox) | `server/apps/dav/lib/CalDAV/ResourceBooking/{RoomPrincipalBackend,ResourcePrincipalBackend,AbstractPrincipalBackend}.php` |

### Zimbra admin console — calendar resource accounts (Location / Equipment)

A resource is a mail-enabled calendar account whose scheduling policy is set by an admin.
This is the clearest **scheduling-admin** reference: auto-accept/decline rules and
conflict tolerance per resource.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| New resource wizard / resource form | Name, display name, **Type** Location / Equipment, **schedule policy** (auto accept + auto decline on conflict combinations), **max conflicts allowed** (count and percent for recurring), auto-decline recurring, always free, forward invites to, **Site / Building / Floor / Room**, **Capacity**, contact name/email/phone, account status (active / maintenance / locked / closed), auto-reply signatures | `zm-admin-console/WebRoot/js/zimbraAdmin/resource/view/{ZaNewResourceXWizard.js,ZaResourceXFormView.js}`; model `resource/model/ZaResource.js` (`RESOURCE_TYPE_LOCATION`, `RESOURCE_TYPE_EQUIPMENT`, `SCHEDULE_POLICY_*`, `A_zimbraCalResMaxNumConflictsAllowed`, `A_zimbraCalResSite`, `A_zimbraCalResBuilding`, `A_zimbraCalResFloor`, `A_zimbraCalResRoom`, `A_zimbraCalResCapacity`); controller `resource/controller/ZaResourceController.js` |

---

## 8. Fixed assets lifecycle

### ERPNext — full lifecycle on the Asset form, each step a submittable document

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Asset Movement | **Purpose** Issue / Receipt / Transfer / Transfer and Issue; rows: asset, source/target **Location**, from/to **Employee**; reference document | `erpnext/assets/doctype/asset_movement/asset_movement.json`, `asset_movement_item/`; asset form **Transfer Asset** |
| Asset Value Adjustment | Asset, finance book, date, current vs new value, difference amount/account, journal entry | `erpnext/assets/doctype/asset_value_adjustment/asset_value_adjustment.json` |
| Asset Capitalization | Target item/asset from consumed **Stock Items**, consumed **Assets** and **Services**; totals; project/cost center | `erpnext/assets/doctype/asset_capitalization/asset_capitalization.json` + child tables |
| Depreciation Schedule | Per asset and finance book; **Asset Shift Allocation** re-plans by shift factor | `erpnext/assets/doctype/asset_depreciation_schedule/`, `asset_shift_allocation/`, `asset_shift_factor/` |
| Sell / Scrap / Restore / Split | Asset form actions (sell qty, scrap date, restore scrapped, split qty) | `erpnext/assets/doctype/asset/asset.js` |

### Carbon — fixed assets in Accounting, linked to work centers

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Fixed assets list / new | Asset ID, name, asset class, status (**Draft / Active / Fully Depreciated / Disposed**, Under Construction hidden), location, work center, serial number, net book value | `apps/erp/app/modules/accounting/ui/FixedAssets/{FixedAssetsTable,FixedAssetForm,FixedAssetStatus}.tsx`; `apps/erp/app/routes/x+/accounting+/fixed-assets*.tsx`; `fixedAssetStatuses` in `apps/erp/app/modules/accounting/accounting.models.ts` |
| Fixed asset detail | Header actions **Register**, **Purchase**, **Capitalize**, **Adjust Cost**, **Transfer**, **Take Out of Service** / **Return to Service** (reason), **Return to Inventory**, **Sell**, **Dispose** (method, proceeds, NBV, gain/loss), **Attach Job**; book and tax depreciation (method Straight Line / Declining Balance / **Units of Production**, useful life, residual %, MACRS class/convention, bonus %), lifetime usage units, depreciation journal table, transfers, documents, notes | `apps/erp/app/routes/x+/fixed-asset+/$fixedAssetId.{tsx,details.tsx,register.tsx,purchase.tsx,capitalize.tsx,adjust-cost.tsx,out-of-service.tsx,return-to-inventory.tsx,sell.tsx,dispose.tsx,attach-job.tsx}`; `apps/erp/app/modules/accounting/ui/FixedAssets/{FixedAssetHeader,FixedAssetOutOfServiceForm,FixedAssetDisposalForm,FixedAssetAdjustCostForm,FixedAssetDocuments,FixedAssetNotes}.tsx` |
| Asset classes, depreciation runs | Class defaults; periodic depreciation run with status and documents | `apps/erp/app/modules/accounting/ui/FixedAssets/{AssetClassForm,AssetClassesTable,DepreciationRunTable,DepreciationRunHeader,DepreciationRunStatus}.tsx`; `apps/erp/app/routes/x+/accounting+/asset-class*.tsx` |

### Odoo — not in community

Asset accounting (`account_asset`) is enterprise-only; the community equipment record has
only Cost, Effective Date and Scrap Date. `account_fleet` adds **Bills** on vehicles.

### Dolibarr — Asset module: accounting-first, with models as templates

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Asset card/list | Ref, label, **asset model**, qty, **acquisition type**, **asset type**, not depreciated flag, acquisition date, start date, acquisition value, recovered VAT, reversal date/amount; status Draft / Validated (in progress) / Disposed; Validate, Set to draft, Reopen, Clone | `htdocs/asset/{card.php,list.php}`; `htdocs/asset/class/asset.class.php` |
| Depreciation tab | Per-mode lines: begin date, duration, rate, base, depreciation, cumulative, residual; future lines; reversal; dispatched-in-bookkeeping flag | `htdocs/asset/depreciation.php`, `htdocs/asset/tpl/depreciation_view.tpl.php`; options `htdocs/asset/depreciation_options.php`, `tpl/depreciation_options_{edit,view}.tpl.php` |
| Disposal | Disposal date, amount, **disposal type** (dictionary), depreciated flag, subject to VAT, customer invoice | `htdocs/asset/disposal.php` |
| Accountancy codes | Per-asset and per-model account codes (economic and fiscal) | `htdocs/asset/accountancy_codes.php`, `tpl/accountancy_codes_{edit,view}.tpl.php`, `class/assetaccountancycodes*.class.php` |
| Asset models | Template card/list with depreciation options and accountancy codes | `htdocs/asset/model/{card.php,list.php,depreciation_options.php,accountancy_codes.php}`, `class/assetmodel.class.php` |
| Tabs | Documents, notes, agenda | `htdocs/asset/{document.php,note.php,agenda.php}` |

---

## 9. Fleet / vehicles

### Odoo — Fleet app: vehicles as a specialized equipment class

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Vehicles | Kanban/list/form/pivot/activity: model + brand, license plate, VIN (`vin_sn`), driver and **Future Driver** (**Apply New Driver**), **Drivers History**, state (`fleet.vehicle.state`), tags, location, odometer + unit, model year, fuel, transmission, power, CO2, catalog/purchase/residual value; smart buttons Contracts, Services, Odometer | `odoo/addons/fleet/views/fleet_vehicle_views.xml` (`fleet_vehicle_view_form`, `fleet_vehicle_view_kanban`, `fleet_vehicle_view_tree`, `fleet_vehicle_view_search`, `fleet_vehicle_view_pivot`, action `fleet_vehicle_action`); `fleet/models/fleet_vehicle.py` |
| Services log | Service entries with stage **New / Running / Done / Cancelled**, service type, vendor, cost; graph/pivot/activity | `odoo/addons/fleet/views/fleet_vehicle_cost_views.xml` (`fleet_vehicle_log_services_view_*`, action `fleet_vehicle_log_services_action`); `fleet/models/fleet_vehicle_log_services.py` |
| Contracts | Leasing/insurance contracts with expiry; graph/pivot/activity | `fleet_vehicle_cost_views.xml` (`fleet_vehicle_log_contract_view_*`, action `fleet_vehicle_log_contract_action`) |
| Odometer | Odometer readings list/form and **Odometers** report | `fleet_vehicle_views.xml` (`fleet_vehicle_odometer_view_form`, `fleet_vehicle_odometer_view_tree`, action `fleet_vehicle_odometer_action`); `fleet/views/fleet_vehicle_odometer_report.xml`, `fleet/report/odometer_report.py` |
| Costs report | Pivot/graph/list of contract + service costs per vehicle | `odoo/addons/fleet/views/fleet_board_view.xml` (`fleet_costs_report_view_pivot`, `fleet_costs_report_view_graph`, action `fleet_costs_reporting_action`); `fleet/report/fleet_report.py` |
| Configuration | Models, Brands, Categories, Contract Types, Service Types, Vehicle Status, Tags, Settings | `fleet_vehicle_model_views.xml`, `fleet_vehicle_views.xml` (`fleet_vehicle_service_types_view_search`, `fleet_vehicle_tag_action`, `fleet_vehicle_state_action`) |
| Bridges | Employee **Cars History** (`hr_fleet`); vendor **Bills** on vehicles and service lines (`account_fleet`); equipment assigned to a vehicle (`fleet_maintenance`) | `odoo/addons/hr_fleet/views/hr_employee_views.xml`; `odoo/addons/account_fleet/views/{fleet_vehicle_views.xml,fleet_vehicle_log_services_views.xml}` |

### Carbon — rental fleet view over fixed assets

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Fleet | Fixed assets used as rental units with fleet status **Available / Reserved / On Rent / In Maintenance / Sold / Returned to Stock** | `apps/erp/app/routes/x+/accounting+/fleet.tsx`; `apps/erp/app/modules/accounting/ui/FixedAssets/{FleetAssetsTable,FleetStatus}.tsx`; `fleetStatuses` in `accounting.models.ts` |

---

## 10. Failure modes, downtime & reliability

### Carbon — failure-mode catalog and OEE impact on every dispatch

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Failure modes | Name and **Type** (Maintenance / Quality / Operations / Other); used as suspected and actual failure mode on dispatches | `apps/erp/app/modules/resources/ui/FailureModes/{FailureModesTable,FailureModeForm}.tsx`; routes `apps/erp/app/routes/x+/resources+/failure-modes*.tsx`; `maintenanceFailureModeType` in `resources.models.ts` |
| Reliability KPIs | MTTR, MTBF, worst performing machines, spare part cost/consumption on the Resources dashboard | `apps/erp/app/routes/x+/resources+/_index.tsx` |

### Odoo — MTBF/MTTR computed on equipment from corrective requests

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Equipment Maintenance tab | Expected MTBF (input), MTBF, MTTR, Latest Failure, Estimated Next Failure (computed from done corrective requests since effective date) | `odoo/addons/maintenance/models/maintenance.py` (`maintenance.mixin`), `views/maintenance_views.xml` (`hr_equipment_view_form`) |
| OEE / Losses Analysis | Menu slots for work-center productivity reporting (filled by MRP-side modules) | `maintenance_views.xml` (`menu_m_reports_oee`, `menu_m_reports_losses`) |

### ERPNext — Downtime Entry against workstations

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Downtime Entry | Workstation / Machine, From/To Time, Operator, computed Downtime, **Stop Reason** (e.g. Excessive machine set up time, Unplanned machine maintenance, …), Remarks | `erpnext/manufacturing/doctype/downtime_entry/downtime_entry.json` |
| Downtime Analysis | Script report filtered by date range and machine; columns machine, from/to time, downtime (hours), operator, stop reason, remarks | `erpnext/manufacturing/report/downtime_analysis/` |
| Repair downtime | `downtime` field on Asset Repair | `erpnext/assets/doctype/asset_repair/asset_repair.json` |

---

## 11. Reports & analytics

| App | Report | Key files |
| --- | --- | --- |
| Odoo | **Maintenance Requests Analysis** (graph/pivot default, To Do filter, by team/stage/category) | `odoo/addons/maintenance/views/maintenance_views.xml` (`maintenance_request_action_reports`, `hr_equipment_request_view_graph`, `hr_equipment_request_view_pivot`) |
| Odoo | Repairs graph/pivot | `odoo/addons/repair/views/repair_views.xml` (`action_repair_order_graph`, `view_repair_graph`, `view_repair_pivot`) |
| Odoo | Fleet Costs, Odometers | `odoo/addons/fleet/views/fleet_board_view.xml`, `fleet_vehicle_odometer_report.xml` |
| ERPNext | **Fixed Asset Register** (filters status, category, cost center, finance book, period/date based on, group by) | `erpnext/assets/report/fixed_asset_register/` |
| ERPNext | **Asset Maintenance** (Report Builder), **Asset Activity**, Maintenance Schedules (query report), Downtime Analysis | `erpnext/assets/report/{asset_maintenance,asset_activity}/`, `erpnext/maintenance/report/maintenance_schedules/`, `erpnext/manufacturing/report/downtime_analysis/` |
| ERPNext | Asset value charts and cards | `erpnext/assets/dashboard_chart/`, `erpnext/assets/number_card/` |
| Carbon | Maintenance KPI chart with CSV export | `apps/erp/app/routes/x+/resources+/_index.tsx` |

---

## 12. Configuration & settings

| App | Configuration screen | Key files |
| --- | --- | --- |
| Odoo | **Maintenance Teams** (name, members, email alias, company; list/kanban/form) | `odoo/addons/maintenance/views/maintenance_views.xml` (`maintenance_team_view_form`, `maintenance_team_view_tree`, `maintenance_team_view_kanban`, action `maintenance_team_action_settings`) |
| Odoo | **Maintenance Stages** (name, sequence, folded in pipe, restricted to teams); seeded New Request, In Progress, Repaired (folded), Scrap (folded) | `maintenance_views.xml` (`hr_equipment_stage_view_form`, `hr_equipment_stage_view_tree`, action `hr_equipment_stage_action`); `data/maintenance_data.xml` (`stage_0`…`stage_4`) |
| Odoo | **Equipment Categories** (responsible, note; custom properties defined per category) | `maintenance_views.xml` (`hr_equipment_category_action`) |
| Odoo | Repair tags; fleet models/brands/service and contract types/vehicle states | `repair/views/repair_views.xml` (`action_repair_order_tag`); `fleet/views/` |
| ERPNext | **Asset Maintenance Team** (name, manager, company, members with **Maintenance Role**) | `erpnext/assets/doctype/asset_maintenance_team/asset_maintenance_team.json`, `maintenance_team_member/` |
| ERPNext | Asset Category, Location, Accounts Settings (asset section), Asset Shift Factor | `erpnext/assets/doctype/{asset_category,location,asset_shift_factor}/` |
| AureusERP | Teams (name, users, company), Stages (name, sort, **done** flag), Equipment Categories | `plugins/webkul/maintenance/src/Filament/Clusters/Configurations/Resources/{TeamResource,StageResource,EquipmentCategoryResource}/` |
| Carbon | Failure Modes, Locations, Work Centers (in Resources); asset classes (in Accounting) | `apps/erp/app/modules/resources/ui/{FailureModes,Locations,WorkCenters}/`; `apps/erp/app/modules/accounting/ui/FixedAssets/AssetClassForm.tsx` |

---

## 13. Cross-app surfaces

| Surface | Maintenance face | Reference evidence |
| --- | --- | --- |
| **Manufacturing** | Work centers / production equipment taken offline by open or planned maintenance; operators raise dispatches from the floor; downtime and OEE feed both apps; repair orders can spawn production orders | Carbon `takesWorkCenterOffline` on dispatches and schedules, MES maintenance board and work-center display tile (`apps/mes/app/routes/`); ERPNext Downtime Entry and Downtime Analysis; Odoo OEE/Losses menu slots and `mrp_repair` smart buttons |
| **Warehouse / Inventory** | Spare parts issued to a work order (with serial/batch), equipment located at a stock location, location → equipment list | Carbon dispatch **Add and issue**; ERPNext Asset Repair consumed stock items; Odoo `stock_maintenance` location field and location smart button; Odoo repair Parts tab with reserve/unreserve |
| **Purchasing** | Buying parts or outside service for a repair; vendor and warranty on equipment | Odoo `purchase_repair` smart buttons; ERPNext Asset Repair purchase invoices; Odoo/Aureus equipment vendor + vendor ref + warranty date; mantle `AssetMaintenance.purchaseOrderId`, `AssetMaintenanceOrderItem` |
| **Accounting** | Fixed asset register, depreciation, capitalization of repair cost, disposal | ERPNext Asset + Value Adjustment + Capitalization + **Capitalize Repair Cost**; Carbon Fixed Assets in Accounting linked to work centers; Dolibarr asset module; mantle `calculate#FixedAssetDepreciation` |
| **People / HR** | Equipment assigned to employees/departments; return on departure; employee smart button | Odoo `hr_maintenance` (employee/department assignment, departure unassign, **Equipment** smart button); Odoo `hr_fleet` **Cars History**; ERPNext Asset Custodian + Asset Movement from/to employee; Frappe HRMS Full and Final Asset |
| **Commons (schedules)** | Everyone books rooms/equipment and sees availability; admins configure policies | Nextcloud room search/availability in the event editor; Gauzy equipment sharing requests; Dolibarr resources on agenda events with busy check; Zimbra resource scheduling policy; Moqui `FacilityCalendar` / `AssetCalendar` |
| **Customer Service** | Repairs and warranty for customer-owned items; service visits; field-service reports | Odoo Repairs (customer, under warranty, quote, invoice); ERPNext Warranty Claim + Maintenance Schedule/Visit; metasfresh service/repair projects; Dolibarr interventions |
| **Projects** | Repair cost to a project; service/repair as project type | ERPNext Asset Repair `project`; metasfresh `C_Project` service/repair; Dolibarr intervention project |
| **Insights** | MTBF, MTTR, worst machines, spare part cost, asset value by category/location | Carbon Resources dashboard KPIs; Odoo equipment MTBF/MTTR + request analysis; ERPNext asset dashboard charts |

**BOSS implications.** Maintenance owns the equipment/facility master and the work order;
Manufacturing reads offline windows for scheduling, Warehouse supplies parts issuance via
the shared issuance screens, Accounting owns depreciation on the same `Asset`, and
Commons shows the read/book face of facility and equipment schedules.

---

## 14. Current Moqui baseline (MrSimpleScreens / MarbleERP / Mantle)

The existing implementation has a rich data model and per-asset maintenance tabs, but no
maintenance app: no cross-asset work queue, no team/technician board, no
facility-level maintenance, no booking flow. MarbleERP (`runtime/component/MrMarbleERP/screen/marble.xml`)
only mounts the SimpleScreens `Asset`, `Facility`, `Manufacturing` trees; it has no
maintenance screens of its own.

### Screens

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Asset dashboard | Links Asset Summary, Assets, Move Asset, Physical Inventory, Containers, Lots, Pools, On Hand Report — inventory-oriented | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/dashboard.xml` |
| Find Asset | Filters asset type, class, status, product, facility/location, container, lot, pool, owner, acquired/received/manufactured dates, acquire cost, only-no-location / only-no-cost | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/FindAsset.xml`, `FindSummary.xml` |
| Asset detail | Tabs per asset; detail form with product, facility, location, container, lot, owner, serial, soft identifier, manufactured/acquired/received dates, expected end of life, **Update Cost & Owner**, audit log; fixed-asset fields (depreciation type, salvage value, useful life years, depreciation and year-begin depreciation) shown when `isFixedAsset` | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/AssetDetail.xml`, `DetailHistory.xml` |
| Asset Maintenance tab | **Planned maintenance** list per asset from `ProductMaintenance` with next-due display (last meter value / next interval : remaining, green or red); maintenance history; dialogs **Add Planned Maintenance** and **Add Other Maintenance** (status, date, maintenance type, interval meter, interval UOM/qty, comments) | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/AssetMaintenance.xml`, `AssetMaintenance/FindAssetMaintenance.xml` (uses `mantle.product.EquipmentServices.get#AssetMaintenanceNeeded`, `create#AssetMaintenance`) |
| Edit Maintenance | Status, date, type, planned maintenance, interval meter/UOM/qty, comments; **content** attachments (upload/download); audit log | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/AssetMaintenance/EditAssetMaintenance.xml` (`create#AssetMaintenanceContent`) |
| Meter Readings tab | **New Meter Reading** (date, meter, value); list with read-by | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/AssetMeters.xml` |
| Registrations tab | Government registrations: from/thru, registration date, agency, registration number, license number | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/AssetRegistrations.xml` |
| Assignments tab | Party assignments with role and from/thru (custodian/user) | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/AssetParties.xml` (`AssetPartyAssignment`) |
| Asset calendar | **New Event** (name, purpose, facility, start, est. hours) on the asset; FullCalendar data | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/AssetCalendar.xml` (`mantle.work.EventServices.create#Event`, `get#FullCalendarData`) |
| Move Asset | Select an asset, then move quantity to a facility, location (scan location supported) or container with status | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Asset/Asset/{SelectAsset,MoveAsset}.xml` |
| Product meters & maintenance plans | On the product: Product Meters (meter type, UOM, name) and Product Maintenance (type, interval qty/UOM/meter, repeat count, template work effort) | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Catalog/Product/EditProduct.xml` (`createProductMeter`, `createProductMaintenance`) |
| Facility find/edit | Find by name/type/owner/ID; edit: type, **parent facility**, owner, size + UOM, opened/closed dates, address, phone, email, lat/long, asset policy flags, notes, location types, box types | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Facility/{FindFacility,EditFacility}.xml` |
| Facility locations | Locations with area/aisle/section/level/position, type, capacity + UOM, sequence; find assets in location | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Facility/EditFacilityLocations.xml` |
| Facility calendar | `mr-calendar` component of work-effort events filtered by facility (read-only; event detail TODO) | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Facility/FacilityCalendar.xml` |
| Equipment on production runs | Equipment assignments on a run (`WorkEffortAssetAssign`); Manufacturing dashboard links equipment assets (`AstTpEquipment`) | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Manufacturing/Run/EditRun.xml`, `runtime/component/MrSimpleScreens/screen/SimpleScreens/Manufacturing/dashboard.xml` |
| Post depreciation | **Post Depreciation** on a time period | `runtime/component/MrSimpleScreens/screen/SimpleScreens/Accounting/TimePeriod/ViewPeriodGlAccounts.xml` (`calculateAndPost#AllFixedAssetDepreciations`) |

### Data model available (mr-mantle-udm)

| Entity / enum | What it gives Maintenance | Key files |
| --- | --- | --- |
| `Asset` | `parentAssetId` (hierarchy), `assetTypeEnumId`, `classEnumId`, `statusId`, owner, product, serial / soft identifier / activation, received/acquired/manufactured dates, expected/actual end of life, **capacity** + UOM, `facilityId` + `locationSeqId`, container, lot, `geoPointId`, acquire order/work effort/shipment, acquire cost, salvage value, depreciation + type, tax depreciation | `runtime/component/mr-mantle-udm/entity/ProductAssetEntities.xml` |
| `AssetType` enum | Inventory, Supplies, **Fixed Asset** → Equipment, Rental Equipment, Real Estate, Investment Real Estate, Bearer Biological; Biological; Intangible | same, `AstTp*` |
| `AssetClass` enum | Warehouse/Manufacturing Equipment, Boat, Forklift, Digger, Manlift, Service Body, Tractor, Passenger Vehicle, Compressor, Trencher, Puller, Tanker, Reel Stand, Cargo Vehicle (Truck, Trailer, Container), Computer Hardware (Desktop, Laptop, Tablet, Monitor), Computer Software (4 kinds) | same, `AsCls*` |
| Asset status | Incoming, Available, Promised, Delivered, Activated, Deactivated, On Hold, **In Use**, In Storage, In Transfer, Returned, **Defective**, Quarantine, Morgue — no "In Maintenance" / "Out of Service" | same, `Ast*` |
| `AssetMaintenance` | Asset, status (**Created / Scheduled / In Process / Completed / Cancelled**, `AsMnt*`), date, `maintenanceTypeEnumId`, `productMaintenanceId` (plan), `taskWorkEffortId` (the work), interval qty/UOM/meter type/meter, `purchaseOrderId`, user, comments; `AssetMaintenanceContent`, `AssetMaintenanceOrderItem` | same |
| `MaintenanceType` enum | Vehicle Maintenance, Oil Change, Belt Replacement, Re-Fuel, Tune Up, Battery Replace/Check, Lubricate Chassis, Tires Rotate, Tire Replacement, HVAC Maintenance, Air Filter Replace, Refrigerant Check/Recharge, Cleaning (`MntTp*`) | same |
| `ProductMaintenance` | PM plan per product: type, description, **template work effort**, interval qty + UOM or meter type/meter, **repeat count** | same |
| `ProductMeter`, `ProductMeterType`, `AssetMeter` | Meters per product; readings per asset (date, value, reason, linked maintenance/work effort, user); meter types Speedometer, Tachometer, Distance, **Motor Time**, Use Count, Copy Count, Trip, Tachograph, Taximeter, Event Data Recorder, Pedometer, **Odometer**, Thermometer | same, `PdMtr*` |
| `AssetRegistration`, `AssetIdentification`, `AssetPartyAssignment` | Gov registrations; identifiers (mfg serial, MAC, VIN, gas card, license plate, tracking label); party/role assignment over time | same |
| `AssetDepreciation`, `AssetStandardCost`, `AssetGlAppl` | Per-period depreciation; standard cost; GL overrides; depreciation types Straight Line, Double Declining, Sum of Years Digits, Units of Production; tax MACRS GDS 5/7 | same |
| `Facility` (+ `FacilityGroup`, `FacilityParty`, `FacilityContent`, `FacilityCertification`, `FacilityLocation`) | `parentFacilityId` hierarchy, types **Block, Block Group, Building, Land, Floor, Office, Call Center, Data Center, Plant, Room, Retail Store, Warehouse, Dock, Production Line** (`FcTp*`), size, opened/closed, geo point, parties, certifications | `runtime/component/mr-mantle-udm/entity/FacilityEntities.xml` |
| WorkEffort links | Purposes **Maintenance** (`WepMaintenance`) and **Asset Usage (Rental)** (`WepAssetUsage`); `WorkEffortAssetAssign` (status Requested / Assigned / Arrived / Departed / Request Denied, from/thru, allocated cost) — usable as an equipment booking; `WorkEffortAssetNeeded`; `WorkEffortFacility`; `WorkEffortParty` | `runtime/component/mr-mantle-udm/entity/WorkEffortEntities.xml` |

### Services (mr-mantle-usl)

| Service | Purpose | Key files |
| --- | --- | --- |
| `create#Equipment`, `create#AssetMaintenance`, `get#AssetMaintenanceNeeded` (returns last meter/reading, last maintenance date/interval, **next interval**, **remaining interval**), `create/update#AssetMaintenanceContent` | Equipment creation and PM due calculation | `runtime/component/mr-mantle-usl/service/mantle/product/EquipmentServices.xml` |
| `move#Asset`, `issue#AssetToWorkEffort`, `replace#AssetPartyAssignment`, reservations | Moves, parts issuance to a work effort, custodian change | `runtime/component/mr-mantle-usl/service/mantle/product/AssetServices.xml` |
| `calculate#FixedAssetDepreciation`, `post#FixedAssetDepreciation` | Depreciation | `runtime/component/mr-mantle-usl/service/mantle/ledger/AssetAutoPostServices.xml` |

---

## 15. Gaps & BOSS implications

### Notable gaps in the Moqui baseline

- **No work queue.** `AssetMaintenance` is only reachable per asset; there is no
  cross-asset list, kanban, calendar, "my work" or team view (compare Odoo team dashboard
  and request kanban, Carbon dispatch table and MES board).
- **No request/triage step.** Nothing like Odoo's request or Carbon's operator-raised
  dispatch; a requester outside Maintenance cannot report a broken machine or room.
  `mantle.request.Request` exists and could be the intake record.
- **No priority, team, assignee, planned window, failure mode, downtime or OEE impact** on
  `AssetMaintenance`; these live (or can live) on the linked `taskWorkEffortId`
  WorkEffort (priority, estimated start/completion, parties, time entries), which is
  under-used.
- **No status for "down".** Asset status has Defective / On Hold but no In Maintenance /
  Out of Service; ERPNext (In Maintenance, Out of Order), Carbon fixed assets (Take Out of Service) and Carbon fleet (In Maintenance) all have it, and Manufacturing needs it.
- **PM is per product plan only**; there is no per-asset schedule override, no
  calendar-of-due-PMs, no auto-generation of the next work order, and no "skip holidays"
  or day-of-week rules. `get#AssetMaintenanceNeeded` computes due by meter/time but nothing
  lists all due/overdue PMs.
- **Facilities are logistics-shaped.** Edit Facility is about shipping, box types and
  inventory flags; there is no facility tree view, no facility-level maintenance, no room
  attributes (capacity, features) and no facility equipment list.
- **Scheduling admin is absent.** Facility and asset calendars show WorkEffort events,
  but there is no booking request, approval, conflict check, or per-resource policy
  (Gauzy, Dolibarr, Zimbra, Nextcloud show the shapes).

### What each reference contributes

| Reference | Take |
| --- | --- |
| Odoo | Team dashboard cards with deep-link counters; request kanban by stage with kanban-state light; Corrective/Preventive on one record with recurrence; equipment MTBF/MTTR; employee/department/vehicle assignment and departure unassign; email-in requests via team alias; Repairs as a separate customer-facing app |
| Carbon | Work-center-centric dispatch with severity, source, **OEE impact**, suspected vs actual failure mode, **takes work center offline**; time events and spare-part issue on the dispatch; MES technician board and andon tile; KPI dashboard (MTTR, MTBF, worst machines, part cost); fixed assets with out-of-service and fleet statuses |
| ERPNext | Location tree with geo/area; per-asset maintenance plan with task periodicity, **Calibration** type and certificates; generated logs with calendar; Asset Repair with downtime, consumed items and capitalized cost; Asset Movement between locations/employees; Downtime Entry with stop reasons |
| AureusERP | Confirms the Odoo shape is portable; instructions as text / PDF / slides |
| Dolibarr | Signed, billable intervention report with recurring templates; resources attached to events with busy check; public booking ranges (BookCal); asset models as templates |
| Ever Gauzy | Equipment share request → approve/refuse, max share period, auto-approve, sharing policies, employee/team participants |
| Zimbra / Nextcloud | Per-resource scheduling policy (auto-accept/decline, conflicts allowed); room search by capacity/features with availability check in the event editor |
| metasfresh | Customer repair as project with spare-parts vs repair-order tasks and ownership-aware cost collectors (Customer Service, not Maintenance) |

### Recommended screen inventory (IronStone Maintenance)

| Area | Screens |
| --- | --- |
| Home | Maintenance dashboard: tiles (open, overdue PM, high priority, unassigned, assets down), my work, team cards with counters, MTTR/MTBF strip |
| Work orders | Work order list (saved filters, group by team/status/asset/facility), board by status, calendar; work order detail (asset or facility, type, priority, severity, source, team, assignees, planned window, offline flag, failure mode suspected/actual, procedure/instructions, time entries, parts used with issue, purchase links, content, notes, history); quick request dialog for anyone |
| Preventive | PM plans (product-level `ProductMaintenance` + per-asset overrides), due/overdue PM list with meter status, PM calendar, generate-next action |
| Equipment & assets | Equipment find (type/class/status/facility/team/custodian/warranty/due), equipment 360 (summary, hierarchy children, meters, maintenance history, plans, assignments, registrations, documents, calendar, cost/depreciation link to Accounting) |
| Facilities | Facility tree (site → building → floor → room), facility detail (attributes, rooms, equipment in facility, work orders, calendar, parties, certifications) |
| Scheduling admin | Bookable resources (facilities/equipment) with policy (approval required, auto-approve, max period, conflicts allowed, capacity, features); booking requests queue (approve/refuse); availability board; blackout/maintenance windows |
| Reliability | Downtime log, failure modes, MTBF/MTTR/worst assets report, PM compliance, maintenance cost by asset/facility |
| Configuration | Teams and members, maintenance types, failure modes, status/stage labels, meter types, asset classes, procedures/checklists |

### Data-model implications

- Use `WorkEffort` (purpose `WepMaintenance`) as the work order; keep `AssetMaintenance` as
  the asset-side record linked by `taskWorkEffortId`. Add or reuse fields for severity,
  source, OEE impact, takes-offline, failure modes (suspected/actual), downtime.
- Facility maintenance needs a facility target: `WorkEffortFacility` on the work order, or
  `AssetMaintenance` generalized; decide before building.
- Add asset statuses for **In Maintenance** and **Out of Service** (or a separate
  availability flag) so Manufacturing and booking can read "down".
- Bookings: `WorkEffortAssetAssign` (Requested / Assigned / Request Denied) for equipment
  and `WorkEffortFacility` for rooms, with WorkEffort purpose for booking vs usage
  (`WepAssetUsage`); policy fields per Asset/Facility need a new entity or attributes.
- Failure modes, maintenance teams and procedures/checklists have no entities today.

### First-release cut

Dashboard, work order list/board/detail with quick request, equipment find + equipment
360 (meters, maintenance, assignments), PM due list with generate-next, facility tree +
detail, teams and maintenance types config. Defer booking approval workflow,
reliability analytics beyond counts, fleet specifics, and technician kiosk/mobile to a
second pass (the work order detail should still be usable on a phone).

### Open questions

- Is the work order a WorkEffort with an `AssetMaintenance` child, or `AssetMaintenance`
  with a WorkEffort child (today's shape)? Facility work orders push toward WorkEffort-first.
- Does booking approval belong to Maintenance admin only, or can facility owners approve
  their own rooms from Commons?
- Customer-owned equipment repair and warranty: Customer Service app or Maintenance?
- How far into fixed-asset accounting does the equipment 360 go (read-only NBV vs actions)?
- Fleet: a vehicle asset class inside Maintenance, or a separate face later?

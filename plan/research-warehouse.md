# IronStone BOSS — Warehouse app research

Oct 18, 2026

Deeper research pass on the **IronStone Warehouse** app (receiving, put-away, inspection, shipping, inventory, counts, adjustments, transfers, returns receiving, and locations/facility setup), cataloguing every relevant screen/page found in the reference apps. Companion to [3p-app-reference.md](3p-app-reference.md); feeds the Warehouse row in [initial-design.md](initial-design.md) plus the warehouse faces of the shared Shipment, Order and Inventory screens.

**Organization.** Sorted by functional area (not by app): all receiving screens together, all picking screens together, etc. Within each area, sub-tables per reference app. Style mirrors [research-accounting.md](research-accounting.md) and [research-drawers-commons.md](research-drawers-commons.md).

**Scope.** Business UI only: screens, dialogs, lists, scan flows, report pages and the posting controls a warehouse user actually touches. Posting/allocation logic is noted only where it shapes a screen (statuses, reservations, backorders, validation gates, quantity fields). Product-master, manufacturing-execution and accounting-valuation screens are covered only where they are reached from a warehouse task.

**Path conventions.** Paths are relative to each repository's own root, as in 3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — paths below use `odoo/addons/<addon>/…`; each addon keeps views in `<addon>/views/`, report actions/templates in `<addon>/report/`, and OWL/JS in `<addon>/static/src/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — paths relative to `erpnext/`; stock lives in `erpnext/stock/` (doctype dirs with `.json`/`.js`/`.py`, `report/`, `workspace/`, `page/`, `print_format/`) |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — ERP UI under `apps/erp/app/modules/inventory/ui/` and `apps/erp/app/routes/x+/…`; shop-floor UI under `apps/mes/app/`; shared table/form primitives in `packages/react/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament resources/pages under `plugins/webkul/inventories/src/Filament/` (clusters: Operations, Configurations, Products, Reporting, Settings) |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — module pages under `htdocs/<module>/`; stock area `htdocs/product/stock/`, shipments `htdocs/expedition/`, receptions `htdocs/reception/`, physical inventories `htdocs/product/inventory/` |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — React WebUI in `frontend/src/` (generic window shell); warehouse mobile/REST apps in backend modules `de.metas.handlingunits.mobileui`, `de.metas.inventory.mobileui`, `de.metas.picking.rest-api`; business windows are metadata-defined in `backend/de.metas.*` |
| **Moqui references** | `/home/jonesde/work/moquiwork/3p_moqui/Sales`, `/home/jonesde/work/moquiwork/3p_moqui/WorkManagement` — no warehouse module; used only to confirm absence |

Not used here: Akaunting, Twenty, Nextcloud, Zimbra, Signal and the groupware sources from the drawers-commons pass ship no stock/warehouse functionality. Ever Co (gauzy) has inventory/equipment pages, but they track equipment, sharing policy and equipment requests, not stock, locations or shipments, so it is not a Warehouse reference. The Moqui components in the checkout (Sales, WorkManagement, WeCreate, coarchy, resistmanagement) also have no warehouse module; the current Moqui baseline is the MrSimpleScreens/Mantle form set summarized in §15.

Sections: [1 warehouse home & queues](#1-warehouse-home--work-queues) · [2 receiving & inbound](#2-receiving--inbound) · [3 put-away, internal transfers & warehouse transfers](#3-put-away-internal-transfers--warehouse-transfers) · [4 inspection & quality](#4-inspection--quality) · [5 stock by location & availability](#5-stock-by-location--availability) · [6 counts, adjustments & reconciliation](#6-counts-adjustments--reconciliation) · [7 picking](#7-picking) · [8 packing, shipping & carriers](#8-packing-shipping--carriers) · [9 returns receiving](#9-returns-receiving) · [10 lots, serials, packages & traceability](#10-lots-serials-packages--traceability) · [11 locations, storage & facility setup](#11-locations-storage--facility-setup) · [12 barcode, handheld & scan flows](#12-barcode-handheld--scan-flows) · [13 reports, valuation & audit](#13-reports-valuation--audit) · [14 settings & configuration](#14-settings--configuration) · [15 gaps, notables & current Moqui baseline](#15-gaps-notables--current-moqui-baseline)

---

## 1. Warehouse home & work queues

### Odoo — Inventory Overview is a board of operation types

The Inventory app has no generic dashboard: the landing screen is a kanban of **operation types**, one card per receipt / delivery / internal / manufacturing / POS flow, each card acting as a live work queue.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory root menu | **Operations** (Transfers, Adjustments, Procurement, Jobs) · **Products** · **Reporting** · **Configuration**; the root is gated to stock user/manager | `odoo/addons/stock/views/stock_menu_views.xml` (menuitems `menu_stock_root`, `menu_stock_warehouse_mgmt`, `menu_stock_transfers`, `menu_stock_adjustments`, `menu_stock_jobs`, `menu_stock_inventory_control`, `menu_warehouse_report`), `odoo/addons/stock/views/res_config_settings_views.xml` |
| Inventory Overview | Kanban (`js_class="stock_dashboard_kanban"`) over operation types; each card has the type name, warehouse, a primary "N To Receive / To Deliver / To Process" button (or "Open"), and secondary links for **Waiting**, **Late**, **Back Orders** counts that open the same transfer list pre-filtered | `odoo/addons/stock/views/stock_picking_type_views.xml` (`stock_picking_type_action`, `stock_picking_type_kanban`) |
| Card mini-chart | Bar sparkline of moves for past / present / future days; clicking a bar opens the transfers filtered to that date bucket and operation type | `odoo/addons/stock/static/src/picking_type_dashboard_graph/picking_type_dashboard_graph_field.js`; action `stock.click_dashboard_graph` |
| Card menu | **Reporting**, **Detailed Moves**, **Prepare Batch**; manager-only favorite/color/Configuration controls | `stock_picking_type_views.xml` (`stock_picking_type_kanban`, menu template) |
| Transfer work lists | Server actions for all / incoming / outgoing / internal / ready / waiting / late / backorder transfers; list, kanban and calendar views over the same `stock.picking` model | `odoo/addons/stock/views/stock_picking_views.xml` (`action_picking_tree_all`, `action_picking_tree_incoming`, `action_picking_tree_outgoing`, `action_picking_tree_internal`, `action_picking_tree_ready`, `action_picking_tree_waiting`, `action_picking_tree_late`, `action_picking_tree_backorder`, `stock_picking_kanban`, `stock_picking_calendar`) |
| Batch (wave) work list | Separate list/kanban/card/calendar for batch transfers, with assignee and transfer count | `odoo/addons/stock/views/stock_picking_batch_views.xml` (`stock_picking_batch_action`, `stock_picking_batch_tree`, `stock_picking_batch_kanban`, `stock_picking_batch_card`, `stock_picking_batch_calendar`) |

### AureusERP — the same operation-type card board in Filament

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory Overview | Filament page `inventory/overview`, shield-gated, header widgets only | `plugins/webkul/inventories/src/Filament/Pages/Overview.php`, `resources/views/filament/pages/overview.blade.php` |
| Operation-type cards | One card per `OperationType`; shows a ready count with a type-specific label ("to receive", "to deliver", "to process"), plus links for waiting, late, back-orders and all operations; every link deep-links to the Receipt / Delivery / Internal resource index with a query-builder filter for that operation type and active table view | `plugins/webkul/inventories/src/Filament/Widgets/OperationTypeOverviewWidget.php`, `OperationTypeCardWidget.php` |
| Operation tables | Table columns: favorite toggle, name, source/destination location, partner, responsible user, scheduled at, deadline, closed at, origin, operation type, company, state; group-by state/origin/type/scheduled/created; a modal query-builder filter (text, relationship, state, dates, company, creator); bulk delete | `plugins/webkul/inventories/src/Filament/Clusters/Operations/Resources/OperationResource/Tables/OperationsTable.php` |

### ERPNext — Desk "Stock" workspace with KPI cards and report cards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock workspace | Onboarding block, "Stock Value by Item Group" chart, three number cards (**Total Stock Value**, **Total Warehouses**, **Total Active Items**), then seven link cards: Stock Reports, Serial & Batch Reports, Movement Reports, Item Reports, Audit Reports, Tools, Setup | `erpnext/stock/workspace/stock/stock.json` |
| KPI definitions | Number cards over `Bin`, `Warehouse`, `Item`; supporting charts: purchase-receipt trends, delivery trends, stock value by item group, warehouse-wise stock value, oldest items, item shortage summary | `erpnext/stock/number_card/*/*.json`, `erpnext/stock/dashboard_chart/*/*.json` |
| Report cards | Grouped link lists (not screens themselves): Stock Ledger, Stock Balance, Stock Projected Qty, Stock Analytics, Stock Ageing, Warehouse Wise Stock Balance, Total Stock Summary, Item Shortage, Reorder Level, Reserved Stock, Serial/Batch traceability, audit reports, and tools (Repost Item Valuation, Stock Closing Entry, Putaway Rule, Delivery Trip, Shipment, Quick Stock Balance) | `erpnext/stock/workspace/stock/stock.json` |
| Stock dashboard | Separate `stock_dashboard/` fixture directory supplies the module dashboard data | `erpnext/stock/stock_dashboard/` |

### Dolibarr — stock-area home is a warehouse list plus latest movements

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock area home | Warehouse search, a list of warehouses with links, and a "last stock movements" table with a **Full list** link; no configurable dashboard of its own | `htdocs/product/stock/index.php` |
| Global home boxes | The company home page is a user-arranged grid of boxes; stock is represented only through generic movement/warehouse boxes, not a dedicated warehouse board | `htdocs/index.php`, `htdocs/admin/boxes.php`, registration `htdocs/core/boxes/modules_boxes.php` |
| Warehouse list | Searchable/sortable warehouse list with status, country and product count columns | `htdocs/product/stock/list.php` |

### Carbon — module rail with a quantities-first landing page

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory navigation | Four groups: **Stock** (Quantities, Movements, Inventory Count, Kanbans) · **Shipping & Receiving** (Receipts, Shipments) · **Transfers** (Picking Lists, Stock Transfers, Warehouse Transfers) · **Traceability** (Tracked Entities, Traceability) · **Configure** (Storage Units, Storage Types, Storage Rules, Shipping Methods) | `apps/erp/app/modules/inventory/ui/useInventorySubmodules.tsx` |
| Inventory landing | `/x/inventory` redirects to **Quantities**, a dense stock table with custom columns, filters, export, and tabs for Quantities / Batch Quantities / Serial Quantities | `apps/erp/app/routes/x+/inventory+/_index.tsx`, `inventory+/quantities.tsx`, `apps/erp/app/modules/inventory/ui/Inventory/InventoryTable.tsx` |
| Quantities columns | Item ID/name, On Hand, Days remaining, Lead Time, Reorder Policy, Replenishment system, Usage/day (30d, 90d), On Purchase Order, On Jobs, On Production Demand, On Sales Order, Demand Forecast, UoM, material attributes (shape, substance, finish, grade, dimension, type), tags, storage type/unit, active; **Recalculate** action | `InventoryTable.tsx` |
| Kanbans | Replenishment kanban definitions (Buy / Make / Transfer), creating one card per item/replenishment policy; list page has new/delete flows | `apps/erp/app/routes/x+/inventory+/kanbans.tsx`, `kanbans.new.tsx`, `kanbans.$id.tsx`, `apps/erp/app/modules/inventory/ui/Kanbans/` |

### metasfresh — generic window shell; no warehouse home of its own

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Generic dashboard / window shell | All warehouse "screens" are backend-defined windows rendered by the same document-list + master-window containers; no module-specific React page | `frontend/src/containers/DocumentListContainer.js`, `MasterWindowContainer.js`, `frontend/src/components/window/` |
| Delivery planning header | Document-list header above a delivery-planning window that sums **planned/actual loaded** and **planned/actual discharged** quantities per UoM over the selected rows (or current page) | `frontend/src/components/deliveryPlanning/DeliveryPlanningViewHeader.js`, `OIViewHeader.js` |

**BOSS implications.** Every reference that has a real warehouse lands on a queue, not a chart wall. Copy Odoo/AureusERP's operation-type card board as the Warehouse home: Receiving, Put-away, Picking, Packing, Shipping, Returns, Counts, each with ready / waiting / late / backorder counts and a sparkline, and every tile deep-links into a pre-filtered work list. ERPNext's KPI strip (stock value, warehouse count, active items) belongs beside the queue but must not replace it. On Moqui this maps to a `Screen` with a `form-list` of operation-type summary rows (or a dashboard portlet), backed by counts over `Shipment`/`PhysicalInventory` rather than a new aggregation table; the pre-filtered list is a screen parameter, not a separate screen.

---

## 2. Receiving & inbound

### Odoo — receipt is one `stock.picking` form with an editable move list

Receiving is not a separate model: a receipt is a picking of an incoming operation type. The same form also serves deliveries and internal transfers, with fields and buttons toggled by `picking_type_code`.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Transfer list | Columns: priority, reference, from/to location, partner, signed flag, responsible user, scheduled date, availability, deadline, effective date, origin, backorder, operation type, batch, company, status, activity exception; header **Reserve**; search filters for To Do / My Transfers / Starred / Draft / Waiting / Ready / Receipts / Deliveries / Internal / Late / Backorders; group-by status/date/origin/country/type/batch | `odoo/addons/stock/views/stock_picking_views.xml` (`vpicktree`) |
| Receipt form | Header buttons: Mark as To Do, Reserve, Validate, Print (before/after done), Return, Exchange, Cancel, Lock/Unlock; status bar for incoming is `draft,assigned,done` (no confirmed step); button box: Returns, Scraps, Packages, Traceability, Allocation, Moves, Next Transfer, Batch | `stock_picking_views.xml` (`view_picking_form`) |
| Receipt header fields | "Receive From" partner, operation type, destination location, scheduled date + reschedule popover, deadline, product availability indicator, effective date, origin (e.g. PO0032), owner (owner-tracked stock), picking properties | `stock_picking_views.xml` (`view_picking_form`) |
| Operations tab | Editable move rows: product, description, forecast availability widget, demand, done quantity, UoM, picked flag, lot/serial tags (create-on-receipt controlled by `use_create_lots`), destination package, **Details**; buttons **Put in Pack**, **Return All**, **Clear** | `stock_picking_views.xml` (`view_picking_form`, `move_ids` list) |
| Additional Info / Note | Move type, responsible user, company, batch; internal note printed on the picking operations sheet | `stock_picking_views.xml` |
| Validation / backorder dialog | Warns when less than the initial demand was processed; creates a backorder or closes without one; per-transfer toggle when several transfers are validated together | `odoo/addons/stock/wizard/stock_backorder_confirmation_views.xml`, `stock_backorder_confirmation.py` |
| Put in Pack dialog | Package type, max quantity per package + UoM, existing destination package or blank to create new; puts selected move lines into packages | `odoo/addons/stock/wizard/stock_put_in_pack_views.xml` |
| Print actions | Picking Operations, Delivery Slip, Packages, Reception label; report templates include reception, delivery slip, return slip, package/lot/location barcodes | `odoo/addons/stock/report/stock_report_views.xml`, `report_stock_reception.xml`, `report_deliveryslip.xml`, `report_return_slip.xml`, `report_package_barcode.xml` |
| Chatter | Message/activity/attachment timeline on every transfer | `view_picking_form` (`<chatter/>`) |

### ERPNext — Purchase Receipt doctype with received/rejected quantities

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Purchase Receipt list/form | Generated Desk list/form over `Purchase Receipt`; list columns posting date, grand total, per-billed, per-returned; form is submittable with statuses Draft / Partly Billed / To Bill / Completed / Return / Return Issued / Cancelled / Closed | `erpnext/stock/doctype/purchase_receipt/purchase_receipt.json`, `.js`, `.py` |
| Receipt header | Supplier, supplier delivery note, posting date/time, company, is-return + return-against, supplier/shipping addresses and contacts, currency/price list, set warehouse, rejected warehouse, subcontracting flags, taxes/shipping rule, totals | `purchase_receipt.json` |
| Receipt lines | Item, received qty, accepted qty (`qty`), **rejected qty**, UoM, warehouse, rejected warehouse, quality inspection link, purchase order link, schedule date, valuation rate, landed-cost amount | `erpnext/stock/doctype/purchase_receipt_item/purchase_receipt_item.json` |
| Receipt actions | Debit Note, Delivery Note, Landed Cost Voucher, Purchase Invoice, Asset, Asset Movement, Purchase Order, Close, **Purchase Return**, Make Stock Entry, Sample Retention Stock Entry, Reopen | `purchase_receipt.js` (`add_custom_button` labels) |
| Barcode/scan | `scan_barcode` header shortcut populates lines by barcode; line has explicit `barcode` + `has_item_scanned` | `purchase_receipt.json`, `purchase_receipt_item.json` |
| Create from PO | Purchase Order has a **Create → Purchase Receipt** action, mapping open PO lines/quantities | `erpnext/buying/doctype/purchase_order/purchase_order.js` (`make_purchase_receipt`) |
| Receiving print | Purchase Receipt serial/batch print format plus receipt trend chart | `erpnext/stock/print_format/purchase_receipt_serial_and_batch_bundle_print/`, `erpnext/stock/dashboard_chart/purchase_receipt_trends/` |
| Stock Entry (alternative receipt path) | Submittable document with purpose **Material Receipt** (also Material Issue, Material Transfer, Manufacture, Repack, Send to Subcontractor, Disassemble, Receive from Customer, …); lines carry source/target warehouse, qty, serial/batch bundle, quality inspection | `erpnext/stock/doctype/stock_entry/stock_entry.json`, `stock_entry_detail.json`, `stock_entry.js` |

### Carbon — Receipts are first-class documents with source-document selection

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Receipts list | Table with ID, type, source document + readable ID, status, invoiced flag, posted by/date, assignee, supplier, external reference, created/updated by and timestamps; **Add Receipt** action; custom columns | `apps/erp/app/modules/inventory/ui/Receipts/ReceiptsTable.tsx`, route `apps/erp/app/routes/x+/receipt+/` |
| New receipt form | Source document selector (Purchase Order, Purchase Return Order, Inbound Transfer, Rental Agreement), source document ID (searches the chosen source), location, external reference | `Receipts/ReceiptForm/ReceiptForm.tsx`, `useReceiptForm.tsx` |
| Receipt detail header | Status chip, created-by/due/at-location meta, assignee, **Post** / **Void** / **Delete** menu actions, print; posting button opens the post modal | `Receipts/ReceiptHeader.tsx`, `Receipts/ReceiptPostModal.tsx`, `Receipts/ReceiptVoidModal.tsx` |
| Receipt lines | Line cards with item, received quantity, serial numbers (one per line), tracking (batch) selection, batch properties, shelf-life/expiry, attachments per line, fixed-asset lines, rental-unit lines; split/update/tracking sub-routes | `Receipts/ReceiptLines.tsx`, routes `receipt+/$receiptId/`, `lines.$id.update.tsx`, `lines.$id.tracking.tsx`, `lines.split.tsx`, `lines.return-entities.tsx` |
| Posting validation | Post modal lists missing/over-quantity tracking lines and blocks posting until serial/batch quantities are complete; also evaluates rule violations | `Receipts/ReceiptPostModal.tsx` |
| Receipt documents panel | Related-document rail: supplier, source document, inspections raised, invoices that billed it, files attached to lines; streams async rows | `Receipts/ReceiptDocuments.tsx` |
| Receipt statuses | Draft → Pending → Posted, plus Voided | `apps/erp/app/modules/inventory/inventory.models.ts` (`receiptStatusType`) |
| Return entity | On a sales-return receipt line, picks which shipped serial/batch entities actually arrived; re-tags the existing entity, and posting reactivates it On Hold; blind lines fall back to normal tracking entry | `Receipts/ReturnEntityForm.tsx`, route `receipt+/lines.return-entities.tsx` |

### AureusERP — ReceiptResource shares one operation form with deliveries/internals

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Receipts list | Filament table over operations whose type is INCOMING; favorite, name, locations, partner, user, scheduled/deadline/closed dates, origin, operation type, company, state; activity action, view/edit/delete actions; bulk delete | `plugins/webkul/inventories/src/Filament/Clusters/Operations/Resources/ReceiptResource/Tables/ReceiptsTable.php`, `OperationResource/Tables/OperationsTable.php` |
| Receipt form | General section switches partner label by operation type ("Receive From" for incoming), operation type presets source/destination locations; locations required depending on type; Tabs: **Operations** (moves repeater), **Additional** (responsible, shipping policy, scheduled at, source document), **Note** (rich editor) | `.../OperationResource/Schemas/OperationForm.php` (lines 86–260) |
| Move rows | Product, final/destination location, description, packaging, demand qty, done qty, UoM, picked toggle; per-move lot/serial generation dialog (first lot, qty per lot, qty received, keep current lines) and serials textarea; detailed lines repeater with quantity/lot/destination/package/qty | `OperationForm.php` (`getMovesRepeater`, lines 263–830) |
| Receipt actions | Action classes: Check Availability, Todo, Validate, Cancel, Return, Next Transfer, Print (delivery slip, labels, package, picking operation, return slip) | `.../Operations/Actions/{CheckAvailabilityAction,TodoAction,ValidateAction,CancelAction,ReturnAction,NextTransferAction}.php`, `Actions/Print/` |
| Move history page | "Moves" relation page per operation: product, date, reference, lot, package, source/destination, quantity, UoM, state, done-by; delete per row | `.../OperationResource/Pages/ManageMoves.php` |

### Dolibarr — Reception is a separate document created from a supplier order

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Reception list | Searchable list of receptions with status, supplier, project, dates and totals | `htdocs/reception/list.php`, `htdocs/reception/index.php` |
| New reception | Created from a supplier order (or standalone): supplier, warehouse, project, reception date, planned delivery date, weight/dimensions, reception method, tracking number, incoterm, document model, public/private notes | `htdocs/reception/card.php` (creation block) |
| Reception card | Object tabs: Card, Reception Distribution (while draft/validated and stock not yet calculated), Contacts/Addresses, Documents, Notes; validate/cancel actions; status draft → validated → closed | `htdocs/reception/card.php`, `htdocs/core/lib/reception.lib.php` (`reception_prepare_head`) |
| Distribution tab | Per-line dispatch: product, description/comment, qty ordered, qty already received, qty to receive, buying price, warehouse + stock, batch number, sell-by/eat-by dates; **Fill** / **Reset** helpers | `htdocs/reception/dispatch.php`, `htdocs/reception/card.php` lines ~1750+ |
| Validation | Confirmation dialog warns whether stock movements will be recorded now or later (depends on `STOCK_CALCULATE_ON_RECEPTION` / `..._CLOSE`); validates reception and optionally closes it | `htdocs/reception/card.php` lines ~2080–2110 |
| Reception numbering/PDF | Configurable numbering module and PDF model, free text, draft watermark | `htdocs/admin/reception_setup.php` |

**BOSS implications.** Receiving must be one task screen reused by purchase receipts, transfer receipts and customer returns, with the source document as context. Odoo's structure is the best fit for Moqui: a single Shipment record with `shipmentTypeId`, an editable item list carrying demand vs. received vs. rejected, a status bar, and a validation step that offers backorder creation. Carbon adds the two things Odoo/ERPNext do better elsewhere: a source-document picker at creation and a hard posting gate that refuses to post until every tracked line has serial/batch quantities. Mantle already has the pieces (`Shipment`, `ShipmentItem`, `ShipmentItemSource`, `ShipmentServices.receive#ShipmentProduct`, `receive#EntireShipment`); BOSS should expose `ShipmentItemSource` as the receipt line and derive accepted/rejected from `AssetReceipt` rather than adding columns to `ShipmentItem`. Inspection must be invocable from the receipt, not only from a separate Quality app screen.

---

## 3. Put-away, internal transfers & warehouse transfers

### Odoo — multi-step routes, putaway rules and destination packages

Put-away in Odoo is not a button on the receipt; it is a receiving route plus a putaway rule. The receipt itself may be one, two or three steps (input → quality → stock), each step a separate operation type and transfer, and the final destination is chosen by a putaway rule when the product is stored.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Warehouse configuration | Warehouse name/code/address; **Warehouse Configuration** tab: `reception_steps` (one/two/three steps), `delivery_steps` (ship only / pick+ship / pick+pack+ship), resupply warehouses; Technical tab exposes the generated view/stock/input/QC/pack/output locations and the operation types created for each step | `odoo/addons/stock/views/stock_warehouse_views.xml` (`view_warehouse`) |
| Operation type configuration | Code, sequence, warehouse, reservation method (at confirmation / before scheduled / manually), create-backorder default, lot creation policy (create new / use existing), package type, default source/destination locations, allocation location, batch creation (manual/automatic; max transfers/lines; group by contact/product/category/destination/source/date), print-on-validation choices | `odoo/addons/stock/views/stock_picking_type_views.xml` (`view_picking_type_form`) |
| Routes and rules | Routes list/form; rules list/form with action (pull/push/pull+push), source/destination location, picking type, procurement method, delay, propagate-cancel, domain; this is what turns sales/purchase demand into pick/pack/ship and receive/QC/store chains | `odoo/addons/stock/views/stock_location_views.xml` (routes), `odoo/addons/stock/views/stock_rule_views.xml` (`action_rules_form`) |
| Putaway Rules | Editable list: **When product arrives in** location, product (or category, or all), package type, **Store to** location, sublocation mode (`closest_location` / `no`), storage category, company; ordering by drag handle | `odoo/addons/stock/views/product_strategy_views.xml` (`stock_putaway_list`, `action_putaway_tree`) |
| Internal transfer | Same transfer form as a receipt/delivery; source and destination locations both visible; status bar includes `confirmed`; **Put in Pack**, move details, lots/serials; can generate a return | `odoo/addons/stock/views/stock_picking_views.xml` (`view_picking_form`) |
| Batch transfer (wave) | List/kanban/calendar of batches; form has Confirm / Reserve / Validate / Print / Print Labels / Cancel, assignee, operation type, scheduled date, description, Operations and Transfers tabs, **Put in Pack** | `odoo/addons/stock/views/stock_picking_batch_views.xml` (`stock_picking_batch_form`, `stock_picking_batch_kanban`) |
| Add transfers to batch | Wizard to select pickings and create a batch | `odoo/addons/stock/wizard/stock_picking_to_batch_views.xml` |
| Add to wave | Wizard to add pickings to an existing wave | `odoo/addons/stock/wizard/stock_add_to_wave_views.xml` |
| Relocate stock | Wizard launched from the quant list to move selected quants from one location to another | `odoo/addons/stock/wizard/stock_quant_relocate.xml`, `stock_quant_views.xml` (`action_stock_quant_relocate`) |

### ERPNext — Warehouse tree, Putaway Rule, and Material Transfer

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Warehouse | Tree/list/form with `is_group`, parent warehouse, company, account, address/contact HTML, warehouse type, default in-transit warehouse, rejected-warehouse flag, customer; button actions for Stock Balance and General Ledger | `erpnext/stock/doctype/warehouse/warehouse.json`, `warehouse.js` |
| Putaway Rule | Item (or blank for all), warehouse, capacity, priority, UoM/stock capacity, company, disabled; applies on Purchase Receipt / Stock Entry receipt | `erpnext/stock/doctype/putaway_rule/putaway_rule.json`, `putaway_rule.js` |
| Stock Entry | Purpose **Material Transfer** moves stock between warehouses/locations; lines carry source (`s_warehouse`) and target (`t_warehouse`), qty, serial/batch bundle, quality inspection, putaway rule, project, valuation rate; other purposes cover Material Receipt/Issue, Manufacture, Repack, Subcontracting, Disassemble | `erpnext/stock/doctype/stock_entry/stock_entry.json`, `stock_entry_detail.json`, `stock_entry.js` |
| Pick List (Material Transfer) | Pick List purpose can be **Material Transfer**, **Material Transfer for Manufacture** or **Delivery**; material-transfer pick lists feed a Stock Entry rather than a Delivery Note | `erpnext/stock/doctype/pick_list/pick_list.json`, `pick_list.js` |
| Stock Reservation Entry | Submittable reservation against a voucher (Sales Order, etc.) with item, warehouse, reserved/delivered/consumed/transferred quantities, serial/batch entries, status | `erpnext/stock/doctype/stock_reservation_entry/stock_reservation_entry.json` |
| Warehouse Capacity Summary | Page with company/warehouse/item/parent-warehouse filters and a table of stock capacity, % occupied, balance qty; drill-down to documents | `erpnext/stock/page/warehouse_capacity_summary/` |

### Carbon — bin-to-bin Stock Transfers vs. location-to-location Warehouse Transfers

Carbon separates two transfer types that other ERPs conflate: a **Stock Transfer** moves quantities between storage units (bins) inside one location; a **Warehouse Transfer** moves stock between physical locations and has an explicit ship/receive lifecycle.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock Transfers list | Columns: transfer ID, location, status, source (Kanban vs Manual), assignee, completed at, created/updated by/at; delete action; **Add Stock Transfer** | `apps/erp/app/modules/inventory/ui/StockTransfers/StockTransfersTable.tsx`, routes `stock-transfer+/` |
| Stock Transfer wizard | Pick a source storage unit, search items/bins, see On Storage Unit / Required / Available / Incoming columns, set move quantities, create lines; release/complete actions | `StockTransfers/StockTransferWizard.tsx`, `StockTransferHeader.tsx` |
| Stock Transfer detail | Header with Kanban/manual source badge, **Release**, **Print**, **Complete**, reopen/delete; lines with pick/unpick, scan tracked entities, add line; scan route uses `TrackedEntityPicker` and clamps available quantity | `StockTransferHeader.tsx`, `StockTransferLines.tsx`, `routes/x+/stock-transfer+/$id.scan.$lineId.tsx` |
| Stock transfer statuses | Draft → Released → In Progress → Completed; locked after Draft | `apps/erp/app/modules/inventory/inventory.models.ts` (`stockTransferStatusType`, `isStockTransferLocked`) |
| Warehouse Transfers list | Columns: transfer ID, status, from/to location, reference, transfer date, expected receipt date, created/updated by/at | `WarehouseTransfers/WarehouseTransfersTable.tsx`, routes `warehouse-transfer+/` |
| Warehouse Transfer detail | Header actions **Confirm**, **Ship**, **Receive**, cancel/reopen/delete; line editor; document rail | `WarehouseTransfers/WarehouseTransferHeader.tsx`, `WarehouseTransferLines.tsx`, `WarehouseTransferForm.tsx` |
| Warehouse transfer statuses | Draft → To Ship and Receive / To Ship / To Receive → Completed / Cancelled | `inventory.models.ts` (`warehouseTransferStatusType`) |
| Internal movement history | Stock Movements table with correction modal; item ledger entries tagged by document type (receipt, shipment, transfer, adjustment, job issue, etc.) | `StockMovements/StockMovementsTable.tsx`, `StockMovements/StockMovementCorrectionModal.tsx`, `Inventory/ledgerFeed.ts` |

### AureusERP — Internal transfers are operation resources; putaway rules are configuration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Internal transfers | `InternalResource` list/form, same operation form as receipts/deliveries; move list with source/destination; actions Check Availability/Todo/Validate/Cancel/Return/Next Transfer/Print | `plugins/webkul/inventories/src/Filament/Clusters/Operations/Resources/InternalResource/`, `OperationResource/` |
| Putaway Rules | Relationship page per product/category/location and a standalone configuration resource: company, in-location, out-location, product/category, storage category, sub-location | `.../Clusters/Configurations/Resources/PutawayRuleResource/`, `.../ProductCategoryResource/Pages/ManageProducts.php` |
| Routes and Rules | Route resource with Rules relation manager; rule form with action, source/destination, picking type, delay, procurement method | `.../Clusters/Configurations/Resources/RouteResource/`, `RuleResource/` |
| Operation types | Configuration resource defining incoming/outgoing/internal/dropship types, source/destination locations, sequence, warehouse | `.../Clusters/Configurations/Resources/OperationTypeResource/` |
| Move history | Per-operation and global move tables with product, date, reference, lot, package, source/destination, quantity, UoM, state, done-by | `.../OperationResource/Pages/ManageMoves.php`, `.../Reporting/Resources/MoveResource/` |

### Dolibarr — stock transfer document and mass-movement screen

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock transfer list/card | Own document with agenda/contact/document/note tabs; draft → validated; actions **Destock all products**, **Cancel destock**, **Add stock all products**, **Cancel add stock**, validate (with inventory code) | `htdocs/product/stock/stocktransfer/stocktransfer_list.php`, `stocktransfer_card.php` |
| Mass stock movement | Select source warehouse, target warehouse, product, batch and quantity line by line, or import a CSV; label/inventory code; **Record movements** creates one movement per line | `htdocs/product/stock/massstockmove.php` |
| Warehouse list/card | Warehouse CRUD with status, address, product stock; stock movements per warehouse | `htdocs/product/stock/list.php`, `htdocs/product/stock/card.php` |

### metasfresh — handling-unit moves are the transfer primitive

| Screen/page | What it is | Key files |
| --- | --- | --- |
| HU Manager / mobile move | Mobile REST endpoints for moving a handling unit, bulk-moving HUs, loading/unloading, and resolving a locator by scanned code; the mobile UI is a profile-driven app, not a desktop form | `backend/de.metas.handlingunits.mobileui/.../{HUManagerRestController,HandlingUnitsRestController,JsonMoveHURequest,JsonBulkMoveHURequest,JsonResolveLocatorRequest}.java` |
| Picking / inventory mobile apps | Mobile applications (`PickingMobileApplication`, `InventoryMobileApplication`) expose workflow steps for picking and counting; desktop lists remain backend-defined windows | `backend/de.metas.picking.rest-api/.../PickingMobileApplication.java`, `backend/de.metas.inventory.mobileui/.../InventoryMobileApplication.java` |
| Generic window renderer | All desktop transfer windows (internal movements, HU movements) use the same list/master-window shell | `frontend/src/containers/DocumentListContainer.js`, `MasterWindowContainer.js` |

**BOSS implications.** Do not create a separate "put-away" document. Model it as a receiving step that produces moves from the receiving location to the final location, with a configurable putaway rule (product/category → facility location) applied at receipt. Mantle's `FacilityLocation` is hierarchical and already supports a `locationSeqId`; putaway can be a service that resolves the destination and writes `ShipmentItemSource`/asset receipt rows, not a new UI. For internal movement, offer two screens like Carbon: a quick bin-to-bin transfer (quantity only, scan optional) and a facility-to-facility warehouse transfer with ship/receive states. The latter maps to a `Shipment` with internal type and `ShipmentRouteSegment`, so the same tracking and document rail apply. The operation-type board should include internal transfers as a first-class queue, and multi-step receiving/delivery should be visible as the separate step queues Odoo generates, not hidden inside one document.

---

## 4. Inspection & quality

### ERPNext — Quality Inspection is a first-class, reference-linked document

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quality Inspection | Submittable document: report date, inspection type, reference type/name (Purchase Receipt, Delivery Note, Stock Entry, Job Card, etc.), item/serial/batch, sample size, inspected by / verified by, remarks, template, readings child table, status **Accepted / Rejected / Cancelled** | `erpnext/stock/doctype/quality_inspection/quality_inspection.json`, `quality_inspection.js` |
| Readings grid | Each reading row: specification/parameter, numeric spec (min/max or acceptance formula), up to 10 reading values, status/reading value; parameter groups; manual inspection flag | `erpnext/stock/doctype/quality_inspection_reading/quality_inspection_reading.json` |
| Templates and parameters | Quality Inspection Template, Quality Inspection Parameter, Parameter Group; reused across items and inspection types | `erpnext/stock/doctype/quality_inspection_template/`, `quality_inspection_parameter/`, `quality_inspection_parameter_group/` |
| Receipt/delivery integration | Purchase Receipt line has a `quality_inspection` link and separate **rejected qty** + rejected warehouse; Delivery Note and Stock Entry lines also carry inspection links | `purchase_receipt_item.json`, `delivery_note_item.json`, `stock_entry_detail.json` |
| Stock Entry gate | `inspection_required` flag on Stock Entry; Stock Settings control what happens when an inspection is not submitted or is rejected (`action_if_quality_inspection_is_not_submitted`, `action_if_quality_inspection_is_rejected`) | `stock_entry.json`, `stock_settings.json` |
| Inspection workflow | Create from a receipt/stock entry line; submit accepted or rejected; rejected quantities land in the rejected warehouse; a Quality Inspection can be cancelled | `quality_inspection.py`, `purchase_receipt.js` (Quality Inspection action) |

### Carbon — inspection plans, measurement grid, sample scanning and lot disposition

Carbon treats inspection as a quality module with full sampling and measurement, linked back to receipts and lots.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inspections list | Table of inspections with status; create from receipt or manually | `apps/erp/app/modules/quality/ui/Inspections/InspectionsTable.tsx`, routes `apps/erp/app/routes/x+/quality+/` |
| Inspection form | Item, serial/batch, receipt reference, notice ("You received this item"), disposition selector, notes, submit; used for a quick inspection | `Inspections/InspectionForm.tsx` |
| Inspection view | Header actions **Add Sample**, **Reject Lot**, **Accept Lot**, **Create Issue**, **Change Document**; resizable drawing pane + characteristics grid; inspection plan selector | `Inspections/InspectionView.tsx` |
| Measurement grid | One column per scanned sample (serial lots) or anonymous samples; rows are characteristics with spec, gauge, n/Ac (sample/accept), result and per-cell pass/fail toggles; inline editable with keyboard navigation | `Inspections/InspectionMeasurementGrid.tsx` |
| Sample scanning | Scan or select a serial/batch sample; associates samples with the inspection | `Inspections/ScanInspectionSample.tsx` |
| Gauge picker & drawing | Measurement entry by gauge, plus drawing pane with feature callouts | `Inspections/InspectionGaugePicker.tsx`, `InspectionDrawingPane.tsx` |
| Reject lot | Modal to reject an inspection lot and choose disposition/reason | `Inspections/RejectLotModal.tsx` |
| Inspection plans / documents | Reusable inspection documents with characteristics and sampling rules | `ui/InspectionDocument/InspectionDocumentForm.tsx`, `InspectionDocumentEditor.tsx`, `SamplingRuleModal.tsx` |
| Receipt integration | Receipt documents panel lists every inspection raised by the receipt, with item and inspection status, linking to the inspection | `apps/erp/app/modules/inventory/ui/Receipts/ReceiptDocuments.tsx` |
| Quality issues | Issue records with severity, workflow, reviewers, associated items, required actions, supplier-return creation; useful when inspection fails | `ui/Issue/`, `ui/IssueWorkflows/`, `ui/RequiredActions/` |
| Gauges / calibration | Gauge master, gauge types, calibration records with status | `ui/Gauge/`, `ui/GaugeTypes/`, `ui/Calibrations/` |

### Odoo — quality control is a setting, but the addon is absent from this community checkout

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quality Control setting | Inventory settings expose `module_quality_control` ("Add quality checks to your transfer operations") and `module_quality_control_worksheet`, both marked as upgrade modules | `odoo/addons/stock/views/res_config_settings_views.xml` (setting `quality_control`) |
| **Absent** inspection screens | No `quality_control` / `quality` addon directory exists in this checkout; `stock` itself has no inspection model or form. The only quality-related location is the generated `wh_qc_stock_loc_id` (quality-control stock location) on the warehouse | verified by `ls odoo/addons \| grep quality` (none); warehouse technical tab in `stock_warehouse_views.xml` |
| Scrap | Closest in-stock disposition screen: scrap move form with product, quantity, source location, scrap reason tags, replenish flag, confirm | `odoo/addons/stock/views/stock_move_views.xml` (`view_scrap_move_form`, `view_scrap_move_list`, `menu_stock_scrap`) |

### Dolibarr / AureusERP / metasfresh — no inspection UI

| Reference | Finding | Evidence |
| --- | --- | --- |
| Dolibarr | No quality/inspection module or screen in the checkout; reception lines carry batch and sell-by/eat-by dates only. Disposition happens through stock movements/transfers. | `find htdocs -iname '*quality*' -o -iname '*inspection*'` returns nothing; `htdocs/reception/dispatch.php` line columns |
| AureusERP | The inventories plugin has quality-control stock locations/flags but no Quality Inspection resource, template or readings screen | `plugins/webkul/inventories/src/Filament/` has no Quality/Inspection class; `Warehouse.php`/seeders only reference QC locations |
| metasfresh | No inspection window in the checkout; quality handling is through HU attributes/status and backend windows, not a dedicated UI | `backend/de.metas.handlingunits.*` and `frontend/src/` have no inspection component |

**BOSS implications.** Inspection is the one Warehouse area where the reference set is uneven: ERPNext has the clean document model, Carbon has the best operator UI. BOSS should implement a small inspection record linked to `ShipmentItemSource` (receipt) and lot/serial, with a template of characteristics, sample size, readings, accepted/rejected quantity, disposition and an inspector/verifier. Keep it out of the base `Shipment` table: a failed inspection must be able to reject part of a line, put that quantity in a quarantine location, and still let the accepted quantity post. The receipt screen needs an inline "Inspect" action and a count of open inspections; the Quality app (or a Warehouse sub-screen) owns templates and plans. Mantle has no inspection entity today, so this is new data, but it can reuse `Request`/`WorkEffort` for the task and `FacilityLocation` for quarantine rather than inventing a parallel workflow engine.

---

## 5. Stock by location & availability

### Odoo — quants are the stock-by-location screen

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock by Location | Read-mostly quant list: product, location, lot/serial, package, owner, on-hand, available, reserved, UoM; filters **Internal Locations**, **Transit Locations**, **To Count**, **To Apply**, **Conflicts**, **Negative Stock**, date; group-by product/category/location/storage category/owner/lot/package/company; graph and pivot views | `odoo/addons/stock/views/stock_quant_views.xml` (`action_view_quants`, `quant_search_view`, `view_stock_quant_tree_simple`, `view_stock_quant_pivot`, `stock_quant_view_graph`) |
| Quant detail | Read-only form: product, location, lot/serial (required when tracked), package, owner, on-hand, available, reserved | `stock_quant_views.xml` (`view_stock_quant_form_editable`) |
| Physical inventory list | Editable quant list used for counting: location, storage category, product, package, lot/serial, owner, counted quantity (auto-apply), reserved, available, UoM, properties; **Relocate**, **History**, **Replenishment** row actions | `stock_quant_views.xml` (`view_stock_quant_tree_editable`) |
| Product stock | Product-level "Stock" action opening quants/pickings for that product | `odoo/addons/stock/views/product_views.xml` (`menu_product_stock`, `action_product_stock_view`) |
| Forecasted report | Client action rendering the forecasted on-hand timeline (incoming/outgoing) for a product/location | `odoo/addons/stock/views/stock_forecasted.xml` (`stock_forecasted_product_product_action`, `stock_forecasted_product_template_action`), `static/src/stock_forecasted/` |
| Availability on transfers | Per-move forecast widget and `products_availability` indicator on the picking header, showing available / expected / late | `stock_picking_views.xml` (`products_availability`, `forecast_widget`), `stock_move_views.xml` |

### ERPNext — Stock Balance, Stock Ledger, Quick Stock Balance and Bin

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock Balance | Script report over Stock Ledger Entry; filters company, warehouse, item, item group, date; columns opening qty/value, in/out qty/value, closing qty/value, valuation rate | `erpnext/stock/report/stock_balance/` |
| Stock Ledger | Script report listing every Stock Ledger Entry with item, warehouse, posting date, qty, valuation, voucher type/number | `erpnext/stock/report/stock_ledger/` |
| Quick Stock Balance | Page/dialog: warehouse + date + item (or barcode), shows item name/description/image, quantity and value; used by counter staff | `erpnext/stock/doctype/quick_stock_balance/quick_stock_balance.json`, `.js` |
| Stock Projected Qty | Report adding ordered, requested, planned, reserved and projected quantities to actual stock | `erpnext/stock/report/stock_projected_qty/` |
| Stock Analytics / Ageing | Pivot-style analytics and ageing reports over stock ledger/valuation | `erpnext/stock/report/stock_analytics/`, `stock_ageing/`, `warehouse_wise_stock_balance/`, `warehouse_wise_item_balance_age_and_value/` |
| Bin | The stored balance record behind most stock screens: warehouse, item, actual qty, reserved qty, ordered/indented/planned qty, projected qty, production/subcontract reservations, valuation rate/value, stock UoM, company | `erpnext/stock/doctype/bin/bin.json` |
| Item dashboard | Item form's stock/availability section and dashboard links into Stock Balance/Projected Qty | `erpnext/stock/doctype/item/`, `erpnext/stock/dashboard/` |

### Carbon — quantities table, item detail cards, activity feed

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quantities | Main stock list; tabs Quantities / Batch Quantities / Serial Quantities; on-hand, days remaining, usage, incoming/outgoing/on-order columns; filters by storage type/unit, material attributes, tags, active; **Recalculate** action | `apps/erp/app/modules/inventory/ui/Inventory/InventoryTable.tsx`, routes `inventory+/quantities.tsx` |
| Item inventory detail | Cards: Quantity on Hand, Days Remaining, Daily Usage, Quantity on Purchase Order (incoming), Quantity on Sales Order (outgoing), Quantity on Jobs (supply/demand); variant `quantity` used in pickers | `Inventory/InventoryDetails.tsx` |
| Inventory activity | Ledger feed per item, rendering human sentences ("received N units to <storage unit>", "shipped …", "transferred …", "adjusted …") with links to the source document; collapsed ledger rows | `Inventory/InventoryActivity.tsx`, `ledgerFeed.ts` |
| Stock Movements | Global movement table with correction action (manual adjustment), filters, export | `StockMovements/StockMovementsTable.tsx`, `StockMovements/StockMovementCorrectionModal.tsx`, route `inventory+/stock-movements.tsx` |
| Item quantities by storage | Per-item storage-unit breakdown with on-hand/reserved/available and drill-down | `Inventory/InventoryStorageUnits.tsx`, routes `inventory+/quantities+/$itemId.details.tsx`, `$itemId.activity.tsx`, `$itemId.adjustment.tsx` |
| Valuation workbench | Rows by item/location: costing method, qty on hand, on hold, rejected, UoM, unit cost, total value, % of total; as-of date; group by location/item; GL tie-out subledger vs GL vs variance with **Reconcile** action | `Valuation/InventoryValuationWorkbench.tsx` |

### AureusERP — one quantities table with inline on-hand editing

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quantities (Reporting) | Table: product, location, storage category, package, lot, on-hand (inline editable), reserved qty, UoM; filters warehouse/location/product category/storage category/package/package type/lot; group by product/category/location/storage category/lot/package/company; create/delete actions | `plugins/webkul/inventories/src/Filament/Clusters/Reporting/Resources/QuantityResource/Tables/QuantitiesTable.php` |
| Quantities (Operations) | Same data exposed as an operations resource for day-to-day quantity management | `.../Clusters/Operations/Resources/QuantityResource/` |
| Moves | Reporting move table: product, date, reference, lot, package, source/destination, quantity, UoM, state, done-by | `.../Clusters/Reporting/Resources/MoveResource/Tables/MovesTable.php` |
| Product quantities tab | Per-product quantities relation page | `.../Clusters/Products/Resources/ProductResource/Pages/ManageQuantities.php` |

### Dolibarr — product stock card, movement list, stock at date and warehouse valuation

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product stock card | Per-product, per-warehouse stock with stock limit/desired stock, correct-stock form, batch handling, movement history | `htdocs/product/stock/product.php` |
| Stock movement list | Full movement ledger: ref, date, product, label, batch, eat-by/sell-by, warehouse, author, inventory code, type, origin, qty, unit purchase value; configurable columns, filters and mass PDF generation | `htdocs/product/stock/movement_list.php` |
| Stock at date | Product/warehouse/date query showing current stock, stock at date, virtual stock at date, estimated value, movements since date; CSV export | `htdocs/product/stock/stockatdate.php` |
| Warehouse valuation | Warehouse card's valuation tab: number of products, estimated stock value, yearly valuation graph placeholder | `htdocs/product/stock/fiche-valo.php`, `htdocs/product/stock/valo.php` |
| Warehouse list | Stock per warehouse with status and product count | `htdocs/product/stock/list.php` |

### metasfresh — stock is a backend window plus mobile count

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Generic stock windows | Desktop stock/availability screens are metadata-defined windows rendered by the generic list/master shell; no dedicated React stock page | `frontend/src/containers/DocumentListContainer.js`, `MasterWindowContainer.js` |
| Mobile inventory count | Mobile app/REST workflow for inventory jobs: start from launcher params, fetch job lines, count HUs, post counts | `backend/de.metas.inventory.mobileui/.../{InventoryRestController,InventoryJobService,InventoryMobileApplication}.java`, `JsonInventoryJob*.java` |
| HU inventory view | Handling-unit inventory service returns product/storage/locator/attribute info for the mobile app | `backend/de.metas.handlingunits.mobileui/.../{HUProductStorages,HandlingUnitsService}.java` |

**BOSS implications.** There must be exactly one availability service and every screen must call it. Mantle already exposes `mantle.product.AssetServices.get#AvailableInventory`, `get#AvailableForOrder` and `get#AvailableInventoryMulti`; Warehouse's stock-by-location screen should be a grouped view over those results (facility → location → product → lot/serial), not a new `InventoryItem` table. The same service feeds the read-only availability panels in Sales, Customer Service and Purchasing, which is the shared-screen requirement in the design. Show on-hand, reserved, available and incoming as separate columns — Odoo/AureusERP/ERPNext all do, and collapsing them into one number is the most common warehouse-screen mistake. The location and lot drill-down from a quantity row should open the movement/ledger history (Carbon's activity sentences are the best presentation) rather than a read-only form with no context.

---

## 6. Counts, adjustments & reconciliation

### Odoo — physical inventory is an editable quant list plus three wizards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Physical Inventory | Editable list of quants (`js_class="inventory_report_list"`); header **Apply All**, **Apply**, **Clear**, **Request a Count**; row **History**; filters To Count / To Apply / Conflicts / Negative Stock; counted quantity and difference columns | `odoo/addons/stock/views/stock_quant_views.xml` (`action_view_inventory_tree`, `view_stock_quant_tree_editable`) |
| Apply quantities | Wizard asks for an adjustment name and counting date, then applies all counted quantities | `odoo/addons/stock/wizard/stock_inventory_adjustment_name.xml`, `.py` |
| Request a count | Assigns a counter user, inventory date, and whether to show expected quantity; creates counting tasks per quant | `odoo/addons/stock/wizard/stock_request_count.xml` |
| Conflict resolution | When stock moved between counting and applying: keep counted quantity, keep difference, or discard and resolve manually; lists affected quants with quantity/counted/difference | `odoo/addons/stock/wizard/stock_inventory_conflict.xml` |
| Warning / reset | Warnings for unapplied counts and lines that already have quantities set; reset-count confirmation | `odoo/addons/stock/wizard/stock_inventory_warning.xml`, `stock_inventory_warning_reset_view` |
| Cycle counting | Location form's **Cyclic Counting** group: inventory frequency in days, last/next inventory date; the quant search's **To Count** filter surfaces due locations | `odoo/addons/stock/views/stock_location_views.xml` (`view_location_form`) |
| Annual inventory | Inventory settings: annual inventory day/month, used to schedule the next physical inventory | `odoo/addons/stock/views/res_config_settings_views.xml` (setting `annual_inventory_date`) |
| Scrap | Scrap move form (product, qty, source location, reason tags, replenish flag) creates a done scrap move; scrap list and report | `odoo/addons/stock/views/stock_move_views.xml` (`view_scrap_move_form`, `view_scrap_move_list`, `menu_stock_scrap`), `report_stockinventory.xml` (count sheet) |
| Relocate | Wizard moving selected quants to another location, with optional package destination | `odoo/addons/stock/wizard/stock_quant_relocate.xml` |

### ERPNext — Stock Reconciliation, closing entries and repost tools

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock Reconciliation | Submittable document: company, purpose (**Opening Stock**, **Stock Reconciliation**, **Adjustment Entry**), posting date/time, items child, expense account/cost center, difference amount, scan barcode/scan mode, set warehouse, last scanned warehouse | `erpnext/stock/doctype/stock_reconciliation/stock_reconciliation.json`, `stock_reconciliation.js` |
| Reconciliation lines | Item, warehouse, new qty, stock UoM, valuation rate, amount, serial/batch bundle, current qty, current serial/batch, current valuation rate/amount, quantity difference, amount difference, allow-zero-valuation | `erpnext/stock/doctype/stock_reconciliation_item/stock_reconciliation_item.json` |
| Fetch items | Action **Fetch Items from Warehouse** populates lines from current stock for the selected warehouse | `stock_reconciliation.js` |
| Count sheet / barcode | Scan barcode mode and `has_item_scanned` flag support handheld-style counting into a reconciliation | `stock_reconciliation.json`, `stock_reconciliation_item.json` |
| Stock Closing Entry | Period closing document that freezes balances for a period | `erpnext/stock/doctype/stock_closing_entry/`, `stock_closing_balance/` |
| Repost Item Valuation | Tool to rebuild valuation/GL for stock ledger entries, with status and logs | `erpnext/stock/doctype/repost_item_valuation/`, `report/repost_item_valuation` |
| Stock Reposting Settings | Controls repost batch size/limits | `erpnext/stock/doctype/stock_reposting_settings/` |

### Carbon — a proper count document with blind counting and variance review

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory Counts list | Count ID, location, status, posted by/at, created by/at; delete action; **Inventory Count** create button | `apps/erp/app/modules/inventory/ui/InventoryCount/InventoryCountsTable.tsx`, route `inventory+/inventory-count.tsx` |
| New count | Location, optional storage unit, optional item type, **Blind Count** toggle, notes | `InventoryCount/InventoryCountForm.tsx` |
| Count detail | Status badge; **Confirm** (Draft → Pending), **Post** (Pending → Posted), **Reopen** (Pending → Draft); notes modal; record hero with location; lines table | `InventoryCount/InventoryCount.tsx`, routes `inventory-count+/$id.tsx`, `$id.confirm.tsx`, `$id.post.tsx`, `$id.reopen.tsx` |
| Count lines | Item, readable batch/serial, item type, storage unit/type, material attributes, tags, **System Qty**, **Counted Qty**, **Variance**; filters **In stock only** / **Variance only**; inline counted-quantity editing in Draft | `InventoryCount/InventoryCountLines.tsx` |
| Blind count | System quantity and variance are withheld until the count is Posted; filtering also removes those columns so the counter cannot derive the expected quantity | `InventoryCount/InventoryCount.tsx` lines ~98–120 |
| Confirm dialog | Shows recalculated lines/warnings and asks for confirmation before moving to Pending | `InventoryCount/InventoryCountConfirmModal.tsx` |
| Posting | Post turns variances into inventory adjustments; lines that cannot post are marked/toasted; history shows adjustments the count posted | route `$id.post.tsx`, `InventoryCount.tsx` |
| Manual adjustment | Stock Movements correction modal posts a positive/negative adjustment; negative adjustment refuses insufficient quantity | `StockMovements/StockMovementCorrectionModal.tsx`, route `x+/adjustment.tsx` |

### AureusERP — no count document; quantity edits are the adjustment

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quantity inline edit | **On Hand** is an inline `TextInputColumn`; changing it writes `quantity` and `inventory_diff_quantity` and emits a success notification; there is no separate count/reconciliation document or variance-review screen | `.../Reporting/Resources/QuantityResource/Tables/QuantitiesTable.php` lines ~80–100 |
| Replenishment | Resource exists but is a stub in this checkout (empty form/table configuration) | `.../Operations/Resources/ReplenishmentResource/Schemas/ReplenishmentForm.php`, `Tables/ReplenishmentsTable.php` |
| Scrap | Scrap resource form with product, qty, UoM, lot, tags, package, partner, source/destination location, origin, company | `.../Operations/Resources/ScrapResource/Schemas/ScrapForm.php` |

### Dolibarr — full inventory document from draft to movement posting

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory list | Inventories with ref/title, warehouse, status, dates, lines; create/clone/delete | `htdocs/product/inventory/list.php`, `card.php` |
| New inventory | Title, warehouse, date, inventory code, status, include-sub-warehouse option | `htdocs/product/inventory/card.php` (create block) |
| Validate/start | Validate dialog with start mode (current stock / zero / none), include sub-warehouses | `htdocs/product/inventory/card.php` (validate block) |
| Inventory sheet | Editable lines: warehouse, product, batch, expected qty (current stock and stock at validation), real qty, stock movement; **Add** line, **Save**, **Clear Qtys**, **Update by scanning**, pagination; "Make Movements and Close" posts differences and closes | `htdocs/product/inventory/inventory.php` |
| Status flow | Draft → validated (counting) → closed; cancel/reopen actions | `htdocs/product/inventory/card.php`, `inventory.php` |
| Correct stock | Product/warehouse correct-stock form creating a manual movement with label, date, qty, batch/serial | `htdocs/product/stock/product.php` (`correct_stock`) |
| Mass movement | Batch entry/CSV import of paired source/target warehouse movements | `htdocs/product/stock/massstockmove.php` |

### metasfresh — mobile inventory jobs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory mobile app | Workflow launcher + count job: start inventory count, fetch next eligible line, scan HU/locator, submit counted qty, complete job | `backend/de.metas.inventory.mobileui/.../{InventoryMobileApplication,InventoryRestController,InventoryJobService,InventoryWorkflowLaunchersProvider}.java`, `JsonCountRequest.java`, `JsonCountStatus.java` |
| HU lookup | Scan a QR code / HU and return its product/storages/attributes for counting | `backend/de.metas.handlingunits.mobileui/.../{JsonGetHUInfoByScannedCodeRequest,JsonGetByQRCodeRequest,JsonResolveHUResponse}.java` |

**BOSS implications.** Counts need their own document even though the result is an adjustment. Mantle already has `PhysicalInventory` and `PhysicalInventoryCount` (`physicalInventoryDate`, facility, status `PIInPlanning`, location sequence, product, lot, quantity on hand) plus `AssetServices.record#PhysicalInventoryQuantity` and `record#PhysicalInventoryChange`; use those rather than editing stock inline. Copy Carbon's flow because it is the only reference that separates counting from posting cleanly: Draft (count entry, with a blind-count option) → Pending (review) → Posted (variance becomes auditable asset quantity changes). Odoo's conflict-resolution dialog is essential when stock moves during a count; without it a count silently overwrites receipts/shipments that happened mid-count. Adjustments outside a count need a reason code and an audit trail; Odoo scrap reasons, ERPNext reconciliation purpose, and Carbon's ledger feed all point the same way. AureusERP's inline on-hand edit is a useful manager shortcut only if it writes the same audit record as a count.

---

## 7. Picking

### Odoo — picking is an outgoing transfer; waves are batch transfers

Odoo has no separate "pick list" model. A delivery operation type can be configured as one, two or three steps (ship / pick+ship / pick+pack+ship), and each step is a transfer. Grouping work is done with **batch transfers** (waves).

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Delivery transfers | `stock.picking` list/form filtered to outgoing operation types; **Reserve**, **Validate**, **Print**, **Return/Exchange**, **Put in Pack**, detailed moves; availability column and late/backorder filters | `odoo/addons/stock/views/stock_picking_views.xml` |
| Batch transfer list/card | One record per wave/batch: name, description, scheduled date, responsible user, operation type, priority, state, transfer count; list, kanban, card and calendar views | `odoo/addons/stock/views/stock_picking_batch_views.xml` |
| Batch transfer form | Confirm / Reserve / Validate / Print / Print Labels / Cancel; button box for Packages, Moves, Allocation; Operations and Transfers tabs; **Put in Pack** | `stock_picking_batch_views.xml` (`stock_picking_batch_form`) |
| Prepare batch | Operation-type card menu action opens batch creation for that type; wizard selects transfers | `stock_picking_type_views.xml` (`action_batch`), `odoo/addons/stock/wizard/stock_picking_to_batch_views.xml` |
| Add to wave | Wizard adding selected transfers to an existing wave | `odoo/addons/stock/wizard/stock_add_to_wave_views.xml` |
| Batch configuration | Operation type: batch creation manual/automatic, max transfers/lines, group by contact/product/category/destination/source/date; auto-confirm | `stock_picking_type_views.xml` (`view_picking_type_form`, Batch Transfers group) |
| Allocation report | Report view opened from a transfer/operation type: product lines with Available / Quantity / Assigned / For / Date and **Assign All**, **Print**, **Print Labels**; mobile template | `odoo/addons/stock/static/src/allocation_report/allocation_report.xml`, `allocation_report.js`, `report/stock_allocation_report.py`, `report_stockpicking_operations.xml` |
| Picking operations sheet | Printable picking list grouped by location with quantities and lots; auto-print option on validation | `odoo/addons/stock/report/picking_templates.xml`, `report_stockpicking_operations.xml`; operation type "Print on Validation" group |

### ERPNext — Pick List is a real document with reserve/unreserve and scan modes

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Pick List list/form | Submittable document; list columns company/customer; form fields company, parent warehouse, customer, work order, locations child, for-qty, purpose (**Material Transfer for Manufacture**, **Material Transfer**, **Delivery**), material request, group-same-items, scan barcode, scan mode, prompt qty, status, consider-rejected-warehouses, pick-manually, delivery status/per-delivered | `erpnext/stock/doctype/pick_list/pick_list.json`, `pick_list.js` |
| Pick-list lines | Item, qty, picked qty, warehouse, stock qty, serial/batch bundle, pick serial/batch, stock reserved qty, delivered/transferred qty, actual qty, company total stock | `erpnext/stock/doctype/pick_list_item/pick_list_item.json` |
| Pick-list actions | **Stock Availability**, **Update Current Stock**, **Get Items**, **Reserve**, **Unreserve**, **Reserved Stock**, and create **Delivery Note**, **Sales Invoice**, **Stock Entry**, **Stock Reservation** depending on purpose/status | `pick_list.js` (`add_custom_button` labels) |
| Statuses | Draft → Open → Partly Delivered / Partially Transferred → Completed → Cancelled | `pick_list.json` |
| Scan modes | Header barcode input plus `scan_mode`/`prompt_qty`; line `has_item_scanned`; stock availability dialog shows stock held by location/warehouse | `pick_list.js`, `pick_list.json` |
| Stock Reservation Entry | Reservation record behind "Reserve" with reserved/delivered/consumed/transferred qty and serial/batch entries | `erpnext/stock/doctype/stock_reservation_entry/stock_reservation_entry.json` |

### Carbon — Picking Lists are first-class, with a mobile picker in MES

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Picking Lists list | Table + schedule/kanban views; filters; create; status filter; assignee; due date; location | `apps/erp/app/modules/inventory/ui/PickingLists/PickingListsTable.tsx`, `PickingListsHeader.tsx`, routes `picking-list+/` |
| Picking list detail | Header: picking-list ID, status, created-by/due/at-location meta, assignee, **Start** (Draft → In Progress), **Finish** (In Progress → Completed), reopen/cancel/delete menu; finish with unpicked material asks for acknowledgement | `PickingLists/PickingListHeader.tsx` |
| Picking lines | Progress "N% picked"; per line: item, to-pick quantity, picked quantity, lots/tracked entities, buttons **Pick**, **Short**, **Scan**, **Unpick**, status Short/Pending/Picked/Cancelled; pickers clamp quantity to outstanding | `PickingLists/PickingListLines.tsx`, `ShortPickModal.tsx`, route `picking-list+/$pickingListId.line.quantity.tsx` |
| Batch picking board | Kanban of operations that require picking at a location; item cards show parts to pick, complete/reworked/scrapped quantities | `PickingLists/PickingKanban.tsx`, `PickingItemCard.tsx` |
| Statuses | Draft → In Progress → Completed / Partial / Cancelled; line Pending / Picked / Short / Cancelled; locked after Completed/Partial/Cancelled | `apps/erp/app/modules/inventory/inventory.models.ts` (`pickingListStatusType`, `pickingListLineStatusType`, `isPickingListLocked`) |
| MES picking queue | Mobile-first queue of assigned picking lists (location, due date, progress); detail with Start/Finish, line scan/pick/short, **Finish with material unpicked?** acknowledgement | `apps/mes/app/routes/x+/picking._index.tsx`, `x+/picking.$pickingListId.tsx`, `apps/mes/app/components/ShortPickModal.tsx`, `PickingListStatus.tsx` |

### Dolibarr — pick/pack happens inside the shipment document

| Screen/page | What it is | Key files |
| --- | --- | --- |
| New shipment | Created from a customer order (or standalone): third party, project, shipping date, planned delivery date, weight/volume/dimensions, delivery method, tracking number, incoterm, document model, notes | `htdocs/expedition/card.php` (creation block) |
| Shipment card | Tabs: Card, Shipment Distribution (while draft), Contacts/Addresses, Documents, Notes, Events; validate/cancel; status draft → validated → closed | `htdocs/expedition/card.php`, `htdocs/core/lib/sendings.lib.php` (`shipping_prepare_head`) |
| Distribution tab | Per-order-line: description, qty ordered, qty already shipped, qty to ship, warehouse + stock, batch/serial, stock entry date; **Autofill**, **Reset**, line-level warnings for low stock/batch allocation | `htdocs/expedition/dispatch.php`, `card.php` lines ~1900–2550 |
| Add lines/orders | Add order lines or whole orders to an existing shipment; service lines handled separately | `htdocs/expedition/card.php` (add line/order actions) |
| Shipment list | Searchable list with ref, third party, dates, status, totals | `htdocs/expedition/list.php` |

### AureusERP — DeliveryResource shares the operation form

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Deliveries | `DeliveryResource` list/form over outgoing operations; same columns/actions as receipts (check availability, todo, validate, cancel, return, next transfer, print delivery slip/labels/picking operation) | `plugins/webkul/inventories/src/Filament/Clusters/Operations/Resources/DeliveryResource/`, `Actions/` |
| Moves | Operations tab move repeater with demand/done, UoM, picked, lot/serial generation, detailed lines | `OperationResource/Schemas/OperationForm.php` |
| Check availability | Action validates stock/reservations for the operation before picking | `Actions/CheckAvailabilityAction.php` |
| Dropship | Separate `DropshipResource` for supplier-direct flows (no warehouse pick) | `.../DropshipResource/` |

### metasfresh — mobile picking workflow over picking jobs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Picking mobile app | Workflow launcher starts a picking job; REST endpoints fetch next eligible line, available targets, pick-from HUs/locators, unpick/alternative pick, close line, complete job | `backend/de.metas.picking.rest-api/.../{PickingMobileApplication,PickingRestController,PickingJobRestService,PickingWorkflowLaunchersProvider}.java`, `JsonPickingJob*.java`, `JsonPickFrom*.java` |
| Picking step events | Records each pick/unpick/close event for audit and workflow progress | `JsonPickingStepEvent.java`, `JsonPickingEventsList.java`, `PickingWFActivityHelper.java` |
| Desktop pick lists | No dedicated React pick-list screen; picking windows are backend-defined and rendered through the generic shell | `frontend/src/containers/DocumentListContainer.js` |

### Moqui Sales — order source only, no picking screen

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Find Order | Order list/search for the Sales app; the order is the source document Warehouse would fulfill, but the screen has no pick/pack/ship action | `screen/Sales/Order/FindOrder.xml`, `FindOrder.qvue`, `screen/Sales/Order.xml` |
| View Order | Order detail with header/items; no fulfillment queue, reservation view or shipment creation in the checkout | `screen/Sales/Order/ViewOrder.xml`, `ViewOrder.qvue` |
| **Absent** warehouse UI | The Moqui Sales component ships accounts, contacts, opportunities, orders and agreements only; no stock/shipment/pick screens | verified by `find 3p_moqui/Sales/screen -type f` (no shipment/inventory directory) |

**BOSS implications.** Picking is a new screen family; the only Moqui reference is the order detail that supplies the lines. Keep the order → shipment seam explicit: a Warehouse picking screen is opened with `orderId` (or a shipment created from the order), and the same `View Order` screen gains a Warehouse action set when the app/role is Warehouse. Treat picking as a task on an outbound `Shipment`, not as a second stock document. The minimum viable screen is Carbon's: a picking list with start/finish, a per-line "to pick / picked / short" state, scan-or-select for lots/serials, and an explicit acknowledgement when finishing with unpicked material. Add Odoo's wave/batch grouping as an optional layer: a batch is a header over several shipments, with assignee, route/step, and a printable pick sheet. ERPNext's reserve/unreserve and reservation record are worth copying because they answer the question every picker asks ("is it actually mine?"). The mobile view must be a separate route/layout, not a shrunken desktop table: Carbon's MES queue is the best reference. On Mantle, `ShipmentServices.pickMove#ShipmentProduct`, `pack#ShipmentProductScan` and `get#ShipmentProductByScan` already implement the core, so the BOSS work is the queue, the line state machine and the scan interaction.

---

## 8. Packing, shipping & carriers

### Odoo — packages, package types, delivery slips and carrier connectors

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Package form | Name, package type, owner, location, parent package, company, pack date; contents quant list (product, package, lot, qty, UoM); **Unpack**; link to the transfer | `odoo/addons/stock/views/stock_package_views.xml` (`stock_package_view_form`) |
| Package list / editable list | Package name, parent/container, type, location, company; editable list can **Put in Pack** / **Remove** and move a package to a destination package/location | `stock_package_views.xml` (`stock_package_view_list`, `stock_package_view_list_editable`, `stock_package_view_kanban`) |
| Package types | Name, barcode, sequence, routes, company; Dimensions tab (length × width × height, base weight, max weight); Capacity tab by storage category | `odoo/addons/stock/views/stock_package_type_view.xml` (`stock_package_type_form`) |
| Put in Pack | Wizard from a transfer: package type, capacity per package + UoM, existing/new destination package; puts selected move lines into packages and can auto-print labels | `odoo/addons/stock/wizard/stock_put_in_pack_views.xml` |
| Delivery slip / package reports | Delivery Slip, Picking Operations, Packages (with contents), package barcode (PDF/ZPL), lot/serial barcode, location barcode | `odoo/addons/stock/report/{report_deliveryslip,report_stockpicking_operations,report_picking_batch,report_package_barcode,report_lot_barcode,report_location_barcode}.xml` |
| Batch transfer print | Batch picking report | `odoo/addons/stock/report/report_picking_batch.xml` |
| Carrier / delivery method | Delivery method form: name, provider type (`delivery_type`), integration level, company, currency, fixed price/margin/free-over, product, tracking URL, invoice policy, shipping insurance, price rules, availability by country/state/zip/weight/volume/tags, customer description; prod/debug toggles; "Install more Providers" | `odoo/addons/delivery/views/delivery_carrier_views.xml` (`view_delivery_carrier_form`) |
| Delivery price rules / zip prefixes | Price-rule list/form and zip-prefix list for rule-based carriers | `odoo/addons/delivery/views/delivery_price_rule_views.xml`, `delivery_zip_prefix_views.xml` |
| Delivery signature | Signature widget on a done outgoing transfer and a signed flag in the transfer list | `stock_picking_views.xml` (`signature` widget, `is_signed`) |
| Batch validation | Batch form `Validate` finalizes all contained transfers, with optional label printing | `stock_picking_batch_views.xml` |

### ERPNext — Packing Slip, Shipment, Delivery Trip, Shipping Rule

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Packing Slip | Submittable document linked to a Delivery Note: from/to case numbers, items child (item, batch, qty, net weight, page break), net/gross weight + UoM, letter head; print format | `erpnext/stock/doctype/packing_slip/packing_slip.json`, `packing_slip_item.json` |
| Shipment | Shipment document: pickup from (company/customer/supplier + address/contact), delivery to (same), shipment parcels/pallets, value of goods, pickup date/type, shipment type, service provider, carrier, carrier service, AWB number, shipment ID/amount, tracking URL/status/info, incoterm; statuses Draft → Submitted → Booked → Completed / Cancelled | `erpnext/stock/doctype/shipment/shipment.json`, `shipment_delivery_note.json`, `shipment_parcel.json`, `shipment.js` |
| Shipment parcel templates | Reusable parcel dimensions/weight | `erpnext/stock/doctype/shipment_parcel_template/` |
| Delivery Trip | Vehicle/driver run: driver, vehicle, departure time, delivery stops child (customer, address, delivery note, visited, distance, estimated arrival, lat/lng), optimize route, calculate arrival times, notify customers, create delivery notes | `erpnext/stock/doctype/delivery_trip/delivery_trip.json`, `delivery_stop.json`, `delivery_trip.js` |
| Shipping Rule | Account/cost-center based shipping calculation: rule type, calculate based on, shipping amount, conditions, countries, project | `erpnext/accounts/doctype/shipping_rule/shipping_rule.json` |
| Delivery Settings | Dispatch template/attachment, send-with-attachment, stop delay | `erpnext/stock/doctype/delivery_settings/delivery_settings.json` |
| Print formats | Delivery Note bordered/classic/modern/with images, Pick List, Purchase Receipt serial/batch | `erpnext/stock/print_format/` |

### Carbon — Shipments with source-document types and a hard posting gate

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Shipments list | Shipment ID, source document + readable ID, status, invoiced, posted by/date, assignee, customer, external ref, created/updated; **Add Shipment** | `apps/erp/app/modules/inventory/ui/Shipments/ShipmentsTable.tsx`, routes `shipment+/` |
| Shipment detail | Header status, meta, assignee, **Post**/**Void**/delete, print/invoice; lines with serial numbers, tracking, fixed assets, rental units; documents rail | `Shipments/ShipmentHeader.tsx`, `ShipmentLines.tsx`, `ShipmentDocuments.tsx`, `ShipmentPostModal.tsx`, `ShipmentVoidModal.tsx` |
| Source documents | Sales Order, Sales Return Order, Purchase Order, Purchase Return Order, Outbound Transfer, Rental Agreement; the source document drives which lines/quantities can ship | `inventory.models.ts` (`shipmentSourceDocumentType`), `ShipmentForm/` |
| Posting gate | Post modal blocks on missing track quantities and **expired batches** (`expiredErrors` block, `expiredWarnings` warn); rule violations modal may also block | `Shipments/ShipmentPostModal.tsx` |
| Shipping Methods | Name, carrier, carrier account, tracking URL; CRUD list/form | `ShippingMethods/ShippingMethodForm.tsx`, `ShippingMethodsTable.tsx`, routes `inventory+/shipping-methods*` |
| Shipment statuses | Draft → Pending → Posted / Voided | `inventory.models.ts` (`shipmentStatusType`) |
| Tracking | Shipment lines carry tracked entities; traceability view links them to receipts, shipments, jobs and adjustments | `Traceability/`, `ShipmentLines.tsx` |

### Dolibarr — shipment document with tracking and delivery method

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Shipment card | Third party, project, shipping/delivery dates, weight, dimensions, delivery method, tracking number, incoterm, notes; validate/close; linked delivery receipt when the delivery submodule is enabled | `htdocs/expedition/card.php`, `htdocs/core/lib/sendings.lib.php` |
| Shipment distribution | Pick quantities per order line/warehouse/batch; autofill/reset; stock warnings | `htdocs/expedition/dispatch.php` |
| Shipment document | PDF generation from configurable model; email/agenda/notes/contacts tabs | `htdocs/expedition/document.php`, `agenda.php`, `note.php`, `contact.php`; `htdocs/admin/expedition.php` |
| Barcode helpers | Shipment barcode search and print sheets | `htdocs/expedition/ajax/searchfrombarcode.php`, `htdocs/barcode/printsheet.php` |
| Delivery receipt | Separate delivery document when `MAIN_SUBMODULE_DELIVERY` is enabled, linked from the shipment | `htdocs/delivery/`, `expedition_prepare_head` in `core/lib/expedition.lib.php` |

### AureusERP — print actions rather than carrier connectors

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Delivery labels/documents | Actions: Delivery Slip, Labels, Package, Picking Operation, Return Slip; each opens a print/PDF flow from an operation | `.../Operations/Actions/Print/{DeliverySlipAction,LabelsAction,PackageAction,PickingOperationAction,ReturnSlipAction}.php` |
| Operation form | Shipping policy (direct vs. all-at-once), scheduled at, source document, responsible user; moves with packages | `OperationResource/Schemas/OperationForm.php` |
| **Absent** | No carrier rate/label integration or tracking-number screen in the inventories plugin; carrier logic would live outside this module | `plugins/webkul/inventories/src/Filament/` has no Carrier/DeliveryMethod resource |

### metasfresh — delivery planning and HU carrier advice

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Delivery planning | Backend window (no dedicated React page); document-list header sums planned/actual load and discharge quantities per UoM across selected rows | `frontend/src/components/deliveryPlanning/DeliveryPlanningViewHeader.js`, `OIViewHeader.js` |
| Carrier advice | Service that computes/returns carrier advice for packed HUs (used by the delivery process, not a standalone screen) | `backend/de.metas.picking.rest-api/.../PackedHUCarrierAdviseService.java` |
| HU label printing | Mobile/desktop actions to print HU labels (PDF/ZPL) through the HU manager | `backend/de.metas.handlingunits.mobileui/.../{JsonPrintHULabelRequest,JsonPrintHULabelResponse,JsonMassPrintingScanRequest}.java`, `HUManagerRestController.java` |

**BOSS implications.** Packing and shipping must be separate verbs on the same outbound shipment: packing assigns items to packages and captures weight/dimensions; shipping assigns a carrier/service, produces labels/tracking, and posts the stock movement. Odoo's package model (package + type + contents + parent package) and ERPNext's shipment/trip model together cover the ground: package-level contents are needed for multi-box orders, and a delivery trip is needed when one vehicle carries several shipments. Carrier integration should be a provider interface with fixed-price/rule-based fallbacks (Odoo's `delivery.carrier`), because most small businesses start with flat rates and only later add live rates. Mantle already has `ShipmentPackage`, `ShipmentPackageContent`, `CarrierShipmentMethod`, `ShipmentRouteSegment`, `ShippingGateway*`, and `ShipmentServices.print#ShipmentLabels` / `track#ShipmentLabels`; BOSS should surface those rather than reimplementing rating. The posting gate (Carbon) is non-negotiable: expired or untracked goods must block shipment, not warn after the truck leaves.

---

## 9. Returns receiving

### Odoo — Return creates a new draft transfer, Exchange replaces it

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Return | Button on a done transfer; creates a new picking linked to the original, with quantities returned and `origin_returned_move_id` set; opens the new draft transfer for review/edit | `odoo/addons/stock/models/stock_picking.py` (`action_return`, `_create_return`), `stock_picking_views.xml` |
| Return All / Clear | On a draft return, fills every line with the original done quantity or zeroes them | `stock_picking.py` (`action_return_all`, `action_clear_return`), `stock_picking_views.xml` |
| Exchange | Creates a replacement transfer with the original links cleared, confirms and reserves it | `stock_picking.py` (`action_exchange`) |
| Returns stat button | Original transfer shows a Returns count linking to all returns | `stock_picking_views.xml` (`action_see_returns`, `return_count`) |
| Return slip | Printable return document | `odoo/addons/stock/report/report_return_slip.xml` |
| Returned picking list | A return is a normal transfer, so it appears in receiving/shipping lists with origin and backorder links | `stock_picking_views.xml` |

### ERPNext — `is_return` + `return_against` on the same doctypes

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Purchase Return | Purchase Receipt with `is_return` set and `return_against` pointing at the original; statuses Return / Return Issued; debits the supplier | `erpnext/stock/doctype/purchase_receipt/purchase_receipt.json`, `purchase_receipt.js` |
| Sales Return | Delivery Note with `is_return` set and `return_against`; statuses Return / Return Issued; feeds a credit note | `erpnext/stock/doctype/delivery_note/delivery_note.json`, `delivery_note.js` |
| Return creation | Actions **Purchase Return** / **Sales Return** create the return document from the original; rejected quantities can feed a purchase return against the rejected warehouse | `purchase_receipt.js`, `delivery_note.js` (`make_purchase_return_against_rejected_warehouse`) |
| Returns receiving | A purchase return is an outbound movement to the supplier; a sales return is an inbound receipt at a warehouse. The same Quality Inspection / rejected-warehouse logic applies | `purchase_receipt.py`, `delivery_note.py`, `quality_inspection.json` |
| Return trends | Purchase Receipt / Delivery Note trend charts include returns | `erpnext/stock/dashboard_chart/purchase_receipt_trends/`, `delivery_trends/` |

### Carbon — return source documents on both receipts and shipments

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sales return receiving | New receipt with source document **Sales Return Order**; supplier fields are hidden and the customer is resolved from the return order; lines can be tracked/serialized and inspected | `Receipts/ReceiptForm/useReceiptForm.tsx`, `Receipts/ReceiptDocuments.tsx`, `inventory.models.ts` (`receiptSourceDocumentType`) |
| Purchase return shipping | New shipment with source document **Purchase Return Order**; moves stock out to the supplier | `ShipmentForm/`, `inventory.models.ts` (`shipmentSourceDocumentType`) |
| Per-entity return | On a sales-return receipt, `ReturnEntityForm` selects which shipped serial/batch entities arrived; it re-tags the existing entity rather than creating a new one | `Receipts/ReturnEntityForm.tsx`, route `receipt+/lines.return-entities.tsx` |
| Returned lot handling | Returned tracked entities are received into the chosen location through the same line/tracking flow; a failed inspection can reject the lot | `ReceiptLines.tsx`, `ReceiptPostModal.tsx`, `quality/ui/Inspections/` |
| Return source documents | Source-document selectors include Purchase Return Order, Sales Return Order, Inbound/Outbound Transfer and Rental Agreement | `inventory.models.ts` |

### AureusERP — return modal on a done operation

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Return action | Visible on DONE operations; modal lists returnable moves (product, original qty, return qty, UoM), rejects empty returns and excess quantities with a warning; creates a new return operation and redirects to its edit form | `plugins/webkul/inventories/src/Filament/Clusters/Operations/Actions/ReturnAction.php` |
| Return slip print | `ReturnSlipAction` is registered but its action body is empty in this checkout — no actual print implementation | `.../Actions/Print/ReturnSlipAction.php` |
| Return operation | The created return is a normal operation (incoming or outgoing depending on the original); it uses the same moves/validate flow | `ReturnAction.php` (`Inventory::createReturn`) |

### Dolibarr — no dedicated returns-receiving document

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** returns document | `expedition/` and `reception/` have no return/customer-return document or return-against link in this checkout; returns are handled with credit notes and manual/negative stock movements | verified by directory and `grep -ril return htdocs/expedition htdocs/reception` (only normal shipment/reception code) |
| Correct stock | Negative/positive manual movement is the fallback for putting returned goods back | `htdocs/product/stock/product.php` (`correct_stock`), `massstockmove.php` |

**BOSS implications.** Returns receiving is the same receipt screen with a return source document and a return-against link; do not build a separate "RMA receiving" form. The important differences are: the party is a customer (not a supplier), the expected quantity is bounded by what was shipped, and the disposition (restock / quarantine / scrap) must be captured per line. ERPNext's rejected warehouse is a good model for separating good from bad returns; Carbon's per-entity return is the right granularity for serialized goods. Mantle has `Shipment`, `ShipmentItem`, `ShipmentItemSource` and `AssetReceipt`/`AssetIssuance`, plus shipment return tests (`test/ShipmentReturnMisc.spec.js`), so a return can be a `Shipment` with a return type and references rather than new tables. The return must be visible from the original shipment/order (a Returns stat button), which is the shared Order detail face.

---

## 10. Lots, serials, packages & traceability

### Odoo — lot/serial records with stat buttons, package hierarchy and traceability report

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Lot/Serial form | Name, product, reference, company, customers, inventory group (quantity, UoM, location), properties, note; stat buttons **Transfers**, **Locations**, **Traceability**, **Scrap** | `odoo/addons/stock/views/stock_lot_views.xml` (`view_production_lot_form`) |
| Lot/Serial list/kanban | Name, product, reference, create date, company, transfer-to partners, activities, properties, quantity; kanban card with product and activity | `stock_lot_views.xml` (`view_production_lot_tree`, `view_production_lot_kanban`) |
| Lot/serial search | Filters by lot/serial number, customer, product, properties, create date; actions to print lot/serial barcode (PDF/ZPL) | `stock_lot_views.xml` (`search_product_lot_filter`, `action_print_lot_label_pdf/zpl`) |
| Package form/list | Package name, type, owner, location, parent container, pack date, contents (product/lot/qty/UoM); **Unpack**; link to transfer; editable list **Put in Pack**/**Remove**; kanban | `stock_package_views.xml` (`stock_package_view_form`, `stock_package_view_list*`, `stock_package_view_kanban`) |
| Package history | History record per package movement; barcode-with-contents reports | `stock_package_history_views.xml`, `report_package_barcode.xml` |
| Traceability report | Transient report walking parent/child move lines for a lot/serial, transfer or move line; returns nodes/levels for the report UI | `odoo/addons/stock/report/stock_traceability.py`, `report_stock_traceability.xml` |
| Expiry | Optional `product_expiry` module adds best-before/removal/end-of-life/alert dates to lots; print/alert settings in Inventory settings | `odoo/addons/product_expiry/`, `res_config_settings_views.xml` (setting `expiration_dates_serial_numbers`) |
| Traceability on transfers | Transfer stat button and lot stat buttons open the same traceability report | `stock_picking_views.xml` (`Traceability` button), `stock_lot_views.xml` |

### ERPNext — Batch, Serial No, Serial and Batch Bundle

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Batch | Batch ID, item, parent batch, manufacturing date, expiry date, supplier, reference doctype/name, description, batch qty/UoM, qty to produce/produced qty, batch-wise valuation, allow-negative-stock; list/kanban search | `erpnext/stock/doctype/batch/batch.json`, `.js` |
| Serial No | Serial number, item, description, item group/brand, asset + status, location, employee, maintenance status, warranty period/expiry, AMC expiry, company, work order, warehouse, batch, purchase rate, status, customer, reference doctype/name, posting date | `erpnext/stock/doctype/serial_no/serial_no.json`, `.js` |
| Serial and Batch Bundle | Submittable bundle linking a voucher line to serial/batch entries with quantities/directions; used by Stock Entry, Purchase Receipt, Delivery Note, Pick List, Stock Reconciliation | `erpnext/stock/doctype/serial_and_batch_bundle/`, `serial_and_batch_entry/` |
| Traceability reports | Serial No and Batch Traceability, Serial and Batch Summary, Serial No Ledger, Batch-Wise Balance History, Available Batch/Serial, Batch Item Expiry Status, Serial No Status/Warranty/Service Contract Expiry, Negative Batch | `erpnext/stock/report/{serial_no_and_batch_traceability,serial_and_batch_summary,serial_no_ledger,batch_wise_balance_history,available_batch_report,available_serial_no,batch_item_expiry_status,serial_no_status,serial_no_warranty_expiry,serial_no_service_contract_expiry,negative_batch_report}/` |
| Reservation by serial/batch | Pick List/Stock Reservation Entry can pick/reserve specific serial/batch bundles; settings control auto-reserve and selection policy | `erpnext/stock/doctype/stock_settings/stock_settings.json`, `pick_list_item.json` |

### Carbon — tracked entities, expiry policy, and a lineage graph

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Tracked entities list | Searchable list of serials/batches with status, item, source document, expiry; actions to edit expiry | `apps/erp/app/modules/inventory/ui/Traceability/TrackedEntitiesTable.tsx`, route `inventory+/tracked-entities.tsx`, `tracked-entity.expiry.tsx` |
| Traceability graph | Node/edge graph of receipt, production, shipment, transfer, adjustment, split, return and scrap events; toolbar: search nodes, hop depth, top-down/left-right layout, isolate lineage, fit/re-layout, spacing; table view; legend (normal flow, selection path, reject branch, cycle back-edge, serial group) | `Traceability/` (`TraceabilityGraph*`, `GraphToolbar.tsx`, `GraphLegend.tsx`, `NodeSearchDialog.tsx`, `edges/`, `nodes/`) |
| Batch properties | Configurable per-item batch properties (text/number/date/list) shown on receipt/shipment lines and stored on tracked entities | `Batches/BatchPropertiesConfig.tsx`, `BatchPropertiesFields.tsx`, `apps/erp/app/modules/inventory/inventory.models.ts` (`batchPropertyValidator`) |
| Expiry trace | Popover explaining how a final expiry date was derived: split from another batch, goods receipt, production output, manual adjustment, policy mode, manual override reason, final date | `Traceability/ExpiryTracePopover.tsx`, `EditExpiryModal.tsx` |
| Shelf-life policy | Company settings: near-expiry warning days, expired entity policy (Warn / Block / BlockWithOverride); receipt/shipment post modals enforce it | `inventory.models.ts`, `ReceiptPostModal.tsx`, `ShipmentPostModal.tsx`, `settings.service.ts` |
| Serial selection | `TrackedEntityPicker` for scan-or-select of serial/batch with quantity clamping; shared by receipts, shipments, transfers and picking | `packages/react/src/TrackedEntityPicker.tsx` (used in receipt/shipment/stock-transfer scan routes) |
| Labels | ZPL/PDF label printing for entities, operations, storage units and packages | `apps/mes/app/routes/file+/entity+/$id.labels[.]pdf.tsx`, `...zpl.tsx`, `operation+/$id.labels.*`, `components/PrintButton` |

### AureusERP — Lot and Package resources

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Lots | CRUD resource with lot name, product, quantities; relation page for quantities | `plugins/webkul/inventories/src/Filament/Clusters/Products/Resources/LotResource/`, `Pages/ManageQuantities.php` |
| Packages | CRUD resource with package name/type, operations relation, products relation | `.../Products/Resources/PackageResource/`, `RelationManagers/ProductsRelationManager.php` |
| Package types / packaging | Configuration resources for package types and packagings | `.../Clusters/Configurations/Resources/PackageTypeResource/`, `PackagingResource/` |
| Settings | Traceability toggle: enable lots/serial numbers; display lots on delivery slips | `.../Clusters/Settings/Pages/ManageTraceability.php` |

### Dolibarr — product lots with movement and document links

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Lot list/card | Lot/serial reference, product, batch qty, eat-by/sell-by dates, supplier, documents, notes; list search | `htdocs/product/stock/productlot_list.php`, `productlot_card.php`, `productlot_document.php`, `productlot_note.php` |
| Lot movements | Stock movements filtered by batch, with eat-by/sell-by columns in the movement list | `htdocs/product/stock/movement_list.php` |
| Batch/serial entry | Batch/serial fields on reception and shipment distribution lines; warnings when qty exceeds serial quantity | `htdocs/reception/dispatch.php`, `htdocs/expedition/dispatch.php` |
| Barcode sheets | Barcode print sheet and code init pages | `htdocs/barcode/printsheet.php`, `codeinit.php` |

**BOSS implications.** Lots and serials are not a Warehouse-only concern, but Warehouse is where they are created and consumed. Mantle already has `Lot`, `Asset`, `AssetDetail`, `Container`, `AssetReceipt`, `AssetIssuance` and `AssetReservation`; the BOSS screen should treat a serial as an `Asset` and a batch as a `Lot`, with a single `TrackedEntityPicker` interaction used by receipt, pick, transfer and count. Copy Carbon's expiry trace and policy (near-expiry warning days; Warn / Block / BlockWithOverride) because expiry disputes are otherwise impossible to explain. Package hierarchy belongs to `ShipmentPackage`/`ShipmentPackageContent`; package labels and contents reports must be printable from the package and the shipment. Traceability should be a graph or a drill-down ledger, not a static report; Odoo's parent/child move walk and Carbon's lineage graph are the two implementations to study. Do not add a second lot/serial table for warehouse use.

---

## 11. Locations, storage & facility setup

### Odoo — warehouse/location hierarchy, operation types, routes and storage categories

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Warehouses | Warehouse list/form: name, code, company, address; **Warehouse Configuration** tab (reception steps, delivery steps, resupply warehouses); Technical tab (view/stock/input/QC/pack/output locations, generated operation types) | `odoo/addons/stock/views/stock_warehouse_views.xml` (`action_warehouse_form`, `view_warehouse`) |
| Locations | Tree/list/form; name, parent, usage (`view`, `internal`, `transit`, `inventory`, `production`, `supplier`, `customer`), storage category, company, replenish flag, cyclic inventory frequency/last/next count, removal strategy; search filters by usage, empty locations, warehouse; **Putaway Rules** and **Products** stat buttons | `odoo/addons/stock/views/stock_location_views.xml` (`action_location_form`, `view_location_form`, `view_location_search`, `view_location_tree2`) |
| Operation types | CRUD for receipt/delivery/internal/manufacturing/POS types; code, sequence, warehouse, reservation method, backorder default, lot policy, default source/destination, allocation location, batch settings, print-on-validation | `odoo/addons/stock/views/stock_picking_type_views.xml` (`action_picking_type_list`, `view_picking_type_form`) |
| Routes | Route list/form; rules list/form with push/pull action, source/destination, picking type, delay, procurement method, domain; warehouse form links to its routes | `stock_location_views.xml` (`stock_location_route_tree`, `stock_location_route_form_view`), `stock_rule_views.xml` |
| Putaway Rules | Product/category/package-type → location/storage-category, priority order; editable list | `product_strategy_views.xml` (`stock_putaway_list`, `action_putaway_tree`) |
| Storage Categories | Name, allow-new-product, max weight + UoM; capacity by package (package type, quantity) and capacity by product (product, quantity, UoM); **Locations** stat button | `odoo/addons/stock/views/stock_storage_category_views.xml` |
| Package Types | Name, barcode, sequence/routes, dimensions (L×W×H, base/max weight), capacity by storage category | `stock_package_type_view.xml` |
| UoM / packaging | Units of measure under stock configuration; packagings are product-level fields rather than a separate screen | `odoo/addons/uom/views/uom_uom_views.xml` (menu `menu_stock_uom_form_action`) |

### ERPNext — warehouse tree, putaway rules, capacity page

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Warehouse | Tree/list/form with `is_group`, parent, company, account, address/contact, warehouse type, default transit warehouse, rejected flag, customer; list shows group/company/account | `erpnext/stock/doctype/warehouse/warehouse.json`, `warehouse.js` |
| Warehouse Type | Simple descriptor record | `erpnext/stock/doctype/warehouse_type/` |
| Putaway Rule | Item or category, warehouse, capacity/stock capacity, UoM/conversion, priority, company, disabled | `erpnext/stock/doctype/putaway_rule/putaway_rule.json` |
| Warehouse Capacity Summary | Capacity/occupancy page with company/warehouse/item/parent filters and drill-down | `erpnext/stock/page/warehouse_capacity_summary/` |
| UoM / UoM Category / Conversion | Unit masters and conversion factors used by stock and putaway capacity | `erpnext/setup/doctype/uom/`, `erpnext/stock/doctype/uom_category/`, `erpnext/setup/doctype/uom_conversion_factor/` |
| Stock Settings | Module-wide defaults (valuation method, negative stock, barcode field visibility, freeze dates, reservation, etc.) | `erpnext/stock/doctype/stock_settings/stock_settings.json` |

### Carbon — storage units, storage types and a rule builder

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Storage Units list/form | Name, location, parent storage unit, storage types, work center; active flag; print label (PDF/ZPL); add child, delete; bulk label printing | `apps/erp/app/modules/inventory/ui/StorageUnits/StorageUnitsTable.tsx`, `StorageUnitForm.tsx` |
| Storage Types list/form | Simple name-based classification used by storage units and items | `StorageTypes/StorageTypesTable.tsx`, `StorageTypeForm.tsx` |
| Storage Rules | Rule builder: name, active, description, applies-to-all-work-centers, condition AST (field/operator/value rows, item filters), surfaces, assignments, severity; list + edit form | `StorageRules/StorageRuleForm.tsx`, `RuleBuilder.tsx`, `RuleAssignmentsList.tsx`, `SeveritySelect.tsx`, `StorageRulesTable.tsx` |
| Shipping Methods | Carrier/account/tracking URL configuration | `ShippingMethods/` |
| Locations | Company locations are managed outside the inventory module; storage units reference a location | `StorageUnitForm.tsx` (location select) |

### AureusERP — warehouse, location, storage category, putaway and routes

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Warehouses | Name, code, company, address; Settings: reception steps, delivery steps, resupply-from warehouses, manufacture steps; visible only when multi-step routes are enabled | `.../Configurations/Resources/WarehouseResource/Schemas/WarehouseForm.php` |
| Locations | Name, parent, description; settings: type (internal/transit/inventory/production/supplier/customer/view), company, storage category (internal only), scrap flag, dock flag, replenish flag, cyclic inventory frequency/last/next dates (internal/transit) | `.../Configurations/Resources/LocationResource/Schemas/LocationForm.php` |
| Storage Categories | Capacity by package and capacity by product relation pages; locations relation | `.../Configurations/Resources/StorageCategoryResource/` |
| Putaway Rules | Company, in/out location, product/category, storage category, sub-location | `.../Configurations/Resources/PutawayRuleResource/Schemas/PutawayRuleForm.php` |
| Routes / Rules | Route form + rules relation manager; rule form | `.../Configurations/Resources/RouteResource/`, `RuleResource/` |
| Operation Types | Incoming/outgoing/internal/dropship definitions with source/destination locations | `.../Configurations/Resources/OperationTypeResource/` |
| Package Types / Packagings | Package type form (dimensions/weight/capacity) and packaging form | `.../Configurations/Resources/PackageTypeResource/`, `PackagingResource/` |
| Settings pages | Warehouses: enable locations, multi-step routes; Operations: packages, annual inventory day/month; Products: variants/UoM/packagings; Traceability: lots/serials; Logistics: dropshipping | `.../Pages/Settings/Manage*.php`, base under `Clusters/Settings/Pages/` |

### Dolibarr — warehouses and stock setup

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Warehouse card/list | Ref, label, description, address, status (open/closed), product count, stock value; agenda/stock/valuation tabs | `htdocs/product/stock/card.php`, `list.php`, `fiche-valo.php` |
| Stock setup | Rules for stock decrease/increase at bill/order/shipment/reception/close, negative-stock guards, virtual stock horizon, PDF model | `htdocs/admin/stock.php` |
| Stock transfer setup | Numbering/model for stock transfer documents | `htdocs/admin/stocktransfer.php` |
| Shipment setup | Numbering, PDF model, tracking/stock-entry-date display, free legal text, draft watermark, online signature | `htdocs/admin/expedition.php` |
| Reception setup | Numbering, PDF model, free text, draft watermark | `htdocs/admin/reception_setup.php` |

### metasfresh — locators, warehouses and HU configuration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Locators/warehouses | Backend windows (metadata-defined); locator resolution by scanned code is exposed to the mobile app | `backend/de.metas.handlingunits.mobileui/.../{JsonResolveLocatorRequest,JsonResolveLocatorResponse,LocatorInfo}.java` |
| HU profiles | Mobile profile/layout configuration decides which HU actions and fields the handheld shows | `.../config/{HUManagerProfile,HUManagerProfileLayoutSection,HUManagerProfilesMap}.java` |
| Generic configuration windows | Warehouse/locator/product setup rendered by the same list/master shell | `frontend/src/containers/DocumentListContainer.js` |

**BOSS implications.** Facility and location master data must live in one place and be reused by Warehouse, Maintenance and Commons. Mantle already has `Facility`, `FacilityLocation`, `FacilityLocationType`, `FacilityGroup`, `ProductFacility` and `ProductFacilityLocation`; the Warehouse app should not introduce a separate warehouse/location table. What Warehouse needs on top is the operational configuration: which facility locations are receiving docks, staging, quarantine, picking faces and shipping docks; which putaway rule applies; and whether the facility uses one-, two- or three-step receiving/delivery. Those can be facility-location types plus rules. Storage capacity (weight/volume/quantity per location) is optional for small businesses but should be modeled before the UI, because retrofitting capacity checks into put-away is expensive. Expose facility setup from Warehouse for warehouse staff and from Maintenance for facilities managers, but keep one screen with role-based sections, matching the design's shared-facility rule.

---

## 12. Barcode, handheld & scan flows

### Odoo — barcodes module only; full scanner is an enterprise add-on absent here

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Barcode Nomenclatures | List/form of nomenclature records and barcode rules (pattern, encoding, model/field mapping); configuration in Inventory → Products → Barcode Nomenclatures | `odoo/addons/barcodes/views/barcodes_view.xml`, `barcodes/models/barcode_nomenclature.py`, `barcode_rule.py` |
| GS1 nomenclature | Optional GS1 preset nomenclature/rules | `odoo/addons/barcodes_gs1_nomenclature/` |
| Barcode separator | Company setting used when parsing scanned codes | `odoo/addons/stock/views/res_config_settings_views.xml` (setting `barcode_separator`) |
| Mobile move-line form | A mobile-optimized (editable) variant of the move-line form used by scanner apps | `odoo/addons/stock/views/stock_move_line_views.xml` (`view_move_line_mobile_form`) |
| **Absent** scanner app | `stock_barcode` and `stock_barcode_barcodelookup` are referenced as upgrade modules in settings but are not present in this community checkout; there is no scan screen, no barcode action, no handheld JS. The only scan-like widget is `many2many_barcode_tags` for tag fields | verified by `ls odoo/addons \| grep '^stock_barcode'` (none); `res_config_settings_views.xml` (`module_stock_barcode`); `stock/static/src/widgets/many2many_barcode_tags.js` |
| Barcode print | Lot/serial, location, package and operation-type label reports (PDF/ZPL) | `stock/report/report_lot_barcode.xml`, `report_location_barcode.xml`, `report_package_barcode.xml`; `wizard/stock_lot_label_layout.xml`, `stock_location_label_layout.py`, `stock_package_label_layout.py`, `stock_picking_type_label_layout.py` |
| Mobile picking views | The transfer form already exposes a "Moves" list and details suitable for a scan-driven flow, but Odoo community does not ship the scanner UI | `stock_picking_views.xml`, `stock_move_line_views.xml` |

### ERPNext — scan fields and scan modes, no dedicated handheld app

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Header barcode scan | `scan_barcode` field on Purchase Receipt, Delivery Note, Stock Entry, Stock Reconciliation, Pick List; scanning fills/creates lines | respective doctype `.json`/`.js` |
| Scan modes | Pick List and Stock Reconciliation have `scan_mode` (continuous scanning) and `prompt_qty`; lines have `has_item_scanned` | `pick_list.json`, `stock_reconciliation.json`, `pick_list_item.json`, `stock_reconciliation_item.json` |
| Barcode fields | Item `barcode`, warehouse/package/lot/serial identifiers; `show_barcode_field` in Stock Settings controls visibility | `erpnext/stock/doctype/item/`, `stock_settings.json` |
| Quick Stock Balance | Barcode input opens item stock/value without navigating the item master | `erpnext/stock/doctype/quick_stock_balance/` |
| **Absent** handheld UI | Nothing in the checkout is a mobile/PWA warehouse app; scanning is embedded in Desk forms | verified by `grep -r` for mobile/route apps; ERPNext is a Desk SPA |

### Carbon — scan-or-select pickers and a full MES handheld app

| Screen/page | What it is | Key files |
| --- | --- | --- |
| TrackedEntityPicker | Modal picker with Scan and Select tabs; scan a serial/batch or choose from available entities; quantity clamped; expiry warning/policy; used by receipt, shipment, stock-transfer and picking flows | `packages/react/src/TrackedEntityPicker.tsx` (imports in `Receipts/ReceiptLines.tsx`, `ShipmentLines.tsx`, `routes/x+/stock-transfer+/$id.scan.$lineId.tsx`) |
| MES app shell | Mobile-first app with app bar, bottom tab bar, more-sheet, session lock, pin-in/pin-out, timecard, offline-ish overlays | `apps/mes/app/components/{MesAppBar,MesBottomBar,MesTabBar,MoreSheet,SessionLockOverlay,PinInOverlay}.tsx`, `routes/x+/_layout.tsx` |
| MES picking | Picking queue/detail with Scan/Pick/Short/Unpick; paste/scan tracked entity; finish-with-unpicked acknowledgement | `apps/mes/app/routes/x+/picking*.tsx`, `components/ShortPickModal.tsx` |
| MES inventory actions | Adjustment, scrap, issue, unconsume, location switch, print/labels; job operation material issue and serial selection | `apps/mes/app/routes/x+/{adjustment,scrap,issue,unconsume,location,print}.tsx`, `components/JobOperation/components/{IssueMaterialModal,SerialSelectorModal}.tsx` |
| Label printing | ZPL/PDF labels for entities, operations, storage units; print queue/select-printer modal | `apps/mes/app/routes/file+/...`, `StorageUnits/StorageUnitsTable.tsx` (printer modal) |
| Barcode/QR generation | QR-code requests and HU label printing on the server side | `apps/mes/app/routes/api+/{batch-numbers,serial-numbers}.ts`, label routes; `packages/react` PrintButton |

### Dolibarr — barcode module and scan-into-inventory

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Barcode setup/generation | Barcode code init and print sheet pages | `htdocs/barcode/codeinit.php`, `printsheet.php`, `htdocs/admin/barcode.php` |
| Inventory scanning | **Update by scanning** opens a popup that accepts a list of scanned codes/quantities and updates real quantities; mode selector for barcode vs. batch | `htdocs/product/inventory/inventory.php` lines ~693, ~727–900 |
| Shipment barcode search | Barcode lookup for adding products to a shipment | `htdocs/expedition/ajax/searchfrombarcode.php` |
| Reception/shipment line batch fields | Batch/serial inputs on distribution screens; manual entry, no scanner-specific widget | `htdocs/reception/dispatch.php`, `htdocs/expedition/dispatch.php` |
| **Absent** handheld app | No mobile warehouse app in the checkout; scanning is form/popup based | verified by module directory |

### AureusERP / metasfresh — REST/mobile scan backends

| Screen/page | What it is | Key files |
| --- | --- | --- |
| AureusERP barcode labels | Barcode label printing on lots, packages and locations, and a barcode field on package types; there is no scanner app or scan-mode form in the inventories plugin | `.../Products/Resources/LotResource/Tables/LotsTable.php`, `PackageResource/Tables/PackagesTable.php`, `Configurations/Resources/LocationResource/Tables/LocationsTable.php`, `PackageTypeResource/Schemas/PackageTypeForm.php` |
| metasfresh HU manager | Mobile HU app: resolve by QR code or ID, load/move/bulk-move HUs, change qty, print labels, manage profiles; picking and inventory mobile apps share the same QR/HU lookup | `backend/de.metas.handlingunits.mobileui/.../{HUManagerMobileApplication,HUManagerRestController,HandlingUnitsRestController,JsonGetByQRCodeRequest,JsonGetHUInfoByScannedCodeRequest,JsonQRCodesGenerateRequest}.java` |
| metasfresh picking/inventory REST | Picking and inventory mobile workflows exchange JSON job/step/line models over REST | `backend/de.metas.picking.rest-api/.../JsonPickingJob*.java`, `backend/de.metas.inventory.mobileui/.../JsonInventoryJob*.java` |

**BOSS implications.** Scanning is an input mode, not a screen family. Build one client-side scan component (keyboard-wedge input plus camera where available) that resolves a code to product, location, package, lot/serial or shipment, then let each task screen decide what a valid scan means. Odoo's barcode nomenclature/rules and ERPNext's `scan_barcode` fields show that code parsing belongs in shared configuration; Carbon's `TrackedEntityPicker` is the cleanest interaction for serialized/batch goods; metasfresh's QR/HU lookup is the model for package/location codes. On Mantle, reuse `ShipmentServices.get#ShipmentProductByScan`, `AssetServices.check#ScanLocation` and `FacilityServices.get#ScannedIdGeneral` instead of parsing codes per screen. Handheld screens must be separate routes with large tap targets and no desktop tables; the existing SimpleScreens `BasicHandheld` forms are the parity checklist, not the UI model.

---

## 13. Reports, valuation & audit

### Odoo

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock by Location | Quant report sliced by location/product/lot/package/owner; graph/pivot views | `stock_quant_views.xml` (`action_view_quants`, `view_stock_quant_pivot`, `stock_quant_view_graph`) |
| Moves Analysis | Stock move list/pivot/graph with valuation fields when `stock_account` is installed; filter by aging/intercompany | `stock_move_views.xml` (`stock_move_action`, `stock_move_menu`), `stock_account/views/stock_move_views.xml` |
| Forecasted Report | On-hand + incoming/outgoing timeline for a product/location | `stock_forecasted.xml`, `static/src/stock_forecasted/` |
| Traceability | Parent/child movement tree for a lot/serial/transfer | `report/stock_traceability.py`, `report_stock_traceability.xml` |
| Valuation Adjustments | Product value adjustment list/form (manager/no-one group) | `stock_account/views/product_value_views.xml` (`product_value_list_action`, `valuation_adjustments_menu`) |
| Count sheet | Printable physical-inventory count sheet | `report/stockinventory.xml` (`action_report_inventory`) |
| Delivery/picking/package reports | Delivery slip, picking operations, batch picking, package contents, return slip, reception label | `report/stock_report_views.xml`, individual templates |
| Allocation report | Available/assigned/for/date lines with assign-all and label printing | `static/src/allocation_report/`, `report/stock_allocation_report.xml` |

### ERPNext

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock reports | 55 report folders in `erpnext/stock/report/`; key ones: Stock Balance, Stock Ledger, Stock Projected Qty, Stock Analytics, Stock Ageing, Warehouse Wise Stock Balance, Warehouse wise Item Balance Age and Value, Total Stock Summary, Item Shortage, Reorder Level, Reserved Stock, Product Bundle Balance, Landed Cost Report, COGS by Item Group | `erpnext/stock/report/` |
| Traceability/expiry | Serial No and Batch Traceability, Serial and Batch Summary, Serial No Ledger, Batch-Wise Balance History, Available Batch/Serial, Batch Item Expiry Status, Negative Batch, Serial No Status/Warranty/Service Contract Expiry | `erpnext/stock/report/` |
| Audit reports | Stock and Account Value Comparison, Stock Ledger Variance, Stock Ledger Invariant Check, Incorrect Balance Qty After Transaction, Incorrect Stock Value, Incorrect Serial No Valuation, Incorrect Serial and Batch Bundle, FIFO Queue comparison, Stock Qty vs Batch/Serial Count | `erpnext/stock/report/` |
| Stock Balance page | Fast on-screen summary by warehouse/item group | `erpnext/stock/page/stock_balance/` |
| Quick Stock Balance | Barcode/item + warehouse/date quantity and value | `erpnext/stock/doctype/quick_stock_balance/` |
| Stock Closing / Repost | Period closing and valuation repost tools with status/logs | `erpnext/stock/doctype/stock_closing_entry/`, `repost_item_valuation/` |

### Carbon

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quantities / Movements | Operational stock and ledger tables; export; custom columns | `Inventory/InventoryTable.tsx`, `StockMovements/StockMovementsTable.tsx` |
| Inventory valuation | Valuation workbench with costing method, qty on hand/on hold/rejected, unit cost, total value, % of total, as-of date, group by location/item, GL tie-out and **Reconcile** | `Valuation/InventoryValuationWorkbench.tsx` |
| Activity feed | Human-readable ledger per item/entity with links to source documents | `Inventory/InventoryActivity.tsx`, `ledgerFeed.ts` |
| Traceability | Graph + table of lineage; expiry trace | `Traceability/` |
| Counts | Count history and posted adjustments | `InventoryCount/InventoryCountHistory.tsx`, `InventoryCount.tsx` |

### AureusERP

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Reporting cluster | Moves and Quantities resources with modal query-builder filters, grouping and export; no dedicated valuation/financial report | `plugins/webkul/inventories/src/Filament/Clusters/Reporting/` |
| Operation/move history | Per-operation and global move tables | `.../OperationResource/Pages/ManageMoves.php`, `.../Reporting/Resources/MoveResource/` |

### Dolibarr

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Movement list | Full stock ledger with configurable columns, filters and mass PDF generation | `htdocs/product/stock/movement_list.php` |
| Stock at date | Past/future stock snapshot with virtual stock and estimated values | `htdocs/product/stock/stockatdate.php` |
| Valuation | Warehouse valuation card + `valo.php` | `htdocs/product/stock/fiche-valo.php`, `valo.php` |
| Statistics | Per-module stats pages under `htdocs/product/stock/stats/`, `htdocs/expedition/stats/`, `htdocs/reception/stats/` | respective `stats/` dirs |
| Inventory/transfer lists | Inventory and stock-transfer lists with status/date filters | `htdocs/product/inventory/list.php`, `stocktransfer_list.php` |

### metasfresh

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Generic reporting windows | Stock/valuation reports are backend windows or SQL views rendered by the generic shell; no dedicated React report page | `frontend/src/containers/`, `backend/de.metas.*` |
| Delivery planning sums | Planned/actual load/discharge totals in the document-list header | `frontend/src/components/deliveryPlanning/DeliveryPlanningViewHeader.js` |

**BOSS implications.** Warehouse reports are saved finds, not separate report engines. Build Stock by Location, Stock Ledger/Movements, Availability/Forecast, Traceability, Count Variance and Receiving/Shipping History as find screens that can switch list/kanban/pivot/graph views (the design's switchable-views requirement), with export. Valuation is the one report that belongs to Accounting: Warehouse shows quantity and movement, Accounting shows value and GL tie-out; Carbon's split (quantities vs. valuation workbench) is the cleanest boundary. Mantle's `AssetServices.get#AvailableInventory` plus the shipment/issuance entities should feed these screens; do not create materialized report tables until performance proves it necessary. Audit views (who changed a quantity, which document posted it) must be reachable from every stock row, not buried in an admin report.

---

## 14. Settings & configuration

### Odoo — one Inventory settings page, plus per-operation-type configuration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory settings | Toggles/selects: product packs/package tracking, process transfers (batch/wave), partner-specific instructions, shipping policy, quality control + worksheet (upgrade), annual inventory day/month, barcode app + barcode database (upgrade), delivery connectors, stock fleet, delivery confirmation email/SMS, signature on delivery, product variants, UoM/packagings, full traceability (lots/serials), GS1 lot print, barcode separator, expiry dates, lots on delivery slip, owner-stored products, multi-location storage, own routes, replenishment horizon, dropshipping, MTO | `odoo/addons/stock/views/res_config_settings_views.xml` (settings groups, lines 28–193) |
| Operation type | Per-flow settings (reservation method, backorder default, lot creation policy, default locations, batch creation/grouping, print-on-validation) | `stock_picking_type_views.xml` (`view_picking_type_form`) |
| Warehouse | Per-warehouse reception/delivery steps, resupply, generated locations/types | `stock_warehouse_views.xml` (`view_warehouse`) |
| Company | Stock valuation method/accounts (when `stock_account` installed) | `stock_account/views/res_config_settings_views.xml`, `product_views.xml` |

### ERPNext — Stock Settings and Delivery Settings

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock Settings | Item naming, default item group/UoM, valuation method, over-delivery/receipt allowance, quality-inspection actions when not submitted/rejected, show barcode field, clean description HTML, auto price-list rate, allow negative stock, auto indent, reorder email, stock freeze date/days/auth role, naming series, role allowed for backdated transactions, role allowed to over-deliver/receive, material-request allowance, update price-list rate, enable stock reservation, partial reservation, serial/batch selection policy, auto-create/auto-reserve serial-batch, and more | `erpnext/stock/doctype/stock_settings/stock_settings.json`, `stock_settings.js` |
| Delivery Settings | Dispatch template/attachment, send-with-attachment, stop delay | `erpnext/stock/doctype/delivery_settings/delivery_settings.json` |
| Stock Reposting Settings | Repost batch size/limits | `erpnext/stock/doctype/stock_reposting_settings/` |
| Putaway Rule / Warehouse Type / UoM | Operational masters used by receipts and capacity checks | `putaway_rule/`, `warehouse_type/`, `setup/doctype/uom/` |
| Workspace | Which cards/reports appear on the Stock workspace | `erpnext/stock/workspace/stock/stock.json` |

### Carbon — settings page plus configuration resources

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory settings | Cards: **Kanban Output** (planning output), **Shelf life** (calculated input scope, near-expiry warning days, expired-entity policy Warn/Block/BlockWithOverride), **Finishing an incomplete pick** (policy), **Returning unused picked material** (policy) | `apps/erp/app/routes/x+/settings+/inventory.tsx`, `apps/erp/app/modules/settings/settings.models.ts` (`inventoryShelfLife`) |
| Storage Types / Storage Units / Storage Rules | Configuration resources, not global settings; rules can be scoped to work centers/surfaces | `inventory/ui/StorageTypes/`, `StorageUnits/`, `StorageRules/` |
| Shipping Methods | Carrier, carrier account, tracking URL | `inventory/ui/ShippingMethods/` |
| Batch properties | Per-item batch property definitions and ordering | `inventory/ui/Batches/BatchPropertiesConfig.tsx`, `BatchPropertiesOrder` |
| Company settings | Shelf-life start event and calculated-input scope used by receipts | `apps/erp/app/components/Form/ShelfLifeStartEvent.tsx`, `modules/settings/settings.server.ts` |

### AureusERP — five settings pages, all plugin-scoped

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Warehouses settings | Enable locations, enable multi-step routes (turning locations off also turns routes off) | `.../Clusters/Settings/Pages/ManageWarehouses.php` |
| Operations settings | Enable packages, annual inventory day/month | `.../Clusters/Settings/Pages/ManageOperations.php` |
| Products settings | Enable variants, UoM, packagings | `.../Clusters/Settings/Pages/ManageProducts.php` |
| Traceability settings | Enable lots/serial numbers, display on delivery slips | `.../Clusters/Settings/Pages/ManageTraceability.php` |
| Logistics settings | Enable dropshipping (creates/removes the dropship operation type) | `.../Clusters/Settings/Pages/ManageLogistics.php` |
| Plugin settings cluster | Wrapper cluster/slugs for the above pages | `.../Pages/Settings/Manage*.php`, `Clusters/PluginSettings.php` |

### Dolibarr — module setup pages, mostly stock-calculation timing

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock setup | Decrease rules (on bill / validate order / shipment / shipment close), increase rules (supplier bill / validate order / reception / reception close / supplier dispatch), disallow negative transfer, must-be-enough guards, virtual horizon days, PDF model | `htdocs/admin/stock.php` |
| Stock transfer setup | Numbering model, extrafields | `htdocs/admin/stocktransfer.php` |
| Shipment setup | Numbering/PDF model, stock-entry-date display, earliest sell/eat-by preselect, free legal text, draft watermark, online signature, do-not-prefill quantity | `htdocs/admin/expedition.php` |
| Reception setup | Numbering/PDF model, free text, draft watermark | `htdocs/admin/reception_setup.php` |

### metasfresh — profile-driven mobile configuration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| HU manager profiles | Profile/layout sections decide which actions/fields the handheld shows; profiles map per warehouse/user | `backend/de.metas.handlingunits.mobileui/.../config/{HUManagerProfile,HUManagerProfileLayoutSection,HUManagerProfileLayoutSectionList,HUManagerProfilesMap}.java` |
| Mobile application launchers | Workflow launcher parameters for picking/inventory apps (warehouse, workflow type, filters) | `.../PickingWorkflowLaunchersProvider.java`, `.../InventoryWorkflowLaunchersProvider.java` |
| Desktop settings | Backend/metadata windows; no dedicated React settings page | `backend/de.metas.*` |

**BOSS implications.** Settings must be split by scope, because the references otherwise bury operational choices in one global page. Put organization defaults (valuation method, negative-stock policy, expiry policy, numbering) in Admin/Accounting; facility defaults (receiving/delivery steps, dock/staging/quarantine locations, putaway rules, capacity) in the facility record; role defaults (blind counts, over-receipt tolerance, allowed backdating) in authz/role configuration. Operation-type-style settings (reservation timing, lot creation policy, batch grouping, print-on-validation) belong to the warehouse workflow record, not to a user. The minimum settings to decide before building screens: reservation timing, over-receipt/over-ship tolerance, lot/serial creation policy, expiry policy, blind-count default, backorder default, and which documents auto-print. Every one of those changes what a screen shows or which button is enabled, so they cannot be deferred to a settings page after the fact.

---

## 15. Gaps, notables & current Moqui baseline

### Gaps in the reference set

| Gap | Evidence | Consequence for BOSS |
| --- | --- | --- |
| No warehouse module in the Moqui reference components | `3p_moqui/Sales` and `WorkManagement` have only account/contact/opportunity/order/agreement and project/task/wiki screens; no stock, shipment, facility or count screen | BOSS cannot copy a Moqui-native warehouse UI; it must design the screens from the ERP references and the MrSimpleScreens parity list |
| Odoo community lacks quality inspection and the scanner app | `ls odoo/addons \| grep -E '^quality\|^stock_barcode'` returns nothing; settings reference `module_quality_control`, `module_stock_barcode`, `module_stock_barcode_barcodelookup` as upgrade modules | Use Carbon for inspection UX and ERPNext for the inspection document; do not assume Odoo's scanner exists |
| AureusERP has no count document, inspection UI or carrier integration | Inventories Filament tree has no PhysicalInventory/Quality/Carrier resource; `ReturnSlipAction` is an empty action | Its operation/quantity screens are useful; counts, inspection and shipping labels must come from other references |
| Dolibarr has no returns-receiving document or inspection UI | No return/inspection module in `htdocs/`; reception/shipment only | Its stock and shipment workflows are useful, but returns/quality need ERPNext/Carbon models |
| metasfresh desktop is metadata-driven | `frontend/src` has only generic list/master containers and a delivery-planning header; business screens live in backend windows | Useful for HU/mobile concepts and layout constraints, not for screen copy |
| ERPNext has no handheld app | Desk SPA only; scanning is embedded in forms | BOSS must build the mobile routes; Carbon MES is the reference |
| Carbon is AGPL-3 | Source headers state AGPL-3 and network-use source obligation | Use as behavioral reference only; do not copy code into BOSS |
| Warehouse UIs do not combine facility/equipment maintenance with location setup | Odoo's `stock_maintenance` links lots to maintenance, but warehouse screens remain stock-only; ERPNext/Dolibarr warehouses are stock-only; Maintenance lives in separate apps | BOSS must define the shared Facility/FacilityLocation model and the Warehouse/Maintenance role split explicitly |

### Notables worth carrying forward

- **Operation-type queue board** (Odoo, AureusERP): the only landing page that answers "what do I do now?" without a report. Include ready/waiting/late/backorder counts and a sparkline.
- **Source-document seam** (Carbon, ERPNext): every receipt/shipment starts from a purchase order, sales order, transfer order or return order; the source document supplies expected lines and bounds the quantities.
- **Hard posting gates** (Carbon): missing serial/batch quantities and expired goods block posting; rule violations are surfaced before the stock move. Odoo's backorder dialog and ERPNext's rejected warehouse are the quantity/quality equivalents.
- **Blind count + variance review + reopen** (Carbon): the only count flow that separates counting from posting and prevents the counter from seeing the expected quantity.
- **Count conflict resolution** (Odoo): stock moved between counting and applying; choose counted quantity vs. difference vs. manual resolution.
- **Split transfer vocabulary** (Carbon): bin-to-bin stock transfer vs. facility-to-facility warehouse transfer with ship/receive states.
- **Package hierarchy** (Odoo, ERPNext): package type + contents + parent package, with dimensions/weight and printable labels; required for multi-box orders.
- **Expiry trace and policy** (Carbon): explain how an expiry date was derived and whether near-expiry/expired goods warn, block, or require override.
- **Reservation/unreservation** (ERPNext): explicit reservation records and a "Reserved Stock" view; pickers know what is theirs.
- **Scan as an input mode** (Carbon, ERPNext, metasfresh): one picker/scan component reused by receipt, pick, transfer, count and label flows.
- **Print/label actions on the document** (Odoo, ERPNext, Carbon): picking sheet, delivery slip, package label, lot/serial label, return slip; auto-print on validation.

### Current Moqui baseline

The existing Moqui UI is a form inventory, not a warehouse UX. Counts below are from [ss-inventory.md](ss-inventory.md); services/entities from [usl-inventory.md](usl-inventory.md).

| Area | Existing forms/screens | Notes |
| --- | --- | --- |
| Shipment | 46 forms: FindShipment (new outgoing/incoming/transfer), ShipmentDetail (edit, pick/pack scans, contents, packages, labels, returns), ShipmentItems, ShipmentPackages, ItemReserve, ReceiveItem | Closest existing parity set; still CRUD/form-first, no queue or mobile layout |
| Shipping | 34 forms: PackItems, PackPackages, PackSummary, PackCompleted, PickLocationMoves, QuickMove, AddOrder, AddShipment, BulkPicklist, FindPicklist, PicklistDetail, dashboard | Covers pick/pack/scan concepts; `dashboard` has `PackShipmentForm` and `FacilitySummary` |
| Facility | 18 forms: FindFacility, EditFacility, EditFacilityLocations, EditFacilityProducts, BoxTypes, CarrierShipMethods | Facility + locations + box types + carrier methods already modeled |
| Asset / inventory | 65 forms including FindPhysicalInventory, EditPhysicalInventory, PhysicalChange, PhysicalQuantity, MoveAsset, FindAsset, EditContainer, MoveContainer, FindAssetPool, EditLots | Physical counts, asset moves, containers and lots already have forms |
| BasicHandheld | 16 forms: ReceiveAsset, SelectAsset, PickLocationMoves, dashboard (scan asset/facility/pack shipment) | The handheld parity checklist, not a modern mobile UX |
| Mantle shipment services | 68 services: create/update shipment, items, packages, contents; pick/pack/ship/deliver; receive entire/single product; print/track/refund labels; auto-packages; returns; content files | Core posting logic exists; BOSS should call it, not reimplement |
| Mantle asset/product services | `get#AvailableInventory`, `get#AvailableForOrder`, `get#AvailableInventoryMulti`, `reserve#AssetsForOrder`, `move#Product`, `record#PhysicalInventoryQuantity/Change`, `issue#Asset`, `receive#Asset`, `check#ScanLocation` | Availability, reservation, moves, counts and scanning are already service-level |
| Mantle entities | `Shipment*`, `ShipmentItemSource`, `ShipmentPackage*`, `ShipmentRouteSegment`, `CarrierShipmentMethod`, `ShippingGateway*`; `Facility`, `FacilityLocation`, `FacilityLocationType`, `ProductFacility`, `ProductFacilityLocation`; `Lot`, `Asset`, `AssetDetail`, `Container`, `AssetReceipt`, `AssetIssuance`, `AssetReservation`; `PhysicalInventory`, `PhysicalInventoryCount` | No inspection entity; no dedicated putaway/capacity entity |
| Missing baseline | No warehouse landing/queue, no mobile scan routes, no count variance review, no inspection, no expiry policy, no carrier rating UI, no put-away rule UI, no capacity checks | These are the BOSS additions |

**Data-model mapping for BOSS.**

| Warehouse concept | Use in Mantle |
| --- | --- |
| Receipt / shipment header | `Shipment` + `ShipmentParty` + `ShipmentRouteSegment`; type/status via `StatusItem` |
| Receipt/shipment line | `ShipmentItem` (expected/demand) + `ShipmentItemSource` (pick/receive quantity, lot/asset link) |
| Package / carton | `ShipmentPackage`, `ShipmentPackageContent`, `ShipmentBoxType` |
| Serial / batch | `Asset` for serialized units; `Lot` for batches; `AssetDetail` for attributes/dates |
| On-hand / availability | `AssetServices.get#AvailableInventory`, `get#AvailableForOrder`, `get#AvailableInventoryMulti` |
| Physical count | `PhysicalInventory` + `PhysicalInventoryCount`; post with `AssetServices.record#PhysicalInventoryQuantity/Change` and `AssetAutoPostServices.post#PhysicalInventoryVariance` |
| Location / facility | `Facility`, `FacilityLocation`, `FacilityLocationType`, `ProductFacility`, `ProductFacilityLocation` |
| Receiving / put-away | `ShipmentServices.receive#ShipmentProduct` / `receive#EntireShipment`; put-away destination resolved into `Asset` location / `ShipmentItemSource` |
| Pick / pack / ship | `ShipmentServices.pickMove#ShipmentProduct`, `pack#ShipmentProductScan`, `pack#Shipment`, `ship#Shipment`, `deliver#Shipment` |
| Carrier / labels | `CarrierShipmentMethod`, `ShippingGateway*`; `CarrierServices.{get#ShippingRate,request#ShippingLabels,track#ShippingLabels}`, `ShipmentServices.print#ShipmentLabels` |
| Scrap / adjustment | Asset status/quantity change through `AssetServices`; ledger posting via `AssetAutoPostServices` |
| Inspection | No Mantle entity; add a small inspection header/readings record linked to `ShipmentItemSource` and `Asset`/`Lot` |
| Capacity / putaway rules | No Mantle entity; add facility-location capacity and a putaway rule record, or keep as configuration on `FacilityLocation` |
| Scan resolution | `ShipmentServices.get#ShipmentProductByScan`, `AssetServices.check#ScanLocation`, `FacilityServices.get#ScannedIdGeneral` |

**Recommended BOSS screen inventory (minimum).**

| Screen | Reuses | Primary reference |
| --- | --- | --- |
| Warehouse home / queues | Operation counts over Shipment/PhysicalInventory | Odoo operation-type board, AureusERP cards |
| Receipts (find + detail + post) | Shipment + ShipmentItemSource | Odoo receipt form, Carbon receipts, ERPNext Purchase Receipt |
| Put-away / internal transfer | Shipment (internal) + facility locations | Odoo internal transfer + putaway rules, Carbon stock transfer |
| Warehouse transfer (facility-to-facility) | Shipment + route segment | Carbon warehouse transfer |
| Picking lists / waves | Shipment + batch header | Carbon picking list, Odoo batch, ERPNext Pick List |
| Pack / ship | ShipmentPackage + carrier | Odoo packages/carrier, ERPNext Shipment, Carbon shipments |
| Returns receiving | Shipment (return type) + inspection | ERPNext returns, Carbon return source docs |
| Inventory by location | Availability services + location tree | Odoo quants, Carbon quantities, ERPNext Stock Balance |
| Counts | PhysicalInventory + PhysicalInventoryCount | Carbon count, Odoo physical inventory, Dolibarr inventory |
| Locations & storage setup | Facility/FacilityLocation + rules | Odoo warehouse/location config, AureusERP config |
| Reports | Saved finds over the above | ERPNext stock reports, Odoo moves/valuation, Carbon valuation |
| Handheld | Mobile routes over receipt/pick/transfer/count | Carbon MES, metasfresh HU mobile |

### Shared screens and context

The design calls for shared screens across apps; Warehouse should own the operational face of these, not a private copy.

| Shared screen | Warehouse face | Other faces | Context to pass |
| --- | --- | --- | --- |
| Shipment / transfer detail | Receive, put-away, pick, pack, ship, return, print labels, inspect | Sales and Customer Service: tracking and promise dates; Accounting: invoice/cost link | `shipmentId`, `shipmentTypeId`, `facilityId`, role/app, allowed actions |
| Inventory availability | Full stock by facility/location/product/lot, reservations, incoming | Customer Service: read-only availability and promise dates; Purchasing: shortfall/reorder; Sales: inline availability on quote/order lines | `productId`, `facilityId`, `locationId`, `lotId`, as-of date |
| Order detail | Fulfillment actions (create shipment, pick, ship, return) | Sales: edit/confirm; Customer Service: cases/returns; Accounting: invoice/payment | `orderId`, role/app, allowed action set |
| Product 360 | Storage units, lots/serials, quantities, movements, valuation link | Products: master data; Manufacturing: BOM/routing; Purchasing: supplier/cost | `productId`, app/role, active tab |
| Facility detail | Locations, docks, staging/quarantine, put-away rules, capacity | Maintenance: equipment/assets and schedules; Commons: facility schedules | `facilityId`, `facilityLocationId`, app/role |
| Count / adjustment | Count entry, variance review, posting, history | Accounting: variance posting/GL read | `physicalInventoryId`, `facilityId`, role |
| Inspection | Inbound/outbound inspection, readings, disposition | Quality app (if separate): templates/plans; Purchasing: supplier scorecard | `inspectionId`, `shipmentItemSourceId`, `assetId`/`lotId` |

Keep the screen identity in the URL and the action set in context, as the design requires: one screen, several role/app configurations, not several screens that drift.

### Checkout path quirks

- **Odoo** paths are nested one level deeper than the repository name: `3p_other/odoo/odoo/addons/<addon>/…`.
- **ERPNext** paths are relative to `3p_other/frappe/erpnext/erpnext/…`; the workspace JSON is `stock/workspace/stock/stock.json`, not `workspace/stock.json`.
- **Carbon** ERP inventory UI is under `apps/erp/app/modules/inventory/ui/`, but the route components live under `apps/erp/app/routes/x+/…`; some "screens" are route files that delegate to API actions, not page components.
- **AureusERP** inventory classes are under `plugins/webkul/inventories/src/Filament/` with clusters (`Operations`, `Configurations`, `Products`, `Reporting`, `Settings`); many settings pages subclass base pages in `Clusters/Settings/Pages/`.
- **Dolibarr** modules are under `htdocs/<module>/`; stock lives at `htdocs/product/stock/`, physical inventories at `htdocs/product/inventory/`, shipments at `htdocs/expedition/`, receptions at `htdocs/reception/`.
- **metasfresh** desktop UI is a generic React shell (`frontend/src/`), while warehouse mobile/REST behavior is in backend Java modules (`backend/de.metas.handlingunits.mobileui`, `de.metas.inventory.mobileui`, `de.metas.picking.rest-api`); do not look for React screens for picking/counting.
- **Odoo quality and barcode add-ons are absent** from this community checkout even though settings reference them; the only barcode UI is nomenclature/rule configuration.
- **AureusERP `ReturnSlipAction` is a stub** (empty action body); do not count it as a working return-slip implementation.

**Bottom line.** The reference set is strong on receiving, picking, counts and stock visibility, weak on inspection/returns in the community checkouts, and absent for a Moqui-native warehouse UI. BOSS should build around the Mantle `Shipment` + `Asset` + `PhysicalInventory` model, copy Carbon's operator flows (counts, picking, posting gates, traceability) and Odoo's configuration/queue structure, and borrow ERPNext's quality-inspection and carrier/shipment documents where Carbon/Odoo are thin.





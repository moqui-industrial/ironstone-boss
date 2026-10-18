# IronStone BOSS — Products app research

Oct 18, 2026

Deeper research pass on the **IronStone Products** app (products & variants, categories, features & attributes, pricing & costs, product suppliers, product documents), cataloguing every relevant screen/page found in the reference apps. Companion to [3p-app-reference.md](3p-app-reference.md) and the sibling passes [research-drawers-commons.md](research-drawers-commons.md) / [research-accounting.md](research-accounting.md); feeds the design of the Products row in [initial-design.md](initial-design.md) plus the product face of the shared Product 360 screen (Supplier view in Purchasing, BOM view in Manufacturing, merchandising in Commerce).

**Organization.** Sorted by functional area (not by app): all variant screens together, all pricing screens together, etc. Within each area, sub-tables per reference app. Style mirrors [research-drawers-commons.md](research-drawers-commons.md).

**Scope.** Catalog management UI only: product master, variants/attributes, categories, pricing & costs, supplier catalogs, media/documents, units/barcodes — the screens a catalog manager lives in. Stock movements are Warehouse; bills and purchase orders are Purchasing; BOMs/routings are Manufacturing — those surfaces appear here only as links the product screen exposes (the Product 360 border).

**Path conventions.** Paths are relative to each repository's own root, as in 3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Akaunting** | `/home/jonesde/work/moquiwork/3p_other/akaunting` — Blade views in `resources/views/`, controllers in `app/Http/Controllers/`, widgets in `app/Widgets/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — Filament resources/clusters under `plugins/webkul/<plugin>/src/Filament/` |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — React Router modules under `apps/erp/app/modules/` |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — module pages under `htdocs/<module>/`; document/numbering generators under `htdocs/core/modules/` |
| **ERPNext** | `/home/jonesde/work/moquiwork/3p_other/frappe/erpnext` — Item-family doctypes **including Price List & Item Price** under `erpnext/stock/`; `uom`/`item_group` masters under `erpnext/setup/`; only `product_bundle` (+ selling-facing reports) in `erpnext/selling/` |
| **Ever Gauzy** | `/home/jonesde/work/moquiwork/3p_other/ever-co/ever-gauzy` — paths relative to the monorepo root (`apps/gauzy` + `packages/*`) |
| **metasfresh** | `/home/jonesde/work/moquiwork/3p_other/metasfresh` — React WebUI in `frontend/src/` is a thin generic shell; business windows are metadata-defined in the backend `de.metas.*` modules |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — paths below use `odoo/addons/<addon>/…`; in this checkout that resolves to `3p_other/odoo/odoo/addons/<addon>/` (each addon's views in `<addon>/views/`, JS in `<addon>/static/src/`) |

Not used here: Twenty, Zimbra, Nextcloud and the groupware sources from the earlier passes ship no product-catalog functionality.

Sections: [1 products home & dashboards](#1-products-home--dashboards) · [2 product lists & find views](#2-product-lists--find-views) · [3 product forms & master data](#3-product-forms--master-data) · [4 variants & attributes](#4-variants--attributes) · [5 categories & taxonomy](#5-categories--taxonomy) · [6 pricing & costs](#6-pricing--costs) · [7 product suppliers & purchasing references](#7-product-suppliers--purchasing-references) · [8 media, documents & attachments](#8-media-documents--attachments) · [9 UOM, packaging & barcodes](#9-uom-packaging--barcodes) · [10 product 360 & shared faces](#10-product-360--shared-faces) · [11 catalog settings & configuration](#11-catalog-settings--configuration) · [12 gaps & notables in the checkout](#12-gaps--notables-in-the-checkout)

---

## 1. Products home & dashboards

### Akaunting — shared dashboards, no product home

- The configurable widget dashboard is the accounting pass's §1 (widget grid, drag order persisted); none of the shipping widget classes is product-specific. The de-facto "products home" is the plain Items list.

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboard grid (shared) | Same draggable widget board as accounting; products appear only inside `ExpensesByCategory` income-vs-expense grouping and item-based defaults screens — no product widget exists in `app/Widgets/` | `resources/views/common/dashboards/show.blade.php`, `app/Widgets/ExpensesByCategory.php` |
| Items module home | Flat item list (`Common/Items`) — see §2; no overview page, no KPIs | `app/Http/Controllers/Common/Items.php` |

### AureusERP — Filament resource lists are the home

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Products plugin — **absent dashboard** | No Overview/Page or Widget classes under `products/src/Filament/`; the product home is the `ProductResource` list's infolist/table (see §2/§3) | — |
| Inventory overview pointer | The warehouse-flavored overview lives in the `inventories` plugin (Warehouse's job; see §10 pointer) | `plugins/webkul/inventories/src/Filament/` |

### Carbon — declared submodule registry instead of a dashboard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Items submodule registry | The module surface is declared in code: `Items` route group with Parts, Consumables, Services, Tools, Methods, Materials (+ Material ×Type/Grade/Shape/Substance/Dimensions/Finishes masters), Item posting groups, UOM — each a saved-view-enabled list, permission-gated; icons per route | `apps/erp/app/modules/items/ui/useItemsSubmodules.tsx` |
| Module notes | `AGENTS.md` at module root states the domain split: one shared `item` table + per-type extension tables (`part`, `material`, `tool`, `consumable`, `service`), make-method versioning (Draft/Active/Archived), item tracking types (Inventory/Serial/Batch/Non-Inventory), replenishment systems (Buy/Make) | `apps/erp/app/modules/items/AGENTS.md` |

### Dolibarr — "Products & services area": a boxes page per type

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Products & services area | Not a stats board in the code: a boxes-area page (`boxes` area id `4`, same box framework as the home) split by `type` (0 products / 1 services) with per-page/dashboards libs; supports custom boxes + shortlists | `htdocs/product/index.php`, box framework `htdocs/core/boxes/modules_boxes.php` |
| Grip-to-boxes wiring | Box enable/order/reload via the generic box dashboard machinery | `htdocs/core/actions_addbox.inc.php`, `htdocs/core/lib/dashboard.lib.php` |

### ERPNext — Desk "Stock" workspace carries the Item entry points

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory workspace | Sidebar page with shortcuts to Item, Item Group, Item Attribute, Brand, Item Prices, plus stock reports; the closest thing to a catalog home | `erpnext/stock/workspace/stock/stock.json` |
| Catalog dashboards & number cards | Pre-canned dashboards/charts + KPI cards: Stock Value by Item Group, Item Shortage, Oldest items, Total active items | `erpnext/stock/dashboard_chart/{stock_value_by_item_group,item_shortage_summary,oldest_items}.json`, `erpnext/stock/number_card/{total_active_items,total_stock_value}.json` |
| Item onboarding | Desk onboarding step guiding item creation | `erpnext/stock/onboarding_step/create_item/` |

### Ever Gauzy — Angular inventory module as its own page group

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory module shell | Standalone inventory page tree, permission-gated (`ORG_INVENTORY_VIEW`): default child route shows the inventory-items table; sub-routes for product-types, product-categories, warehouses, merchants; create/edit/view/variant routing driven by `PermissionsGuard` | `apps/gauzy/src/app/pages/inventory/inventory-routing.module.ts`, root `apps/gauzy/src/app/pages/inventory/inventory.module.ts` |
| Module tabs frame | Inventory + its wizards/cards live in one module folder (components enumerated §2–§5) | `apps/gauzy/src/app/pages/inventory/components/` |

### metasfresh — generic windows + web-UI process packages

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Dashboard shell | Chart-widget host (antd `ChartWidget`/`ChartOptions`, drag-and-drop wrapper, sidenav) — the generic dashboard that any product window can host | `frontend/src/components/dashboard/{ChartWidget.js,ChartOptions.js,DndWidget.js,Sidenav.js}` |
| Generic document window | Every product/pricing screen renders through the one shell (list container + master window) — see §2 note | `frontend/src/containers/{DocumentListContainer,MasterWindowContainer}.js` |
| Product/pricing web-UI hooks | Backend Java "processes" (web-UI actions) for the product/pricing windows, e.g. discount-schema-break copy-to-otherSchema | `backend/de.metas.ui.web.base/src/main/java/de/metas/ui/web/{product,pricing}/process/` |

### Odoo — products kanban as home, no dedicated dashboard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Products kanban | Card view per product template: favorite-ordered, sample-data seeded (`sample="1"`), inline hover actions + on-hand qty chip for storable items; `view_mode kanban,list,form` for the products root menu | `odoo/addons/product/views/product_views.xml` (`product_kanban_view`, `product_template_action_product`) |

**BOSS implications.** No reference builds a standalone "products dashboard": the home is either a taxonomic workspace (ERPNext) or a nav registry (Carbon) or the product list itself (everyone else). For BOSS's catalog-manager home, copy the ERPNext workspace pattern — shortcut tiles into Product list, Categories, Attributes, Price lists, Brands — plus 2–4 KPI cards (active products, variants count, price-list coverage) rendered from Moqui screen portlets; keep Akaunting's lesson that widget plumbing is expensive, and fold any product stats into the list screen's KPI strip instead of a separate dashboard app.

---

## 2. Product lists & find views

### Akaunting — Blade items list + generic import/export

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Items list | Paged/grid item list with per-row dropdowns, grouped bulk actions (enable/disable/delete, category assign), the list layout block reused across masters; a "favorite" slot pins Items to the home rail | `resources/views/common/items/index.blade.php`, controller `app/Http/Controllers/Common/Items.php` (`index()` eager-loads `category, media, taxes`, sortable via `->collect()`) |
| Item create/edit | Create/edit share one page layout: sections split into info + billing + description tiles (§3) | `resources/views/common/items/{create,edit}.blade.php` |
| Import (mapping-review) | One generic import page for every type: upload sheet → column mapping/sample preview (with embedded how-to video and sample file link) → error report; items import goes through the same pipeline | `resources/views/common/import/create.blade.php`, `app/Http/Controllers/Common/Import.php`, `Items.php@import` (Excel import class `app/Imports/`) |
| Export & bulk | Excel export of the filtered list; shared bulk-action controller across modules | `app/Http/Controllers/Common/{BulkActions,Items}.php` (`export`/`destroy`), `resources/views/components/index/` layout parts |

### AureusERP — Filament grid with Bagisto-style type dimension

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product list table | `ProductsTable.php` behind `ListProducts.php`: columns incl. bagisto `type`, **grouping by type** (`Tables\Grouping\Group::make('type')`), a `type` select constraint (filter state saved in the browser) | `plugins/webkul/products/src/Filament/Resources/ProductResource/{Tables/ProductsTable,Pages/ListProducts}.php` |
| Type vocabulary | Product types and their labels come from the plugin Enums/Settings | `plugins/webkul/products/src/Enums/`, `plugins/webkul/products/src/Settings/ProductSettings.php` |

### Carbon — one table component per item subtype

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Subtype tables | Each item subtype (parts, consumables, services, tools) has its own table + header/properties components and a `use*Navigation` hook wiring deep links (edit route, detail tabs) | `apps/erp/app/modules/items/ui/Parts/{PartsTable,PartHeader,PartProperties}.tsx` + `ui/Parts/usePartNavigation.tsx`, `ui/Consumables/ConsumablesTable.tsx` (+ `ConsumableHeader/Properties`), `ui/Services/`, `ui/Tools/` |
| Saved views & flags | List screens integrate the global saved-views system (`useSavedViews`) and file-badge flags for attachment state on rows | `apps/erp/app/modules/items/ui/useItemsSubmodules.tsx`, `ui/Item/FileBadge.tsx` |

### Dolibarr — one mega search-form list + task list

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product/service list | Single `list.php` page per type: full GET-form find view searching reference, external ref (supplier ref), **barcode**, label, VAT rate, note-public/note-private, plus a distinctive **category filter** with an OR/AND operator toggle (`search_category_product_operator`), mass action bar at bottom | `htdocs/product/list.php` (search fields `$search_{ref,ref_ext,ref_supplier,barcode,label,vatrate,…}`, categories class include) |
| Top search box | Top-bar quick-search handlers hit products from any screen (registered search providers) | `htdocs/core/lib/functions.lib.php` (search box), product searchable in `htdocs/product/class/product.class.php` |

### ERPNext — Desk list with curated one-click list filters + item search service

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Item list view | Standard desk list tuned by `listview_settings`: extra fetched columns (uom, group, image, variant flags, sales/purchase flags), defaults to `disabled=0`, formatters for image chips | `erpnext/stock/doctype/item/{item_list.js,item.json}` |
| Curated list filters | JSON-defined one-click filters surfaced in the list side panel: Batch-tracked, Disabled, Fixed assets, Serialized, Services, Stock items, Templates | `erpnext/stock/doctype/item/list_filter/{item_batch_tracked,item_disabled,item_fixed_assets,item_serialized,item_services,item_stock_items,item_templates}.json` |
| Item quick search | Item-search selector service for nested pickers (search dialog used by docs/pickers) with HTML templates for result rendering | `erpnext/stock/doctype/item/item_search.py`, `erpnext/stock/doctype/item/templates/{item,item_row}.html` |
| Item dashboard | Dashboard link counts (per linked doc type) rendered on the Item form (§10) | `erpnext/stock/doctype/item/item_dashboard.py` |

### Ever Gauzy — the inventory list + its neighbor masters

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventory items table | The list landing page of the Inventory module: searchable grid of products/variants with FSM-ish selectors strip (org/version), column settings, add/edit routing into the form | `apps/gauzy/src/app/pages/inventory/components/table-inventory-items/table-inventory.component.ts` (+ `.html`) |
| Option masters as lists | Product types/categories/warehouse/merchant tables share the same table sub-components | `…/components/{manage-product-types,manage-product-categories,manage-warehouses,manage-merchants}/` |

### metasfresh — everything through the one generic grid

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Generic document list | All product/pricing screens are backend window instances; the React "find/view" layer is one `DocumentList` shell with the metadata-driven filters/saved-views living in the window + filters packages | `frontend/src/containers/{DocumentListContainer,MasterWindowContainer}.js`, window internals `frontend/src/components/window/`, filter bar `frontend/src/components/filters/` |
| Product attribute decode | `pattribute` web-UI package adds attribute search/decode to the grid columns | `backend/de.metas.ui.web.base/src/main/java/de/metas/ui/web/pattribute/` |

### Odoo — list + a rich search view with favorites

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product template list/search | Search view with filters & groupings (type, category tree; sold/purchased/storable toggles driven by flags), tags, variant-agnostic searches; the list "expo" columns config; kanban renderer already seen (§1) | `odoo/addons/product/views/product_views.xml`, `odoo/addons/product/views/product_template_views.xml` |
| Product-catalog picker | OWL kanban controller/renderer/search-panel reusable as an embedded product picker (used by sale order lines via `order_line/`), with favorite toggle & quantity stepper on cards | `odoo/addons/product/static/src/product_catalog/{kanban_controller,kanban_renderer,kanban_record,kanban_model,product_catalog_search_panel}.*` |
| Pricelist report panel | Editable pricelist breakdown panel drawn from the product list (§6) | `odoo/addons/product/static/src/js/pricelist_report/` |

**BOSS implications.** The catalog list is the workhorse: BOSS should make the Product list a saved-view-first screen (Carbon + metasfresh) with per-column filters incl. reference/external-supplier-ref/barcode (Dolibarr), one-click curated facets (batch-tracked/serialized/services — ERPNext's `list_filter/*.json` is a cheap high-value pattern), and category multi-select with OR/AND operator (Dolibarr). Excel import with a mapping-review step and error report (Akaunting) belongs in BOSS's product import; a type/grouping dimension (simple/service/storable, AureusERP) should be a saved-view filter, not a separate app.

---

## 3. Product forms & master data

### Akaunting — one short form, sections not tabs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Item create/edit | Sections stacked on one page: **General** (name, category, description textareas, radio/checkbox toggles + tax select) and **Billing** (price, cost, tax select) + right rail with enabled toggle and more-actions (duplicate etc.); one record = flat item master, no variants at all, and notably **no picture field on the item form in this checkout** | `resources/views/common/items/{create,edit}.blade.php`, shared form widgets `resources/views/components/form/`, controller `app/Http/Controllers/Common/Items.php` |
| Item tax select helper | Tax-select popovers reuse the shared tax select component rather than a sub-screen | `resources/views/components/form/tax.blade.php` |

### AureusERP — sectioned Filament form with an injection registry

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product form | 3-column schema built from named **sections**: left = General (name/description/tags/category), Media (gallery), Inventory (fallback); right = Settings (UOM, brand, etc.) + Pricing — crucially a `ProductSchemaRegistry` lets every other plugin inject blocks at slots (`left.general.after`, `left.inventory`, `left.append`, `right.*`, `hidden`) | `plugins/webkul/products/src/Filament/Resources/ProductResource/Schemas/ProductForm.php`, `…/Schemas/ProductInfolist.php`, registry `…/ProductResource/Support/ProductSchemaRegistry.php` |
| View/Create/Edit pages | Filament resource pages incl. a `ViewProduct` infolist page (read-only detail face) and `ManageAttributes`/`ManageVariants` sub-pages (§4) | `plugins/webkul/products/src/Filament/Resources/ProductResource/Pages/{CreateProduct,EditProduct,ViewProduct}.php` |

### Carbon — one master form with expert sub-forms per concern

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Item form + record header | `ItemForm`/`SelectedItemProperties` feed per-subtype forms (`PartForm`, `ConsumableForm`, …); header shows record info + revision state + supersession notice; sub-forms: Costing, SalePrice, Planning, Purchasing, Manufacturing, Reorder policy, Supersession, Risk register — the master-data surface is really a tabbed stack | `apps/erp/app/modules/items/ui/Item/{ItemForm,ItemRecordHeader,SelectedItemProperties,ItemCostingForm,ItemSalePriceForm,ItemPlanningForm,ItemPurchasingForm,ItemManufacturingForm,ItemReorderPolicy,ItemSupersessionForm,ItemRiskRegister}.tsx` |
| Revisions & change notices | Engineering-change flow: revision rows with form + change notice actions/types, change-notice approval surfaces | `apps/erp/app/modules/items/ui/{RevisionForm,ChangeNotice,ChangeNoticeActions,ChangeNoticeTypes}/` (under `ui/Item/RevisionForm.tsx` + `ui/ChangeNotice*/`) |
| Storage & physicality | Storage fields + material-dimension/finish/grade/shape/substance masters feeding item classification fields | `apps/erp/app/modules/items/ui/{Item/ItemStorageFields,MaterialDimensions,MaterialFinishes,MaterialGrades,MaterialShapes,MaterialSubstances,MaterialTypes}/` |

### Dolibarr — tabbed card.php, tab set assembled at runtime

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product card | One `card.php` GET page, tab content switched by `tab` param: General (the real master data: ref, label, type, category, VAT, barcode fields, extrafields with per-field permission), Price tab (§6), Stock (§10), Lifecycle (end-of-life, replacement), Attachments (§8), Note, Contacts, Agenda, Translations (§9), Messaging; hooks extend tabs (`tabContentCreateProduct`) | `htdocs/product/card.php`, tab builder `htdocs/core/lib/product.lib.php` |
| Notable behaviors | Ref regeneration logic (renaming cleans orphaned index rows), optional mass-barcode/define-composed-product actions in card actions | `htdocs/product/card.php` (action handlers), mixin `htdocs/core/class/extrafields.class.php` |

### ERPNext — the desk Item form (the largest in the repo)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Item form | One desk form whose sections show/hide by flags: naming series & item_code (auto), group/UOM/disabled, **is_stock_item/is_fixed_asset/is_sales_item/is_purchase_item** switches, opening stock + valuation_rate + standard_rate, brand/description, barcodes child, inventory section (shelf life, end-of-life, default material request type, valuation method, warranty, weight), reorder levels child (§10), UOM conversions child, serial & batch section, variants section (§4), defaults + taxes children (§11/§10) | `erpnext/stock/doctype/item/{item.json,item.js,item.py}` |
| Naming & validations | `item.py` naming hooks (set item_code from series/item_name rules), duplicate-barcode validation, item-group mandatory/leaf validation | `erpnext/stock/doctype/item/{item.py,item.js}` |
| Item defaults | Per-company child defaults: default warehouse, default price list, default discount/inventory accounts (+ `vf_*` fallback fields) — keeps postings/fulfillment automatic | `erpnext/stock/doctype/item_default/item_default.json` |

### Ever Gauzy — the multi-tab product wizard

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product form | Photo gallery on the left rail + `nb-tabset` with **Main** (language-aware name/desc — store multiple translations inline via language selector), **Tags & Options** (tag chips + variant-option toggles) and **Variants** tabs; save/next with redirected-to-variant flow | `apps/gauzy/src/app/pages/inventory/components/edit-inventory-item/{product-form.component.ts,product-form.component.html}`, gallery sub-component `…/edit-inventory-item/product-gallery/` |
| Options & variant mgmt | `options-form` and `variant-form`/`variant-table` components mounted by the same page (§4) | `…/edit-inventory-item/options-form/`, `…/edit-inventory-item-variant/` |
| Domain model | Product = master + variants: gauzy core libs define product (name/description translation entities), option-chain categories and option groups; plugin carry-over seen in the `catalog` plugin | `packages/core/src/lib/product/`, `packages/core/src/lib/{product-option,product-variant,product-variant-price}/` |

### metasfresh — metadata-defined product window, business code in `de.metas.*`

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product master window | Rendered by the generic master-window shell; layout, tabs, included attributes come from AD window definitions (e.g. `M_Product` + `M_HU_PI*` handling units); BOSS's Moqui screen XML plays the same role | backend anchor `backend/de.metas.business/src/main/java/de/metas/product/`, UI shell `frontend/src/components/window/` |
| Product codes & scanning | Product-code resolution engine (attribute-based scanned codes, GS1) behind the product lookup forms | `backend/de.metas.business/src/main/java/de/metas/product/`, `backend/de.metas.business/src/main/java/de/metas/gs1/` |

### Odoo — the multi-tab template form, price list embedded

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product template form | Tabbed form: **General Information** (name/SKU/category, tags, description), **Sales** (upsell/cross-sell groups, description surfaces, packaging barcodes + extra barcodes group), **Prices** — an inline embedded price-list tree with `add_product_price` for the current customer context, **Purchase** (Vendor Bills group), **Inventory** (logistics: traceability/lots, weight & volume), + Documents stat/button, internal-notes page; "template-only" copy strips variant bits | `odoo/addons/product/views/product_views.xml` (`product_template_form_view`), lighter face in `odoo/addons/product/views/product_template_views.xml` (`product_template_only_form_view`) |
| Template-only lists | Contextual list variants "sellable" or "purchasable" (columns complete accordingly) | `odoo/addons/product/views/product_template_views.xml` ({`product_template_list_view_sellable`,`…_purchasable`}) |
| Update Quantities grid | Editable inline quantity grid over variants (list with on-hand/forecasted sums) — quick bulk edit of stock quantities from the product screen | `odoo/addons/product/views/product_views.xml` (`product_view_list_qty`, action `product_variant_edit_qty_action`) |
| Attribute-value wizard | Mass-update product attribute values from the template list | `odoo/addons/product/wizard/update_product_attribute_value{,_views}.py` |

**BOSS implications.** Item master forms divide cleanly: a compact "general" core (Akaunting), a registry-injectable sectioned form (AureusERP's ProductSchemaRegistry slot pattern is exactly how BOSS modules should extend the product form without forking it), and a tabbed expert stack (Dolibarr, ERPNext, Odoo). Bought-master fields worth copying: ERPNext's flag-driven sections (stock/fixed-asset/sales/purchase toggles reshape the form), per-company defaults child table, inline translated names/descriptions (Odoo translations + gauzy language selector), and Odoo's trick of embedding price-list editing inside the product form (see §6). Revisions/supersession (Carbon) matter only where the BOSS tenant does engineer-style change control — gate it rather than adding it to the core form.

---

## 4. Variants & attributes

### Akaunting — **absent**: flat item master

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | Items are a flat list master — no variant machinery, no attribute/feature engine (categories are the only dimension) | — |

### AureusERP — Bagisto-derived variant management inside the product resource

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Attribute master | `AttributeResource` CRUD (Bagisto product attribute port: code/label/type per attribute incl. selects) with Schemas/Tables split | `plugins/webkul/products/src/Filament/Resources/AttributeResource/` (+ `AttributeResource.php`) |
| Manage Attributes (per product) | Sub-page `ManageAttributes` inside the product form: pick attribute families/lines for this product (Bagisto "attributes per product" shapes) | `plugins/webkul/products/src/Filament/Resources/ProductResource/Pages/ManageAttributes.php` |
| Generate variants & Manage Variants | `GenerateVariantsAction` (action inside ManageAttributes page that creates variant records from attribute-value combinations) + `ManageVariants` (`ManageRelatedRecords` tab: variant table with values/price, PDF export via DomPDF) | `…/ProductResource/Actions/GenerateVariantsAction.php`, `…/ProductResource/Pages/ManageVariants.php` |

### Carbon — **absent**: characteristics instead of variants

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No variant matrix; the nearest analogues are (a) the materials-properties taxonomy (type/grade/shape/substance/finish as FK masters) and (b) `Item Tracking Type` (Inventory/Serial/Batch/Non-Inventory) which segments items behaviorally the way variants would | `apps/erp/app/modules/items/AGENTS.md` (domain notes), `apps/erp/app/modules/items/ui/Material*/` |

### Dolibarr — a dedicated `variants` module generating combinations

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Attribute & value masters | Attribute list + attribute card with value grid (create/edit inline per attribute); barcode-shaped AJAX: fetch values, order values | `htdocs/variants/{list.php,card.php}`, templates `htdocs/variants/tpl/productattributevalueline_{create,edit,view}.tpl.php`, AJAX `htdocs/variants/ajax/{get_attribute_values,orderAttribute}.php` |
| Combination generator | Per-product "Generate combinations": builds the cartesian product from attribute-value pairs (ProductCombination + ProductCombination2ValuePair classes) via AJAX step, then a combination list with bulk price/weight adjustments | `htdocs/variants/combinations.php`, `htdocs/variants/ajax/getCombinations.php`, classes `htdocs/variants/class/{ProductCombination,ProductCombination2ValuePair}.class.php` |
| Combination record | Per-combination card view (variant price/stock override, link back to parent) — `htdocs/variants/list.php` lists combos of a parent | `htdocs/variants/{card.php,list.php}` |
| Product-side plumbing | Parent product card gains variant sections; variant references generatable via Dolibarr ref engine | `htdocs/product/card.php`, `htdocs/variants/lib/variants.lib.php` |

### ERPNext — dialog-driven variant builder on the Item form

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Variant settings on Item | `has_variants` tick converts the Item into a template (blocked from transactions); `variant_based_on` = Item Attribute (or "Manufacturer"/"Serial No"); info banner explains Copy-Fields-to-Variant from settings | `erpnext/stock/doctype/item/item.js` (lines ~240–300), settings `erpnext/stock/doctype/item_variant_settings/item_variant_settings.{js,json}` |
| Single/multiple variant dialogs | Two built client-side dialogs: one-attribute quick dialog, and a **matrix dialog** with per-value cells, committed-pill validation and "Create Variants" that calls server `item_variant.get_variant` to materialize child Items | `erpnext/stock/doctype/item/item.js` (`erpnext.item.show_{single,multiple}_variants_dialog`), server `erpnext/stock/doctype/item/item_variant.py` |
| Attribute master | `Item Attribute` (HTML-type values, numeric-range support) + `Item Attribute Value` child rows with **HTML color swatches**; `item_attribute` doctype UI | `erpnext/stock/doctype/item_attribute/{item_attribute.js,item_attribute.json}`, `erpnext/stock/doctype/item_attribute_value/` |
| Variant records | A variant is itself an Item row (`variant_of`, `item_variant` + `item_variant_attribute` child tables); variant details report exists | `erpnext/stock/doctype/{item_variant,item_variant_attribute}/`, report `erpnext/stock/report/item_variant_details/` |

### Ever Gauzy — options tab + variant grid/graph

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Variant wizard | The product form's Variants tab opens the variant approach at `edit/:id` child route (variant request through option chain); automatic generation + variant-slotting UI | `apps/gauzy/src/app/pages/inventory/components/edit-inventory-item/variant-table/`, nav route `apps/gauzy/src/app/pages/inventory/inventory-routing.module.ts` (`:itemId/variants/:itemVariantId`) |
| Option-form & variant-form | `option-form` rows (option group checkboxes built from defined list) + variant form's sku/price/discount/quantity/taxed entry, feature selects | `apps/gauzy/src/app/pages/inventory/components/edit-inventory-item/options-form/{options-form.component.ts,.html}`, variant form `apps/gauzy/src/app/pages/inventory/components/edit-inventory-item-variant/variant-form.component.ts` |
| Variant domain | ProductVariant entity in core (`product-variant` lib) + variant price (`product-variant-price`) — the "same product, per-tenant price" trick; catalog plugin links variants to channels/collections/media | `packages/core/src/lib/product-variant/`, `packages/core/src/lib/product-variant-price/`, `packages/plugins/catalog/src/lib/product-variant-*` |

### metasfresh — product-attribute decoding instead of variant SKUs

| Screen/page | What it is | Key files |
| --- | --- | --- |
| pattribute (product attributes) | Web-UI attribute value model: **one product row per attribute combo** — products get extra "included attributes" columns through the attribute-code naming convention (e.g. `P0001_A_B`), with decoding/search in the list | `backend/de.metas.ui.web.base/src/main/java/de/metas/ui/web/pattribute/`, business `backend/de.metas.business/src/main/java/de/metas/product/` |
| Attributes-included tab | Window tab machinery appending attribute data to a document/product grid | `backend/de.metas.business/src/main/java/de/metas/attributes_included_tab/` |

### Odoo — attribute lines on templates + 3 creation modes

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Attribute & value masters | `product.attribute` + `product.attribute.value` forms/lists; attribute has `create_variant` selection: `always/no_variant/dynamic/single` — covering classic variant generation, informational-only attributes, and on-demand creation | `odoo/addons/product/views/product_attribute_views.xml`, model `odoo/addons/product/models/product_attribute{,_value}.py` |
| Attribute lines on product | `product.template.attribute.line` embedded tree on the template form: choose attribute + values; multi-variant SQL check `CHECK(display_type != 'multi' OR create_variant = 'no_variant')` keeps model sane | `odoo/addons/product/views/product_template_attribute_line_views.xml`, model `odoo/addons/product/models/product_template_attribute_line.py` |
| Variant matrix on template | The template form's variant matrix (auto-created `product.product`s), variant list view + per-combination "Update Quantities" grid (§3) | `odoo/addons/product/views/product_views.xml` (variant list + qty grid views) |
| Mass attribute update | List-level action to update attribute values across selected templates | `odoo/addons/product/wizard/update_product_attribute_value{,_views}.py` |

**BOSS implications.** BOSS needs one variant model with three flavors visible in the UI: (1) **matrix preview + generate** — a builder that computes combinations client-side and posts one request (ERPNext's matrix dialog + Dolibarr's combination generator is the UX to copy), (2) **dynamic/no-variant informative attributes** — Odoo's `create_variant` spectrum avoids hundreds of useless SKUs, (3) **variant = row, attribute values = child** — all the suites store variants as full product rows (ERPNext Item, Odoo product.product), which is what BOSS's Moqui entity model should do too (keeps pricing/inventory/documents uniform). Keep a copy-fields-to-variant config (ERPNext item_variant_settings) so catalog managers never hand-edit variant descriptions; and don't follow metasfresh/Carbon here — attribute-encoded product codes blur the line between physical SKUs and descriptive attributes (worth noting only as a legacy pattern).

---

## 5. Categories & taxonomy

### Akaunting — one generic categories screen shared by all modules

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Categories list & editor | Single `settings/categories` page family used for item/income/expense/other categories: inline **parent/child nesting** rendered as collapsible child rows (`data-collapse="child-<id>"`), per-type tabs above; item category select on the item form reads from it | `resources/views/settings/categories/{index,create,edit,sub_category}.blade.php`, controller `app/Http/Controllers/Settings/Categories.php` |
| Shared select component | Categories attach through a generic modal-based category select on documents too | `resources/views/components/form/group/category.blade.php` |

### AureusERP — Bagisto-style category resource with stats

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Category CRUD | `CategoryResource` (create/edit/pages) with form + infolist slots: parent category folder paths, meta SEO fields, position drag; category card button-box shows product count that links to the product list | `plugins/webkul/products/src/Filament/Resources/CategoryResource/` (+ `Schemas/{CategoryForm,CategoryInfolist}.php`) |

### Carbon — **absent** as commerce taxonomy; posting groups instead

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No category/tag tree for items; nearest analogues are item posting groups (accounting classification) and the material-properties taxonomy (§3) | `apps/erp/app/modules/items/ui/ItemPostingGroups/` |

### Dolibarr — generic tree-based categories for every type

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Category cards & tree | `htdocs/categories/index.php` (tree browser page per type) + `card.php`/`edit.php`; sub-category tree widget per category page loads the full arborescence (`get_full_arbo`) with jquery.TreeView; many types share the table (product, supplier, customer, ...) so a product can belong to multiple categories | `htdocs/categories/{index.php,card.php,edit.php,viewcat.php}`, classes `htdocs/categories/class/categorie.class.php` |
| Category pages extras | Per-category: object list (products/customers/...), translations per language (`traduction.php`), photos manager (`photos.php`), info page | `htdocs/categories/{traduction.php,photos.php,info.php}` |
| Category assignment in product screens | Product card + list filter tie into categories; the same tree is the "category filter" facet in product lists (§2) | `htdocs/core/class/html.formother.class.php`, `htdocs/product/card.php` |

### ERPNext — item group is a real Tree master

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Item Group tree | Desk doctype with `is_tree=1`, default view Tree, "Item Group Tree" route + custom button; leaf-node enforcement (mandatory `is_group=0` for sellable); website item tree gate | `erpnext/setup/doctype/item_group/{item_group.js,item_group.json}`, tree master `erpnext/setup/doctype/item_group/` |
| Brand & catalogue tags | Brand separate doctype parallel to groups; customer/supplier "groups" also exist but live outside products; `POS Item Group` (retail) groups POS tiles | `erpnext/setup/doctype/brand/` (beside item_group), `erpnext/accounts/doctype/pos_item_group/` |

### Ever Gauzy — category manager inline in the Inventory module

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product categories | Sub-route `product-categories` in the inventory module: the category manager assembles category CRUD, image/color/icon fields and parent selection inline; categories are org-scoped, attach on the product form's Tabs & Options region | `apps/gauzy/src/app/pages/inventory/components/manage-product-categories/`, route `apps/gauzy/src/app/pages/inventory/inventory-routing.module.ts` |
| Category selector | Shared `product-category-selector` component reused wherever products are picked (including purchase/sales screens) | `packages/ui-core/shared/src/lib/product/product-category-selector/` |

### metasfresh — taxonomy via the generic shell

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product-category windows | Product classes/categories etc. are AD windows rendered in the generic shell (de.M_Product_Category style backend records); semantics live in the business package, not in bespoke screens | `backend/de.metas.business/src/main/java/de/metas/product/`, shell `frontend/src/containers/MasterWindowContainer.js` |

### Odoo — categories with a smart-button product count + tags

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product categories | Tree/form with parent field, company split, and an embedded "children" detail plus **"View Products" smart button** (product_count stat) linking to the filtered product list | `odoo/addons/product/views/product_category_views.xml`, model `odoo/addons/product/models/product_category.py` |
| Tags | Lightweight `product.tag` many-to-many chips with kanban/tag widget colors (searchable in every product list view) | `odoo/addons/product/views/product_tag_views.xml`, model `odoo/addons/product/models/product_tag.py` |
| Country groups | `res.country.group` for regional price computation (§6) | `odoo/addons/product/views/res_country_group_views.xml` |

**BOSS implications.** Two usable taxonomies, not one: category tree (structural, drives navigation, lookups and reports — copy Dolibarr's generic all-types design so BOSS can reuse the same tree for products and vendors) and tags (Odoo's free-label chips). Item groups/categories must support parent/child with a single "view products in this branch" deep link (Odoo's category smart-button), keep translations per node (Dolibarr `traduction.php` / Odoo), and avoid Carbon's approach of category-as-posting-group — keep classification for accounting separate from catalog taxonomy. Multi-type flexibility (product/supplier/customer in one table) is cheap and future-proof in a Moqui entity.

---

## 6. Pricing & costs

### Akaunting — plain price fields on the item

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sale/purchase price fields | Item form billing section only: sale price & purchase price + tax select (+ optional description); no price lists, no tiers, no effective dating — prices live on document lines, computed there | `resources/views/common/items/create.blade.php` (Billing section), logic in `app/Http/Controllers/Common/Items.php` |

### AureusERP — price list with per-item/min-qty rules

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Price list CRUD | `PriceListResource`: header (name, currency, company, active) + **item lines** with product/category/customer scope, min quantity, price type (fixed/discount?), price, validity period, apply-to selector | `plugins/webkul/products/src/Filament/Resources/PriceListResource/` (+ `Schemas/PriceListForm.php`), engine models `plugins/webkul/products/src/Models/` |
| Pricing rules engine | The pricelist resolution/filter logic sits in plugin Services | `plugins/webkul/products/src/Services/` |

### Carbon — separate price & costing forms + cost history chart

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Sale price form | Per-item: currency select, priceIncludingTax toggle (VAT-inclusive storage) | `apps/erp/app/modules/items/ui/Item/ItemSalePriceForm.tsx` |
| Costing form | `costingMethod` select (FIFO/Average/etc.; **Standard costing option explicitly hidden** in code with a "not implemented yet" comment), make-method-dependent costing; demand projection helpers live module-side | `apps/erp/app/modules/items/ui/Item/ItemCostingForm.tsx`, `apps/erp/app/modules/items/demand-projection.ts` |
| Cost history | Chart component plotting item cost over time (price-change visualization) | `apps/erp/app/modules/items/ui/Item/ItemCostHistoryChart.tsx` |

### Dolibarr — price page with history, multi-level prices & dynamic expressions

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Price page | `price.php` per product: current price + **multiprices levels** (conf `PRODUIT_MULTIPRICES_LIMIT`, e.g. retail/wholesale/qty tiers), with per-level base type (HT net-of-tax/TTC gross) + min price + `npr` (VAT-non-recoverable) flag; every change writes a **price-history log** row (user, date, old/new values) | `htdocs/product/price.php`, history writer `htdocs/product/class/product.class.php` (`_log_price` → `product_price` rows), per-customer prices `htdocs/product/class/productcustomerprice.class.php` |
| Dynamic price engine | Formula-based price evaluation: price expressions/variables parsed per product (price_parser) — rules can drive prices from cost/markup, dimensions etc. | `htdocs/product/dynamic_price/` (admin pages + `class/price_parser.class.php`) |
| Cost fields | Purchase cost & efficiency margin on product card; margin module ties cost→price visibility | `htdocs/product/class/product.class.php` (cost fields), margin module `htdocs/margin/` |

### ERPNext — price lists + item prices (note: both under `stock/`)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Price list master | Header w/ currency + buying/selling applicability flags + `price_not_uom_dependent` + countries child list | `erpnext/stock/doctype/price_list/{price_list.js,price_list.json}` (also `price_list_country/` child) |
| Item Price | Per item row: item_code, price list, customer/supplier, buying/selling flag, currency, **price_list_rate**, uom & packing_unit, valid_from (plus validity window) — the ledger of every price ever quoted | `erpnext/stock/doctype/item_price/{item_price.js,item_price.json,item_price.py}` |
| Price reports | "Item Prices" list report + item-wise price-list-rate report powering price maintenance screens | `erpnext/stock/report/{item_prices,item_wise_price_list_rate}/`, customer-side `erpnext/selling/report/customer_wise_item_price/` |
| Cost handling on Item | `standard_rate` & `valuation_rate` fields on the Item itself; item taxpayer logic on posting lives in stock/valuation (§10 pointer) | `erpnext/stock/doctype/item/item.json` |

### Ever Gauzy — per-variant retail price rows

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Variant price entity/graphql | `ProductVariantPrice` per variant with `retailPrice` + `retailPriceCurrency` (+ standard base-entity audit fields); variant form's retailPrice/offer fields populate it | `packages/core/src/lib/product-variant-price/{product-variant-price.entity.ts,product-variant-price.service.ts}`, UI `packages/plugins/catalog/src/lib/product-variant-sale/` (variant sale/cost dedup) |
| Variant sale pricing set | Variants exposed through the catalog plugin with per-channel sale price rows (variant/price-by-channel) | `packages/plugins/catalog/src/lib/{product-variant-sale,product-channel}/` |

### metasfresh — the deepest pricing engine (all metadata/UI driven)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Pricing engine | Rule-tree pricing: price systems → price lists → discount schema breaks with margin/currency/attribute-based conditions; copy-schema-break processes added to the window UI | `backend/de.metas.business/src/main/java/de/metas/pricing/`, legacy `backend/de.metas.business/src/main/java/org/adempiere/pricing/`, web-UI processes `backend/de.metas.ui.web.base/src/main/java/de/metas/ui/web/pricing/process/` |
| Costing engines | FIFO/standard/average costing with batches & movement costing; cost-revaluation + customs-tariff cost rates for imports | `backend/de.metas.business/src/main/java/de/metas/{costing,costrevaluation,customstariff,quantity}/` |

### Odoo — pricelist rules with formulas + an embedded report

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Pricelist & rules | `product.pricelist` form + `product.pricelist.item` rule grid: compute_price = fixed / **formula (markup/discount)** / percentage, min_quantity, date ranges, scope = product/category/product-category/customer; XML formula-only pricelists for technical users | `odoo/addons/product/views/{product_pricelist_views,product_pricelist_item_views}.xml`, compute engine `odoo/addons/product/models/product_pricelist{_item}.py` |
| Pricelist report | Server action + editor: printable multi-currency pricelist report; JS panel can render the breakdown inside product context | `odoo/addons/product/report/{product_pricelist_report.py,product_pricelist_report_templates.xml}`, UI `odoo/addons/product/static/src/js/pricelist_report/` |
| Cost side | Cost is a field per variant (`standard_price` visible in the template form's variant tab); revaluation views come from stock_account | `odoo/addons/product/views/product_views.xml` (cost group), `odoo/addons/stock_account/views/{product_views,product_value_views}.xml` |
| Daily-rates calendar | Pricelist-adjacent currency rate calendar widget in product static JS | `odoo/addons/product/static/src/js/daily_rates_calendar/` |

**BOSS implications.** Pricing needs both a **rule list UI** (price list header + scoped rules with product/category/customer, min qty, validity dates, currency — AureusERP/ERPNext/Odoo converge on this shape) and a **price-action history log** (Dolibarr, which stores every change with old/new values — perfect for a BOSS audit trail). Keep effective-dated rules rather than edited historical rows when querying (ERPNext Item Price is both), support VAT-inclusive storage (Carbon `priceIncludesTax`, Dolibarr HT/TTC) and min-quantity tiers. Costs deserve their own engine independent of price: item standard cost + valuation method + cost-history chart (Carbon), but keep stock valuation mechanics in Warehouse like every reference does (ERPNext item_price vs stock valuation, Odoo stock_account screens).

---

## 7. Product suppliers & purchasing references

### Akaunting — **absent**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | Items carry no supplier linkage at all; purchasing references are only COGS on the item form | — |

### AureusERP — supplier data lives in Purchasing (pointer), products has the model only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **No supplier UI in products** | The products plugin has a `ProductSupplier` model (`Product hasMany ProductSupplier`) but **no Filament resource or form renders it** — supplier faces belong to the `purchases` plugin's clusters | `plugins/webkul/products/src/Models/ProductSupplier.php`, `plugins/webkul/purchases/src/Filament/{Admin,Customer}/` |

### Carbon — supplier part records drive the item's purchasing defaults

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Supplier parts on item | `SupplierParts` list + `SupplierPartPrice` rows under the item's Purchasing tab: per-supplier part numbers and prices; the item purchasing form auto-pulls distributor price/preferred supplier from the **preferred supplier's supplier-part record** | `apps/erp/app/modules/items/ui/Item/SupplierParts/{SupplierParts,SupplierPartPrice}.tsx`, `apps/erp/app/modules/items/ui/Item/{SupplierPartForm,ItemPurchasingForm}.tsx` |

### Dolibarr — supplier prices tab on the product

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Supplier prices page/tab | `price_suppliers.php`: per-supplier price rows on the product (ref & supplier price list via `fournisseur.product.class`), validity, quantity breaks; **advanced permission** `product_advance.write_supplier_prices` gates writing supplier prices separately from product edit | `htdocs/product/price_suppliers.php`, class `htdocs/fourn/class/fournisseur.product.class.php` |
| On orderlines | PO line supplier-ref sync writes back `search_ref_supplier`-searchable data; supplier ref appears in product list filters (§2) | `htdocs/fourn/class/fournisseur.product.class.php`, `htdocs/product/list.php` |

### ERPNext — supplier children on the Item

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Item supplier child | Simple child table: `supplier` + `supplier_part_no` (the SKU as the vendor knows it); note the per-company `item_default` child does **not** carry a default supplier — only warehouse/price-list/accounts | `erpnext/stock/doctype/item_supplier/{item_supplier.json,*.py}`, `erpnext/stock/doctype/item_default/item_default.json` |
| Supplier lead time child | Per supplier: purchase_time + buffer_time + is_default flag — drives purchasing MRP | `erpnext/stock/doctype/item_lead_time_supplier/` |

### Ever Gauzy — **absent** vendor catalogs in product UI

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | Inventory/product module has no supplier mapping (vendors are CRM records elsewhere in gauzy; product-variant prices are channel-scoped instead) | — |

### metasfresh — BPartner product records as a first-class engine

| Screen/page | What it is | Key files |
| --- | --- | --- |
| BPartner product | Vendor/partner-specific product identity engine (per-partner product code/name/query, effective records, exclusion) on top of the product; callout helpers on the bpartner window | `backend/de.metas.business/src/main/java/de/metas/bpartner_product/`, `backend/de.metas.adempiere.adempiere/base/src/main/java/de/metas/bpartner/product/` |
| Purchasing references | Receipt schedules/procurement windows pick up vendor product data (`de.metas.vendor.gateway.api` handles external supplier catalogs) | `backend/de.metas.procurement.base/`, `backend/de.metas.vendor.gateway.api/` |

### Odoo — "Vendor Information" as its own mini-master

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Supplierinfo CRUD | Standalone searchable list ("Vendor") + per-vendor price rows: vendor, product (tmpl or variant), unit price, min quantity, currency, **validity dates**, plus delivery lead time & company; server-side "warnings on purchase orders" group extends the product form | `odoo/addons/product/views/product_supplierinfo_views.xml`, model `odoo/addons/product/models/product_supplierinfo.py` |
| Purchase-side product views | Purchase module patches the product form (vendor field `seller_ids`, purchase description, PO warning group) and adds forecasted columns in picking-views | `odoo/addons/purchase/views/product_views.xml` |

**BOSS implications.** Supplier product references want to be their own entity, not item fields: vendor + vendor's part number + unit price + min qty + validity + lead time (Odoo/Carbon/ERPNext agree). BOSS should keep it in the Purchasing app but render it as a Product-360 tab (dolibarr-style "suppliers tab on product"), gate price writing behind a dedicated permission (Dolibarr's `write_supplier_prices` split is a good security pattern), and let a preferred/primary vendor flag feed default costing/purchasing defaults (Carbon preferred-supplier, ERPNext `is_default` lead-time row).

---

## 8. Media, documents & attachments

### Akaunting — a generic attachments pipeline only

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Uploads controller | Every module's attachments route through one `Common/Uploads` controller (file route/delete via signed URLs) — used for invoice/bill files as much as anything on items; the item form itself has no media/picture widget in this checkout | `app/Http/Controllers/Common/Uploads.php`, shared file group `resources/views/components/form/group/file.blade.php` |

### AureusERP — gallery FileUpload on the form section

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product media section | `mediaSection` in the product form: `FileUpload::make('images')->image()` multi-upload; images persist as an array cast on the Product model | `plugins/webkul/products/src/Filament/Resources/ProductResource/Schemas/ProductForm.php` (`mediaSection`), model `plugins/webkul/products/src/Models/Product.php` (`images` array cast) |

### Carbon — dedicated item documents panel over a files module

| Screen/page | What it is | Key files |
| --- | --- | --- |
| ItemDocuments | Panel inside the item detail rendering `ItemFile` rows with optimistic-upload merge (`attachmentsByName` map joins pending + saved files), delete/preview, and files-module integration | `apps/erp/app/modules/items/ui/Item/ItemDocuments.tsx`, files module `packages/files/` (imported via `@carbon/files`) |

### Dolibarr — per-object document page with PDF merge

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Documents tab | `product/document.php`: list of uploaded/generated docs for the product with actions (generate doc template, delete), shared tpl for headers/actions; hooks `productdocuments` extend panels | `htdocs/product/document.php`, shared `htdocs/core/tpl/document_actions_post_headers.tpl.php` |
| Generated PDF merge | Documents tab can merge proposal PDFs into the product documents (per-product merged-file aggregation) | `htdocs/product/document.php` (merge block ~line 304), merge class `htdocs/product/class/propalmergepdfproduct.class.php` |

### ERPNext — desk attachments + spec child grid

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Desk attachments | Item form image/attachments are the Framework's standard: `image` field + attachments sidebar (files framework-wide); nothing product-specific beyond `item_website_specification` child for ecommerce specs | `erpnext/stock/doctype/item/{item.json,item.js}`, `erpnext/stock/doctype/item_website_specification/` |

### Ever Gauzy — gallery + merchandising image assets

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product gallery | `product-gallery` subcomponent on the product form (photo strip + featured) | `apps/gauzy/src/app/pages/inventory/components/edit-inventory-item/product-gallery/` |
| Image asset entities | Product carries `imageUrl`, `featuredImage (ImageAsset)` with org-level `isFeatured` + `sortOrder` merchandising flags; shared image-uploader/image-asset UI components | `packages/core/src/lib/product/product.entity.ts`, `packages/ui-core/shared/src/lib/{image-asset,image-uploader}/` |

### metasfresh — attachment engine in the AD core

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Attachments module | AD attachment/archive machinery renders in the generic window attachment tab | `backend/de.metas.document.archive/`, `backend/de.metas.dlm/` + shell `frontend/src/components/window/` |

### Odoo — product documents kanban with upload button

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product documents | Dedicated `product.document` model rendered as a **kanban of files per product/variant** (cards preview images/PDFs) with an upload button; the product form's Documents smart button opens it; `res_model` can be template or variant, so docs attach per-variant | `odoo/addons/product/views/product_document_views.xml`, OWL panel `odoo/addons/product/static/src/js/product_document_kanban/{product_document_kanban_view,product_document_kanban_controller,product_document_kanban_record,upload_button}.*` |
| Product images | `image_1920/image_256` fields on template & variants (Image widget resize tooling), reused wherever product images are shown | `odoo/addons/product/views/product_template_views.xml`, image tooling `odoo/addons/product/static/src/` |

**BOSS implications.** Attachments should be one central entity reused per module (Akaunting's single Uploads controller, Dolibarr's shared document tab tpl, Carbon's files module) with product documents getting a **variant-scopeable** attachment (Odoo's `res_model` template vs variant split is exactly the right seam), kanban-style file cards with preview for images/PDFs (Odoo product_documents_kanban is the best UX reference), and an optimistic-upload merge so re-uploads don't flash empty states (Carbon ItemDocuments). Gauzy's `featuredImage` + org-level featured flags show how commerce merchandising wants to sit on top of the same media rows.

---

## 9. UOM, packaging & barcodes

### Akaunting — **absent**

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No UOM master (quantity is bare number), no packaging, no barcode fields on items | — |

### AureusERP — packaging master with barcode + a barcode plugin

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Packaging resource | `PackagingResource` (name, product, qty, barcode, company): Bagisto-style sellable packages of a product (box/unit multiples) with own barcode | `plugins/webkul/products/src/Filament/Resources/PackagingResource/` (+ `Schemas/PackagingForm.php`) |
| Barcode scanning UI | Separate `barcode` plugin with Livewire components (scan-driven tooling added via Filament) | `plugins/webkul/barcode/src/{BarcodePlugin,Filament,Livewire,Support}` |

### Carbon — UOM form/table in the items module

| Screen/page | What it is | Key files |
| --- | --- | --- |
| UOM master | `UnitOfMeasureForm` + `UnitOfMeasuresTable` (flat master; conversion not modeled as categories but item-level storage fields carry dims) | `apps/erp/app/modules/items/ui/UnitOfMeasure/{UnitOfMeasureForm,UnitOfMeasuresTable}.tsx`, semantic checks `apps/erp/app/modules/items/method-material-storage-units.test.ts` |

### Dolibarr — barcode module + product barcode fields

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Barcode engine/masks | `htdocs/admin/barcode.php` config (encoders + numbering masks), gen/init pages assign codes and print sheets using printsheet module templates in `htdocs/core/modules/printsheets/` | `htdocs/barcode/{codeinit.php,printsheet.php}`, `htdocs/admin/barcode.php` |
| Product-side barcode | Barcode + barcode-type (EAN/UPC/other) fields on the product card, creation gated by `BARCODE_USE_ON_PRODUCT` + advanced permission (`barcode.creer_advance`); barcode is a search token in product list (§2) | `htdocs/product/card.php` (lines ~238–340), lookup `htdocs/core/class/html.formbarcode.class.php` |
| Units | Product card carries weight / net-weight / volume (+ their unit selectors); UOM conversion is not modeled (quantity stays a bare numeric) | `htdocs/product/class/product.class.php` |

### ERPNext — 3 masters: UOM, UOM category, item barcodes child

| Screen/page | What it is | Key files |
| --- | --- | --- |
| UOM doctype | `uom` master (name, `must_be_whole_number` flag with a delete/blocklist check in `uom.py`) used everywhere by item UOM fields | `erpnext/setup/doctype/uom/{uom.js,uom.json,uom.py}`; categories & conversions row below |
| UOM categories & conversions | `UOM Category` groups (which in this checkout is itself under stock) + `UOM Conversion Factor` (to_uom/from_uom/factor) reconciling conversions; Item carries a `uoms` child (conversion per UOM + price factor) and `unit_of_measure_conversion` field | `erpnext/stock/doctype/uom_category/`, `erpnext/setup/doctype/uom_conversion_factor/` |
| Item barcodes | `barcodes` child on Item: `barcode` value + `barcode_type` (type sequence: EAN/Code/GS1/QR...) + per-line uom | `erpnext/stock/doctype/item_barcode/item_barcode.json` |

### Ever Gauzy — product units inline

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Units & sizes | Product entity carries `unitCode` (uom by class) etc.; no standalone UOM/app screen — fields inline in product/variant forms | `packages/core/src/lib/product/product.entity.ts` |

### metasfresh — dedicated UOM engines + handling units for packaging

| Screen/page | What it is | Key files |
| --- | --- | --- |
| UOM | UOM conversion engine (business-side services under `de/metas/uom`: uom, conversions, standard/base UOM resolution) consumed by every pricing/inventory window | `backend/de.metas.business/src/main/java/de/metas/uom/` |
| Handling units | Packaging as first-class entities (HU packing instructions, TUs/LUs, per-storage per warehouse) — the packaging/goods-units engine BOSS packaging history should look at | `backend/de.metas.handlingunits.*` (`de.metas.handlingunits.base/webui/mobileui`) |
| Barcode/scan | GS1 decoder + scanned product-code resolution feeding barcode-driven picking and receipt applets | `backend/de.metas.business/src/main/java/de/metas/gs1/`, `backend/de.metas.business/src/main/java/de/metas/product/ResolvedScannedProductCode{,s}.java` |

### Odoo — uom addon, packaging in stock, barcode nomenclatures

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Units & packagings page | `uom_uom_views.xml`: the "Units & Packagings" master (uom + uom.category with type incl. displayed factor `relative_factor` + `relative_uom_id` precision digits [12,3]); archived flags | `odoo/addons/uom/views/uom_uom_views.xml`, models `odoo/addons/uom/models/` |
| Base units per company | `product.base.unit` (company-level base UOM for specific units like "e.g. m2"), rendered near company settings | `odoo/addons/product/views/product_base_unit_views.xml` |
| Packaging (stock pointer) | Product packaging lines (barcode + qty per packaging) live in the stock addon's window, surfaced on the product card's Sales tab "Packaging barcodes" group | `odoo/addons/stock/views/stock_package_views.xml`, product surface `odoo/addons/product/views/product_views.xml` (Packaging barcodes group) |
| Barcode nomenclatures | Scanner naming font config: `barcode.nomenclature` with rules/taxonomies parsed by the barcode_parser OWL lib (decode/encode boundaries incl. GS1 hints); also res_partner uses barcode | `odoo/addons/barcodes/views/barcodes_view.xml`, `odoo/addons/barcodes/static/src/js/barcode_parser.js` |
| Label printing | Product label report launcher + print sheets; barcode/serial QR labels in the webui wizard `product.label.layout` | `odoo/addons/product/report/{product_product_templates.xml,product_reports.xml}`, wizard `odoo/addons/product/wizard/product_label_layout{,_views}.py` |

**BOSS implications.** UOM belongs at the entity-model level: a category-driven UOM table with typed conversions (Odoo uom.category + relative_factor, ERPNext UOM Conversion Factor), plus per-item conversion overrides in a child grid (ERPNext Item "uoms"). Packaging beats both bagisto master tables and Odoo's variant-observed packaging — model sellable packaging as (product, qty, barcode, label) with a pack-size picker on document lines (AureusERP Packaging + Odoo packaging lines). Barcodes need a nomenclature/parser config record + typed code child on the item (ERPNext barcode_type, Odoo barcode.nomenclature + GS1 in metasfresh) — same entity then feeds printing (Odoo label layout wizard, Dolibarr printsheet) and POS scanning.

---

## 10. Product 360 & shared faces

### Akaunting — no shared product face

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent / list-only** | No reverse-link surfaces; item detail shows attachments + documents where it appears, but there's no per-product workbench aggregating orders/purchases | — |

### AureusERP — cross-app faces via the inventories plugin (pointer)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Inventories Clusters around product | `inventories` plugin clusters: **Products** (variant/serials/lot faces), Operations, Reporting, Settings, plus header Widgets (e.g. product-valuation numbers) | `plugins/webkul/inventories/src/Filament/Clusters/`, `plugins/webkul/inventories/src/Filament/Widgets/` |
| Purchases plugin | Product vendors + PO lines referencing products live here (§7 pointer) | `plugins/webkul/purchases/src/Filament/{Admin,Customer}/` |

### Carbon — one item record with cross-module sub-forms and exploration

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Manufacturing face | BOM/BOP/BoM-explorer components on the item (recipe sheets, method operations/materials tables) | `apps/erp/app/modules/items/ui/Item/{BillOfMaterial,BillOfProcess,BoMExplorer,MethodRow,MakeMethodTools,MakeMethodVersionStatus}.tsx`, manufacturing side `apps/erp/app/modules/manufacturing/` |
| Reverse links | `UsedIn.tsx` enumerates wherever the item is consumed (BOMs/methods/order templates), with `PlannedOrderDetailsPopover` and a planning chart | `apps/erp/app/modules/items/ui/Item/{UsedIn,PlannedOrderDetailsPopover,ItemPlanningChart,ItemPlanningForm}.tsx` |
| Risk & revisions 360 | Risk register + revision/change-notice stack inside the same record header | `apps/erp/app/modules/items/ui/Item/{ItemRiskRegister,RevisionForm}.tsx`, `apps/erp/app/modules/items/ui/ChangeNotice*/` |

### Dolibarr — per-tab stats pages around the product

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Per-document-type stats | `htdocs/product/stats/` pages each enumerate linked docs of one type from the product record: customer orders/quotes/proposals, supplier orders/receptions, invoices (customer/supplier/recurring), contracts, shipments, MOs, BOMs — each with drill-in list and per-period numbers | `htdocs/product/stats/{commande,propal,facture,commande_fournisseur,reception,contrat,expedition,bom}.php` |
| Composition (kits) | Sub-product composition card for parent/child kits (list of sub-products with exchangeable quantity multipliers) | `htdocs/product/composition/card.php` |
| Stock views on product | stock card/movements lists for the product | `htdocs/product/stock/{card.php,movement_list.php}`, stock module dir `htdocs/product/stock/` |

### ERPNext — Item "connections" heatmap + doctype dashboards

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Item connections panel | Desk dashboard data mechanically lists reverse links with a Stock-Ledger heatmap below: Groups (BOM/Product Bundle/Item Alternative), then quoting/orders invoices + serial batches, work orders, projects | `erpnext/stock/doctype/item/item_dashboard.py`, renderer `erpnext/stock/doctype/item/item.js` |
| Stock summary dashboard | Another dashboard box with "Stock Analytics" links (shortage/balance/valuation...) | `erpnext/stock/doctype/item/item_dashboard.py`, charts `erpnext/stock/dashboard_chart/{item_shortage_summary,oldest_items}.json` |
| Sales-side face | `item_wise_annual_sales` selling chart orchestrates sales from the item workspace, `selling/report/item_wise_sales_history` tracks history | `erpnext/selling/dashboard_chart/item_wise_annual_sales/`, `erpnext/selling/report/item_wise_sales_history/` |
| Ecommerce-ish leftovers | `www/all-products` static catalog listing page + `website_item_group` setup doctype (Website Item doctype skeleton not in this checkout) | `erpnext/www/all-products/`, `erpnext/setup/doctype/website_item_group/` |

### Ever Gauzy — variants/warehouse tabs as the product 360

| Screen/page | What it is | Key files |
| --- | --- | --- |
| View item page | `view-inventory-item` component (per-route `view/:id` read-only page) then jump-links for the variant/price combo rows; same record both list/detail faces | `apps/gauzy/src/app/pages/inventory/components/view-inventory-item/` |
| Warehouse & merchant widgets | `manage-warehouses` + `manage-merchants` layouts attach to the same item pages (goods-in faces of products) | `…/inventory/components/{manage-warehouses,manage-merchants}/` |
| Shared mutation helper | `product-mutation` helper provides create/update/duplicate shorthands reused by the wizard and is org-scoped | `packages/ui-core/shared/src/lib/product/product-mutation/` |

### metasfresh — windows + processes compose the product face

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product-related processes | Product window processes like `WEBUI_M_Product_LotNumber_Quarantine` (quarantine lot handler surfaced as button) inside the generic window | `backend/de.metas.ui.web.base/src/main/java/de/metas/ui/web/product/process/` |
| Stock faces | Receipts/picking candidates per product are separate windows (warehouse) but reached from the product via quick actions | `backend/de.metas.ui.web.base/src/main/java/de/metas/ui/web/{receiptSchedule,picking,inoutcandidate}/` |

### Odoo — one product template button-box shared across modules

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Smart buttons in the same product form | Stock addon patches the product/category forms: category button-box "Putaway Rules" + Logistics page; per-product on-hand/forecasted/reserved wizards and stock-moves actions hang off the same `<button name="action_open_documents" ...>` box | `odoo/addons/stock/views/product_views.xml`, `odoo/addons/product/views/product_views.xml` (`product_template_form_view` button_box) |
| BOM & MO faces | MRP patches the product form: "Bill of Materials" + "Used in BOM" + "Manufacturing Orders" stat buttons (template & variant level) | `odoo/addons/mrp/views/product_views.xml` |
| Sales face + ecommerce note | `sale/views/product_views.xml` patches the product form with sales-related stat surfaces; the customer-facing storefront lives in `website_sale` (+ eight `website_sale_*` addons, all in this community checkout; see research-commerce.md) | `odoo/addons/sale/views/product_views.xml` |

**BOSS implications.** The Product 360 is really a **button-box pattern**: one product record that every module progressively patches with reverse-linked stat buttons (stock qty, BOMs, open MOs, sales/purchases history) — BOSS should render the shared Product 360 screen with per-app panels (Inventory stock summary, Manufacturing BOM/work orders, Purchasing supplier rows, Accounting price/cost history) that are toggled in and enabled per role, exactly like module-patched Odoo groups and Carbon's per-concern sub-forms/UsedIn. Always keep a "documents" panel (Odoo product documents + Dolibarr stats pages) and a reverse-link "connections" listing (ERPNext item_dashboard) — both proved highest-value in the references. Gate manufacturing/purchasing panels behind module flags like AureusERP's inventories cluster separation.

---

## 11. Catalog settings & configuration

### Akaunting — categories + defaults, no product-specific options

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Settings relevant to items | Generic settings: categories (§5), item defaults inside Settings→Defaults (default category/tax), currency tax settings; no product feature toggles — item handling is fixed by code | `app/Http/Controllers/Settings/{Defaults,Categories}.php`, views `resources/views/settings/{default,categories}/` |

### AureusERP — one settings class with 4 capability toggles

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product settings page | `ProductSettings` (spatie/laravel-settings group `products_product`): **enable_variants, enable_uom, enable_packagings, enable_price_lists** — four feature switches that reshape the whole products plugin UI | `plugins/webkul/products/src/Settings/ProductSettings.php` |

### Carbon — nothing product-specific

| Screen/page | What it is | Key files |
| --- | --- | --- |
| **Absent** | No catalog options screen; item behaviors are code-fixed (beta gating exists module-wide only); feature surface is the nav registry | `apps/erp/app/modules/items/ui/useItemsSubmodules.tsx` |

### Dolibarr — product admin pages per concern

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product module admin | Product options incl. barcode search toggles, multiprices usage flags, lot/serialization settings, per-feature permissions | `htdocs/product/admin/product.php`, `htdocs/product/admin/product_lot.php` |
| Dynamic prices & price rules admin | Turn on/structure the price-expression engine and price rules | `htdocs/product/admin/{dynamic_prices.php,price_rules.php}` |
| Product tools | Recurring/mass tools config | `htdocs/product/admin/product_tools.php` |

### ERPNext — settings doctypes scattered as capability toggles

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Stock Settings | Desk settings entity with product-relevant defaults plus stock options: **item_naming_by, default item_group, default stock_uom, valuation_method, show_barcode_field, clean_description_html, auto-insert price list rate** (alongside stock controls like negative stock/freeze) | `erpnext/stock/doctype/stock_settings/stock_settings.json` |
| Feature toggles family | Separate settings doctypes per feature: item variant settings (§4), delivery settings, stock reposting settings — each own dir with `*_settings.{js,json,py}` | `erpnext/stock/doctype/{item_variant_settings,delivery_settings,stock_reposting_settings}/` |
| Item taxonomy defaults | Default item group hierarchy feeds the workspace tree and Stock Settings's `item_group` default | `erpnext/setup/doctype/item_group/`, `erpnext/stock/doctype/stock_settings/stock_settings.json` |

### Ever Gauzy — per-variant capability row concept

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product variant settings entity | `ProductVariantSetting` — **a capability row per variant** (flags the platform asks "may it be sold/purchased/charged/rented/stocked/subscribed?" before a variant is read) with GraphQL CRUD served at route `/product-variant-settings`; directory comment explains why flags are rows not columns | `packages/core/src/lib/product-setting/{schema,type.gql,product-setting.resolver.ts}` |
| UI setting widgets | Org-level product type/category/merchant management tables are the pickers' configured sources | `apps/gauzy/src/app/pages/inventory/components/manage-product-types/` |

### metasfresh — product config is backend windows/params

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product config anchors | Pricing/UOM/packaging configuration as windows/parameters in the generic shell (de.metas.pricing & de.metas.uom packages define the systems) | `backend/de.metas.business/src/main/java/de/metas/{pricing,uom}/` |

### Odoo — res.config.settings page + security groups

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Product settings page | Weight/volume UOM choice (`product_weight_in_lbs`), volume units, and upgrade-boolean entries to install barcode-lookup module etc. | `odoo/addons/product/views/res_config_settings_views.xml`, `odoo/addons/product/models/res_config_settings.py` |
| Variant/packaging groups | Feature enablement is via security groups: `group_product_variant` gates the whole variant machinery inline in views | `odoo/addons/product/security/product_security.xml`, `odoo/addons/product/models/res_groups.py` |

**BOSS implications.** Configuration is a set of tiny capability toggles, not a screen: AureusERP's four booleans (variants/UOM/packaging/price-lists) are the whole products-plugin surface — BOSS should do the same with Moqui app-support records so catalog features can be switched per org. Beyond that, configuration should live as doctype-style settings entities with their own JSON-driven desk UI (ERPNext) rather than scattered admin pages, and security groups should be the second axis (Odoo) since variant editing rights differ from view rights. gauzy's per-variant capability rows are a prize pattern exactly for BOSS's "Products & variants" record: ask once, aggregate everywhere, extend flags without schema churn.

---

## 12. Gaps & notables in the checkout

- **Akaunting items are the flattest of all**: one price pair (sale/purchase), no UOM, no barcode, no variants, no supplier refs, no price lists — every "catalog feature" in the plan above has to be greenfield here. Its import page (`resources/views/common/import/create.blade.php`) is the only common-import surface (fields+sample-file+YouTube embed) shared by *all* types, so it ships even with the hand-rolled column mapper; there is no `resources/views/common/documents` (document forms live in `resources/views/components/documents/{form,show}` as in the accounting pass note). The Items module also exposes reorder/restore through one umbrella `Common/Items.php` — no per-type controllers.
- **AureusERP products plugin inventory**: exactly five Filament resources (Product, Category, Attribute, Packaging, PriceList), zero custom Pages/Widgets — no dashboard or overview in the products plugin, so the home is the product list. Its two notable patterns: the `ProductSchemaRegistry` slot-injection contract for composing one product form from many plugins, and `ProductSettings` with only 4 booleans (variants/UOM/packaging/pricelists). Attribute families/groups live only inside `Aggregates/` and `AttributeResource` (no separate family resource as an Odoo-alike would have) — the Bagisto lineage shows up in `Enums/ProductType` grouping the list.
- **Carbon items is deliberately not a commerce catalog**: a materials/parts/services/tools model with engineering-change and risk machinery instead of variants, tags or categories; its costing surface even hides **Standard costing** behind a code comment ("not implemented yet" at `ItemCostingForm.tsx`), and "method-material storage units" tests guard unit semantics in `apps/erp/app/modules/items/`. Strong for its cross-references (UsedIn, BoM explorer, change-notice diff UI) that a BOSS Product 360 for industrial tenants can borrow wholesale.
- **Dolibarr remains file-per-screen** (each product tab its own `.php` — `card.php`, `price.php`, `price_suppliers.php`, `traduction.php`, `document.php`...) with a rich default-price model: multiprices levels + per-level HT/TTC base + min-price/NPR + a full change log; supplier-price writing sits behind an advanced permission (`product_advance.write_supplier_prices`) and barcode creation behind one too. The variants module lives outside `htdocs/product/`, in `htdocs/variants/`, with its own admin page and tpl-based attribute-value widget.
- **ERPNext paths differ from the pre-write row of the path table**: Price List and Item Price are **`erpnext/stock/doctype/{price_list,item_price}/`**, not `erpnext/accounts/` nor `erpnext/selling/` (the only account-side artifact is `accounts/doctype/promotional_scheme_price_discount`); the core Item family lives under `erpnext/stock/` (incl. `uom_category`), `item_group`/`uom`/`uom_conversion_factor` sit in `erpnext/setup/`, and `product_bundle` (+ selling-facing reports) in `erpnext/selling/`. `website_item` doctype is **not in this checkout** (website-only surfaces: `erpnext/www/all-products/` static catalog and `erpnext/setup/doctype/website_item_group`) — the e-commerce face here is minimal, good reason to treat Products and Commerce as separate BOSS apps.
- **gauzy's structural surprise**: no `packages/ui-core/shared/src/lib/inventory/` — the inventory UI is app-side (`apps/gauzy/src/app/pages/inventory/`), the domain libs are core-side (`packages/core/src/lib/product*/` incl. the per-variant capability `product-setting` rows), and the shop-ish machinery is a workspace **plugin** (`packages/plugins/catalog` with product/variant channels, collections, media, tags). For BOSS that's an argument for the Product domain being a center package + thin per-app renderers.
- **metasfresh**: no `de.metas.product`/`de.metas.pricing` top-level backend modules in this checkout — the pricing/UOM/product engines sit inside `de.metas.business` (`de/metas/pricing`, `de/metas/uom`, `de/metas/product`, `de/metas/bpartner_product`) with web-UI hooks in `de.metas.ui.web.base` (`ui/web/{product,pricing,pattribute}`: e.g. discount-schema-break copy processes, lot-number quarantine). For BOSS: treat the AD window definition the way one treats the Moqui screen XML, and expect every product screen's richness to come from metadata not bespoke React.
- **Odoo community carries the full product stack in one addon**: `product/` has the template/variant/category/tag/pricelist/supplierinfo/UOM/combo/document views and the product-catalog kanban picker; supplierinfo is **in `product`** (purchase only patches views, contrary to what the older addons layout would suggest); product **label printing** is also in `product/wizard/product_label_layout*` + `product/report/` (with the stock-facing counterpart at `stock/report/product_templates.xml`), and dynamic attribute update is a product addon wizard. Combos (`product.combo`) are new in this checkout and relevant to bundle/kits design; `barcodes/` ships only the nomenclature parser + scanner infra (no product views).
- **Cross-cutting patterns**: capability toggles reshape UIs (AureusERP 4 booleans, Odoo security groups vs settings, ERPNext flags on Item showing/hiding whole sections); embedded child-list editing everywhere (price rules inside product form, barcodes/UOM lines inside Item, attribute lines on template, supplier prices rows in Dolibarr tabs) — the Product record is the host screen for many small ledgers; reverse-link "connections" dashboards (ERPNext item_dashboard with heatmap, Dolibarr `product/stats/*`, Carbon UsedIn) are the shared companion to the button-box Product 360; per-variant/per-supplier distinctions are drawn in child tables while the parent stays conceptually one master.
- **Checkout path quirks**: AureusERP `products` has no Widgets → any product KPI tile BOSS invents must come from list-export side-channels; metasfresh `backend` listing has **119 modules** with none named `product*`/`pricing*` — grep inside `de.metas.business` to find them; gauzy inventory shared components are `packages/ui-core/shared/src/lib/product/` even though the module folder is `pages/inventory/`; ERPNext `item_barcode` is just 3 files (JSON/py) joined onto Item (`barcodes` child), while heavy barcode screens (masks/printsheets) stay Dolibarr-only in this set. Akaunting `app/Widgets/` has no product widget (top-items widget absent in this version), so §1 product-land KPIs can't be sourced there.

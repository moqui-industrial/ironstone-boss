# IronStone BOSS — Projects research

Oct 18, 2026

Deeper research pass on every screen/page relevant to **IronStone Projects** (Project managers, services staff): projects and milestones, tasks, timesheets, resource scheduling, time-and-materials billing and request intake. Companion to [3p-app-reference.md](3p-app-reference.md); feeds the IronStone Projects sections of [initial-design.md](initial-design.md). Cross-app screens that Projects shares with Commons, Customer Service, Sales and Accounting are cross-referenced rather than duplicated.

**Two significant sources were added to the checkout after 3p-app-reference.md was written.** They are the primary references for this app and are treated first in each section:

| Source | Checkout | Why it matters |
| --- | --- | --- |
| **OpenProject** | `/home/jonesde/work/moquiwork/3p_other/openproject` | Project-management-first application: portfolio/program hierarchy, work packages, Gantt/timeline, boards, backlogs, team planner, resource management, budgets and cost reports. The closest overall model for IronStone Projects. |
| **Redmine** | `/home/jonesde/work/moquiwork/3p_other/redmine` | Long-lived, minimal project tracker: projects, issues, queries, versions/roadmap, Gantt/calendar, time logs, wiki/files/forums. The best reference for a compact, comprehensible project UI and for email-driven issue intake. |

**Organization.** Sorted by functional area, not by app: all project-list/create screens together, all task/work-item screens together, all timesheet screens together, etc. Within each area, sub-tables per reference app. Each section ends with **BOSS implications**.

**Path conventions.** Paths are relative to each repository's own root, as in 3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **OpenProject** | `/home/jonesde/work/moquiwork/3p_other/openproject` — Rails backend (`app/`, `modules/`), Angular front end (`frontend/src/app/features/`), ERB/Primer views (`app/views/`, `app/components/`) |
| **Redmine** | `/home/jonesde/work/moquiwork/3p_other/redmine` — Rails + ERB; `app/views/`, `app/controllers/`, `app/models/` |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — modules under `odoo/addons/`; views in `<module>/views/`, OWL UI in `<module>/static/src/` |
| **Frappe (ERPNext)** | `/home/jonesde/work/moquiwork/3p_other/frappe` — `erpnext/erpnext/projects/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — `plugins/webkul/projects/`, `plugins/webkul/timesheets/` (Filament PHP UI) |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — `htdocs/projet/` + shared `htdocs/core/lib/project.lib.php` |
| **Ever Co (ever-gauzy)** | `/home/jonesde/work/moquiwork/3p_other/ever-co` — paths relative to `ever-gauzy/` (`apps/gauzy/src/app/pages/…`) |
| **Moqui WorkManagement** | `/home/jonesde/work/moquiwork/3p_moqui/WorkManagement` — `screen/wm/` |
| **Moqui Sales** | `/home/jonesde/work/moquiwork/3p_moqui/Sales` — `screen/Sales/` |
| **Moqui WeCreate** | `/home/jonesde/work/moquiwork/3p_moqui/WeCreate` — `screen/wcinternal/Project/` |
| **Nextcloud** | `/home/jonesde/work/moquiwork/3p_other/nextcloud` — `tasks/src/`, `deck/src/` (catalogued in [research-drawers-commons.md](research-drawers-commons.md) §11) |
| **Twenty** | `/home/jonesde/work/moquiwork/3p_other/twenty` — `packages/twenty-front/src/modules/activities/` (per-record task/note widgets) |
| **Carbon / Akaunting / metasfresh / Zimbra** | no project-management module in these checkouts; see §15 for the exact gap |

Sections: [1 landing/portfolio/my work](#1-landing-portfolio--my-work) · [2 projects list, create, templates](#2-projects-list-create--templates) · [3 project detail & 360](#3-project-detail--project-360) · [4 tasks / work packages](#4-tasks--work-packages) · [5 boards, backlogs & sprints](#5-boards-backlogs--sprints) · [6 gantt, timeline & calendar](#6-gantt-timeline--calendar) · [7 milestones, versions & phases](#7-milestones-versions--phases) · [8 time tracking & timesheets](#8-time-tracking--timesheets) · [9 resource scheduling & capacity](#9-resource-scheduling--capacity) · [10 budgets, costs & T&M billing](#10-budgets-costs--tm-billing) · [11 request intake & cross-app handoffs](#11-request-intake--cross-app-handoffs) · [12 reporting & analytics](#12-reporting--analytics) · [13 settings & administration](#13-settings--administration) · [14 BOSS screen map](#14-boss-screen-map) · [15 gaps & notables](#15-gaps--notables)

---

## 1. Landing, portfolio & "my work"

IronStone Projects needs three different landing surfaces: an app home for managers (portfolio health, workload, money), a project list for finding work, and a personal "My work" surface for staff. OpenProject separates all three cleanly; Redmine compresses them into project list + My page.

### OpenProject — global projects, portfolio/program, project overview, My page, My work

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Global projects index | Saved-query project list with hierarchy, favorites, columns incl. custom fields, filters, pagination, project export, and a "Gantt" portfolio link; page header carries save/rename/share actions. | `app/views/projects/index.html.erb`, `app/components/projects/index_page_header_component.rb`, `app/components/projects/table_component.rb`, `app/models/queries/projects/filters/`, `app/models/queries/projects/selects/` |
| Project list filters | Filter set is explicitly modelled: active/archived, ancestor, project type/variant, phase, member, principal, favorite, public, templated, status, name/identifier, created/updated, latest activity, user action, custom fields. | `app/models/queries/projects/filters/*.rb` |
| Project list columns | Default + custom-field selects; created/updated/status/favorite/phase/latest activity/required disk space. | `app/models/queries/projects/selects/*.rb` |
| Portfolio / program workspaces | `workspace_type` is `project`, `program` or `portfolio`; allowed parents are enforced (project can sit under portfolio/program/project; program only under portfolio). Each type gets its own overview grid. | `app/models/project.rb` (`workspace_type`, `ALLOWED_PARENT_WORKSPACE_TYPES`), `modules/overviews/app/components/overviews/workspaces/` |
| Project overview (project workspace) | Widget grid: Description, Project status, Project timeline, Subitems, Meetings, Members, News, Budget totals, Budget by cost type, Actual costs, and project-attribute widgets. Managers can add widgets. | `modules/overviews/app/views/overviews/overviews/show.html.erb`, `dashboard.html.erb`, `modules/overviews/app/components/overviews/workspaces/project_overview_grid_component.html.erb` |
| Portfolio/program overview | Same widget set minus News; portfolio/program aggregate child projects. | `modules/overviews/app/components/overviews/workspaces/{portfolio,program}_overview_grid_component.html.erb` |
| Project status model | Six-state project health separate from the work-item status: on track, at risk, off track, not started, finished, discontinued. | `app/models/project.rb` (`status_code`) |
| Project timeline / phases | Life-cycle phases with start/finish dates and optional start/finish gates; shown as an overview widget and editable in settings. | `app/models/project/phase.rb`, `app/models/project/phase_definition.rb`, `app/components/projects/phases/`, `app/components/projects/settings/life_cycle/` |
| My page | User-arrangeable widget grid (the same grid component as the dashboard). | `frontend/src/app/features/my-page/my-page.component.ts` |
| My work | Personal work screen with list and calendar modes, time-entry rows, scheduled/remaining allocations, entry action menus, and a stop-timer control. | `app/components/my/work/` (`list_component`, `calendar_component`, `time_entries_list_component`, `allocation_row`, `stop_timer_component`) |
| Timers | A running timer is exposed in the menu section and is tied to a work package + time entry. | `modules/costs/app/components/my/timer/menu_section_component.rb` |
| Notifications / activity | Global notifications and project activity feed (work-package journals, news, meetings, wiki/documents). | `app/views/activities/`, `app/views/journals/`, `modules/overviews/app/components/overviews/` |

### Redmine — project index + configurable My page

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Projects list | Query-driven list, saved queries, filters, CSV/Atom export, "My projects"/bookmarked filters. | `app/views/projects/index.html.erb`, `app/models/project_query.rb` |
| Project index columns | Name, status, short description, homepage, identifier, parent, public flag, created/updated, last activity. | `app/models/project_query.rb` (`available_columns`) |
| Project index filters | Name, description, status, parent, created/updated, custom fields. | `app/models/project_query.rb` (`initialize_available_filters`) |
| My page | Drag-and-drop two-column block dashboard; add/remove/order blocks per user. | `app/views/my/page.html.erb`, `app/controllers/my_controller.rb`, `app/helpers/my_helper.rb` |
| My page blocks | Calendar (week), documents, issues assigned to me / reported by me / updated by me / watched by me, an arbitrary saved issue query, news, time log (last N days), activity. Each block supports per-block columns/sort/settings. | `app/views/my/blocks/`, `app/helpers/my_helper.rb` |
| Project overview | See §3; the project show page itself is the landing page. | `app/views/projects/show.html.erb` |
| Activity | Global/project activity feed with date-grouped events. | `app/views/activities/index.html.erb`, `app/controllers/activities_controller.rb` |

### Odoo — Project app menus + list/kanban/calendar + updates

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Project app menu | Projects · Tasks (My Tasks, All Tasks) · Reporting (Tasks Analysis, Customer Ratings) · Configuration (Settings, Projects, Project Templates, Project Roles, Project Stages, Task Stages, Tags, Activity Types, Activity Plans). | `odoo/addons/project/views/project_menus.xml` |
| Project list/kanban/calendar | Switchable project views; kanban is mobile-oriented; list grouped by stage; calendar by planned dates. | `odoo/addons/project/views/project_project_views.xml` (`view_project`, `project_view_kanban`, `view_project_calendar`) |
| Project form header | Stage status bar with "rotting" duration, task completion count/percentage, milestone reached count/progress, customer rating, favorite star, customer/contact details. | `odoo/addons/project/views/project_project_views.xml` (`edit_project`) |
| Project updates | Status/progress update records with author, date, description; list/kanban/graph views; used as the project's periodic health narrative. | `odoo/addons/project/views/project_update_views.xml`, `odoo/addons/project/models/project_update.py` |
| My Tasks | Task kanban/list/calendar/activity/pivot/graph filtered to the current user, grouped by personal stage. | `odoo/addons/project/views/project_task_views.xml` (`action_view_my_task`) |
| Tasks analysis | Pivot/graph analysis over tasks (stage, assignee, working hours, rating). | `odoo/addons/project/views/project_task_views.xml` (`view_project_task_pivot`, `view_project_task_graph`) |

### ERPNext / AureusERP / Gauzy / Dolibarr / Moqui — landing patterns

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | To-do | Personal task list over `project.task` with kanban/list/form views, done checkbox, priority, deadline, tags and personal stage; separate top-level menu. | `odoo/addons/project_todo/views/project_task_views.xml`, `odoo/addons/project_todo/views/project_todo_menus.xml` |
| ERPNext | Projects workspace | Desk module page: onboarding, Project Summary chart, Open Projects / Non-completed Tasks / Timesheet Working Hours number cards, Project Reports card, links to Project/Task/Timesheet. | `erpnext/erpnext/projects/workspace/projects/projects.json`, `erpnext/erpnext/projects/sidebar/projects/projects.json` |
| ERPNext | Project dashboard | Connections dashboard (Tasks, Timesheets, Issues, Project Updates; material/sales/purchase/manufacture transactions) plus a timesheet heatmap. | `erpnext/erpnext/projects/doctype/project/project_dashboard.py` |
| AureusERP | Projects dashboard | Filament dashboard widgets: stats overview, tasks by state, tasks by stage, top assignees, top projects. | `plugins/webkul/projects/src/Filament/Widgets/`, `plugins/webkul/projects/src/Filament/Pages/Dashboard.php` |
| Gauzy | Projects list | Table and card-grid layouts, pagination, permissions, favorite toggle, add/edit/delete, "add module" action. | `apps/gauzy/src/app/pages/projects/components/project-list/list.component.html` |
| Gauzy | Project layout | Detail/edit routes and project manager/guard wiring. | `apps/gauzy/src/app/pages/projects/layout/`, `projects-routing.module.ts` |
| Dolibarr | Project list | Dense filter list: status, opportunity status/amount/probability, third party, contact, assigned user, sales rep, late alert, parent project, tags/extra fields; mass close; group-by; column chooser. | `htdocs/projet/list.php` |
| Dolibarr | Project statistics | Graph/statistics view over projects (leads vs projects mode). | `htdocs/projet/stats/index.php` |
| WorkManagement | Projects screen | QVue page with a right-hand "Find Options" drawer (person, role, status, order by, free text) and inline project/task table. | `screen/wm/Project/Project.qvue`, `screen/wm/Project.xml` |

**BOSS implications.** Use OpenProject's three-surface split, not a single dashboard: (1) **Projects home** = portfolio health + workload + overdue/milestone/billing exceptions; (2) **Find Projects** = saved-view table with hierarchy and the same filters OpenProject models; (3) **My work** = personal list/calendar plus running timer and upcoming allocations, which is also what the header "Today" panel should surface. Adopt the six-state project health, but keep it separate from task status and from the commercial project state (prospect/active/closed). Portfolios/programs are worth supporting in the data model even if the first UI only exposes projects — OpenProject's parent-type rules are the cheapest correct constraint.

---

## 2. Projects list, create & templates

### OpenProject — project list, creation wizard, templates, copy

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Create project | Simplified name/identifier form plus a multi-section creation wizard; sections and custom fields are admin-configured. Blank-slate and export variants exist. | `app/views/projects/new.html.erb`, `app/views/projects/creation_wizard/show.html.erb`, `app/components/projects/wizard/`, `app/components/projects/settings/creation_wizard/` |
| Creation wizard admin | Enable/disable, choose sections/custom fields, submission form, export. | `app/components/projects/settings/creation_wizard/`, `app/controllers/projects/settings/creation_wizard_controller.rb`, `app/controllers/projects/creation_wizard_controller.rb` |
| Project templates | Any project can be flagged `templated`; new projects copy from a template (`copy` service copies work packages, members, versions, settings). A default template can be assigned per subproject type. | `app/models/project.rb` (`templated`, `template_id`, `templated_projects`, `subproject_template_assignments`), `app/controllers/projects/templated_controller.rb`, `app/services/projects/copy_service.rb`, `app/models/subproject_template_assignment.rb` |
| Project settings → Template | Marks/uses a project as a template from project settings. | `app/components/projects/settings/template/settings_component.rb`, `app/controllers/projects/settings/template_controller.rb` |
| Copy project | Copy form with selectable components (work packages, members, versions, etc.). | `app/views/projects/copy_form.html.erb`, `app/services/projects/copy_service.rb` |
| Close / archive / delete | Project status changes (finish/discontinue), archive and delete flows; delete warns about work-package reassignment. | `app/controllers/projects/status_controller.rb`, `app/controllers/projects/archive_controller.rb`, `app/views/projects/destroy.html.erb` |
| Project identifier / reserved identifiers | Editable identifier with suggestions and a reserved-identifier admin list. | `app/controllers/projects/identifier_controller.rb`, `app/controllers/projects/identifier_suggestion_controller.rb`, `app/controllers/admin/settings/project_reserved_identifiers_controller.rb` |
| Subitems | Project settings for subitem types/templates. | `app/controllers/projects/settings/subitems_controller.rb`, `app/views/projects/settings/subitems/` |

### Redmine — create/copy/close project + module selection

| Screen/page | What it is | Key files |
| --- | --- | --- |
| New/edit project | Name, identifier, description, homepage, parent, public flag, custom fields, trackers, modules, default assigned version/query, activity. | `app/views/projects/new.html.erb`, `app/views/projects/_form.html.erb` |
| Copy project | Copy metadata, members, versions, issue categories, issues, documents, wiki, news, queries, time entries, boards, files, repository (selectable). | `app/views/projects/copy.html.erb`, `app/models/project.rb` (`copy`), `app/controllers/projects_controller.rb` |
| Close/reopen/archive | Project status ladder: active → closed → archived; close cascades to descendants. | `app/models/project.rb` (`close`, `reopen`, `archive`, `unarchive`), `app/views/projects/show.html.erb` |
| Project modules | Per-project on/off switch for issue tracking, time tracking, news, documents, files, wiki, repository, boards, calendar, gantt. | `config/settings.yml` (`default_projects_modules`), `app/models/project.rb` (`enabled_module_names`), `app/views/projects/settings/_*.html.erb` |
| Project settings | Tabs: members, versions, issue categories, modules, repository, activities, boards. | `app/views/projects/settings/`, `app/views/projects/settings.html.erb` |

### Odoo — quick create, templates, stages, visibility, email alias

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Quick-create project | Name + planned date range + project email alias; creates and opens tasks. | `odoo/addons/project/views/project_project_views.xml` (`project_project_view_form_simplified`, `open_create_project`) |
| Full project form | Stage, description, customer/contact, tags, manager, planned dates, settings tab (email alias + accepted senders, company, analytic account, privacy/visibility, allowed internal users, task-management toggles, time-management). | `odoo/addons/project/views/project_project_views.xml` (`edit_project`), `odoo/addons/project/models/project_project.py` |
| Project templates | A project can be `is_template`; products/services can create projects from a template. | `odoo/addons/project/views/project_project_views.xml` (`open_create_project_template`, `project_templates_view_form`), `odoo/addons/sale_project/models/product_template.py` |
| Project roles | Reusable roles assigned to task templates/tasks during project creation from a template. | `odoo/addons/project/views/project_role_views.xml`, `odoo/addons/project/models/project_role.py` |
| Project stages | Configurable stage list with sequence, fold (closed), and rotting threshold; drives the project status bar and kanban. | `odoo/addons/project/views/project_project_stage_views.xml`, `odoo/addons/project/models/project_project_stage.py` |
| Task stages | Per-project task stage configuration (kanban columns), with folded stages treated as closed. | `odoo/addons/project/views/project_task_type_views.xml` |
| Visibility | `privacy_visibility` (portal users / internal / invited internal users). | `odoo/addons/project/models/project_project.py` |
| Email alias | Each project can own an alias; incoming mail creates tasks in that project, with allowed-sender policy. | `odoo/addons/project/models/project_project.py` (`alias_id`, `_alias_get_creation_values`), `odoo/addons/project/views/project_project_views.xml` |

### ERPNext / AureusERP / Dolibarr / Gauzy / WeCreate / WorkManagement

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| ERPNext | Project form | Series, name, status (Open/On hold/Completed/Cancelled), type, % complete method (manual/task completion/task progress/task weight), template, priority, department, active flag, timeline (expected/actual dates + actual time), customer + sales order, notes, accounting/costing/billing, progress-update collection, users. | `erpnext/erpnext/projects/doctype/project/project.json` |
| ERPNext | Project template | Project type + child task templates; used when creating/copying projects. | `erpnext/erpnext/projects/doctype/project_template/`, `project_template_task` |
| AureusERP | Project form | Progress stepper (stage), name/description, manager, customer, start/end dates, allocated hours, tags, company, visibility (private/internal/public), allow-timesheets, allow-milestones. | `plugins/webkul/projects/src/Filament/Resources/ProjectResource/Schemas/ProjectForm.php` |
| AureusERP | Projects table | Rich project card stack (name/customer/date/remaining hours/manager/tags), group by stage/manager/customer/created, reorderable, query-builder filters. | `plugins/webkul/projects/src/Filament/Resources/ProjectResource/Tables/ProjectsTable.php` |
| AureusERP | Project pages | List/create/view/edit; relation managers for milestones/tasks; manage milestones/tasks pages. | `plugins/webkul/projects/src/Filament/Resources/ProjectResource/Pages/` |
| Dolibarr | Project create/edit card | Ref, title, parent project, status, opportunity fields (amount/probability/status), dates, third party/contact, assigned users, visibility/public, usage flags (`usage_task`, `usage_bill_time`, `usage_opportunity`, `usage_organize_event`), extra fields. | `htdocs/projet/card.php`, `htdocs/projet/class/project.class.php` |
| Dolibarr | Clone project | Clone with contacts, tasks, project files, task files, notes, date shift, third party. | `htdocs/projet/card.php` (`createFromClone` block) |
| Gauzy | Project create/edit | Dialog forms; project modules; favorites; card/table layouts. | `apps/gauzy/src/app/pages/projects/components/{project-create,project-edit}/` |
| WeCreate | Create project | Account, project name, visibility, start date, estimated hours, description; status flow driven by Mantle `StatusItem`/`StatusFlowTransition`; posts/photos on the project profile. | `screen/wcinternal/Project/FindProject.xml`, `screen/wcinternal/Project/ViewProject.xml` |
| WorkManagement | Find/create project | QVue list with inline project creation and a find-options drawer; project detail is a simple edit/view screen. | `screen/wm/Project/Project.qvue`, `screen/wm/Project.xml` |

**BOSS implications.** Creation should be a short form plus an optional wizard, not one giant form. OpenProject's **template = a real project flagged `templated`** is the cheapest model: copy tasks, milestones, members, roles, rates and settings from it, and allow a default template per project type/subitem type. Keep the commercial fields (customer, sales order, contract) on the project only when they apply — ERPNext and Odoo both put them on the project, but BOSS should link to Sales rather than duplicate price data. Odoo's **project email alias** is worth adopting as the default request-intake path; it maps directly onto system messages/CommunicationEvent.

---

## 3. Project detail & project 360

### OpenProject — project overview, settings, modules

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Project overview | Widget dashboard described in §1; project header carries favorite, status, settings, archive. | `modules/overviews/app/views/overviews/overviews/show.html.erb`, `modules/overviews/app/components/overviews/page_header_component.html.erb` |
| Project status / timeline widgets | Project health and phase timeline; project attributes widget shows custom fields. | `modules/overviews/app/components/overviews/project_phases/`, `modules/overviews/app/components/overviews/project_custom_fields/` |
| Members widget | Project members and roles. | `modules/overviews/app/components/overviews/workspaces/project_overview_grid_component.html.erb` (`Grids::Widgets::Members`) |
| Budget/cost widgets | Budget totals, budget by cost type, actual costs. | `modules/budgets/app/components/budgets/widgets/`, `modules/costs/app/components/costs/widgets/` |
| Project settings | Sections: General, Life cycle, Modules, Project custom fields, Versions, Work packages (types/categories/internal comments), Template, Repository, Storage, Subitems, Work-package import. | `app/components/projects/settings/`, `app/controllers/projects/settings_controller.rb` |
| Project modules | Enable/disable backlogs, boards, calendar, documents, Gantt, meetings, wiki, work packages, etc. | `app/controllers/projects/settings/modules_controller.rb`, `config/initializers/menus.rb` |
| Project activity | Work-package journals + project events, filterable. | `app/views/activities/`, `app/controllers/activities_controller.rb` |

### Redmine — project overview as a one-page hub

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Project overview | Description, homepage/custom fields, issue-tracking table per tracker (open/closed/total), spent-time box (estimated/spent + log-time/report links), members, latest news, subprojects, wiki content. | `app/views/projects/show.html.erb` |
| Project menu | Per-project tabs for Overview, Activity, Issues, Gantt, Calendar, News, Documents, Files, Wiki, Repository, Boards; module-dependent. | `app/views/projects/menus/`, `app/helpers/projects_helper.rb`, `config/initializers/menus.rb` |
| Project sidebar | Issue tracking summary, time tracking, members, latest news. | `app/views/projects/_sidebar.html.erb` |
| Settings tabs | Members, versions, issue categories, modules, repository, activities, boards. | `app/views/projects/settings/` |

### Odoo — project form as the 360

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Project form | Header facts (stage, completion, milestones, rating, favorite), description, settings, and smart buttons for tasks/milestones/updates/ratings. | `odoo/addons/project/views/project_project_views.xml` (`edit_project`) |
| Profitability / analytic items | Embedded "Analytic Items" action on the project (analytic account lines) and on project updates. | `odoo/addons/project_account/views/project_project_views.xml`, `odoo/addons/project_account/models/project_project.py` |
| Sales / invoices | Embedded actions for sales orders, order items and invoices (from `sale_project`); actual-margin action. | `odoo/addons/sale_project/views/project_views.xml` (`project_embedded_action_invoices`, `sales_orders`, `sales_order_items`, `project_actual_margin`) |
| Updates | Project update list/kanban/form/graph; each update has status, progress, author, date, description and task counts. | `odoo/addons/project/views/project_update_views.xml`, `odoo/addons/project/models/project_update.py` |
| Portal | Customer portal templates for projects and tasks. | `odoo/addons/project/views/project_portal_project_project_templates.xml`, `odoo/addons/project/views/project_portal_project_task_templates.xml` |

### ERPNext / AureusERP / Dolibarr / Gauzy / WeCreate

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| ERPNext | Project form tabs | Tasks, Customer, Notes, Costing (accounting, costing/billing, margin), Progress updates, More Info, Connections. | `erpnext/erpnext/projects/doctype/project/project.json` |
| ERPNext | Project dashboard | Connections to Task/Timesheet/Issue/Project Update, material requests/BOM/stock, sales, purchase, manufacture; timesheet heatmap. | `erpnext/erpnext/projects/doctype/project/project_dashboard.py`, `project_dashboard.html` |
| AureusERP | Project view | Infolist + relation managers (milestones, tasks), timesheets relation on tasks. | `plugins/webkul/projects/src/Filament/Resources/ProjectResource/Schemas/ProjectInfolist.php`, `RelationManagers/` |
| Dolibarr | Project card tabs | Project, Contacts, Tasks (with badge), Time spent, Project overview/elements (proposals, orders, invoices, contracts, interventions, shipments, MOs, trips…), Tickets, Event organization, Emailings, Notes, Documents, Agenda. | `htdocs/core/lib/project.lib.php` (`project_prepare_head`), `htdocs/projet/card.php`, `htdocs/projet/element.php` |
| Dolibarr | Project statistics | Statistics mode over the project list. | `htdocs/projet/stats/index.php` |
| Gauzy | Project detail | Record page + edit dialog; task view has a right-side quick-look drawer and a bookmarkable full page that render the same sections. | `apps/gauzy/src/app/pages/projects/`, `apps/gauzy/src/app/pages/tasks/components/task-view/`, `apps/gauzy/src/app/pages/tasks/components/task-view/task-view-sections.ts` |
| WeCreate | Project profile | Instagram-like project page: owner profile, status transition links, visibility, start date, estimated hours, description, posts/photos; positions are managed on a separate screen. | `screen/wcinternal/Project/ViewProject.xml`, `FindProjectPositions.xml` |
| WorkManagement | Project detail | Simple inline-edit project view; task list is the main content. | `screen/wm/Project/Project.qvue` |

**BOSS implications.** The project detail page should be a **hub with smart buttons**, not a form: header (health, dates, manager, customer), tabs for Overview / Work items / Milestones / Timesheets / Costs / Files / Activity, and links to the linked Sales order, Requests and invoices. OpenProject's widget grid is the right long-term overview; the first cut can be a fixed layout with the same widgets (health, timeline, next milestone, budget vs actual, overdue tasks, recent activity). Do not copy Dolibarr's tab explosion verbatim — group commercial elements under "Related" instead of one tab per document type.

---
## 4. Tasks / work packages

### OpenProject — the most complete work-item UI in the checkout

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Work-package list | One query-space with table and card ("grid") representations, optional timeline; configurable columns, grouping, sorting, filters, pagination, sums row, inline create, bulk actions, export. | `app/views/work_packages/index.html.erb`, `frontend/src/app/features/work-packages/routing/wp-list-view/`, `frontend/src/app/features/work-packages/components/wp-table/`, `frontend/src/app/features/work-packages/components/wp-card-view/`, `frontend/src/app/features/work-packages/components/wp-query/` |
| Display modes | `displayRepresentation` switches table ⇄ cards; a timeline toggle adds the Gantt-style right pane; split view opens the selected item beside the list. | `frontend/src/app/features/work-packages/routing/wp-view-base/view-services/wp-view-display-representation.service.ts`, `frontend/src/app/features/work-packages/components/wp-buttons/wp-timeline-toggle-button/`, `app/views/work_packages/split_view.html.erb` |
| Saved queries | Query name, public/starred, filters, columns, sort, group-by; query select menus in the global and project menus. | `app/models/queries/`, `app/views/work_packages/menus/`, `frontend/src/app/features/work-packages/components/wp-query/` |
| Work-package filters | Assigned/assignee-or-group, author, blocked/blocks, category, comment, created/updated, dates interval, done ratio, due/start, duration, estimated hours, id, milestone, parent, priority, project, project phase, relations (relates/duplicates/precedes/follows/requires), responsible, role, shared-with-me/user, status, subject, type, version, watcher, custom fields. | `app/models/queries/work_packages/filter/*.rb` |
| Work-package columns/selects | Relation, custom-field, project phase, typeahead, manual sort; custom fields are first-class columns. | `app/models/queries/work_packages/selects/*.rb` |
| Full work-package view | Tabs: Overview, Activity, Relations, Watchers, Files, Project attributes. Activity supports journals, revisions, filtering/sorting, reactions, inline edit; relations tab groups hierarchy and typed relations. | `app/components/work_packages/full_view/`, `frontend/src/app/features/work-packages/components/wp-single-view-tabs/` |
| Work-package form | Subject, description, type, status, priority, assignee, responsible, project, phase, version, category, start/due dates, duration, % complete, estimated/remaining hours, budget, custom fields, attachments, watchers, parent/relations. | `app/components/work_packages/`, `frontend/src/app/features/work-packages/components/wp-edit/`, `frontend/src/app/features/work-packages/components/wp-details/` |
| Inline create / split create | Create a work package in the list or beside it without leaving the query; type and project preset. | `app/components/work_packages/full_view/create_component.*`, `app/views/work_packages/split_create.html.erb` |
| Relations | Parent/child hierarchy, blocked-by/blocks, relates, duplicates, precedes/follows, requires; relation create/remove/group rows; hierarchy indentation. | `frontend/src/app/features/work-packages/components/wp-relations/`, `frontend/src/app/features/work-packages/components/wp-table/` hierarchy services |
| Bulk / copy / move | Bulk edit/delete, copy with options, move to another project. | `app/views/work_packages/bulk/`, `app/views/work_packages/copy.html.erb`, `app/views/work_packages/moves/` |
| Work-package summary report | Per-category summary of work packages (counts by status/type) with details. | `app/views/work_packages/reports/report.html.erb`, `app/views/work_packages/reports/report_details.html.erb` |
| Reminders / watchers / share | Reminder modal, watcher button/tab, share modal. | `frontend/src/app/features/work-packages/components/wp-buttons/wp-reminder-button/`, `frontend/src/app/features/work-packages/components/wp-single-view-tabs/watchers-tab/`, `frontend/src/app/features/work-packages/components/wp-share-modal/` |
| Baseline | Plan baseline display with legends and baseline modal. | `frontend/src/app/features/work-packages/components/wp-baseline/` |
| Project attributes tab | Shows project-level attributes while viewing a work package. | `frontend/src/app/features/work-packages/components/wp-single-view-tabs/project-attributes-tab/` |

### Redmine — compact issue tracker with a strong query model

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Issue list | Query-driven list with selected columns, grouping, sorting, inline column choice, bulk edit, context menu, CSV/Atom/PDF exports. | `app/views/issues/index.html.erb`, `app/controllers/issues_controller.rb` |
| Issue query columns | Id, project, tracker, parent, status, priority, subject, author, assignee, watchers, updated, category, fixed version, start/due dates, estimated hours, estimated remaining, total estimated, done ratio, created/closed, last updated by, relations, attachments, description, last notes. | `app/models/issue_query.rb` (`available_columns`) |
| Issue query filters | Status, tracker, priority, assignee, author, category, fixed version, dates, estimated/spent hours, done ratio, project/subproject, parent/child, relations, watchers, custom fields, free text. | `app/models/issue_query.rb` (`initialize_available_filters`) |
| Saved queries | Personal/public queries, default query per project/user, query form with column/group/sort/options; CSV options dialog. | `app/views/queries/`, `app/models/query.rb`, `app/controllers/queries_controller.rb` |
| Issue detail | Header (subject, status, private badge, previous/next), author/assignee avatars, attributes table (status, priority, assignee, category, version, dates, done ratio, estimated/spent), description, subtasks, relations, attachments, watchers, history/time/changeset tabs. | `app/views/issues/show.html.erb`, `app/views/issues/tabs/` |
| Issue form | Tracker, subject, description, status, priority, assignee, category, fixed version, start/due, done ratio, estimated hours, parent, watchers, private, custom fields, attachments. | `app/views/issues/_form.html.erb`, `_attributes.html.erb` |
| Subtasks / relations | Parent/child tree, related issues (relates/duplicates/blocks/precedes/follows/copied-to), watchers. | `app/views/issues/_subtasks.html.erb`, `_relations.html.erb`, `app/models/issue_relation.rb` |
| Bulk edit | Multi-select issue update with per-field "no change" semantics. | `app/views/issues/bulk_edit.html.erb`, `app/controllers/issues_controller.rb` |
| Issue categories / trackers | Project-scoped categories and global trackers with per-tracker workflows/fields. | `app/views/issue_categories/`, `app/views/trackers/`, `app/models/issue_category.rb` |
| Watchers | Add/remove watchers, watcher list column and filter. | `app/views/watchers/`, `app/models/watcher.rb` |
| Issue intake / mail handler | Incoming mail creates issues or replies; target project resolved by subaddress or `project` keyword; permission checks per project. | `app/models/mail_handler.rb` |

### Odoo — task views and form

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Task views | Kanban (grouped by stage or project), list, calendar, activity, pivot, graph; My Tasks grouped by personal stage; All Tasks ungrouped with project column. | `odoo/addons/project/views/project_task_views.xml` (`action_view_my_task`, `action_view_all_task`, `view_task_kanban`, `view_task_tree2`, `view_task_calendar`) |
| Task form | Stage bar + state bar, priority, tags, project, milestone, assignees, roles, customer, deadline, recurrence (interval/unit/type/until), allocated hours, description (collaborative HTML), sub-tasks, blocked-by, extra info. | `odoo/addons/project/views/project_task_views.xml` (`view_task_form2`), `odoo/addons/project/models/project_task.py` |
| Task states | In Progress, Changes Requested, Approved, Waiting, Done, Canceled; stage is separate and per-project. | `odoo/addons/project/models/project_task.py` (`state`, `stage_id`) |
| Subtasks / dependencies | `child_ids` table with stage/assignee/deadline; `depend_on_ids` "Blocked By" table with the same columns. | `odoo/addons/project/views/project_task_views.xml` |
| Recurrence | Recurring task checkbox + interval/unit/type/until; recurrence count stat button. | `odoo/addons/project/models/project_task.py` |
| Activities | Mail activities on tasks; "Next Activity"/"My Deadline" columns and activity view. | `odoo/addons/project/views/project_task_views.xml`, `odoo/addons/mail/views/` |
| Rating | Customer rating on tasks/projects (`rating_last_value`, rating stat button). | `odoo/addons/project/views/project_task_views.xml`, `odoo/addons/project/views/project_project_views.xml` |
| Portal sharing | Share project/task with portal users; portal task/project templates. | `odoo/addons/project/views/project_sharing_project_task_views.xml`, `odoo/addons/project/views/project_portal_project_project_templates.xml`, `odoo/addons/project/views/project_portal_project_task_templates.xml` |

### ERPNext / AureusERP / Dolibarr / Gauzy / WorkManagement

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| ERPNext | Task form | Subject, project, issue, type, group flag, status (Open/Working/Pending Review/Overdue/Template/Completed/Cancelled), priority, weight, parent task, completed by/on, template flags, begin/duration, expected dates/time, progress, milestone flag, description, dependencies, actual dates/time, costing/billing, review/closing dates, department/company. | `erpnext/erpnext/projects/doctype/task/task.json` |
| ERPNext | Task list/Gantt/calendar | Standard list with Gantt view (Frappe Gantt) and calendar; task dashboard connections. | `erpnext/erpnext/projects/doctype/task/task_list.js`, `erpnext/erpnext/projects/doctype/task/task_calendar.js`, `frappe/frappe/public/js/frappe/views/gantt/gantt_view.js`, `erpnext/erpnext/projects/doctype/task/task_dashboard.py` |
| ERPNext | Task dependencies | `Task Depends On` / `Dependent Task` child tables. | `erpnext/erpnext/projects/doctype/task_depends_on/`, `erpnext/erpnext/projects/doctype/dependent_task/` |
| AureusERP | Task table | Priority toggle, state icon/modal, title, project, milestone, customer, assignees, allocated hours, time spent, remaining, progress, deadline, tags. | `plugins/webkul/projects/src/Filament/Resources/TaskResource/Tables/TasksTable.php` |
| AureusERP | Task form | Progress stepper per project stage, title, state, tags, description, project, milestone, customer, assignees, deadline, allocated hours. | `plugins/webkul/projects/src/Filament/Resources/TaskResource/Schemas/TaskForm.php` |
| AureusERP | Task relations | Sub-tasks and timesheets relation managers; manage-tasks/manage-subtasks/manage-timesheets pages. | `plugins/webkul/projects/src/Filament/Resources/TaskResource/RelationManagers/`, `plugins/webkul/projects/src/Filament/Resources/TaskResource/Pages/` |
| Dolibarr | Project tasks list | Tasks table with filters, progress, assigned users, dates, time spent; tasks can be grouped/sorted and mass-updated. | `htdocs/projet/tasks.php`, `htdocs/projet/tasks/list.php` |
| Dolibarr | Task card | Task identity, dates, progress, assigned users, contacts, notes, documents, comments, time spent; status progression. | `htdocs/projet/tasks/task.php`, `htdocs/core/lib/project.lib.php` (`task_prepare_head`) |
| Gauzy | Task lists | Table, kanban, and sprint views; task dialog for create/edit; team and "my task" dialogs. | `apps/gauzy/src/app/pages/tasks/components/task/`, `apps/gauzy/src/app/pages/tasks/components/task-view/` |
| Gauzy | Task view | Shared read-only sections rendered in both a right-side drawer and a full-width route page (details, relations: members, project, parent, tags, teams, sprint, status/priority/size, estimate). | `apps/gauzy/src/app/pages/tasks/components/task-view/task-view-sections.ts`, `task-view-page.component.html` |
| WorkManagement | Task screen | QVue task table with full-screen task editor, inline edit of name/assignee/project/status/priority/due date, comments, saved finds, filter drawer (person/role/project/status/order/text). | `screen/wm/Task/Task.qvue`, `screen/wm/Task.xml` |
| WorkManagement | Task notifications | Task update/assignment email templates. | `screen/EmailTemplates/WMTaskUpdateNotificationEmail.xml` |
| Nextcloud Tasks / Deck | See Commons research §11 | VTODO-backed personal tasks and kanban cards with details/attachments/comments/activity tabs. | [research-drawers-commons.md](research-drawers-commons.md) §11 |
| Moqui Sales | Edit task | Moqui-native task edit screen tied to a sales opportunity: task id/name/status/estimated completion/description; links to project summary, milestone summary and task summary; uses SimpleScreens work transitions for user project list/milestones/task list. | `screen/Sales/Task/EditTask.xml` (references `component://SimpleScreens/template/work/WorkTransitions.xml`) |
| Zimbra | Tasks | Personal task list over task-list folders: sortable list columns, detail view, edit view with due date, percent complete, priority and reminder; new task-folder dialog. | `WebRoot/js/zimbraMail/tasks/view/{ZmTaskListView,ZmTaskView,ZmTaskEditView,ZmNewTaskFolderDialog}.js`, `WebRoot/templates/tasks/Tasks.template` |
| Twenty | Per-record tasks widget | Task component and hooks used inside record timelines; not a full project module. | `packages/twenty-front/src/modules/activities/tasks/` |

**BOSS implications.** Build **one work-item screen** over Mantle `WorkEffort` and switch views over the same dataset: list/table, kanban/board, calendar, timeline/Gantt. OpenProject's **saved queries + configurable columns + grouping + split view** is the right interaction model, and Redmine proves that a compact column/filter set is enough for small teams. Keep three concepts separate: (1) **work-item status** (per type workflow), (2) **project health** (six-state), and (3) **stage/board column** (per project). Adopt OpenProject's typed relations (parent/child, blocked-by/blocks, relates, duplicates, precedes/follows, requires) rather than free-text links; adopt Odoo's recurrence and personal "My Tasks" stage view, and Redmine's watchers + email reply intake. Request records should stay a separate entity linked to work items, not a disguised task, because SLA and communication semantics differ (see §11).

---

## 5. Boards, backlogs & sprints

### OpenProject — action-based boards + real backlog

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Boards index / board | Kanban board whose columns are driven by a chosen action: status, assignee, version, subproject, or subtasks; card drag moves the work package field; board configuration modal, add-list, filters, toolbar, inline add. | `modules/boards/app/controllers/boards/boards_controller.rb`, `modules/boards/app/views/boards/`, `frontend/src/app/features/boards/board/` |
| Board actions registry | Column semantics are pluggable services (`status`, `assignee`, `version`, `subproject`, `subtasks`); the same board shell serves all of them. | `frontend/src/app/features/boards/board/board-actions/` (`board-actions-registry.service.ts`, `*-action.service.ts`) |
| Board configuration | Configure action, filters, columns, and save/share the board view. | `frontend/src/app/features/boards/board/configuration-modal/`, `add-list-modal/` |
| Backlog & sprints | Combined backlog + sprint view with drag-and-drop across lists, batch moves, split view, filters. | `modules/backlogs/app/views/backlogs/backlog/show.html.erb`, `modules/backlogs/app/views/backlogs/sprints/index.html.erb` |
| Sprint reports / burndown | Burndown chart and sprint report widgets. | `modules/backlogs/app/views/backlogs/burndown_chart/show.html.erb`, `modules/backlogs/app/components/backlogs/sprint_reports/`, `modules/backlogs/app/models/burndown.rb` |
| Backlog settings | Estimation units, multiple active sprints, shared backlogs, sprint sharing. | `modules/backlogs/app/views/projects/settings/`, `modules/backlogs/app/controllers/projects/settings/` |
| Sprint work-package fields | Sprint/backlog bucket fields on work packages plus bulk edit. | `modules/backlogs/app/views/work_packages/bulk/_sprint_and_backlog_bucket_fields.html.erb` |

### Other references

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Nextcloud Deck | Board + card sidebar | Kanban stacks, card drag/reorder, card details/attachments/comments/activity tabs, labels, assignees, due/start, dependencies, board sharing and timeline; also a Gantt board mode. | `deck/src/components/board/Board.vue`, `components/card/CardSidebar*.vue` (see Commons research §11) |
| Odoo | Task kanban | Kanban grouped by stage (default) or project; quick create; drag changes stage. | `odoo/addons/project/views/project_task_views.xml` (`view_task_kanban*`) |
| Gauzy | Sprint view | Task board organized by sprint; task/task-view components shared with list pages. | `apps/gauzy/src/app/pages/tasks/components/task/tasks-layouts/tasks-sprint-view/` |
| Redmine | Boards | **Not kanban** — project forums with topics/messages. Worth keeping as a discussion surface, not a work board. | `app/views/boards/`, `app/views/messages/` |
| ERPNext | Kanban | Generic Frappe kanban on Task/Project; no sprint/backlog module in this checkout. | `frappe/frappe/public/js/frappe/views/kanban/` (framework), `erpnext/erpnext/projects/` |
| WorkManagement / WeCreate | none | Table/detail only. | — |

**BOSS implications.** Implement boards as **views over the work-item query with a column action**, matching OpenProject: columns can be status, assignee, milestone, project, or parent task. That keeps one board implementation instead of separate "status board / team board / milestone board" screens. Backlogs/sprints are only worth building if IronStone targets agile teams; the data model can support them as a work-item field (sprint/backlog bucket) without a separate backlog UI at first. Redmine's "board = forum" is a reminder that project discussion is a different feature; put discussions in Commons/Comms rather than overloading the board.

---

## 6. Gantt, timeline & calendar

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| OpenProject | Work-package table timeline | Gantt-style bars in the right pane of the table, driven by start/due dates and relations; toggle from the toolbar. | `frontend/src/app/features/work-packages/components/wp-table/timeline/`, `wp-buttons/wp-timeline-toggle-button/` |
| OpenProject | Gantt module | Full-page Gantt view (saved Gantt queries, project/global). | `modules/gantt/app/views/gantt/gantt/index.html.erb`, `modules/gantt/app/controllers/gantt/` |
| OpenProject | Portfolio Gantt | Global project list links to a Gantt query over portfolio projects. | `app/components/projects/index_page_header_component.rb` (`gantt_portfolio_query_link`) |
| OpenProject | Baseline | Planned-vs-actual baseline bars/legends and baseline modal. | `frontend/src/app/features/work-packages/components/wp-baseline/` |
| OpenProject | Calendar | Work-package calendar page. | `frontend/src/app/features/calendar/wp-calendar/`, `wp-calendar-page/` |
| OpenProject | Project timeline widget | Phase/project timeline on the overview. | `modules/overviews/app/components/overviews/project_phases/`, `Grids::Widgets::ProjectTimeline` |
| Redmine | Gantt | Query-driven Gantt chart with relations and progress line. | `app/views/gantts/show.html.erb`, `_chart.html.erb`, `app/controllers/gantts_controller.rb` |
| Redmine | Calendar | Issue calendar by start/due date, with project/user filters. | `app/views/calendars/show.html.erb`, `app/controllers/calendars_controller.rb` |
| Dolibarr | Gantt | Project Gantt view (jsGantt) and per-project Gantt include. | `htdocs/projet/ganttview.php`, `ganttchart.inc.php`, `jsgantt_language.js.php` |
| ERPNext | Gantt/calendar | Frappe Gantt view and task calendar. | `frappe/frappe/public/js/frappe/views/gantt/gantt_view.js`, `erpnext/erpnext/projects/doctype/task/task_calendar.js` |
| Odoo | Calendar | Task calendar and project calendar by planned dates. | `odoo/addons/project/views/project_task_views.xml` (`view_task_calendar`), `project_project_views.xml` (`view_project_calendar`) |
| AureusERP | Full calendar | Generic full-calendar plugin used by project/task resources. | `plugins/webkul/full-calendar/` (listed in 3p-app-reference.md) |
| Gauzy | Calendar | Time-log/timesheet calendar plus task dates. | `apps/gauzy/src/app/pages/employees/timesheet/calendar/` |

**BOSS implications.** Gantt should be a **view of the work-item query**, with dependencies as bars/arrows and the same filters/columns as the list; OpenProject's inline timeline plus baseline is the strongest model, and Redmine's query-driven Gantt is the minimum viable one. Calendar should be the same dataset by date fields. If scheduling people matters more than task bars, the team planner (§9) is the better default landing than a Gantt.

---

## 7. Milestones, versions & phases

IronStone Projects needs **milestones** (client-visible dates/deliverables), **versions/releases** (what ships when) and **project phases** (life-cycle stages with gates). The references model these as three different things; BOSS should not collapse them without deciding which semantics it wants.

### OpenProject — versions/roadmap + phases/gates

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Versions index / roadmap | Project version list with roadmap filter and version links; each version shows status, date, description and issue/work-package counts. | `app/views/versions/index.html.erb`, `_roadmap_filter.html.erb`, `_roadmap_version_links.html.erb` |
| Version detail | Name, status, overview, linked wiki page, time tracking (estimated, remaining, spent), status-by breakdown, related work packages, edit/delete. | `app/views/versions/show.html.erb`, `_overview.html.erb`, `_issue_counts.html.erb` |
| Version settings | Create/edit version, status, due date, description, wiki page. | `app/views/versions/new.html.erb`, `edit.html.erb`, `_form.html.erb` |
| Version widgets | Overview widget, work-packages graph, wiki widget, progress widget, related-issues widget. | `app/components/projects/settings/versions/` |
| Project phases | Admin-defined phase definitions with start/finish gates and position; project-level start/finish dates per phase; duration calculated over working days; previous-phase chaining. | `app/models/project/phase.rb`, `app/models/project/phase_definition.rb`, `modules/overviews/app/components/overviews/project_phases/` |
| Phase settings | Activate/deactivate phases per project; reschedule; working-day-aware duration. | `app/controllers/projects/settings/life_cycle_steps_controller.rb`, `app/services/project_phases/` |
| Phase filtering | Project/work-package filters by phase, any phase, phase gate. | `app/models/queries/work_packages/filter/project_phase_filter.rb`, `app/models/queries/projects/filters/project_phase_*.rb` |
| Milestone work packages | No dedicated milestone model: milestones are either a work-package **type** (admin-configured) or represented by versions/phases. | `app/models/type.rb`, `app/models/version.rb` |

### Redmine — versions/roadmap

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Roadmap / versions index | Versions grouped by status, with issue counts, dates and completion; roadmap filter. | `app/views/versions/index.html.erb`, `_roadmap_filter.html.erb` |
| Version detail | Name, status badge, overview, wiki page content, time tracking (estimated, remaining, spent), status-by breakdown, related issues. | `app/views/versions/show.html.erb`, `_overview.html.erb` |
| Version form | Name, description, status (open/locked/closed), due date, sharing, wiki page title. | `app/views/versions/_form.html.erb` |
| Version settings | Project settings → versions list; issue category/version assignment. | `app/views/projects/settings/_versions.html.erb` |

### Odoo / ERPNext / AureusERP / others

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | Milestones | Name, sequence, project, deadline, reached flag/date, task count/done count, deadline exceeded/future flags; list/kanban/form; project shows reached count/progress and next milestone. | `odoo/addons/project/views/project_milestone_views.xml`, `odoo/addons/project/models/project_milestone.py` |
| Odoo | Milestone billing | Milestones can carry a sales-order line and quantity percentage; reaching milestones drives delivered quantity/invoicing. | `odoo/addons/sale_project/models/project_milestone.py`, `sale_order_line.py` |
| Odoo | Project stages | Life-cycle-ish stage list with fold/rotting, separate from milestones. | `odoo/addons/project/models/project_project_stage.py` |
| ERPNext | Milestone | `Task.is_milestone` + milestone flag in task list/Gantt; project % complete can use task completion/progress/weight. No separate milestone record. | `erpnext/erpnext/projects/doctype/task/task.json` |
| ERPNext | Project template | Template project type + template tasks; copied into new projects. | `erpnext/erpnext/projects/doctype/project_template/` |
| AureusERP | Milestones | Configurable milestone records (name, deadline, completed) attached to projects/tasks. | `plugins/webkul/projects/src/Filament/Clusters/Configurations/Resources/MilestoneResource/` |
| Dolibarr | none | No milestone/version object; use task dates and project start/end. | `htdocs/projet/` |
| Gauzy | Goals/OKRs | Goals/key results are a separate management layer, not project milestones. | `apps/gauzy/src/app/pages/goals/` |
| WeCreate / WorkManagement | none | Estimated dates/hours only. | `screen/wcinternal/Project/`, `screen/wm/` |

**BOSS implications.** Decide explicitly: **milestones** are client-facing deliverables (date + reached state + optional billing trigger), **versions/releases** are a set of work items that ship together, and **phases** are the project life cycle. OpenProject's phase/gate model is the richest and fits services delivery; Odoo's milestone → sales-order milestone billing is the cleanest T&M link; Redmine's roadmap is the cheapest version/roadmap UI. For the first cut, implement milestones and phases; add version/roadmap only if releases are a real workflow. Do not make milestones a task type with no reached/billing semantics.

---

## 8. Time tracking & timesheets

### OpenProject — time entries, My work, timer, rates

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Time entry form | User (when logging for others), days + hours (or start time), work package/meeting entity, activity, comments, custom fields. | `modules/costs/app/components/time_entries/time_entry_form_component.html.erb` |
| My work — list | Time entries grouped in a list with stats, filters, row action menu, edit/delete. | `app/components/my/work/list_component.*`, `time_entries_list_component`, `list_stats_component` |
| My work — calendar | Calendar view of logged time. | `app/components/my/work/calendar_component.*` |
| My work — allocations | Scheduled/remaining allocation rows and action menu, separate from actual time entries. | `app/components/my/work/allocation_row.rb`, `allocation_action_menu_component.rb`, `remaining_allocations.rb` |
| Timer | Start/stop timer tied to a work package/time entry; running timer shown in the menu and in My work. | `modules/costs/app/components/my/timer/`, `app/components/my/work/stop_timer_component.rb` |
| Time & costs settings (project) | Enable time/cost tracking, choose time-entry activities, cost types, rates. | `modules/costs/app/components/projects/settings/time_and_costs/`, `time_entry_activities/`, `cost_types/` |
| Time entry activities | Enumeration-like activities (development, design, …), per project. | `modules/costs/app/controllers/admin/settings/time_entry_activities_controller.rb`, `modules/costs/app/models/time_entry_activities_project.rb` |
| Hourly rates | Default rate, user rate, project-specific rate with history; rate dialogs/forms. | `modules/costs/app/controllers/{default_hourly_rates,hourly_rates,my/hourly_rates}_controller.rb`, `modules/costs/app/components/hourly_rates/` |
| Cost entries | Non-time costs (units × cost type) attached to work packages/projects. | `modules/costs/app/models/cost_entry.rb`, `modules/costs/app/views/costlog/` |
| Time entry model | Project, polymorphic entity (work package or meeting), user, activity, rate, logged_by, spent_on, hours, start time, comments, custom fields. | `modules/costs/app/models/time_entry.rb` |
| Time entry reports | Cost/time reports with grouping and export; time entries also appear in work-package/cost widgets. | `modules/reporting/`, `modules/costs/app/controllers/grids/widgets/time_entries_current_user_controller.rb` |

### Redmine — timelog + report

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Log time form | Project, issue, user (if permitted), spent_on, hours, comments, activity, custom fields. | `app/views/timelog/_form.html.erb` |
| Time entries list | Query list with filters, columns, bulk edit, CSV. | `app/views/timelog/index.html.erb`, `app/controllers/timelog_controller.rb` |
| Spent-time report | Criteria (up to 3: project, issue, user, activity, tracker, category, version, …), columns year/month/week/day, totals, CSV. | `app/views/timelog/report.html.erb`, `_report_criteria.html.erb`, `lib/redmine/helpers/time_report.rb` |
| My page time log block | Last N days of the current user's time entries, grouped by day. | `app/helpers/my_helper.rb` (`render_timelog_block`), `app/views/my/blocks/_timelog.html.erb` |
| Time entry model | Project, issue, user, author, activity, hours, spent_on, comments; required issue/comments configurable. | `app/models/time_entry.rb` |
| Activities admin | Time-entry activities and project-level activity enablement. | `app/views/enumerations/`, `app/views/projects/settings/_activities.html.erb` |

### Odoo — analytic-line timesheets

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Timesheet list/form | Analytic line: date, employee/user, project, task, description/name, unit amount, billable/cost amounts. | `odoo/addons/hr_timesheet/views/account_analytic_line_views.xml` (`hr_timesheet_line_tree`, `hr_timesheet_line_form`, `timesheet_view_form_user`) |
| Timesheet views | List, kanban, calendar, pivot, graph; "My Timesheets" and "My Projects/Tasks" filters; group by employee/project/task/date. | `odoo/addons/hr_timesheet/views/account_analytic_line_views.xml` (`view_kanban_account_analytic_line`, `view_calendar_account_analytic_line`, `view_hr_timesheet_line_pivot`, `view_hr_timesheet_line_graph`) |
| Pivot analyses | Employee × month and date-by-week pivots with time spent and cost. | `odoo/addons/hr_timesheet/views/account_analytic_line_views.xml` (`view_hr_timesheet_line_pivot`, `view_my_timesheet_line_pivot`) |
| Timer | **No native timer in this community checkout** (only `timesheet_grid`/enterprise or third-party adds one). | — |
| Timesheet settings | Time unit, encode reminders (including a reminder to approvers), time-off-generated timesheets, and project/task linkage; the approval UI itself is not in this community checkout. | `odoo/addons/hr_timesheet/views/res_config_settings_views.xml` |

### ERPNext / AureusERP / Gauzy / Dolibarr

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| ERPNext | Timesheet form | Title, company, customer, currency, sales invoice, status (Draft/Submitted/Partially Billed/Billed/Payslip/Completed/Cancelled), project, user, start/end date, employee/department, `time_logs` grid, totals, billing details, note. | `erpnext/erpnext/projects/doctype/timesheet/timesheet.json` |
| ERPNext | Time log row | Activity type, from/to time, expected hours, hours, completed, project, task, billing hours/rate/amount, costing rate/amount, sales invoice, billable flag, description. | `erpnext/erpnext/projects/doctype/timesheet_detail/timesheet_detail.json` |
| ERPNext | Timer | In-form timer starts/stops a row and creates new rows; `timer.js` loaded by the Timesheet form. | `erpnext/erpnext/projects/doctype/timesheet/timesheet.js`, `erpnext/erpnext/public/js/projects/timer.js` |
| ERPNext | Timesheet calendar/list | Calendar and list views, dashboard connections. | `timesheet_calendar.js`, `timesheet_list.js`, `timesheet_dashboard.py` |
| AureusERP | Timesheet resource | Date, employee, project, task, description, time spent (unit amount); list/manage pages. | `plugins/webkul/timesheets/src/Filament/Resources/TimesheetResource/Schemas/TimesheetForm.php`, `Pages/ManageTimesheets.php` |
| Gauzy | Weekly timesheet | Project/task rows × weekday columns, per-cell duration with popover detail, add-time button, filters. | `apps/gauzy/src/app/pages/employees/timesheet/weekly/weekly/weekly.component.html` |
| Gauzy | Daily timesheet | Row-per-log table: project/task, employee, log type, source, duration, time span, notes; bulk selection/delete; edit/add. | `apps/gauzy/src/app/pages/employees/timesheet/daily/daily/daily.component.html` |
| Gauzy | Calendar timesheet | Calendar view of logs. | `apps/gauzy/src/app/pages/employees/timesheet/calendar/` |
| Gauzy | Approvals | Approval requests list/table, approve/reject actions, approval policies. | `apps/gauzy/src/app/pages/approvals/` |
| Gauzy | Timer | Desktop timer/activity apps feed time logs. | `apps/desktop-timer/`, `apps/desktop-activity/` |
| Dolibarr | Time spent list | Per project/task time entries with date, user, duration, product, billed flag; filters incl. date and duration. | `htdocs/projet/tasks/time.php` |
| Dolibarr | Timesheet input | Per day / per week / per month input grids. | `htdocs/projet/activity/perday.php`, `perweek.php`, `permonth.php`, `htdocs/core/lib/project.lib.php` (`project_timesheet_prepare_head`) |
| WorkManagement / WeCreate | none | Only estimated hours on tasks/projects. | — |

**BOSS implications.** Use one **time-entry** entity (user, date, hours/start-end, project, work item, activity, billable flag, rate, invoice link, comment) and build three surfaces over it: **My week** (grid + timer), **project/task time tab** (list + totals), and **team approval/report** (group by person/project/task/date/activity, export). OpenProject's separate "allocation" vs "actual time entry" distinction is essential for scheduling; do not conflate them. Copy Redmine's configurable required fields (issue/comment) and activities, ERPNext's billable/costing split and timer, Gauzy's weekly grid, and Dolibarr's per-day/week/month input as alternative views. Approval is a People/manager concern; make it a workflow on the timesheet period, not a field on each row.

---

## 9. Resource scheduling & capacity

### OpenProject — team planner + resource management

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Team planner index/overview | Saved plan views (name/public/starred); global and project overview lists. | `modules/team_planner/app/controllers/team_planner/team_planner_controller.rb`, `modules/team_planner/app/views/team_planner/` |
| Team planner board | Timeline of assignees × days/weeks with assigned work packages; add work packages, split view/create, view selector, assignee lanes. | `frontend/src/app/features/team-planner/team-planner/` (`planner/`, `assignee/`, `add-work-packages/`, `view-select/`) |
| Resource planners | Named planner views scoped to project/global, public/favorite, with a work-package list content and query behind it. | `modules/resource_management/app/controllers/resource_management/resource_planners_controller.rb`, `modules/resource_management/app/views/resource_management/resource_planners/`, `resource_planner_views/` |
| Resource allocations | Polymorphic allocation to a work package; requested → allocated/rejected/canceled; placeholder user requested vs named principal staffed; date range, allocated time, requested/reviewed/assigned-by. | `modules/resource_management/app/models/resource_allocation.rb` |
| Staffing | Allocation list + assignment dialog: candidate list, overbooking warning with working schedules, assign principal. | `modules/resource_management/app/controllers/resource_management/staffing_controller.rb`, `modules/resource_management/app/components/resource_allocations/` |
| Working hours / non-working times | User working hours and non-working times, used by duration/overbooking calculations; global working days/hours settings. | `app/controllers/users/working_hours_controller.rb`, `app/controllers/users/non_working_times_controller.rb`, `app/models/user_working_hours.rb`, `app/models/user_non_working_time.rb`, `app/views/users/working_hours/`, `app/views/users/non_working_times/` |
| My work allocations | Personal view of upcoming/remaining allocations. | `app/components/my/work/allocation_row.rb`, `remaining_allocations.rb` |

### Other references

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | Assignees/roles | Multiple assignees per task; project roles assigned from templates; resource calendar on project; no capacity planner in this community checkout. | `odoo/addons/project/models/project_task.py` (`user_ids`, `role_ids`), `project_project.py` (`resource_calendar_id`) |
| ERPNext | Project users + holidays | Project User child table (welcome email, attachments, hide timesheets, status); Holiday List on project for working-day calculations; no capacity planner. | `erpnext/erpnext/projects/doctype/project_user/project_user.json`, `project.json` (`holiday_list`) |
| Gauzy | People/teams/time off | Employees, teams, time-off, approvals; resource context for project/task assignment, but no allocation planner. | `apps/gauzy/src/app/pages/{employees,teams,time-off,approvals}/` |
| Dolibarr | Project contacts/roles | Internal/external contacts with project/task roles; agenda/events; no workload view. | `htdocs/projet/contact.php`, `htdocs/projet/tasks/contact.php`, `htdocs/projet/agenda.php` |
| Redmine | Members/roles | Project membership with roles and per-role permissions; no workload planning. | `app/views/projects/settings/_members.html.erb`, `app/models/member.rb`, `app/models/role.rb` |
| WeCreate | Project positions | Role/position records with invited/applied accounts and approval status — role-based staffing rather than named allocations. | `screen/wcinternal/Project/FindProjectPositions.xml` |
| WorkManagement | Assignee only | Task assignee; no capacity data. | `screen/wm/Task/Task.qvue` |

**BOSS implications.** Resource scheduling is the weakest area in the ERP references and the strongest in OpenProject; make it a first-class Projects screen. Model **allocations separately from time entries and from task assignments**: an allocation is a request for N hours over a date range against a project/work item, optionally against a placeholder role, later staffed to a person. OpenProject's placeholder-user → named-principal flow, overbooking warning and working-hours basis are the right defaults. Team planner (people × time) should be the primary manager view; a role/capacity view (People app) can aggregate across projects. Do not infer capacity from assigned tasks alone.

---

## 10. Budgets, costs & T&M billing

### OpenProject — budgets, rates, cost reports (no invoicing)

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Budgets index/show | Project budgets with labor and material budget items; spent/available rollups from time and cost entries. | `modules/budgets/app/views/budgets/{index,show,new,edit}.html.erb`, `modules/budgets/app/models/budget.rb` |
| Labor budget items | Hours × user/rate + comment + computed budget. | `modules/budgets/app/views/budgets/subform/_labor_budget_subform.html.erb`, `modules/budgets/app/models/labor_budget_items/` |
| Material budget items | Units × cost type + comment + computed budget. | `modules/budgets/app/views/budgets/subform/_material_budget_subform.html.erb`, `modules/budgets/app/models/budget.rb` (`material_budget_items`) |
| Budget widgets | Budget totals, budget by cost type, actual costs, on project/portfolio/program overviews. | `modules/budgets/app/components/budgets/widgets/`, `modules/costs/app/components/costs/widgets/actual_costs.html.erb` |
| Cost entries | Non-time costs on work packages: units, cost type, rate, spent_on, comment, budget. | `modules/costs/app/models/cost_entry.rb`, `modules/costs/app/views/costlog/edit.html.erb` |
| Cost types | Admin-defined cost types with rates and project assignments. | `modules/costs/app/controllers/admin/cost_types_controller.rb`, `admin/cost_types/cost_type_projects_controller.rb`, `modules/costs/app/views/admin/cost_types/` |
| Hourly rates | Default rate, user rate, and project-specific rate; rate history/dialogs. | `modules/costs/app/controllers/default_hourly_rates_controller.rb`, `hourly_rates_controller.rb`, `modules/costs/app/components/hourly_rates/` |
| Cost reports | Saved/public cost reports over time and cost entries, grouping/filtering, XLS/PDF export. | `modules/reporting/app/controllers/reporting/cost_reports_controller.rb`, `modules/reporting/app/views/reporting/cost_reports/index.html.erb`, `modules/reporting/app/models/cost_query/` |
| Time & costs settings | Per-project enablement, activity list, cost types/rates. | `modules/costs/app/components/projects/settings/time_and_costs/`, `cost_types/`, `time_entry_activities/` |
| Invoicing | **None.** OpenProject stops at budgets/costs; billing is external. | — |

### Odoo — analytic accounting + timesheet-driven invoicing

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Analytic account | Project carries an analytic account; analytic items are the cost/revenue ledger, shown as an embedded action. | `odoo/addons/project/models/project_project.py` (`account_id`), `odoo/addons/project_account/views/project_project_views.xml` |
| Project profitability | Analytic items + sales orders/order items/invoices embedded actions; actual-margin action. | `odoo/addons/project_account/views/`, `odoo/addons/sale_project/views/project_views.xml`, `odoo/addons/sale_project/views/project_task_views.xml` |
| Service product tracking | Product `service_tracking` can create a task in a global project, a project + task, or a project only; template project and task template selectable. | `odoo/addons/sale_project/models/product_template.py` |
| Sales-order generation | Confirming a service SO line generates/links project and task; allocated hours follow ordered quantity. | `odoo/addons/sale_project/models/sale_order_line.py` |
| Invoicing policies | Ordered/prepaid, delivered timesheets, delivered milestones; delivered quantity computed from timesheets/milestones. | `odoo/addons/sale_timesheet/models/product_template.py`, `sale_order_line.py`, `account_analytic_line.py` |
| Reinvoice / margins | Timesheet reinvoice and sale-timesheet margin modules. | `odoo/addons/sale_timesheet/`, `odoo/addons/sale_timesheet_margin/` |
| Project-linked purchasing/expenses/stock/MRP | Project fields/links on POs, expenses, stock moves, manufacturing orders. | `odoo/addons/project_purchase/`, `project_sale_expense/`, `project_stock/`, `project_mrp*/` |

### ERPNext — project costing/billing + timesheet invoicing

| Screen/page | What it is | Key files |
| --- | --- | --- |
| Project costing/billing tab | Estimated costing, total costing amount, total purchase cost, total sales amount, total billable amount, total billed amount, material cost, gross margin and margin %. | `erpnext/erpnext/projects/doctype/project/project.json` |
| Timesheet billing | Total hours/billable hours/billed hours, billable/costing amounts, per-billed %, sales invoice link, status. | `erpnext/erpnext/projects/doctype/timesheet/timesheet.json` |
| Time log rates | Billable flag, billing rate/amount, costing rate/amount per row; activity type carries default costing/billing rates. | `erpnext/erpnext/projects/doctype/timesheet_detail/timesheet_detail.json`, `activity_type/activity_type.json` |
| Sales invoice | Timesheets link to a Sales Invoice; billing summary report reconciles billable vs billed. | `erpnext/erpnext/projects/doctype/timesheet/timesheet.json` (`sales_invoice`), `erpnext/erpnext/projects/report/timesheet_billing_summary/` |
| Project transactions | Dashboard connections for sales order/invoice, purchase order/receipt/invoice, stock entry, work order, material request/BOM. | `erpnext/erpnext/projects/doctype/project/project_dashboard.py` |

### Dolibarr / Gauzy / Redmine

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Dolibarr | Billable time | Project flag `usage_bill_time`; time entries can carry a product and a "billed" flag; project overview aggregates proposals, orders, invoices, contracts, interventions, shipments, MOs and trips. | `htdocs/projet/card.php`, `htdocs/projet/tasks/time.php`, `htdocs/projet/element.php`, `htdocs/core/lib/project.lib.php` |
| Dolibarr | Project statistics | Graph/statistics view over projects (counts, status and opportunity data). | `htdocs/projet/stats/index.php` |
| Gauzy | Invoices/expenses/income/payments | Accounting records exist (invoices, payments, expenses, income, recurring expenses); no project-level T&M billing automation is visible in the project/task pages. | `apps/gauzy/src/app/pages/{invoices,payments,expenses,income,expense-recurring}/` |
| Redmine | Time/cost only | Estimated/spent hours and time reports; no rates, budgets or invoicing. | `app/models/time_entry.rb`, `app/views/timelog/report.html.erb` |
| WorkManagement / WeCreate | none | Estimated hours only; no rates/billing. | — |

**BOSS implications.** Split the problem cleanly: **costing** (rates × time + material/expense costs) belongs in Projects; **billing** (invoice draft, tax, revenue recognition) belongs in Accounting/Sales. OpenProject's budget-vs-actual widgets and ERPNext's `billable` vs `costing` split are the right data model. Support three billing bases from the start, because the references all converge on them: **time & materials** (billable hours × rate), **milestones** (reached milestone releases a percentage), and **fixed fee/prepaid** (ordered quantity). Keep rate cards versioned (OpenProject rate history; ERPNext activity-type rates), and make "unbilled time" a first-class queue in Projects that hands off to Accounting.

---

## 11. Request intake & cross-app handoffs

Projects intake in BOSS means: a customer/internal request arrives (Customer Service, email, portal, sales handoff), becomes a `Request` (Mantle) and/or a project/work item, and keeps its communication timeline. The references split this across several mechanisms.

### Intake mechanisms by app

| App | Mechanism | What it creates | Key files |
| --- | --- | --- | --- |
| **OpenProject** | Authenticated work-package create (list/split/full view); project creation wizard for new-project requests; no public request form in this checkout. Access controlled by `add_work_packages`/project permissions. | Work package (type/status/project preset) or project | `app/components/work_packages/full_view/create_component.*`, `app/views/projects/creation_wizard/show.html.erb`, `app/controllers/projects/creation_wizard_controller.rb` |
| **Redmine** | Email intake via mail handler; issue create from any project/global context; issue categories/trackers route the request. Replies thread into the issue journal. | Issue (tracker/status/priority/assignee/category/version) | `app/models/mail_handler.rb`, `app/views/issues/new.html.erb`, `app/views/issues/_form.html.erb` |
| **Odoo** | Project email alias creates tasks; portal users can create/view tasks; service products on sales orders generate projects/tasks; project/task sharing. | Task (project alias), project/task from SO | `odoo/addons/project/models/project_project.py` (`alias_id`), `odoo/addons/sale_project/models/sale_order_line.py`, `project_sharing_project_task_views.xml` |
| **ERPNext** | Issue linked to a project; public issue web form and task web form; project linked to sales order. | Issue, Task, Project | `erpnext/erpnext/projects/web_form/tasks/tasks.json`, `erpnext/erpnext/support/doctype/issue/issue.json`, `project.json` (`sales_order`) |
| **Dolibarr** | Project tab "Tickets"; public ticket portal; project links to proposals/orders/invoices/contracts/interventions. | Ticket, linked commercial documents | `htdocs/core/lib/project.lib.php` (`project_prepare_head`), `htdocs/ticket/`, `htdocs/public/ticket/`, `htdocs/projet/element.php` |
| **Frappe Helpdesk / Customer Service** | Ticket templates, portal article suggestions, email/telephony channels; no project field exists in this checkout, so project linkage would be an added `Request` relation/custom field. | HD Ticket | see [research-customer-service.md](research-customer-service.md) §2–§3 |
| **Moqui Commons** | Shared tasks/requests screens; request assigned from any app. | WorkEffort task / Mantle Request | [initial-design.md](initial-design.md), [research-drawers-commons.md](research-drawers-commons.md) §11 |
| **Gauzy / WorkManagement / WeCreate** | Internal task/project creation only; WeCreate adds project positions/applications (people apply to roles). | Task / project / position application | `apps/gauzy/src/app/pages/tasks/`, `screen/wm/Task/`, `screen/wcinternal/Project/FindProjectPositions.xml` |

### Sales-to-project handoff

| App | Handoff | Key files |
| --- | --- | --- |
| Odoo | Service product `service_tracking` = task / project+task / project; project template + task template; SO line stores generated project/task; ordered qty syncs allocated hours; invoice policy per product. | `odoo/addons/sale_project/models/product_template.py`, `sale_order_line.py`, `odoo/addons/sale_timesheet/models/*` |
| ERPNext | Project has customer + sales order; project dashboard links sales orders/invoices; project costing/billing tab aggregates them. | `erpnext/erpnext/projects/doctype/project/project.json`, `project_dashboard.py` |
| Dolibarr | Project overview/elements tab lists proposals, orders, invoices, contracts, interventions, shipments; project can be created from an opportunity (lead/project mode). | `htdocs/projet/element.php`, `htdocs/projet/card.php`, `htdocs/projet/list.php` (`LeadsOrProjects`) |
| OpenProject / Redmine | No sales integration; external reference fields/custom fields only. | — |

**BOSS implications.** Make **Request → Project/Work item** an explicit conversion with linked records, not a copy: the Request keeps SLA/channel/communication; the project/work item gets plan dates, assignee, estimate. Reuse the Customer Service intake form and its template/field-dependency model (see that research) rather than building a second intake UI. Odoo's project **email alias → task** and Redmine's **mail handler → issue** should be the default asynchronous channel, normalized through Comms/SystemMessage. For sales, follow Odoo/ERPNext: a service line on a quote/order should be able to create a project from a template and link the order, with the billing basis stored on the line. Do not duplicate customer or price data on the project; link to Party/Sales.

---

## 12. Reporting & analytics

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| OpenProject | Cost reports | Saved/public reports over time and cost entries, grouping/filtering, XLS/PDF export. | `modules/reporting/app/controllers/reporting/cost_reports_controller.rb`, `modules/reporting/app/models/cost_query/` |
| OpenProject | Work-package summary | Per-category work-package report with details. | `app/views/work_packages/reports/report.html.erb`, `report_details.html.erb` |
| OpenProject | Project/portfolio dashboards | Widget grids: status, timeline, subitems, budgets, actual costs, members, meetings, custom attributes. | `modules/overviews/app/components/overviews/workspaces/` |
| OpenProject | Baseline / Gantt / timeline | Plan-vs-actual visualization and portfolio Gantt. | `frontend/src/app/features/work-packages/components/wp-baseline/`, `modules/gantt/` |
| Redmine | Issue reports | Issue summary by tracker/status/priority/category/assignee and detailed report. | `app/views/reports/issue_report.html.erb`, `issue_report_details.html.erb` |
| Redmine | Spent-time report | Grouped hours by criteria and period, CSV. | `app/views/timelog/report.html.erb` |
| Redmine | Project overview | Live counts by tracker + spent/estimated hours. | `app/views/projects/show.html.erb` |
| Odoo | Task analysis | Pivot/graph of tasks by stage/assignee/project/working hours/rating. | `odoo/addons/project/views/project_task_views.xml` (`view_project_task_pivot`, `view_project_task_graph`) |
| Odoo | Burndown | Project/task burndown chart embedded action. | `odoo/addons/project/views/project_task_views.xml` (`project_embedded_action_project_burndown_chart`), `odoo/addons/project/static/src/views/burndown_chart/` |
| Odoo | Project updates / ratings | Health narrative + customer ratings. | `project_update_views.xml`, `rating_rating_views.xml` |
| ERPNext | Projects workspace | Project Summary chart, Open Projects / Non-completed Tasks / Timesheet Working Hours cards, report links. | `erpnext/erpnext/projects/workspace/projects/projects.json` |
| ERPNext | Reports | Project Summary, Delayed Tasks Summary, Timesheet Billing Summary, Daily Timesheet Summary, Project-wise Stock Tracking. | `erpnext/erpnext/projects/report/` |
| AureusERP | Dashboard widgets | Stats overview, tasks by state/stage, top assignees, top projects. | `plugins/webkul/projects/src/Filament/Widgets/` |
| Gauzy | Reports | Time reports, weekly time reports, manual time, project/team reports; custom dashboards. | `apps/gauzy/src/app/pages/reports/{time-reports,weekly-time-reports,manual-time}/`, `pages/dashboard/custom-dashboard/` |
| Dolibarr | Project statistics | Graph/statistics over projects. | `htdocs/projet/stats/index.php` |
| WorkManagement / WeCreate | none | Simple lists/counts only. | — |

**BOSS implications.** Keep operational reports in Projects (task counts by status/assignee, overdue, milestone slippage, unbilled time, budget vs actual, utilization) and put cross-app BI in Insights. Adopt OpenProject's saved-report model (saved filters + grouping + export) rather than hard-coded reports; adopt ERPNext's small fixed set for the landing page (open projects, non-completed tasks, hours, billing). Utilization and margin must be defined explicitly: hours logged vs allocated, billable vs non-billable, cost vs billable amount.

---

## 13. Settings & administration

### OpenProject — global work-package/project configuration + per-project settings

| Area | Screens | Key files |
| --- | --- | --- |
| Work-package administration | Types, form configuration, workflows (status-transition matrix), statuses, custom fields, priorities, progress tracking, identifier format, calendars/working days, automations, attribute help texts, AI settings. | `config/initializers/menus.rb`, `app/controllers/admin/settings/`, `app/controllers/workflows/`, `app/views/workflows/`, `app/views/statuses/`, `app/views/work_package_types/` |
| Project administration | Project lists settings, new-project settings/creation wizard, project custom fields and sections, project phase definitions, reserved identifiers. | `app/controllers/admin/settings/`, `app/components/settings/project_*`, `app/components/projects/settings/creation_wizard/` |
| Per-project settings | General, life cycle, modules, project custom fields, versions, work-package types/categories/internal comments, template, repository, storage, subitems, work-package import. | `app/components/projects/settings/`, `app/controllers/projects/settings/` |
| Users/groups/roles | Users, placeholder users, groups, departments, members, roles, permission report, avatars. | `config/initializers/menus.rb`, `app/views/users/`, `app/views/roles/`, `app/views/groups/` |
| Cost administration | Cost types/rates, time-entry activities, time settings, cost settings, custom fields for time entries. | `modules/costs/app/controllers/admin/`, `modules/costs/app/views/admin/` |
| Backlog/board/Gantt settings | Estimation units, active sprints, shared backlogs, board configuration, Gantt queries. | `modules/backlogs/app/controllers/projects/settings/`, `modules/boards/`, `modules/gantt/` |

### Redmine — admin + project settings

| Area | Screens | Key files |
| --- | --- | --- |
| Global admin | Trackers, issue statuses, workflows matrix, priorities, custom fields, enumerations (time-entry activities, document categories), roles/permissions, settings, mail handler, repositories, LDAP/auth. | `app/views/{trackers,issue_statuses,workflows,enumerations,custom_fields,roles,settings,auth_sources}/`, `app/controllers/admin_controller.rb` |
| Workflow matrix | Role × tracker × status transition matrix with field permissions. | `app/views/workflows/`, `app/controllers/workflows_controller.rb` |
| Project settings | Members/roles, versions, issue categories, modules, repository, activities, boards. | `app/views/projects/settings/`, `app/controllers/projects_controller.rb` |
| Custom fields | Issue/time-entry/project/version/user/group custom fields with format, visibility and role filters. | `app/views/custom_fields/`, `app/models/custom_field.rb` |

### Odoo / ERPNext / AureusERP / Dolibarr / Gauzy

| App | Area | Screens | Key files |
| --- | --- | --- | --- |
| Odoo | Project configuration | Settings, project/template list, project roles, project stages, task stages, tags, activity types, activity plans. | `odoo/addons/project/views/project_menus.xml`, `odoo/addons/project/views/project_project_stage_views.xml`, `odoo/addons/project/views/project_task_type_views.xml`, `odoo/addons/project/views/mail_activity_type_views.xml`, `odoo/addons/project/views/mail_activity_plan_views.xml` |
| ERPNext | Project settings | Project Settings, Project Type, Task Type, Activity Type (costing/billing rates), Project Template. | `erpnext/erpnext/projects/doctype/{projects_settings,project_type,task_type,activity_type,project_template}/` |
| AureusERP | Project configuration cluster | Activity plans, tags, task stages, milestones, project stages; settings pages for tasks/time. | `plugins/webkul/projects/src/Filament/Clusters/Configurations/`, `plugins/webkul/projects/src/Filament/Clusters/Settings/Pages/ManageTasks.php`, `plugins/webkul/projects/src/Filament/Clusters/Settings/Pages/ManageTime.php` |
| Dolibarr | Project admin | Project module setup, extra fields for project/task, permissions, opportunities toggle, timesheet visibility, billable-time switch, project numbering. | `htdocs/projet/admin/`, `htdocs/core/lib/project.lib.php` (`project_admin_prepare_head`), `htdocs/admin/` |
| Gauzy | Project/task settings | Project/task statuses, priorities, sizes, tags, project modules, organization settings. | `apps/gauzy/src/app/pages/{settings,tags,projects,tasks}/` |
| WorkManagement / WeCreate | minimal | Status/enumeration data comes from Mantle `StatusItem`/`StatusFlow`; no dedicated admin UI. | `screen/wm/`, `screen/wcinternal/` |

**BOSS implications.** Global configuration should own **work-item types, status flows, priorities, custom fields, project phases, rate cards, cost types and time-entry activities**; per-project settings should only choose/enable them and set project-specific rates/templates/visibility. OpenProject's separation of global type/form/workflow configuration from per-project enablement is the right pattern. Use Mantle status flows for the workflow matrix rather than a new engine. Do not expose a raw "task stage" and a raw "status" to users without explaining which one the board uses; BOSS should pick one board-column concept per board and derive the rest.

---

## 14. BOSS screen map

Recommended screen set for IronStone Projects, with the strongest reference for each. Shared screens marked **C** are also used by Commons/Customer Service/People.

| # | Screen | Purpose | Primary reference | Data basis / notes |
| --- | --- | --- | --- | --- |
| 1 | Projects home | Portfolio health, workload, overdue/milestone/billing exceptions, quick links | OpenProject project/portfolio dashboard + ERPNext workspace | Saved dashboard widgets; fixed first-cut layout |
| 2 | Find Projects | Find/filter/saved views; hierarchy; favorites | OpenProject projects index + Redmine project query | `WorkEffort` project type; saved finds; columns incl. custom fields |
| 3 | Project 360 | Header + Overview / Work items / Milestones / Timesheets / Costs / Files / Activity | OpenProject overview + Redmine project hub + Odoo smart buttons | Smart buttons to Sales order, Requests, invoices, People |
| 4 | Create project / template | Short create form + optional wizard; template copy | OpenProject creation wizard/template + Odoo template | Template = project flagged `templated`; copy tasks/milestones/roles/rates |
| 5 | **C** Work items | One dataset, switch list/table, kanban, calendar, timeline/Gantt | OpenProject work packages + Redmine issues | `WorkEffort` tasks; saved queries; configurable columns; split view |
| 6 | **C** Work item detail | Overview, activity/chatter, relations, watchers, files, time | OpenProject full view + Odoo task form | Status flow + stage; subtasks/dependencies/recurrence; CommunicationEvent timeline |
| 7 | Milestones / roadmap | Client deliverables, reached state, billing trigger; optional versions | Odoo milestones + OpenProject phases/versions + Redmine roadmap | Separate milestone entity; phase dates; version optional |
| 8 | **C** My work / my timesheet | Personal tasks, today/overdue, week grid, timer | OpenProject My work + Gauzy weekly + Redmine My page | Time entries + allocations; header Today panel reuses it |
| 9 | Team timesheets / approvals | Team hours, missing time, approve/reject period | Gauzy approvals + OpenProject cost/time reports | Approval workflow on timesheet period; People integration |
| 10 | Resource planner | People × time allocation, capacity, overbooking | OpenProject team planner + resource management | Allocations separate from time entries/task assignment |
| 11 | Allocations / staffing | Requested vs staffed, placeholder roles, candidate assignment | OpenProject resource allocations/staffing | Allocation states; overbooking warning; working hours |
| 12 | Budget & cost | Budget vs actual, labor/material, rates | OpenProject budgets/cost reports + ERPNext costing | Costing only; no invoice creation here |
| 13 | Billing queue | Unbilled time/milestones/fixed fees → invoice draft | Odoo sale_timesheet + ERPNext timesheet billing | Hands off to Accounting; billing basis on project/SO line |
| 14 | **C** Request intake | Request form/templates, email/portal channel, convert to project/work item | Customer Service research + Redmine mail handler + Odoo alias | Mantle `Request`; conversion links, does not copy |
| 15 | Project reports | Task/milestone/budget/utilization/unbilled reports | OpenProject cost/WP reports + ERPNext reports | Saved reports; cross-app BI in Insights |
| 16 | Project settings | General, phases, members/roles, modules, custom fields, rates, templates | OpenProject project settings + Redmine project settings | Per-project enablement over global config |
| 17 | Portfolio / program (later) | Roll-up of projects, shared budgets/capacity | OpenProject portfolio/program | Data model supports parent workspace types now |

**Data-model sketch (Mantle-based).** `WorkEffort` for project and task; a project-type flag or `WorkEffortType`; `WorkEffortPartyAssignment` for manager/members/roles; Mantle status entities/status flows for status and stage (or stage as a project-specific status flow); `WorkEffort` parent/child for subtasks and project hierarchy; a typed relation table for blocked-by/blocks/relates/duplicates/precedes/follows/requires; `TimeEntry` linked to work item + project + party + activity + rate; `ResourceAllocation` linked to work item/project + placeholder/party + date range + hours; `Budget` + labor/material items or cost entries; `Request` linked to work item; Sales order line linked to project; `CommunicationEvent` for the timeline. Milestones are their own entity (name, date, reached, billing percentage) because they carry commercial semantics; versions/releases can reuse a WorkEffort subtype if needed.

---

## 15. Gaps & notables

- **OpenProject and Redmine are the only project-management-first references.** Odoo, ERPNext, Dolibarr and Gauzy are ERP/HR suites with project modules bolted on; they are stronger on commercial handoff and weaker on planning. Use OpenProject for planning/work-item UX, Redmine for compactness/email intake, and Odoo/ERPNext for sales/costing/billing links.
- **No dedicated milestone record** in OpenProject (versions/phases/types) or ERPNext (`is_milestone` flag). Odoo and AureusERP have real milestone records; only Odoo connects them to billing. BOSS needs the real record because of the T&M billing requirement.
- **Odoo community has no timer and no capacity/resource planner.** Timer exists in OpenProject and ERPNext; capacity planning exists in OpenProject (team planner/resource management). Do not assume Odoo community covers either.
- **OpenProject has no invoicing/billing.** It stops at budgets, rates and cost reports. Odoo (`sale_timesheet`), ERPNext (timesheets/invoices) and Dolibarr (billable time) are the billing references.
- **Redmine "boards" are forums**, not kanban; its Gantt/calendar are query views. This is still a useful discussion surface, but not a work board.
- **Nextcloud Tasks/Deck and Twenty tasks are Commons/record-widget references**, not a project suite; they are catalogued in the Commons/Drawers research.
- **No project module** in Akaunting, metasfresh, Carbon or Zimbra in these checkouts. Carbon's `resources`/`planning` packages are production planning, not project management. Zimbra Tasks is a personal task list (Commons-adjacent).
- **WorkManagement is a minimal Moqui project/task app** (QVue table, find drawer, comments, simple project edit); it is the closest shape to a Moqui-native implementation but has no Gantt, timesheets, budgets or resource planning.
- **WeCreate contributes role-based staffing** (project positions with invitations/applications/approval) and a profile-like project page. Its position model is worth borrowing for generic/placeholder resource requests, but it has no timesheets or billing.
- **Gauzy is the strongest timesheet UX** (weekly day-grid, daily log table, calendar, approvals, timer apps) and the weakest on project planning (no Gantt/allocations/budgets in the project pages).
- **Request intake is fragmented everywhere.** Project-management tools assume authenticated users; ERP tools have email aliases, web forms or tickets; Customer Service owns the portal/SLA screens. BOSS should centralize intake in Request/Customer Service and let Projects consume converted requests.
- **Public/customer-facing project visibility** is thin: Odoo has portal project/task templates, ERPNext has web forms, the others are internal. Treat customer-visible project portals as a later, deliberate surface (Odoo's portal templates are the best reference).

### Adopt / avoid summary

| Adopt | Avoid |
| --- | --- |
| OpenProject: saved queries, configurable columns, split view, typed relations, board-as-column-action, team planner, allocation vs time-entry split, budget-vs-actual widgets, phases/gates | One giant project form; a separate board implementation per column type; treating allocations as time entries |
| Redmine: compact issue columns/filters, watchers, configurable required time-entry fields, email intake, roadmap/time report | Board-as-forum for work; hard-coded reports |
| Odoo: project email alias, milestones with billing percentage, personal task stages, recurrence, services→project/task generation, analytic items | Duplicating customer/price data on the project; relying on Odoo community for timer/capacity |
| ERPNext: costing vs billable split, timesheet status/billing fields, small fixed dashboard card set, project template tasks | Deep desk-specific UI patterns; one-record-per-document tab explosion |
| Gauzy: weekly/daily timesheet grids, approvals, timer apps | Project planning (absent) |
| Dolibarr: per-day/week/month time input, project-element overview, usage flags | PHP-era tab sprawl |
| WeCreate: role/position staffing, profile-like project page | No plan/billing features |

---

**Bottom line.** IronStone Projects should be built as a **project-management-first app with ERP handoffs**: OpenProject supplies the interaction model (work items, saved queries, boards, Gantt, team planner, allocations, budgets, phases), Redmine supplies the compact query/email-intake discipline, and Odoo/ERPNext/Dolibarr supply the sales-order, milestone-billing and timesheet-invoicing links. The two surfaces that must not be compromised are **My work / timesheets** and **resource planning**, because they are where services staff and managers actually live, and they are exactly where the ERP references are weakest.


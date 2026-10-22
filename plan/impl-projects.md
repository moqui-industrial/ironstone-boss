# IronStone BOSS — Projects implementation

Oct 22, 2026 — plan; P0 and P1 done; P2 in progress (the work items half built)

How [design-projects.md](design-projects.md) gets built, in phases from the foundation to client access, each ending
tested and usable. This file is kept at a high level: each phase names its scope by the design's sections and §15 rows
rather than restating them, and the design stays the place for screen and record detail. During the build this file is
the log: phase status and what each built, the decisions made, open questions, findings against the code, and what is
deferred. Today `screen/Projects/` holds placeholders only (Home, Projects, WorkItems, Intake, Timesheets, Resources,
Billing, Settings).

**Inputs.** [design-projects.md](design-projects.md), [design-doc-guide.md](design-doc-guide.md),
[style-guide.md](style-guide.md) §8, [impl-drawers-commons.md](impl-drawers-commons.md) §4 (the shared rules),
[ss-inventory.md](ss-inventory.md), [usl-inventory.md](usl-inventory.md); mr-moqui `plans/Remaining-Work.md`,
`docs/Git-Hosting.md`, `docs/Revision-Management.md` and `docs/Testing.md`. Code paths are under `mr-moqui-base/` unless
they name a component.

Sections: [1 scope](#1-scope-and-order) · [2 rules](#2-ground-rules) · [3 phases](#3-phases) ·
[4 decisions](#4-decisions) · [5 open](#5-open-questions) · [6 findings](#6-findings) · [7 later](#7-later) ·
[8 verification](#8-verification)

---

## 1. Scope and order

- **Repositories.** Each its own git repo: `mr-moqui-base` (`crates/`, `runtime/base-component`),
  `runtime/component/mr-mantle-udm`, `runtime/component/mr-mantle-usl` and `runtime/component/ironstone-boss`.
- **Scope.** Every `parity` and `new` row of design §2 and the §15 needs they use. The `later` needs of §15 and §16 are
  in §7.
- **Order** (decided Oct 21, 2026): the foundation, projects and work items, then Code early (the differentiator for the
  Moqui community, and the soonest way to run Projects for its own development), then planning, requests, time,
  resources, billing, reports, and client access last.

## 2. Ground rules

- **The Commons rules hold:** impl-drawers-commons §4 (failure tolerance, the Mantle-free framework, the new XML element
  checklist of style-guide §8.1, libraries through `libs/refresh.mjs` and crates against `deny.toml`, the `.qvue`
  gallery pattern, demo data, builds and commits).
- **Git records through services.** Entity filters do not apply to `moqui.*` entities, so screens read repositories,
  merge requests, statuses, rules and webhooks only through services that check the repository's rights.
- **Clients in mind from the start.** Client access is finished in P10, but each client-visible screen (design §1.1) is
  written so its client state is an addition, not a rewrite: no money or internal fields read without a group check.
- **Shared screens.** `Shared/WorkItemDetail` and `Shared/RequestDetail` replace Commons' TaskDetail and RequestDetail;
  Commons keeps its paths and its specs keep passing.
- **Done for a phase:** impl-drawers-commons §4 "Done" (cargo tests for touched crates with goldens reviewed, the new
  Mantle specs under `./moq test mantle-usl`, `./moq test ironstone-boss` with AppStructure covering the new screens,
  `moqui lint --screens` clean for BOSS, screenshots light and dark at 390, 1280 and 1440 px, the inventories'
  **Implemented in** columns), the phase's walk in §8, and its row and **Built** note here.

## 3. Phases

| Phase | Repos | Screens | Status |
| --- | --- | --- | --- |
| P0 Checks | all (read) | — | done Oct 21 (§6 F1–F7) |
| P1 Foundation | mr-moqui, Mantle, BOSS | the Projects root and menu | done Oct 21 |
| P2 Projects and work items | Mantle, BOSS (mr-moqui) | Home, QuickCreate, Projects, NewProject, ProjectDetail and its Overview, Work items, Team, Files and Settings tabs, WorkItems, WorkItemDetail, WorkItemTypes, Workflows, Labels, Templates | done Oct 22 |
| P3a Code: framework | mr-moqui | — | done Oct 21 |
| P3b Code: Mantle and BOSS | Mantle, BOSS | every §7 screen, ProjectCode, CodeSettings | planned |
| P4 Planning | Mantle, BOSS (mr-moqui) | Backlog, SprintDetail, Timeline, WorkItemImport, Roadmap, MilestoneDetail, ReleaseDetail, ProjectBacklog, ProjectTimeline, ProjectCalendar, ProjectRoadmap, ProjectDocs | planned |
| P5 Requests | Mantle, BOSS | Requests, RequestDetail, RequestIntake, ProjectRequests, IntakeSettings | planned |
| P6 Time | Mantle, BOSS | MyTime, Timesheets, TimesheetDetail, TimeEntries, ProjectTime, TimeSettings | planned |
| P7 Resources | Mantle, BOSS | TeamPlanner, Allocations, PersonDetail | planned |
| P8 Billing and money | Mantle, BOSS | Unbilled, Invoices, InvoiceDetail, OrderDetail, Rates, ProjectMoney, BillingSettings | planned |
| P9 Reports and outputs | Mantle, BOSS | Reports and its seven reports | planned |
| P10 Client access | mr-moqui, Mantle, BOSS | the client states of §1.1's screens | planned |
| P11 Finish | BOSS | — | planned |

### P0 — Checks

Verify the design's riskiest assumptions against the code before building, each result a row in §6 and, where it
changes the design, an edit there:

- entity filter sets on `WorkEffort` and `Request` (R28 found neither has one) and the order of `AUTHZT_ALWAYS`,
  `AUTHZT_DENY` and `AUTHZT_ALLOW` in mr-moqui (§15 Client access);
- the `Project_<KEY>` sequence banks in `create#Project` and `clone#Project` (§15 Work item keys from 1);
- `get#WorkEffortChildStats` per-level reads, as the base of `get#WorkItemTree`;
- gix's `merge` feature and what squash and rebase need (§15 Merge);
- a wiki space rooted at `git://<repositoryId>/docs` (§15 Wiki space in a repository);
- the Comms rule action hook for `createRequest` and `createWorkItem` (§15 Email intake);
- the existing `view-board` and `view-calendar` code paths `view-tree`, `group-fields` and the peek pane build on.

Done Oct 21, 2026: F1–F7. The design's §15 Shell, Client access and Email intake rows took F1, F2 and F6. The view
paths are left to P1, which reads them as it builds.

### P1 — Foundation

- Data model and seed: design §15 Work model (sprints, rank, points, lag, development flow, labels, health and status
  updates, project settings, app settings, template flag, keys from 1, client project purpose), the work types of Time,
  the three user groups and `SSH_GIT` (§1.1).
- The Projects root: groups, menu with the placeholders renamed to §1.2, `<shell-providers>` and the `projects` key scope
  (§1.4), palette and notification link mapping.
- Framework list pieces of §15 "Lists, views and components" that P2 needs: `view-tree`, `view-board` `group-fields` and
  `all-rows`, the peek pane, `m-elapsed`.
- Projects demo data (projects with a tree of work items, members, a client).
- Usable when: the Projects menu renders for each internal group, and the gallery shows the new list pieces.

**Built, Mantle and BOSS** (Oct 21, 2026):
- Mantle udm: the §15 Work model fields, types, statuses, the `WorkEffortDevelopment` flow, `WorkEffortSetting`,
  `WorkEffortUpdate`, `StatusUpdate`, the `Proj*` PartySettingTypes, `WepPrClient` and the `Wktp*` work types; the
  holiday categories are `WcatHoliday`.
- Mantle usl: `init#ProjectSequence` (keys from 1; `clone#Project` goes on after the highest number it copies and takes
  `isTemplate`), tasks and cloned tasks take a bank of 1; `get#VisibleProjectInfo` (F1); `store#ProjectSetting` and
  `get#ProjectSettings`; `test/WorkProjectFoundation.spec.js`.
- BOSS: the three groups (managers ALWAYS, team ALLOW and denied the managers' screens through
  `BOSS_PROJECTS_MANAGERS`, the client group without authz until P10), `SSH_GIT`; the §1.2 menu as placeholders, the
  `<shell-providers>` and `projects` key scope; `get#RecordLink` opens projects and project tasks and requests under
  Projects for its users; `BossProjectsDemoData.xml` (IRON, a product project on the development flow with a work item
  tree; ACME, a client project; HIRE, a Work group project) and `BossUsersDemoData.xml` (john.doe a manager, joe and bob
  developers); AppStructure covers Projects, `test/ProjectsShell.spec.js`.
**Built, framework** (Oct 21, 2026, mr-moqui efc1d587): `view-board` `group-fields` and `all-rows` with `max-rows`;
`view-tree` (`m-list-tree`, with the added `child-count-field`; html a nested table, tui an outline with + and -);
`form-list` `peek-url`; `m-elapsed`; the gallery's Views (board by status or type, a work-breakdown tree, peek into the
new ExampleDetail). moqui-core 1548 passed, moqui-tui 139, node 187, `./moq test example` 83.

- Tests: mantle-usl 559 of 564 features passed, 3 skipped, 2 failed (`ContactListSend` site address, `InboxThreads`
  operators) the same with the changes stashed; ironstone-boss 400 of 412 passed, 12 skipped (git, xlsx and imap are
  not in the lite build); `moqui lint --screens` clean.

### P2 — Projects and work items

- Design §3 Home (the team's blocks) and QuickCreate; §4 Projects, NewProject, ProjectDetail with Overview, Work items,
  Team, Files and Settings; §5 WorkItems with its four views, peek and bulk changes, and `Shared/WorkItemDetail` (Commons
  TaskDetail becomes it); recurring work items; status updates and health; project activity; §12 WorkItemTypes,
  Workflows, Labels and Templates.
- Topics `WorkItemAssigned` and `ProjectStatusUpdate`; the `MantleProject` and `MantleTask` search and palette links.
- Usable when: a manager makes a project from a template, the team adds and nests work items, works them through the
  development flow in each view and the peek pane, and posts a status update that sets the health.

**Built, work items half** (Oct 22, 2026; the projects half, Home and the Settings pages follow):
- Mantle udm: `WorkEffort.parentWorkEffortId` in the audit log on update (`move#Task` logs a move from the top level,
  which an update audit leaves out; on create too would shift the audit rows WorkPlanToCashBasicFlow checks);
  `WorkEffortCategoryAppl` relationships (`workEffort`, `category`); `MantleTask` gains the plan items' names
  (`assocFromName`) and the labels (`categoryId`, `category`).
- Mantle usl: `ProjectServices.get#WorkItemTree` (a level, or ids with their ancestors; roll-ups from one read of each
  project; visibility of F1); `TaskServices.move#Task`, `set#TaskRank`, `get#TaskStatusFlow`, `set#TaskStatus` (F11, the
  framework's message for a refused move), `set#TaskPlanItem` with `set#TaskRelease` and `set#TaskComponent`,
  `add#TaskLabel`, `remove#TaskLabel`, `set#TaskRecurrence`, `make#NextRecurringTask` (SECA on Complete and Cancelled),
  `notify#TaskAssigned` (SECA on an Assignee row; topic `WorkItemAssigned`); `update#Task` moves a subtree to another
  project; `test/WorkProjectItems.spec.js`.
- BOSS: `Shared/WorkItemDetail` (Commons mounts it at `Commons/Tasks/TaskDetail`, Projects at `WorkItems/WorkItemDetail`;
  compact with `peek=true`), `Projects/WorkItems/List` (smart lists, find, saved finds, quick add, bulk, the four views,
  peek), `Projects/QuickCreate` (QuickWorkItem; QuickTime says it comes with P6) and the managers' `Projects/QuickProject`
  (F8, F10); `ironstone.WorkItemServices`; `ironstone.TaskServices` take an `app` (projects: the project's visibility
  and team); the topic's link and two seeded saved finds; ACME-6 repeats weekly in the demo; specs `WorkItems`,
  `WorkItemDetail`, AppStructure, ProjectsShell and TuiRender updated.

**Built, projects half** (Oct 22, 2026):
- Step 0 baseline on the Debug package after P3a's merge: ironstone-boss 436/436, mantle-usl the two known failures,
  example 86/86, moqui-core lib 1564; the gallery TUI snapshots regenerated (P3a's enumerations widened the List).
  gate3 fails two tests that today's ScreenWeb parity commits outdated, not Projects: the `display String` class on a
  display field, and the static Cache-Control `max-age=86400, must-revalidate, public` (f9ee72a7 and nearby).
- Mantle usl: `clone#Project` copies the base's settings (not the intake token or docs space), links a copy of a
  template `WeatBasedOn`, and takes the copy's visibility, owner, purpose, parent and description (F19);
  `post#ProjectUpdate` (StatusUpdate on Chatter, `WorkEffortUpdate`, the health, topic `ProjectStatusUpdate` to the
  internal members); `get#ProjectActivity` (audit-log status changes, comments and updates, commits; each source on its
  own); `get#ProjectHomeCounts` (later phases' counters null); `get#ProjectTemplates`, `create#ProjectTemplate`;
  `TaskServices` `create#`, `update#`, `delete#Label`, `merge#Labels`; `test/WorkProjectHub.spec.js`.
- BOSS: `ironstone.ProjectServices` (access by `get#ProjectAccess` view, update or manage; the find with board, bulk and
  status; header, overview, team, settings, NewProject steps, rates, Home, the app settings); screens `Projects/List`,
  `ProjectDetail` (Overview, Work items mounting `WorkItems/List`, Team, Files, Settings), `NewProject` (Start, Team,
  Modules, Money, Review), `StatusReport` (print), Home, Settings Index, WorkItemTypes, Workflows, Labels, Templates;
  QuickWorkItem and quick add offer the project's types; QuickProject links to NewProject; demo `ACMEAPP` (sub-project),
  `TPLWEB` (template), an IRON status update, modules; specs `Projects`, `ProjectDetail`, `NewProject`, `ProjectsHome`,
  `ProjectsSettings`. Final runs: ironstone-boss 461/461, mantle-usl the two known failures, lint clean, screenshots light
  and dark at 390, 1280 and 1440.

### P3a — Code: framework

- Design §15 Git hosting and the framework rows of Code review: repository list and push log, tree, refs, compare,
  merge (merge commit and fast-forward, then squash and rebase), archive, commit statuses with the REST endpoint,
  webhooks, branch rules enforced by the git server, the merge request store and its services; `code-view` with
  highlight.js.
- Usable when: cargo and spec tests cover each service, including a push refused by a branch rule and a merge refused on
  a conflict.

**Built** (Oct 21, 2026, mr-moqui 642a517a and d643ada2, merged with P1 as 3fc6e56d): gix's `merge` feature (gix-merge,
gix-imara-diff; licenses checked) and `resource/git` `merge.rs` (all four methods and trial merges over any store,
db repositories included), `rules.rs` (branch rules in the git server and the ref services), `hosting.rs` (tree with
last commits, compare, ref writes and annotated tags); archived repositories refuse pushes, ref writes, merges and
`git://` writes; the entities `GitCommitStatus`, `GitWebhook`, `GitBranchRule`, `GitMergeRequest`,
`GitMergeRequestReviewer` and the `GitRepository` fields; 19 Rust services and the JS ones in `GitServices.xml`, the new
`GitReviewServices.xml` and `framework/service/Git.gitecas.xml` (merge requests follow branches, webhooks follow
pushes); the commit status REST endpoint in the tools `moqui` resource; webhooks signed `X-Hub-Signature-256`,
internal addresses refused unless `git-server` `webhook-private-network`, retried by their own job; `code-view` and
`m-code` (highlight.js, Kotlin added). docs/Git-Hosting.md "Hosting through Moqui". Tests: moqui-core 1563 passed (the
one failure needs MrSimpleScreens, absent from a worktree), the new merge, rules, webhook and hosting integration
tests, `GitHosting.spec.js` 3 of 3, node 191 of 191.

### P3b — Code: Mantle and BOSS

- Design §15 Code review (the Mantle rows): merge request links, review anchors, repository rights by project role,
  task branches, release tags by version, `search#Code`.
- Design §7: every Code screen, ProjectCode, the Development tab of WorkItemDetail, GitAccess with the Commons Account
  link, CodeSettings, and Home's reviews waiting. Topics `MergeRequestReview`, `MergeRequestUpdate`,
  `CommitStatusFailed`.
- Usable when: a developer makes a branch from a work item, pushes, opens a merge request, a reviewer comments on a
  line and approves, a CI status posts, the merge closes the item.

### P4 — Planning

- Sprints and rank services; design §5 Backlog, SprintDetail, Timeline (`.qvue`) and WorkItemImport; §4 Roadmap,
  MilestoneDetail, ReleaseDetail with release notes, and the project's Backlog, Plan (Timeline and Calendar), Roadmap
  and Docs tabs.
- Usable when: a team ranks the backlog, runs a sprint to completion with a carry-over, sees it on the timeline with
  dependencies, imports a Jira CSV, and publishes a release's notes to the docs space in the repository.

### P5 — Requests

- Design §6: `Shared/RequestDetail` (Commons RequestDetail becomes it), Requests, ProjectRequests, conversion and status
  from work, email intake through the Comms rule actions, the public form at `/r/<token>`, IntakeSettings; topic
  `RequestTriage`.
- Usable when: a request arriving by email and one from the public form are triaged, converted to work, and completed
  when the work is.

### P6 — Time

- Design §8: the timesheet services and transitions, MyTime (`.qvue`, with the timer), Timesheets, TimesheetDetail,
  TimeEntries, ProjectTime, time import and TimeSettings; the Today source; time in Chatter; the timesheet topics and
  the missing-time job.
- Usable when: a consultant times work and fills a week in MyTime, submits it, and a manager returns, then approves it.

### P7 — Resources

- Design §9: capacity, allocations, TeamPlanner (`.qvue`), Allocations, PersonDetail; allocations in ProjectTeam and
  NewProject's team step; the allocation topics.
- Usable when: a manager requests a placeholder, staffs it from the candidates, and the planner shows capacity against
  the allocations.

### P8 — Billing and money

- Design §10: Rates, Unbilled, Invoices, InvoiceDetail, OrderDetail, BillingSettings; §4 ProjectMoney; the milestone
  billing share, milestone approval and the estimate sent for approval; Home's unbilled.
- Usable when: approved time and a completed milestone become a client invoice with its time detail.

### P9 — Reports and outputs

- Design §11 report services and screens, Home's manager charts; the §14 print documents and exports not built in an
  earlier phase.
- Usable when: each report renders on the demo data and its measures match §11's definitions.

### P10 — Client access

- Design §1.1 and §15 Client access: the `BOSS_PROJECT_CLIENT` filter set and group, Commons and Comms denied to it,
  Chatter's client audience, the client states of the client-visible screens, Home for clients.
- Usable when: the isolation spec passes (a client user never reads another client's project, an internal note, a rate
  or a cost through a screen, Chatter, record files, search or the palette) and a client sees only Projects.

### P11 — Finish

- The `tui` texts of the `.qvue` screens (MyTime first), the server-static pass, the inventories' **Implemented in**
  columns, the design's Impl column, and Remaining-Work.

## 4. Decisions

Made during the build; each one that changes the design is also written into design-projects.md.

| Date | Decision | Notes |
| --- | --- | --- |
| Oct 21, 2026 | Phase order: Code (P3) right after projects and work items | The user's call |
| Oct 21, 2026 | InvoiceDetail and OrderDetail are built in P8 for what Projects needs now, as `Shared/` screens, and expanded when design-crosscut and Accounting need more | The user's call (it was an open question) |
| Oct 21, 2026 | Each phase is built by a subagent, reviewed, then committed per repo | The user's call |
| Oct 21, 2026 | A project with no visibility is seen only by its parties; a project belongs to an organization by `ownerPartyId` or the organization's current role on it (`create#Project` makes the internal organization Vendor) | P1 |
| Oct 21, 2026 | A project setting falls back to the organization: the setting type's `optionValue` names the `Proj*` PartySetting, its `enumCode` the key in that setting's JSON object | P1 |
| Oct 21, 2026 | Managers' authz is ALWAYS, so the team's deny of the managers' screens never reaches a user in both groups | P1 |
| Oct 21, 2026 | The tree's top level is the list's page; a row whose parent is on the page nests under it and missing parents come muted from `ancestor-transition`, so a find of the top level and a find of every match both work. A move posts the key fields, the parent field and `previousSiblingId`, then the list loads again (P2's `move#Task` takes those names) | P1 framework |
| Oct 21, 2026 | Rows fetched later in a tree show their fields' text, not the list's cells (no inline edits) outside server-static screens | P1 framework |
| Oct 21, 2026 | The peek pane is a split layout of its own around the views, not `container-split`, so the list keeps its scroll and edits when Peek toggles; the pane loads the screen's `/apps` path | P1 framework |
| Oct 21, 2026 | Board group-by: `column-order`, `status-type-id` and `parameter-name` apply to the default field only; another status field gets its own columns and flow hints | P1 framework |
| Oct 21, 2026 | gix-merge is called through an adapter over the framework's git store, not a gix Repository, so db repositories merge too; no `.gitattributes` merge drivers. `GmmMerge` always makes a merge commit; a rebase replays the source's non-merge commits and drops those the target already has | P3a |
| Oct 21, 2026 | Branch rule patterns: one starting `refs/` matches the full ref, any other a branch name; `*` matches across `/`; every matching rule applies; making a ref counts as a push; only `merge#MergeRequest` passes "merge request required" | P3a |
| Oct 21, 2026 | Ref writes through Moqui are `GitUpdate`s of source `write` and run the pre-push rules, so every `git://` write (wiki saves, drive files) now makes a `GitUpdate` row and a pool job, as it already did with Mantle | P3a |
| Oct 21, 2026 | Webhook headers `X-Moqui-Event`, `X-Moqui-Delivery`, `X-Hub-Signature-256`; the body close to GitHub's; backoff doubling from a minute, given up after 8 | P3a |
| Oct 21, 2026 | Merge requests: added `get#MergeRequest` (what blocks the merge, what the user may do), `check#MergeRequest`, `queue#MergeRequestEvent`; a draft cannot merge, an author cannot approve their own, one open request per source and target, numbers max+1 under a unique index | P3a |
| Oct 21, 2026 | `code-view` takes `file-name` for the language by extension; the language is never guessed | P3a |
| Oct 21, 2026 | "May open Projects" for links reads `ArtifactAuthzCheckView` (allow and no deny on the root), since `isPermitted` under the Commons root's inheritable ALWAYS answers true for everyone | P1 |
| Oct 22, 2026 | The shared WorkItemDetail picks its context by the app root's `appRoot`; `ironstone.TaskServices` take `app` (commons or projects): in Projects an item of a project the user sees is visible and the project's team changes it, in Commons the owner and assignees as before | P2 |
| Oct 22, 2026 | `set#TaskRank` and `move#Task` take `previousSiblingId` (the tree's name, P1) rather than the design's `afterWorkEffortId` | P2 |
| Oct 22, 2026 | The + menu's Project kind is a screen of its own, `Projects/QuickProject`, in `BOSS_PROJECTS_MANAGERS`, so the team is not offered it (F8) | P2 |
| Oct 22, 2026 | ProjectDetail's later tabs (Backlog, Plan, Roadmap, Requests, Code, Docs, Time, Money) are added by their phases; the Modules box already stores which are on | P2 |
| Oct 22, 2026 | Overview's Chatter is a column from 1440 px, below the boxes narrower; no Chatter tab | P2 |
| Oct 22, 2026 | ProjectDetail's status-bar is read-only and the moves are buttons, primary by status (Approve, Begin, Resume, Close, Re-open; In Progress: Post update) | P2 |
| Oct 22, 2026 | A project is managed by its ProjectManager or Manager parties, a Projects manager who sees it, or ADMIN; status-update notices go to internal members only until P10 | P2 |
| Oct 22, 2026 | ProjectDetail's menu leaves out New work item (the tab and the shell's + cover it) and Log time (P6) | P2 |
| Oct 22, 2026 | A recurring item counted from completion takes the completion day at the due date's time of day (UTC days) and the rule without its COUNT, which counts the items made | P2 |

## 5. Open questions

| Question | Decides | Notes |
| --- | --- | --- |
| How much of the framework list pieces P1 builds versus P2 building each when first needed | at P1 start | Settled: P1 built them all |

People's working-schedule record and Employee 360 do not exist; design §16 already settles that capacity reads
`WetAvailable` and PersonDetail is a Projects screen, so P7 does not wait.

## 6. Findings

Design assumptions found wrong in the code, with the resolution (written into the design where it changes it).

| # | Finding | Resolution |
| --- | --- | --- |
| F1 | P0: no entity filter covers `WorkEffort`, `Request`, `TimeEntry` or `WorkEffortParty` (the Mantle filter sets cover Invoice, Payment, OrderPart, Party, Product and the like), so design §1.1's "which projects a user sees" is enforced today only by `get#RecordLinkInfo` for one record, not by any find | A Mantle service gives the visible projects as a condition (`mantle.work.ProjectServices.get#VisibleProjectInfo`: the user's project ids by role and the organizations whose All users and General projects they see), and every Projects find and list service applies it; a spec proves a Work group project stays out of a non-member's lists. Design §15 Shell row added. P1 |
| F2 | P0: entity filters are evaluated against the user context (as `filterOrgIds` from `setup#UserOrganizationInfo`); a filter cannot say "the user's party holds a role on it" | The client filter set reads context values a Mantle setup service puts there (`setup#ClientProjectInfo`: the client's project ids and organization ids), called from the Projects root's `always-actions` beside `setup#UserOrganizationInfo`. Design §15 Client access row updated. P10 |
| F3 | P0: the authz order matches Java (`authz.rs`: ALWAYS returns at once, a DENY beats an ALLOW in any order); `BOSS_COMMONS_ALL_USERS` and `BOSS_COMMS_ALL_USERS` are `AUTHZT_ALWAYS`, so a client deny needs them to become `AUTHZT_ALLOW` as the design says | As designed; P10 checks that nothing relied on ALWAYS (an ALLOW does not pass an inheritable deny below it) |
| F4 | P0: work item ids come from `sequencedIdPrimary("Project_<KEY>", null, 10)` in `create#Task`; no `SequenceValueItem` row is made for a project | As designed: `create#Project` and `clone#Project` seed the sequence at 1 and `create#Task` takes a bank of 1. P1 |
| F5 | P0: gix is built without its `merge` feature and the framework has no merge code | P3a turns the feature on (checked against `deny.toml`) |
| F6 | P0: `run#EmailRules` accepts `createTask` and `createRequest` but logs and skips any action it does not know; there is no hook for an app to supply one | P5: the framework calls a service an app names for an action (by an `EmailRuleAction` enumeration whose `optionValue` is the service), so Mantle and BOSS add `createRequest` and `createWorkItem` without the framework knowing Mantle. Design §15 Email intake row updated |
| F8 | P1: the shell filters quick-create kinds and palette actions by screen only, and all kinds share `Projects/QuickCreate`, so the team is offered New project | P2: kind `project` refused for non-managers, or its own managers-only screen |
| F9 | P1: `PartySetting.settingValue` is text-medium (255), tight for JSON app settings such as ProjRepositoryDefaults or ProjTimesheetPolicy | Widen it, or split the settings, when those settings pages are built (P3b, P6) |
| F10 | P1: `create#Project` sets no visibility, which reads as members only | P2: NewProject and QuickProject default to General |
| F11 | P1: a task's flow may be on the task or its project (the demo sets both) | P2: `set#TaskStatus` reads the task's `statusFlowId`, else its project's |
| F12 | P1: Mantle's demo joe and bob are `PrtEmployee` toward `OrgEmployer`, so `get#PartyOrganizationInfo` gives them no organization and they see General projects only where they are members | Left alone (Commons' filters depend on it); revisit if P2's lists need it |
| F13 | P1: any request with `pageSize` saves it as the user's page size (`screen.user.page.size`) | All-rows boards and tree levels ask with `pageNoLimit` and cut in the browser (500 for a board, 200 a level with Show more); the server still answers every row, so P2's tree transitions should answer one level only |
| F14 | P3a: the test factories load no gitECA rules, entity seed data or status flows, so the git tests install `Git.gitecas.xml` and seed what they need; under load the in-memory test database can fail the second write of a `GitUpdate` when a pool job overlaps it (avoided for refused changes; the push path has the same pattern) | Watch for flakes in the git tests |
| F15 | P2: the framework checks a status change against every flow (any `StatusFlowTransition` from the old status to the new), so a task's own flow is checked only by `mantle.work.TaskServices.set#TaskStatus`; a direct `update#Task` with a status passes any flow's move | Every Projects and Commons status change goes through `set#TaskStatus` |
| F16 | P2: a screen has no way to bind its own keys (the `keymap` element is an app root's), so WorkItemDetail's `a`, `s` and `m` (§1.4) are not bound | A framework screen-level key binding, later |
| F17 | P2: `find#WorkItems` reads the ids of the user's roles and, for Unassigned, of every assigned open item of the visible projects, as IN lists (as F1's `get#VisibleProjectInfo`) | A subquery or view with the §7 item on `get#VisibleProjectInfo` |
| F18 | P2: a wizard step or detail tab loaded on its own (`lastStandalone`) runs without its parent screen's `actions` | The project or draft comes from `always-actions` (a cheap `get#ProjectAccess` with need none), or each step loads it; later tabs follow the pattern |
| F19 | P2: `clone#Project` dropped visibility, owner, purpose, parent and description, so QuickProject from a template never set General | Fixed in Mantle |
| F20 | P2: `button-menu` takes only `link`, `label` and dialogs (no `section-iterate` or `render-mode`) | A menu of computed items is one conditional link per possible item |
| F21 | P2: the framework's status flow check refuses a spec putting a status back through `update#` | Specs restore status with an entity value update |
| F22 | P2: project estimates roll up from their items (Mantle ECA), so the demo ACME shows Over the estimate (109 h of 105 h) | Left as demo data that shows the warning |
| F7 | P0: a wiki space under an existing repository is documented for a repository root (`rootPageDirectory: "git://docs"`, or `rootPageLocation` `git://<repositoryId>/<SPACE>.md`), not for a subdirectory such as `git://<repositoryId>/docs` | Checked in P4 as the design's §15 row says, before ProjectDocs is built |

## 7. Later

Designed, not in this build:

- `view-timeline` (the Timeline stays a `.qvue`), list grouping (`form-list` `group-by`), board WIP limits, Timeline
  baselines (design §15, §16).
- Time import presets for Toggl, Harvest and Clockify (§16).
- A link to `mantle.other.budget` and GL posting of project cost (`post#WorkEffortCost`), Accounting's (§16).
- Code search and editing repository files in the browser: the developer tools app (§16). Forks (§16).
- Custom fields on work items, with the visual developer tools (§16).
- A project forum setting (§16).
- `get#VisibleProjectInfo` returns id lists for an IN condition; an organization with thousands of projects wants a
  subquery or a view instead.
- A sequence refill with a bank of 1 can skip one number across a server restart.
- Git (P3a): revision expressions such as `main~1`; checking a reviewer's view right when added; forks; a webhook for a
  new branch lists the last 20 commits rather than only the new ones. Merge request notifications are P3b.
- The tree view (P1): sorting siblings by a column, CSV and XLSX level and outline columns, an indented `html-print`,
  the add-sub-item button on a row, Enter and Ctrl+Enter in the quick-add row, the drop line at the landing depth, the
  focused row's guide line in the primary color, a confirmation before Expand all passes 500 rows (it stops with a
  message), and in the tui tree fetched levels, ancestors, moves and the totals row.

- Projects Home (P2): the timer strip, reviews waiting, approvals, Unbilled and the charts wait for their phases; the
  counts service answers null for them. Projects' timeline view link (P4). A copy button for clone URLs (templates have
  no clipboard helper). QuickWorkItem's types do not reload when the project changes in the form.

## 8. Verification

- **Per phase,** the "Done" rule of §2 and the phase's "usable when".
- **End to end,** `./moq run`, signed in as `john.doe` (and the demo client user from P10), walking each built phase's
  "usable when" in order.
- **Screenshots** with `example/test/gallery-shots.mjs`, light and dark.

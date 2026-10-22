# IronStone BOSS — Projects implementation

Oct 21, 2026 — plan; P0 done (findings F1–F7 in §6); next P1

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
| P1 Foundation | mr-moqui, Mantle, BOSS | the Projects root and menu | Mantle and BOSS built Oct 21; framework list pieces in progress |
| P2 Projects and work items | Mantle, BOSS (mr-moqui) | Home, QuickCreate, Projects, NewProject, ProjectDetail and its Overview, Work items, Team, Files and Settings tabs, WorkItems, WorkItemDetail, WorkItemTypes, Workflows, Labels, Templates | planned |
| P3a Code: framework | mr-moqui | — | planned |
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

### P3a — Code: framework

- Design §15 Git hosting and the framework rows of Code review: repository list and push log, tree, refs, compare,
  merge (merge commit and fast-forward, then squash and rebase), archive, commit statuses with the REST endpoint,
  webhooks, branch rules enforced by the git server, the merge request store and its services; `code-view` with
  highlight.js.
- Usable when: cargo and spec tests cover each service, including a push refused by a branch rule and a merge refused on
  a conflict.

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
| Oct 21, 2026 | "May open Projects" for links reads `ArtifactAuthzCheckView` (allow and no deny on the root), since `isPermitted` under the Commons root's inheritable ALWAYS answers true for everyone | P1 |

## 5. Open questions

| Question | Decides | Notes |
| --- | --- | --- |
| How much of the framework list pieces P1 builds versus P2 building each when first needed | at P1 start | |

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

## 8. Verification

- **Per phase,** the "Done" rule of §2 and the phase's "usable when".
- **End to end,** `./moq run`, signed in as `john.doe` (and the demo client user from P10), walking each built phase's
  "usable when" in order.
- **Screenshots** with `example/test/gallery-shots.mjs`, light and dark.

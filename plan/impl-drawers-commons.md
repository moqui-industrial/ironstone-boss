# IronStone BOSS — Header, drawers, Commons & Comms implementation

Oct 18, 2026 — plan; Step 0 done (the review corrections are in design-drawers-commons.md)

How [design-drawers-commons.md](design-drawers-commons.md) gets built: the review of that design against mr-moqui and
Mantle as they stand (findings R1–R27, each with the resolution now written into the design), the rules every step
follows, and the milestones from the shell foundation to Consent, each ending tested and usable. Today the component has
placeholder screens for all of it (commit c494089). The framework's `m-qapps-root` (`WebrootVue.qvt.js:2458`) has only a
header, a left drawer and a footer. None of the proposed XML elements are in the XSDs. Material Symbols is not
vendored, and no rich-text library or Assist code exists. Mantle has most of the records, but several of its services
do not do what the design assumed (§3).

**Inputs.** [design-drawers-commons.md](design-drawers-commons.md), [design-doc-guide.md](design-doc-guide.md),
[style-guide.md](style-guide.md) §8 and §10, [ss-inventory.md](ss-inventory.md), [usl-inventory.md](usl-inventory.md);
mr-moqui `plans/Remaining-Work.md`, `docs/Revision-Management.md`, `docs/Native-Components.md` and `docs/Testing.md`;
the code as of Oct 18, 2026. Code paths are under `mr-moqui-base/` unless they name a component.

Sections: [1 scope](#1-scope-and-order) · [2 step 0](#2-step-0) · [3 review](#3-review-findings-and-resolutions) ·
[4 rules](#4-ground-rules) · [5 milestones](#5-milestones) · [6 later](#6-later) · [7 verification](#7-verification)

---

## 1. Scope and order

- **Repositories.** Each of these is its own git repo: `mr-moqui-base` (`crates/`, `runtime/base-component`),
  `runtime/component/mr-mantle-udm`, `runtime/component/mr-mantle-usl` and `runtime/component/ironstone-boss`.
- **Scope.** Every `parity` and `new` row of design §3. The `later` rows are in §6.
- **Order** (decided Oct 18): the shell foundation (M0–M3), then Contacts, Mail, Tasks and Requests, Calendar, Files,
  Knowledge and Notes, Chat, Consent. Contacts come before mail so recipients, contact cards and "Add to contacts" have
  their data. Mail comes early because Comms should be usable as someone's own mail client as soon as possible.

## 2. Step 0

Done Oct 18, 2026, before any code:

1. This file.
2. The corrections R1–R27 written into `design-drawers-commons.md`, in the sections each one names, with the new
   decisions in its §20 and the OAuth note in its §21.
3. mr-moqui `plans/Remaining-Work.md`: the IronStone row points here.

## 3. Review findings and resolutions

Each finding was verified in the code. Each resolution is now part of the design.

| # | Finding | Resolution |
| --- | --- | --- |
| R1 | Design §1.3: Assist depends on mr-moqui Phase 13, which is deferred. No Assist or LLM client code exists. | The shell reserves the right `q-drawer` slot, with no toggle until the port. It builds `screenContext` and `assistReach` now, as the port's inputs. BOSS skills and agent chat members wait for Phase 13. |
| R2 | §19 Shell providers: menu data is built per path (`crates/moqui-core/src/screen/menu.rs:81`). Aggregating every app root's providers there would happen on every navigation. | A new webroot transition `shellData`, fetched once per page load. It returns the launcher apps, each permitted app root's `<shell-providers>`, its menu titles to depth 2 (for the palette's Screens group), the shell theme values and the first counts. A root that fails is logged and left out. |
| R3 | §1.5 palette: the People, Messages and rooms, Pages and files, Events, Records and id-lookup groups have no provider element, and the framework cannot call Mantle. | `<palette-source group service prefix id-pattern sequence>`. Each source service takes `{text, limit, docTypes}` and returns `[{title, subtitle, icon, url}]`. Commons registers Records (`search#Universal` over the `<palette-type>` document types of the permitted apps), People, Pages and files, Events, and the id lookup (`lookup#ById`). Comms registers Messages and rooms. A failing source drops its group and is logged. |
| R4 | §1.5 Records, §5 Search: `search#Universal` drops CommunicationEvent and the Project, Task, Event and Request documents whenever an org filter is on (`mr-mantle-usl/service/mantle/search/UniversalSearchServices.xml:65-68`). Every BOSS authz carries MANTLE_ACTIVE_ORG. | Mantle replaces the exclusion with per-user conditions. A task, event or request shows when the user is one of its parties or its organization is in `filterOrgIds`. A communication event shows when the user is its from, to or recipient party. |
| R5 | §9, §15, §19 `chatter` and `record-files`: the client fetches the theme-named screen as its own request, so the host screen's authz is not part of it, and nothing mounts `Shared/`. | Each BOSS app root mounts `Shared/Chatter.xml` and `Shared/RecordFiles.xml` as hidden subscreens `Chatter` and `RecordFiles` (design-doc-guide §10). The theme values hold that subscreen name. The elements load `<app root>/<name>?recordEntity=&recordId=`, so the app's authz and entity filters apply. Both screens first find the record under the user's filters. If it is not visible they render nothing (logged once) and refuse writes. |
| R6 | §12 Compose "File on", §15 SendMessage: the framework's `send#Draft` cannot write a Mantle record join. | A Mantle wrapper, `mantle.party.CommunicationServices.send#EmailDraft`. It calls `EmailClientServices.send#Draft`, then creates the `CommunicationEvent` with `emailMessageId` and writes the record join. Compose and Chatter call it when a record chip is set. |
| R7 | §6, §19 personal contacts: entity filters are not global. They come only from the ArtifactAuthz that authorized the artifact (`crates/moqui-core/src/user/filter.rs:33,137`) and are skipped with authz disabled. `search#Party` reads the index. | The `privateOwnerUserId` condition becomes a second EntityFilter in the existing MANTLE_USER_ORG and MANTLE_ACTIVE_ORG filter sets, so it applies wherever the org filter does. The same condition is added explicitly to `find#Party`, `search#Party` (as an index field and a query term), `lookup#ById`, DuplicateServices and the party drop-down transitions. Check whether `filter.rs` turns a null in an IN list into `IS NULL`; if not, write an or-condition. A spec proves another user never sees a personal contact through any of these paths. |
| R8 | §12 replies: `reply#CommunicationEvent` always creates a `Comment` and answers only the parent's other party (`mr-mantle-usl/service/mantle/party/CommunicationServices.xml:69`). | It is extended to keep the parent's type (a `Message` stays a `Message`), `contactListId` and the thread's participants. `replyToSenderOnly` gives Reply to sender. |
| R9 | §7 LinkedRecords, §12 LinkToRecord, §19 Record cards: `lookup#ById` returns no request and no communication event. | It is extended with Request and CommunicationEvent. |
| R10 | §6 Duplicates and "Link to a directory party": `merge#Parties` does not move WorkEffortParty, RequestParty, CommunicationEventParty or ContactListParty. | It is extended with those and with the new party rows: ContactBookParty, ContactBookGroupParty, PartyConsent, and party shares. |
| R11 | §7: Event `get#FullCalendarData` reads `WorkEffort.facilityId` rather than `WorkEffortFacility`, shows declined invitations and ignores `recurLimit`. The `WorkEffortPartyAsset` view aliases asset status and dates to the party member (`mr-mantle-usl/entity/WorkEffortViewEntities.xml:259-261`). | The view is fixed. The service gains the rooms from WorkEffortFacility, skips WeptDeclined unless "show declined" is on, and adds RRULE expansion and `calendarIdList`. |
| R12 | §1.2: `get#UserNoticeCounts` counts declined events and completed tasks, and reads messages by `toPartyId` only. | `get#ShellCounts` is written fresh over the new state: WorkEffortParty status and snooze, `CommunicationEventParty.readDate`, `EmailMessage.isRead`, `ChatRoomMember.lastReadEventId` and `NotificationMessageUser.viewedDate`. The old service stays until MyAccountNav retires. |
| R13 | §19 `shellCounts`: "the services that change those counts publish" has no owner, and theme values are resolved per render. | A framework service, `org.moqui.impl.ShellServices.publish#ShellCounts(userIdList)`. It resolves `STRT_SHELL_COUNTS_SERVICE` from the user's qapps theme, as `qapps.xml` does, falling back to DEFAULT_QUASAR. It sends a non-persisted NotificationMessage on topic `shellCounts`, coalesced per user (one per ~2 s). Framework and Mantle EECAs and SECAs call it. |
| R14 | §1.2: theme values are per theme. | BOSS seeds them on DEFAULT_QUASAR and on any other Quasar theme it ships. With any other theme the tray, badges and Chatter are absent, as in a deployment without BOSS. |
| R15 | §12, §19 Internal message state: the `CommunicationEventParty` key includes `roleTypeId`, so one user who is a recipient, a mailbox member and a mention could get several rows whose state diverges. | `create#Message` writes one row per party, choosing the role by priority (to, then cc, then mailbox delivery). `set#InternalMessageState` updates every row the party has on the message. |
| R16 | §9 PublicShare, §14 guest join, §16 Unsubscribe: `/s/`, `/call/` and `/u/` render outside `/qapps`, and today a `.qvue` or qvt screen runs only inside `m-qapps-root`. | A framework public shell: a Vue and Quasar page with the theme and the `m-*` components, without header, drawers or a session. It serves the anonymous token routes, and a named service checks the token before any data is read. |
| R17 | §9 Files lists the WebDAV server under Needs, while Sync and the DAV servers are `later`. | Files ships without WebDAV. The WebDAV server moves to the later Sync work, and the Files Needs line says so. |
| R18 | §1.6: screens are server-static, so `<context record-id="${orderId}">` cannot be expanded in the server render. | The element compiles to a client binding over the screen's actions data (the ScreenQvtStatic mirror). The root collects the active screen's context on each data load. |
| R19 | §21 OAuth: a deployment needs its own Google OAuth client. Google's documentation says an external app left in "Testing" gets refresh tokens that expire after 7 days. Gmail's IMAP scope is restricted, so publishing the app needs verification. Check both when M5e starts. | M5 ships password authentication first, including Gmail app passwords with 2-Step Verification, which need no Cloud project. OAuth follows in M5e. MailAccounts shows when a re-sign-in is due. |
| R20 | §19 IMAP poller: `poll#EmailServer` reads one folder by sequence-number SEARCH/FETCH (`crates/moqui-core/src/service/mail/implementation.rs:1244,1565`). It has no UIDs, folder list, flag sync, APPEND or IDLE. | `sync#EmailAccount` is new code: a blocking `imap` session on a worker thread per account, with IDLE on the Inbox. Its scope and tests are in M5d. |
| R21 | §19 generally: entity filters never apply to `moqui.*` entities (`filter.rs:71-88`), and ContactList has no filter. | Visibility of EmailAccount, folders, ChatRoom, ResourceDrive, shares, mailboxes and private ContactLists is checked in their services (owner and member rows). Screens read those records only through the services, never with a bare `entity-find`. |
| R22 | §4 QuickNote without a record writes into the user's notes space, which may not exist yet. | A framework service, `org.moqui.impl.WikiServices.ensure#UserNotesSpace`, in M2, before the Knowledge milestone. |
| R23 | §4, §19 approvals: no contract for what the approve and refuse services receive. | They get `recordEntityName`, `recordId`, the message's `messageJson` map, and `reason` for a refuse. |
| R24 | §10 Comments and §15 Chatter need the new comment's id, and `add#WikiPageComment` returns no `communicationEventId`. | It returns it. |
| R25 | §9 Records drive: the content folders are not uniform. `CommunicationEvent/` is capitalised, AssetMaintenance sits under `asset/<id>/maintenance/`, and Facility has no pair. | BOSS seeds an explicit map from folder to entity and id field. A naming rule would not cover these cases. |
| R26 | §1.2 Inbox count, §12 mailboxes delivered to the Inbox: count and unread are per row (R15). | `get#ShellCounts.mail` counts a message once per user: unread mail, plus internal messages and Inbox-delivered posts on that user's rows. |
| R27 | §19: the shell changes every `/qapps` user (MarbleERP, SimpleScreens, tools). | Every new header element hides when its theme value or provider is empty. Without BOSS a deployment gains only the launcher, the palette (Recent, Screens, Saved finds, Actions) and icons. |

## 4. Ground rules

- **Failure tolerance (AGENTS.md).** Every aggregator logs the failing piece by name and continues: shell data per app
  root, palette sources, Today sources, shell-count parts, timeline sources, the Inbox merge, mail sync per account,
  folder and message, rules, imports per row, and Records drive folders. Stay strict only for security: token checks,
  record visibility (R5) and private-contact filters (R7).
- **Mantle-free framework.** The framework reaches BOSS only through theme values and service names. It never reads a
  Mantle entity, and Mantle merges framework data (`find#InboxThreads`).
- **A new XML element** follows style-guide §8.1. That means the XSD, `ScreenQvt.js` with its `ScreenQvtStatic.js`
  mirror and a `ScreenHtml.js` fallback, the `ScreenSupport.js` element tables (a missing entry is an error), the
  `m-*` wrapper, a regenerated `WebrootVue.qvt.render.js`, CSS, goldens, a `js/README.md` row and a gallery screen.
- **A JS library** comes in through `libs/refresh.mjs`, as an esbuild bundle like compiler-dom when it has no UMD build,
  with a MANIFEST entry and a `plans/archive/License-Review.md` row. **A Rust crate** is checked against `deny.toml`.
- **`.qvue` screens** copy the gallery pattern (`example/screen/Gallery/Board.qvue`, `Calendar.qvue`): JSON transitions
  with `ec.web.sendJsonResponse`, `moqui.request`, a watch on `$root.currentParameters`, and only `m-*` inputs
  (style-guide §4.8).
- **Demo data.** BOSS adds `data/BossDemoData.xml` (type demo) per milestone so specs and screenshots have content.
- **Done for a milestone:**
  - Tests: `cargo test` for the touched crates, with goldens reviewed; the new Mantle specs in `test/suite.js` passing
    under `./moq test mantle-usl`; `./moq test ironstone-boss` passing, with `test/AppStructure.spec.js` extended to
    every implemented Commons and Comms screen (not only the placeholders); `moqui lint --screens` clean for BOSS.
  - Screens: screenshots of each new screen with `example/test/gallery-shots.mjs`, light and dark, at 390, 1280 and
    1440 px.
  - Paperwork: the **Implemented in** columns of `ss-inventory.md` and `usl-inventory.md` filled, and
    `Remaining-Work.md` updated. The milestone's status in §5 updated.
- **Builds and commits.** Debug incremental builds with one toolchain (the building skill); `rustfmt --edition 2021` on
  single files. Each step is a commit-ready unit per repo.

## 5. Milestones

| Milestone | Repos | Screens | Status |
| --- | --- | --- | --- |
| M0 Foundations | mr-moqui, BOSS | the moved screens | not started |
| M1 Shell framework | mr-moqui, Mantle, BOSS | header, tray frame, palette, quick-create frame | not started |
| M2 Today, notifications, quick create | mr-moqui, Mantle, BOSS | TodayPanel, NotificationsPanel, Notifications, QuickCreate, Commons Home, Settings, Account, Preferences, NotificationSettings | not started |
| M3 Record links, Chatter, record files | mr-moqui, Mantle, BOSS | Chatter, RecordFiles | not started |
| M4 Contacts | mr-moqui, Mantle, BOSS | Contacts, ContactDetail, ContactImport, Duplicates, ContactBooks | not started |
| M5 Mail (M5a–M5f) | mr-moqui, Mantle, BOSS | Inbox, Compose, MessageDetail, Comms Home, MailAccounts, Identities, Rules, OutOfOffice, TextBlocks | not started |
| M6 Tasks and requests | BOSS | Tasks, TaskDetail, Requests, RequestDetail | not started |
| M7 Calendar and schedules | mr-moqui, Mantle, BOSS | Calendar, EventDetail, Schedules, ResourceDetail, Calendars | not started |
| M8 Files and drives | mr-moqui, BOSS | Files, Drives, Shares, PublicShare | not started |
| M9 Knowledge and notes | mr-moqui, BOSS | Knowledge, Spaces, Review, Notes | not started |
| M10 Chat and presence | mr-moqui, Mantle, BOSS | Chat, ChatPanel, ChatSettings | not started |
| M11 Consent and unsubscribe | mr-moqui, Mantle, BOSS | Consent, Unsubscribe | not started |

### M0 — Foundations (mr-moqui, BOSS)

- Screen failure tolerance (Remaining-Work, gallery findings F4 and F28). A screen with a parse or script error is
  logged and left out of the menu data, and its siblings still render. A qvt render error is logged, as html already
  does.
- Material Symbols (style-guide §5.6, §8.2). Vendor the outlined font and Quasar's `material-symbols-outlined` icon set,
  and render `imageType: icon` through `q-icon` in the drawer menu, breadcrumbs and AppList. The `sym_o_*` app icons
  then show.
- Make the screens moved from the first port (EventDetail, Requests, RequestDetail, Settings/Account, MessageDetail,
  ScheduledReportDetail) render and pass lint, with a minimal JS conversion. Each one is redesigned in its own milestone.

Done: AppStructure passes, the 8 lint failures are gone, and the icons show in the drawer.

### M1 — Shell framework (mr-moqui; Mantle; BOSS seed and providers)

**Framework**

- STRT enumerations in `framework/entity/ScreenEntities.xml`: `STRT_TRAY_TODAY`, `STRT_TRAY_CHAT`,
  `STRT_TRAY_NOTIFICATIONS`, `STRT_QUICK_CREATE`, `STRT_CHATTER_SCREEN`, `STRT_RECORD_FILES_SCREEN` and
  `STRT_SHELL_COUNTS_SERVICE`. `webroot/screen/webroot/qapps.xml` adds them to `qvtConfig`.
- `<shell-providers>`, parsed with the screen definition. Its children are `quick-create`, `today-source`,
  `palette-action`, `palette-type`, `palette-source` (R3), `notification-topic` and `keymap`.
- The `shellData` transition (R2): `webroot.xml`, `sri.getShellData()` and a new `crates/moqui-core/src/screen/shell.rs`
  beside `menu.rs`, with an authz check per app root.
- `<context record-entity record-id title selection-form>` as a client binding (R18). The root exposes `screenContext`
  {path, parameters, record, selection, filters, forms} and `assistReach` (the root element ids).
- `m-qapps-root` (style-guide §2.2, design §1.2):
  - the launcher `q-menu` and the current app's title;
  - the Search button, the `+` menu, and the Today, Chat, Inbox and Notifications buttons with badges, each hidden
    when empty (R27);
  - the account menu gains Preferences and Account;
  - the notify-history and screen-history buttons go: history becomes the palette's Recent group, and the
    notifications become the tray panel;
  - the Assist slot is reserved (R1).
- Tray panel frame (design §1.4): 400 px, full width below 600 px. Each tab is a cached `m-dynamic-container` loaded
  once. The panel keeps its open state, tab and scroll, closes on Esc, refreshes on the `shellCounts` topic and its
  tab topic, and polls every 5 minutes when the socket is down.
- Palette (design §1.5): Recent, Screens, Saved finds (FormListFind), Actions, and the provider sources; the `>`, `@`,
  `#` and `:` prefixes; groups capped at 5 with a "more" link; Enter and Ctrl+Enter.
- Quick-create frame. The `+` menu comes from the providers, with the current app's first. It opens
  `STRT_QUICK_CREATE` or a provider's screen in `m-dynamic-dialog`, with the context as parameters.
- Keymap registry `moqui.keymap` (design §1.7): global keys, `registerScope`, the `?` overlay and `KEYMAP` preference
  overrides. The Ctrl+Shift+A check waits for Assist.
- `framework/service/org/moqui/impl/ShellServices.xml` with `publish#ShellCounts` (R13), and a client `shellCounts`
  listener.
- Gallery: `Panel.xml` runs inside the real tray, and a new gallery screen shows the providers and context.
- Tests: goldens for `context` and `shell-providers`; node tests for the keymap, palette grouping and prefixes; a
  `crates/moqui-host/tests/gate3_browser.rs` smoke that opens the palette, a tray tab and the quick-create dialog.

**Mantle**

- R4: the `search#Universal` per-user conditions.
- R9: `lookup#ById` covers requests and communication events.

**BOSS**

- Theme values in `data/BossSetupData.xml` (R14).
- `<shell-providers>` in `Commons.xml` (quick-create kinds task, event, note, contact and request; the palette sources
  of R3; notification topics) and in `Comms.xml` (email, chat message, Messages and rooms). The kinds point at
  placeholders until M2.
- Delete `template/SearchTransitions.xml`. `Commons/Search` stays as the "more" target.

### M2 — Today, notifications, quick create (mr-moqui, Mantle, BOSS)

- **Framework:**
  - New fields: `NotificationMessage.reasonEnumId`, `recordEntityName`, `recordId`, `actorUserId` and `appName`;
    `NotificationTopic.approveServiceName`, `refuseServiceName` and `digestDefault`; `NotificationTopicUser.digest`.
  - The reason enumeration, and builder and script setters for the new fields.
  - The daily digest job (the cron ServiceJob pattern of `framework/data/MoquiSetupData.xml:102`).
  - The `number-card` and `dashboard` elements.
  - `ensure#UserNotesSpace` (R22).
- **Mantle:**
  - `WorkEffortParty.snoozedThruDate`.
  - `WorkEffortServices.get#UserTodayItems`. It also calls the `today-source` providers from shell data, each one
    failure-tolerant.
  - `snooze#UserTodayItem`.
  - `PartyServices.get#ShellCounts` (R12) with its parts today, overdue, notifications and approvals; mail and chat
    are added later. EECAs call `publish#ShellCounts`.
  - Seed the NotificationTopics ChatterMention, ChatMention, WorkEffortReminder, WikiPageReview, FileShare and
    NewMail, with the approval contract of R23.
- **BOSS, all `xml`:**
  - TodayPanel and NotificationsPanel (the tray), and the Notifications center with its Approvals list.
  - QuickCreate with the task, event, note (with a record: without Chatter until M3; without one: in the notes space),
    contact (directory) and request kinds.
  - Commons Home: the Today strip, the counters, tasks this week, requests assigned, upcoming events, shortcuts and
    the setup card. The recent pages and files come in M8 and M9.
  - Settings index, Settings/Notifications, Settings/Preferences (Appearance and Keymap) and a rewrite of
    Settings/Account.
- **Specs:**
  - `mr-mantle-usl/test/CommonsToday.spec.js`: today items with snooze, shell counts (excluding declined events and
    completed tasks), the approval services, and a failing today source.
  - BOSS screen specs.

### M3 — Record links, Chatter, record files (mr-moqui, Mantle, BOSS)

- **Framework:**
  - The `chatter` and `record-files` elements (R5), which render nothing when their theme value is empty.
  - The Tiptap bundle in `refresh.mjs`: core, starter-kit, link, image, mention and placeholder, as an IIFE global.
  - `m-rich-text` (light and full modes, mentions over a search URL; the fallback is `text-area editor-type="html"`).
  - `m-avatar` (face image or initials; the presence dot is added in M10) and `m-record-card` (`lookup#ById`).
- **Mantle:**
  - New entities `CommunicationEventRecord`, `WorkEffortRecord` and `RecordFollower`.
  - `link#CommunicationEventRecord` and `link#WorkEffortRecord`. Each uses the record's own join when one exists:
    OrderCommunicationEvent, RequestCommEvent, WorkEffortCommEvent, WikiPageCommunicationEvent, RequestWorkEffort or
    WikiPageWorkEffort.
  - `get#RecordTimeline`: comm events, `*Note` rows, activities, the audit log and files, each source
    failure-tolerant.
  - Follow and unfollow; ChatterMention notifications.
  - `find#PartyCommunicationEvents` extended to the recipient rows and leaving out mailbox posts; R24.
- **BOSS:**
  - `Shared/Chatter.qvue` and `Shared/RecordFiles.qvue`. Until M8, RecordFiles works over the record's `*Content`
    join and its content folder. Both are mounted hidden in every app root.
  - QuickCreate gains the activity kind and the link chip; QuickNote gets its record branch.
  - Chatter and record-files go into EventDetail, TaskDetail and RequestDetail as the first hosts.
- **Specs:** `RecordLinks.spec.js` (own join versus the generic link, the timeline union, followers and mentions), and
  a record visibility check for R5.

### M4 — Contacts (mr-moqui, Mantle, BOSS)

- **Framework:**
  - `container-split` and the wizard panel (`subscreens-panel type="wizard"`).
  - vCard 3.0 and 4.0 parse and write: a crate checked against `deny.toml`, exposed as a tool. It is the first part of
    the iCalendar, vCard and iMIP tool.
- **Mantle:**
  - New entities `ContactBook`, `ContactBookParty`, `ContactBookGroup`, `ContactBookGroupParty` and
    `ContactBookShare` (`mantle.party.contact`).
  - `Party.privateOwnerUserId` with the R7 filter conditions.
  - `ContactBookServices` and `ContactImportServices` (parse, preview, import as a job, export as vCard or CSV).
  - The duplicate scan skips personal contacts; R10.
- **BOSS:** Contacts (split), ContactDetail (Overview, Activity, Calendar, Tasks, Requests and Files; Consent comes in
  M11), ContactImport (wizard), Duplicates and Settings/ContactBooks. CardDAV info is `later`.
- **Specs:** `ContactBooks.spec.js`, including the R7 privacy check over every path, and an import with the Google and
  Outlook CSV presets.

### M5 — Mail (mr-moqui, Mantle, BOSS; the largest milestone, in parts)

**M5a — model, Internal account and mailboxes (framework and Mantle)**

- Framework entities:
  - New: EmailAccount (kinds internal, hosted, external and shared), EmailAccountUser, EmailIdentity, EmailFolder,
    EmailLabel, EmailMessageLabel, EmailMessageAttachment, EmailRule, EmailOutOfOffice, EmailTextBlock and
    EmailSearch.
  - EmailMessage gains the account, folder, uid, flags, snippet, size, snooze and schedule fields.
  - EmailServer gains `authTypeEnumId` and a token reference.
- Mantle:
  - Internal message state on CommunicationEventParty: `readDate`, `isFlagged`, `archivedDate`, `snoozedThruDate`,
    and the role types.
  - `CommunicationEventPartyLabel`.
  - `create#Message` takes to and cc lists and `contactListId`, and applies R15; `reply#CommunicationEvent` per R8.
  - `find#InboxThreads`, a cursor merge of the two stores by date; `get#InternalThread`;
    `set#InternalMessageState`; `close#ListThread`.
  - Mailboxes:
    - `ContactList` gains `postingEnumId`, `defaultDeliveryEnumId` and `archivedDate`.
    - `ContactListParty` gains `roleTypeId` and `deliveryEnumId`.
    - New: the MAILBOX type, the enumerations and the role types `ListOwner` and `ListModerator`.
    - A new `service/mantle/marketing/ContactListServices.xml`. Private mailboxes are enforced in its services (R21).
- Specs: `InternalMessages.spec.js` and `Mailboxes.spec.js`. They cover the posting policies, private join requests,
  joining later (earlier threads show as read), the reply variants, and per-recipient state.

**M5b — the client over the Internal account (BOSS, framework components)**

- `m-html-view`: DOMPurify (already vendored) in a sandboxed iframe with a CSP. Remote images stay blocked until
  allowed, and it follows dark mode.
- The Inbox keymap scope.
- `Inbox.qvue` with its rail, thread list, reading pane (right, bottom or off), search operators, bulk actions, keyboard
  and mailbox header.
- `Compose.qvue` as a dock, dialog or page, with `m-rich-text`, recipient chips over parties, users and mailboxes, text
  blocks, and draft autosave.
- MessageDetail (`xml`) and Comms Home.
- Demo-able with no mail server.

**M5c — sending and account setup**

- Per-account SMTP routing in `send#EmailMessage`; `save#Draft` and `send#Draft`; the undo-send hold in the Outbox; the
  scheduled-send and snooze-return jobs; R6.
- The MailAccounts wizard: password authentication, Thunderbird autoconfig and SRV discovery, `test#EmailAccount`, and
  the filing policy.
- Identities, TextBlocks, OutOfOffice, and Preferences MailDefaults.
- Search documents: `MoquiEmailMessage`, and `MantleCommunicationEvent` with `contactListId` and its per-user filter.
  The header Inbox count (R26).

**M5d — the IMAP and POP sync engine (Rust, R20)**

- `EmailClientServices.sync#EmailAccount` covers:
  - folders: listing with special-use mapping, UIDVALIDITY with incremental UIDs, CONDSTORE or QRESYNC when the server
    offers them;
  - messages: flags both ways, MOVE and COPY, APPEND of sent mail, IDLE on the Inbox;
  - POP as fetch-only; attachments as DbResource files.
- A party match makes a CommunicationEvent when the account's filing policy allows it.
- `run#EmailRules` and the Rules screen; `.eml` and `.mbox` import.
- Failure-tolerant per account, folder and message.
- Tests: a scripted fake IMAP server in the crate tests (no network), plus a manual run against a real account.

**M5e — OAuth client and token store**

- Authorization code with PKCE in a popup, encrypted refresh tokens, and XOAUTH2 for IMAP and SMTP, for Google and
  Microsoft 365 (R19).

**M5f — SMTP listener behind the gateway** (hosted and shared accounts)

- Mail accepted only from the gateway's addresses, with its Authentication-Results trusted, routed by address, then
  rules, then storage. This fills in the empty `inbound-smtp` feature of moqui-host.

M5 leaves two gaps, closed later: the iMIP card comes in M7 and "Attach from Files" in M8.

### M6 — Tasks and requests (BOSS on existing Mantle)

- Tasks (smart lists, quick-add row, bulk actions), TaskDetail, Requests and RequestDetail, rewritten from the M0
  conversions with Chatter, record-files and the context element.
- The board and calendar switches open the Projects board and the Commons Calendar until `view-board` and
  `view-calendar` exist, as design §8 says.

### M7 — Calendar and schedules (mr-moqui, Mantle, BOSS)

- **Framework:** the rest of the iCalendar tool: ICS parse and write, RRULE expansion with `jiff` time zones, VALARM,
  and iMIP REQUEST, REPLY and CANCEL.
- **Mantle:**
  - New entities: Calendar, CalendarWorkEffort, CalendarShare, CalendarSubscription, WorkEffortRecurrence and
    WorkEffortReminder, with its job. New seed values: WeatRecurrenceInstance, WeptTentative and the
    `WorkEffortFacility.statusId` flow.
  - R11.
  - `get#FreeBusy`, `send#EventInvitations`, `respond#EventInvitation` and `book#Resource`.
  - `CalendarServices`: create, share, subscribe, the fetch job, export and import.
- **BOSS:** `Calendar.qvue`, the EventDetail rewrite, `Schedules.qvue` (resource mode), ResourceDetail,
  Settings/Calendars and Preferences CalendarDefaults; the Inbox ImipCard; meetings on Comms Home.
- **Specs:** `CalendarServices.spec.js`. It covers recurrence with overrides, RSVP, free/busy, booking with and without
  a policy, reminders, and an ICS round trip.

### M8 — Files and drives (mr-moqui, BOSS)

- **Framework:**
  - New entities: ResourceDrive, ResourceDriveMember, ResourceShare, ResourceFavorite, ResourceTag,
    ResourceTagMember and ResourceTrash.
  - New fields: `DbResourceFile.fileSize` and `versionNote`, and a `note` on ResourceVersion.
  - Change sets in the resource facade, built on `commit(Vec<Edit>)` in `crates/moqui-core/src/resource/git/ops.rs:232`.
  - The git path index cache.
  - `FileServices`, all verbs. Access goes through drive members (R21).
  - Previews: image thumbnails with the `image` crate; a PDF's first page through Chromium when it is present.
  - The `MoquiDriveFile` document, indexed by FileServices.
  - The public shell and the token routes (R16).
- **BOSS:**
  - The Records drive and its folder map (R25).
  - `Files.qvue`, Drives, Shares, and `PublicShare.qvue` at `/s/<token>`.
  - RecordFiles moves onto the Files component.
  - Compose gains AttachFromFiles; Home gains recent files; FileShare notifications.
- WebDAV stays later (R17).

### M9 — Knowledge and notes (mr-moqui, BOSS)

- **Framework:** WikiPageReview; WikiPageLink with backlinks indexed in `update#WikiPage`; `move#WikiPage`, which
  replays history into a git space; `create#WikiSpace` and `clone#WikiSpace` with `repositoryKind`; version notes on
  saves.
- **BOSS:** `Knowledge.qvue`, with the markdown `text-area` until `m-coedit` exists and the History compare over
  `getVersionDiff`; Spaces, Review and `Notes.qvue`; recent pages on Home.

### M10 — Chat and presence (mr-moqui, Mantle, BOSS)

- **Framework:**
  - A new `framework/entity/ChatEntities.xml`: ChatRoom, ChatRoomMember, ChatEvent and ChatAttachment.
  - `ChatServices`.
  - Events go to members as NotificationMessages on `chatRoom:<id>` and `chatUser:<id>`, so `notws` delivers only to
    member users.
  - Typing and read markers.
  - UserStatus with the `userStatus` topic, auto-away, the `m-avatar` dot and status in the account menu.
  - The `MoquiChatEvent` document.
- **Mantle:** the chat part of shell counts; ChatMention; record-bound rooms in `get#RecordTimeline`; creating a task,
  request or event from a message.
- **BOSS:** `Chat.qvue` and `ChatPanel.qvue` (the tray tab), ChatSettings, the chat action on Contacts, and rooms on
  Comms Home.

### M11 — Consent and unsubscribe (mr-moqui, Mantle, BOSS)

- **Mantle:** PartyConsent; `ConsentServices` (`store#PartyConsent`, `unsubscribe#ContactListParty`);
  `List-Unsubscribe` headers on ContactList sends and the one-click POST.
- **BOSS:** Consent; Unsubscribe in the public shell at `/u/<token>`; the Consent tab on ContactDetail.

## 6. Later

Designed in design-drawers-commons.md; each of these gets its own plan:

- Calls: WebRTC with Calls, Call, LiveCall, CallSettings, CallSession and CallLink, and the `Call` comm type.
- Sync: CalDAV, CardDAV, WebDAV, and SFTP over drives, with app passwords and Settings/Sync.
- `m-coedit` with `yrs` and CollabDocument.
- The Assist drawer port (Phase 13), BOSS skills and agent room members.
- PWA install and web push.
- Search: extracted text from PDF and office files.
- Calendar: Google and Microsoft 365 subscriptions over OAuth.
- Smaller items: the org chart and polls.
- Mail: the mailbox email bridge, an IMAP or JMAP server, S/MIME and PGP, and an archive policy.
- Retention: a job for the personal books of disabled users.
- Git: push and an HTTPS git server.

## 7. Verification

- **Per milestone,** as in its specs and the "Done" rule of §4.
- **End to end,** run `./moq run` and sign in as `john.doe`, then:
  - **M1–M3:** walk through the badges, the palette (Ctrl+K, each prefix, an id), each tray tab, quick create from an
    order, and Chatter on that order.
  - **M4:** import a Google Contacts CSV.
  - **M5:** add a real mail account with an app password, then read, reply, file the thread on a record and move it.
  - **M7–M11:** the calendar, files, knowledge, chat and consent flows of their screens.
- **Screenshots** with `example/test/gallery-shots.mjs` (`BASE_URL`, `USERNAME`, `PASSWORD`, `CHROME`), light and dark.
- **Non-BOSS check:** with BOSS's theme values removed, MarbleERP and the tools screens still render with the hidden
  elements (R27).

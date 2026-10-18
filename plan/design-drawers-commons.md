# IronStone BOSS — Header, drawers, Commons & Comms design

Oct 18, 2026 — draft

The suite chrome every IronStone app runs in (the header, the outer Assist drawer, the inner
drawer and the palette), and the two shared apps that feed it: **IronStone Commons** (contacts,
calendar and schedules, tasks and requests assigned, files, notes and knowledge, account and
preferences) and **IronStone Comms** (email, chat, calls, Chatter on every record, consent).
The audience is everyone who signs in: in a large organization every employee has Commons and
Comms beside their role apps; in a small business or a home they may be the whole system. The
design therefore borrows the patterns people already know from Gmail, Outlook, Google Calendar,
Google Drive, OneDrive, Google Contacts, Slack and Teams as much as from the open-source
references the research catalogued, and aims at the level of polish that lets someone use the
Comms Inbox as their only email client.

Three decisions shape every screen here: all screens are client-rendered and server-static;
each screen is written in XML widgets or as a `.qvue` component, decided per screen in the
**Impl** column of §3 (an email client, a chat room, a calendar grid, a files browser and a
co-editing editor are `.qvue`, the rest XML); and everything, files included, lives in Postgres
under one backup, with file-system storage as a deployment option rather than the default.

**Scope against [design-doc-guide.md](design-doc-guide.md).** This one file is the guide's
`design-drawers-commons.md`: the suite shell, Commons and Comms together. It designs the header
and drawers in more depth than style-guide §2, because the Assist port in mr-moqui (Phase 13 of
`plans/Remaining-Work.md`) is partly driven by it, and its screen table carries the guide's
**Impl** column (`xml` or `qvue`), decided per screen.

**Inputs.** [research-drawers-commons.md](research-drawers-commons.md) (§1–§5 header and drawers,
§6–§8 Comms, §9–§13 Commons, §14 settings, §15 extension points, §17 baseline, §18 gaps),
[research-crosscut.md](research-crosscut.md) §3–§6 and §8, [initial-design.md](initial-design.md)
(its **Decided** table is fixed), [style-guide.md](style-guide.md) §2–§8,
[ss-inventory.md](ss-inventory.md), [usl-inventory.md](usl-inventory.md), the Mantle entities in
`mr-mantle-udm/entity/`, the framework entities in `base-component/framework/entity/`, the
Java Assist panel (`moqui/runtime/.../webroot/js/assist/`) and its tools
(`moqui/framework/.../impl/llm/tools/`), and mr-moqui's `plans/Remaining-Work.md`.

Sections: [1 suite shell](#1-the-suite-shell-header-and-drawers) · [2 app shells](#2-app-shells-commons-and-comms) ·
[3 screens](#3-screens) · [4 header and drawer screens](#4-header-and-drawer-screens) · [5 Commons Home](#5-commons-home) ·
[6 contacts](#6-contacts) · [7 calendar](#7-calendar-and-schedules) · [8 tasks and requests](#8-tasks-and-requests) ·
[9 files](#9-files) · [10 notes and knowledge](#10-notes-and-knowledge) · [11 Commons settings](#11-commons-settings-and-account) ·
[12 Comms Home, Inbox and email](#12-comms-home-inbox-and-email) · [13 chat](#13-chat) · [14 calls](#14-calls) ·
[15 Chatter](#15-chatter-and-activities) · [16 consent](#16-consent-and-unsubscribe) · [17 Comms settings](#17-comms-settings) ·
[18 documents and outputs](#18-documents-and-outputs) · [19 framework and data needs](#19-framework-and-data-needs) ·
[20 decided](#20-decided) · [21 open](#21-open)

---

## 1. The suite shell: header and drawers

Style-guide §2 fixes the frame: a `q-layout` with the header, the left app drawer, the canvas,
a right-aligned panel inside the canvas, a right Assist drawer and the footer. This section
decides what goes in it, who builds each piece, and how the pieces talk. Two names are used
from here on: the **outer drawer** is Assist, a framework shell item; the **inner drawer** is
the panel style-guide §2.4 calls the tray panel, a framework frame whose three tabs are BOSS
screens.

### 1.1 Regions and ownership

| Region | Built by | Content from | In Assist's reach |
| --- | --- | --- | --- |
| Header bar | Framework (`m-qapps-root`) | Labels, theme, app-registered providers (§1.2) | No |
| App drawer (left) | Framework | The current app's menu, pinned saved finds, Settings and Home | No |
| Canvas | Framework frame | The screen, from the app | Yes |
| Inner drawer | Framework frame (open state, tab, width, Esc) | Three BOSS screens: `Commons/Panel/Today`, `Comms/Panel/Chat`, `Commons/Panel/Notifications`, named by theme values | Yes |
| Dialogs opened from the canvas, the quick-create dialog, the palette | Framework frame | BOSS screens (`Commons/QuickCreate`); palette results from providers | Dialogs and quick create yes; the palette no |
| Outer drawer (Assist) | Framework | The Assist conversation, canvas and tasks | It is Assist |
| Live call mini-window | Framework slot (`q-page-sticky`) | Comms `Comms/Calls/LiveCall` | Read yes; its controls post, so no clicks |
| Footer | Theme | Footer items | No |

**What Assist may reach (answers the initial-design open item).** `screen_use` acts on the
canvas DOM and nothing else: the screen, dialogs opened from it, the inner drawer's three tabs
when open, the quick-create dialog and the live-call window. The header bar, the app drawer,
the account menu, the palette, the theme plugins and the outer drawer itself are outside. Two
consequences: Assist cannot open the inner drawer or the palette, and does not need to, because
every inner-drawer tab is a server-static screen whose data is on `<path>/actions`, which
Assist reads through its `request` tool, and the palette's providers (§1.5) are the same catalog
Assist's `browse` tool indexes; and Assist cannot press a quick action (mark done, approve,
join), which are posts, matching the read-only rule of initial-design. The implementation is a
list of root element ids the framework exposes as `assistReach`, not a layout change.

### 1.2 The header, left to right, and who feeds each element

| Element | Behavior | Fed by |
| --- | --- | --- |
| Menu toggle, launcher, app title, breadcrumbs | As style-guide §2.2 | Framework, menu data |
| Search | Opens the palette; Ctrl+K or Cmd+K | Providers of every app (§1.5); Commons and Comms register the ones in §1.5 |
| Quick create `+` | A `q-menu` of kinds; each opens `Commons/QuickCreate?kind=…` (or Comms' composer) in a dialog, prefilled from the screen context | `<shell-providers><quick-create>` of Commons (task, event, note, contact, request), Comms (email, chat message, call) and any app |
| Today | Badge: tasks and activities due today plus overdue; opens the inner drawer on Today | `shellCounts.today` from `mantle.party.PartyServices.get#ShellCounts` (new, §19) over the notification WebSocket topic `shellCounts`; the screen `Commons/Panel/Today` |
| Chat | Badge: unread rooms and mentions; presence dot; opens the inner drawer on Chat | `shellCounts.chat`; the screen `Comms/Panel/Chat` |
| Inbox count | Badge: unread mail across accounts; a link to `Comms/Inbox`, not a panel (initial-design: asynchronous gets a count) | `shellCounts.mail` |
| Notifications | Badge: unread notifications plus approvals waiting; opens the inner drawer on Notifications | `shellCounts.notifications`; the screen `Commons/Panel/Notifications` |
| Documentation `?` | As today | Framework |
| Theme plugins | As today; the My Account counters widget retires | Theme data |
| Account | Avatar with presence dot; menu: name and user name, **status** (online, away, do not disturb, invisible, custom text with clear-at), Preferences (`Commons/Settings/Preferences`), Account (`Commons/Settings/Account`), dark mode, the `STRT_HEADER_ACCOUNT_COMP` plugins, re-login, log out | Framework; `UserStatus` (§1.8) |
| Assist | Toggles the outer drawer; Ctrl+Shift+A | Framework |

The theme values that name the BOSS screens for the framework frames are seeded by BOSS in
`data/BossSetupData.xml`: `STRT_TRAY_TODAY`, `STRT_TRAY_CHAT`, `STRT_TRAY_NOTIFICATIONS`,
`STRT_QUICK_CREATE`, `STRT_CHATTER_SCREEN` and `STRT_RECORD_FILES_SCREEN` (the last two are
how the `chatter` and `record-files` elements of style-guide §8 find their Mantle-aware
screens, §15 and §9). A deployment without BOSS has an empty inner drawer and no Chatter; the
framework stays Mantle-free.

### 1.3 The outer drawer: Assist

Assist is the framework's port of the Java Assist panel into a right `q-drawer` (320–720 px,
resizable, full screen below 600 px). This design does not build it; it says what the port
must keep and what BOSS needs from it.

**Kept from the Java panel** (`js/assist/Assist.qvue`, `README_SANDBOX.txt`, the `llm/tools`):
the conversation pane with streaming turns and the conversation list (`LlmConversation`,
profile `assist`); the canvas written by `write_ui` (OpenUI Lang rendered by the vendored
OpenUI `lang-core`; `vue-sfc` in the sandboxed iframe with its one message channel; `form`
legacy) with its action buttons rendered by the page, never by generated code; "Adjust this
screen" (revise the canvas from feedback); the server tools `browse` (the screen catalog),
`request`, `run_service`, `find_basic`, `find_skill`, `pin`, `enter_sim` and the client tool
`screen_use` with its seven actions (`navigate`, `snapshot`, `fill`, `set_selection`,
`submit_find`, `click_nav`, `watch`) and its hard rule that a mutation is never submitted (a
control that posts is refused; a save stays a user click); skills from `component://*/skill/*.md`;
the A2A server (`plans/A2A-Server.md`) so a remote agent reaches the same loop.

**What BOSS asks of the port.**

- **Screen context as input.** Every turn carries the root's `screenContext` (§1.6): path and
  parameters, the record (entity and id), the selection, the filters, and the forms with their
  field names. `snapshot` then returns the forms by name and the record, not a DOM dump.
- **Canvas placement.** A `write_ui` canvas renders inside the drawer, which widens to its
  maximum while a canvas is shown; an "Open in page" control moves it into the canvas region
  with the current screen hidden behind a back button, as the Java panel's page slot did. On a
  phone the drawer is the page.
- **Running tasks.** A third pane lists the user's running and yielded conversations and A2A
  tasks (`A2ATask` with `A2ATaskStatus`), each with its state and a resume action; a yielded
  `write_ui` shows as "waiting for you".
- **The reach list** of §1.1, read from the root.
- **Agents in Comms.** Later, an Assist profile or an A2A remote agent can be a member of a chat
  room (§13) and answers when mentioned; the port exposes a server-side entry point that takes
  a room message as a user turn and posts the reply as the agent member.
- **BOSS skills.** Commons and Comms ship skills (`component://ironstone-boss/skill/*.md`) for
  the things Assist is asked most: find a message, draft a reply, summarize a thread, find a
  time for a meeting, file an email on a record, make a task from a message. A skill that
  writes yields a `write_ui` confirm; the user clicks.

### 1.4 The inner drawer

One panel, 400 px at the right of the canvas from 600 px and the full width below, with three
tabs whose contents are the Panel-archetype screens of §4. The framework frame keeps the open
state, the active tab and each tab's scroll position across navigation, closes on Esc or its
close button, and loads each tab's screen by path once (the screens are server-static, so a
tab is a cached component fetching `/actions`). A tab's counts and lists refresh on the
`shellCounts` WebSocket topic and on a per-tab topic (`todayItems`, `chatRoom:<id>`,
`notifications`), with the Java client's five-minute poll kept as a fallback when the socket
is down. Every item links to its record in the canvas; nothing in the drawer opens a second
panel; a quick action posts, shows its result as a notification and refreshes the tab. "Open in
Commons" / "Open in Comms" on each tab goes to the full screen.

### 1.5 The palette and quick create

**Palette.** A `q-dialog` at the top with one input and grouped results; Enter opens the first
result, Ctrl+Enter opens it in a new tab. Groups, in order: **Recent** (the last 25 screens,
shown before typing), **Records** (the search index through `mantle.search.UniversalSearchServices.search#Universal`,
grouped by document type, with the organization limit it applies), **People** (Commons:
`mantle.party.PartyServices.search#Party` over the directory and the user's address books),
**Messages and rooms** (Comms: mail threads by subject and sender, chat rooms by name), **Pages
and files** (Commons: wiki pages and files by name), **Events** (upcoming events by name),
**Actions** (the `<palette-action>` providers of the apps the user may open: "Compose email",
"New event", "Create sales order", "Receive shipment"), **Screens** (by menu title), **Saved
finds** (`moqui.screen.form.FormListFind` the user may run). An id pattern goes straight to
`mantle.GeneralServices.lookup#ById`, as QuickLookup does. Prefixes narrow a search: `>` actions,
`@` people, `#` rooms, `:` screens; otherwise everything is searched and the groups are capped at
five rows each with "more" opening the owning app's list with the text as its find. The palette
retires `Base/QuickSearch`, `Base/Search` and `Base/QuickLookup`; the full search page survives
as `Commons/Search` only as the "more" target for Records.

**Quick create.** The `+` menu lists the kinds registered by the apps the user may open, with
the current app's kinds first; each kind names a screen and parameters. Commons registers task,
event, note, contact and request (all `Commons/QuickCreate?kind=…`, §4); Comms registers email
(the composer, §12), chat message (a people picker that opens the room in the inner drawer) and
call. Prefill from the screen context: a record in context becomes the link chip (the task,
event, note or request is linked to it, §1.6); a party in context (a customer, supplier, contact
or employee screen) becomes the contact's organization or the request's customer; a product in
context is noted in the description. On a phone the menu is the same and each dialog is
maximized.

### 1.6 Screen context

The `<context>` screen element of style-guide §8 is the contract between every screen and the
shell. A screen sets `record-entity`, `record-id` and `title` for the record it shows,
`selection-form` for the list whose selected rows are the selection, and the root adds the path,
the parameters, the active find fields of the screen's lists, and the forms with their field
names. Readers and what they take:

| Reader | Takes | For |
| --- | --- | --- |
| Quick create | record, party, product | The link chip and prefills (§1.5) |
| Chatter (§15) | record | Which timeline to show; where a sent email or logged note is filed |
| Today tab | record | "Add an activity on this record" |
| Assist | everything | `snapshot`, `fill`, `watch`; the turn's context |
| Record files (§9) | record | The record's folder |
| Compose (§12) | record, party | "Also file on <record>" and the default recipient |

A record link made from the context is written to the record's own join when one exists
(`mantle.order.OrderCommunicationEvent`, `mantle.request.RequestCommEvent`,
`mantle.work.effort.WorkEffortCommEvent`, `mantle.party.communication.WikiPageCommunicationEvent`,
`mantle.request.RequestWorkEffort`, `mantle.work.effort.WikiPageWorkEffort`) and otherwise to
the generic links this design adds (`CommunicationEventRecord`, `WorkEffortRecord`, §19), which
answers research-crosscut §8's generic-link question for Chatter and activities.

### 1.7 Keyboard

A suite-wide key map is a framework shell item (§19 "Keymap registry"): the shell registers the
global keys, each screen registers its scope when it mounts, the `?` key opens an overlay
listing the keys active now, and `Commons/Settings/Preferences` lets the user change any binding
(stored as the `KEYMAP` user preference). Global keys: Ctrl+K palette, Ctrl+Shift+A Assist,
Esc closes the top-most dialog, menu or drawer, `?` help, `g` then a letter for the go-to set
(`g i` Inbox, `g c` Calendar, `g t` Tasks, `g f` Files, `g n` Notes, `g h` the app's Home) and
`c` compose or create in the current app. A screen's scope wins over the global set while it has
focus, and a text input swallows single letters. The Inbox (§12) and Chat (§13) carry the full
sets people expect from Gmail and Slack, with the gaps closed (moving focus between panes,
ranged selection, jump to a folder or label by typing its name, "archive and open next" as a
preference).

### 1.8 Presence and status

A `UserStatus` record (new, framework, §19): online, away, do not disturb, invisible, or a custom
text with an emoji and a clear-at time, plus an automatic "in a call" and auto-away after the
idle minutes in Comms settings. It is set from the account menu, published on the WebSocket topic
`userStatus`, and shown as a dot on every avatar the suite draws (chat, Chatter authors, contact
rows, attendee lists). Do not disturb silences toasts and chat sounds; the notifications are
still recorded and the badges still count.

## 2. App shells: Commons and Comms

Both roots are mounted under the apps root by `MoquiConf.xml` and authorized for `ALL_USERS`:
everyone who signs in has them; a deployment narrows that with its own authz. They replace the
current `boss.xml` root and the `Base/User` copies of My Account (design-doc-guide §10). Each
root's `always-actions` set `appRoot` and call `mantle.party.PartyServices.setup#UserOrganizationInfo`
as `boss.xml` does today.

### 2.1 Commons

Root `screen/Commons.xml`, menu title "IronStone Commons", icon `sym_o_hub`, default item
`Home`. Menu to depth two (a panel screen and a reused detail have `menu-include="false"`):

- Home — `Commons/Home`
- Contacts — `Commons/Contacts`
  - Import — `Commons/Contacts/Import`
  - Duplicates — `Commons/Contacts/Duplicates`
- Calendar — `Commons/Calendar`
  - Rooms and equipment — `Commons/Calendar/Schedules`
- Tasks — `Commons/Tasks`
- Requests — `Commons/Requests`
- Files — `Commons/Files`
  - Shares — `Commons/Files/Shares`
- Knowledge — `Commons/Knowledge`
  - Spaces — `Commons/Knowledge/Spaces`
  - Review — `Commons/Knowledge/Review`
- Notes — `Commons/Notes`
- Notifications — `Commons/Notifications`
- Settings — `Commons/Settings` (Account, Preferences, Notifications, Address books, Calendars, Sync)

Landing (`Commons/Home`, §5): the Today strip, five counters, my work lists (tasks this week,
requests assigned, upcoming events), recent pages and files, shortcuts, and a first-run setup
card.

### 2.2 Comms

Root `screen/Comms.xml`, menu title "IronStone Comms", icon `sym_o_forum`, default item `Inbox`
(the landing `Home` is in the menu but a mail app opens on its inbox). Menu:

- Home — `Comms/Home`
- Inbox — `Comms/Inbox`
- Chat — `Comms/Chat`
- Calls — `Comms/Calls`
- Consent — `Comms/Consent` (marketing and admin roles)
- Settings — `Comms/Settings` (Mail accounts, Identities and signatures, Rules, Out of office, Text blocks, Chat, Calls)

Landing (`Comms/Home`, §12): unread by account, flagged and snoozed due, mentions, missed calls,
outbox failures, needs-reply and follow-ups-due lists, upcoming meetings with Join, shortcuts.
Mail domains, relay, DKIM, the gateway's trusted addresses, the SMTP listener and the other
protocol servers are Admin's screens (research-crosscut §4), read-only links from Comms
settings.

## 3. Screens

One row per screen, grouped by area. **Impl** is `xml` (XML screen and form widgets) or `qvue`
(a Vue component file served as a screen, style-guide §4.8). **Scope**: `parity` replaces a My
Account, Party or Wiki screen; `new` is in the first BOSS release without a baseline; `later` is
designed and built after it.

### Header and drawers

| Screen | Path | Archetype | Impl | Purpose | Main record | Reused | Roles | Scope | Context |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TodayPanel | `Commons/Panel/Today` | panel | xml | Overdue, due today and later today across tasks, activities, events, approvals and app sources, with quick actions | `WorkEffort` | own | app | new | none |
| ChatPanel | `Comms/Panel/Chat` | panel | qvue | Rooms and direct messages with unread counts; a room opens in the panel | `ChatRoom` (new) | own; shares the room component of Chat | app | new | `ChatRoom roomId` |
| NotificationsPanel | `Commons/Panel/Notifications` | panel | xml | Unread and recent notifications by reason and app; approvals waiting with Approve and Refuse inline | `NotificationMessage` | own | app | new | none |
| QuickCreate | `Commons/QuickCreate` | dialog | xml | The quick-create forms for task, event, note, contact and request, prefilled from the screen context | `WorkEffort`, `Party`, `Request`, `WikiPage` | own | app | new | none |
| Notifications | `Commons/Notifications` | list | xml | The notification center: filters by reason, app, read state and date; the approvals inbox; mark read | `NotificationMessage` | own | app | new | list find parameters |
| LiveCall | `Comms/Calls/LiveCall` | panel | qvue | The call mini-window shown on any screen during a call | `CallSession` (new) | own | app | later | `CallSession callSessionId` |

### IronStone Commons

| Screen | Path | Archetype | Impl | Purpose | Main record | Reused | Roles | Scope | Context |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | `Commons/Home` | landing | xml | Today, counters, my work, recent pages and files, shortcuts, first-run setup | — | own | app | new | none |
| Contacts | `Commons/Contacts` | split | xml | The directory and the user's address books: a side list with search, scopes and groups; the contact record in the main pane | `Party` | side own; main pane is Contact / party record, crosscut §3.1 | app | parity | `Party partyId`; `Party rows` |
| ContactDetail | `Commons/Contacts/ContactDetail` | detail | xml | The contact record | `Party` | Contact / party record, crosscut §3.1 | app | parity | `Party partyId` |
| ContactImport | `Commons/Contacts/Import` | wizard | xml | vCard and CSV import with mapping, duplicate policy, preview and result | `Party` | own | app | new | none |
| Duplicates | `Commons/Contacts/Duplicates` | list | xml | Candidate duplicates with compare and merge | `Party` | own | contact admins | parity | `Party rows` |
| Calendar | `Commons/Calendar` | calendar | qvue | Day, work week, week, month and agenda over my, shared and subscribed calendars; quick create; drag to move | `WorkEffort` (`WetEvent`) | Calendar & schedules, crosscut §3.12, designed here | app | parity | `WorkEffort workEffortId`; filters: calendars, range |
| EventDetail | `Commons/Calendar/EventDetail` | detail | xml | One event: when, repeat, reminders, where, rooms and equipment, attendees and RSVP, details, attachments, Chatter | `WorkEffort` | own; Events, included by Marketing | app | parity | `WorkEffort workEffortId` |
| Schedules | `Commons/Calendar/Schedules` | calendar | qvue | Room and equipment schedules by resource with a Book action | `WorkEffort`, `Facility`, `Asset` | Calendar & schedules; Maintenance includes it with scheduling admin | app | new | `Facility facilityId` or `Asset assetId`; range |
| Tasks | `Commons/Tasks` | list | xml | My tasks in smart lists with list, board and calendar views and a quick-add row | `WorkEffort` (`WetTask`) | own | app | parity | `WorkEffort rows`; list find parameters |
| TaskDetail | `Commons/Tasks/TaskDetail` | detail | xml | The task | `WorkEffort` | Task / work item, crosscut §3.11 | app | parity | `WorkEffort workEffortId` |
| Requests | `Commons/Requests` | list | xml | Requests I raised, am assigned to or watch | `Request` | own | app | parity | list find parameters |
| RequestDetail | `Commons/Requests/RequestDetail` | detail | xml | The request | `Request` | Request / case, crosscut §3.10 | app | parity | `Request requestId` |
| Files | `Commons/Files` | split | qvue | Folders, recent, favorites, shared with me, records and trash; detail sidebar with sharing, versions, comments and activity; upload and preview | `DbResource` | own | app | new | `DbResource resourceId`; `DbResource rows` |
| Shares | `Commons/Files/Shares` | list | xml | Outgoing shares and links with expiry and revoke; incoming shares to accept | `DbResourceShare` (new) | own | app | new | list find parameters |
| PublicShare | `Commons/Files/Public` | split | qvue | The anonymous page of a shared file or folder: view, download, file drop | `DbResource` | own | anonymous by token | new | none |
| Knowledge | `Commons/Knowledge` | editor | qvue | Spaces, page tree and the page: read, co-edit, history and compare, comments, review and publish, links to records | `WikiPage` | own; Knowledge base articles, included by Customer Service | app | parity | `WikiPage wikiPageId` |
| Spaces | `Commons/Knowledge/Spaces` | list | xml | Wiki spaces: create, clone, members, visibility, public URL | `WikiSpace` | own | space admins | parity | `WikiSpace wikiSpaceId` |
| Review | `Commons/Knowledge/Review` | list | xml | Pages with a version awaiting review | `WikiPageReview` (new) | own | reviewers | new | list find parameters |
| Notes | `Commons/Notes` | editor | qvue | Personal notes: the same editor over the user's private space, a flat list, tags and pins | `WikiPage` | own | app | new | `WikiPage wikiPageId` |
| Settings | `Commons/Settings` | settings | xml | The settings index | — | own | app | new | none |
| Account | `Commons/Settings/Account` | settings | xml | Name, user name, email, contact info, password, two-factor, locale, time zone | `UserAccount` | own | app | parity | none |
| Preferences | `Commons/Settings/Preferences` | settings | xml | Appearance and density, start app, key map, mail and calendar defaults | `UserPreference` | own | app | new | none |
| NotificationSettings | `Commons/Settings/Notifications` | settings | xml | Per-topic in-app, email and digest subscriptions | `NotificationTopicUser` | own | app | parity | none |
| ContactBooks | `Commons/Settings/ContactBooks` | settings | xml | Address books and groups, sharing, CardDAV addresses | `ContactBook` (new) | own | app | new | none |
| Calendars | `Commons/Settings/Calendars` | settings | xml | My calendars, colors, sharing, external subscriptions, publish links, working hours | `Calendar` (new) | own | app | new | none |
| Sync | `Commons/Settings/Sync` | settings | xml | Device setup for CalDAV, CardDAV and WebDAV with app passwords | app password (new) | own | app | later | none |

### IronStone Comms

| Screen | Path | Archetype | Impl | Purpose | Main record | Reused | Roles | Scope | Context |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | `Comms/Home` | landing | xml | Unread by account, flagged and snoozed, mentions, missed calls, outbox failures; needs-reply and follow-ups; meetings with Join | — | own | app | new | none |
| Inbox | `Comms/Inbox` | split | qvue | Unified and per-account mail with folders and labels, thread list and reading pane, search, keyboard first; internal messages as the Internal account | `EmailMessage` | own | app | new | `EmailMessage emailMessageId`; `EmailMessage rows`; filters: account, folder, search |
| Compose | `Comms/Inbox/Compose` | editor | qvue | The composer as a dock, a dialog or a page: identities, recipients, rich text, attachments from Files, text blocks, schedule send, undo send | `EmailMessage` (draft) | own; email sending included by Marketing and Customer Service | app | new | `EmailMessage emailMessageId` |
| MessageDetail | `Comms/Inbox/MessageDetail` | detail | xml | One message by id for deep links, Chatter, print and audit: headers, body, attachments, record links, delivery status, resend | `EmailMessage` | own | app | new | `EmailMessage emailMessageId` |
| Chat | `Comms/Chat` | split | qvue | Rooms and direct messages; the room view with threads, mentions, reactions, attachments, record cards and message actions; room settings | `ChatRoom` | own | app | new | `ChatRoom roomId` |
| Calls | `Comms/Calls` | list | xml | Call history, call links and upcoming meetings with Join | `CallSession` | own | app | later | list find parameters |
| Call | `Comms/Calls/Call` | task | qvue | The lobby and the call view; guest join by link | `CallSession` | own | app; guests by link | later | `CallSession callSessionId` |
| Chatter | `Shared/Chatter` | panel | qvue | The timeline beside every record: messages and notes, scheduled activities, attachments, followers, changes; send email, log a note, schedule an activity from the record | `CommunicationEvent`, `WorkEffort` | Chatter & activities, crosscut §3.13, designed here | app | new | inherits the host record |
| RecordFiles | `Shared/RecordFiles` | panel | qvue | The Files component scoped to a record: list, upload, preview, share, link an existing file | `DbResource` and the record's `*Content` | Files on records, designed here | app | new | inherits the host record |
| Consent | `Comms/Consent` | list | xml | Contacts' consent and list subscriptions with history; per-contact edit; export | `PartyConsent` (new), `ContactListParty` | own; included by Marketing | marketing, admins | new | `Party rows` |
| Unsubscribe | `Comms/Unsubscribe` | task | xml | The public unsubscribe and preferences page from a list email, with one-click support | `ContactListParty` | own | anonymous by token | new | none |
| Settings | `Comms/Settings` | settings | xml | The settings index | — | own | app | new | none |
| MailAccounts | `Comms/Settings/MailAccounts` | settings | xml | Accounts with status and last sync; the add-account wizard; folders, sync window, members of a shared mailbox | `EmailAccount` (new) | own | app | new | `EmailAccount emailAccountId` |
| Identities | `Comms/Settings/Identities` | settings | xml | Identities and signatures per account, reply-to, defaults | `EmailIdentity` (new) | own | app | new | none |
| Rules | `Comms/Settings/Rules` | settings | xml | Server-side mail rules: ordered, conditions and actions, run on existing mail | `EmailRule` (new) | own | app | new | none |
| OutOfOffice | `Comms/Settings/OutOfOffice` | settings | xml | Automatic replies per account with a date range and internal and external texts | `EmailOutOfOffice` (new) | own | app | new | none |
| TextBlocks | `Comms/Settings/TextBlocks` | settings | xml | Personal and shared canned text with shortcuts | `EmailTextBlock` (new) | own | app | new | none |
| ChatSettings | `Comms/Settings/Chat` | settings | xml | Notification level defaults, sounds, Enter to send, previews, auto-away | `UserPreference` | own | app | new | none |
| CallSettings | `Comms/Settings/Calls` | settings | xml | Devices, ringtone, join defaults | `UserPreference` and browser storage | own | app | later | none |

Dropped from the research's candidate inventory, with the reason in §20: a separate Outbox
screen (a folder view of the Inbox), a separate Events area (the event record is `EventDetail`
under Calendar), a Comms-side Chatter screen (one component, `Shared/Chatter`), and time
entries, scheduled finds and expenses from My Account (they move to Projects, Insights and
People).

## 4. Header and drawer screens

### TodayPanel

- **Layout:** panel. A header line with the day ("Tuesday, Oct 20") and "3 approvals waiting"
  linking to the Notifications tab; captions **Overdue** (warning), **Due today**, **Later
  today**, then one caption per app source ("From Sales: 2 quotes to send"). The quick-add line
  sits under Due today. The gallery's `Gallery/Panel.xml` is the rendered reference.
- **Sections:** each item is a dense row: an icon by kind (task, call, email, to-do, meeting,
  event, approval), the title, the time or "overdue since Mon", the record it is on as a caption
  (`Order SO10023 · Acme Co.`), and two flat quick actions.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `TodayItems` | list | The items of the day, grouped | kind, title, due time, record, assignee when not me | `q-list dense` by `render-mode`; flat icon buttons per row | `mantle.work.WorkEffortServices.get#UserTodayItems` (new, §19) over `WorkEffortAndParty` and the `<today-source>` providers | SimpleScreens `MyAccount/User/Task/MyTasks` `MyTasks`; Odoo activity menu (overdue, today, planned by model); Nextcloud Tasks and Deck dashboard widgets |
| `QuickAdd` | single | Add a task due today in one line | name; due (default today); the context link chip | `focus-field` on name; Enter submits | `mantle.work.TaskServices.create#SimpleTask` with `assignToPartyId` me | Nextcloud Tasks inline create; Microsoft To Do "My Day" |

- **Actions:** Mark done (`mantle.work.TaskServices.update#Task` to `WeComplete`; for an event
  "Done" is hidden), Snooze to tomorrow 09:00 in the user's time zone (`update#Task`
  `estimatedCompletionDate`), Join (an event with a call link opens `Comms/Calls/Call`), Open (the
  record in the canvas). Approvals link to the Notifications tab. "Add activity on this record"
  appears when the screen context has a record and opens `QuickCreate?kind=activity`.
- **States:** "Nothing due today" with the quick-add line; an app source that fails is logged
  and shown as "Sales items unavailable", the rest renders (failure tolerance).
- **Devices:** phone.
- **Source:** research §4, §5 (Odoo activity menu), initial-design "Today"; replaces the four
  counts of `ssstatic/lib/MyAccountNav.qvue`.
- **Needs:** Inner drawer frame, Shell providers (`today-source`), `get#UserTodayItems`,
  `get#ShellCounts` and the `shellCounts` topic, Screen context.

### ChatPanel

- **Layout:** panel as `.qvue`; one pane with two modes, as Signal Desktop's left pane: the room
  list, and a room opened in place with a back arrow and "Open in Comms". The room view is the
  same component as `Comms/Chat` (§13) at 400 px: timeline, composer, no right sidebar.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `RoomList` | list | Rooms and direct messages, unread and mentions first | avatar with presence, name, last message snippet, time, unread badge | `q-virtual-scroll` | `org.moqui.impl.ChatServices.find#Rooms` (new) | Nextcloud Talk LeftSidebar; Odoo messaging menu; Slack sidebar |
| `RoomView` | — | The room component of §13 | | | as §13 | |
| `NewMessage` | single | Start a direct message or find a room | people or room picker with server search | `drop-down` `server-search` over `search#Party` and rooms | `ChatServices.create#Room` (new, direct type) | Talk NewConversationDialog |

- **Actions:** open room, new message, start call (opens `Comms/Calls/Call` for the room, later),
  mark all read.
- **Devices:** phone.
- **Source:** research §6 (Talk, Signal, Odoo Discuss chat hub); style-guide §2.4.
- **Needs:** Chat store and services, Presence and status, Inner drawer frame.

### NotificationsPanel

- **Layout:** panel. Filter chips (reason: mention, assignment, approval, date alert, reminder,
  comment, system; app) above three captions: **Approvals waiting**, **Unread**, **Earlier**
  (the last seven days read). "Mark all read" and "Notification settings" at the top right.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `NotificationList` | list | Unread first, then recent | title, actor, record, app, reason, time | `q-list dense`; unread dot; the reason as an icon | `moqui.security.user.NotificationMessageUser` for the user (`entity`); mark viewed sets `viewedDate` | SimpleScreens `MyAccount/User/Notifications` `NotificationList`; OpenProject notification center; Odoo messaging menu |
| `Approvals` | list | Everything waiting on me, with the two decisions inline | what, who asked, amount or summary, waiting since | Approve and Refuse as flat buttons with `confirmation` on Refuse | the topic's `approveServiceName` / `refuseServiceName` (new fields on `NotificationTopic`, §19) with the message's record fields | Ever Gauzy approval requests; OpenProject reasons |

- **Actions:** open (marks viewed), mark read, approve, refuse (asks for a reason when the
  topic requires it), "Open in Commons" to `Commons/Notifications`.
- **States:** "You are caught up" when nothing is unread; a notification whose record is gone
  opens the list screen with a notification (style-guide §6).
- **Devices:** phone.
- **Source:** research §5 (OpenProject center, Odoo systray, Ever Gauzy approvals); initial-design
  rule "mentions, assignments, approvals waiting".
- **Needs:** `NotificationMessage` reason, record and actor fields; `NotificationTopic` approve
  and refuse services; Shell providers (`notification-topic`); the `notifications` WebSocket topic
  the framework already sends.

### QuickCreate

- **Layout:** dialog (maximized on a phone) with one form chosen by `kind`; the context link
  shown as a chip above the fields ("Linked to Order SO10023 · remove"); six or fewer fields;
  a "More options" text link opens the full record screen with the values carried over.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `QuickTask` | dialog | A task for me or someone | name, due date, assignee (default me), priority, link chip | `focus-field` name | `mantle.work.TaskServices.create#SimpleTask`; the link through the record's join or `WorkEffortRecord` | `MyTasks` `NewTaskForm`; Nextcloud TaskCreateDialog |
| `QuickActivity` | dialog | A scheduled next action on the record in context (Chatter's activity) | type (call, email, to-do, meeting), summary, due, assignee | type as a `q-btn-toggle` by `render-mode` | `create#SimpleTask` with `purposeEnumId` `WepPhoneCall`, `WepEmail`, `WepToDo` or `WepMeeting` | Odoo schedule activity |
| `QuickEvent` | dialog | An event | name, start, end or duration, all day, calendar, attendees, room, link chip | `date-time` pair; attendees `drop-down` `allow-multiple` `server-search` | `mantle.work.EventServices.create#Event`; `mantle.work.WorkEffortServices.add#WorkEffortParty` | `MyCalendar` `NewEventForm`; Nextcloud NewEventDialog; Zimbra ApptQuickAdd |
| `QuickNote` | dialog | With a record in context, a note on its Chatter; without one, a personal note | title, text (markdown) | `text-area editor-type="md"` | with a record: `mantle.party.CommunicationServices.create#Message` with `communicationEventTypeId` `Comment` and the record link; without: `org.moqui.impl.WikiServices.update#WikiPage` in the user's notes space | Odoo "Log note"; Google Keep quick capture |
| `QuickContact` | dialog | A person or an organization | type, name, email, phone, organization (default from context), address book | type toggle; organization `server-search` | `mantle.party.PartyServices.create#Person` or `create#Organization`; `mantle.party.ContactServices.create#EmailAddress`, `create#TelecomNumber`; `PartyRelationship` `PrtContact` to the organization; `ContactBookParty` (new) | `FindParty` `CreatePersonForm`, `CreateOrganizationForm`, `CreateContactForm`; Zimbra ContactQuickAddDialog |
| `QuickRequest` | dialog | A request | name, type (`RqtSupport`, `RqtInformation`, `RqtPurchase`, …), priority, customer from context, description | | `mantle.request.RequestServices.create#Request`; the link through `RequestWorkEffort` or the generic link | `MyRequests` `NewRequestForm` |

- **Actions:** Create (one primary) and Cancel; after Create a notification with "Open" links to
  the record; the dialog closes and the host screen's Chatter reloads.
- **Source:** research §3 (Zimbra op registry, Nextcloud create-from-context); style-guide §2.4.
- **Needs:** Shell providers (`quick-create`), Screen context, the generic record links.

### Notifications

- **Layout:** list; OpenProject's notification center shape: a left chip rail of reasons and
  apps with counts, the list, and a reading pane opening the record beside it from 1440 px.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `NotificationFind` | find | Narrow the list | reason, app, read state, date period, text | `date-period` | | OpenProject by-reason and by-project filters |
| `Approvals` | list | The approvals inbox, always first | what, requester, amount or summary, waiting since, policy | Approve and Refuse inline; bulk approve with `multi` | topic approve and refuse services | Ever Gauzy approvals; People, Purchasing, Sales and Accounting keep their own lists |
| `Notifications` | list | Everything else | title, actor, record, app, reason, received, viewed | unread rows `text-weight-medium`; bulk mark read | `entity` on `NotificationMessageUser` | `Notifications` `NotificationList` |

- **Actions:** open, mark read, mark all read, approve, refuse, "Notification settings".
- **Source:** research §5 and §18 open question (one center that also serves as the approvals
  inbox); baseline `Notifications.xml`.
- **Needs:** as NotificationsPanel.

### LiveCall

- **Layout:** panel as `.qvue` in the framework's `q-page-sticky` slot, 320 × 180, draggable;
  the active speaker or shared screen, call time, mute, camera, leave; a click returns to
  `Comms/Calls/Call`. Rendered only while a `CallSession` of the user is live.
- **Source:** research §7 (Talk FloatingCallOverlay, Signal CallingPip); Teams and Meet
  picture-in-picture.
- **Needs:** WebRTC, Call store.

## 5. Commons Home

### Home

- **Layout:** landing. A greeting line, the Today strip (the same `TodayItems` data as the
  panel, horizontal on desktop), a row of five counters, two columns of lists, a shortcuts and
  recents column. A first-run card ("Set up: add a mail account · import contacts · connect a
  calendar · install on your phone") shows until each item is done or dismissed, which is what a
  small business or a household sees first.
- **Sections and tabs:**
  - Counters: Due today, Overdue, Events today, Unread notifications, Requests assigned; each a
    `number-card` linking to the filtered list.
  - My work: Tasks this week (`Commons/Tasks` smart list), Requests assigned, Upcoming events
    (7 days, with Join).
  - Recents: Recent pages (five), Recent files (five, with preview on hover), Shared with me
    (7 days).
  - Shortcuts: New task, New event, New note, New contact, Upload a file, Compose email.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `TodayStrip` | list | Today's items in a row | as `TodayItems` | `skip-header`, `paginate="false"` | `get#UserTodayItems` | §4 TodayPanel |
| `TasksThisWeek` | list | Open tasks due within 7 days | name, due, priority, record | `skip-header` | `WorkEffortAndParty` (`entity`) | `MyTasks` `MyTasks` |
| `RequestsAssigned` | list | Open requests where I am assigned | id, name, status chip, priority, customer | | `Request` with `RequestParty` (`entity`) | `MyRequests` `ListRequests` |
| `UpcomingEvents` | list | Events of the next 7 days | when, name, where, Join | | `mantle.work.EventServices.get#FullCalendarData` with `partyId` me | `MyCalendar` |
| `RecentPages`, `RecentFiles`, `SharedWithMe` | list | Recents | name, space or folder, modified, by | | `WikiPage` with `WikiPageHistory` (`entity`); `org.moqui.impl.FileServices.find#Recent` (new) | Nextcloud dashboard widgets; Google Drive Recent |
| `SetupCard` | single | First-run checklist | the four setup items with Done or Dismiss | | `UserPreference` `COMMONS_SETUP` (`org.moqui.impl.UserServices.set#Preference`) | Nextcloud first-run; Outlook setup |

- **Source:** research §4 (Nextcloud dashboard, OpenProject and Redmine My page); style-guide §3.1.
- **Needs:** `number-card`, `get#UserTodayItems`, File services.

## 6. Contacts

The Commons contact area is the address-book shape of Google Contacts and Nextcloud Contacts over
the Mantle party model: every contact is a `Party` (`Person` or `Organization`); the
**Directory** is the parties that hold a business role (customer, supplier, employee, contact,
account) and is what every other app shows; an **address book** (`ContactBook`, new, §19) is a
named collection a user owns or an organization shares, whose members are parties, with
**groups** (labels) inside it; a **personal contact** is a party that belongs only to a
personal book and holds no role, hidden from the directory and from the duplicate scan unless
its owner links it to a directory party. Each book maps to a CardDAV address book (§11 Sync).

### Contacts

- **Layout:** split (`container-split`, side 320 px; stacked below 1024 px). Side: a search line
  (name, email, phone, organization), a scope selector (Directory · My contacts · each address
  book · Recently contacted · Not in a group), group chips, an alphabet jump, the rows. Main:
  `ContactDetail`. The URL holds `partyId`; the side list keeps its scroll and selection.
- **Sections and tabs:** the side list only; the main pane is the reused record.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `ContactFind` | find | Narrow the side list | text, scope (directory, book), group, role, has email, has phone, organization | scope as a `drop-down` with the user's books | | `FindParty` `OuterSearchForm`; Nextcloud RootNavigation groups |
| `ContactList` | list | The rows | avatar, name, organization and title, primary email, primary phone, presence for users | `q-virtual-scroll` rows by `render-mode`; `row-selection` with bulk actions | `mantle.party.PartyServices.find#Party` (directory), `ContactBookParty` join (books), `search#Party` for the text | `FindParty` `PartyListForm`; Nextcloud ContactsList; Zimbra ContactSplitView; Google Contacts |
| `BatchActions` | list, bulk | Act on selected contacts | add to group, add to book, remove from book, export vCard, export CSV, merge (exactly two), delete (contact admins) | | `mantle.party.ContactBookServices.add#ContactBookParties` (new); `mantle.party.ContactImportServices.export#Contacts` (new); `mantle.party.DuplicateServices.merge#Parties` | Nextcloud Batch and Merging; Google Contacts labels and merge |

- **Actions:** New contact (opens `QuickCreate?kind=contact`, then the record), Import, Find
  duplicates; row: open, email (Compose with the primary email), call (Call), chat (direct
  room), star (favorite group).
- **Navigation:** from the launcher, the palette's People group, Chatter author links, the
  Compose contact hover card ("Open contact"), the 360s' Contacts tab (which opens the same
  record under their own app path).
- **Views:** list; org chart (`later`, a `.qvue` over `PartyRelationship` `PrtManager` and
  `PrtOrgRollup`).
- **States:** "No contacts yet · Import or add one" on an empty personal book; a directory
  party the user may not view is absent, not greyed.
- **Devices:** phone (stacked; a row opens the record full screen with a back button).
- **Source:** research §10 (Nextcloud Contacts, Zimbra address book), §17 Party screens,
  §18 "Contacts are admin-shaped"; Google Contacts and Outlook People.
- **Needs:** `container-split`, Contact books, Presence.

### ContactDetail (Context passed)

The Contact / party record is designed in `design-crosscut.md` §3.1; Commons' row of its
per-app table:

| App | Tabs or panes shown | Filters fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Commons | Overview (names, contact info with purposes `EmailPrimary`, `PhoneMobile`, …, addresses, organization and title, relationships, books and groups, notes), Activity (Chatter), Calendar (shared events with this party), Tasks, Requests, Files, Consent (read, with "Edit in Comms Consent") | none; a personal contact shows a "Private · in <book>" banner | edit in place, email, call, chat, new event, new task, add to group or book, star, merge with…, export vCard, print, "Link to a directory party" for a personal contact, delete (owner of a personal contact; contact admins for the directory) | contact info, relationships, communication history |

Services the Commons version calls beyond the crosscut's: `mantle.party.ContactServices.get#PartyContactInfo`,
`store#PartyContactInfo`, `store#PartyContactMech`, `delete#PartyContactMech`,
`mantle.party.PartyServices.update#PartyDetail`, `create#PartyContent` (the avatar, `PcntFaceImage`),
`mantle.party.ContactBookServices.*` (new). Baseline forms covered: `EditParty` `EditPersonForm`,
`EditOrganizationForm`, `PostalPurposeForm`, `PhonePurposeForm`, `EmailPurposeForm`, `WebPurposeForm`,
`OtherCreateForm`, `OtherUpdateForm`, `NewNoteForm`, `UpdateNoteForm`, `NewContentForm`, `UpdateContentForm`,
`PartyRelated` `NewToRelForm`, `NewFromRelForm`, `ToRelationshipForm`, `FromRelationshipForm`,
`Party/UpdateContactInfo` `UpdateContactInfo`; `ExpiredPostal` and `ExpiredContactOther` become
an "Expired" toggle on the contact info box.

### ContactImport

- **Layout:** wizard (`subscreens-panel type="wizard"`; until it exists, boxes with Next): Source
  → Mapping → Options → Preview → Import.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `ImportSource` | wizard step | Choose the file and its kind | file (vCard `.vcf`, CSV; presets for Google Contacts and Outlook CSV), character set | `file` | `mantle.party.ContactImportServices.parse#ContactFile` (new): returns columns and sample rows | Nextcloud SettingsImportContacts; Zimbra import page; Google Contacts import |
| `ImportMapping` | wizard step | Map columns to fields | one row per column: target field (name parts, organization, title, email with purpose, phone with purpose, address parts, birthday, notes, group) | editable rows; "auto-map" by header name | | new (the reference apps map vCard only) |
| `ImportOptions` | wizard step | Where and how | target book, groups to add, duplicate policy (skip, update, create), as personal or directory contacts | | | |
| `ImportPreview` | list | What will happen | row, action (create, update, skip as duplicate of …), problems | | `parse#ContactFile` with the mapping; `mantle.party.DuplicateServices.find#PartyDuplicates` per row | |
| `ImportResult` | wizard step | Progress and outcome | created, updated, skipped, failed with reasons; download the failures as CSV | `q-linear-progress` by `render-mode` | `mantle.party.ContactImportServices.import#Contacts` (new), run as a job for large files | |

- **Source:** research §10 and §18 (no CSV import in the references); Google and Outlook CSV
  formats as the common case.
- **Needs:** Wizard panel, Contact import and export services, Contact books.

### Duplicates

- **Layout:** list; pairs grouped by the matching reason (same email, same phone, similar name
  and address); a Compare dialog with both records side by side and a field-level choice.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `DuplicateFind` | find | Scope | book or directory, reason, minimum score | | `mantle.party.DuplicateServices.check#AllPartyDuplicates` (run), `find#PartyDuplicates` | `FindDuplicates` `DupPartyList` |
| `DuplicatePairs` | list | The candidates | the two parties, reason, score | Compare and merge; Not a duplicate | `mantle.party.DuplicateServices.merge#Parties`; `find#PartyHasDuplicates` | same; Google Contacts "Merge & fix"; Nextcloud Merging |

- **Source:** research §17 services; baseline `FindDuplicates`.

## 7. Calendar and schedules

Events are `WorkEffort` rows of type `WetEvent`; attendees are `WorkEffortParty` (status
`WeptOffered` is an invitation, `WeptAssigned` accepted, `WeptDeclined` declined, and the new
`WeptTentative`), rooms are `WorkEffortFacility` (a `Facility` of type `FcTpRoom` or another
bookable type), equipment is `WorkEffortAssetAssign` (an `Asset`, `AstTpEquipment`), whose
status flow `WeaaRequested` → `WeaaAssigned` / `WeaaRequestDenied` is the booking approval. A
**calendar** is the new `Calendar` collection (§19) that owns events through
`CalendarWorkEffort`; a user's default calendar is created on first use; shared calendars are
`CalendarShare` rows; external feeds are `CalendarSubscription`. Recurrence is an RFC 5545
RRULE on `WorkEffortRecurrence` with exceptions as instance `WorkEffort`s linked by
`WorkEffortAssoc` `WeatRecurrenceInstance`; reminders are `WorkEffortReminder` delivered as
notifications on the topic `WorkEffortReminder`. Working hours are recurring `WorkEffort`s of
the existing type `WetAvailable`.

### Calendar

- **Layout:** calendar archetype as `.qvue` until `view-calendar` exists. A left rail (mini
  month, My calendars with color toggles, Shared with me, Subscriptions, "Rooms and equipment"
  link, Tasks toggle), the grid, and a header (Today, previous and next, the range title, the
  view switch, a search line, "Find a time"). A click on an empty slot or a drag opens the quick
  popover; "More options" opens `EventDetail`. Drag moves an event, the edge resizes it; both
  confirm when attendees exist ("Notify attendees?"). A click on an event opens a popover with
  the details and the RSVP buttons. The keys follow Google Calendar: `t` today, `d` `w` `m` `a`
  views, `n` `p`, `c` create, `/` search.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `CalendarFilters` | find | What the grid shows | calendars, show declined, show tasks, time zone | color toggles in the rail | `mantle.work.EventServices.get#FullCalendarData` extended with `calendarIdList` and RRULE expansion (§19); `mantle.work.TaskServices.get#FullCalendarData` for tasks | `MyCalendar`; Nextcloud CalendarList |
| `EventQuick` | dialog | Create in the popover | name, date and time or all day, calendar, room, attendees, repeat (preset), reminder (preset), context link chip | `date-time` pair; attendees `server-search` | `mantle.work.EventServices.create#Event`; `mantle.work.WorkEffortServices.add#WorkEffortParty`; `WorkEffortFacility` `entity` | `MyCalendar` `NewEventForm`; Nextcloud EditSimple; Google Calendar quick add |
| `EventPopover` | single, read | The summary of an event with RSVP | when, where, organizer, attendees and their answers, join link | Accept, Tentative, Decline | `mantle.work.EventServices.respond#EventInvitation` (new) | Nextcloud and Google event popovers |
| `FindTime` | dialog | A free slot for a set of people and a room | attendees, room, duration, range, working hours only | a free/busy grid by `render-mode` with suggested slots | `mantle.work.EventServices.get#FreeBusy` (new) over `WorkEffortAndParty`, `WetAvailable` hours and resource bookings | Nextcloud FreeBusy; Zimbra schedule assistant; Google "Find a time"; Outlook scheduling assistant |

- **Actions:** New event, Find a time, print the range (`html-print`), export the calendar
  (ICS), subscribe (URL), share (opens Settings/Calendars).
- **Views:** day, work week, week, month, agenda (list); the same component in resource mode is
  `Schedules`; year `later`.
- **States:** no calendar yet creates the default one; an unreachable subscription shows its
  last fetch and a warning chip in the rail.
- **Devices:** phone (day and agenda views; a tap creates with the quick form maximized).
- **Source:** research §9 (Nextcloud Calendar, Zimbra calendar, Frappe suite calendar), §17
  `MyCalendar` and `get#FullCalendarData`; Google Calendar and Outlook as the familiar shape.
- **Needs:** List views (`view-calendar`, later), Calendar collections, Recurrence, Reminders,
  `get#FreeBusy`, `respond#EventInvitation`, iCalendar tool, CalDAV server.

### EventDetail

- **Layout:** detail. Title row: name, the calendar's color chip, a status chip (`WeInPlanning`
  planned, `WeApproved` confirmed, `WeCancelled`), the organizer's primary action **Save** or
  **Send invitations** when attendees changed, an attendee's primary action is the RSVP; secondary
  menu: Duplicate, Add a call link, Export ICS, Print, Cancel event. Boxes on one page (three
  rows), Chatter as the right column.
- **Sections and tabs:**
  - When: start, end, all day, time zone, repeat (RRULE editor), reminders.
  - Where: location text, room (with availability), video call (a Comms call link), equipment.
  - People: attendees with role, RSVP answer, must respond, availability; Find a time.
  - Details: description (markdown), visibility (`WevAllUsers`, `WevWorkGroup`, `WevRestricted`),
    calendar, attachments (`record-files`), linked records.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `EventHeader` | single | The event | name, start, end, all day, time zone, calendar, visibility, location, description | `date-time`; `text-area editor-type="md"` | `WorkEffort` `entity` update (no `update#Event` exists; `create#Event` for a new one) | `EventDetail` `UpdateEvent`; Nextcloud EditFull |
| `Recurrence` | single | The rule | frequency, interval, by weekday or month day, ends never, after n or on a date; "this event only / this and following / all" on edit | an RRULE editor by `render-mode` | `WorkEffortRecurrence` (new) | Nextcloud Repeat; Google Calendar custom recurrence |
| `Reminders` | list, editable rows | When to remind | offset (minutes, hours, days before), method (notification, email) | | `WorkEffortReminder` (new) | Nextcloud Alarm; Zimbra reminders |
| `Attendees` | list, editable rows | Who | party or external email, role (`Assignee`, optional), RSVP status, must respond, availability | party `server-search`; an external email creates a contact in the organizer's book | `mantle.work.WorkEffortServices.add#WorkEffortParty`, `remove#WorkEffortParty`, `replace#WorkEffortParty`; `mantle.work.EventServices.send#EventInvitations` (new): notifications to users, iMIP mail to external addresses | `EventDetail` `AddPartyAssignForm`, `UpdateAssignForm`; Nextcloud Invitees |
| `Rooms` | list, editable rows | Where it happens | facility (bookable), status | availability beside the picker | `WorkEffortFacility` `entity` with the new `statusId`; `mantle.work.EventServices.book#Resource` (new) applies the policy | Nextcloud Resources; Outlook room finder |
| `Equipment` | list, editable rows | What it needs | asset, status (`WeaaRequested`, `WeaaAssigned`, `WeaaRequestDenied`), comments | | `WorkEffortAssetAssign` `entity`; `book#Resource` | `EventDetail` `AddEquipment`, `EquipmentList` |
| `LinkedRecords` | list | Where this event belongs | request, task, order, party | add by `lookup#ById` | `mantle.request.RequestWorkEffort`, `WorkEffortAssoc`, `WorkEffortRecord` (new) | |

- **Actions:** Save; Send invitations (confirms; sends to new or changed attendees only);
  RSVP accept, tentative, decline with a message; Duplicate (`mantle.work.WorkEffortServices.clone#WorkEffort`);
  Delete this / this and following / all for a recurring event (confirms, notifies attendees);
  Add a call link (creates a `CallLink` for the event's room, §14); Export ICS; Print.
- **Navigation:** from the Calendar, the Today panel, a notification, Chatter ("meeting
  scheduled"), the Marketing event screens (which include this screen).
- **States:** an attendee without edit rights sees the layout read-only with the RSVP buttons;
  a declined room shows "Request denied" with the policy's reason.
- **Source:** research §9; baseline `EventDetail` (`UpdateEvent`, `NewNoteForm`, `UpdateNoteForm`
  → Chatter, `AddPartyAssignForm`, `UpdateAssignForm`, `AddEquipment`, `EquipmentList`).
- **Needs:** Recurrence, Reminders, `WeptTentative`, `WorkEffortFacility.statusId`,
  `send#EventInvitations`, `book#Resource`, iCalendar and iMIP, `record-files`, `chatter`.

**Per-app context (Events).**

| App | Tabs or panes shown | Filters fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Commons | all boxes, Chatter | none | all above | attendees, rooms, reminders |
| Marketing | all, plus Registration, Tickets, Communication schedule (design-marketing) | events of a campaign | publish, open registration | audience and sends |
| Projects | When, People, Details; plan links | events of a project | save | milestones and plan |
| People | When, People (read) | leave and shift events (`WetTimeOff`, shifts) | none | who is out |

### Schedules

- **Layout:** the Calendar component in resource mode: one row per resource (rooms by facility,
  equipment by type), columns by hour (day) or day (week), grouped by site; filters by facility
  type, capacity, equipment type and site; a booking shows its status color (requested warning,
  assigned primary, denied negative). A click on an empty cell opens the Booking dialog.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `ScheduleFilters` | find | Which resources and when | site, type (rooms, equipment), capacity at least, range | | `mantle.work.EventServices.get#FullCalendarData` with `facilityIdList` and `assetIdList` | SimpleScreens `Facility/FacilityCalendar`, `Asset/AssetCalendar` |
| `Booking` | dialog | Book a room or a machine | resource, start, end, purpose (becomes the event name), attendees, notes, context link | | `mantle.work.EventServices.create#Event` (takes `assetId`); `WorkEffortFacility` `entity`; `book#Resource` sets `WeaaRequested` or `WeaaAssigned` by policy | Nextcloud RoomAvailabilityModal; Outlook room booking |

- **Actions:** Book, open the event, cancel my booking; "Scheduling admin" links to Maintenance
  for users who have it.
- **Source:** research §9 and §16; initial-design "Facility and equipment schedules live in
  Commons, admin in Maintenance".
- **Needs:** `book#Resource`, `WorkEffortFacility.statusId`.

**Per-app context (Calendar & schedules).**

| App | Tabs or panes shown | Filters fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Commons | my, shared and subscribed calendars; resources | none | create, book, RSVP | my time and bookings |
| Maintenance | resources with policy, approval and blackout windows (design-maintenance) | facilities and equipment | approve, deny, block | availability rules |
| Projects | plan view by project calendar | a project's events and milestones | create | timeline |
| People | leave and shift view by team | `WetTimeOff` and shifts | read; request leave in People | who is out |

## 8. Tasks and requests

Commons shows the user's own slice of two reused records. The screens that create and manage
them in bulk are Projects' (work items, boards, plans) and Customer Service's (cases, queues).

### Tasks

- **Layout:** list. Smart lists as a chip row above the table (Today, Next 7 days, Overdue,
  Assigned to me, Created by me, Watching, Done), as Nextcloud Tasks collections and Microsoft
  To Do's My Day and Planned; a quick-add row at the top of the table; the done checkbox in the
  first column; inline edit of due date and priority.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `TaskFind` | find | Beyond the smart lists | text, status, purpose, due period, project (root work effort), linked record | `date-period` | | SimpleScreens `Task/FindTask` `SearchOptions` |
| `Tasks` | list, editable rows | My tasks | done (status), name, due, priority, project, linked record, assignees, estimated and remaining time | `editable` on due and priority; status chip | `WorkEffortAndParty` (`entity`); `mantle.work.TaskServices.update#Task` | `MyTasks` `MyTasks`; `FindTask` `ListTasks` |
| `NewTask` | list, first row | Quick add | name, due | `first-row-field`; Enter adds and stays | `mantle.work.TaskServices.create#SimpleTask` | `MyTasks` `NewTaskForm`; `FindTask` `NewTaskForm` |
| `BulkActions` | list, bulk | On selected rows | complete, reassign, set due, set priority, move to project | | `update#Task`; `mantle.work.WorkEffortServices.replace#WorkEffortParty` | `FindTask` `AssignTaskSelected`, `UnAssignTaskSelected`, `UpdateTaskSelected` |

- **Actions:** New task (quick add or `QuickCreate`), bulk actions; row: open, complete, add
  to today.
- **Views:** list; board by status (`WeInPlanning`, `WeInProgress`, `WeOnHold`, `WeComplete`)
  through `view-board`; calendar by due date through `view-calendar`; until those exist the
  board and calendar switches open the Projects board and the Commons Calendar with the tasks
  toggle on.
- **Devices:** phone (the table scrolls; the quick-add row stays).
- **Source:** research §11 (Nextcloud Tasks, Deck, Zimbra tasks), §17 `MyTasks`; Microsoft To Do
  and Google Tasks.
- **Needs:** List views, Screen context.

### TaskDetail (Context passed)

| App | Tabs or panes shown | Filters fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Commons | Overview (name, status bar, due, priority, assignees, description, linked records), Sub-tasks, Time (my entries, clock in), Files, Chatter | tasks I am assigned to, created or watch | complete, reassign, set due, clone, convert to request, add to today, delete own | due and assignees; the project planning fields of Projects (estimates, milestone, billing) are hidden |

Services: `mantle.work.TaskServices.update#Task`, `add#TaskComment` (a Chatter comment),
`add#TaskTime`, `mantle.work.TimeServices.create#TimeEntryClockIn`, `mantle.work.WorkEffortServices.clone#WorkEffort`,
`create#WorkEffortContent` and `save#WorkEffortContentFile` through RecordFiles. Baseline forms
covered: `TaskDetail` `UpdateEvent`, `TimeEntries` `TimeEntryList` (the Time tab), `Task/TaskSummary`
`ClockInForm`, `AddCommentForm`, `NewChildTaskForm`, `NewContentForm`, `UpdateContentForm`,
`TaskCommentReply` and `TaskCommentUpdate` `ReplyCommentForm` (Chatter).

### Requests

- **Layout:** list; chips Raised by me, Assigned to me, Watching, Closed.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `RequestFind` | find | Narrow | text, type, status, priority, date period | | | `MyRequests`; `Request/FindRequest` |
| `Requests` | list | My requests | id, name, type, status chip (`ReqSubmitted`, `ReqReviewed`, `ReqInProgress`, `ReqCompleted`, `ReqCancelled`), priority, customer, assigned, updated | | `Request` with `RequestParty` (`entity`) | `MyRequests` `ListRequests`; `FindRequest` `ListRequests` |
| `NewRequest` | dialog | Raise one | as `QuickRequest` | | `mantle.request.RequestServices.create#Request` | `MyRequests` `NewRequestForm` |

- **Source:** research §17 `MyRequests`; initial-design "Requests assigned".

### RequestDetail (Context passed)

| App | Tabs or panes shown | Filters fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Commons | Overview, Conversation (Chatter: comments post through `add#RequestComment`, which writes a `Comment` communication event joined by `RequestCommEvent`), Tasks, Files | requests I raised, am assigned to or watch | comment, submit a draft, cancel my own, reassign when I am the assignee, attach | status and the conversation; no queue, SLA or category widgets (Customer Service) |

Services: `mantle.request.RequestServices.update#Request`, `add#RequestComment`, `update#RequestComment`,
`delete#RequestComment`, `replace#RequestParty`, `create#RequestContent`, `save#RequestContentFile`.
Baseline forms covered: `MyAccount` `EditRequest` `EditRequest`, `UpdatePartyForm`,
`RequestCommentReply` and `RequestCommentUpdate` `ReplyCommentForm`; `Request/EditRequest`
`AddCommentForm`, `NewNoteForm`, `NewContentForm`, `RequestTaskList`.

## 9. Files

Files is Google Drive and Nextcloud Files over the framework's database-backed resource tree:
every file and folder is a `moqui.resource.DbResource` with its bytes in `DbResourceFile` and
its versions in `DbResourceFileHistory`, so a Postgres backup holds everything. The tree gains
the metadata a drive needs (owner, size, trash, favorites, tags, shares, public links; §19). A
deployment that wants files on disk or in object storage points the root at another resource
location; the screens do not change. Record attachments are the same tree: a record's files live
under `Records/<entity>/<id>/` and the record's `*Content` row (`PartyContent`,
`WorkEffortContent`, `RequestContent`, `OrderContent`, …) points at them, so the browser's
**Records** section is a view over those folders and the `record-files` element is the same
component scoped to one of them. WebDAV serves the tree to desktop clients; the virtual SFTP
server serves it to scripts (§11 Sync, §19).

### Files

- **Layout:** split as `.qvue` (the browser needs drag and drop, a virtual grid and a preview
  overlay). Left rail: All files, Recent, Favorites, Shared with me, Shared by me, Records (a
  tree by entity: Orders, Parties, Requests, Tasks, …), Tags, Trash, and the quota bar. Main: a
  breadcrumb bar with **Upload** and **New** (folder, text or markdown note, document through the
  Office app later), a grid or list toggle, sort, and filter chips (type, modified, tag, owner);
  the rows; a detail sidebar on the right with tabs Details, Sharing, Versions, Activity. A
  file click opens the preview overlay (image, PDF, video and audio, text and markdown, `.eml`,
  office through WOPI later) with previous and next. The keys: arrows move, Enter opens, Space
  previews, Delete trashes, Ctrl+A selects all, F2 renames, `/` searches.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `FileFind` | find | Search and filters | text (name and extracted text), type, modified period, tag, owner, in this folder | | `org.moqui.impl.FileServices.find#Resources` (new) and the search index | Nextcloud in-folder search and filters; Google Drive filter chips |
| `FileList` | list | The folder | name with icon or thumbnail, size, modified, owner, shared chip, favorite star | `q-virtual-scroll`; drag rows to a folder; `row-selection` | `FileServices.list#Folder` (new) | Nextcloud FilesListVirtual; Frappe Drive ListView and GridView |
| `Upload` | single | Upload files or a folder | files (multiple), destination | `file` with drop zone; a progress tracker; conflict dialog (replace, keep both, skip) | `FileServices.upload#Resource` (new); `DbResourceFileHistory` keeps the replaced version | Nextcloud uploader and conflict dialog; Zimbra upload conflict |
| `NewFolder`, `Rename` | dialog | | name | | `FileServices.create#Folder`, `rename#Resource` (new) | Nextcloud NewNodeDialog |
| `Move` | dialog | Move or copy the selection | destination (folder tree) | `tree` | `FileServices.move#Resource`, `copy#Resource` (new) | Nextcloud move-copy; Frappe MoveDialog |
| `Share` | dialog | Share with people or by link | sharee (user, group, party, email), permission (view, edit, upload only), expiry, password, note; links: label, permission, expiry, password | sharee `server-search` | `FileServices.share#Resource`, `revoke#Share` (new) over `DbResourceShare` | Nextcloud SharingTab and SharingDetailsTab; Google Drive share dialog |
| `Details` | single, read | Metadata and tags | type, size, created, modified, owner, location, tags (editable) | | `entity`; `DbResourceTag` (new) | Nextcloud sidebar; Drive details pane |
| `Versions` | list | History | version, date, by, size; restore, download, label | | `DbResourceFileHistory` (`entity`); `FileServices.restore#Version` (new) | Nextcloud files_versions; Zimbra briefcase revisions |
| `Comments` | — | Chatter comments on the file | | the `chatter` element in comments-only mode | `mantle.party.CommunicationServices.create#Message` type `Comment` with `CommunicationEventRecord` | Nextcloud comments tab |
| `Activity` | list | What happened to the file | action, by, when | | `FileServices.get#Activity` (new) from the audit log and share rows | Nextcloud activity tab; Drive activity |
| `BulkActions` | list, bulk | On the selection | download as zip, move, copy, share, tag, favorite, delete | | as above; `FileServices.download#Zip` (new) | Nextcloud file list actions |

- **Actions:** Upload, New; row: preview, download, share, rename, move, favorite, versions,
  copy link, delete (to trash); Trash: restore, delete forever, empty trash (confirms).
- **Navigation:** from the launcher, the palette's Pages and files group, a record's Files tab
  ("Open in Files"), a share notification, a Chatter attachment, the Compose "attach from Files"
  picker (which is this screen's list in a dialog).
- **Views:** list and grid; Recent, Favorites, Shared with me and Trash are the same list with a
  fixed filter.
- **States:** an empty folder shows the drop zone and New; an over-quota upload fails with the
  quota named; a folder the user may not open is absent.
- **Devices:** phone (list only; upload from the camera roll; preview full screen).
- **Source:** research §12 (Nextcloud Files, Zimbra briefcase, Frappe drive), §17 `DbResource`,
  §18 "No Files app"; Google Drive and OneDrive.
- **Needs:** File metadata model, File services, Full-text and name index for files, WebDAV
  server, `chatter`, Search DataDocument for files.

### Shares

- **Layout:** list; tabs Outgoing, Links, Incoming.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `OutgoingShares` | list | What I shared with people | item, with whom, permission, expiry, shared on | bulk revoke | `DbResourceShare` (`entity`); `FileServices.revoke#Share` | Nextcloud shares views; Zimbra sharing page |
| `Links` | list | Public links | item, label, permission, expiry, password set, opened count, link | copy link, revoke | same | Nextcloud SharingLinkList |
| `IncomingShares` | list | Shared with me | item, from, permission, received; accept or decline when pending | | `FileServices.accept#Share`, `decline#Share` (new) | Nextcloud pending shares |

- **Source:** research §12.

### PublicShare

- **Layout:** split as `.qvue`, served to an anonymous visitor at `/s/<token>` (a webroot
  mount outside the apps root): the sharer's name and note, a password prompt when set, then a
  file (preview and download) or a folder (list, download all as zip) and, for an upload-only
  link, a file-drop form with the uploader's name. Expired or revoked shows a short page.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `SharePassword` | single | Unlock | password | | `FileServices.open#PublicShare` (new) | Nextcloud public share auth |
| `PublicList` | list | The shared folder | name, size, modified | read-only; no sidebar | `FileServices.list#PublicShare` (new) | Nextcloud publicShare view |
| `FileDrop` | single | Upload into the folder | files, your name | `file` multiple | `FileServices.upload#PublicShare` (new) | Nextcloud file drop with nickname |

- **Source:** research §12 (public share pages, file request); Google Drive and OneDrive link
  sharing.
- **Needs:** Public share route and token check (framework), File services.

### RecordFiles (`Shared/RecordFiles`)

- **Layout:** panel as `.qvue`, embedded by the `record-files` element through the
  `STRT_RECORD_FILES_SCREEN` theme value with `recordEntity` and `recordId` parameters: a drop
  zone, the file rows (name, size, by, when, type chip from the record's content type
  enumeration such as `PcntInternal`), preview on click, and the actions upload, link an
  existing file (the Files picker), share, download, remove. A box in a detail from 1440 px, a
  tab below.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `RecordFileList` | list | The record's files | name, type, description, by, when | preview; `row-selection` for download | the record's `*Content` join (`entity`) and the `Records/<entity>/<id>/` folder | `EditParty` `NewContentForm`, `UpdateContentForm`; `TaskSummary` `NewContentForm`; `EditRequest` `NewContentForm`; wiki `UploadAttachment` |
| `RecordUpload` | single | Add files | files, type, description | `file` with drop zone | the record's content service when one exists: `mantle.party.PartyServices.create#PartyContent` and `save#PartyContentFile`, `mantle.work.WorkEffortServices.create#WorkEffortContent` and `save#WorkEffortContentFile`, `mantle.request.RequestServices.create#RequestContent` and `save#RequestContentFile`, `mantle.party.CommunicationServices.create#CommunicationEventContent` and `save#CommunicationEventContentFile`, `mantle.party.AgreementServices.create#AgreementContent` and `save#AgreementContentFile`; otherwise `FileServices.upload#Resource` plus the join | same; Nextcloud Deck attachments; Odoo chatter attachments |

- **Source:** research §12 and §16 "Files on records"; crosscut §3 `*Content` joins.
- **Needs:** `record-files` element, File services, `STRT_RECORD_FILES_SCREEN`.

## 10. Notes and knowledge

The framework wiki (`WikiSpace`, `WikiPage`, `WikiPageHistory`, `WikiPageCategory`,
`WikiPageCategoryMember`, `WikiPageAlias`, `WikiPageUser`, `WikiSpaceUser`) is the store for
knowledge pages and personal notes alike. A **space** is a knowledge base, a team wiki, a
project's pages or a customer-facing help center (its `publicPageUrl` set); a user's **notes**
are the pages of a private space created on first use with `restrictView` and
`restrictUpdate` set. Pages are edited in the co-editing editor (Tiptap over Yjs with the `yrs`
sync server; initial-design) whose document is the decided CRDT-plus-snapshot store; the
rendered markdown snapshot is what `WikiPageHistory`, search, print and the published version
read. Until the editor lands, the page body is a `text-area editor-type="md"`, which is the
baseline's behavior with a preview.

### Knowledge

- **Layout:** editor as `.qvue`. A side pane (`container-split` side at 280 px): the space
  picker, a search line, the page tree with drag reorder and a New page button, Favorites and
  Recently edited; the main pane: a title row (title, path breadcrumb, status chip Draft,
  Published, In review, the presence avatars, the save state "Saved · Saving · Offline"), the
  editor or the rendered page, an outline on the right from 1440 px, and under the page
  Backlinks, Comments and Attachments. Actions on the title row: Edit or Done, Publish this
  version, Request review, History, and a menu (rename or move, clone, link to a record, export
  PDF or markdown, print, delete). The keys: `e` edit, Ctrl+S save a named version, `/` slash
  commands, Ctrl+K link.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `PageTree` | — | The space's pages | title, children | `tree` with drag; a page's `menu-include` is its `sequenceNum` | `org.moqui.impl.WikiServices.get#WikiSpacePages`, `get#WikiPageChildren`, `update#WikiPage` (parent and sequence) | SimpleScreens Wiki `wiki` tree; Nextcloud Collectives PageList; Frappe WikiTree |
| `PageHeader` | single | Title and placement | title, page path, parent, categories, visibility | | `org.moqui.impl.WikiServices.update#WikiPage`; `WikiPageCategoryMember` (`entity`) | `wiki` `AddPageForm`, `AddCategory`, `CategoriesForm`; `EditWikiPage` `EditPageForm` |
| `Editor` | — | The body | | `m-coedit` (§19); fallback `text-area editor-type="md"` | `update#WikiPage` writes the snapshot and a `WikiPageHistory` version on idle and on Save | Nextcloud Text; Frappe WikiEditor slash commands; Notion and Confluence editing |
| `History` | dialog | Versions and compare | version, date, by, note; compare two; restore; set published | a diff view by `render-mode` | `WikiPageHistory` (`entity`); `org.moqui.impl.WikiServices.set#PublishedVersion` | SimpleScreens `WikiCompare`; Redmine and OpenProject history and diff |
| `ReviewRequest` | dialog | Ask for review before publishing | reviewer, note, version | | `WikiPageReview` (new, §19) and a notification on topic `WikiPageReview` | Frappe Wiki contributions; Ever Gauzy Docs review |
| `Comments` | — | Chatter comments on the page | | the `chatter` element, comments only | `mantle.party.CommunicationServices.add#WikiPageComment` (`WikiPageCommunicationEvent`) | `wiki` `AddCommentForm`, `WikiCommentReply` `ReplyCommentForm`; Collectives comments |
| `Attachments` | — | Files on the page | | `record-files` | `org.moqui.impl.WikiServices.upload#WikiPageAttachment`, `get#WikiPageAttachment`, `delete#WikiPageAttachment` | `wiki` `UploadAttachment` |
| `LinkRecord` | dialog | Link the page to a request or task | record by id or search | `lookup#ById` | `mantle.request.WikiPageRequest`, `mantle.work.effort.WikiPageWorkEffort` (`entity`) | SimpleScreens `Request/EditWikiPages`, `Task/EditWikiPages`; OpenProject wikis tab |
| `Backlinks` | list, read | Pages that link here | page, space | | the snapshot's links indexed on save (`WikiPageAlias` for moved pages) | Collectives backlinks |

- **Actions:** New page, Edit, Save version, Publish (`set#PublishedVersion`), Request review,
  Clone (`clone#WikiPage`), Move, Delete (`delete#WikiPage`, confirms), Export PDF (`html-print`
  of the rendered snapshot) and markdown, Print.
- **Navigation:** from the launcher, the palette's Pages group, a case's Knowledge tab
  (Customer Service), a task or request's linked pages, a chat record card, a public help-center
  URL (`publicPageUrl`, anonymous read).
- **States:** a reader without update rights sees the rendered page with Edit absent; an
  offline editor keeps editing against IndexedDB and shows "Offline"; a page under review shows
  the chip and who holds it.
- **Devices:** phone (read; edit of short pages).
- **Source:** research §13 (Nextcloud Text and Collectives, Frappe Wiki, Gameplan, Ever Gauzy
  Docs, OpenProject and Redmine wiki, Moqui WorkManagement wiki), §17 Wiki app; initial-design
  "Native co-editing".
- **Needs:** Co-editing editor and `yrs` server, `container-split`, `WikiPageReview`, `chatter`,
  `record-files`, Print documents (page PDF).

**Per-app context (Knowledge base articles).**

| App | Tabs or panes shown | Filters fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Commons | all | none | all | authoring |
| Customer Service | search results and the rendered page in a case's Knowledge tab | the help-center spaces | link to case, suggest an edit (opens a review request), send to customer (Compose with the public URL) | finding and sending |

### Spaces

- **Layout:** list with a create dialog and a settings detail per space.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `Spaces` | list | The spaces I may see | id, description, pages count, visibility, public URL | | `org.moqui.impl.WikiServices.get#UserWikiSpaces` | `WikiSpaces` `WikiSpaceList` |
| `NewSpace` | dialog | Create or clone | id, description, from space (clone), restrict view and update | | `org.moqui.impl.WikiServices.create#WikiSpace`, `clone#WikiSpace` | `WikiSpaces` `NewSpace`; `EditWikiSpace` `CloneSpace` |
| `SpaceSettings` | single | A space | description, root page, public page URL, public attachment URL, allow any HTML, theme, restrict view and update | | `WikiSpace` (`entity`) | `EditWikiSpace` `EditSpace` |
| `SpaceMembers` | list, editable rows | Who may read and write | user or group, permission | | `WikiSpaceUser`, `WikiPageUser` (`entity`) | Collectives members; Confluence space permissions |

- **Source:** research §13 and §17.

### Review

- **Layout:** list; a row opens the page's History dialog on the compare of the requested
  version against the published one.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `ReviewQueue` | list | Pages waiting on me or on anyone | page, space, requested by, version, since, reviewer | Approve (publishes) and Request changes (a comment back) inline | `WikiPageReview` (new); `set#PublishedVersion`; `add#WikiPageComment` | Ever Gauzy Docs review queue; Frappe Wiki ContributionReview |

- **Source:** research §13.

### Notes

- **Layout:** the Knowledge editor over the user's notes space with a flat side list instead of
  a tree (sorted by modified, with a search line, tags from categories, and pinned notes
  first), a quick "New note" that starts typing at once, and "Move to a space" to promote a note
  to shared knowledge (it keeps its history). Notes never show the review and publish actions.
- **Forms:** `NoteList` (list: title, snippet, modified, tags, pinned), `Editor`, `Tags`
  (categories as chips), `MoveToSpace` (dialog: space, parent page; `update#WikiPage`).
- **Source:** research §13 (Nextcloud Notes, Gameplan My Pages); Google Keep and OneNote.
- **Needs:** as Knowledge; a notes `WikiSpace` per user created by a service on first use.

## 11. Commons settings and account

### Settings

- **Layout:** settings index: cards Account, Preferences, Notifications, Address books,
  Calendars, Sync; Comms settings are linked from a last card, Admin's settings index links here.

### Account

- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `Account` | single | Who I am | full name, user name, email, locale, time zone, avatar | avatar upload (`PartyContent` `PcntFaceImage`) | `org.moqui.impl.UserServices.update#UserAccount`; `mantle.party.PartyServices.create#PartyContent` | `MyAccount` `Account` `EditUser` |
| `ContactInfo` | single | My addresses and numbers | postal, phone, email with purposes | | `mantle.party.ContactServices.store#PartyContactInfo` | `MyAccount` `ContactInfo`, `UpdateContactInfo` `ShippingInfo` |
| `ChangePassword` | single | | old, new, repeat | | `org.moqui.impl.UserServices.update#Password` | `Account` `ChangePasswordForm` |
| `TwoFactor` | list | My second factors | type, description, enabled, last used | add dialogs per type; TOTP shows the QR | `get#UserAuthcFactorInfo`, `create#UserAuthcFactorTotp` and `setup#UserAuthcFactorTotp`, `create#UserAuthcFactorEmail`, `create#UserAuthcFactorSms`, `create#SingleUseAuthcFactor`, `invalidate#UserAuthcFactorEntry`, `send#AuthcCodeUserAccountEmail` | `Account` `UserAuthcFactorList`, `CreateUserAuthcFactorTotp`, `CreateUserAuthcFactorSingleUse`, `CreateUserAuthcFactorEmail`, `CreateUserAuthcFactorSms`, `SecondFactorSendForm` |
| `Sessions` | list | Where I am signed in | device, since, last seen; sign out | | `moqui.server.Visit` (`entity`) | Nextcloud and Google account security |

### Preferences

- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `Appearance` | single | Look | dark mode (`QUASAR_DARK`), left drawer (`QUASAR_LEFT_OPEN`), density, start app | | `org.moqui.impl.UserServices.set#Preference` | the account menu toggles today |
| `Keymap` | list, editable rows | Every binding | scope, action, keys, default; reset | a key capture field by `render-mode` | `set#Preference` `KEYMAP` (JSON) | Zimbra shortcuts page; Gmail keyboard settings |
| `MailDefaults` | single | How mail behaves | reading pane (right, bottom, off), conversation view, mark read after n seconds, archive opens next, undo send seconds, default account, signature placement, swipe actions on a phone | | `set#Preference` | Gmail and Outlook settings; Nextcloud Mail settings |
| `CalendarDefaults` | single | | week starts on, working hours (`WetAvailable`), default duration, default reminder, show week numbers, time zone for the grid | | `set#Preference`; `WorkEffort` `WetAvailable` rows | Nextcloud Calendar settings; Google Calendar |
| `Sounds` | single | | notification sound, chat sound, call ringtone | | `set#Preference` | Zimbra notifications page |

### NotificationSettings

- **Forms:** `NotificationTopics` (list, editable rows: topic, description, in app, email,
  daily digest; `NotificationTopicUser` `entity` with the new `digest` flag) — derived from
  `Notifications` `NotificationTopicList`, OpenProject notification settings. Topics are the
  union of the framework's and the `<notification-topic>` providers of the apps the user may
  open.

### ContactBooks

- **Forms:** `Books` (list: name, kind personal or shared, contacts, groups, shared with;
  `ContactBook` new), `NewBook` (dialog), `Groups` (list, editable rows per book), `BookShare`
  (dialog: user or group, permission), `CardDavInfo` (display: the book's CardDAV address for a
  device). Services: `mantle.party.ContactBookServices.*` (new). Derived from Nextcloud contacts
  settings, Zimbra address-book dialogs.

### Calendars

- **Forms:** `Calendars` (list: name, color, kind, owner, shared with, default; `Calendar` new),
  `NewCalendar` (dialog), `CalendarShare` (dialog: user, group or party; view or edit;
  publish link with optional password), `Subscriptions` (list, editable rows: name, URL, refresh
  interval, color, last fetched, status; `CalendarSubscription` new; Google and Microsoft 365
  through OAuth as a kind, `later`), `WorkingHours` (the `WetAvailable` editor shared with
  Preferences), `CalDavInfo` (display). Services: `mantle.work.CalendarServices.*` (new).
  Derived from Nextcloud EditCalendarModal and subscriptions, Zimbra calendar dialogs.

### Sync

- **Forms:** `Devices` (list: app password name, created, last used; revoke), `NewAppPassword`
  (dialog: name; shows the password once), `SetupGuides` (display: the CalDAV, CardDAV and WebDAV
  URLs and the steps for iOS, Android, macOS, Windows, Thunderbird). Services: app passwords
  (new, §19). Derived from Nextcloud security settings and the DAV setup pages.
- **Scope:** `later`, with the protocol servers.

## 12. Comms Home, Inbox and email

The Inbox is a full mail client, good enough to be someone's only one. Its model: a **mail
account** (`EmailAccount`, new, §19) is either an external mailbox the framework polls over
IMAP or POP (password or OAuth for Google and Microsoft 365), an **internal mailbox** at a
hosted domain delivered by the SMTP listener behind the edge gateway (initial-design), or a
**shared mailbox** with members (orders@, support@); the connection details stay on
`moqui.basic.email.EmailServer`. Messages are `moqui.basic.email.EmailMessage` rows (headers,
HTML and text bodies, `messageId`, threading by `rootEmailMessageId` and `parentEmailMessageId`),
extended with the account, folder, remote uid, flags, snooze and schedule fields; folders are
`EmailFolder`, labels `EmailLabel`, attachments `EmailMessageAttachment` stored as `DbResource`
files. Sending is `org.moqui.impl.EmailServices.send#EmailMessage` through the account's
server, direct or relayed. A message becomes a business record only when it is linked: the
receiver creates a `CommunicationEvent` (type `Email`, `emailMessageId` set) when a sender or
recipient matches a party with a known email, and the user links any message to a record from
the Inbox or Chatter, which is what the 360s and Chatter show. Internal messages
(`CommunicationEvent` type `Message` and `Comment` addressed to me) appear in the same client
as the **Internal** account, as initial-design asked, so one keyboard and one reading pane serve
both. Full-text search is a `DataDocument` over `EmailMessage` in the search index.

### Home

- **Layout:** landing.
- **Sections:** counters Unread (one chip per account), Flagged, Snoozed due today, Mentions,
  Missed calls, Outbox problems; lists Needs reply (threads where the last message is to me and
  unanswered for a day, Outlook's suggested replies without the AI), Follow-ups due
  (activities `WepEmail` and `WepPhoneCall`), Upcoming meetings with Join, Rooms with unread;
  shortcuts Compose, New room, Start a call, and Add a mail account until one exists.
- **Forms:** `UnreadByAccount` (number cards from `get#ShellCounts`), `NeedsReply` (list;
  `org.moqui.impl.MailboxServices.find#Messages` with the needs-reply filter), `FollowUps`
  (`WorkEffortAndParty`), `Meetings` (`get#FullCalendarData`), `RoomsUnread`
  (`ChatServices.find#Rooms`).
- **Source:** research §4 (Nextcloud Mail dashboard widgets, Talk home), §8 Frappe suite
  AllInboxes; Outlook's My Day pane.

### Inbox

- **Layout:** split as `.qvue` with three regions and a composer dock:
  - **Rail** (240 px, collapsible to icons): Compose; views Unified inbox, Flagged, Snoozed,
    Scheduled, Drafts, Sent, Archive, Spam, Trash, Outbox; then each account with its folders
    and unread counts, its labels, and the Internal account (Received, Sent, Comments on my
    records); saved searches; a quota line per account.
  - **List** (the thread list; messages mode by preference): dense rows with sender or
    recipients, subject, snippet, date, flags, labels, attachment icon and a snoozed-until or
    scheduled-for chip; hover quick actions archive, delete, read or unread, snooze; a checkbox
    column with shift-range selection and a select-all with "all N in this view"; grouped by
    date (Today, Yesterday, This week, …); a virtual list that pages as it scrolls.
  - **Reading pane** right, bottom or off (Zimbra's three layouts; the preference in
    Preferences, a toggle in the toolbar): the thread with older messages collapsed, "expand
    all", a per-message action bar (reply, reply all, forward, flag, snooze, move, label, mark
    unread from here, print, view source, block sender, unsubscribe, report spam, create task or
    request or event, link to a record), the sender's contact card on hover (the party when
    known, "Add to contacts" when not), remote images blocked until "show images" or the sender
    is trusted, an attachments strip (preview, download, save to Files, open in Office later),
    an iMIP card for invitations (Accept, Tentative, Decline, add to calendar), a linked-records
    strip ("On Order SO10023 · Case 1182"), and the Assist actions Summarize and Draft a reply
    (which open the outer drawer with the thread as context).
  - **Composer dock** (§Compose) at the bottom right; several drafts minimized side by side.
  - **Search:** one line with operators (`from:`, `to:`, `subject:`, `has:attachment`, `label:`,
    `in:`, `before:`, `after:`, `is:unread`, `is:flagged`, `larger:`) and an advanced popover with
    the same fields; results are a view with the query shown as chips; Save search makes a rail
    entry.
  - **Keyboard** (Gmail-compatible defaults, complete, editable): `j` `k` move, `o` or Enter
    open, `u` back, `e` archive, `#` delete, `r` `a` `f` reply, reply all, forward, `s` flag, `b`
    snooze, `l` label, `v` move, Shift+I and Shift+U read and unread, `x` select, `*` `a` and `*` `n`
    select all and none, Shift+J and Shift+K ranged select, `n` `p` next and previous message in
    the thread, `c` compose, `/` search, `z` undo, `g` `i` `g` `s` `g` `t` `g` `d` `g` `a` go to inbox,
    flagged, sent, drafts, all mail, `g` then typing jumps to any folder or label by name,
    Ctrl+Left and Ctrl+Right move focus between rail, list and pane, `]` and `[` archive and open
    next or previous, `Enter` on a selection opens the first, `?` the overlay. "Archive opens next"
    and "mark read after n seconds" are preferences.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `MailFind` | find | The search line and advanced popover | text with operators, account, folder, label, from, to, subject, has attachment, date period, unread, flagged, size | operator chips; `date-period` | `org.moqui.impl.MailboxServices.find#Messages` (new) over `EmailMessage` and the search index | Nextcloud Mail SearchMessages; Zimbra search toolbar and saved searches; Gmail operators |
| `ThreadList` | list | The rows of the view | participants, subject, snippet, date, flags, labels, attachment, snooze or schedule chip, unread | `q-virtual-scroll`; hover actions; `row-selection` with range | `find#Messages` grouped by `rootEmailMessageId` | Nextcloud EnvelopeList; Zimbra ConvListView; Gmail and Outlook lists |
| `ThreadView` | — | The reading pane | per message: from, to, cc, date, body, attachments, status (`ES_SENT`, `ES_RECEIVED`, `ES_VIEWED`, `ES_BOUNCED`), linked records | sanitized HTML in an isolated frame (`m-html-view`, §19); quoted text collapsed | `MailboxServices.get#Thread` (new); `set#MessageFlags` marks read | `MyAccount` `MessageThread`, `SingleMessage`; Nextcloud Thread and Message; Zimbra ConvView2 |
| `Snooze` | dialog | Hide until | later today, tomorrow, this weekend, next week, pick a date and time | | `MailboxServices.snooze#Messages` (new); a job returns them | Nextcloud snooze; Gmail snooze |
| `MoveTo` | dialog | Move the selection | folder with type-ahead across accounts | | `MailboxServices.move#Messages` (new; IMAP MOVE for external accounts) | Zimbra ChooseFolderDialog; Gmail move to |
| `Labels` | dialog | Apply labels | labels with a create line | | `MailboxServices.apply#Labels` (new) | Nextcloud TagModal; Gmail labels |
| `LinkToRecord` | dialog | File the thread on a record | party, order, request, task, project by id or search | `lookup#ById`, `search#Universal` | `mantle.party.CommunicationServices.link#CommunicationEventRecord` (new): creates or finds the `CommunicationEvent` for the message and writes the record join | Odoo "log on document"; HubSpot and Salesforce email logging |
| `CreateFromMessage` | dialog | A task, request or event from the message | name from the subject, description from the body, party from the sender, due | the `QuickCreate` forms with prefill | `create#SimpleTask`, `create#Request`, `create#Event` plus the message link | Zimbra `CREATE_TASK` and `CREATE_APPT`; Nextcloud create from Talk; Outlook drag to tasks |
| `ImipCard` | single | Answer an invitation | accept, tentative, decline; add to calendar | | `mantle.work.EventServices.respond#EventInvitation` with the parsed iCalendar; `create#Event` for an external organizer | Nextcloud Imip; Gmail and Outlook invitation cards |
| `ContactCard` | single, read | Who this is | name, organization, email, phone, presence, recent threads, Open contact or Add to contacts | | `mantle.party.ContactServices.get#PartyContactInfo`; `search#Party` by email | Nextcloud DisplayContactDetails; Outlook people card |
| `BulkActions` | list, bulk | On the selection | archive, delete, read, unread, flag, move, label, snooze, spam, link to record | | the services above | Gmail and Outlook bulk bars |

- **Actions:** Compose (`c`); Sync now; the per-message bar above; Unsubscribe uses the
  `List-Unsubscribe` header (one-click POST when `List-Unsubscribe-Post` is present, else the
  mailto or URL); Report spam moves to Spam and tells the gateway when it supports learning;
  Block sender adds a rule; Print and View source open `MessageDetail`.
- **Navigation:** from the launcher, the header Inbox count, the palette's Messages group, a
  Chatter message ("Open thread"), a notification of new mail (when the topic is on), a 360's
  Emails tab (which opens the thread under its app path).
- **Views:** Unified, per account and folder, label, Flagged, Snoozed, Scheduled, Drafts, Sent,
  Archive, Spam, Trash, Outbox (queued, scheduled and failed sends with retry and the delivery
  error), Internal, search results; thread or message mode; reading pane right, bottom or off.
- **States:** no account: a setup card (Add account) with the Internal account still usable;
  first sync: skeleton rows and "Syncing 1,204 of 8,000"; an account whose credentials failed
  shows a warning chip in the rail with "Fix"; a shared mailbox member without send rights sees
  no Compose from it; a message that is still only on the server (POP without body) loads on
  open.
- **Devices:** phone: the rail is a drawer, the list is the screen, a thread opens full
  screen, swipe left and right run the two preferred actions, compose is full screen.
- **Source:** research §8 (Nextcloud Mail, Zimbra mail, Frappe suite mail), §17 Messages
  screens and `EmailMessage`, §18 "No mail client"; Gmail and Outlook on the web for the shape
  people expect; the author's Gmail keyboard complaints for the gaps closed above.
- **Needs:** Mail account model, Mailbox services, IMAP and POP poller with incremental sync,
  SMTP send through the account, SMTP listener for internal mailboxes, OAuth for Google and
  Microsoft, `m-html-view`, Keymap registry, Search DataDocument for email, Snooze and
  scheduled-send jobs, iCalendar and iMIP tool, `link#CommunicationEventRecord`, Presence.

### Compose

- **Layout:** editor as `.qvue`: a dock card at the bottom right (Gmail), with minimize,
  pop out to a dialog (900 px) and full page (`Comms/Inbox/Compose?emailMessageId=` for a
  draft, `mailto:` handling and the quick-create entry); several docks side by side. Fields:
  From (an identity of an account; the Internal account for internal messages), To, Cc, Bcc
  (chips with autocomplete over parties' email addresses, recent correspondents, contact groups
  that expand, and users for internal), Subject, the body (`m-rich-text`, §19: paragraphs,
  bold and italic, lists, links, inline images, quotes, code, a plain-text toggle), the signature
  of the identity (above or below the quote by preference), attachments (drop, pick, or Attach
  from Files, which inserts a share link above a size limit), text blocks (`/` opens the
  picker), a "File on <record>" chip when opened from a record or Chatter, and the send row:
  **Send** (Ctrl+Enter), Schedule send (presets and a picker), Send and archive, Discard; Undo
  send holds the message in Outbox for the preferred seconds (5 to 30) with an Undo toast.
  Drafts autosave every few seconds to the account's Drafts folder as `ES_DRAFT`. Reply and
  forward inherit the thread (`parentEmailMessageId`, `In-Reply-To`), the quote and the
  attachments of a forward; a reply to an internal message is an internal message.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `Compose` | single | The message | from identity, to, cc, bcc, subject, body, attachments, record link, schedule | recipient chips with `server-search`; `m-rich-text`; `file` drop | `org.moqui.impl.MailboxServices.save#Draft`, `send#Draft` (new; the latter calls `org.moqui.impl.EmailServices.send#EmailMessage`); internal: `mantle.party.CommunicationServices.create#Message`, `reply#CommunicationEvent` | `EditMessage` `MessageForm`, `ReplyMessageForm`; `FindMessage` `CreateMessage`; Nextcloud Composer; Zimbra ComposeView; Frappe ComposeDock; Gmail compose |
| `AttachFromFiles` | dialog | Pick from Files | the Files list in a dialog | | `FileServices.list#Folder` | Nextcloud filePicker; Google Drive attach |
| `TextBlockPicker` | dialog | Insert canned text | search, personal and shared blocks | | `EmailTextBlock` (`entity`) | Nextcloud text blocks; Outlook quick parts |
| `ScheduleSend` | dialog | When to send | tomorrow morning, Monday morning, pick | | `send#Draft` with `scheduledSendDate`; the scheduler job sends | Nextcloud and Gmail schedule send |

- **Actions:** Send, Schedule, Send and archive, Save draft, Discard (confirms when not empty),
  Pop out, Minimize; a bounced send shows in Outbox with the error and Retry.
- **Source:** research §8; baseline `EditMessage`; Gmail and Outlook compose.
- **Needs:** Mailbox services, `m-rich-text`, File services, Scheduled-send job, Undo-send
  hold in Outbox.

**Per-app context (email sending).**

| App | Shown | Fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Comms | the composer | none | all | personal mail |
| Customer Service | the composer from a case with the case's party and record chip; text blocks of the support group; the case id in the subject | the case | send, send and resolve | canned replies |
| Marketing | the composer is not used; campaign sends use `EmailTemplate` and `ContactList` (design-marketing); consent (§16) gates recipients | | | |
| Accounting, Sales, Purchasing | the composer from a record with the document attached (invoice, quote, purchase order PDF) | the record | send | the attachment |

### MessageDetail

- **Layout:** detail as XML: a header card (from, to, cc, bcc, date, message id, account and
  folder, status chip from the `EmailMessage` flow, type `EMT_*` for system mail, template,
  server), the body (`m-html-view`), attachments, linked records and communication events, and
  the raw headers and source in a collapsed box. For mail the system sent (notifications, order
  and invoice emails, authentication codes) this is where Admin and Accounting see what went out.
- **Forms:** `MessageHeader` (single, read), `Attachments` (list), `LinkedRecords` (list:
  `CommunicationEvent` rows by `emailMessageId` and their joins), `Source` (display).
- **Actions:** Open in Inbox, Reply (Compose), Resend (`org.moqui.impl.EmailServices.send#EmailMessage`,
  for `ES_BOUNCED` and system mail; confirms), Download `.eml`, Print (`html-print`), Link to
  record.
- **Source:** research §17 `PartyEmails` `EmailMessageList`; the tools component's email
  message screens; Zimbra "show original".

## 13. Chat

Chat is Slack and Teams inside the suite, over the framework's Matrix-style store
(initial-design): a **room** (`ChatRoom`, new, §19) is a direct message, a private or public
group, or a room bound to a record (a case, a project, an order), with **members**
(`ChatRoomMember`: users, and later agents) and an append-only **timeline** of events
(`ChatEvent`: message, edit, reaction, redaction, membership, pin, call, poll), which is also
what the WebSocket pushes and what the search index reads. Chat messages are not
`CommunicationEvent` rows (the research's open question): a message becomes one only when a
user links it to a record or turns it into a task, request or event, and a record-bound room's
recent messages appear in that record's Chatter through the same component. Presence, typing
and read markers ride the notification WebSocket.

### Chat

- **Layout:** split as `.qvue`: a rail (search, filter chips Unread, Mentions, Direct, Rooms,
  Records; pinned rooms; the rooms with unread and mention badges, presence dots and a draft
  pen; New: direct message, room, join a public room), the room (header with name, topic,
  members, presence, Call, search in room, pin, settings; a day-grouped virtual timeline with
  sender grouping, the unread divider, read markers, typing indicators and jump to latest;
  message parts: text with mentions, link previews, file and image previews, record cards (an
  id such as `SO10023` or a pasted BOSS link renders a card through `lookup#ById`), system
  rows), a thread panel on the right when a thread is open, and the composer (`m-rich-text`
  light: `@` mentions, emoji, attachments by drop or picker, `/` commands such as `/task`,
  `/remind`, `/call`; Enter sends by preference). A right sidebar with tabs Members, Pinned,
  Files, Threads and, for a record-bound room, Record. The keys: Alt+Up and Alt+Down rooms,
  Alt+Shift+Up and Down unread rooms, Esc marks read and clears the thread, Up edits my last
  message, Ctrl+K opens the palette whose `#` prefix is the room switcher.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `RoomFind` | find | The rail | text, filter chips | | `org.moqui.impl.ChatServices.find#Rooms` (new) | Talk LeftSidebar; Signal left pane; Slack sidebar |
| `RoomList` | list | Rooms | avatar and presence, name, last message, time, unread and mention badges, pinned | `q-virtual-scroll` | same | same |
| `Timeline` | list | The room's events | sender, time, body, reactions, thread count, edited, pinned | virtual list with day headers; reactions picker; message action bar | `ChatServices.get#Timeline` (new; paged by event id) | Talk MessagesList; Signal Timeline; Odoo Discuss |
| `Composer` | single | A message | body, attachments, reply to | `m-rich-text` light; drop zone | `ChatServices.send#Message`, `edit#Message`, `redact#Message`, `react#Message`, `upload#Attachment` (new) | Talk NewMessage; Signal CompositionArea; Slack composer |
| `NewDirect` | dialog | A direct message | people (one or several) | `server-search` over users and the directory | `ChatServices.create#Room` type direct | Talk and Signal new chat |
| `NewRoom` | dialog | A room | name, topic, type (private, public, record-bound with the record), members | | `create#Room` | Talk NewConversationDialog; Slack create channel |
| `RoomSettings` | dialog | Sectioned settings | name, topic, avatar; visibility and who may join; notifications level for me (all, mentions, none); members and roles (owner, moderator, member, agent); retention; record binding; leave, archive, delete (owner) | | `ChatServices.update#Room`, `set#MemberRole`, `set#Notification` (new) | Talk ConversationSettingsDialog; Signal conversation details; Slack channel details |
| `MessageActions` | — | Per message | reply in thread, react, edit, delete, copy link, pin, forward, remind me (an activity `WepToDo`), create task, request or event, link to record, mark unread from here | | `create#SimpleTask`, `create#Request`, `create#Event` with the message text; `link#CommunicationEventRecord` | Talk MessageButtonsBar; Nextcloud create task from Talk; Slack message menu |
| `Members` | list | Who is here | name, presence, role; add, remove, change role | | `ChatServices.add#Member`, `remove#Member` | Talk Participants |
| `Poll` | dialog | A poll in the room | question, options, anonymous, multiple | | `ChatServices.create#Poll`, `vote#Poll` (new) | Talk PollCard; Gameplan polls | 

- **Actions:** New direct message, New room, Join; room: call, search, pin, mark read, mute,
  leave; message: the action bar.
- **Navigation:** from the launcher, the header Chat badge and inner-drawer tab, the palette's
  `#` prefix, a mention notification, a record's Chatter ("Open room"), a Contact record
  ("Chat").
- **States:** no rooms: "Start a conversation" with the people picker; a public room not joined
  shows its timeline read-only with Join; a message the sender deleted shows "message removed";
  offline: the composer queues and shows "Sending…" (later).
- **Devices:** phone: the rail is the screen, a room opens full screen; push notifications
  through the PWA later.
- **Source:** research §6 (Talk, Signal Desktop, Odoo Discuss, Zimbra IM), §18 "No chat";
  Slack and Teams for the shape people expect.
- **Needs:** Chat store and services, Presence, `m-rich-text`, Search DataDocument for chat,
  Record cards (`lookup#ById`), agent membership (Assist port, later), Poll (later).

## 14. Calls

Calls and video meetings run on WebRTC built into mr-moqui (initial-design): the framework
provides the signaling over the notification WebSocket, the STUN and TURN configuration, and a
`CallSession` record (new, §19) per call with its participants; a finished call writes a
`CommunicationEvent` of the new type `Call` (duration, participants, the room, and the record
when the room is bound to one) so it appears in Chatter and in call history. A **call link**
(`CallLink`) is the meeting front door: a URL anyone with the link may open, with a lobby that
a member admits guests from; a meeting is a calendar event (`WepMeeting`) with a call link.

### Calls

- **Layout:** list with tabs History, Call links, Upcoming meetings.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `CallHistory` | list | My calls | direction, with whom or room, started, duration, missed chip, recording (later) | Call back inline | `org.moqui.impl.CallServices.find#Calls` (new) over `CallSession` | Signal CallsList; Zimbra voice call history; Teams calls |
| `CallLinks` | list | Meeting links I made | name, link, expiry, who may join (members, anyone with the link, lobby), used | create, copy, revoke | `CallServices.create#CallLink`, `revoke#CallLink` (new) | Signal call links; Meet and Teams meeting links |
| `UpcomingMeetings` | list | Events with a call link | when, name, organizer, Join | | `get#FullCalendarData` filtered to `WepMeeting` with a link | Talk upcoming meetings; Frappe Meet home |

- **Actions:** New call (a people picker; opens Call), New call link, Call back, Join.
- **Source:** research §7.

### Call

- **Layout:** task archetype as `.qvue` (one thing at a time, large controls): the **lobby**
  (camera preview, microphone and speaker pickers with a level meter, blur background later, a
  name field for guests, Join; a guest waits for admission), then the **call view** (grid or
  speaker view, tiles with name and mute state, the bottom bar: mute, camera, share screen,
  raise hand, reactions, participants, chat (the room's timeline in a side panel), settings,
  Leave; the call time and a recording chip later; an "admit" prompt for guests in the lobby).
  Leaving a call while navigating shrinks it to the mini-window (§4 LiveCall). Full screen below
  1024 px.
- **Forms:** `Lobby` (single: devices, name), `CallControls`, `Participants` (list with mute
  and remove for moderators), `InCallChat` (the Chat composer and timeline), `AdmitGuest`
  (dialog).
- **Services:** `org.moqui.impl.CallServices.start#Call`, `join#Call`, `leave#Call`,
  `admit#Guest` (new); signaling messages over the WebSocket.
- **States:** no camera or microphone permission: the lobby explains and offers audio only;
  a call that cannot connect (no TURN path) names it and offers retry.
- **Devices:** phone (single tile, bottom bar).
- **Source:** research §7 (Talk CallView and MediaSettings, Signal lobby and call screen,
  Frappe Meet); Google Meet and Teams join flow.
- **Needs:** WebRTC in mr-moqui, Call store and services, `CommunicationEventType` `Call`,
  guest access by token, Recording (later).

## 15. Chatter and activities

Chatter is Odoo's timeline beside every record, built once as `Shared/Chatter` and embedded by
the framework's `chatter` element through the `STRT_CHATTER_SCREEN` theme value with
`recordEntity` and `recordId`. It reads and writes three kinds of rows: **messages** and
**notes** are `CommunicationEvent`s (email in and out with `emailMessageId`, internal `Message`,
internal `Comment` as the note, `Call`, `Phone`, `FaceToFace`), joined to the record by its own
join entity or the generic `CommunicationEventRecord`; **activities** are `WorkEffort` tasks
with the purposes `WepPhoneCall`, `WepEmail`, `WepToDo` and `WepMeeting`, joined by the record's
join or `WorkEffortRecord`, and they roll up into the Today panel; **followers** are
`RecordFollower` rows (user, record, which kinds notify). The timeline also shows status changes
from the entity audit log (the `enable-audit-log` fields of the record), files added
(`RecordFiles`), and the recent messages of a chat room bound to the record.

### Chatter (`Shared/Chatter`)

- **Layout:** panel as `.qvue`; the right column of a detail or 360 from 1440 px, a tab below.
  Top: the compose bar with three tabs **Send message** (email to the record's parties, or an
  internal message to users), **Log note** (internal), **Schedule activity**; a followers line
  (avatars, count, Follow or Unfollow, Add followers); the **planned activities** block (each
  with type icon, summary, due with overdue in warning, assignee, Mark done, Edit, Cancel); the
  attachments strip (the record's files, Add); then the timeline newest first with filter chips
  All, Messages, Notes, Activities, Changes and a search line; each entry: avatar, author, kind
  icon, time, body (collapsed quotes), attachments, delivery status for email (sent, received,
  viewed, bounced in negative), and the actions reply, forward, open thread, link elsewhere,
  react (chat-bound rooms).
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `SendMessage` | single | Email or internal message from the record | to (the record's parties' emails preselected, users for internal), subject with the record id, body, attachments (the record's files offered), "also post as note" | opens the Compose dock prefilled for email; inline for internal | email: `MailboxServices.send#Draft` with the record link; internal: `mantle.party.CommunicationServices.create#Message`, `reply#CommunicationEvent`; both write the record join | `MessageThread` and `SingleMessage` `ReplyMessageForm`; Odoo chatter send message; Twenty emails widget |
| `LogNote` | single | An internal note | body (markdown), mentions | `m-rich-text` light | `create#Message` with `communicationEventTypeId` `Comment` and the record join; a mention notifies on topic `ChatterMention` | `EditParty` `NewNoteForm`; `EditRequest` and `TaskSummary` `AddCommentForm`; Odoo log note |
| `ScheduleActivity` | single | A next action | type, summary, due, assignee (default me), note | type toggle | `mantle.work.TaskServices.create#SimpleTask` with the purpose and `assignToPartyId`; `WorkEffortRecord` or the record's join (`RequestWorkEffort`) | Odoo schedule activity and activity plans |
| `Activities` | list | Planned on this record | type, summary, due, assignee | Mark done opens `MarkDone`; Edit inline | `WorkEffortAndParty` with the record join (`entity`) | Odoo activity list |
| `MarkDone` | dialog | Close an activity with feedback | feedback note, schedule next (type, due) | | `update#Task` to `WeComplete`; the feedback becomes a `Comment`; `create#SimpleTask` for the next | Odoo mark as done popover |
| `Followers` | list | Who is notified | user, which kinds (messages, notes, activities, changes) | add by `server-search` | `RecordFollower` (new) | Odoo followers and subtypes |
| `Timeline` | list | The history | kind, author, time, body, status, attachments | virtual list; `q-timeline` by `render-mode` | `mantle.party.CommunicationServices.get#RecordTimeline` (new): unions the comm events through the joins, the activities done, the audit log rows, the file additions and the bound room's events | `MyAccount` `MessageThread`; `find#PartyCommunicationEvents`; Odoo chatter; Nextcloud Activity tab; Twenty timeline |

- **Actions:** send, log, schedule, follow, add followers, add file; per entry: reply, forward,
  open thread (Inbox or Chat), unlink, react.
- **States:** empty: the compose bar and "No messages yet"; a role that may read the record but
  not message sees the timeline without the compose bar; a record type with no join and no
  generic link configured shows no Chatter (the element renders nothing and logs once).
- **Devices:** phone (a tab on the detail).
- **Source:** research §5 (Odoo chatter, activities, followers), §1 Twenty record widgets, §16
  "Chatter & activities"; initial-design "Chatter maps onto CommunicationEvent + content".
- **Needs:** `chatter` element and `STRT_CHATTER_SCREEN`, generic record links and
  `RecordFollower`, `get#RecordTimeline`, `link#CommunicationEventRecord`, `m-rich-text`, the
  `ChatterMention` topic, Mailbox services.

**Per-app context (Chatter & activities).** Every record screen gets the full component; the
including screen fixes the defaults:

| App | Default compose tab | Extras | Hidden |
| --- | --- | --- | --- |
| Sales, Marketing | Schedule activity | activity plans (call, email, meeting sequences) later | — |
| Customer Service | Send message (email to the customer) | text blocks of the support group; "send and resolve" | — |
| Accounting | Send message with the invoice or statement attached | — | activities |
| Purchasing | Send message to the supplier | — | — |
| Warehouse, Manufacturing, Maintenance | Log note | — | Send message (notes and activities only) |
| Projects | Log note | time logged entries in the timeline | — |
| People | Log note (visible to HR roles) | — | Send message for non-HR roles |
| Commons, Comms | as the record: contacts default to Send message, files and pages to Log note | — | — |

## 16. Consent and unsubscribe

Consent lives on the data Mantle already has, with a history record added: whether a contact
may be solicited at an address is `PartyContactMech.allowSolicitation`; list membership and
unsubscription are `ContactListParty` statuses (`CLPT_PENDING`, `CLPT_ACCEPTED`,
`CLPT_UNSUBS_PENDING`, `CLPT_UNSUBSCRIBED`, …); and the new `PartyConsent` (§19) records each
grant and withdrawal with its purpose (marketing email, SMS, phone, data processing), source
(form, import, email link, staff), date and evidence text, which is what a larger organization
needs to show. Marketing's audience screens include the same screen; Customer 360 shows the
contact's state read-only.

### Consent

- **Layout:** list with a per-contact edit dialog.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `ConsentFind` | find | Narrow | text, list, status, purpose, changed period, allow solicitation | | | Frappe suite screener; Odoo blacklist |
| `Consents` | list | Contacts and their state | party, email or phone, allow solicitation, list subscriptions as chips, purposes granted, last change and source | bulk: unsubscribe from a list, export CSV | `PartyContactMech`, `ContactListParty`, `PartyConsent` (`entity`) | Mantle `ContactListParty` statuses; Mailchimp and HubSpot subscription status |
| `EditConsent` | dialog | One contact | per address: allow solicitation with reason; per list: subscribe or unsubscribe with source note; per purpose: granted or withdrawn with evidence | | `mantle.party.ContactServices.store#PartyContactMech`; `mantle.party.ConsentServices.store#PartyConsent`, `unsubscribe#ContactListParty` (new) | GDPR consent record patterns |
| `ConsentHistory` | list | The audit | when, what changed, source, by | | `PartyConsent` (`entity`) | |

- **Source:** research §8 and §18 (consent has data but no screen), crosscut §4 "Email/SMS
  sending, consent, unsubscribe".
- **Needs:** `PartyConsent`, Consent services.

**Per-app context (Consent).**

| App | Shown | Fixed | Action set | Emphasis |
| --- | --- | --- | --- | --- |
| Comms | all contacts | none | edit, bulk, export | the record |
| Marketing | the audience of a list or campaign (design-marketing) | the list | subscribe, unsubscribe, import with consent source | list health |
| Customer Service, Sales | the Consent box on Customer 360, read-only with a link | the party | — | — |

### Unsubscribe

- **Layout:** task archetype, anonymous, at `/u/<token>` (the token names the
  `ContactListParty` and the message): the organization's name, "You are subscribed to …",
  options Unsubscribe from this list, Unsubscribe from all marketing email, Update preferences
  (the lists with checkboxes), one primary Confirm, and a done page. A POST to the same URL
  with `List-Unsubscribe=One-Click` (RFC 8058) unsubscribes without a page. Every change writes
  `CLPT_UNSUBSCRIBED` (or `CLPT_UNSUBS_PENDING` when the list requires confirmation) and a
  `PartyConsent` withdrawal with source "email link".
- **Forms:** `UnsubscribeChoice` (single), `Preferences` (list, editable rows).
- **Services:** `mantle.party.ConsentServices.unsubscribe#ContactListParty` (new).
- **Source:** Mantle `ContactListParty` flow; Mailchimp and Google Groups unsubscribe pages;
  Gmail's list-unsubscribe handling on the receiving side.
- **Needs:** Anonymous token route, Consent services, `List-Unsubscribe` headers on list mail
  (Marketing's sends and the framework's `send#EmailTemplate`).

## 17. Comms settings

### Settings

- **Layout:** settings index: Mail accounts, Identities and signatures, Rules, Out of office,
  Text blocks, Chat, Calls; a last card links to Admin's mail domains, relay and gateway pages
  and to Commons Preferences for the mail reading defaults and the key map.

### MailAccounts

- **Layout:** settings page with the accounts list and an **Add account** wizard.
- **Forms:**

| Form | Kind | Purpose | Highlighted fields | Widgets of note | Services | Derived from |
| --- | --- | --- | --- | --- | --- | --- |
| `Accounts` | list | My and shared accounts | name, address, kind (internal, external, shared), status, last sync, unread, members | row: pause, sync now, edit, remove | `EmailAccount` (`entity`); `org.moqui.impl.MailboxServices.sync#EmailAccount` (new) | Nextcloud Mail navigation accounts; Frappe mail dashboard accounts |
| `AccountKind` | wizard step | What to add | Internal mailbox at a hosted domain; External (IMAP or POP and SMTP); Google; Microsoft 365; Shared mailbox | | | Nextcloud Setup; Outlook add account |
| `AccountCredentials` | wizard step | How to connect | address, name; autodiscover by domain; manual IMAP or POP host, port, TLS, SMTP host, port, TLS, user, password; OAuth sign-in popup for Google and Microsoft | `password`; the OAuth popup (framework) | `MailboxServices.discover#EmailServer`, `create#EmailAccount` (new) over `EmailServer` | Nextcloud AccountForm and OAuth; Thunderbird autoconfig |
| `AccountTest` | wizard step | Prove it works | connect, list folders, send a test message | `q-linear-progress` | `MailboxServices.test#EmailAccount` (new) | Zimbra AccountTestDialog |
| `AccountOptions` | wizard step | How to sync | folders to sync, sync window (30 days, 1 year, all), folder mapping for Sent, Drafts, Trash, Junk and Archive, color, default identity and signature, members for a shared mailbox | | `create#EmailAccount`; `EmailAccountUser` (new) | Nextcloud account settings; Outlook shared mailbox |
| `AccountEdit` | single | The same options after creation, plus remove (keep or delete local copies), reauthorize | | | `update#EmailAccount`, `delete#EmailAccount` (new) | |

- **Source:** research §8 (Nextcloud setup and settings, Frappe exchanges), initial-design
  "Email supports both modes".
- **Needs:** Mail account model, IMAP and POP poller, SMTP listener, OAuth client and token
  store, autodiscover (tool).

### Identities

- **Forms:** `Identities` (list, editable rows per account: address or alias, display name,
  reply-to, default; an internal domain's aliases come from Admin), `Signature` (single:
  `m-rich-text`, placement, use for replies). Services: `EmailIdentity` (`entity`). Derived
  from Nextcloud AliasSettings and SignatureSettings, Zimbra signatures page, Gmail "Send mail
  as".

### Rules

- **Forms:** `Rules` (list: order, name, account, enabled, matched count; drag to reorder; Run
  on existing), `RuleEditor` (dialog: name, account or all, match any or all of the conditions;
  `Conditions` as editable rows: field (from, to, subject, body, has attachment, list id, size,
  any header), operator (contains, is, matches, starts with), value; `Actions` as editable rows:
  move to folder, add label, mark read, flag, forward to, delete, mark spam, create task or
  request for, stop processing). Rules run on the server when the poller or the listener stores a
  message, and on demand over a folder. Services: `EmailRule` (`entity`), `MailboxServices.run#EmailRules`
  (new). Derived from Nextcloud sieve filter builder, Zimbra filter rules, Gmail filters, Outlook
  rules and sweep.

### OutOfOffice

- **Forms:** `OutOfOffice` (single per account: enabled, from and thru, subject, body for
  everyone, a different body for internal senders, reply once per sender per n days, also decline
  meetings later). Services: `EmailOutOfOffice` (`entity`); the receiver sends the reply.
  Derived from Nextcloud OutOfOfficeForm, Zimbra vacation, Outlook automatic replies.

### TextBlocks

- **Forms:** `TextBlocks` (list: title, shortcut, shared with group, used), `TextBlockEditor`
  (dialog: title, shortcut, body with `m-rich-text`, personal or shared with a user group).
  Services: `EmailTextBlock` (`entity`). Derived from Nextcloud text blocks, Zimbra and Outlook
  quick parts, Gmail templates.

### ChatSettings

- **Forms:** `ChatPreferences` (single: default notification level, sounds, Enter sends,
  show message previews in notifications, auto-away after minutes, show read receipts, typing
  indicators). Services: `set#Preference`. Derived from Talk and Signal settings.

### CallSettings

- **Forms:** `CallPreferences` (single: preferred camera, microphone and speaker (kept in the
  browser, since they are per device), ringtone, join muted, camera off on join, background
  blur default). Derived from Talk MediaSettings, Signal calls settings, Teams devices.

## 18. Documents and outputs

| Output | Kind | From screen | Derived from |
| --- | --- | --- | --- |
| Event invitation, update and cancellation with an `.ics` part (iMIP) | email | EventDetail, Calendar | Nextcloud and Zimbra iMIP; RFC 5546 |
| Event reminder | notification, email | reminders job | Zimbra reminders |
| Share notification ("Jane shared a folder with you") with the link | email, notification | Files Share dialog | Nextcloud sharebymail |
| Notification digest (daily per topic preference) | email | notifications job | Nextcloud Activity digest; OpenProject reminders |
| Mention notification (chat, Chatter) | notification, email by preference | Chat, Chatter | Odoo and Slack mentions |
| Out-of-office reply | email | receiver | Nextcloud and Outlook |
| Contact export (vCard 4.0, CSV in the Google Contacts column set) | export | Contacts, ContactBooks | Nextcloud and Zimbra export |
| Contact import (vCard, CSV with mapping) | import | ContactImport | §6 |
| Calendar export and subscribe (`.ics`, the CalDAV and public URL) | export | Calendar, Calendars | Nextcloud publish and subscribe |
| Calendar import (`.ics` file into a calendar) | import | Calendars | Nextcloud import |
| Printed calendar (day, week, month, agenda) | `html-print` | Calendar | Zimbra CalPrintDialog; Outlook print styles |
| Printed contact or address book | `html-print` | ContactDetail, Contacts | Zimbra print |
| Message print and `.eml` download; `.mbox` export of a folder | `html-print`, export | MessageDetail, Inbox | Zimbra show original; Gmail export |
| Message import (`.eml`, `.mbox` into a folder) | import | MailAccounts | Thunderbird import |
| Wiki page PDF and markdown export; space export as HTML | `html-print`, export | Knowledge | Redmine and Collectives export |
| File download, folder as zip, public link | export | Files, PublicShare | Nextcloud and Drive |
| Consent export (CSV) | export | Consent | Marketing suppression lists |
| Unsubscribe confirmation | email | Unsubscribe | Mailchimp |
| Call summary (participants, duration) in Chatter | record | Call | Twenty call recordings widget (summary only, no recording) |

## 19. Framework and data needs

What mr-moqui and Mantle must gain for the screens above. Items that style-guide §8 already
lists keep its name and add what this file learned; the rest are new. The crosscut design
rolls this table up with the other files'. Kinds are those of design-doc-guide §8.

### Shell and chrome

| Need | Kind | Proposed as | Used by | Stub spec |
| --- | --- | --- | --- | --- |
| Shell elements (style-guide §8) | shell item | `m-qapps-root`: launcher, search button, quick create, Today, Chat, Inbox count, Notifications, Assist toggle; badges from a `shellCounts` object | all | the elements of §1.2; the account menu gains status and the Preferences and Account links |
| Inner drawer frame (style-guide "Tray panel") | shell item | A right panel in the canvas; tabs from `STRT_TRAY_TODAY`, `STRT_TRAY_CHAT`, `STRT_TRAY_NOTIFICATIONS`; open state, tab and scroll kept in the root; Esc closes; full width below 600 px; a per-tab WebSocket topic refreshes it | §4 panels | §1.4 |
| Shell providers | XML Screen element | `<shell-providers>` in an app root: `<quick-create label icon screen parameter-map>`, `<today-source service>`, `<palette-action label icon screen>`, `<palette-type doc-type>`, `<notification-topic topic>`, `<keymap scope>`; aggregated in the menu data for the apps the user may open | every app | §1.2, §1.5 |
| Screen context | XML Screen element | `<context record-entity record-id title selection-form/>`; the root exposes `screenContext` {path, parameters, record, selection, filters, forms} | every detail, 360, list | §1.6 |
| Assist drawer | shell item | The Phase 13 port of the Java panel into a right `q-drawer` with the inputs of §1.3: screen context, canvas placement, running tasks, the reach list `assistReach`, agent entry point for chat rooms | all | §1.3 |
| Palette | shell item | `q-dialog` with the groups of §1.5, prefixes, Recent, Ctrl+K; providers from `<shell-providers>` and the Commons and Comms result services | all | §1.5 |
| Quick create frame | shell item | The `+` menu from the providers; opens `STRT_QUICK_CREATE` (`Commons/QuickCreate`) or a provider's screen in an `m-dialog` with the context as parameters | all | §1.5 |
| `shellCounts` topic and `get#ShellCounts` | service type, data | `mantle.party.PartyServices.get#ShellCounts` (extends `get#UserNoticeCounts`: today, overdue, chat unread and mentions, mail unread, notifications, approvals) and a framework WebSocket topic `shellCounts` the services that change those counts publish to | header badges, Home counters | |
| Presence and status | shell item + data model | `moqui.security.UserStatus` {userId, statusEnumId (online, away, dnd, invisible), statusText, emoji, clearAtDate, lastActiveDate, inCall}; topic `userStatus`; auto-away from client idle; shown by an `m-avatar` wrapper that draws the dot | account menu, Chat, Chatter, Contacts | §1.8 |
| Keymap registry | shell item | `moqui.keymap`: global bindings, `registerScope(scope, bindings)` from a screen or `.qvue`, the `?` overlay, user overrides from the `KEYMAP` preference, conflict resolution by scope; the Inbox and Chat sets of §12 and §13 as the first scopes | Inbox, Chat, Calendar, Files, Knowledge, all | §1.7 |
| `number-card`, `container-split`, wizard panel, list views, `status-bar`, `chatter`, `record-files`, Material Symbols | as style-guide §8 | unchanged, with `chatter` and `record-files` embedding the screens named by `STRT_CHATTER_SCREEN` and `STRT_RECORD_FILES_SCREEN` so the framework stays Mantle-free | §5–§15 | style-guide §8 |
| Anonymous token routes | shell item | Webroot mounts `/s/<token>` (public share), `/u/<token>` (unsubscribe), `/call/<token>` (guest join) that render a named screen with the token checked by a service before any data | PublicShare, Unsubscribe, Call | |
| App passwords | data model + tool | A per-user password for DAV and SFTP clients (name, hash, created, last used, revoke), accepted by the protocol servers and not by the web login | Sync | |
| PWA manifest and push | shell item | A manifest and service worker so Comms installs on a phone; web push for chat and mail notifications | Chat, Inbox, Today | later |

### Components and render

| Need | Kind | Proposed as | Used by | Stub spec |
| --- | --- | --- | --- | --- |
| `m-rich-text` | Vue component | Tiptap in a wrapper with the `m-*` model contract: formatting, lists, links, images, mentions (`@` over a search URL), code, quotes, a plain-text toggle; a `light` mode for chat and notes; the same editor gains Yjs collaboration as `m-coedit` | Compose, Chat composer, Chatter, Identities, TextBlocks | `text-area editor-type="html"` (q-editor) is the fallback |
| `m-coedit` and the `yrs` server | Vue component + tool | `m-rich-text` with `@tiptap/extension-collaboration` over a `yrs` sync server in mr-moqui on the notification WebSocket; the document store `moqui.resource.CollabDocument` (CRDT state, rendered snapshot, metadata, compaction), per initial-design | Knowledge, Notes | style-guide §8 "Co-editing editor" |
| `m-html-view` | Vue component | Sanitized HTML (DOMPurify, the Assist port vendors it) rendered in a sandboxed iframe with a CSP, remote images blocked until allowed, links opened outside, dark-mode aware | Inbox, MessageDetail, Chatter | |
| `m-avatar` | Vue component | A `q-avatar` from a party's `PcntFaceImage` or initials, with the presence dot | everywhere | |
| Print documents | render mode | `html-print` templates for the calendar range, a contact, a message, a wiki page | §18 | style-guide §8 |
| Search DataDocuments | seed data | `MoquiEmailMessage` (subject, bodies, addresses, labels, account, folder), `MoquiChatEvent` (room, sender, body), `MoquiDbResource` (name, path, tags, extracted text later), plus the existing party, work effort and wiki documents in the `mantle` index with per-user filters | palette, Inbox search, Chat search, Files search | the universal search's organization and user limits apply |

### Mail

| Need | Kind | Proposed as | Used by | Stub spec |
| --- | --- | --- | --- | --- |
| Mail account model | data model | Framework entities `moqui.basic.email.EmailAccount` {owner user or party, kind internal, external or shared, emailServerId, address, name, color, syncWindow, status, lastSyncDate}, `EmailAccountUser` (shared members and rights), `EmailIdentity`, `EmailFolder` {account, name, path, kind, remote uid validity and modseq, counts}, `EmailLabel`, `EmailMessageLabel`, `EmailMessageAttachment` {message, DbResource location, name, size, mime, contentId}, `EmailRule`, `EmailOutOfOffice`, `EmailTextBlock`, `EmailSearch`; `EmailMessage` gains `emailAccountId`, `emailFolderId`, `remoteUid`, `isRead`, `isFlagged`, `isAnswered`, `hasAttachment`, `snippet`, `size`, `snoozedThruDate`, `scheduledSendDate`; `EmailServer` gains `authTypeEnumId` and an OAuth token reference | Inbox, Compose, Comms settings | |
| Mailbox services | service type | `org.moqui.impl.MailboxServices`: `find#Messages`, `get#Thread`, `set#MessageFlags`, `move#Messages`, `apply#Labels`, `snooze#Messages`, `trash#Messages`, `report#Spam`, `unsubscribe#Message`, `save#Draft`, `send#Draft`, `discover#EmailServer`, `create#EmailAccount`, `test#EmailAccount`, `update#EmailAccount`, `delete#EmailAccount`, `sync#EmailAccount`, `run#EmailRules`; Rust where they touch the protocol, XML actions otherwise | Inbox, Compose, settings | |
| IMAP and POP poller with incremental sync | protocol client | Per-account sync in Rust: folder list, UIDVALIDITY and CONDSTORE or QRESYNC when offered, flags both ways, MOVE and COPY, APPEND of sent mail, IDLE or a short interval; POP as fetch-only; extends `poll#EmailServer` | Inbox | initial-design "Protocol layer" |
| SMTP send through the account | protocol client | `send#EmailMessage` chooses the account's server, direct or relay, DKIM left to the gateway; delivery status back on the message (`ES_SENT`, `ES_BOUNCED` from DSN) | Compose, Chatter, system mail | exists for templates; per-account routing is new |
| SMTP listener behind the gateway | protocol server | Accept from the gateway's addresses only, trust its `Authentication-Results`, route by address to internal mailboxes and shared mailboxes, run rules, store `EmailMessage` and the `CommunicationEvent` when a party matches | internal and shared mailboxes | initial-design "SMTP gateway reference setup"; `Remaining-Work` "Embedded SMTP server: no code" |
| OAuth client and token store | tool | Authorization-code flow with PKCE in a popup for Google and Microsoft, refresh tokens encrypted, used by the poller and SMTP (XOAUTH2) and later by calendar and contact sync | MailAccounts, Calendars | |
| Autodiscover | tool | Thunderbird autoconfig, Microsoft autodiscover and DNS SRV lookup by domain | MailAccounts | |
| Snooze and scheduled-send jobs | service type | `ServiceJob`s that return snoozed messages at `snoozedThruDate` and send drafts at `scheduledSendDate`; Undo send is a short hold in the Outbox before `send#Draft` | Inbox, Compose | |
| iCalendar, vCard and iMIP tool | tool | Parse and write `.ics` (events, RRULE, VALARM, attendees) and `.vcf` 3.0 and 4.0; iMIP REQUEST, REPLY and CANCEL mail; used by the Inbox card, EventDetail, Calendar export, Contacts import and export, CalDAV and CardDAV | Calendar, Contacts, Inbox | |
| `List-Unsubscribe` on list mail | tool | Headers on every `ContactList` send, the one-click POST endpoint | Unsubscribe, Marketing | RFC 8058 |

### Chat and calls

| Need | Kind | Proposed as | Used by | Stub spec |
| --- | --- | --- | --- | --- |
| Chat store | data model | Framework entities `moqui.chat.ChatRoom` {type, name, topic, avatar, visibility, recordEntityName, recordId, retentionDays}, `ChatRoomMember` {userId or agent reference, role, joinedDate, lastReadEventId, notificationLevel, pinned}, `ChatEvent` {room, eventSeq, type, senderUserId, contentJson, replyToEventId, threadRootEventId, editsEventId, sentDate}, `ChatAttachment` (DbResource), `ChatPoll` and `ChatPollVote` | Chat, ChatPanel, Chatter | initial-design "Matrix-style persistence" |
| Chat services | service type + protocol server | `org.moqui.impl.ChatServices`: `find#Rooms`, `create#Room`, `update#Room`, `add#Member`, `remove#Member`, `set#MemberRole`, `set#Notification`, `get#Timeline`, `send#Message`, `edit#Message`, `redact#Message`, `react#Message`, `pin#Message`, `mark#Read`, `upload#Attachment`, `create#Poll`, `vote#Poll`; typing, read markers and new events on WebSocket topics `chatRoom:<id>` and `chatUser:<id>`; an agent entry point for the Assist port | Chat | |
| WebRTC | protocol server | Signaling over the notification WebSocket (offer, answer, ICE), STUN and TURN from configuration (coturn documented), mesh for small calls and an SFU later; `moqui.chat.CallSession` {room, startedDate, endedDate, startedBy}, `CallParticipant`, `CallLink` {token, name, expiry, policy}; `org.moqui.impl.CallServices` `start#Call`, `join#Call`, `leave#Call`, `admit#Guest`, `create#CallLink`, `revoke#CallLink`, `find#Calls` | Calls, Call, LiveCall | initial-design "WebRTC built into mr-moqui" |
| `CommunicationEventType` `Call` | seed data | `Call` (voice or video call in BOSS) beside `Phone` (a logged external call) | Chatter, call history | |

### Commons data and services

| Need | Kind | Proposed as | Used by | Stub spec |
| --- | --- | --- | --- | --- |
| Contact books | data model | Mantle `mantle.party.contact.ContactBook` {ownerPartyId or shared, name, color, visibility}, `ContactBookParty` {book, party, fromDate, isFavorite}, `ContactBookGroup`, `ContactBookGroupParty`, `ContactBookShare` {book, user or group, permission}; a personal contact is a party in a personal book only | Contacts, ContactBooks, QuickContact | §6 |
| Contact book, import and export services | service type | `mantle.party.ContactBookServices` (`create#ContactBook`, `share#ContactBook`, `add#ContactBookParties`, `remove#ContactBookParties`, `create#ContactBookGroup`, …), `mantle.party.ContactImportServices` (`parse#ContactFile`, `import#Contacts` as a job, `export#Contacts` vCard and CSV) | Contacts, ContactImport | |
| Calendar collections | data model | Mantle `mantle.work.calendar.Calendar` {ownerPartyId, name, color, kind personal, shared, resource or subscription, timeZone, isDefault}, `CalendarWorkEffort` {calendar, workEffort}, `CalendarShare` {calendar, user, group or party, permission, publishToken, password}, `CalendarSubscription` {calendar, url or provider, refreshMinutes, lastFetchDate, status} | Calendar, Calendars, EventDetail | §7 |
| Recurrence | data model + seed data | `mantle.work.effort.WorkEffortRecurrence` {workEffortId, rrule, exdates, rdates}; instance overrides as `WorkEffort`s linked by the new `WorkEffortAssoc` type `WeatRecurrenceInstance` with the instance date; the existing `recurStartCron`, `recurLimit`, `recurEndDate` stay for jobs | Calendar, EventDetail, Tasks | |
| Reminders | data model + service type | `mantle.work.effort.WorkEffortReminder` {workEffortId, partyId, offsetMinutes, methodEnumId notification or email}; a job that sends on topic `WorkEffortReminder` with snooze | EventDetail, Tasks, Today | |
| RSVP and booking statuses | seed data + data model | `StatusItem` `WeptTentative` in `WorkEffortParty`; `WorkEffortFacility` gains `statusId` with the `WorkEffortAssetAssign` flow (`WeaaRequested`, `WeaaAssigned`, `WeaaRequestDenied`) or its own | EventDetail, Schedules | |
| Calendar services | service type | `mantle.work.EventServices`: `get#FullCalendarData` extended with `calendarIdList`, RRULE expansion and all-day handling; new `get#FreeBusy`, `send#EventInvitations`, `respond#EventInvitation`, `book#Resource`; `mantle.work.CalendarServices` (`create#Calendar`, `share#Calendar`, `subscribe#Calendar`, `fetch#CalendarSubscription` as a job, `export#Calendar`) | Calendar, EventDetail, Schedules, Calendars | |
| Today and timeline services | service type | `mantle.work.WorkEffortServices.get#UserTodayItems` (tasks, activities and events of the user by overdue, today and later, plus the `<today-source>` providers' items); `mantle.party.CommunicationServices.get#RecordTimeline`, `link#CommunicationEventRecord` | TodayPanel, Home, Chatter, Inbox | |
| Generic record links | data model | Mantle `mantle.party.communication.CommunicationEventRecord` {communicationEventId, recordEntityName, recordId}, `mantle.work.effort.WorkEffortRecord` {workEffortId, recordEntityName, recordId}, `mantle.party.communication.RecordFollower` {recordEntityName, recordId, userId, kinds}; the per-type joins stay and are read too | Chatter, QuickCreate, Inbox, Chat | answers crosscut §8 |
| Consent | data model + service type | Mantle `mantle.party.PartyConsent` {partyId, contactMechId, purposeEnumId, statusId granted or withdrawn, consentDate, sourceEnumId, evidenceText, userId}; `mantle.party.ConsentServices` `store#PartyConsent`, `unsubscribe#ContactListParty` | Consent, Unsubscribe, Marketing | |
| Notification fields and approvals | data model | `moqui.security.user.NotificationMessage` gains `reasonEnumId` (mention, assignment, approval, dateAlert, reminder, comment, system), `recordEntityName`, `recordId`, `actorUserId`, `appName`; `NotificationTopic` gains `approveServiceName`, `refuseServiceName`, `digestDefault`; `NotificationTopicUser` gains `digest`; a daily digest job | NotificationsPanel, Notifications, settings | answers the research open question |
| Notes space and knowledge review | data model + service type | `moqui.resource.wiki.WikiPageReview` {wikiPageId, versionName, requestedByUserId, reviewerUserId, statusId, note, requestedDate, decidedDate}; a service that creates a user's private notes `WikiSpace` on first use; `WikiServices.update#WikiPage` writing the snapshot of a `CollabDocument` | Knowledge, Review, Notes | |

### Files

| Need | Kind | Proposed as | Used by | Stub spec |
| --- | --- | --- | --- | --- |
| File metadata model | data model | `moqui.resource.DbResource` gains `ownerUserId`, `size`, `isTrashed`, `trashedParentResourceId`, `trashedDate`; new `DbResourceShare` {resource, user, group, party or link token, permission, expiry, passwordHash, note, createdBy, openedCount}, `DbResourceFavorite`, `DbResourceTag`, `DbResourceTagMember`; the `Records/<entity>/<id>/` convention for record folders | Files, Shares, PublicShare, RecordFiles | §9 |
| File services | service type | `org.moqui.impl.FileServices`: `list#Folder`, `find#Resources`, `find#Recent`, `upload#Resource`, `create#Folder`, `rename#Resource`, `move#Resource`, `copy#Resource`, `trash#Resource`, `restore#Resource`, `restore#Version`, `share#Resource`, `revoke#Share`, `accept#Share`, `decline#Share`, `open#PublicShare`, `list#PublicShare`, `upload#PublicShare`, `download#Zip`, `get#Activity`; previews (image thumbnails, PDF first page) by a Rust tool | Files, RecordFiles, Compose, Home | |
| WebDAV server | protocol server | The resource tree with the user's rights, locks, and `PROPFIND` of the share and tag properties | Sync, desktop clients | initial-design "Protocol layer" |
| Virtual SFTP server | protocol server | The same tree over the russh host with app passwords | Sync, scripts | the Java virtual SFTP; `moqui-host/src/ssh/` has the cluster sender |
| CalDAV and CardDAV servers | protocol server | Calendars (`Calendar` and `WorkEffort` events, `WetTask` as VTODO) and address books (`ContactBook` and parties as vCards) for phones and desktop clients, with app passwords | Sync | initial-design "Calendar / contacts" |
| Extracted text for search | tool | Text extraction from PDF and office files into the `MoquiDbResource` document | Files search | later |

## 20. Decided

| Decision | Notes |
| --- | --- |
| One file for the shell, Commons and Comms; an **Impl** column | Replaces the guide's `design-commons.md` and `design-comms.md`; the guide's §1 and §4 should be updated at review |
| Every screen is client-rendered and server-static; `.qvue` for Inbox, Compose, Chat, ChatPanel, Calendar, Schedules, Files, PublicShare, Knowledge, Notes, Chatter, RecordFiles, Call and LiveCall; XML for the rest | The `.qvue` screens are the ones whose interaction does not fit the XML widgets (style-guide §4.8); each names the `m-*` components it still uses |
| Outer drawer is Assist and belongs to the framework; the inner drawer is BOSS content in a framework frame | The inner drawer is style-guide §2.4's tray panel; its tabs and the quick-create, Chatter and record-files screens are named by theme values so the framework stays Mantle-free |
| What Assist may reach: the canvas, dialogs from it, the inner drawer's tabs, the quick-create dialog and the live-call window; not the header, app drawer, palette, account menu, theme plugins or itself | Answers the initial-design and research open item; Assist reads the inner drawer's data through `request` on the panel screens' `/actions` and its tools catalog is the palette's providers |
| Assist's `write_ui` canvas renders in the drawer and can be opened into the page | Keeps the Java panel's page-slot behavior as an option rather than the default |
| Screen context is the one plumbing for quick create, Chatter, Today, record files and Assist | style-guide §8 "Screen context"; a record link made from it uses the record's own join when one exists, else the generic links |
| Approvals: the inner drawer's Notifications tab, the `Commons/Notifications` center, and the source apps' own lists | Answers the research and crosscut §8 approvals questions; approve and refuse call services named on the `NotificationTopic` |
| `NotificationMessage` gains reason, record, actor and app fields rather than conventions inside `messageJson` | Filters and the record link need columns; `messageJson` stays for the payload |
| Badges and the inner drawer refresh over WebSocket topics (`shellCounts`, per-tab topics), with a five-minute poll as the fallback | Replaces the My Account widget's polling |
| A suite key map with Gmail-compatible mail defaults, Slack-compatible chat defaults, a `?` overlay and user overrides | The Inbox and Chat scopes close the gaps named in §1.7 and §12 |
| QuickSearch, Search and QuickLookup retire into the palette; `Commons/Search` remains only as the "more" page for records | `Base/QuickSearch`, `Base/Search`, `Base/QuickLookup` and `template/SearchTransitions.xml` go when the palette lands |
| Commons and Comms are authorized for `ALL_USERS` | A deployment narrows with its own authz; role-limited screens (Duplicates, Spaces, Review, Consent) check their own groups |
| Address books are new `ContactBook` records; groups are labels inside a book; a personal contact is a `Party` in a personal book with no role, hidden from the directory and the duplicate scan | Answers the research question; CardDAV maps one book to one address book; "Link to a directory party" merges a personal contact into the directory when wanted |
| Calendars are a new `Calendar` collection over `WorkEffort` events, with `CalendarShare` and `CalendarSubscription`; recurrence is an RRULE on `WorkEffortRecurrence` with instance overrides by `WorkEffortAssoc` `WeatRecurrenceInstance`; reminders are `WorkEffortReminder`; working hours are `WetAvailable` work efforts | Answers the research question; nothing is added to `WorkEffort` itself except through the new child entities |
| RSVP uses `WorkEffortParty` statuses (`WeptOffered`, `WeptAssigned`, `WeptDeclined`, new `WeptTentative`); room booking uses `WorkEffortFacility` with a new status; equipment uses `WorkEffortAssetAssign` statuses; policies and approval live in Maintenance | initial-design's split; without a policy a booking is assigned at once |
| Files run on `DbResource` with added metadata, shares, favorites, tags and trash; record attachments live under `Records/<entity>/<id>/` and keep their `*Content` rows; WebDAV, SFTP, CalDAV and CardDAV are framework servers over the same data | Answers the research question; everything in Postgres under one backup; a file-system root is configuration |
| Personal notes are the pages of a private `WikiSpace` per user; knowledge base, team wiki and help center are spaces; review is `WikiPageReview` over the existing published version; co-editing is Tiptap over Yjs with `yrs`, with a markdown text area until it lands | initial-design "Notes and knowledge live in Commons"; blogs (`WikiBlog`) go to Marketing's content screens |
| Chat messages are a separate Matrix-style store (`ChatRoom`, `ChatRoomMember`, `ChatEvent`); a message becomes a `CommunicationEvent` only when linked to a record or turned into one; a record-bound room shows in Chatter | Answers the research question; search indexes chat events directly |
| Mail is `EmailMessage` plus the new account, folder, label, attachment and rule entities in the framework; a `CommunicationEvent` is created when a party matches or the user links; internal messages are the Internal account of the same Inbox | Answers initial-design "Internal comm events: same inbox UI as email"; the receiver's party matching sets `emailMessageId` as the order, invoice and shipment services already do |
| The composer is one component used from the Inbox, quick create, Chatter and the business records; Marketing's campaign sends do not use it | §12 per-app context |
| Calls are WebRTC in mr-moqui with `CallSession` and `CallLink`; a finished call is a `CommunicationEvent` of the new type `Call`; meetings are `WepMeeting` events with a call link | initial-design "WebRTC built into mr-moqui" |
| Consent is edited on `PartyContactMech.allowSolicitation` and `ContactListParty`, with `PartyConsent` as the history; one screen for Comms and Marketing; a public unsubscribe page with one-click support | Answers the research question |
| Chatter is one component with a generic record link (`CommunicationEventRecord`, `WorkEffortRecord`, `RecordFollower`) beside the existing per-type joins | Answers crosscut §8 "Generic record links"; the design-crosscut file references §15 rather than redesigning it |
| Dropped from the candidate inventory: a separate Outbox screen (a folder view), a separate Events area (`EventDetail` under Calendar), a Comms Chatter screen (one component), the My Account Time entries (Projects' My timesheet and the Task Time tab), Scheduled finds (Insights' saved reports) and Expense (People and Accounting), the org chart (`later`) | The My Account forms they held are covered as noted in §8 and §11 or carried by those files |
| `Comms/Settings/CallSettings`, `Commons/Settings/Sync`, Calls, Call and LiveCall are `later`; everything else in the tables is `parity` or `new` | Calls and DAV sync wait on their protocol work; the Inbox is `new` in the first release because it is the suite's own mail client |

## 21. Open

Each with the answer the author would give.

- **Personal contacts as parties.** A personal contact pollutes nothing visible, but it is a
  row in `Party` with no role, and a deployment with strict data-protection rules may prefer a
  separate vCard store per user. Recommended: keep them as parties in personal books (one
  search, one merge path, one CardDAV backend) and add a retention job that purges personal
  books of users who are disabled.
- **Mail body storage at scale.** `EmailMessage.body` and `bodyText` are `text-very-long`
  columns; a user with ten years of mail has tens of gigabytes in one table. Recommended: keep
  bodies in the table (one backup, full-text in the index), attachments in `DbResource`, and add
  an archive policy per account (older than n years moved to a cold table or exported to
  `.mbox` in Files) before the first large deployment.
- **The Internal account.** Internal messages could instead be chat or Chatter only.
  Recommended: keep the Internal account; a small business uses it as the message board it
  never had, and it costs one virtual account in the rail.
- **OAuth for Google and Microsoft in the first release.** The author's own use needs a Gmail
  account polled over IMAP with OAuth. Recommended: first release, with the client in the
  framework so calendar and contact import reuse it.
- **An IMAP or JMAP server so other mail clients can read BOSS mailboxes.** Recommended:
  later, JMAP first if ever (Frappe suite talks JMAP to Stalwart); initial-design already limits
  it to "only if users point mail clients at BOSS".
- **Encryption (S/MIME, PGP).** Recommended: later; Nextcloud Mail's Mailvelope and S/MIME code
  is the reference when it comes.
- **Chat federation.** Matrix-style is internal persistence, not the Matrix protocol.
  Recommended: no federation in the first release; keep the event model close enough to Matrix
  that a bridge is possible.
- **Editor library.** Tiptap or BlockNote on ProseMirror and Yjs. Recommended: Tiptap, because
  the same core serves the mail composer and chat as `m-rich-text`, and Nextcloud Text and
  Frappe Wiki are Tiptap references.
- **Room booking without a policy.** Recommended: assigned at once; Maintenance's policies are
  opt-in per resource.
- **Digest email.** Recommended: a daily digest per topic preference, as Nextcloud Activity
  does, and mentions always immediate.
- **A form builder in Commons** (crosscut §8). Recommended: no; surveys and forms stay in
  Marketing with Customer Service and People including them.
- **The notification center's home.** `Commons/Notifications` here; it could be a top-level
  shell screen outside any app. Recommended: Commons, since approvals and reminders are things
  to do and Commons is where the user's own work lives.
- **Keyboard defaults.** Gmail-compatible or a BOSS set. Recommended: Gmail-compatible in
  mail and Slack-compatible in chat so no one relearns, with the gaps closed and everything
  editable.
- **Phone installation.** A PWA manifest and web push are framework work. Recommended: in the
  release that ships Chat, since chat without a phone notification is half a chat.
- **Where the Office app (WOPI) opens from.** The Files preview and New menu assume it.
  Recommended: Office's design file names the `Commons/Files` hooks it needs (open with, new
  document from template) and this file gains them at review.

// The suite shell's IronStone part (impl-drawers-commons.md M1): as john.doe the shellData transition of webroot.xml lists
// Commons and Comms with their shell-providers (screen/Commons.xml, screen/Comms.xml) and the theme values that
// data/BossSetupData.xml seeds on DEFAULT_QUASAR; shellSearch runs the Commons palette sources
// (service/ironstone/PaletteServices.xml): a demo task under Records, john.doe's own party under People (the group the
// client asks for with @John), and the id lookup of a demo request. Authorization stays on, as for a shell request.
// Run: ./moq test ironstone-boss --spec Shell
const webroot = "component://webroot/screen/webroot.xml"

// a transition of the root screen as the shell fetches it: the status, the errors and the JSON
function shellJson(path, parameters) {
    const str = ec.screen.makeTest().rootScreen(webroot).render(path, parameters || {}, null)
    let json = null
    try { json = JSON.parse(str.output) } catch (err) { json = null }
    return { status: str.status, errors: str.errorMessages.join(" | "), json, text: String(str.output || "").substring(0, 400) }
}
const groupsOf = (found) => (found.json && Array.isArray(found.json.groups) ? found.json.groups : [])
const groupOf = (found, name) => groupsOf(found).find((group) => group.group === name) || { rows: [] }

spec({
    setupSpec() {
        login("john.doe")
        // index the demo task now rather than wait for the data feed's worker
        ec.artifactExecution.disableAuthz()
        try {
            ec.search.indexDocuments(ec.entity.getDataDocuments("MantleTask", { workEffortId: "BOSS_DEMO_TASK" }))
        } finally {
            ec.artifactExecution.enableAuthz()
        }
    },
})

feature("shellData lists Commons and Comms with their providers and the IronStone theme values", {
    when() {
        const found = shellJson("shellData")
        const apps = found.json && Array.isArray(found.json.apps) ? found.json.apps : []
        const app = (name) => apps.find((item) => item.name === name) || { providers: {} }
        const commons = app("Commons").providers
        const comms = app("Comms").providers
        const keysOf = (providers) => (providers.keymaps || []).flatMap((map) => map.keys.map((key) => key.keys))
        return { status: found.status, text: found.text, shell: (found.json && found.json.shell) || {}, appNames: apps.map((item) => item.name),
            commonsTitle: app("Commons").title, commonsKinds: (commons.quickCreate || []).map((kind) => kind.kind),
            commonsKindUrls: (commons.quickCreate || []).map((kind) => kind.url), commonsIcons: (commons.quickCreate || []).map((kind) => kind.icon),
            sources: (commons.paletteSources || []).map((source) => source.group),
            peoplePrefix: ((commons.paletteSources || []).find((source) => source.group === "People") || {}).prefix,
            idPattern: ((commons.paletteSources || []).find((source) => source.group === "IdLookup") || {}).idPattern,
            types: commons.paletteTypes || [], commonsKeys: keysOf(commons), commonsKeyUrl: ((commons.keymaps || [])[0] || { keys: [{}] }).keys[1].url,
            account: (commons.accountMenuItems || []).map((item) => item.url), topics: commons.notificationTopics || [],
            commsKinds: (comms.quickCreate || []).map((kind) => kind.kind), commsKindUrls: (comms.quickCreate || []).map((kind) => kind.url),
            commsKeys: keysOf(comms) }
    },
    then({ status, text, shell, appNames, commonsTitle, commonsKinds, commonsKindUrls, commonsIcons, sources, peoplePrefix, idPattern, types,
            commonsKeys, commonsKeyUrl, account, topics, commsKinds, commsKindUrls, commsKeys }) {
        status == 200
        text.startsWith("{")
        appNames.includes("Commons")
        appNames.includes("Comms")
        commonsTitle == "IronStone Commons"
        // the kinds open the theme's quick-create screen with their kind
        commonsKinds == ["task", "event", "note", "contact", "request"]
        commonsKindUrls[0] == "/qapps/Commons/QuickCreate?kind=task"
        commonsKindUrls[4] == "/qapps/Commons/QuickCreate?kind=request"
        commonsIcons == ["sym_o_task_alt", "sym_o_event", "sym_o_sticky_note_2", "sym_o_person", "sym_o_support"]
        sources == ["IdLookup", "Records", "People", "Pages", "Events"]
        peoplePrefix == "@"
        idPattern.length > 0
        types == ["MantleParty", "MantleTask", "MantleEvent", "MantleRequest", "MantleProject", "MantleWikiPage", "MantleCommunicationEvent"]
        commonsKeys == ["g h", "g c", "g k", "g l", "g f", "g n"]
        commonsKeyUrl == "/qapps/Commons/Contacts"
        account == ["/qapps/Commons/Settings/Preferences", "/qapps/Commons/Settings/Account"]
        topics.includes("ChatterMention")
        commsKinds == ["email", "chatMessage"]
        commsKindUrls == ["/qapps/Comms/Inbox/Compose", "/qapps/Comms/Panel/Chat"]
        commsKeys == ["g i"]
        // the theme values: links for the screens, the subscreen names as written
        shell.trayToday == "/qapps/Commons/Panel/Today"
        shell.trayChat == "/qapps/Comms/Panel/Chat"
        shell.trayNotifications == "/qapps/Commons/Panel/Notifications"
        shell.quickCreate == "/qapps/Commons/QuickCreate"
        shell.inboxScreen == "/qapps/Comms/Inbox"
        shell.chatterScreen == "Chatter"
        shell.recordFilesScreen == "RecordFiles"
    },
})

feature("shellSearch finds the demo task under Records, with Commons/Search as its more link", {
    when() {
        const found = shellJson("shellSearch", { text: "Review open support" })
        const records = groupOf(found, "Records")
        const task = records.rows.find((row) => row.title === "Review the open support requests") || {}
        return { status: found.status, text: found.text, groupNames: groupsOf(found).map((group) => group.group), task, moreUrl: records.moreUrl }
    },
    then({ status, text, groupNames, task, moreUrl }) {
        status == 200
        text.startsWith("{")
        groupNames.includes("Records")
        // not an id, so no id lookup
        !groupNames.includes("IdLookup")
        task.url == "/qapps/Commons/Tasks/TaskDetail?workEffortId=BOSS_DEMO_TASK"
        task.icon == "sym_o_task_alt"
        task.subtitle.includes("Task")
        moreUrl == "/qapps/Commons/Search?q=Review%20open%20support"
    },
})

feature("shellSearch with the People group (the @ prefix) finds john.doe's own party", {
    when() {
        const found = shellJson("shellSearch", { text: "John", groups: "People", limit: "20" })
        const people = groupOf(found, "People")
        const john = people.rows.find((row) => String(row.url).endsWith("partyId=EX_JOHN_DOE")) || {}
        return { status: found.status, text: found.text, groupNames: groupsOf(found).map((group) => group.group), john }
    },
    then({ status, text, groupNames, john }) {
        status == 200
        text.startsWith("{")
        groupNames == ["People"]
        john.title == "John Doe"
        john.url == "/qapps/Commons/Contacts/ContactDetail?partyId=EX_JOHN_DOE"
        john.icon == "sym_o_person"
    },
})

feature("shellSearch looks up an id: the demo request first, to its Commons screen", {
    when() {
        const found = shellJson("shellSearch", { text: "BOSS_DEMO_REQUEST" })
        const groups = groupsOf(found)
        const lookup = groupOf(found, "IdLookup")
        return { status: found.status, text: found.text, firstGroup: groups.length ? groups[0].group : null, rows: lookup.rows }
    },
    then({ status, text, firstGroup, rows }) {
        status == 200
        text.startsWith("{")
        firstGroup == "IdLookup"
        rows.length == 1
        rows[0].title == "Set up the shared team calendar"
        rows[0].url == "/qapps/Commons/Requests/RequestDetail?requestId=BOSS_DEMO_REQUEST"
        rows[0].icon == "sym_o_support"
    },
})

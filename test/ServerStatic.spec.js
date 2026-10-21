// Server-static qvt for the Commons and Comms screens (README "Significant redesigns" 3, mr-moqui plans/archive/QvtServerStatic.md):
// ec.screen.staticReport runs the static half and the full check (an html render with the real actions and the wrapped ec) on
// each plain XML screen with the demo record AppStructure uses, as john.doe. A screen marked server-static="qvt" must come back
// clean; the list of the others and why is logged, for impl-drawers-commons.md §8.
// Run: ./moq test ironstone-boss --spec ServerStatic
const base = "component://ironstone-boss/screen"
let screens

// [root screen location, path under it, location] of the plain XML screens (not .qvue, not placeholders) under the roots
function findScreenFiles(appList) {
    const found = []
    for (const app of appList) {
        const files = []
        ec.resource.getLocationReference(`${base}/${app}.xml`).walkChildTree(files, null)
        for (const file of files) {
            if (file.path === app || !file.location.endsWith(".xml")) continue
            const text = ec.resource.getLocationReference(file.location).getText()
            if (/render-modes="[^"]*qvue/.test(text) || text.includes('<label text="Placeholder:')) continue
            found.push([`${base}/${app}.xml`, file.path.substring(app.length + 1), file.location, /server-static="[^"]*\bqvt\b/.test(text)])
        }
    }
    return found
}

// the id parameters of the screens that open on one demo record (as AppStructure's demoRecords)
const demoParameters = {
    "Commons/QuickCreate": { kind: "task" },
    "Commons/Calendar/EventDetail": { workEffortId: "BOSS_DEMO_EVENT" },
    "Commons/Calendar/Schedules/ResourceDetail": { resourceType: "room", resourceId: "BOSS_DEMO_ROOM_MAPLE" },
    "Commons/Requests/RequestDetail": { requestId: "BOSS_DEMO_REQUEST" },
    "Commons/Tasks/TaskDetail": { workEffortId: "BOSS_DEMO_TASK_PLAN" },
    "Commons/Contacts/ContactDetail": { partyId: "ORG_ACME_BA" },
    "Commons/Contacts/Compare": { partyId: "BOSS_DEMO_DUP_A", otherPartyId: "BOSS_DEMO_DUP_B" },
    "Commons/Knowledge/SpaceDetail": { wikiSpaceId: "BOSSKB" },
    "Commons/Files/DriveSettings": { driveId: "BOSS_DEMO_TEAM" },
    "Comms/Inbox/MessageDetail": { emailMessageId: "BOSS_DEMO_MAIL_INVOICE" },
    "Comms/Settings/MailAccounts/Account": { emailAccountId: "BOSS_DEMO_MAIL_SUPPORT" },
    "Comms/Consent/Contact": { partyId: "BOSS_DEMO_CON_ALEX" },
}

spec({
    setupSpec() {
        login("john.doe")
        screens = findScreenFiles(["Commons", "Comms"])
    },
})

feature("the full check of every Commons and Comms XML screen; each one marked server-static is clean", {
    when() {
        const rows = []
        for (const [root, path, location, marked] of screens) {
            const app = root.substring(base.length + 1).replace(/\.xml$/, "")
            let report
            try {
                report = ec.screen.staticReport({ rootScreen: root, screenPath: path, parameters: demoParameters[`${app}/${path}`] || {} })
            } catch (err) {
                report = { verdict: "error", violations: [], reasons: [String(err && err.message ? err.message : err)] }
            }
            ec.message.clearErrors()
            // the app roots' always-actions organization setup is on every screen: listed once in the summary, not per screen
            const orgSetup = report.violations.some((violation) => violation.detail.includes("setup#UserOrganizationInfo"))
            const why = report.reasons.concat(report.violations.filter((violation) => !violation.detail.includes("setup#UserOrganizationInfo"))
                .map((violation) => `[${violation.kind}] ${violation.element} ${violation.detail}`))
            if (orgSetup && why.length == 0) why.push("only the root's always-actions setup#UserOrganizationInfo")
            rows.push({ key: `${app}/${path}`, marked, verdict: report.verdict, why })
        }
        log.warn("Server-static report:\n" + rows.map((row) => `${row.marked ? "M " : "  "}${row.verdict.padEnd(22)} ${row.key}`
            + (row.verdict === "clean" ? "" : "\n        " + row.why.slice(0, 6).join("\n        "))).join("\n"))
        return { rows }
    },
    then({ rows }) {
        rows.length > 40
        rows.filter((row) => row.marked && row.verdict !== "clean").map((row) => `${row.key}: ${row.verdict} ${row.why.join("; ")}`).join("\n") == ""
    },
})

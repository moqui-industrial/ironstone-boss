// The IronStone app structure (MoquiConf.xml and screen/): every app root renders its default screen, and every
// placeholder screen under the roots and in screen/Shared renders in qvt without errors; at each of those paths the shell's
// menu data builds, which also defines the sibling and default screens the menu lists. Placeholders are found by their
// "Placeholder:" label. Every other screen under the Commons, Comms and Insights roots and in screen/Shared (the screens
// built there and the ones moved from the first SimpleScreens port) renders the same way, on the demo records of
// data/BossDemoData.xml, and shows them.
// Run: ./moq test ironstone-boss
const base = "component://ironstone-boss/screen"
const apps = ["Commons", "Comms", "Sales", "Marketing", "CustomerService", "Commerce", "Products", "Purchasing", "Warehouse",
    "Manufacturing", "Maintenance", "Accounting", "People", "Projects", "Insights", "Admin"]
let placeholders, screens

// the menu data the shell fetches for a path under the apps root, as an error text or null
function menuError(path) {
    const str = ec.screen.makeTest().rootScreen("component://webroot/screen/webroot.xml").render(`menuData/apps/${path}`, {}, null)
    if (str.status == 200 && str.errorMessages.length == 0 && str.output.startsWith("[")) return null
    return `menu of ${path}: status ${str.status}, ${str.errorMessages.join(" | ") || str.output.substring(0, 200)}`
}

// a screen file whose text has a placeholder label
function isPlaceholder(location) {
    return ec.resource.getLocationReference(location).getText().includes('<label text="Placeholder:')
}

// [root screen location, path under it] of every screen file under the roots of appList and in screen/Shared that
// matches(location)
function findScreenFiles(appList, matches) {
    const found = []
    for (const app of appList) {
        const files = []
        ec.resource.getLocationReference(`${base}/${app}.xml`).walkChildTree(files, null)
        for (const file of files) {
            // the walk's paths start with the root's own name: Commons, Commons/Home, …
            if (file.path !== app && file.location.endsWith(".xml") && matches(file.location))
                found.push([`${base}/${app}.xml`, file.path.substring(app.length + 1)])
        }
    }
    for (const fileRef of ec.resource.getLocationReference(`${base}/Shared`).getDirectoryEntries())
        if (fileRef.location.endsWith(".xml") && matches(fileRef.location)) found.push([fileRef.location, ""])
    return found
}

// what a screen shows of the demo records (data/BossDemoData.xml), by app and path, with the id parameters of a screen
// that opens on one
const demoRecords = {
    // M2: Today, notifications, quick create, Home and the settings (the demo of service/ironstone/DemoServices.xml), on text
    // that does not depend on the time of day the data was loaded
    "Commons/Home": { text: "Set up IronStone" },
    "Commons/Panel/Today": { text: "1 approval waiting" },
    "Commons/Panel/Notifications": { text: "Approve the shared calendar subscription: USD 120.00 a year" },
    "Commons/Notifications": { text: "Approve the shared calendar subscription: USD 120.00 a year" },
    "Commons/QuickCreate": { parameters: { kind: "task" }, text: "Assignee" },
    "Commons/Settings/Index": { text: "Comms settings" },
    "Commons/Settings/Notifications": { text: "Purchase Approval (demo)" },
    "Commons/Settings/Preferences": { text: "Keyboard shortcuts" },
    "Commons/Settings/Account": { text: "john.doe" },
    "Commons/Calendar/EventDetail": { parameters: { workEffortId: "BOSS_DEMO_EVENT" }, text: "Weekly team meeting" },
    "Commons/Requests": { text: "Set up the shared team calendar" },
    "Commons/Requests/RequestDetail": { parameters: { requestId: "BOSS_DEMO_REQUEST" }, text: "Set up the shared team calendar" },
    "Commons/Tasks": { text: "Review the open support requests" },
    "Commons/Tasks/TaskDetail": { parameters: { workEffortId: "BOSS_DEMO_TASK" }, text: "Review the open support requests" },
    "Comms/Inbox": { text: "Question about the team calendar" },
    "Comms/Inbox/MessageDetail": { parameters: { communicationEventId: "BOSS_DEMO_MESSAGE" }, text: "Question about the team calendar" },
    "Insights/ReportBuilder/Datasets": { text: "BOSS_DEMO_PRODUCTS" },
    "Insights/ReportBuilder/DatasetDetail": { parameters: { dataDocumentId: "BOSS_DEMO_PRODUCTS" }, text: "Products" },
    "Insights/ReportBuilder/DatasetDetail/FieldList": { parameters: { dataDocumentId: "BOSS_DEMO_PRODUCTS" }, text: "productName" },
    "Insights/ReportBuilder/DatasetView": { parameters: { dataDocumentId: "BOSS_DEMO_PRODUCTS" }, text: "Demo Product One-One" },
    "Insights/ScheduledReports": { text: "Open tasks by priority" },
    "Insights/ScheduledReports/ScheduledReportDetail": { parameters: { screenScheduledId: "BOSS_DEMO_MY_TASKS" }, text: "Open tasks" },
}

spec({
    setupSpec() {
        login("john.doe")
        placeholders = findScreenFiles(apps, isPlaceholder)
        screens = findScreenFiles(["Commons", "Comms", "Insights"], (location) => !isPlaceholder(location))
    },
    setup() { ec.artifactExecution.disableAuthz() },
    cleanup() { ec.artifactExecution.enableAuthz() },
})

feature("app root #app renders its default screen and its menu", {
    where: apps.map((app) => ({ app })),
    expect({ app }) {
        const str = ec.screen.makeTest().rootScreen(`${base}/${app}.xml`).renderMode("qvt").render("", {}, null)
        str.status == 200
        str.errorMessages.length == 0
        !/Error rendering|Exception in render/.test(str.output)
        menuError(app) == null
    },
})

feature("every placeholder screen renders in qvt without errors, with its menu", {
    when() {
        const failures = []
        for (const [root, path] of placeholders) {
            // the screen as the shell fetches it: a fragment of the last standalone screen, not the root placeholder
            const str = ec.screen.makeTest().rootScreen(root).renderMode("qvt").render(path, { lastStandalone: "-2" }, null)
            const where = `${root.substring(base.length + 1)} ${path}`.trim()
            if (str.status != 200 || str.errorMessages.length > 0 || !str.output.includes("Placeholder:")
                    || /Error rendering|Exception in render/.test(str.output))
                failures.push(`${where}: status ${str.status}, ${str.errorMessages.join(" | ") || "no placeholder text"}`)
            ec.message.clearErrors()
            // a Shared screen is not mounted, so it has no menu of its own
            const app = root.substring(base.length + 1).replace(/\.xml$/, "")
            const menu = apps.includes(app) ? menuError(`${app}/${path}`) : null
            if (menu) failures.push(menu)
            ec.message.clearErrors()
        }
        if (failures.length) log.warn(`Placeholder failures:\n${failures.join("\n")}`)
        return { failures }
    },
    then({ failures }) {
        placeholders.length > 130
        failures.join("\n") == ""
    },
})

feature("every other Commons, Comms, Insights and Shared screen renders in qvt without errors, with its menu", {
    when() {
        const failures = []
        for (const [root, path] of screens) {
            const app = root.substring(base.length + 1).replace(/\.xml$/, "")
            const demo = demoRecords[`${app}/${path}`] || {}
            const parameters = Object.assign({ lastStandalone: "-2" }, demo.parameters)
            const str = ec.screen.makeTest().rootScreen(root).renderMode("qvt").render(path, parameters, null)
            const where = `${root.substring(base.length + 1)} ${path}`.trim()
            const output = str.output || ""
            if (str.status != 200 || str.errorMessages.length > 0 || /Error rendering|Exception in render/.test(output))
                failures.push(`${where}: status ${str.status}, ${str.errorMessages.join(" | ") || output.substring(0, 200)}`)
            else if (demo.text && !output.includes(demo.text)) failures.push(`${where}: no "${demo.text}"`)
            ec.message.clearErrors()
            const menu = apps.includes(app) ? menuError(`${app}/${path}`) : null
            if (menu) failures.push(menu)
            ec.message.clearErrors()
        }
        if (failures.length) log.warn(`Screen failures:\n${failures.join("\n")}`)
        return { failures }
    },
    then({ failures }) {
        screens.length > 15
        failures.join("\n") == ""
    },
})

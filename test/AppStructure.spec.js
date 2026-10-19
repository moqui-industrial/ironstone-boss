// The IronStone app structure (MoquiConf.xml and screen/): every app root renders its default screen, and every
// placeholder screen under the roots and in screen/Shared renders in qvt without errors; at each of those paths the shell's
// menu data builds, which also defines the sibling and default screens the menu lists. Placeholders are found by their
// "Placeholder:" label, so the screens moved from the first port, not converted to JavaScript yet, are not rendered here.
// Run: ./moq test ironstone-boss
const base = "component://ironstone-boss/screen"
const apps = ["Commons", "Comms", "Sales", "Marketing", "CustomerService", "Commerce", "Products", "Purchasing", "Warehouse",
    "Manufacturing", "Maintenance", "Accounting", "People", "Projects", "Insights", "Admin"]
let placeholders

// the menu data the shell fetches for a path under the apps root, as an error text or null
function menuError(path) {
    const str = ec.screen.makeTest().rootScreen("component://webroot/screen/webroot.xml").render(`menuData/apps/${path}`, {}, null)
    if (str.status == 200 && str.errorMessages.length == 0 && str.output.startsWith("[")) return null
    return `menu of ${path}: status ${str.status}, ${str.errorMessages.join(" | ") || str.output.substring(0, 200)}`
}

// [root screen location, path under it] of every screen file whose text has a placeholder label
function findPlaceholders() {
    const found = []
    const isPlaceholder = (location) => location.endsWith(".xml")
        && ec.resource.getLocationReference(location).getText().includes('<label text="Placeholder:')
    for (const app of apps) {
        const files = []
        ec.resource.getLocationReference(`${base}/${app}.xml`).walkChildTree(files, null)
        for (const file of files) {
            // the walk's paths start with the root's own name: Commons, Commons/Home, …
            if (file.path !== app && isPlaceholder(file.location))
                found.push([`${base}/${app}.xml`, file.path.substring(app.length + 1)])
        }
    }
    for (const fileRef of ec.resource.getLocationReference(`${base}/Shared`).getDirectoryEntries())
        if (isPlaceholder(fileRef.location)) found.push([fileRef.location, ""])
    return found
}

spec({
    setupSpec() {
        login("john.doe")
        placeholders = findPlaceholders()
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
        placeholders.length > 140
        failures.join("\n") == ""
    },
})

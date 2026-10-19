// Commons Home's setup card and the Commons settings (screen/Commons/Home.xml, screen/Commons/Settings/*;
// impl-drawers-commons.md M2): NotificationSettings lists the topics by inbox and saves john.doe's in-app, email and daily
// digest choice (NotificationTopicUser.digest); Preferences saves the appearance and a key binding into the KEYMAP preference
// and resets it; the setup card's Done and Dismiss are kept in COMMONS_SETUP; Account changes only the signed-in user.
// Run: ./moq test ironstone-boss --spec CommonsSettings
const webroot = "component://webroot/screen/webroot.xml"
const commons = "component://ironstone-boss/screen/Commons.xml"

function render(path, parameters) {
    const str = ec.screen.makeTest().rootScreen(webroot).renderMode("qvt").render(`apps/Commons/${path}`, Object.assign({ lastStandalone: "true" }, parameters || {}), null)
    const output = String(str.output || "")
    ec.message.clearErrors()
    return { status: str.status, errors: str.errorMessages.join(" | "), output, broken: /Error rendering|Exception in render/.test(output) }
}
function post(path, parameters) {
    const str = ec.screen.makeTest().rootScreen(commons).render(path, parameters || {}, "post")
    let json = null
    try { json = JSON.parse(str.output) } catch (err) { json = null }
    ec.message.clearErrors()
    return { status: str.status, errors: str.errorMessages.join(" | "), json: json || {}, text: String(str.output || "").substring(0, 300) }
}
function sys(run) {
    const wasDisabled = ec.artifactExecution.disableAuthz()
    try { return run() } finally { if (!wasDisabled) ec.artifactExecution.enableAuthz() }
}
const one = (entityName, fields) => sys(() => ec.entity.find(entityName).condition(fields).one())

spec({
    setupSpec() { login("john.doe") },
})

feature("NotificationSettings lists the topics by inbox, the providers' private ones too", {
    when() { return render("Settings/Notifications") },
    then({ status, errors, output, broken }) {
        status == 200
        errors == ""
        !broken
        output.includes("Notifications inbox")
        output.includes("Updates inbox")
        // ChatterMention is private, a Commons notification-topic provider
        output.indexOf("Mentioned on a Record") < output.indexOf("Updates inbox")
        output.indexOf("Updates inbox") < output.indexOf("Activity on a Followed Record")
        output.includes("Daily digest")
    },
})

feature("NotificationSettings saves the daily digest of a topic for john.doe", {
    when() {
        const saved = post("Settings/Notifications/storeTopic", { topic: "WorkEffortReminder", receiveNotifications: "Y", digest: "Y" })
        const row = one("moqui.security.user.NotificationTopicUser", { topic: "WorkEffortReminder", userId: "EX_JOHN_DOE" })
        const rows = sys(() => call("ironstone.CommonsServices.get#NotificationTopicRows", { providerTopics: ["WorkEffortReminder"] }))
        return { saved, row, shown: rows.notificationsRows.find((topic) => topic.topic === "WorkEffortReminder") }
    },
    then({ saved, row, shown }) {
        saved.errors == ""
        row.digest == "Y"
        row.receiveNotifications == "Y"
        row.emailNotifications == "N"
        shown.digest == "Y"
    },
})

feature("Preferences shows the keys of the shell and of the apps, saves an override in KEYMAP and resets it", {
    when() {
        const before = render("Settings/Preferences")
        const saved = post("Settings/Preferences/setKey", { scope: "global", id: "g c", keys: "g x", defaultKeys: "g c" })
        const keymap = ec.user.getPreference("KEYMAP")
        const after = render("Settings/Preferences")
        const reset = post("Settings/Preferences/resetKey", { scope: "global", id: "g c" })
        return { before, saved, keymap, after, reset, cleared: ec.user.getPreference("KEYMAP") }
    },
    then({ before, saved, keymap, after, reset, cleared }) {
        before.status == 200
        before.errors == ""
        before.output.includes("Search and go to (the palette)")
        before.output.includes("Contacts")
        saved.errors == ""
        JSON.parse(keymap).global["g c"] == "g x"
        after.output.includes("Reset to g c")
        reset.errors == ""
        !cleared
    },
})

feature("Preferences saves the appearance and answers a page load", {
    when() {
        const saved = post("Settings/Preferences/saveAppearance", { darkMode: "Y", density: "compact", startApp: "Commons" })
        return { saved, dark: ec.user.getPreference("QUASAR_DARK"), left: ec.user.getPreference("QUASAR_LEFT_OPEN"),
            density: ec.user.getPreference("SHELL_DENSITY"), start: ec.user.getPreference("SHELL_START_APP") }
    },
    then({ saved, dark, left, density, start }) {
        saved.errors == ""
        saved.json.redirectUrl == "/qapps/Commons/Settings/Preferences"
        dark == "true"
        left == "false"
        density == "compact"
        start == "Commons"
    },
})

feature("the setup card keeps Done and Dismiss, and goes when every item is", {
    when() {
        const first = render("Home")
        post("Home/setSetup", { item: "mailAccount", state: "done" })
        const done = render("Home")
        post("Home/setSetup", { item: "all", state: "dismissed" })
        const dismissed = render("Home")
        return { first, done, dismissed, states: JSON.parse(ec.user.getPreference("COMMONS_SETUP")) }
    },
    then({ first, done, dismissed, states }) {
        first.status == 200
        first.errors == ""
        first.output.includes("Add a mail account")
        first.output.includes("Due today")
        first.output.includes("Requests assigned")
        !done.output.includes("Add a mail account")
        done.output.includes("Import contacts")
        !dismissed.output.includes("Set up IronStone")
        states.mailAccount == "done"
        states.importContacts == "dismissed"
    },
})

feature("Account changes the signed-in user only, whatever user the request names", {
    when() {
        const saved = post("Settings/Account/updateAccount", { userId: "ORG_ZIZI_JD", partyId: "ORG_ZIZI_JD", firstName: "Johnny", lastName: "Doe", timeZone: "US/Central" })
        return { saved, john: one("mantle.party.Person", { partyId: "EX_JOHN_DOE" }), joe: one("mantle.party.Person", { partyId: "ORG_ZIZI_JD" }),
            page: render("Settings/Account") }
    },
    then({ saved, john, joe, page }) {
        saved.errors == ""
        john.firstName == "Johnny"
        joe.firstName == "Joe"
        page.status == 200
        page.errors == ""
        page.output.includes("Two-factor sign-in")
        page.output.includes("Where you are signed in")
    },
    cleanup() { sys(() => call("update#mantle.party.Person", { partyId: "EX_JOHN_DOE", firstName: "John" })) },
})

feature("the settings index links every settings page", {
    when() { return render("Settings") },
    then({ status, errors, output }) {
        status == 200
        errors == ""
        output.includes("Notification settings")
        output.includes("Comms settings")
    },
})

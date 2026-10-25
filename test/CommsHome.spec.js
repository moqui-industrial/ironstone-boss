// Comms Home (screen/Comms/Home.xml, service/ironstone/CommsHomeServices.xml; design-drawers-commons.md §12 Home): the counters per
// mail account and for the internal messages, flagged, snoozed, mentions and Not sent; the account whose sign-in failed (the demo's
// Support) with Fix for its owner only; Needs reply; a follow-up email and a meeting with a join link of this spec's own; the
// mailboxes with unread (the demo's Office announcements); the shortcuts. Each part stands alone: a user with no party and no mail
// still gets the page. joe.developer sees his own counts, Support (which he shares) without Fix, and none of john.doe's account.
// Run: ./moq test mr-boss --spec CommsHome
const webroot = "component://webroot/screen/webroot.xml"
const FOLLOW_UP = "BOSS_TEST_HOME_FOLLOWUP", MEETING = "BOSS_TEST_HOME_MEETING"

function render(parameters) {
    const str = ec.screen.makeTest().rootScreen(webroot).renderMode("qvt").withStaticData().render("apps/Comms/Home", Object.assign({ lastStandalone: "true" }, parameters || {}), null)
    const output = String(str.output || "")
    ec.message.clearErrors()
    return { status: str.status, errors: str.errorMessages.join(" | "), output, broken: /Error rendering|Exception in render/.test(output) }
}
function sys(run) {
    const wasDisabled = ec.artifactExecution.disableAuthz()
    try { return run() } finally { if (!wasDisabled) ec.artifactExecution.enableAuthz() }
}
const home = () => sys(() => call("ironstone.CommsHomeServices.get#CommsHome", {}))
const card = (out, key) => (out.cardList || []).find((item) => item.key == key)

spec({
    setupSpec() {
        sys(() => {
            call("ironstone.MailDemoServices.load#MailDemo", {})
            call("ironstone.MailDemoServices.load#MailSettingsDemo", {})
            const now = Date.now()
            const store = (entityName, fields) => ec.service.sync().name("store#" + entityName).parameters(fields).call()
            store("mantle.work.effort.WorkEffort", { workEffortId: FOLLOW_UP, workEffortTypeEnumId: "WetTask", purposeEnumId: "WepEmail", statusId: "WeApproved",
                workEffortName: "Email the price list to Acme", ownerPartyId: "EX_JOHN_DOE", estimatedCompletionDate: new Date(now + 86400000) })
            store("mantle.work.effort.WorkEffortParty", { workEffortId: FOLLOW_UP, partyId: "EX_JOHN_DOE", roleTypeId: "Assignee", fromDate: new Date(now - 86400000),
                statusId: "WeptAssigned" })
            store("mantle.work.effort.WorkEffort", { workEffortId: MEETING, workEffortTypeEnumId: "WetEvent", purposeEnumId: "WepMeeting", statusId: "WeApproved",
                workEffortName: "Pricing call with Acme", ownerPartyId: "EX_JOHN_DOE", infoUrl: "https://meet.example.com/pricing",
                estimatedStartDate: new Date(now + 2 * 3600000), estimatedCompletionDate: new Date(now + 3 * 3600000) })
            store("mantle.work.effort.WorkEffortParty", { workEffortId: MEETING, partyId: "EX_JOHN_DOE", roleTypeId: "Assignee", fromDate: new Date(now - 86400000),
                statusId: "WeptAssigned" })
            if (ec.entity.find("moqui.security.UserAccount").condition("userId", "commsHomeNobody").count() == 0) {
                const user = ec.entity.makeValue("moqui.security.UserAccount")
                user.setFields({ userId: "commsHomeNobody", username: "commsHomeNobody", userFullName: "No Party" }, true, null, null)
                user.create()
            }
        })
        login("john.doe")
    },
    cleanupSpec() {
        login("john.doe")
        sys(() => {
            for (const id of [FOLLOW_UP, MEETING]) {
                ec.entity.find("mantle.work.effort.WorkEffortParty").condition("workEffortId", id).deleteAll()
                ec.entity.find("mantle.work.effort.WorkEffort").condition("workEffortId", id).deleteAll()
            }
        })
    },
})

feature("john.doe's Home: a counter per account and for the messages, the failed sign-in with Fix, the lists and the shortcuts", {
    when() { return { page: render({}), out: home() } },
    then({ page, out }) {
        page.status == 200
        page.errors == ""
        !page.broken
        out.failedParts.length == 0
        out.hasMailAccount
        card(out, "account_BOSS_DEMO_MAIL_ACCT").title == "John Doe"
        card(out, "account_BOSS_DEMO_MAIL_ACCT").link == "/qapps/Comms/Inbox?account=BOSS_DEMO_MAIL_ACCT"
        Number(card(out, "account_BOSS_DEMO_MAIL_ACCT").value) >= 4
        card(out, "account_BOSS_DEMO_MAIL_SUPPORT").title == "Support"
        card(out, "internal").link == "/qapps/Comms/Inbox?view=internal"
        Number(card(out, "flagged").value) >= 1
        card(out, "snoozed") != null
        card(out, "mentions") != null
        card(out, "notSent").link == "/qapps/Comms/Inbox?view=outbox"
        out.problemAccountList.map((problem) => problem.emailAccountId) == ["BOSS_DEMO_MAIL_SUPPORT"]
        out.problemAccountList[0].canManage
        out.problemAccountList[0].link.includes("fix=Y")
        out.followUpList.some((item) => item.workEffortId == FOLLOW_UP && item.kindLabel == "Email")
        out.meetingList.some((item) => item.workEffortId == MEETING && item.joinUrl == "https://meet.example.com/pricing")
        out.mailboxList.some((box) => box.contactListId == "BOSS_DEMO_MBX_OFFICE" && box.link == "/qapps/Comms/Inbox?mailbox=BOSS_DEMO_MBX_OFFICE")
        out.needsReplyList.every((row) => row.link.startsWith("/qapps/Comms/Inbox?thread="))
        page.output.includes("Support: the sign-in failed")
        page.output.includes("Email the price list to Acme")
        page.output.includes("Pricing call with Acme")
        page.output.includes("https://meet.example.com/pricing")
        page.output.includes("Office announcements")
        page.output.includes("Snoozed")
        page.output.includes("New room")
        !page.output.includes("Add your email account")
    },
})

feature("joe.developer's Home has his counts and Support without Fix, none of john.doe's mail; a user with no party still gets the page", {
    when() {
        login("joe.developer")
        const joe = { page: render({}), out: sys(() => call("ironstone.CommsHomeServices.get#CommsHome", {})) }
        ec.user.internalLoginUser("commsHomeNobody")
        const nobody = { page: render({}), out: sys(() => call("ironstone.CommsHomeServices.get#CommsHome", {})) }
        login("john.doe")
        return { joe, nobody }
    },
    then({ joe, nobody }) {
        joe.page.errors == ""
        !joe.page.broken
        card(joe.out, "account_BOSS_DEMO_MAIL_ACCT") == null
        card(joe.out, "account_BOSS_DEMO_MAIL_SUPPORT") != null
        joe.out.problemAccountList[0].canManage == false
        joe.page.output.includes("Its owner can fix it")
        !joe.out.followUpList.some((item) => item.workEffortId == FOLLOW_UP)
        !joe.out.meetingList.some((item) => item.workEffortId == MEETING)
        nobody.page.status == 200
        !nobody.page.broken
        nobody.out.hasMailAccount == false
        nobody.page.output.includes("Add your email account")
    },
})

// Commons Contacts (impl-drawers-commons.md M4; design-drawers-commons.md §6): the side list of the split (screen/Commons/Contacts/List.xml)
// by scope, search and letter; the contact record (template/ContactRecord.xml) of a directory party, a personal contact and an employee,
// with its tabs; editing a personal contact's information, names, notes, organization and relationships, and a directory party only by
// a contact admin; the bulk actions (add to group and book, remove from book, export vCard and CSV, merge two, delete); Duplicates with
// Compare, Merge and Not a duplicate; New contact opening the record, Link to a directory party, the contact's picture. Privacy (impl R7):
// Joe Developer's personal contacts (the demo's Sam Secret, and the spec's Sasha Hidden with the same email and phone as the spec's
// duplicate pair Kim and Kimberly Lund) never show to john.doe through the list (every scope, the search by name, email and phone), the
// record by id, its transitions, the palette's People source, Compare or Duplicates; john.doe's personal contacts never show to Joe
// Developer. The
// demo is data/BossDemoData.xml (M4). Authorization stays on, as for a browser request.
// Run: ./moq test ironstone-boss --spec Contacts
const webroot = "component://webroot/screen/webroot.xml"
const commons = "component://ironstone-boss/screen/Commons.xml"
const MARY = "BOSS_DEMO_PC_MARY", ROBIN = "BOSS_DEMO_PC_ROBIN", TOM = "BOSS_DEMO_PC_TOM", PIPES = "BOSS_DEMO_PC_PIPES", SAM = "BOSS_DEMO_PC_SAM"
// the spec's own duplicates, as the demo's Pat Quinn pair (a run of every component merges that one in CrmMiscServices), and Joe
// Developer's personal contact with their email and phone
const PAT = "BOSS_SPEC_DUP_A", PATRICIA = "BOSS_SPEC_DUP_B", QUINN_ORG = "BOSS_SPEC_ORG_A", QUINN_LLC = "BOSS_SPEC_ORG_B", SECRET = "BOSS_SPEC_SECRET"
const specParties = `<entity-facade-xml>
    <mantle.party.Party partyId="${PAT}" pseudoId="${PAT}" partyTypeEnumId="PtyPerson" disabled="N" hasDuplicates="Y"/>
    <mantle.party.Person partyId="${PAT}" firstName="Kim" lastName="Lund"/>
    <mantle.party.PartyRole partyId="${PAT}" roleTypeId="Customer"/>
    <mantle.party.contact.ContactMech contactMechId="${PAT}_EM" contactMechTypeEnumId="CmtEmailAddress" infoString="kim.lund@lund.example"/>
    <mantle.party.contact.PartyContactMech partyId="${PAT}" contactMechId="${PAT}_EM" contactMechPurposeId="EmailPrimary" fromDate="2026-10-01 09:00:00"/>
    <mantle.party.contact.ContactMech contactMechId="${PAT}_TN" contactMechTypeEnumId="CmtTelecomNumber"/>
    <mantle.party.contact.TelecomNumber contactMechId="${PAT}_TN" countryCode="1" areaCode="555" contactNumber="010-0151"/>
    <mantle.party.contact.PartyContactMech partyId="${PAT}" contactMechId="${PAT}_TN" contactMechPurposeId="PhonePrimary" fromDate="2026-10-01 09:00:00"/>
    <mantle.party.Party partyId="${PATRICIA}" pseudoId="${PATRICIA}" partyTypeEnumId="PtyPerson" disabled="N" hasDuplicates="Y" comments="Met at the spring fair."/>
    <mantle.party.Person partyId="${PATRICIA}" firstName="Kimberly" lastName="Lund" nickname="Kim"/>
    <mantle.party.PartyRole partyId="${PATRICIA}" roleTypeId="Customer"/>
    <mantle.party.contact.ContactMech contactMechId="${PATRICIA}_EM" contactMechTypeEnumId="CmtEmailAddress" infoString="kim.lund@lund.example"/>
    <mantle.party.contact.PartyContactMech partyId="${PATRICIA}" contactMechId="${PATRICIA}_EM" contactMechPurposeId="EmailPrimary" fromDate="2026-10-02 09:00:00"/>
    <mantle.party.contact.ContactMech contactMechId="${PATRICIA}_TN" contactMechTypeEnumId="CmtTelecomNumber"/>
    <mantle.party.contact.TelecomNumber contactMechId="${PATRICIA}_TN" countryCode="1" areaCode="555" contactNumber="010-0151"/>
    <mantle.party.contact.PartyContactMech partyId="${PATRICIA}" contactMechId="${PATRICIA}_TN" contactMechPurposeId="PhoneWork" fromDate="2026-10-02 09:00:00"/>
    <mantle.party.contact.ContactMech contactMechId="${PATRICIA}_PA" contactMechTypeEnumId="CmtPostalAddress"/>
    <mantle.party.contact.PostalAddress contactMechId="${PATRICIA}_PA" address1="7 Fair Lane" city="Springfield" stateProvinceGeoId="USA_IL" postalCode="62702" countryGeoId="USA"/>
    <mantle.party.contact.PartyContactMech partyId="${PATRICIA}" contactMechId="${PATRICIA}_PA" contactMechPurposeId="PostalWork" fromDate="2026-10-02 09:00:00"/>
    <mantle.party.Party partyId="${QUINN_ORG}" pseudoId="${QUINN_ORG}" partyTypeEnumId="PtyOrganization" disabled="N"/>
    <mantle.party.Organization partyId="${QUINN_ORG}" organizationName="Lund Labs"/>
    <mantle.party.PartyRole partyId="${QUINN_ORG}" roleTypeId="Customer"/>
    <mantle.party.Party partyId="${QUINN_LLC}" pseudoId="${QUINN_LLC}" partyTypeEnumId="PtyOrganization" disabled="N"/>
    <mantle.party.Organization partyId="${QUINN_LLC}" organizationName="Lund Labs Inc"/>
    <mantle.party.PartyRole partyId="${QUINN_LLC}" roleTypeId="Customer"/>
    <mantle.party.Party partyId="${SECRET}" pseudoId="${SECRET}" partyTypeEnumId="PtyPerson" privateOwnerUserId="ORG_ZIZI_JD" disabled="N"/>
    <mantle.party.Person partyId="${SECRET}" firstName="Sasha" lastName="Hidden"/>
    <mantle.party.contact.ContactMech contactMechId="${SECRET}_EM" contactMechTypeEnumId="CmtEmailAddress" infoString="kim.lund@lund.example"/>
    <mantle.party.contact.PartyContactMech partyId="${SECRET}" contactMechId="${SECRET}_EM" contactMechPurposeId="EmailPrimary" fromDate="2026-10-01 09:00:00"/>
    <mantle.party.contact.ContactMech contactMechId="${SECRET}_TN" contactMechTypeEnumId="CmtTelecomNumber"/>
    <mantle.party.contact.TelecomNumber contactMechId="${SECRET}_TN" countryCode="1" areaCode="555" contactNumber="010-0151"/>
    <mantle.party.contact.PartyContactMech partyId="${SECRET}" contactMechId="${SECRET}_TN" contactMechPurposeId="PhoneMobile" fromDate="2026-10-01 09:00:00"/>
    <mantle.party.contact.ContactBookParty contactBookId="BOSS_DEMO_BOOK_JOE" partyId="${SECRET}" fromDate="2026-10-01 09:00:00"/>
</entity-facade-xml>`

function render(path, parameters) {
    const str = ec.screen.makeTest().rootScreen(webroot).renderMode("qvt").render(path, Object.assign({ lastStandalone: "true" }, parameters || {}), null)
    const output = String(str.output || "")
    ec.message.clearErrors()
    return { status: str.status, errors: str.errorMessages.join(" | "), output, broken: /Error rendering|Exception in render/.test(output) }
}
function post(path, parameters) {
    const str = ec.screen.makeTest().rootScreen(commons).render(path, parameters || {}, "post")
    const output = String(str.output || "")
    let json = null
    try { json = JSON.parse(output) } catch (err) { json = null }
    ec.message.clearErrors()
    return { status: str.status, errors: str.errorMessages.join(" | "), json: json || {}, output }
}
function shellJson(path, parameters) {
    const str = ec.screen.makeTest().rootScreen(webroot).render(path, parameters || {}, null)
    let json = null
    try { json = JSON.parse(str.output) } catch (err) { json = null }
    ec.message.clearErrors()
    return json || {}
}
function sys(run) {
    const wasDisabled = ec.artifactExecution.disableAuthz()
    try { return run() } finally { if (!wasDisabled) ec.artifactExecution.enableAuthz() }
}
const one = (entityName, fields) => sys(() => ec.entity.find(entityName).condition(fields).one())
const current = (entityName, fields) => sys(() => Array.from(ec.entity.find(entityName).condition(fields)
        .condition(ec.entity.conditionFactory.makeConditionDate("fromDate", "thruDate", null)).list()))
// the side list's rows, in order
const rowsOf = (output) => Array.from(output.matchAll(/data-party="([^"]+)"/g)).map((match) => match[1])
function list(parameters) { return render("apps/Commons/Contacts", Object.assign({ find: "Y" }, parameters || {})) }
const detail = (partyId, parameters) => render("apps/Commons/Contacts/ContactDetail", Object.assign({ partyId }, parameters || {}))
function as(username, run) {
    login(username)
    try { return run() } finally { login("john.doe") }
}

spec({
    setupSpec() {
        login("john.doe")
        sys(() => ec.entity.makeDataLoader().xmlText(specParties).load())
    },
})

feature("the split renders the side list and the first row's record, with the scopes, letters and bulk actions", {
    when() {
        const shown = list({ scope: "all" })
        return { shown, rows: rowsOf(shown.output) }
    },
    then({ shown, rows }) {
        shown.status == 200
        shown.errors == ""
        !shown.broken
        shown.output.includes("m-container-split")
        shown.output.includes('select-parameter="partyId"')
        shown.output.includes("Recently contacted")
        shown.output.includes("Not in a group")
        shown.output.includes("Add to group")
        shown.output.includes("Export vCard")
        shown.output.includes("Merge two")
        rows.includes("ORG_ACME_BA")
        rows.includes(MARY)
        rows.includes(PAT)
        !rows.includes(SAM)
        !rows.includes("_NA_")
        // the main pane: the record of the first row
        shown.output.includes(`record-id="${rows[0]}"`)
    },
})

feature("each scope lists its contacts: #scope", {
    where: [
        // the directory is large after other specs: narrowed by a name
        { scope: "all", text: "Doe", has: [MARY, "EX_JOHN_DOE"], hasNot: [SAM] },
        { scope: "all", text: "Lund", has: [PAT, PATRICIA, QUINN_ORG], hasNot: [SECRET] },
        { scope: "directory", text: "Doe", has: ["EX_JOHN_DOE"], hasNot: [MARY, SAM] },
        { scope: "directory", text: "Developer", has: ["ORG_ZIZI_JD", "ORG_ZIZI_BD"], hasNot: [SAM] },
        { scope: "mine", has: [MARY, ROBIN, TOM, PIPES, "ORG_ACME_BA"], hasNot: [PAT, SAM, "ORG_ZIZI_JD"] },
        { scope: "BOSS_DEMO_BOOK_JD", has: [MARY, ROBIN, TOM, "ORG_ACME_BA"], hasNot: [PAT, SAM] },
        { scope: "BOSS_DEMO_BOOK_TEAM", has: ["ORG_ACME_BA", "ORG_ZIZI_JD", "ORG_ZIZI_BD"], hasNot: [MARY, SAM] },
        { scope: "recent", has: [ROBIN], hasNot: [SAM] },
        { scope: "ungrouped", has: [TOM, PIPES, "ORG_ZIZI_JD"], hasNot: [MARY, ROBIN, "ORG_ACME_BA", SAM] },
    ],
    expect({ scope, text, has, hasNot }) {
        const shown = list(text ? { scope, text } : { scope })
        const rows = rowsOf(shown.output)
        shown.errors == ""
        !shown.broken
        has.filter((id) => !rows.includes(id)) == []
        hasNot.filter((id) => rows.includes(id)) == []
    },
})

feature("a book's group chips narrow the list: Family is Mary only", {
    when() {
        const shown = list({ scope: "BOSS_DEMO_BOOK_JD", contactBookGroupId: "BOSS_DEMO_GRP_FAMILY" })
        return { shown, rows: rowsOf(shown.output) }
    },
    then({ shown, rows }) {
        shown.errors == ""
        rows == [MARY]
        shown.output.includes("Family · 1")
        // Friends has Robin, and the contacts an import put there
        shown.output.includes("Friends · ")
    },
})

feature("the search finds by #what, and never Joe Developer's personal contact with the same email and phone", {
    where: [
        { what: "name", text: "Lund", has: [PAT, PATRICIA, QUINN_ORG, QUINN_LLC] },
        { what: "email", text: "kim.lund@lund", has: [PAT, PATRICIA] },
        { what: "phone", text: "010-0151", has: [PAT, PATRICIA] },
        { what: "organization", text: "Pipes and Sons", has: [TOM, PIPES] },
        { what: "the other user's contact's name", text: "Secret", has: [] },
    ],
    expect({ text, has }) {
        const shown = list({ scope: "all", text })
        const rows = rowsOf(shown.output)
        shown.errors == ""
        has.filter((id) => !rows.includes(id)) == []
        !rows.includes(SAM)
        !rows.includes(SECRET)
        !shown.output.includes("Sam Secret")
        !shown.output.includes("Sasha Hidden")
    },
})

feature("the alphabet jump narrows to the first letter, and the palette's People link (combinedName) searches", {
    when() {
        const letter = rowsOf(list({ scope: "mine", letter: "M" }).output)
        const palette = rowsOf(render("apps/Commons/Contacts", { combinedName: "Robin" }).output)
        return { letter, palette }
    },
    then({ letter, palette }) {
        letter == [MARY]
        palette.includes(ROBIN)
    },
})

feature("the contact record of a directory party, with its books and groups, and each tab (#tab)", {
    where: [
        { tab: "overview", partyId: "ORG_ACME_BA", texts: ["Bob Acme", "bob.acme@test.com", "Books and groups", "Team Contacts", "Customers", "Merge with…"] },
        { tab: "activity", partyId: "ORG_ACME_BA", texts: ["m-chatter", 'default-tab="message"'] },
        { tab: "calendar", partyId: "EX_JOHN_DOE", texts: ["Calendar setup review"] },
        { tab: "tasks", partyId: "EX_JOHN_DOE", texts: ["Review the open support requests"] },
        { tab: "requests", partyId: "ORG_ACME_BA", texts: ["Set up the shared team calendar", "Customer"] },
        { tab: "files", partyId: "ORG_ACME_BA", texts: ["m-record-files"] },
        { tab: "consent", partyId: "ORG_ACME_BA", texts: ["Edit in Comms Consent", "/qapps/Comms/Consent?partyId=ORG_ACME_BA"] },
    ],
    expect({ tab, partyId, texts }) {
        const shown = detail(partyId, { tab })
        shown.status == 200
        shown.errors == ""
        !shown.broken
        texts.filter((text) => !shown.output.includes(text)) == []
        !shown.output.includes("Private ·")
    },
})

feature("a personal contact shows the Private banner with its book; an employee shows the read-only directory card", {
    when() {
        return { mary: detail(MARY), joe: detail("ORG_ZIZI_JD") }
    },
    then({ mary, joe }) {
        mary.errors == ""
        mary.output.includes("Private · in My Contacts")
        mary.output.includes("mary.doe@example.com")
        mary.output.includes("1956-04-12")
        mary.output.includes("Link to a directory party")
        mary.output.includes("Family")
        mary.output.includes("Prefers a call to an email.")
        joe.errors == ""
        joe.output.includes("Directory card")
        joe.output.includes("Ziziwork Services")
        joe.output.includes("Manager: Bob Developer")
        joe.output.includes("Read only here: the employee record is in People.")
        // the chatter column beside the overview on the full screen
        joe.output.includes('id="ContactChatter"')
    },
})

feature("another user's personal contact is never available to john.doe: the record, its transitions, the palette, compare and duplicates", {
    when() {
        const record = detail(SAM)
        const inSplit = list({ scope: "all", text: "Sam" })
        const edit = post("Contacts/ContactDetail/contactInfoStore", { partyId: SAM, kind: "email", emailAddress: "taken@example.com" })
        const update = post("Contacts/ContactDetail/contactUpdate", { partyId: SAM, firstName: "Stolen" })
        const exported = post("Contacts/ContactDetail/contactExport", { partyId: SAM, format: "vcard" })
        const bulk = post("Contacts/List/bulkExport", { selectedPartyIds: `${SAM},${MARY}`, format: "vcard" })
        const favorite = post("Contacts/ContactDetail/contactFavorite", { partyId: SAM, isFavorite: "Y" })
        const peopleRows = (json) => ((json.groups || []).find((group) => group.group === "People") || { rows: [] }).rows.map((row) => String(row.url))
        const people = peopleRows(shellJson("shellSearch", { text: "Secret", groups: "People", limit: "20" }))
        const peopleByEmail = peopleRows(shellJson("shellSearch", { text: "kim.lund@lund.example", groups: "People", limit: "20" }))
        const compare = render("apps/Commons/Contacts/Compare", { partyId: SECRET, otherPartyId: PAT })
        const duplicates = render("apps/Commons/Contacts/Duplicates", {})
        return { record, inSplit, edit, update, exported, bulk, favorite, people, peopleByEmail, compare, duplicates,
            sam: one("mantle.party.Person", { partyId: SAM }), samEmails: current("mantle.party.contact.PartyContactMechInfo", { partyId: SAM }).length,
            samInJohnsBook: current("mantle.party.contact.ContactBookParty", { partyId: SAM, contactBookId: "BOSS_DEMO_BOOK_JD" }).length }
    },
    then({ record, inSplit, edit, update, exported, bulk, favorite, people, peopleByEmail, compare, duplicates, sam, samEmails, samInJohnsBook }) {
        record.status == 200
        record.output.includes("is not available")
        !record.output.includes("Sam Secret")
        !rowsOf(inSplit.output).includes(SAM)
        edit.errors.includes("Contact BOSS_DEMO_PC_SAM not found")
        update.errors.includes("Contact BOSS_DEMO_PC_SAM not found")
        !exported.output.includes("BEGIN:VCARD")
        bulk.output.includes("Mary")
        !bulk.output.includes("Secret")
        favorite.errors.includes("not found")
        people.length == 0
        peopleByEmail.filter((url) => url.includes(SECRET)) == []
        peopleByEmail.filter((url) => url.includes(PAT)).length == 1
        compare.output.includes("not found")
        !compare.output.includes("Sasha Hidden")
        !duplicates.output.includes("Sasha Hidden")
        !duplicates.output.includes(SECRET)
        sam.firstName == "Sam"
        samEmails == 2
        samInJohnsBook == 0
    },
})

feature("as Joe Developer: his own personal contact shows, john.doe's never do, and a directory party is read only", {
    when() {
        return as("joe.developer", () => {
            const all = rowsOf(list({ scope: "all" }).output)
            const sam = detail(SAM)
            const mary = detail(MARY)
            const people = ((shellJson("shellSearch", { text: "Mary", groups: "People", limit: "20" }).groups || []).find((group) => group.group === "People")
                    || { rows: [] }).rows.map((row) => String(row.url))
            const bob = detail("ORG_ACME_BA")
            const edit = post("Contacts/ContactDetail/contactUpdate", { partyId: "ORG_ACME_BA", firstName: "Robert" })
            const duplicates = render("apps/Commons/Contacts/Duplicates", {})
            return { all, sam, mary, people, bob, edit, duplicates }
        })
    },
    then({ all, sam, mary, people, bob, edit, duplicates }) {
        all.includes(SAM)
        !all.includes(MARY)
        !all.includes(ROBIN)
        !all.includes(TOM)
        sam.output.includes("Sam Secret")
        sam.output.includes("Private · in My Contacts")
        mary.output.includes("is not available")
        people.filter((url) => url.includes(MARY)) == []
        bob.output.includes("Bob Acme")
        !bob.output.includes("ContactEditDialog")
        edit.errors.includes("You may not change contact ORG_ACME_BA")
        duplicates.output.includes("Only contact admins review duplicates")
        one("mantle.party.Person", { partyId: "ORG_ACME_BA" }).firstName == "Bob"
    },
})

feature("john.doe edits his personal contact Mary: an email with a purpose, a changed phone, names, a note, an organization and a relationship", {
    when() {
        const addEmail = post("Contacts/ContactDetail/contactInfoStore", { partyId: MARY, kind: "email", emailAddress: "mary.home@example.com", emailPurposeId: "EmailOther" })
        const changePhone = post("Contacts/ContactDetail/contactInfoStore", { partyId: MARY, kind: "phone", contactMechId: "BOSS_DEMO_PC_MARY_TN",
            contactMechPurposeId: "PhoneMobile", phone: "+1 555 010 0162" })
        const addPurpose = post("Contacts/ContactDetail/contactInfoPurpose", { partyId: MARY, contactMechId: "BOSS_DEMO_PC_MARY_EM", contactMechPurposeId: "EmailBilling" })
        const removePurpose = post("Contacts/ContactDetail/contactInfoPurpose", { partyId: MARY, contactMechId: "BOSS_DEMO_PC_MARY_EM",
            contactMechPurposeId: "EmailBilling", remove: "true" })
        const names = post("Contacts/List/contactUpdate", { partyId: MARY, nickname: "Mom", comments: "Call on Sundays after lunch." })
        const note = post("Contacts/ContactDetail/contactNote", { partyId: MARY, noteText: "Birthday dinner at the Elm Street place." })
        const org = post("Contacts/ContactDetail/contactOrganization", { partyId: MARY, organizationPartyId: PIPES, jobTitle: "Bookkeeper" })
        const rel = post("Contacts/ContactDetail/contactRelationshipAdd", { partyId: MARY, otherPartyId: ROBIN, relationshipTypeEnumId: "PrtFriend", direction: "to" })
        // a directory party may not be related to a personal contact
        const badRel = post("Contacts/ContactDetail/contactRelationshipAdd", { partyId: "ORG_ACME_BA", otherPartyId: MARY, relationshipTypeEnumId: "PrtFriend", direction: "to" })
        const shown = detail(MARY)
        const expired = detail(MARY, { showExpired: "Y" })
        const infos = current("mantle.party.contact.PartyContactMechInfo", { partyId: MARY })
        const phones = current("mantle.party.contact.PartyContactMechTelecomNumber", { partyId: MARY })
        return { addEmail, changePhone, addPurpose, removePurpose, names, note, org, rel, badRel, shown, expired, infos, phones,
            person: one("mantle.party.Person", { partyId: MARY }), party: one("mantle.party.Party", { partyId: MARY }),
            relRows: current("mantle.party.PartyRelationship", { fromPartyId: MARY, toPartyId: ROBIN, relationshipTypeEnumId: "PrtFriend" }),
            orgRows: current("mantle.party.PartyRelationship", { fromPartyId: MARY, toPartyId: PIPES, relationshipTypeEnumId: "PrtContact" }) }
    },
    then({ addEmail, changePhone, addPurpose, removePurpose, names, note, org, rel, badRel, shown, expired, infos, phones, person, party, relRows, orgRows }) {
        addEmail.errors == ""
        changePhone.errors == ""
        addPurpose.errors == ""
        removePurpose.errors == ""
        names.errors == ""
        note.errors == ""
        org.errors == ""
        rel.errors == ""
        badRel.errors.includes("cannot be related to one of your personal contacts")
        infos.some((info) => info.infoString === "mary.home@example.com" && info.contactMechPurposeId === "EmailOther")
        !infos.some((info) => info.contactMechId === "BOSS_DEMO_PC_MARY_EM" && info.contactMechPurposeId === "EmailBilling")
        phones.length == 1
        phones[0].contactNumber == "010-0162"
        phones[0].contactMechPurposeId == "PhoneMobile"
        person.nickname == "Mom"
        party.comments == "Call on Sundays after lunch."
        relRows.length == 1
        orgRows.length == 1
        orgRows[0].relationshipName == "Bookkeeper"
        shown.output.includes("mary.home@example.com")
        shown.output.includes("Birthday dinner at the Elm Street place.")
        shown.output.includes("Bookkeeper · Pipes and Sons")
        shown.output.includes("Friend of Robin Fischer")
        expired.output.includes("Hide expired")
        expired.output.includes("+1 555 010-0161")
    },
})

feature("john.doe as a contact admin edits a directory party; the star of his default book", {
    when() {
        const add = post("Contacts/ContactDetail/contactInfoStore", { partyId: PAT, kind: "web", webAddress: "quinnco.example", webPurposeId: "WebUrlPrimary" })
        const unstar = post("Contacts/ContactDetail/contactFavorite", { partyId: MARY, contactBookId: "BOSS_DEMO_BOOK_JD", isFavorite: "N" })
        const star = post("Contacts/ContactDetail/contactFavorite", { partyId: PAT, contactBookId: "BOSS_DEMO_BOOK_JD", isFavorite: "Y" })
        return { add, unstar, star, web: current("mantle.party.contact.PartyContactMechInfo", { partyId: PAT, contactMechTypeEnumId: "CmtWebAddress" }),
            mary: current("mantle.party.contact.ContactBookParty", { partyId: MARY, contactBookId: "BOSS_DEMO_BOOK_JD" })[0],
            pat: current("mantle.party.contact.ContactBookParty", { partyId: PAT, contactBookId: "BOSS_DEMO_BOOK_JD" })[0] }
    },
    then({ add, unstar, star, web, mary, pat }) {
        add.errors == ""
        web.length == 1
        web[0].infoString == "https://quinnco.example"
        unstar.errors == ""
        star.errors == ""
        mary.isFavorite == "N"
        pat.isFavorite == "Y"
    },
})

feature("bulk actions: add to a group and a book (a personal contact stays out of a shared book), remove from the book", {
    when() {
        const toGroup = post("Contacts/List/bulkAddToGroup", { selectedPartyIds: `${TOM},${PIPES}`, contactBookGroupId: "BOSS_DEMO_GRP_FRIENDS" })
        const toBook = post("Contacts/List/bulkAddToBook", { selectedPartyIds: `ORG_ACME_SA,${TOM}`, contactBookId: "BOSS_DEMO_BOOK_TEAM" })
        const sheldonIn = current("mantle.party.contact.ContactBookParty", { partyId: "ORG_ACME_SA", contactBookId: "BOSS_DEMO_BOOK_TEAM" }).length
        const removed = post("Contacts/List/bulkRemoveFromBook", { selectedPartyIds: "ORG_ACME_SA", contactBookId: "BOSS_DEMO_BOOK_TEAM" })
        const nothing = post("Contacts/List/bulkAddToBook", { selectedPartyIds: "", contactBookId: "BOSS_DEMO_BOOK_TEAM" })
        return { toGroup, toBook, sheldonIn, removed, nothing,
            friends: sys(() => Array.from(ec.entity.find("mantle.party.contact.ContactBookGroupParty").condition("contactBookGroupId", "BOSS_DEMO_GRP_FRIENDS").list())).map((row) => row.partyId),
            tomInTeam: current("mantle.party.contact.ContactBookParty", { partyId: TOM, contactBookId: "BOSS_DEMO_BOOK_TEAM" }).length,
            sheldonAfter: current("mantle.party.contact.ContactBookParty", { partyId: "ORG_ACME_SA", contactBookId: "BOSS_DEMO_BOOK_TEAM" }).length,
            ungrouped: rowsOf(list({ scope: "ungrouped" }).output) }
    },
    then({ toGroup, toBook, sheldonIn, removed, nothing, friends, tomInTeam, sheldonAfter, ungrouped }) {
        toGroup.errors == ""
        friends.includes(TOM)
        friends.includes(PIPES)
        toBook.errors == ""
        sheldonIn == 1
        tomInTeam == 0
        removed.errors == ""
        sheldonAfter == 0
        nothing.errors.includes("Select one or more contacts first")
        !ungrouped.includes(TOM)
    },
})

feature("export vCard and CSV of the selected contacts, and a contact's vCard", {
    when() {
        const vcard = post("Contacts/List/bulkExport", { selectedPartyIds: `${MARY},${ROBIN}`, format: "vcard" })
        const csv = post("Contacts/List/bulkExport", { selectedPartyIds: `${MARY},${ROBIN},ORG_ACME_BA`, format: "csv" })
        const single = post("Contacts/ContactDetail/contactExport", { partyId: MARY, format: "vcard" })
        return { vcard, csv, single }
    },
    then({ vcard, csv, single }) {
        vcard.status == 200
        vcard.output.split("BEGIN:VCARD").length == 3
        vcard.output.includes("FN:Mary Doe")
        vcard.output.includes("robin.fischer@example.org")
        csv.output.startsWith("First Name,")
        csv.output.includes("Mary,")
        csv.output.includes("bob.acme@test.com")
        csv.output.split("\r\n").filter((line) => line).length == 4
        single.output.includes("FN:Mary Doe")
        single.output.split("BEGIN:VCARD").length == 2
    },
})

feature("merge two from the list goes to the compare; it takes exactly two", {
    when() {
        const three = post("Contacts/List/bulkMerge", { selectedPartyIds: `${PAT},${PATRICIA},${MARY}` })
        const two = post("Contacts/List/bulkMerge", { selectedPartyIds: `${PAT},${PATRICIA}` })
        return { three, two }
    },
    then({ three, two }) {
        three.errors.includes("Select exactly two contacts to merge")
        two.errors == ""
        // on to Contacts/Compare (a redirect here; the client follows the answer's screenUrl)
        two.status == 302
    },
})

feature("Duplicates groups the pairs by reason, runs the scan on demand, and leaves out personal contacts", {
    when() {
        const before = render("apps/Commons/Contacts/Duplicates", {})
        const scan = post("Contacts/Duplicates/runScan", {})
        const after = render("apps/Commons/Contacts/Duplicates", {})
        const byEmail = render("apps/Commons/Contacts/Duplicates", { reason: "email" })
        return { before, scan, after, byEmail }
    },
    then({ before, scan, after, byEmail }) {
        before.errors == ""
        !before.broken
        before.output.includes("Same email · ")
        before.output.includes("Same name · ")
        before.output.includes("Kimberly Lund")
        before.output.includes("Lund Labs Inc")
        !before.output.includes("Sasha Hidden")
        !before.output.includes("Sam Secret")
        scan.errors == ""
        after.output.includes("Kimberly Lund")
        !after.output.includes("Sasha Hidden")
        byEmail.output.includes("Kimberly Lund")
        !byEmail.output.includes("Lund Labs Inc")
    },
})

feature("Compare shows both side by side with the field choice; Merge keeps Kim Lund with Kimberly's first name and her address", {
    when() {
        const compare = render("apps/Commons/Contacts/Compare", { partyId: PAT, otherPartyId: PATRICIA, returnTo: "duplicates" })
        const merged = post("Contacts/Compare/mergeContacts", { partyId: PAT, otherPartyId: PATRICIA, returnTo: "duplicates", keepPartyId: PAT,
            pick_firstName: "right" })
        const after = render("apps/Commons/Contacts/Duplicates", {})
        return { compare, merged, after, pat: one("mantle.party.PartyDetail", { partyId: PAT }), patricia: one("mantle.party.Party", { partyId: PATRICIA }),
            patAddresses: current("mantle.party.contact.PartyContactMechPostalAddress", { partyId: PAT }) }
    },
    then({ compare, merged, after, pat, patricia, patAddresses }) {
        compare.errors == ""
        compare.output.includes("Side by side")
        compare.output.includes("Keep Kim Lund (BOSS_SPEC_DUP_A)")
        compare.output.includes("Not a duplicate")
        compare.output.includes("pick_firstName")
        merged.errors == ""
        merged.status == 302
        patricia.disabled == "Y"
        patricia.mergedToPartyId == PAT
        pat.firstName == "Kimberly"
        pat.comments == "Met at the spring fair."
        patAddresses.length == 1
        !after.output.includes(PATRICIA)
    },
})

feature("Not a duplicate keeps a pair out of the list", {
    when() {
        const marked = post("Contacts/Duplicates/notDuplicate", { partyId: QUINN_ORG, otherPartyId: QUINN_LLC })
        const after = render("apps/Commons/Contacts/Duplicates", {})
        return { marked, after, setting: one("mantle.party.PartySetting", { partyId: QUINN_ORG, partySettingTypeId: "BossNotDuplicates" }) }
    },
    then({ marked, after, setting }) {
        marked.errors == ""
        setting.settingValue == QUINN_LLC
        !after.output.includes("Lund Labs Inc")
    },
})

feature("New contact from Contacts (quick create with openAfter) makes a personal contact and opens it; Link to a directory party shares it", {
    when() {
        const made = post("QuickCreate/createContact", { partyTypeEnumId: "PtyPerson", contactName: "Lena Link", emailAddress: "lena@link.example",
            contactBookId: "BOSS_DEMO_BOOK_JD", openAfter: "Y" })
        const partyId = made.json.partyId
        const before = one("mantle.party.Party", { partyId })
        const joeBefore = as("joe.developer", () => detail(partyId).output.includes("is not available"))
        const linked = post("Contacts/ContactDetail/contactLink", { partyId })
        const after = one("mantle.party.Party", { partyId })
        const joeAfter = as("joe.developer", () => detail(partyId).output.includes("Lena Link"))
        const notMine = post("Contacts/ContactDetail/contactLink", { partyId: "ORG_ACME_BA" })
        return { made, partyId, before, joeBefore, linked, after, joeAfter, notMine,
            role: one("mantle.party.PartyRole", { partyId, roleTypeId: "Contact" }) }
    },
    then({ made, partyId, before, joeBefore, linked, after, joeAfter, notMine, role }) {
        made.errors == ""
        made.json.screenUrl == `/qapps/Commons/Contacts?partyId=${partyId}`
        before.privateOwnerUserId == "EX_JOHN_DOE"
        joeBefore
        linked.errors == ""
        after.privateOwnerUserId == null
        role != null
        joeAfter
        notMine.errors.includes("Only your own personal contact can be linked to the directory")
    },
})

feature("a picture for a contact: an image is its face image, shown as the avatar; another file is refused", {
    when() {
        const png = "\u0089PNG fake image bytes for the spec"
        const uploaded = post("Contacts/ContactDetail/contactAvatarUpload", { partyId: ROBIN, contentFile: uploadedFile("robin.png", png, "image/png") })
        const refused = post("Contacts/ContactDetail/contactAvatarUpload", { partyId: ROBIN, contentFile: uploadedFile("notes.txt", "text", "text/plain") })
        const image = ec.screen.makeTest().rootScreen(commons).render("Contacts/ContactDetail/contactAvatar", { partyId: ROBIN }, null)
        const noImage = ec.screen.makeTest().rootScreen(commons).render("Contacts/ContactDetail/contactAvatar", { partyId: MARY }, null)
        const hidden = ec.screen.makeTest().rootScreen(commons).render("Contacts/ContactDetail/contactAvatar", { partyId: SAM }, null)
        ec.message.clearErrors()
        const shown = detail(ROBIN)
        const row = list({ scope: "mine" }).output
        return { uploaded, refused, imageStatus: image.status, noImageStatus: noImage.status, hiddenStatus: hidden.status, shown, row,
            faces: sys(() => Array.from(ec.entity.find("mantle.party.PartyContent").condition("partyId", ROBIN).condition("partyContentTypeEnumId", "PcntFaceImage").list())).length }
    },
    then({ uploaded, refused, imageStatus, noImageStatus, hiddenStatus, shown, row, faces }) {
        uploaded.errors == ""
        refused.errors.includes("Choose an image file")
        faces == 1
        imageStatus == 200
        noImageStatus == 404
        hiddenStatus == 404
        shown.output.includes("contactAvatar?partyId=BOSS_DEMO_PC_ROBIN")
        row.includes("contactAvatar?partyId=BOSS_DEMO_PC_ROBIN")
    },
})

feature("delete: john.doe's personal contact goes; his own party and another user's contact do not", {
    when() {
        const self = post("Contacts/List/bulkDelete", { selectedPartyIds: "EX_JOHN_DOE" })
        const deleted = post("Contacts/List/bulkDelete", { selectedPartyIds: `${TOM},${SAM}` })
        const mine = rowsOf(list({ scope: "mine" }).output)
        return { self, deleted, mine, tom: one("mantle.party.Party", { partyId: TOM }), sam: one("mantle.party.Party", { partyId: SAM }),
            john: one("mantle.party.Party", { partyId: "EX_JOHN_DOE" }), tomBooks: current("mantle.party.contact.ContactBookParty", { partyId: TOM }).length }
    },
    then({ self, deleted, mine, tom, sam, john, tomBooks }) {
        self.errors == ""
        john.disabled != "Y"
        deleted.errors == ""
        tom.disabled == "Y"
        tomBooks == 0
        sam.disabled != "Y"
        !mine.includes(TOM)
    },
})

# mr-mantle-usl service inventory

Per-service inventory of the mr-mantle-usl component, for tracking service-level feature parity in IronStone BOSS.

- Source: `runtime/component/mr-mantle-usl/service/` (current working tree).
- Service: every `<service>` element in the service definition XML files under `service/mantle/` (including `GeneralServices.xml`).
- Test services (`PaymentTestServices.xml`, `OrderTestServices.xml`), service ECAs (`*.secas.xml`), and the REST API definition (`mantle.rest.xml`) are excluded.
- The **Designed in** column is filled when a design file is reviewed with the IronStone screen path(s) whose form summaries call the service (blank when no screen calls it); the **Implemented in** column is filled during implementation with the screens that call it. See [design-doc-guide.md](design-doc-guide.md) §9.
- **Implemented in** was filled on Oct 19, 2026 from the drawers-commons build (the Commons, Comms, `Shared`, `PublicShare` and `Unsubscribe` screens): each screen whose transitions, actions or forms call the service, directly or through the `ironstone.*` services of `service/ironstone/` (followed from one to the next, but not into Mantle's own calls, so `save#*ContentFile`, which `create#*Content` calls, stays blank). A screen that includes a `template/` record (ContactRecord, ConsentRecord) has that record's calls, so the contact record's are on both `Commons/Contacts/ContactDetail` and `Commons/Contacts/List`; a `.qvue` screen goes by its `.xml` path; a service the shell calls through a BOSS theme value names the value, and `Unsubscribe` includes its token route's check. The other apps' screens from the first port (Sales/Reports, Projects/Timesheets) are not counted.
- **Added** tables, at the end of Party, Request and Work and as the Marketing section: the services Mantle gained during that build that a built screen calls (99 of the 138 new ones; the rest are not listed yet). Their **Designed in** is blank until design-drawers-commons, which names most of them in its form summaries and §19, is reviewed again.

## Account (162 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| BaiServices | upload#BaiVersion2 |  |  |
| BaiServices | consume#Bai2SystemMessage |  |  |
| BaiServices | import#BaiVersion2 |  |  |
| FinancialAccountServices | get#StatementPrintInfo |  |  |
| FinancialAccountServices | create#FinancialAccount |  |  |
| FinancialAccountServices | update#FinancialAccount |  |  |
| FinancialAccountServices | getOrCreate#FinancialAccount |  |  |
| FinancialAccountServices | calculate#FinancialAccountTotals |  |  |
| FinancialAccountServices | adjust#FinancialAccount |  |  |
| FinancialAccountServices | deposit#FinancialAccount |  |  |
| FinancialAccountServices | withdraw#FinancialAccount |  |  |
| FinancialAccountServices | transfer#FinancialAccount |  |  |
| FinancialAccountServices | reverse#FinancialAccountTrans |  |  |
| FinancialAccountServices | authorize#FinancialAccount |  |  |
| FinancialAccountServices | expire#FinancialAccountAuth |  |  |
| FinancialAccountServices | disburse#FinancialAccount |  |  |
| FinancialAccountServices | replenish#FinancialAccount |  |  |
| FinancialAccountServices | checkCreate#InvoiceTransactions |  |  |
| FinancialAccountServices | checkCreate#InvoiceItemTrans |  |  |
| FinancialAccountServices | reverse#InvoiceTransactions |  |  |
| FinancialAccountServices | checkCreate#PaymentTrans |  |  |
| FinancialAccountServices | reverse#PaymentTrans |  |  |
| FinancialAccountServices | authorize#FinancialAccountPayment |  |  |
| FinancialAccountServices | capture#FinancialAccountPayment |  |  |
| FinancialAccountServices | release#FinancialAccountPayment |  |  |
| FinancialAccountServices | refund#FinancialAccountPayment |  |  |
| InvoiceServices | get#InvoiceBasicInfo |  |  |
| InvoiceServices | get#InvoiceDisplayInfo |  |  |
| InvoiceServices | get#InvoiceTotal |  |  |
| InvoiceServices | update#InvoiceTotals |  |  |
| InvoiceServices | calculate#MissingInvoiceTotals |  |  |
| InvoiceServices | get#InvoicePrintInfo |  |  |
| InvoiceServices | get#ReceivableStatementInfo |  |  |
| InvoiceServices | create#Invoice |  |  |
| InvoiceServices | update#Invoice |  |  |
| InvoiceServices | update#InvoiceClosed |  |  |
| InvoiceServices | checkSet#InvoiceDueDate |  |  |
| InvoiceServices | create#InvoiceItem |  |  |
| InvoiceServices | update#InvoiceItem |  |  |
| InvoiceServices | update#InvoiceItemClosed |  |  |
| InvoiceServices | update#InvoiceItemAdjustment |  |  |
| InvoiceServices | delete#InvoiceItem |  |  |
| InvoiceServices | adjust#Invoice |  |  |
| InvoiceServices | create#EntireOrderPartInvoice |  |  |
| InvoiceServices | create#SalesShipmentInvoices |  |  |
| InvoiceServices | create#PurchaseShipmentInvoices |  |  |
| InvoiceServices | create#ProjectExpenseInvoice |  |  |
| InvoiceServices | create#ProjectInvoiceItems |  |  |
| InvoiceServices | create#WorkerInvoiceItems |  |  |
| InvoiceServices | create#TimeEntryInvoiceItems |  |  |
| InvoiceServices | create#InvoiceBillThroughItems |  |  |
| InvoiceServices | create#InvoiceCreditMemo |  |  |
| InvoiceServices | reverse#Invoice |  |  |
| InvoiceServices | cancel#Invoice |  |  |
| InvoiceServices | cancel#InvoiceAndPayments |  |  |
| InvoiceServices | unpay#Invoice |  |  |
| InvoiceServices | autoApplyTo#Invoice |  |  |
| InvoiceServices | create#InvoiceItemDetail |  |  |
| InvoiceServices | distribute#InvoiceItemDetail |  |  |
| InvoiceServices | apply#InvoiceToOrder |  |  |
| InvoiceServices | apply#InvoiceItemToOrder |  |  |
| InvoiceServices | unapply#InvoiceItemFromOrder |  |  |
| InvoiceServices | apply#InvoiceToShipment |  |  |
| InvoiceServices | apply#InvoiceItemToShipment |  |  |
| InvoiceServices | unapply#InvoiceItemFromShipment |  |  |
| InvoiceServices | check#InvoicesPaid |  |  |
| InvoiceServices | find#InvoiceProductStores |  |  |
| InvoiceServices | send#InvoiceStoreEmail |  |  |
| InvoiceServices | send#SalesInvoicePastDueEmails |  |  |
| InvoiceServices | send#CustomerPastDueEmail |  |  |
| InvoiceServices | get#InvoiceContentLocation |  |  |
| InvoiceServices | create#InvoiceContent | Shared/RecordFiles | Shared/RecordFiles |
| InvoiceServices | update#InvoiceContent |  |  |
| InvoiceServices | save#InvoiceContentFile | Shared/RecordFiles |  |
| NachaServices | generate#NachaFile |  |  |
| NachaServices | consume#NachaReturnSystemMessage |  |  |
| NachaServices | import#NachaReturn |  |  |
| OfxServices | upload#OfxVersion1 |  |  |
| OfxServices | consume#OfxV1SystemMessage |  |  |
| OfxServices | import#OfxVersion1 |  |  |
| PaymentMethodServices | get#PartyPaymentMethodInfo |  |  |
| PaymentMethodServices | get#PartyPaymentMethodInfoList |  |  |
| PaymentMethodServices | store#PaymentMethodInfo |  |  |
| PaymentMethodServices | update#PaymentMethodMutable |  |  |
| PaymentMethodServices | delete#PaymentMethod |  |  |
| PaymentMethodServices | checkDelete#PaymentPaymentMethods |  |  |
| PaymentMethodServices | expunge#PaymentMethod |  |  |
| PaymentMethodServices | create#CreditCard |  |  |
| PaymentMethodServices | update#CreditCard |  |  |
| PaymentMethodServices | create#BankAccount |  |  |
| PaymentMethodServices | update#BankAccount |  |  |
| PaymentMethodServices | update#BankAccountMutable |  |  |
| PaymentMethodServices | get#PaymentMethodContentLocation |  |  |
| PaymentMethodServices | create#PaymentMethodContent | Shared/RecordFiles | Shared/RecordFiles |
| PaymentMethodServices | update#PaymentMethodContent |  |  |
| PaymentMethodServices | save#PaymentMethodContentFile | Shared/RecordFiles |  |
| PaymentMethodServices | update#PaymentMethodFileComplete |  |  |
| PaymentMethodServices | cancel#PaymentMethodFile |  |  |
| PaymentMethodServices | produce#PaymentMethodFileSystemMessage |  |  |
| PaymentServices | get#PaymentDisplayInfo |  |  |
| PaymentServices | get#PaymentDescription |  |  |
| PaymentServices | get#PaymentTotals |  |  |
| PaymentServices | update#PaymentTotals |  |  |
| PaymentServices | calculate#MissingPaymentTotals |  |  |
| PaymentServices | assign#BankAccountCheckNumber |  |  |
| PaymentServices | set#PaymentDate |  |  |
| PaymentServices | get#PaymentCheckInfo |  |  |
| PaymentServices | create#Payment |  |  |
| PaymentServices | set#PaymentAutoInfo |  |  |
| PaymentServices | create#InvoicePayment |  |  |
| PaymentServices | create#RefundPayment |  |  |
| PaymentServices | set#PaymentRefundFor |  |  |
| PaymentServices | send#PromisedPayment |  |  |
| PaymentServices | check#InvoiceStatusForPayment |  |  |
| PaymentServices | update#Payment |  |  |
| PaymentServices | apply#InvoicePayment |  |  |
| PaymentServices | apply#PaymentForInvoice |  |  |
| PaymentServices | apply#InvoiceForPayments |  |  |
| PaymentServices | apply#OrderPaymentsToInvoice |  |  |
| PaymentServices | apply#PaymentToPayment |  |  |
| PaymentServices | apply#InvoiceToInvoice |  |  |
| PaymentServices | cancel#PaymentAndInvoices |  |  |
| PaymentServices | void#Payment |  |  |
| PaymentServices | unapply#PaymentApplication |  |  |
| PaymentServices | autoApply#Payment |  |  |
| PaymentServices | authorize#Payment |  |  |
| PaymentServices | capture#Payment |  |  |
| PaymentServices | release#Payment |  |  |
| PaymentServices | refund#Payment |  |  |
| PaymentServices | get#PaymentGatewayDetails |  |  |
| PaymentServices | authorize#OrderPayments |  |  |
| PaymentServices | authorize#StorePayment |  |  |
| PaymentServices | authorize#SinglePayment |  |  |
| PaymentServices | get#AuthorizePaymentGatewayResponse |  |  |
| PaymentServices | capture#InvoicePayments |  |  |
| PaymentServices | capture#AppliedPayment |  |  |
| PaymentServices | capture#SinglePayment |  |  |
| PaymentServices | release#SinglePayment |  |  |
| PaymentServices | refund#SinglePayment |  |  |
| PaymentServices | get#SinglePaymentGatewayDetails |  |  |
| PaymentServices | poll#PaymentGatewayDetails |  |  |
| PaymentServices | get#PaymentContentLocation |  |  |
| PaymentServices | create#PaymentContent | Shared/RecordFiles | Shared/RecordFiles |
| PaymentServices | update#PaymentContent |  |  |
| PaymentServices | save#PaymentContentFile | Shared/RecordFiles |  |
| PositivePayServices | generate#PositivePayFile |  |  |
| PositivePayServices | send#PositivePayJob |  |  |
| PositivePayServices | generate#PositivePayInterface |  |  |
| PositivePayServices | generate#PmftBankOfAmericaAr |  |  |
| PositivePayServices | generate#PmftCityBankCnb |  |  |
| PositivePayServices | generate#PmftSunTrustCpr |  |  |
| PositivePayServices | generate#PmftWachoviaAr |  |  |
| PositivePayServices | generate#PmftWellsFargoArp |  |  |
| PositivePayServices | generate#PmftZionsBankCsv |  |  |
| ReconciliationServices | match#PaymentMethodTransUnmatched |  |  |
| ReconciliationServices | create#PaymentMethodTrans |  |  |
| ReconciliationServices | update#PaymentMethodTrans |  |  |
| ReconciliationServices | noReconcile#PaymentMethodTrans |  |  |
| ReconciliationServices | create#TransPayment |  |  |
| ReconciliationServices | reconcile#PaymentMethodTrans |  |  |
| ReconciliationServices | unreconcile#PaymentMethodTrans |  |  |
| ReconciliationServices | clear#PaymentTrans |  |  |

## Facility (15 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| ContactServices | get#FacilityDefaultShipDest |  |  |
| ContactServices | get#FacilityDefaultShipOrigin |  |  |
| ContactServices | get#FacilityContactInfo |  |  |
| ContactServices | update#FacilityPostalAddress |  |  |
| ContactServices | update#FacilityTelecomNumber |  |  |
| ContactServices | update#FacilityContactOther |  |  |
| ContactServices | delete#FacilityContactMech |  |  |
| FacilityServices | get#Facility |  |  |
| FacilityServices | get#FacilitiesByOwner |  |  |
| FacilityServices | create#Facility |  |  |
| FacilityServices | update#Facility |  |  |
| FacilityServices | update#FacilityCertification |  |  |
| FacilityServices | create#FacilityLocation |  |  |
| FacilityServices | create#FacilityNote |  |  |
| FacilityServices | get#ScannedIdGeneral |  |  |

## HumanRes (38 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| EmploymentServices | create#Employment |  |  |
| EmploymentServices | update#Employment |  |  |
| EmploymentServices | delete#Employment |  |  |
| EmploymentServices | create#EmploymentSalary |  |  |
| EmploymentServices | check#NextPayrollTimePeriods |  |  |
| PayrollDocumentServices | get#EmploymentInfo |  |  |
| PayrollDocumentServices | get#EmploymentWageAndTaxInfo |  |  |
| PayrollDocumentServices | create#PeriodWageAndTaxRecords |  |  |
| PayrollDocumentServices | get#UsaIrsW2FormData |  |  |
| PayrollDocumentServices | generate#Efw2File |  |  |
| PayrollDocumentServices | get#UsaIrs1099MiscFormData |  |  |
| PayrollServices | get#TimePeriodEmployments |  |  |
| PayrollServices | process#TimePeriodPay |  |  |
| PayrollServices | reopen#PayrollPeriod |  |  |
| PayrollServices | approve#PeriodInvoices |  |  |
| PayrollServices | create#PeriodPayments |  |  |
| PayrollServices | set#PeriodPaymentDates |  |  |
| PayrollServices | set#PeriodPaymentRefNums |  |  |
| PayrollServices | authorize#PeriodPayments |  |  |
| PayrollServices | deliver#PeriodPayments |  |  |
| PayrollServices | process#EmploymentPay |  |  |
| PayrollServices | get#EmploymentPayAmount |  |  |
| PayrollServices | get#TimePeriodTotalPayAmount |  |  |
| PayrollServices | get#EmploymentPayDetail |  |  |
| PayrollServices | calculate#Adjustment |  |  |
| PayrollServices | calculate#PayrollAdjustment |  |  |
| PayrollServices | create#WorkersCompRate |  |  |
| PayrollServices | delete#WorkersCompRate |  |  |
| PayrollServices | update#WorkersCompRate |  |  |
| PayrollServices | create#GarnishmentDetail |  |  |
| PayrollServices | update#GarnishmentDetail |  |  |
| PayrollServices | create#PayrollAdjustmentAndDetail |  |  |
| PayrollServices | update#PayrollAdjustmentAndDetail |  |  |
| PayrollServices | delete#PayrollAdjustmentAndDetail |  |  |
| PayrollServices | create#PayrollInvoice |  |  |
| PositionServices | get#PartyEmployersAndPositionClasses |  |  |
| RateServices | create#RateAmount |  |  |
| RateServices | update#RateAmount |  |  |

## Ledger (81 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| AssetAutoPostServices | post#AssetReceipt |  |  |
| AssetAutoPostServices | repost#AssetReceipt |  |  |
| AssetAutoPostServices | post#AssetIssuance |  |  |
| AssetAutoPostServices | revert#AssetIssuanceOnCancel |  |  |
| AssetAutoPostServices | repost#AssetIssuance |  |  |
| AssetAutoPostServices | calculate#FixedAssetDepreciation |  |  |
| AssetAutoPostServices | post#FixedAssetDepreciation |  |  |
| AssetAutoPostServices | calculateAndPost#FixedAssetDepreciation |  |  |
| AssetAutoPostServices | calculateAndPost#AllFixedAssetDepreciations |  |  |
| AssetAutoPostServices | post#PhysicalInventoryVariance |  |  |
| AssetAutoPostServices | repost#PhysicalInventoryVariance |  |  |
| AssetAutoPostServices | get#AssetTypeGlAccount |  |  |
| AssetAutoPostServices | repost#Asset |  |  |
| InvoiceAutoPostServices | post#Invoice |  |  |
| InvoiceAutoPostServices | post#InvoiceAdjustment |  |  |
| InvoiceAutoPostServices | get#InvoicePartyAcctgPreferences |  |  |
| InvoiceAutoPostServices | get#InvoiceTypeTransType |  |  |
| InvoiceAutoPostServices | get#InvoiceItemGlAccount |  |  |
| InvoiceAutoPostServices | repost#Invoice |  |  |
| InvoiceAutoPostServices | repost#InvoiceAdjustment |  |  |
| InvoiceAutoPostServices | repost#AllInvoices |  |  |
| InvoiceAutoPostServices | revert#InvoicePost |  |  |
| LedgerReportServices | get#ReportBasicInfo |  |  |
| LedgerReportServices | run#IncomeStatement |  |  |
| LedgerReportServices | run#BalanceSheet |  |  |
| LedgerReportServices | run#CashFlowStatement |  |  |
| LedgerReportServices | run#RetainedEarningsStatement |  |  |
| LedgerReportServices | run#FinancialRatios |  |  |
| LedgerReportServices | get#GlAccountClassInfoSums |  |  |
| LedgerReportServices | get#GlAccountClassReportInfo |  |  |
| LedgerReportServices | run#PostedAmountSummary |  |  |
| LedgerReportServices | get#PostedAmountSummarySide |  |  |
| LedgerReportServices | get#AccountLedgerInfo |  |  |
| LedgerReportServices | get#PeriodSeriesSummary |  |  |
| LedgerReportServices | get#PeriodSeriesSummaryRows |  |  |
| LedgerServices | create#GlAccount |  |  |
| LedgerServices | init#PartyAccountingConfiguration |  |  |
| LedgerServices | find#PartyAcctgPreference |  |  |
| LedgerServices | find#RootGlAccountClassEnum |  |  |
| LedgerServices | set#GlAccountFlags |  |  |
| LedgerServices | set#MissingGlAccountFlags |  |  |
| LedgerServices | expand#ParentOrganizationList |  |  |
| LedgerServices | expand#ChildOrganizationList |  |  |
| LedgerServices | get#DefaultGlAccountByType |  |  |
| LedgerServices | create#AcctgTrans |  |  |
| LedgerServices | update#AcctgTrans |  |  |
| LedgerServices | update#AcctgTransPosted |  |  |
| LedgerServices | delete#AcctgTrans |  |  |
| LedgerServices | create#AcctgTransEntry |  |  |
| LedgerServices | update#AcctgTransEntry |  |  |
| LedgerServices | delete#AcctgTransEntry |  |  |
| LedgerServices | calculate#AcctgTransTrialBalance |  |  |
| LedgerServices | post#AcctgTrans |  |  |
| LedgerServices | unpost#AcctgTrans |  |  |
| LedgerServices | update#GlAccountOrgSummariesForTx |  |  |
| LedgerServices | post#ReverseAcctgTrans |  |  |
| LedgerServices | move#AcctgTransEntry |  |  |
| LedgerServices | get#OrganizationFiscalTimePeriods |  |  |
| LedgerServices | check#NextFiscalTimePeriods |  |  |
| LedgerServices | close#FinancialTimePeriod |  |  |
| LedgerServices | recalculate#GlAccountOrgTimePeriodAmounts |  |  |
| LedgerServices | reopen#FinancialTimePeriod |  |  |
| LedgerServices | create#PeriodCloseAcctgTrans |  |  |
| LedgerServices | recalculate#GlAccountOrgSummaries |  |  |
| LedgerServices | create#GlJournal |  |  |
| LedgerServices | update#GlJournal |  |  |
| LedgerServices | calculate#GlJournalTrialBalance |  |  |
| LedgerServices | post#GlJournal |  |  |
| OtherAutoPostServices | post#WorkEffortCost |  |  |
| OtherAutoPostServices | post#FinancialAccountTrans |  |  |
| OtherAutoPostServices | get#FinancialAccountGlAccount |  |  |
| OtherAutoPostServices | get#FinancialAccountTransGlAccount |  |  |
| PaymentAutoPostServices | post#Payment |  |  |
| PaymentAutoPostServices | revert#PaymentPost |  |  |
| PaymentAutoPostServices | get#PaymentPartyAcctgPreferences |  |  |
| PaymentAutoPostServices | create#PaymentTypeEntry |  |  |
| PaymentAutoPostServices | get#PaymentTypeGlAccount |  |  |
| PaymentAutoPostServices | get#PaymentMethodGlAccount |  |  |
| PaymentAutoPostServices | post#PaymentApplication |  |  |
| PaymentAutoPostServices | revert#PaymentApplicationPost |  |  |
| PaymentAutoPostServices | repost#PaymentAndApplications |  |  |

## Marketing (11 services, all added)

Added in the drawers-commons build (Oct 18–19, 2026), called by built screens:

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| ContactListServices | get#ContactListAccess |  | Comms/Inbox/Compose; Comms/Inbox/Mail |
| ContactListServices | create#ContactList |  | Comms/Inbox/Mail |
| ContactListServices | update#ContactList |  | Comms/Inbox/Mail |
| ContactListServices | find#ContactLists |  | Comms; Comms/Inbox/Compose; Comms/Inbox/Mail |
| ContactListServices | find#ContactListParties |  | Comms/Inbox/Mail |
| ContactListServices | join#ContactList |  | Comms/Inbox/Mail |
| ContactListServices | leave#ContactList |  | Comms/Inbox/Mail |
| ContactListServices | add#ContactListParty |  | Comms/Inbox/Mail |
| ContactListServices | remove#ContactListParty |  | Comms/Inbox/Mail |
| ContactListServices | decline#ContactListParty |  | Comms/Inbox/Mail |
| ContactListServices | set#ContactListPartyDelivery |  | Comms/Inbox/Mail |

## Order (89 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| OrderBulkServices | store#Order |  |  |
| OrderBulkServices | change#OrderPartsStatus |  |  |
| OrderInfoServices | get#OrderDisplayInfo |  |  |
| OrderInfoServices | get#OrderItemsTotalCount |  |  |
| OrderInfoServices | get#OrderItemDisplayInfo |  |  |
| OrderInfoServices | get#OrderPartBillingAddress |  |  |
| OrderInfoServices | validate#Order |  |  |
| OrderInfoServices | validate#OrderRequireManual |  |  |
| OrderInfoServices | check#OrderPreApprove |  |  |
| OrderInfoServices | send#OrderStoreEmail |  |  |
| OrderInfoServices | notify#OrderHighPriority |  |  |
| OrderServices | create#Order |  |  |
| OrderServices | update#OrderHeader |  |  |
| OrderServices | create#OrderPart |  |  |
| OrderServices | update#OrderPart |  |  |
| OrderServices | get#OrderItemTotal |  |  |
| OrderServices | create#OrderItem |  |  |
| OrderServices | update#OrderItem |  |  |
| OrderServices | delete#OrderItem |  |  |
| OrderServices | recalc#OrderItemAmount |  |  |
| OrderServices | recalc#OrderPartItemAmounts |  |  |
| OrderServices | check#AvailableInventory |  |  |
| OrderServices | add#OrderProductQuantity |  |  |
| OrderServices | update#OrderProductQuantity |  |  |
| OrderServices | merge#OrderItems |  |  |
| OrderServices | set#OrderBillingShippingInfo |  |  |
| OrderServices | add#OrderPartPayment |  |  |
| OrderServices | create#OrderPayments50Split |  |  |
| OrderServices | change#OrderStatusInterface |  |  |
| OrderServices | update#OrderStatus |  |  |
| OrderServices | propose#Order |  |  |
| OrderServices | place#Order |  |  |
| OrderServices | approve#Order |  |  |
| OrderServices | autoApprove#OrdersDelayed |  |  |
| OrderServices | autoApprove#Order |  |  |
| OrderServices | isFulfilled#OrderPart |  |  |
| OrderServices | isFulfilled#OrderItem |  |  |
| OrderServices | checkComplete#OrderPart |  |  |
| OrderServices | checkStillComplete#Order |  |  |
| OrderServices | checkCancelComplete#Order |  |  |
| OrderServices | checkRejectedComplete#Order |  |  |
| OrderServices | complete#OrderPart |  |  |
| OrderServices | complete#Order |  |  |
| OrderServices | cancel#Order |  |  |
| OrderServices | cancel#OrderPart |  |  |
| OrderServices | cancel#OrderItem |  |  |
| OrderServices | reject#Order |  |  |
| OrderServices | reject#OrderPart |  |  |
| OrderServices | reject#OrderItem |  |  |
| OrderServices | clone#Order |  |  |
| OrderServices | update#OrderRecur |  |  |
| OrderServices | create#RecurringOrders |  |  |
| OrderServices | create#RecurringOrder |  |  |
| OrderServices | handle#OrderItemChange |  |  |
| OrderServices | handle#OrderPartChange |  |  |
| OrderServices | handle#OrderMajorChange |  |  |
| OrderServices | update#OrderHeaderTotal |  |  |
| OrderServices | update#OrderPartTotal |  |  |
| OrderServices | increment#OrderRevision |  |  |
| OrderServices | create#OrderContent | Shared/RecordFiles | Shared/RecordFiles |
| OrderServices | update#OrderContent |  |  |
| OrderServices | save#OrderContentFile | Shared/RecordFiles |  |
| OrderServices | create#PurchaseRequestOrder |  |  |
| ReturnServices | get#ReturnDisplayInfo |  |  |
| ReturnServices | create#Return |  |  |
| ReturnServices | create#ReturnFromOrder |  |  |
| ReturnServices | find#OrderOpenReturns |  |  |
| ReturnServices | find#ReturnableOrderItems |  |  |
| ReturnServices | calculate#OrderItemReturnable |  |  |
| ReturnServices | add#OrderItemToReturn |  |  |
| ReturnServices | change#ReturnStatusInterface |  |  |
| ReturnServices | update#ReturnStatus |  |  |
| ReturnServices | checkUpdate#ReturnHeaderStatus |  |  |
| ReturnServices | request#Return |  |  |
| ReturnServices | approve#Return |  |  |
| ReturnServices | receive#ReturnShipmentItems |  |  |
| ReturnServices | receive#ReturnWithoutShipment |  |  |
| ReturnServices | receive#ReturnItem |  |  |
| ReturnServices | complete#ReturnItem |  |  |
| ReturnServices | process#ReturnItemResponses |  |  |
| ReturnServices | cancel#Return |  |  |
| ReturnServices | cancel#ReturnItem |  |  |
| ReturnServices | update#ReturnItem |  |  |
| ReturnServices | delete#ReturnItem |  |  |
| ReturnServices | create#ReturnShipment |  |  |
| ReturnServices | add#ReturnToShipment |  |  |
| ReturnServices | returnAndResell#Shipment |  |  |
| ReturnServices | return#Shipment |  |  |
| ReturnServices | resell#Shipment |  |  |

## Other (22 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| BudgetReportServices | run#BudgetExpenseReport |  |  |
| BudgetReportServices | run#BudgetExpenseDetailReport |  |  |
| BudgetServices | get#GlAccountAppls |  |  |
| BudgetServices | get#AssetGlAppls |  |  |
| BudgetServices | get#FacilityGlAppls |  |  |
| BudgetServices | create#Budget |  |  |
| BudgetServices | store#BudgetItem |  |  |
| BudgetServices | get#BudgetItemsAccountsSubPeriods |  |  |
| BudgetServices | store#BudgetItemsSubPeriods |  |  |
| BudgetServices | store#BudgetItemDetail |  |  |
| BudgetServices | store#BudgetItemDetailsSubPeriods |  |  |
| TaxServices | calculate#SalesTax |  |  |
| TaxServices | calculate#OrderSalesTax |  |  |
| TaxServices | calculate#InvoiceSalesTax |  |  |
| TaxServices | calculate#SalesTaxLocal |  |  |
| TaxServices | create#TaxStatement |  |  |
| TaxServices | delete#TaxStatement |  |  |
| TaxServices | create#AllVendor1099MiscStatements |  |  |
| TaxServices | create#Vendor1099MiscStatement |  |  |
| TaxServices | get#UsaIrs1099MiscFormData |  |  |
| TaxServices | get#RecipientTaxInfo |  |  |
| TaxServices | get#PayerTaxInfo |  |  |

## Party (86 services, 57 added)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| AgreementServices | create#AgreementContent | Shared/RecordFiles | Shared/RecordFiles |
| AgreementServices | update#AgreementContent |  |  |
| AgreementServices | save#AgreementContentFile | Shared/RecordFiles |  |
| CommunicationServices | find#PartyCommunicationEvents | Shared/Chatter |  |
| CommunicationServices | create#Message | Commons/QuickCreate; Commons/Files; Comms/Inbox/Compose; Shared/Chatter | Comms/Inbox/Compose; Shared/Chatter |
| CommunicationServices | reply#CommunicationEvent | Comms/Inbox/Compose; Shared/Chatter | Comms/Inbox/Compose; Shared/Chatter |
| CommunicationServices | add#WikiPageComment | Commons/Knowledge; Commons/Knowledge/Review |  |
| CommunicationServices | get#CommunicationEventContentLocation |  |  |
| CommunicationServices | create#CommunicationEventContent | Shared/RecordFiles | Shared/RecordFiles |
| CommunicationServices | update#CommunicationEventContent |  |  |
| CommunicationServices | save#CommunicationEventContentFile | Shared/RecordFiles |  |
| ContactServices | get#PartyContactInfo | Commons/Contacts/ContactDetail; Comms/Inbox | Commons/Settings/Account; Comms/Inbox/Mail |
| ContactServices | get#PartyContactInfoList |  |  |
| ContactServices | get#PartyDefaultBilling |  |  |
| ContactServices | store#PartyContactInfo | Commons/Contacts/ContactDetail; Commons/Settings/Account | Commons/Contacts/ContactDetail; Commons/Contacts/List; Commons/Settings/Account |
| ContactServices | create#PostalAddress |  |  |
| ContactServices | update#PartyPostalAddress |  |  |
| ContactServices | get#PostalAddressGeoIdSet |  |  |
| ContactServices | findOrCreate#PartyPostalAddress |  |  |
| ContactServices | clean#TelecomNumber |  |  |
| ContactServices | create#TelecomNumber | Commons/QuickCreate |  |
| ContactServices | update#PartyTelecomNumber |  |  |
| ContactServices | findOrCreate#PartyTelecomNumber |  |  |
| ContactServices | create#EmailAddress | Commons/QuickCreate |  |
| ContactServices | get#PrimaryEmailAddress |  | Commons/Settings/Account; Comms/Inbox/Compose |
| ContactServices | findOrCreate#PartyEmailAddress |  |  |
| ContactServices | create#WebAddress |  |  |
| ContactServices | create#ContactMechOther |  |  |
| ContactServices | update#PartyContactOther |  |  |
| ContactServices | update#ContactMechMutable |  |  |
| ContactServices | store#PartyContactMech | Commons/Contacts/ContactDetail; Comms/Consent | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactServices | delete#PartyContactMech | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactServices | undelete#PartyContactMech |  |  |
| DuplicateServices | find#PartyHasDuplicates | Commons/Contacts/Duplicates |  |
| DuplicateServices | find#PartyDuplicates | Commons/Contacts/Duplicates | Commons/Contacts/Duplicates |
| DuplicateServices | find#TelecomNumbers |  |  |
| DuplicateServices | find#PostalAddresses |  |  |
| DuplicateServices | check#AllPartyDuplicates | Commons/Contacts/Duplicates | Commons/Contacts/Duplicates |
| DuplicateServices | merge#AllDuplicateParties |  |  |
| DuplicateServices | merge#Parties | Commons/Contacts; Commons/Contacts/Duplicates | Commons/Contacts/Compare |
| GooglePartyServices | get#MapsGeoCodeResults |  |  |
| GooglePartyServices | get#MapsPlaceSearchText |  |  |
| GooglePartyServices | get#MapsPlaceDetails |  |  |
| PartyServices | find#Party | Commons/Contacts | Commons; Commons/Contacts/ContactDetail; Commons/Contacts/List; Comms/Consent/List |
| PartyServices | search#Party | Commons/Contacts; Comms/Panel/Chat; Comms/Inbox |  |
| PartyServices | search#Person |  | Commons/Calendar; Commons/Calendar/EventDetail; Commons/QuickCreate |
| PartyServices | get#UserNoticeCounts |  |  |
| PartyServices | setup#UserOrganizationInfo | Commons; Comms | Commons; Comms |
| PartyServices | get#PartyOrganizationInfo |  |  |
| PartyServices | create#Account |  |  |
| PartyServices | update#Account |  | Commons/Settings/Account |
| PartyServices | create#UserAccountPerson |  |  |
| PartyServices | create#PartyUserAccount |  |  |
| PartyServices | update#PartyUserAccount |  |  |
| PartyServices | create#Person | Commons/QuickCreate |  |
| PartyServices | create#PersonCustomer |  |  |
| PartyServices | create#PersonEmployee |  |  |
| PartyServices | create#Organization | Commons/QuickCreate |  |
| PartyServices | update#PartyDetail | Commons/Contacts/ContactDetail | Commons/Contacts/Compare; Commons/Contacts/ContactDetail; Commons/Contacts/List |
| PartyServices | convert#PartyToOrganization |  |  |
| PartyServices | convert#PartyToPerson |  |  |
| PartyServices | ensure#PartyRole |  |  |
| PartyServices | set#PartyClassification |  |  |
| PartyServices | remove#PartyClassification |  |  |
| PartyServices | get#PartyBadgeInfo |  |  |
| PartyServices | lookup#PartyBadge |  |  |
| PartyServices | scan#PartyBadge |  |  |
| PartyServices | get#PartyContentLocation |  |  |
| PartyServices | create#PartyContent | Commons/Contacts/ContactDetail; Commons/Settings/Account; Shared/RecordFiles | Commons/Contacts/ContactDetail; Commons/Contacts/List; Shared/RecordFiles |
| PartyServices | update#PartyContent |  |  |
| PartyServices | save#PartyContentFile | Shared/RecordFiles |  |
| PartyServices | get#PartySettingValue |  |  |
| PartyServices | store#PartySetting |  |  |
| PartyServices | store#PartyRelationshipSetting |  |  |
| PartyServices | validate#PartySetting |  |  |
| PartyServices | send#DataDocumentNotifications |  |  |
| TimeServices | get#DescendantPeriods |  |  |
| TimeServices | create#TimePeriod |  |  |
| TimeServices | reset#TimePeriodNames |  |  |
| TimeServices | delete#TimePeriod |  |  |
| TimeServices | getOrCreate#TimePeriod |  |  |
| TimeServices | getOrCreate#NextTimePeriod |  |  |
| TimeServices | get#NextTimePeriod |  |  |
| TimeServices | getOrCreate#PreviousTimePeriod |  |  |
| TimeServices | get#TimePeriodInfo |  |  |
| TimeServices | find#PartyTimePeriodGroups |  |  |

Added in the drawers-commons build (Oct 18–19, 2026), called by built screens:

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| CommunicationServices | get#InternalThread |  | Comms/Inbox/Compose; Comms/Inbox/Mail; Comms/Inbox/MessageDetail |
| CommunicationServices | set#InternalMessageState |  | Comms/Inbox/Compose; Comms/Inbox/Mail |
| CommunicationServices | close#ListThread |  | Comms/Inbox/Compose; Comms/Inbox/Mail |
| CommunicationServices | find#InboxThreads |  | Comms; Comms/Home; Comms/Inbox/Mail |
| CommunicationServices | get#InboxUnreadCounts |  | Comms/Home; Comms/Inbox/Mail |
| CommunicationServices | get#RecordLinkInfo |  | Commons/Calendar; Commons/Calendar/EventDetail; Commons/Files; Commons/Knowledge; Commons/Notes; Commons/QuickCreate; Commons/Requests/List; Commons/Requests/RequestDetail; Commons/Tasks/List; Commons/Tasks/TaskDetail; Comms/Chat; Comms/Inbox/Compose; Comms/Inbox/Mail; Comms/Inbox/MessageDetail; Shared/Chatter; Shared/RecordFiles |
| CommunicationServices | findOrCreate#EmailCommunicationEvent |  | Comms/Inbox/Mail |
| CommunicationServices | link#CommunicationEventRecord |  | Comms/Chat; Comms/Inbox/Compose; Comms/Inbox/Mail; Comms/Inbox/MessageDetail; Shared/Chatter |
| CommunicationServices | unlink#CommunicationEventRecord |  | Comms/Inbox/Mail; Shared/Chatter |
| CommunicationServices | send#EmailDraft |  | Comms/Inbox/Compose |
| CommunicationServices | get#RecordTimeline |  | Shared/Chatter |
| CommunicationServices | log#RecordNote |  | Commons/QuickCreate; Shared/Chatter |
| CommunicationServices | notify#RecordMention |  | Shared/Chatter |
| CommunicationServices | notify#RecordFollowers |  | Commons/Knowledge; Commons/Notes |
| CommunicationServices | follow#Record |  | Commons/Knowledge; Shared/Chatter |
| CommunicationServices | unfollow#Record |  | Commons/Knowledge; Shared/Chatter |
| CommunicationServices | get#RecordFollowers |  | Shared/Chatter |
| CommunicationServices | findOrCreate#ChatCommunicationEvent |  | Comms/Chat |
| CommunicationServices | create#RecordFromChatMessage |  | Comms/Chat |
| ConsentServices | store#PartyConsent |  | Commons/Contacts/ContactDetail; Commons/Contacts/List; Comms/Consent/Contact; Comms/Consent/List |
| ConsentServices | get#PartyConsentState |  | Comms/Consent/Contact |
| ConsentServices | get#PartyConsentHistory |  | Comms/Consent/Contact |
| ConsentServices | find#Consents |  | Comms/Consent/List |
| ConsentServices | subscribe#ContactListParty |  | Commons/Contacts/ContactDetail; Commons/Contacts/List; Comms/Consent/Contact |
| ConsentServices | unsubscribe#ContactListParty |  | Commons/Contacts/ContactDetail; Commons/Contacts/List; Comms/Consent/Contact; Unsubscribe |
| ConsentServices | unsubscribe#ContactListParties |  | Comms/Consent/List |
| ConsentServices | check#UnsubscribeToken |  | Unsubscribe |
| ConsentServices | resolve#UnsubscribeToken |  | Unsubscribe |
| ConsentServices | apply#UnsubscribePreferences |  | Unsubscribe |
| ContactBookServices | create#ContactBook |  | Commons/Settings/ContactBooks |
| ContactBookServices | update#ContactBook |  | Commons/Settings/ContactBooks |
| ContactBookServices | delete#ContactBook |  | Commons/Settings/ContactBooks |
| ContactBookServices | ensure#UserDefaultContactBook |  | Commons/QuickCreate |
| ContactBookServices | share#ContactBook |  | Commons/Settings/ContactBooks |
| ContactBookServices | unshare#ContactBook |  | Commons/Settings/ContactBooks |
| ContactBookServices | add#ContactBookParties |  | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactBookServices | remove#ContactBookParties |  | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactBookServices | create#ContactBookGroup |  | Commons/Settings/ContactBooks |
| ContactBookServices | update#ContactBookGroup |  | Commons/Settings/ContactBooks |
| ContactBookServices | delete#ContactBookGroup |  | Commons/Settings/ContactBooks |
| ContactBookServices | add#ContactBookGroupParties |  | Commons/Contacts/List |
| ContactBookServices | remove#ContactBookGroupParties |  | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactBookServices | set#ContactFavorite |  | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactBookServices | find#ContactBookParties |  | Commons/Contacts/List |
| ContactBookServices | get#UserContactBooks |  | Commons/Contacts/Compare; Commons/Contacts/ContactDetail; Commons/Contacts/Duplicates; Commons/Contacts/Import/Options; Commons/Contacts/Import/Result; Commons/Contacts/List; Commons/QuickCreate; Commons/Settings/ContactBooks |
| ContactBookServices | store#ContactParty |  | Commons/Calendar/EventDetail; Commons/QuickCreate |
| ContactBookServices | create#PersonalContact |  | Commons/Calendar/EventDetail; Commons/QuickCreate |
| ContactBookServices | link#PersonalContactToDirectory |  | Commons/Contacts/Compare; Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactBookServices | delete#Contacts |  | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ContactBookServices | filter#ContactAddresses |  | Comms/Settings/OutOfOffice (theme value STRT_EMAIL_CONTACT_SERVICE) |
| ContactImportServices | read#ContactFileText |  | Commons/Contacts/Import/Source |
| ContactImportServices | parse#ContactFile |  | Commons/Contacts/Import/Mapping; Commons/Contacts/Import/Source |
| ContactImportServices | preview#Contacts |  | Commons/Contacts/Import/Preview |
| ContactImportServices | import#Contacts |  | Commons/Contacts/Import/Result |
| ContactImportServices | export#Contacts |  | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| DuplicateServices | mark#PartyNotDuplicate |  | Commons/Contacts/Compare; Commons/Contacts/Duplicates |
| PartyServices | get#ShellCounts |  | shell header (theme value STRT_SHELL_COUNTS_SERVICE) |

## Product (108 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| AssetServices | get#AssetDisplayInfo |  |  |
| AssetServices | get#AvailableInventory |  |  |
| AssetServices | get#AvailableForOrder |  |  |
| AssetServices | get#AvailableInventoryMulti |  |  |
| AssetServices | update#Asset |  |  |
| AssetServices | update#AssetAcquireCost |  |  |
| AssetServices | update#ProductAcquireCost |  |  |
| AssetServices | update#AssetFromDetail |  |  |
| AssetServices | recalculate#AllAssetTotals |  |  |
| AssetServices | get#AssetPools |  |  |
| AssetServices | reserve#AssetsForOrder |  |  |
| AssetServices | checkReserve#AssetForOrderItem |  |  |
| AssetServices | reserve#AssetForOrderItem |  |  |
| AssetServices | remove#OrderItemReservations |  |  |
| AssetServices | remove#OrderReservations |  |  |
| AssetServices | reduce#AssetReservation |  |  |
| AssetServices | reReserve#Assets |  |  |
| AssetServices | reserve#IncreasedAsset |  |  |
| AssetServices | move#AssetReservation |  |  |
| AssetServices | move#ReservationsFromNonPickLocations |  |  |
| AssetServices | check#AssetReservations |  |  |
| AssetServices | check#AssetReservationValid |  |  |
| AssetServices | check#FacilityReservations |  |  |
| AssetServices | displace#AssetReservations |  |  |
| AssetServices | change#AssetQuantity |  |  |
| AssetServices | checkReserve#ProductAssets |  |  |
| AssetServices | issue#AssetReservation |  |  |
| AssetServices | issue#Asset |  |  |
| AssetServices | issue#AssetToWorkEffort |  |  |
| AssetServices | issue#AnyAssetToWorkEffort |  |  |
| AssetServices | issue#AnyAssetForShipmentItemSource |  |  |
| AssetServices | move#IssuancesToNewShipment |  |  |
| AssetServices | cancel#AssetIssuance |  |  |
| AssetServices | update#AssetIssuedDate |  |  |
| AssetServices | receive#Asset |  |  |
| AssetServices | update#AssetAndReceipt |  |  |
| AssetServices | replace#AssetPartyAssignment |  |  |
| AssetServices | move#Product |  |  |
| AssetServices | moveVerify#Product |  |  |
| AssetServices | check#ScanLocation |  |  |
| AssetServices | move#Asset |  |  |
| AssetServices | record#PhysicalInventoryQuantity |  |  |
| AssetServices | record#PhysicalInventoryChange |  |  |
| AssetServices | create#ProductAssetAdHoc |  |  |
| AssetServices | update#PhysicalInventoryDate |  |  |
| EquipmentServices | create#Equipment |  |  |
| EquipmentServices | get#AssetMaintenanceNeeded |  |  |
| EquipmentServices | create#AssetMaintenance |  |  |
| EquipmentServices | create#AssetMaintenanceContent | Shared/RecordFiles | Shared/RecordFiles |
| EquipmentServices | update#AssetMaintenanceContent |  |  |
| EquipmentServices | save#AssetMaintenanceContentFile | Shared/RecordFiles |  |
| InventoryReportServices | get#InventoryProjectedInfo |  |  |
| InventoryReportServices | get#PriceHistoryInfo |  |  |
| PriceServices | modify#ProductPrice |  |  |
| PriceServices | get#ProductPriceByType |  |  |
| PriceServices | get#ProductPrice |  |  |
| PriceServices | get#OrderProductPrice |  |  |
| ProductServices | find#ProductByIdValue |  |  |
| ProductServices | clone#Product |  |  |
| ProductServices | create#ProductFeature |  |  |
| ProductServices | apply#ProductFeatures |  |  |
| ProductServices | find#ProductFeatures |  |  |
| ProductServices | find#ProductFeatureGroups |  |  |
| ProductServices | find#ProductCategoryFeatures |  |  |
| ProductServices | get#ProductCategoryFeatureList |  |  |
| ProductServices | get#FeatureByIactnOrAll |  |  |
| ProductServices | find#VariantProduct |  |  |
| ProductServices | get#VariantProductsInfo |  |  |
| ProductServices | create#VariantProducts |  |  |
| ProductServices | create#VariantProduct |  |  |
| ProductServices | delete#VariantProducts |  |  |
| ProductServices | delete#Product |  |  |
| ProductServices | add#ProductsToCategory |  |  |
| ProductServices | remove#ProductsFromCategory |  |  |
| ProductServices | add#FeatureToProducts |  |  |
| ProductServices | remove#FeatureFromProducts |  |  |
| ProductServices | create#ProductContent | Shared/RecordFiles | Shared/RecordFiles |
| ProductServices | update#ProductContent |  |  |
| ProductServices | save#ProductContentFile | Shared/RecordFiles |  |
| ProductServices | create#ProductCategoryContent | Shared/RecordFiles | Shared/RecordFiles |
| ProductServices | update#ProductCategoryContent |  |  |
| ProductServices | save#ProductCategoryContentFile | Shared/RecordFiles |  |
| ProductServices | get#ProductManualDocumentData |  |  |
| PromotionServices | apply#Promotion |  |  |
| PromotionServices | apply#OrderPromotions |  |  |
| PromotionServices | add#OrderPromoCode |  |  |
| PromotionServices | remove#OrderPromoCode |  |  |
| PromotionServices | apply#NewCustomerDiscount |  |  |
| PromotionServices | apply#BuyGetDiscount |  |  |
| PromotionServices | apply#FlatDiscount |  |  |
| StoreServices | create#StoreShippingOption |  |  |
| StoreServices | get#StoreShippingOptions |  |  |
| StoreServices | clone#ProductStore |  |  |
| StoreServices | format#UrlSlug |  |  |
| StoreServices | generate#UrlSlugFromProductName |  |  |
| StoreServices | generate#UrlSlugFromCategoryName |  |  |
| SubscriptionServices | init#SubscriptionResource |  |  |
| SubscriptionServices | renew#SubscriptionResourceAccess |  |  |
| SubscriptionServices | revoke#SubscriptionResourceAccess |  |  |
| SubscriptionServices | restore#SubscriptionResourceAccess |  |  |
| SubscriptionServices | destroy#SubscriptionResource |  |  |
| SubscriptionServices | fulfill#OrderSubscriptions |  |  |
| SubscriptionServices | fulfill#OrderPartSubscriptions |  |  |
| SubscriptionServices | fulfill#ProductSubscriptionResource |  |  |
| TenantSubscriptionServices | init#Tenant |  |  |
| TenantSubscriptionServices | revoke#TenantAccess |  |  |
| TenantSubscriptionServices | restore#TenantAccess |  |  |
| TenantSubscriptionServices | destroy#Tenant |  |  |

## Request (12 services, 1 added)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| RequestServices | create#Request | Commons/QuickCreate; Commons/Requests; Comms/Inbox; Comms/Chat | Commons/QuickCreate; Commons/Requests/List; Commons/Tasks/TaskDetail |
| RequestServices | update#Request | Commons/Requests/RequestDetail | Commons/Requests/RequestDetail |
| RequestServices | create#ContactRequest |  |  |
| RequestServices | create#ContactRequestReCaptcha |  |  |
| RequestServices | replace#RequestParty | Commons/Requests/RequestDetail | Commons/Requests/RequestDetail |
| RequestServices | add#RequestComment | Commons/Requests/RequestDetail | Commons/Requests/RequestDetail |
| RequestServices | update#RequestComment | Commons/Requests/RequestDetail |  |
| RequestServices | delete#RequestComment | Commons/Requests/RequestDetail |  |
| RequestServices | get#RequestContentLocation |  |  |
| RequestServices | create#RequestContent | Commons/Requests/RequestDetail; Shared/RecordFiles | Shared/RecordFiles |
| RequestServices | update#RequestContent |  |  |
| RequestServices | save#RequestContentFile | Commons/Requests/RequestDetail; Shared/RecordFiles |  |

Added in the drawers-commons build (Oct 18–19, 2026), called by built screens:

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| RequestServices | get#UserTodayRequests |  | Commons |

## Sales (8 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| AccountServices | create#Account |  |  |
| AccountServices | create#Contact |  |  |
| AccountServices | add#Contact |  |  |
| AccountServices | delete#Contact |  |  |
| SalesReportServices | get#SalesOrderSummary |  |  |
| SalesReportServices | get#SalesInvoiceSummary |  |  |
| SalesReportServices | get#SalesTopProduct |  |  |
| SalesReportServices | get#InvoicesByCustomerClass |  |  |

## Search (1 service)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| UniversalSearchServices | search#Universal | Commons/Search; Comms/Inbox | Commons; Commons/Knowledge; Commons/Notes; Commons/Search; Comms/Chat; Comms/Inbox/Mail; Comms/Inbox/MessageDetail |

## Shipment (68 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| CarrierServices | get#OrderShippingRate |  |  |
| CarrierServices | get#ShippingRatesBulk |  |  |
| CarrierServices | get#AutoPackageInfo |  |  |
| CarrierServices | get#ShippingRate |  |  |
| CarrierServices | request#ShippingLabels |  |  |
| CarrierServices | refund#ShippingLabels |  |  |
| CarrierServices | track#ShippingLabels |  |  |
| CarrierServices | validate#ShippingPostalAddress |  |  |
| CarrierServices | validate#PostalAddress |  |  |
| CarrierServices | validate#PostalAddressBulk |  |  |
| CarrierServices | calculate#OrderShipping |  |  |
| CarrierServices | calculate#OrderPartShipping |  |  |
| CarrierServices | get#OrderShippingRatesBulk |  |  |
| CarrierServices | get#ShipmentRates |  |  |
| CarrierServices | request#ShipmentLabels |  |  |
| CarrierServices | get#ShipLabelMarkup |  |  |
| CarrierServices | refund#ShipmentLabels |  |  |
| CarrierServices | track#ShipmentLabels |  |  |
| CarrierServices | get#ShipmentGatewayDetails |  |  |
| CarrierServices | remove#ShipmentLabelInfo |  |  |
| CarrierServices | remove#ShipmentReturnLabelInfo |  |  |
| CarrierServices | get#ShipmentPackageRequiresInsurance |  |  |
| CarrierServices | get#GeneralPackageRequiresInsurance |  |  |
| CarrierServices | get#OrderShippingRateLocal |  |  |
| ShipmentInfoServices | get#ShipmentDisplayInfo |  |  |
| ShipmentInfoServices | get#ShipmentContactInfo |  |  |
| ShipmentInfoServices | get#ShipmentShippingOptions |  |  |
| ShipmentInfoServices | get#ShipmentLoadPickInfo |  |  |
| ShipmentInfoServices | get#ShipmentPickPackInfo |  |  |
| ShipmentServices | create#Shipment |  |  |
| ShipmentServices | update#ShipmentAndRouteSegment |  |  |
| ShipmentServices | create#ShipmentItem |  |  |
| ShipmentServices | update#ShipmentItem |  |  |
| ShipmentServices | ensure#ShipmentItemQuantityRemaining |  |  |
| ShipmentServices | create#ShipmentPackage |  |  |
| ShipmentServices | update#ShipmentPackageAndRouteSeg |  |  |
| ShipmentServices | delete#ShipmentPackage |  |  |
| ShipmentServices | add#ItemToPackage |  |  |
| ShipmentServices | update#ShipmentPackageContent |  |  |
| ShipmentServices | reset#ShipmentPackage |  |  |
| ShipmentServices | ship#OrderPart |  |  |
| ShipmentServices | create#OrderPartShipment |  |  |
| ShipmentServices | add#OrderPartToShipment |  |  |
| ShipmentServices | pickMove#ProductToContainer |  |  |
| ShipmentServices | pickMove#ShipmentProduct |  |  |
| ShipmentServices | get#ShipmentProductByScan |  |  |
| ShipmentServices | pack#ShipmentProductScan |  |  |
| ShipmentServices | pack#ShipmentProduct |  |  |
| ShipmentServices | pack#ShipmentItemSource |  |  |
| ShipmentServices | pack#ShipmentAssemblyComponent |  |  |
| ShipmentServices | unpack#ShipmentItemIssuance |  |  |
| ShipmentServices | create#ShipmentAutoPackages |  |  |
| ShipmentServices | receive#EntireShipment |  |  |
| ShipmentServices | receive#ShipmentProduct |  |  |
| ShipmentServices | convert#ProductBoxQuantity |  |  |
| ShipmentServices | get#ShipmentPackageWeight |  |  |
| ShipmentServices | print#ShipmentLabels |  |  |
| ShipmentServices | complete#ShipmentPack |  |  |
| ShipmentServices | pack#Shipment |  |  |
| ShipmentServices | ship#Shipment |  |  |
| ShipmentServices | deliver#Shipment |  |  |
| ShipmentServices | checkSet#ShipmentDeliveredByPackages |  |  |
| ShipmentServices | cancel#Shipment |  |  |
| ShipmentServices | reduce#QuantitiesToHandled |  |  |
| ShipmentServices | send#ShipmentStoreEmail |  |  |
| ShipmentServices | create#ShipmentContent | Shared/RecordFiles | Shared/RecordFiles |
| ShipmentServices | update#ShipmentContent |  |  |
| ShipmentServices | save#ShipmentContentFile | Shared/RecordFiles |  |

## Work (87 services, 30 added)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| EventServices | get#FullCalendarData | Commons/Home; Commons/Calendar; Commons/Calendar/Schedules; Commons/Calendar/Schedules/ResourceDetail; Comms/Home; Comms/Calls | Commons/Calendar; Commons/Calendar/Schedules; Commons/Calendar/Schedules/ResourceDetail; Commons/Contacts/ContactDetail; Commons/Contacts/List; Commons/Home; Comms/Home |
| EventServices | create#Event | Commons/QuickCreate; Commons/Calendar; Commons/Calendar/EventDetail; Commons/Calendar/Schedules; Commons/Calendar/Schedules/ResourceDetail; Comms/Inbox; Comms/Chat | Commons/Calendar; Commons/Calendar/Schedules; Commons/Calendar/Schedules/ResourceDetail; Commons/QuickCreate; Shared/Chatter |
| EventServices | get#NextBusinessDay |  |  |
| EventServices | get#FutureBusinessDay |  |  |
| ManufacturingServices | get#ProductionRunDisplayInfo |  |  |
| ManufacturingServices | create#ProductionRun |  |  |
| ManufacturingServices | create#ShipmentAssemblyWorkEffort |  |  |
| ManufacturingServices | set#ProducedProductQuantity |  |  |
| ManufacturingServices | recreate#ConsumeProductsFromProduce |  |  |
| ManufacturingServices | produce#AvailableAssemblies |  |  |
| ManufacturingServices | breakDown#Assembly |  |  |
| ManufacturingServices | unissue#AssemblyComponents |  |  |
| ManufacturingServices | unissue#Component |  |  |
| ManufacturingServices | cancel#AssemblyWorkEffort |  |  |
| ManufacturingServices | get#ConsumedAssetRemaining |  |  |
| ManufacturingServices | get#ProducedProductComplete |  |  |
| ManufacturingServices | get#ProductionRunProduceConsumeDetail |  |  |
| ManufacturingServices | get#ProductBomDetail |  |  |
| ManufacturingServices | get#ProductionRunPickInfo |  |  |
| MeasurementServices | get#MeasurementUomsByMeasurementType |  |  |
| ProjectServices | clone#Project |  |  |
| ProjectServices | create#Project |  |  |
| ProjectServices | update#Project |  |  |
| ProjectServices | get#ProjectStats |  |  |
| ProjectServices | get#ProjectMilestoneSummary |  |  |
| ProjectServices | get#WorkEffortChildStats |  |  |
| ProjectServices | get#ProjectParties |  |  |
| ProjectServices | get#ProjectTeams |  |  |
| ProjectServices | get#ProjectTasks |  |  |
| ProjectServices | get#ProjectMilestones |  |  |
| ProjectServices | create#Milestone |  |  |
| ProjectServices | update#Milestone |  |  |
| ShipmentWorkServices | create#ShipmentLoadShip |  |  |
| ShipmentWorkServices | add#ShipmentToShipmentLoad |  |  |
| ShipmentWorkServices | add#OrderPartToShipmentLoad |  |  |
| ShipmentWorkServices | make#ShipmentLoadOrderConditions |  |  |
| ShipmentWorkServices | create#ShipmentLoadsForOrders |  |  |
| ShipmentWorkServices | check#ShipmentLoadStatusChange |  |  |
| ShipmentWorkServices | set#ShipmentLoadStatusOnShipmentStatus |  |  |
| ShipmentWorkServices | setAll#ShipmentLoadStatusFromShipments |  |  |
| ShipmentWorkServices | set#ShipmentLoadStatusFromShipments |  |  |
| ShipmentWorkServices | complete#ShipmentLoadShip |  |  |
| ShipmentWorkServices | close#ShipmentLoadShip |  |  |
| TaskServices | get#FullCalendarData | Commons/Calendar | Commons/Calendar |
| TaskServices | create#Task |  |  |
| TaskServices | create#SimpleTask | Commons/Panel/Today; Commons/QuickCreate; Commons/Tasks; Comms/Inbox; Comms/Chat; Shared/Chatter | Commons/Panel/Today; Commons/QuickCreate; Commons/Requests/RequestDetail; Commons/Tasks/List; Commons/Tasks/TaskDetail; Shared/Chatter |
| TaskServices | update#Task | Commons/Panel/Today; Commons/Tasks; Commons/Tasks/TaskDetail; Shared/Chatter | Commons/Panel/Today; Commons/Tasks/List; Commons/Tasks/TaskDetail; Shared/Chatter |
| TaskServices | set#TaskMilestone |  |  |
| TaskServices | set#TaskDefaults |  |  |
| TaskServices | add#TaskComment | Commons/Tasks/TaskDetail |  |
| TaskServices | update#TaskComment |  |  |
| TaskServices | delete#TaskComment |  |  |
| TaskServices | add#TaskTime | Commons/Tasks/TaskDetail | Commons/Tasks/TaskDetail |
| TaskServices | update#TaskFromTime |  | Commons/Tasks/TaskDetail |
| TaskServices | update#ProjectTimeFromTask |  |  |
| TimeServices | store#TimeEntry |  | Commons/Tasks/TaskDetail |
| TimeServices | create#TimeEntryClockIn | Commons/Tasks/TaskDetail | Commons/Tasks/TaskDetail |
| TimeServices | delete#TimeEntry |  | Commons/Tasks/TaskDetail |
| TimeServices | delete#TimeEntries |  |  |
| TimeServices | store#TimeEntryWorkEffort |  |  |
| TimeServices | store#WorkEffortPartyTime |  |  |
| TimeServices | get#TeamTimesheetInfo |  |  |
| TimeServices | get#TimeEntryAmount |  |  |
| TimeServices | resetAndGet#TimeEntryRates |  |  |
| TimeServices | resetAndGet#ProjectTimeEntryRates |  |  |
| TimeServices | get#TimeEntryRate |  |  |
| TimeServices | get#TimeEntryFacility |  |  |
| TimeServices | get#TimeEntryRiskClassInfo |  |  |
| TimeServices | find#RateAmount |  |  |
| TimeServices | find#TimeEntryRateAmount |  |  |
| TimeServices | upload#TimeSummaryFile |  |  |
| TimeServices | import#TimeSummaryFile |  |  |
| TimeServices | import#TimeSummaryRecord |  |  |
| TimeServices | upload#TimeDetailFile |  |  |
| TimeServices | import#TimeDetailFile |  |  |
| TimeServices | import#TimeDetailRecord |  |  |
| WorkEffortServices | clone#WorkEffort | Commons/Calendar/EventDetail; Commons/Tasks/TaskDetail | Commons/Calendar/EventDetail; Commons/Tasks/TaskDetail |
| WorkEffortServices | delete#WorkEffort |  | Commons/Tasks/TaskDetail |
| WorkEffortServices | add#WorkEffortParty | Commons/QuickCreate; Commons/Calendar; Commons/Calendar/EventDetail | Commons/Calendar; Commons/Calendar/EventDetail; Commons/QuickCreate; Commons/Tasks/TaskDetail |
| WorkEffortServices | remove#WorkEffortParty | Commons/Calendar/EventDetail |  |
| WorkEffortServices | replace#WorkEffortParty | Commons/Calendar/EventDetail; Commons/Tasks | Commons/Tasks/List; Commons/Tasks/TaskDetail; Shared/Chatter |
| WorkEffortServices | add#WorkEffortProduct |  |  |
| WorkEffortServices | get#WorkEffortStartEnd |  | Commons/Calendar; Commons/Calendar/EventDetail |
| WorkEffortServices | get#WorkEffortContentLocation |  |  |
| WorkEffortServices | create#WorkEffortContent | Commons/Tasks/TaskDetail; Shared/RecordFiles | Shared/RecordFiles |
| WorkEffortServices | update#WorkEffortContent |  |  |
| WorkEffortServices | save#WorkEffortContentFile | Commons/Tasks/TaskDetail; Shared/RecordFiles |  |

Added in the drawers-commons build (Oct 18–19, 2026), called by built screens:

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| CalendarServices | check#CalendarAccess |  | Commons/Calendar; Commons/Calendar/EventDetail; Commons/Settings/Calendars; Commons/Settings/Preferences |
| CalendarServices | ensure#UserDefaultCalendar |  | Commons/Calendar; Commons/Calendar/EventDetail; Commons/Calendar/Schedules; Commons/Calendar/Schedules/ResourceDetail; Commons/QuickCreate; Shared/Chatter |
| CalendarServices | create#Calendar |  | Commons/Settings/Calendars |
| CalendarServices | update#Calendar |  | Commons/Settings/Calendars; Commons/Settings/Preferences |
| CalendarServices | delete#Calendar |  | Commons/Settings/Calendars |
| CalendarServices | share#Calendar |  | Commons/Settings/Calendars |
| CalendarServices | unshare#Calendar |  | Commons/Settings/Calendars |
| CalendarServices | get#UserCalendars |  | Commons/Calendar; Commons/Calendar/EventDetail; Commons/QuickCreate; Commons/Settings/Calendars; Commons/Settings/Preferences; Comms/Inbox/Mail |
| CalendarServices | add#CalendarEvent |  | Commons/Calendar/EventDetail |
| CalendarServices | remove#CalendarEvent |  | Commons/Calendar/EventDetail |
| CalendarServices | subscribe#Calendar |  | Commons/Settings/Calendars |
| CalendarServices | fetch#CalendarSubscriptions |  | Commons/Settings/Calendars |
| CalendarServices | export#Calendar |  | Commons/Calendar; Commons/Settings/Calendars |
| CalendarServices | import#Calendar |  | Commons/Settings/Calendars |
| EventServices | check#EventAccess |  | Commons/Calendar; Commons/Calendar/EventDetail |
| EventServices | get#EventIcsMaps |  | Commons/Calendar/EventDetail |
| EventServices | store#EventRecurrence |  | Commons/Calendar; Commons/Calendar/EventDetail |
| EventServices | update#EventOccurrence |  | Commons/Calendar; Commons/Calendar/EventDetail |
| EventServices | cancel#EventOccurrence |  | Commons/Calendar; Commons/Calendar/EventDetail |
| EventServices | respond#EventInvitation |  | Commons/Calendar; Commons/Calendar/EventDetail; Comms/Inbox/Mail |
| EventServices | get#InvitationDigest |  | Commons/Calendar/EventDetail |
| EventServices | send#EventInvitations |  | Commons/Calendar; Commons/Calendar/EventDetail; Commons/QuickCreate |
| EventServices | remove#EventAttendee |  | Commons/Calendar/EventDetail |
| EventServices | get#FreeBusy |  | Commons/Calendar; Commons/Calendar/EventDetail |
| EventServices | book#Resource |  | Commons/Calendar; Commons/Calendar/EventDetail; Commons/Calendar/Schedules; Commons/Calendar/Schedules/ResourceDetail |
| EventServices | cancel#ResourceBooking |  | Commons/Calendar/EventDetail; Commons/Calendar/Schedules; Commons/Calendar/Schedules/ResourceDetail |
| EventServices | store#WorkEffortReminders |  | Commons/Calendar; Commons/Calendar/EventDetail |
| WorkEffortServices | link#WorkEffortRecord |  | Commons/Calendar; Commons/Panel/Today; Commons/QuickCreate; Commons/Requests/RequestDetail; Commons/Tasks/List; Commons/Tasks/TaskDetail; Shared/Chatter |
| WorkEffortServices | get#UserTodayItems |  | Commons/Home; Commons/Panel/Today |
| WorkEffortServices | snooze#UserTodayItem |  | Commons/Panel/Today; Commons/Tasks/List; Commons/Tasks/TaskDetail |

## General (2 services)

| Service XML | Service | Designed in | Implemented in |
| --- | --- | --- | --- |
| GeneralServices | lookup#ById | Commons/Calendar/EventDetail; Commons/Knowledge; Comms/Inbox; Comms/Chat | Commons; Commons/Knowledge; Commons/Notes; Comms/Chat; Comms/Inbox/Mail; Comms/Inbox/MessageDetail; Shared/Chatter |
| GeneralServices | search#MantleFiltered |  |  |

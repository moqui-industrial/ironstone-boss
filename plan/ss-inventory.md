# MrSimpleScreens form inventory

Per-form inventory of the MrSimpleScreens component, for tracking form-level feature parity in IronStone BOSS.

- Source: `runtime/component/MrSimpleScreens/screen/` (current working tree).
- Form: every `<form-single>` and `<form-list>` element, including forms nested in dialogs, sections and includes.
- The **Designed in** column is filled when a design file is reviewed with the IronStone screen path(s) whose forms cover it (`—` when deliberately not carried forward, with the reason in that design's Decided table); the **Implemented in** column is filled during implementation with the screen and form that exist. See [design-doc-guide.md](design-doc-guide.md) §9.
- **Implemented in** was filled on Oct 19, 2026 from the drawers-commons build, by the path of the built screen that carries each form of its **Designed in** cell: a designed screen built as a parent with subscreens is its default subscreen (`Commons/Tasks/List`, `Commons/Requests/List`, `Commons/Contacts/List`, `Comms/Inbox/Mail`); the contact record (`template/ContactRecord.xml`) is on both `Commons/Contacts/ContactDetail` and the main pane of `Commons/Contacts/List`; a space's settings are on `Commons/Knowledge/SpaceDetail`, and a page's attachments are Knowledge's own, not record files; a `—` row stays `—`. Filled: the 101 rows designed with a path (wiki `ClonePage` since Oct 19, Knowledge's Duplicate page), and the 5 `—` rows. The update note and comment forms the design gives to `Shared/Chatter` (`UpdateNoteForm`, the `…CommentUpdate` `ReplyCommentForm`) are Chatter's edit of a note in place (since Oct 19). Rows that other design files are to fill stay blank.
- **Designed in** for [design-projects.md](design-projects.md) was filled on Oct 21, 2026 from that design's §13.1 and the **Derived from** cells of its form summaries, each screen by the path the design gives it: a project's tab is a subscreen of `Projects/Projects/ProjectDetail`, and a screen the design mounts in a tab with the project fixed (WorkItems, Requests, TimeEntries) is listed by its own path. Paths are added after what an earlier design wrote. The rows of the git forms added to SimpleScreens on Oct 20 came with it: `Project/EditRepositories`, `ProjectSummary`'s `ViewGitRepositoryList` and `ViewGitTagList`, `Task/EditSource` and `MyAccount/User/GitAccess` (`Project/GitCommit` has no forms); their **Implemented in** is blank. The My Account expense forms other than the worker invoice stay blank for design-people.
- **Implemented in** for [design-projects.md](design-projects.md) was filled on Oct 22, 2026 at the end of the Projects build (impl-projects.md P11), by the path of the built screen that carries each form of its Projects **Designed in** paths, after what Commons wrote: a section designed as one screen is its default subscreen (`Projects/Projects/List`, `Projects/WorkItems/List`, `Projects/Requests/List`), the project form of QuickCreate is `Projects/QuickProject` (impl-projects.md F8), a tab mounted from another screen keeps the tab's path (`Projects/Projects/ProjectDetail/Time`, `…/Docs`), and the shared screens keep their Projects mount (`Projects/WorkItems/WorkItemDetail`, `Projects/Requests/RequestDetail`). Twelve rows stay blank for the parts impl-projects.md §7 leaves for later: the worker and contractor invoices (My Account's `WorkerInvoice` and Unbilled's worker forms), a manager's clock-in for another person (`PartyTimeEntries` `ClockInForm`), request items (`EditRequestItems`), and wiki pages linked to a work item or a request (`EditWikiPages` on WorkItemDetail and RequestDetail; the Docs tab links pages to a project).

## MyAccount (49 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditExpenseInvoice | WorkerInvoice | Projects/Time/MyTime |  |
| EditExpenseInvoice | EditInvoice |  |  |
| EditExpenseInvoiceItems | CreateInvoiceItem |  |  |
| EditExpenseInvoiceItems | EditInvoiceItems |  |  |
| FindExpenseInvoice | CreateInvoice |  |  |
| FindExpenseInvoice | WorkerInvoice | Projects/Time/MyTime |  |
| FindExpenseInvoice | InvoiceList |  |  |
| Account | ChangePasswordForm | Commons/Settings/Account | Commons/Settings/Account |
| Account | SecondFactorSendForm | Commons/Settings/Account | Commons/Settings/Account |
| Account | EditUser | Commons/Settings/Account | Commons/Settings/Account |
| Account | CreateUserAuthcFactorTotp | Commons/Settings/Account | Commons/Settings/Account |
| Account | CreateUserAuthcFactorSingleUse | Commons/Settings/Account | Commons/Settings/Account |
| Account | CreateUserAuthcFactorEmail | Commons/Settings/Account | Commons/Settings/Account |
| Account | CreateUserAuthcFactorSms | Commons/Settings/Account | Commons/Settings/Account |
| Account | UserAuthcFactorList | Commons/Settings/Account | Commons/Settings/Account |
| EventDetail | UpdateEvent | Commons/Calendar/EventDetail | Commons/Calendar/EventDetail |
| EventDetail | NewNoteForm | Commons/Calendar/EventDetail; Shared/Chatter | Commons/Calendar/EventDetail; Shared/Chatter |
| EventDetail | UpdateNoteForm | Commons/Calendar/EventDetail; Shared/Chatter | Commons/Calendar/EventDetail; Shared/Chatter |
| EventDetail | AddPartyAssignForm | Commons/Calendar/EventDetail | Commons/Calendar/EventDetail |
| EventDetail | UpdateAssignForm | Commons/Calendar/EventDetail | Commons/Calendar/EventDetail |
| EventDetail | AddEquipment | Commons/Calendar/EventDetail | Commons/Calendar/EventDetail |
| EventDetail | EquipmentList | Commons/Calendar/EventDetail | Commons/Calendar/EventDetail |
| MyCalendar | NewEventForm | Commons/Calendar; Commons/QuickCreate | Commons/Calendar; Commons/QuickCreate |
| UpdateContactInfo | ShippingInfo | Commons/Settings/Account | Commons/Settings/Account |
| GitAccess | CreateAccessTokenForm | Projects/Code/GitAccess | Projects/Code/GitAccess |
| GitAccess | AccessTokenList | Projects/Code/GitAccess | Projects/Code/GitAccess |
| GitAccess | AddSshKeyForm | Projects/Code/GitAccess | Projects/Code/GitAccess |
| GitAccess | SshKeyList | Projects/Code/GitAccess | Projects/Code/GitAccess |
| EditMessage | ReplyMessageForm | Comms/Inbox/Compose | Comms/Inbox/Compose |
| EditMessage | MessageForm | Comms/Inbox/Compose | Comms/Inbox/Compose |
| EditMessage | AddPurposeForm | — | — |
| EditMessage | PurposesForm | — | — |
| FindMessage | CreateMessage | Comms/Inbox/Compose | Comms/Inbox/Compose |
| FindMessage | MessageList | Comms/Inbox | Comms/Inbox/Mail |
| SingleMessage | ReplyMessageForm | Comms/Inbox/Compose; Shared/Chatter | Comms/Inbox/Compose; Shared/Chatter |
| Notifications | NotificationTopicList | Commons/Settings/Notifications | Commons/Settings/Notifications |
| Notifications | NotificationList | Commons/Notifications; Commons/Panel/Notifications | Commons/Notifications; Commons/Panel/Notifications |
| EditRequest | EditRequest | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail |
| EditRequest | UpdatePartyForm | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail |
| RequestCommentReply | ReplyCommentForm | Commons/Requests/RequestDetail; Shared/Chatter | Commons/Requests/RequestDetail; Shared/Chatter |
| RequestCommentUpdate | ReplyCommentForm | Commons/Requests/RequestDetail; Shared/Chatter | Commons/Requests/RequestDetail; Shared/Chatter |
| MyRequests | NewRequestForm | Commons/Requests; Commons/QuickCreate | Commons/Requests/List; Commons/QuickCreate |
| MyRequests | ListRequests | Commons/Home; Commons/Requests | Commons/Home; Commons/Requests/List |
| ScheduledFinds | ScreenScheduledList |  |  |
| EditScheduledFind | EditScreenScheduled |  |  |
| MyTasks | NewTaskForm | Commons/Tasks; Commons/QuickCreate | Commons/Tasks/List; Commons/QuickCreate |
| MyTasks | MyTasks | Commons/Panel/Today; Commons/Home; Commons/Tasks; Projects/Home | Commons/Panel/Today; Commons/Home; Commons/Tasks/List; Projects/Home |
| TaskDetail | UpdateEvent | Commons/Tasks/TaskDetail | Commons/Tasks/TaskDetail |
| TimeEntries | TimeEntryList | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail; Projects/Time/MyTime; Projects/Time/TimeEntries | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail; Projects/Time/MyTime; Projects/Time/TimeEntries |

## Accounting (166 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| BudgetAccountsEntry | GlAccountBudgetList |  |  |
| BudgetReport | GlAccountBudgetList |  |  |
| EditBudget | UpdateBudgetForm |  |  |
| EditBudgetItems | AddItemForm |  |  |
| EditBudgetItems | BudgetItemList |  |  |
| FindBudget | NewBudgetForm |  |  |
| FindBudget | BudgetList |  |  |
| EditFinancialAccount | StatementForm |  |  |
| EditFinancialAccount | UpdateFinancialAccountForm |  |  |
| FinancialAccountTrans | AdjustFinancialAccount |  |  |
| FinancialAccountTrans | TransactionList |  |  |
| FindFinancialAccount | NewFinancialAccountForm |  |  |
| FindFinancialAccount | FinancialAccountList |  |  |
| FindJournal | CreateGlJournal |  |  |
| FindJournal | TransactionList |  |  |
| EditGlAccount | EditGlAccountForm |  |  |
| EditGlAccount | NewGlAccountOrgForm |  |  |
| EditGlAccount | GlAccountOrgList |  |  |
| FindGlAccount | NewGlAccountForm |  |  |
| FindGlAccount | GlAccountListForm |  |  |
| Aging | ReportOptions |  |  |
| Aging | InvoiceAgingList |  |  |
| EditInvoice | AdjustInvoice |  |  |
| EditInvoice | OutSystemMessageList |  |  |
| EditInvoice | AuditLogList |  |  |
| EditInvoice | EditInvoice |  |  |
| EditInvoice | NewContentForm |  |  |
| EditInvoice | UpdateContentForm |  |  |
| EditInvoice | SendPastDueEmailForm |  |  |
| EditInvoice | SendFinalizedEmailForm |  |  |
| EditInvoice | EmailMessageList |  |  |
| EditInvoice | NewCreditMemoForm |  |  |
| EditInvoice | RecordPaymentForm |  |  |
| EditInvoice | PaymentApplicationList |  |  |
| EditInvoice | OrderPromisedPaymentList |  |  |
| EditInvoice | UnappliedPaymentList |  |  |
| EditInvoice | UnpaidInvoiceList |  |  |
| EditInvoice | InvoiceTxList |  |  |
| EditInvoice | InvoiceGlaList |  |  |
| EditInvoiceItemDetails | AddDetailForm |  |  |
| EditInvoiceItemDetails | AssetItemDetailList |  |  |
| EditInvoiceItemDetails | FacilityItemDetailList |  |  |
| EditInvoiceItemDetails | ItemDetailList |  |  |
| EditInvoiceItemOrders | ApplyToOrder |  |  |
| EditInvoiceItemOrders | ApplyItemToOrder |  |  |
| EditInvoiceItemOrders | ItemBillingList |  |  |
| EditInvoiceItemShipments | ApplyToShipment |  |  |
| EditInvoiceItemShipments | ApplyItemToShipment |  |  |
| EditInvoiceItemShipments | ItemSourceList |  |  |
| EditInvoiceItems | CreateInvoiceItem |  |  |
| EditInvoiceItems | EditInvoiceItems |  |  |
| FindInvoice | NewPayableForm |  |  |
| FindInvoice | NewReceivableForm |  |  |
| FindInvoice | NewCustCreditForm |  |  |
| FindInvoice | NewSupCreditForm |  |  |
| FindInvoice | ProjectInvoice | Projects/Billing/Unbilled | Projects/Billing/Unbilled |
| FindInvoice | ProjectWorkerInvoice | Projects/Billing/Unbilled |  |
| FindInvoice | WorkerInvoice | Projects/Billing/Unbilled |  |
| FindInvoice | CustomerStatementForm |  |  |
| FindInvoice | MainOptions |  |  |
| FindInvoice | InvoiceList |  |  |
| FindInvoice | AgingSummaryList |  |  |
| AcctgPreference | EditPapForm |  |  |
| AcctgPreference | CloneAcctgSettingsForm |  |  |
| AssetTypes | AddConfigForm |  |  |
| AssetTypes | AllConfigList |  |  |
| FinAcctReasons | AllTypesList |  |  |
| FinAcctTypes | AllTypesList |  |  |
| GlAccounts | NewGlAccountOrgForm |  |  |
| GlAccounts | GlAccountOrgList |  |  |
| InvoiceTypes | AddConfigForm |  |  |
| InvoiceTypes | MissingConfigForm |  |  |
| InvoiceTypes | AllConfigList |  |  |
| ItemTypes | AddConfigForm |  |  |
| ItemTypes | MissingConfigForm |  |  |
| ItemTypes | AllConfigList |  |  |
| PaymentInstruments | AllEnumList |  |  |
| PaymentTypes | AddConfigForm |  |  |
| PaymentTypes | MissingConfigForm |  |  |
| PaymentTypes | AllConfigList |  |  |
| TypeDefaults | AllEnumList |  |  |
| BulkPaymentCheck | PaymentList |  |  |
| BulkPaymentCheck | PaymentListAssignRef |  |  |
| BulkPaymentCheck | PaymentListActions |  |  |
| EditPayment | RefundPaymentForm |  |  |
| EditPayment | AuditLogList |  |  |
| EditPayment | EditPayment |  |  |
| EditPayment | GatewayAuthorizeForm |  |  |
| EditPayment | GatewayCaptureForm |  |  |
| EditPayment | GatewayRefundForm |  |  |
| EditPayment | SetRefundForForm |  |  |
| EditPayment | GatewayRefundForForm |  |  |
| EditPayment | RefundPaymentList |  |  |
| EditPayment | PaymentApplicationList |  |  |
| EditPayment | UnpaidInvoiceList |  |  |
| EditPayment | UnappliedPaymentList |  |  |
| EditPayment | PaymentTxList |  |  |
| EditPayment | InvoiceGlaList |  |  |
| EditPayment | NewContentForm |  |  |
| EditPayment | UpdateContentForm |  |  |
| EditPayment | GatewayResponseList |  |  |
| FindPayment | NewInPaymentForm |  |  |
| FindPayment | NewOutPaymentForm |  |  |
| FindPayment | PaymentList |  |  |
| AccountBalance | AccountBalanceHistory |  |  |
| AccountLedger | AccountLedger |  |  |
| ArAgingSummary | ReportOptions |  |  |
| ArAgingSummary | InvoiceAgingList |  |  |
| AssetOnHand | AssetOnHandSummary |  |  |
| AssetOnHandSummary | FieldDescriptions |  |  |
| AssetOnHandSummary | AssetOnHandSummary |  |  |
| AssetReceiptTransaction | AssetReceiptTxList |  |  |
| AssetStatusByReceipt | FieldDescriptions |  |  |
| AssetStatusByReceipt | AssetOnHandSummary |  |  |
| AssetValuation | AssetValuationSummary |  |  |
| InvoiceAgingDetail | ReportOptions |  |  |
| InvoiceAgingDetail | InvoiceAgingList |  |  |
| InvoiceItemSummary | InvoiceItemSummary |  |  |
| InvoiceReconciliation | ReportOptions |  |  |
| InvoiceReconciliation | InvoiceVsGlList |  |  |
| InvoiceReconciliation | PaymentVsGlList |  |  |
| InvoiceReconciliation | NotPostedTxList |  |  |
| InvoiceReconciliation | CreditNeqDebitTxList |  |  |
| InvoiceReconciliation | NoInvoiceTxList |  |  |
| InvoiceReconciliation | ApplicationFutureInvoiceList |  |  |
| OrderIssuedInvoiced | OrderIssuedInvoiced |  |  |
| OrderItemSummary | OrderItemSummary |  |  |
| PostedAmountSummary | ResultListForm |  |  |
| PostedBalanceSummary | ResultList |  |  |
| ReportList | BalanceSheetForm |  |  |
| ReportList | IncomeStatementForm |  |  |
| ReportList | CashFlowStatementForm |  |  |
| ReportList | RetainedEarningsStatementForm |  |  |
| ReportList | FinancialRatiosForm |  |  |
| ReportList | CustomerStatementForm |  |  |
| ReportList | AccountLedgerForm |  |  |
| ReportList | AccountBalanceForm |  |  |
| ReportList | PostedAmountSummaryForm |  |  |
| ReportList | PostedBalanceSummaryForm |  |  |
| SalesAnalysis | SalesAnalysis |  |  |
| SalesInvoiceAnalysis | SalesInvoiceAnalysis |  |  |
| SalesSummary | SummaryOptions |  |  |
| SalesSummary | TopProductList |  |  |
| SalesSummary | SalesOrderSummaryList |  |  |
| SalesSummary | TopCustomerClassList |  |  |
| SalesSummary | SalesInvoiceSummaryList |  |  |
| ShipmentPackageSummary | ShipmentPackageSummary |  |  |
| EditTimePeriod | CreateNextPeriod |  |  |
| EditTimePeriod | CreatePreviousPeriod |  |  |
| EditTimePeriod | ViewTimePeriod |  |  |
| EditTimePeriod | CreateChild |  |  |
| EditTimePeriod | TimePeriodList |  |  |
| FindTimePeriod | CreatePeriod |  |  |
| FindTimePeriod | TimePeriodList |  |  |
| ViewPeriodGlAccounts | ClosingTransForm |  |  |
| ViewPeriodGlAccounts | PeriodGlAccountList |  |  |
| EditTransaction | UpdateAcctgTrans |  |  |
| EditTransaction | UpdateAcctgTransPosted |  |  |
| EditTransaction | AddEntryForm |  |  |
| EditTransaction | EntryListForm |  |  |
| EditTransaction | AuditLogList |  |  |
| MoveEntry | ReceiveForm |  |  |
| FindTransaction | CreateAcctgTrans |  |  |
| FindTransaction | TransactionList |  |  |
| FindTransactionEntry | TransactionEntryList |  |  |
| OrgInternalSummary | OrgInternalForm |  |  |

## Asset (65 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| AssetCalendar | NewEventForm | Commons/Calendar/Schedules | Commons/Calendar/Schedules |
| AssetDetail | UpdateAssetAcquireCost |  |  |
| AssetDetail | AuditLogList |  |  |
| AssetDetail | EditAsset |  |  |
| AssetDetail | ReservationsListForm |  |  |
| AssetDetail | AssetDetailList |  |  |
| AssetDetail | AssetDepreciationList |  |  |
| EditAssetMaintenance | UpdateMaintenanceForm |  |  |
| EditAssetMaintenance | NewContentForm |  |  |
| EditAssetMaintenance | UpdateContentForm |  |  |
| FindAssetMaintenance | AddPlannedMaintenance |  |  |
| FindAssetMaintenance | AddOtherMaintenance |  |  |
| FindAssetMaintenance | ProductMaintenanceList |  |  |
| FindAssetMaintenance | MaintenanceListForm |  |  |
| AssetMeters | NewMeterForm |  |  |
| AssetMeters | MeterListForm |  |  |
| AssetParties | AddUserForm |  |  |
| AssetParties | UpdateUserForm |  |  |
| AssetRegistrations | NewRegistrationForm |  |  |
| AssetRegistrations | RegistrationsForm |  |  |
| DetailHistory | AssetDetailList |  |  |
| FindAsset | UpdateProductCost |  |  |
| FindAsset | CreateEquipment |  |  |
| FindAsset | ListAssets |  |  |
| FindSummary | ReceiveAssetForm |  |  |
| FindSummary | PhysicalManualChange |  |  |
| FindSummary | AssetSummary |  |  |
| PhysicalChange | RecordChange |  |  |
| PhysicalQuantity | RecordQuantity |  |  |
| MoveAsset | AssetInfoForm |  |  |
| MoveAsset | ScanMoveAssetForm |  |  |
| MoveAsset | EnterMoveAssetForm |  |  |
| SelectAsset | ScanAssetForm |  |  |
| SelectAsset | ActiveFacilityForm |  |  |
| SelectAsset | SelectAssetForm |  |  |
| SelectAsset | SelectLocationForm |  |  |
| SelectAsset | ScanMoveAssetForm |  |  |
| SelectAsset | EnterMoveAssetForm |  |  |
| SelectAsset | ContainerAssetList |  |  |
| SelectAsset | LocationAssetList |  |  |
| SelectAsset | ProductNoLocAssetList |  |  |
| SelectAsset | RecentMoveForm |  |  |
| SelectAsset | RecentContainerMoveForm |  |  |
| EditAssetPool | UpdateAssetPoolForm |  |  |
| EditAssetPool | AddPartyForm |  |  |
| EditAssetPool | PartyListForm |  |  |
| EditAssetPool | AddStoreForm |  |  |
| EditAssetPool | StoreListForm |  |  |
| FindAssetPool | CreateAssetPoolForm |  |  |
| FindAssetPool | AssetPoolList |  |  |
| EditContainer | PickScanForm |  |  |
| EditContainer | UpdateContainerForm |  |  |
| EditContainer | AddAssetForm |  |  |
| EditContainer | AssetListForm |  |  |
| FindContainer | CreateContainerForm |  |  |
| FindContainer | ContainerList |  |  |
| MoveContainer | ContainerInfoForm |  |  |
| MoveContainer | AssetListForm |  |  |
| MoveContainer | ScanMoveContainerForm |  |  |
| MoveContainer | EnterMoveContainerForm |  |  |
| EditLots | CreateLot |  |  |
| EditLots | LotList |  |  |
| EditPhysicalInventory | UpdateMasterEntityValue |  |  |
| EditPhysicalInventory | AssetDetailList |  |  |
| FindPhysicalInventory | PhysicalInventoryList |  |  |

## Catalog (80 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| Category/Content/ContentDetail | UpdateContentForm |  |  |
| Category/Content/ContentDetail | UpdateTextForm |  |  |
| Category/Content/ContentList | NewContentForm |  |  |
| Category/Content/ContentList | NewLocationForm |  |  |
| Category/Content/ContentList | NewTextForm |  |  |
| Category/Content/ContentList | ContentList |  |  |
| EditCategory | EditCategoryForm |  |  |
| EditCategory | AddChild |  |  |
| EditCategory | ChildCategoriesForm |  |  |
| EditCategory | GenerateCategoryIdent |  |  |
| EditCategory | AddCategoryIdentForm |  |  |
| EditCategory | CategoryIdentForm |  |  |
| EditCategory | ParentCategoriesForm |  |  |
| EditCategory | AddFeatureGroupForm |  |  |
| EditCategory | FeatureGroupsForm |  |  |
| EditProducts | AddProductForm |  |  |
| EditProducts | ProductsForm |  |  |
| FindCategory | NewCategoryForm |  |  |
| FindCategory | CategoriesForm |  |  |
| EditFeature | NewFeatureForm |  |  |
| EditFeature | EditFeatureForm |  |  |
| EditFeature | AddFeatureGroupForm |  |  |
| EditFeature | FeatureGroupsForm |  |  |
| EditFeature | AddProductForm |  |  |
| EditFeature | ProductsForm |  |  |
| FindFeature | NewFeatureForm |  |  |
| FindFeature | FeaturesForm |  |  |
| EditFeatureGroup | EditFeatureGroupForm |  |  |
| EditFeatureGroup | AddCategoryForm |  |  |
| EditFeatureGroup | CategoriesForm |  |  |
| EditFeatureGroup | AddFeatureForm |  |  |
| EditFeatureGroup | FeaturesForm |  |  |
| FindFeatureGroup | NewFeatureGroupForm |  |  |
| FindFeatureGroup | FeatureGroupsForm |  |  |
| Product/Content/ContentDetail | UpdateContentForm |  |  |
| Product/Content/ContentDetail | UpdateTextForm |  |  |
| Product/Content/ContentList | NewContentForm |  |  |
| Product/Content/ContentList | NewLocationForm |  |  |
| Product/Content/ContentList | NewTextForm |  |  |
| Product/Content/ContentList | ContentList |  |  |
| EditAssocs | AddAssocToForm |  |  |
| EditAssocs | AssocToListForm |  |  |
| EditAssocs | AssocFromListForm |  |  |
| EditAssocs | CreateVariantsForm |  |  |
| EditAssocs | AllSelectableFeaturesForm |  |  |
| EditCategories | AddCategoryForm |  |  |
| EditCategories | CategoriesForm |  |  |
| EditPrices | NewPriceForm |  |  |
| EditPrices | PricesForm |  |  |
| EditProduct | CloneProductForm |  |  |
| EditProduct | EditProductForm |  |  |
| EditProduct | AddIdentificationForm |  |  |
| EditProduct | IdentificationsForm |  |  |
| EditProduct | GenerateOtherIdentification |  |  |
| EditProduct | AddOtherIdentificationForm |  |  |
| EditProduct | OtherIdentificationsForm |  |  |
| EditProduct | NewFeatureForm |  |  |
| EditProduct | AddFeatureForm |  |  |
| EditProduct | FeaturesForm |  |  |
| EditProduct | AddDimensionForm |  |  |
| EditProduct | DimensionsForm |  |  |
| EditProduct | AddUomDimensionForm |  |  |
| EditProduct | UomDimensionsForm |  |  |
| EditProduct | CreateProductLocation |  |  |
| EditProduct | ProductLocationList |  |  |
| EditProduct | CreateProductMeter |  |  |
| EditProduct | ProductMeterList |  |  |
| EditProduct | CreateProductMaintenance |  |  |
| EditProduct | ProductMaintenanceList |  |  |
| FindProduct | NewProductForm |  |  |
| FindProduct | ProductsForm |  |  |
| Search | AddCategoryForm |  |  |
| Search | RemoveCategoryForm |  |  |
| Search | AddFeatureForm |  |  |
| Search | RemoveFeatureForm |  |  |
| Search | ProductsForm |  |  |
| Search | AddCategoryFormSelection |  |  |
| Search | RemoveCategoryFormSelection |  |  |
| Search | AddFeatureFormSelection |  |  |
| Search | RemoveFeatureFormSelection |  |  |

## Customer (7 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| CustomerData | CustomerDataList |  |  |
| FindCustomer | CreatePersonForm |  |  |
| FindCustomer | CreateOrganizationForm |  |  |
| FindCustomer | CreateAccountForm |  |  |
| FindCustomer | CreateContactForm |  |  |
| FindCustomer | OuterSearchForm |  |  |
| FindCustomer | CustomerListForm |  |  |

## Facility (18 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| BoxTypes | CreateBoxType |  |  |
| BoxTypes | BoxTypeList |  |  |
| CarrierShipMethods | CreateCarrierShipmentMethod |  |  |
| CarrierShipMethods | CarrierShipmentMethodList |  |  |
| EditFacility | EditFacilityForm |  |  |
| EditFacility | ChildListForm |  |  |
| EditFacility | NewNoteForm |  |  |
| EditFacility | UpdateNoteForm |  |  |
| EditFacility | AddBoxTypeForm |  |  |
| EditFacility | BoxTypesForm |  |  |
| EditFacility | AddLocationTypeForm |  |  |
| EditFacility | LocationTypesForm |  |  |
| EditFacilityLocations | NewLocationForm |  |  |
| EditFacilityLocations | LocationsForm |  |  |
| EditFacilityProducts | AddProductForm |  |  |
| EditFacilityProducts | ProductList |  |  |
| FindFacility | NewFacilityForm |  |  |
| FindFacility | FacilityListForm |  |  |

## Gateway (6 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditPaymentGateway | EditPaymentGatewayForm |  |  |
| FindPaymentGateway | NewPaymentGatewayForm |  |  |
| FindPaymentGateway | PaymentGatewaysForm |  |  |
| EditShippingGateway | EditShippingGatewayForm |  |  |
| FindShippingGateway | NewShippingGatewayForm |  |  |
| FindShippingGateway | ShippingGatewaysForm |  |  |

## HumanRes (2 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditRateAmounts | CreateRateAmount | Projects/Projects/ProjectDetail/Money; Projects/Billing/Rates | Projects/Projects/ProjectDetail/Money; Projects/Billing/Rates |
| EditRateAmounts | EditRateAmounts | Projects/Projects/ProjectDetail/Money; Projects/Billing/Rates | Projects/Projects/ProjectDetail/Money; Projects/Billing/Rates |

## Manufacturing (23 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditRun | UpdateRun |  |  |
| EditRun | NewNoteForm |  |  |
| EditRun | UpdateNoteForm |  |  |
| EditRun | AddEquipment |  |  |
| EditRun | EquipmentList |  |  |
| EditRun | AddPartyAssignForm |  |  |
| EditRun | UpdateAssignForm |  |  |
| FindRun | NewRunForm |  |  |
| FindRun | RunList |  |  |
| RunConsumed | IssueAssetForm |  |  |
| RunConsumed | ConsumeAssetForm |  |  |
| RunConsumed | IssuedAssetForm |  |  |
| RunProduced | ReceiveAssetForm |  |  |
| RunProduced | ReceivedAssetForm |  |  |
| RunProducts | AddProduceForm |  |  |
| RunProducts | ReceiveAssetForm |  |  |
| RunProducts | ProduceList |  |  |
| RunProducts | AddConsumeForm |  |  |
| RunProducts | IssueAssetForm |  |  |
| RunProducts | ConsumeList |  |  |
| ConsumeAsset | ConsumeAssetForm |  |  |
| ConsumeProduct | ConsumeAssetForm |  |  |
| ProduceAsset | ReceiveAssetForm |  |  |

## Order (43 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| FindOrder | CreateSalesOrder |  |  |
| FindOrder | ApproveOrdersForm |  |  |
| FindOrder | CloseOrdersForm |  |  |
| FindOrder | CreatePurchaseOrder |  |  |
| FindOrder | OrderList |  |  |
| OrderDetail | CloseOrderPartItems |  |  |
| OrderDetail | AddPartForm |  |  |
| OrderDetail | RecurOptions |  |  |
| OrderDetail | AuditLogList |  |  |
| OrderDetail | HeaderForm |  |  |
| OrderDetail | AddPromoCode |  |  |
| OrderDetail | AddPartyPromoCode |  |  |
| OrderDetail | OrderPromoCodeList |  |  |
| OrderDetail | ItemLimitForm |  |  |
| OrderDetail | NewNoteForm |  |  |
| OrderDetail | UpdateNoteForm |  |  |
| OrderDetail | NewContentForm |  |  |
| OrderDetail | UpdateContentForm |  |  |
| OrderDetail | SendPlacedEmailForm |  |  |
| OrderDetail | EmailMessageList |  |  |
| OrderDetail | SystemMessageList |  |  |
| OrderDetail | ChildOrderList |  |  |
| OrderDetail | AddOrderPartToShipmentForm |  |  |
| OrderDetail | EditPartForm |  |  |
| OrderDetail | EditPartNonEdForm |  |  |
| OrderDetail | CreateOrderPartParty |  |  |
| OrderDetail | CloseOrderPartItems |  |  |
| OrderDetail | AddPaymentForm |  |  |
| OrderDetail | UpdatePaymentForm |  |  |
| OrderDetail | GatewayAuthorizeForm |  |  |
| OrderDetail | GatewayResponseList |  |  |
| OrderDetail | SetOrderInfoForm |  |  |
| OrderDetail | AddProductItemForm |  |  |
| OrderDetail | AddOtherItemForm |  |  |
| OrderDetail | OrderItems |  |  |
| EditItem | EditOrderItem |  |  |
| ItemReserve | ReserveItem |  |  |
| ReturnItem | ReturnItem |  |  |
| OrderItems | AddProductItemForm |  |  |
| OrderItems | AddOtherItemForm |  |  |
| OrderItems | OrderItems |  |  |
| QuickItems | QuickItemOptions |  |  |
| QuickItems | QuickItemList |  |  |

## Party (105 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditParty | CreateUserAccount |  |  |
| EditParty | ConvertToPersonForm |  |  |
| EditParty | ConvertToOrganizationForm |  |  |
| EditParty | EditOrganizationForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | EditPersonForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | AddDirectRoleForm |  |  |
| EditParty | AddOtherRoleForm |  |  |
| EditParty | RolesForm |  |  |
| EditParty | SetClassificationForm |  |  |
| EditParty | ClassificationsForm |  |  |
| EditParty | AddIdentificationForm |  |  |
| EditParty | IdentificationsForm |  |  |
| EditParty | AddSettingForm |  |  |
| EditParty | AddSettingTextForm |  |  |
| EditParty | SettingsForm |  |  |
| EditParty | UpdateUserAccount |  |  |
| EditParty | AddGroupForm |  |  |
| EditParty | GroupsForm |  |  |
| EditParty | NewToRelForm |  |  |
| EditParty | UserOrgRelList |  |  |
| EditParty | AddSalesAccount |  |  |
| EditParty | AccountRelList |  |  |
| EditParty | AddContactAssignForm |  |  |
| EditParty | CreateContactForm |  |  |
| EditParty | ContactRelList |  |  |
| EditParty | AddParentAccount |  |  |
| EditParty | ParentAccountRelList |  |  |
| EditParty | AddChildAccount |  |  |
| EditParty | ChildAccountRelList |  |  |
| EditParty | NewNoteForm | Commons/Contacts/ContactDetail; Shared/Chatter | Commons/Contacts/ContactDetail; Commons/Contacts/List; Shared/Chatter |
| EditParty | UpdateNoteForm | Commons/Contacts/ContactDetail; Shared/Chatter | Commons/Contacts/ContactDetail; Commons/Contacts/List; Shared/Chatter |
| EditParty | OtherCreateForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | PhonePurposeForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | EmailPurposeForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | WebPurposeForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | OtherUpdateForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | OtherPurposeForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | PostalPurposeForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| EditParty | FinancialAccountList |  |  |
| EditParty | NewContentForm | Commons/Contacts/ContactDetail; Shared/RecordFiles | Commons/Contacts/ContactDetail; Commons/Contacts/List; Shared/RecordFiles |
| EditParty | UpdateContentForm | Commons/Contacts/ContactDetail; Shared/RecordFiles | Commons/Contacts/ContactDetail; Commons/Contacts/List; Shared/RecordFiles |
| ExpiredContactOther | PcmListForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ExpiredContactOther | PcmTelecomListForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| ExpiredPostal | PcmListForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| FindDuplicates | DupPartyList | Commons/Contacts/Duplicates | Commons/Contacts/Duplicates |
| UpdateContactInfo | UpdateContactInfo | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| UpdatePaymentMethodInfo | PaymentMethodInfoForm |  |  |
| FinancialInfo | UnpaidInvoiceList |  |  |
| FinancialInfo | PaymentList |  |  |
| FinancialInfo | OrderList |  |  |
| FinancialInfo | UnpaidPayablesList |  |  |
| FinancialInfo | OutgoingPaymentList |  |  |
| FinancialInfo | PurchaseOrderList |  |  |
| FinancialInfo | PaidInvoiceList |  |  |
| FinancialInfo | PaidPayablesList |  |  |
| FindParty | CreatePersonForm | Commons/QuickCreate | Commons/QuickCreate |
| FindParty | CreatePersonCustForm |  |  |
| FindParty | CreateEmployeeForm |  |  |
| FindParty | CreateOrganizationForm | Commons/QuickCreate | Commons/QuickCreate |
| FindParty | CreateAccountForm |  |  |
| FindParty | CreateContactForm | Commons/QuickCreate | Commons/QuickCreate |
| FindParty | OuterSearchForm | Commons/Contacts | Commons/Contacts/List |
| FindParty | PartyListForm | Commons/Contacts | Commons/Contacts/List |
| EditAgreement | EditAgreement |  |  |
| EditAgreement | AddSettlementTerm |  |  |
| EditAgreement | AddOtherTerm |  |  |
| EditAgreement | AgreementTermList |  |  |
| EditAgreement | AddAgreementItem |  |  |
| EditAgreement | AgreementItemList |  |  |
| EditAgreement | NewContentForm |  |  |
| EditAgreement | UpdateContentForm |  |  |
| FindAgreement | NewAgreement |  |  |
| FindAgreement | AgreementList |  |  |
| PartyEmails | EmailMessageList | Comms/Inbox/MessageDetail; Shared/Chatter | Comms/Inbox/MessageDetail; Shared/Chatter |
| PartyProjects | AddUserAssignForm | Projects/Projects/ProjectDetail/Team; Projects/Resources/PersonDetail | Projects/Projects/ProjectDetail/Team; Projects/Resources/PersonDetail |
| PartyProjects | UpdateUserAssignForm | Projects/Projects/ProjectDetail/Team; Projects/Resources/PersonDetail | Projects/Projects/ProjectDetail/Team; Projects/Resources/PersonDetail |
| PartyRelated | NewToRelForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| PartyRelated | NewFromRelForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| PartyRelated | ToRelationshipForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| PartyRelated | FromRelationshipForm | Commons/Contacts/ContactDetail | Commons/Contacts/ContactDetail; Commons/Contacts/List |
| PartyRequests | AddUserForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| PartyRequests | UpdateUserForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| PartyTasks | AddUserAssignForm | Projects/WorkItems/WorkItemDetail; Projects/Resources/PersonDetail | Projects/WorkItems/WorkItemDetail; Projects/Resources/PersonDetail |
| PartyTasks | UpdateUserAssignForm | Projects/WorkItems/WorkItemDetail; Projects/Resources/PersonDetail | Projects/WorkItems/WorkItemDetail; Projects/Resources/PersonDetail |
| PartyTimeEntries | ClockInForm | Projects/Time/TimeEntries |  |
| PartyTimeEntries | WorkerInvoice | Projects/Billing/Unbilled |  |
| PartyTimeEntries | TimeEntryList | Projects/Time/TimeEntries; Projects/Resources/PersonDetail | Projects/Time/TimeEntries; Projects/Resources/PersonDetail |
| EditTimeEntry | AddTimeForm | Projects/QuickCreate; Projects/WorkItems/WorkItemDetail; Projects/Time/MyTime; Projects/Time/TimeEntries | Projects/QuickCreate; Projects/WorkItems/WorkItemDetail; Projects/Time/MyTime; Projects/Time/TimeEntries |
| EditPaymentMethod | PaymentMethodInfoForm |  |  |
| EditPaymentMethod | NewContentForm |  |  |
| EditPaymentMethod | UpdateContentForm |  |  |
| EditPaymentMethod | UpdateBankAccountMutable |  |  |
| EditPaymentMethod | UpdatePaymentMethodMutable |  |  |
| PaymentGatewayResponses | GatewayResponseList |  |  |
| PaymentMethodChecks | CheckList |  |  |
| PaymentMethodFiles | GenerateNachaFile |  |  |
| PaymentMethodFiles | GeneratePosPayFile |  |  |
| PaymentMethodFiles | FileList |  |  |
| PaymentMethodTrans | AddTransForm |  |  |
| PaymentMethodTrans | UploadOfxV1Form |  |  |
| PaymentMethodTrans | UploadBaiV2Form |  |  |
| PaymentMethodTrans | AutoMatchReconcileForm |  |  |
| PaymentMethodTrans | TransList |  |  |
| PaymentMethodTrans | ManRecForm |  |  |
| CreatePayment | CreatePaymentForm |  |  |

## ProductStore (34 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditProductStore | CloneProductStoreForm |  |  |
| EditProductStore | EditStoreForm |  |  |
| EditProductStore | NewShippingOptionForm |  |  |
| EditProductStore | ShipOptionsForm |  |  |
| EditProductStore | NewShippingGatewayForm |  |  |
| EditProductStore | ShippingGatewaysForm |  |  |
| EditProductStore | NewPaymentGatewayForm |  |  |
| EditProductStore | PaymentGatewayForm |  |  |
| EditProductStore | NewStoreDataDocumentForm |  |  |
| EditProductStore | StoreDataDocumentForm |  |  |
| FindProductStore | NewStoreForm |  |  |
| FindProductStore | StoresForm |  |  |
| FindProductStoreCategory | NewStoreCategoryForm |  |  |
| FindProductStoreCategory | StoreCategoriesForm |  |  |
| FindProductStoreEmails | NewStoreEmailForm |  |  |
| FindProductStoreEmails | StoreEmailsForm |  |  |
| FindProductStoreFacility | NewStoreFacilityForm |  |  |
| FindProductStoreFacility | StoreFacilityFormList |  |  |
| FindProductStoreParty | NewStorePartyForm |  |  |
| FindProductStoreParty | StorePartyFormList |  |  |
| FindProductStoreSettings | SelectStoreSettingForm |  |  |
| FindProductStoreSettings | NewStoreSettingForm |  |  |
| FindProductStoreSettings | StoreSettingsForm |  |  |
| EditPromotion | EditPromotionForm |  |  |
| EditPromotion | PromoParameterForm |  |  |
| EditPromotion | AddProductForm |  |  |
| EditPromotion | ProductsForm |  |  |
| FindPromotion | NewPromotionForm |  |  |
| FindPromotion | PromotionsForm |  |  |
| EditPromoCode | EditPromoCodeForm |  |  |
| EditPromoCode | NewPromoCodePartyForm |  |  |
| EditPromoCode | PromoCodePartyForm |  |  |
| FindPromoCode | NewPromoCodeForm |  |  |
| FindPromoCode | PromoCodeForm |  |  |

## Project (26 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditMilestones | CreateMilestoneForm | Projects/Projects/Roadmap | Projects/Projects/Roadmap |
| EditMilestones | MilestoneList | Projects/Projects/Roadmap; Projects/Projects/MilestoneDetail | Projects/Projects/Roadmap; Projects/Projects/MilestoneDetail |
| EditProject | CloneProject | Projects/Projects/NewProject; Projects/Projects/ProjectDetail; Projects/Projects/ProjectDetail/Settings; Projects/Settings/Templates | Projects/Projects/NewProject; Projects/Projects/ProjectDetail; Projects/Projects/ProjectDetail/Settings; Projects/Settings/Templates |
| EditProject | EditProject | Projects/Projects/ProjectDetail/Overview; Projects/Projects/ProjectDetail/Money; Projects/Projects/ProjectDetail/Settings | Projects/Projects/ProjectDetail/Overview; Projects/Projects/ProjectDetail/Money; Projects/Projects/ProjectDetail/Settings |
| EditRepositories | AddRepositoryForm | Projects/Projects/ProjectDetail/Code; Projects/Code/Repositories | Projects/Projects/ProjectDetail/Code; Projects/Code/Repositories |
| EditRepositories | CreateRepositoryForm | Projects/Projects/ProjectDetail/Code; Projects/Code/Repositories | Projects/Projects/ProjectDetail/Code; Projects/Code/Repositories |
| EditRepositories | RepositoryList | Projects/Projects/ProjectDetail/Code; Projects/Code/Repositories | Projects/Projects/ProjectDetail/Code; Projects/Code/Repositories |
| EditRepositories | ProjectRefList | Projects/Projects/ProjectDetail/Code; Projects/Code/RepositoryDetail/Tags | Projects/Projects/ProjectDetail/Code; Projects/Code/RepositoryDetail/Tags |
| EditUsers | AddUserAssignForm | Projects/Projects/NewProject; Projects/Projects/ProjectDetail/Team | Projects/Projects/NewProject; Projects/Projects/ProjectDetail/Team |
| EditUsers | UpdateUserAssignForm | Projects/Projects/ProjectDetail/Team | Projects/Projects/ProjectDetail/Team |
| EditWikiPages | AddWpweForm | Projects/Projects/ProjectDetail/Docs | Projects/Projects/ProjectDetail/Docs |
| EditWikiPages | DeleteWpweForm | Projects/Projects/ProjectDetail/Docs | Projects/Projects/ProjectDetail/Docs |
| FindProject | NewProject | Projects/QuickCreate; Projects/Projects/NewProject | Projects/QuickProject; Projects/Projects/NewProject |
| FindProject | ListProjects | Projects/Projects | Projects/Projects/List |
| MilestoneSummary | InactiveTaskList | Projects/Projects/MilestoneDetail | Projects/Projects/MilestoneDetail |
| MilestoneSummary | ActiveTaskList | Projects/Projects/MilestoneDetail | Projects/Projects/MilestoneDetail |
| MilestoneSummary | DoneTaskList | Projects/Projects/MilestoneDetail | Projects/Projects/MilestoneDetail |
| ProjectProgressReport | ChildStatsListDays | Projects/Reports/Progress; Projects/Projects/ProjectDetail/Overview | Projects/Reports/Progress; Projects/Projects/ProjectDetail/Overview |
| ProjectProgressReport | MilestoneStatsList | Projects/Projects/MilestoneDetail; Projects/Reports/Progress | Projects/Projects/MilestoneDetail; Projects/Reports/Progress |
| ProjectSummary | ViewProject | Projects/Projects/ProjectDetail; Projects/Projects/ProjectDetail/Overview | Projects/Projects/ProjectDetail; Projects/Projects/ProjectDetail/Overview |
| ProjectSummary | MilestoneList | Projects/Projects/ProjectDetail/Overview; Projects/Projects/Roadmap | Projects/Projects/ProjectDetail/Overview; Projects/Projects/Roadmap |
| ProjectSummary | ViewWpweForm | Projects/Projects/ProjectDetail/Docs | Projects/Projects/ProjectDetail/Docs |
| ProjectSummary | ViewUserAssignForm | Projects/Projects/ProjectDetail/Overview | Projects/Projects/ProjectDetail/Overview |
| ProjectSummary | ViewGitRepositoryList | Projects/Projects/ProjectDetail/Overview | Projects/Projects/ProjectDetail/Overview |
| ProjectSummary | ViewGitTagList | Projects/Projects/ProjectDetail/Code; Projects/Code/RepositoryDetail/Tags | Projects/Projects/ProjectDetail/Code; Projects/Code/RepositoryDetail/Tags |
| ProjectTimeEntries | TimeEntryListForm | Projects/Projects/ProjectDetail/Time; Projects/Time/TimeEntries | Projects/Projects/ProjectDetail/Time; Projects/Time/TimeEntries |

## Request (22 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditRequest | EditRequest | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditRequest | AddCommentForm | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail; Shared/Chatter | Commons/Requests/RequestDetail; Shared/Chatter; Projects/Requests/RequestDetail |
| EditRequest | AddPartyForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditRequest | UpdatePartyForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditRequest | NewNoteForm | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail; Shared/Chatter | Commons/Requests/RequestDetail; Shared/Chatter; Projects/Requests/RequestDetail |
| EditRequest | UpdateNoteForm | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail; Shared/Chatter | Commons/Requests/RequestDetail; Shared/Chatter; Projects/Requests/RequestDetail |
| EditRequest | NewContentForm | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail; Shared/RecordFiles | Commons/Requests/RequestDetail; Shared/RecordFiles; Projects/Requests/RequestDetail |
| EditRequest | UpdateContentForm | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail; Shared/RecordFiles | Commons/Requests/RequestDetail; Shared/RecordFiles; Projects/Requests/RequestDetail |
| EditRequest | RequestTaskList | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail | Commons/Requests/RequestDetail; Projects/Requests/RequestDetail |
| RequestCommentReply | ReplyCommentForm | Projects/Requests/RequestDetail; Shared/Chatter | Projects/Requests/RequestDetail |
| RequestCommentUpdate | ReplyCommentForm | Projects/Requests/RequestDetail; Shared/Chatter | Projects/Requests/RequestDetail |
| EditRequestItems | NewRequestItemForm | Projects/Requests/RequestDetail |  |
| EditRequestItems | RequestItemListForm | Projects/Requests/RequestDetail |  |
| EditTasks | AddRweForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditTasks | NewTaskForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditTasks | UpdateRweForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditUsers | AddUserForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditUsers | UpdateUserForm | Projects/Requests/RequestDetail | Projects/Requests/RequestDetail |
| EditWikiPages | AddWprForm | Commons/Knowledge; Projects/Requests/RequestDetail | Commons/Knowledge |
| EditWikiPages | DeleteWprForm | Commons/Knowledge; Projects/Requests/RequestDetail | Commons/Knowledge |
| FindRequest | NewRequestForm | Projects/Requests | Projects/Requests/List |
| FindRequest | ListRequests | Commons/Requests; Projects/Requests | Commons/Requests/List; Projects/Requests/List |

## Return (8 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| AddOrderItems | LookBackDaysForm |  |  |
| AddOrderItems | AddOrderItemToReturn |  |  |
| EditReturn | AuditLogList |  |  |
| EditReturn | UpdateReturn |  |  |
| EditReturnItems | ReturnItemList |  |  |
| FindReturn | CreateReturn |  |  |
| FindReturn | CreateSupplierReturn |  |  |
| FindReturn | ReturnHeaderList |  |  |

## Shipment (46 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| FindShipment | NewOutgoingShipment |  |  |
| FindShipment | NewIncomingShipment |  |  |
| FindShipment | NewTransferShipment |  |  |
| FindShipment | ShipmentList |  |  |
| PackageTracking | EtaPackageList |  |  |
| ShipmentDetail | AuditLogList |  |  |
| ShipmentDetail | EditShipment |  |  |
| ShipmentDetail | ItemLimitForm |  |  |
| ShipmentDetail | PackScanForm |  |  |
| ShipmentDetail | PickScanForm |  |  |
| ShipmentDetail | ShipmentOrderPaymentList |  |  |
| ShipmentDetail | ShipmentInvoicePaymentList |  |  |
| ShipmentDetail | AddParty |  |  |
| ShipmentDetail | RolesForm |  |  |
| ShipmentDetail | NewContentForm |  |  |
| ShipmentDetail | UpdateContentForm |  |  |
| ShipmentDetail | SendPlacedEmailForm |  |  |
| ShipmentDetail | EmailMessageList |  |  |
| ShipmentDetail | ProduceAssembliesForm |  |  |
| ShipmentDetail | AssemblyProduceProducts |  |  |
| ShipmentDetail | AssemblyConsumeProducts |  |  |
| ShipmentDetail | AddItemForm |  |  |
| ItemReserve | ReserveItem |  |  |
| ReceiveItem | ReceiveForm |  |  |
| UpdateItemAsset | UpdateForm |  |  |
| ShipmentItems | AssemblyPackUnusedComponents |  |  |
| ShipmentItems | SetPackedForm |  |  |
| ShipmentItems | SetDeliveredForm |  |  |
| ShipmentItems | AddItemForm |  |  |
| ShipmentItems | ItemsOptionsForm |  |  |
| ShipmentItems | PackItemForm |  |  |
| ShipmentItems | PackComponentsForm |  |  |
| ShipmentItems | UpdateItemForm |  |  |
| ShipmentItems | AddItemToPackageForm |  |  |
| ShipmentItems | ItemSourceIssuanceList |  |  |
| ShipmentItems | PaComponentPackForm |  |  |
| ShipmentItems | ItemAssetIssuanceList |  |  |
| ShipmentItems | ItemSourceReceiptList |  |  |
| ShipmentItems | ItemAssetReceiptList |  |  |
| ShipmentPackages | SetShippedForm |  |  |
| ShipmentPackages | PrintAllShipmentLabels |  |  |
| ShipmentPackages | PackageOptionsForm |  |  |
| ShipmentPackages | UpdatePackageForm |  |  |
| ShipmentPackages | RequestRetLabel |  |  |
| ShipmentPackages | PrintShipmentLabel |  |  |
| ShipmentPackages | ShipmentPackageContentList |  |  |

## Shipping (34 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| PackItems | ItemsOptionsForm |  |  |
| PackItems | PackItemForm |  |  |
| PackItems | UpdateItemForm |  |  |
| PackItems | AddItemToPackageForm |  |  |
| PackItems | ItemSourceIssuanceList |  |  |
| PackItems | ItemAssetIssuanceList |  |  |
| PackPackages | PackageOptionsForm |  |  |
| PackPackages | UpdatePackageForm |  |  |
| PackPackages | RequestRetLabel |  |  |
| PackPackages | PrintShipmentLabel |  |  |
| PackPackages | ShipmentPackageContentList |  |  |
| PackSummary | PrintAllShipmentLabels |  |  |
| PackSummary | SetShippedForm |  |  |
| PackSummary | PackScanForm |  |  |
| PackSummary | ClosePackageForm |  |  |
| PackSummary | ShipmentPackageContentList |  |  |
| PackCompleted | AssemblyPackUnusedComponents |  |  |
| PackCompleted | PackCompletedForm |  |  |
| PickLocationMoves | PickMoveList |  |  |
| QuickMove | ScanMoveAssetForm |  |  |
| AddOrder | AddOrderList |  |  |
| AddShipment | AddShipmentList |  |  |
| BulkPicklist | CreatePicklistsForm |  |  |
| BulkPicklist | AddOrderList |  |  |
| FindPicklist | NewPicklist |  |  |
| FindPicklist | PicklistList |  |  |
| PicklistDetail | UpdateShipmentLoad |  |  |
| PicklistDetail | ListShipments |  |  |
| PicklistDetail | AddPartyAssignForm |  |  |
| PicklistDetail | UpdateAssignForm |  |  |
| PicklistDetail | AddAsset |  |  |
| PicklistDetail | UpdateAssetAssign |  |  |
| dashboard | PackShipmentForm |  |  |
| dashboard | FacilitySummary |  |  |

## SimpleReport (9 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditReport | EditDataDocument |  |  |
| FieldList | AddCondition |  |  |
| FieldList | ConditionList |  |  |
| FieldList | FieldList |  |  |
| FindReport | CreateDataDocument |  |  |
| FindReport | DataDocumentList |  |  |
| QuickViewReport | DataDocumentList |  |  |
| ViewReport | ExportDocuments |  |  |
| ViewReport | DataViewList |  |  |

## Supplier (4 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| FindSupplier | CreatePersonForm |  |  |
| FindSupplier | CreateOrganizationForm |  |  |
| FindSupplier | OuterSearchForm |  |  |
| FindSupplier | SupplierListForm |  |  |

## Survey (14 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditSurvey | EditSurveyForm |  |  |
| EditSurvey | NewUserGroupForm |  |  |
| EditSurvey | UserGroupForm |  |  |
| Fields | NewDbFormFieldForm |  |  |
| Fields | SurveyPreview |  |  |
| Fields | DbFormFieldList |  |  |
| Fields | NewFieldOptionForm |  |  |
| Fields | FieldOptionForm |  |  |
| FindSurvey | NewSurveyForm |  |  |
| FindSurvey | SurveyList |  |  |
| ResponseDetails | ResponseDetailsForm |  |  |
| ResponseStats | TextDbFormFieldResponseCountList |  |  |
| ResponseStats | FieldOptionForm |  |  |
| Responses | ResponseListForm |  |  |

## Task (32 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditRelated | AddRelatedToForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditRelated | AddRelatedFromForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditRelated | DeleteRelatedToForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditRelated | DeleteRelatedFromForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditRequests | AddRweForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditRequests | DeleteRweForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditSource | AddCommitForm | Projects/WorkItems/WorkItemDetail; Projects/Code/CommitDetail | Projects/WorkItems/WorkItemDetail; Projects/Code/CommitDetail |
| EditSource | AddRefForm | Projects/Projects/ReleaseDetail; Projects/WorkItems/WorkItemDetail | Projects/Projects/ReleaseDetail; Projects/WorkItems/WorkItemDetail |
| EditSource | TaskCommitList | Projects/WorkItems/WorkItemDetail; Projects/Code/RepositoryDetail/Commits | Projects/WorkItems/WorkItemDetail; Projects/Code/RepositoryDetail/Commits |
| EditSource | TaskRefList | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditTask | EditTask | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditTimeEntries | ClockInForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditTimeEntries | AddTaskTime | Projects/QuickCreate; Projects/WorkItems/WorkItemDetail | Projects/QuickCreate; Projects/WorkItems/WorkItemDetail |
| EditTimeEntries | TimeEntryList | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditUsers | AddUserAssignForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditUsers | AddTeamAssignForm | Projects/Projects/ProjectDetail/Team; Projects/WorkItems/WorkItemDetail | Projects/Projects/ProjectDetail/Team; Projects/WorkItems/WorkItemDetail |
| EditUsers | UpdateAssignForm | Projects/WorkItems/WorkItemDetail | Projects/WorkItems/WorkItemDetail |
| EditWikiPages | AddWpweForm | Commons/Knowledge; Projects/WorkItems/WorkItemDetail | Commons/Knowledge |
| EditWikiPages | DeleteWpweForm | Commons/Knowledge; Projects/WorkItems/WorkItemDetail | Commons/Knowledge |
| FindTask | SearchOptions | Commons/Tasks; Projects/WorkItems | Commons/Tasks/List; Projects/WorkItems/List |
| FindTask | NewTaskForm | Commons/Tasks; Projects/QuickCreate; Projects/WorkItems | Commons/Tasks/List; Projects/QuickCreate; Projects/WorkItems/List |
| FindTask | ListTasks | Commons/Tasks; Projects/WorkItems | Commons/Tasks/List; Projects/WorkItems/List |
| FindTask | AssignTaskSelected | Commons/Tasks; Projects/WorkItems | Commons/Tasks/List; Projects/WorkItems/List |
| FindTask | UnAssignTaskSelected | Commons/Tasks; Projects/WorkItems | Commons/Tasks/List; Projects/WorkItems/List |
| FindTask | UpdateTaskSelected | Commons/Tasks; Projects/WorkItems | Commons/Tasks/List; Projects/WorkItems/List |
| TaskSummary | ClockInForm | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail |
| TaskSummary | AddCommentForm | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail; Shared/Chatter | Commons/Tasks/TaskDetail; Shared/Chatter; Projects/WorkItems/WorkItemDetail |
| TaskSummary | NewChildTaskForm | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail |
| TaskSummary | NewContentForm | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail; Shared/RecordFiles | Commons/Tasks/TaskDetail; Shared/RecordFiles; Projects/WorkItems/WorkItemDetail |
| TaskSummary | UpdateContentForm | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail; Shared/RecordFiles | Commons/Tasks/TaskDetail; Shared/RecordFiles; Projects/WorkItems/WorkItemDetail |
| TaskCommentReply | ReplyCommentForm | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail; Shared/Chatter | Commons/Tasks/TaskDetail; Shared/Chatter; Projects/WorkItems/WorkItemDetail |
| TaskCommentUpdate | ReplyCommentForm | Commons/Tasks/TaskDetail; Projects/WorkItems/WorkItemDetail; Shared/Chatter | Commons/Tasks/TaskDetail; Shared/Chatter; Projects/WorkItems/WorkItemDetail |

## Vendor (10 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditUsers | AddUserRelationshipForm |  |  |
| EditUsers | UpdateUserRelForm |  |  |
| EditVendor | PaymentInfo |  |  |
| EditVendor | SetVendorRepForm |  |  |
| EditVendor | BillingInfo |  |  |
| EditVendor | EditVendor |  |  |
| EditVendor | RoleList |  |  |
| FindVendor | FindVendor |  |  |
| FindVendor | CreateVendor |  |  |
| FindVendor | VendorList |  |  |

## Wiki (18 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditWikiBlog | EditBlogForm |  |  |
| EditWikiBlog | AddCategory |  |  |
| EditWikiBlog | CategoriesForm |  |  |
| EditWikiPage | EditPageForm | Commons/Knowledge | Commons/Knowledge |
| EditWikiSpace | CloneSpace | Commons/Knowledge/Spaces | Commons/Knowledge/Spaces |
| EditWikiSpace | EditSpace | Commons/Knowledge/Spaces | Commons/Knowledge/SpaceDetail |
| WikiBlogs | AddBlogPage |  |  |
| WikiBlogs | AddBlogText |  |  |
| WikiBlogs | WikiBlogList |  |  |
| WikiSpaces | NewSpace | Commons/Knowledge/Spaces | Commons/Knowledge/Spaces |
| WikiSpaces | WikiSpaceList | Commons/Knowledge/Spaces | Commons/Knowledge/Spaces |
| wiki | AddPageForm | Commons/Knowledge | Commons/Knowledge |
| wiki | ClonePage | Commons/Knowledge | Commons/Knowledge |
| wiki | AddCommentForm | Commons/Knowledge; Shared/Chatter | Commons/Knowledge; Shared/Chatter |
| wiki | UploadAttachment | Commons/Knowledge; Shared/RecordFiles | Commons/Knowledge |
| wiki | AddCategory | Commons/Knowledge; Commons/Notes | Commons/Knowledge; Commons/Notes |
| wiki | CategoriesForm | Commons/Knowledge; Commons/Notes | Commons/Knowledge; Commons/Notes |
| WikiCommentReply | ReplyCommentForm | Commons/Knowledge; Shared/Chatter | Commons/Knowledge; Shared/Chatter |

## BasicHandheld (Warehouse handheld) (16 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| ReceiveAsset | ScanAssetForm |  |  |
| ReceiveAsset | ActiveFacilityForm |  |  |
| ReceiveAsset | ReceiveAssetForm |  |  |
| SelectAsset | ScanAssetForm |  |  |
| SelectAsset | ActiveFacilityForm |  |  |
| SelectAsset | ScanMoveAssetForm |  |  |
| SelectAsset | ContainerAssetList |  |  |
| SelectAsset | LocationAssetList |  |  |
| SelectAsset | ProductNoLocAssetList |  |  |
| SelectAsset | RecentMoveForm |  |  |
| SelectAsset | RecentContainerMoveForm |  |  |
| PickLocationMoves | ActiveFacilityForm |  |  |
| PickLocationMoves | PickMoveList |  |  |
| dashboard | ActiveFacilityForm |  |  |
| dashboard | ScanAssetForm |  |  |
| dashboard | PackShipmentForm |  |  |

## Shared root screens (5 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| Search | SearchOptions | Commons/Search | Commons/Search |
| Search | SearchResults | Commons/Search | Commons/Search |
| QuickSearch | SearchOptions | — | — |
| QuickSearch | SearchResults | — | — |
| QuickLookup | QuickLookupForm | — | — |

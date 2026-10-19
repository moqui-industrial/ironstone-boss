# MrSimpleScreens form inventory

Per-form inventory of the MrSimpleScreens component, for tracking form-level feature parity in IronStone BOSS.

- Source: `runtime/component/MrSimpleScreens/screen/` (current working tree).
- Form: every `<form-single>` and `<form-list>` element, including forms nested in dialogs, sections and includes.
- The **Designed in** column is filled when a design file is reviewed with the IronStone screen path(s) whose forms cover it (`—` when deliberately not carried forward, with the reason in that design's Decided table); the **Implemented in** column is filled during implementation with the screen and form that exist. See [design-doc-guide.md](design-doc-guide.md) §9.

## MyAccount (45 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditExpenseInvoice | WorkerInvoice |  |  |
| EditExpenseInvoice | EditInvoice |  |  |
| EditExpenseInvoiceItems | CreateInvoiceItem |  |  |
| EditExpenseInvoiceItems | EditInvoiceItems |  |  |
| FindExpenseInvoice | CreateInvoice |  |  |
| FindExpenseInvoice | WorkerInvoice |  |  |
| FindExpenseInvoice | InvoiceList |  |  |
| Account | ChangePasswordForm | Commons/Settings/Account |  |
| Account | SecondFactorSendForm | Commons/Settings/Account |  |
| Account | EditUser | Commons/Settings/Account |  |
| Account | CreateUserAuthcFactorTotp | Commons/Settings/Account |  |
| Account | CreateUserAuthcFactorSingleUse | Commons/Settings/Account |  |
| Account | CreateUserAuthcFactorEmail | Commons/Settings/Account |  |
| Account | CreateUserAuthcFactorSms | Commons/Settings/Account |  |
| Account | UserAuthcFactorList | Commons/Settings/Account |  |
| EventDetail | UpdateEvent | Commons/Calendar/EventDetail |  |
| EventDetail | NewNoteForm | Commons/Calendar/EventDetail; Shared/Chatter |  |
| EventDetail | UpdateNoteForm | Commons/Calendar/EventDetail; Shared/Chatter |  |
| EventDetail | AddPartyAssignForm | Commons/Calendar/EventDetail |  |
| EventDetail | UpdateAssignForm | Commons/Calendar/EventDetail |  |
| EventDetail | AddEquipment | Commons/Calendar/EventDetail |  |
| EventDetail | EquipmentList | Commons/Calendar/EventDetail |  |
| MyCalendar | NewEventForm | Commons/Calendar; Commons/QuickCreate |  |
| UpdateContactInfo | ShippingInfo | Commons/Settings/Account |  |
| EditMessage | ReplyMessageForm | Comms/Inbox/Compose |  |
| EditMessage | MessageForm | Comms/Inbox/Compose |  |
| EditMessage | AddPurposeForm | — |  |
| EditMessage | PurposesForm | — |  |
| FindMessage | CreateMessage | Comms/Inbox/Compose |  |
| FindMessage | MessageList | Comms/Inbox |  |
| SingleMessage | ReplyMessageForm | Comms/Inbox/Compose; Shared/Chatter |  |
| Notifications | NotificationTopicList | Commons/Settings/Notifications |  |
| Notifications | NotificationList | Commons/Notifications; Commons/Panel/Notifications |  |
| EditRequest | EditRequest | Commons/Requests/RequestDetail |  |
| EditRequest | UpdatePartyForm | Commons/Requests/RequestDetail |  |
| RequestCommentReply | ReplyCommentForm | Commons/Requests/RequestDetail; Shared/Chatter |  |
| RequestCommentUpdate | ReplyCommentForm | Commons/Requests/RequestDetail; Shared/Chatter |  |
| MyRequests | NewRequestForm | Commons/Requests; Commons/QuickCreate |  |
| MyRequests | ListRequests | Commons/Home; Commons/Requests |  |
| ScheduledFinds | ScreenScheduledList |  |  |
| EditScheduledFind | EditScreenScheduled |  |  |
| MyTasks | NewTaskForm | Commons/Tasks; Commons/QuickCreate |  |
| MyTasks | MyTasks | Commons/Panel/Today; Commons/Home; Commons/Tasks |  |
| TaskDetail | UpdateEvent | Commons/Tasks/TaskDetail |  |
| TimeEntries | TimeEntryList | Commons/Tasks/TaskDetail |  |

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
| FindInvoice | ProjectInvoice |  |  |
| FindInvoice | ProjectWorkerInvoice |  |  |
| FindInvoice | WorkerInvoice |  |  |
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
| AssetCalendar | NewEventForm | Commons/Calendar/Schedules |  |
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
| EditRateAmounts | CreateRateAmount |  |  |
| EditRateAmounts | EditRateAmounts |  |  |

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
| EditParty | EditOrganizationForm | Commons/Contacts/ContactDetail |  |
| EditParty | EditPersonForm | Commons/Contacts/ContactDetail |  |
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
| EditParty | NewNoteForm | Commons/Contacts/ContactDetail; Shared/Chatter |  |
| EditParty | UpdateNoteForm | Commons/Contacts/ContactDetail; Shared/Chatter |  |
| EditParty | OtherCreateForm | Commons/Contacts/ContactDetail |  |
| EditParty | PhonePurposeForm | Commons/Contacts/ContactDetail |  |
| EditParty | EmailPurposeForm | Commons/Contacts/ContactDetail |  |
| EditParty | WebPurposeForm | Commons/Contacts/ContactDetail |  |
| EditParty | OtherUpdateForm | Commons/Contacts/ContactDetail |  |
| EditParty | OtherPurposeForm | Commons/Contacts/ContactDetail |  |
| EditParty | PostalPurposeForm | Commons/Contacts/ContactDetail |  |
| EditParty | FinancialAccountList |  |  |
| EditParty | NewContentForm | Commons/Contacts/ContactDetail; Shared/RecordFiles |  |
| EditParty | UpdateContentForm | Commons/Contacts/ContactDetail; Shared/RecordFiles |  |
| ExpiredContactOther | PcmListForm | Commons/Contacts/ContactDetail |  |
| ExpiredContactOther | PcmTelecomListForm | Commons/Contacts/ContactDetail |  |
| ExpiredPostal | PcmListForm | Commons/Contacts/ContactDetail |  |
| FindDuplicates | DupPartyList | Commons/Contacts/Duplicates |  |
| UpdateContactInfo | UpdateContactInfo | Commons/Contacts/ContactDetail |  |
| UpdatePaymentMethodInfo | PaymentMethodInfoForm |  |  |
| FinancialInfo | UnpaidInvoiceList |  |  |
| FinancialInfo | PaymentList |  |  |
| FinancialInfo | OrderList |  |  |
| FinancialInfo | UnpaidPayablesList |  |  |
| FinancialInfo | OutgoingPaymentList |  |  |
| FinancialInfo | PurchaseOrderList |  |  |
| FinancialInfo | PaidInvoiceList |  |  |
| FinancialInfo | PaidPayablesList |  |  |
| FindParty | CreatePersonForm | Commons/QuickCreate |  |
| FindParty | CreatePersonCustForm |  |  |
| FindParty | CreateEmployeeForm |  |  |
| FindParty | CreateOrganizationForm | Commons/QuickCreate |  |
| FindParty | CreateAccountForm |  |  |
| FindParty | CreateContactForm | Commons/QuickCreate |  |
| FindParty | OuterSearchForm | Commons/Contacts |  |
| FindParty | PartyListForm | Commons/Contacts |  |
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
| PartyEmails | EmailMessageList | Comms/Inbox/MessageDetail; Shared/Chatter |  |
| PartyProjects | AddUserAssignForm |  |  |
| PartyProjects | UpdateUserAssignForm |  |  |
| PartyRelated | NewToRelForm | Commons/Contacts/ContactDetail |  |
| PartyRelated | NewFromRelForm | Commons/Contacts/ContactDetail |  |
| PartyRelated | ToRelationshipForm | Commons/Contacts/ContactDetail |  |
| PartyRelated | FromRelationshipForm | Commons/Contacts/ContactDetail |  |
| PartyRequests | AddUserForm |  |  |
| PartyRequests | UpdateUserForm |  |  |
| PartyTasks | AddUserAssignForm |  |  |
| PartyTasks | UpdateUserAssignForm |  |  |
| PartyTimeEntries | ClockInForm |  |  |
| PartyTimeEntries | WorkerInvoice |  |  |
| PartyTimeEntries | TimeEntryList |  |  |
| EditTimeEntry | AddTimeForm |  |  |
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

## Project (20 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditMilestones | CreateMilestoneForm |  |  |
| EditMilestones | MilestoneList |  |  |
| EditProject | CloneProject |  |  |
| EditProject | EditProject |  |  |
| EditUsers | AddUserAssignForm |  |  |
| EditUsers | UpdateUserAssignForm |  |  |
| EditWikiPages | AddWpweForm |  |  |
| EditWikiPages | DeleteWpweForm |  |  |
| FindProject | NewProject |  |  |
| FindProject | ListProjects |  |  |
| MilestoneSummary | InactiveTaskList |  |  |
| MilestoneSummary | ActiveTaskList |  |  |
| MilestoneSummary | DoneTaskList |  |  |
| ProjectProgressReport | ChildStatsListDays |  |  |
| ProjectProgressReport | MilestoneStatsList |  |  |
| ProjectSummary | ViewProject |  |  |
| ProjectSummary | MilestoneList |  |  |
| ProjectSummary | ViewWpweForm |  |  |
| ProjectSummary | ViewUserAssignForm |  |  |
| ProjectTimeEntries | TimeEntryListForm |  |  |

## Request (22 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditRequest | EditRequest |  |  |
| EditRequest | AddCommentForm | Commons/Requests/RequestDetail; Shared/Chatter |  |
| EditRequest | AddPartyForm |  |  |
| EditRequest | UpdatePartyForm |  |  |
| EditRequest | NewNoteForm | Commons/Requests/RequestDetail; Shared/Chatter |  |
| EditRequest | UpdateNoteForm | Commons/Requests/RequestDetail; Shared/Chatter |  |
| EditRequest | NewContentForm | Commons/Requests/RequestDetail; Shared/RecordFiles |  |
| EditRequest | UpdateContentForm | Commons/Requests/RequestDetail; Shared/RecordFiles |  |
| EditRequest | RequestTaskList | Commons/Requests/RequestDetail |  |
| RequestCommentReply | ReplyCommentForm |  |  |
| RequestCommentUpdate | ReplyCommentForm |  |  |
| EditRequestItems | NewRequestItemForm |  |  |
| EditRequestItems | RequestItemListForm |  |  |
| EditTasks | AddRweForm |  |  |
| EditTasks | NewTaskForm |  |  |
| EditTasks | UpdateRweForm |  |  |
| EditUsers | AddUserForm |  |  |
| EditUsers | UpdateUserForm |  |  |
| EditWikiPages | AddWprForm | Commons/Knowledge |  |
| EditWikiPages | DeleteWprForm | Commons/Knowledge |  |
| FindRequest | NewRequestForm |  |  |
| FindRequest | ListRequests | Commons/Requests |  |

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

## Task (28 forms)

| Screen XML | Form | Designed in | Implemented in |
| --- | --- | --- | --- |
| EditRelated | AddRelatedToForm |  |  |
| EditRelated | AddRelatedFromForm |  |  |
| EditRelated | DeleteRelatedToForm |  |  |
| EditRelated | DeleteRelatedFromForm |  |  |
| EditRequests | AddRweForm |  |  |
| EditRequests | DeleteRweForm |  |  |
| EditTask | EditTask |  |  |
| EditTimeEntries | ClockInForm |  |  |
| EditTimeEntries | AddTaskTime |  |  |
| EditTimeEntries | TimeEntryList |  |  |
| EditUsers | AddUserAssignForm |  |  |
| EditUsers | AddTeamAssignForm |  |  |
| EditUsers | UpdateAssignForm |  |  |
| EditWikiPages | AddWpweForm | Commons/Knowledge |  |
| EditWikiPages | DeleteWpweForm | Commons/Knowledge |  |
| FindTask | SearchOptions | Commons/Tasks |  |
| FindTask | NewTaskForm | Commons/Tasks |  |
| FindTask | ListTasks | Commons/Tasks |  |
| FindTask | AssignTaskSelected | Commons/Tasks |  |
| FindTask | UnAssignTaskSelected | Commons/Tasks |  |
| FindTask | UpdateTaskSelected | Commons/Tasks |  |
| TaskSummary | ClockInForm | Commons/Tasks/TaskDetail |  |
| TaskSummary | AddCommentForm | Commons/Tasks/TaskDetail; Shared/Chatter |  |
| TaskSummary | NewChildTaskForm | Commons/Tasks/TaskDetail |  |
| TaskSummary | NewContentForm | Commons/Tasks/TaskDetail; Shared/RecordFiles |  |
| TaskSummary | UpdateContentForm | Commons/Tasks/TaskDetail; Shared/RecordFiles |  |
| TaskCommentReply | ReplyCommentForm | Commons/Tasks/TaskDetail; Shared/Chatter |  |
| TaskCommentUpdate | ReplyCommentForm | Commons/Tasks/TaskDetail; Shared/Chatter |  |

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
| EditWikiPage | EditPageForm | Commons/Knowledge |  |
| EditWikiSpace | CloneSpace | Commons/Knowledge/Spaces |  |
| EditWikiSpace | EditSpace | Commons/Knowledge/Spaces |  |
| WikiBlogs | AddBlogPage |  |  |
| WikiBlogs | AddBlogText |  |  |
| WikiBlogs | WikiBlogList |  |  |
| WikiSpaces | NewSpace | Commons/Knowledge/Spaces |  |
| WikiSpaces | WikiSpaceList | Commons/Knowledge/Spaces |  |
| wiki | AddPageForm | Commons/Knowledge |  |
| wiki | ClonePage | Commons/Knowledge |  |
| wiki | AddCommentForm | Commons/Knowledge; Shared/Chatter |  |
| wiki | UploadAttachment | Commons/Knowledge; Shared/RecordFiles |  |
| wiki | AddCategory | Commons/Knowledge; Commons/Notes |  |
| wiki | CategoriesForm | Commons/Knowledge; Commons/Notes |  |
| WikiCommentReply | ReplyCommentForm | Commons/Knowledge; Shared/Chatter |  |

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
| Search | SearchOptions | Commons/Search |  |
| Search | SearchResults | Commons/Search |  |
| QuickSearch | SearchOptions | — |  |
| QuickSearch | SearchResults | — |  |
| QuickLookup | QuickLookupForm | — |  |

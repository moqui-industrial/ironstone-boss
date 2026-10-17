# MrSimpleScreens form inventory

Per-form inventory of the MrSimpleScreens component, for tracking form-level feature parity in IronStone BOSS.

- Source: `runtime/component/MrSimpleScreens/screen/` (current working tree).
- Form: every `<form-single>` and `<form-list>` element, including forms nested in dialogs, sections and includes.
- The **IronStone screens with equivalent functionality** column is intentionally left blank. It is a placeholder to record progress; the current IronStone screens are not permanent.

## MyAccount (45 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditExpenseInvoice | WorkerInvoice |  |
| EditExpenseInvoice | EditInvoice |  |
| EditExpenseInvoiceItems | CreateInvoiceItem |  |
| EditExpenseInvoiceItems | EditInvoiceItems |  |
| FindExpenseInvoice | CreateInvoice |  |
| FindExpenseInvoice | WorkerInvoice |  |
| FindExpenseInvoice | InvoiceList |  |
| Account | ChangePasswordForm |  |
| Account | SecondFactorSendForm |  |
| Account | EditUser |  |
| Account | CreateUserAuthcFactorTotp |  |
| Account | CreateUserAuthcFactorSingleUse |  |
| Account | CreateUserAuthcFactorEmail |  |
| Account | CreateUserAuthcFactorSms |  |
| Account | UserAuthcFactorList |  |
| EventDetail | UpdateEvent |  |
| EventDetail | NewNoteForm |  |
| EventDetail | UpdateNoteForm |  |
| EventDetail | AddPartyAssignForm |  |
| EventDetail | UpdateAssignForm |  |
| EventDetail | AddEquipment |  |
| EventDetail | EquipmentList |  |
| MyCalendar | NewEventForm |  |
| UpdateContactInfo | ShippingInfo |  |
| EditMessage | ReplyMessageForm |  |
| EditMessage | MessageForm |  |
| EditMessage | AddPurposeForm |  |
| EditMessage | PurposesForm |  |
| FindMessage | CreateMessage |  |
| FindMessage | MessageList |  |
| SingleMessage | ReplyMessageForm |  |
| Notifications | NotificationTopicList |  |
| Notifications | NotificationList |  |
| EditRequest | EditRequest |  |
| EditRequest | UpdatePartyForm |  |
| RequestCommentReply | ReplyCommentForm |  |
| RequestCommentUpdate | ReplyCommentForm |  |
| MyRequests | NewRequestForm |  |
| MyRequests | ListRequests |  |
| ScheduledFinds | ScreenScheduledList |  |
| EditScheduledFind | EditScreenScheduled |  |
| MyTasks | NewTaskForm |  |
| MyTasks | MyTasks |  |
| TaskDetail | UpdateEvent |  |
| TimeEntries | TimeEntryList |  |

## Accounting (166 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| BudgetAccountsEntry | GlAccountBudgetList |  |
| BudgetReport | GlAccountBudgetList |  |
| EditBudget | UpdateBudgetForm |  |
| EditBudgetItems | AddItemForm |  |
| EditBudgetItems | BudgetItemList |  |
| FindBudget | NewBudgetForm |  |
| FindBudget | BudgetList |  |
| EditFinancialAccount | StatementForm |  |
| EditFinancialAccount | UpdateFinancialAccountForm |  |
| FinancialAccountTrans | AdjustFinancialAccount |  |
| FinancialAccountTrans | TransactionList |  |
| FindFinancialAccount | NewFinancialAccountForm |  |
| FindFinancialAccount | FinancialAccountList |  |
| FindJournal | CreateGlJournal |  |
| FindJournal | TransactionList |  |
| EditGlAccount | EditGlAccountForm |  |
| EditGlAccount | NewGlAccountOrgForm |  |
| EditGlAccount | GlAccountOrgList |  |
| FindGlAccount | NewGlAccountForm |  |
| FindGlAccount | GlAccountListForm |  |
| Aging | ReportOptions |  |
| Aging | InvoiceAgingList |  |
| EditInvoice | AdjustInvoice |  |
| EditInvoice | OutSystemMessageList |  |
| EditInvoice | AuditLogList |  |
| EditInvoice | EditInvoice |  |
| EditInvoice | NewContentForm |  |
| EditInvoice | UpdateContentForm |  |
| EditInvoice | SendPastDueEmailForm |  |
| EditInvoice | SendFinalizedEmailForm |  |
| EditInvoice | EmailMessageList |  |
| EditInvoice | NewCreditMemoForm |  |
| EditInvoice | RecordPaymentForm |  |
| EditInvoice | PaymentApplicationList |  |
| EditInvoice | OrderPromisedPaymentList |  |
| EditInvoice | UnappliedPaymentList |  |
| EditInvoice | UnpaidInvoiceList |  |
| EditInvoice | InvoiceTxList |  |
| EditInvoice | InvoiceGlaList |  |
| EditInvoiceItemDetails | AddDetailForm |  |
| EditInvoiceItemDetails | AssetItemDetailList |  |
| EditInvoiceItemDetails | FacilityItemDetailList |  |
| EditInvoiceItemDetails | ItemDetailList |  |
| EditInvoiceItemOrders | ApplyToOrder |  |
| EditInvoiceItemOrders | ApplyItemToOrder |  |
| EditInvoiceItemOrders | ItemBillingList |  |
| EditInvoiceItemShipments | ApplyToShipment |  |
| EditInvoiceItemShipments | ApplyItemToShipment |  |
| EditInvoiceItemShipments | ItemSourceList |  |
| EditInvoiceItems | CreateInvoiceItem |  |
| EditInvoiceItems | EditInvoiceItems |  |
| FindInvoice | NewPayableForm |  |
| FindInvoice | NewReceivableForm |  |
| FindInvoice | NewCustCreditForm |  |
| FindInvoice | NewSupCreditForm |  |
| FindInvoice | ProjectInvoice |  |
| FindInvoice | ProjectWorkerInvoice |  |
| FindInvoice | WorkerInvoice |  |
| FindInvoice | CustomerStatementForm |  |
| FindInvoice | MainOptions |  |
| FindInvoice | InvoiceList |  |
| FindInvoice | AgingSummaryList |  |
| AcctgPreference | EditPapForm |  |
| AcctgPreference | CloneAcctgSettingsForm |  |
| AssetTypes | AddConfigForm |  |
| AssetTypes | AllConfigList |  |
| FinAcctReasons | AllTypesList |  |
| FinAcctTypes | AllTypesList |  |
| GlAccounts | NewGlAccountOrgForm |  |
| GlAccounts | GlAccountOrgList |  |
| InvoiceTypes | AddConfigForm |  |
| InvoiceTypes | MissingConfigForm |  |
| InvoiceTypes | AllConfigList |  |
| ItemTypes | AddConfigForm |  |
| ItemTypes | MissingConfigForm |  |
| ItemTypes | AllConfigList |  |
| PaymentInstruments | AllEnumList |  |
| PaymentTypes | AddConfigForm |  |
| PaymentTypes | MissingConfigForm |  |
| PaymentTypes | AllConfigList |  |
| TypeDefaults | AllEnumList |  |
| BulkPaymentCheck | PaymentList |  |
| BulkPaymentCheck | PaymentListAssignRef |  |
| BulkPaymentCheck | PaymentListActions |  |
| EditPayment | RefundPaymentForm |  |
| EditPayment | AuditLogList |  |
| EditPayment | EditPayment |  |
| EditPayment | GatewayAuthorizeForm |  |
| EditPayment | GatewayCaptureForm |  |
| EditPayment | GatewayRefundForm |  |
| EditPayment | SetRefundForForm |  |
| EditPayment | GatewayRefundForForm |  |
| EditPayment | RefundPaymentList |  |
| EditPayment | PaymentApplicationList |  |
| EditPayment | UnpaidInvoiceList |  |
| EditPayment | UnappliedPaymentList |  |
| EditPayment | PaymentTxList |  |
| EditPayment | InvoiceGlaList |  |
| EditPayment | NewContentForm |  |
| EditPayment | UpdateContentForm |  |
| EditPayment | GatewayResponseList |  |
| FindPayment | NewInPaymentForm |  |
| FindPayment | NewOutPaymentForm |  |
| FindPayment | PaymentList |  |
| AccountBalance | AccountBalanceHistory |  |
| AccountLedger | AccountLedger |  |
| ArAgingSummary | ReportOptions |  |
| ArAgingSummary | InvoiceAgingList |  |
| AssetOnHand | AssetOnHandSummary |  |
| AssetOnHandSummary | FieldDescriptions |  |
| AssetOnHandSummary | AssetOnHandSummary |  |
| AssetReceiptTransaction | AssetReceiptTxList |  |
| AssetStatusByReceipt | FieldDescriptions |  |
| AssetStatusByReceipt | AssetOnHandSummary |  |
| AssetValuation | AssetValuationSummary |  |
| InvoiceAgingDetail | ReportOptions |  |
| InvoiceAgingDetail | InvoiceAgingList |  |
| InvoiceItemSummary | InvoiceItemSummary |  |
| InvoiceReconciliation | ReportOptions |  |
| InvoiceReconciliation | InvoiceVsGlList |  |
| InvoiceReconciliation | PaymentVsGlList |  |
| InvoiceReconciliation | NotPostedTxList |  |
| InvoiceReconciliation | CreditNeqDebitTxList |  |
| InvoiceReconciliation | NoInvoiceTxList |  |
| InvoiceReconciliation | ApplicationFutureInvoiceList |  |
| OrderIssuedInvoiced | OrderIssuedInvoiced |  |
| OrderItemSummary | OrderItemSummary |  |
| PostedAmountSummary | ResultListForm |  |
| PostedBalanceSummary | ResultList |  |
| ReportList | BalanceSheetForm |  |
| ReportList | IncomeStatementForm |  |
| ReportList | CashFlowStatementForm |  |
| ReportList | RetainedEarningsStatementForm |  |
| ReportList | FinancialRatiosForm |  |
| ReportList | CustomerStatementForm |  |
| ReportList | AccountLedgerForm |  |
| ReportList | AccountBalanceForm |  |
| ReportList | PostedAmountSummaryForm |  |
| ReportList | PostedBalanceSummaryForm |  |
| SalesAnalysis | SalesAnalysis |  |
| SalesInvoiceAnalysis | SalesInvoiceAnalysis |  |
| SalesSummary | SummaryOptions |  |
| SalesSummary | TopProductList |  |
| SalesSummary | SalesOrderSummaryList |  |
| SalesSummary | TopCustomerClassList |  |
| SalesSummary | SalesInvoiceSummaryList |  |
| ShipmentPackageSummary | ShipmentPackageSummary |  |
| EditTimePeriod | CreateNextPeriod |  |
| EditTimePeriod | CreatePreviousPeriod |  |
| EditTimePeriod | ViewTimePeriod |  |
| EditTimePeriod | CreateChild |  |
| EditTimePeriod | TimePeriodList |  |
| FindTimePeriod | CreatePeriod |  |
| FindTimePeriod | TimePeriodList |  |
| ViewPeriodGlAccounts | ClosingTransForm |  |
| ViewPeriodGlAccounts | PeriodGlAccountList |  |
| EditTransaction | UpdateAcctgTrans |  |
| EditTransaction | UpdateAcctgTransPosted |  |
| EditTransaction | AddEntryForm |  |
| EditTransaction | EntryListForm |  |
| EditTransaction | AuditLogList |  |
| MoveEntry | ReceiveForm |  |
| FindTransaction | CreateAcctgTrans |  |
| FindTransaction | TransactionList |  |
| FindTransactionEntry | TransactionEntryList |  |
| OrgInternalSummary | OrgInternalForm |  |

## Asset (65 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| AssetCalendar | NewEventForm |  |
| AssetDetail | UpdateAssetAcquireCost |  |
| AssetDetail | AuditLogList |  |
| AssetDetail | EditAsset |  |
| AssetDetail | ReservationsListForm |  |
| AssetDetail | AssetDetailList |  |
| AssetDetail | AssetDepreciationList |  |
| EditAssetMaintenance | UpdateMaintenanceForm |  |
| EditAssetMaintenance | NewContentForm |  |
| EditAssetMaintenance | UpdateContentForm |  |
| FindAssetMaintenance | AddPlannedMaintenance |  |
| FindAssetMaintenance | AddOtherMaintenance |  |
| FindAssetMaintenance | ProductMaintenanceList |  |
| FindAssetMaintenance | MaintenanceListForm |  |
| AssetMeters | NewMeterForm |  |
| AssetMeters | MeterListForm |  |
| AssetParties | AddUserForm |  |
| AssetParties | UpdateUserForm |  |
| AssetRegistrations | NewRegistrationForm |  |
| AssetRegistrations | RegistrationsForm |  |
| DetailHistory | AssetDetailList |  |
| FindAsset | UpdateProductCost |  |
| FindAsset | CreateEquipment |  |
| FindAsset | ListAssets |  |
| FindSummary | ReceiveAssetForm |  |
| FindSummary | PhysicalManualChange |  |
| FindSummary | AssetSummary |  |
| PhysicalChange | RecordChange |  |
| PhysicalQuantity | RecordQuantity |  |
| MoveAsset | AssetInfoForm |  |
| MoveAsset | ScanMoveAssetForm |  |
| MoveAsset | EnterMoveAssetForm |  |
| SelectAsset | ScanAssetForm |  |
| SelectAsset | ActiveFacilityForm |  |
| SelectAsset | SelectAssetForm |  |
| SelectAsset | SelectLocationForm |  |
| SelectAsset | ScanMoveAssetForm |  |
| SelectAsset | EnterMoveAssetForm |  |
| SelectAsset | ContainerAssetList |  |
| SelectAsset | LocationAssetList |  |
| SelectAsset | ProductNoLocAssetList |  |
| SelectAsset | RecentMoveForm |  |
| SelectAsset | RecentContainerMoveForm |  |
| EditAssetPool | UpdateAssetPoolForm |  |
| EditAssetPool | AddPartyForm |  |
| EditAssetPool | PartyListForm |  |
| EditAssetPool | AddStoreForm |  |
| EditAssetPool | StoreListForm |  |
| FindAssetPool | CreateAssetPoolForm |  |
| FindAssetPool | AssetPoolList |  |
| EditContainer | PickScanForm |  |
| EditContainer | UpdateContainerForm |  |
| EditContainer | AddAssetForm |  |
| EditContainer | AssetListForm |  |
| FindContainer | CreateContainerForm |  |
| FindContainer | ContainerList |  |
| MoveContainer | ContainerInfoForm |  |
| MoveContainer | AssetListForm |  |
| MoveContainer | ScanMoveContainerForm |  |
| MoveContainer | EnterMoveContainerForm |  |
| EditLots | CreateLot |  |
| EditLots | LotList |  |
| EditPhysicalInventory | UpdateMasterEntityValue |  |
| EditPhysicalInventory | AssetDetailList |  |
| FindPhysicalInventory | PhysicalInventoryList |  |

## Catalog (80 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| Category/Content/ContentDetail | UpdateContentForm |  |
| Category/Content/ContentDetail | UpdateTextForm |  |
| Category/Content/ContentList | NewContentForm |  |
| Category/Content/ContentList | NewLocationForm |  |
| Category/Content/ContentList | NewTextForm |  |
| Category/Content/ContentList | ContentList |  |
| EditCategory | EditCategoryForm |  |
| EditCategory | AddChild |  |
| EditCategory | ChildCategoriesForm |  |
| EditCategory | GenerateCategoryIdent |  |
| EditCategory | AddCategoryIdentForm |  |
| EditCategory | CategoryIdentForm |  |
| EditCategory | ParentCategoriesForm |  |
| EditCategory | AddFeatureGroupForm |  |
| EditCategory | FeatureGroupsForm |  |
| EditProducts | AddProductForm |  |
| EditProducts | ProductsForm |  |
| FindCategory | NewCategoryForm |  |
| FindCategory | CategoriesForm |  |
| EditFeature | NewFeatureForm |  |
| EditFeature | EditFeatureForm |  |
| EditFeature | AddFeatureGroupForm |  |
| EditFeature | FeatureGroupsForm |  |
| EditFeature | AddProductForm |  |
| EditFeature | ProductsForm |  |
| FindFeature | NewFeatureForm |  |
| FindFeature | FeaturesForm |  |
| EditFeatureGroup | EditFeatureGroupForm |  |
| EditFeatureGroup | AddCategoryForm |  |
| EditFeatureGroup | CategoriesForm |  |
| EditFeatureGroup | AddFeatureForm |  |
| EditFeatureGroup | FeaturesForm |  |
| FindFeatureGroup | NewFeatureGroupForm |  |
| FindFeatureGroup | FeatureGroupsForm |  |
| Product/Content/ContentDetail | UpdateContentForm |  |
| Product/Content/ContentDetail | UpdateTextForm |  |
| Product/Content/ContentList | NewContentForm |  |
| Product/Content/ContentList | NewLocationForm |  |
| Product/Content/ContentList | NewTextForm |  |
| Product/Content/ContentList | ContentList |  |
| EditAssocs | AddAssocToForm |  |
| EditAssocs | AssocToListForm |  |
| EditAssocs | AssocFromListForm |  |
| EditAssocs | CreateVariantsForm |  |
| EditAssocs | AllSelectableFeaturesForm |  |
| EditCategories | AddCategoryForm |  |
| EditCategories | CategoriesForm |  |
| EditPrices | NewPriceForm |  |
| EditPrices | PricesForm |  |
| EditProduct | CloneProductForm |  |
| EditProduct | EditProductForm |  |
| EditProduct | AddIdentificationForm |  |
| EditProduct | IdentificationsForm |  |
| EditProduct | GenerateOtherIdentification |  |
| EditProduct | AddOtherIdentificationForm |  |
| EditProduct | OtherIdentificationsForm |  |
| EditProduct | NewFeatureForm |  |
| EditProduct | AddFeatureForm |  |
| EditProduct | FeaturesForm |  |
| EditProduct | AddDimensionForm |  |
| EditProduct | DimensionsForm |  |
| EditProduct | AddUomDimensionForm |  |
| EditProduct | UomDimensionsForm |  |
| EditProduct | CreateProductLocation |  |
| EditProduct | ProductLocationList |  |
| EditProduct | CreateProductMeter |  |
| EditProduct | ProductMeterList |  |
| EditProduct | CreateProductMaintenance |  |
| EditProduct | ProductMaintenanceList |  |
| FindProduct | NewProductForm |  |
| FindProduct | ProductsForm |  |
| Search | AddCategoryForm |  |
| Search | RemoveCategoryForm |  |
| Search | AddFeatureForm |  |
| Search | RemoveFeatureForm |  |
| Search | ProductsForm |  |
| Search | AddCategoryFormSelection |  |
| Search | RemoveCategoryFormSelection |  |
| Search | AddFeatureFormSelection |  |
| Search | RemoveFeatureFormSelection |  |

## Customer (7 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| CustomerData | CustomerDataList |  |
| FindCustomer | CreatePersonForm |  |
| FindCustomer | CreateOrganizationForm |  |
| FindCustomer | CreateAccountForm |  |
| FindCustomer | CreateContactForm |  |
| FindCustomer | OuterSearchForm |  |
| FindCustomer | CustomerListForm |  |

## Facility (18 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| BoxTypes | CreateBoxType |  |
| BoxTypes | BoxTypeList |  |
| CarrierShipMethods | CreateCarrierShipmentMethod |  |
| CarrierShipMethods | CarrierShipmentMethodList |  |
| EditFacility | EditFacilityForm |  |
| EditFacility | ChildListForm |  |
| EditFacility | NewNoteForm |  |
| EditFacility | UpdateNoteForm |  |
| EditFacility | AddBoxTypeForm |  |
| EditFacility | BoxTypesForm |  |
| EditFacility | AddLocationTypeForm |  |
| EditFacility | LocationTypesForm |  |
| EditFacilityLocations | NewLocationForm |  |
| EditFacilityLocations | LocationsForm |  |
| EditFacilityProducts | AddProductForm |  |
| EditFacilityProducts | ProductList |  |
| FindFacility | NewFacilityForm |  |
| FindFacility | FacilityListForm |  |

## Gateway (6 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditPaymentGateway | EditPaymentGatewayForm |  |
| FindPaymentGateway | NewPaymentGatewayForm |  |
| FindPaymentGateway | PaymentGatewaysForm |  |
| EditShippingGateway | EditShippingGatewayForm |  |
| FindShippingGateway | NewShippingGatewayForm |  |
| FindShippingGateway | ShippingGatewaysForm |  |

## HumanRes (2 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditRateAmounts | CreateRateAmount |  |
| EditRateAmounts | EditRateAmounts |  |

## Manufacturing (23 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditRun | UpdateRun |  |
| EditRun | NewNoteForm |  |
| EditRun | UpdateNoteForm |  |
| EditRun | AddEquipment |  |
| EditRun | EquipmentList |  |
| EditRun | AddPartyAssignForm |  |
| EditRun | UpdateAssignForm |  |
| FindRun | NewRunForm |  |
| FindRun | RunList |  |
| RunConsumed | IssueAssetForm |  |
| RunConsumed | ConsumeAssetForm |  |
| RunConsumed | IssuedAssetForm |  |
| RunProduced | ReceiveAssetForm |  |
| RunProduced | ReceivedAssetForm |  |
| RunProducts | AddProduceForm |  |
| RunProducts | ReceiveAssetForm |  |
| RunProducts | ProduceList |  |
| RunProducts | AddConsumeForm |  |
| RunProducts | IssueAssetForm |  |
| RunProducts | ConsumeList |  |
| ConsumeAsset | ConsumeAssetForm |  |
| ConsumeProduct | ConsumeAssetForm |  |
| ProduceAsset | ReceiveAssetForm |  |

## Order (43 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| FindOrder | CreateSalesOrder |  |
| FindOrder | ApproveOrdersForm |  |
| FindOrder | CloseOrdersForm |  |
| FindOrder | CreatePurchaseOrder |  |
| FindOrder | OrderList |  |
| OrderDetail | CloseOrderPartItems |  |
| OrderDetail | AddPartForm |  |
| OrderDetail | RecurOptions |  |
| OrderDetail | AuditLogList |  |
| OrderDetail | HeaderForm |  |
| OrderDetail | AddPromoCode |  |
| OrderDetail | AddPartyPromoCode |  |
| OrderDetail | OrderPromoCodeList |  |
| OrderDetail | ItemLimitForm |  |
| OrderDetail | NewNoteForm |  |
| OrderDetail | UpdateNoteForm |  |
| OrderDetail | NewContentForm |  |
| OrderDetail | UpdateContentForm |  |
| OrderDetail | SendPlacedEmailForm |  |
| OrderDetail | EmailMessageList |  |
| OrderDetail | SystemMessageList |  |
| OrderDetail | ChildOrderList |  |
| OrderDetail | AddOrderPartToShipmentForm |  |
| OrderDetail | EditPartForm |  |
| OrderDetail | EditPartNonEdForm |  |
| OrderDetail | CreateOrderPartParty |  |
| OrderDetail | CloseOrderPartItems |  |
| OrderDetail | AddPaymentForm |  |
| OrderDetail | UpdatePaymentForm |  |
| OrderDetail | GatewayAuthorizeForm |  |
| OrderDetail | GatewayResponseList |  |
| OrderDetail | SetOrderInfoForm |  |
| OrderDetail | AddProductItemForm |  |
| OrderDetail | AddOtherItemForm |  |
| OrderDetail | OrderItems |  |
| EditItem | EditOrderItem |  |
| ItemReserve | ReserveItem |  |
| ReturnItem | ReturnItem |  |
| OrderItems | AddProductItemForm |  |
| OrderItems | AddOtherItemForm |  |
| OrderItems | OrderItems |  |
| QuickItems | QuickItemOptions |  |
| QuickItems | QuickItemList |  |

## Party (105 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditParty | CreateUserAccount |  |
| EditParty | ConvertToPersonForm |  |
| EditParty | ConvertToOrganizationForm |  |
| EditParty | EditOrganizationForm |  |
| EditParty | EditPersonForm |  |
| EditParty | AddDirectRoleForm |  |
| EditParty | AddOtherRoleForm |  |
| EditParty | RolesForm |  |
| EditParty | SetClassificationForm |  |
| EditParty | ClassificationsForm |  |
| EditParty | AddIdentificationForm |  |
| EditParty | IdentificationsForm |  |
| EditParty | AddSettingForm |  |
| EditParty | AddSettingTextForm |  |
| EditParty | SettingsForm |  |
| EditParty | UpdateUserAccount |  |
| EditParty | AddGroupForm |  |
| EditParty | GroupsForm |  |
| EditParty | NewToRelForm |  |
| EditParty | UserOrgRelList |  |
| EditParty | AddSalesAccount |  |
| EditParty | AccountRelList |  |
| EditParty | AddContactAssignForm |  |
| EditParty | CreateContactForm |  |
| EditParty | ContactRelList |  |
| EditParty | AddParentAccount |  |
| EditParty | ParentAccountRelList |  |
| EditParty | AddChildAccount |  |
| EditParty | ChildAccountRelList |  |
| EditParty | NewNoteForm |  |
| EditParty | UpdateNoteForm |  |
| EditParty | OtherCreateForm |  |
| EditParty | PhonePurposeForm |  |
| EditParty | EmailPurposeForm |  |
| EditParty | WebPurposeForm |  |
| EditParty | OtherUpdateForm |  |
| EditParty | OtherPurposeForm |  |
| EditParty | PostalPurposeForm |  |
| EditParty | FinancialAccountList |  |
| EditParty | NewContentForm |  |
| EditParty | UpdateContentForm |  |
| ExpiredContactOther | PcmListForm |  |
| ExpiredContactOther | PcmTelecomListForm |  |
| ExpiredPostal | PcmListForm |  |
| FindDuplicates | DupPartyList |  |
| UpdateContactInfo | UpdateContactInfo |  |
| UpdatePaymentMethodInfo | PaymentMethodInfoForm |  |
| FinancialInfo | UnpaidInvoiceList |  |
| FinancialInfo | PaymentList |  |
| FinancialInfo | OrderList |  |
| FinancialInfo | UnpaidPayablesList |  |
| FinancialInfo | OutgoingPaymentList |  |
| FinancialInfo | PurchaseOrderList |  |
| FinancialInfo | PaidInvoiceList |  |
| FinancialInfo | PaidPayablesList |  |
| FindParty | CreatePersonForm |  |
| FindParty | CreatePersonCustForm |  |
| FindParty | CreateEmployeeForm |  |
| FindParty | CreateOrganizationForm |  |
| FindParty | CreateAccountForm |  |
| FindParty | CreateContactForm |  |
| FindParty | OuterSearchForm |  |
| FindParty | PartyListForm |  |
| EditAgreement | EditAgreement |  |
| EditAgreement | AddSettlementTerm |  |
| EditAgreement | AddOtherTerm |  |
| EditAgreement | AgreementTermList |  |
| EditAgreement | AddAgreementItem |  |
| EditAgreement | AgreementItemList |  |
| EditAgreement | NewContentForm |  |
| EditAgreement | UpdateContentForm |  |
| FindAgreement | NewAgreement |  |
| FindAgreement | AgreementList |  |
| PartyEmails | EmailMessageList |  |
| PartyProjects | AddUserAssignForm |  |
| PartyProjects | UpdateUserAssignForm |  |
| PartyRelated | NewToRelForm |  |
| PartyRelated | NewFromRelForm |  |
| PartyRelated | ToRelationshipForm |  |
| PartyRelated | FromRelationshipForm |  |
| PartyRequests | AddUserForm |  |
| PartyRequests | UpdateUserForm |  |
| PartyTasks | AddUserAssignForm |  |
| PartyTasks | UpdateUserAssignForm |  |
| PartyTimeEntries | ClockInForm |  |
| PartyTimeEntries | WorkerInvoice |  |
| PartyTimeEntries | TimeEntryList |  |
| EditTimeEntry | AddTimeForm |  |
| EditPaymentMethod | PaymentMethodInfoForm |  |
| EditPaymentMethod | NewContentForm |  |
| EditPaymentMethod | UpdateContentForm |  |
| EditPaymentMethod | UpdateBankAccountMutable |  |
| EditPaymentMethod | UpdatePaymentMethodMutable |  |
| PaymentGatewayResponses | GatewayResponseList |  |
| PaymentMethodChecks | CheckList |  |
| PaymentMethodFiles | GenerateNachaFile |  |
| PaymentMethodFiles | GeneratePosPayFile |  |
| PaymentMethodFiles | FileList |  |
| PaymentMethodTrans | AddTransForm |  |
| PaymentMethodTrans | UploadOfxV1Form |  |
| PaymentMethodTrans | UploadBaiV2Form |  |
| PaymentMethodTrans | AutoMatchReconcileForm |  |
| PaymentMethodTrans | TransList |  |
| PaymentMethodTrans | ManRecForm |  |
| CreatePayment | CreatePaymentForm |  |

## ProductStore (34 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditProductStore | CloneProductStoreForm |  |
| EditProductStore | EditStoreForm |  |
| EditProductStore | NewShippingOptionForm |  |
| EditProductStore | ShipOptionsForm |  |
| EditProductStore | NewShippingGatewayForm |  |
| EditProductStore | ShippingGatewaysForm |  |
| EditProductStore | NewPaymentGatewayForm |  |
| EditProductStore | PaymentGatewayForm |  |
| EditProductStore | NewStoreDataDocumentForm |  |
| EditProductStore | StoreDataDocumentForm |  |
| FindProductStore | NewStoreForm |  |
| FindProductStore | StoresForm |  |
| FindProductStoreCategory | NewStoreCategoryForm |  |
| FindProductStoreCategory | StoreCategoriesForm |  |
| FindProductStoreEmails | NewStoreEmailForm |  |
| FindProductStoreEmails | StoreEmailsForm |  |
| FindProductStoreFacility | NewStoreFacilityForm |  |
| FindProductStoreFacility | StoreFacilityFormList |  |
| FindProductStoreParty | NewStorePartyForm |  |
| FindProductStoreParty | StorePartyFormList |  |
| FindProductStoreSettings | SelectStoreSettingForm |  |
| FindProductStoreSettings | NewStoreSettingForm |  |
| FindProductStoreSettings | StoreSettingsForm |  |
| EditPromotion | EditPromotionForm |  |
| EditPromotion | PromoParameterForm |  |
| EditPromotion | AddProductForm |  |
| EditPromotion | ProductsForm |  |
| FindPromotion | NewPromotionForm |  |
| FindPromotion | PromotionsForm |  |
| EditPromoCode | EditPromoCodeForm |  |
| EditPromoCode | NewPromoCodePartyForm |  |
| EditPromoCode | PromoCodePartyForm |  |
| FindPromoCode | NewPromoCodeForm |  |
| FindPromoCode | PromoCodeForm |  |

## Project (20 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditMilestones | CreateMilestoneForm |  |
| EditMilestones | MilestoneList |  |
| EditProject | CloneProject |  |
| EditProject | EditProject |  |
| EditUsers | AddUserAssignForm |  |
| EditUsers | UpdateUserAssignForm |  |
| EditWikiPages | AddWpweForm |  |
| EditWikiPages | DeleteWpweForm |  |
| FindProject | NewProject |  |
| FindProject | ListProjects |  |
| MilestoneSummary | InactiveTaskList |  |
| MilestoneSummary | ActiveTaskList |  |
| MilestoneSummary | DoneTaskList |  |
| ProjectProgressReport | ChildStatsListDays |  |
| ProjectProgressReport | MilestoneStatsList |  |
| ProjectSummary | ViewProject |  |
| ProjectSummary | MilestoneList |  |
| ProjectSummary | ViewWpweForm |  |
| ProjectSummary | ViewUserAssignForm |  |
| ProjectTimeEntries | TimeEntryListForm |  |

## Request (22 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditRequest | EditRequest |  |
| EditRequest | AddCommentForm |  |
| EditRequest | AddPartyForm |  |
| EditRequest | UpdatePartyForm |  |
| EditRequest | NewNoteForm |  |
| EditRequest | UpdateNoteForm |  |
| EditRequest | NewContentForm |  |
| EditRequest | UpdateContentForm |  |
| EditRequest | RequestTaskList |  |
| RequestCommentReply | ReplyCommentForm |  |
| RequestCommentUpdate | ReplyCommentForm |  |
| EditRequestItems | NewRequestItemForm |  |
| EditRequestItems | RequestItemListForm |  |
| EditTasks | AddRweForm |  |
| EditTasks | NewTaskForm |  |
| EditTasks | UpdateRweForm |  |
| EditUsers | AddUserForm |  |
| EditUsers | UpdateUserForm |  |
| EditWikiPages | AddWprForm |  |
| EditWikiPages | DeleteWprForm |  |
| FindRequest | NewRequestForm |  |
| FindRequest | ListRequests |  |

## Return (8 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| AddOrderItems | LookBackDaysForm |  |
| AddOrderItems | AddOrderItemToReturn |  |
| EditReturn | AuditLogList |  |
| EditReturn | UpdateReturn |  |
| EditReturnItems | ReturnItemList |  |
| FindReturn | CreateReturn |  |
| FindReturn | CreateSupplierReturn |  |
| FindReturn | ReturnHeaderList |  |

## Shipment (46 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| FindShipment | NewOutgoingShipment |  |
| FindShipment | NewIncomingShipment |  |
| FindShipment | NewTransferShipment |  |
| FindShipment | ShipmentList |  |
| PackageTracking | EtaPackageList |  |
| ShipmentDetail | AuditLogList |  |
| ShipmentDetail | EditShipment |  |
| ShipmentDetail | ItemLimitForm |  |
| ShipmentDetail | PackScanForm |  |
| ShipmentDetail | PickScanForm |  |
| ShipmentDetail | ShipmentOrderPaymentList |  |
| ShipmentDetail | ShipmentInvoicePaymentList |  |
| ShipmentDetail | AddParty |  |
| ShipmentDetail | RolesForm |  |
| ShipmentDetail | NewContentForm |  |
| ShipmentDetail | UpdateContentForm |  |
| ShipmentDetail | SendPlacedEmailForm |  |
| ShipmentDetail | EmailMessageList |  |
| ShipmentDetail | ProduceAssembliesForm |  |
| ShipmentDetail | AssemblyProduceProducts |  |
| ShipmentDetail | AssemblyConsumeProducts |  |
| ShipmentDetail | AddItemForm |  |
| ItemReserve | ReserveItem |  |
| ReceiveItem | ReceiveForm |  |
| UpdateItemAsset | UpdateForm |  |
| ShipmentItems | AssemblyPackUnusedComponents |  |
| ShipmentItems | SetPackedForm |  |
| ShipmentItems | SetDeliveredForm |  |
| ShipmentItems | AddItemForm |  |
| ShipmentItems | ItemsOptionsForm |  |
| ShipmentItems | PackItemForm |  |
| ShipmentItems | PackComponentsForm |  |
| ShipmentItems | UpdateItemForm |  |
| ShipmentItems | AddItemToPackageForm |  |
| ShipmentItems | ItemSourceIssuanceList |  |
| ShipmentItems | PaComponentPackForm |  |
| ShipmentItems | ItemAssetIssuanceList |  |
| ShipmentItems | ItemSourceReceiptList |  |
| ShipmentItems | ItemAssetReceiptList |  |
| ShipmentPackages | SetShippedForm |  |
| ShipmentPackages | PrintAllShipmentLabels |  |
| ShipmentPackages | PackageOptionsForm |  |
| ShipmentPackages | UpdatePackageForm |  |
| ShipmentPackages | RequestRetLabel |  |
| ShipmentPackages | PrintShipmentLabel |  |
| ShipmentPackages | ShipmentPackageContentList |  |

## Shipping (34 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| PackItems | ItemsOptionsForm |  |
| PackItems | PackItemForm |  |
| PackItems | UpdateItemForm |  |
| PackItems | AddItemToPackageForm |  |
| PackItems | ItemSourceIssuanceList |  |
| PackItems | ItemAssetIssuanceList |  |
| PackPackages | PackageOptionsForm |  |
| PackPackages | UpdatePackageForm |  |
| PackPackages | RequestRetLabel |  |
| PackPackages | PrintShipmentLabel |  |
| PackPackages | ShipmentPackageContentList |  |
| PackSummary | PrintAllShipmentLabels |  |
| PackSummary | SetShippedForm |  |
| PackSummary | PackScanForm |  |
| PackSummary | ClosePackageForm |  |
| PackSummary | ShipmentPackageContentList |  |
| PackCompleted | AssemblyPackUnusedComponents |  |
| PackCompleted | PackCompletedForm |  |
| PickLocationMoves | PickMoveList |  |
| QuickMove | ScanMoveAssetForm |  |
| AddOrder | AddOrderList |  |
| AddShipment | AddShipmentList |  |
| BulkPicklist | CreatePicklistsForm |  |
| BulkPicklist | AddOrderList |  |
| FindPicklist | NewPicklist |  |
| FindPicklist | PicklistList |  |
| PicklistDetail | UpdateShipmentLoad |  |
| PicklistDetail | ListShipments |  |
| PicklistDetail | AddPartyAssignForm |  |
| PicklistDetail | UpdateAssignForm |  |
| PicklistDetail | AddAsset |  |
| PicklistDetail | UpdateAssetAssign |  |
| dashboard | PackShipmentForm |  |
| dashboard | FacilitySummary |  |

## SimpleReport (9 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditReport | EditDataDocument |  |
| FieldList | AddCondition |  |
| FieldList | ConditionList |  |
| FieldList | FieldList |  |
| FindReport | CreateDataDocument |  |
| FindReport | DataDocumentList |  |
| QuickViewReport | DataDocumentList |  |
| ViewReport | ExportDocuments |  |
| ViewReport | DataViewList |  |

## Supplier (4 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| FindSupplier | CreatePersonForm |  |
| FindSupplier | CreateOrganizationForm |  |
| FindSupplier | OuterSearchForm |  |
| FindSupplier | SupplierListForm |  |

## Survey (14 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditSurvey | EditSurveyForm |  |
| EditSurvey | NewUserGroupForm |  |
| EditSurvey | UserGroupForm |  |
| Fields | NewDbFormFieldForm |  |
| Fields | SurveyPreview |  |
| Fields | DbFormFieldList |  |
| Fields | NewFieldOptionForm |  |
| Fields | FieldOptionForm |  |
| FindSurvey | NewSurveyForm |  |
| FindSurvey | SurveyList |  |
| ResponseDetails | ResponseDetailsForm |  |
| ResponseStats | TextDbFormFieldResponseCountList |  |
| ResponseStats | FieldOptionForm |  |
| Responses | ResponseListForm |  |

## Task (28 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditRelated | AddRelatedToForm |  |
| EditRelated | AddRelatedFromForm |  |
| EditRelated | DeleteRelatedToForm |  |
| EditRelated | DeleteRelatedFromForm |  |
| EditRequests | AddRweForm |  |
| EditRequests | DeleteRweForm |  |
| EditTask | EditTask |  |
| EditTimeEntries | ClockInForm |  |
| EditTimeEntries | AddTaskTime |  |
| EditTimeEntries | TimeEntryList |  |
| EditUsers | AddUserAssignForm |  |
| EditUsers | AddTeamAssignForm |  |
| EditUsers | UpdateAssignForm |  |
| EditWikiPages | AddWpweForm |  |
| EditWikiPages | DeleteWpweForm |  |
| FindTask | SearchOptions |  |
| FindTask | NewTaskForm |  |
| FindTask | ListTasks |  |
| FindTask | AssignTaskSelected |  |
| FindTask | UnAssignTaskSelected |  |
| FindTask | UpdateTaskSelected |  |
| TaskSummary | ClockInForm |  |
| TaskSummary | AddCommentForm |  |
| TaskSummary | NewChildTaskForm |  |
| TaskSummary | NewContentForm |  |
| TaskSummary | UpdateContentForm |  |
| TaskCommentReply | ReplyCommentForm |  |
| TaskCommentUpdate | ReplyCommentForm |  |

## Vendor (10 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditUsers | AddUserRelationshipForm |  |
| EditUsers | UpdateUserRelForm |  |
| EditVendor | PaymentInfo |  |
| EditVendor | SetVendorRepForm |  |
| EditVendor | BillingInfo |  |
| EditVendor | EditVendor |  |
| EditVendor | RoleList |  |
| FindVendor | FindVendor |  |
| FindVendor | CreateVendor |  |
| FindVendor | VendorList |  |

## Wiki (18 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| EditWikiBlog | EditBlogForm |  |
| EditWikiBlog | AddCategory |  |
| EditWikiBlog | CategoriesForm |  |
| EditWikiPage | EditPageForm |  |
| EditWikiSpace | CloneSpace |  |
| EditWikiSpace | EditSpace |  |
| WikiBlogs | AddBlogPage |  |
| WikiBlogs | AddBlogText |  |
| WikiBlogs | WikiBlogList |  |
| WikiSpaces | NewSpace |  |
| WikiSpaces | WikiSpaceList |  |
| wiki | AddPageForm |  |
| wiki | ClonePage |  |
| wiki | AddCommentForm |  |
| wiki | UploadAttachment |  |
| wiki | AddCategory |  |
| wiki | CategoriesForm |  |
| WikiCommentReply | ReplyCommentForm |  |

## BasicHandheld (Warehouse handheld) (16 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| ReceiveAsset | ScanAssetForm |  |
| ReceiveAsset | ActiveFacilityForm |  |
| ReceiveAsset | ReceiveAssetForm |  |
| SelectAsset | ScanAssetForm |  |
| SelectAsset | ActiveFacilityForm |  |
| SelectAsset | ScanMoveAssetForm |  |
| SelectAsset | ContainerAssetList |  |
| SelectAsset | LocationAssetList |  |
| SelectAsset | ProductNoLocAssetList |  |
| SelectAsset | RecentMoveForm |  |
| SelectAsset | RecentContainerMoveForm |  |
| PickLocationMoves | ActiveFacilityForm |  |
| PickLocationMoves | PickMoveList |  |
| dashboard | ActiveFacilityForm |  |
| dashboard | ScanAssetForm |  |
| dashboard | PackShipmentForm |  |

## Shared root screens (5 forms)

| Screen XML | Form | IronStone screens with equivalent functionality |
| --- | --- | --- |
| Search | SearchOptions |  |
| Search | SearchResults |  |
| QuickSearch | SearchOptions |  |
| QuickSearch | SearchResults |  |
| QuickLookup | QuickLookupForm |  |

# IronStone BOSS — Admin app research

Oct 18, 2026

Deeper research pass on the **IronStone Admin** app (users, groups & permissions;
organizations & settings; integrations & system messages; data import and export),
cataloguing every relevant screen/page found in the reference apps. Companion to
[3p-app-reference.md](3p-app-reference.md); feeds the Admin row in
[initial-design.md](initial-design.md), plus the admin faces of the protocol layer (mail
accounts, SMTP gateway, CalDAV/WebDAV, chat) and the Assist write policy. Style mirrors
[research-maintenance.md](research-maintenance.md) and
[research-insights.md](research-insights.md).

**Organization.** Sorted by functional area (not by app): all user screens together, all
permission editors together, etc. Within each area, sub-tables per reference app.

**Scope.** System-administrator UI: user and group management, role/permission editors,
authentication and security policy, organization/company and global settings, app and
feature enablement, customization (custom fields, data model), integrations (OAuth,
webhooks, API keys, gateways), mail servers and system messages, scheduled jobs and
automation, data import/export/backup, audit and system logs, privacy tools, instance
health. Per-app configuration screens (e.g. accounting preferences, warehouse setup) are
noted only as the shape of a settings hub; each business app's research file covers its
own configuration.

**Path conventions.** Paths are relative to each repository's own root, as in
3p-app-reference.md. Checkout locations:

| Prefix in this doc | Checkout |
| --- | --- |
| **Zimbra admin** | `/home/jonesde/work/moquiwork/3p_other/Zimbra/zm-admin-console` — `WebRoot/js/zimbraAdmin/<area>/{controller,model,view}/`, labels in `WebRoot/messages/ZaMsg.properties` |
| **Nextcloud** | `/home/jonesde/work/moquiwork/3p_other/nextcloud` — `server/apps/settings/{src,lib/Settings,lib/Sections}/`, `server/apps/{appstore,theming,user_ldap,oauth2,workflowengine,webhook_listeners,admin_audit,encryption,twofactor_backupcodes,provisioning_api}/` |
| **Odoo** | `/home/jonesde/work/moquiwork/3p_other/odoo` — `odoo/odoo/addons/base/views/` (users, groups, companies, access, technical), `odoo/addons/{base_setup,base_import,base_automation,auth_*,privacy_lookup,iap,cloud_storage*}/` |
| **Frappe (desk)** | `/home/jonesde/work/moquiwork/3p_other/frappe/frappe` — paths relative to `frappe/` package: `frappe/core/doctype/`, `frappe/core/page/permission_manager/`, `frappe/desk/page/{backups,setup_wizard}/`, `frappe/integrations/doctype/`, `frappe/automation/doctype/`, `frappe/email/doctype/`, `frappe/custom/doctype/` |
| **Frappe Central** | `/home/jonesde/work/moquiwork/3p_other/frappe/central` — SaaS control plane: `dashboard/src/pages/`, backend `central/` |
| **Twenty** | `/home/jonesde/work/moquiwork/3p_other/twenty` — `packages/twenty-front/src/pages/settings/<area>/`, `packages/twenty-front/src/modules/settings/<area>/`, `packages/twenty-front/src/modules/spreadsheet-import/` |
| **Carbon** | `/home/jonesde/work/moquiwork/3p_other/carbon` — `apps/erp/app/routes/x+/{settings+,users+,shared+}/`, `apps/erp/app/modules/{settings,users}/ui/`, `packages/ee/src/` (integrations, SSO, webhooks) |
| **Dolibarr** | `/home/jonesde/work/moquiwork/3p_other/dolibarr` — `htdocs/admin/*.php` (~120 setup pages), `htdocs/user/`, `htdocs/user/group/`, `htdocs/{imports,exports,cron,webhook,blockedlog,datapolicy,api}/` |
| **Ever Gauzy** | `/home/jonesde/work/moquiwork/3p_other/ever-co/ever-gauzy` — `apps/gauzy/src/app/pages/{users,organizations,settings,integrations,import-export}/`, integration plugins `packages/plugins/integration-*` |
| **Akaunting** | `/home/jonesde/work/moquiwork/3p_other/akaunting` — `resources/views/{settings,auth/users,common/import,modules,install,wizard}/`, `app/Http/Controllers/{Settings,Auth}/` |
| **AureusERP** | `/home/jonesde/work/moquiwork/3p_other/aureuserp` — `plugins/webkul/{security,plugin-manager,fields}/src/Filament/` |
| **Moqui baseline** | `/home/jonesde/work/moquiwork/mr-moqui-base/runtime` — `base-component/tools/screen/{System,Tools}/`, `component/MrSimpleScreens/screen/SimpleScreens/{Party,Vendor,Accounting/OrgSettings,Gateway,ProductStore}/`, `base-component/framework/entity/{SecurityEntities,ServiceEntities,ServerEntities,BasicEntities,EntityEntities,ScreenEntities,LlmEntities,A2AEntities}.xml` |

Not used here: metasfresh admin is backend-defined AD windows (users, roles, org) with no
dedicated front-end screens beyond login (`frontend/src/containers/Login.js`); the Moqui
components in `3p_moqui/` have only small settings screens (coarchy
`screen/settings/settingsinternal/EditOrganization.xml` for org + billing,
WeCreate `screen/wcinternal/Settings/`); `ServiceJobMonitor` (`3p_moqui/ServiceJobMonitor/screen/MonitorAdmin/`)
adds monitor bounds and alerts on ServiceJob results and is noted in §10.

Sections: [1 admin home & health](#1-admin-home--system-health) · [2 users](#2-users) · [3 groups, roles & permissions](#3-groups-roles--permissions) · [4 authentication & security](#4-authentication--security-policy) · [5 organizations & settings](#5-organizations-companies--general-settings) · [6 apps & features](#6-apps-modules--feature-toggles) · [7 customization](#7-customization-custom-fields-data-model-layouts) · [8 integrations](#8-integrations-oauth-webhooks-api-keys-gateways) · [9 mail, system messages & notifications](#9-mail-servers-system-messages--notifications) · [10 jobs & automation](#10-scheduled-jobs--automation) · [11 import, export & backup](#11-data-import-export--backup) · [12 logs & audit](#12-logs-audit--monitoring) · [13 privacy](#13-privacy--data-policy) · [14 instances & hosting](#14-instances-servers--hosting) · [15 developer tools](#15-developer--power-tools) · [16 cross-app surfaces](#16-cross-app-surfaces) · [17 current Moqui baseline](#17-current-moqui-baseline) · [18 gaps & BOSS implications](#18-gaps--boss-implications)

---

## 1. Admin home & system health

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Zimbra admin | **Home** | Summary (counts of accounts, domains, COS, servers; active sessions; queue length), Maintenance (last DB check, last cleanup, last log purge), Runtime / service status link, **Get started** tasks (create domain, configure GAL, configure auth, configure COS, add account(s), manage accounts) | `WebRoot/js/zimbraAdmin/home/{controller/ZaHomeController.js,view/ZaHomeXFormView.js}` (`LBL_Home*`) |
| Zimbra admin | Navigation tree | Overview panel: Home · Monitor (Server Status, Statistics, Mail Queues) · Manage (Accounts, Aliases, Distribution Lists, Resources) · Configure (COS, Domains, Servers, Global Settings, Zimlets, Admin Extensions, Retention policy) · Tools & Migration · Search (saved searches) | `WebRoot/js/zimbraAdmin/common/{ZaOverviewPanel,ZaOverviewPanelController,ZaTree}.js` (`OVP_*`) |
| Zimbra admin | Server status & statistics | Service status per server; global/server stats pages: message count, volume, spam activity, disk, mailbox, sessions (admin, web, IMAP) over hour/day/month/year | `WebRoot/js/zimbraAdmin/status/view/ZaServicesListView.js`, `statistics/view/{ZaGlobalStatsView,ZaServerStatsView,ZaGlobal*Page,ZaServer*Page}.js` |
| Nextcloud | **Overview** & setup checks | Admin Overview section: version, update channel, list of **setup checks** (security & configuration warnings with severity and doc links) | `server/apps/settings/lib/Settings/Admin/Overview.php`, `server/apps/settings/src/{main-admin-overview.ts,views/AdminSettingsSetupChecks.vue,components/SettingsSetupChecks/}` |
| Nextcloud | Settings shell | Personal and Admin settings navigation by section: Overview, Basic settings, Sharing, Security, Groupware, Office, Users, AI, Delegation, Presets, Server, Additional; apps add sections | `server/apps/settings/src/views/{SettingsApp,SettingsNavigation,SettingsContentWrapper}.vue`, `server/apps/settings/lib/Sections/Admin/*.php` |
| Frappe desk | **System Health Report** | Background workers and queues, scheduler status, socket.io check, emails (failed/pending/unhandled), top errors, DB size and top tables, cache, backup and file sizes, users (total/new), failed logins, active sessions, last active users | `frappe/desk/doctype/system_health_report/` (+ `_errors`, `_queue`, `_tables`, `_workers`, `_failing_jobs`) |
| Twenty | **Admin panel** (instance) | Instance status, health indicators (DB, Redis, worker, queues with queue detail), inferred version, config variables (view/override), workspaces status, user detail with impersonate, AI providers/models | `packages/twenty-front/src/pages/settings/admin-panel/{SettingsAdmin,SettingsAdminInstanceStatus,SettingsAdminIndicatorHealthStatus,SettingsAdminQueueDetail,SettingsAdminConfigVariableDetails,SettingsAdminWorkspacesStatus,SettingsAdminUserDetail}.tsx` |
| Carbon | Settings hub | Settings index with submodule nav (company, companies, security, SSO, API keys, webhooks, integrations, custom fields, sequences, approval rules, audit logs, backups, printing, billing, demo data, per-module settings) | `apps/erp/app/routes/x+/settings+/{_index,_layout}.tsx`, `apps/erp/app/modules/settings/ui/useSettingsSubmodules.tsx` |
| Dolibarr | **Setup home** | Setup index: company/organization, modules/applications, menus, display, dictionaries, other setup, security, emails; plus "Tools" (backup, restore, upgrade, purge, about/system info) | `htdocs/admin/index.php`, `htdocs/admin/tools/` |
| Moqui baseline | **System dashboard** | Links to every System/Tools screen plus server info: process memory, threads, load, CPU, OS, runtime start/uptime, framework version, web host, search backend, worker pool (threads, active, queue) | `base-component/tools/screen/System/dashboard.xml`, `base-component/tools/screen/Tools/dashboard.xml` |

---

## 2. Users

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Nextcloud | **User management** | Virtual-scrolled user table (display name, email, groups, sub-admin groups, quota bar, language, manager, last login, storage location); left nav of groups with counts (admins, disabled, recent, custom groups); new-user dialog; edit dialog (fields, groups, quota, language, manager); row actions (disable, wipe devices, delete, resend welcome); per-column visibility settings | `server/apps/settings/src/views/{UserManagement,UserManagementNavigation}.vue`, `server/apps/settings/src/components/{UserList.vue,Users/*}` (`NewUserDialog`, `EditUserDialog`, `UserRow`, `UserRowActions`, `UserFormQuota`, `UserFormManager`, `UserSettingsDialog`), `server/apps/settings/src/components/AppNavigationGroupList.vue` |
| Zimbra admin | Accounts | Account list with search; **New account wizard** (name, COS, password, features, preferences, aliases, forwarding); account form tabs General Information, Contact Information, Member Of, Aliases, Forwarding, Features, Preferences, Themes, Zimlets, Free/Busy Interop, Advanced; dialogs change password, edit alias/forward, move alias, reindex mailbox, bulk delete with progress | `WebRoot/js/zimbraAdmin/accounts/view/{ZaAccountListView,ZaNewAccountXWizard,ZaAccountXFormView,ZaAccChangePwdXDlg,ZaEditAliasXDialog,ZaEditFwdAddrXDialog,MoveAliasXDialog,ReindexMailboxXDialog,DeleteAcctsPgrsDlg}.js` |
| Odoo | Users | List with filters Internal / Portal / Inactive; form: name, login, photo, **Access Rights** page (per-app role selects + extra rights checkboxes, generated from groups), **Preferences** (language, timezone, notification channel, signature), **Security** (change password, API keys, devices / log out all devices, 2FA); allowed companies + default company | `odoo/odoo/addons/base/views/res_users_views.xml`, `res_users_apikeys_views.xml`, `res_users_identitycheck_views.xml`, `res_device_views.xml` |
| Frappe desk | User | Form: enabled, name, username, email, language, timezone, **roles** (checkbox grid) or **role profiles**, **module profile** (blocked modules), user type (System/Website), defaults, email signature and user emails, document-follow settings, login window (login after/before hour), restrict IP, simultaneous sessions, API key/secret, social logins, desk theme, active sessions, desk feature toggles (search bar, notifications, list sidebar, bulk actions, view switcher, timeline, dashboard) | `frappe/core/doctype/user/user.{json,js}`, `user_session_display/`, `user_social_login/`, `user_email/` |
| Twenty | Members | Workspace members list, invite by email/link, member detail with role assignment, remove | `packages/twenty-front/src/pages/settings/members/{SettingsWorkspaceMembers,SettingsWorkspaceMember}.tsx`, `modules/settings/workspace-member/` |
| Carbon | Users | Separate lists for **employees**, **customers** (portal), **suppliers** (portal), **operators** (shop-floor PIN users); new employee; reset MFA; reset operator PIN; resend/revoke invite; deactivate; **bulk edit permissions**; employee types | `apps/erp/app/routes/x+/users+/{employees,employees.new,employees.reset-mfa.$employeeId,customers,suppliers,operators,operators.reset-pin.$operatorId,resend-invite,revoke-invite,deactivate,bulk-edit-permissions,employee-types}.tsx`, `apps/erp/app/modules/users/ui/{Employees,Customers,Suppliers,EmployeeTypes,UserAttributes}/` |
| Ever Gauzy | Users | Users list per organization, invite (manage-user-invite), edit user profile and organizations/roles | `apps/gauzy/src/app/pages/users/{users.component.ts,manage-user-invite/,edit-user-profile/,edit-user-mutation/}` |
| Dolibarr | Users | User list, card (login, name, admin flag, employee flag, supervisor, hierarchy view), **permissions** tab, groups, LDAP, notifications, credentials, API token, bank info, agenda, documents, notes | `htdocs/user/{list,card,perms,hierarchy,ldap,credentials,api_token,notify,param_ihm}.php` |
| Akaunting | Users | Users list/create/edit/show (name, email, password, companies, roles via Roles app, language, landing page) | `resources/views/auth/users/{index,create,edit,show}.blade.php`, `app/Http/Controllers/Auth/Users.php` |
| AureusERP | Users | Filament resource: list, view, create, edit user; settings page **Manage Users** (default role, invitations) | `plugins/webkul/security/src/Filament/Resources/UserResource/`, `plugins/webkul/security/src/Filament/Clusters/Settings/Pages/ManageUsers.php` |
| Moqui baseline | User accounts | System → Security → Users: list, detail (account fields, disable/enable, reset password, **login as**, groups, permissions, preferences, notification topic subscriptions, **authentication methods** TOTP / single-use codes / email / SMS, visits); SimpleScreens Party detail creates the party's user account and group memberships | `base-component/tools/screen/System/Security/UserAccount/{UserAccountList,UserAccountDetail}.xml`, `UserAccountDetail/{VerifyEmail,VerifySms,VerifyTotp}.xml`, `component/MrSimpleScreens/screen/SimpleScreens/Party/EditParty.xml` (`createUserAccount`, `createUserGroupMember`, `resetPassword`) |

---

## 3. Groups, roles & permissions

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | Groups | Group form: users, inherited groups, **menus**, **views**, **access rights** (model ACL rows: read/write/create/delete), **record rules**, notes; app-category privileges shown on the user form as role selects | `odoo/odoo/addons/base/views/res_groups_views.xml`, `ir_access_views.xml` (`ir.model.access`, `ir.rule`) |
| Frappe desk | **Role Permission Manager** | Page: pick DocType or Role → grid of permission levels × rights (read, write, create, delete, submit, cancel, amend, print, email, report, import, export, share, select), "if owner" flag, add a rule, reset to defaults | `frappe/core/page/permission_manager/`, `frappe/core/doctype/{docperm,custom_docperm}/` |
| Frappe desk | Roles & profiles | Role (desk access, 2FA required, home page, disabled); **Role Profile** (bundle of roles); **Module Profile** (blocked modules); **User Type** (limited-user types with allowed doctypes and user-permission field); **User Group** | `frappe/core/doctype/{role,role_profile,module_profile,user_type,user_group}/` |
| Frappe desk | **User Permissions** & inspector | Row-level: restrict a user to specific values of a DocType (e.g. Company = X), apply to all or selected doctypes, hide descendants; **Permission Inspector** explains why a user can or cannot act on a record | `frappe/core/doctype/{user_permission,permission_inspector}/` |
| Twenty | **Roles** | Role list/create/edit; tabs for settings, **permission flags** (Workspace, Members, Roles, Data model, Security, API keys & webhooks, Applications, Billing, Layouts, Views, Workflows, Connected accounts, Import/Export CSV, Upload/Download file, Impersonate, SSO bypass, AI tools: send email, HTTP request, code interpreter, create calendar event), **object-level permissions** (read/update/delete/destroy per object, field-level), assignment to members, API keys and agents | `packages/twenty-front/src/pages/settings/members/roles/{SettingsRoleCreate,SettingsRoleEdit,SettingsRoleObjectLevel,SettingsRoleAddObjectLevel}.tsx`, `packages/twenty-front/src/modules/settings/roles/{role-permissions/{permission-flags,object-level-permissions,objects-permissions},role-assignment,role-settings}/` |
| Carbon | Groups & permissions | User groups (nested, used for approvals and notifications); per-employee **permission form** (module × view/create/update/delete, company-scoped) and **bulk edit** | `apps/erp/app/routes/x+/users+/groups*.tsx`, `apps/erp/app/modules/users/ui/{Groups,Employees/EmployeePermissionsForm.ee.tsx,Employees/BulkEditPermissionsForm.ee.tsx}` |
| Nextcloud | Groups & **delegation** | Groups in the user-management nav (create, rename, delete, sub-admins); **Delegation** section lets a group manage specific admin settings sections without being admin | `server/apps/settings/src/components/{AppNavigationGroupList,GroupListItem,AdminDelegating,AdminDelegation/GroupSelect}.vue`, `server/apps/settings/lib/Settings/Admin/Delegation.php` |
| Zimbra admin | COS, distribution lists, delegated admin | **Class of Service** (feature/preference/quota bundles assigned to accounts); distribution lists (members, owners, member-of); admin **ACL/grants** on targets; domain ACLs | `WebRoot/js/zimbraAdmin/cos/view/{ZaCosListView,ZaCosXFormView,ZaNewCosXWizard}.js`, `dl/view/{ZaDLXFormView,ZaNewDLXWizard}.js`, `common/ACLXFormItem.js`, `domains/view/{ZaAddDomainAclXDialog,ZaEditDomainAclXDialog}.js` |
| Dolibarr | Groups & rights | User groups (members, permissions tab, LDAP); per-module permission checkboxes on user and group; default permissions for new users | `htdocs/user/group/{list,card,perms,ldap}.php`, `htdocs/user/perms.php`, `htdocs/admin/perms.php` |
| Ever Gauzy | **Roles & permissions** | Role selector + permission sections (toggles per permission, ~500 lines of grouped sections: general, admin, organization, employees, invoices, time tracking, …) | `apps/gauzy/src/app/pages/settings/roles-permissions/{roles-permissions.component.ts,permission-sections.ts}` |
| AureusERP | Roles & teams | Filament Shield-style role editor (resource × permission checkboxes), teams resource | `plugins/webkul/security/src/Filament/Resources/{RoleResource,TeamResource}/` |
| Moqui baseline | Groups & artifact authz | User groups (members with from/thru, permissions, preferences, screen themes); **Artifact groups** (screens/services/entities with inherit flag) and **authorizations** (group × artifact group × action view/create/update/delete/all, authz type allow/always/deny); **tarpits** (velocity limits); entity filter sets for row-level | `base-component/tools/screen/System/Security/{UserGroup/{UserGroupList,UserGroupDetail,GroupUsers},ArtifactGroup/{ArtifactGroupList,ArtifactGroupDetail}}.xml`; entities `ArtifactGroup`, `ArtifactAuthz`, `ArtifactTarpit`, `EntityFilterSet`, `EntityFilter`, `UserPermission`, `UserGroupPermission` in `base-component/framework/entity/SecurityEntities.xml` |

---

## 4. Authentication & security policy

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe desk | System Settings — security | Session expiry, deny multiple sessions, login with mobile/username/email link, disable user/pass login, password policy + minimum score, force reset after N days, consecutive login attempts + lockout, **2FA** (OTP app / SMS / Email, bypass for restricted-IP users), allow error traceback, dormant days | `frappe/core/doctype/system_settings/system_settings.json` |
| Frappe desk | SSO & directory | **Social Login Key** (Google, GitHub, Office 365, Keycloak, Frappe, Salesforce, custom OIDC; allow/deny sign-ups); **LDAP Settings** (AD/OpenLDAP/custom, field mapping, group → role mapping, TLS, default role/user type); **OAuth Provider Settings** | `frappe/integrations/doctype/{social_login_key,ldap_settings,ldap_group_mapping,oauth_provider_settings}/` |
| Frappe desk | Security Settings | Public `security.txt` (contacts, languages, policy, expiry) | `frappe/core/doctype/security_settings/` |
| Odoo | Auth addons & general settings | Settings blocks: **Permissions** (default access rights for new users, customer account invitation), **API Keys** (allow + duration), **OAuth Authentication**, **LDAP Authentication**; modules `auth_totp` (2FA, enforce by mail), `auth_passkey`, `auth_password_policy`, `auth_timeout`, `auth_signup`; per-user devices list | `odoo/addons/base_setup/views/res_config_settings_views.xml`, `odoo/addons/{auth_totp,auth_totp_mail,auth_passkey,auth_password_policy,auth_timeout,auth_oauth,auth_ldap,auth_signup}/` |
| Nextcloud | Security & auth apps | **Security** admin section: server-side **encryption** settings, enforced **two-factor** (for groups, exclusions), password policy app hook; **LDAP/AD** wizard tabs Server, Users, Login attributes, Groups, Advanced, Expert; **OAuth 2.0 clients** (name, redirect URI, client ID/secret); WebAuthn per user; app passwords / sessions | `server/apps/settings/src/{main-admin-security.js,components/AdminTwoFactor.vue,components/Encryption/}`, `server/apps/user_ldap/src/components/SettingsTabs/{ServerTab,UsersTab,LoginTab,GroupsTab,AdvancedTab,ExpertTab}.vue`, `server/apps/oauth2/src/{views,components/OAuthItem.vue}`, `server/apps/settings/src/{authtokens,main-personal-webauth.js}` |
| Twenty | Security & SSO | **SSO identity providers** (OIDC/SAML), **approved access domains** (auto-join by email domain), 2FA method per user, workspace auth options | `packages/twenty-front/src/pages/settings/security/{SettingsSecuritySsoIdentifyProvider,SettingsSecurityApprovedAccessDomain}.tsx`, `pages/settings/profile/SettingsTwoFactorAuthenticationMethod.tsx`, `modules/settings/{security,two-factor-authentication}/` |
| Carbon | Security & SSO | Security settings (MFA, two-factor upgrade dialog), **SSO** page, ITAR certifications | `apps/erp/app/routes/x+/settings+/{security,sso,itar-certifications}.tsx`, `apps/erp/app/modules/settings/ui/Security/`, `packages/ee/src/{sso,two-factor.server.ts}` |
| Zimbra admin | Domain auth & GAL | **Auth config wizard** per domain (internal, external LDAP/AD, custom); **GAL config wizard**; auto-provision; domain certificate | `WebRoot/js/zimbraAdmin/domains/view/{ZaAuthConfigXWizard,ZaGALConfigXWizard,ZaTaskAuthConfigWizard,ZaTaskAutoProvDialog,ZaManualProvConfigDialog}.js` |
| Dolibarr | Security setup | Password generation/encryption rules, captcha, file upload restrictions, **HTTP security headers**, other (session, login), LDAP, **OAuth** (provider tokens), **OpenID Connect** | `htdocs/admin/{security,security_captcha,security_file,security_headers_http,security_other,ldap,ldap_users,ldap_groups,oauth,oauthlogintokens,openid_connect}.php` |
| Ever Gauzy | OAuth clients | OAuth client registry with secret dialog (Gauzy as provider) | `apps/gauzy/src/app/pages/settings/oauth-clients/` |
| Moqui baseline | Authc factors, tarpits, SSO entities | Per-user TOTP / single-use / email / SMS factors on the user detail; artifact tarpits; mr-moqui adds **AuthFlow** (`moqui.security.sso`: OAuth, OIDC, SAML flows with field and role maps) and `UserSshKey`, used by `webroot/sso.xml` and the login screen but with no admin screens | `base-component/tools/screen/System/Security/UserAccount/UserAccountDetail.xml`, `base-component/framework/entity/SecurityEntities.xml` (`AuthFlow`, `AuthFlowFieldMap`, `AuthFlowRoleMap`, `OauthFlow`, `OidcFlow`, `SamlFlow`, `UserAuthcFactor`, `UserSshKey`, `UserLoginHistory`, `UserPasswordHistory`), `base-component/webroot/screen/webroot/{sso,Login}.xml` |

---

## 5. Organizations, companies & general settings

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | **General Settings** & companies | One settings page with app tabs; base blocks: Users (invite, manage), Languages, Companies (name, **Document Layout**, inter-company), Contacts (partner autocomplete), Permissions, Import & Export, Integrations (OAuth, LDAP, geolocation, cloud storage, unsplash), Performance, Progressive Web App, About; Company form with branches; currencies, countries/states, languages, decimal precision, sequences, paper formats | `odoo/addons/base_setup/views/res_config_settings_views.xml`, `odoo/odoo/addons/base/views/{res_company_views,res_currency_views,res_country_views,res_lang_views,decimal_precision_views,ir_sequence_views,report_paperformat_views}.xml` |
| Frappe desk | System Settings & setup wizard | Country, language, time zone, date/time/number formats, float/currency precision, first day of week, app name, backups limit/encryption, scheduler on/off, email footer; **Setup Wizard** for first run; Navbar Settings (logo, items); company/currency in ERPNext | `frappe/core/doctype/system_settings/`, `frappe/desk/page/setup_wizard/`, `frappe/core/doctype/navbar_settings/` |
| Nextcloud | Basic settings, theming, presets | Basic: **background jobs** mode (AJAX/Webcron/Cron), email server, profile defaults; **Theming** (name, URL, slogan, color, logo, background, favicon, legal links, user theming toggle); **Presets** (apply a recommended config bundle: SMB, education, …); language & locale | `server/apps/settings/src/{main-admin-basic-settings.js,components/BasicSettings/{BackgroundJob,ProfileSettings}.vue,views/SettingsPresets.vue,components/SettingsPresets/}`, `server/apps/theming/src/views/{AdminTheming,UserTheming}.vue`, `server/apps/settings/src/views/LanguageLocaleSettings.vue` |
| Zimbra admin | Global settings, domains, servers | **Global Settings** tabs: General Information, Attachments, MTA, IMAP, POP, AS/AV (anti-spam/virus), Interop, Themes, Retention policy; **Domains** (new domain wizard, aliases, GAL, auth, quotas, certificate, features, themes, zimlets); **Servers** (services, volumes, bind IP, proxy, flush cache) | `WebRoot/js/zimbraAdmin/globalconfig/view/GlobalConfigXFormView.js`, `domains/view/{ZaNewDomainXWizard,ZaDomainXFormView,ZaDomainAliasWizard,ZaDomainAccountQuotaListView}.js`, `servers/view/{ZaServerXFormView,ZaServerVolumesListView,ZaEditVolumeXDialog,ZaFlushCacheXDialog}.js`, `rp/` |
| Carbon | Company & companies | Company profile, **multiple companies** (create, switch), logos, sequences per table (prefix/next/padding), serial-number schemes, tags, theme; per-module settings pages (accounting, inventory, invoicing, items, people, planning, production, purchasing, quality, resources, sales) | `apps/erp/app/routes/x+/settings+/{company,companies,company.switch.$companyId,logos,sequences,sequences.$tableId,serial-numbers,tags,accounting,inventory,…}.tsx`, `apps/erp/app/modules/settings/ui/{Company,Companies,Sequences,SerialNumbers,Theme}/` |
| Ever Gauzy | Organizations & settings | Organization list and edit (main, location, other settings incl. time format, start of week, fiscal year, bonus, invites); settings: general (personal settings), feature toggles, **custom SMTP**, email history, file storage provider, SMS gateway, danger zone, monitoring | `apps/gauzy/src/app/pages/organizations/edit-organization/edit-organization-settings/{edit-organization-main,edit-organization-location,edit-organization-other-settings}/`, `apps/gauzy/src/app/pages/settings/{general-setting,feature,custom-smtp,email-history,file-storage,sms-gateway,danger-zone,monitoring}/` |
| Akaunting | Settings | Company, Localisation (date/time format, fiscal year start, timezone, percent position), Defaults (account, currency, tax, payment method, language), Invoice (prefix/next number, template, color), Email & Email templates, Schedule (reminders), Categories, Currencies, Taxes, Modules (app store purchases) | `resources/views/settings/{company,localisation,default,invoice,email,email-templates,schedule,categories,currencies,taxes,modules}/`, `app/Http/Controllers/Settings/` |
| Dolibarr | Company & dictionaries | Company/organization (name, address, managers, fiscal year, social networks, opening hours); display (`ihm`), menus, **dictionaries** (countries, currencies, payment terms, units, … ~60 lookup tables), default values, delays/alerts, limits & precision, translation overrides, PDF options | `htdocs/admin/{company,company_socialnetworks,openinghours,ihm,menus,dict,defaultvalues,delais,limits,translation,pdf,pdf_other}.php` |
| AureusERP | Companies & settings | Company resource (list/create/view/edit), settings pages Manage Users, Manage Currency, Manage Activity | `plugins/webkul/security/src/Filament/Resources/CompanyResource/`, `plugins/webkul/security/src/Filament/Clusters/Settings/Pages/{ManageUsers,ManageCurrency,ManageActivity}.php` |
| Moqui baseline | Org & preferences | SimpleScreens **Vendor** (internal organizations: org detail, contact info, roles, **init accounting configuration**, accounting preferences, users); **Accounting OrgSettings** (acctg preference, GL account defaults, invoice/item/payment/asset types, financial account types/reasons, payment instruments); ProductStore settings; System **Localization** (messages, entity field translations); enumerations/status flows editable via Tools | `component/MrSimpleScreens/screen/SimpleScreens/Vendor/{FindVendor,EditVendor,EditUsers}.xml`, `component/MrSimpleScreens/screen/SimpleScreens/Accounting/OrgSettings/*.xml`, `component/MrSimpleScreens/screen/SimpleScreens/ProductStore/FindProductStoreSettings.xml`, `base-component/tools/screen/System/Localization/{Messages,EntityFields}.xml`, `base-component/tools/screen/Tools/StatusFlows.xml` |

---

## 6. Apps, modules & feature toggles

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Nextcloud | **App store** | Discover, browse by category, bundles; app grid/table with level/score badges; enable/disable, **limit to groups**, update all; ExApp daemon selection | `server/apps/appstore/src/{AppstoreApp.vue,views/{AppstoreDiscover,AppstoreBrowse,AppstoreBundles}.vue,components/{AppGrid,AppTable,AppActions.vue,LimitToGroupDialog.vue,UpdateAllDialog.vue,DaemonSelectionDialog}}` |
| Odoo | Apps | Module kanban/list (install, upgrade, uninstall with dependency preview), app store link, theme store | `odoo/odoo/addons/base/views/ir_module_views.xml` (`menu_apps`, `menu_module_tree`) |
| Dolibarr | Modules/applications | Module list by family with on/off switch and per-module setup link; module builder for new modules | `htdocs/admin/modules.php`, `htdocs/modulebuilder/` |
| AureusERP | Plugin manager | List plugins with install/uninstall | `plugins/webkul/plugin-manager/src/Filament/Resources/PluginResource/` |
| Twenty | Applications | Installed and available applications (extensions), application detail with connections, front components, command-menu items, timeline activity types; registration admin | `packages/twenty-front/src/pages/settings/applications/{SettingsApplications,SettingsApplicationDetails,SettingsAvailableApplicationDetails,SettingsApplicationConnectionDetail}.tsx` |
| Ever Gauzy | Feature toggles | Per-tenant/org feature flags page | `apps/gauzy/src/app/pages/settings/feature/` |
| Zimbra admin | Zimlets & admin extensions | Deploy zimlet wizard, enable per COS/domain; admin extension list | `WebRoot/js/zimbraAdmin/zimlets/view/{ZaZimletListView,ZaZimletDeployXWizard,ZaZimletXFormView}.js`, `adminext/view/ZaAdminExtListView.js` |
| Frappe desk | Installed apps & domains | Installed applications list; domain settings to show/hide modules; Desktop/workspace hiding | `frappe/core/doctype/{installed_applications,domain_settings}/` |

---

## 7. Customization (custom fields, data model, layouts)

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe desk | **Customize Form**, custom fields, client scripts | Per DocType: add/reorder/hide fields, labels, mandatory, permlevel, list/kanban options; Custom Field; Property Setter; Client Script; DocType Layout; document naming rules | `frappe/custom/doctype/{customize_form,custom_field,property_setter,client_script}/`, `frappe/core/doctype/{doctype_layout,document_naming_rule,document_naming_settings}/` |
| Twenty | **Data model** | Objects list (standard + custom), new object, object detail (fields table, indexes, search, translations, validation rules), field edit; **Layout** settings for page layouts and views | `packages/twenty-front/src/pages/settings/data-model/{SettingsObjects,SettingsNewObject,SettingsObjectDetailPage,SettingsObjectFieldEdit,SettingsObjectIndexes,SettingsObjectTranslations}.tsx`, `pages/settings/layout/{SettingsLayout,SettingsLayoutPageLayoutDetail,SettingsLayoutViewDetail}.tsx` |
| Carbon | Custom fields | Per table: list/new/edit/delete custom fields | `apps/erp/app/routes/x+/settings+/custom-fields*.tsx`, `apps/erp/app/modules/settings/ui/CustomFields/` |
| AureusERP | Custom fields | Field resource (model, type, label, options) | `plugins/webkul/fields/src/Filament/Resources/FieldResource/` |
| Dolibarr | Extra fields | Per-object complementary attributes setup | `htdocs/admin/extrafields.php`, `htdocs/core/tpl/admin_extrafields_*.tpl.php` |
| Odoo | Technical: models, views, menus | Database Structure (models, fields, relations), User Interface (menus, views), Actions, Sequences & Identifiers, Parameters (system parameters), Reporting (paper formats) | `odoo/odoo/addons/base/views/{ir_model_views,ir_ui_view_views,ir_ui_menu_views,ir_actions_views,ir_config_parameter_views,ir_default_views}.xml`; menu tree `base_menus.xml` (`menu_custom`) |
| Moqui baseline | Status flows, auto screens, enumerations | Status flow editor; Auto Screens over any entity; Entity DataEdit (find/edit any record) | `base-component/tools/screen/Tools/{StatusFlows,AutoScreen,Entity/DataEdit}.xml` |

---

## 8. Integrations (OAuth, webhooks, API keys, gateways)

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe desk | **Webhook** | Per DocType + event (insert, update, submit, cancel, trash, value change), condition, URL (static or dynamic), method, headers, form/JSON body, HMAC secret, timeout, retries, queue; request log | `frappe/integrations/doctype/{webhook,webhook_header,webhook_data,webhook_request_log}/` |
| Frappe desk | Connected apps & OAuth | **Connected App** (outbound OAuth/OIDC client to third parties, scopes, token cache); **OAuth Client** (Frappe as provider: client id/secret, redirect URIs, grant type, allowed roles, dynamic registration); Google/Slack/push settings; integration request log | `frappe/integrations/doctype/{connected_app,token_cache,oauth_client,oauth_scope,oauth_settings,google_settings,slack_webhook_url,push_notification_settings,integration_request}/` |
| Twenty | **Developers** | API keys (new, detail with expiry, role), **webhooks** (URL, operations, secret), API playground; **MCP** settings; logic functions; event logs | `packages/twenty-front/src/pages/settings/developers/{SettingsDevelopers.tsx,api-keys/,webhooks/,playground/}`, `packages/twenty-front/src/modules/settings/{mcp,event-logs,logic-functions}/` |
| Carbon | API keys, webhooks, integrations | API keys (new/detail/delete); **webhooks** (new, edit, rotate secret, delete); **integrations** marketplace cards with install modes, OAuth state, account and dimension mapping, posting sync settings and sync activity (QuickBooks, Xero, Sage, Rillet, Ramp, Slack, Jira, Linear, Onshape, Paperless Parts, Radan, Stripe Connect, OEE devices, MCP, …) | `apps/erp/app/routes/x+/settings+/{api-keys*,webhooks*,integrations*}.tsx`, `apps/erp/app/modules/settings/ui/{ApiKeys,Webhooks,Integrations/{IntegrationsList,IntegrationCard,IntegrationForm,AccountMapping,DimensionMapping,PostingSyncSettings,SyncActivity,InstallModeDialog}}`, `packages/ee/src/{integrations,quickbooks,xero,sage,slack,jira,linear,webhooks.server.ts,api-keys.server.ts}` |
| Ever Gauzy | Integrations | Integration catalog with filters; plugin UIs for Upwork, Hubstaff, GitHub, Jira, Zapier, Make, Activepieces, Plane, WakaTime, AI | `apps/gauzy/src/app/pages/integrations/`, `packages/plugins/integration-*-ui/` |
| Nextcloud | Workflow, webhooks, external integrations | **Flow** (workflow engine): rules = event + checks (file type, group membership, request time, user agent, …) + operation; **webhook listeners** registered by API; Dropbox/Google import apps; external sites; provisioning API | `server/apps/workflowengine/src/components/{Workflow,Rule,Event,Check,Operation}.vue`, `server/apps/webhook_listeners/lib/`, `integration_google/src/`, `integration_dropbox/src/`, `external/src/`, `server/apps/provisioning_api/` |
| Odoo | Integrations & IAP | Settings → Integrations (OAuth providers, LDAP, cloud storage Google/Azure, Google/Microsoft accounts for mail/calendar, reCAPTCHA, geolocation); **IAP** account credits; automation **webhooks** (see §10) | `odoo/addons/base_setup/views/res_config_settings_views.xml`, `odoo/addons/{iap,cloud_storage,cloud_storage_google,cloud_storage_azure,google_account,microsoft_account,google_gmail,microsoft_outlook,google_recaptcha}/` |
| Dolibarr | Webhooks, API, connectors | **Webhook** targets (URL, triggers) with trigger history; REST API module and per-user API token; Zapier, Stripe, PayPal, click-to-dial, DAV, external RSS/agenda sites | `htdocs/webhook/{target_list,target_card,triggerhistory_list,triggerhistory_card}.php`, `htdocs/admin/webhook.php`, `htdocs/api/`, `htdocs/user/api_token/`, `htdocs/admin/{dav,clicktodial,external_rss,agenda_extsites}.php`, `htdocs/{stripe,paypal,zapier}/` |
| Moqui baseline | System message remotes & gateways | **Message Remotes** (endpoint URL, auth, credentials, send/receive services, enum maps), Message Types (produce/consume services, paths); payment and shipping **gateway** configs per store/org | `base-component/tools/screen/System/SystemMessage/{Remote/{MessageRemoteList,MessageRemoteDetail},Type/{MessageTypeList,MessageTypeDetail}}.xml`, `component/MrSimpleScreens/screen/SimpleScreens/Gateway/{Payment/{FindPaymentGateway,EditPaymentGateway},Shipping/{FindShippingGateway,EditShippingGateway}}.xml` |

---

## 9. Mail servers, system messages & notifications

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe desk | **Email Account** & domain | Per account: incoming (IMAP/POP, folders, sync option, append-to DocType, auto-linking, notify if unreplied), outgoing (SMTP, TLS/SSL, default outgoing, track status, signature, footer, auto-reply); email domain; email queue, unhandled email, email rules, templates, unsubscribe | `frappe/email/doctype/{email_account,email_domain,imap_folder,email_queue,unhandled_email,email_rule,email_template,email_unsubscribe}/` |
| Frappe desk | **Notification** | Rule per DocType: event (new, save, submit, cancel, days before/after, value change, method), condition, channel (Email, Slack, System Notification, SMS), recipients (fields, roles, owner, assignees), template, attach print | `frappe/email/doctype/{notification,notification_recipient}/`, `frappe/core/doctype/sms_settings/` |
| Twenty | Accounts & communications | Connected email/calendar accounts (Google, Microsoft, **IMAP/SMTP/CalDAV** connection forms), channel configuration, email-group channels; workspace **communications**: unsubscribe topics and unsubscribers; emailing domains | `packages/twenty-front/src/pages/settings/accounts/{SettingsAccounts,SettingsAccountsEmails,SettingsAccountsCalendars,SettingsAccountsNewImapSmtpCaldavConnection,SettingsAccountsEditImapSmtpCaldavConnection}.tsx`, `pages/settings/communications/`, `modules/settings/{emailing-domains,unsubscribe-topics,unsubscribers}/` |
| Nextcloud | Email server & groupware | Admin **email server** form (SMTP mode, encryption, auth, test email); Groupware section (calendar/contact defaults, mail provider) | `server/apps/settings/src/{admin-settings-mail.ts,views/AdminSettingsMailServer.vue}`, `server/apps/settings/lib/Settings/Admin/{Mail,MailProvider}.php`, `server/apps/settings/lib/Sections/Admin/Groupware.php` |
| Zimbra admin | **MTA** & queues | MTA settings (relay, DNS lookups, protocol checks, DNSBL, milter); **mail queues** per server (deferred, incoming, active, hold, corrupt) with summary by sender/recipient/origin, and actions (requeue, hold, release, delete) | `WebRoot/js/zimbraAdmin/mta/view/{ZaMTAListView,ZaMTAXFormView,ZaQSummaryListView,ZaQMessagesListView,ZaMTAActionDialog}.js` |
| Odoo | Outgoing mail servers & mail | Technical → Email: outgoing mail servers (SMTP, auth, test), incoming mail servers (IMAP/POP fetch), templates, messages, aliases domain, ICE servers for calls | `odoo/odoo/addons/base/views/ir_mail_server_views.xml`, `odoo/addons/mail/views/{fetchmail_views,ir_mail_server_views,mail_ice_server_views}.xml` |
| Dolibarr | Emails setup & collectors | Sending method (PHP mail / SMTP / sendmail), per-purpose senders (emailing, ticket, password reset), sender profiles, templates; **email collectors** (IMAP poll with filters and actions creating tickets/leads/events) | `htdocs/admin/{mails,mails_emailing,mails_ticket,mails_passwordreset,mails_senderprofile_list,mails_templates,mails_ingoing,emailcollector_list,emailcollector_card,notification}.php` |
| Ever Gauzy | Custom SMTP & SMS | Tenant SMTP override with test; email history; SMS gateway selection | `apps/gauzy/src/app/pages/settings/{custom-smtp,email-history,sms-gateway}/` |
| Akaunting | Email | Mail protocol and SMTP settings; email templates per event | `resources/views/settings/{email,email-templates}/` |
| Moqui baseline | **System messages** & email | SystemMessage list/detail (status, type, remote, direction, text editable, consume/send/cancel/reset error, ack queue, new incoming message, download text); EmailServer / EmailTemplate entities (no admin screens in tools); NotificationTopic subscriptions per user; mr-moqui adds **SystemMessageHook** | `base-component/tools/screen/System/SystemMessage/{SystemMessage.xml,Message/{SystemMessageList,SystemMessageDetail,SystemMessageDetail/EditMessageText}}.xml`; entities `SystemMessage*`, `SystemMessageHook*` in `base-component/framework/entity/ServiceEntities.xml`, `EmailServer`, `EmailTemplate` in `BasicEntities.xml`, `NotificationTopic*` in `SecurityEntities.xml` |

---

## 10. Scheduled jobs & automation

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe desk | Scheduled jobs & workers | **Scheduled Job Type** (method, frequency or cron, queue, stopped, last/next execution), scheduled job log, **RQ Job** and **RQ Worker** views, background tasks, Scheduler event | `frappe/core/doctype/{scheduled_job_type,scheduled_job_log,rq_job,rq_worker,background_task,scheduler_event}/` |
| Frappe desk | **Automation flow**, assignment, auto repeat | Automation Flow (trigger: doc created/updated/field changed/deleted/submitted/date offset/cron; filters, condition; actions; run as triggering user / owner / automation user; run log with steps); **Assignment Rule** (round robin, load balancing, by field, weighted; days; close condition); **Auto Repeat**; **Server Script** (DocType event, scheduler, permission query, API, workflow task; rate limits) | `frappe/automation/doctype/{automation_flow,automation_action,automation_run,automation_run_step,assignment_rule,auto_repeat}/`, `frappe/core/doctype/server_script/` |
| Odoo | Scheduled actions & **automation rules** | `ir.cron` (model, method/code, interval, next call, active, triggers); **Automation rules** with triggers: stage/user/tag/state/priority set, archive/unarchive, create, update, delete, UI change, based on date field, after creation/last update, **on webhook** (incoming URL, log calls); actions = server actions | `odoo/odoo/addons/base/views/{ir_cron_views,ir_cron_trigger_views,ir_actions_views}.xml`, `odoo/addons/base_automation/{views/base_automation_views.xml,models/base_automation.py,static/src/}` |
| Nextcloud | Background jobs & Flow | Cron mode (basic settings); Flow rules (§8) | `server/apps/settings/src/components/BasicSettings/BackgroundJob.vue`, `server/apps/workflowengine/src/` |
| Dolibarr | **Scheduled jobs** | Cron job list (label, class/method or command, frequency, next run, last result, status, priority), card with run now, history | `htdocs/cron/{list,card,info}.php`, `htdocs/admin/` cron setup via `htdocs/cron/admin/` |
| Carbon | Approval rules | Approval rule list/edit (document type, amount thresholds, approver group) | `apps/erp/app/routes/x+/settings+/approval-rules*.tsx`, `apps/erp/app/modules/settings/ui/Approvals/` |
| Twenty | Workflows | Workflow builder (triggers, steps, runs, versions) as standard objects; logic functions | `packages/twenty-front/src/modules/workflow/`, `pages/settings/logic-functions/` |
| Moqui baseline | **Service jobs** | Job list/detail (service, cron, paused, parameters, users to notify, run now), **job runs** list/detail (start/end, results, errors, messages); ServiceJobMonitor adds bounds-based alerts and charts | `base-component/tools/screen/System/ServiceJob/{Jobs/{ServiceJobList,ServiceJobDetail},JobRuns/{JobRunList,JobRunDetail}}.xml`, `3p_moqui/ServiceJobMonitor/screen/MonitorAdmin/{Monitor/FindMonitor,Monitor/MonitorDetails,Alerts,Charts}.xml` |

---

## 11. Data import, export & backup

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | **Import** (base_import) | From any list: upload XLSX/CSV → column mapping with field suggestions (incl. related and sub-fields), options side panel (encoding, separator, date/number formats, batch size, skip first row), **Test** then **Import**, per-column errors, progress for large files, import templates per model | `odoo/addons/base_import/static/src/{import_action,import_data_content,import_data_options,import_data_sidepanel,import_data_column_error,import_data_progress,import_records}/`, `odoo/addons/base_import/models/` |
| Odoo | Export | List action Export: pick fields (tree), import-compatible mode, saved export lists, CSV/XLSX | `odoo/addons/web/static/src/views/view_dialogs/export_data_dialog.js` |
| Frappe desk | **Data Import** | Doc: DocType, import type (insert / update / insert or update), file or Google Sheets URL, template options, **value mapping**, warnings, preview grid, skipped rows, status (Pending/In Progress/Success/Partial Success/Error/Timed Out), import log, submit after import, mute emails | `frappe/core/doctype/{data_import,data_import_log,data_import_skipped_row,data_import_value_mapping}/` |
| Frappe desk | Export, backups, packages | Data Export; **Backups** page (download DB/files backups, schedule); package import/release; deleted documents restore | `frappe/core/doctype/data_export/`, `frappe/desk/page/backups/`, `frappe/core/doctype/{package,package_import,package_release,deleted_document}/` |
| Twenty | **Spreadsheet import** | Modal stepper: upload → select sheet → select header row → **match columns** to fields (auto-match suggestions, sub-fields, do-not-import) → validate (inline cell errors, edit) → import in batches with capacity limit; export CSV from views | `packages/twenty-front/src/modules/spreadsheet-import/steps/components/{UploadStep,SelectSheetStep,SelectHeaderStep,MatchColumnsStep,ValidationStep,ImportDataStep.tsx,SpreadsheetImportStepper.tsx}`, `modules/object-record/spreadsheet-import/` |
| Carbon | Import, backups, demo data | Shared `import/<table>` route (CSV mapping and row classification for items, stock, config lookups); **Backups** page; **Demo data** load/remove | `apps/erp/app/routes/x+/shared+/import.$tableId.tsx`, `apps/erp/app/modules/shared/imports.models.ts`, `apps/erp/app/routes/x+/settings+/{backups,demo-data}.tsx` |
| Dolibarr | Import & export wizards | **Import**: choose dataset → format (CSV/XLSX) → upload → map fields → simulate → import, with keys for update; **Export**: dataset → fields → filters → format → download, saved export profiles | `htdocs/imports/import.php` (`step=1..6`), `htdocs/exports/export.php`, `htdocs/admin/{import,export}.php` |
| Ever Gauzy | Import / export | Export all org data (selected entities) to zip; import from zip with history; external redirect | `apps/gauzy/src/app/pages/import-export/{import,export,external-redirect}/` |
| Akaunting | Import | Per-entity import from template (items, contacts, transactions, …) | `resources/views/common/import/create.blade.php`, `app/Imports/` |
| Zimbra admin | Migration & bulk provisioning | Tools & Migration: bulk provisioning (CSV of accounts), migration wizard | `WebRoot/js/zimbraAdmin/helpdesk/view/{ZaMWizView,ZaHelpView}.js` (`ZaMWizController`), `accounts/view/ZaNewAccountXWizard.js` |
| Moqui baseline | **Data Import / Export / Snapshots** | Import XML/JSON/CSV from text, file or location with check-only, dummy FKs, use-try-insert, disable EECA/audit/data feed, timeout; Export by entities or master entity with filters, date range, dependents, per-entity files, zip; **Data Snapshots** (export/import whole DB sets); Data Document export | `base-component/tools/screen/Tools/Entity/{DataImport,DataExport,DataSnapshot}.xml`, `base-component/tools/screen/System/DataDocument/Export.xml` |

---

## 12. Logs, audit & monitoring

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe desk | Logs | **Audit Trail** (compare versions of a document over a date range), Version, **Access Log** (exports and report views: user, file type, filters, columns), **Activity Log** (login/logout, ops), **Error Log** (seen flag, trace id, fingerprint), API Request Log, Permission Log, Submission queue; **Log Settings** (retention per log type) | `frappe/core/doctype/{audit_trail,version,access_log,activity_log,error_log,api_request_log,permission_log,log_settings,logs_to_clear}/` |
| Carbon | Audit logs | Audit log list and details (who, entity, action, diff) | `apps/erp/app/routes/x+/settings+/{audit-logs,audit-logs.details}.tsx`, `apps/erp/app/modules/settings/ui/AuditLog/`, `packages/ee/src/audit/` |
| Twenty | Event logs | Workspace event log (record events, user events) with filters | `packages/twenty-front/src/modules/settings/event-logs/` |
| Nextcloud | Audit & logging | `admin_audit` writes to a separate audit log (no UI); logging settings in Server section; Activity app for user-facing events | `server/apps/admin_audit/lib/`, `server/apps/settings/lib/Settings/Admin/Server.php`, `activity/src/` |
| Odoo | Technical logs | Logging (`ir.logging`), profiling sessions, privacy logs | `odoo/odoo/addons/base/views/{ir_logging_views,ir_profile_views}.xml`, `odoo/addons/privacy_lookup/views/` |
| Dolibarr | **Unalterable log** & events | Blocked log (hash-chained fiscal log, verify chain); security events log; syslog setup; debug bar | `htdocs/blockedlog/admin/`, `htdocs/admin/{events,syslog,debugbar}.php` |
| Ever Gauzy | Monitoring | Monitoring settings page | `apps/gauzy/src/app/pages/settings/monitoring/` |
| Moqui baseline | Audit, visits, hits, logs | **Audit Log** (entity field changes), **Visits** (visit list/detail with requests), **Artifact Hit Summary/Bins** (screen/service/entity usage and timing), **Active Users**, **Log Viewer**, **Thread List** | `base-component/tools/screen/System/{AuditLog,Visit/{VisitList,VisitDetail},ArtifactHitSummary,ArtifactHitBins,Security/ActiveUsers,LogViewer,ThreadList}.xml` |

---

## 13. Privacy & data policy

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Odoo | **Privacy lookup** | Find all records referencing a person (name/email) across models, archive or delete them, keep a privacy log | `odoo/addons/privacy_lookup/{wizard,views}/` |
| Dolibarr | **Data policy** | GDPR: retention delays per object type (contacts, members, third parties), anonymize/delete on schedule, consent emails | `htdocs/datapolicy/{admin,class}/` |
| Nextcloud | Privacy | Privacy app (where data lives, who has admin access, encryption status) | `privacy/src/` |
| Frappe desk | Personal data | Personal data download/deletion requests (website), deleted document store | `frappe/website/doctype/personal_data_*/`, `frappe/core/doctype/deleted_document/` |
| Twenty | Legal / DPA | DPA list and new DPA request | `packages/twenty-front/src/pages/settings/legal/{SettingsLegalDpa,SettingsLegalDpaNew}.tsx` |

---

## 14. Instances, servers & hosting

| App | Screen/page | What it is | Key files |
| --- | --- | --- | --- |
| Frappe Central | SaaS control plane | Home; onboarding (site name → site ready); **servers** (list, new, server page, snapshots); **team** (access, invitations, join); billing (overview, invoices); add-ons (object storage buckets, AI inference); GitHub connect; settings | `central/dashboard/src/pages/{home,onboarding,servers,team,billing,addons,github,settings}/` |
| Zimbra admin | Servers & volumes | Server list and form (services enabled, volumes, bind IPs, proxy ports, server pool), flush cache | `WebRoot/js/zimbraAdmin/servers/view/` |
| Twenty | Admin panel & domains | Instance health, workspaces; custom domain and subdomain pages; billing plans, usage and limits | `packages/twenty-front/src/pages/settings/{admin-panel,domains,billing}/` |
| Moqui baseline | Cache, instances, entity sync, printing | **Cache** list/elements (clear), **Instance** management (`AppInstance`, `InstanceHost`, images, env, volumes — Docker-style instances), **Entity Sync** (remote sync definitions, history), **Print** (network printers, print jobs), Resource Finder (elFinder over resource locations) | `base-component/tools/screen/System/{Cache/{CacheList,CacheElements},Instance/{InstanceList,InstanceDetail},EntitySync/{EntitySyncList,EntitySyncDetail,EntitySyncHistory},Print/{Printer,PrintJob},Resource/ElFinder}.xml`; entities in `base-component/framework/entity/ServerEntities.xml` |

---

## 15. Developer & power tools

| App | Tool | Key files |
| --- | --- | --- |
| Moqui baseline | SQL Runner, SQL Script Runner, Groovy Shell, Service Run / Reference / LoadRunner, Entity DataEdit, Table Stats, Query Stats, Speed Test, Artifact Stats, Entity Master API docs, Reload Framework | `base-component/tools/screen/Tools/{Entity/{SqlRunner,SqlScriptRunner,DataEdit,TableStats,QueryStats,SpeedTest},GroovyShell,Service/{ServiceRun,ServiceReference,ServiceLoadRunner,ServiceDetail},ArtifactStats}.xml` |
| Frappe desk | System Console, Recorder (request/SQL profiling with suggested indexes), Component explorer | `frappe/desk/doctype/system_console/`, `frappe/core/doctype/{recorder,recorder_query,recorder_suggested_index}/`, `frappe/core/page/component_explorer/` |
| Odoo | Developer mode technical menu, profiling, tests | `odoo/odoo/addons/base/views/{base_menus,ir_profile_views}.xml` |
| Twenty | API playground | `packages/twenty-front/src/pages/settings/developers/playground/` |
| Dolibarr | Module builder | `htdocs/modulebuilder/` |

---

## 16. Cross-app surfaces

- **Settings hub vs per-app settings.** Every reference keeps per-module settings close to
  the module (Odoo settings tabs, Carbon per-module settings routes, Dolibarr per-module
  setup links) while Admin holds the cross-cutting pages. BOSS: each IronStone app owns
  its own Settings section; Admin links to them from a settings index.
- **Users ⇄ People / Contacts.** Carbon splits employees, customer-portal users, supplier
  users and shop-floor operators; in BOSS the Party is in People/Commons and the user
  account is an Admin face on the same party (as SimpleScreens Party detail does today).
- **App launcher.** App enablement (Nextcloud limit-to-groups, Odoo install) maps to
  "apps map to user groups" in initial-design; Admin's group screen should show which
  IronStone apps a group can open.
- **Protocol layer.** Mail accounts, SMTP gateway trust (gateway IPs), CalDAV/CardDAV,
  WebDAV/SFTP, chat and WebRTC settings are framework capabilities with Admin screens
  (Zimbra MTA/queues and Nextcloud email server are the closest references).
- **Assist.** Admin screens for LLM skills, A2A agents and the write policy (Twenty AI
  permission flags such as send-email and HTTP-request tools are a good model) belong
  here once Assist writes become configurable.
- **Insights.** Logs, artifact hits and visits double as usage analytics; Insights reads
  them, Admin owns retention.

---

## 17. Current Moqui baseline

The tools component is a complete but developer-oriented admin: every entity is
reachable, but screens are raw forms, organized by framework subsystem rather than by
admin task, with no home dashboard of health or to-dos and no settings index.

### Screens (base-component/tools)

| Area | Screens | Key files |
| --- | --- | --- |
| Security | Users (list/detail with authc factors, login as, groups, permissions, preferences, topics), User Groups (detail, users), Artifact Groups (artifacts, authz, tarpits), Active Users | `base-component/tools/screen/System/Security/` |
| Messages | System Messages, Message Remotes, Message Types | `base-component/tools/screen/System/SystemMessage/` |
| Jobs | Service Jobs, Job Runs | `base-component/tools/screen/System/ServiceJob/` |
| Data | Data Import, Data Export, Data Snapshots, Data Documents (edit, search, export, index), Entity Data Sync, Data Edit, Auto Screens | `base-component/tools/screen/Tools/Entity/`, `base-component/tools/screen/System/{DataDocument,EntitySync}/`, `base-component/tools/screen/Tools/AutoScreen/` |
| Monitoring | System dashboard (server info), Audit Log, Visits, Artifact Hit Summary/Bins, Log Viewer, Thread List, Cache, Instances | `base-component/tools/screen/System/` |
| L10n & resources | Localized messages, entity field translations, resource finder, status flows, print | `base-component/tools/screen/System/{Localization,Resource,Print}/`, `base-component/tools/screen/Tools/StatusFlows.xml` |
| Developer | SQL runners, Groovy shell, service run/reference/load runner, stats | `base-component/tools/screen/Tools/` |

### Screens (MrSimpleScreens)

| Area | Screens | Key files |
| --- | --- | --- |
| User accounts on parties | Party detail: create/update/enable/disable user account, reset password, group membership, party settings | `component/MrSimpleScreens/screen/SimpleScreens/Party/EditParty.xml` |
| Internal organizations | Find/edit vendor (internal org), users, accounting configuration init and preferences | `component/MrSimpleScreens/screen/SimpleScreens/Vendor/` |
| Accounting org settings | Acctg preference, GL account defaults, type defaults, invoice/item/payment/asset types, financial account types/reasons, payment instruments | `component/MrSimpleScreens/screen/SimpleScreens/Accounting/OrgSettings/` |
| Gateways | Payment and shipping gateway configs | `component/MrSimpleScreens/screen/SimpleScreens/Gateway/` |
| Store settings | Product store settings | `component/MrSimpleScreens/screen/SimpleScreens/ProductStore/FindProductStoreSettings.xml` |
| Per-object user lists | Users on requests, projects, tasks, vendors | `component/MrSimpleScreens/screen/SimpleScreens/{Request,Project,Task,Vendor}/EditUsers.xml` |

### Data model available (framework entities)

| Entity group | What it gives Admin | Key files |
| --- | --- | --- |
| `moqui.security.*` | UserAccount, UserGroup (+Member, Permission, Preference, ScreenTheme), UserPermission, UserPreference, UserAuthcFactor, UserLoginKey, **UserSshKey**, UserLoginHistory, UserPasswordHistory, ArtifactGroup/Member/Authz/AuthzFailure/AuthzFilter, EntityFilterSet/EntityFilter, ArtifactTarpit, NotificationTopic/Message | `base-component/framework/entity/SecurityEntities.xml` |
| `moqui.security.sso.*` (mr-moqui) | **AuthFlow** with OAuth / OIDC / SAML flow detail, field and role maps — no admin screens yet | `base-component/framework/entity/SecurityEntities.xml` |
| `moqui.service.*` | ServiceJob (+Parameter, User, Run, RunLock), SystemMessage (+Type, Remote, EnumMap, Error), **SystemMessageHook** (+Status, mr-moqui) | `base-component/framework/entity/ServiceEntities.xml` |
| `moqui.server.*` | ArtifactHit/Bin, Visit/Visitor, HttpSession, ClusterMember, AppInstance/InstanceHost/InstanceImage, DatabaseHost | `base-component/framework/entity/ServerEntities.xml` |
| `moqui.basic.*` | Enumeration, StatusItem/Flow, Uom, Geo, LocalizedMessage, EmailServer, EmailTemplate, NetworkPrinter, PrintJob, DataSource | `base-component/framework/entity/BasicEntities.xml` |
| LLM / A2A (mr-moqui) | LlmConversation/Message/CallLog/Skill/SkillUse/Lesson; A2A Context/Task/Message/Artifact/PushConfig — no admin screens yet | `base-component/framework/entity/{LlmEntities,A2AEntities}.xml` |
| Mantle | Party, PartyRole (OrgInternal), PartySetting, PartyAcctgPreference, ProductStore, gateway configs | `component/mr-mantle-udm/entity/` |

---

## 18. Gaps & BOSS implications

### Notable gaps in the Moqui baseline

- **No admin home.** No health/setup-check page (Nextcloud setup checks, Frappe System
  Health Report, Zimbra home) and no "get started" list for a fresh install.
- **Permissions are artifact-centric.** Artifact groups × authz are powerful but there is
  no role-style editor (Odoo app roles, Twenty permission flags + object-level, Frappe
  permission manager), no "what can this user do" inspector, and no mapping from groups
  to IronStone apps.
- **No invite flow.** Users are created on parties; there is no invite-by-email,
  pending/revoke invite, or bulk create (Nextcloud, Twenty, Carbon, Zimbra bulk
  provisioning).
- **SSO/LDAP and mail accounts have entities but no UI.** AuthFlow, EmailServer,
  EmailTemplate and SystemMessageHook are edited only as data; there is no SMTP test,
  no mail-queue view, no gateway-IP trust config.
- **Import is entity-XML-shaped.** DataImport takes Moqui data files; there is no
  spreadsheet import with column mapping, test run and error rows (Odoo, Twenty, Frappe,
  Dolibarr), and no per-screen "Import" entry.
- **No settings index.** Organization, localization, numbering, branding, per-app
  settings are scattered (Vendor, OrgSettings, ProductStore, Localization); no single
  General Settings page or setup wizard.
- **No webhook/integration catalog.** SystemMessageRemote is the plumbing; there is no
  outbound webhook editor, API key management, or integration cards with sync status.
- **Logs lack retention and admin views.** Audit, visits and hits exist without retention
  settings, error log triage, or export/access logging (Frappe Access Log).

### What each reference contributes

| Reference | Take |
| --- | --- |
| Zimbra admin | Task-organized navigation (Monitor / Manage / Configure / Tools); home summary with counts, maintenance status and get-started tasks; COS as reusable feature bundles; domain-level auth/GAL wizards; MTA queue view with actions; server statistics pages |
| Nextcloud | Fast user table with group nav, quotas and manager; setup checks; admin **delegation** of settings sections to groups; app store with limit-to-groups; theming; presets; LDAP wizard; Flow rules |
| Odoo | Per-app role selects on the user form generated from groups; record rules; one General Settings page with app tabs; spreadsheet import with test run; automation rules incl. incoming webhook trigger; privacy lookup |
| Frappe desk | Role Permission Manager grid; role/module profiles; user permissions (row-level) and permission inspector; System Health Report; Data Import with value mapping and partial success; Webhook doctype; Connected App vs OAuth Client; Automation Flow with run-as; notification rules; log retention settings |
| Twenty | Roles with permission flags + object/field-level permissions; developer area (API keys, webhooks, playground); IMAP/SMTP/CalDAV connection forms; spreadsheet import stepper; admin panel with health and config variables; AI permission flags |
| Carbon | Settings hub with submodule list; separate employee/customer/supplier/operator users; bulk permission edit; integrations with mapping + sync activity; webhooks with secret rotation; demo data; backups; audit log details |
| Dolibarr | Module on/off with per-module setup; dictionaries; import/export wizards with simulate and saved profiles; email collectors; hash-chained unalterable log; data-policy retention |
| Ever Gauzy | Tenant SMTP/SMS/file-storage overrides; feature toggles; org import/export zip |
| Akaunting | Small-business settings set (company, localisation, defaults, invoice numbering, email templates, schedule) |
| Frappe Central | Control plane for multi-instance hosting: servers, snapshots, team access, billing |

### Recommended screen inventory (IronStone Admin)

| Area | Screens |
| --- | --- |
| Home | Admin home: health checks (scheduler, workers/queues, mail queue, failed messages, errors, DB size, backups, certificate expiry), counts (users, active sessions, failed logins), setup checklist for new installs, links to every area |
| Users | User list (filters active/disabled/invited/locked, group, last login), invite users (single and CSV), user detail (party link, groups, apps, authc factors, sessions/devices, API keys/SSH keys, login history, login as, disable/reset), bulk actions |
| Groups & permissions | Group list/detail (members, apps the group opens, permission bundle, delegated admin areas); role/permission editor over artifact groups shaped as app → capability toggles plus object-level actions; record-level rules (EntityFilterSet) editor; "explain access" inspector for a user × screen/record |
| Security & sign-in | Password and session policy, 2FA enforcement by group, SSO providers (AuthFlow: OAuth/OIDC/SAML with field and role maps), LDAP/AD directory sync, IP restrictions, tarpits/velocity limits |
| Organizations & settings | Settings index (general + per-app settings links), internal organizations (Vendor/OrgInternal: profile, logos, addresses, fiscal settings, accounting init), localisation (language, timezone, formats, currencies, UOMs), numbering/sequences, branding/theme, enumerations and status flows |
| Apps & features | IronStone app enablement by group, feature toggles, installed components |
| Integrations | Integration catalog (cards with status), message remotes, outbound webhooks (event, condition, URL, secret, retries, delivery log), API keys/OAuth clients, connected apps (outbound OAuth tokens), payment/shipping/tax gateways |
| Mail & messaging | Mail accounts (incoming IMAP/POP poller or SMTP listener per address, outgoing direct/relay), gateway trust (allowed gateway IPs, header trust), email templates, mail queue and failures, system message queue (errors, retry, cancel), notification topics and rules, chat/WebRTC server settings |
| Jobs & automation | Service jobs and runs, job health (failing, late), automation rules (event/condition/action) where not covered by service ECAs |
| Data | Spreadsheet import (map columns, test, import, error rows) per entity and from find screens, export (fields, filters, format, saved profiles), data snapshots, backups (schedule, download, restore), demo data |
| Logs & privacy | Audit log, access/export log, error log triage, visits and artifact hits, log retention settings, privacy lookup (find/anonymize a person's data) |
| Assist & agents | LLM providers/models, skills and lessons, A2A agents, Assist write policy (which actions/tools are allowed per group), call logs/usage |
| Developer | Existing tools screens kept behind a developer group (SQL runner, shell, service run, entity data edit, stats) |

### Data-model implications

- Most of Admin already has entities; the work is UI. New pieces: user **invitation**
  (token, email, groups, expiry, status), **webhook subscription** (entity/event,
  condition, URL, secret, retry policy, delivery log; could be a SystemMessageType +
  SystemMessageRemote pair or a `SystemMessageHook` use), **setting definitions** (key,
  scope system/org/user, type, default) to drive a generated settings index, and
  **import job** (file, target entity, column map, options, status, error rows).
- Group → IronStone app access: an ArtifactGroup per app root plus a group-level view of
  it, so "apps map to user groups" is visible and editable in one place.
- Log retention: per-log-type retention days and a ServiceJob to purge (Frappe Log
  Settings shape).
- Assist write policy: per group, the set of allowed tool/action kinds (Twenty AI
  permission flags) layered on artifact authz.

### First-release cut

Admin home with health checks and counts; user list/detail/invite with groups and app
access; group detail with permission toggles over artifact groups; security policy
(password, session, 2FA) and SSO providers over AuthFlow; settings index with
organization and localisation pages; mail accounts and system message queue; service jobs
and runs; spreadsheet import for core entities with test run; audit/visit/error views.
Keep the existing tools screens reachable for developers. Defer integration catalog
beyond webhooks, LDAP sync, privacy lookup, automation rules, instance management and the
Assist/LLM admin to a second pass.

### Open questions

- Is the permission editor built over artifact groups as-is, or does BOSS add a role
  concept (bundles of artifact authz + entity filters) like Odoo app roles or Twenty roles?
- Where does the user account live in the UI: Admin only, or also as a section on the
  People/Contacts party screen (today's SimpleScreens shape)?
- Multi-organization: one BOSS instance with several internal orgs (Carbon/Odoo
  companies) or one org per instance with Frappe-Central-style hosting of many instances?
- Which protocol settings (SMTP listener, CalDAV, WebDAV/SFTP, chat, WebRTC) are BOSS
  Admin screens versus mr-moqui framework config files?
- How much of tools (SQL runner, Groovy/Rust shell, data edit) should remain reachable in
  production, and behind which group?

import AuthLayout from "../layouts/auths/AuthLayout.vue";
import HomeLayout from "../layouts/HomeLayout.vue";
import SearchAccount from "../views/auths/forgot-password/SearchAccount.vue";
import LoginView from "../views/auths/LoginView.vue";
import ActivityPage from "../views/home/administration/ActivityPage.vue";
import RolePermissionPage from "../views/home/administration/RolePermissionPage.vue";
import UsersAddPage from "../views/home/administration/UsersAddPage.vue";
import UsersPage from "../views/home/administration/UsersPage.vue";
import UserUpdatePage from "../views/home/administration/UserUpdatePage.vue";
import DashboardView from "../views/home/DashboardView.vue";
import DocumentLibraryPage from "../views/home/document-library/DocumentLibraryPage.vue";
import FormationImport from "../views/home/Formation/FormationImport.vue";
import FormationNewPage from "../views/home/Formation/FormationNewPage.vue";
import FormationPage from "../views/home/Formation/FormationPage.vue";
import Participants from "../views/home/Formation/Participants.vue";
import Personnels from "../views/home/administration/Personnels.vue";
import ActionPage from "../views/home/Iinspections/ActionPage.vue";
import ChecklistDetailsPage from "../views/home/Iinspections/ChecklistDetailsPage.vue";
import ChecklistNewPage from "../views/home/Iinspections/ChecklistNewPage.vue";
import ChecklistPage from "../views/home/Iinspections/ChecklistPage.vue";
import EquipmentMonitoring from "../views/home/Iinspections/EquipmentMonitoring.vue";
import EquipmentMonitoringImportPage from "../views/home/Iinspections/EquipmentMonitoringImportPage.vue";
import EquipmentMonitoringNewPage from "../views/home/Iinspections/EquipmentMonitoringNewPage.vue";
import TemplatePage from "../views/home/Iinspections/TemplatePage.vue";
import ProfilePage from "../views/home/profile/ProfilePage.vue";
import ProfileUpdatePage from "../views/home/profile/ProfileUpdatePage.vue";
import SettingPage from "../views/home/settings/SettingPage.vue";
import FormationUpdate from "../views/home/Formation/FormationUpdate.vue";
import EquipmentMonitoringUpdatePage from "../views/home/Iinspections/EquipmentMonitoringUpdatePage.vue";
import PersonnelAddPage from "../views/home/administration/PersonnelAddPage.vue";
import PersonnelUpdatePage from "../views/home/administration/PersonnelUpdatePage.vue";
import VmcPage from "../views/home/Iinspections/VmcPage.vue";
import VMCAddPage from "../views/home/Iinspections/VMCAddPage.vue";
import VMCDetailsPage from "../views/home/Iinspections/VMCDetailsPage.vue";


const routes = [
    {
        path: "/",
        name: "AUTH",
        redirect: {
            name: "LOGIN"
        },
        component: AuthLayout,
        children: [
            {
                path: "login",
                name: "LOGIN",
                component: LoginView
            },
            {
                path: "forgot-password/search-account",
                name: "SEARCH_ACCOUNT",
                component: SearchAccount
            },
        ]

    }, {
        path: "/home",
        name: "HOME",
        redirect: {
            name: "DASHBOARD"
        },
        component: HomeLayout,
        children: [
            {
                path: "dashboard",
                name: "DASHBOARD",
                component: DashboardView
            },
            {
                path: 'administration',
                name: 'ADMINISTRATION',
                redirect: {
                    name: "USERS"
                },
                children: [
                    {
                        path: "/users",
                        name: "USERS",
                        component: UsersPage
                    },
                    {
                        path: "/users/access-control/:id",
                        name: "ROLE_PERMISSION",
                        component: RolePermissionPage
                    },
                    {
                        path: "/users/add",
                        name: "ADD_USER",
                        component: UsersAddPage
                    },
                    {
                        path: "/users/update/:id",
                        name: "UPDATE_USER",
                        component: UserUpdatePage
                    },
                    {
                        path: "personnels",
                        name: "PERSONNEL",
                        component: Personnels
                    },
                    {
                        path: "personnels/add",
                        name: "PERSONNEL_ADD",
                        component: PersonnelAddPage
                    },
                    {
                        path: "personnels/update/:id",
                        name: "PERSONNEL_UPDATE",
                        component: PersonnelUpdatePage
                    },
                    {
                        path: "/activity",
                        name: "ACTIVITY",
                        component: ActivityPage
                    },
                ]
            },
            {
                path: "document-library",
                name: "DOCUMENT_LIBRARY",
                component: DocumentLibraryPage
            },
            {
                path: "formation",
                name: "FORMATION",
                component: FormationPage
            },
            {
                path: "formation/participants/:id",
                name: "FORMATION_PARTICIPANT",
                component: Participants
            },
            {
                path: "formation/update/:id",
                name: "FORMATION_UPDATE",
                component: FormationUpdate
            },
            {
                path: "formation/new",
                name: "FORMATION_NEW",
                component: FormationNewPage
            },
            {
                path: "formation/import",
                name: "FORMATION_IMPORT",
                component: FormationImport
            },

            {
                path: 'inspection',
                name: 'INSPECTION',
                redirect: {
                    name: "CHECKLIST"
                },
                children: [
                    {
                        path: "/template",
                        name: "TEMPLATE",
                        component: TemplatePage
                    },
                    {
                        path: "/checklist",
                        name: "CHECKLIST",
                        component: ChecklistPage
                    },
                    {
                        path: "/checklist/new",
                        name: "CHECKLIST_NEW",
                        component: ChecklistNewPage
                    },
                    {
                        path: "/checklist/details/:id",
                        name: "CHECKLIST_DETAILS",
                        component: ChecklistDetailsPage
                    },
                    {
                        path: "/vmc",
                        name: "VMC",
                        component: VmcPage
                    },
                    {
                        path: "/vmc/add",
                        name: "VMC_NEW",
                        component: VMCAddPage
                    },
                    {
                        path: "/vmc/details/:id",
                        name: "VMC_DETAILS",
                        component: VMCDetailsPage
                    },
                    {
                        path: "/action",
                        name: "ACTION",
                        component: ActionPage
                    },
                    {
                        path: "/equipment-monitoring",
                        name: "EQUIPMENT_MONITORING",
                        component: EquipmentMonitoring
                    },
                    {
                        path: "/equipment-monitoring/new",
                        name: "EQUIPMENT_MONITORING_NEW",
                        component: EquipmentMonitoringNewPage
                    },
                    {
                        path: "/equipment-monitoring/update/:id",
                        name: "EQUIPMENT_MONITORING_UPDATE",
                        component: EquipmentMonitoringUpdatePage
                    },
                    {
                        path: "/equipment-monitoring/import",
                        name: "EQUIPMENT_MONITORING_IMPORT",
                        component: EquipmentMonitoringImportPage
                    },
                ]
            },

            {
                path: "profile/:id?",
                name: "PROFILE",
                component: ProfilePage
            },
            {
                path: "profile/update",
                name: "UPDATE_PROFILE",
                component: ProfileUpdatePage
            },
            {
                path: "setting",
                name: "SETTING",
                component: SettingPage
            },
        ]
    }
]

export {
    routes
}
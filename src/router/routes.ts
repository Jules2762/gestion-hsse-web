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
                redirect:{
                    name:"USERS"
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
                redirect:{
                    name:"ACTION"
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
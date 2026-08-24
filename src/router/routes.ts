import AuthLayout from "../layouts/auths/AuthLayout.vue";
import HomeLayout from "../layouts/HomeLayout.vue";
import SearchAccount from "../views/auths/forgot-password/SearchAccount.vue";
import LoginView from "../views/auths/LoginView.vue";
import ActivityPage from "../views/home/administration/ActivityPage.vue";
import UsersAddPage from "../views/home/administration/UsersAddPage.vue";
import UsersPage from "../views/home/administration/UsersPage.vue";
import UserUpdatePage from "../views/home/administration/UserUpdatePage.vue";
import DashboardView from "../views/home/DashboardView.vue";
import ActionPage from "../views/home/Iinspections/ActionPage.vue";
import ChecklistPage from "../views/home/Iinspections/ChecklistPage.vue";
import EquipmentMonitoring from "../views/home/Iinspections/EquipmentMonitoring.vue";
import TemplatePage from "../views/home/Iinspections/TemplatePage.vue";
import ProfilePage from "../views/home/profile/ProfilePage.vue";
import ProfileUpdatePage from "../views/home/profile/ProfileUpdatePage.vue";
import SettingPage from "../views/home/SettingPage.vue";


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
                path: 'inspection',
                name: 'INSPECTION',
                redirect:{
                    name:"TEMPLATE"
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
                        path: "/action",
                        name: "ACTION",
                        component: ActionPage
                    },
                    {
                        path: "/equipment-monitoring",
                        name: "EQUIPMENT_MONITORING",
                        component: EquipmentMonitoring
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
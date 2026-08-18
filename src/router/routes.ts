import AuthLayout from "../layouts/auths/AuthLayout.vue";
import HomeLayout from "../layouts/HomeLayout.vue";
import SearchAccount from "../views/auths/forgot-password/SearchAccount.vue";
import LoginView from "../views/auths/LoginView.vue";
import DashboardView from "../views/home/DashboardView.vue";
import ActionPage from "../views/home/Iinspections/ActionPage.vue";
import ChecklistPage from "../views/home/Iinspections/ChecklistPage.vue";
import TemplatePage from "../views/home/Iinspections/TemplatePage.vue";
import ProfilePage from "../views/home/ProfilePage.vue";


const routes=[
    {
        path:"/",
        name:"AUTH",
        redirect:{
            name:"LOGIN"
        },
        component:AuthLayout,
        children:[
            {
                path:"login",
                name:"LOGIN",
                component:LoginView
            },
            {
                path:"forgot-password/search-account",
                name:"SEARCH_ACCOUNT",
                component:SearchAccount
            },
        ]

    },{
        path:"/home",
        name:"HOME",
        redirect:{
            name:"DASHBOARD"
        },
        component:HomeLayout,
        children:[
            {
                path:"dashboard",
                name:"DASHBOARD",
                component:DashboardView
            },
            {
                path:"template",
                name:"TEMPLATE",
                component:TemplatePage
            },
            {
                path:"checklist",
                name:"CHECKLIST",
                component:ChecklistPage
            },
            {
                path:"action",
                name:"ACTION",
                component:ActionPage
            },
            {
                path:"profile",
                name:"PROFILE",
                component:ProfilePage
            },
        ]
    }
]

export {
    routes
}
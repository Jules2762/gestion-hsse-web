import AuthLayout from "../layouts/auths/AuthLayout.vue";
import LoginView from "../views/auths/LoginView.vue";

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
            }
        ]

    }
]

export {
    routes
}
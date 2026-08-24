import { ClipboardCheck, HomeIcon, PackageIcon, Settings2Icon, User2Icon, Users2Icon } from "@lucide/vue"

const sidebar_routes=[
    {
        label:"Tableau de bord",
        icon:HomeIcon,
        isOpen:false,
       
        name:"DASHBOARD",
        children:[
           
        ]
    },
    {
        label:"Administration",
        icon:Users2Icon,
        isOpen:false,
        name:"ADMINISTRATION",
        children:[
            {
                label:"Utilisateurs",
                name:"USERS",
                
            },
            
            {
                label:"Activités",
                name:"ACTIVITY",
                
            },
        ]
    },
    {
        label:"Inspections",
        icon:ClipboardCheck,
        isOpen:false,
        name:"INSPECTION",
        
        children:[
            // {
            //     label:"Templates",
            //     name:"TEMPLATE",
                
            // },
            {
                label:"Actions correctives",
                name:"ACTION",
            },
            {
                label:"Checklists",
                name:"CHECKLIST",
                
            },
            
             {
                label:"Suivi matériel",
                name:"EQUIPMENT_MONITORING",
                
            },
        ]
    }
   ,
    {
        label:"Inventaire",
        icon:PackageIcon,
        isOpen:false,
        name:"DASHBOARDe",
        children:[
            {
                label:"Templates",
                name:"DASHBOARD",
                
            },
            {
                label:"Checklists",
                name:"DASHBOARD",
                
            },
            {
                label:"Actions",
                name:"DASHBOARD",
                
            },
           
        ]
    },
    {
        label:"Profil",
        name:"PROFILE",
        icon:User2Icon,
        isOpen:false,
        children:[],
        
    },
    {
        label:"Parametre",
        name:"SETTING",
        icon:Settings2Icon,
        isOpen:false,
        children:[],
        
    }
]
export  {
    sidebar_routes
}
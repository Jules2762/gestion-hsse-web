import { ClipboardCheck, FolderClosedIcon, GraduationCapIcon, HomeIcon, PackageIcon, Settings, Settings2Icon, User2Icon, Users2Icon } from "@lucide/vue"

const sidebar_routes = [
    {
        label: "dashboard",
        icon: HomeIcon,
        isOpen: false,

        name: "DASHBOARD",
        children: [

        ]
    },
    {
        label: "administration",
        icon: Users2Icon,
        isOpen: false,
        name: "ADMINISTRATION",
        children: [
            {
                label: "users",
                name: "USERS",

            },
            {
                label: "personnels",
                name: "PERSONNEL",

            },

            {
                label: "activity",
                name: "ACTIVITY",

            },
        ]
    },
    {
        label: "documents",
        name: "DOCUMENT_LIBRARY",
        icon: FolderClosedIcon,
        isOpen: false,
        children: [],
    },
    {
        label: "training",
        icon: GraduationCapIcon,
        isOpen: false,
        name: "FORMATION",
        children: [
        ]
    },
    {
        label: "inspections",
        icon: ClipboardCheck,
        isOpen: false,
        name: "INSPECTION",

        children: [
            // {
            //     label:"Templates",
            //     name:"TEMPLATE",

            // },
            {
                label: "corrective actions",
                name: "ACTION",
            },
            {
                label: "checklists",
                name: "CHECKLIST",

            },

            {
                label: "equipment monitoring",
                name: "EQUIPMENT_MONITORING",

            },
            {
                label: "VMC",
                name: "VMC",

            },
        ]
    }
    ,
    {
        label: "inventory",
        icon: PackageIcon,
        isOpen: false,
        name: "DASHBOARDe",
        children: [
            {
                label: "Templates",
                name: "DASHBOARD1",

            },
            {
                label: "Checklists",
                name: "DASHBOARD1",

            },
            {
                label: "Actions",
                name: "DASHBOARD1",

            },

        ]
    },

    {
        label: "profile",
        name: "PROFILE",
        icon: User2Icon,
        isOpen: false,
        children: [],

    },
    {
        label: "settings",
        name: "SETTING",
        icon: Settings,
        isOpen: false,
        children: [],

    }
]
export {
    sidebar_routes
}
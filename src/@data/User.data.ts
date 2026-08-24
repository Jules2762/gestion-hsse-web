import type { UserDataType, UserRoleType, UserStatusJsonType, UserStatusType } from "../@types/User.type"

const UserRoleData=["USER","ADMIN"] as UserRoleType[]
const UserRoleDataJson=[
    {
        label:"Utilisateur",
        value:"USER"
    },
    {
        label:"Administrateur",
        value:"ADMIN"
    },
]
const UserStatusData=["ENABLED","DISABLED"] as UserStatusType[]
const UserStatusJsonData=[
    {
        label:"Actif",
        value:"ENABLED",
    },
    {
        label:"Désactivé",
        value:"DISABLED",
    },
] as UserStatusJsonType
const UserData=[
    {
        "id":1,
        "first_name":"ARIMANANA",
        "last_name":"Maherison Jules",
        "email":"arimananajules@gmail.com",
        "phone_number":"+261344310334",
        "status":"ENABLED",
        "role":"USER",
        "permissions":[],
        "department":"HSSE",
        "job":"Responsable HSSE"
    },
    {
        "id":1,
        "first_name":"ARIMANANA",
        "last_name":"Maherison Jules",
        "email":"arimananajules@gmail.com",
        "phone_number":"+261344310334",
        "status":"ENABLED",
        "role":"USER",
        "permissions":[],
        "department":"HSSE",
        "job":"Responsable HSSE"
    },
    {
        "id":1,
        "first_name":"ARIMANANA",
        "last_name":"Maherison Jules",
        "email":"arimananajules@gmail.com",
        "phone_number":"+261344310334",
        "status":"ENABLED",
        "role":"USER",
        "permissions":[],
        "department":"HSSE",
        "job":"Responsable HSSE"
    },
    {
        "id":1,
        "first_name":"ARIMANANA",
        "last_name":"Maherison Jules",
        "email":"arimananajules@gmail.com",
        "phone_number":"+261344310334",
        "status":"ENABLED",
        "role":"USER",
        "permissions":[],
        "department":"HSSE",
        "job":"Responsable HSSE"
    },
] as UserDataType[]
export {
    UserRoleData,
    UserStatusData,
    UserData,
    UserRoleDataJson,
    UserStatusJsonData
}
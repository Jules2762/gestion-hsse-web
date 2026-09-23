import type { UserDataType, UserExportType, UserRoleJsonType, UserRoleType, UserStatusJsonType, UserStatusType } from "../@types/User.type"

const UserRoleData = ["USER", "ADMIN"] as UserRoleType[]
const UserRoleMeta = [
    {
        label: 'Utilisateur',
        value: 'USER',
        description: "Accès standard. Les permissions sont attribuées individuellement ci- contre."
    },
    {
        label: 'Administrateur',
        value: 'ADMIN',
        description: ' Accès complet à la plateforme, y compris la gestion des utilisateurs et des permissions.'
    },
]
const UserRoleDataJson = [
    {
        label: "Utilisateur",
        value: "USER"
    },
    {
        label: "Administrateur",
        value: "ADMIN"
    },
]
const UserStatusData = ["ENABLED", "DISABLED"] as UserStatusType[]
const UserStatusJsonData = [
    {
        label: "Actif",
        value: "ENABLED",
    },
    {
        label: "Désactivé",
        value: "DISABLED",
    },
] as UserStatusJsonType
const UserData = [
    {
        "id": 1,
        "first_name": "ARIMANANA",
        "last_name": "Maherison Jules",
        "email": "arimananajules@gmail.com",
        "phone_number": "+261344310334",
        "status": "ENABLED",
        "role": "USER",
        "permissions": [],
        "department": "HSSE",
        "job": "Responsable HSSE"
    },
    {
        "id": 2,
        "first_name": "ARIMANANA",
        "last_name": "Maherison Jules",
        "email": "arimananajules@gmail.com",
        "phone_number": "+261344310334",
        "status": "ENABLED",
        "role": "USER",
        "permissions": [],
        "department": "HSSE",
        "job": "Responsable HSSE"
    },
    {
        "id": 3,
        "first_name": "ARIMANANA",
        "last_name": "Maherison Jules",
        "email": "arimananajules@gmail.com",
        "phone_number": "+261344310334",
        "status": "ENABLED",
        "role": "USER",
        "permissions": [],
        "department": "HSSE",
        "job": "Responsable HSSE"
    },
    {
        "id": 4,
        "first_name": "ARIMANANA",
        "last_name": "Maherison Jules",
        "email": "arimananajules@gmail.com",
        "phone_number": "+261344310334",
        "status": "ENABLED",
        "role": "USER",
        "permissions": [],
        "department": "HSSE",
        "job": "Responsable HSSE"
    },
] as UserDataType[]
const UserExportFields: Record<keyof UserExportType, string> = {
    "id": "ID",
    "first_name": "Nom",
    "last_name": "Prénom",
    "email": "E-mail",
    "phone_number": "Téléphone",
    "status": "Status",
    "role": "Rôle",
    "department": "Département",
    "job": "Fonction"
}
const UserRoleJsonData: UserRoleJsonType = [{
    label: 'Administrateur',
    value: 'ADMIN'
}, {
    label: 'Utilisateur',
    value: 'USER'
}]
export {
    UserRoleData,
    UserStatusData,
    UserData,
    UserRoleDataJson,
    UserStatusJsonData,
    UserExportFields,
    UserRoleMeta,
    UserRoleJsonData
}
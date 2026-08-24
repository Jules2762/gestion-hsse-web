type UserRoleType = "USER" | "ADMIN"
type UserStatusType = "ENABLED" | "DISABLED"

type permissionType = {
    id?: string | number,
    name: string,
}
type UserDataType = {
    id?: string | number,
    first_name: string,
    last_name?: string,
    email: string,
    phone_number?: string,
    image_path?: string,
    status: UserStatusType,
    password?: string,
    confirmation_password?: string
    role: UserRoleType,
    permissions?: permissionType[],
    department?: string,
    job?: string
}
type UserStatusJsonType =
    {
        label: string,
        value: UserStatusType
    }[]


export type {
    UserRoleType,
    UserStatusType,
    UserDataType,
    UserStatusJsonType
}
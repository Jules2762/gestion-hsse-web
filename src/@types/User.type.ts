type UserRoleType = "USER" | "ADMIN"
type UserStatusType = "ENABLED" | "DISABLED"
type PermissionNameType = "USER_CREATE" | "USER_READ" | "USER_UPDATE" | "USER_DELETE"
type permissionType = {
    id?: string | number,
    name: PermissionNameType,
    created_at: string,
    updated_at: string
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
    UserStatusJsonType,
    permissionType,
    PermissionNameType
}
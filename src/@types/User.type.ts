type UserRoleType = "USER" | "ADMIN"
type UserStatusType = "ENABLED" | "DISABLED"

type permissionType = {
    id?: string | number,
    name: string,
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
    permissions?: string[],
    department?: string,
    job?: string
}
type UserExportType = {
    id?: string | number,
    first_name: string,
    last_name?: string,
    email: string,
    phone_number?: string,
    status: UserStatusType,
    role: UserRoleType,
    department?: string,
    job?: string
}
type UserFormType = {
    first_name: string,
    last_name?: string,
    email: string,
    phone_number?: string,
    image_path?: string,
    status: UserStatusType,
    password?: string,
    confirmation_password?: string
    role: UserRoleType,
    // permissions?: string[],
    department?: string,
    job?: string
}
type UserProfileUpdateFormType={
    first_name: string,
    last_name?: string,
    phone_number?: string,
    bio?: string,
}
type UserStatusJsonType =
    {
        label: string,
        value: UserStatusType
    }[]
    type UserRoleJsonType={
        label:string,
        value:UserRoleType
    }[]
type UserFilterType={
    page?:number,
    per_page?:number,
    search?:string,
    department?:string[],
    fonction?:string[],
    role?:string[],
    status?:string[]
}

export type {
    UserRoleType,
    UserStatusType,
    UserDataType,
    UserStatusJsonType,
    permissionType,
    UserFilterType,
    UserFormType,
    UserExportType,
    UserRoleJsonType,
    UserProfileUpdateFormType
}
import type { Component } from "vue"

type contextMenuType={
    clientX?:number,
    clientY?:number
}
type ContextMenuVariantType="DANGER"|"WARNING"|"INFO"|"SUCCESS"
type ContextMenuActionType = {
    label?: string,
    icon?: Component,
    variant?:ContextMenuVariantType,
    onClick?: () => void
}
type ContextMenuPropsType = {
    contextMenu?: contextMenuType,
    modelValue?: boolean,
    actions?: ContextMenuActionType[],
    bottom_actions?:ContextMenuActionType[]
}

export type {
    contextMenuType,
    ContextMenuVariantType,
    ContextMenuActionType,
    ContextMenuPropsType
}
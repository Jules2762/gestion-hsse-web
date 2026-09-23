import type { EquipmentMonitoringFormType } from "../@types/EquipmentMonitoring.type"
import type { FormationFilterType, FormationFormType } from "../@types/Formation.type"
type ResponseType = {
    "required"?: string,
    "string"?: string,
    "integer"?: string,
    "date"?: string,
    "min"?: string,
    "max"?: string,
    "array"?: string,
    "boolean"?: string,
    "numeric"?: string,
    "enum"?: string,
}
type LangType = {
    "french": string,
    "english": string,

    //============================
    //login 
    //============================
    "login": {
        "title": string,
        "subtitle": string,
        "notification": {
            "success": string,
            "error": string
        },
        "email": {
            "label": string,
            "placeholder": string
        },
        "password": {
            "label": string,
            "placeholder": string
        },
        "remember_me": string,
        "forgot_password": string,
        "login": string,
        "or": string
    },


    //============================
    //sidebar
    //============================
    "sidebar": {
        "hsse management": string
        "dashboard": string,
        "administration": string,
        "users": string,
        "activity": string,
        "documents": string,
        "training": string,
        "inspections": string,
        "corrective actions": string,
        "checklists": string,
        "equipment monitoring": string,
        "inventory": string,
        "settings": string,
        "profile": string,
        "VMC": string,
        "help center": string,
        "logout": string,
    },
    "thumbnails": {
        "home": string,
        "document library": string,
        "training": string,
        "inspection":string,
        "equipment-monitoring":string,
        "new":string,
        "update":string,
        "import":string
    },

    //============================
    //logout 
    //============================
    "confirm logout": string,
    "logout message": string,
    "logout warning": string,



    //============================
    //Dashboard
    //============================
    "dashboard": {
        "title": string,
        "tabs": {
            "general": string,
            "training plan": string,
            "inspection": string,
        }
    },


    //============================
    //Document Library
    //============================
    "document library": {
        "title": string,
        "folders": string,
        "details": string,
        "original name": string,
        "name": string,
        "no file selected": string,
    },

    //============================
    //formation
    //============================
    "formation": {
        "title": string,
        "actions": {
            "add": string,
            "import": string,
            "export": string,
        },
        "filters": {
            "title": string,
            "date": string,
            "type": string,
            "section": string,
            "trainer": string,
            "target": string,
            "input": string
        },
        "headers": {
            "date": string,
            "type": string,
            "section": string,
            "trainer": string,
            "duration": string,
            "target": string
        },
        "results": string,
        "notification": {
            "export": {
                "success": string,
                "error": string
            },
            "list": {
                [key in Exclude<keyof FormationFilterType, "page" | "per_page">]: {
                    "array"?: string,
                    "string"?: string,
                    "from"?: { "date"?: string },
                    "to"?: { "date"?: string, "after_or_equal"?: string },
                }
            },
            "add": {
                "success": string,
                "error": string,
                "form_error": {
                    [key in keyof FormationFormType]: ResponseType
                }
            },
            "import": {
                "success": string,
                "form_error": formationImportNotificationType & {
                    "formations": {
                        "required": string,
                        "array": string,
                        "min": string,
                    },
                }



            },
            "delete": {
                "confirmation": {
                    "title": string,
                    "message": string,
                    "cancel_title":string,
                    "confirm_title":string
                },
                "success": string,
                "error": string,
                "not_found": string
            }
        }
    },
    //============================
    //inspections
    //============================
    "inspections":{
        "equipment-monitoring":{
            "add":{
                "title":string,
                "caption":string,
                "notifications":{
                    "success":string,
                    "errors":{
                        [key in keyof EquipmentMonitoringFormType]:ResponseType
                    }
                }
            }
        }
    }
    //============================
    //settings
    //============================
    "general": string,
    "preferences": string,
    "email": string,
    "security": string,

    //============================
    //errors
    //============================
    "errors": {
        "401": string,
        "403":{
            "forbidden":string,
            "disabled":string,
        },
        
        "404": string,
        "500": string,
        "ERR_NETWORK": string
    }


}
type formationImportNotificationType = {
    [key in keyof FormationFormType]: {
        "required"?: string,
        "string"?: string,
        "max"?: string,
        "min"?: string,
        "date"?: string,
        "enum"?: string,
        "numeric"?: string,
        "integer"?: string,
    }
}
type LangMessageType = {
    fr: LangType,
    en: LangType
}
export type {
    LangType,
    LangMessageType
}
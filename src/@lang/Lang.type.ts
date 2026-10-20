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
    // common
    //============================
    "common": {
        "add": string,
        "edit": string,
        "delete": string,
        "details": string,
        "save": string,
        "cancel": string,
        "close": string,
        "search": string,
        "filters": string,
        "export": string,
        "import": string,
        "actions": string,
        "status": string,
        "date": string,
        "site": string,
        "inspector": string,
        "conformity": string,
        "refresh": string,
        "back": string,
        "confirm": string,
        "loading": string,
        "no_data": string,
        "total": string,
        "yes": string,
        "no": string,
        "reset": string,
        "clear": string,
        "results": string,
    },

    //============================
    // login 
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
    // sidebar
    //============================
    "sidebar": {
        "hsse management": string
        "dashboard": string,
        "administration": string,
        "users": string,
        "personnels": string,
        "activity": string,
        "documents": string,
        "training": string,
        "inspections": string,
        "corrective actions": string,
        "checklists": string,
        "equipment monitoring": string,
        "emergency contacts": string,
        "inventory": string,
        "settings": string,
        "profile": string,
        "VMC": string,
        "help center": string,
        "logout": string,
    },

    "header"?: {
        "search": string,
        "profile": string,
        "breadcrumb": string,
        "notifications": {
            "title": string,
            "subtitle": string,
            "open": string,
            "markAllRead": string,
            "unread": string,
            "delete": string,
            "emptyTitle": string,
            "emptyText": string
        }
    },

    "thumbnails": {
        "home": string,
        "administration": string,
        "document library": string,
        "training": string,
        "personnels": string,
        "users": string,
        "activity": string,
        "roles": string,
        "inspection": string,
        "inspections": string,
        "equipment-monitoring": string,
        "checklists": string,
        "actions": string,
        "vmc": string,
        "templates": string,
        "emergency": string,
        "profile": string,
        "settings": string,
        "new": string,
        "update": string,
        "import": string,
        "details": string,
    },

    //============================
    // logout 
    //============================
    "confirm logout": string,
    "logout message": string,
    "logout warning": string,

    //============================
    // Dashboard
    //============================
    "dashboard": {
        "title": string,
        "tabs": {
            "general": string,
            "training plan": string,
            "inspection": string,
            "administration": string,
            "equipment": string,
            "checklist": string,
            "vmc": string,
        }
    },

    //============================
    // Document Library
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
    // formation
    //============================
    "formation": {
        "title": string,
        "new": string,
        "update": string,
        "import_title": string,
        "participants": string,
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
                    "cancel_title": string,
                    "confirm_title": string
                },
                "success": string,
                "error": string,
                "not_found": string
            }
        }
    },

    //============================
    // inspections
    //============================
    "inspections": {
        "actions": {
            "title": string,
            "subtitle": string,
            "new": string,
        },
        "checklists": {
            "title": string,
            "details": string,
            "new": string,
        },
        "equipment-monitoring": {
            "title": string,
            "details": string,
            "new": string,
            "update": string,
            "add": {
                "title": string,
                "caption": string,
                "notifications": {
                    "success": string,
                    "errors": {
                        [key in keyof EquipmentMonitoringFormType]: ResponseType
                    }
                }
            }
        },
        "vmc": {
            "title": string,
            "details": string,
            "new": string,
        },
        "templates": {
            "title": string,
        }
    },

    //============================
    // emergency
    //============================
    "emergency": {
        "title": string,
        "subtitle": string,
        "add": string,
        "search": string,
    },

    //============================
    // administration
    //============================
    "administration": {
        "users": {
            "title": string,
            "new": string,
            "update": string,
        },
        "personnels": {
            "title": string,
            "new": string,
            "update": string,
        },
        "activity": {
            "title": string,
        },
        "roles": {
            "title": string,
        }
    },

    //============================
    // profile
    //============================
    "profile": {
        "title": string,
        "update": string,
        "change_password": string,
    },

    //============================
    // settings
    //============================
    "settings": {
        "title": string,
        "subtitle": string,
        "tabs": {
            "general": string,
            "hsse": string,
            "display": string,
            "email": string,
            "security": string,
            "documents": string,
        }
    },

    // legacy settings tabs
    "general": string,
    "preferences": string,
    "email": string,
    "security": string,

    //============================
    // errors
    //============================
    "errors": {
        "401": string,
        "403": {
            "forbidden": string,
            "disabled": string,
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
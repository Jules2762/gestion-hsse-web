import type { LangType } from "./Lang.type";

export const en: LangType = {
    "french": "French",
    "english": "English",

    //============================
    // login
    //============================
    "login": {
        "title": "Login",
        "subtitle": "Connect to your account.",
        "notification": {
            "success": "Sign in to your account.",
            "error": "Failed to log in. Please check your credentials and try again."
        },
        email: {
            label: "Email",
            placeholder: "Enter your email"
        },
        password: {
            label: "Password",
            placeholder: "Enter your password"
        },
        remember_me: "Remember me",
        forgot_password: "Forgot password?",
        login: "Log in",
        or: "or"
    },

    //============================
    // sidebar
    //============================
    "sidebar": {
        "dashboard": "Dashboard",
        "administration": "Administration",
        "users": "Users",
        "activity": "Activity",
        "documents": "Documents",
        "training": "Training",
        "inspections": "Inspections",
        "corrective actions": "Corrective Actions",
        "checklists": "Checklists",
        "equipment monitoring": "Equipment Monitoring",
        "hsse management": "HSSE Management",
        "inventory": "Inventory",
        "settings": "Settings",
        "profile": "Profile",
        "VMC": "VMC",
        "help center": "Help Center",
        "logout": "Log out",
    },

    //============================
    //logout 
    //============================
    "confirm logout": "Confirm logout",
    "logout message": "You are about to log out of the GALANA HSSE platform.",
    "logout warning": "All changes that have already been saved will be kept. You will need to log in again to access your account.",

    //============================
    //Header
    //============================
    "thumbnails": {
        "home": "Home",
        "document library": "Document Library",
        "training": "Training"
    },

    //============================
    //Dashboard
    //============================
    "dashboard": {
        "title": "Dashboard",
        "tabs": {
            "general": 'General',
            "training plan": "Training Plan",
            "inspection": "Inspection",
        }
    },


    //============================
    //Document Library
    //============================
    "document library": {
        "title": "Document Library",
        "folders": "Folders",
        "details": "Details",
        "name": "Name",
        "original name": 'Original name',
        "no file selected": "No file selected"
    },

    //============================
    //formation
    //============================
    "formation": {
        title: "Training Register",
        actions: {
            add: "Add",
            import: "Import",
            export: "Export"
        },
        filters: {
            title: "Title",
            date: "Date",
            type: "Type",
            section: "Section",
            trainer: "Trainer",
            target: "Target",
            input: "Search for a training"
        }, headers: {
            date: "Date",
            type: "Type",
            section: "Section",
            trainer: "Trainer",
            duration: "Duration",
            target: "Target"
        },
        "results": "results",
        "notification": {
            "export": {
                "success": "The export was completed successfully.",
                "error": "An error occurred during the export."
            }, "list": {
                "type": {
                    "array": "The type must be an array.",
                    "string": "Each type must be a string."
                },
                "date": {
                    "array": "The date must be an array.",
                    "from": { "date": "The start date must be a valid date." },
                    "to": {
                        "date": "The end date must be a valid date.",
                        "after_or_equal": "The end date must be after or equal to the start date."
                    }
                },
                "section": {
                    "array": "The section must be an array.",
                    "string": "Each section must be a string."
                },
                "trainer": {
                    "array": "The trainer must be an array.",
                    "string": "Each trainer must be a string."
                },
                "target": {
                    "array": "The target must be an array.",
                    "string": "Each target must be a string."
                },
                "search": {
                    "string": "The search must be a string."
                }
            },
            "add": {
                "success": "Training added successfully.",
                "error": "An error occurred while adding the training. Please try again later.",
                "form_error": {
                    title: {
                        required: "The training title is required.",
                        string: "The training title must be a string.",
                        max: "The training title must not exceed 255 characters.",
                    },

                    date: {
                        required: "The training date is required.",
                        date: "The training date is invalid.",
                    },

                    type: {
                        required: "The training type is required.",
                        enum: "The selected training type is invalid.",
                    },

                    volet: {
                        required: "The section is required.",
                        enum: "The selected section is invalid.",
                    },

                    trainer: {
                        required: "The trainer is required.",
                        string: "The trainer must be a string.",
                        max: "The trainer's name must not exceed 255 characters.",
                    },

                    duration: {
                        required: "The training duration is required.",
                        min: "The duration must be greater than or equal to 0.",
                        numeric: "The duration must be a numeric value.",
                    },

                    target: {
                        required: "The training target is required.",
                        string: "The target must be a string.",
                        max: "The target must not exceed 255 characters.",
                    },

                    participant: {
                        min: "The number of participants cannot be negative.",
                        integer: "The number of participants must be an integer.",
                    },

                    target_type: {
                        required: "The target type is required.",
                        string: "The target type must be a string.",
                        max: "The target type must not exceed 255 characters.",
                    },
                }
            },
            "import": {
                "success": "Import completed successfully.",
                "form_error": {
                    "formations": {
                        "required": "Formations are required.",
                        "array": "Formations must be an array.",
                        "min": "At least one formation is required."
                    },
                    title: {
                        required: "The training title is required.",
                        string: "The training title must be a string.",
                        max: "The training title must not exceed 255 characters.",
                    },

                    date: {
                        required: "The training date is required.",
                        date: "The training date is invalid.",
                    },

                    type: {
                        required: "The training type is required.",
                        enum: "The selected training type is invalid.",
                    },

                    volet: {
                        required: "The section is required.",
                        enum: "The selected section is invalid.",
                    },

                    trainer: {
                        required: "The trainer is required.",
                        string: "The trainer must be a string.",
                        max: "The trainer's name must not exceed 255 characters.",
                    },

                    duration: {
                        required: "The training duration is required.",
                        min: "The duration must be greater than or equal to 0.",
                        numeric: "The duration must be a numeric value.",
                    },

                    target: {
                        required: "The training target is required.",
                        string: "The target must be a string.",
                        max: "The target must not exceed 255 characters.",
                    },

                    participant: {
                        min: "The number of participants cannot be negative.",
                        integer: "The number of participants must be an integer.",
                    },

                    target_type: {
                        required: "The target type is required.",
                        string: "The target type must be a string.",
                        max: "The target type must not exceed 255 characters.",
                    },
                }
            },
            "delete": {
                "confirmation": {
                    "title": "Delete training",
                    "message": "Are you sure you want to delete this training? This action cannot be undone.",
                    "cancel_title": "Cancel",
                    "confirm_title": "Delete"
                },
                "success": "The training was deleted successfully.",
                "error": "An error occurred while deleting the training.",
                "not_found": "The requested training could not be found.",
            }
        }
    },

    //============================
    //setting
    //============================
    "general": "General",
    "preferences": "Preferences",
    "email": "Email",
    "security": "Security",

    //============================
    //errors
    //============================
    "errors": {
        "401": "You must be authenticated to perform this action.",
        "403": "You are not authorized to perform this action.",
        "404": "The requested resource could not be found.",
        "500": "An internal server error occurred.",
        // en.ts
        "ERR_NETWORK": "Server unreachable. Check your connection and try again."
    }
}
import type { LangType } from "./Lang.type";

export const en: LangType = {
    "french": "French",
    "english": "English",

    //============================
    // common
    //============================
    "common": {
        "add": "Add",
        "edit": "Edit",
        "delete": "Delete",
        "details": "Details",
        "save": "Save",
        "cancel": "Cancel",
        "close": "Close",
        "search": "Search...",
        "filters": "Filters",
        "export": "Export",
        "import": "Import",
        "actions": "Actions",
        "status": "Status",
        "date": "Date",
        "site": "Site",
        "inspector": "Inspector",
        "conformity": "Conformity",
        "refresh": "Refresh",
        "back": "Back",
        "confirm": "Confirm",
        "loading": "Loading...",
        "no_data": "No data available",
        "total": "Total",
        "yes": "Yes",
        "no": "No",
        "reset": "Reset",
        "clear": "Clear",
        "results": "results",
        "loading_data": "Loading data...",
        "no_results": "No results found",
        "reset_filters": "Reset filters",
        "create": "Create",
        "overview": "Overview",
        "description": "Description",
        "no_description": "No description available.",
        "general_info": "General Information",
        "stakeholders": "Stakeholders",
        "assigned_to": "Assigned to",
        "not_assigned": "Not assigned",
        "view_details": "View details",
        "view_actions": "View actions",
        "sections": "Sections",
        "questions": "Questions",
        "time": "Time",
        "location": "Location",
        "comments": "Comments",
        "comment": "Comment",
        "contact": "Contact",
        "manager": "Manager",
        "accompanying": "Accompanying person",
        "delete_confirm": "Confirm deletion",
        "delete_confirm_msg": "Are you sure you want to delete this item? This action cannot be undone.",
        "displaying": "Showing",
        "of": "of",
        "previous": "Previous",
        "next": "Next",
    },

    //============================
    // table
    //============================
    "table": {
        "ref": "REF",
        "title": "TITLE",
        "site": "SITE",
        "location": "LOCATION",
        "status": "STATUS",
        "date": "DATE",
        "time": "TIME",
        "inspector": "INSPECTOR",
        "observer": "OBSERVER",
        "actions": "ACTIONS",
        "origin": "ORIGIN",
        "responsible": "RESPONSIBLE",
        "due_date": "DUE DATE",
        "priority": "PRIORITY",
        "type": "TYPE",
        "section": "SECTION",
        "trainer": "TRAINER",
        "duration": "DURATION",
        "target": "TARGET",
        "user": "USER",
        "email": "EMAIL",
        "phone": "PHONE",
        "role": "ROLE",
        "last_login": "LAST LOGIN",
        "matricule": "EMPLOYEE ID",
        "name": "NAME",
        "first_and_last_name": "NAME AND SURNAME",
        "function": "POSITION",
        "department": "DEPARTMENT",
        "direction": "DIVISION",
        "entity": "ENTITY",
        "filename": "FILE NAME",
        "size": "SIZE",
        "category": "CATEGORY",
        "modified_at": "MODIFIED AT",
        "conformity": "CONFORMITY",
        "source_inspection": "SOURCE INSPECTION",
        "gap_finding": "GAP / FINDING",
        "corrective_action": "CORRECTIVE ACTION",
    },

    //============================
    // status
    //============================
    "status": {
        "DRAFT": "Scheduled",
        "IN_PROGRESS": "In Progress",
        "COMPLETED": "Completed",
        "CANCELLED": "Cancelled",
        "PENDING": "Pending",
        "FINISHED": "Finished",
        "ENABLED": "Active",
        "DISABLED": "Disabled",
        "CONFORME": "Compliant",
        "NON_CONFORME": "Non-compliant",
        "ALL": "Total",
        "SENT": "Sent",
        "NOT_SENT": "Not sent",
    },


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
        "personnels": 'Personnel',
        "sites": "Sites & Stations",
        "activity": "Activity",
        "documents": "Documents",
        "training": "Training",
        "inspections": "Inspections",
        "corrective actions": "Corrective Actions",
        "checklists": "Checklists",
        "equipment monitoring": "Equipment Monitoring",
        "emergency contacts": "Emergency Contacts",
        "hsse management": "Galana HSSE",
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
    "header": {
        "search": "Search...",
        "profile": "User profile",
        "breadcrumb": "Breadcrumb",
        "notifications": {
            "title": "Notifications & Alerts",
            "subtitle": "Recent events and HSSE compliance alerts",
            "open": "Open notifications ({count} unread)",
            "markAllRead": "Mark all as read",
            "unread": "Unread",
            "delete": "Delete notification",
            "emptyTitle": "No notifications",
            "emptyText": "All your alerts and actions are up to date!"
        }
    },
    "thumbnails": {
        "home": "Home",
        "administration": "Administration",
        "document library": "Document Library",
        "training": "Training",
        "personnels": "Personnel",
        "users": "Users",
        "sites": "Sites & Stations",
        "activity": "Activity",
        "roles": "Roles & Permissions",
        "inspection": "Inspection",
        "inspections": "Inspections",
        "equipment-monitoring": "Equipment Monitoring",
        "checklists": "Checklists",
        "actions": "Corrective Actions",
        "vmc": "VMC",
        "templates": "Templates",
        "emergency": "Emergency Contacts",
        "profile": "Profile",
        "settings": "Settings",
        "new": "New",
        "update": "Update",
        "import": "Import",
        "details": "Details",
    },

    //============================
    //Dashboard
    //============================
    "dashboard": {
        "title": "Dashboard",
        "tabs": {
            "general": "General",
            "training plan": "Training Plan",
            "inspection": "Inspection",
            "administration": "Administration",
            "equipment": "Equipment Monitoring",
            "checklist": "Checklist",
            "vmc": "VMC",
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
        new: "New Training",
        update: "Update Training",
        import_title: "Import Trainings",
        participants: "Participants",
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
    //inspections
    //============================
    "inspections": {
        "actions": {
            "title": "Corrective Actions Management",
            "subtitle": "Tracking and resolution of deviations identified on site",
            "new": "New Corrective Action",
        },
        "checklists": {
            "title": "Control Checklists",
            "details": "Checklist Details",
            "new": "New Checklist Inspection",
        },
        "equipment-monitoring": {
            "title": "Equipment Monitoring",
            "details": "Equipment Monitoring Details",
            "new": "Plan Equipment Monitoring",
            "update": "Update Equipment Monitoring",
            "add": {
                "title": "Add equipment monitoring",
                "caption": "Enter the equipment monitoring information.",
                "notifications": {
                    "success": "The equipment monitoring was added successfully.",
                    "errors": {
                        "bac_de_retention": {
                            "min": "The retention basin value must be greater than or equal to 0.",
                            "integer": "The retention basin value must be an integer."
                        },
                        "bas_met": {
                            "min": "The BAS MET value must be greater than or equal to 0.",
                            "integer": "The BAS MET value must be an integer."
                        },
                        "bas_plast": {
                            "min": "The BAS PLAST value must be greater than or equal to 0.",
                            "integer": "The BAS PLAST value must be an integer."
                        },
                        "caf": {
                            "min": "The CAF value must be greater than or equal to 0.",
                            "integer": "The CAF value must be an integer."
                        },
                        "canne_d_enfutage": {
                            "min": "The canne d'enfutage value must be greater than or equal to 0.",
                            "integer": "The canne d'enfutage value must be an integer."
                        },
                        "chainettes": {
                            "min": "The chainettes value must be greater than or equal to 0.",
                            "integer": "The chainettes value must be an integer."
                        },
                        "co2": {
                            "min": "The CO₂ value must be greater than or equal to 0.",
                            "integer": "The CO₂ value must be an integer."
                        },
                        "contact_d_urgence": {
                            "min": "The emergency contact value must be greater than or equal to 0.",
                            "integer": "The emergency contact value must be an integer."
                        },
                        "date": {
                            "required": "The date is required.",
                            "date": "The date must be a valid date."
                        },
                        "detecteur_de_fumee": {
                            "min": "The smoke detector value must be greater than or equal to 0.",
                            "integer": "The smoke detector value must be an integer."
                        },
                        "livret_fiche_reflexe": {
                            "boolean": "The emergency response guide must be a boolean value."
                        },
                        "p50": {
                            "min": "The P50 value must be greater than or equal to 0.",
                            "integer": "The P50 value must be an integer."
                        },
                        "p6": {
                            "min": "The P6 value must be greater than or equal to 0.",
                            "integer": "The P6 value must be an integer."
                        },
                        "p9": {
                            "min": "The P9 value must be greater than or equal to 0.",
                            "integer": "The P9 value must be an integer."
                        },
                        "panneau_depotage_en_cours": {
                            "min": "The unloading-in-progress panel value must be greater than or equal to 0.",
                            "integer": "The unloading-in-progress panel value must be an integer."
                        },
                        "panneau_event": {
                            "boolean": "The vent panel must be a boolean value."
                        },
                        "pelles": {
                            "min": "The shovel value must be greater than or equal to 0.",
                            "integer": "The shovel value must be an integer."
                        },
                        "picto_caf": {
                            "min": "The CAF pictogram value must be greater than or equal to 0.",
                            "integer": "The CAF pictogram value must be an integer."
                        },
                        "picto_danger_tgbt": {
                            "boolean": "The TGBT danger pictogram must be a boolean value."
                        },
                        "picto_defense_de_fumer": {
                            "min": "The no-smoking pictogram value must be greater than or equal to 0.",
                            "integer": "The no-smoking pictogram value must be an integer."
                        },
                        "picto_ext": {
                            "min": "The EXT pictogram value must be greater than or equal to 0.",
                            "integer": "The EXT pictogram value must be an integer."
                        },
                        "plots": {
                            "min": "The plot value must be greater than or equal to 0.",
                            "integer": "The plot value must be an integer."
                        },
                        "point_de_rasso": {
                            "min": "The assembly point value must be greater than or equal to 0.",
                            "integer": "The assembly point value must be an integer."
                        },
                        "politique": {
                            "boolean": "The policy must be a boolean value."
                        },
                        "poubelles_120l": {
                            "min": "The 120 L bin value must be greater than or equal to 0.",
                            "integer": "The 120 L bin value must be an integer."
                        },
                        "poubelles_240l": {
                            "min": "The 240 L bin value must be greater than or equal to 0.",
                            "integer": "The 240 L bin value must be an integer."
                        },
                        "site_name": {
                            "required": "The site is required.",
                            "string": "The site name must be a string."
                        }
                    }
                }
            }
        },
        "vmc": {
            "title": "Visible Management Commitment (VMC)",
            "details": "Official VMC Form",
            "new": "New VMC",
        },
        "templates": {
            "title": "Inspection Templates",
        }
    },
    //============================
    //emergency
    //============================
    "emergency": {
        "title": "Emergency Contacts & Rescue",
        "subtitle": "Directory of emergency services and Galana stations",
        "add": "Add emergency contact",
        "search": "Search by name, city, type...",
    },
    //============================
    //administration
    //============================
    "administration": {
        "users": {
            "title": "User Management",
            "new": "New User Account",
            "update": "Update User Account",
        },
        "personnels": {
            "title": "Personnel Management",
            "new": "New Personnel Member",
            "update": "Update Personnel Member",
        },
        "sites": {
            "title": "Sites & Stations Management",
            "subtitle": "Mapping, GPS geolocation and official registry of Galana facilities",
            "new": "New Site",
            "update": "Edit Site",
            "delete": "Delete Site",
            "delete_confirm": "Are you sure you want to delete this site?",
            "delete_warning": "This action cannot be undone and will permanently remove the site.",
            "total": "Total Sites & Stations",
            "stations": "Service Stations (SS)",
            "others": "Stores, Agencies & HQ",
            "geolocated": "GPS Geolocated",
            "export": "Export",
            "refresh": "Refresh",
            "search_placeholder": "Search by site name, code, locality, province...",
            "table": {
                "code": "Site Code",
                "name": "Site Name",
                "type": "Type",
                "locality": "Locality",
                "province": "Province",
                "gps": "GPS Coordinates",
                "actions": "Actions",
                "no_gps": "No GPS",
                "empty_title": "No sites found",
                "empty_desc": "No site matches the current search or filter criteria.",
                "loading": "Loading sites and stations..."
            },
            "form": {
                "add_title": "Add New Site & Station",
                "edit_title": "Edit Site & Location",
                "desc": "Fill in the fields or point directly to the location on the interactive map.",
                "name": "Site Name",
                "code": "Site Code",
                "type": "Facility Type",
                "province": "Province / Region",
                "locality": "Commune / Neighborhood",
                "gps_title": "GPS Coordinates",
                "my_location": "My GPS Position",
                "latitude": "Latitude",
                "longitude": "Longitude",
                "dms": "DMS Format (Deg/Min/Sec)",
                "map_selection": "Map Selection",
                "map_hint": "Click to geolocate & pre-fill",
                "save": "Save Site",
                "update": "Update Site",
                "cancel": "Cancel",
                "auto_sync": "Auto"
            },
            "types": {
                "station_service": "Service Station",
                "magasin": "Store",
                "agence": "Agency",
                "siege": "Headquarters"
            },
            "sidebar": {
                "title": "Information Sheet",
                "preview_title": "Location Preview",
                "edit": "Edit",
                "delete": "Delete",
                "maps": "Google Maps",
                "open_preview": "Preview in sidebar",
                "not_specified": "Not specified"
            },
            "messages": {
                "created": "Site created successfully",
                "updated": "Site updated successfully",
                "deleted": "Site deleted successfully",
                "delete_error": "Error deleting site",
                "save_error": "Error saving site",
                "export_success": "Sites export successful",
                "export_error": "Error during export",
                "geo_not_supported": "Geolocation is not supported by your browser",
                "geo_error": "Could not retrieve your current location"
            }
        },
        "activity": {
            "title": "Activity Log",
        },
        "roles": {
            "title": "Roles & Permissions",
        }
    },
    //============================
    //profile
    //============================
    "profile": {
        "title": "User Profile",
        "update": "Update Profile",
        "change_password": "Change Password",
        "tabs": {
            "overview": "Contact & Organization",
            "roles": "Roles & Permissions",
            "security": "Security & HSSE Compliance"
        }
    },
    //============================
    //settings
    //============================
    "settings": {
        "title": "General Settings",
        "subtitle": "System configuration and organization preferences",
        "tabs": {
            "general": "General & Identity",
            "hsse": "Compliance & HSSE",
            "display": "Display & Font",
            "email": "Messaging & Email",
            "security": "Security & Audit",
            "documents": "Document Management",
        }
    },
    //============================
    //legacy settings tabs
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
        "403": {
            'forbidden': "You are not authorized to perform this action.",
            'disabled': 'Your account has been deactivated. Please contact an administrator.'
        },
        "404": "The requested resource could not be found.",
        "500": "An internal server error occurred.",
        // en.ts
        "ERR_NETWORK": "Server unreachable. Check your connection and try again."
    }
}
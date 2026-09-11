import type { LangType } from "./Lang.type";

export const fr: LangType = {
    "french": "Français",
    "english": "Anglais",
    //============================
    //login
    //============================
    "login": {
        "title": "Connexion",
        "subtitle": "Connectez-vous à votre compte.",
        "notification": {
            "success": "Bienvenue ! Vous êtes maintenant connecté.",
            "error": "Échec de la connexion. Veuillez vérifier vos identifiants et réessayer."
        },
        email: {
            label: "Adresse e-mail",
            placeholder: "Entrez votre adresse e-mail"
        },
        password: {
            label: "Mot de passe",
            placeholder: "Entrez votre mot de passe"
        },
        remember_me: "Se souvenir de moi",
        forgot_password: "Mot de passe oublié ?",
        login: "Se connecter",
        or: "ou"
    },

    //============================
    //sidebar
    //============================
    "sidebar": {
        "dashboard": "Tableau de bord",
        "administration": "Administration",
        "users": "Utilisateurs",
        "activity": "Activité",
        "documents": "Documents",
        "training": "Formation",
        "inspections": "Inspections",
        "corrective actions": "Actions Correctives",
        "checklists": "Checklists",
        "equipment monitoring": "Suivi des équipements",
        "hsse management": "Gestion HSSE",
        "inventory": "Inventaire",
        "settings": "Paramètres",
        "profile": "Profil",
        "VMC": "VMC",
        "help center": "Centre d'aide",
        "logout": "Se déconnecter",
    },

    //============================
    //logout 
    //============================
    "confirm logout": "Confirmer la déconnexion",
    "logout message": "Vous êtes sur le point de vous déconnecter de la plateforme GALANA HSSE.",
    "logout warning": "Toutes les modifications déjà enregistrées seront conservées. Vous devrez vous reconnecter pour accéder à nouveau à votre espace.",

    //============================
    //Header
    //============================
    "thumbnails": {
        "home": "Accueil",
        "document library": "Bibliothèque documentaire",
        "training": "Formation"
    },

    //============================
    //Dashboard
    //============================
    "dashboard": {
        "title": "Tableau de bord",
        "tabs": {
            "general": "Général",
            "training plan": "Plan de formation",
            "inspection": "Inspection",
        }
    },

    //============================
    //Document Library
    //============================
    "document library": {
        "title": "Bibliothèque documentaire",
        "folders": "Dossiers",
        "details": "Détails",
        "original name": 'Nom original',
        "name": "Nom",
        "no file selected": "Aucun document sélectionné"
    },

    //============================
    //formation
    //============================
    "formation": {
        title: "Registre de formation",
        actions: {
            add: "Ajouter",
            import: "Importer",
            export: "Exporter"
        },
        filters: {
            title: "Titre",
            date: "Date",
            type: "Type",
            section: "Volet",
            trainer: "Formateur",
            target: "Cible",
            input: "Rechercher une formation"
        },
        headers: {
            date: "Date",
            type: "Type",
            section: "Section",
            trainer: "Formateur",
            duration: "Durée",
            target: "Cible"
        },
        "results": "résultats",
        "notification": {
            "export": {
                "success": "L'exportation a été effectuée avec succès.",
                "error": "Une erreur est survenue lors de l'exportation."
            }, "list": {
                "type": {
                    "array": "Le type doit être un tableau.",
                    "string": "Chaque type doit être une chaîne de caractères."
                },
                "date": {
                    "array": "La date doit être un tableau.",
                    "from": { "date": "La date de début doit être une date valide." },
                    "to": { "date": "La date de fin doit être une date valide.", "after_or_equal": "La date de fin doit être postérieure ou égale à la date de début." },

                },
                "section": {
                    "array": "La section doit être un tableau.",
                    "string": "Chaque section doit être une chaîne de caractères."
                },
                "trainer": {
                    "array": "Le formateur doit être un tableau.",
                    "string": "Chaque formateur doit être une chaîne de caractères."
                },
                "target": {
                    "array": "La cible doit être un tableau.",
                    "string": "Chaque cible doit être une chaîne de caractères."
                },
                "search": {
                    "string": "La recherche doit être une chaîne de caractères."
                }
            },
            "add": {
                "success": "Formation ajoutée avec succès.",
                "error": "Une erreur est survenue lors de l'ajout de la formation. Veuillez réessayer.",
                "form_error": {
                    title: {
                        required: "Le titre de la formation est obligatoire.",
                        string: "Le titre de la formation doit être une chaîne de caractères.",
                        max: "Le titre de la formation ne peut pas dépasser 255 caractères.",

                    },

                    date: {
                        required: "La date de la formation est obligatoire.",
                        date: "La date de la formation est invalide.",
                    },

                    type: {
                        required: "Le type de formation est obligatoire.",
                        enum: "Le type de formation sélectionné est invalide.",
                    },

                    volet: {
                        required: "Le volet est obligatoire.",
                        enum: "Le volet sélectionné est invalide.",
                    },

                    trainer: {
                        required: "Le formateur est obligatoire.",
                        string: "Le formateur doit être une chaîne de caractères.",
                        max: "Le nom du formateur ne peut pas dépasser 255 caractères.",
                    },

                    duration: {
                        required: "La durée de la formation est obligatoire.",
                        min: "La durée doit être supérieure ou égale à 0.",
                        numeric: "La durée doit être une valeur numérique.",
                    },

                    target: {
                        required: "La cible de la formation est obligatoire.",
                        string: "La cible doit être une chaîne de caractères.",
                        max: "La cible ne peut pas dépasser 255 caractères.",

                    },

                    participant: {
                        min: "Le nombre de participants ne peut pas être négatif.",
                        integer: "Le nombre de participants doit être un nombre entier.",
                    },

                    target_type: {
                        required: "Le type de cible est obligatoire.",
                        string: "Le type de cible doit être une chaîne de caractères.",
                        max: "Le type de cible ne peut pas dépasser 255 caractères.",
                    },
                }
            }, "import": {
                "form_error": {
                    "formations": {
                        "required": "Le champ formations est obligatoire.",
                        "array": "Le champ formations doit être un tableau.",
                        "min": "Le tableau formations doit contenir au moins une formation."
                    },
                    title: {
                        required: "Le titre de la formation est obligatoire.",
                        string: "Le titre de la formation doit être une chaîne de caractères.",
                        max: "Le titre de la formation ne peut pas dépasser 255 caractères.",

                    },

                    date: {
                        required: "La date de la formation est obligatoire.",
                        date: "La date de la formation est invalide.",
                    },

                    type: {
                        required: "Le type de formation est obligatoire.",
                        enum: "Le type de formation sélectionné est invalide.",
                    },

                    volet: {
                        required: "Le volet est obligatoire.",
                        enum: "Le volet sélectionné est invalide.",
                    },

                    trainer: {
                        required: "Le formateur est obligatoire.",
                        string: "Le formateur doit être une chaîne de caractères.",
                        max: "Le nom du formateur ne peut pas dépasser 255 caractères.",
                    },

                    duration: {
                        required: "La durée de la formation est obligatoire.",
                        min: "La durée doit être supérieure ou égale à 0.",
                        numeric: "La durée doit être une valeur numérique.",
                    },

                    target: {
                        required: "La cible de la formation est obligatoire.",
                        string: "La cible doit être une chaîne de caractères.",
                        max: "La cible ne peut pas dépasser 255 caractères.",

                    },

                    participant: {
                        min: "Le nombre de participants ne peut pas être négatif.",
                        integer: "Le nombre de participants doit être un nombre entier.",
                    },

                    target_type: {
                        required: "Le type de cible est obligatoire.",
                        string: "Le type de cible doit être une chaîne de caractères.",
                        max: "Le type de cible ne peut pas dépasser 255 caractères.",
                    },
                },
                "success": "Importation réussie."
            },
            "delete": {
                "confirmation": {
                    "title": "Supprimer la formation",
                    "message": "Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.",
                    "cancel_title": "Annuler",
                    "confirm_title": "Supprimer"
                },
                "success": "La formation a été supprimée avec succès.",
                "error": "Une erreur est survenue lors de la suppression de la formation.",
                "not_found": "La formation demandée est introuvable.",
            }
        }
    },
    //============================
    //settings
    //============================
    "general": "Général",
    "preferences": "Préférences",
    "email": "E-mail",
    "security": "Securité",

    //============================
    //errors
    //============================
    "errors": {
        "401": "Vous devez être authentifié pour effectuer cette action.",
        "403": "Vous n'êtes pas autorisé à effectuer cette action.",
        "404": "La ressource demandée est introuvable.",
        "500": "Une erreur interne du serveur s'est produite.",
        // fr.ts
        "ERR_NETWORK": "Serveur inaccessible. Vérifiez votre connexion et réessayez."
    }
}
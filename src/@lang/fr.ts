import type { LangType } from "./Lang.type";

export const fr: LangType = {
    "french": "Français",
    "english": "Anglais",

    //============================
    // common
    //============================
    "common": {
        "add": "Ajouter",
        "edit": "Modifier",
        "delete": "Supprimer",
        "details": "Détails",
        "save": "Enregistrer",
        "cancel": "Annuler",
        "close": "Fermer",
        "search": "Rechercher...",
        "filters": "Filtres",
        "export": "Exporter",
        "import": "Importer",
        "actions": "Actions",
        "status": "Statut",
        "date": "Date",
        "site": "Site",
        "inspector": "Inspecteur",
        "conformity": "Conformité",
        "refresh": "Actualiser",
        "back": "Retour",
        "confirm": "Confirmer",
        "loading": "Chargement...",
        "no_data": "Aucune donnée disponible",
        "total": "Total",
        "yes": "Oui",
        "no": "Non",
        "reset": "Réinitialiser",
        "clear": "Effacer",
        "results": "résultats",
        "loading_data": "Chargement des données...",
        "no_results": "Aucun résultat trouvé",
        "reset_filters": "Réinitialiser les filtres",
        "create": "Créer",
        "overview": "Aperçu",
        "description": "Description",
        "no_description": "Aucune description disponible.",
        "general_info": "Informations générales",
        "stakeholders": "Intervenants",
        "assigned_to": "Assigné à",
        "not_assigned": "Non assigné",
        "view_details": "Consulter les détails",
        "view_actions": "Voir les actions",
        "sections": "Sections",
        "questions": "Questions",
        "time": "Heure",
        "location": "Lieu",
        "comments": "Commentaires",
        "comment": "Commentaire",
        "contact": "Contact",
        "manager": "Responsable",
        "accompanying": "Accompagnateur",
        "delete_confirm": "Confirmer la suppression",
        "delete_confirm_msg": "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
        "displaying": "Affichage de",
        "of": "sur",
        "previous": "Précédent",
        "next": "Suivant",
    },

    //============================
    // table
    //============================
    "table": {
        "ref": "RÉF",
        "title": "TITRE",
        "site": "SITE",
        "location": "LIEU",
        "status": "STATUT",
        "date": "DATE",
        "time": "HEURE",
        "inspector": "INSPECTEUR",
        "observer": "OBSERVATEUR",
        "actions": "ACTIONS",
        "origin": "ORIGINE",
        "responsible": "RESPONSABLE",
        "due_date": "ÉCHÉANCE",
        "priority": "PRIORITÉ",
        "type": "TYPE",
        "section": "VOLET",
        "trainer": "FORMATEUR",
        "duration": "DURÉE",
        "target": "CIBLE",
        "user": "UTILISATEUR",
        "email": "E-MAIL",
        "phone": "TÉLÉPHONE",
        "role": "RÔLE",
        "last_login": "DERNIÈRE CONNEXION",
        "matricule": "MATRICULE",
        "name": "NOM",
        "first_and_last_name": "NOM ET PRÉNOM",
        "function": "FONCTION",
        "department": "DÉPARTEMENT",
        "direction": "DIRECTION",
        "entity": "ENTITÉ",
        "filename": "NOM DU FICHIER",
        "size": "TAILLE",
        "category": "CATÉGORIE",
        "modified_at": "MODIFIÉ LE",
        "conformity": "CONFORMITÉ",
        "source_inspection": "INSPECTION SOURCE",
        "gap_finding": "ÉCART / CONSTAT",
        "corrective_action": "ACTION CORRECTIVE",
    },

    //============================
    // status
    //============================
    "status": {
        "DRAFT": "Planifiée",
        "IN_PROGRESS": "En cours",
        "COMPLETED": "Clôturée",
        "CANCELLED": "Annulée",
        "PENDING": "En attente",
        "FINISHED": "Terminée",
        "ENABLED": "Actif",
        "DISABLED": "Désactivé",
        "CONFORME": "Conforme",
        "NON_CONFORME": "Non conforme",
        "ALL": "Total",
        "SENT": "Envoyé",
        "NOT_SENT": "Non envoyé",
    },


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
        "personnels": 'Personnels',
        "sites": "Sites & Stations",
        "activity": "Activité",
        "documents": "Documents",
        "training": "Formation",
        "inspections": "Inspections",
        "corrective actions": "Actions Correctives",
        "checklists": "Checklists",
        "equipment monitoring": "Suivi des équipements",
        "emergency contacts": "Contacts d'urgence",
        "hsse management": "Galana HSSE",
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
    "header": {
        "search": "Rechercher...",
        "profile": "Profil utilisateur",
        "breadcrumb": "Fil d'Ariane",
        "notifications": {
            "title": "Notifications & Alertes",
            "subtitle": "Événements récents et alertes de conformité HSSE",
            "open": "Ouvrir les notifications ({count} non lues)",
            "markAllRead": "Tout marquer comme lu",
            "unread": "Non lue",
            "delete": "Supprimer la notification",
            "emptyTitle": "Aucune notification",
            "emptyText": "Toutes vos alertes et actions sont à jour !"
        }
    },
    "thumbnails": {
        "home": "Accueil",
        "administration": "Administration",
        "document library": "Bibliothèque documentaire",
        "training": "Formation",
        "personnels": "Personnel",
        "users": "Utilisateurs",
        "sites": "Sites & Stations",
        "activity": "Activité",
        "roles": "Rôles & Permissions",
        "inspection": "Inspection",
        "inspections": "Inspections",
        "equipment-monitoring": "Suivi du matériel",
        "checklists": "Checklists",
        "actions": "Actions Correctives",
        "vmc": "VMC",
        "templates": "Modèles",
        "emergency": "Contacts d'urgence",
        "profile": "Profil",
        "settings": "Paramètres",
        "new": "Nouveau",
        "update": "Modification",
        "import": "Import",
        "details": "Détails",
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
            "administration": "Administration",
            "equipment": "Suivi matériels",
            "checklist": "Checklist",
            "vmc": "VMC",
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
        title: "Registre des formations",
        new: "Nouvelle formation",
        update: "Modifier la formation",
        import_title: "Importer des formations",
        participants: "Participants",
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
    //inspections
    //============================
    "inspections": {
        "actions": {
            "title": "Gestion des actions correctives",
            "subtitle": "Suivi et résolution des écarts constatés sur site",
            "new": "Nouvelle action corrective",
        },
        "checklists": {
            "title": "Checklists de contrôle",
            "details": "Fiche checklist",
            "new": "Nouvelle inspection checklist",
        },
        "equipment-monitoring": {
            "title": "Suivi du matériel",
            "details": "Détails du suivi matériel",
            "new": "Planifier un suivi des équipements",
            "update": "Modifier le suivi des équipements",
            "add": {
                "title": "Ajouter un suivi des équipements",
                "caption": "Renseignez les informations du suivi des équipements.",
                "notifications": {
                    "success": "Le suivi des équipements a été ajouté avec succès.",
                    "errors": {
                        "bac_de_retention": {
                            "min": "La valeur du bac de rétention doit être supérieure ou égale à 0.",
                            "integer": "La valeur du bac de rétention doit être un nombre entier."
                        },
                        "bas_met": {
                            "min": "La valeur de BAS MET doit être supérieure ou égale à 0.",
                            "integer": "La valeur de BAS MET doit être un nombre entier."
                        },
                        "bas_plast": {
                            "min": "La valeur de BAS PLAST doit être supérieure ou égale à 0.",
                            "integer": "La valeur de BAS PLAST doit être un nombre entier."
                        },
                        "caf": {
                            "min": "La valeur de CAF doit être supérieure ou égale à 0.",
                            "integer": "La valeur de CAF doit être un nombre entier."
                        },
                        "canne_d_enfutage": {
                            "min": "La valeur de cannes d'enfûtage doit être supérieure ou égale à 0.",
                            "integer": "La valeur de cannes d'enfûtage doit être un nombre entier."
                        },
                        "chainettes": {
                            "min": "La valeur de chaînettes doit être supérieure ou égale à 0.",
                            "integer": "La valeur de chaînettes doit être un nombre entier."
                        },
                        "co2": {
                            "min": "La valeur de CO₂ doit être supérieure ou égale à 0.",
                            "integer": "La valeur de CO₂ doit être un nombre entier."
                        },
                        "contact_d_urgence": {
                            "min": "La valeur des contacts d'urgence doit être supérieure ou égale à 0.",
                            "integer": "La valeur des contacts d'urgence doit être un nombre entier."
                        },
                        "date": {
                            "required": "La date est obligatoire.",
                            "date": "La date doit être une date valide."
                        },
                        "detecteur_de_fumee": {
                            "min": "La valeur des détecteurs de fumée doit être supérieure ou égale à 0.",
                            "integer": "La valeur des détecteurs de fumée doit être un nombre entier."
                        },
                        "livret_fiche_reflexe": {
                            "boolean": "Le livret fiche réflexe doit être une valeur booléenne."
                        },
                        "p50": {
                            "min": "La valeur de P50 doit être supérieure ou égale à 0.",
                            "integer": "La valeur de P50 doit être un nombre entier."
                        },
                        "p6": {
                            "min": "La valeur de P6 doit être supérieure ou égale à 0.",
                            "integer": "La valeur de P6 doit être un nombre entier."
                        },
                        "p9": {
                            "min": "La valeur de P9 doit être supérieure ou égale à 0.",
                            "integer": "La valeur de P9 doit être un nombre entier."
                        },
                        "panneau_depotage_en_cours": {
                            "min": "La valeur des panneaux de dépotage en cours doit être supérieure ou égale à 0.",
                            "integer": "La valeur des panneaux de dépotage en cours doit être un nombre entier."
                        },
                        "panneau_event": {
                            "boolean": "Le panneau évent doit être une valeur booléenne."
                        },
                        "pelles": {
                            "min": "La valeur des pelles doit être supérieure ou égale à 0.",
                            "integer": "La valeur des pelles doit être un nombre entier."
                        },
                        "picto_caf": {
                            "min": "La valeur des pictogrammes CAF doit être supérieure ou égale à 0.",
                            "integer": "La valeur des pictogrammes CAF doit être un nombre entier."
                        },
                        "picto_danger_tgbt": {
                            "boolean": "Le pictogramme de danger TGBT doit être une valeur booléenne."
                        },
                        "picto_defense_de_fumer": {
                            "min": "La valeur des pictogrammes d'interdiction de fumer doit être supérieure ou égale à 0.",
                            "integer": "La valeur des pictogrammes d'interdiction de fumer doit être un nombre entier."
                        },
                        "picto_ext": {
                            "min": "La valeur des pictogrammes EXT doit être supérieure ou égale à 0.",
                            "integer": "La valeur des pictogrammes EXT doit être un nombre entier."
                        },
                        "plots": {
                            "min": "La valeur des plots doit être supérieure ou égale à 0.",
                            "integer": "La valeur des plots doit être un nombre entier."
                        },
                        "point_de_rasso": {
                            "min": "La valeur des points de rassemblement doit être supérieure ou égale à 0.",
                            "integer": "La valeur des points de rassemblement doit être un nombre entier."
                        },
                        "politique": {
                            "boolean": "La politique doit être une valeur booléenne."
                        },
                        "poubelles_120l": {
                            "min": "La valeur des poubelles de 120 L doit être supérieure ou égale à 0.",
                            "integer": "La valeur des poubelles de 120 L doit être un nombre entier."
                        },
                        "poubelles_240l": {
                            "min": "La valeur des poubelles de 240 L doit être supérieure ou égale à 0.",
                            "integer": "La valeur des poubelles de 240 L doit être un nombre entier."
                        },
                        "site_name": {
                            "required": "Le site est obligatoire.",
                            "string": "Le nom du site doit être une chaîne de caractères."
                        }
                    }
                }
            }
        },
        "vmc": {
            "title": "Visible Management Commitment (VMC)",
            "details": "Fiche VMC Officielle",
            "new": "Nouvelle VMC",
        },
        "templates": {
            "title": "Modèles d'inspection",
        }
    },
    //============================
    //emergency
    //============================
    "emergency": {
        "title": "Contacts d'urgence & Secours",
        "subtitle": "Répertoire des services d'urgence et postes Galana",
        "add": "Ajouter un contact d'urgence",
        "search": "Rechercher par nom, ville, type...",
    },
    //============================
    //administration
    //============================
    "administration": {
        "users": {
            "title": "Gestion des utilisateurs",
            "new": "Nouveau compte utilisateur",
            "update": "Mise à jour du compte utilisateur",
        },
        "personnels": {
            "title": "Gestion du personnel",
            "new": "Nouveau membre du personnel",
            "update": "Modifier un membre du personnel",
        },
        "sites": {
            "title": "Gestion des Sites & Stations",
            "subtitle": "Cartographie, géolocalisation et registre officiel des installations Galana",
            "new": "Nouveau site",
            "update": "Modifier le site",
            "delete": "Supprimer le site",
            "delete_confirm": "Êtes-vous sûr de vouloir supprimer ce site ?",
            "delete_warning": "Cette action est irréversible et supprimera le site de la plateforme.",
            "total": "Total Sites & Stations",
            "stations": "Stations-Service (SS)",
            "others": "Magasins, Agences & Siège",
            "geolocated": "Géolocalisés GPS",
            "export": "Exporter",
            "refresh": "Actualiser",
            "search_placeholder": "Rechercher un site, code, localité, province...",
            "table": {
                "code": "Code Site",
                "name": "Nom du Site",
                "type": "Type",
                "locality": "Localité",
                "province": "Province",
                "gps": "Coordonnées GPS",
                "actions": "Actions",
                "no_gps": "Non géolocalisé",
                "empty_title": "Aucun site répertorié",
                "empty_desc": "Aucun site ne correspond aux critères de recherche actuels.",
                "loading": "Chargement des sites et stations..."
            },
            "form": {
                "add_title": "Ajouter un Nouveau Site ou Station",
                "edit_title": "Modifier le Site & Localisation",
                "desc": "Renseignez les champs ou pointez directement l'emplacement sur la carte interactive.",
                "name": "Nom du Site",
                "code": "Code du Site",
                "type": "Type d'installation",
                "province": "Province / Région",
                "locality": "Commune / Quartier",
                "gps_title": "Coordonnées GPS",
                "my_location": "Ma position GPS",
                "latitude": "Latitude",
                "longitude": "Longitude",
                "dms": "Format DMS (Degrés/Minutes/Sec.)",
                "map_selection": "Sélection sur la carte",
                "map_hint": "Cliquez pour géolocaliser & pré-remplir",
                "save": "Enregistrer le site",
                "update": "Mettre à jour",
                "cancel": "Annuler",
                "auto_sync": "Auto"
            },
            "types": {
                "station_service": "Station-Service",
                "magasin": "Magasin",
                "agence": "Agence",
                "siege": "Siège"
            },
            "sidebar": {
                "title": "Fiche d'Information",
                "preview_title": "Aperçu de l'emplacement",
                "edit": "Modifier",
                "delete": "Supprimer",
                "maps": "Google Maps",
                "open_preview": "Aperçu dans le volet",
                "not_specified": "Non renseignées"
            },
            "messages": {
                "created": "Site créé avec succès",
                "updated": "Site mis à jour avec succès",
                "deleted": "Site supprimé avec succès",
                "delete_error": "Erreur lors de la suppression du site",
                "save_error": "Erreur lors de l'enregistrement du site",
                "export_success": "Export des sites réussi",
                "export_error": "Erreur lors de l'export",
                "geo_not_supported": "La géolocalisation n'est pas supportée par votre navigateur",
                "geo_error": "Impossible de récupérer votre position actuelle"
            }
        },
        "activity": {
            "title": "Journal d'activités",
        },
        "roles": {
            "title": "Rôles et permissions",
        }
    },
    //============================
    //profile
    //============================
    "profile": {
        "title": "Profil utilisateur",
        "update": "Mettre à jour le profil",
        "change_password": "Modifier le mot de passe",
        "tabs": {
            "overview": "Coordonnées & Organisation",
            "roles": "Rôles & Habilitations",
            "security": "Sécurité & Conformité HSSE"
        }
    },
    //============================
    //settings
    //============================
    "settings": {
        "title": "Paramètres généraux",
        "subtitle": "Configuration du système et préférences de l'organisation",
        "tabs": {
            "general": "Général & Identité",
            "hsse": "Conformité & HSSE",
            "display": "Affichage & Police",
            "email": "Messagerie & E-mail",
            "security": "Sécurité & Audit",
            "documents": "Gestion Documentaire",
        }
    },
    //============================
    //legacy settings tabs
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
        "403": {
            'forbidden': 'êtes pas autorisé à effectuer cette action.',
            "disabled": "Votre compte a été désactivé. Veuillez contacter un administrateur."
        },
        "404": "La ressource demandée est introuvable.",
        "500": "Une erreur interne du serveur s'est produite.",
        // fr.ts
        "ERR_NETWORK": "Serveur inaccessible. Vérifiez votre connexion et réessayez."
    }
}
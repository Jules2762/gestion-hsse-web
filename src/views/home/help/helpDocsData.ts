// Base de données bilingue (FR & EN) du Centre d'Aide Galana HSSE
export interface DocSection {
    heading: string;
    body: string;
    bullets?: string[];
    table?: {
        headers: string[];
        rows: string[][];
    };
}

export interface DocChapter {
    id: string;
    emoji: string;
    title: string;
    category: string;
    readingTime: string;
    badgeClass: string;
    summary: string;
    goldenRule?: string;
    routeLink?: { label: string; name: string };
    sections: DocSection[];
}

export interface HelpModule {
    id: string;
    emoji: string;
    title: string;
    tag: string;
    badgeClass: string;
    iconBg: string;
    routeName: string;
    description: string;
    keyPoints: string[];
}

export interface FaqItem {
    icon: string;
    question: string;
    answer: string;
    isOpen: boolean;
    link?: { label: string; name: string };
}

export const docChaptersFr: DocChapter[] = [
    {
        "id": "intro",
        "emoji": "🌟",
        "title": "Vue d’ensemble & Standards HSSE Galana",
        "category": "Gouvernance",
        "readingTime": "4 min",
        "badgeClass": "bg-slate-100 text-slate-800 border-slate-300",
        "summary": "Présentation générale de la politique HSSE, de l’engagement Zéro Accident et de l’architecture bimodale Web & Mobile.",
        "goldenRule": "La sécurité prime sur toute considération de rentabilité ou de rapidité. Tout employé dispose du droit de retrait face à un danger grave et imminent.",
        "routeLink": {
            "label": "Ouvrir le Tableau de Bord",
            "name": "DASHBOARD"
        },
        "sections": [
            {
                "heading": "1. Vision Zéro Accident & Cadre Réglementaire",
                "body": "La plateforme Galana HSSE (Hygiène, Sécurité, Sûreté, Environnement) structure l’ensemble des processus opérationnels de Galana Madagascar. Elle garantit la conformité stricte avec les normes ISO 45001, ISO 14001 et les référentiels de sécurité des dépôts pétroliers et stations-services.",
                "bullets": [
                    "Zéro accident corporel sur l’ensemble du réseau de distribution",
                    "Zéro déversement ou pollution d’hydrocarbures dans le sol ou l’eau",
                    "Transparence totale et déclaration sans délai de tout événement ou presqu’accident",
                    "Implication visible de la direction sur le terrain (Leadership HSSE)"
                ]
            },
            {
                "heading": "2. Écosystème Connecté Web & Mobile",
                "body": "L’architecture technique repose sur une synchronisation temps réel entre le portail Web de supervision et l’application Mobile de terrain.",
                "bullets": [
                    "Portail Web : Gestion des référentiels, planification des audits, attribution des inspecteurs, suivi des plans d’actions et reporting décisionnel.",
                    "Application Mobile : Saisie tactile des constats en station, fonctionnement autonome hors-ligne, géolocalisation et prise de photos probantes."
                ]
            },
            {
                "heading": "3. Démarche d’Amélioration Continue (PDCA)",
                "body": "Chaque audit s’inscrit dans la roue de Deming (Plan-Do-Check-Act) pour élever continuellement le niveau de sûreté opérationnelle.",
                "table": {
                    "headers": [
                        "Phase",
                        "Action Opérationnelle",
                        "Outil Galana"
                    ],
                    "rows": [
                        [
                            "Plan (Planifier)",
                            "Programmation des audits & visites managériales",
                            "Portail Web (Checklists & VMC)"
                        ],
                        [
                            "Do (Réaliser)",
                            "Contrôle sur site & relevé des constats",
                            "Application Mobile Terrain"
                        ],
                        [
                            "Check (Vérifier)",
                            "Scoring automatique & détection des anomalies",
                            "Moteur de conformité Web"
                        ],
                        [
                            "Act (Agir)",
                            "Traitement des plans d’actions & levée des réserves",
                            "Module Plan d’Actions"
                        ]
                    ]
                }
            }
        ]
    },
    {
        "id": "workflow",
        "emoji": "🔄",
        "title": "Le Grand Workflow d’Inspection (4 Étapes Web ↔ Mobile)",
        "category": "Opérations",
        "readingTime": "6 min",
        "badgeClass": "bg-amber-100 text-amber-900 border-amber-300",
        "summary": "Guide complet du cycle d’une inspection, de sa planification sur le portail Web jusqu’à son exécution et sa clôture sur l’application Mobile.",
        "goldenRule": "Toute inspection planifiée sur Web doit être assignée nominativement à un inspecteur pour apparaître instantanément sur son smartphone.",
        "routeLink": {
            "label": "Accéder aux Checklists",
            "name": "CHECKLIST"
        },
        "sections": [
            {
                "heading": "1. Étape 1 : Planification sur l’Application Web",
                "body": "Le responsable HSSE ouvre le portail Web et sélectionne « Nouvelle Inspection ». Il renseigne la station cible (ex: SS_ANKORONDRANO), la date prévue et le modèle de checklist adapté.",
                "bullets": [
                    "Choix du site parmi les 4 typologies officielles (SS_, MAG_, AG_, SIEGE_)",
                    "Attribution d’une référence unique générée par le système",
                    "Statut initial : « Planifié »"
                ]
            },
            {
                "heading": "2. Étape 2 : Attribution Nominative de l’Inspecteur",
                "body": "Dans le formulaire de planification, le responsable choisit l’inspecteur parmi le personnel ou les auditeurs habilités. Le système enregistre l’identifiant unique de l’inspecteur afin de lui affecter la mission sur son appareil mobile.",
                "bullets": [
                    "Possibilité d’attribuer un inspecteur interne Galana ou un auditeur externe agréé",
                    "La mission est immédiatement accessible sur le cloud Galana"
                ]
            },
            {
                "heading": "3. Étape 3 : Réception & Exécution sur Smartphone",
                "body": "Sur le terrain, l’inspecteur ouvre l’application mobile Galana HSSE. Il filtre ses missions grâce au sélecteur « 👤 Attribuées à moi ». Il clique sur l’inspection pour ouvrir la grille de contrôle.",
                "bullets": [
                    "Contrôle point par point : Conforme (C), Non Conforme (NC), Non Applicable (NA)",
                    "Saisie obligatoire d’une observation et capture photo en cas de Non-Conformité",
                    "Fonctionne même en zone blanche sans connexion grâce au cache local"
                ]
            },
            {
                "heading": "4. Étape 4 : Clôture & Synchronisation Instantanée",
                "body": "Une fois tous les points évalués, l’inspecteur signe numériquement et clique sur « Clôturer l’inspection ». Dès que la connexion est rétablie, les données remontent sur le portail Web :",
                "bullets": [
                    "Mise à jour immédiate du statut en « Terminé » sur le Web",
                    "Calcul instantané du score de conformité global en %",
                    "Génération automatique des actions correctives pour chaque point NC détecté"
                ]
            }
        ]
    },
    {
        "id": "checklists",
        "emoji": "📋",
        "title": "Checklists & Audits de Conformité",
        "category": "Conformité",
        "readingTime": "5 min",
        "badgeClass": "bg-blue-100 text-blue-900 border-blue-300",
        "summary": "Maîtrise des formulaires de contrôle réglementaire : templates sectoriels, critères d’évaluation et calcul automatisé du score de conformité.",
        "goldenRule": "Un audit n’est valide que s’il est réalisé sur site et contresigné numériquement par le responsable de la station. Il n’y a aucune fréquence standard imposée : la planification est libre selon les besoins opérationnels.",
        "routeLink": {
            "label": "Consulter les Checklists",
            "name": "CHECKLIST"
        },
        "sections": [
            {
                "heading": "1. Types de Checklists Officielles",
                "body": "Galana dispose de 6 modèles d’audits homologués préconfigurés dans le système. Les inspections ne sont soumises à aucune fréquence standard : elles sont planifiées librement et avec flexibilité selon les besoins opérationnels, les impératifs de sûreté et l’initiative du responsable HSSE.",
                "table": {
                    "headers": [
                        "Modèle d’Audit",
                        "Champ d’Application & Objectifs",
                        "Modalité de Déclenchement"
                    ],
                    "rows": [
                        [
                            "Checklist HSSE Sûreté",
                            "Sécurité physique, caméras, clôtures, gardiennage",
                            "Selon besoin / À l’initiative HSSE"
                        ],
                        [
                            "Inspection Camion Citerne",
                            "Intégrité cuves, flexibles, liaisons de masse dépotage",
                            "Selon besoin / Dépotage & contrôle ciblé"
                        ],
                        [
                            "Inspection des Véhicules",
                            "Flotte commerciale, pneumatiques, ceintures, extincteur",
                            "Selon besoin / Contrôle de flotte"
                        ],
                        [
                            "Évaluation Réseau Station-Service",
                            "Pistes, volucompteurs, fosses, affichage obligatoire",
                            "Selon besoin / Tournée de contrôle"
                        ],
                        [
                            "Évaluation Agences & Magasins",
                            "Boutiques Express, stocks, issues de secours",
                            "Selon besoin / Visite de site"
                        ],
                        [
                            "Évaluation Consommation & Environnement",
                            "Séparateurs d’hydrocarbures, rejets, déchets",
                            "Selon besoin / Suivi environnemental"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Formule de Calcul du Score de Conformité",
                "body": "Le score de conformité est calculé avec rigueur selon la formule mathématique suivante :",
                "bullets": [
                    "Score (%) = [Total Conformes / (Total Conformes + Total Non Conformes)] × 100",
                    "Les critères marqués Non Applicables (NA) sont rigoureusement exclus du dénominateur",
                    "Seuil d’excellence : Score ≥ 95% (Vert)",
                    "Seuil d’acceptabilité : 80% ≤ Score < 95% (Jaune)",
                    "Seuil critique : Score < 80% (Rouge - Alerte immédiate)"
                ]
            },
            {
                "heading": "3. Gestion des Écarts & Création d’Actions",
                "body": "Chaque constat Non Conforme peut être directement transformé en action corrective avec désignation d’un responsable et d’un délai de traitement."
            }
        ]
    },
    {
        "id": "vmc",
        "emoji": "👔",
        "title": "Visites Managériales de Conformité (VMC)",
        "category": "Leadership",
        "readingTime": "5 min",
        "badgeClass": "bg-indigo-100 text-indigo-900 border-indigo-300",
        "summary": "Déploiement des 6 types de visites managériales sur le terrain, grille d’évaluation comportementale et implication de la direction.",
        "goldenRule": "La sécurité prime sur toute considération de rentabilité. Les visites managériales sont menées sur le terrain avec bienveillance et dialogue constructif, sans fréquence rigide imposée.",
        "routeLink": {
            "label": "Gérer les VMC",
            "name": "VMC"
        },
        "sections": [
            {
                "heading": "1. Les 6 Typologies Officielles de VMC",
                "body": "Le système Galana HSSE intègre 6 formats standardisés de visites managériales, déclenchés avec souplesse selon les opportunités de terrain :",
                "table": {
                    "headers": [
                        "Code VMC",
                        "Désignation Complète",
                        "Objectif & Périmètre Opérationnel"
                    ],
                    "rows": [
                        [
                            "VMC_SIMPLE",
                            "VMC Simple de Routine",
                            "Visite visuelle générale et dialogue direct avec les équipes de terrain"
                        ],
                        [
                            "VMC_THEMATIQUE",
                            "VMC Thématique Ciblée",
                            "Focus approfondi sur un risque précis (ex: EPI, dépotage, incendie)"
                        ],
                        [
                            "VMC_IMPROMPTU",
                            "VMC Inopinée / Sans préavis",
                            "Contrôle spontané des réflexes de sûreté en conditions réelles"
                        ],
                        [
                            "AUDIT_REGLEMENTAIRE",
                            "Audit Réglementaire",
                            "Vérification approfondie de conformité légale et documentaire"
                        ],
                        [
                            "INSPECTION_ANNUELLE",
                            "Inspection Globale Approfondie",
                            "Revue exhaustive des installations, des cuves et des locaux"
                        ],
                        [
                            "CONFORMITE_SPECIALE",
                            "Conformité Spéciale",
                            "Investigation ponctuelle suite à incident, modification ou aménagement"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Cycle de Vie d’une VMC",
                "body": "Une VMC évolue à travers 4 statuts réglementaires :",
                "bullets": [
                    "PLANIFIE : Visite programmée avec date cible, site et inspecteur désigné",
                    "EN_COURS : Visite démarrée sur le terrain avec saisie des constats",
                    "TERMINE : Visite clôturée, rapport validé et score final figé",
                    "ANNULE : Visite déprogrammée pour motif justifié consigné dans l’historique"
                ]
            },
            {
                "heading": "3. Dialogue Constructif & Culture de Sécurité",
                "body": "La VMC n’est pas un outil de sanction, mais une opportunité d’échange bienveillant avec les équipes de terrain pour valoriser les bonnes pratiques et corriger les situations dangereuses."
            }
        ]
    },
    {
        "id": "equipment",
        "emoji": "🧯",
        "title": "Parc Matériel & Sécurité Incendie",
        "category": "Équipements",
        "readingTime": "5 min",
        "badgeClass": "bg-red-100 text-red-900 border-red-300",
        "summary": "Inventaire, inspection périodique et maintenance des extincteurs, RIA, bacs à sable et dispositifs d’arrêt d’urgence du réseau Galana.",
        "goldenRule": "Tout extincteur présentant une aiguille hors de la zone verte ou un plomb brisé doit être immédiatement consigné et remplacé sous 24h.",
        "routeLink": {
            "label": "Suivi du Matériel",
            "name": "EQUIPMENT_MONITORING"
        },
        "sections": [
            {
                "heading": "1. Typologie du Matériel Incendie",
                "body": "Le module répertorie l’ensemble des dispositifs de première intervention contre le feu :",
                "bullets": [
                    "Extincteurs Poudre Polyvalente ABC (6 kg, 9 kg, 50 kg sur roues pour pistes et dépotages)",
                    "Extincteurs Dioxyde de Carbone CO2 (2 kg, 5 kg pour tableaux électriques et serveurs)",
                    "Extincteurs à Eau Pulvérisée avec additif (Boutiques, bureaux et dépôts)",
                    "Robinets d’Incendie Armés (RIA) et colonnes sèches",
                    "Bacs à sable avec pelles et seaux d’incendie sur pistes",
                    "Couvertures anti-feu et douches d’urgence de sécurité"
                ]
            },
            {
                "heading": "2. Protocole de Contrôle Visuel des Équipements",
                "body": "Lors des contrôles sur site, l’inspecteur vérifie 5 points critiques sur chaque appareil :",
                "bullets": [
                    "Pression : L’aiguille du manomètre doit se situer au centre de la plage verte",
                    "Intégrité : La goupille de sécurité est scellée par son plomb officiel Galana",
                    "État général : Aucun choc, trace de rouille ou fissure sur le corps ou le flexible",
                    "Accessibilité : Dégagement total sur 1 mètre autour de l’appareil sans encombrement",
                    "Visibilité : Signalétique photoluminescente normalisée bien visible"
                ]
            },
            {
                "heading": "3. Suivi des Révisions & Épreuves Décennales",
                "body": "Le système calcule automatiquement les alertes de maintenance annuelle et de réépreuve décennale des bouteilles sous pression avec un code couleur vert / orange / rouge."
            }
        ]
    },
    {
        "id": "actions",
        "emoji": "🎯",
        "title": "Plan d’Actions Correctives",
        "category": "Amélioration",
        "readingTime": "4 min",
        "badgeClass": "bg-emerald-100 text-emerald-900 border-emerald-300",
        "summary": "Pilotage des plans de remédiation : hiérarchisation par niveau de gravité, affectation nominative, dates d’échéance et levée des réserves.",
        "goldenRule": "Une action de priorité Élevée en retard bloque la réévaluation favorable de la note HSSE du site concerné.",
        "routeLink": {
            "label": "Consulter les Actions",
            "name": "ACTIONS"
        },
        "sections": [
            {
                "heading": "1. Niveaux de Priorité & Délais de Traitement",
                "body": "Chaque anomalie constatée est catégorisée selon sa criticité opérationnelle :",
                "bullets": [
                    "Élevée / Critique : Danger direct pour les personnes ou l’environnement (délai : 48 heures)",
                    "Moyenne : Non-conformité matérielle sans danger immédiat (délai : 15 jours)",
                    "Faible : Axe d’amélioration préventive ou documentaire (délai : 30 jours)"
                ]
            },
            {
                "heading": "2. Cycle de Résolution d’une Action",
                "body": "Une action suit un parcours rigoureux :",
                "bullets": [
                    "À FAIRE : Action créée et notifiée au responsable désigné",
                    "EN COURS : Travaux ou démarches correctives engagées sur le site",
                    "RÉSOLU : Constat corrigé et justificatif (photo/bon de travail) soumis pour validation",
                    "CLÔTURÉ : Validation formelle par le responsable HSSE après vérification"
                ]
            },
            {
                "heading": "3. Notification & Relances Automatisées",
                "body": "Des alertes par email sont automatiquement envoyées aux responsables 7 jours, 3 jours et le jour même de l’échéance de l’action."
            }
        ]
    },
    {
        "id": "sites",
        "emoji": "📍",
        "title": "Réseau Sites & Stations (Les 4 Typologies : SS_, MAG_, AG_, SIEGE_)",
        "category": "Patrimoine",
        "readingTime": "5 min",
        "badgeClass": "bg-purple-100 text-purple-900 border-purple-200",
        "summary": "Architecture normalisée du réseau Galana : règle stricte de codification des 4 types de sites, coordonnées GPS et fiches d’identité.",
        "goldenRule": "Aucun site ne peut être créé sans son préfixe normalisé (SS_, MAG_, AG_, SIEGE_) ni ses coordonnées GPS validées sur la carte.",
        "routeLink": {
            "label": "Gérer les Sites & Stations",
            "name": "SITES"
        },
        "sections": [
            {
                "heading": "1. Règle Stricte des 4 Typologies & Préfixes Automatiques",
                "body": "La nomenclature du patrimoine Galana Madagascar répond à une norme stricte :",
                "table": {
                    "headers": [
                        "Type de Site",
                        "Préfixe Obligatoire",
                        "Exemple Officiel",
                        "Rôle Métier"
                    ],
                    "rows": [
                        [
                            "Station-Service",
                            "SS_",
                            "SS_ANKORONDRANO",
                            "Distribution de carburants, lubrifiants et services"
                        ],
                        [
                            "Magasin",
                            "MAG_",
                            "MAG_EXPRESS_ANALAKELY",
                            "Boutique Express, vente au détail et stockage produits"
                        ],
                        [
                            "Agence",
                            "AG_",
                            "AG_TAMATAVE",
                            "Agence commerciale régionale et logistique de zone"
                        ],
                        [
                            "Siège",
                            "SIEGE_",
                            "SIEGE_ALAMAHANINA",
                            "Direction générale et services administratifs centraux"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Génération Automatique des Codes Sites",
                "body": "Lors de la saisie d’un site sur le portail Web, le système adapte automatiquement le code en fonction du type sélectionné. Si vous saisissez « ANKORONDRANO » avec le type « Station-Service », le code devient automatiquement « SS_ANKORONDRANO »."
            },
            {
                "heading": "3. Géolocalisation & Rayon de Sécurité",
                "body": "Chaque fiche de site enregistre la latitude et la longitude exactes. Ces coordonnées sont indispensables au calcul automatique de proximité avec les secours d’urgence (pompiers, hôpitaux, forces de l’ordre)."
            }
        ]
    },
    {
        "id": "emergency",
        "emoji": "🚨",
        "title": "Contacts d’Urgence & Plan POI (Rayon 15 km)",
        "category": "Urgences",
        "readingTime": "5 min",
        "badgeClass": "bg-rose-100 text-rose-900 border-rose-200",
        "summary": "Organisation des secours d’urgence et Plan d’Opération Interne (POI) : géo-référencement des pompiers, hôpitaux et forces de l’ordre.",
        "goldenRule": "En cas d’accident sur une station, le responsable active en un clic le bouton d’appel direct du centre de secours situé dans le rayon de 15 km.",
        "routeLink": {
            "label": "Contacts d’Urgence",
            "name": "EMERGENCY_CONTACT"
        },
        "sections": [
            {
                "heading": "1. Le Plan d’Opération Interne (POI)",
                "body": "Le plan POI structure la réponse immédiate face aux urgences majeures : incendie, déversement accidentel, explosion ou agression. L’annuaire regroupe tous les services de secours de Madagascar."
            },
            {
                "heading": "2. Filtrage Intelligent par Rayon de Proximité (15 km)",
                "body": "Dans l’interface Contacts d’Urgence, en sélectionnant une station ou un site Galana dans le volet dédié :",
                "bullets": [
                    "L’algorithme calcule instantanément la distance à vol d’oiseau (haversine) en kilomètres",
                    "Les centres d’urgence situés à moins de 15 km sont affichés en tête de liste avec badge vert",
                    "Les services d’urgence d’autres districts sont disponibles par recherche manuelle"
                ]
            },
            {
                "heading": "3. Formulaire Épuré de Création & Bouton Appel 1-Clic",
                "body": "Le formulaire de contact a été optimisé pour aller à l’essentiel :",
                "bullets": [
                    "Champs conservés : Nom de l’organisme, Catégorie (Pompier, SAMU, Police, etc.), Numéro de téléphone direct et Coordonnées GPS",
                    "Champs supprimés (obsolètes) : Email, quartier/adresse postale, consignes textuelles superflues",
                    "Bouton d’appel direct intégré pour composer immédiatement le numéro depuis smartphone ou PC"
                ]
            }
        ]
    },
    {
        "id": "trainings",
        "emoji": "🎓",
        "title": "Plan de Formations & Habilitations",
        "category": "RH & Compétences",
        "readingTime": "4 min",
        "badgeClass": "bg-teal-100 text-teal-900 border-teal-300",
        "summary": "Gestion prévisionnelle des compétences HSSE : sessions de formation, habilitations spécifiques, recyclages obligatoires et émargement.",
        "goldenRule": "Aucun agent ne peut intervenir sur une opération de dépotage carburant ou travaux électriques sans habilitation valide.",
        "routeLink": {
            "label": "Plan de Formations",
            "name": "FORMATION"
        },
        "sections": [
            {
                "heading": "1. Modules de Formation Réglementaires",
                "body": "Le catalogue comprend les formations indispensables aux métiers pétroliers :",
                "bullets": [
                    "Manipulation des extincteurs et sécurité incendie (Recyclage périodique)",
                    "Sauveteur Secouriste du Travail (SST) et gestes de premiers secours",
                    "Dépotage sécurisé et procédures de prévention des débordements",
                    "Habilitations électriques de base (B0 / H0)"
                ]
            },
            {
                "heading": "2. Organisation des Sessions & Formateurs",
                "body": "Lors de la création d’une formation, le champ « Formateur » offre un système hybride performant :",
                "bullets": [
                    "Sélection rapide parmi les membres du personnel répertoriés dans la base d’entreprise",
                    "Possibilité de saisir librement le nom d’un formateur ou cabinet externe certifié"
                ]
            },
            {
                "heading": "3. Suivi des Validités & Alertes d’Expiration",
                "body": "Un tableau de bord centralisé signale les dates d’expiration des certificats pour anticiper les sessions de recyclage avant toute perte de validité."
            }
        ]
    },
    {
        "id": "personnels",
        "emoji": "👥",
        "title": "Gestion des Personnels & Fiches Salariés",
        "category": "Ressources Humaines",
        "readingTime": "4 min",
        "badgeClass": "bg-cyan-100 text-cyan-900 border-cyan-300",
        "summary": "Référentiel des employés et collaborateurs Galana : immatriculation, affectation aux sites, direction et historique d’activité.",
        "goldenRule": "Toute création d’un agent de terrain nécessite un nom, prénom, email professionnel et site de rattachement pour permettre son habilitation.",
        "routeLink": {
            "label": "Fiches Personnels",
            "name": "PERSONNELS"
        },
        "sections": [
            {
                "heading": "1. Structure de la Fiche Collaborateur",
                "body": "La fiche personnel centralise toutes les informations professionnelles du salarié :",
                "bullets": [
                    "Identité complète (Nom, Prénom, Matricule interne)",
                    "Direction de rattachement (Opérations, Logistique, HSSE, Commercial, Finance)",
                    "Fonction exacte et statut (Actif / Inactif)",
                    "Coordonnées professionnelles (Email institutionnel sécurisé, téléphone direct)"
                ]
            },
            {
                "heading": "2. Articulation avec les Visites VMC et Checklists",
                "body": "Lors de la saisie d’une VMC ou d’une checklist, le système utilise la base des personnels pour suggérer les inspecteurs et auditeurs qualifiés, garantissant une cohérence parfaite des données sans doublons."
            }
        ]
    },
    {
        "id": "rbac",
        "emoji": "🔐",
        "title": "Utilisateurs, Rôles & Sécurité RBAC",
        "category": "Sécurité Système",
        "readingTime": "5 min",
        "badgeClass": "bg-orange-100 text-orange-900 border-orange-300",
        "summary": "Matrice des droits d’accès basée sur les rôles (RBAC) : Super Administrateur, Responsable HSSE, Inspecteur Terrain, Chef de Station.",
        "goldenRule": "Le principe du moindre privilège est strictement appliqué. Les inspecteurs mobiles n’ont accès en écriture qu’à leurs propres missions attribuées.",
        "routeLink": {
            "label": "Rôles & Permissions",
            "name": "ROLE_PERMISSION"
        },
        "sections": [
            {
                "heading": "1. Rôles Définis dans la Plateforme Galana HSSE",
                "body": "Les accès sont gouvernés par une matrice de profils spécialisés :",
                "table": {
                    "headers": [
                        "Rôle",
                        "Profil Métier",
                        "Droits Principaux"
                    ],
                    "rows": [
                        [
                            "SUPER_ADMIN",
                            "Direction des Systèmes d’Information",
                            "Contrôle absolu, configuration, gestion des utilisateurs et rôles"
                        ],
                        [
                            "RESPONSABLE_HSSE",
                            "Direction & Ingénieurs HSSE",
                            "Création checklists/VMC, assignation, validation plans d’actions, exports"
                        ],
                        [
                            "INSPECTEUR_TERRAIN",
                            "Auditeurs & Cadres Mobiles",
                            "Exécution des audits sur smartphone, consultation missions assignées"
                        ],
                        [
                            "CHEF_STATION",
                            "Gérants de Stations & Dépôts",
                            "Consultation des audits de son site, déclaration d’anomalies locales"
                        ],
                        [
                            "AUDITEUR_EXTERNE",
                            "Cabinets d’audit accrédités",
                            "Saisie de rapports spécifiques avec périmètre restreint"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Sécurité des Sessions & Jetons Bearer",
                "body": "Toutes les communications entre le client Web, l’application Mobile et l’API Laravel sont chiffrées par HTTPS et authentifiées via jetons sécurisés Laravel Sanctum."
            }
        ]
    },
    {
        "id": "activity",
        "emoji": "📜",
        "title": "Journal d’Activités & Audit Trail",
        "category": "Auditabilité",
        "readingTime": "4 min",
        "badgeClass": "bg-zinc-100 text-zinc-900 border-zinc-300",
        "summary": "Traçabilité intégrale et inaltérable de chaque action réalisée sur la plateforme : horodatage certifié, utilisateur responsable et détails.",
        "goldenRule": "Le journal d’activités est infalsifiable et conservé sans limitation de durée pour répondre aux exigences des audits ISO et inspections d’État.",
        "routeLink": {
            "label": "Journal d’Activités",
            "name": "ACTIVITY"
        },
        "sections": [
            {
                "heading": "1. Portée de la Traçabilité",
                "body": "Chaque transaction applicative fait l’objet d’un enregistrement instantané dans le journal d’audit :",
                "bullets": [
                    "Création, modification et suppression de sites, checklists, VMC et extincteurs",
                    "Connexions des utilisateurs, tentatives infructueuses et déconnexions",
                    "Clôture des inspections sur mobile et validation des plans d’actions",
                    "Exports de bases de données et modifications de permissions de sécurité"
                ]
            },
            {
                "heading": "2. Données Enregistrées pour Chaque Événement",
                "body": "Chaque ligne d’activité consigne : la date et l’heure à la seconde près, l’identifiant et le nom de l’utilisateur, l’adresse IP source, le module concerné et le détail des modifications apportées."
            }
        ]
    },
    {
        "id": "documents",
        "emoji": "📚",
        "title": "Bibliothèque Documentaire & Exports Réglementaires",
        "category": "Connaissances",
        "readingTime": "4 min",
        "badgeClass": "bg-sky-100 text-sky-900 border-sky-300",
        "summary": "Gestion électronique des documents (GED HSSE) : fiches de sécurité FDS, procédures opérationnelles, rapports officiels et exports tabulaires.",
        "goldenRule": "Toute station doit avoir accès en permanence aux Fiches de Données de Sécurité (FDS) à jour des carburants distribués.",
        "routeLink": {
            "label": "Bibliothèque Documentaire",
            "name": "DOCUMENT_LIBRARY"
        },
        "sections": [
            {
                "heading": "1. Types de Documents Classifiés",
                "body": "La bibliothèque regroupe l’ensemble du corpus documentaire HSSE :",
                "bullets": [
                    "Fiches de Données de Sécurité (FDS) : Supercarburant sans plomb, Gasoil, Pétrole lampant, Lubrifiants",
                    "Procédures Opérationnelles Standard (SOP) : Dépotage camion-citerne, nettoyage cuve, gestion des fuites",
                    "Réglementations nationales malgaches et décrets pétroliers",
                    "Rapports d’audits consolidés et bilans officiels de sécurité"
                ]
            },
            {
                "heading": "2. Fonction d’Export des Données",
                "body": "Tous les modules (Checklists, VMC, Matériel, Formations, Personnels, Sites, Secours) intègrent un bouton « Exporter » permettant d’extraire instantanément la liste active au format tabulaire propre (Excel / CSV) pour exploitation externe."
            }
        ]
    },
    {
        "id": "mobile",
        "emoji": "📱",
        "title": "Guide de l’Application Mobile Galana HSSE",
        "category": "Mobilité",
        "readingTime": "6 min",
        "badgeClass": "bg-emerald-100 text-emerald-900 border-emerald-300",
        "summary": "Manuel pratique d’utilisation de l’application smartphone : connexion, consultation des missions assignées, audit hors-ligne et photos.",
        "goldenRule": "L’application mobile met automatiquement en cache les données d’inspection pour garantir un déroulement parfait sans réseau en station.",
        "sections": [
            {
                "heading": "1. Connexion & Prise en Main",
                "body": "Lancez l’application Galana HSSE sur votre terminal Android ou iOS. Connectez-vous avec vos identifiants professionnels Galana (adresse email et mot de passe).",
                "bullets": [
                    "L’application vérifie votre profil et télécharge vos missions récentes",
                    "L’écran d’accueil affiche le résumé de vos inspections du jour"
                ]
            },
            {
                "heading": "2. Le Filtre Clé « 👤 Attribuées à moi »",
                "body": "Pour retrouver immédiatement les inspections planifiées sur le Web à votre intention, activez le filtre « Attribuées à moi » en haut de la liste. Vous visualisez uniquement vos missions avec statut En attente ou En cours.",
                "bullets": [
                    "Cliquez sur la carte de la mission pour ouvrir la liste des points de contrôle",
                    "Le site, l’adresse et les consignes particulières s’affichent clairement"
                ]
            },
            {
                "heading": "3. Évaluation Terrain & Prise de Photos",
                "body": "Au fur et à mesure de votre parcours dans la station, évaluez chaque critère :",
                "bullets": [
                    "Bouton Vert : Conforme (C)",
                    "Bouton Rouge : Non Conforme (NC) -> ouverture automatique du champ de remarque et du bouton Appareil Photo pour joindre une preuve visuelle incontestable",
                    "Bouton Gris : Non Applicable (NA) si l’équipement n’existe pas sur le site"
                ]
            },
            {
                "heading": "4. Signature & Clôture Hors-Ligne",
                "body": "À l’issue de la visite, signez directement sur l’écran tactile du smartphone. Cliquez sur « Clôturer l’inspection ». Si vous êtes hors-ligne, les données sont stockées en mémoire sécurisée et seront téléversées sur le serveur Web dès la reconnexion."
            }
        ]
    },
    {
        "id": "support",
        "emoji": "🆘",
        "title": "Dépannage, FAQ & Support d’Urgence 24/7",
        "category": "Support",
        "readingTime": "5 min",
        "badgeClass": "bg-red-100 text-red-900 border-red-300",
        "summary": "Procédures de résolution rapide des pannes courantes, questions fréquentes et numéros d’urgence pour intervention d’astreinte.",
        "goldenRule": "Pour tout sinistre ou accident corporel, l’appel à la ligne d’astreinte 24/7 (+261 20 22 555 55) doit être effectué immédiatement.",
        "sections": [
            {
                "heading": "1. Résolution des Problèmes Courants",
                "body": "Voici les solutions immédiates aux situations techniques les plus courantes :",
                "bullets": [
                    "Problème de synchronisation mobile : Vérifiez votre accès Internet 4G/Wi-Fi et tirez vers le bas pour forcer l’actualisation.",
                    "Mot de passe oublié : Cliquez sur votre profil dans le coin supérieur droit pour actualiser votre mot de passe, ou contactez l’administrateur système.",
                    "Mission introuvable sur smartphone : Assurez-vous d’être connecté avec le compte exact de l’inspecteur auquel la visite a été assignée sur le Web."
                ]
            },
            {
                "heading": "2. Contacts d’Astreinte & Support Technique",
                "body": "Les canaux d’assistance Galana sont structurés selon l’urgence :",
                "bullets": [
                    "Ligne d’Astreinte Urgences 24/7 : +261 20 22 555 55 (Sinistre, incendie, pollution grave)",
                    "Support Technique & Applicatif : support.hsse@galana.mg ou +261 34 00 200 00 (Poste 142)",
                    "Horaires d’assistance applicative : Du Lundi au Vendredi de 08h00 à 17h00"
                ]
            }
        ]
    }
];

export const docChaptersEn: DocChapter[] = [
    {
        "id": "intro",
        "emoji": "🌟",
        "title": "Overview & Galana HSSE Standards",
        "category": "Governance",
        "readingTime": "4 min read",
        "badgeClass": "bg-slate-100 text-slate-800 border-slate-300",
        "summary": "General presentation of the HSSE policy, Zero Accident commitment, and dual Web & Mobile platform architecture.",
        "goldenRule": "Safety takes precedence over all productivity and schedule requirements. Every employee has the right to refuse and stop work in the face of serious and imminent danger.",
        "routeLink": {
            "label": "Open Dashboard",
            "name": "DASHBOARD"
        },
        "sections": [
            {
                "heading": "1. Zero Accident Vision & Regulatory Standards",
                "body": "The Galana HSSE platform (Health, Safety, Security, Environment) structures all operational procedures for Galana Madagascar. It ensures strict compliance with ISO 45001, ISO 14001, and petroleum depot & service station safety standards.",
                "bullets": [
                    "Zero occupational injuries across the entire retail distribution network",
                    "Zero hydrocarbon spills or contamination to ground or water",
                    "Total transparency and immediate reporting of any incident or near-miss",
                    "Visible leadership and management presence on the ground"
                ]
            },
            {
                "heading": "2. Connected Web & Mobile Ecosystem",
                "body": "The technical architecture relies on real-time synchronization between the central Web supervision portal and the mobile field inspection application.",
                "bullets": [
                    "Web Portal: Master data management, audit scheduling, inspector assignments, corrective action tracking, and executive reporting.",
                    "Mobile Application: Touchscreen field evaluation, autonomous offline functionality, GPS geotagging, and photo evidence capture."
                ]
            },
            {
                "heading": "3. Continuous Improvement Cycle (PDCA)",
                "body": "Every audit fits into the Deming cycle (Plan-Do-Check-Act) to continually enhance operational safety levels.",
                "table": {
                    "headers": [
                        "Phase",
                        "Operational Action",
                        "Galana Tool"
                    ],
                    "rows": [
                        [
                            "Plan",
                            "Audit programming & managerial visit scheduling",
                            "Web Portal (Checklists & VMC)"
                        ],
                        [
                            "Do",
                            "On-site inspection & finding recording",
                            "Mobile Field App"
                        ],
                        [
                            "Check",
                            "Automated scoring & anomaly detection",
                            "Web Compliance Engine"
                        ],
                        [
                            "Act",
                            "Remediation action tracking & resolution validation",
                            "Action Plans Module"
                        ]
                    ]
                }
            }
        ]
    },
    {
        "id": "workflow",
        "emoji": "🔄",
        "title": "The Complete Inspection Workflow (4 Steps Web ↔ Mobile)",
        "category": "Operations",
        "readingTime": "6 min read",
        "badgeClass": "bg-amber-100 text-amber-900 border-amber-300",
        "summary": "Step-by-step guide to the inspection lifecycle, from initial scheduling on the Web portal to mobile field execution and closure.",
        "goldenRule": "Every inspection scheduled on the Web must be nominally assigned to an inspector to appear instantly on their smartphone.",
        "routeLink": {
            "label": "Access Checklists",
            "name": "CHECKLIST"
        },
        "sections": [
            {
                "heading": "1. Step 1: Scheduling on the Web Application",
                "body": "The HSSE manager opens the Web portal and selects \"New Inspection\". They choose the target facility (e.g. SS_ANKORONDRANO), target date, and appropriate checklist template.",
                "bullets": [
                    "Site selection among the 4 official typologies (SS_, MAG_, AG_, SIEGE_)",
                    "Automatic system allocation of a unique reference code",
                    "Initial status: \"Scheduled\""
                ]
            },
            {
                "heading": "2. Step 2: Nominal Inspector Assignment",
                "body": "In the scheduling form, the manager chooses the inspector from authorized personnel or certified auditors. The system records the inspector ID to assign the mission to their mobile device.",
                "bullets": [
                    "Option to assign an internal Galana inspector or an accredited third-party auditor",
                    "The mission is instantly published to the Galana cloud"
                ]
            },
            {
                "heading": "3. Step 3: Reception & Execution on Smartphone",
                "body": "On site, the inspector opens the Galana HSSE mobile app. They filter missions using the \"👤 Assigned to me\" selector and tap the inspection to open the checklist.",
                "bullets": [
                    "Point-by-point rating: Conforming (C), Non-Conforming (NC), Not Applicable (NA)",
                    "Mandatory comment and photo capture whenever a Non-Conformity is flagged",
                    "Full offline execution in zero-reception areas thanks to local caching"
                ]
            },
            {
                "heading": "4. Step 4: Digital Sign-off & Real-Time Sync",
                "body": "Once all items are evaluated, the inspector signs digitally on screen and taps \"Close Inspection\". Once connectivity is restored, data uploads to the Web portal:",
                "bullets": [
                    "Instant status update to \"Completed\" on the Web portal",
                    "Immediate calculation of the overall compliance score in %",
                    "Automatic creation of remedial action items for every NC item detected"
                ]
            }
        ]
    },
    {
        "id": "checklists",
        "emoji": "📋",
        "title": "Checklists & Compliance Audits",
        "category": "Compliance",
        "readingTime": "5 min read",
        "badgeClass": "bg-blue-100 text-blue-900 border-blue-300",
        "summary": "Mastery of regulatory audit checklists: official models, scoring methodology, and automated compliance calculation.",
        "goldenRule": "An audit is only valid when completed on-site and countersigned digitally by the site manager. No standard frequency is enforced: scheduling is completely flexible according to operational priorities.",
        "routeLink": {
            "label": "Browse Checklists",
            "name": "CHECKLIST"
        },
        "sections": [
            {
                "heading": "1. Official Checklist Models",
                "body": "Galana provides 6 pre-configured, standard audit templates. Inspections are not bound to any imposed standard frequency: they are planned freely according to operational needs and management initiative.",
                "table": {
                    "headers": [
                        "Audit Template",
                        "Scope & Objectives",
                        "Operational Trigger"
                    ],
                    "rows": [
                        [
                            "HSSE Security Checklist",
                            "Physical security, CCTV cameras, fencing, guarding",
                            "As needed / At HSSE initiative"
                        ],
                        [
                            "Road Tanker Inspection",
                            "Tank integrity, hoses, static bonding grounding",
                            "As needed / Tanker unloading & spot checks"
                        ],
                        [
                            "Vehicle Fleet Inspection",
                            "Commercial fleet, tires, seatbelts, extinguishers",
                            "As needed / Fleet inspection"
                        ],
                        [
                            "Service Station Network Evaluation",
                            "Forecourts, fuel dispensers, pits, mandatory signage",
                            "As needed / Field audit round"
                        ],
                        [
                            "Agencies & Convenience Stores Evaluation",
                            "Express shops, stockrooms, emergency fire exits",
                            "As needed / Site inspection"
                        ],
                        [
                            "Energy Consumption & Environment Evaluation",
                            "Oil-water separators, wastewater, waste disposal",
                            "As needed / Environmental monitoring"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Compliance Score Calculation Formula",
                "body": "The compliance score is rigorously calculated according to the mathematical formula below:",
                "bullets": [
                    "Score (%) = [Total Conforming / (Total Conforming + Total Non-Conforming)] × 100",
                    "Items rated Not Applicable (NA) are rigorously excluded from the denominator",
                    "Excellence threshold: Score ≥ 95% (Green)",
                    "Acceptable threshold: 80% ≤ Score < 95% (Yellow)",
                    "Critical threshold: Score < 80% (Red - Immediate remediation required)"
                ]
            },
            {
                "heading": "3. Non-Conformity Management & Action Plans",
                "body": "Every Non-Conforming finding can be immediately transformed into a corrective action item with designated owner and target completion date."
            }
        ]
    },
    {
        "id": "vmc",
        "emoji": "👔",
        "title": "Managerial Compliance Visits (VMC)",
        "category": "Leadership",
        "readingTime": "5 min read",
        "badgeClass": "bg-indigo-100 text-indigo-900 border-indigo-300",
        "summary": "Field rollout of the 6 managerial visit types, behavioral safety observations, and management visible leadership.",
        "goldenRule": "Safety comes first. Managerial visits are conducted on-site with active listening and positive feedback, without rigid quotas.",
        "routeLink": {
            "label": "Manage VMC",
            "name": "VMC"
        },
        "sections": [
            {
                "heading": "1. The 6 Official VMC Typologies",
                "body": "The Galana HSSE system incorporates 6 standardized managerial visit formats, launched flexibly based on operational opportunities:",
                "table": {
                    "headers": [
                        "VMC Code",
                        "Full Designation",
                        "Operational Scope & Purpose"
                    ],
                    "rows": [
                        [
                            "VMC_SIMPLE",
                            "Simple Routine VMC",
                            "General visual walkthrough and direct dialogue with field personnel"
                        ],
                        [
                            "VMC_THEMATIQUE",
                            "Targeted Thematic VMC",
                            "Deep-dive focus on a specific risk (e.g. PPE, fuel discharge, fire safety)"
                        ],
                        [
                            "VMC_IMPROMPTU",
                            "Unannounced Spot-Check VMC",
                            "Spontaneous assessment of safety reflexes under live working conditions"
                        ],
                        [
                            "AUDIT_REGLEMENTAIRE",
                            "Regulatory Audit",
                            "Comprehensive verification of legal and documentary compliance"
                        ],
                        [
                            "INSPECTION_ANNUELLE",
                            "Comprehensive Annual Review",
                            "Exhaustive review of installations, storage tanks, and buildings"
                        ],
                        [
                            "CONFORMITE_SPECIALE",
                            "Special Compliance Review",
                            "Occasion-based investigation following an incident or site modification"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Lifecycle of a VMC",
                "body": "A managerial visit transitions through 4 official statuses:",
                "bullets": [
                    "SCHEDULED: Programmed visit with target date, site, and nominated manager",
                    "IN_PROGRESS: Visit started on-site with live finding entry",
                    "COMPLETED: Visit closed, report confirmed, and final rating locked",
                    "CANCELLED: Deprogrammed visit with justified reason logged in history"
                ]
            },
            {
                "heading": "3. Constructive Dialogue & Safety Culture",
                "body": "A VMC is not a punitive tool, but a collaborative opportunity to reinforce positive safety behaviors and eliminate hazardous conditions."
            }
        ]
    },
    {
        "id": "equipment",
        "emoji": "🧯",
        "title": "Equipment & Fire Safety Tracking",
        "category": "Equipment",
        "readingTime": "5 min read",
        "badgeClass": "bg-red-100 text-red-900 border-red-300",
        "summary": "Inventory, periodic inspection, and preventive maintenance of fire extinguishers, hose reels, and emergency stop devices.",
        "goldenRule": "Any extinguisher with a pressure gauge outside the green zone or a broken tamper seal must be immediately tagged out and replaced within 24h.",
        "routeLink": {
            "label": "Equipment Monitoring",
            "name": "EQUIPMENT_MONITORING"
        },
        "sections": [
            {
                "heading": "1. Fire Protection Equipment Typology",
                "body": "The module catalogs all primary firefighting intervention devices:",
                "bullets": [
                    "Multi-Purpose Dry Chemical Powder ABC Extinguishers (6 kg, 9 kg, 50 kg wheeled for forecourts & discharge)",
                    "Carbon Dioxide CO2 Extinguishers (2 kg, 5 kg for electrical cabinets and server rooms)",
                    "Water Spray with AFFF Additive Extinguishers (Shops, offices, and warehouses)",
                    "Fire Hose Reels (RIA) and dry risers",
                    "Sand buckets with emergency shovels on forecourts",
                    "Fire blankets and emergency safety showers"
                ]
            },
            {
                "heading": "2. On-Site Visual Inspection Protocol",
                "body": "During field inspections, the auditor verifies 5 critical checkpoints on each device:",
                "bullets": [
                    "Pressure: Gauge needle must be centered within the green safe operating zone",
                    "Integrity: Safety pin is sealed with official Galana tamper-evident seal",
                    "General condition: No impact dents, corrosion, or cracks on cylinder or hose",
                    "Accessibility: Clear 1-meter radius clearance around the unit at all times",
                    "Visibility: Photoluminescent standardized regulatory sign clearly visible"
                ]
            },
            {
                "heading": "3. Hydrostatic Proof Testing & Revisions",
                "body": "The system automatically computes maintenance alerts and 10-year hydraulic pressure testing deadlines with color-coded green / orange / red indicators."
            }
        ]
    },
    {
        "id": "actions",
        "emoji": "🎯",
        "title": "Corrective Action Plans",
        "category": "Improvement",
        "readingTime": "4 min read",
        "badgeClass": "bg-emerald-100 text-emerald-900 border-emerald-300",
        "summary": "Managing remedial action plans: severity prioritization, assignee allocation, deadlines, and closure verification.",
        "goldenRule": "An overdue High-priority action prevents any positive re-evaluation of the site’s overall HSSE safety rating.",
        "routeLink": {
            "label": "View Action Plans",
            "name": "ACTIONS"
        },
        "sections": [
            {
                "heading": "1. Priority Levels & Resolution Timeframes",
                "body": "Every detected non-conformity is categorized according to its operational severity:",
                "bullets": [
                    "High / Critical: Direct hazard to personnel or environment (timeframe: 48 hours)",
                    "Medium: Material non-conformity without immediate danger (timeframe: 15 days)",
                    "Low: Preventive improvement or documentation update (timeframe: 30 days)"
                ]
            },
            {
                "heading": "2. Corrective Action Lifecycle",
                "body": "An action progresses through a structured sequence:",
                "bullets": [
                    "TODO: Action created and notified to the designated owner",
                    "IN PROGRESS: Remediation work or technical interventions underway on site",
                    "RESOLVED: Defect corrected and documentary proof (photo/work order) submitted",
                    "CLOSED: Formal sign-off and closure by the HSSE manager following verification"
                ]
            },
            {
                "heading": "3. Automated Notifications & Reminders",
                "body": "Automated email alerts are dispatched to action owners at 7 days, 3 days, and on the exact due date."
            }
        ]
    },
    {
        "id": "sites",
        "emoji": "📍",
        "title": "Sites & Service Stations Network (4 Types: SS_, MAG_, AG_, SIEGE_)",
        "category": "Assets",
        "readingTime": "5 min read",
        "badgeClass": "bg-purple-100 text-purple-900 border-purple-200",
        "summary": "Standardized Galana network taxonomy: strict 4-type prefix rules, GPS coordinates, and asset identification cards.",
        "goldenRule": "No site can be registered without its mandatory prefix (SS_, MAG_, AG_, SIEGE_) and accurate GPS coordinates confirmed on the map.",
        "routeLink": {
            "label": "Manage Sites & Stations",
            "name": "SITES"
        },
        "sections": [
            {
                "heading": "1. Strict 4-Type Taxonomy & Mandatory Prefixes",
                "body": "The Galana Madagascar asset taxonomy complies with a rigorous naming convention:",
                "table": {
                    "headers": [
                        "Site Typology",
                        "Mandatory Prefix",
                        "Official Example",
                        "Business Role"
                    ],
                    "rows": [
                        [
                            "Service Station",
                            "SS_",
                            "SS_ANKORONDRANO",
                            "Retail fuel, lubricants, and convenience services distribution"
                        ],
                        [
                            "Store / Shop",
                            "MAG_",
                            "MAG_EXPRESS_ANALAKELY",
                            "Express shop, retail merchandising, and stock holding"
                        ],
                        [
                            "Regional Agency",
                            "AG_",
                            "AG_TAMATAVE",
                            "Commercial regional agency and logistics hub"
                        ],
                        [
                            "Headquarters",
                            "SIEGE_",
                            "SIEGE_ALAMAHANINA",
                            "Executive leadership and central administrative services"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Automatic Site Code Generation",
                "body": "When entering a new site on the Web portal, the system automatically adapts the code based on the selected type. Selecting \"Service Station\" with name \"ANKORONDRANO\" automatically generates \"SS_ANKORONDRANO\"."
            },
            {
                "heading": "3. GPS Geolocation & Safety Perimeter",
                "body": "Each site record stores exact latitude and longitude coordinates. These coordinates are vital for automated proximity calculations with emergency rescue services."
            }
        ]
    },
    {
        "id": "emergency",
        "emoji": "🚨",
        "title": "Emergency Contacts & POI Response (15 km Radius)",
        "category": "Emergency",
        "readingTime": "5 min read",
        "badgeClass": "bg-rose-100 text-rose-900 border-rose-200",
        "summary": "Emergency response organization and Internal Emergency Plan (POI): geo-referenced fire brigades, hospitals, and police forces.",
        "goldenRule": "In an emergency, the site manager can activate the direct 1-click call button for any rescue service within the 15 km safety radius.",
        "routeLink": {
            "label": "Emergency Contacts",
            "name": "EMERGENCY_CONTACT"
        },
        "sections": [
            {
                "heading": "1. Internal Emergency Plan (POI)",
                "body": "The POI plan governs immediate responses to major crises: fire, accidental hydrocarbon release, explosion, or armed intrusion. The directory catalogs all emergency responder units across Madagascar."
            },
            {
                "heading": "2. Intelligent 15 km Proximity Radius",
                "body": "In the Emergency Contacts interface, selecting a Galana facility in the dedicated sidebar:",
                "bullets": [
                    "The algorithm calculates straight-line haversine distance in kilometers in real time",
                    "Rescue units located within 15 km are sorted at the top of the list with a green badge",
                    "Emergency services in other districts remain searchable via manual query"
                ]
            },
            {
                "heading": "3. Streamlined Contact Form & 1-Click Dialing",
                "body": "The contact directory has been streamlined for fast access under stress:",
                "bullets": [
                    "Retained fields: Organization Name, Category (Fire, Hospital, Police, Gendarmerie), Direct Phone Number, and GPS Coordinates",
                    "Removed fields: Email, postal address, redundant operational notes",
                    "Direct 1-click dialing button to initiate phone calls instantly from mobile or PC"
                ]
            }
        ]
    },
    {
        "id": "trainings",
        "emoji": "🎓",
        "title": "Training Plan & Authorizations",
        "category": "HR & Skills",
        "readingTime": "4 min read",
        "badgeClass": "bg-teal-100 text-teal-900 border-teal-300",
        "summary": "HSSE competency management: regulatory training sessions, special authorizations, recurring refresher courses, and certifications.",
        "goldenRule": "No operator is permitted to perform fuel discharge or electrical maintenance work without a valid safety authorization.",
        "routeLink": {
            "label": "Training Plan",
            "name": "FORMATION"
        },
        "sections": [
            {
                "heading": "1. Regulatory Training Modules",
                "body": "The catalog encompasses all training modules required for petroleum handling operations:",
                "bullets": [
                    "Fire extinguisher handling and fire safety (Periodic recertification)",
                    "Occupational First Aider (SST) and life-saving techniques",
                    "Safe road tanker fuel discharge and anti-spill procedures",
                    "Basic electrical hazard authorizations (B0 / H0)"
                ]
            },
            {
                "heading": "2. Session Organization & Trainer Selection",
                "body": "When creating a training session, the \"Trainer\" input provides hybrid flexibility:",
                "bullets": [
                    "Quick selection from staff members registered in the corporate database",
                    "Freedom to type the name of an accredited third-party instructor or training center"
                ]
            },
            {
                "heading": "3. Validity Monitoring & Expiration Alerts",
                "body": "A centralized dashboard highlights certificate expiration dates to schedule refresher courses before qualifications lapse."
            }
        ]
    },
    {
        "id": "personnels",
        "emoji": "👥",
        "title": "Personnel & Employee Records",
        "category": "Human Resources",
        "readingTime": "4 min read",
        "badgeClass": "bg-cyan-100 text-cyan-900 border-cyan-300",
        "summary": "Central employee registry: company ID, assigned site, department, job title, and complete operational history.",
        "goldenRule": "Creating any field personnel record requires full name, valid corporate email, and primary assigned site.",
        "routeLink": {
            "label": "Personnel Records",
            "name": "PERSONNELS"
        },
        "sections": [
            {
                "heading": "1. Employee Record Data Structure",
                "body": "The employee profile consolidates all professional worker data in one place:",
                "bullets": [
                    "Complete identity (Last Name, First Name, Corporate Employee ID)",
                    "Assigned Department (Operations, Logistics, HSSE, Commercial, Finance)",
                    "Job title and employment status (Active / Inactive)",
                    "Contact coordinates (Secured corporate email, direct phone number)"
                ]
            },
            {
                "heading": "2. Integration with Audits and Managerial Visits",
                "body": "When preparing a VMC or checklist audit, the system auto-suggests qualified inspectors and auditors from the active personnel base."
            }
        ]
    },
    {
        "id": "rbac",
        "emoji": "🔐",
        "title": "Users, Roles & RBAC Security",
        "category": "System Security",
        "readingTime": "5 min read",
        "badgeClass": "bg-orange-100 text-orange-900 border-orange-300",
        "summary": "Role-Based Access Control (RBAC): Super Admin, HSSE Manager, Field Inspector, Station Manager.",
        "goldenRule": "The principle of least privilege is strictly enforced. Mobile inspectors only have write access to their own assigned audits.",
        "routeLink": {
            "label": "Roles & Permissions",
            "name": "ROLE_PERMISSION"
        },
        "sections": [
            {
                "heading": "1. Defined Roles in the Galana HSSE Platform",
                "body": "System permissions are governed by specialized user profiles:",
                "table": {
                    "headers": [
                        "Role Code",
                        "Business Profile",
                        "Primary Privileges"
                    ],
                    "rows": [
                        [
                            "SUPER_ADMIN",
                            "IT Directorate & System Admin",
                            "Full control, system configuration, user and role administration"
                        ],
                        [
                            "RESPONSABLE_HSSE",
                            "HSSE Directorate & Engineers",
                            "Checklist/VMC creation, assignments, action plan validation, exports"
                        ],
                        [
                            "INSPECTEUR_TERRAIN",
                            "Mobile Field Auditors",
                            "Smartphone audit execution, viewing assigned missions only"
                        ],
                        [
                            "CHEF_STATION",
                            "Station & Depot Managers",
                            "Access to on-site audit history, reporting local safety anomalies"
                        ],
                        [
                            "AUDITEUR_EXTERNE",
                            "Third-Party Accredited Auditors",
                            "Submission of specific audit reports within restricted scope"
                        ]
                    ]
                }
            },
            {
                "heading": "2. Session Security & Bearer Tokens",
                "body": "All communications between the Web client, Mobile app, and Laravel API are HTTPS encrypted and secured via Laravel Sanctum bearer tokens."
            }
        ]
    },
    {
        "id": "activity",
        "emoji": "📜",
        "title": "Activity Log & Audit Trail",
        "category": "Auditability",
        "readingTime": "4 min read",
        "badgeClass": "bg-zinc-100 text-zinc-900 border-zinc-300",
        "summary": "Tamper-evident operational log of every system action: certified timestamp, responsible user, IP address, and change details.",
        "goldenRule": "The activity audit trail is immutable and permanently archived to satisfy ISO certifications and statutory inspections.",
        "routeLink": {
            "label": "Activity Log",
            "name": "ACTIVITY"
        },
        "sections": [
            {
                "heading": "1. Scope of Automatic Activity Logging",
                "body": "Every transactional event is instantly registered in the tamper-proof audit trail:",
                "bullets": [
                    "Creation, modification, and deletion of sites, checklists, VMCs, and extinguishers",
                    "User logins, failed authentication attempts, and logouts",
                    "Mobile inspection sign-offs and corrective action closures",
                    "Database exports and security permission updates"
                ]
            },
            {
                "heading": "2. Information Recorded for Every Event",
                "body": "Each audit record logs: exact timestamp down to the second, user ID and name, client IP address, target module, and details of modified values."
            }
        ]
    },
    {
        "id": "documents",
        "emoji": "📚",
        "title": "Document Library & Regulatory Exports",
        "category": "Knowledge Base",
        "readingTime": "4 min read",
        "badgeClass": "bg-sky-100 text-sky-900 border-sky-300",
        "summary": "Electronic Document Management (EDM): Safety Data Sheets (SDS), operating procedures, official audit reports, and exports.",
        "goldenRule": "Every station must have continuous, unrestricted access to up-to-date Safety Data Sheets (SDS) for all fuels sold.",
        "routeLink": {
            "label": "Document Library",
            "name": "DOCUMENT_LIBRARY"
        },
        "sections": [
            {
                "heading": "1. Classified Document Types",
                "body": "The library consolidates the complete corporate HSSE document repository:",
                "bullets": [
                    "Safety Data Sheets (SDS): Unleaded petrol, Diesel, Kerosene, Lubricants",
                    "Standard Operating Procedures (SOP): Tanker unloading, tank cleaning, spill containment",
                    "National Malagasy hydrocarbon regulations and ministerial decrees",
                    "Consolidated audit reports and official corporate safety records"
                ]
            },
            {
                "heading": "2. Data Export Engine",
                "body": "All platform modules (Checklists, VMC, Equipment, Training, Personnel, Sites, Emergency) feature an \"Export\" button to extract current lists into clean tabular spreadsheets (Excel / CSV)."
            }
        ]
    },
    {
        "id": "mobile",
        "emoji": "📱",
        "title": "Galana HSSE Mobile App User Guide",
        "category": "Mobility",
        "readingTime": "6 min read",
        "badgeClass": "bg-emerald-100 text-emerald-900 border-emerald-300",
        "summary": "Practical smartphone handbook: login, assigned mission lookup, offline inspection execution, and photo capture.",
        "goldenRule": "The mobile app automatically caches all inspection data to guarantee smooth performance even in zero-reception station areas.",
        "sections": [
            {
                "heading": "1. Getting Started & Sign-In",
                "body": "Launch the Galana HSSE app on your Android or iOS device. Sign in with your corporate credentials (email address and password).",
                "bullets": [
                    "The app validates your profile and downloads your active mission roster",
                    "The home screen displays an overview of scheduled visits for the day"
                ]
            },
            {
                "heading": "2. The Essential \"👤 Assigned to me\" Filter",
                "body": "To immediately view inspections assigned to you from the Web portal, enable the \"Assigned to me\" filter at the top of the list. You will only see your own pending or in-progress visits.",
                "bullets": [
                    "Tap the inspection card to display the audit checklist checkpoints",
                    "Site name, address, and special instructions are clearly presented"
                ]
            },
            {
                "heading": "3. Field Evaluation & Photo Capture",
                "body": "As you inspect the facility, evaluate each checkpoint criterion:",
                "bullets": [
                    "Green button: Conforming (C)",
                    "Red button: Non-Conforming (NC) -> automatically opens the observation field and camera button to attach visual proof",
                    "Gray button: Not Applicable (NA) if the equipment does not exist on site"
                ]
            },
            {
                "heading": "4. Digital Sign-Off & Offline Closure",
                "body": "At the conclusion of the audit, sign directly on the touchscreen. Tap \"Close Inspection\". If working offline, data is securely cached locally and will automatically synchronize with the server once connectivity is restored."
            }
        ]
    },
    {
        "id": "support",
        "emoji": "🆘",
        "title": "Troubleshooting, FAQ & 24/7 Hotline",
        "category": "Support",
        "readingTime": "5 min read",
        "badgeClass": "bg-red-100 text-red-900 border-red-300",
        "summary": "Fast troubleshooting guides, frequent questions, and 24/7 emergency hotline contacts.",
        "goldenRule": "For any severe accident or hydrocarbon spill, calling the 24/7 emergency hotline (+261 20 22 555 55) is mandatory without delay.",
        "sections": [
            {
                "heading": "1. Resolving Common Issues",
                "body": "Immediate solutions to frequent operational and technical scenarios:",
                "bullets": [
                    "Mobile sync issue: Check 4G/Wi-Fi connection and pull down to refresh the screen.",
                    "Forgotten password: Click your avatar in the top-right header to update credentials or contact system admin.",
                    "Mission not appearing on phone: Verify you are logged into the exact user account nominated as inspector on the Web portal."
                ]
            },
            {
                "heading": "2. Support Channels & 24/7 Hotline",
                "body": "Galana assistance channels are organized according to urgency:",
                "bullets": [
                    "24/7 Emergency Hotline: +261 20 22 555 55 (Accidents, fires, major fuel spills)",
                    "Technical & Application Support: support.hsse@galana.mg or +261 34 00 200 00 (Ext. 142)",
                    "Helpdesk support hours: Monday to Friday from 08:00 AM to 05:00 PM"
                ]
            }
        ]
    }
];

export const helpModulesFr: HelpModule[] = [
    {
        "id": "checklists",
        "emoji": "📋",
        "title": "Checklists Réglementaires",
        "tag": "Audits",
        "badgeClass": "bg-blue-50 text-blue-800 border-blue-200",
        "iconBg": "bg-blue-500/10 text-blue-700",
        "routeName": "CHECKLIST",
        "description": "Planification, assignation aux inspecteurs, suivi des audits de stations et calcul du score de conformité.",
        "keyPoints": [
            "Attribution nominative des inspecteurs",
            "Synchronisation immédiate avec l’application mobile",
            "Génération automatisée des actions correctives"
        ]
    },
    {
        "id": "vmc",
        "emoji": "👔",
        "title": "Visites Managériales de Conformité (VMC)",
        "tag": "Leadership",
        "badgeClass": "bg-indigo-50 text-indigo-800 border-indigo-200",
        "iconBg": "bg-indigo-500/10 text-indigo-700",
        "routeName": "VMC",
        "description": "Supervision des 6 types de visites managériales terrain (routine, thématique, inopinée, annuelle, spéciale).",
        "keyPoints": [
            "6 typologies de visites normalisées",
            "Gestion des statuts : Planifié, En cours, Terminé, Annulé",
            "Dialogue bienveillant et valorisation des bonnes pratiques"
        ]
    },
    {
        "id": "equipment",
        "emoji": "🧯",
        "title": "Suivi du Matériel Incendie",
        "tag": "Sécurité",
        "badgeClass": "bg-red-50 text-red-800 border-red-200",
        "iconBg": "bg-red-500/10 text-red-700",
        "routeName": "EQUIPMENT_MONITORING",
        "description": "Contrôle réglementaire des extincteurs (poudre, CO2, eau), des RIA, bacs à sable et vannes d’arrêt.",
        "keyPoints": [
            "Surveillance régulière de la pression (zone verte)",
            "Alertes automatiques de maintenance décennale",
            "Calcul du pourcentage global de conformité du parc"
        ]
    },
    {
        "id": "actions",
        "emoji": "🎯",
        "title": "Plan d’Actions Correctives",
        "tag": "Remédiation",
        "badgeClass": "bg-emerald-50 text-emerald-800 border-emerald-200",
        "iconBg": "bg-emerald-500/10 text-emerald-700",
        "routeName": "ACTIONS",
        "description": "Pilotage de la résolution des non-conformités détectées : priorité, assignation, délai et preuves.",
        "keyPoints": [
            "Niveaux de criticité : Élevée, Moyenne, Faible",
            "Affectation nominative d’un responsable de remédiation",
            "Preuve obligatoire pour la clôture définitive"
        ]
    },
    {
        "id": "sites",
        "emoji": "📍",
        "title": "Sites & Stations Galana",
        "tag": "Patrimoine",
        "badgeClass": "bg-purple-50 text-purple-800 border-purple-200",
        "iconBg": "bg-purple-500/10 text-purple-700",
        "routeName": "SITES",
        "description": "Référentiel cartographique complet des 4 types de sites : Stations-Services, Magasins, Agences et Siège.",
        "keyPoints": [
            "Typologie harmonisée (SS, Magasins, Agences, Sièges)",
            "Génération automatique des codes sites",
            "Positionnement GPS et cartographie interactive"
        ]
    },
    {
        "id": "emergency",
        "emoji": "🚨",
        "title": "Secours & Numéros d’Urgence",
        "tag": "Intervention",
        "badgeClass": "bg-rose-50 text-rose-800 border-rose-200",
        "iconBg": "bg-rose-500/10 text-rose-700",
        "routeName": "EMERGENCY_CONTACT",
        "description": "Annuaire géolocalisé des sapeurs-pompiers, hôpitaux, SAMU, police et gendarmerie nationale.",
        "keyPoints": [
            "Calcul automatique de proximité avec chaque site (15 km)",
            "Bouton d’appel direct en 1 clic",
            "Rayon d’intervention et couverture géographique"
        ]
    }
];

export const helpModulesEn: HelpModule[] = [
    {
        "id": "checklists",
        "emoji": "📋",
        "title": "Regulatory Checklists",
        "tag": "Audits",
        "badgeClass": "bg-blue-50 text-blue-800 border-blue-200",
        "iconBg": "bg-blue-500/10 text-blue-700",
        "routeName": "CHECKLIST",
        "description": "Planning, assigning to inspectors, tracking facility compliance audits, and automated score computation.",
        "keyPoints": [
            "Nominal inspector assignment",
            "Real-time synchronization with the mobile field app",
            "Automated corrective action item creation"
        ]
    },
    {
        "id": "vmc",
        "emoji": "👔",
        "title": "Managerial Compliance Visits (VMC)",
        "tag": "Leadership",
        "badgeClass": "bg-indigo-50 text-indigo-800 border-indigo-200",
        "iconBg": "bg-indigo-500/10 text-indigo-700",
        "routeName": "VMC",
        "description": "Supervision of the 6 standardized field visit types (routine, thematic, unannounced, annual, special).",
        "keyPoints": [
            "6 standardized visit typologies",
            "Status tracking: Scheduled, In Progress, Completed, Cancelled",
            "Constructive dialogue and positive safety culture"
        ]
    },
    {
        "id": "equipment",
        "emoji": "🧯",
        "title": "Fire Safety Equipment Tracking",
        "tag": "Safety",
        "badgeClass": "bg-red-50 text-red-800 border-red-200",
        "iconBg": "bg-red-500/10 text-red-700",
        "routeName": "EQUIPMENT_MONITORING",
        "description": "Regulatory inspection of fire extinguishers (dry powder, CO2, water), hose reels, sand buckets, and valves.",
        "keyPoints": [
            "Regular pressure gauge surveillance (green zone)",
            "Automated 10-year hydraulic proof test alerts",
            "Overall fleet compliance percentage calculation"
        ]
    },
    {
        "id": "actions",
        "emoji": "🎯",
        "title": "Corrective Action Plans",
        "tag": "Remediation",
        "badgeClass": "bg-emerald-50 text-emerald-800 border-emerald-200",
        "iconBg": "bg-emerald-500/10 text-emerald-700",
        "routeName": "ACTIONS",
        "description": "Tracking remediation of detected non-conformities: priority, assignment, deadline, and proof of completion.",
        "keyPoints": [
            "Severity levels: High (48h), Medium (15d), Low (30d)",
            "Direct nominal assignment of a remediation owner",
            "Mandatory proof upload for formal closure"
        ]
    },
    {
        "id": "sites",
        "emoji": "📍",
        "title": "Galana Sites & Stations",
        "tag": "Assets",
        "badgeClass": "bg-purple-50 text-purple-800 border-purple-200",
        "iconBg": "bg-purple-500/10 text-purple-700",
        "routeName": "SITES",
        "description": "Complete GIS mapping and repository of all 4 site types: Service Stations, Convenience Stores, Agencies, and Headquarters.",
        "keyPoints": [
            "Harmonized taxonomy (SS, Stores, Agencies, HQ)",
            "Automatic site code generation",
            "Precise GPS positioning and interactive map"
        ]
    },
    {
        "id": "emergency",
        "emoji": "🚨",
        "title": "Emergency Services & Contacts",
        "tag": "Response",
        "badgeClass": "bg-rose-50 text-rose-800 border-rose-200",
        "iconBg": "bg-rose-500/10 text-rose-700",
        "routeName": "EMERGENCY_CONTACT",
        "description": "Geo-referenced directory of fire brigades, hospitals, emergency medical services (SAMU), and police stations.",
        "keyPoints": [
            "Automated proximity calculation for each site (15 km radius)",
            "Direct 1-click dialing button",
            "Comprehensive regional emergency coverage"
        ]
    }
];

export const initialFaqsFr: FaqItem[] = [
    {
        "icon": "📱",
        "question": "Comment synchroniser une inspection entre le Web et le Mobile ?",
        "answer": "Le processus est unifié en temps réel :\n1. Sur le Web, créez ou planifiez l’inspection et choisissez l’inspecteur assigné.\n2. L’inspecteur ouvre l’application Mobile Galana HSSE et active le filtre « 👤 Attribuées à moi ».\n3. Il réalise le contrôle sur le terrain et appuie sur « Clôturer l’inspection ».\n4. La plateforme Web se met instantanément à jour avec le statut Terminé.",
        "isOpen": true,
        "link": {
            "label": "Accéder aux Checklists",
            "name": "CHECKLIST"
        }
    },
    {
        "icon": "⛽",
        "question": "Quels sont les 4 types de sites officiels et leurs préfixes ?",
        "answer": "Le système applique automatiquement la nomenclature réglementaire Galana :\n• Station-Service : Préfixe SS_ (ex: SS_ANKORONDRANO)\n• Magasin : Préfixe MAG_ (ex: MAG_EXPRESS_ANALAKELY)\n• Agence : Préfixe AG_ (ex: AG_TAMATAVE)\n• Siège : Préfixe SIEGE_ (ex: SIEGE_ALAMAHANINA)\nLes codes et préfixes s’ajustent automatiquement lors de la création ou mise à jour.",
        "isOpen": false,
        "link": {
            "label": "Gérer les Sites & Stations",
            "name": "SITES"
        }
    },
    {
        "icon": "🗺️",
        "question": "Comment trouver les secours d’urgence les plus proches d’une station ?",
        "answer": "Rendez-vous dans le menu « Contacts d’urgence ». Dans le volet de proximité, sélectionnez votre station ou site Galana. L’application calcule automatiquement les distances directes en kilomètres et affiche en priorité les pompiers, hôpitaux et forces de l’ordre situés dans le périmètre le plus proche.",
        "isOpen": false,
        "link": {
            "label": "Ouvrir les Contacts d’urgence",
            "name": "EMERGENCY_CONTACT"
        }
    },
    {
        "icon": "📊",
        "question": "Comment exporter les rapports et listes au format Excel (CSV) ?",
        "answer": "Chaque module de la plateforme (Checklists, VMC, Matériel, Formations, Utilisateurs, Sites, Secours) intègre un bouton « Exporter » dans son ruban d’outils supérieur. Un simple clic génère et télécharge instantanément un fichier tabulaire structuré respectant les filtres actifs.",
        "isOpen": false
    },
    {
        "icon": "🧯",
        "question": "Comment sont calculés les taux de conformité du parc matériel ?",
        "answer": "Le taux de conformité correspond au pourcentage d’équipements de sécurité incendie valides (pression optimale dans le vert, goupille scellée, révision à jour) par rapport à l’ensemble des équipements contrôlés sur le site.",
        "isOpen": false,
        "link": {
            "label": "Voir le Suivi Matériel",
            "name": "EQUIPMENT_MONITORING"
        }
    },
    {
        "icon": "🔑",
        "question": "Comment réinitialiser son mot de passe ou modifier son profil ?",
        "answer": "Cliquez sur votre profil en haut à droite dans le Header, puis sélectionnez « Mon profil ». Vous pourrez y mettre à jour vos coordonnées personnelles et modifier vos identifiants d’accès.",
        "isOpen": false,
        "link": {
            "label": "Mon Profil",
            "name": "PROFILE"
        }
    },
    {
        "icon": "🎓",
        "question": "Le formateur d’une session de formation est-il obligatoirement un employé ?",
        "answer": "Le champ Formateur propose automatiquement les membres du personnel répertoriés dans la base d’entreprise, tout en vous laissant la flexibilité de saisir le nom d’un intervenant ou organisme extérieur.",
        "isOpen": false,
        "link": {
            "label": "Plan de Formations",
            "name": "FORMATION"
        }
    },
    {
        "icon": "📶",
        "question": "L’application Mobile fonctionne-t-elle sans connexion Internet ?",
        "answer": "Oui, l’application Mobile Galana HSSE intègre un cache local hors-ligne permettant d’effectuer l’inspection sur site même en zone blanche. Les données sont automatiquement synchronisées dès que la connexion réseau est rétablie.",
        "isOpen": false
    }
];

export const initialFaqsEn: FaqItem[] = [
    {
        "icon": "📱",
        "question": "How to synchronize an inspection between Web and Mobile?",
        "answer": "The workflow is unified in real time:\n1. On the Web, schedule the inspection and select the assigned inspector.\n2. The inspector opens the Galana HSSE Mobile app and selects the \"👤 Assigned to me\" filter.\n3. They perform the audit on site and tap \"Close inspection\".\n4. The Web platform updates immediately to Completed status.",
        "isOpen": true,
        "link": {
            "label": "Access Checklists",
            "name": "CHECKLIST"
        }
    },
    {
        "icon": "⛽",
        "question": "What are the 4 official site types and their prefixes?",
        "answer": "The system automatically enforces Galana’s regulatory naming convention:\n• Service Station: SS_ prefix (e.g. SS_ANKORONDRANO)\n• Convenience Store: MAG_ prefix (e.g. MAG_EXPRESS_ANALAKELY)\n• Regional Agency: AG_ prefix (e.g. AG_TAMATAVE)\n• Headquarters: SIEGE_ prefix (e.g. SIEGE_ALAMAHANINA)\nCodes and prefixes adjust automatically during creation or editing.",
        "isOpen": false,
        "link": {
            "label": "Manage Sites & Stations",
            "name": "SITES"
        }
    },
    {
        "icon": "🗺️",
        "question": "How to find the closest emergency rescue services to a station?",
        "answer": "Navigate to \"Emergency Contacts\". In the proximity sidebar, select your Galana site or station. The application computes straight-line distances in kilometers and prioritizes fire stations, hospitals, and police forces located within the nearest radius.",
        "isOpen": false,
        "link": {
            "label": "Open Emergency Contacts",
            "name": "EMERGENCY_CONTACT"
        }
    },
    {
        "icon": "📊",
        "question": "How to export reports and lists to Excel (CSV)?",
        "answer": "Every module (Checklists, VMC, Equipment, Training, Users, Sites, Emergency) features an \"Export\" button in its top toolbar. A single click immediately generates and downloads a structured spreadsheet respecting active filters.",
        "isOpen": false
    },
    {
        "icon": "🧯",
        "question": "How is the fire equipment compliance rate calculated?",
        "answer": "The compliance rate represents the percentage of valid fire safety devices (optimal pressure in green, intact security seal, up-to-date maintenance) out of all equipment inspected on the site.",
        "isOpen": false,
        "link": {
            "label": "View Equipment Monitoring",
            "name": "EQUIPMENT_MONITORING"
        }
    },
    {
        "icon": "🔑",
        "question": "How to reset a password or update user profile?",
        "answer": "Click on your profile avatar in the top-right Header, then select \"My Profile\". You can update your personal contact details and change your account password.",
        "isOpen": false,
        "link": {
            "label": "My Profile",
            "name": "PROFILE"
        }
    },
    {
        "icon": "🎓",
        "question": "Does a training session trainer have to be an internal employee?",
        "answer": "The Trainer field automatically suggests employees from the corporate database while offering full flexibility to type the name of an external certified instructor or organization.",
        "isOpen": false,
        "link": {
            "label": "Training Plan",
            "name": "FORMATION"
        }
    },
    {
        "icon": "📶",
        "question": "Does the Mobile application work without an Internet connection?",
        "answer": "Yes, the Galana HSSE Mobile app includes an offline local cache allowing inspections to proceed even in remote dead zones. Data automatically synchronizes as soon as network connectivity is restored.",
        "isOpen": false
    }
];

export function getDocChapters(locale: string = 'fr'): DocChapter[] {
    return locale === 'en' ? docChaptersEn : docChaptersFr;
}

export function getHelpModules(locale: string = 'fr'): HelpModule[] {
    return locale === 'en' ? helpModulesEn : helpModulesFr;
}

export function getInitialFaqs(locale: string = 'fr'): FaqItem[] {
    return locale === 'en' ? initialFaqsEn : initialFaqsFr;
}

// Rétrocompatibilité
export const docChapters = docChaptersFr;
export const helpModules = helpModulesFr;
export const initialFaqs = initialFaqsFr;

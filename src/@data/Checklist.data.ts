import type { ChecklistStatusJsonType, ChecklistStatusType, ChecklistTypeJson, Checklistype, SiteTypeJson } from "../@types/Checklist.type";

const ChecklistStatusData = ["DRAFT", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as ChecklistStatusType[]
const ChecklistStatusJsonData = [
  {
    label: 'Planifiée',
    value: 'DRAFT',
  },

  {
    label: 'En cours',
    value: 'IN_PROGRESS',
  },

  {
    label: 'Clôturée',
    value: 'COMPLETED',
  },

  {
    label: 'Annulée',
    value: 'CANCELLED',
  },
] as ChecklistStatusJsonType
const SiteTypeDataJson: SiteTypeJson = [
  {
    label: 'Station Service',
    value: 'STATION SERVICE',
  },

  {
    label: 'Magasin',
    value: 'MAGASIN',
  },

  {
    label: 'Vehicule',
    value: 'VEHICULE',
  },

  {
    label: 'Agence',
    value: 'AGENCE',
  },

  {
    label: 'Camion Citerne',
    value: 'CAMION CITERNE',
  },

  {
    label: 'B2B',
    value: 'B2B',
  },
]
const ChecklistTypeData: ChecklistTypeJson = [
  {
    label: 'Checklist HSSE Sûreté',
    value: 'CHECKLIST HSSE SURETE'
  },

  {
    label: "Fiche d'inspection de camion citerne",
    value: "FICHE D'INSPECTION DE CAMION CITERNE"
  },

  {
    label: 'Inspection des véhicules',
    value: 'INSPECTION DES VEHICULES'
  },

  {
    label: 'Checklist évaluation réseau',
    value: 'CHECKLIST EVALUATION RESEAU'
  },

  {
    label: 'Checklist évaluation des agences et magasin',
    value: 'CHECKLIST EVALUATION DES AGENCES ET MAGASIN'
  },

  {
    label: 'Checklist évaluation conso',
    value: 'CHECKLIST EVALUATION CONSO'
  }
]

const ChecklistsData: Checklistype[] = [
  {
    id: 1,
    site: "STATION SERVICE",
    type: "CHECKLIST HSSE SURETE",
    title: "Inspection HSSE - Station Service Ankorondrano",
    description:
      "Contrôle général des conditions de santé, sécurité, sûreté et environnement de la station.",
    location: "Ankorondrano",
    date: "2026-08-27",
    time: "08:30",
    inspector: "Jean Rakoto",
    accompanying_person: "Marie Randria",
    comment: "Inspection générale réalisée dans de bonnes conditions.",
    status: "COMPLETED",
    started_at: "2026-08-27T08:30:00",
    completed_at: "2026-08-27T10:15:00",
    contact: "+261 34 12 345 67",
    manager: "Hery Andriamihaja",
    added_by: "1",

    sections: [
      {
        id: 1,
        title: "Sécurité générale",
        checklist_id: 1,
        items: [
          {
            id: 1,
            checklist_section_id: 1,
            question: "Les extincteurs sont-ils présents et accessibles ?",
            answer: {
              id: 1,
              value: "YES",
              comment: "Tous les extincteurs sont accessibles.",
            } as any,
          },
          {
            id: 2,
            checklist_section_id: 1,
            question: "Les issues de secours sont-elles dégagées ?",
            answer: {
              id: 2,
              value: "YES",
              comment: "Aucune obstruction constatée.",
            } as any,
          },
          {
            id: 3,
            checklist_section_id: 1,
            question: "La signalisation de sécurité est-elle visible ?",
            answer: {
              id: 3,
              value: "NO",
              comment: "Un panneau est partiellement endommagé.",
            } as any,
            action: {
              id: 1,
              email_status: "SENT",
              description:
                "Remplacer le panneau de sécurité endommagé.",
              status: "IN_PROGRESS",
              assigned_to: {
                "id": 4,
                "first_name": "ARIMANANA",
                "last_name": "Maherison Jules",
                "email": "arimananajules@gmail.com",
                "phone_number": "+261344310334",
                "status": "ENABLED",
                "role": "USER",
                "permissions": [],
                "department": "HSSE",
                "job": "Responsable HSSE"
              },
              checklist_item_id: 3,
              created_at: "2026-08-27T09:15:00",
            },
          },
        ],
      },

      {
        id: 2,
        title: "Équipements de protection individuelle",
        checklist_id: 1,
        items: [
          {
            id: 4,
            checklist_section_id: 2,
            question: "Les employés portent-ils les EPI requis ?",
            answer: {
              id: 4,
              value: "YES",
              comment: "Port des EPI conforme.",
            } as any,
          },
          {
            id: 5,
            checklist_section_id: 2,
            question: "Les EPI sont-ils disponibles en quantité suffisante ?",
            answer: {
              id: 5,
              value: "YES",
              comment: "Stock disponible.",
            } as any,
          },
        ],
      },

      {
        id: 3,
        title: "Environnement",
        checklist_id: 1,
        items: [
          {
            id: 6,
            checklist_section_id: 3,
            question: "Les déchets sont-ils correctement triés ?",
            answer: {
              id: 6,
              value: "YES",
              comment: "Tri des déchets conforme.",
            } as any,
          },
          {
            id: 7,
            checklist_section_id: 3,
            question: "Les produits dangereux sont-ils correctement stockés ?",
            answer: {
              id: 7,
              value: "YES",
              comment: "Stockage conforme.",
            } as any,
          },
        ],
      },
    ],
  },

  {
    id: 2,
    site: "CAMION CITERNE",
    type: "FICHE D'INSPECTION DE CAMION CITERNE",
    title: "Inspection camion citerne - CC 1024",
    description:
      "Inspection avant opération du camion citerne conformément aux exigences HSSE.",
    location: "Dépôt Ivato",
    date: "2026-08-27",
    time: "11:00",
    inspector: "Paul Razafindrakoto",
    accompanying_person: "Solofo Rakoto",
    comment:
      "Quelques observations nécessitent une action corrective.",
    status: "IN_PROGRESS",
    started_at: "2026-08-27T11:00:00",
    contact: "+261 32 45 678 90",
    manager: "Nantenaina Rakoto",
    added_by: "2",

    sections: [
      {
        id: 4,
        title: "État général du véhicule",
        checklist_id: 2,
        items: [
          {
            id: 8,
            checklist_section_id: 4,
            question: "Les pneus sont-ils en bon état ?",
            answer: {
              id: 8,
              value: "YES",
              comment: "État satisfaisant.",
            } as any,
          },
          {
            id: 9,
            checklist_section_id: 4,
            question: "Les feux et dispositifs lumineux fonctionnent-ils ?",
            answer: {
              id: 9,
              value: "NO",
              comment: "Feu arrière droit défectueux.",
            } as any,
            action: {
              id: 2,
              email_status: "NOT_SENT",
              description:
                "Réparer le feu arrière droit avant utilisation du camion.",
              status: "PENDING",
              assigned_to: {
                "id": 4,
                "first_name": "ARIMANANA",
                "last_name": "Maherison Jules",
                "email": "arimananajules@gmail.com",
                "phone_number": "+261344310334",
                "status": "ENABLED",
                "role": "USER",
                "permissions": [],
                "department": "HSSE",
                "job": "Responsable HSSE"
              },
              checklist_item_id: 9,
              created_at: "2026-08-27T11:30:00",
            },
          },
          {
            id: 10,
            checklist_section_id: 4,
            question: "Les rétroviseurs sont-ils en bon état ?",
            answer: {
              id: 10,
              value: "YES",
              comment: "Aucune anomalie constatée.",
            } as any,
          },
        ],
      },

      {
        id: 5,
        title: "Équipements de sécurité",
        checklist_id: 2,
        items: [
          {
            id: 11,
            checklist_section_id: 5,
            question: "Les extincteurs sont-ils présents et contrôlés ?",
            answer: {
              id: 11,
              value: "YES",
              comment: "Contrôle valide.",
            } as any,
          },
          {
            id: 12,
            checklist_section_id: 5,
            question: "Le kit anti-déversement est-il disponible ?",
            answer: {
              id: 12,
              value: "YES",
              comment: "Kit complet.",
            } as any,
          },
        ],
      },
    ],
  },

  {
    id: 3,
    site: "AGENCE",
    type: "CHECKLIST EVALUATION DES AGENCES ET MAGASIN",
    title: "Évaluation HSSE - Agence Antananarivo",
    description:
      "Évaluation des conditions HSSE et de l'organisation générale de l'agence.",
    location: "Antananarivo",
    date: "2026-08-26",
    time: "14:00",
    inspector: "Marie Rakotomalala",
    accompanying_person: "Andry Randria",
    comment: "Évaluation terminée sans incident.",
    status: "COMPLETED",
    started_at: "2026-08-26T14:00:00",
    completed_at: "2026-08-26T15:45:00",
    contact: "+261 33 56 789 01",
    manager: "Mamy Raveloson",
    added_by: "1",

    sections: [
      {
        id: 6,
        title: "Locaux et installations",
        checklist_id: 3,
        items: [
          {
            id: 13,
            checklist_section_id: 6,
            question: "Les locaux sont-ils propres et correctement entretenus ?",
            answer: {
              id: 13,
              value: "YES",
              comment: "Locaux propres.",
            } as any,
          },
          {
            id: 14,
            checklist_section_id: 6,
            question: "Les installations électriques sont-elles conformes ?",
            answer: {
              id: 14,
              value: "YES",
              comment: "Aucune anomalie constatée.",
            } as any,
          },
        ],
      },

      {
        id: 7,
        title: "Prévention incendie",
        checklist_id: 3,
        items: [
          {
            id: 15,
            checklist_section_id: 7,
            question: "Les extincteurs sont-ils accessibles ?",
            answer: {
              id: 15,
              value: "YES",
              comment: "Extincteurs accessibles.",
            } as any,
          },
          {
            id: 16,
            checklist_section_id: 7,
            question: "Les employés connaissent-ils les procédures d'évacuation ?",
            answer: {
              id: 16,
              value: "NO",
              comment: "Une session de sensibilisation est nécessaire.",
            } as any,
            action: {
              id: 3,
              email_status: "NOT_SENT",
              description:
                "Organiser une session de sensibilisation sur les procédures d'évacuation.",
              status: "FINISHED",
              assigned_to: {
                "id": 4,
                "first_name": "ARIMANANA",
                "last_name": "Maherison Jules",
                "email": "arimananajules@gmail.com",
                "phone_number": "+261344310334",
                "status": "ENABLED",
                "role": "USER",
                "permissions": [],
                "department": "HSSE",
                "job": "Responsable HSSE"
              },
              checklist_item_id: 16,
              created_at: "2026-08-26T15:20:00",
            },
          },
        ],
      },
    ],
  },

  {
    id: 4,
    site: "MAGASIN",
    type: "CHECKLIST EVALUATION DES AGENCES ET MAGASIN",
    title: "Inspection magasin de stockage",
    description:
      "Contrôle des conditions de stockage et de sécurité du magasin.",
    location: "Zone industrielle Ankorondrano",
    date: "2026-08-25",
    time: "09:30",
    inspector: "Haja Andriamaro",
    accompanying_person: "Fetra Rakoto",
    status: "DRAFT",
    contact: "+261 34 67 890 12",
    manager: "Tiana Randria",
    added_by: "3",

    sections: [
      {
        id: 8,
        title: "Stockage",
        checklist_id: 4,
        items: [
          {
            id: 17,
            checklist_section_id: 8,
            question: "Les produits sont-ils correctement rangés ?",
          },
          {
            id: 18,
            checklist_section_id: 8,
            question: "Les voies de circulation sont-elles dégagées ?",
          },
          {
            id: 19,
            checklist_section_id: 8,
            question: "Les produits dangereux sont-ils correctement identifiés ?",
          },
        ],
      },
    ],
  },

  {
    id: 5,
    site: "VEHICULE",
    type: "INSPECTION DES VEHICULES",
    title: "Inspection véhicule de service - VS 2045",
    description:
      "Inspection périodique du véhicule de service.",
    location: "Antananarivo",
    date: "2026-08-24",
    time: "08:00",
    inspector: "Tojo Rakoto",
    accompanying_person: "Mickaël Ranaivo",
    comment: "Inspection conforme.",
    status: "COMPLETED",
    started_at: "2026-08-24T08:00:00",
    completed_at: "2026-08-24T08:50:00",
    contact: "+261 32 78 901 23",
    manager: "Faly Andriantsoa",
    added_by: "2",

    sections: [
      {
        id: 9,
        title: "Contrôle du véhicule",
        checklist_id: 5,
        items: [
          {
            id: 20,
            checklist_section_id: 9,
            question: "Le niveau d'huile est-il correct ?",
            answer: {
              id: 20,
              value: "YES",
              comment: "Niveau correct.",
            } as any,
          },
          {
            id: 21,
            checklist_section_id: 9,
            question: "Les freins fonctionnent-ils correctement ?",
            answer: {
              id: 21,
              value: "YES",
              comment: "Freinage normal.",
            } as any,
          },
          {
            id: 22,
            checklist_section_id: 9,
            question: "La trousse de premiers secours est-elle disponible ?",
            answer: {
              id: 22,
              value: "YES",
              comment: "Trousse complète.",
            } as any,
          },
        ],
      },
    ],
  },

  {
    id: 6,
    site: "B2B",
    type: "CHECKLIST EVALUATION CONSO",
    title: "Évaluation consommation énergétique",
    description:
      "Évaluation de la consommation des ressources et identification des possibilités d'amélioration.",
    location: "Site administratif",
    date: "2026-08-23",
    time: "13:30",
    inspector: "Nirina Rakoto",
    accompanying_person: "Hasina Andrianina",
    comment:
      "Des pistes d'amélioration ont été identifiées.",
    status: "CANCELLED",
    contact: "+261 33 89 012 34",
    manager: "Zo Rakotomalala",
    added_by: "4",

    sections: [
      {
        id: 10,
        title: "Consommation énergétique",
        checklist_id: 6,
        items: [
          {
            id: 23,
            checklist_section_id: 10,
            question: "La consommation électrique est-elle suivie régulièrement ?",
          },
          {
            id: 24,
            checklist_section_id: 10,
            question: "Les équipements énergivores sont-ils identifiés ?",
          },
          {
            id: 25,
            checklist_section_id: 10,
            question: "Des mesures de réduction de consommation sont-elles appliquées ?",
          },
        ],
      },
    ],
  },
];
export {
  ChecklistStatusData,
  ChecklistStatusJsonData,
  ChecklistsData,
  ChecklistTypeData,
  SiteTypeDataJson
}
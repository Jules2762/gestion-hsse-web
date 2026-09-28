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
    label: 'Checklist évaluation réseau (Magasin)',
    value: 'CHECKLIST EVALUATION RESEAU MAGASIN'
  },
  {
    label: 'Checklist évaluation réseau (Station Service)',
    value: 'CHECKLIST EVALUATION RESEAU STATION SERVICE',
    site:"STATION SERVICE"
  },

  {
    label: 'Checklist évaluation des agences et magasin',
    value: 'CHECKLIST EVALUATION DES AGENCES ET MAGASIN'
  },

  {
    label: 'Checklist évaluation conso',
    value: 'CHECKLIST EVALUATION CONSO',
    site:"B2B"
  }
]

const ChecklistsData: Checklistype[] = [
  
];
export {
  ChecklistStatusData,
  ChecklistStatusJsonData,
  ChecklistsData,
  ChecklistTypeData,
  SiteTypeDataJson
}
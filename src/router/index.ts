import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

const routeTitles: Record<string, string> = {
    LOGIN: "Connexion",
    SEARCH_ACCOUNT: "Mot de passe oublié",
    DASHBOARD: "Tableau de bord",
    USERS: "Utilisateurs",
    ROLE_PERMISSION: "Droits & Permissions",
    ADD_USER: "Ajouter un utilisateur",
    UPDATE_USER: "Modifier l'utilisateur",
    PERSONNEL: "Personnels",
    PERSONNEL_ADD: "Ajouter un personnel",
    PERSONNEL_UPDATE: "Modifier le personnel",
    SITES: "Sites & Stations",
    ACTIVITY: "Journal d'activités",
    DOCUMENT_LIBRARY: "Bibliothèque de documents",
    FORMATION: "Formations",
    FORMATION_PARTICIPANT: "Participants à la formation",
    FORMATION_UPDATE: "Modifier la formation",
    FORMATION_NEW: "Nouvelle formation",
    FORMATION_IMPORT: "Importer des formations",
    TEMPLATE: "Modèles d'inspection",
    CHECKLIST: "Checklists",
    CHECKLIST_NEW: "Nouvelle checklist",
    CHECKLIST_DETAILS: "Détails de la checklist",
    VMC: "Visites Managériales (VMC)",
    VMC_NEW: "Nouvelle VMC",
    VMC_DETAILS: "Détails VMC",
    ACTION: "Plan d'actions",
    EQUIPMENT_MONITORING: "Suivi des équipements",
    EQUIPMENT_MONITORING_DETAILS: "Détails équipement",
    EQUIPMENT_MONITORING_NEW: "Nouvel équipement",
    EQUIPMENT_MONITORING_UPDATE: "Modifier équipement",
    EQUIPMENT_MONITORING_IMPORT: "Importer équipements",
    PROFILE: "Mon profil",
    UPDATE_PROFILE: "Modifier mon profil",
    SETTING: "Paramètres",
    EMERGENCY_CONTACT: "Numéros d'urgence",
};

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, _from, next) => {
    const token = sessionStorage.getItem("gestion-hsse-token");
    const isAuthRoute = to.matched.some(record => record.name === 'AUTH');

    if (!token && !isAuthRoute) {
        return next({ name: 'LOGIN' });
    }
    if (token && isAuthRoute) {
        return next({ name: 'DASHBOARD' });
    }
    next();
});

router.afterEach((to) => {
    const title = (to.name && routeTitles[to.name as string]) || (to.meta?.title as string);
    if (title) {
        document.title = `${title} | Galana HSSE`;
    } else {
        document.title = "Galana - Gestion HSSE";
    }
});

export {
    router
}
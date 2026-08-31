<script setup lang="ts">
import { Calendar, ChevronDown, ChevronUp, CircleSlash2, ClipboardCheck, EyeIcon, FileDown, FileTextIcon, Flame, ShieldCheck, TimerReset, TriangleAlert, User, UserCheck2 } from '@lucide/vue';
import Header from '../../../components/shared/Header.vue';
import Button from '../../../components/ui/Button.vue';
import Card from '../../../components/features/dashboard/Card.vue';
import { ref } from 'vue';

const sections = ref([
    {
        id: 1,
        title: 'Équipements incendie',
        description:
            'Vérification des extincteurs, alarmes et accès aux sorties de secours.',
        icon: Flame,

        isOpen: false,
        questions: [
            {
                id: 1,
                question:
                    'Les extincteurs sont-ils tous en place et facilement accessibles ?',
                response: 'Oui / Non (Oui)',
                commentCount: 0,
                photoCount: 2,
                status: 'CONFORME',
            },

            {
                id: 2,
                question:
                    'La date de dernière révision des extincteurs est-elle valide (< 1 an) ?',
                response: 'Oui / Non (Non)',
                commentCount: 1,
                photoCount: 1,
                status: 'NON_CONFORME',

                action: {
                    title:
                        'Planifier la maintenance annuelle des extincteurs zone A',
                    priority: 'Haute Priorité',
                    responsible: 'J. Dupont',
                    dueDate: '30 Oct 2023',
                    status: 'En cours',
                },
            },
        ],
    },
    {
        id: 2,
        title: 'Équipements incendie',
        description:
            'Vérification des extincteurs, alarmes et accès aux sorties de secours.',
        icon: Flame,

        isOpen: false,
        questions: [
            {
                id: 1,
                question:
                    'Les extincteurs sont-ils tous en place et facilement accessibles ?',
                response: 'Oui / Non (Oui)',
                commentCount: 0,
                photoCount: 2,
                status: 'CONFORME',
            },

            {
                id: 2,
                question:
                    'La date de dernière révision des extincteurs est-elle valide (< 1 an) ?',
                response: 'Oui / Non (Non)',
                commentCount: 1,
                photoCount: 1,
                status: 'NON_CONFORME',

                action: {
                    title:
                        'Planifier la maintenance annuelle des extincteurs zone A',
                    priority: 'Haute Priorité',
                    responsible: 'J. Dupont',
                    dueDate: '30 Oct 2023',
                    status: 'En cours',
                },
            },
        ],
    },
])
function toggleSection(sectionId: number) {
    sections.value.forEach(section => {
        if (section.id === sectionId) {
            section.isOpen = !section.isOpen
        } else {
            section.isOpen = false
        }
    })
}
</script>

<template>
    <div class="flex flex-col">
        <Header title="Fiche checklist" :thumbnails="[
            {
                'label': 'Tableau de bord',
                'name': 'DASHBOARD'
            },
            {
                'label': 'Inspections',
                'name': 'INSPECTION'
            },
            {
                'label': 'Checklist',
                'name': 'CHECKLIST'
            },
            {
                'label': 'Fiche',
                'name': 'CHECKLIST_DETAILS'
            },
        ]" />
        <div class="flex flex-row justify-between p-4 h-18">
            <p class="max-w-80">Consultez les informations, la structure et les performances associées à cette
                checklist.</p>
            <div class="flex flex-row gap-3">
                <Button :left-icon="EyeIcon" :variant="'outline'">Prévisualiser</Button>
                <Button :left-icon="FileDown">Exporter PDF</Button>
            </div>
        </div>
        <div class="grid grid-cols-6 gap-3 p-4">
            <div class="col-span-4 bg-white rounded border border-gray-200 p-6 flex flex-col gap-4">
                <div class="flex flex-row items-center justify-between">
                    <h5>Inspection Station-Service</h5>
                    <div class="bg-primary/10 p-4 rounded-full text-primary border-2 border-primary/20">
                        <FileTextIcon />
                    </div>
                </div>
                <p class="w-10/12">Formulaire standard d'inspection sécurité et environnementale pour les
                    stations-service du réseau. À réaliser trimestriellement.</p>
                <hr class="text-gray-200">
                <div class="grid grid-cols-3 gap-3">
                    <Card title="Conformité" value="13" :icon="ShieldCheck" />
                    <Card title="Non-Conformité" value="13" :icon="TriangleAlert" />
                    <Card title="Non Applicable" value="13" :icon="CircleSlash2" />
                </div>
            </div>
            <div class="col-span-2 bg-white rounded border border-gray-200 p-6 flex flex-col gap-y-5">
                <h5>Détails checklist</h5>
                <hr class="text-gray-200">
                <div class="flex flex-row item-center justify-between">
                    <div class="flex flex-row gap-x-3">
                        <User :size="20" />
                        <span>Createur</span>
                    </div>
                    <span class="text-black/80 font-semibold">Jules ARIMANANA</span>
                </div>
                <div class="flex flex-row item-center justify-between">
                    <div class="flex flex-row gap-x-3">
                        <Calendar :size="20" />
                        <span>Création</span>
                    </div>
                    <span class="text-black/80 font-semibold">Jules ARIMANANA</span>
                </div>
                <div class="flex flex-row item-center justify-between">
                    <div class="flex flex-row gap-x-3">
                        <TimerReset :size="20" />
                        <span>Dernière modif.</span>
                    </div>
                    <span class="text-black/80 font-semibold">Jules ARIMANANA</span>
                </div>
                <div class="flex flex-row item-center justify-between">
                    <div class="flex flex-row gap-x-3">
                        <UserCheck2 :size="20" />
                        <span>Inspecteur</span>
                    </div>
                    <span class="text-black/80 font-semibold">Jules ARIMANANA</span>
                </div>

            </div>
        </div>
        <div class="flex flex-col gap-y-2 p-4">
            <h5>Détails des sections</h5>
            <div class="space-y-4">

                <div v-for="section in sections" :key="section.id" class="
      overflow-hidden
      rounded-3xl
      border
      border-gray-200
      bg-white
    ">
                    <!-- HEADER -->

                    <button class="
        flex
        w-full
        items-center
        justify-between
        p-5
      " @click="toggleSection(section.id)">
                        <div class="
          flex
          items-start
          gap-3
        ">
                            <component :is="section.icon" :size="18" class="
            mt-1
            text-primary
          " />

                            <div class="text-left">
                                <h5>
                                    {{ section.id }}.
                                    {{ section.title }}
                                </h5>

                                <p class="
              text-sm
              text-gray-500
            ">
                                    {{ section.description }}
                                </p>
                            </div>
                        </div>

                        <div class="
          flex
          items-center
          gap-3
        ">
                            <span class="
            rounded-full
            bg-gray-100
            px-3
            py-1
            text-xs
          ">
                                {{ section.questions.length }}
                                Questions
                            </span>

                            <ChevronUp v-if="section.isOpen" :size="18" />

                            <ChevronDown v-else :size="18" />
                        </div>
                    </button>

                    <!-- QUESTIONS -->

                    <transition name="accordion">
                        <div v-if="section.isOpen" class="
        border-t
        border-gray-200
        bg-gray-50/60
        p-4
        space-y-3
      ">
                            <div v-for="question in section.questions" :key="question.id" class="
          rounded-2xl
          border
          bg-white
          p-4
        " :class="question.status ===
            'NON_CONFORME'
            ? 'border-red-200 bg-red-50/40'
            : 'border-gray-200'
            ">
                                <!-- QUESTION -->

                                <div class="
            flex
            items-start
            justify-between
            gap-3
          ">
                                    <h5>
                                        {{ section.id }}.{{
                                            question.id
                                        }}
                                        {{ question.question }}
                                    </h5>

                                    <span v-if="
                                        question.status ===
                                        'CONFORME'
                                    " class="
              rounded-full
              bg-green-100
              px-3
              py-1
              text-xs
              text-green-700
            ">
                                        Conforme
                                    </span>

                                    <span v-else class="
              rounded-full
              bg-red-100
              px-3
              py-1
              text-xs
              text-red-700
            ">
                                        Non conforme
                                    </span>
                                </div>

                                <!-- REPONSE -->

                                <div class="mt-4">
                                    <span class="
              text-xs
              font-semibold
              text-gray-500
            ">
                                        RÉPONSE
                                    </span>

                                    <p class="mt-1">
                                        {{ question.response }}
                                    </p>
                                </div>

                               

                                <!-- ACTION -->

                                <div v-if="question.action" class="
            mt-4
            rounded-xl
            border
            border-gray-200
            bg-white
            p-4
          ">
                                    <div class="
              mb-3
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
            ">
                                        <ClipboardCheck :size="14" />

                                        ACTION CORRECTIVE
                                    </div>

                                    <h5>
                                        {{ question.action.title }}
                                    </h5>

                                    <div class="
              mt-3
              flex
              flex-wrap
              items-center
              gap-3
              text-xs
            ">
                                      

                                        <span>
                                            👤
                                            {{
                                                question.action
                                                    .responsible
                                            }}
                                        </span>

                                        <span>
                                            📅
                                            {{
                                                question.action
                                                    .dueDate
                                            }}
                                        </span>

                                        <span class="
                ml-auto
                rounded-full
                bg-blue-100
                px-2
                py-1
                text-blue-700
              ">
                                            {{
                                                question.action
                                                    .status
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>

            </div>
        </div>

    </div>
</template>
<style scoped>
.accordion-enter-active,
.accordion-leave-active {
    overflow: hidden;
    transition:
        max-height 0.3s ease,
        opacity 0.3s ease;
}

.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
    opacity: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    max-height: 2000px;
    opacity: 1;
}
</style>
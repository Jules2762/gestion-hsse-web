<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto"
  >
    <div
      class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
    >
      <!-- HEADER DU MODAL -->
      <div class="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50/70 shrink-0">
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
            :style="{ backgroundColor: typeColor(form.type) }"
          >
            {{ typeEmoji(form.type) }}
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">
              {{ isEditing ? 'Modifier le contact d’urgence' : 'Nouveau service de secours' }}
            </h3>
            <p class="text-xs text-gray-500">
              Référencement d'un service d'urgence, ligne d'appel directe et rattachement aux sites Galana.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="onClose"
          class="h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- FORMULAIRE (SCROLLABLE) -->
      <form @submit.prevent="handleSubmit" class="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
        <!-- 1. TYPE DE SERVICE & NOM -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">
              Type de secours <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-primary focus:bg-white"
            >
              <option value="POMPIER">🚒 Sapeurs-Pompiers</option>
              <option value="HOPITAL">🏥 Hôpital / Clinique</option>
              <option value="AMBULANCE">🚑 Ambulance / SAMU</option>
              <option value="POLICE">👮 Police Nationale</option>
              <option value="GENDARMERIE">🛡️ Gendarmerie</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block font-semibold text-gray-700 mb-1">
              Nom de l'établissement / Brigade <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="ex: C.U.A Tsarlatana, HJRA Antananarivo..."
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary"
            />
          </div>
        </div>

        <!-- 2. LOCALISATION & COORDONNÉES GPS -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">
              Localité / Ville <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.locality"
              type="text"
              required
              placeholder="ex: ANTANANARIVO, TOAMASINA..."
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label class="block font-semibold text-gray-700 mb-1">
              Latitude GPS
            </label>
            <input
              v-model.number="form.latitude"
              type="number"
              step="any"
              placeholder="ex: -18.9055"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary font-mono"
            />
          </div>

          <div>
            <label class="block font-semibold text-gray-700 mb-1">
              Longitude GPS
            </label>
            <input
              v-model.number="form.longitude"
              type="number"
              step="any"
              placeholder="ex: 47.5250"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary font-mono"
            />
          </div>
        </div>

        <!-- 3. LIGNES TÉLÉPHONIQUES -->
        <div class="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-3">
          <span class="text-[11px] font-bold text-gray-800 uppercase tracking-wider block">
            📞 Coordonnées Téléphoniques & Contact
          </span>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold text-gray-700 mb-1">
                Ligne Principale 1 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.contact_1"
                type="text"
                required
                placeholder="ex: 0344210142 ou 118"
                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 font-mono font-semibold outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">
                Ligne Secondaire 2
              </label>
              <input
                v-model="form.contact_2"
                type="text"
                placeholder="ex: 0202228054"
                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 font-mono outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">
                Ligne d'Urgence 3
              </label>
              <input
                v-model="form.contact_3"
                type="text"
                placeholder="ex: 0320780110"
                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 font-mono outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label class="block font-semibold text-gray-700 mb-1">Adresse e-mail</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="ex: pompiers.tana@galana.mg"
                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-1">Adresse postale / Quartier</label>
              <input
                v-model="form.address"
                type="text"
                placeholder="ex: Tsaralalana, Analakely..."
                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <!-- 4. RATTACHEMENT AUX STATIONS GALANA -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block font-semibold text-gray-700">
              Stations-Service Galana couvertes
            </label>
            <span class="text-[11px] text-gray-500 font-medium">
              {{ selectedSiteIds.length }} station(s) sélectionnée(s)
            </span>
          </div>

          <div class="border border-gray-200 rounded-xl p-2.5 max-h-36 overflow-y-auto bg-gray-50/50 space-y-1">
            <div
              v-for="site in availableSites"
              :key="site.id"
              class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white transition cursor-pointer"
              @click="toggleSiteSelection(site.id)"
            >
              <input
                type="checkbox"
                :checked="selectedSiteIds.includes(site.id)"
                class="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                @click.stop
                @change="toggleSiteSelection(site.id)"
              />
              <span class="text-xs font-semibold text-gray-800">⛽ {{ site.name }}</span>
              <span class="text-[10px] text-gray-400">({{ site.code || site.locality || 'Station' }})</span>
            </div>
          </div>
        </div>

        <!-- 5. CONSIGNES & NOTES -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">
            Consignes d'urgence & Notes opérationnelles
          </label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="ex: Contacter en priorité pour tout départ de feu sur la piste distribution..."
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none focus:border-primary resize-none"
          ></textarea>
        </div>
      </form>

      <!-- PIED DE MODAL AVEC ACTIONS -->
      <div class="flex items-center justify-end gap-2 p-4 border-t border-gray-100 bg-slate-50 shrink-0">
        <button
          type="button"
          @click="onClose"
          class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
        >
          Annuler
        </button>

        <button
          type="button"
          :disabled="isSubmitting"
          @click="handleSubmit"
          class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
        >
          <Loader2 v-if="isSubmitting" :size="14" class="animate-spin" />
          <span>{{ isEditing ? 'Enregistrer les modifications' : 'Créer le contact d’urgence' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, X } from "@lucide/vue";
import { computed, ref, watch } from "vue";
import type {
  EmergencyContactFormType,
  EmergencyContactType,
  EmergencyType,
} from "../../../../@types/EmergencyContact.type";

interface Props {
  isOpen: boolean;
  contact?: EmergencyContactType | null;
  availableSites?: Array<{ id: number; name: string; code?: string; locality?: string }>;
  isSubmitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  contact: null,
  availableSites: () => [],
  isSubmitting: false,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", form: EmergencyContactFormType): void;
}>();

const isEditing = computed(() => !!props.contact);

const form = ref<EmergencyContactFormType>({
  type: "POMPIER",
  name: "",
  locality: "",
  latitude: null,
  longitude: null,
  contact_1: "",
  contact_2: "",
  contact_3: "",
  email: "",
  address: "",
  notes: "",
  site_ids: [],
});

const selectedSiteIds = ref<number[]>([]);

watch(
  () => props.contact,
  (newVal) => {
    if (newVal) {
      form.value = {
        type: newVal.type,
        name: newVal.name,
        locality: newVal.locality || "",
        latitude: newVal.latitude || null,
        longitude: newVal.longitude || null,
        contact_1: newVal.contact_1 || "",
        contact_2: newVal.contact_2 || "",
        contact_3: newVal.contact_3 || "",
        email: newVal.email || "",
        address: newVal.address || "",
        notes: newVal.notes || "",
        site_ids: newVal.sites ? newVal.sites.map((s) => s.id) : [],
      };
      selectedSiteIds.value = newVal.sites ? newVal.sites.map((s) => s.id) : [];
    } else {
      form.value = {
        type: "POMPIER",
        name: "",
        locality: "",
        latitude: null,
        longitude: null,
        contact_1: "",
        contact_2: "",
        contact_3: "",
        email: "",
        address: "",
        notes: "",
        site_ids: [],
      };
      selectedSiteIds.value = [];
    }
  },
  { immediate: true }
);

function toggleSiteSelection(id: number) {
  const index = selectedSiteIds.value.indexOf(id);
  if (index >= 0) {
    selectedSiteIds.value.splice(index, 1);
  } else {
    selectedSiteIds.value.push(id);
  }
}

function handleSubmit() {
  if (!form.value.name.trim() || !form.value.contact_1.trim()) {
    return;
  }
  form.value.site_ids = [...selectedSiteIds.value];
  emit("submit", { ...form.value });
}

function onClose() {
  emit("close");
}

function typeColor(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return "#DC2626";
    case "HOPITAL":
      return "#059669";
    case "AMBULANCE":
      return "#0284C7";
    case "POLICE":
      return "#4F46E5";
    case "GENDARMERIE":
      return "#7C3AED";
    default:
      return "#EA580C";
  }
}

function typeEmoji(type: EmergencyType | string) {
  switch (type) {
    case "POMPIER":
      return "🚒";
    case "HOPITAL":
      return "🏥";
    case "AMBULANCE":
      return "🚑";
    case "POLICE":
      return "👮";
    case "GENDARMERIE":
      return "🛡️";
    default:
      return "🚨";
  }
}
</script>

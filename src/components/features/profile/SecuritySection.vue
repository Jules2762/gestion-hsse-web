<!-- src/components/features/profile/SecuritySection.vue -->
<script setup lang="ts">
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Lock,
  Smartphone,
  History,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  HardHat
} from '@lucide/vue'
import type { ProfileUser } from '../../../views/home/profile/ProfilePage.vue'

defineProps<{ user: ProfileUser }>()
const emit = defineEmits<{ (e: 'open-password-modal'): void }>()
</script>

<template>
  <div class="flex flex-col gap-6 p-1">
    <!-- SECTION 1 : STATUT DE SECURITE DU COMPTE -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#0F9D58]">
            <ShieldCheck class="h-4 w-4" />
          </div>
          <h4 class="text-sm font-semibold text-slate-800">Sécurité & Authentification</h4>
        </div>
        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Compte Sécurisé
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Mot de passe -->
        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-4">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs border border-slate-200">
            <Lock class="h-4 w-4 text-[#0F9D58]" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <p class="text-xs font-medium text-slate-500">Mot de passe</p>
              <span class="text-[11px] font-semibold text-emerald-600">Protégé</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 mt-0.5">Chiffré avec algorithme Bcrypt</p>
            <p class="text-[11px] text-slate-500 mt-1">
              Conforme aux exigences de complexité Galana (minimum 8 caractères, majuscules, chiffres).
            </p>
            <div class="mt-3">
              <button
                type="button"
                @click="emit('open-password-modal')"
                class="inline-flex items-center gap-1.5 rounded-lg bg-[#0F9D58] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0c8248] cursor-pointer"
              >
                <KeyRound class="h-3.5 w-3.5" />
                <span>Modifier mon mot de passe</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Session & Token -->
        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-4">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs border border-slate-200">
            <KeyRound class="h-4 w-4 text-blue-600" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <p class="text-xs font-medium text-slate-500">Gestion des jetons d'accès</p>
              <span class="text-[11px] font-semibold text-blue-600">Sanctum API</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 mt-0.5">Session chiffrée SSL / HTTPS</p>
            <p class="text-[11px] text-slate-500 mt-1">
              Les communications entre l'application et l'API sont entièrement cryptées de bout en bout.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2 : CHARTE & CONFORMITE HSSE GALANA -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#0F9D58]">
          <HardHat class="h-4 w-4" />
        </div>
        <h4 class="text-sm font-semibold text-slate-800">Engagements de Conformité HSSE</h4>
      </div>

      <div class="space-y-3">
        <div class="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3.5">
          <CheckCircle2 class="h-5 w-5 shrink-0 text-[#0F9D58] mt-0.5" />
          <div>
            <h5 class="text-xs font-bold text-slate-800">Politique Zéro Incident & Sécurité au Travail</h5>
            <p class="text-xs text-slate-600 mt-0.5">
              Toute intervention ou vérification sur site doit être consignée avec rigueur. Les fiches VMC et les checklists terrain font foi de conformité légale et opérationnelle.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
          <ShieldAlert class="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <h5 class="text-xs font-bold text-slate-800">Confidentialité des Audits & Données Sensibles</h5>
            <p class="text-xs text-slate-600 mt-0.5">
              Les identifiants d'accès sont strictement personnels. Le partage de session ou de compte est proscrit afin de préserver l'intégrité de la traçabilité des opérations.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
          <History class="h-5 w-5 shrink-0 text-indigo-600 mt-0.5" />
          <div>
            <h5 class="text-xs font-bold text-slate-800">Traçabilité & Journalisation Obligatoire</h5>
            <p class="text-xs text-slate-600 mt-0.5">
              Chaque validation d'inspection, modification de document ou clôture d'action corrective est enregistrée avec horodatage certifié dans les journaux d'audit du système.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 3 : CONTACT ASSISTANCE DSI / HSSE -->
    <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
          <HelpCircle class="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h5 class="text-xs font-bold text-slate-800">Besoin d'une modification de droits ou d'un support ?</h5>
          <p class="text-xs text-slate-500">Contactez l'administrateur système ou le référent HSSE Galana de votre site.</p>
        </div>
      </div>
      <a
        href="mailto:support-hsse@galana.mg"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 shrink-0"
      >
        <span>Contacter le support</span>
        <ExternalLink class="h-3.5 w-3.5 text-slate-400" />
      </a>
    </div>
  </div>
</template>

<template>
    <header class="flex w-full flex-col border-b border-gray-200 bg-white">
        <div class="flex flex-row items-center justify-between gap-x-4 px-6 py-3">
            <!-- Titre + fil d'Ariane -->
            <div class="flex min-w-0 flex-col gap-y-1">
                <h5 v-if="title" class="truncate">{{ t(title) }}</h5>

                <nav v-if="thumbnails?.length" :aria-label="t('header.breadcrumb')">
                    <ol class="flex flex-row items-center gap-x-2 text-xs font-semibold text-slate-600">
                        <li v-for="(item, index) in thumbnails" :key="item.name" class="flex items-center gap-x-2">
                            <button type="button"
                                class="rounded transition-colors hover:text-slate-800 focus-visible:outline focus-visible:outline-primary"
                                :class="isActive(item.name) ? 'text-primary' : ''"
                                :aria-current="isActive(item.name) ? 'page' : undefined"
                                @click="router.push({ name: item.name })">
                                {{ t(item.label) }}
                            </button>
                            <ChevronRight v-if="index < thumbnails.length - 1" :size="15" aria-hidden="true" />
                        </li>
                    </ol>
                </nav>
            </div>

            <!-- Actions -->
            <div class="flex flex-row items-center gap-x-5">
                <form v-if="showSearch" role="search" class="w-64 lg:w-80" @submit.prevent>
                    <Input :icon="SearchIcon" v-model="search" :placeholder="t('header.search')"
                        :aria-label="t('header.search')" />
                </form>

                <div class="flex flex-row items-center gap-x-2">
                    <button type="button"
                        class="relative rounded-full p-2 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        :aria-label="t('header.notifications.open', { count: unreadCount })" @click="modalRight = true">
                        <BellIcon :size="20" />
                        <span v-if="unreadCount > 0"
                            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
                            {{ unreadCount > 9 ? '9+' : unreadCount }}
                        </span>
                    </button>

                    <button type="button"
                        class="rounded-full p-2 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        :aria-label="t('header.profile')" @click="router.push({ name: 'PROFILE' })">
                        <User2Icon :size="20" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Panneau de notifications -->
        <Teleport to="body">
            <RightModal :is-open="modalRight" @on-close="closeNotifications">
                <div class="flex h-full flex-col" @keydown.esc="closeNotifications">
                    <div class="flex items-start justify-between gap-x-3 border-b border-slate-200 p-4">
                        <div>
                            <h3>{{ t('header.notifications.title') }}</h3>
                            <p class="mt-1 text-sm text-slate-500">{{ t('header.notifications.subtitle') }}</p>
                        </div>
                        <button v-if="unreadCount > 0" type="button"
                            class="shrink-0 text-xs font-semibold text-primary hover:underline"
                            @click="notifications.viewed()">
                            {{ t('header.notifications.markAllRead') }}
                        </button>
                    </div>

                    <ul v-if="items.length" class="flex-1 overflow-y-auto">
                        <li v-for="(value, index) in items" :key="index"
                            class="group relative border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 focus-within:bg-slate-50"
                            :class="value.viewed ? '' : 'bg-primary/5'">
                            <div class="flex items-start justify-between gap-x-3">
                                <div class="min-w-0">
                                    <h5 class="text-sm font-semibold text-slate-800">
                                        <span v-if="!value.viewed"
                                            class="mr-2 inline-block h-2 w-2 rounded-full bg-red-600 align-middle"
                                            role="img" :aria-label="t('header.notifications.unread')"></span>
                                        {{ value.title }}
                                    </h5>
                                    <p v-if="value.description" class="mt-1 text-sm text-slate-500">
                                        {{ value.description }}
                                    </p>
                                    <span v-if="value.ago" class="mt-2 block text-xs text-slate-400">
                                        {{ value.ago }}
                                    </span>
                                </div>

                                <!-- Visible au hover, au focus clavier et sur écran tactile -->
                                <button type="button"
                                    class="shrink-0 rounded p-1 text-slate-400 transition-opacity hover:text-red-600 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:opacity-0 md:group-hover:opacity-100"
                                    :aria-label="t('header.notifications.delete')"
                                    @click="notifications.deleteOne(index)">
                                    <Trash2Icon :size="15" />
                                </button>
                            </div>
                        </li>
                    </ul>

                    <div v-else class="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                        <BellIcon :size="40" class="text-slate-300" aria-hidden="true" />
                        <div class="text-center">
                            <h4>{{ t('header.notifications.emptyTitle') }}</h4>
                            <p class="mt-1 text-sm text-slate-500">{{ t('header.notifications.emptyText') }}</p>
                        </div>
                    </div>
                </div>
            </RightModal>
        </Teleport>
    </header>
</template>

<script setup lang="ts">
    import { BellIcon, ChevronRight, SearchIcon, Trash2Icon, User2Icon } from '@lucide/vue';
    import { computed, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import Input from '../ui/Input.vue';
    import RightModal from '../ui/rightModal.vue';
    import { useNotificationStore } from '../../services/useNotificationStore.ts';

    type Thumbnail = { label: string; name: string };

    const props = defineProps<{
        title?: string;
        showSearch?: boolean;
        thumbnails?: Thumbnail[];
        modelValue?: string;
    }>();
    const emit = defineEmits<{ (e: 'update:modelValue', value: string | undefined): void }>();

    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const notifications = useNotificationStore();

    const modalRight = ref(false);

    const search = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value),
    });

    const items = computed(() => notifications.getData);
    const unreadCount = computed(() => items.value.filter((n) => !n.viewed).length);

    const isActive = (name: string) => route.name === name;

    const closeNotifications = () => {
        modalRight.value = false;
        notifications.viewed();
    };
</script>
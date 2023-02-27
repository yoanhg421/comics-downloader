<template>
    <div>
        <q-btn flat round dense icon="add" @click="prompt = true">
            <q-dialog v-model="prompt" persistent>
                <q-card style="min-width: 600px">
                    <q-card-section>
                        <div class="text-h6">Source URL</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input
                            dense
                            v-model="sourceURL"
                            autofocus
                            @keyup.enter="installSource"
                        />
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn
                            flat
                            label="Cancel"
                            v-close-popup
                            @click="sourceURL = ''"
                        />
                        <q-btn
                            flat
                            label="Add Source"
                            v-close-popup
                            @click="installSource"
                        />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </q-btn>

        <q-splitter
            v-model="splitterModel"
            style="height: calc(100vh - 3.2rem)"
        >
            <template v-slot:before>
                <q-tabs v-model="tab" vertical class="text-teal">
                    <q-tab
                        v-for="source in store.sources2"
                        :key="source.id"
                        :name="source.id"
                        :label="source.name"
                    />
                </q-tabs>
            </template>

            <template v-slot:after>
                <q-tab-panels
                    v-model="tab"
                    animated
                    swipeable
                    vertical
                    transition-prev="jump-up"
                    transition-next="jump-up"
                >
                    <q-tab-panel
                        v-for="source in store.sources2"
                        :key="source.id"
                        :name="source.id"
                    >
                        <div class="text-h4 q-mb-md">{{ source.name }}</div>
                        <p>{{ source.desc }}</p>
                        <p>{{ source.author }}</p>
                        <p>{{ source.website }}</p>
                        <div>
                            <q-btn-toggle
                                v-model="source.enabled"
                                class="q-mr-md"
                                rounded
                                unelevated
                                toggle-color="primary"
                                color="white"
                                text-color="primary"
                                :options="[
                                    { label: 'Disable', value: false },
                                    { label: 'Enable', value: true },
                                ]"
                            />
                            <q-btn
                                label="Remove"
                                color="red"
                                flat
                                rounded
                                @click="removeSource(source.id)"
                            />
                        </div>
                    </q-tab-panel>
                </q-tab-panels>
            </template>
        </q-splitter>
    </div>
</template>

<script lang="ts" setup>
import { MangaStore } from '../stores/manga-store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getSources, loadSource } from '../helpers/functions'

const router = useRouter()

const prompt = ref(false)
const sourceURL = ref('https://thenetsky.github.io/extensions-generic/nepnep')

const store = MangaStore()
const tab = ref('MangaLife')
const splitterModel = ref(30)

async function installSource() {
    prompt.value = false
    //@ts-expect-error api
    const response = await api.installSource(sourceURL.value)
    console.log(response)
    sourceURL.value = ''
    await getSources()
    if (
        Object.values(store.sources2).length != 0 &&
        store.currentSource.id == undefined
    ) {
        store.currentSource = Object.values(store.sources2)[0]
        await loadSource()
    }
    router.back()
}

async function removeSource(souceId: string) {
    //@ts-expect-error api
    await api.removeSource(souceId)
    getSources()
}
</script>

<style lang="sass" scoped></style>

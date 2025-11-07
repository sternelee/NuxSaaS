<i18n src="./index.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: false
})

const { t } = useI18n()

const title = t('textToImage.title')
const desc = t('textToImage.description')

useSeoMeta({
  title,
  description: desc,
  ogTitle: title,
  ogDescription: desc,
  twitterTitle: title,
  twitterDescription: desc
})

// State
const prompt = ref('')
const negativePrompt = ref('')
const isGenerating = ref(false)
const generatedImages = ref<string[]>([])

// Settings
const selectedStyle = ref('realistic')
const aspectRatio = ref('square')
const numberOfImages = ref(1)
const guidanceScale = ref(7.5)
const steps = ref(30)

const styles = computed(() => [
  { value: 'realistic', label: t('textToImage.styles.realistic'), icon: 'i-lucide-camera' },
  { value: 'anime', label: t('textToImage.styles.anime'), icon: 'i-lucide-sparkles' },
  { value: 'digital-art', label: t('textToImage.styles.digitalArt'), icon: 'i-lucide-palette' },
  { value: 'watercolor', label: t('textToImage.styles.watercolor'), icon: 'i-lucide-droplet' },
  { value: 'oil-painting', label: t('textToImage.styles.oilPainting'), icon: 'i-lucide-paintbrush' },
  { value: 'sketch', label: t('textToImage.styles.sketch'), icon: 'i-lucide-pencil' },
  { value: 'pixel-art', label: t('textToImage.styles.pixelArt'), icon: 'i-lucide-grid-3x3' },
  { value: 'cyberpunk', label: t('textToImage.styles.cyberpunk'), icon: 'i-lucide-cpu' }
])

const aspectRatios = computed(() => [
  { value: 'square', label: t('textToImage.aspectRatios.square'), ratio: '1:1', icon: 'i-lucide-square' },
  { value: 'landscape', label: t('textToImage.aspectRatios.landscape'), ratio: '16:9', icon: 'i-lucide-rectangle-horizontal' },
  { value: 'portrait', label: t('textToImage.aspectRatios.portrait'), ratio: '9:16', icon: 'i-lucide-rectangle-vertical' },
  { value: 'wide', label: t('textToImage.aspectRatios.wide'), ratio: '21:9', icon: 'i-lucide-rectangle-horizontal' }
])

const imageCountOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 4, label: '4' },
  { value: 6, label: '6' }
]

const promptSuggestions = computed(() => [
  t('textToImage.suggestions.landscape'),
  t('textToImage.suggestions.portrait'),
  t('textToImage.suggestions.abstract'),
  t('textToImage.suggestions.fantasy')
])

const usePromptSuggestion = (suggestion: string) => {
  prompt.value = suggestion
}

const generateImage = async () => {
  if (!prompt.value.trim())
    return

  isGenerating.value = true
  generatedImages.value = []

  // Simulate AI generation (in real app, call AI API here)
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Generate multiple images based on numberOfImages
  for (let i = 0; i < numberOfImages.value; i++) {
    generatedImages.value.push(`https://picsum.photos/seed/${Date.now() + i}/512/512`)
  }

  isGenerating.value = false
}

const downloadImage = (url: string, index: number) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `generated-image-${index + 1}-${Date.now()}.png`
  link.click()
}

const downloadAllImages = () => {
  generatedImages.value.forEach((url, index) => {
    setTimeout(() => downloadImage(url, index), index * 500)
  })
}

const clearResults = () => {
  generatedImages.value = []
}
</script>

<template>
  <NuxtLayout name="default">
    <template #nav-center>
      <SiteNavigation
        mode="desktop"
        class="hidden sm:flex"
      />
    </template>
    <template #nav-right>
      <div class="flex items-center gap-2">
        <UserNavigation />
        <SiteNavigation
          mode="mobile"
          class="flex sm:hidden"
        />
      </div>
    </template>
    <div class="pt-16 min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <UContainer class="py-8">
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Left Panel - Controls -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Header -->
            <div>
              <h1 class="text-2xl font-bold mb-2">
                {{ t('textToImage.pageTitle') }}
              </h1>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ t('textToImage.pageDescription') }}
              </p>
            </div>

            <!-- Prompt Input -->
            <UCard>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-2">
                    {{ t('textToImage.prompt') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <UTextarea
                    v-model="prompt"
                    :placeholder="t('textToImage.promptPlaceholder')"
                    :rows="4"
                    size="lg"
                  />
                  <!-- Prompt Suggestions -->
                  <div class="mt-2 flex flex-wrap gap-2">
                    <button
                      v-for="suggestion in promptSuggestions"
                      :key="suggestion"
                      class="text-xs px-2 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
                      @click="usePromptSuggestion(suggestion)"
                    >
                      <UIcon
                        name="i-lucide-lightbulb"
                        class="w-3 h-3 inline mr-1"
                      />
                      {{ suggestion.substring(0, 30) }}...
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">
                    {{ t('textToImage.negativePrompt') }}
                  </label>
                  <UTextarea
                    v-model="negativePrompt"
                    :placeholder="t('textToImage.negativePromptPlaceholder')"
                    :rows="2"
                  />
                </div>
              </div>
            </UCard>

            <!-- Style Selection -->
            <UCard>
              <div>
                <label class="block text-sm font-medium mb-3">
                  {{ t('textToImage.style') }}
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="style in styles"
                    :key="style.value"
                    class="p-3 rounded-lg border text-sm transition-all text-left flex items-center gap-2"
                    :class="selectedStyle === style.value
                      ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300'
                      : 'bg-white border-neutral-200 hover:border-purple-200 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-purple-700'"
                    @click="selectedStyle = style.value"
                  >
                    <UIcon
                      :name="style.icon"
                      class="w-4 h-4"
                    />
                    <span>{{ style.label }}</span>
                  </button>
                </div>
              </div>
            </UCard>

            <!-- Settings -->
            <UCard>
              <div class="space-y-4">
                <h3 class="text-sm font-medium">
                  {{ t('textToImage.settings') }}
                </h3>

                <!-- Aspect Ratio -->
                <div>
                  <label class="block text-sm mb-2">
                    {{ t('textToImage.aspectRatio') }}
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="ratio in aspectRatios"
                      :key="ratio.value"
                      class="p-2 rounded-lg border text-xs transition-all"
                      :class="aspectRatio === ratio.value
                        ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300'
                        : 'bg-white border-neutral-200 hover:border-purple-200 dark:bg-neutral-800 dark:border-neutral-700'"
                      @click="aspectRatio = ratio.value"
                    >
                      <UIcon
                        :name="ratio.icon"
                        class="w-4 h-4 mx-auto mb-1"
                      />
                      <div class="font-medium">
                        {{ ratio.label }}
                      </div>
                      <div class="text-neutral-500">
                        {{ ratio.ratio }}
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Number of Images -->
                <div>
                  <label class="block text-sm mb-2">
                    {{ t('textToImage.numberOfImages') }}
                  </label>
                  <div class="flex gap-2">
                    <button
                      v-for="option in imageCountOptions"
                      :key="option.value"
                      class="flex-1 p-2 rounded-lg border text-sm transition-all"
                      :class="numberOfImages === option.value
                        ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300'
                        : 'bg-white border-neutral-200 hover:border-purple-200 dark:bg-neutral-800 dark:border-neutral-700'"
                      @click="numberOfImages = option.value"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>

                <!-- Advanced Settings (Collapsed) -->
                <details class="group">
                  <summary class="cursor-pointer text-sm font-medium list-none flex items-center justify-between">
                    {{ t('textToImage.advancedSettings') }}
                    <UIcon
                      name="i-lucide-chevron-down"
                      class="w-4 h-4 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div class="mt-4 space-y-4">
                    <!-- Guidance Scale -->
                    <div>
                      <label class="block text-sm mb-2">
                        {{ t('textToImage.guidanceScale') }}: {{ guidanceScale }}
                      </label>
                      <input
                        v-model.number="guidanceScale"
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        class="w-full"
                      >
                      <div class="flex justify-between text-xs text-neutral-500 mt-1">
                        <span>{{ t('textToImage.creative') }}</span>
                        <span>{{ t('textToImage.precise') }}</span>
                      </div>
                    </div>

                    <!-- Steps -->
                    <div>
                      <label class="block text-sm mb-2">
                        {{ t('textToImage.steps') }}: {{ steps }}
                      </label>
                      <input
                        v-model.number="steps"
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        class="w-full"
                      >
                      <div class="flex justify-between text-xs text-neutral-500 mt-1">
                        <span>{{ t('textToImage.faster') }}</span>
                        <span>{{ t('textToImage.quality') }}</span>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </UCard>

            <!-- Generate Button -->
            <UButton
              size="lg"
              color="primary"
              :loading="isGenerating"
              :disabled="!prompt.trim()"
              block
              @click="generateImage"
            >
              <template #leading>
                <UIcon name="i-lucide-wand-2" />
              </template>
              {{ t('textToImage.generate') }}
            </UButton>
          </div>

          <!-- Right Panel - Results -->
          <div class="lg:col-span-2">
            <UCard class="min-h-[600px]">
              <!-- Empty State -->
              <div
                v-if="generatedImages.length === 0 && !isGenerating"
                class="flex flex-col items-center justify-center h-[550px] text-center"
              >
                <UIcon
                  name="i-lucide-image-plus"
                  class="w-24 h-24 text-neutral-300 dark:text-neutral-600 mb-4"
                />
                <h3 class="text-lg font-semibold mb-2">
                  {{ t('textToImage.noImages') }}
                </h3>
                <p class="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
                  {{ t('textToImage.noImagesDescription') }}
                </p>
              </div>

              <!-- Loading State -->
              <div
                v-if="isGenerating"
                class="flex flex-col items-center justify-center h-[550px]"
              >
                <div class="relative">
                  <div class="w-24 h-24 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" />
                  <UIcon
                    name="i-lucide-wand-2"
                    class="w-8 h-8 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <p class="mt-6 text-neutral-600 dark:text-neutral-400">
                  {{ t('textToImage.generating') }}
                </p>
                <p class="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                  {{ t('textToImage.generatingDescription') }}
                </p>
              </div>

              <!-- Generated Images -->
              <div
                v-if="generatedImages.length > 0"
                class="space-y-4"
              >
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold">
                    {{ t('textToImage.results') }} ({{ generatedImages.length }})
                  </h3>
                  <div class="flex gap-2">
                    <UButton
                      size="sm"
                      variant="outline"
                      @click="downloadAllImages"
                    >
                      <template #leading>
                        <UIcon name="i-lucide-download" />
                      </template>
                      {{ t('textToImage.downloadAll') }}
                    </UButton>
                    <UButton
                      size="sm"
                      variant="ghost"
                      color="neutral"
                      @click="clearResults"
                    >
                      {{ t('textToImage.clear') }}
                    </UButton>
                  </div>
                </div>

                <div
                  class="grid gap-4"
                  :class="{
                    'grid-cols-1': numberOfImages === 1,
                    'grid-cols-2': numberOfImages === 2 || numberOfImages === 4,
                    'grid-cols-3': numberOfImages === 6
                  }"
                >
                  <div
                    v-for="(image, index) in generatedImages"
                    :key="index"
                    class="group relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                  >
                    <img
                      :src="image"
                      :alt="`Generated image ${index + 1}`"
                      class="w-full h-auto"
                    >
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <UButton
                        size="sm"
                        @click="downloadImage(image, index)"
                      >
                        <template #leading>
                          <UIcon name="i-lucide-download" />
                        </template>
                        {{ t('textToImage.download') }}
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </UContainer>
    </div>
  </NuxtLayout>
</template>

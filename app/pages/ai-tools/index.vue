<i18n src="./index.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: false
})

const { t } = useI18n()

const title = t('aiTools.title')
const desc = t('aiTools.description')

useSeoMeta({
  title,
  description: desc,
  ogTitle: title,
  ogDescription: desc,
  twitterTitle: title,
  twitterDescription: desc
})

const selectedTool = ref('text-to-image')
const prompt = ref('')
const imageUrl = ref('')
const isGenerating = ref(false)
const uploadedImage = ref<File | null>(null)
const uploadedImageUrl = ref('')

const tools = computed(() => [
  {
    id: 'text-to-image',
    icon: 'i-lucide-image-plus',
    title: t('aiTools.tools.textToImage.title'),
    description: t('aiTools.tools.textToImage.description')
  },
  {
    id: 'image-to-image',
    icon: 'i-lucide-images',
    title: t('aiTools.tools.imageToImage.title'),
    description: t('aiTools.tools.imageToImage.description')
  },
  {
    id: 'headshot',
    icon: 'i-lucide-user-circle',
    title: t('aiTools.tools.headshot.title'),
    description: t('aiTools.tools.headshot.description')
  },
  {
    id: 'logo',
    icon: 'i-lucide-square-asterisk',
    title: t('aiTools.tools.logo.title'),
    description: t('aiTools.tools.logo.description')
  },
  {
    id: 'tattoo',
    icon: 'i-lucide-brush',
    title: t('aiTools.tools.tattoo.title'),
    description: t('aiTools.tools.tattoo.description')
  },
  {
    id: 'background-remover',
    icon: 'i-lucide-eraser',
    title: t('aiTools.tools.backgroundRemover.title'),
    description: t('aiTools.tools.backgroundRemover.description')
  }
])

const styles = computed(() => [
  { value: 'realistic', label: t('aiTools.styles.realistic') },
  { value: 'anime', label: t('aiTools.styles.anime') },
  { value: 'digital-art', label: t('aiTools.styles.digitalArt') },
  { value: 'watercolor', label: t('aiTools.styles.watercolor') },
  { value: 'fantasy', label: t('aiTools.styles.fantasy') },
  { value: 'pixel-art', label: t('aiTools.styles.pixelArt') }
])

const selectedStyle = ref('realistic')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImageUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const generateImage = async () => {
  if (!prompt.value.trim())
    return

  isGenerating.value = true
  // Simulate AI generation (in real app, call AI API here)
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Use placeholder image for demo
  imageUrl.value = `https://picsum.photos/seed/${Date.now()}/512/512`
  isGenerating.value = false
}

const downloadImage = () => {
  if (imageUrl.value) {
    const link = document.createElement('a')
    link.href = imageUrl.value
    link.download = `generated-image-${Date.now()}.png`
    link.click()
  }
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
    <div class="pt-16">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl opacity-50" />
          <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl -mr-32 -mt-32 opacity-30" />
        </div>
        <UContainer class="relative py-16">
          <div class="text-center max-w-3xl mx-auto">
            <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {{ t('aiTools.hero.title') }}
            </h1>
            <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              {{ t('aiTools.hero.description') }}
            </p>
            <div class="flex gap-4 justify-center text-sm text-neutral-600 dark:text-neutral-400">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-check-circle"
                  class="text-green-500"
                />
                <span>{{ t('aiTools.hero.features.free') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-check-circle"
                  class="text-green-500"
                />
                <span>{{ t('aiTools.hero.features.unlimited') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-check-circle"
                  class="text-green-500"
                />
                <span>{{ t('aiTools.hero.features.noSignup') }}</span>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Tools Section -->
      <section class="py-12 bg-white dark:bg-neutral-800">
        <UContainer>
          <div class="grid lg:grid-cols-4 gap-6">
            <!-- Tool Selection Sidebar -->
            <div class="lg:col-span-1">
              <h3 class="text-lg font-semibold mb-4">
                {{ t('aiTools.selectTool') }}
              </h3>
              <div class="space-y-2">
                <button
                  v-for="tool in tools"
                  :key="tool.id"
                  class="w-full text-left p-4 rounded-lg border transition-all duration-200"
                  :class="selectedTool === tool.id
                    ? 'bg-purple-50 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700'
                    : 'bg-white border-neutral-200 hover:border-purple-200 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-purple-700'"
                  @click="selectedTool = tool.id"
                >
                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <UIcon
                        :name="tool.icon"
                        class="text-purple-600 dark:text-purple-400 w-5 h-5"
                      />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-sm mb-1">
                        {{ tool.title }}
                      </h4>
                      <p class="text-xs text-neutral-600 dark:text-neutral-400">
                        {{ tool.description }}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Main Content Area -->
            <div class="lg:col-span-3">
              <div class="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6">
                <!-- Text to Image Tool -->
                <div v-if="selectedTool === 'text-to-image'">
                  <h2 class="text-2xl font-bold mb-6">
                    {{ t('aiTools.tools.textToImage.title') }}
                  </h2>

                  <div class="space-y-4 mb-6">
                    <div>
                      <label class="block text-sm font-medium mb-2">
                        {{ t('aiTools.prompt') }}
                      </label>
                      <UTextarea
                        v-model="prompt"
                        :placeholder="t('aiTools.promptPlaceholder')"
                        :rows="4"
                        size="lg"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium mb-2">
                        {{ t('aiTools.style') }}
                      </label>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          v-for="style in styles"
                          :key="style.value"
                          class="p-3 rounded-lg border text-sm transition-all"
                          :class="selectedStyle === style.value
                            ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300'
                            : 'bg-white border-neutral-200 hover:border-purple-200 dark:bg-neutral-800 dark:border-neutral-700'"
                          @click="selectedStyle = style.value"
                        >
                          {{ style.label }}
                        </button>
                      </div>
                    </div>

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
                      {{ t('aiTools.generate') }}
                    </UButton>
                  </div>

                  <!-- Result Area -->
                  <div
                    v-if="imageUrl"
                    class="mt-6"
                  >
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-lg font-semibold">
                        {{ t('aiTools.result') }}
                      </h3>
                      <UButton
                        size="sm"
                        variant="outline"
                        @click="downloadImage"
                      >
                        <template #leading>
                          <UIcon name="i-lucide-download" />
                        </template>
                        {{ t('aiTools.download') }}
                      </UButton>
                    </div>
                    <div class="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                      <img
                        :src="imageUrl"
                        alt="Generated image"
                        class="w-full h-auto"
                      >
                    </div>
                  </div>
                </div>

                <!-- Image to Image Tool -->
                <div v-else-if="selectedTool === 'image-to-image'">
                  <h2 class="text-2xl font-bold mb-6">
                    {{ t('aiTools.tools.imageToImage.title') }}
                  </h2>

                  <div class="space-y-4 mb-6">
                    <div>
                      <label class="block text-sm font-medium mb-2">
                        {{ t('aiTools.uploadImage') }}
                      </label>
                      <div class="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center">
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          class="hidden"
                          @change="handleFileUpload"
                        >
                        <label
                          for="file-upload"
                          class="cursor-pointer"
                        >
                          <div
                            v-if="!uploadedImageUrl"
                            class="space-y-2"
                          >
                            <UIcon
                              name="i-lucide-upload"
                              class="w-12 h-12 mx-auto text-neutral-400"
                            />
                            <p class="text-neutral-600 dark:text-neutral-400">
                              {{ t('aiTools.clickToUpload') }}
                            </p>
                          </div>
                          <div v-else>
                            <img
                              :src="uploadedImageUrl"
                              alt="Uploaded"
                              class="max-w-xs mx-auto rounded-lg"
                            >
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium mb-2">
                        {{ t('aiTools.transformStyle') }}
                      </label>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          v-for="style in styles"
                          :key="style.value"
                          class="p-3 rounded-lg border text-sm transition-all"
                          :class="selectedStyle === style.value
                            ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/20 dark:border-purple-700'
                            : 'bg-white border-neutral-200 hover:border-purple-200 dark:bg-neutral-800 dark:border-neutral-700'"
                          @click="selectedStyle = style.value"
                        >
                          {{ style.label }}
                        </button>
                      </div>
                    </div>

                    <UButton
                      size="lg"
                      color="primary"
                      :disabled="!uploadedImage"
                      block
                    >
                      <template #leading>
                        <UIcon name="i-lucide-wand-2" />
                      </template>
                      {{ t('aiTools.transform') }}
                    </UButton>
                  </div>
                </div>

                <!-- Other Tools Placeholder -->
                <div v-else>
                  <h2 class="text-2xl font-bold mb-6">
                    {{ tools.find(t => t.id === selectedTool)?.title }}
                  </h2>
                  <div class="text-center py-12">
                    <UIcon
                      name="i-lucide-construction"
                      class="w-16 h-16 mx-auto mb-4 text-neutral-400"
                    />
                    <p class="text-neutral-600 dark:text-neutral-400">
                      {{ t('aiTools.comingSoon') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-neutral-50 dark:bg-neutral-900">
        <UContainer>
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">
              {{ t('aiTools.whyChoose.title') }}
            </h2>
            <p class="text-neutral-600 dark:text-neutral-400">
              {{ t('aiTools.whyChoose.description') }}
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <UCard class="text-center">
              <div class="p-3 bg-green-100 dark:bg-green-900/50 rounded-full w-fit mx-auto mb-4">
                <UIcon
                  name="i-lucide-infinity"
                  class="w-8 h-8 text-green-600 dark:text-green-400"
                />
              </div>
              <h3 class="text-lg font-semibold mb-2">
                {{ t('aiTools.whyChoose.features.unlimited.title') }}
              </h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ t('aiTools.whyChoose.features.unlimited.description') }}
              </p>
            </UCard>

            <UCard class="text-center">
              <div class="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit mx-auto mb-4">
                <UIcon
                  name="i-lucide-lock-open"
                  class="w-8 h-8 text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 class="text-lg font-semibold mb-2">
                {{ t('aiTools.whyChoose.features.noAccount.title') }}
              </h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ t('aiTools.whyChoose.features.noAccount.description') }}
              </p>
            </UCard>

            <UCard class="text-center">
              <div class="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full w-fit mx-auto mb-4">
                <UIcon
                  name="i-lucide-zap"
                  class="w-8 h-8 text-purple-600 dark:text-purple-400"
                />
              </div>
              <h3 class="text-lg font-semibold mb-2">
                {{ t('aiTools.whyChoose.features.fast.title') }}
              </h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ t('aiTools.whyChoose.features.fast.description') }}
              </p>
            </UCard>
          </div>
        </UContainer>
      </section>
    </div>
  </NuxtLayout>
</template>

import Replicate from 'replicate'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const {
    prompt,
    negativePrompt = '',
    style = 'realistic',
    aspectRatio = 'square',
    numberOfImages = 1,
    guidanceScale = 7.5,
    steps = 30,
  } = body

  // Validate required fields
  if (!prompt) {
    throw createError({
      statusCode: 400,
      message: 'Prompt is required',
    })
  }

  // Check for API token
  if (!config.replicateApiToken) {
    throw createError({
      statusCode: 500,
      message: 'Replicate API token not configured',
    })
  }

  try {
    const replicate = new Replicate({
      auth: config.replicateApiToken,
    })

    // Map aspect ratio to dimensions
    const dimensionsMap: Record<string, { width: number, height: number }> = {
      square: { width: 1024, height: 1024 },
      landscape: { width: 1344, height: 768 },
      portrait: { width: 768, height: 1344 },
      wide: { width: 1536, height: 640 },
    }

    const dimensions = dimensionsMap[aspectRatio] || dimensionsMap.square

    // Enhance prompt based on style
    const stylePrompts: Record<string, string> = {
      realistic: 'photorealistic, high quality, detailed',
      anime: 'anime style, cel shaded, vibrant colors',
      'digital-art': 'digital art, trending on artstation',
      watercolor: 'watercolor painting, soft colors',
      'oil-painting': 'oil painting, classical art style',
      sketch: 'pencil sketch, hand drawn',
      'pixel-art': 'pixel art, 8-bit style',
      cyberpunk: 'cyberpunk style, neon lights, futuristic',
    }

    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || ''}`

    // Generate images using FLUX.1 Schnell (fast model)
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: enhancedPrompt,
          num_outputs: numberOfImages,
          aspect_ratio: aspectRatio === 'square' ? '1:1' : aspectRatio === 'landscape' ? '16:9' : aspectRatio === 'portrait' ? '9:16' : '21:9',
          output_format: 'png',
          output_quality: 90,
          go_fast: true,
        },
      },
    ) as string[]

    return {
      success: true,
      images: output,
      metadata: {
        prompt: enhancedPrompt,
        negativePrompt,
        style,
        aspectRatio,
        numberOfImages,
        guidanceScale,
        steps,
      },
    }
  }
  catch (error: any) {
    console.error('Replicate API error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to generate images',
    })
  }
})

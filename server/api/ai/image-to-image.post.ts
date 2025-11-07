import Replicate from 'replicate'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const {
    imageUrl,
    prompt,
    negativePrompt = '',
    style = 'realistic',
    referenceStrength = 0.7,
    numberOfImages = 1,
    guidanceScale = 7.5,
    steps = 30,
  } = body

  // Validate required fields
  if (!imageUrl || !prompt) {
    throw createError({
      statusCode: 400,
      message: 'Image URL and prompt are required',
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

    // Enhance prompt based on style
    const stylePrompts: Record<string, string> = {
      realistic: 'photorealistic, high quality, detailed',
      anime: 'anime style, cel shaded, vibrant colors',
      'oil-painting': 'oil painting, classical art style',
      watercolor: 'watercolor painting, soft colors',
      fantasy: 'fantasy art, magical, epic',
      'pixel-art': 'pixel art, 8-bit style',
      sketch: 'pencil sketch, hand drawn',
      'digital-art': 'digital art, trending on artstation',
    }

    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || ''}`

    // Generate images using FLUX.1 Canny (image-to-image model)
    // Using FLUX dev model with image input
    const output = await replicate.run(
      'black-forest-labs/flux-dev',
      {
        input: {
          prompt: enhancedPrompt,
          image: imageUrl,
          num_outputs: numberOfImages,
          guidance: guidanceScale,
          num_inference_steps: steps,
          strength: 1 - referenceStrength, // Invert: higher referenceStrength = lower strength (more preservation)
          output_format: 'png',
          output_quality: 90,
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
        referenceStrength,
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
      message: error.message || 'Failed to transform images',
    })
  }
})

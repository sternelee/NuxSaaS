# Replicate AI Integration

This directory contains the server-side API endpoints for AI image generation using Replicate.

## Setup

1. Get your Replicate API token from [replicate.com](https://replicate.com/account/api-tokens)

2. Add the token to your `.env` file:
```
NUXT_REPLICATE_API_TOKEN=your-replicate-api-token-here
```

## API Endpoints

### POST /api/ai/text-to-image

Generate images from text descriptions.

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality",
  "style": "realistic",
  "aspectRatio": "square",
  "numberOfImages": 1,
  "guidanceScale": 7.5,
  "steps": 30
}
```

**Response:**
```json
{
  "success": true,
  "images": ["https://replicate.delivery/..."],
  "metadata": {
    "prompt": "...",
    "style": "realistic",
    ...
  }
}
```

### POST /api/ai/image-to-image

Transform existing images with AI.

**Request Body:**
```json
{
  "imageUrl": "data:image/png;base64,...",
  "prompt": "Transform into anime style",
  "negativePrompt": "distorted",
  "style": "anime",
  "referenceStrength": 0.7,
  "numberOfImages": 1,
  "guidanceScale": 7.5,
  "steps": 30
}
```

**Response:**
```json
{
  "success": true,
  "images": ["https://replicate.delivery/..."],
  "metadata": {
    "prompt": "...",
    "referenceStrength": 0.7,
    ...
  }
}
```

## Models Used

- **Text-to-Image**: `black-forest-labs/flux-schnell` - Fast, high-quality image generation
- **Image-to-Image**: `black-forest-labs/flux-dev` - Advanced image transformation with reference preservation

## Cost Considerations

Replicate charges based on compute time. The FLUX models are efficient:
- FLUX Schnell: ~$0.003 per image
- FLUX Dev: ~$0.03 per image

Monitor your usage at [replicate.com/account](https://replicate.com/account).

## Error Handling

All endpoints include comprehensive error handling:
- 400: Invalid request (missing required fields)
- 500: API configuration error or Replicate API failure

Errors are logged server-side and returned to the client with meaningful messages.

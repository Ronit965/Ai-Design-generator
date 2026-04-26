"""
HuggingFace service layer for AI UI code generation.

Handles all communication with the HuggingFace Inference API,
including prompt engineering and response parsing.
Uses Qwen2.5-Coder-7B-Instruct (the base model of UIGEN-T2-7B)
which is available on HuggingFace's free serverless Inference API.
"""

import re
import logging
from django.conf import settings
from huggingface_hub import InferenceClient

logger = logging.getLogger(__name__)


# ─── Style-specific prompt instructions ─────────────────────────
STYLE_INSTRUCTIONS = {
    'modern': (
        'Use a modern, sleek design with a dark background (#0f0f1a), '
        'purple accent colors (#7c5cfc), clean typography, subtle gradients, '
        'rounded corners, and smooth transitions. Use a professional, '
        'contemporary aesthetic.'
    ),
    'minimal': (
        'Use a minimalist design with a clean white/light background (#fafafa), '
        'black accent color (#111111), lots of whitespace, simple typography, '
        'and subtle borders. Keep the design clean and distraction-free.'
    ),
    'bold': (
        'Use a bold, striking design with a dark background (#0a0a0a), '
        'vibrant accent color (#ff3366), large typography, strong contrasts, '
        'and eye-catching visual elements. Make it impactful and energetic.'
    ),
    'glassmorphism': (
        'Use glassmorphism design with a dark background (#0d0d1a), '
        'semi-transparent cards with backdrop-filter: blur(), '
        'purple accent (#a78bfa), frosted glass effects, subtle borders '
        'with rgba colors, and layered depth.'
    ),
}

SYSTEM_PROMPT = """You are an expert frontend UI developer specializing in creating beautiful, modern web interfaces. Your task is to generate complete, production-quality HTML and CSS code.

STRICT RULES — follow them exactly:
1. Output ONLY a complete HTML document starting with <!DOCTYPE html>
2. Embed ALL CSS inside a single <style> tag in the <head>
3. Use modern CSS: flexbox, grid, gradients, transitions, border-radius, box-shadow
4. Include Google Fonts link for 'Inter' font in the <head>
5. MEDIA FILES ARE MANDATORY:
   - NEVER leave `src` empty or use relative paths/local files like "logo.png" or "avatar.jpg".
   - You MUST use absolute URLs from working placeholder APIs.
   - For images, ALWAYS use: `https://picsum.photos/seed/{random_word}/{width}/{height}`
   - Replace `{random_word}` with a UNIQUE word for EVERY SINGLE image (e.g., `seed/logo1/200/200`, `seed/user1/100/100`, `seed/user2/100/100`) so they are distinctly different.
   - For videos, use: `https://www.w3schools.com/html/mov_bbb.mp4`
6. Make the design responsive with media queries
7. Add hover effects and smooth transitions for interactivity
8. Do NOT include any JavaScript
10. Do NOT wrap output in markdown code fences (no ```)
11. Do NOT include any explanation text before or after the HTML

Start your response directly with <!DOCTYPE html>"""


def get_hf_client():
    """Create and return a HuggingFace Inference client."""
    token = settings.HF_API_TOKEN
    if not token or token == 'your_huggingface_api_token_here':
        raise ValueError(
            "HuggingFace API token is not configured. "
            "Please set HF_API_TOKEN in your backend/.env file. "
            "Get a free token at https://huggingface.co/settings/tokens"
        )
    return InferenceClient(token=token)


def build_prompt(user_prompt, style='modern'):
    """Build the full prompt with style instructions for the model."""
    style_instruction = STYLE_INSTRUCTIONS.get(style, STYLE_INSTRUCTIONS['modern'])

    full_prompt = (
        f"Create a UI design: {user_prompt}\n\n"
        f"Style requirements: {style_instruction}\n\n"
        f"Generate a complete HTML file with embedded CSS in a <style> tag. "
        f"Make it visually impressive and production-ready. "
        f"Automatically include relevant images and videos using public placeholder APIs. Ensure every image uses a UNIQUE URL parameter so they display differently."
    )

    return full_prompt


def parse_response(raw_response):
    """
    Parse the model response to extract HTML and CSS code.
    
    The model should output a complete HTML document with embedded <style> tags.
    We separate the CSS from the HTML for the frontend CodeViewer.
    """
    html_code = raw_response.strip()

    # Remove markdown code fences if the model wrapped its output
    # Handle ```html ... ``` pattern
    html_code = re.sub(r'^```(?:html)?\s*\n?', '', html_code)
    html_code = re.sub(r'\n?```\s*$', '', html_code)
    html_code = html_code.strip()

    # If the response doesn't start with <!DOCTYPE or <html, try to find it
    if not html_code.lower().startswith('<!doctype') and not html_code.lower().startswith('<html'):
        # Try to find HTML in the response
        match = re.search(r'(<!DOCTYPE html>.*)', html_code, re.DOTALL | re.IGNORECASE)
        if match:
            html_code = match.group(1)

    # Extract CSS from <style> tags
    css_code = ''
    style_matches = re.findall(
        r'<style[^>]*>(.*?)</style>',
        html_code,
        re.DOTALL | re.IGNORECASE
    )
    if style_matches:
        css_code = '\n\n'.join(match.strip() for match in style_matches)

    # Create a version of HTML without inline CSS for cleaner display
    # (keep the full HTML as-is since it's self-contained)
    html_without_style = html_code
    if css_code:
        # Replace style blocks with a reference comment
        html_without_style = re.sub(
            r'<style[^>]*>.*?</style>',
            '<link rel="stylesheet" href="style.css">',
            html_without_style,
            count=1,
            flags=re.DOTALL | re.IGNORECASE
        )
        # Remove any remaining style blocks (in case of multiples)
        html_without_style = re.sub(
            r'<style[^>]*>.*?</style>',
            '',
            html_without_style,
            flags=re.DOTALL | re.IGNORECASE
        )

    return {
        'htmlCode': html_without_style.strip(),
        'cssCode': css_code.strip(),
        'fullHtml': html_code.strip(),  # Complete self-contained HTML
    }


def _try_generate(client, model_id, messages):
    """
    Attempt to generate with a specific model.
    Returns the generated text or raises an exception.
    """
    logger.info(f"Trying model: {model_id}")

    response = client.chat_completion(
        model=model_id,
        messages=messages,
        max_tokens=4096,
        temperature=0.7,
        top_p=0.9,
    )

    generated_text = response.choices[0].message.content
    logger.info(f"Success with {model_id} — received {len(generated_text)} chars")
    return generated_text


def generate_design(prompt, style='modern'):
    """
    Generate a UI design using HuggingFace Inference API.
    
    Tries the primary model first (Qwen2.5-Coder-7B-Instruct),
    then falls back to alternative models if unavailable.
    
    Args:
        prompt: User's design description
        style: Design style ('modern', 'minimal', 'bold', 'glassmorphism')
    
    Returns:
        dict with 'htmlCode', 'cssCode', 'fullHtml' keys
    
    Raises:
        ValueError: If token is not configured or all models fail
    """
    client = get_hf_client()

    user_message = build_prompt(prompt, style)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]

    logger.info(f"Generating design for prompt: '{prompt[:80]}...' with style: {style}")

    # Build ordered list of models to try
    models_to_try = [settings.HF_MODEL_ID] + getattr(settings, 'HF_FALLBACK_MODELS', [])
    last_error = None

    for model_id in models_to_try:
        try:
            generated_text = _try_generate(client, model_id, messages)

            # Parse the response to separate HTML and CSS
            result = parse_response(generated_text)
            result['prompt'] = prompt
            result['style'] = style
            result['model'] = model_id

            return result

        except Exception as e:
            error_msg = str(e)
            logger.warning(f"Model {model_id} failed: {error_msg}")
            last_error = e

            # If it's a token issue, don't bother trying other models
            if '401' in error_msg or 'unauthorized' in error_msg.lower():
                raise ValueError(
                    "Invalid HuggingFace API token. Please check your HF_API_TOKEN in .env"
                )

            # If rate limited, don't try other models either
            if '429' in error_msg or 'rate' in error_msg.lower():
                raise ValueError(
                    "Rate limit exceeded. The free HuggingFace API has usage limits. "
                    "Please wait a moment and try again."
                )

            # For other errors (503 loading, model_not_supported), try the next model
            continue

    # All models failed
    error_msg = str(last_error) if last_error else "Unknown error"
    logger.error(f"All models failed. Last error: {error_msg}")

    if '503' in error_msg or 'loading' in error_msg.lower():
        raise ValueError(
            "The AI model is currently loading (cold start). "
            "This can take 30-60 seconds for the first request. "
            "Please try again in a moment."
        )
    elif 'not supported' in error_msg.lower() or 'not_supported' in error_msg.lower():
        raise ValueError(
            "The AI models are currently unavailable on the free inference tier. "
            "Please try again later."
        )
    else:
        raise ValueError(f"AI generation failed: {error_msg}")

"""
Serializers for the AI Design Generator API.
"""

from rest_framework import serializers


class GenerateDesignRequestSerializer(serializers.Serializer):
    """Validates incoming design generation requests."""
    prompt = serializers.CharField(
        max_length=5000,
        required=True,
        help_text="Description of the design to generate",
    )
    style = serializers.ChoiceField(
        choices=['modern', 'minimal', 'bold', 'glassmorphism'],
        default='modern',
        required=False,
        help_text="Design style: modern, minimal, bold, or glassmorphism",
    )

    def validate_prompt(self, value):
        """Ensure prompt is not empty or just whitespace."""
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Prompt cannot be empty.")
        if len(cleaned) < 5:
            raise serializers.ValidationError(
                "Prompt is too short. Please provide a more detailed description."
            )
        return cleaned


class GenerateDesignResponseSerializer(serializers.Serializer):
    """Structures the API response."""
    success = serializers.BooleanField()
    htmlCode = serializers.CharField(allow_blank=True, default='')
    cssCode = serializers.CharField(allow_blank=True, default='')
    fullHtml = serializers.CharField(allow_blank=True, default='')
    prompt = serializers.CharField()
    style = serializers.CharField()

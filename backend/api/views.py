"""
API views for the AI Design Generator.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import GenerateDesignRequestSerializer
from .services import generate_design
from .db import save_design, get_designs, get_design_by_id, delete_design

logger = logging.getLogger(__name__)


class GenerateDesignView(APIView):
    """
    POST /api/generate/
    
    Generate a UI design using UIGEN-T2-7B from a text prompt.
    
    Request Body:
        - prompt (str): Description of the design
        - style (str, optional): 'modern' | 'minimal' | 'bold' | 'glassmorphism'
    
    Returns:
        - success (bool)
        - htmlCode (str): Generated HTML
        - cssCode (str): Extracted CSS
        - fullHtml (str): Complete self-contained HTML
        - prompt (str): Original prompt
        - style (str): Applied style
        - designId (str): MongoDB document ID
    """

    def post(self, request):
        # Validate request data
        serializer = GenerateDesignRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    'success': False,
                    'error': self._format_errors(serializer.errors),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        prompt = serializer.validated_data['prompt']
        style = serializer.validated_data.get('style', 'modern')

        try:
            # Call the HuggingFace service
            result = generate_design(prompt, style)

            # Save to MongoDB
            design_id = None
            try:
                design_id = save_design(
                    prompt=prompt,
                    style=style,
                    html_code=result.get('htmlCode', ''),
                    css_code=result.get('cssCode', ''),
                    full_html=result.get('fullHtml', ''),
                    model_used=result.get('model'),
                )
            except Exception as db_err:
                # Don't fail the request if MongoDB save fails
                logger.error(f"Failed to save design to MongoDB: {db_err}")

            return Response({
                'success': True,
                'htmlCode': result.get('htmlCode', ''),
                'cssCode': result.get('cssCode', ''),
                'fullHtml': result.get('fullHtml', ''),
                'prompt': prompt,
                'style': style,
                'designId': design_id,
            })

        except ValueError as e:
            # Known/expected errors (token issues, rate limits, etc.)
            logger.warning(f"Design generation failed: {e}")
            return Response(
                {
                    'success': False,
                    'error': str(e),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except Exception as e:
            # Unexpected errors
            logger.error(f"Unexpected error in design generation: {e}", exc_info=True)
            return Response(
                {
                    'success': False,
                    'error': 'An unexpected error occurred. Please try again later.',
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def _format_errors(self, errors):
        """Format DRF validation errors into a single readable string."""
        messages = []
        for field, field_errors in errors.items():
            for error in field_errors:
                if field == 'non_field_errors':
                    messages.append(str(error))
                else:
                    messages.append(f"{field}: {error}")
        return '; '.join(messages)


class DesignListView(APIView):
    """
    GET /api/designs/
    
    List all saved designs from MongoDB (newest first, paginated).
    
    Query Params:
        - page (int, default=1): Page number
        - per_page (int, default=20): Designs per page
    """

    def get(self, request):
        try:
            page = int(request.query_params.get('page', 1))
            per_page = int(request.query_params.get('per_page', 20))

            # Clamp values
            page = max(1, page)
            per_page = min(max(1, per_page), 100)

            designs, total = get_designs(page=page, per_page=per_page)

            return Response({
                'success': True,
                'designs': designs,
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page if total > 0 else 0,
            })

        except ValueError as e:
            logger.error(f"MongoDB error in design list: {e}")
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        except Exception as e:
            logger.error(f"Unexpected error in design list: {e}", exc_info=True)
            return Response(
                {'success': False, 'error': 'Failed to retrieve designs.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DesignDetailView(APIView):
    """
    GET    /api/designs/<id>/  — Retrieve a single design
    DELETE /api/designs/<id>/  — Delete a design
    """

    def get(self, request, design_id):
        try:
            design = get_design_by_id(design_id)
            if not design:
                return Response(
                    {'success': False, 'error': 'Design not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response({'success': True, 'design': design})

        except Exception as e:
            logger.error(f"Error retrieving design {design_id}: {e}", exc_info=True)
            return Response(
                {'success': False, 'error': 'Failed to retrieve design.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, design_id):
        try:
            deleted = delete_design(design_id)
            if not deleted:
                return Response(
                    {'success': False, 'error': 'Design not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response({'success': True, 'message': 'Design deleted.'})

        except Exception as e:
            logger.error(f"Error deleting design {design_id}: {e}", exc_info=True)
            return Response(
                {'success': False, 'error': 'Failed to delete design.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class HealthCheckView(APIView):
    """
    GET /api/health/
    
    Simple health check endpoint to verify the backend is running.
    """

    def get(self, request):
        from django.conf import settings

        # Test MongoDB connection
        mongo_status = 'not_configured'
        if settings.MONGODB_HOST:
            try:
                from .db import get_db
                get_db()
                mongo_status = 'connected'
            except Exception as e:
                mongo_status = f'error: {e}'

        return Response({
            'status': 'ok',
            'model': settings.HF_MODEL_ID,
            'token_configured': bool(
                settings.HF_API_TOKEN
                and settings.HF_API_TOKEN != 'your_huggingface_api_token_here'
            ),
            'mongodb': mongo_status,
        })

"""
Tests for the AI Design Generator API.
"""

from django.test import TestCase
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from api.services import parse_response, build_prompt


class ParseResponseTests(TestCase):
    """Tests for the HTML/CSS parsing logic."""

    def test_parse_complete_html_with_style(self):
        raw = '''<!DOCTYPE html>
<html lang="en">
<head>
<style>
body { background: #0f0f1a; }
.card { border-radius: 12px; }
</style>
</head>
<body>
<div class="card">Hello</div>
</body>
</html>'''
        result = parse_response(raw)
        self.assertIn('body { background: #0f0f1a; }', result['cssCode'])
        self.assertIn('.card { border-radius: 12px; }', result['cssCode'])
        self.assertIn('<div class="card">Hello</div>', result['htmlCode'])
        self.assertIn('style.css', result['htmlCode'])

    def test_parse_removes_markdown_fences(self):
        raw = '```html\n<!DOCTYPE html><html><body>Test</body></html>\n```'
        result = parse_response(raw)
        self.assertTrue(result['htmlCode'].startswith('<!DOCTYPE html>'))
        self.assertNotIn('```', result['htmlCode'])

    def test_parse_empty_css(self):
        raw = '<!DOCTYPE html><html><body>No styles</body></html>'
        result = parse_response(raw)
        self.assertEqual(result['cssCode'], '')


class BuildPromptTests(TestCase):
    """Tests for prompt construction."""

    def test_build_prompt_includes_user_message(self):
        prompt = build_prompt("A dark dashboard", "modern")
        self.assertIn("A dark dashboard", prompt)
        self.assertIn("dark background", prompt)

    def test_build_prompt_glassmorphism_style(self):
        prompt = build_prompt("Test design", "glassmorphism")
        self.assertIn("glassmorphism", prompt)
        self.assertIn("backdrop-filter", prompt)

    def test_build_prompt_unknown_style_defaults(self):
        prompt = build_prompt("Test", "unknown_style")
        self.assertIn("modern", prompt.lower())


class APIEndpointTests(TestCase):
    """Tests for the API endpoints."""

    def setUp(self):
        self.client = APIClient()

    def test_health_check(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'ok')

    def test_generate_missing_prompt(self):
        response = self.client.post('/api/generate/', {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data['success'])

    def test_generate_empty_prompt(self):
        response = self.client.post(
            '/api/generate/',
            {'prompt': '   '},
            format='json',
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data['success'])

    def test_generate_short_prompt(self):
        response = self.client.post(
            '/api/generate/',
            {'prompt': 'Hi'},
            format='json',
        )
        self.assertEqual(response.status_code, 400)

    @patch('api.views.generate_design')
    def test_generate_success(self, mock_generate):
        mock_generate.return_value = {
            'htmlCode': '<div>Test</div>',
            'cssCode': 'div { color: red; }',
            'fullHtml': '<html><style>div { color: red; }</style><body><div>Test</div></body></html>',
            'prompt': 'Test dashboard',
            'style': 'modern',
        }

        response = self.client.post(
            '/api/generate/',
            {'prompt': 'Test dashboard design', 'style': 'modern'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])
        self.assertIn('htmlCode', response.data)
        self.assertIn('cssCode', response.data)

    @patch('api.views.generate_design')
    def test_generate_api_error(self, mock_generate):
        mock_generate.side_effect = ValueError("Rate limit exceeded")

        response = self.client.post(
            '/api/generate/',
            {'prompt': 'Test dashboard design'},
            format='json',
        )
        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.data['success'])
        self.assertIn('Rate limit', response.data['error'])

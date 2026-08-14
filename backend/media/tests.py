from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from media.models import Media


class MediaAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', password='password123')
        self.user2 = User.objects.create_user(username='bob', password='password123')

    def test_user_registration_and_login(self):
        # Register
        reg_response = self.client.post('/api/auth/register/', {
            'username': 'charlie',
            'email': 'charlie@example.com',
            'password': 'password123'
        })
        self.assertEqual(reg_response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', reg_response.data)

        # Login
        login_response = self.client.post('/api/auth/login/', {
            'username': 'charlie',
            'password': 'password123'
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.data)

    def test_media_crud_and_user_isolation(self):
        # Obtain token for user1
        login_res1 = self.client.post('/api/auth/login/', {'username': 'alice', 'password': 'password123'})
        token1 = login_res1.data['token']

        # Obtain token for user2
        login_res2 = self.client.post('/api/auth/login/', {'username': 'bob', 'password': 'password123'})
        token2 = login_res2.data['token']

        # User 1 creates media
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token1)
        create_res = self.client.post('/api/media/', {
            'title': 'Inception',
            'type': 'Movie',
            'status': 'Unwatched',
            'rating': 4
        })
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        media_id = create_res.data['id']
        self.assertEqual(create_res.data['owner'], 'alice')

        # User 1 lists media
        list_res = self.client.get('/api/media/')
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]['title'], 'Inception')

        # User 2 lists media -> Should return empty list (user isolation)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token2)
        user2_list = self.client.get('/api/media/')
        self.assertEqual(len(user2_list.data), 0)

        # User 2 tries to GET User 1's media -> 404 Not Found
        user2_get = self.client.get(f'/api/media/{media_id}/')
        self.assertEqual(user2_get.status_code, status.HTTP_404_NOT_FOUND)

        # User 1 updates rating and status
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token1)
        patch_res = self.client.patch(f'/api/media/{media_id}/', {
            'status': 'Watched',
            'rating': 5
        })
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data['status'], 'Watched')
        self.assertEqual(patch_res.data['rating'], 5)

        # User 1 deletes media
        del_res = self.client.delete(f'/api/media/{media_id}/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

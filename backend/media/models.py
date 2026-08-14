from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Media(models.Model):
    TYPE_CHOICES = [
        ('Movie', 'Movie'),
        ('TV', 'TV'),
    ]

    STATUS_CHOICES = [
        ('Unwatched', 'Unwatched'),
        ('Watched', 'Watched'),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='Movie')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Unwatched')
    rating = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='media')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.type}) - {self.status}"

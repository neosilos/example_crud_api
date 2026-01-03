from django.db import models

class Person(models.Model):
    """
    Simple model representing a person.
    """
    person_name = models.CharField(max_length=255)
    hobbies = models.JSONField()
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    rating = models.IntegerField(default=800)

    def __str__(self):
        return self.person_name

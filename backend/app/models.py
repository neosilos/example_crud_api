from django.db import models

class Person(models.Model):
    """
    Simple model representing a person.
    """
    person_name = models.CharField(max_length=255)
    hobbies = models.JSONField()
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    years_of_experience = models.IntegerField(
        help_text="Number of years of experience the person has on the hobby.",
        null=True,
        blank=True
    )  

    def __str__(self):
        return self.person_name
    
class ExperienceStatistics(models.Model):
    mean = models.FloatField()
    std_dev = models.FloatField()
    count = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stats @ {self.created_at}"
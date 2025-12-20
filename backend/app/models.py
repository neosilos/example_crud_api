from django.db import models

class Person(models.Model):
    """
    Simple model representing a person.
    """
    person_name = models.CharField(max_length=255)
    hobbies = models.JSONField()
    media_raw = models.TextField(blank=True, null=True, help_text="Números separados por vírgula para o cálculo da média")
    desvio_raw = models.TextField(blank=True, null=True, help_text="Números separados por vírgula para o cálculo do desvio padrão")
    stats = models.JSONField(blank=True, null=True, default=dict)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.person_name
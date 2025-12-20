from django.db import models

class Person(models.Model):
    """
    Simple model representing a person.
    """
    person_name = models.CharField(max_length=255)
    hobbies = models.JSONField()
    media_raw = models.TextField(verbose_name="Média (Input)", help_text="Insira números separados por vírgula para calcular a média.", blank=True, default="")
    variancia_raw = models.TextField(verbose_name="Variância (Input)", help_text="Insira números separados por vírgula para calcular a variância.", blank=True, default="")
    desvio_raw = models.TextField(verbose_name="Desvio Padrão (Input)", help_text="Insira números separados por vírgula para calcular o desvio padrão.", blank=True, default="")
    stats = models.JSONField(verbose_name="Estatísticas Calculadas", blank=True, null=True, editable=False)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.person_name
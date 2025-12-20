from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Person
from .tasks import calculate_person_stats

@receiver(post_save, sender=Person)
def trigger_stats_calculation(sender, instance, created, **kwargs):
    calculate_person_stats.delay(instance.id)

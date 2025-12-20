import time
import statistics
from celery import shared_task
from .models import Person

@shared_task(bind=True)
def long_running_task(self):
    """
    Simulates a long-running job.

    bind=True allows access to task state via self
    """
    time.sleep(10)
    return {"status": "completed"}

@shared_task
def calculate_person_stats(person_id):
    try:
        person = Person.objects.get(id=person_id)
        
        def calculate_list_stats(raw_input):
            if not raw_input:
                return None
            try:
                numbers = [float(x.strip()) for x in raw_input.split(',') if x.strip()]
                if not numbers:
                    return None
                
                return {
                    "media": statistics.mean(numbers),
                    "variancia": statistics.variance(numbers) if len(numbers) > 1 else 0,
                    "desvio": statistics.stdev(numbers) if len(numbers) > 1 else 0,
                    "quantidade": len(numbers)
                }
            except (ValueError, statistics.StatisticsError):
                return {"error": "Invalid data input"}

        stats = {
            "media": calculate_list_stats(person.media_raw),
            "desvio": calculate_list_stats(person.desvio_raw)
        }
        
        person.stats = stats
        person.save(update_fields=['stats', 'modified_date'])
        
        return f"Estatísticas calculadas para Pessoa {person_id}"
    except Person.DoesNotExist:
        return f"Pessoa {person_id} não encontrada"
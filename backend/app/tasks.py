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
        
        def parse_numbers(raw_text):
            if not raw_text:
                return []
            try:
                return [float(x.strip()) for x in raw_text.split(',') if x.strip()]
            except ValueError:
                return []

        media_vals = parse_numbers(person.media_raw)
        variancia_vals = parse_numbers(person.variancia_raw)
        desvio_vals = parse_numbers(person.desvio_raw)

        results = {}

        # Média Input -> Calcular Média
        if media_vals:
            results['media'] = statistics.mean(media_vals)
            results['media_chart'] = [{'index': i+1, 'value': v} for i, v in enumerate(media_vals)]
        else:
            results['media_chart'] = []
        
        # Variância Input -> Calcular Variância
        if variancia_vals:
             if len(variancia_vals) > 1:
                results['variancia'] = statistics.variance(variancia_vals)
             else:
                results['variancia'] = 0.0
             results['variancia_chart'] = [{'index': i+1, 'value': v} for i, v in enumerate(variancia_vals)]
        else:
            results['variancia_chart'] = []

        # Desvio Padrão Input -> Calcular Desvio Padrão
        if desvio_vals:
            if len(desvio_vals) > 1:
                results['desvio'] = statistics.stdev(desvio_vals)
            else:
                 results['desvio'] = 0.0
            
            desvio_media = statistics.mean(desvio_vals)
            results['desvio_media'] = desvio_media
             
            results['desvio_chart'] = [
                {'index': i+1, 'value': v, 'deviation': abs(v - desvio_media)} 
                for i, v in enumerate(desvio_vals)
            ]
        else:
             results['desvio_chart'] = []

        person.stats = results
        person.save(update_fields=['stats', 'modified_date'])
        
        return f"Estatísticas calculadas para Pessoa {person_id}: {results}"
    except Person.DoesNotExist:
        return f"Pessoa {person_id} não encontrada"
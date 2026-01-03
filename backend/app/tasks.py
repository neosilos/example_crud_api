import time
from celery import shared_task
import math
from django.db.models import Avg, Min, Max
from .models import Person

@shared_task(bind=True)
def long_running_task(self):
    """
    Simulates a long-running job.

    bind=True allows access to task state via self
    """
    time.sleep(10)
    return {"status": "completed"}


@shared_task(bind=True)
def calculate_rating_stats(self):
    """
    Calculates min, max, average and standard deviation of Person.rating
    """
    print("in here")
    qs = Person.objects.all()

    if not qs.exists():
        return {
            "count": 0,
            "min": None,
            "max": None,
            "avg": None,
            "std": None,
        }

    agg = qs.aggregate(
        min_rating=Min("rating"),
        max_rating=Max("rating"),
        avg_rating=Avg("rating"),
    )

    avg = float(agg["avg_rating"])

    # Standard deviation
    values = qs.values_list("rating", flat=True)
    variance = sum((v - avg) ** 2 for v in values) / len(values)
    std = math.sqrt(variance)

    return {
        "count": len(values),
        "min": agg["min_rating"],
        "max": agg["max_rating"],
        "avg": round(avg, 2),
        "std": round(std, 2),
    }

import time
from celery import shared_task

@shared_task(bind=True)
def long_running_task(self):
    """
    Simulates a long-running job.

    bind=True allows access to task state via self
    """
    time.sleep(10)
    return {"status": "completed"}


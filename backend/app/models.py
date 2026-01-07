from django.db import models


class Person(models.Model):
    """
    represents a person entity in the database.
    """
    person_name = models.CharField(max_length=255)
    
    # numeric field required for statistics calculation
    age = models.IntegerField(default=18)
    
    # stores list of strings as json array
    hobbies = models.JSONField()
    
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.person_name
from rest_framework import serializers
from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    validates and serializes person data.
    """
    class Meta:
        model = Person
        # includes all model fields automatically (including age)
        fields = "__all__"
        # prevent manual modification of timestamps
        read_only_fields = ("id", "created_date", "modified_date")
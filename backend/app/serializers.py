from rest_framework import serializers
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    """
    Serializer ensures data types and validation.
    """
    class Meta:
        model = Person
        fields = "__all__"
        read_only_fields = ("id", "created_date", "modified_date")
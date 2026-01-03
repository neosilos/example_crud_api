import django_filters
from .models import Person

class PersonFilter(django_filters.FilterSet):
    created_after = django_filters.DateTimeFilter(field_name='created_date', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_date', lookup_expr='lte')
    modified_after = django_filters.DateTimeFilter(field_name='modified_date', lookup_expr='gte')
    modified_before = django_filters.DateTimeFilter(field_name='modified_date', lookup_expr='lte')

    class Meta:
        model = Person
        fields = {
            "person_name": ["iexact", "icontains"],
        }

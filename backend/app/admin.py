from django.contrib import admin
from .models import Person


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
  """
  Admin configuration for Person model.
  """
  list_display = (
    "id",
    "person_name",
    "created_date",
    "modified_date",
  )

  search_fields = ("person_name",)
  ordering = ("-created_date",)
from django.contrib import admin
from .models import Transacao


@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    list_display = ('pessoa', 'valor', 'data', 'status', 'usuario')
    list_filter = ('status', 'data', 'usuario')
    search_fields = ('pessoa', 'descricao', 'usuario__username')
    ordering = ('-data',)
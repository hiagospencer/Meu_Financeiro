from django.contrib import admin
from .models import Transacao, UsuarioPerfil


@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    list_display = ('pessoa', 'valor', 'data', 'status', 'usuario')
    list_filter = ('status', 'data', 'usuario')
    search_fields = ('pessoa', 'descricao', 'usuario__username')
    ordering = ('-data',)
    
@admin.register(UsuarioPerfil)
class UsuarioPerfilAdmin(admin.ModelAdmin):
    list_display = ('usuario', )
    search_fields = ('usuario__username', )
from django.urls import path
from .views import (
    homepage,
    adicionar_trancacao,
    editar_transacao,
    deletar_transacao,
    cadastro_financias,
    login_financias,
    cadastrar_usuario,
    fazer_logout,
)

urlpatterns = [
    path("/", homepage, name="homepage"),
    path("/adicionar_trancacao/", adicionar_trancacao, name="adicionar_trancacao"),
    path("/editar_transacao/", editar_transacao, name="editar_transacao"),
    path("/deletar_transacao/", deletar_transacao, name="deletar_transacao"),
    path("/cadastro_financias/", cadastro_financias, name="cadastro_financias"),
    path("/cadastrar_usuario/", cadastrar_usuario, name="cadastrar_usuario"),
    path("/login_financias/", login_financias, name="login_financias"),
    path("/fazer_logout/", fazer_logout, name="fazer_logout"),
]

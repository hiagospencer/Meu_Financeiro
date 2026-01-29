from django.urls import path
from .views import homepage, adicionar_trancacao, editar_transacao, deletar_transacao

urlpatterns = [
    path('/', homepage, name='homepage'),
    path('/adicionar_trancacao', adicionar_trancacao, name='adicionar_trancacao'),
    path('/editar_transacao', editar_transacao, name='editar_transacao'),
    path('/deletar_transacao', deletar_transacao, name='deletar_transacao'),
]


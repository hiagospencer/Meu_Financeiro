import locale
from .models import Transacao

locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

def valor_total_transacoes(usuario):
    transacoes = Transacao.objects.filter(usuario=usuario)
    return sum(t.valor for t in transacoes)


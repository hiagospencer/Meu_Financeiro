from django.shortcuts import render, redirect
from .models import Transacao
from django.db.models import Q
from .utils import valor_total_transacoes

def homepage(request):
    search = request.GET.get("search", "")
    usuario = request.user
    transacoes = Transacao.objects.filter(usuario=usuario)
    valor_total_transacao = valor_total_transacoes(usuario)
    
    if search:
        transacoes = transacoes.filter(
            Q(pessoa__icontains=search) |
            Q(descricao__icontains=search) |
            Q(valor__icontains=search)
        )

    context = {"transacoes": transacoes, "valor_total": valor_total_transacao, "search": search}
    return render(request, "index.html", context)


def adicionar_trancacao(request):
    if request.method == "POST":
        usuario = request.user
        valor = request.POST.get("valor")
        descricao = request.POST.get("descricao")
        nome = request.POST.get("nome")
        data = request.POST.get("data")
        status = request.POST.get("status")

        if all([not valor, not descricao, not nome, not data, not status]):
            return render(
                request, "index.html", {"error": "Todos os campos são obrigatórios."}
            )

        print(
            f"Valor: {valor}, Descrição: {descricao}, Nome: {nome}, Data: {data}, Status: {status}"
        )
        Transacao.objects.create(
            usuario=usuario,
            pessoa=nome,
            valor=valor,
            descricao=descricao,
            data=data,
            status=status,
        )

        return redirect("homepage")
    return render(request, "index.html")


def editar_transacao(request):
    if request.method == "POST":
        transacao_id = request.POST.get("transacao_id")
        valor = request.POST.get("valor")
        descricao = request.POST.get("descricao")
        pessoa = request.POST.get("nome")
        data = request.POST.get("data")
        status = request.POST.get("status")
                
        transacao_editada = Transacao.objects.get(id=transacao_id)
        transacao_editada.valor = valor
        transacao_editada.pessoa = pessoa
        transacao_editada.descricao = descricao
        transacao_editada.data = data
        transacao_editada.status = status
        transacao_editada.save()
        return redirect("homepage")
    return render(request, "index.html")

def deletar_transacao(request):
    if request.method == "POST":
        transacao_id = request.POST.get("transacao_id")
        id = request.POST.get("id")
        print(id)
        Transacao.objects.filter(id=transacao_id).delete()
        return redirect("homepage")
    return render(request, "index.html")
        
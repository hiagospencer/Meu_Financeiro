from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import Transacao, UsuarioPerfil
from django.db.models import Q
from .utils import valor_total_transacoes
from django.contrib.auth.models import User


@login_required(login_url='login_financias')
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


@login_required(login_url='login_financias')
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

@login_required(login_url='login_financias')
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

@login_required(login_url='login_financias')
def deletar_transacao(request):
    if request.method == "POST":
        transacao_id = request.POST.get("transacao_id")
        id = request.POST.get("id")
        print(id)
        Transacao.objects.filter(id=transacao_id).delete()
        return redirect("homepage")
    return render(request, "index.html")
        
def cadastro_financias(request):
    return render(request, 'cadastro_financias.html')


def cadastrar_usuario(request):
    error = None
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirmPassword = request.POST.get("confirmPassword")
        
        if not username or not email or not password or not confirmPassword:
            error = 'Todos os campos são obrigatórios.'
            return render(request, 'cadastro_financias.html', {'error': error})
        
        if User.objects.filter(email=email).exists():
            error = "Email já cadastrado."
            return render(request, 'cadastro_financias.html', {'error': error})
    
        if password != confirmPassword:
            error = 'As senhas não concidem.'
            return render(request, 'cadastro_financias.html', {'error':error})
        
        user = User.objects.create(username=username, email=email, password=password)
        user.save()
        
        usuario = UsuarioPerfil.objects.create(usuario=user, senha=password)
        usuario.save()
        return redirect('login_financias')
    return render(request, 'cadastro_financias.html') 


def login_financias(request):
    error = None
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        print(username, password)
        
        if not username or not password:
            error = "Usuário e senha são obrigatórios."
            return render(request, 'login_financias.html', {"error": error})
        
        user = User.objects.filter(username=username, password=password).first()
        if user:
            try:
                authenticate(request, username=username, password=password)
                login(request, user)
                return redirect("homepage")
            except Exception as e:
                return render(request, 'login_financias.html', {"error": "Erro ao fazer Login. Tente novamente."})
        error = "Usuário ou senha inválidos."
        return render(request, 'login_financias.html', {"error": error})
    else:
        return render(request, 'login_financias.html')
    
def fazer_logout(request):
    logout(request)
    return redirect('login_financias')
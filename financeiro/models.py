from django.db import models
from django.contrib.auth.models import User


class Transacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    pessoa = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField()
    data = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
    ])
    
       
    def __str__(self):
        return f"{self.pessoa} - {self.valor}"
// Funções básicas para controlar o modal
convertDateFormat = (dateStr) => {
  // Assim está vindo a data no backend: 28 de Janeiro de 2026, eu preciso converter para um formato que o valor apareca no input date: 2026-01-28

  const months = {
    Janeiro: '01',
    Fervereiro: '02',
    Março: '03',
    Abril: '04',
    Maio: '05',
    Junho: '06',
    Julho: '07',
    Agosto: '08',
    Setembro: '09',
    Outubro: '10',
    Novembro: '11',
    Dezembro: '12',
  };

  const [day, month, year] = dateStr.split(' de ');
  const monthNumber = months[month];
  return `${year}-${monthNumber}-${day}`;
};

function openEditModal(id, personName, amount, description, date, status) {
  // Preencher os campos com os dados da transação
  document.getElementById('modalTransactionId').value = id;
  document.getElementById('modalPersonName').value = personName;
  document.getElementById('modalAmount').value = parseFloat(amount);
  document.getElementById('modalDescription').value = description;
  document.getElementById('modalDate').value = convertDateFormat(date);
  document.getElementById('modalStatus').value = status;

  // Atualizar indicador de status
  updateStatusIndicator(status);

  // Mostrar modal
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden'; // Bloquear scroll da página

  // Focar no primeiro campo
  setTimeout(() => {
    document.getElementById('modalPersonName').focus();
  }, 300);
}

function closeEditModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = 'auto'; // Restaurar scroll da página

  // Limpar formulário
  document.getElementById('editTransactionForm').reset();

  // Limpar erros
  clearErrors();
}

function updateStatusIndicator(status) {
  const indicator = document.getElementById('statusIndicator');
  indicator.className = 'status-indicator';
  indicator.classList.add(status);
}

function clearErrors() {
  const errors = document.querySelectorAll('.modal-error');
  errors.forEach((error) => {
    error.classList.remove('show');
    error.textContent = '';
  });
}

// Event Listeners básicos (deveriam ser adicionados após o DOM carregar)
document.addEventListener('DOMContentLoaded', function () {
  // Fechar modal com botão X
  document
    .getElementById('modalCloseBtn')
    .addEventListener('click', closeEditModal);

  // Fechar modal com botão Cancelar
  document
    .getElementById('modalCancelBtn')
    .addEventListener('click', closeEditModal);

  // Fechar modal clicando fora
  document
    .getElementById('modalOverlay')
    .addEventListener('click', function (e) {
      if (e.target === this) {
        closeEditModal();
      }
    });

  // Fechar modal com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeEditModal();
    }
  });

  // Atualizar indicador de status quando mudar
  document
    .getElementById('modalStatus')
    .addEventListener('change', function () {
      updateStatusIndicator(this.value);
    });

  
});


const sendFormData = (FormData) => {
  fetch('/editar_transacao', {
    method: 'POST',
    body: FormData,

  }).then((response) => {
    response.json().then((data)=>{
      if (data.sucess){
        closeEditModal();
        location.reload();
      }
      else {
        clearErrors();
      }
    })
  })
}
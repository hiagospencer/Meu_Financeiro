let idToDelete = null;

function openDeleteConfirmModal(id, nome, valor, data, status) {
  idToDelete = id;
  document.getElementById('confirmDetailPerson').textContent = nome;
  document.getElementById('confirmDetailAmount').textContent = valor;
  document.getElementById('confirmDetailDate').textContent = data;
  document.getElementById('confirmDetailStatus').textContent = status;

  const message = `Tem certeza que deseja excluir ${nome} no valor de ${valor}?`;
  document.getElementById('confirmModalMessage').textContent = message;

  // Resetar campo de confirmação
  document.getElementById('confirmTextInput').value = '';
  document.getElementById('confirmTextInput').classList.remove('error');
  document.getElementById('confirmValidationError').classList.remove('show');
  document.getElementById('confirmModalDeleteBtn').disabled = true;

  // Armazenar ID da transação
  const modal = document.getElementById('confirmModalOverlay');
  modal.dataset.transactionId = id;

  // Mostrar modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focar no campo de confirmação
  setTimeout(() => {
    document.getElementById('confirmTextInput').focus();
  }, 400);
}

function closeDeleteConfirmModal() {
  const modal = document.getElementById('confirmModalOverlay');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';

  // Limpar dados
  delete modal.dataset.transactionId;

  // Esconder loading
  document.getElementById('confirmModalLoading').classList.remove('active');
}

function showDeleteLoading() {
  document.getElementById('confirmModalLoading').classList.add('active');
}

function hideDeleteLoading() {
  document.getElementById('confirmModalLoading').classList.remove('active');
}

// Event Listeners básicos (adicionar após DOM carregar)
document.addEventListener('DOMContentLoaded', function () {
  const confirmTextInput = document.getElementById('confirmTextInput');
  const deleteBtn = document.getElementById('confirmModalDeleteBtn');
  const cancelBtn = document.getElementById('confirmModalCancelBtn');
  const validationError = document.getElementById('confirmValidationError');
  const modalOverlay = document.getElementById('confirmModalOverlay');

  // Validar campo de texto em tempo real
  confirmTextInput.addEventListener('input', function () {
    const inputValue = this.value.trim().toUpperCase();
    const isValid = inputValue === 'EXCLUIR';
    deleteBtn.disabled = !isValid;

    if (inputValue && !isValid) {
      this.classList.add('error');
      validationError.textContent =
        'Digite exatamente "EXCLUIR" para confirmar';
      validationError.classList.add('show');
    } else {
      this.classList.remove('error');
      validationError.classList.remove('show');
      // sendFormDataDelete(idToDelete);
    }
  });

  // Fechar modal com botão Cancelar
  cancelBtn.addEventListener('click', closeDeleteConfirmModal);

  // Fechar modal clicando fora
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === this) {
      closeDeleteConfirmModal();
    }
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDeleteConfirmModal();
    }
  });

  // Botão de exclusão
  deleteBtn.addEventListener('click', function () {
    if (!this.disabled) {
      const transactionId = modalOverlay.dataset.transactionId;

      // Mostrar loading
      showDeleteLoading();

      // Simular exclusão (substituir por chamada real)
      setTimeout(() => {
        // Aqui você chamaria a API para excluir
        console.log(`Excluindo transação ${transactionId}`);

        // Fechar modal após exclusão
        hideDeleteLoading();
        closeDeleteConfirmModal();

        // Mostrar mensagem de sucesso
        alert('Transação excluída com sucesso!');
      }, 1500);
    }
  });
});

function getStatusText(status) {
  const statusMap = {
    pendente: 'Pendente',
    pago: 'Pago',

  };
  return statusMap[status] || status;
}

const sendFormDataDelete = (FormData) => {
  fetch('/deletar_transacao', {
    method: 'POST',
    body: FormData,
  }).then((response) => {
    response.json().then((data) => {
      if (data.sucess) {
        closeDeleteConfirmModal();
        location.reload();
      } else {
        console.log('Erro ao deletar');
      }
    });
  });
};

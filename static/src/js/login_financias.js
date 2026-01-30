// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
// const demoBtn = document.getElementById('demoBtn');
const recoveryModal = document.getElementById('recoveryModal');
const recoveryCancelBtn = document.getElementById('recoveryCancelBtn');
const recoverySubmitBtn = document.getElementById('recoverySubmitBtn');
const recoveryEmailInput = document.getElementById('recoveryEmail');
const recoveryForm = document.getElementById('recoveryForm');

// Alertas
const demoAlert = document.getElementById('demoAlert');
const errorAlert = document.getElementById('errorAlert');
const successAlert = document.getElementById('successAlert');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Elementos de erro
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const recoveryEmailError = document.getElementById('recoveryEmailError');

// Mostrar/ocultar senha
function togglePasswordVisibility(input, button) {
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
  button.innerHTML =
    type === 'password'
      ? '<i class="fas fa-eye"></i>'
      : '<i class="fas fa-eye-slash"></i>';
}

// Validar e-mail/usuário
function validateEmail() {
  const email = emailInput.value.trim();
  const isValid = email.length > 0;

  if (!isValid) {
    emailError.classList.add('show');
  } else {
    emailError.classList.remove('show');
  }

  return isValid;
}

// Validar senha
function validatePassword() {
  const password = passwordInput.value;
  const isValid = password.length > 0;

  if (!isValid) {
    passwordError.classList.add('show');
  } else {
    passwordError.classList.remove('show');
  }

  return isValid;
}

// Validar formulário completo
function validateForm() {
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  const isValid = isEmailValid && isPasswordValid;
  submitBtn.disabled = !isValid;

  return isValid;
}

// Mostrar alerta
function showAlert(alertElement, message = '') {
  // Esconder todos os alertas primeiro
  document.querySelectorAll('.alert').forEach((alert) => {
    alert.classList.remove('show');
  });

  if (message) {
    alertElement.querySelector('span').textContent = message;
  }

  // Auto-esconder após 5 segundos (exceto para demo)
  if (alertElement !== demoAlert) {
    setTimeout(() => {
      alertElement.classList.remove('show');
    }, 5000);
  }
}

// Simular login
function submitLogin(event) {
  // event.preventDefault();

  if (!validateForm()) return;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  const formData = new FormData();
  formData.append('username', emailInput.value.trim());
  formData.append('password', passwordInput.value);

  fetch('/financeiro/login_financias/', {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
      'X-Requested-With': 'XMLHttpRequest',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showAlert(successAlert, 'Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showAlert(errorAlert, data.message || 'Credenciais inválidas.');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  })
  .catch(error => {
    showAlert(errorAlert, 'Erro ao conectar ao servidor.');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });

// Preencher dados demo
function fillDemoCredentials() {
  emailInput.value = 'demo@email.com';
  passwordInput.value = 'demo123';
  document.getElementById('remember').checked = true;

  validateForm();
  showAlert(demoAlert);

  // Focar na senha
  setTimeout(() => {
    passwordInput.focus();
  }, 100);
}

// Abrir modal de recuperação
function openRecoveryModal() {
  recoveryModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focar no campo de e-mail
  setTimeout(() => {
    recoveryEmailInput.focus();
  }, 300);
}

// Fechar modal de recuperação
function closeRecoveryModal() {
  recoveryModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  recoveryForm.reset();
  recoveryEmailError.classList.remove('show');
}

// Validar e-mail de recuperação
function validateRecoveryEmail() {
  const email = recoveryEmailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  if (!isValid && email.length > 0) {
    recoveryEmailError.classList.add('show');
  } else {
    recoveryEmailError.classList.remove('show');
  }

  recoverySubmitBtn.disabled = !isValid;

  return isValid;
}

// Enviar recuperação de senha
function submitRecovery() {
  if (!validateRecoveryEmail()) return;

  const email = recoveryEmailInput.value.trim();

  // Simular envio
  recoverySubmitBtn.disabled = true;
  recoverySubmitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  setTimeout(() => {
    closeRecoveryModal();
    showAlert(successAlert, `Link de recuperação enviado para ${email}`);

    // Resetar botão
    setTimeout(() => {
      recoverySubmitBtn.disabled = false;
      recoverySubmitBtn.innerHTML = 'Enviar Link';
    }, 1000);
  }, 2000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
  // Mostrar alerta demo
  setTimeout(() => {
    showAlert(demoAlert);
  }, 1000);

  // Eventos de input do login
  emailInput.addEventListener('input', validateForm);
  passwordInput.addEventListener('input', validateForm);

  // Eventos de blur
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);

  // Mostrar/ocultar senha
  togglePasswordBtn.addEventListener('click', () => {
    togglePasswordVisibility(passwordInput, togglePasswordBtn);
  });

  // Enviar formulário de login
  loginForm.addEventListener('submit', submitLogin);

  // Botão demo
  // demoBtn.addEventListener('click', fillDemoCredentials);

  // Recuperação de senha
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    openRecoveryModal();
  });

  recoveryCancelBtn.addEventListener('click', closeRecoveryModal);

  // Fechar modal clicando fora
  recoveryModal.addEventListener('click', (e) => {
    if (e.target === recoveryModal) {
      closeRecoveryModal();
    }
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && recoveryModal.classList.contains('active')) {
      closeRecoveryModal();
    }
  });

  // Validação em tempo real do e-mail de recuperação
  recoveryEmailInput.addEventListener('input', validateRecoveryEmail);

  // Enviar recuperação
  recoverySubmitBtn.addEventListener('click', submitRecovery);
  recoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitRecovery();
  });

  // Login social (simulação)
  document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const provider = this.classList.contains('google')
        ? 'Google'
        : 'Facebook';
      showAlert(infoAlert, `Redirecionando para login com ${provider}...`);

      // Simular redirecionamento
      setTimeout(() => {
        showAlert(
          errorAlert,
          'Integração com ' + provider + ' em desenvolvimento.'
        );
      }, 1000);
    });
  });

  // Validar formulário inicialmente
  validateForm();
});

// Função auxiliar para info alert (não definida no HTML original)
const infoAlert = document.createElement('div');
infoAlert.className = 'alert info';
infoAlert.innerHTML = '<i class="fas fa-info-circle"></i><span></span>';
document.querySelector('.login-right').insertBefore(infoAlert, loginForm);

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}}
// Elementos do DOM
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById(
  'toggleConfirmPassword'
);
const passwordStrength = document.getElementById('passwordStrength');
const passwordStrengthText = document.getElementById('passwordStrengthText');
const submitBtn = document.getElementById('submitBtn');
const termsLink = document.getElementById('termsLink');
const privacyLink = document.getElementById('privacyLink');
const termsModal = document.getElementById('termsModal');
const closeTermsBtn = document.getElementById('closeTermsBtn');
const successMessage = document.getElementById('successMessage');

// Elementos de erro
const usernameError = document.getElementById('usernameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

// Estado da aplicação
let isFormValid = false;

// Mostrar/ocultar senha
function togglePasswordVisibility(input, button) {
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
  button.innerHTML =
    type === 'password'
      ? '<i class="fas fa-eye"></i>'
      : '<i class="fas fa-eye-slash"></i>';
}

// Validar nome de usuário
function validateUsername() {
  const username = usernameInput.value.trim();
  const isValid = username.length >= 3;

  if (!isValid && username.length > 0) {
    usernameError.classList.add('show');
  } else {
    usernameError.classList.remove('show');
  }

  return isValid;
}

// Validar e-mail
function validateEmail() {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  if (!isValid && email.length > 0) {
    emailError.classList.add('show');
  } else {
    emailError.classList.remove('show');
  }

  return isValid;
}

// Verificar força da senha
function checkPasswordStrength(password) {
  if (password.length === 0) {
    return { strength: 0, text: 'Digite sua senha', className: '' };
  }

  let strength = 0;

  // Comprimento mínimo
  if (password.length >= 8) strength++;

  // Tem letras minúsculas e maiúsculas
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

  // Tem números
  if (/[0-9]/.test(password)) strength++;

  // Tem caracteres especiais
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const strengthMap = [
    { text: 'Muito fraca', className: 'weak' },
    { text: 'Fraca', className: 'weak' },
    { text: 'Regular', className: 'fair' },
    { text: 'Boa', className: 'good' },
    { text: 'Forte', className: 'strong' },
  ];

  return {
    strength: (strength / 4) * 100,
    text: strengthMap[strength].text,
    className: strengthMap[strength].className,
  };
}

// Validar senha
function validatePassword() {
  const password = passwordInput.value;
  const isValid = password.length >= 8;

  // Atualizar força da senha
  const strengthInfo = checkPasswordStrength(password);
  passwordStrength.style.width = `${strengthInfo.strength}%`;
  passwordStrength.className = `strength-fill ${strengthInfo.className}`;
  passwordStrengthText.textContent = strengthInfo.text;

  if (!isValid && password.length > 0) {
    passwordError.classList.add('show');
  } else {
    passwordError.classList.remove('show');
  }

  return isValid;
}

// Validar confirmação de senha
function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const isValid = password === confirmPassword && confirmPassword.length > 0;

  if (!isValid && confirmPassword.length > 0) {
    confirmPasswordError.classList.add('show');
  } else {
    confirmPasswordError.classList.remove('show');
  }

  return isValid;
}

// Validar termos
function validateTerms() {
  return document.getElementById('terms').checked;
}

// Validar formulário completo
function validateForm() {
  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  const isTermsValid = validateTerms();

  isFormValid =
    isUsernameValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isTermsValid;

  submitBtn.disabled = !isFormValid;

  return isFormValid;
}

// Simular envio do formulário
function submitForm(event) {
  event.preventDefault();

  if (!validateForm()) return;

  // Mostrar loading
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
}

// Abrir modal de termos
function openTermsModal() {
  termsModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Fechar modal de termos
function closeTermsModal() {
  termsModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
  // Eventos de input
  usernameInput.addEventListener('input', validateUsername);
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);
  document.getElementById('terms').addEventListener('change', validateForm);

  // Eventos de blur (quando sai do campo)
  usernameInput.addEventListener('blur', validateUsername);
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);
  confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

  // Mostrar/ocultar senha
  togglePasswordBtn.addEventListener('click', () => {
    togglePasswordVisibility(passwordInput, togglePasswordBtn);
  });

  toggleConfirmPasswordBtn.addEventListener('click', () => {
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn);
  });

  // Enviar formulário
  // registerForm.addEventListener('submit', submitForm);

  // Modal de termos
  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    openTermsModal();
  });

  privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    openTermsModal();
  });

  closeTermsBtn.addEventListener('click', closeTermsModal);

  // Fechar modal clicando fora
  termsModal.addEventListener('click', (e) => {
    if (e.target === termsModal) {
      closeTermsModal();
    }
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal.classList.contains('active')) {
      closeTermsModal();
    }
  });

  // Validar formulário inicialmente
  validateForm();
});

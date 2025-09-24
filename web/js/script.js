// ----------------------------
// Seleção de elementos
// ----------------------------
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const checkboxes = [uppercase, lowercase, numbers, symbols];

const easyToSay = document.getElementById("easy-to-say");
const easyToRead = document.getElementById("easy-to-read");
const allMode = document.getElementById("all");

const passwordText = document.getElementById("password-text");
const refreshBtn = document.getElementById("refresh-btn");
const copyBtn = document.getElementById("copy-btn");
const toast = document.getElementById("toast");

// ----------------------------
// Toast
// ----------------------------
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

// ----------------------------
// Número aleatório seguro
// ----------------------------
function secureRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

// ----------------------------
// Atualiza checkboxes pelo modo
// ----------------------------
function updateCheckboxesByMode() {
  if (allMode.checked) {
    checkboxes.forEach(cb => { cb.checked = true; cb.disabled = true; });
  } else if (easyToSay.checked) {
    numbers.checked = false; numbers.disabled = true;
    symbols.checked = false; symbols.disabled = true;
    uppercase.disabled = false; lowercase.disabled = false;
  } else {
    checkboxes.forEach(cb => cb.disabled = false);
  }
}

// ----------------------------
// Garantia de pelo menos uma checkbox
// ----------------------------
checkboxes.forEach(cb => cb.addEventListener("change", () => {
  if (allMode.checked) { cb.checked = true; return; }
  if (!checkboxes.some(c => c.checked)) {
    cb.checked = true;
    alert("Pelo menos uma opção precisa estar selecionada!");
  }
}));

// ----------------------------
// Geração de senha
// ----------------------------
function generatePasswordClient() {
  const length = parseInt(document.getElementById("length").value);
  const mode = document.querySelector('input[name="pronounceable"]:checked')?.id || "all";

  let charset = "";
  if (mode === "all") {
    if (uppercase.checked) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase.checked) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers.checked) charset += "0123456789";
    if (symbols.checked) charset += "!@#$%^&*()-_=+[]{};:,.<>?";
  } else if (mode === "easy-to-read") {
    if (uppercase.checked) charset += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (lowercase.checked) charset += "abcdefghijkmnopqrstuvwxyz";
    if (numbers.checked) charset += "23456789";
    if (symbols.checked) charset += "!@#$%^&*()-_=+[]{}";
  } else if (mode === "easy-to-say") {
    const vowels = "aeiou";
    const consonants = "bcdfghjklmnpqrstvwxyz";
    if (lowercase.checked) charset += consonants + vowels;
    if (uppercase.checked) charset += (consonants + vowels).toUpperCase();
  }

  if (!charset) {
    passwordText.innerText = "Erro: selecione pelo menos um tipo de caractere!";
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[secureRandomInt(charset.length)];
  }
  passwordText.innerText = password;
}

// ----------------------------
// Eventos
// ----------------------------
[easyToSay, easyToRead, allMode].forEach(radio => radio.addEventListener("change", updateCheckboxesByMode));
refreshBtn.addEventListener("click", generatePasswordClient);
copyBtn.addEventListener("click", () => {
  if (!passwordText.innerText) return;
  navigator.clipboard.writeText(passwordText.innerText).then(showToast);
});

// ----------------------------
// Inicialização
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  allMode.checked = true;
  updateCheckboxesByMode();
  generatePasswordClient();
});

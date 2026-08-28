// create_profile.js — etapa "Complete seu perfil" (onboarding)

document.addEventListener('DOMContentLoaded', () => {
  initBackButton();
  initPhotoUpload();
  initProfileTypeSelector();
  initFormSubmit();
});

function initBackButton() {
  const backBtn = document.getElementById('back-btn');
  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    // Volta pra etapa anterior do onboarding. Ajustar o destino
    // quando as outras telas do fluxo existirem.
    window.history.back();
  });
}


// Upload de foto: clicar no círculo abre o seletor de arquivo do sistema;
// ao escolher uma imagem, mostra um preview local com URL.createObjectURL
// (não envia o arquivo a lugar nenhum ainda). selectedPhotoFile guarda o
// arquivo escolhido, pronto pra enviar quando o endpoint existir (ver
// handleFormSubmit) — o navegador sozinho não pode gravar num back-end.
let selectedPhotoFile = null;

function initPhotoUpload() {
  const uploadBtn = document.getElementById('photo-upload-btn');
  const fileInput = document.getElementById('photo-input');
  const preview = document.getElementById('photo-preview');
  const placeholderIcon = document.getElementById('photo-placeholder-icon');

  if (!uploadBtn || !fileInput) return;

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    selectedPhotoFile = file;

    const previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.hidden = false;
    placeholderIcon.hidden = true;
  });
}


// Seletor de tipo de perfil: "watcher" (usuário comum), "professional" e
// "enterprise". Cada campo do formulário tem um atributo [data-for] com a
// lista de tipos em que deve aparecer (ver HTML) — applyProfileType() lê
// isso e mostra/esconde os campos, além de ajustar quais são obrigatórios.
function initProfileTypeSelector() {
  const options = document.querySelectorAll('.type-option');
  const typeInput = document.getElementById('profile-type-input');

  if (!options.length || !typeInput) return;

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => {
        opt.classList.remove('active');
        opt.setAttribute('aria-checked', 'false');
      });

      option.classList.add('active');
      option.setAttribute('aria-checked', 'true');

      const type = option.dataset.type;
      typeInput.value = type;
      applyProfileType(type);
    });
  });

  // Aplica o estado inicial (watcher, que já vem marcado como .active no HTML)
  applyProfileType(typeInput.value);
}

function applyProfileType(type) {
  const fields = document.querySelectorAll('[data-for]');

  fields.forEach(field => {
    const allowedTypes = field.dataset.for.split(' ');
    const shouldShow = allowedTypes.includes(type);

    field.hidden = !shouldShow;

    // Só exige preenchimento dos campos que estão visíveis pro tipo atual
    const requiredInput = field.matches('input, select') ? field : field.querySelector('input, select');
    if (requiredInput && requiredInput.dataset.requiredWhenVisible !== 'false') {
      requiredInput.required = shouldShow && requiredInput.id === 'field-name';
    }
  });

  // Ajusta o rótulo/placeholder de "Nome" e "Data de criação" pra ficar
  // mais claro quando o tipo é Empresa
  const nameLabel = document.getElementById('field-name-label');
  const nameInput = document.getElementById('field-name');
  const creationLabel = document.getElementById('field-creation-date-label');

  if (nameLabel && nameInput) {
    if (type === 'enterprise') {
      nameLabel.textContent = 'Nome da empresa';
      nameInput.placeholder = 'Nome fantasia ou razão social';
    } else {
      nameLabel.textContent = 'Nome';
      nameInput.placeholder = 'Seu nome';
    }
  }

  if (creationLabel) {
    creationLabel.textContent = type === 'enterprise' ? 'Data de fundação' : 'Data de criação';
  }
}


// Envio do formulário (simulado por enquanto — só reúne os dados no console,
// pra já dar pra testar o fluxo sem precisar de back-end pronto)
function initFormSubmit() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleFormSubmit();
  });
}

function handleFormSubmit() {
  const type = document.getElementById('profile-type-input')?.value || 'watcher';

  const profileData = {
    type,
    name: document.getElementById('field-name')?.value || '',
    lastName: document.getElementById('field-lastname')?.value || null,
    birthDate: document.getElementById('field-birthdate')?.value || null,
    phone: document.getElementById('field-phone')?.value || null,
    creationDate: document.getElementById('field-creation-date')?.value || null,
    city: document.getElementById('field-city')?.value || '',
    neighborhood: document.getElementById('field-neighborhood')?.value || '',
    category: document.getElementById('field-category')?.value || null,
    photo: selectedPhotoFile // objeto File — pronto pra enviar quando o back-end existir
  };

  console.log('Dados do perfil:', profileData);

  // TODO: quando o endpoint de upload existir, enviar via FormData, ex.:
  //
  //   const formData = new FormData();
  //   Object.entries(profileData).forEach(([key, value]) => {
  //     if (value !== null && key !== 'photo') formData.append(key, value);
  //   });
  //   if (profileData.photo) formData.append('photo', profileData.photo);
  //
  //   fetch('/api/perfil/completar', { method: 'POST', body: formData })
  //     .then(...)
  //
  // O back-end é quem vai gravar o arquivo em media_storage_test/
  // (em ambiente de teste) — o navegador sozinho não tem permissão
  // pra escrever direto numa pasta do projeto.

  alert('Perfil salvo (simulado) — confira o console para ver os dados.');
}
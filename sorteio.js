/**
 * Sorteio Scripts - Advocacia Filipe Carvalho & Pipper
 * Envio via Webhook n8n e redirecionamento para o Google Avaliações
 */

const WEBHOOK_URL = 'https://n8n.srv1077266.hstgr.cloud/webhook/sorteio-afc';
const GOOGLE_REVIEW_URL = 'https://maps.app.goo.gl/zp4JaK74ATxKYhyL9';

document.addEventListener('DOMContentLoaded', () => {
  // Máscara de telefone
  const friendPhone = document.getElementById('friend-phone');
  if (friendPhone) {
    friendPhone.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d*)$/, '($1');
      }
      e.target.value = v;
    });
  }
});

/**
 * Envia dados para o Webhook e direciona para o link do Google Avaliações
 */
async function handleSorteioSubmit(event) {
  event.preventDefault();

  const userNameInput = document.getElementById('user-name');
  const friendNameInput = document.getElementById('friend-name');
  const friendPhoneInput = document.getElementById('friend-phone');
  const submitBtn = document.getElementById('btn-submit-sorteio');

  const nome = userNameInput.value.trim();
  const amigo_indicado = friendNameInput.value.trim();
  const telefone_amigo = friendPhoneInput.value.trim();

  if (!nome || !amigo_indicado || !telefone_amigo) {
    if (typeof showToast === 'function') {
      showToast('Por favor, preencha todos os campos.');
    }
    return;
  }

  // Estado de carregamento no botão
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando e abrindo avaliação...';
  }

  const payload = {
    nome: nome,
    amigo_indicado: amigo_indicado,
    telefone_amigo: telefone_amigo,
    origem: 'link_bio_sorteio',
    data_registro: new Date().toISOString()
  };

  try {
    // Envio assíncrono para o Webhook n8n
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('Erro ao acionar webhook:', err);
    });

    if (typeof showToast === 'function') {
      showToast('Cadastro realizado! Redirecionando para o Google...');
    }

    // Redireciona para o Google Avaliações após 600ms
    setTimeout(() => {
      window.location.href = GOOGLE_REVIEW_URL;
    }, 600);

  } catch (error) {
    console.error('Falha no processo:', error);
    // Mesmo em eventual bloqueio local, garante a ida para a avaliação do Google
    window.location.href = GOOGLE_REVIEW_URL;
  }
}

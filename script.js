/**
 * Advocacia Filipe Carvalho - Link-in-Bio Web App
 * Interactive Scripts, Modals, vCard Generator & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  // Generate QR Code dynamically based on current page URL
  const qrImg = document.getElementById('qr-code-img');
  if (qrImg) {
    const currentUrl = encodeURIComponent(window.location.href);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUrl}&color=121212&bgcolor=ffffff`;
  }

  // Close modals when clicking outside modal-card
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modals on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => {
        overlay.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  // Practice toggles accordion exclusivity (close other toggles when one opens)
  const practiceToggles = document.querySelectorAll('.practice-toggle');
  practiceToggles.forEach(toggle => {
    toggle.addEventListener('toggle', () => {
      if (toggle.open) {
        practiceToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.open = false;
          }
        });
      }
    });
  });
});

/**
 * Open Modal Handler
 * @param {string} modalId 
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close Modal Handler
 * @param {string} modalId 
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Show Toast Message
 * @param {string} message 
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/**
 * Share Profile Native Sheet (Mobile) or Fallback Modal
 */
function shareProfile() {
  const shareData = {
    title: 'Advocacia Filipe Carvalho',
    text: 'Advocacia Filipe Carvalho - Advocacia Empresarial e Tributária.',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => {
      if (err.name !== 'AbortError') {
        openModal('modal-share');
      }
    });
  } else {
    openModal('modal-share');
  }
}

/**
 * Copy Profile Link to Clipboard
 */
function copyProfileLink() {
  const pageUrl = window.location.href;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(pageUrl).then(() => {
      showToast('Link do perfil copiado com sucesso!');
    }).catch(() => {
      fallbackCopyTextToClipboard(pageUrl);
    });
  } else {
    fallbackCopyTextToClipboard(pageUrl);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Link do perfil copiado com sucesso!');
  } catch (err) {
    showToast('Não foi possível copiar o link.');
  }
  document.body.removeChild(textArea);
}

/**
 * Download / Open vCard (.vcf) Contact Card
 */
function downloadVCard() {
  const vcardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Carvalho;Advocacia Filipe;;;',
    'FN:Advocacia Filipe Carvalho',
    'ORG:Advocacia Filipe Carvalho',
    'TITLE:Advocacia Empresarial e Tributária',
    'TEL;TYPE=CELL,VOICE;TYPE=pref:+551731218192',
    'EMAIL;TYPE=PREF,INTERNET:contato@advocaciafilipecarvalho.com.br',
    'ADR;TYPE=WORK:;;R. Duarte Pachêco, 90B - Higienópolis;São José do Rio Preto;SP;15085-140;Brasil',
    'URL:https://advocaciafilipecarvalho.com.br',
    'NOTE:Escritório multidisciplinar com especialidade em Direito Empresarial e Tributário.',
    'END:VCARD'
  ].join('\r\n');

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // No celular, usar window.open ou link direto sem o atributo 'download' força a abertura nativa do app de contatos
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Tenta abrir a intent nativa de contato
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } else {
    // No desktop, faz o download do arquivo .vcf normalmente
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Advocacia_Filipe_Carvalho.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  showToast('Abrindo cartão de contato...');
}

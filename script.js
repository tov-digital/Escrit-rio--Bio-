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
 * Save / Open vCard (.vcf) Contact Card directly in mobile Contacts app
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

  // Use mime type text/x-vcard for mobile OS contact import trigger
  const blob = new Blob([vcardData], { type: 'text/x-vcard;charset=utf-8' });
  
  // If browser supports web share API with files (modern mobile browsers)
  const file = new File([blob], 'Advocacia_Filipe_Carvalho.vcf', { type: 'text/x-vcard' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: 'Advocacia Filipe Carvalho',
      text: 'Contato de Advocacia Filipe Carvalho'
    }).catch(() => {
      triggerVCardDownload(blob);
    });
  } else {
    triggerVCardDownload(blob);
  }
}

function triggerVCardDownload(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Advocacia_Filipe_Carvalho.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Abrindo contato...');
}

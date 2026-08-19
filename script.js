/**
 * Dr. Alexandre Medeiros - Link-in-Bio Web App
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
 * Download vCard (.vcf) Contact Card
 */
function downloadVCard() {
  const vcardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Medeiros;Alexandre;Dr.;;',
    'FN:Dr. Alexandre Medeiros',
    'ORG:Medeiros Advocacia & Consultoria Jurídica',
    'TITLE:Advogado & Consultor Jurídico',
    'TEL;TYPE=CELL,VOICE:+5511999999999',
    'EMAIL;TYPE=PREF,INTERNET:contato@medeirosadvocacia.com.br',
    'ADR;TYPE=WORK:;;Av. Paulista, 1500 - Conjunto 1402;São Paulo;SP;01310-200;Brasil',
    'URL:https://medeirosadvocacia.com.br',
    'NOTE:Advocacia & Consultoria Jurídica de Alta Performance',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Dr_Alexandre_Medeiros.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Cartão de contato (.vcf) baixado!');
}

/**
 * ADV. SANDIP DAULAT GAWAI - LAW & NOTARY ASSOCIATES
 * Core Interactive Application Engine
 * Features: Light/Dark Theme, Multilingual Engine (EN/MR/HI),
 * BCI Disclaimer Modal, WhatsApp Lead Dispatcher, FAQ Accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initLanguageEngine();
  initBciDisclaimer();
  initMobileNav();
  initFaqAccordion();
  initConsultationForm();
  initScrollEffects();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark)
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('gawai_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('gawai_theme', theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* --------------------------------------------------------------------------
   2. Multilingual Engine (EN, MR, HI)
   -------------------------------------------------------------------------- */
let currentLanguage = 'en';

function initLanguageEngine() {
  const savedLang = localStorage.getItem('gawai_lang') || 'en';
  setLanguage(savedLang);

  // Dropdown toggle
  const langDropdownBtn = document.getElementById('langDropdownBtn');
  const langDropdownMenu = document.getElementById('langDropdownMenu');

  if (langDropdownBtn && langDropdownMenu) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      langDropdownMenu.classList.remove('show');
    });
  }

  // Language buttons
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.getAttribute('data-lang');
      if (lang) {
        setLanguage(lang);
        if (langDropdownMenu) langDropdownMenu.classList.remove('show');
      }
    });
  });
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  localStorage.setItem('gawai_lang', lang);
  document.documentElement.setAttribute('lang', lang);

  // Update current language label
  const currentLangLabel = document.getElementById('currentLangLabel');
  if (currentLangLabel) {
    const langNames = { en: 'English', mr: 'मराठी', hi: 'हिंदी' };
    currentLangLabel.textContent = langNames[lang] || 'English';
  }

  // Update active status on dropdown options
  document.querySelectorAll('.lang-option').forEach(opt => {
    if (opt.getAttribute('data-lang') === lang) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  // Apply translations to all data-i18n elements
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Apply translations to input placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Bar Council of India (BCI) Compliance Modal
   -------------------------------------------------------------------------- */
function initBciDisclaimer() {
  const bciModal = document.getElementById('bciDisclaimerModal');
  const btnBciAgree = document.getElementById('btnBciAgree');
  const btnBciDecline = document.getElementById('btnBciDecline');
  const btnOpenDisclaimer = document.querySelectorAll('.open-bci-modal');

  const hasAgreed = localStorage.getItem('bci_consent_accepted');

  // Trigger modal on first visit
  if (!hasAgreed && bciModal) {
    setTimeout(() => {
      bciModal.classList.add('active');
    }, 400);
  }

  if (btnBciAgree && bciModal) {
    btnBciAgree.addEventListener('click', () => {
      localStorage.setItem('bci_consent_accepted', 'true');
      bciModal.classList.remove('active');
      showToast('Acknowlegement accepted. Welcome to Gawai Legal Chambers.');
    });
  }

  if (btnBciDecline && bciModal) {
    btnBciDecline.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  // Footer/Nav link to reopen modal
  btnOpenDisclaimer.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bciModal) bciModal.classList.add('active');
    });
  });

  // Close on outside click
  if (bciModal) {
    bciModal.addEventListener('click', (e) => {
      if (e.target === bciModal && localStorage.getItem('bci_consent_accepted')) {
        bciModal.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. Consultation & WhatsApp Dispatcher
   -------------------------------------------------------------------------- */
function initConsultationForm() {
  const consultForm = document.getElementById('consultationForm');
  const btnWhatsApp = document.getElementById('btnSubmitWhatsApp');
  const btnEmail = document.getElementById('btnSubmitEmail');

  if (btnWhatsApp && consultForm) {
    btnWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      dispatchInquiry('whatsapp');
    });
  }

  if (btnEmail && consultForm) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      dispatchInquiry('email');
    });
  }
}

function dispatchInquiry(mode) {
  const name = document.getElementById('clientName')?.value.trim();
  const phone = document.getElementById('clientPhone')?.value.trim();
  const email = document.getElementById('clientEmail')?.value.trim();
  const caseType = document.getElementById('caseType')?.value;
  const consultMode = document.getElementById('consultMode')?.value;
  const message = document.getElementById('clientMessage')?.value.trim();

  if (!name || !phone) {
    showToast('⚠️ Please enter your Full Name and Mobile Number.');
    document.getElementById('clientName')?.focus();
    return;
  }

  const advocateNumber = '918983275131';
  const advocateEmail = 'sandipgawai82@gmail.com';

  const formattedText = 
`*LEGAL CONSULTATION REQUEST*
-----------------------------
*Advocate:* Adv. Sandip Daulat Gawai
*Client Name:* ${name}
*Contact Phone:* ${phone}
*Email:* ${email || 'Not provided'}
*Matter Type:* ${caseType || 'General Consultation'}
*Preferred Mode:* ${consultMode || 'In-Person (Khamgaon)'}
*Brief Summary:*
${message || 'Please arrange a legal consultation.'}
-----------------------------
(Sent from Sandip Gawai Law & Notary Associates Website)`;

  if (mode === 'whatsapp') {
    const whatsappUrl = `https://wa.me/${advocateNumber}?text=${encodeURIComponent(formattedText)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Redirecting to WhatsApp to send your inquiry...');
  } else if (mode === 'email') {
    const mailtoSubject = encodeURIComponent(`Legal Consultation Request: ${name} - ${caseType}`);
    const mailtoBody = encodeURIComponent(formattedText);
    window.location.href = `mailto:${advocateEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
    showToast('Opening your email client...');
  }
}

/* --------------------------------------------------------------------------
   7. Scroll Effects & Active Nav Spy
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.querySelector('.header');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header shadow on scroll
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Nav Spy
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   8. Notary Checklist Modal Handler
   -------------------------------------------------------------------------- */
window.openNotaryModal = function() {
  const modal = document.getElementById('notaryChecklistModal');
  if (modal) modal.classList.add('active');
};

window.closeNotaryModal = function() {
  const modal = document.getElementById('notaryChecklistModal');
  if (modal) modal.classList.remove('active');
};

/* --------------------------------------------------------------------------
   9. Helper: Toast Notification
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

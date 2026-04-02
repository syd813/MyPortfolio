// Theme Toggle
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Scroll Progress & Navbar
const scrollProgress = document.getElementById('scrollProgress');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            scrollProgress.style.width = scrollPercent + '%';
            navbar.classList.toggle('scrolled', scrollTop > 50);
            backToTop.classList.toggle('visible', scrollTop > 400);
            updateActiveNav();

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Active Nav Link
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    allNavLinks.forEach(link => {
        link.classList.toggle('active',
            link.getAttribute('href') === '#' + current);
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '-50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const siblings = entry.target.parentElement ?
                [...entry.target.parentElement.children].filter(
                    el => el.classList.contains(entry.target.className.split(' ')[0])
                ) : [];
            const sibIndex = siblings.indexOf(entry.target);
            const delay = sibIndex >= 0 ? sibIndex * 80 : 0;

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(
    '.section-header, .timeline-item, .project-card, ' +
    '.skill-category, .about-text, .about-stats, .contact-link'
).forEach(el => observer.observe(el));

// =============================================
// AWS PROJECT OVERLAY
// =============================================
const awsOverlay = document.getElementById('awsProjectOverlay');
const awsBtn = document.getElementById('awsProjectBtn');
const overlayClose = document.getElementById('overlayClose');
const overlayBackBtn = document.getElementById('overlayBackBtn');

function openAWSOverlay(e) {
    e.preventDefault();
    awsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    awsOverlay.scrollTop = 0;
}

function closeAWSOverlay() {
    awsOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

awsBtn.addEventListener('click', openAWSOverlay);
overlayClose.addEventListener('click', closeAWSOverlay);
overlayBackBtn.addEventListener('click', closeAWSOverlay);

// =============================================
// INTERNAL REPORT OVERLAY
// =============================================
const internalOverlay = document.getElementById('internalReportOverlay');
const internalBtn = document.getElementById('internalReportBtn');
const internalClose = document.getElementById('internalOverlayClose');
const internalBackBtn = document.getElementById('internalOverlayBackBtn');

function openInternalOverlay(e) {
    e.preventDefault();
    internalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    internalOverlay.scrollTop = 0;
}

function closeInternalOverlay() {
    internalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

internalBtn.addEventListener('click', openInternalOverlay);
internalClose.addEventListener('click', closeInternalOverlay);
internalBackBtn.addEventListener('click', closeInternalOverlay);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (awsOverlay.classList.contains('active')) {
            closeAWSOverlay();
        }
        if (internalOverlay.classList.contains('active')) {
            closeInternalOverlay();
        }
    }
});

// Project Card Expand Toggle (for other projects)
document.querySelectorAll('.project-cta').forEach(btn => {
    // Skip the overlay buttons — they open overlays
    if (btn.id === 'awsProjectBtn' || btn.id === 'internalReportBtn') return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.project-card');
        card.classList.toggle('expanded');
        btn.innerHTML = card.classList.contains('expanded')
            ? 'Show Less <i class="fas fa-arrow-up"></i>'
            : 'View Details <i class="fas fa-arrow-right"></i>';
    });
});

// Smooth Scroll (skip overlay links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.id === 'awsProjectBtn' || this.id === 'internalReportBtn') return; // handled separately
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
// Load shared footer component
async function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            // Determine the correct path based on current location
            const path = window.location.pathname;
            const footerPath = path === '/' || path.endsWith('index.html')
                ? './components/footer.html'
                : '../components/footer.html';

            const response = await fetch(footerPath);
            const html = await response.text();
            footerPlaceholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
}

// Load footer when DOM is ready
loadFooter();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in testimonials on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply to testimonials
document.querySelectorAll('.testimonial').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(el);
});

// Fade in project cards on scroll
document.querySelectorAll('.project-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    fadeInObserver.observe(el);
});

// Handle project card clicks while allowing inner links to work
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on a link
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            return;
        }

        // Get the project URL and open in new tab
        const url = card.getAttribute('data-href');
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    });
});

// Nav background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

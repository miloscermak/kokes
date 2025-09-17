document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');

    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        const scrollToTopButton = document.querySelector('.scroll-to-top');
        if (scrollToTopButton) {
            if (window.scrollY > 300) {
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        }
    });

    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.body.appendChild(scrollToTopButton);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.about-card, .service-card, .floating-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Odesílám...';
            submitButton.disabled = true;
            contactForm.classList.add('loading');

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            const existingMessage = contactForm.querySelector('.success-message, .error-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            
            if (result.success) {
                messageDiv.className = 'success-message';
                messageDiv.textContent = result.message;
                contactForm.reset();
            } else {
                messageDiv.className = 'error-message';
                messageDiv.textContent = result.error;
            }
            
            contactForm.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);

        } catch (error) {
            console.error('Chyba při odesílání formuláře:', error);
            
            const existingMessage = contactForm.querySelector('.success-message, .error-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Došlo k chybě při odesílání zprávy. Zkuste to prosím znovu.';
            contactForm.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            contactForm.classList.remove('loading');
        }
    });

    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('Začít projekt')) {
                e.preventDefault();
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (this.textContent.includes('Více informací')) {
                e.preventDefault();
                document.getElementById('services').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    async function loadStats() {
        try {
            const response = await fetch('/api/stats');
            const result = await response.json();
            
            if (result.success) {
                console.log('Statistiky načteny:', result.data);
            }
        } catch (error) {
            console.error('Chyba při načítání statistik:', error);
        }
    }

    async function loadServices() {
        try {
            const response = await fetch('/api/services');
            const result = await response.json();
            
            if (result.success) {
                console.log('Služby načteny:', result.data);
            }
        } catch (error) {
            console.error('Chyba při načítání služeb:', error);
        }
    }

    loadStats();
    loadServices();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
        });
    });

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0)';
        });
    });

    console.log('🚀 ModernWeb inicializován!');
    console.log('📱 Responzivní design aktivní');
    console.log('🎨 Animace načteny');
    console.log('📧 Kontaktní formulář připraven');
});
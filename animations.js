document.addEventListener('DOMContentLoaded', () => {
    // Optimización de carga de video
    const videoBackground = document.querySelector('.video-background');
    const video = videoBackground?.querySelector('video');
    
    if (video) {
        // Precargar el video
        video.preload = 'auto';
        
        // Evento cuando el video está listo para reproducirse
        video.addEventListener('canplay', () => {
            videoBackground.classList.add('loaded');
        });

        // Optimización de reproducción
        video.playbackRate = 1.0;
        video.muted = true;
        video.loop = true;
        
        // Reproducir el video solo cuando está visible
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        // Manejar error silenciosamente si el autoplay está bloqueado
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });
        
        videoObserver.observe(video);
    }

    // Optimización del header
    const header = document.querySelector('header');
    if (header) {
        // Aplicar backdrop-filter solo después de cargar
        requestAnimationFrame(() => {
            header.style.opacity = '1';
        });
    }

    // Elementos que se animarán
    const animatedElements = document.querySelectorAll(
        '.featured-product, .category-card, .about-content, .contact-container'
    );

    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '20px'
    };

    // Función que se ejecuta cuando un elemento es visible
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadir delay progresivo para elementos en grid
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add('animate-in');
                
                // Animar elementos internos
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${(index + 1) * 100 + parseInt(delay)}ms`;
                    child.classList.add('animate-in');
                });
                
                observer.unobserve(entry.target);
            }
        });
    };

    // Crear el observer
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Configurar delays para elementos en grid
    const grids = document.querySelectorAll('.featured-grid, .category-grid');
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.dataset.delay = index * 100;
        });
    });

    // Observar cada elemento
    animatedElements.forEach(element => {
        element.classList.add('animate-ready');
        observer.observe(element);
    });

    // Animación suave para los enlaces de navegación
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

    // Animación mejorada del header al hacer scroll
    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Añadir clase para el efecto de fondo al hacer scroll
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        // Mejorar la detección de dirección del scroll
        if (Math.abs(currentScroll - lastScroll) < 10) return;

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Añadir efecto hover a las tarjetas de productos
    const productCards = document.querySelectorAll('.featured-product');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}); 
document.addEventListener('DOMContentLoaded', () => {
    // Lazy loading para imágenes
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageOptions = {
        root: null,
        threshold: 0,
        rootMargin: '50px'
    };

    const loadImage = (image) => {
        image.src = image.dataset.src;
        image.classList.add('lazy-load');
        
        image.onload = () => {
            image.classList.add('loaded');
            image.removeAttribute('data-src');
        };
    };

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, imageOptions);

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        lazyImages.forEach(img => loadImage(img));
    }

    // Función para comprimir imágenes antes de subirlas (para formularios)
    const compressImage = async (file, { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = {}) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            resolve(blob);
                        },
                        'image/jpeg',
                        quality
                    );
                };
            };
        });
    };

    // Ejemplo de uso para formularios con imágenes
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const compressedBlob = await compressImage(file);
                // Aquí puedes usar el blob comprimido para enviarlo al servidor
                console.log('Imagen comprimida:', compressedBlob);
            }
        });
    });
}); 
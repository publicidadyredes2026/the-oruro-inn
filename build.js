const fs = require('fs');
const path = require('path');

const PALETTE = {
    primary: '#8b5cf6',
    primaryDark: '#5b21b6',
    secondary: '#2e1065'
};

function generateHTML(data) {
    const { name, address, phone, mainImage, images, rating, reviews, amenities, prices, testimonials } = data;

    let galleryHTML = '';
    if (images && images.length > 0) {
        galleryHTML = `
        <section id="galeria" class="gallery-section">
            <div class="container">
                <h2 class="section-title reveal">Nuestras Instalaciones</h2>
                <div class="gallery-grid">
                    ${images.map(img => `
                        <div class="gallery-item reveal">
                            <img src="${img}" alt="Foto de ${name}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>`;
    }

    let amenitiesHTML = '';
    if (amenities && amenities.length > 0) {
        amenitiesHTML = `
        <section id="servicios" class="amenities-section">
            <div class="container">
                <h2 class="section-title reveal">Servicios Destacados</h2>
                <div class="amenities-grid">
                    ${amenities.map(am => `
                        <div class="amenity-card reveal">
                            <i class="fa-solid fa-check-circle"></i>
                            <span>${am}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>`;
    }

    let roomsHTML = '';
    if (prices && prices.length > 0) {
        roomsHTML = `
        <section id="habitaciones" class="rooms-section">
            <div class="container">
                <h2 class="section-title reveal">Tarifas y Habitaciones</h2>
                <div class="rooms-grid">
                    ${prices.map((p, i) => {
                        const roomImg = p.image || (images && images[i]) || mainImage;
                        return `
                        <div class="room-card reveal">
                            <div class="room-img" style="background-image: url('${roomImg}');">
                                <div class="room-price">${p.price} <span>/ noche</span></div>
                            </div>
                            <div class="room-info">
                                <h3>${p.type || 'Habitación Estándar'}</h3>
                                <p>Disfruta de la máxima comodidad en nuestras instalaciones de primer nivel.</p>
                                <a href="https://wa.me/${phone}?text=Hola,%20me%20interesa%20la%20opción%20de%20${encodeURIComponent(p.price)}" target="_blank" class="btn-primary btn-block">Consultar Disponibilidad</a>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </section>`;
    }

    let testimonialsHTML = '';
    if (testimonials && testimonials.length > 0) {
        testimonialsHTML = `
        <section id="opiniones" class="testimonials-section">
            <div class="container">
                <h2 class="section-title reveal">Lo que dicen nuestros clientes</h2>
                <div class="testimonials-grid">
                    ${testimonials.map(t => `
                        <div class="testimonial-card reveal">
                            <div class="stars">
                                ${'<i class="fa-solid fa-star"></i>'.repeat(t.stars || 5)}
                            </div>
                            <p class="quote">"${t.text}"</p>
                            <p class="author">- ${t.author || 'Huésped verificado'}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>`;
    }

    let reviewsBadge = '';
    if (rating && reviews) {
        reviewsBadge = `
        <div class="rating-badge reveal">
            <i class="fa-solid fa-star"></i> ${rating} 
            <span>(${reviews} reseñas en Google)</span>
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Sitio Oficial</title>
    <meta name="description" content="Descubre ${name} en ${address}.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: ${PALETTE.primary};
            --primary-dark: ${PALETTE.primaryDark};
            --secondary-color: ${PALETTE.secondary};
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="container nav-content">
            <div class="logo">
                <i class="fa-solid fa-hotel"></i>
                <span>${name}</span>
            </div>
            <nav class="nav-links">
                <a href="#inicio">Inicio</a>
                ${amenities && amenities.length ? '<a href="#servicios">Servicios</a>' : ''}
                ${prices && prices.length ? '<a href="#habitaciones">Habitaciones</a>' : ''}
                ${images && images.length ? '<a href="#galeria">Galería</a>' : ''}
                ${testimonials && testimonials.length ? '<a href="#opiniones">Opiniones</a>' : ''}
            </nav>
        </div>
    </header>

    <main>
        <section id="inicio" class="hero" style="background-image: url('${mainImage}');">
            <div class="hero-overlay"></div>
            <div class="container hero-content">
                ${reviewsBadge}
                <h1 class="reveal">Experiencia inolvidable en <br><span class="highlight">${name}</span></h1>
                <p class="reveal">Tu confort es nuestra prioridad. Ubicados en ${address}.</p>
                <div class="hero-buttons reveal">
                    <a href="https://wa.me/${phone}?text=Hola,%20deseo%20más%20información" target="_blank" class="btn-primary">
                        <i class="fa-brands fa-whatsapp"></i> Reservar Ahora
                    </a>
                </div>
            </div>
        </section>

        ${amenitiesHTML}
        ${roomsHTML}
        ${galleryHTML}
        ${testimonialsHTML}

    </main>

    <footer id="contacto">
        <div class="container footer-content">
            <div class="footer-brand">
                <h3>${name}</h3>
                <p>La mejor estadía garantizada.</p>
            </div>
            <div class="footer-contact">
                <h4>Contacto</h4>
                <p><i class="fa-solid fa-location-dot"></i> ${address}</p>
                <p><i class="fa-solid fa-phone"></i> +${phone}</p>
            </div>
            <div class="footer-map">
                <iframe width="100%" height="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=${encodeURIComponent(name + ' ' + address)}&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} ${name}. Todos los derechos reservados.</p>
        </div>
    </footer>

    <a href="https://wa.me/${phone}" target="_blank" class="floating-whatsapp" aria-label="Contactar por WhatsApp">
        <i class="fa-brands fa-whatsapp"></i>
    </a>

    <script src="script.js"></script>
</body>
</html>`;
}

const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const html = generateHTML(data);
fs.writeFileSync(path.join(__dirname, 'index.html'), html);

console.log('Sitio web regenerado correctamente desde data.json');

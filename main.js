document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('show');
            }
        });
    });

    // Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations (reveal from bottom)
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly before element comes into view
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Supabase Configuration ---
    const SUPABASE_URL = 'https://qfbfjhammawyjvlkmmfi.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmZqaGFtbWF3eWp2bGttbWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDA1MzEsImV4cCI6MjA4NzM3NjUzMX0.iMvQ__eSkPi6_SoTACF7YYgcK0TPNIbQ6ol2rmpWeIs';

    let supabaseClient = null;

    try {
        if (typeof window.supabase !== 'undefined' && SUPABASE_URL.includes('supabase.co')) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase conectado correctamente');
        } else {
            console.warn('Supabase no cargado o sin llaves');
        }
    } catch (err) {
        console.error('Error al inicializar Supabase:', err);
    }

    // Simple Form Submission Handler
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        console.log('Formulario detectado, vinculando evento...');
        bookingForm.addEventListener('submit', async (e) => {
            // MOVER ESTO AL PRINCIPIO PARA EVITAR QUE LA PÁGINA SE RECARGUE SI HAY UN ERROR DESPUÉS
            e.preventDefault();
            console.log('Formulario enviado, procesando...');

            // Get form data
            const btn = bookingForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;

            // Show loading state
            btn.innerHTML = '<span>Procesando...</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="spin" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line></svg>';
            btn.disabled = true;

            const formData = new FormData(bookingForm);
            const bookingData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                service: formData.get('service'),
                car: formData.get('car')
            };

            try {
                if (supabaseClient) {
                    console.log('Enviando a Supabase:', bookingData);
                    const { error } = await supabaseClient
                        .from('bookings')
                        .insert([bookingData]);

                    if (error) throw error;
                    console.log('Guardado exitoso en Supabase');
                } else {
                    console.warn('Usando simulación local');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                // Reset form
                bookingForm.reset();

                // Show success state
                btn.innerHTML = '<span>¡Reserva Confirmada!</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                btn.style.background = 'linear-gradient(135deg, #10B981, #059669)'; // Green success

            } catch (error) {
                console.error('Error al guardar reserva:', error);
                alert('Hubo un error al guardar la reserva. Revisa tu conexión.');
                btn.innerHTML = '<span>Error al reservar</span>';
                btn.style.background = 'linear-gradient(135deg, #EF4444, #B91C1C)';
            } finally {
                btn.disabled = false;
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    } else {
        console.error('No se encontró el elemento #bookingForm');
    }

    // --- Interactive Water Ripple Effect ---
    const rippleContainer = document.getElementById('ripple-container');
    const heroSection = document.getElementById('inicio');

    if (rippleContainer && heroSection) {
        let lastRippleTime = 0;
        const rippleInterval = 50; // Milliseconds between ripples (throttling)

        heroSection.addEventListener('mousemove', (e) => {
            const currentTime = Date.now();
            if (currentTime - lastRippleTime < rippleInterval) return;

            lastRippleTime = currentTime;

            // Get mouse position relative to hero section
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create ripple element
            const ripple = document.createElement('div');
            ripple.className = 'ripple';

            // Randomize size slightly for a more natural look
            const size = Math.random() * 40 + 20;
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            rippleContainer.appendChild(ripple);

            // Clean up
            setTimeout(() => {
                ripple.remove();
            }, 1500);
        });
    }

    // --- Mobile Nav Active State on Scroll ---
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });

        // Active state for desktop nav links too
        const desktopLinks = document.querySelectorAll('.nav-link');
        desktopLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

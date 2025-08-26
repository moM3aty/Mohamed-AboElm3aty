class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.updateLanguage();
        
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('language', this.currentLang);
        this.updateLanguage();
    }

    updateLanguage() {
        const html = document.documentElement;
        const langText = document.getElementById('lang-text');

        html.setAttribute('lang', this.currentLang);
        html.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
        if (langText) {
            langText.textContent = this.currentLang === 'en' ? 'AR' : 'EN';
        }

        document.querySelectorAll('[data-en][data-ar]').forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) element.textContent = text;
        });
        
        document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(element => {
            const placeholder = element.getAttribute(`data-${this.currentLang}-placeholder`);
            if (placeholder) element.setAttribute('placeholder', placeholder);
        });

        const titleElement = document.querySelector('title[data-en][data-ar]');
        if (titleElement) {
            const title = titleElement.getAttribute(`data-${this.currentLang}`);
            if (title) document.title = title;
        }
    }
}

class CertificateModal {
    constructor() {
        this.modalElement = document.getElementById('certificateModal');
        this.certImage = document.getElementById('cert-image');
        this.currentZoom = 1;
        this.currentCert = null;

        if (this.modalElement && typeof bootstrap !== "undefined" && bootstrap.Modal) {
            this.modal = new bootstrap.Modal(this.modalElement);
            this.init();
        } else {
            console.warn("Bootstrap Modal not available or #certificateModal not found.");
        }
    }

    init() {
    this.certificates = {
    cert1: {
        title: 'Intensive Program - Full Stack .Net',
        image: '../assets/certificates/certificate1.png', 
        pdf: 'assets/certificates/ITI4Month.pdf'  
    },
    cert2: {
        title: 'Programming with JavaScript',
        image: '../assets/certificates/certificate2.png',
        pdf: 'assets/certificates/JSMeta.pdf'
    },
    cert3: {
        title: 'CCNA 200-301',
        image: '../assets/certificates/certificate3.png',
        pdf: 'assets/certificates/CCNA 200-301.pdf'
    },
    cert4: {
        title: 'MCSA 2016',
        image: '../assets/certificates/certificate7.jpg',
        pdf: 'assets/certificates/SystemAdministration.pdf'
    },
    cert5: {
        title: 'Summer Trainee - ASP.NET MVC',
        image: '../assets/certificates/certificate4.png',
        pdf: 'assets/certificates/ITI.pdf'
    },
    cert6: {
        title: 'Bachelor of Science in Computer Science',
        image: '../assets/certificates/certificate5.png',
        pdf: 'assets/certificates/Graduate.pdf'
    },
    cert7: {
        title: 'Thanks and Appreciation',
        image: '../assets/certificates/certificate6.png',
        pdf: 'assets/certificates/LifeMakers.pdf'
    }
};

        document.querySelectorAll('.view-cert').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const certId = e.currentTarget.getAttribute('data-cert');
                this.openCertificate(certId);
            });
        });

        document.getElementById('zoom-in')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('download-cert')?.addEventListener('click', () => this.downloadCertificate());

        this.modalElement?.addEventListener('hidden.bs.modal', () => this.resetZoom());
    }

    openCertificate(certId) {
    const cert = this.certificates[certId];
    if (!cert) return;

    this.currentCert = cert;

    if (this.certImage) {
        this.certImage.src = cert.image;   
        this.certImage.alt = cert.title;
    }

    this.resetZoom();
    this.modal?.show();
}

    zoomIn() {
        this.currentZoom = Math.min(this.currentZoom * 1.2, 3);
        this.updateZoom();
    }

    zoomOut() {
        this.currentZoom = Math.max(this.currentZoom / 1.2, 0.5);
        this.updateZoom();
    }

    resetZoom() {
        this.currentZoom = 1;
        this.updateZoom();
    }

    updateZoom() {
        if (this.certImage) {
            this.certImage.style.transform = `scale(${this.currentZoom})`;
            this.certImage.classList.toggle('zoomed', this.currentZoom > 1);
        }
    }

    downloadCertificate() {
    if (this.currentCert) {
        const link = document.createElement('a');
        link.href = this.currentCert.pdf;   
        link.download = `${this.currentCert.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
}

class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse?.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
                    }
                }
            });
        });

        window.addEventListener('scroll', () => this.updateActiveLink());
        window.addEventListener('scroll', () => this.updateNavbar());
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
    }

    updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    }
}

class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    if (entry.target.classList.contains('skill-card')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll([
            '.skill-card',
            '.cert-card',
            '.about-content',
            '.contact-item'
        ].join(',')).forEach(el => observer.observe(el));
    }

    animateSkillBar(skillCard) {
        const skillBar = skillCard.querySelector('.skill-bar');
        if (skillBar) {
            setTimeout(() => {
                const skillWidth = skillCard.getAttribute('data-skill') + '%';
                skillBar.style.setProperty('--skill-width', skillWidth);
            }, 300);
        }
    }
}

class PortfolioManager {
    constructor() {
        this.portfolioItems = [];
        this.langManager = new LanguageManager();
        this.init();
    }

    async init() {
        this.portfolioItems = await db.getAllItems();
        this.renderPortfolio();
        this.initCarousel();
        this.initDesignModal();
    }

    renderPortfolio() {
        const projectsGrid = document.getElementById('portfolio-projects-grid');
        const designsGrid = document.getElementById('portfolio-designs-grid');
        const projectsGridFull = document.getElementById('portfolio-projects-grid-full');
        const designsGridFull = document.getElementById('portfolio-designs-grid-full');

        const grids = [projectsGrid, designsGrid, projectsGridFull, designsGridFull];
        grids.forEach(grid => { if (grid) grid.innerHTML = '' });

        this.portfolioItems.forEach((item, index) => {
            if (item.type === 'project') {
                const projectHtml = this.createProjectItem(item);
                if (projectsGrid) projectsGrid.innerHTML += projectHtml;
                if (projectsGridFull) projectsGridFull.innerHTML += projectHtml;
            } else if (item.type === 'design') {
                const designHtml = this.createDesignItem(item, index);
                if (designsGrid) designsGrid.innerHTML += designHtml;
                if (designsGridFull) designsGridFull.innerHTML += designHtml;
            }
        });
        this.langManager.updateLanguage(); // Re-apply language after dynamic render
    }

    createProjectItem(item) {
        const imageUrl = item.coverImage instanceof Blob ? URL.createObjectURL(item.coverImage) : item.coverImage;
        return `
            <div class="col-md-6 col-xl-4">
                <div class="portfolio-item">
                    <div class="portfolio-image">
                        <img src="${imageUrl}" alt="${item.titleEn}">
                        <div class="portfolio-overlay">
                            <h4 data-en="${item.titleEn}" data-ar="${item.titleAr}">${item.titleEn}</h4>
                            <div class="portfolio-links">
                                <a href="${item.liveUrl}" target="_blank" class=""><i class="fas fa-external-link-alt"></i></a>
                                <a href="${item.githubUrl}" target="_blank" class=""><i class="fab fa-github"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    createDesignItem(item, index) {
        const imageUrl = item.coverImage instanceof Blob ? URL.createObjectURL(item.coverImage) : item.coverImage;
        return `
            <div class="swiper-slide">
                <div class="portfolio-item">
                    <div class="portfolio-image">
                        <img src="${imageUrl}" alt="${item.titleEn}">
                        <div class="portfolio-overlay">
                            <div class="portfolio-links">
                                <button class="view-design" data-index="${index}">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    initCarousel() {
        if (document.querySelector('.designs-carousel')) {
            new Swiper('.designs-carousel', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 40 },
                    1024: { slidesPerView: 4, spaceBetween: 50 },
                }
            });
        }
    }

    initDesignModal() {
        const designModalEl = document.getElementById('designModal');
        if (!designModalEl) return;

        const designModal = new bootstrap.Modal(designModalEl);
        const modalImagesContainer = document.getElementById('designModalImagesContainer');
        let modalSwiper;

        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.view-design')) {
                const button = e.target.closest('.view-design');
                const index = parseInt(button.dataset.index);
                const item = this.portfolioItems[index];

                if (item && item.galleryImages) {
                    modalImagesContainer.innerHTML = item.galleryImages.map(imgBlob => {
                        const url = imgBlob instanceof Blob ? URL.createObjectURL(imgBlob) : imgBlob;
                        return `<div class="swiper-slide"><img src="${url}" class="img-fluid"></div>`;
                    }).join('');
                    
                    designModal.show();

                    if (modalSwiper) {
                        modalSwiper.destroy(true, true);
                    }
                    
                    modalSwiper = new Swiper('.design-modal-carousel', {
                        loop: true,
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    });
                }
            }
        });
    }
}


class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CertificateModal();
    new NavigationManager();
    new AnimationObserver();
    new PortfolioManager();
    document.body.classList.add('loaded');
    
    const form = document.querySelector(".contact-form");
    let currentErrors = {};

    const errors = {
        en: {
            name: "Please enter your name.",
            email: "Please enter a valid email.",
            subject: "Please enter a subject.",
            message: "Please enter your message."
        },
        ar: {
            name: "من فضلك أدخل اسمك.",
            email: "من فضلك أدخل بريد إلكتروني صحيح.",
            subject: "من فضلك أدخل الموضوع.",
            message: "من فضلك أدخل رسالتك."
        }
    };

    function validateForm() {
        const lang = document.documentElement.lang || "en";
        let valid = true;
        currentErrors = {};

        const successMsg = document.getElementById("success-msg");
        if (successMsg) {
            successMsg.textContent = "";
            successMsg.style.display = "none";
        }

        document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

        const nameField = document.querySelector("input[name='name']");
        const emailField = document.querySelector("input[name='email']");
        const subjectField = document.querySelector("input[name='subject']");
        const messageField = document.querySelector("textarea[name='message']");

        if (!nameField?.value.trim()) {
            nameField?.nextElementSibling && (nameField.nextElementSibling.textContent = errors[lang].name);
            currentErrors.name = "name";
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailField?.value.trim() || !emailRegex.test(emailField.value)) {
            emailField?.nextElementSibling && (emailField.nextElementSibling.textContent = errors[lang].email);
            currentErrors.email = "email";
            valid = false;
        }

        if (!subjectField?.value.trim()) {
            subjectField?.nextElementSibling && (subjectField.nextElementSibling.textContent = errors[lang].subject);
            currentErrors.subject = "subject";
            valid = false;
        }

        if (!messageField?.value.trim()) {
            messageField?.nextElementSibling && (messageField.nextElementSibling.textContent = errors[lang].message);
            currentErrors.message = "message";
            valid = false;
        }

        return valid;
    }

    form?.addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateForm()) {
            const name = document.querySelector("input[name='name']").value.trim();
            const email = document.querySelector("input[name='email']").value.trim();
            const subject = document.querySelector("input[name='subject']").value.trim();
            const message = document.querySelector("textarea[name='message']").value.trim();

            const phoneNumber = "201275844735";
            const whatsappMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);

            document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
            currentErrors = {};
            form.reset();

            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        }
    });

    document.getElementById("lang-toggle")?.addEventListener("click", () => {
        const lang = document.documentElement.lang;
        for (const fieldName in currentErrors) {
            const field = document.querySelector(`[name='${fieldName}']`);
            if (field) {
                field.nextElementSibling.textContent = errors[lang][currentErrors[fieldName]];
            }
        }
        const successMsg = document.getElementById("success-msg");
        if (successMsg?.style.display === "block") {
            successMsg.textContent = lang === "ar"
                ? "تم إرسال الرسالة بنجاح."
                : "Message sent successfully.";
            setTimeout(() => { successMsg.style.display = "none"; }, 5000);
        }
    });
     const downloadCvButtons = document.querySelectorAll('.download-cv');
    downloadCvButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filePath = this.getAttribute('data-file');
            if (filePath) {
                const link = document.createElement('a');
                link.href = filePath;
                link.download = filePath.split('/').pop(); // Extracts filename from path
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });
});

document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
});

window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

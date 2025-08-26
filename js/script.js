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
        }
    }

    init() {
        this.certificates = {
            cert1: { title: 'Intensive Program - Full Stack .Net', image: 'assets/certificates/certificate1.png', pdf: 'assets/certificates/ITI4Month.pdf' },
            cert2: { title: 'Programming with JavaScript', image: 'assets/certificates/certificate2.png', pdf: 'assets/certificates/JSMeta.pdf' },
            cert3: { title: 'CCNA 200-301', image: 'assets/certificates/certificate3.png', pdf: 'assets/certificates/CCNA 200-301.pdf' },
            cert4: { title: 'MCSA 2016', image: 'assets/certificates/certificate7.jpg', pdf: 'assets/certificates/SystemAdministration.pdf' },
            cert5: { title: 'Summer Trainee - ASP.NET MVC', image: 'assets/certificates/certificate4.png', pdf: 'assets/certificates/ITI.pdf' },
            cert6: { title: 'Bachelor of Science in Computer Science', image: 'assets/certificates/certificate5.png', pdf: 'assets/certificates/Graduate.pdf' },
            cert7: { title: 'Thanks and Appreciation', image: 'assets/certificates/certificate6.png', pdf: 'assets/certificates/LifeMakers.pdf' }
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

    zoomIn() { this.currentZoom = Math.min(this.currentZoom * 1.2, 3); this.updateZoom(); }
    zoomOut() { this.currentZoom = Math.max(this.currentZoom / 1.2, 0.5); this.updateZoom(); }
    resetZoom() { this.currentZoom = 1; this.updateZoom(); }

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
        document.querySelectorAll('.navbar-nav a[href]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse?.classList.contains('show')) {
                            bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
                        }
                    } else if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                        window.location.href = 'index.html' + targetId;
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
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').endsWith(`#${currentSection}`));
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
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.skill-card, .cert-card, .about-content, .contact-item').forEach(el => observer.observe(el));
    }
}

class PortfolioManager {
    constructor() {
        this.portfolioItems = [];
        this.langManager = new LanguageManager();
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.swiperInstance = null;
        this.init();
    }

    async init() {
        this.portfolioItems = await db.getAllItems();
        this.portfolioItems.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
        this.renderItems();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const filters = document.getElementById('portfolio-filters');
        if (filters) filters.addEventListener('click', (e) => this.handleFilterClick(e));

        const searchInput = document.getElementById('portfolio-search');
        if (searchInput) searchInput.addEventListener('input', (e) => this.handleSearch(e));

        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => this.handleLoadMore());

        document.body.addEventListener('click', (e) => {
            const viewButton = e.target.closest('.view-design-btn');
            if (viewButton) {
                e.preventDefault();
                const index = parseInt(viewButton.dataset.index);
                const item = this.portfolioItems[index];
                if (item && item.galleryImages) this.openDesignModal(item);
            }
        });

        const closeModalBtn = document.getElementById('modal-close-btn-immersive');
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeDesignModal());
    }

    renderItems() {
        const isHomePage = document.getElementById('portfolio-grid-home') !== null;
        if (isHomePage) this.renderHomePageItems();
        else this.renderPortfolioPageItems();
    }

    renderHomePageItems() {
        const grid = document.getElementById('portfolio-grid-home');
        if (!grid) return;
        grid.innerHTML = '';
        const items = this.portfolioItems.slice(0, 6);
        items.forEach(item => {
            grid.innerHTML += this.createPortfolioItemHTML(item, true);
        });
        this.langManager.updateLanguage();
    }

    renderPortfolioPageItems() {
        const grid = document.getElementById('portfolio-grid-full');
        if (!grid) return;

        let filteredItems = this.portfolioItems;
        if (this.currentFilter !== 'all') {
            filteredItems = filteredItems.filter(item => item.type === this.currentFilter);
        }

        if (this.currentSearch) {
            const lowerCaseSearch = this.currentSearch.toLowerCase();
            filteredItems = filteredItems.filter(item =>
                item.titleEn.toLowerCase().includes(lowerCaseSearch) ||
                item.titleAr.toLowerCase().includes(lowerCaseSearch)
            );
        }

        const itemsToShow = filteredItems.slice(0, this.currentPage * this.itemsPerPage);

        grid.innerHTML = '';
        if (itemsToShow.length === 0) {
            grid.innerHTML = `<p class="text-center text-muted col-12">No items found.</p>`;
        } else {
            itemsToShow.forEach(item => {
                grid.innerHTML += this.createPortfolioItemHTML(item, false);
            });
        }

        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) loadMoreBtn.style.display = (itemsToShow.length < filteredItems.length) ? 'inline-block' : 'none';

        this.langManager.updateLanguage();
        this.applyMasonryLayout('#portfolio-grid-full');
    }

    applyMasonryLayout(gridSelector) {
        const grid = document.querySelector(gridSelector);
        if (!grid) return;

        const items = grid.querySelectorAll('.portfolio-item-wrapper');
        const rowHeight = 7;
        const rowGap = 24;

        items.forEach(item => {
            const img = item.querySelector('img');
            const setSpan = () => {
                const contentHeight = item.querySelector('.portfolio-item').clientHeight;
                const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight));
                item.style.gridRowEnd = `span ${rowSpan}`;
            };

            if (img.complete) {
                setSpan();
            } else {
                img.addEventListener('load', setSpan);
            }
        });
    }

    handleFilterClick(e) {
        if (!e.target.matches('.filter-btn-new')) return;
        document.querySelector('#portfolio-filters .active').classList.remove('active');
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.currentPage = 1;
        this.renderPortfolioPageItems();
    }

    handleSearch(e) {
        this.currentSearch = e.target.value;
        this.currentPage = 1;
        this.renderPortfolioPageItems();
    }

    handleLoadMore() {
        this.currentPage++;
        this.renderPortfolioPageItems();
    }

    openDesignModal(item) {
        const modal = document.getElementById('design-modal-immersive');
        const modalImagesContainer = document.getElementById('designModalImagesContainer');
        if (!modal || !modalImagesContainer) return;

        modalImagesContainer.innerHTML = item.galleryImages.map(imgSrc => {
            const url = imgSrc instanceof Blob ? URL.createObjectURL(imgSrc) : imgSrc;
            return `<div class="swiper-slide"><img src="${url}" class="img-fluid"></div>`;
        }).join('');

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        if (this.swiperInstance) this.swiperInstance.destroy(true, true);
        this.swiperInstance = new Swiper('.design-modal-carousel', {
            loop: true,
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }

    closeDesignModal() {
        const modal = document.getElementById('design-modal-immersive');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    createPortfolioItemHTML(item, isHomePageGrid = false) {
        const originalIndex = this.portfolioItems.findIndex(p => p.id === item.id);
        const imageUrl = item.coverImage instanceof Blob ? URL.createObjectURL(item.coverImage) : item.coverImage;

        let linksHtml = '';
        if (item.type === 'project') {
            linksHtml = `
            <h4 data-en="${item.titleEn}" data-ar="${item.titleAr}">${item.titleEn}</h4>
            <div class="portfolio-links">
                <a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>
                <a href="${item.githubUrl}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>
            </div>`;
        } else {
            linksHtml = ` <div class="portfolio-links">
            <button class="view-design-btn" data-index="${originalIndex}"><i class="fas fa-eye"></i></button></div>`;
        }

        const wrapperClass = isHomePageGrid ? 'col-md-6 col-lg-6' : 'portfolio-item-wrapper';

        return `
            <div class="${wrapperClass}">
                <div class="portfolio-item">
                    <div class="portfolio-image">
                        <img src="${imageUrl}" alt="${item.titleEn}" loading="lazy">
                        <div class="portfolio-overlay">
                        ${linksHtml}
                        </div>
                    </div>
                </div>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
    new CertificateModal();
    new NavigationManager();
    new AnimationObserver();
    new PortfolioManager();
    document.body.classList.add('loaded');

    const form = document.querySelector(".contact-form");
    if (form) {
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

        const validateForm = () => {
            const lang = document.documentElement.lang || "en";
            let valid = true;
            currentErrors = {};

            document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

            const nameField = form.querySelector("input[name='name']");
            const emailField = form.querySelector("input[name='email']");
            const subjectField = form.querySelector("input[name='subject']");
            const messageField = form.querySelector("textarea[name='message']");

            if (!nameField?.value.trim()) {
                nameField?.nextElementSibling && (nameField.nextElementSibling.textContent = errors[lang].name);
                valid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField?.value.trim() || !emailRegex.test(emailField.value)) {
                emailField?.nextElementSibling && (emailField.nextElementSibling.textContent = errors[lang].email);
                valid = false;
            }

            if (!subjectField?.value.trim()) {
                subjectField?.nextElementSibling && (subjectField.nextElementSibling.textContent = errors[lang].subject);
                valid = false;
            }

            if (!messageField?.value.trim()) {
                messageField?.nextElementSibling && (messageField.nextElementSibling.textContent = errors[lang].message);
                valid = false;
            }

            return valid;
        };

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (validateForm()) {
                const name = form.querySelector("input[name='name']").value.trim();
                const email = form.querySelector("input[name='email']").value.trim();
                const subject = form.querySelector("input[name='subject']").value.trim();
                const message = form.querySelector("textarea[name='message']").value.trim();
                const phoneNumber = "201275844735";
                const whatsappMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
                form.reset();
            }
        });
    }

    const downloadCvButtons = document.querySelectorAll('.download-cv');
    downloadCvButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filePath = this.getAttribute('data-file');
            if (filePath) {
                const link = document.createElement('a');
                link.href = filePath;
                link.download = filePath.split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });

    const skillsTab = document.querySelector('#skillsTab');
    if (skillsTab) {
        const animateSkillBars = (paneId) => {
            const targetPane = document.querySelector(paneId);
            if (!targetPane) return;
            const skillBars = targetPane.querySelectorAll('.skill-bar');
            gsap.set(skillBars, { width: '0%' });
            skillBars.forEach(bar => {
                const skillCard = bar.closest('.skill-card');
                const skillLevel = skillCard.dataset.skill;
                gsap.to(bar, {
                    width: skillLevel + '%',
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: 0.2
                });
            });
        };

        skillsTab.addEventListener('shown.bs.tab', event => {
            const newPaneId = event.target.getAttribute('data-bs-target');
            animateSkillBars(newPaneId);
        });

        const initialActiveTab = skillsTab.querySelector('.nav-link.active');
        if (initialActiveTab) {
            const initialPaneId = initialActiveTab.getAttribute('data-bs-target');
            setTimeout(() => {
                animateSkillBars(initialPaneId);
            }, 300);
        }
    }
});

// Register GSAP plugins immediately when the script loads
gsap.registerPlugin(ScrollTrigger);

class AnimationsManager {
    constructor() {
        this.init();
    }

    init() {
        // Run animations only if the corresponding elements exist on the page
        if (document.querySelector('.hero-section')) {
            this.heroAnimations();
        }
        if (document.querySelector('.section-title')) {
            this.sectionAnimations();
        }
        if (document.querySelector('.skill-card')) {
            this.skillAnimations();
        }
        if (document.querySelector('.portfolio-item')) {
            this.portfolioAnimations();
        }
        if (document.querySelector('.contact-item')) {
            this.contactAnimations();
        }
        if (document.querySelector('#network-canvas')) {
            this.backgroundAnimations();
            new NetworkCanvas(); // Initialize canvas only if it exists
        }
        
        this.mouseFollowAnimations();
        this.initButtonAnimations();
        this.initPageTransitions();
    }

    heroAnimations() {
        const timeline = gsap.timeline();

        timeline.from('.hero-title', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        timeline.from('.stat-item', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.8');

        timeline.from('.hero-buttons .btn', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        }, '-=0.4');

        timeline.from('.profile-img', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: 'elastic.out(1, 0.5)'
        }, '-=0.8');

        timeline.from('.status-badge, .role-badge', {
            duration: 0.6,
            scale: 0,
            opacity: 0,
            stagger: 0.2,
            ease: 'back.out(2)'
        }, '-=0.5');

        gsap.to('.status-badge', {
            scale: 1.05,
            duration: 2,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    sectionAnimations() {
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    end: 'bottom 20%'
                },
                duration: 1,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            });
        });

        gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
            gsap.from(subtitle, {
                scrollTrigger: {
                    trigger: subtitle,
                    start: 'top 80%',
                    end: 'bottom 20%'
                },
                duration: 0.8,
                y: 20,
                opacity: 0,
                delay: 0.2,
                ease: 'power2.out'
            });
        });

        if (document.querySelector('.about-content')) {
            gsap.from('.about-content h3', {
                scrollTrigger: {
                    trigger: '.about-content',
                    start: 'top 80%'
                },
                duration: 1,
                opacity: 0,
                ease: 'power2.out'
            });

            gsap.from('.about-content p', {
                scrollTrigger: {
                    trigger: '.about-content',
                    start: 'top 80%'
                },
                duration: 0.8,
                opacity: 0,
                stagger: 0.2,
                delay: 0.3,
                ease: 'power2.out'
            });
        }
    }

    skillAnimations() {
        gsap.utils.toArray('.skill-card').forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                yPercent: 20,
                opacity: 0,
                ease: 'power2.out'
            });
            // The logic for animating the skill-bar itself has been moved to script.js
            // to be triggered by tab clicks, so we remove it from here.
        });
    }

    portfolioAnimations() {
        // This function can be used later if needed
    }

    contactAnimations() {
        gsap.utils.toArray('.contact-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%'
                },
                duration: 0.8,
                opacity: 0,    
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });

        if (document.querySelector('.social-links')) {
            gsap.from('.social-link', {
                scrollTrigger: {
                    trigger: '.social-links',
                    start: 'top 80%'
                },
                duration: 0.6,
                scale: 0,
                opacity: 0,
                stagger: 0.1,
                delay: 0.5,
                ease: 'back.out(2)'
            });
        }

        if (document.querySelector('.contact-form')) {
            gsap.from('.contact-form .form-group', {
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: 'top 80%'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    }

    backgroundAnimations() {
        gsap.utils.toArray('.cert-card, .skill-card, .resume-card').forEach((card, index) => {
            gsap.to(card, {
                y: -10,
                duration: 2 + (index % 3) * 0.5,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1,
                delay: index * 0.2
            });
        });

        gsap.utils.toArray('.section-padding').forEach(section => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                ease: 'none'
            });
        });
    }

    mouseFollowAnimations() {
        // This can be expanded later if needed
    }

    initButtonAnimations() {
        // This can be expanded later if needed
    }
    
    initPageTransitions() {
        gsap.from('body', {
            duration: 0.8,
            opacity: 0,
            ease: 'power2.out'
        });

        if (document.querySelector('section')) {
            gsap.utils.toArray('section').forEach(section => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%',
                        once: true
                    },
                    duration: 1,
                    y: 50,
                    opacity: 0,
                    ease: 'power2.out'
                });
            });
        }
    }
}

class NetworkCanvas {
    constructor() {
        this.canvas = document.getElementById('network-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const numParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
    }

    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (maxDistance - distance) / maxDistance * 0.5;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnimationsManager();
});

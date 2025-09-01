class Portfolio {
    constructor() {
        this.resizeTimeout = null; 
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Visit Profile button - transitions from welcome screen to portfolio
        const visitProfileBtn = document.getElementById('visitProfileBtn');
        if (visitProfileBtn) {
            visitProfileBtn.addEventListener('click', () => {
                this.showPortfolio();
            });
        }
        
        this.setupSmoothScrolling();
        
        // Download resume button
        const downloadBtn = document.getElementById('downloadResume');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleResumeDownload();
            });
        }
        
        // Mobile menu toggle button
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        window.addEventListener('resize', () => this.handleResize());
    }

    showPortfolio() {
        const welcomePage = document.getElementById('welcomePage');
        const portfolioContent = document.getElementById('portfolioContent');
        
        // Fade out welcome page
        welcomePage.style.opacity = '0';
        welcomePage.style.transition = 'opacity 0.5s ease';
        
        // show portfolio content
        setTimeout(() => {
            welcomePage.style.display = 'none';
            portfolioContent.style.display = 'block';
            
            void portfolioContent.offsetWidth;
            
            portfolioContent.style.opacity = '1';
            portfolioContent.style.transition = 'opacity 0.5s ease';
            
            window.scrollTo(0, 0);
            
            this.updateActiveNavLinkOnScroll();
        }, 500);
    }

    handleResumeDownload() {
        // Path to resume PDF file
        const resumePath = 'media/resume/Kent_Ann_Ecal_Resume.pdf';
        
        const link = document.createElement('a');
        link.href = resumePath;
        link.download = 'Kent_Ann_Ecal_Resume.pdf';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Resume download started!', 'success');
    }

    setupSmoothScrolling() {
        // Get all navigation links with hash hrefs
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 72;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    this.updateActiveNavLink(link);
                    
                    this.closeMobileMenu();
                }
            });
        });
        
        window.addEventListener('scroll', () => this.updateActiveNavLinkOnScroll());
    }

    updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        activeLink.classList.add('active');
    }

    updateActiveNavLinkOnScroll() {
        const portfolioContent = document.getElementById('portfolioContent');
        
        if (getComputedStyle(portfolioContent).display === 'none') return;
        
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    this.updateActiveNavLink(activeLink);
                }
            }
        });
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('active');
            
            const menuIcon = document.querySelector('#mobileMenuBtn i');
            if (menuIcon) {
                if (navLinks.classList.contains('active')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        }
    }
    
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuIcon = document.querySelector('#mobileMenuBtn i');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            
            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (window.innerWidth >= 768) {
                this.closeMobileMenu();
            }
        }, 150); 
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // inline styles for positioning and animation
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#f37ebeff' : '#780060ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300); 
        }, 3000); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
    
    document.body.classList.add('loaded');
});

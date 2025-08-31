        // Portfolio JavaScript
        class Portfolio {
            constructor() {
                this.init();
            }

            init() {
                // Wait for DOM to be fully loaded
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
                } else {
                    this.setupEventListeners();
                }
            }

            setupEventListeners() {
                // Visit Profile button
                const visitProfileBtn = document.getElementById('visitProfileBtn');
                if (visitProfileBtn) {
                    visitProfileBtn.addEventListener('click', () => {
                        this.showPortfolio();
                    });
                }
                
                // Navigation smooth scrolling
                this.setupSmoothScrolling();
                
                // Download CV button
                const downloadBtn = document.getElementById('downloadResume');
                if (downloadBtn) {
                    downloadBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.handleResumeDownload();
                    });
                }
                
                // Mobile menu button
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (mobileMenuBtn) {
                    mobileMenuBtn.addEventListener('click', () => {
                        this.toggleMobileMenu();
                    });
                }
                
                // Window resize handler (debounced)
                window.addEventListener('resize', () => this.handleResize());
            }

            showPortfolio() {
                const welcomePage = document.getElementById('welcomePage');
                const portfolioContent = document.getElementById('portfolioContent');
                
                // Hide welcome page and show portfolio content
                welcomePage.style.opacity = '0';
                welcomePage.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    welcomePage.style.display = 'none';
                    portfolioContent.style.display = 'block';
                    
                    // Trigger reflow
                    void portfolioContent.offsetWidth;
                    
                    portfolioContent.style.opacity = '1';
                    portfolioContent.style.transition = 'opacity 0.5s ease';
                    
                    // Scroll to top
                    window.scrollTo(0, 0);
                    
                    // Update active nav link on scroll
                    this.updateActiveNavLinkOnScroll();
                }, 500);
            }

            handleResumeDownload() {
                // Path to your resume - make sure this path is correct
                const resumePath = 'media/resume/Kent_Ann_Ecal_Resume.pdf';
                
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = resumePath;
                link.download = 'Kent_Ann_Ecal_Resume.pdf';
                
                // Append to body, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                this.showToast('Resume download started!', 'success');
                
                // Fallback if the download doesn't start
                setTimeout(() => {
                    // Check if download worked by trying to access the file
                    const xhr = new XMLHttpRequest();
                    xhr.open('HEAD', resumePath, true);
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 404) {
                                this.showToast('Resume file not found. Please check the file path.', 'error');
                            }
                        }
                    };
                    xhr.send();
                }, 2000);
            }

            setupSmoothScrolling() {
                const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
                
                navLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        const targetId = link.getAttribute('href');
                        const targetElement = document.querySelector(targetId);
                        
                        if (targetElement) {
                            const offsetTop = targetElement.offsetTop - 72; // Account for fixed navbar
                            
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                            
                            // Update active nav link
                            this.updateActiveNavLink(link);
                            
                            // Close mobile menu if open
                            this.closeMobileMenu();
                        }
                    });
                });
                
                // Update active nav link on scroll
                window.addEventListener('scroll', () => this.updateActiveNavLinkOnScroll());
            }

            updateActiveNavLink(activeLink) {
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }

            updateActiveNavLinkOnScroll() {
                const portfolioContent = document.getElementById('portfolioContent');
                if (portfolioContent.style.display !== 'block') return;
                
                const sections = document.querySelectorAll('section[id]');
                const scrollPosition = window.scrollY + 100; // Offset for navbar
                
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
                    
                    // Update menu icon
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
                // Debounce resize events for better performance
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(() => {
                    // Close mobile menu when resizing to larger screens
                    if (window.innerWidth >= 768) {
                        this.closeMobileMenu();
                    }
                }, 150);
            }
            
            showToast(message, type = 'success') {
                // Create toast element
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;
                
                // Style the toast
                toast.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: ${type === 'success' ? '#0a66c2' : '#d93025'};
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                `;
                
                // Add to page
                document.body.appendChild(toast);
                
                // Animate in
                setTimeout(() => {
                    toast.style.opacity = '1';
                    toast.style.transform = 'translateX(0)';
                }, 100);
                
                // Remove after delay
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

        // Initialize everything when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize portfolio functionality
            const portfolio = new Portfolio();
            
            // Add loading state removal
            document.body.classList.add('loaded');
        });
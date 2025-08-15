/* ============================================
   FOUNDERS SECTION FUNCTIONALITY
   ============================================ */

(function() {
    'use strict';

class FoundersSection {
    constructor() {
        this.section = document.querySelector('.founders');
        this.stats = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        
        this.init();
    }
    
    init() {
        if (!this.section) return;
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
        
        // Setup hover effects
        this.setupHoverEffects();
        
        // Setup video modal if exists
        this.setupVideoModal();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateSection();
                    this.animateStats();
                    this.hasAnimated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        observer.observe(this.section);
    }
    
    animateSection() {
        // Animate achievement badges
        const badges = this.section.querySelectorAll('.achievement-badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.animation = 'slideInLeft 0.6s ease-out forwards';
            }, index * 150);
        });
        
        // Animate recognition items
        const recognitions = this.section.querySelectorAll('.recognition-item');
        recognitions.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 100);
            }, 500);
        });
    }
    
    animateStats() {
        this.stats.forEach((stat) => {
            const target = parseInt(stat.getAttribute('data-target')) || parseInt(stat.textContent);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    
                    // Format the number
                    if (stat.dataset.type === 'percentage') {
                        stat.textContent = current + '%';
                    } else if (stat.dataset.type === 'currency') {
                        stat.textContent = '$' + current.toLocaleString() + '+';
                    } else if (stat.dataset.prefix) {
                        stat.textContent = stat.dataset.prefix + current + '+';
                    } else {
                        stat.textContent = current.toLocaleString() + '+';
                    }
                    
                    // Add pulse effect when complete
                    stat.style.animation = 'pulse 0.5s ease';
                } else {
                    // Update with appropriate format
                    if (stat.dataset.type === 'percentage') {
                        stat.textContent = Math.floor(current) + '%';
                    } else if (stat.dataset.type === 'currency') {
                        stat.textContent = '$' + Math.floor(current).toLocaleString();
                    } else if (stat.dataset.prefix) {
                        stat.textContent = stat.dataset.prefix + Math.floor(current);
                    } else {
                        stat.textContent = Math.floor(current).toLocaleString();
                    }
                    
                    requestAnimationFrame(updateNumber);
                }
            };
            
            // Start animation with delay
            setTimeout(() => {
                updateNumber();
            }, 300);
        });
    }
    
    setupHoverEffects() {
        // Add hover effect to founders image
        const imageContainer = this.section.querySelector('.founders-image-container');
        if (imageContainer) {
            imageContainer.addEventListener('mouseenter', () => {
                imageContainer.style.transform = 'scale(1.02)';
                imageContainer.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.4)';
            });
            
            imageContainer.addEventListener('mouseleave', () => {
                imageContainer.style.transform = 'scale(1)';
                imageContainer.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3)';
            });
            
            // Add transition
            imageContainer.style.transition = 'all 0.3s ease';
        }
        
        // Hover effect for recognition items
        const recognitionItems = this.section.querySelectorAll('.recognition-item');
        recognitionItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Animate the icon
                const icon = item.querySelector('.recognition-icon svg');
                if (icon) {
                    icon.style.animation = 'rotate 0.5s ease';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.recognition-icon svg');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
    }
    
    setupVideoModal() {
        const videoBtn = this.section.querySelector('.founders-video-btn');
        if (!videoBtn) return;
        
        videoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openVideoModal();
        });
    }
    
    openVideoModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        // Video container
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
            position: relative;
            width: 90%;
            max-width: 800px;
            aspect-ratio: 16/9;
            background: #000;
            border-radius: 12px;
            overflow: hidden;
        `;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            border-radius: 50%;
            transition: all 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            closeBtn.style.transform = 'rotate(90deg)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            closeBtn.style.transform = 'rotate(0)';
        });
        
        // Placeholder for video
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        `;
        placeholder.textContent = 'Video Placeholder - Aquí iría el video de presentación';
        
        videoContainer.appendChild(placeholder);
        videoContainer.appendChild(closeBtn);
        modal.appendChild(videoContainer);
        document.body.appendChild(modal);
        
        // Close modal
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Track video play
        this.trackEvent('video_play', 'Founders Presentation');
    }
    
    trackEvent(action, label) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'founders',
                'event_label': label
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Founders Section',
                content_category: label
            });
        }
    }
}

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        new FoundersSection();
    });

    // Export for use in other modules
    window.FoundersSection = FoundersSection;

})(); // End IIFE
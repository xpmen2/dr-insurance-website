/**
 * Login Page Functionality
 * Handles form interactions and animations
 */

(function() {
    'use strict';

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const rememberCheckbox = document.getElementById('remember');

    // Toggle Password Visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update icon
            const eyeIcon = this.querySelector('.eye-icon');
            if (type === 'text') {
                eyeIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
            } else {
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
            }
        });
    }

    // Form Submission (Placeholder)
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitButton = this.querySelector('.login-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Iniciando sesión...
            `;
            submitButton.disabled = true;

            // Simulate loading then redirect to dashboard
            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    // Load saved email if "Remember me" was checked
    window.addEventListener('load', function() {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    });

    // Save email when "Remember me" is checked
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            if (this.checked && emailInput.value) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        });
    }

    // Email input change handler
    if (emailInput && rememberCheckbox) {
        emailInput.addEventListener('blur', function() {
            if (rememberCheckbox.checked && this.value) {
                localStorage.setItem('rememberedEmail', this.value);
            }
        });
    }

    // Social Login Handlers (Placeholders)
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`Inicio de sesión con ${provider} estará disponible pronto.`, 'info');
        });
    });

    // Forgot Password Handler
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('La recuperación de contraseña estará disponible pronto.', 'info');
        });
    }

    // Sign Up Link Handler
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('El registro de nuevas cuentas estará disponible pronto.', 'info');
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 320px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-info {
                border-left: 4px solid var(--primary-blue);
            }
            
            .notification-info svg {
                color: var(--primary-blue);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .spinner {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        
        if (!document.querySelector('style[data-notification-styles]')) {
            style.setAttribute('data-notification-styles', '');
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Add input validation feedback
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && this.checkValidity()) {
                this.style.borderColor = '#10B981';
            } else if (this.value && !this.checkValidity()) {
                this.style.borderColor = '#EF4444';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '';
        });
    });

})();
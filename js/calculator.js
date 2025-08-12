/* ============================================
   IUL CALCULATOR FUNCTIONALITY
   ============================================ */

class IULCalculator {
    constructor() {
        this.ageSlider = document.getElementById('calc-age');
        this.contributionSlider = document.getElementById('calc-contribution');
        this.yearsSlider = document.getElementById('calc-years');
        this.returnSlider = document.getElementById('calc-return');
        
        this.ageValue = document.getElementById('age-value');
        this.contributionValue = document.getElementById('contribution-value');
        this.yearsValue = document.getElementById('years-value');
        this.returnValue = document.getElementById('return-value');
        
        this.totalValue = document.getElementById('total-value');
        this.deathBenefit = document.getElementById('death-benefit');
        this.cashValue = document.getElementById('cash-value');
        
        this.chart = null;
        this.chartCanvas = document.getElementById('growth-chart');
        
        this.init();
    }
    
    init() {
        if (!this.ageSlider) return;
        
        // Set initial values
        this.setupSliders();
        
        // Add event listeners
        this.ageSlider.addEventListener('input', () => this.updateCalculations());
        this.contributionSlider.addEventListener('input', () => this.updateCalculations());
        this.yearsSlider.addEventListener('input', () => this.updateCalculations());
        this.returnSlider.addEventListener('input', () => this.updateCalculations());
        
        // Initial calculation
        this.updateCalculations();
        
        // Initialize chart if canvas exists
        if (this.chartCanvas) {
            this.initChart();
        }
    }
    
    setupSliders() {
        // Update slider backgrounds
        this.updateSliderBackground(this.ageSlider);
        this.updateSliderBackground(this.contributionSlider);
        this.updateSliderBackground(this.yearsSlider);
        this.updateSliderBackground(this.returnSlider);
        
        // Add input listeners for background updates
        [this.ageSlider, this.contributionSlider, this.yearsSlider, this.returnSlider].forEach(slider => {
            slider.addEventListener('input', () => this.updateSliderBackground(slider));
        });
    }
    
    updateSliderBackground(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const value = parseFloat(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.setProperty('--progress', percentage + '%');
    }
    
    updateCalculations() {
        // Get values
        const age = parseInt(this.ageSlider.value);
        const monthlyContribution = parseInt(this.contributionSlider.value);
        const years = parseInt(this.yearsSlider.value);
        const annualReturn = parseFloat(this.returnSlider.value) / 100;
        
        // Update display values
        this.ageValue.textContent = age + ' años';
        this.contributionValue.textContent = '$' + monthlyContribution.toLocaleString();
        this.yearsValue.textContent = years + ' años';
        this.returnValue.textContent = (annualReturn * 100).toFixed(1) + '%';
        
        // Calculate future value
        const monthlyReturn = annualReturn / 12;
        const totalMonths = years * 12;
        const totalContributions = monthlyContribution * totalMonths;
        
        // Future Value formula for monthly contributions
        const futureValue = monthlyContribution * 
            ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
        
        // Calculate death benefit (typically 2-3x of cash value)
        const deathBenefitAmount = futureValue * 2.5;
        
        // Calculate available cash value (typically 90% of accumulated value)
        const cashValueAmount = futureValue * 0.9;
        
        // Update results with animation
        this.animateValue(this.totalValue, futureValue);
        this.animateValue(this.deathBenefit, deathBenefitAmount);
        this.animateValue(this.cashValue, cashValueAmount);
        
        // Update chart
        if (this.chart) {
            this.updateChart(monthlyContribution, years, annualReturn);
        }
        
        // Track calculation
        this.trackCalculation({
            age,
            monthlyContribution,
            years,
            annualReturn: annualReturn * 100,
            projectedValue: futureValue
        });
    }
    
    animateValue(element, value) {
        const duration = 1000;
        const start = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const increment = (value - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
                current = value;
                clearInterval(timer);
            }
            element.textContent = '$' + Math.round(current).toLocaleString();
        }, 16);
    }
    
    initChart() {
        const ctx = this.chartCanvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0.05)');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Valor Acumulado',
                    data: [],
                    borderColor: '#D4AF37',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#D4AF37',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 31, 63, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Valor: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                }
            }
        });
        
        // Initial chart update
        this.updateChart(
            parseInt(this.contributionSlider.value),
            parseInt(this.yearsSlider.value),
            parseFloat(this.returnSlider.value) / 100
        );
    }
    
    updateChart(monthlyContribution, years, annualReturn) {
        if (!this.chart) return;
        
        const labels = [];
        const data = [];
        const monthlyReturn = annualReturn / 12;
        
        // Generate data points for each year
        for (let year = 0; year <= years; year++) {
            labels.push(year === 0 ? 'Hoy' : `Año ${year}`);
            
            if (year === 0) {
                data.push(0);
            } else {
                const months = year * 12;
                const value = monthlyContribution * 
                    ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
                data.push(Math.round(value));
            }
        }
        
        // Update chart data
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update('none'); // Update without animation for smoother experience
    }
    
    trackCalculation(data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculator_use', {
                'event_category': 'engagement',
                'event_label': 'IUL Calculator',
                'value': Math.round(data.projectedValue)
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'IUL Calculator',
                content_category: 'Financial Tool',
                value: Math.round(data.projectedValue),
                currency: 'USD'
            });
        }
        
        console.log('Calculator used:', data);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        new IULCalculator();
    } else {
        console.log('Chart.js not loaded, calculator will work without chart');
        new IULCalculator();
    }
});

// Export for use in other modules
window.IULCalculator = IULCalculator;
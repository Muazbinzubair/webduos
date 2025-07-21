// Form handling, validation, and submission for WebDuos website
// Handles both contact forms and project request forms

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form functionality
    initContactForm();
    initProjectForm();
    initFormValidation();
    initFormEnhancements();
});

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm();
        }
    });
    
    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Project Request Form Handling
function initProjectForm() {
    const projectForm = document.getElementById('project-form');
    if (!projectForm) return;
    
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateProjectForm()) {
            submitProjectForm();
        }
    });
    
    // Real-time validation
    const formFields = projectForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Progress tracking
    initFormProgress();
}

// Form Validation
function validateContactForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = ['contactFirstName', 'contactLastName', 'contactEmail', 'contactSubject', 'contactMessage'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateProjectForm() {
    const form = document.getElementById('project-form');
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'projectType', 'projectDescription', 'budget']; // Removed 'timeline'
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        showFieldError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (isRequired && !value) {
        showFieldError(field.id, 'This field is required');
        return false;
    }
    
    // Skip further validation if field is empty and not required
    if (!value && !isRequired) return true;
    
    // Email validation
    if (fieldType === 'email' || field.id.includes('email')) {
        if (!isValidEmail(value)) {
            showFieldError(field.id, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldType === 'tel' || field.id.includes('phone')) {
        if (!isValidPhone(value)) {
            showFieldError(field.id, 'Please enter a valid phone number (e.g., +92 300 1234567)');
            return false;
        }
    }
    
    // Budget validation (numeric)
    if (field.id === 'budget') {
        if (!/^[0-9,]+$/.test(value)) {
            showFieldError(field.id, 'Please enter a valid budget amount (numbers only)');
            return false;
        }
    }
    
    // Text length validation
    if (field.tagName === 'TEXTAREA') {
        if (value.length < 10) {
            showFieldError(field.id, 'Please provide more detailed information (minimum 10 characters)');
            return false;
        }
        if (value.length > 2000) {
            showFieldError(field.id, 'Message is too long (maximum 2000 characters)');
            return false;
        }
    }
    
    // Name validation
    if (field.id.includes('Name')) {
        if (value.length < 2) {
            showFieldError(field.id, 'Name must be at least 2 characters long');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showFieldError(field.id, 'Name should only contain letters and spaces');
            return false;
        }
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Allow various formats: +92 300 1234567, +923001234567, 03001234567, etc.
    const phoneRegex = /^(\+92|0)?[0-9\s-]{10,15}$/;
    return phoneRegex.test(phone);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-gray-300', 'focus:border-primary-500', 'focus:ring-primary-500');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function clearFieldError(field) {
    const errorElement = document.getElementById(field.id + '-error');
    
    field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    field.classList.add('border-gray-300', 'focus:border-primary-500', 'focus:ring-primary-500');
    
    if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }
}

// Form Submission
function submitContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = document.getElementById('contact-submit-text');
    const submitLoading = document.getElementById('contact-submit-loading');
    
    // Contact Form
fetch('http://127.0.0.1:5000/submit_contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: document.getElementById('contactFirstName').value + ' ' + document.getElementById('contactLastName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    })
}).then(res => res.json())
  .then(data => alert('✅ Message sent!'))
  .catch(err => alert('❌ Failed to send!'));

    // Show loading state
    setLoadingState(submitBtn, submitText, submitLoading, true);
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        console.log('Contact form submitted:', data);
        
        // Show success message
        showSuccessMessage('contact-success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
        
        // Reset loading state
        setLoadingState(submitBtn, submitText, submitLoading, false);
        
        // Scroll to success message
        document.getElementById('contact-success').scrollIntoView({ behavior: 'smooth' });
        
    }, 2000); // 2 second delay to simulate network request
}

function submitProjectForm() {
    const form = document.getElementById('project-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    // Project Quote
fetch('http://127.0.0.1:5000/submit_quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        projectType: document.getElementById('projectType').value,
        projectDescription: document.getElementById('projectDescription').value,
        budget: document.getElementById('budget').value
    })
}).then(res => res.json())
  .then(data => alert('✅ Quote submitted!'))
  .catch(err => alert('❌ Failed to submit!'));


    // Show loading state
    setLoadingState(submitBtn, submitText, submitLoading, true);
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Handle multiple selections (checkboxes)
    data.technologies = Array.from(form.querySelectorAll('input[name="technologies"]:checked')).map(cb => cb.value);
    data.features = Array.from(form.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value);
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        console.log('Project form submitted:', data);
        
        // Show success message
        showSuccessMessage('success-message', 'Thank you! Your project request has been submitted successfully. We\'ll get back to you within 24 hours.');
        
        // Reset form
        form.reset();
        updateFormProgress(0);
        
        // Reset loading state
        setLoadingState(submitBtn, submitText, submitLoading, false);
        
        // Scroll to success message
        document.getElementById('success-message').scrollIntoView({ behavior: 'smooth' });
        
        // Send confirmation email simulation
        setTimeout(() => {
            console.log('Confirmation email sent to:', data.email);
        }, 1000);
        
    }, 3000); // 3 second delay to simulate network request
}

function setLoadingState(button, textElement, loadingElement, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        if (textElement) textElement.textContent = 'Sending...';
        if (loadingElement) loadingElement.classList.remove('hidden');
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        if (textElement) textElement.textContent = button.id.includes('contact') ? 'Send Message' : 'Submit Project Request';
        if (loadingElement) loadingElement.classList.add('hidden');
    }
}

function showSuccessMessage(elementId, message) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        const messageText = messageElement.querySelector('span');
        if (messageText) {
            messageText.textContent = message;
        }
        messageElement.classList.remove('hidden');
        messageElement.classList.add('message-slide-down');
        
        // Hide after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 5000);
    }
}

function showErrorMessage(elementId, message) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        const messageText = messageElement.querySelector('#' + elementId.replace('error', 'error-text'));
        if (messageText) {
            messageText.textContent = message;
        }
        messageElement.classList.remove('hidden');
        messageElement.classList.add('message-slide-down');
        
        // Hide after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 5000);
    }
}

// Form Progress Tracking
function initFormProgress() {
    const form = document.getElementById('project-form');
    if (!form) return;
    
    const progressBar = createProgressBar();
    form.insertBefore(progressBar, form.firstChild);
    
    const formFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    formFields.forEach(field => {
        field.addEventListener('input', updateFormProgress);
        field.addEventListener('change', updateFormProgress);
    });
    
    // Initial progress calculation
    updateFormProgress();
}

function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container mb-8';
    progressContainer.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Form Progress</span>
            <span class="text-sm text-gray-500"><span id="progress-percentage">0</span>% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
            <div id="progress-bar" class="progress-bar h-2 rounded-full" style="width: 0%"></div>
        </div>
    `;
    return progressContainer;
}

function updateFormProgress() {
    const form = document.getElementById('project-form');
    if (!form) return;
    
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    const filledFields = Array.from(requiredFields).filter(field => {
        if (field.type === 'checkbox') {
            return field.checked;
        }
        return field.value.trim() !== '';
    });
    
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = progress;
    }
}

// Form Enhancements
function initFormEnhancements() {
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea.call(textarea); // Initial resize
    });
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });
    
    // Character counting for textareas
    const textareasWithCount = document.querySelectorAll('textarea[data-max-length]');
    textareasWithCount.forEach(textarea => {
        addCharacterCounter(textarea);
    });
    
    // Form field focus effects
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('field-focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('field-focused');
        });
    });
}

function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Add Pakistan country code if not present
    if (value.length > 0 && !value.startsWith('92')) {
        if (value.startsWith('0')) {
            value = '92' + value.substring(1);
        } else {
            value = '92' + value;
        }
    }
    
    // Format as +92 XXX XXXXXXX
    if (value.length >= 2) {
        value = '+' + value.substring(0, 2) + ' ' + value.substring(2, 5) + ' ' + value.substring(5);
    }
    
    e.target.value = value;
}

function addCharacterCounter(textarea) {
    const maxLength = parseInt(textarea.getAttribute('data-max-length'));
    const counter = document.createElement('div');
    counter.className = 'character-counter text-sm text-gray-500 mt-1 text-right';
    textarea.parentElement.appendChild(counter);
    
    function updateCounter() {
        const currentLength = textarea.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.classList.add('text-yellow-600');
            counter.classList.remove('text-gray-500', 'text-red-600');
        } else if (currentLength > maxLength) {
            counter.classList.add('text-red-600');
            counter.classList.remove('text-gray-500', 'text-yellow-600');
        } else {
            counter.classList.add('text-gray-500');
            counter.classList.remove('text-yellow-600', 'text-red-600');
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter(); // Initial count
}

// Form Validation Rules
const validationRules = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    phone: {
        pattern: /^(\+92|0)?[0-9\s-]{10,15}$/,
        message: 'Please enter a valid phone number'
    },
    name: {
        pattern: /^[a-zA-Z\s]{2,50}$/,
        message: 'Name should be 2-50 characters and contain only letters'
    },
    url: {
        pattern: /^https?:\/\/.+\..+/,
        message: 'Please enter a valid URL (starting with http:// or https://)'
    }
};

// Form Auto-save (for project form)
function initFormAutoSave() {
    const projectForm = document.getElementById('project-form');
    if (!projectForm) return;
    
    const formFields = projectForm.querySelectorAll('input, textarea, select');
    
    formFields.forEach(field => {
        field.addEventListener('change', saveFormData);
        field.addEventListener('input', debounce(saveFormData, 1000));
    });
    
    // Load saved data on page load
    loadFormData();
}

function saveFormData() {
    const form = document.getElementById('project-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Save to localStorage
    localStorage.setItem('webduos_project_form', JSON.stringify(data));
    
    // Show save indicator
    showSaveIndicator();
}

function loadFormData() {
    const savedData = localStorage.getItem('webduos_project_form');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        const form = document.getElementById('project-form');
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
        
        updateFormProgress();
    } catch (e) {
        console.error('Error loading saved form data:', e);
    }
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator') || createSaveIndicator();
    indicator.textContent = 'Draft saved';
    indicator.classList.remove('hidden');
    
    setTimeout(() => {
        indicator.classList.add('hidden');
    }, 2000);
}

function createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'save-indicator';
    indicator.className = 'fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hidden';
    document.body.appendChild(indicator);
    return indicator;
}

// Utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize auto-save on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormAutoSave);
} else {
    initFormAutoSave();
}

// Export functions for external use
window.WebDuosForms = {
    validateField,
    showFieldError,
    clearFieldError,
    submitContactForm,
    submitProjectForm,
    updateFormProgress,
    saveFormData,
    loadFormData
};


// Updated submitContactForm function
function submitContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = document.getElementById('contact-submit-text');
    const submitLoading = document.getElementById('contact-submit-loading');

    // Show loading state
    setLoadingState(submitBtn, submitText, submitLoading, true);
    
    // Collect form data
    const formData = new FormData(form);
    const data = {
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        phone: formData.get('phone')
    };

    // Only make the real API call
    fetch('http://127.0.0.1:5000/submit_contact', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        showSuccessMessage('contact-success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
    })
    .catch(error => {
        console.error('Error submitting contact form:', error);
        showErrorMessage('contact-error', 'Failed to send message. Please try again later.');
    })
    .finally(() => {
        // Reset loading state
        setLoadingState(submitBtn, submitText, submitLoading, false);
    });
}

// Updated submitProjectForm function
function submitProjectForm() {
    const form = document.getElementById('project-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    // Show loading state
    setLoadingState(submitBtn, submitText, submitLoading, true);
    
    // Collect form data
    const formData = new FormData(form);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        projectType: formData.get('projectType'),
        projectDescription: formData.get('projectDescription'),
        budget: formData.get('budget'),
        company: formData.get('company'),
        inspiration: formData.get('inspiration'),
        additionalInfo: formData.get('additionalInfo')
    };

    // Only make the real API call
    fetch('http://127.0.0.1:5000/submit_quote', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        showSuccessMessage('success-message', 'Thank you! Your project request has been submitted successfully. We\'ll get back to you within 24 hours.');
        
        // Reset form
        form.reset();
        updateFormProgress(0);
    })
    .catch(error => {
        console.error('Error submitting project form:', error);
        showErrorMessage('error-message', 'Failed to submit request. Please try again later.');
    })
    .finally(() => {
        // Reset loading state
        setLoadingState(submitBtn, submitText, submitLoading, false);
    });
}
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
    initQuoteForm();
});

// -------- CONTACT FORM --------
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('contactFirstName').value + ' ' +
                     document.getElementById('contactLastName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;

        try {
            const res = await fetch('http://127.0.0.1:5000/submit_contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            const result = await res.json();
            if (result.status === 'success') {
                showSuccess('contact-success');
                form.reset();
            } else {
                showError('contact-error', result.message || 'Failed to send message.');
            }
        } catch (err) {
            showError('contact-error', 'Something went wrong.');
        }
    });
}

// -------- QUOTE FORM --------
function initQuoteForm() {
    const form = document.getElementById('project-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            projectType: document.getElementById('projectType').value,
            projectDescription: document.getElementById('projectDescription').value,
            budget: document.getElementById('budget').value
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/submit_quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (result.status === 'success') {
                showSuccess('success-message');
                form.reset();
            } else {
                showError('error-message', result.message || 'Failed to send quote.');
            }
        } catch (err) {
            showError('error-message', 'Something went wrong.');
        }
    });
}

// -------- FEEDBACK HELPERS --------
function showSuccess(id) {
    const box = document.getElementById(id);
    if (box) {
        box.classList.remove('hidden');
        box.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => box.classList.add('hidden'), 5000);
    }
}

function showError(id, message) {
    const box = document.getElementById(id);
    if (box) {
        const span = box.querySelector('span');
        if (span) span.textContent = message;
        box.classList.remove('hidden');
        box.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => box.classList.add('hidden'), 5000);
    }
}

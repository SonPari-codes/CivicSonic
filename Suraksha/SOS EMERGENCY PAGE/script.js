document.addEventListener('DOMContentLoaded', () => {
  const sosButton = document.getElementById('sosButton');
  const successModal = document.getElementById('successModal');
  const closeModal = document.getElementById('closeModal');
  const profileLink = document.getElementById('profileLink');

  let lastTap = 0;

  // Double click / double tap SOS.
  sosButton.addEventListener('click', () => {
    const now = Date.now();

    if (now - lastTap <= 700) {
      lastTap = 0;

      const confirmed = window.confirm(
        'Are you sure you want to activate the emergency SOS alert?'
      );

      if (confirmed) {
        successModal.classList.add('show');
        successModal.setAttribute('aria-hidden', 'false');
      }
    } else {
      lastTap = now;
    }
  });

  closeModal.addEventListener('click', () => {
    successModal.classList.remove('show');
    successModal.setAttribute('aria-hidden', 'true');
  });

  document.querySelector('#successModal .modal-backdrop').addEventListener('click', () => {
    successModal.classList.remove('show');
    successModal.setAttribute('aria-hidden', 'true');
  });

  document.querySelector('.hamburger-btn').addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });

  profileLink.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Profile page will be connected later.');
  });
});

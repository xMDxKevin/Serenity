'use strict';
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      document.getElementById('username').value = user.username || '';
      document.getElementById('email').value = user.email || '';
      
    }

    const fileInput = document.getElementById('avatarInput');
    const preview = document.getElementById('avatarPreview');
    const fileName = document.getElementById('fileName');
    const btnUpload = document.getElementById('btnUpload');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    
    const avatarStack = document.querySelector('.avatar-stack');
    if (avatarStack && !avatarStack.classList.contains('animate-in')) {
      avatarStack.classList.add('animate-in');
    }
    const reveal = document.querySelectorAll('.animate-in');

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        }
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
      reveal.forEach(el => io.observe(el));
    } else {
      reveal.forEach(el => el.classList.add('in'));
    }

    
    if (fileInput && preview) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) {
          if (fileName) fileName.textContent = 'Ningún archivo seleccionado';
          return;
        }

        const isImage = file.type ? file.type.startsWith('image/') : true;
        if (file.size > 10 * 1024 * 1024) {
          alert('La imagen es muy grande (máx 10 MB).');
          fileInput.value = '';
          if (fileName) fileName.textContent = 'Ningún archivo seleccionado';
          return;
        }
        if (!isImage) {
          alert('Selecciona un archivo de imagen.');
          fileInput.value = '';
          if (fileName) fileName.textContent = 'Ningún archivo seleccionado';
          return;
        }

        const url = URL.createObjectURL(file);
        preview.onload = () => {
          URL.revokeObjectURL(url);
        };
        preview.src = url;
        if (fileName) fileName.textContent = file.name;
        pulse(preview);
        ring(preview);
      });
    }

    if (btnUpload) {
      btnUpload.addEventListener('pointerdown', (ev) => {
        ripple(btnUpload, ev.clientX, ev.clientY);
      });
      btnUpload.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          const r = btnUpload.getBoundingClientRect();
          ripple(btnUpload, r.left + r.width / 2, r.top + r.height / 2);
        }
      });
    
      btnUpload.addEventListener('click', () => fileInput?.click());
    }

  
    if (!reduce) {
      const bubbles = document.querySelectorAll('.bg-scene .bubble');
      bubbles.forEach((b, i) => {
        const extra = Math.random() * 4; // 0–4s
        b.style.animationDuration = `calc(10s + ${(i * 0.4).toFixed(2)}s + ${extra.toFixed(2)}s)`;
        b.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
      });
    }
  });

  
  function pulse(el) {
    el.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.97)' },
        { transform: 'scale(1)' }
      ],
      { duration: 220, easing: 'cubic-bezier(.22,.61,.36,1)' }
    );
  }

  
  function ring(el) {
    const host = el.closest('.avatar-stack') || el.parentElement || el;
    const r = host.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.style.position = 'absolute';
    circle.style.left = '50%';
    circle.style.top = '50%';
    circle.style.transform = 'translate(-50%, -50%) scale(0)';
    circle.style.width = Math.max(r.width, r.height) + 'px';
    circle.style.height = Math.max(r.width, r.height) + 'px';
    circle.style.border = '3px solid #B388FF';
    circle.style.borderRadius = '9999px';
    circle.style.pointerEvents = 'none';
    circle.style.opacity = '0.9';
    circle.style.boxSizing = 'border-box';
    host.style.position = host.style.position || 'relative';
    host.appendChild(circle);

    const a = circle.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.9 },
        { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0 }
      ],
      { duration: 520, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }
    );
    a.onfinish = () => circle.remove();
  }

  
  function ripple(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    const maxDim = Math.max(rect.width, rect.height);
    const ring = document.createElement('span');
    ring.style.position = 'absolute';
    ring.style.left = clientX - rect.left + 'px';
    ring.style.top = clientY - rect.top + 'px';
    ring.style.width = '8px';
    ring.style.height = '8px';
    ring.style.transform = 'translate(-50%, -50%) scale(0)';
    ring.style.border = '3px solid #8E6CE6';
    ring.style.borderRadius = '9999px';
    ring.style.pointerEvents = 'none';
    ring.style.opacity = '0.85';
    ring.style.boxSizing = 'border-box';
    el.style.position = el.style.position || 'relative';
    el.appendChild(ring);

    const anim = ring.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.85 },
        { transform: `translate(-50%, -50%) scale(${(maxDim / 6).toFixed(2)})`, opacity: 0 }
      ],
      { duration: 500, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }
    );
    anim.onfinish = () => ring.remove();
  }

  
  const token = localStorage.getItem('token');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const aboutInput = document.getElementById('about');
  const avatarInput = document.getElementById('avatarInput');
  const avatarPreview = document.getElementById('avatarPreview');

  async function loadUserProfile() {
    if (!token) {
      alert('No estás autenticado');
      window.location.href = '../login-register.html';
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;

        usernameInput.value = user.username || '';
        emailInput.value = user.email || '';
        aboutInput.value = user.about_me || '';

        if (user.profile_image) {
          avatarPreview.src = user.profile_image;
        } else {
          avatarPreview.src = `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}&backgroundColor=b6a6f2,ffc6d9&shapeColor=ffffff`;
        }

        
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        alert('Error al cargar perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  }

  
  loadUserProfile();

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Guardar Cambios';
  saveBtn.style.cssText = 'background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px;';
  document.querySelector('.col-right').appendChild(saveBtn);

  
  avatarInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        avatarPreview.src = result.imageUrl;
        avatarPreview.style.display = 'block'; 
        const user = JSON.parse(localStorage.getItem('user'));
        user.profile_image = result.imageUrl;
        localStorage.setItem('user', JSON.stringify(user));
        alert('Imagen de perfil actualizada');
        console.log('New avatar URL:', result.imageUrl); 
      } else {
        alert(result.error || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  });

  saveBtn.addEventListener('click', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    const about_me = aboutInput.value;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ about_me })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Perfil actualizado');
        
        const user = JSON.parse(localStorage.getItem('user'));
        user.about_me = about_me;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        alert(result.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  });

 
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '../../index.html';
    });
  }
})();
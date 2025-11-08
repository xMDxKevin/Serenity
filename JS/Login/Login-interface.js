$('#signup').click(function() {
  $('.pinkbox').css('transform', 'translateX(80%)');
  $('.signin').addClass('nodisplay');
  $('.signup').removeClass('nodisplay');
});

$('#signin').click(function() {
  $('.pinkbox').css('transform', 'translateX(0%)');
  $('.signup').addClass('nodisplay');
  $('.signin').removeClass('nodisplay');
});

// Handle registration
$('#registerForm').on('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  };

  if (data.password !== data.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    console.log('Enviando registro a:', 'https://serenity-backend-eight.vercel.app/api/auth/register');
    
    const response = await fetch('https://serenity-backend-eight.vercel.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers);

    // Intentar leer la respuesta como texto primero
    const textResponse = await response.text();
    console.log('Respuesta completa:', textResponse);

    let result;
    try {
      result = JSON.parse(textResponse);
    } catch (e) {
      console.error('Error parseando JSON:', e);
      alert('Error: El servidor no devolvió una respuesta válida.\n\nRespuesta: ' + textResponse.substring(0, 200));
      return;
    }

    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      alert('Registro exitoso');
      window.location.href = 'Select.html';
    } else {
      console.error('Error del servidor:', result);
      alert('Error: ' + (result.detail || result.message || result.error || 'Error desconocido en el registro'));
    }
  } catch (error) {
    console.error('Error completo:', error);
    alert('Error de conexión: ' + error.message + '\n\nRevisa la consola del navegador (F12) para más detalles');
  }
});

// Handle login
$('#loginForm').on('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    console.log('Enviando login a:', 'https://serenity-backend-eight.vercel.app/api/auth/login');
    
    const response = await fetch('https://serenity-backend-eight.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers);

    // Intentar leer la respuesta como texto primero
    const textResponse = await response.text();
    console.log('Respuesta completa:', textResponse);

    let result;
    try {
      result = JSON.parse(textResponse);
    } catch (e) {
      console.error('Error parseando JSON:', e);
      alert('Error: El servidor no devolvió una respuesta válida.\n\nRespuesta: ' + textResponse.substring(0, 200));
      return;
    }

    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      alert('Inicio de sesión exitoso');
      window.location.href = 'Select.html';
    } else {
      console.error('Error del servidor:', result);
      alert('Error: ' + (result.detail || result.message || result.error || 'Credenciales inválidas'));
    }
  } catch (error) {
    console.error('Error completo:', error);
    alert('Error de conexión: ' + error.message + '\n\nRevisa la consola del navegador (F12) para más detalles');
  }
});

// Test de conexión al cargar la página
$(document).ready(async function() {
  console.log('🔍 Probando conexión con el backend...');
  try {
    const response = await fetch('https://serenity-backend-eight.vercel.app/');
    const text = await response.text();
    console.log('✅ Backend responde:', text);
  } catch (error) {
    console.error('❌ Backend no responde:', error);
    alert('⚠️ Advertencia: No se puede conectar con el servidor. Por favor contacta al administrador.');
  }
});
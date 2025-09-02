// Script para generar hash de contraseña para el admin inicial
// Ejecutar con: node scripts/generate-admin-password.js

const bcrypt = require('bcryptjs');

async function generateHash() {
  // Cambia esta contraseña por una segura
  const password = 'AdminDR2024!';
  
  const hash = await bcrypt.hash(password, 10);
  
  console.log('=====================================');
  console.log('Password Hash Generado:');
  console.log('=====================================');
  console.log(hash);
  console.log('=====================================');
  console.log('\nActualiza el usuario admin en Neon con este hash:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@drinsurance.com';`);
  console.log('\nContraseña usada:', password);
  console.log('(IMPORTANTE: Cambia esta contraseña después del primer login)');
}

generateHash();
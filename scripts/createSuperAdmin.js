// scripts/createSuperAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, user } = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB conectada');

    // 1️⃣ Verificar si ya existe un superadmin
    const exists = await user.findOne({
      where: { role: 'superadmin' }
    });

    if (exists) {
      console.log('⚠️ Ya existe un superadmin, no se creó nada');
      return;
    }

    // 2️⃣ Validar variables críticas
    if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
      throw new Error('Faltan variables SUPERADMIN_EMAIL o SUPERADMIN_PASSWORD');
    }

    // 3️⃣ Hashear password
    const passwordHash = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD,
      10
    );

    // 4️⃣ Crear superadmin
    const admin = await user.create({
      firstName: 'Root',
      lastName: 'Admin',
      email: process.env.SUPERADMIN_EMAIL,
      phone: '999999999',
      password: passwordHash,
      role: 'superadmin'
    });

    console.log('✅ Superadmin creado:', admin.email);

  } catch (error) {
    console.error('❌ Error creando superadmin:', error.message);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();

const errorHandler = (error, _req, res, _next) => {
    const errObj = {};

    // 1. Manejo de errores de validación (ej: campos requeridos)
    if(error.name === 'SequelizeValidationError') {
        error.errors.map(er => {
            errObj[er.path] = er.message;
        })
        return res.status(400).json(errObj);
    }

    // 🛡️ 2. NUEVO: Manejo de emails/datos duplicados
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            message: "Este correo electrónico ya está registrado. Por favor, intenta con otro o inicia sesión."
        });
    }

    // 3. Manejo de errores de llaves foráneas
    if(error.name === 'SequelizeForeignKeyConstraintError'){
        return res.status(400).json({ 
            message: error.message,
            error: error.parent?.detail || "Error de relación en la base de datos"
        });
    }

    // 4. Error genérico (Si nada de lo anterior funcionó)
    return res.status(500).json({
        message: error.message,
        error: error
    });
}

module.exports = errorHandler;
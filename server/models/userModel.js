// Este archivo define el modelo de usuario y las validaciones necesarias. 
// Exporta una función `validateUser` que verifica que los campos `name` y `email` estén presentes y sean válidos.

const validateUser = (user) => {
    const { name, email } = user;
    const errors = {};

    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.name = 'El nombre es obligatorio y debe ser una cadena válida.';
    }

    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'El correo electrónico es obligatorio y debe ser válido.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = {
    validateUser,
};
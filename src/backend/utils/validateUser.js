const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.',
            }),
    });

    return schema.validate(data);
};

module.exports = { registerValidation };

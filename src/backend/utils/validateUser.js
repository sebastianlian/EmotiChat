const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).max(30).required(),
        lastname: Joi.string().min(2).max(30).required(),
        gender: Joi.string()
            .valid('male', 'female', 'nonbinary', 'other', 'prefer_not_to_say') // Allowed values
            .required(),
        pronouns: Joi.string()
            .valid('he/him', 'she/her', 'they/them', 'other', 'prefer_not_to_say')
            .required(),
        customPronouns: Joi.string()
            .min(2)
            .max(50)
            .when('pronouns', {
                is: 'other',
                then: Joi.required(), // Ensure this field is required when pronouns === 'other'
                otherwise: Joi.optional(), // It should be optional in all other cases
            }),
        username: Joi.string().min(6).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
            .required()
            .messages({
                'string.pattern.base':
                    'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.',
            }),
    });

    return schema.validate(data, { abortEarly: false }); // Prevent early termination to show all errors
};

module.exports = { registerValidation };

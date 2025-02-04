import validator from "validator";

export const sanitizeInput = (input: string) => validator.escape(input.trim());

export const validateName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z0-9 .-]+$/;
  return nameRegex.test(name);
};

export const validationEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  if (password.length > 128) return false;

  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  });
};

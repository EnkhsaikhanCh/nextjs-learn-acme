import validator from "validator";

export const sanitizeInput = (input: string) =>
  input.replace(/[^\w\s@.-]/g, "");

export const validateName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z0-9 .-]+$/;
  return nameRegex.test(name);
};

export const validationEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validationPassword = (password: string) => {
  const maxLength = 128;
  return (
    password.length <= maxLength &&
    validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })
  );
};

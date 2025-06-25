export const validateEmail = (email: string) => /.+@.+\..+/.test(email);
export const validatePassword = (password: string) => password.length >= 6; 
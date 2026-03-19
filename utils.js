import bcrypt from "bcrypt";
import z from "zod";

// PASSWORD UTILS
const ROUNDS = 12;
export const hashPassword = (plain) => bcrypt.hash(plain, ROUNDS);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

// ERROR HANDLER
export class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
//hola
export const ErrorManager = (error, res) => {
  console.log(error);
  if (error instanceof CustomError) {
    return res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }

  if (error instanceof z.ZodError) {
    const firstIssue = error.issues[0];
    const message = `${firstIssue.path.join(".")} : ${firstIssue.message}`;

    return res.status(400).json({
      error: {
        message,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: "Internal server error.",
    },
  });
};

export const isEmptyObject = (obj) => Object.keys(obj).length === 0;

import { CallbackError, model, Schema } from "mongoose";
import { User as IUser, UserMethods, UserModel } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: /^01[3-9]\d{8}$/,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      match: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
      // omit password field in the query result
      select: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// hash the password before storing into db
userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    // after successful hasing proceed saving data to db
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// make the password field empty for after save response
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// user instance methods
userSchema.methods.checkPassword = async function (plainTextPassword: string) {
  // 'this' referes to the user doc
  // this.password is a hashed password
  return bcrypt.compare(plainTextPassword, this.password);
};

// static methods
userSchema.statics.getUserByPhoneNumber = async function (
  phoneNumber: string,
  selectPassword = false
) {
  // by defualt password is ommited when querying
  if (selectPassword) {
    // this refers to the User model
    return this.findOne({ phoneNumber }).select("+password");
  }

  // this refers to the User model
  return this.findOne({ phoneNumber });
};

export const User = model<IUser, UserModel>("User", userSchema);

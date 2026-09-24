import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const hashValue = async (value) => {
    return bcrypt.hash(value, SALT_ROUNDS);
};

const compareValues = async (value, hashedValue) => {
    return bcrypt.compare(value, hashedValue);
};

export { hashValue, compareValues };
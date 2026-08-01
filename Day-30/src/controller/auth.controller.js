export const registerUser = ( req, res, next) => {
    try {
        throw new Error("Password is too weak.");
    } catch (err) {
        err.status = 400;
        next(err);
    }
}
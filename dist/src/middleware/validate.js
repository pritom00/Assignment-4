"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
/**
 * Validates req.body / req.query / req.params against a Zod schema.
 * Parsed (and coerced/defaulted) values are written back onto req so
 * downstream handlers get clean, typed data. Any failure is thrown as
 * a ZodError, which errorHandler converts into a 400 response.
 */
const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (parsed.body)
            req.body = parsed.body;
        if (parsed.params)
            req.params = parsed.params;
        // req.query is read-only in some Express/Node versions; merge in place instead of reassigning
        if (parsed.query)
            Object.assign(req.query, parsed.query);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.validate = validate;

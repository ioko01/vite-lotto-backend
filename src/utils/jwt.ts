import jwt, { SignOptions } from 'jsonwebtoken';
import { privateKey, publicKey } from './keys';

export const signJwt = (payload: Object, options: SignOptions = {}) => {
    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
};

export const verifyJwt = <T>(token: string): T | null => {
    try {
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        return null;
    }
};

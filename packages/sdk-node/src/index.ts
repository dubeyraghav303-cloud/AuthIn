import jwt from 'jsonwebtoken';
import axios from 'axios';

export class AuthKit {
    private secret: string;
    private apiUrl: string;

    constructor(options: { secret: string; apiUrl: string }) {
        this.secret = options.secret;
        this.apiUrl = options.apiUrl;
    }

    verifyToken(token: string) {
        try {
            return jwt.verify(token, this.secret);
        } catch (e) {
            throw new Error('Invalid token');
        }
    }

    async getUser(token: string) {
        try {
            const response = await axios.get(`${this.apiUrl}/auth/profile`, {
                headers: { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` },
            });
            return response.data;
        } catch (e) {
            throw new Error('Failed to fetch user');
        }
    }
}

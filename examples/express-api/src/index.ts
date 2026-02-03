import express, { Request, Response, NextFunction } from 'express';
import { AuthKit } from '@authkit/node';

const app = express();
const port = 4000;

// Initialize SDK
const auth = new AuthKit({
    secret: process.env.JWT_SECRET || 'secret',
    apiUrl: 'http://localhost:3000'
});

// Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const payload = auth.verifyToken(token);
        (req as any).user = payload;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

app.get('/public', (req, res) => {
    res.json({ message: 'Public Endpoint' });
});

app.get('/protected', requireAuth, (req, res) => {
    res.json({
        message: 'Protected Data',
        user: (req as any).user
    });
});

app.listen(port, () => {
    console.log(`Example API listening at http://localhost:${port}`);
});

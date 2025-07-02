    import express from 'express';
    import cors from 'cors';
    import passport from 'passport';
    import './config/passport.js';

    import authRoutes from './routes/auth.js';
    // import other routes similarly

    const app = express();

    // middleware 
    app.use(cors());
    app.use(express.json());
    app.use(passport.initialize());

    // Connect to DB
    import connectDB from './config/database.js';
    connectDB();

    // Routes
    app.use('/api/auth', authRoutes);
    app.get('/api/test', (req, res) => {
    res.send('EcoWise backend is running 🚀');
    });

    export default app;
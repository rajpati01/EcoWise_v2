    import express from 'express';
    import cors from 'cors';
    import passport from 'passport';
    import './config/passport.js';

    import authRoutes from './routes/auth.js';
    import campaignRoutes from './routes/campaigns.js';
    import adminRoutes from './routes/admin.js';
    import blogRoutes from './routes/blogs.js';
    import wasteGuideRoutes from './routes/wasteGuides.js';
    import wasteRoutes from './routes/wasteRoutes.js';
    import ecoPointsRoutes from './routes/ecopoints.js';
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
    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/blogs', blogRoutes);
    app.use('/api/waste-guides', wasteGuideRoutes);
    app.use('/api/waste', wasteRoutes);
    app.use("/api/ecopoints", ecoPointsRoutes);

    export default app;
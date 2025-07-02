
import app from './app.js'

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 EcoWise server running on port ${PORT}`);
 });



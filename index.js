import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';

// config the dotenv files
dotenv.config();
// declare PORT
const PORT = process.env.PORT || 8080;

// initialize the app
const app = express();

// default middleware
app.use(express.json());
app.use(cors());

// default routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello from flavorsome-food-school server, created by Ujjal Kumar Roy',
    });
});

// health routes
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Flavorsome-Food-School health is good now!!' });
});
// mongoDB Configurations

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zzrczzq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // collection and db name
        const userCollections = client.db('Flavorsome-Food-School').collection('User');

        // users related routes
        // all users get route
        app.get('/users', async (req, res) => {
            try {
                const allUsers = await userCollections.find().toArray();
                res.status(200).json({
                    success: true,
                    message: 'Get all The Users',
                    data: allUsers,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error from User Get Request!!',
                });
            }
        });
        // all users get route
        app.post('/users', async (req, res) => {
            try {
                const { email } = req.query;
                const isExitsUser = userCollections.find({ email });
                if (isExitsUser) {
                    return res.send([]);
                }
                const user = await userCollections.insertOne({ ...req.body });
                res.status(200).json({
                    success: true,
                    message: 'Successfully added the users!!',
                    data: user,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error from User POST Request!!',
                });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// listen the port
app.listen(PORT, () => {
    console.log('Server is running on PORT 8080');
});

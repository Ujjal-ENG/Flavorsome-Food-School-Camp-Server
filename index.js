/* eslint-disable comma-dangle */
/* eslint-disable no-tabs */
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
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

// jwt middleware
const verifyJWT = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized Access from Server!!',
            });
        }
        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized Access!!',
                });
            }
            req.user = decode;
            next();
        });
    } catch (error) {
        console.log(error);
    }
};
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
        const userCollections = client.db('FlavorsomeFoodSchool').collection('Users');
        const classCollections = client.db('FlavorsomeFoodSchool').collection('Classes');

        // json web token
        app.post('/jwt', (req, res) => {
            try {
                const user = req.body;
                const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
                res.json({ token });
            } catch (error) {
                console.log(error);
            }
        });

        // verify admin
        const verifyAdmin = async (req, res, next) => {
            try {
                const { email } = req.user;
                const user = await userCollections.findOne({ email });
                if (user?.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden Access!!',
                    });
                }
                next();
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    error: error.message,
                });
            }
        };
        // verify students
        const verifyStudent = async (req, res, next) => {
            try {
                const { email } = req.user;
                const user = await userCollections.findOne({ email });
                if (user?.role !== 'student') {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden Access!!',
                    });
                }
                next();
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    error: error.message,
                });
            }
        };
        // verify instructors
        const verifyInstructor = async (req, res, next) => {
            try {
                const { email } = req.user;
                const user = await userCollections.findOne({ email });
                if (user?.role !== 'instructor') {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden Access!!',
                    });
                }
                next();
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    error: error.message,
                });
            }
        };

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
                const { email } = req.body;
                const isExitsUser = await userCollections.findOne({ email });
                if (isExitsUser) {
                    return res.send({ message: 'Email is Already Exists' });
                }
                const user = await userCollections.insertOne({ ...req.body, role: 'student' });
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

        // get student role
        app.get('/users/student/:email', verifyJWT, async (req, res) => {
            try {
                const { email } = req.params;
                const decodedEmail = req.user.email;
                if (decodedEmail !== email) {
                    return res.send({ student: false });
                }
                const user = await userCollections.findOne({ email });
                const result = { student: user?.role === 'student' };
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        });

        // all users get
        app.get('/users', verifyJWT, verifyAdmin, async (req, res) => {
            try {
                const allusers = await userCollections.find().toArray();
                res.status(200).json({
                    success: true,
                    data: allusers,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error occurred when geting the Users data!!',
                    error: error.message,
                });
            }
        });

        // update user role
        app.patch('/users/admin/:id', verifyJWT, verifyAdmin, async (req, res) => {
            try {
                const { id } = req.params;
                const { role } = req.body;

                if (role !== 'admin' && role !== 'instructor') {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid role specified!!',
                    });
                }
                const updatedDoc = {
                    $set: {
                        role,
                    },
                };
                const result = await userCollections.updateOne(
                    { _id: new ObjectId(id) },
                    updatedDoc
                );
                res.status(200).json({
                    success: true,
                    message: 'User is Updated Successfully!!',
                    data: result,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error occurred when Updating the Users data!!',
                    error: error.message, // Include the error message in the response
                });
            }
        });

        // get admin role
        app.get('/users/admin/:email', verifyJWT, async (req, res) => {
            try {
                const { email } = req.params;
                const decodedEmail = req.user.email;
                if (decodedEmail !== email) {
                    return res.send({ student: false });
                }
                const user = await userCollections.findOne({ email });
                const result = { admin: user?.role === 'admin' };
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        });
        // get instructor role
        app.get('/users/instructor/:email', verifyJWT, async (req, res) => {
            try {
                const { email } = req.params;
                const decodedEmail = req.user.email;
                if (decodedEmail !== email) {
                    return res.send({ student: false });
                }
                const user = await userCollections.findOne({ email });
                const result = { instructor: user?.role === 'instructor' };
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        });

        // Class Related Query
        // all classes  get related routes
        app.get('/classes/:email', verifyJWT, verifyInstructor, async (req, res) => {
            try {
                const { email } = req.params;
                console.log(email);
                const allClasses = await classCollections.find({ email }).toArray();
                res.status(200).json({
                    success: true,
                    data: allClasses,
                });
            } catch (error) {
                console.log(error);
            }
        });

        // all classes  get related routes with admin
        app.get('/classes', verifyJWT, verifyAdmin, async (req, res) => {
            try {
                const allClasses = await classCollections.find().toArray();
                res.status(200).json({
                    success: true,
                    data: allClasses,
                });
            } catch (error) {
                console.log(error);
            }
        });
        // all classes  patch related routes with admin
        app.patch('/classes/:id', verifyJWT, verifyAdmin, async (req, res) => {
            try {
                const { id } = req.params;

                const { status, feedback } = req.body;
                const updatedDoc = {
                    $set: {
                        ...(status && { status }),
                        ...(feedback && { feedback }),
                    },
                };

                const updatedClass = await classCollections.updateOne(
                    { _id: new ObjectId(id) },
                    updatedDoc
                );

                res.status(200).json({
                    success: true,
                    data: updatedClass,
                });
            } catch (error) {
                console.log(error);
            }
        });

        // class created route
        app.post('/classes', verifyJWT, verifyInstructor, async (req, res) => {
            try {
                const classes = await classCollections.insertOne({ ...req.body });
                res.status(201).json({
                    success: true,
                    data: classes,
                });
            } catch (error) {
                console.log(error);
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

const express = require('express')
const app = express();
require('dotenv').config()
const connectToMongo  = require('./config/db'); 
const port = process.env.PORT || 3000;

connectToMongo()
// console.log(process.env.MONGO_URL)
// Allow requests from specific origin (replace with your frontend URL)
const cors=require('cors')
const corsOptions = {
  origin: 'https://669ac50a017118a3e1b7cce9--iridescent-baklava-f7ebc2.netlify.app', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Authorization', 'Content-Type'], // Add other headers as needed
  credentials: true // If you need to include cookies in the requests
};
app.use(cors(corsOptions));

// MiddleWare
app.use(express.json())


// Routes
const userRoute = require('./routes/userRoute')
app.use('/api/user',userRoute)

const adminRoute = require('./routes/adminRoute')
app.use('/api/admin',adminRoute)

const doctorRoute = require('./routes/doctorsRoute')
app.use('/api/doctor',doctorRoute)

app.use('/api/appointment', require('./routes/appointmentRoute'));

// -----------------------------------------------

app.get('/',(req,res)=>{
    res.send("Hello 1")
})

app.listen(port,()=>console.log(`Node server started at port ${port}`))

import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
const app = express();

// app.use(express.urlencoded({extended: true})); 
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors)
mongoose.set('strictQuery', true);
app.use(express.urlencoded())
mongoose.connect('mongodb://localhost:27017/sign-login', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB Connected")
});


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// routes
app.post("/login", (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({message:"Login Successfully", user:user})
            }else{
                res.send({message:"Password Incorrect"})
            }
        }
        else {
            res.send({message:'user not registered'})
        }
    })
})


app.post("/register", (req, res) => {
    const { email, password, name } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: 'user already registerd' })
        }
        else {
            const user = new user({
                name,
                email,
                password
            })
            user.save(err => {
                if (err) {
                    res.send(err)
                }
                else {
                    res.send({ message: 'Successfully Registered , Login Now' })
                }
            })
        }
    })

})

app.listen(9002, () => {
    console.log("port at 9002")
})
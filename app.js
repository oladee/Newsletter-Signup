const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const { sendFile } = require("express/lib/response");
const client = require("@mailchimp/mailchimp_marketing");
const app = express()



client.setConfig({
    apiKey: process.env.KEY,
    server: "us17",
})

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/signup.html")
})
app.post("/",(req,res)=>{
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var email = req.body.email
    const run = async ()=>{
        const response = await client.lists.batchListMembers("b788e6252d",{
            members:[
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields:{
                        FNAME: firstname,
                        LNAME: lastname,
                    }
                }

            ]
        })
        if(response.errors[0]?.error_code){
            res.sendFile(__dirname + "/failure.html")
            // res.write(`<h1>${response.errors[0]?.error_code}</h1>`)
        }
        else{
            res.sendFile(__dirname + "/success.html")
        }
    }
    run()
})

app.post("/failure.html", (req, res)=>{
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running on port 3000")
})
/**
 * Expense tracker
 * 
 * Features and end points
 * 
 * adding a new expense/income :  /add-expense ->post
 * displaying existing expenses : /get-expenses ->get
 * editing existing entries : /edit-expense ->/put
 * deleting expenses : /delete-expense ->delete
 * 
 * budget reporting
 * creating new user
 * validating user
 * 
 * Defining schema
 * Categories,Amount,Date
 */
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose=require('mongoose')
const express =require('express')
const{Expense} = require('./schema.js')
 const app = express()
 app.use(bodyParser.json())
 app.use(cors())

 async function connectToDb() {
  try{
    await mongoose.connect('mongodb+srv://new_user18:newdb18@cluster0.zbbu6k3.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
    console.log('DB connection established :)')
    const port = process.env.PORT || 8000
    app.listen(port, function() {
        console.log(`Listening on port ${port}...`)
    })
}catch(error){
    console.log(error)
    console.log("Couldn/'t connect to the network")
}}
connectToDb()
app.post('/add-expense',async function(request,response){
    // console.log(request.body)
    // response.json ({
    //     "status" : "created"  
 try{
    await Expense.create({
        "amount":request.body.amount,
        "category":request.body.category,
        "date":request.body.date

    })
    response.status(201).json({
        "status":"success",
        "message":"new entry created"
    })
}
 catch(error){
    response.status(500).json({
        "status":"failure",
        "message":" entry not created"
    })
}
 })

// const port=8000
// app.listen(port,function(){
//     console.log(Listening on port  ${port}...)
// })
app.get('/get-expenses', async function(request,response){
 try{
    const expensesData = await Expense.find()
    response.status(200).json(expensesData)
} catch(error){
    response.status(500).json({
        "status":"failure",
        "meassage":"could not fetch entries",
        "error":error
    })
}
   
})
app.delete('/delete-expense/:id', async function(request, response) {
    try {
        const expensedelete = await Expense.findById(request.params.id)
        if(expensedelete) {
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status" : "success",
                "message" : "deleted entry"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "could not find entry"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})
app.patch('/edit-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await expenseEntry.updateOne({
                "amount" : request.body.amount,
                "category" : request.body.category,
                "date" : request.body.date
            })
            response.status(200).json({
                "status" : "success",
                "message" : "updated entry"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "could not find entry"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})
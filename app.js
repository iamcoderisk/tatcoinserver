// import express from 'express';

require('dotenv').config();

// Set up the express app
const express   =   require('express');
var bodyParser  =   require('body-parser');
var upload      =   require('express-fileupload'); //middleware for form/file upload
const app       =   express();
const cors      =   require('cors');
var adminRouter =   require('./controllers/AdminController');
var   port      =   process.env.PORT || 5000;
var   mongoose  =   require('mongoose'); 
var path = require('path');
// var Contestants =   require('./models/Contestants');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());
app.use(express.static('public'))
// app.use(forms.array());
app.use(cors());

app.use('/admin', adminRouter);
// app.use(upload());
// get all todos
// app.post('/api/vote',forms.single('fileUpload'), (req, res) => {
//   // res.json({
//   //   msg:req.body.nickName
//   // })
//   // let file = req.body
//   res.json({
//     msg:req.file
//   })
// });
// app.post('/api/add',(req, res,next) => {
//   // res.json({
//   //   msg: req.body.name
//   // });
//   var myData =  new Contestants({
//     name:req.body.name,
//     nickName:req.body.nickName
//   });
//     myData.save((err,msg)=>{
//         if(!err){
//           // res.json({
//           //   msg: "data addedd successfully!"
//           // });
//           res.status(200).send({
//             success:'true',
//             'message':'user addedd!'
//           })
//         }else{
//           res.status(201).send({
//             success:'false',
//             message: 'Internal server error'
//           })
//         }
//     });
    
// });

mongoose.connect(process.env.DB_URI,{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
app.listen(port, () => {
  console.log(`server running on port ${port}`)
});
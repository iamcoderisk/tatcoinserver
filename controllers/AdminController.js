var express = require('express');


var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
var Admin = require('../models/Admins');
var Users = require('../models/Users');
var UserSession = require('../models/UserSession');
var Votes = require('../models/Votes');
var Contestants = require('../models/Contestants');
var AdminSession = require('../models/AdminSession');


router.get('/greet',(req,res)=>{
    return res.send("worked");
});
router.post('/update',(req,res)=>{

  // Admin.deleteOne({_id:req.body.userId},function(err, result){
  //   res.json({
  //     Data:result
  //   })
  // })
  // Admin.updateOne({_id:req.body.userId},req.body,function(err,result){
  //   res.json({
  //         Data:result
  //       })
// })

  // Admin.findOneAndUpdate({_id:req.body.userId},req.body,{new:true})

  // Admin.findOne({_id:req.body.userId},(error,data)=>{
  //   Admin.updateOne({email:"ekeminyd@gmail.com"},
  //     { $set: {"firstname": "pharoah"}})
  //   // Admin.firstname = "Kolomental";
  //   // Admin.save()
  //   // if(req.cookies.x===data.email){
  //   //      Admin.findByIdAnUpdate(
  //   //        "5eda0349ae9c7a1041cb1fc1"
  //   //   ,{
  //   //       firstname: "Kolomental"
  //   //   })

  //   // }
  // // })
});


/* GET users listing. */
router.post('/createAdmin', function(req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        Admin.findOne({email:req.body.email},(err,data)=>{
          if(data){
            res.json({
              statusCode:201,
              msg:"admin with email already exist"
            })
          }else{
            var myData =  new Admin({
              firstname:req.body.firstname,
              lastname:req.body.lastname,
              email:req.body.email,
              password:hash
            });
              myData.save();
                res.json({
                  statusCode:200,
                  msg:"admin added successfully!"
                })
          
          }
        })
    
    });
    
});



/* GET users listing. */
router.post('/vote', function(req, res, next) {
  Votes.findOne({contestant:req.body.cid},(err,data)=>{
    if(!data){
      var myData =  new Votes({
        contestant:req.body.cid,
         voter_id:req.body.voter
     });
       myData.save();
       Contestants.findOne({_id:req.body.cid},(error,data)=>{
        let update = parseInt(data.votes + 1)
        Contestants.updateOne({_id:req.body.cid},
          { $set: {votes:update}},(err,result)=>{
            res.json({
              statusCode:200,
              msg:"you have voted successfully"
            })
          })
        
      })

      }else if(req.body.voter.toString()=== data.voter_id.toString()){
        res.json({
          statusCode:201,
          msg:"you cannot vote twice for one user"
        })
      
    }
  });
 

});

router.post('/addfile',(req,res,next)=>{
  Contestants.findOne({nickname:req.body.nickname},(err,data)=>{
    if(data){
      res.json({
        statusCode:201,
        msg:"nickname already exist"
      })
    }else{
      let file   =  req.files['file'];
    file.mv("public/static/" + file.name,(error)=>{
      if(!error){
        var myData=  new Contestants({
          fullname:req.body.fullname,
          nickname:req.body.nickname,
          bio:req.body.bio,
          profileImage:file.name,
          votes:0
        });
          myData.save();
            res.json({
              statusCode:200,
              msg:"user created sucessful"
            })
      }
    })

      

    }
  })
 





})

router.post('/listvotes',(req,res,next)=>{

  Votes.findOne({contestant:req.body.id },(err,result)=>{
    res.json({
      data:result
    })
  })
})
router.get('/list',(req,res,next)=>{
  Contestants.find({},(err,result)=>{

      res.json({
        data:result
      })
 
    })
    
    

      
//   // })
//   Contestants.aggregate([
//     { $lookup:
//       {
//         from: 'votes',
//         as: 'votes',
//        let: {contestant: "$_id"},
//       pipeline: [
//          {$match: {$expr: {$eq:['$contestant','$$contestant']}}}
//       ]
        
//       }
//     }
//   ]).exec(function( err, result ) {
  
//     if ( err )
//       throw err;

//     res.json({
//       data: result
//     });

//   }
// )





})

router.post('/login',(req,res,next)=>{
  Admin.findOne({
    email:req.body.email
  },(err,data)=>{
    bcrypt.compare(req.body.password,data.password, function(err, result) {
      if(result===true){

        // req.session.email = data.email
      var userSession = new AdminSession();
          userSession.userId =  data._id;

          userSession.save((err,result)=>{
            if(err){
              return res.json({
                sucessful:false,
                statusCode:201,
                message: "Internal server error "
              })
            }
            return res.json({
              success:true,
              token:data._id,
              message:"Logged in successfully"
            })
          })
          userSession.date = Date.now()
        // res.cookie('x', data.email);
        // res.json({
        //   msg:"user  found",
        //   statusCode:200
        // })
      }else {
        res.json({
          msg:"Invalid user credentials",
          statusCode:201
        })
      }
  });

  });
});


router.post('/loginvote',(req,res,next)=>{
  Users.findOne({
    email:req.body.email
  },(err,data)=>{
    if(data){
      //found, login
      var userSession = new UserSession();
      userSession.userId =  data._id;

      userSession.save((err,result)=>{
        if(err){
          return res.json({
            sucessful:false,
            statusCode:201,
            message: "Internal server error "
          })
        }
        return res.json({
          success:true,
          token:data._id,
          message:"Logged in successfully"
        })
      })
      userSession.date = Date.now()

    // res.json({
    //   msg:"Invalid user credentials",
    //   statusCode:201
    // })
  
    }else{
      //create then login 
      var myData =  new Users({
        email:req.body.email
      });
        myData.save();
          res.json({
            statusCode:200,
            msg:"user  added successfully!"
          });


    }
  

        // req.session.email = data.email
     
 

  });
});

router.post('/delete',(req,res)=>{
  Contestants.deleteOne({_id:req.body.userId},function(err, result){
      res.json({
        msg:"deleted",
        status:200
      });
    })
});

router.post('/listvoter',(req,res,next)=>{
   Users.findOne({_id:req.body.userId},(err,data)=>{
    if(data){
      res.json({
        values:data,
        statusCode:200
      })
    }else if(req.body.userId===null || data._id != req.body.userId){
      res.json({
        statusCode:201
      })
    }
  });
})
router.get('/verifytoken', function(req, res, next) {
    const { query } = req;
    const { token } =  query
    AdminSession.findOne({
      _id:token ,
      isDeleted:false
    },(err,session)=>{
        if(err){
          return res.send({
            success:false,
            message:"Internal server error",
            statusCode:201
          })
        }
          if(!session){
            return res.send({
              success:false,
              message:"Invalid"
            })
          }else{
            return res.send({
              success:true,
              message:"In session"
            })
          }

    })

});






router.get('/logout', function(req, res, next) {
    const { query } = req;
    const { token } =  query
    AdminSession.findOneAndUpdate({
      _id:token ,
      isDeleted:false
    },{
      $set : { isDeleted : true }
    },null,(err,session)=>{
        if(err){
          return res.send({
            success:false,
            message:"Internal server error",
            statusCode:201
          })
        }
          if(!session){
            return res.send({
              success:false,
              message:"Invalid"
            })
          }else{
            return res.send({
              success:true,
              message:"Logged out"
            })
          }

    })

});



// router.post('/getAdmin', function(req, res, next) {
  // Admin.findOne({_id:req.body.userId},(err,data)=>{
  //   if(data){
  //     res.json({
  //       values:data,
  //       statusCode:200
  //     })
  //   }else if(req.body.userId===null || dat._id != req.body.userId){
  //     res.json({
  //       statusCode:201
  //     })
  //   }
  // });
// });




router.post('/upload', function(req, res) {
    // return res.json({
    //   obj:req.body.file
    // })
  if(req.body.file===null){
     res.json({
       status:400,
       msg:"No file was selected"
     })
  }
  let file = req.body.file;

  file.mv(`${__dirname}/public/uploads/${file}`,err=>{
    if(err){
      console.error(err);
      res.json({
        status:500,
        msg:err
      })
    }
    res.json({fileName:file.name,filePath:`/uploads/${file}`})
  })

});





module.exports = router;

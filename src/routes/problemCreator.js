const express=require("express");
const adminMiddleware=require("../middleware/adminMiddleware")
const problemRouter=express.Router();
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,allSolvedProblemByUser,submittedProblem}=require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");



//Create
problemRouter.post("/create",adminMiddleware,createProblem);
//update
problemRouter.patch("/update/:id",adminMiddleware,updateProblem);
//delete
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


//fetch
problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,allSolvedProblemByUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);



module.exports=problemRouter;
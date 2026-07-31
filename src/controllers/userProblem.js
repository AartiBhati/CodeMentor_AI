const {getLanguageById,submitBatch,submitToken} = require("../utility/problemUtility");
const Problem=require("../models/problem");
const Submission = require("../models/submission");
const User=require('../models/user')


const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;


    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map(testcase=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);

        const resultToken=submitResult.map(value=>{
            return value.token;
        });

        const testResult=await submitToken(resultToken);

        for(const test of testResult){

            if(test.status_id==4)return res.status(400).send("Wrong Answer");
            if(test.status_id==5){
                return res.status(400).send("Time Limit Exceeded");
            }
            if(test.status_id==6)return res.status(400).send("Compilation Error");
            if(test.status_id==7)return res.status(400).send("Runtime Error");
        }

      }

      //Now we can store it in our Database
      const userProblem= await Problem.create({
        ...req.body,problemCreator:req.result._id
      });
      res.status(201).send("Problem saved successfully");


    }
    catch(err){
        res.send("Error: "+err.message);
    }
}


const updateProblem=async(req,res)=>{
    const {id}=req.params;
     const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

    try{

        if(!id){
            return res.status(400).send("Missing ID Field");
        }

        const DsaProblem=await Problem.findById(id);
        if(!DsaProblem){
            return res.status(404).send("ID is not present in server");
        }

        //Check the solution first
        for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map(testcase=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);

        const resultToken=submitResult.map(value=>{
            return value.token;
        });

        const testResult=await submitToken(resultToken);

        for(const test of testResult){

            if(test.status_id==4)return res.status(400).send("Wrong Answer");
            if(test.status_id==5){
                return res.status(400).send("Time Limit Exceeded");
            }
            if(test.status_id==6)return res.status(400).send("Compilation Error");
            if(test.status_id==7)return res.status(400).send("Runtime Error");
        }

        }

        const newProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});

        res.status(200).send(newProblem);

    }catch(err){
        res.status(404).send("Error "+err.message);
    }
}

const deleteProblem=async(req,res)=>{
    const {id}=req.params;
    try{

        if(!id){
            return res.status(400).send("Missing ID Field");
        }

        
        const deleltedProblem=await Problem.findByIdAndDelete(id);

        if(!deleltedProblem){
            return res.status(404).send("Problem is missing.");
        }
        res.status(200).send("Problem deleted successfully");

    }catch(err){
        res.status(404).send("Error "+err.message);
    }
}

const getProblemById=async(req,res)=>{
    const {id}=req.params;
    
    try{
        if(!id)return res.status(400).send("Id is missing");

        const getProblem=await Problem.findById(id).select('id title description difficulty tags visibleTestCases startCode');

        //-hiddentestcase in selct if you want to discard it
        if(!getProblem)
            return res.status(404).send("Problem is missing");

        return res.status(200).send(getProblem);
    }catch(err){
        res.status(404).send("Error "+err.message);
    }
}

const getAllProblem=async(req,res)=>{
    try{
        const getProblem=await Problem.find({}).select('_id title difficulty tags');
        if(getProblem.length==0)
            return res.status(404).send("Problem is missing");

        res.status(200).send(getProblem);
    }catch(err){
        res.status(404).send("Error "+err.message);
    }
}

const allSolvedProblemByUser=async(req,res)=>{
    try{
        const userId=req.result._id;
        const user=await User.findById(userId).populate({path:"problemSolved",
            select:"_id title difficulty tags"
        });
        // const count=req.result.problemSolved.length;
        res.status(200).send(user.problemSolved);
    }catch(err){
        return res.status(500).json({
            message: err.message
  });
    }
}


const submittedProblem=async (req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.pid;

        const ans=await Submission.find({userId,problemId});

        if(ans.length==0)res.status(200).send("No Submission is present");

        res.status(200).send(ans);
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
}

module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,allSolvedProblemByUser,submittedProblem
};

const workspaceModel = require("../models/workspaceModel");
const {validationResult} = require('express-validator');

exports.renderWorkspace = async (req, res) => {

  const { idWorkspace } = req.params;

  try{

    const workSpace = await workspaceModel.findById(idWorkspace);
    console.log("workspace------------->",workSpace);
    let hideCompletedTask = false;
    if(workSpace){
    hideCompletedTask = workSpace.settings.hideCompletedTask;
      if(hideCompletedTask){
         workSpace.tasks = workSpace.tasks.filter(task => task.finishedDate == undefined); 
         console.log("console de workspace.task", workSpace.tasks);
      }
    }
    console.log("condole de hideTask", hideCompletedTask); 
    res.render('index',{
      workSpace,
      hideCompletedTask
    })
  
  }
  catch(err){
    return res.status(404).send(`El worskpace ${idWorkspace} no existe o ha sido eliminado. <a href="/">Crea uno nuevo</a>`)
  }

};

exports.createWorkspace = async (req, res) => {

  //Validación de errores de express-validator
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { title, text } = req.body;

  const workspace = new workspaceModel({
    tasks: { title : title , text : text},
  });
  const newWorkspace = await workspace.save();

  res.redirect(`/${newWorkspace._id}`);
};

exports.addTask = async (req,res) =>{

  //Validación de errores de express-validator
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


  const { title, text, id } = req.body;
  console.log("El id del workspace:",id);
  const workSpace = await workspaceModel.findById(id);
  await workSpace.tasks.push({
    title,
    text
  })
  await workSpace.save();
  res.redirect(`/${id}`)
}


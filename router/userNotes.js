import express from "express";
import { authenticationToken } from "../utilities.js";
import Note from "../models/note.model.js";
const router = express.Router();

router.post("/create-note", authenticationToken, async (req, res) => {
  try {
    const { email } = req.user;
    if (!req.body.title) {
      return res
        .status(400)
        .json({ error: true, message: "Title is required" });
    }
    if (!req.body.content) {
      return res
        .status(400)
        .json({ error: true, message: "Content is required" });
    }
    if (!req.body.tags) {
      return res
        .status(400)
        .json({ error: true, message: "Tags are required" });
    }
    const note = await new Note({
      userId: req.user.userId,
      tags: req.body.tags,
      title: req.body.title,
      content: req.body.content,
    });
    await note.save();
    return res
      .status(201)
      .json({ error: false, message: "Note Created Successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
});
router.get("/get-all-notes", authenticationToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({isPinned:-1});
    return res.json({ notes: notes });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
});
router.get("/get-note/:id", authenticationToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note Not Found" });
    }
    if(note.userId.toString()!==req.user.userId){
        return res.status(403).json({error:true,message:"Unauthorized"});
    }
    return res.status(200).json({ error:false,note: note });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
});
router.put("/update-note/:id", authenticationToken, async (req, res) => {
  try {
    if(!req.body.title){
        return res.status(400).json({error:true,message:"Title is required"});
    }
    if(!req.body.content){
        return res.status(400).json({error:true,message:"Content is required"});
    }
    const note = await Note.findOne({ _id: req.params.id,userId:req.user.userId });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note Not Found" });
    }
    
    note.title = req.body.title;
    note.content = req.body.content;
    note.tags = req.body.tags;
    await note.save();
    return res.json({ error: false, message: "Note Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
});
router.delete('/delete-note/:id',authenticationToken,async(req,res)=>{
    try {
        const note=await Note.deleteOne({_id:req.params.id,userId:req.user.userId});
        console.log(note);
        if(note.deletedCount===0){
            return res.status(404).json({error:true,message:"Note Not Found"});
        }
        return res.json({error:false,message:"Note Deleted Successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})
router.put('/pin-note/:id',authenticationToken,async(req,res)=>{  
    try {
        const pinned=req.body.isPinned;
        console.log()
        const note=await Note.findOne({_id:req.params.id,userId:req.user.userId});
        if(!note){
            return res.status(404).json({error:true,message:"Note Not Found"});
        }
        note.isPinned=pinned;
        await note.save();
        return res.json({error:false,message:"Note Pinned Status Updated Successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})
export default router;

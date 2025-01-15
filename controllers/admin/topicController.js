const Topic=require('../../models/topic');

exports.createTopic=async(req,res,next)=>{
const name=req.body.name;
const topic=new Topic({
    name:name
})
 const saved =await topic.save();
 if (!saved){
    const err=new Error ('error in saving the topic,try again!');
    err.statusCode=500;
    next(err);
 }
 else {
    res
    .satus(200)
    .json('topic created successfully',{
        topic:saved
    });
 }
};

exports.getTopics=async(req,res,next)=>{
    const topics= await Topic.find();
    if (!topics){
        const err=new Error ('error in getting topics,try again!');
    err.statusCode=500;
    next(err);
    }
    if (topics.length==0){
        res
        .status(400)
        .json('there is no topics yet, try to create one')
    }
    else {
        res
        .status(200)
        .json('this is the topics ', {
            topics:topics
        })
    }
};

exports.renameTopic=async(req,res,next)=>{
    const newName=req.body.newname;
    const topicId=req.params.topicId;
    const topic=await Topic.findById(topicId);
    if (!topic){
        const err=new Error ('topic not exists,try again!');
    err.statusCode=500;
    next(err);
    }
    topic.name=newName;
   const savedTopic= await topic.save();
   if (!savedTopic){
    const err=new Error ('error in saving the topic,try again!');
    err.statusCode=500;
    next(err);
 }
 else {
    res
    .satus(200)
    .json('topic renamed successfully',{
        topic:saved
    });
 }
    
}

exports.deleteTopic=async(req,res,next)=>{
    const topicId=req.params.topicId;
    const topic=await Topic.findById(topicId);
    if (!topic){
        const err=new Error ('topic not exists,try again!');
    err.statusCode=500;
    next(err);
    }
 const deleted=   await Topic.deleteOne(topic);
 if (!deleted){
    const err=new Error ('error in deleting topic');
    err.statusCode=500;
    next(err);
 }
 res
 .status(200)
 .json('topic is deleted successfully')

}
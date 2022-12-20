import Faqs from "../Model/Faq";

export const createFaqs = async (req,res,next) =>{
   try{
        const faq = await Faqs.create(req.body)
        if(faq){
        return res.status(200).send({
                status:"success",
                message:"Faq created"
            })
        }
   }catch(err){
        return res.status(200).send({
            status:"failed",
            message:"Faq not created"
        })
   }
    
}

export const getAllFaqs = async (req,res,next) =>{
    try{
        const faq = await Faqs.find();
        if(faq){
        return  res.status(200).send({
                status:"success",
                count: faq.length,
                data:faq,
            })
        }
    }catch(err){
        return res.status(200).send({
            status:"failed",
            message:"no faq available"
        })
    }
}

export const deleteFaq = async (req,res,next) =>{
   try{
    const id = req.params.id;
    const faq = await Faqs.findById(id);
    if(faq){
        await faq.remove();
        return res.status(200).send({
            status:"success",
            message:"deleted faq"
        })
    }
    return res.status(200).send({
        status:"failed",
        message:"faq does not exist"
    })

   }catch(err){

    }
}

export const updateFaq = async (req,res,next) =>{
    try{
        const {question, answer} = req.body
        const id = req.params.id
        let faq = await Faqs.findById(id);
        if(faq){
            await  faq.update({question,answer})
            return res.status(200).send({
                status:"success",
                message:"faq updated"
            })
        }

        res.status(200).send({
            status:"failed",
            message:"could not update faq"
        })
    }catch(err){
        console.log(err.message)
    }
}
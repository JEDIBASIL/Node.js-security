import express from "express";
import {createFaqs, deleteFaq,getAllFaqs,updateFaq} from "../Controller/faq"

const faqRouter = express.Router({mergeParams:true})

faqRouter.route("/").get(getAllFaqs).post(createFaqs)
faqRouter.route("/:id").put(updateFaq).delete(deleteFaq)

export default faqRouter
import mongoose from "mongoose"

const FaqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Please faq requires a question"]
    },
    answer: {
        type: String,
        required: [true, "Please faq requires a answer"]
    },

    addedBy: {
        type: String,
        required: [true, "Please faq requires a answer"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Faqs = mongoose.model('Faqs', FaqSchema);

export default Faqs
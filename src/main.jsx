import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



// exports.addSubQuestion = async (req, res) => {
//   try {
//     const { error } = validateSubQuestion.validate(req.body);
//     if (error) return res.status(422).json({ success: false, message: error.message });

//     const result = await questionBankService.addSubQuestion(req.body);
//     res.status(200).json({ success: true, message: "Subquestion added", data: result });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// }; api const mongoose = require("mongoose");

// const subQuestionSchema = new mongoose.Schema({
//   parentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "QuestionBank",
//     required: true
//   },
//   questionText: { type: String, required: true },
//   options: [{ type: String, required: true }],
//   correctAnswer: { type: String, required: true },
// }, { timestamps: true });

// subQuestionSchema.index({
//   parentId: 1, questionText: 1, correctAnswer: 1
// }, { unique: true });

// module.exports = mongoose.model("SubQuestion", subQuestionSchema);  model  const express = require("express");
// const router = express.Router();
// const questionBankController = require("../controller/questionController");
// // Parent Question API
// router.post("/", questionBankController.createOrUpdateQuestionBank);
// // Subquestion APIs
// router.post("/subquestion", questionBankController.addSubQuestion);
// router.get("/subquestion/:parentId", questionBankController.getSubQuestions);
// router.delete("/subquestion/:id", questionBankController.deleteSubQuestion);

// // Filter, status, delete
// router.get("/filter", questionBankController.getFilteredQuestionBank);
// router.put('/status/:id', questionBankController.changeStatus);
// router.delete('/delete', questionBankController.deleteSubjectSmart);
// module.exports = router; royest exports.addSubQuestion = async (data) => {
//   const { parentId, questionText, options, correctAnswer } = data;

//   const trimmedQuestion = questionText.trim();
//   const trimmedOptions = options.map(opt => opt.trim());
//   const trimmedAnswer = correctAnswer.trim();

//   // Duplicate check
//   const duplicate = await SubQuestion.findOne({
//     parentId,
//     questionText: trimmedQuestion,
//     correctAnswer: trimmedAnswer,
//     options: trimmedOptions,
//   });

//   if (duplicate) throw new Error("Subquestion already exists under this parent.");

//   const subQuestion = new SubQuestion({
//     parentId,
//     questionText: trimmedQuestion,
//     options: trimmedOptions,
//     correctAnswer: trimmedAnswer,
//   });

//   await subQuestion.save(); 
//   return subQuestion;
// }; servies const addSubQuestion = (data, token) => {
//   return axios.post(ApiConstant.SUBQUESTION_ADD, data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }; frontend api
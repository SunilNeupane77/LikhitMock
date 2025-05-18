// Script to convert all questions in b.json to category "B" and add them to pattern-questions.json

const fs = require('fs');
const path = require('path');

// Define file paths
const bJsonPath = path.resolve(__dirname, '..', 'data', 'clean-b.json');
const patternQuestionsPath = path.resolve(__dirname, '..', 'data', 'pattern-questions.json');

// Function to add "id" property to questions from b.json
function addIdToQuestion(question, index) {
  return {
    ...question,
    id: `b${(index + 1).toString().padStart(3, '0')}`, // Generate ID like b001, b002, etc.
    category: "B", // Ensure all questions have category "B"
    // Add default pattern if not present
    pattern: question.pattern || "multiple-choice"
  };
}

try {
  // Read b.json file
  const bJsonText = fs.readFileSync(bJsonPath, 'utf8');
  const bJsonData = JSON.parse(bJsonText);
  
  console.log(`Found ${bJsonData.questions.length} questions in b.json`);
  
  // Convert all questions to category B and add id
  const processedBQuestions = bJsonData.questions.map(addIdToQuestion);
  
  // Read pattern-questions.json file
  const patternQuestionsText = fs.readFileSync(patternQuestionsPath, 'utf8'); 
  const patternQuestionsData = JSON.parse(patternQuestionsText);
  
  console.log(`Found ${patternQuestionsData.questions.length} questions in pattern-questions.json`);
  
  // Check if each question from b.json already exists in pattern-questions.json by question text
  // This avoids duplicates when running the script multiple times
  const existingQnTexts = patternQuestionsData.questions.map(q => q.qn);
  const newBQuestions = processedBQuestions.filter(q => !existingQnTexts.includes(q.qn));
  
  console.log(`Found ${newBQuestions.length} new questions to add from b.json`);
  
  // Add new questions to the pattern-questions.json data
  patternQuestionsData.questions = [...patternQuestionsData.questions, ...newBQuestions];
  
  // Write the updated data back to pattern-questions.json
  fs.writeFileSync(patternQuestionsPath, JSON.stringify(patternQuestionsData, null, 2));
  
  console.log(`Successfully added ${newBQuestions.length} questions to pattern-questions.json`);
  console.log(`Total questions in pattern-questions.json: ${patternQuestionsData.questions.length}`);
  
} catch (error) {
  console.error('Error processing files:', error);
}

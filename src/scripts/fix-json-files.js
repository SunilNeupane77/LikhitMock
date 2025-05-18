// This script will:
// 1. Fix the pattern-questions.json file by removing duplicate "questions" array
// 2. Update b.json to change all categories from "A" to "B"
// 3. Integrate the questions from b.json into pattern-questions.json

const fs = require('fs');
const path = require('path');

// File paths
const patternQuestionsPath = path.resolve(__dirname, '..', 'data', 'pattern-questions.json');
const bJsonPath = path.resolve(__dirname, '..', 'data', 'b.json');
const outputPath = path.resolve(__dirname, '..', 'data', 'fixed-pattern-questions.json');

// Read the files
try {
  // Read pattern-questions.json
  const patternQuestionsRaw = fs.readFileSync(patternQuestionsPath, 'utf8');
  const patternQuestions = JSON.parse(patternQuestionsRaw);
  
  // Read b.json
  const bJsonRaw = fs.readFileSync(bJsonPath, 'utf8');
  
  // Fix b.json structure (handle the double array brackets)
  const fixedBJsonRaw = bJsonRaw.replace('"questions": [[', '"questions": [');
  const bJsonData = JSON.parse(fixedBJsonRaw);
  
  // Update category from "A" to "B" in b.json
  const updatedBQuestions = bJsonData.questions.map(question => {
    if (question.category === 'A') {
      return { ...question, category: 'B' };
    }
    return question;
  });
  
  // Combine both question sets
  const combinedQuestions = [...patternQuestions.questions, ...updatedBQuestions];
  
  // Create the fixed output
  const fixedData = {
    questions: combinedQuestions
  };
  
  // Write the output to the new file
  fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2));
  
  console.log(`Successfully processed files and created ${outputPath}`);
  console.log(`Total questions in combined file: ${combinedQuestions.length}`);
  
} catch (error) {
  console.error('Error processing files:', error);
}

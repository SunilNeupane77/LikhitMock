// Script to fix b.json and integrate its questions into pattern-questions.json
const fs = require('fs');
const path = require('path');

// Define file paths
const bJsonPath = path.join(__dirname, '..', 'data', 'b.json');
const fixedBJsonPath = path.join(__dirname, '..', 'data', 'fixed-b.json');
const patternQuestionsJsonPath = path.join(__dirname, '..', 'data', 'pattern-questions.json');
const outputBJsonPath = path.join(__dirname, '..', 'data', 'b-fixed-single-line.json');

console.log('File paths:');
console.log(`b.json: ${bJsonPath}`);
console.log(`fixed-b.json: ${fixedBJsonPath}`);
console.log(`pattern-questions.json: ${patternQuestionsJsonPath}`);
console.log(`b-fixed-single-line.json: ${outputBJsonPath}`);

// Read and parse b.json
console.log('\nReading b.json...');
let bContent;
try {
  bContent = fs.readFileSync(bJsonPath, 'utf8');
  console.log(`b.json read successfully (${bContent.length} bytes)`);
  
  // Remove the comment line at the top if it exists
  bContent = bContent.replace(/\/\/.*\n/, '');
  
  // Parse the content, handling the nested array issue
  console.log('Parsing b.json content...');
  const bData = JSON.parse(bContent);
  console.log(`b.json parsed successfully. Found ${bData.questions ? bData.questions.length : 0} questions.`);
  const bQuestions = bData.questions;
  
  // Ensure all questions have category "B"
  const fixedQuestions = bQuestions.map(q => {
    return {
      ...q,
      category: "B" // Ensure category is set to "B"
    };
  });
  
  // Create a fixed version of b.json with all questions having category "B"
  const fixedBData = { questions: fixedQuestions };
  
  // Write the fixed data back to a fixed-b.json file
  fs.writeFileSync(fixedBJsonPath, JSON.stringify(fixedBData, null, 2));
  console.log(`Fixed b.json data saved to ${fixedBJsonPath}`);
  
  // Write single-line version similar to ak.json
  fs.writeFileSync(outputBJsonPath, JSON.stringify(fixedBData));
  console.log(`Single-line version of b.json saved to ${outputBJsonPath}`);
  
  // Read pattern-questions.json
  console.log('Reading pattern-questions.json...');
  const patternQuestionsContent = fs.readFileSync(patternQuestionsJsonPath, 'utf8');
  let patternQuestionsData;
  
  try {
    // Remove the comment line at the top if it exists
    const cleanContent = patternQuestionsContent.replace(/\/\/.*\n/, '');
    patternQuestionsData = JSON.parse(cleanContent);
  } catch (error) {
    console.error('Error parsing pattern-questions.json:', error);
    console.log('Using empty questions array instead');
    patternQuestionsData = { questions: [] };
  }
  
  // Get existing questions from pattern-questions.json
  const existingQuestions = patternQuestionsData.questions || [];
  
  // Add IDs to B category questions if they don't have one
  const bQuestionsWithIds = fixedQuestions.map((q, index) => {
    if (!q.id) {
      return {
        ...q,
        id: `b${String(index + 1).padStart(3, '0')}`,
        pattern: q.pattern || 'single-choice' // Default pattern if not specified
      };
    }
    return q;
  });
  
  // Check for existing B category questions to avoid duplicates
  const existingBIds = new Set(
    existingQuestions
      .filter(q => q.category === 'B')
      .map(q => q.id)
  );
  
  // Filter out questions that already exist
  const newBQuestions = bQuestionsWithIds.filter(q => !existingBIds.has(q.id));
  
  // Combine existing questions with new B questions
  const updatedQuestions = [...existingQuestions, ...newBQuestions];
  
  // Update pattern-questions.json
  const updatedPatternQuestionsData = { questions: updatedQuestions };
  fs.writeFileSync(patternQuestionsJsonPath, JSON.stringify(updatedPatternQuestionsData, null, 2));
  console.log(`Updated pattern-questions.json with ${newBQuestions.length} new Category B questions`);
  
} catch (error) {
  console.error('Error processing files:', error);
}

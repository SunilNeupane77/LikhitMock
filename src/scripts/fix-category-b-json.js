// Script to fix category values in b.json and integrate into pattern-questions.json
const fs = require('fs');
const path = require('path');

// Define file paths
const bFixedSingleLinePath = path.join(__dirname, '..', 'data', 'b-fixed-single-line.json');
const fixedBJsonPath = path.join(__dirname, '..', 'data', 'fixed-b.json'); // This file will be created
const patternQuestionsJsonPath = path.join(__dirname, '..', 'data', 'pattern-questions.json');
const outputFixedBJsonPath = path.join(__dirname, '..', 'data', 'b-fixed-single-line-corrected.json');

console.log('Running script to fix category B questions...');
console.log('File paths:');
console.log(`Current single-line b.json: ${bFixedSingleLinePath}`);
console.log(`fixed-b.json: ${fixedBJsonPath}`);
console.log(`pattern-questions.json: ${patternQuestionsJsonPath}`);

try {
  // 1. Read from b-fixed-single-line.json first and create fixed-b.json
  console.log('\nReading b-fixed-single-line.json...');
  const bFixedSingleLineContent = fs.readFileSync(bFixedSingleLinePath, 'utf8');
  const bFixedSingleLineData = JSON.parse(bFixedSingleLineContent);
  
  // Create the fixed-b.json file with proper formatting for easier editing
  fs.writeFileSync(fixedBJsonPath, JSON.stringify(bFixedSingleLineData, null, 2));
  console.log(`Created properly formatted fixed-b.json file`);
  
  // Now read from the newly created fixed-b.json file
  console.log('\nReading and fixing fixed-b.json...');
  const fixedBContent = fs.readFileSync(fixedBJsonPath, 'utf8');
  const fixedBData = JSON.parse(fixedBContent);
  
  // This is a deep fix that handles the nested object structure in b.json
  // Each question inside questions array is an object with numeric keys (0, 1, 2...)
  const deepFixedBQuestions = fixedBData.questions.map(questionObj => {
    // We need to process each numeric key in the question object
    const updatedQuestionObj = {};
    
    // Iterate through each property (which are numeric keys)
    for (const key in questionObj) {
      if (key === 'category') {
        // Set the top-level category to B
        updatedQuestionObj[key] = 'B';
      }
      else if (typeof questionObj[key] === 'object' && questionObj[key] !== null) {
        // This is likely a nested question with a numeric key
        const nestedQuestion = questionObj[key];
        
        // Fix the category in the nested question
        updatedQuestionObj[key] = {
          ...nestedQuestion,
          category: 'B'
        };
      } 
      else {
        // Copy other properties as is
        updatedQuestionObj[key] = questionObj[key];
      }
    }
    
    return updatedQuestionObj;
  });
  
  // Save the fixed data back to fixed-b.json
  const deepFixedBData = { questions: deepFixedBQuestions };
  fs.writeFileSync(fixedBJsonPath, JSON.stringify(deepFixedBData, null, 2));
  console.log(`Updated fixed-b.json with correct category B values`);
  
  // 2. Create a corrected single-line version
  fs.writeFileSync(outputFixedBJsonPath, JSON.stringify(deepFixedBData));
  console.log(`Created corrected single-line version at ${outputFixedBJsonPath}`);
  
  // 3. Fix and integrate with pattern-questions.json
  console.log('\nReading pattern-questions.json...');
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
  
  // Get existing questions
  const existingQuestions = patternQuestionsData.questions || [];
  
  // Find and fix any category B questions with incorrect category value
  const updatedExistingQuestions = existingQuestions.map(q => {
    // If the question number is > 130 and < 220, it should be category B
    if (q.n && typeof q.n === 'string') {
      const numValue = parseInt(q.n.replace(/[^\d]/g, ''), 10);
      if (numValue >= 130 && numValue <= 220) {
        return {
          ...q,
          category: 'B'  // Ensure category is B
        };
      }
    }
    return q;
  });
  
  // Prepare the deep fixed B questions for integration
  // The structure needs to be flattened to match pattern-questions.json format
  const flattenedBQuestions = [];
  
  deepFixedBQuestions.forEach((questionObj, objIndex) => {
    // For each numeric key in the question object (0, 1, 2...)
    for (const key in questionObj) {
      if (typeof questionObj[key] === 'object' && questionObj[key] !== null) {
        const nestedQuestion = questionObj[key];
        
        // Skip the -last_modified entry
        if (key === '-last_modified') continue;
        
        // Generate an ID if not present
        const id = nestedQuestion.id || `b${String(parseInt(key) + 1).padStart(3, '0')}`;
        
        // Create a flattened question with the correct structure
        const flatQuestion = {
          id: id,
          n: nestedQuestion.n || `B${parseInt(key) + 1}`,
          category: 'B', // Ensure category is B
          pattern: nestedQuestion.pattern || 'multiple-choice',
          qn: nestedQuestion.qn,
          a4: nestedQuestion.a4,
          an: nestedQuestion.an
        };
        
        flattenedBQuestions.push(flatQuestion);
      }
    }
  });
  
  // Check for existing B category questions to avoid duplicates
  const existingBIds = new Set(
    updatedExistingQuestions
      .filter(q => q.category === 'B')
      .map(q => q.id)
  );
  
  // Filter out questions that already exist
  const newBQuestions = flattenedBQuestions.filter(q => !existingBIds.has(q.id));
  
  console.log(`Found ${newBQuestions.length} new category B questions to add`);
  
  // Combine existing questions with new B questions
  const updatedQuestions = [...updatedExistingQuestions, ...newBQuestions];
  
  // Update pattern-questions.json
  const updatedPatternQuestionsData = { questions: updatedQuestions };
  fs.writeFileSync(patternQuestionsJsonPath, JSON.stringify(updatedPatternQuestionsData, null, 2));
  console.log(`Updated pattern-questions.json with ${newBQuestions.length} new Category B questions`);
  
  // 4. Clean up: Replace the original b-fixed-single-line.json with the corrected version
  fs.copyFileSync(outputFixedBJsonPath, bFixedSingleLinePath);
  console.log(`Replaced original b-fixed-single-line.json with corrected version`);
  
  console.log('\nAll Category B questions have been successfully fixed and integrated!');
  
} catch (error) {
  console.error('Error processing files:', error);
}

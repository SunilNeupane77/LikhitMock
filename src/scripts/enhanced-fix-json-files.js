// Enhanced script for fix with better diagnostics
const fs = require('fs');
const path = require('path');

// File paths
const patternQuestionsPath = path.resolve(__dirname, '..', 'data', 'pattern-questions.json');
const bJsonPath = path.resolve(__dirname, '..', 'data', 'b.json');
const outputPath = path.resolve(__dirname, '..', 'data', 'fixed-pattern-questions.json');

// Read the files
try {
  console.log('Starting JSON fix and integration process...');
  
  // Read pattern-questions.json
  console.log(`Reading pattern questions from ${patternQuestionsPath}`);
  const patternQuestionsRaw = fs.readFileSync(patternQuestionsPath, 'utf8');
  
  let patternQuestions;
  try {
    patternQuestions = JSON.parse(patternQuestionsRaw);
    console.log(`Successfully parsed pattern-questions.json with ${patternQuestions.questions.length} questions`);
  } catch (e) {
    console.error('Error parsing pattern-questions.json:', e.message);
    throw e;
  }
  
  // Read b.json
  console.log(`Reading questions from ${bJsonPath}`);
  const bJsonRaw = fs.readFileSync(bJsonPath, 'utf8');
  
  // Fix b.json structure (handle the double array brackets)
  const fixedBJsonRaw = bJsonRaw.replace('"questions": [[', '"questions": [');
  
  let bJsonData;
  try {
    bJsonData = JSON.parse(fixedBJsonRaw);
    console.log(`Successfully parsed b.json with ${bJsonData.questions.length} questions`);
  } catch (e) {
    console.error('Error parsing fixed b.json:', e.message);
    console.error('Trying alternative fix...');
    
    // Try to fix by removing the extra bracket at the end too
    const altFixedBJsonRaw = fixedBJsonRaw.replace(/\]\s*\]\s*}$/, ']}');
    try {
      bJsonData = JSON.parse(altFixedBJsonRaw);
      console.log(`Successfully parsed b.json with alternative fix: ${bJsonData.questions.length} questions`);
    } catch (e) {
      console.error('Alternative fix also failed:', e.message);
      throw e;
    }
  }
  
  // Count original categories
  let aCount = 0;
  let bCount = 0;
  bJsonData.questions.forEach(q => {
    if (q.category === 'A') aCount++;
    if (q.category === 'B') bCount++;
  });
  console.log(`B.json category counts - A: ${aCount}, B: ${bCount}`);
  
  // Update category from "A" to "B" in b.json
  const updatedBQuestions = bJsonData.questions.map(question => {
    if (question.category === 'A') {
      return { ...question, category: 'B' };
    }
    return question;
  });
  
  // Count updated categories
  aCount = 0;
  bCount = 0;
  updatedBQuestions.forEach(q => {
    if (q.category === 'A') aCount++;
    if (q.category === 'B') bCount++;
  });
  console.log(`After category update - A: ${aCount}, B: ${bCount}`);
  
  // Add pattern field to b.json questions if missing
  const updatedBQuestionsWithPattern = updatedBQuestions.map(question => {
    if (!question.pattern) {
      return { ...question, pattern: "multiple-choice" };
    }
    return question;
  });
  
  // Combine both question sets
  const combinedQuestions = [...patternQuestions.questions, ...updatedBQuestionsWithPattern];
  
  // Create the fixed output
  const fixedData = {
    questions: combinedQuestions
  };
  
  // Write the output to the new file
  fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2));
  
  console.log(`Successfully processed files and created ${outputPath}`);
  console.log(`Total questions in combined file: ${combinedQuestions.length}`);
  console.log(`  - From pattern-questions.json: ${patternQuestions.questions.length}`);
  console.log(`  - From b.json: ${updatedBQuestionsWithPattern.length}`);
  
  // Also create a copy to replace the original pattern-questions.json
  const finalOutputPath = path.resolve(__dirname, '..', 'data', 'pattern-questions.json');
  fs.writeFileSync(finalOutputPath, JSON.stringify(fixedData, null, 2));
  console.log(`Also updated the original pattern-questions.json file`);
  
} catch (error) {
  console.error('Error processing files:', error);
}

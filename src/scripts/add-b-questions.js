// Simple script to add B category questions to pattern-questions.json

const fs = require('fs');
const path = require('path');

// Define paths
const patternQuestionsPath = path.resolve(__dirname, '..', 'data', 'pattern-questions.json');

// Sample B category questions to add
const bCategoryQuestions = [
  {
    "id": "b001",
    "n": "B001",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "जेब्रा क्रसिङमा कसलाई पहिलो प्राथमिकता दिनुपर्छ ?",
    "a4": ["(क) पुरुषलाई", "(ख) महिलालाई", "(ग) गाई–वस्तुलाई", "(घ) पैदल यात्रुलाई"],
    "an": "(घ) पैदल यात्रुलाई"
  },
  {
    "id": "b002",
    "n": "B002",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "आफूभन्दा अगाडिको सवारीको गति कम हुँदै गएको कसरी थाहा हुन्छ ?",
    "a4": ["(क) ब्रेक लाइटबाट", "(ख) चालकको इशाराबाट", "(ग) साइलेन्सरको धूवाँ कम भएबाट", "(घ) कुनै पनि होइन"],
    "an": "(क) ब्रेक लाइटबाट"
  },
  {
    "id": "b003",
    "n": "B003",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "सडक पार गर्दा कसलाई प्राथमिकता दिनुपर्छ ?",
    "a4": ["(क) स्कूले विद्यार्थीलाई", "(ख) शारीरिक अपाङ्गता भएका व्यक्तिलाई", "(ग) ज्येष्ठ नागरिकलाई", "(घ) माथिका सबै"],
    "an": "(घ) माथिका सबै"
  },
  {
    "id": "b004",
    "n": "B004",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "सडकमा सवारी चलाउँदा कुन सवारीलाई पहिलो प्राथमिकता दिनुपर्छ ?",
    "a4": ["(क) शव वाहन", "(ख) दमकल", "(ग) एम्बुलेन्स", "(घ) माथिका सबै"],
    "an": "(घ) माथिका सबै"
  },
  {
    "id": "b005",
    "n": "B005",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "अगाडिको सवारी साधनलाई ओभरटेक गर्न के गर्नुपर्छ ?",
    "a4": ["(क) हेडलाइट बालेर", "(ख) हर्न बजाएर", "(ग) साइड लाइट बालेर", "(घ) माथिका सबै"],
    "an": "(घ) माथिका सबै"
  },
  {
    "id": "b006",
    "n": "B006",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "नेपालमा कुन साइडबाट सवारी चलाउनुपर्छ ?",
    "a4": ["(क) दायाँ साइडबाट", "(ख) बायाँ साइडबाट", "(ग) जुनसुकै साइडबाट", "(घ) कुनै पनि होइन"],
    "an": "(ख) बायाँ साइडबाट"
  },
  {
    "id": "b007",
    "n": "B007",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "कुन गतिमा तुलनात्मक रूपमा इन्धनको खपत कम हुन्छ ?",
    "a4": ["(क) न्यून गतिमा", "(ख) मध्यम गतिमा", "(ग) उच्च गतिमा", "(घ) न्यून र मध्यम गतिमा"],
    "an": "(ख) मध्यम गतिमा"
  },
  {
    "id": "b008",
    "n": "B008",
    "category": "B",
    "pattern": "true-false",
    "qn": "तपाईंको सवारीको पछाडि एम्बुलेन्स आएमा के गर्नुहुन्छ ?",
    "a4": ["(क) सवारी रोक्ने", "(ख) साइड दिने", "(ग) गति बढाउने", "(घ) ओभरटेक गर्ने"],
    "an": "(ख) साइड दिने"
  },
  {
    "id": "b009",
    "n": "B009",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "कस्तो सडकमा ब्रेक फेल हुँदा सबैभन्दा बढी खतरा हुन्छ ?",
    "a4": ["(क) उकालो सडकमा", "(ख) ओरालो सडकमा", "(ग) समथर सडकमा", "(घ) कच्ची सडकमा"],
    "an": "(ख) ओरालो सडकमा"
  },
  {
    "id": "b010",
    "n": "B010",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "कुन गतिमा सवारी चलाउँदा तुलनात्मक रूपमा इन्धनको खपत बढी हुन्छ ?",
    "a4": ["(क) न्यून गतिमा", "(ख) मध्यम गतिमा", "(ग) उच्च गतिमा", "(घ) माथिका सबै"],
    "an": "(ग) उच्च गतिमा"
  },
  {
    "id": "b011",
    "n": "B011",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "ओरालोमा झरिरहेको र उकालोमा चढिरहेको सवारीमध्ये कसले साइड दिनुपर्छ ?",
    "a4": ["(क) उकालो चढ्नेले", "(ख) ओरालो झर्नेले", "(ग) क र ख दुवैले", "(घ) कुनै पनि होइन"],
    "an": "(ख) ओरालो झर्नेले"
  },
  {
    "id": "b012",
    "n": "B012",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "घुमेर जाने र सिधा जाने सवारीमध्ये कुन सवारीले प्राथमिकता पाउँछ ?",
    "a4": ["(क) घुमेर जाने", "(ख) सिधा जाने", "(ग) दुवैले", "(घ) कुनै पनि होइन"],
    "an": "(ख) सिधा जाने"
  },
  {
    "id": "b013",
    "n": "B013",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "गियर किन परिवर्तन गर्नुपर्छ ?",
    "a4": ["(क) गति घटाउन", "(ख) गति बढाउन", "(ग) हर्न बजाउन", "(घ) गति घटाउन र बढाउन"],
    "an": "(घ) गति घटाउन र बढाउन"
  },
  {
    "id": "b014",
    "n": "B014",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "नेपालमा ढिलो गतिमा चल्ने सवारीलाई सडकको कुन साइडबाट चलाउनुपर्छ ?",
    "a4": ["(क) बीचबाट", "(ख) दायाँबाट", "(ग) बायाँबाट", "(घ) आफूलाई मन लागेको साइडबाट"],
    "an": "(ग) बायाँबाट"
  },
  {
    "id": "b015",
    "n": "B015",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "चार पाङ्ग्रे सवारीमा खुट्टाले के–के नियन्त्रण गर्छ ?",
    "a4": ["(क) क्लच", "(ख) ब्रेक", "(ग) एक्सिलेटर", "(घ) माथिका सबै"],
    "an": "(घ) माथिका सबै"
  },
  {
    "id": "b016",
    "n": "B016",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "उकालोमा चढ्ने र ओरालोमा झर्ने सवारीमध्ये कुनलाई प्राथमिकता दिनुपर्छ ?",
    "a4": ["(क) ओरालोमा झर्ने सवारीलाई", "(ख) उकालोमा चढ्ने सवारीलाई", "(ग) साइड दिनु पर्दैन", "(घ) जसले सक्यो उसैले अघि बढ्नुपर्छ"],
    "an": "(ख) उकालोमा चढ्ने सवारीलाई"
  },
  {
    "id": "b017",
    "n": "B017",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "कुन सवारी साधन सडकमा गुड्दैन ?",
    "a4": ["(क) पानीजहाज", "(ख) प्लेन", "(ग) हेलिकप्टर", "(घ) माथिका सबै"],
    "an": "(घ) माथिका सबै"
  },
  {
    "id": "b018",
    "n": "B018",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "चालकले आफूभन्दा अगाडिको सवारीको गति बढेको वा घटेको कसरी थाहा पाउनुपर्छ ?",
    "a4": ["(क) अगाडिको चालकलाई सोधेर", "(ख) चालकको इशाराबाट", "(ग) आफैंले अनुमान गरेर", "(घ) कुनै पनि होइन"],
    "an": "(ख) चालकको इशाराबाट"
  },
  {
    "id": "b019",
    "n": "B019",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "आयल प्रेसरले सवारीमा केको अवस्था देखाउँछ ?",
    "a4": ["(क) डिजेलको", "(ख) मोबिलको", "(ग) पानीको", "(घ) पेट्रोलको"],
    "an": "(ख) मोबिलको"
  },
  {
    "id": "b020",
    "n": "B020",
    "category": "B",
    "pattern": "multiple-choice",
    "qn": "सिटबेल्टको प्रयोग कहिले गर्नुपर्छ ?",
    "a4": ["(क) अगाडि बस्ने सबैले लगाउने", "(ख) ट्राफिक प्रहरीले देखेपछि लगाउने", "(ग) ओरालोमा लगाउने", "(घ) उकालोमा लगाउने"],
    "an": "(क) अगाडि बस्ने सबैले लगाउने"
  }
];

try {
  // Read pattern-questions.json file
  const patternQuestionsText = fs.readFileSync(patternQuestionsPath, 'utf8'); 
  const patternQuestionsData = JSON.parse(patternQuestionsText);
  
  console.log(`Found ${patternQuestionsData.questions.length} existing questions in pattern-questions.json`);
  
  // Check if each question already exists in pattern-questions.json by question text
  const existingQnTexts = patternQuestionsData.questions.map(q => q.qn);
  const newBQuestions = bCategoryQuestions.filter(q => !existingQnTexts.includes(q.qn));
  
  console.log(`Found ${newBQuestions.length} new B category questions to add`);
  
  // Add new questions to the pattern-questions.json data
  patternQuestionsData.questions = [...patternQuestionsData.questions, ...newBQuestions];
  
  // Write the updated data back to pattern-questions.json
  fs.writeFileSync(patternQuestionsPath, JSON.stringify(patternQuestionsData, null, 2));
  
  console.log(`Successfully added ${newBQuestions.length} questions to pattern-questions.json`);
  console.log(`Total questions in pattern-questions.json: ${patternQuestionsData.questions.length}`);
  
} catch (error) {
  console.error('Error processing files:', error);
}

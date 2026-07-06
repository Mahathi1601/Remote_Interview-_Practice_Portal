const { generateAIQuestions, evaluateAIResponse } = require('../utils/gemini');
require('dotenv').config({ path: './backend/.env' });

const testIntegration = async () => {
    try {
        console.log('--- Testing Question Generation ---');
        console.log('Generating 1 Easy Frontend Development question...');
        const questions = await generateAIQuestions('Frontend Development', 'Easy', 1);
        console.log('Successfully generated questions:');
        console.log(JSON.stringify(questions, null, 2));

        if (!questions || questions.length === 0) {
            throw new Error('No questions returned');
        }

        const sampleQuestion = questions[0];

        console.log('\n--- Testing Answer Evaluation ---');
        const sampleAnswer = 'JavaScript variables declared with var are function scoped, while let and const are block scoped. const variables cannot be reassigned.';
        console.log(`Candidate's Answer: "${sampleAnswer}"`);
        console.log('Sending to Gemini for evaluation...');
        
        const evaluation = await evaluateAIResponse(sampleQuestion, sampleAnswer, 'Easy');
        console.log('Successfully graded answer:');
        console.log(JSON.stringify(evaluation, null, 2));

        console.log('\n✅ All Gemini API integration tests passed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Gemini API Integration test failed:', error.message);
        process.exit(1);
    }
};

testIntegration();

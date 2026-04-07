const mongoose = require('mongoose');
require('dotenv').config();
const PracticeQuestion = require('./models/PracticeQuestion');

const questions = [
    // Technical Questions
    {
        question: "What is the difference between let, const, and var in JavaScript?",
        type: "technical",
        difficulty: "beginner",
        sampleAnswer: "var is function-scoped, can be redeclared and updated. let is block-scoped, can be updated but not redeclared. const is block-scoped, cannot be updated or redeclared.",
        tips: ["Explain hoisting", "Discuss temporal dead zone", "Give examples of each"],
        tags: ["JavaScript", "Programming"]
    },
    {
        question: "Explain the concept of REST APIs and their HTTP methods.",
        type: "technical",
        difficulty: "intermediate",
        sampleAnswer: "REST API is an architectural style for building web services. HTTP methods include GET (retrieve data), POST (create data), PUT/PATCH (update data), DELETE (remove data).",
        tips: ["Mention statelessness", "Discuss status codes", "Give real-world examples"],
        tags: ["API", "Backend"]
    },
    {
        question: "What is the difference between SQL and NoSQL databases?",
        type: "technical",
        difficulty: "intermediate",
        sampleAnswer: "SQL databases are relational with predefined schemas, use tables. NoSQL databases are non-relational with dynamic schemas, use collections/documents.",
        tips: ["Give examples of each (MySQL vs MongoDB)", "Discuss use cases", "Explain ACID vs BASE"],
        tags: ["Database", "SQL", "NoSQL"]
    },
    {
        question: "What is React's Virtual DOM and how does it work?",
        type: "technical",
        difficulty: "advanced",
        sampleAnswer: "Virtual DOM is a lightweight copy of the actual DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous one (diffing), and updates only changed elements in the real DOM.",
        tips: ["Explain reconciliation", "Discuss performance benefits", "Mention key prop importance"],
        tags: ["React", "Frontend"]
    },
    {
        question: "What is the difference between authentication and authorization?",
        type: "technical",
        difficulty: "beginner",
        sampleAnswer: "Authentication verifies who you are (login). Authorization determines what you can access (permissions).",
        tips: ["Give examples: ID card vs room key", "Discuss JWT", "Mention OAuth"],
        tags: ["Security", "Authentication"]
    },

    // Behavioral Questions
    {
        question: "Tell me about a time you faced a conflict in your team and how you resolved it.",
        type: "behavioral",
        difficulty: "intermediate",
        sampleAnswer: "In my previous role, two team members disagreed on the technical approach. I organized a meeting where both presented their ideas, facilitated discussion, and we voted on the best solution that combined both approaches.",
        tips: ["Use STAR method (Situation, Task, Action, Result)", "Focus on positive outcomes", "Show leadership skills"],
        tags: ["Teamwork", "Conflict Resolution"]
    },
    {
        question: "Describe a situation where you had to learn a new technology quickly.",
        type: "behavioral",
        difficulty: "beginner",
        sampleAnswer: "I had to learn React in 2 weeks for a project. I took online courses, built small projects, and asked senior developers for guidance. I successfully delivered the project on time.",
        tips: ["Show initiative", "Mention learning resources", "Demonstrate quick learning ability"],
        tags: ["Learning", "Adaptability"]
    },
    {
        question: "Tell me about a time you made a mistake at work. How did you handle it?",
        type: "behavioral",
        difficulty: "intermediate",
        sampleAnswer: "I accidentally deleted production data. I immediately informed my manager, restored from backup, and implemented preventive measures. Now I always double-check before running delete commands.",
        tips: ["Be honest", "Focus on solution", "Show what you learned"],
        tags: ["Accountability", "Problem Solving"]
    },

    // HR Questions
    {
        question: "Why do you want to work for our company?",
        type: "hr",
        difficulty: "beginner",
        sampleAnswer: "I admire your company's innovation in AI and your culture of continuous learning. I want to contribute to projects that impact millions of users while growing my skills.",
        tips: ["Research the company", "Connect your goals with company mission", "Be specific"],
        tags: ["Motivation", "Career Goals"]
    },
    {
        question: "What are your salary expectations?",
        type: "hr",
        difficulty: "intermediate",
        sampleAnswer: "Based on market research and my experience level, I'm looking for a range between $80,000-$95,000. I'm flexible based on the total compensation package including benefits.",
        tips: ["Research market rates", "Give a range not fixed number", "Consider total package"],
        tags: ["Negotiation", "Compensation"]
    },
    {
        question: "Where do you see yourself in 5 years?",
        type: "hr",
        difficulty: "beginner",
        sampleAnswer: "I see myself growing into a senior technical role, mentoring junior developers, and contributing to architectural decisions while staying hands-on with coding.",
        tips: ["Show ambition", "Align with company growth", "Be realistic"],
        tags: ["Career Planning", "Growth"]
    },

    // System Design Questions
    {
        question: "How would you design a URL shortening service like TinyURL?",
        type: "system-design",
        difficulty: "advanced",
        sampleAnswer: "Use a database to store mappings, generate unique short codes with Base62 encoding, implement redirects with 301/302 status codes, add caching with Redis, and use load balancers for scale.",
        tips: ["Discuss scalability", "Mention database choices", "Talk about API design"],
        tags: ["System Design", "Scalability"]
    },
    {
        question: "Design a chat messaging system like WhatsApp.",
        type: "system-design",
        difficulty: "advanced",
        sampleAnswer: "Use WebSockets for real-time communication, message queues for delivery, databases for storage (SQL for users, NoSQL for messages), and CDN for media files.",
        tips: ["Discuss offline messages", "Mention delivery status", "Talk about scalability"],
        tags: ["System Design", "Real-time"]
    }
];

async function seedQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Clear existing questions
        await PracticeQuestion.deleteMany({});
        console.log('Cleared existing questions');
        
        // Insert new questions
        const result = await PracticeQuestion.insertMany(questions);
        console.log(`✅ Added ${result.length} questions to database!`);
        
        console.log('\n📊 Questions by type:');
        const technical = questions.filter(q => q.type === 'technical').length;
        const behavioral = questions.filter(q => q.type === 'behavioral').length;
        const hr = questions.filter(q => q.type === 'hr').length;
        const systemDesign = questions.filter(q => q.type === 'system-design').length;
        
        console.log(`- Technical: ${technical}`);
        console.log(`- Behavioral: ${behavioral}`);
        console.log(`- HR: ${hr}`);
        console.log(`- System Design: ${systemDesign}`);
        
        await mongoose.disconnect();
        console.log('\n✅ Done! You can now use these questions in your app.');
    } catch (error) {
        console.error('Error:', error);
    }
}

seedQuestions();
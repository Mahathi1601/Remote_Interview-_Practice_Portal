const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Question = require('../models/Question');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const categories = [
    { name: 'Technical', description: 'Coding, system design, and computer science fundamentals' },
    { name: 'HR', description: 'Behavioral and cultural questions' },
    { name: 'Aptitude', description: 'Logical reasoning and quantitative analysis' }
];

const questionsData = [
    // --- EASY (Technical) ---
    { 
        questionText: "What is HTML?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.", 
        keywords: ["markup", "browser", "HyperText", "language"], 
        tips: ["Mention it's for structure", "Not a programming language"] 
    },
    { 
        questionText: "What is CSS?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "CSS (Cascading Style Sheets) is used for styling and layout of web pages, including design, colors, and fonts.", 
        keywords: ["style", "Cascading", "layout", "design"], 
        tips: ["Mention it separates style from content"] 
    },
    { 
        questionText: "What is JavaScript?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "JavaScript is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. It is most well known as the scripting language for Web pages.", 
        keywords: ["scripting", "programming", "dynamic", "language"], 
        tips: ["Mention it runs in browsers"] 
    },
    { 
        questionText: "Difference between HTTP and HTTPS?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "HTTP is not encrypted and is vulnerable to attackers. HTTPS is encrypted using SSL/TLS to protect sensitive information.", 
        keywords: ["security", "SSL", "TLS", "encrypted"], 
        tips: ["Focus on security/port 443"] 
    },
    
    // --- EASY (HR) ---
    { 
        questionText: "Tell me about yourself", 
        categoryName: "HR", 
        difficulty: "Easy", 
        timeLimit: 120, 
        idealAnswer: "Focus on your professional background, key achievements, and current career goals.", 
        keywords: ["background", "experience", "achievements", "goals"], 
        tips: ["Keep it under 2 minutes", "Be professional"] 
    },
    { 
        questionText: "What are your strengths?", 
        categoryName: "HR", 
        difficulty: "Easy", 
        timeLimit: 120, 
        idealAnswer: "Identify 2-3 strengths that are relevant to the role, such as teamwork, technical skills, or communication.", 
        keywords: ["strengths", "teamwork", "skills"], 
        tips: ["Provide examples for each strength"] 
    },
    { 
        questionText: "Why do you want this job?", 
        categoryName: "HR", 
        difficulty: "Easy", 
        timeLimit: 120, 
        idealAnswer: "Mention how the company alignment fits your career path and how your skills can add value.", 
        keywords: ["company", "alignment", "value", "growth"], 
        tips: ["Show you've researched the company"] 
    },
    
    // --- EASY (Aptitude) ---
    { 
        questionText: "Train speed 60 km/h to m/s?", 
        categoryName: "Aptitude", 
        difficulty: "Easy", 
        timeLimit: 60, 
        idealAnswer: "60 * (5/18) = 16.67 m/s.", 
        keywords: ["16.67", "calculation", "unit"], 
        tips: ["Multiply by 5/18 or divide by 3.6"] 
    },
    { 
        questionText: "20% of 500?", 
        categoryName: "Aptitude", 
        difficulty: "Easy", 
        timeLimit: 60, 
        idealAnswer: "0.20 * 500 = 100.", 
        keywords: ["100"], 
        tips: ["Quick mental math tip: 10% is 50, so 20% is 100"] 
    },
    { 
        questionText: "Average of 10, 20, 30?", 
        categoryName: "Aptitude", 
        difficulty: "Easy", 
        timeLimit: 60, 
        idealAnswer: "(10 + 20 + 30) / 3 = 20.", 
        keywords: ["20"], 
        tips: ["Sum divided by count"] 
    },

    // --- MEDIUM (Technical) ---
    { 
        questionText: "Explain CSS Flexbox", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Flexbox is a one-dimensional layout method for arranging items in rows or columns.", 
        keywords: ["layout", "items", "container", "axis"], 
        tips: ["Mention justify-content and align-items"] 
    },
    { 
        questionText: "What is DOM manipulation?", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "The DOM represents the page as a tree. Manipulation allows JS to change page content, style, and structure.", 
        keywords: ["DOM", "tree", "dynamic", "javascript"], 
        tips: ["Mention getElementById"] 
    },
    { 
        questionText: "Explain callbacks in JavaScript", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "A callback function is a function passed into another function as an argument, which is then invoked inside the outer function.", 
        keywords: ["asynchronous", "function", "argument", "passed"], 
        tips: ["Mention async operations"] 
    },
    { 
        questionText: "What is responsive design?", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Responsive design is an approach where a site is designed to provide an optimal viewing experience across a wide range of devices.", 
        keywords: ["viewport", "media queries", "mobile", "desktop"], 
        tips: ["Mention media queries"] 
    },

    // --- MEDIUM (HR) ---
    { 
        questionText: "Describe a team conflict and resolution", 
        categoryName: "HR", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Use the STAR method (Situation, Task, Action, Result) to describe how you professionally resolved a disagreement.", 
        keywords: ["STAR", "resolution", "professional", "conflict"], 
        tips: ["Focus on the positive outcome"] 
    },
    { 
        questionText: "How do you handle criticism?", 
        categoryName: "HR", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Explain that you view criticism as an opportunity for growth and professional development.", 
        keywords: ["growth", "learning", "professional", "feedback"], 
        tips: ["Show you are coachable"] 
    },
    { 
        questionText: "Where do you see yourself in 5 years?", 
        categoryName: "HR", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Focus on how the role and company help you grow towards your long-term career goals.", 
        keywords: ["growth", "career", "development", "contribution"], 
        tips: ["Be ambitious but realistic"] 
    },

    // --- MEDIUM (Aptitude) ---
    { 
        questionText: "Compound interest calculation", 
        categoryName: "Aptitude", 
        difficulty: "Medium", 
        timeLimit: 90, 
        idealAnswer: "A = P(1 + r/n)^(nt).", 
        keywords: ["formula", "interest", "principal"], 
        tips: ["Understand the components of the formula"] 
    },
    { 
        questionText: "Ratio and proportion problem", 
        categoryName: "Aptitude", 
        difficulty: "Medium", 
        timeLimit: 90, 
        idealAnswer: "Understand direct and inverse proportions.", 
        keywords: ["ratio", "proportion", "direct", "inverse"], 
        tips: ["Practice with cross-multiplication"] 
    },
    { 
        questionText: "Work and time problem", 
        categoryName: "Aptitude", 
        difficulty: "Medium", 
        timeLimit: 90, 
        idealAnswer: "Work = Rate * Time. Sum of rates for multiple workers.", 
        keywords: ["rate", "time", "work"], 
        tips: ["Convert to work done per unit time"] 
    },

    // --- HARD (Technical) ---
    { 
        questionText: "Explain JavaScript Event Loop", 
        categoryName: "Technical", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "The Event Loop constantly checks the call stack and moves tasks from the callback queue to the stack when it's empty.", 
        keywords: ["stack", "queue", "loop", "single-threaded"], 
        tips: ["Mention macro and micro tasks"] 
    },
    { 
        questionText: "What is closure in JavaScript?", 
        categoryName: "Technical", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).", 
        keywords: ["lexical", "scope", "state", "private"], 
        tips: ["Explain it allows private variables"] 
    },
    { 
        questionText: "How to optimize React performance?", 
        categoryName: "Technical", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Use React.memo, useMemo, useCallback, code splitting, and windowing.", 
        keywords: ["memoization", "splitting", "rendering", "hooks"], 
        tips: ["Focus on avoiding unnecessary re-renders"] 
    },
    { 
        questionText: "System design: URL shortener", 
        categoryName: "Technical", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Discuss database choice (NoSQL), hashing algorithms (Base62), and scalability (caching, load balancing).", 
        keywords: ["scalable", "NoSQL", "hashing", "Base62"], 
        tips: ["Mention Read vs Write scalability"] 
    },

    // --- HARD (HR) ---
    { 
        questionText: "Tell me about a major failure and learning", 
        categoryName: "HR", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Be honest about a mistake, take responsibility, and emphasize the positive steps you took to learn from it.", 
        keywords: ["failure", "learning", "responsibility", "improvement"], 
        tips: ["Don't blame others"] 
    },
    { 
        questionText: "How would you handle a toxic team member?", 
        categoryName: "HR", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Focus on communication, setting boundaries, and involving management if necessary, while maintaining productivity.", 
        keywords: ["communication", "professionalism", "management"], 
        tips: ["Show you can handle difficult team dynamics"] 
    },
    { 
        questionText: "Strategic career planning question", 
        categoryName: "HR", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Discuss how you align your skills with industry trends and business needs.", 
        keywords: ["strategy", "alignment", "trends", "growth"], 
        tips: ["Show forward-thinking"] 
    },

    // --- HARD (Aptitude) ---
    { 
        questionText: "Probability complex problem", 
        categoryName: "Aptitude", 
        difficulty: "Hard", 
        timeLimit: 120, 
        idealAnswer: "Consider conditional probability and Bayes' Theorem.", 
        keywords: ["probability", "conditional", "Bayes"], 
        tips: ["Break down into simpler independent events"] 
    },
    { 
        questionText: "Profit loss tricky question", 
        categoryName: "Aptitude", 
        difficulty: "Hard", 
        timeLimit: 120, 
        idealAnswer: "Calculate effective ROI considering multiple factors.", 
        keywords: ["profit", "loss", "percentage", "margin"], 
        tips: ["Be careful with sequential percentages"] 
    },
    { 
        questionText: "Train and platform length problem", 
        categoryName: "Aptitude", 
        difficulty: "Hard", 
        timeLimit: 120, 
        idealAnswer: "Speed = (Train Length + Platform Length) / Time.", 
        keywords: ["train", "platform", "speed", "length"], 
        tips: ["Relative speed if two trains are involved"] 
    },

    // --- ADDITIONAL QUESTIONS TO REACH 10+ PER CATEGORY ---

    // --- TECHNICAL - ADDITIONAL ---
    { 
        questionText: "What are Promises in JavaScript?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "A Promise is an object that may produce a single value some time in the future (resolution or rejection), and notifies whoever is interested when it does.", 
        keywords: ["async", "resolve", "reject", "then"], 
        tips: ["Mention .then() and .catch()"] 
    },
    { 
        questionText: "Difference between var, let, and const", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "var is function-scoped, let and const are block-scoped. const cannot be reassigned.", 
        keywords: ["scope", "hoisting", "reassignment"], 
        tips: ["Mention hoisting behavior"] 
    },
    { 
        questionText: "What is the JSON format?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate.", 
        keywords: ["data", "format", "lightweight", "text"], 
        tips: ["Mention key-value pairs"] 
    },
    { 
        questionText: "What is Git?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "Git is a distributed version control system that allows tracking changes in code and collaborating with other developers.", 
        keywords: ["version", "control", "commit", "repository"], 
        tips: ["Mention branches and merging"] 
    },
    { 
        questionText: "What is an API?", 
        categoryName: "Technical", 
        difficulty: "Easy", 
        timeLimit: 90, 
        idealAnswer: "An API (Application Programming Interface) is a set of rules allowing different software to communicate and exchange data.", 
        keywords: ["interface", "request", "response", "endpoint"], 
        tips: ["Mention REST and HTTP methods"] 
    },
    { 
        questionText: "Explain async/await", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "async/await is syntactic sugar for Promises that makes asynchronous code look synchronous and is easier to read.", 
        keywords: ["asynchronous", "syntactic sugar", "promise", "await"], 
        tips: ["Mention error handling with try-catch"] 
    },
    { 
        questionText: "What is SQL?", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "SQL (Structured Query Language) is used to communicate with databases to create, retrieve, update, and delete data.", 
        keywords: ["database", "query", "select", "insert"], 
        tips: ["Mention JOIN operations"] 
    },
    { 
        questionText: "Explain Git branching strategy", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Popular strategies include Git Flow and GitHub Flow, which define how branches are created, managed, and merged.", 
        keywords: ["branching", "merge", "workflow", "collaboration"], 
        tips: ["Mention develop and feature branches"] 
    },
    { 
        questionText: "What is REST API?", 
        categoryName: "Technical", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "REST (Representational State Transfer) is an architectural style using HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources.", 
        keywords: ["stateless", "resources", "HTTP", "endpoints"], 
        tips: ["Mention status codes"] 
    },
    { 
        questionText: "Explain Microservices architecture", 
        categoryName: "Technical", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Microservices is an architecture where an application is built as a collection of small, independent services that communicate via APIs.", 
        keywords: ["scalable", "independent", "API", "distributed"], 
        tips: ["Discuss advantages and challenges"] 
    },
    { 
        questionText: "What is CI/CD?", 
        categoryName: "Technical", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "CI/CD (Continuous Integration/Continuous Deployment) automates testing and deployment of code changes to production.", 
        keywords: ["automation", "testing", "deployment", "pipeline"], 
        tips: ["Mention tools like Jenkins, GitHub Actions"] 
    },
    { 
        questionText: "Database indexing and optimization", 
        categoryName: "Technical", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Indexes speed up queries by creating pointers to data. Use primary, foreign, and composite indexes strategically.", 
        keywords: ["index", "query", "performance", "optimization"], 
        tips: ["Discuss trade-offs between read and write"] 
    },

    // --- HR - ADDITIONAL ---
    { 
        questionText: "What are your weaknesses?", 
        categoryName: "HR", 
        difficulty: "Easy", 
        timeLimit: 120, 
        idealAnswer: "Mention genuine weaknesses and how you are actively working to improve them.", 
        keywords: ["improvement", "learning", "growth"], 
        tips: ["Avoid fictional weaknesses"] 
    },
    { 
        questionText: "How do you stay motivated?", 
        categoryName: "HR", 
        difficulty: "Easy", 
        timeLimit: 120, 
        idealAnswer: "Discuss intrinsic and extrinsic motivations, goal-setting, and how you maintain enthusiasm in your role.", 
        keywords: ["motivation", "goals", "enthusiasm"], 
        tips: ["Be genuine and specific"] 
    },
    { 
        questionText: "What is your ideal work environment?", 
        categoryName: "HR", 
        difficulty: "Easy", 
        timeLimit: 120, 
        idealAnswer: "Describe an environment that aligns with the company culture while showing adaptability.", 
        keywords: ["culture", "environment", "flexibility"], 
        tips: ["Research company values"] 
    },
    { 
        questionText: "Why are you leaving your current job?", 
        categoryName: "HR", 
        difficulty: "Easy", 
        timeLimit: 120, 
        idealAnswer: "Focus on career growth and new opportunities rather than criticizing your current employer.", 
        keywords: ["growth", "opportunity", "positive"], 
        tips: ["Keep it professional"] 
    },
    { 
        questionText: "Describe your leadership style", 
        categoryName: "HR", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Discuss a leadership approach with examples of how you motivate teams and handle challenges.", 
        keywords: ["leadership", "team", "motivation", "vision"], 
        tips: ["Provide specific examples"] 
    },
    { 
        questionText: "How do you prioritize tasks?", 
        categoryName: "HR", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Explain your methodology for task prioritization using frameworks like Eisenhower Matrix.", 
        keywords: ["prioritization", "urgency", "importance", "planning"], 
        tips: ["Mention tools you use"] 
    },
    { 
        questionText: "Give an example of problem-solving", 
        categoryName: "HR", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Use the STAR method to describe a complex problem you solved with a positive outcome.", 
        keywords: ["STAR", "analytical", "solution", "result"], 
        tips: ["Quantify results if possible"] 
    },
    { 
        questionText: "How do you handle deadline pressure?", 
        categoryName: "HR", 
        difficulty: "Medium", 
        timeLimit: 120, 
        idealAnswer: "Explain your strategies for managing stress, planning, and delivering quality work under pressure.", 
        keywords: ["pressure", "planning", "quality", "time"], 
        tips: ["Show you can remain calm"] 
    },
    { 
        questionText: "Describe a time you failed and learned", 
        categoryName: "HR", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Share a specific failure, the lessons learned, and how you applied those lessons in future situations.", 
        keywords: ["failure", "learning", "application", "growth"], 
        tips: ["Focus on the learning outcome"] 
    },
    { 
        questionText: "How do you manage difficult stakeholders?", 
        categoryName: "HR", 
        difficulty: "Hard", 
        timeLimit: 150, 
        idealAnswer: "Demonstrate diplomacy, patience, and communication skills while maintaining professionalism and results.", 
        keywords: ["communication", "diplomacy", "stakeholder", "management"], 
        tips: ["Show emotional intelligence"] 
    },

    // --- APTITUDE - ADDITIONAL ---
    { 
        questionText: "What is simple interest?", 
        categoryName: "Aptitude", 
        difficulty: "Easy", 
        timeLimit: 60, 
        idealAnswer: "SI = (Principal × Rate × Time) / 100.", 
        keywords: ["principal", "rate", "time"], 
        tips: ["Direct calculation without compounding"] 
    },
    { 
        questionText: "Find the LCM of 12 and 18", 
        categoryName: "Aptitude", 
        difficulty: "Easy", 
        timeLimit: 60, 
        idealAnswer: "LCM(12, 18) = 36.", 
        keywords: ["LCM", "multiple", "36"], 
        tips: ["Find common multiples"] 
    },
    { 
        questionText: "What is the GCD of 24 and 36?", 
        categoryName: "Aptitude", 
        difficulty: "Easy", 
        timeLimit: 60, 
        idealAnswer: "GCD(24, 36) = 12.", 
        keywords: ["GCD", "divisor", "12"], 
        tips: ["Find common divisors"] 
    },
    { 
        questionText: "30% of 200 = ?", 
        categoryName: "Aptitude", 
        difficulty: "Easy", 
        timeLimit: 60, 
        idealAnswer: "0.30 × 200 = 60.", 
        keywords: ["60", "percentage"], 
        tips: ["Multiply and divide by 100"] 
    },
    { 
        questionText: "Simple percentage increase problem", 
        categoryName: "Aptitude", 
        difficulty: "Medium", 
        timeLimit: 90, 
        idealAnswer: "Use the formula: New Value = Original × (1 + Percentage/100).", 
        keywords: ["percentage", "increase", "formula"], 
        tips: ["Calculate step by step"] 
    },
    { 
        questionText: "Age-related logic puzzle", 
        categoryName: "Aptitude", 
        difficulty: "Medium", 
        timeLimit: 90, 
        idealAnswer: "Set up equations based on age relationships and solve simultaneously.", 
        keywords: ["age", "equation", "relationship"], 
        tips: ["Use variables for unknown ages"] 
    },
    { 
        questionText: "Distance-speed-time relationship", 
        categoryName: "Aptitude", 
        difficulty: "Medium", 
        timeLimit: 90, 
        idealAnswer: "Distance = Speed × Time. Conversely, Speed = Distance/Time.", 
        keywords: ["speed", "distance", "time"], 
        tips: ["Check units consistency"] 
    },
    { 
        questionText: "Permutation and Combination basic", 
        categoryName: "Aptitude", 
        difficulty: "Medium", 
        timeLimit: 90, 
        idealAnswer: "Permutation (P) = n! / (n-r)!. Combination (C) = n! / (r!(n-r)!).", 
        keywords: ["permutation", "combination", "factorial"], 
        tips: ["Remember P for position, C for choice"] 
    },
    { 
        questionText: "Data interpretation from table", 
        categoryName: "Aptitude", 
        difficulty: "Hard", 
        timeLimit: 120, 
        idealAnswer: "Analyze table data to find patterns, totals, and answer specific questions.", 
        keywords: ["data", "analysis", "table", "interpretation"], 
        tips: ["Read carefully before calculating"] 
    },
    { 
        questionText: "Blood relation puzzle", 
        categoryName: "Aptitude", 
        difficulty: "Hard", 
        timeLimit: 120, 
        idealAnswer: "Trace relationships through family tree to identify connections.", 
        keywords: ["relation", "family", "logic"], 
        tips: ["Draw a family tree if needed"] 
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB for seeding...');

        // Clear existing data
        await Category.deleteMany({});
        await Question.deleteMany({});

        // Seed Categories
        const createdCategories = await Category.insertMany(categories);
        console.log('✅ Categories seeded');

        // Map Category Name to ID
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Map Questions and Insert
        const questionsToInsert = questionsData.map(q => ({
            ...q,
            categoryId: categoryMap[q.categoryName]
        }));

        await Question.insertMany(questionsToInsert);
        console.log(`✅ ${questionsToInsert.length} Questions seeded`);

        process.exit(0);
    } catch (err) {
        console.error('❌ SEED ERROR:', err);
        process.exit(1);
    }
};

seedDB();

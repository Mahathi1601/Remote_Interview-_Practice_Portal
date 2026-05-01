const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Question = require('./models/Question');

const seedPracticeQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview-portal');
        console.log('✓ Connected to MongoDB');

        // Get all categories or create default ones
        let categories = await Category.find();
        if (categories.length === 0) {
            categories = await Category.insertMany([
                { name: 'Technical', description: 'Programming, data structures, algorithms and web technologies' },
                { name: 'HR', description: 'Human resources, company culture, salary and career goals' },
                { name: 'Behavioral', description: 'Teamwork, leadership, conflict resolution and situational questions' },
                { name: 'System Design', description: 'Architecture, scalability, databases and distributed systems' }
            ]);
            console.log(`✓ Created ${categories.length} categories`);
        }

        const technicalCategory = categories.find(c => c.name === 'Technical');
        
        // Easy Level Questions (10)
        const easyQuestions = [
            {
                questionText: 'What is the difference between let, const, and var in JavaScript?',
                difficulty: 'Easy',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'var is function-scoped and can be redeclared. let is block-scoped and can be updated. const is block-scoped and cannot be reassigned. Hoisting behavior differs for each.',
                keywords: ['scope', 'hoisting', 'block', 'function', 'variable'],
                tips: ['Explain hoisting behavior', 'Discuss temporal dead zone for let/const']
            },
            {
                questionText: 'Explain the difference between == and === in JavaScript.',
                difficulty: 'Easy',
                timeLimit: 60,
                categoryId: technicalCategory._id,
                idealAnswer: '== checks value with type coercion, so 1 == "1" is true. === checks both value AND type without coercion, so 1 === "1" is false.',
                keywords: ['equality', 'type coercion', 'strict equality', 'comparison'],
                tips: ['Give a comparison example with numbers and strings', 'Mention why === is preferred']
            },
            {
                questionText: 'What is REST API and what are its HTTP methods?',
                difficulty: 'Easy',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'REST is an architectural style for networked applications. GET retrieves data, POST creates new data, PUT/PATCH updates existing data, DELETE removes data. REST is stateless.',
                keywords: ['GET', 'POST', 'PUT', 'DELETE', 'stateless', 'HTTP'],
                tips: ['Mention status codes', 'Discuss idempotency of GET vs POST']
            },
            {
                questionText: 'What is Big O notation?',
                difficulty: 'Easy',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'Big O notation describes algorithm time/space complexity in the worst case. O(1) constant, O(n) linear, O(n²) quadratic, O(log n) logarithmic.',
                keywords: ['complexity', 'O(1)', 'O(n)', 'O(n²)', 'O(log n)', 'algorithm'],
                tips: ['Give examples with loops', 'Explain why worst case matters']
            },
            {
                questionText: 'What is the difference between authentication and authorization?',
                difficulty: 'Easy',
                timeLimit: 60,
                categoryId: technicalCategory._id,
                idealAnswer: 'Authentication verifies identity (who you are) typically with passwords/tokens. Authorization determines permissions (what you can do) based on roles/policies.',
                keywords: ['identity', 'permissions', 'JWT', 'OAuth', 'security'],
                tips: ['Give real-world examples', 'Mention JWT tokens']
            },
            {
                questionText: 'What is a function in programming?',
                difficulty: 'Easy',
                timeLimit: 60,
                categoryId: technicalCategory._id,
                idealAnswer: 'A function is a reusable block of code that performs a specific task. It takes inputs (parameters), processes them, and returns outputs.',
                keywords: ['function', 'parameter', 'return', 'reusable', 'code block'],
                tips: ['Mention parameters and return values', 'Discuss DRY principle']
            },
            {
                questionText: 'Explain how arrays work in programming.',
                difficulty: 'Easy',
                timeLimit: 75,
                categoryId: technicalCategory._id,
                idealAnswer: 'Arrays are data structures that store multiple values in a single variable. Elements are accessed by index starting from 0. Arrays have methods like push, pop, map, filter.',
                keywords: ['array', 'index', 'element', 'push', 'pop', 'map'],
                tips: ['Mention zero-based indexing', 'Discuss common array methods']
            },
            {
                questionText: 'What is a loop and why is it useful?',
                difficulty: 'Easy',
                timeLimit: 75,
                categoryId: technicalCategory._id,
                idealAnswer: 'A loop is a programming structure that repeats a code block. Types include for, while, do-while. Loops are useful for iterating over data without code repetition.',
                keywords: ['loop', 'for', 'while', 'iteration', 'repeat'],
                tips: ['Compare for, while, and do-while loops', 'Mention loop control (break, continue)']
            },
            {
                questionText: 'What is HTML and what is it used for?',
                difficulty: 'Easy',
                timeLimit: 60,
                categoryId: technicalCategory._id,
                idealAnswer: 'HTML (HyperText Markup Language) is used to structure content on web pages. It uses tags to define elements like headings, paragraphs, links, and images.',
                keywords: ['HTML', 'structure', 'tags', 'markup', 'elements'],
                tips: ['Mention semantic HTML', 'Discuss HTML5']
            },
            {
                questionText: 'What is CSS and what is it used for?',
                difficulty: 'Easy',
                timeLimit: 60,
                categoryId: technicalCategory._id,
                idealAnswer: 'CSS (Cascading Style Sheets) is used to style HTML elements. It controls colors, layout, fonts, spacing, and responsive design using selectors and properties.',
                keywords: ['CSS', 'style', 'selectors', 'properties', 'responsive'],
                tips: ['Mention CSS box model', 'Discuss media queries for responsive design']
            }
        ];

        // Medium Level Questions (10)
        const mediumQuestions = [
            {
                questionText: 'What is a closure in JavaScript?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'A closure is a function that remembers its lexical scope even when executed outside that scope. Inner functions have access to outer function variables.',
                keywords: ['closure', 'lexical scope', 'function', 'inner function', 'scope chain'],
                tips: ['Give a practical example', 'Mention use cases like data privacy and module pattern']
            },
            {
                questionText: 'What are promises in JavaScript and how do they work?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'Promises represent eventual completion or failure of async operations. They have three states: pending, fulfilled, rejected. Methods: .then(), .catch(), .finally(). They avoid callback hell.',
                keywords: ['promise', 'async', 'then', 'catch', 'callback'],
                tips: ['Explain the three states', 'Compare with async/await']
            },
            {
                questionText: 'What is the Virtual DOM in React?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'Virtual DOM is a lightweight JavaScript copy of the real DOM. React uses it to calculate differences (diffing) and only updates changed elements in the real DOM.',
                keywords: ['virtual DOM', 'React', 'diffing', 'reconciliation', 'performance'],
                tips: ['Explain reconciliation algorithm', 'Mention the key prop']
            },
            {
                questionText: 'Explain SQL vs NoSQL databases.',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'SQL databases are relational with fixed schemas (MySQL, PostgreSQL). NoSQL are non-relational with flexible schemas (MongoDB, Redis) suited for unstructured data and high scalability.',
                keywords: ['SQL', 'NoSQL', 'relational', 'schema', 'document', 'scalability'],
                tips: ['Give examples for each type', 'Discuss ACID vs BASE properties']
            },
            {
                questionText: 'What is a binary search and when is it useful?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'Binary search is an efficient algorithm that works on sorted data by repeatedly dividing the search space in half. Time complexity O(log n). Faster than linear search O(n).',
                keywords: ['binary search', 'sorted', 'divide and conquer', 'O(log n)', 'algorithm'],
                tips: ['Explain how it narrows down possibilities', 'Discuss prerequisites for binary search']
            },
            {
                questionText: 'What are HTTP status codes and their meanings?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: '2xx success (200 OK, 201 Created), 3xx redirection (301 Moved, 304 Not Modified), 4xx client errors (400 Bad Request, 404 Not Found), 5xx server errors (500 Server Error).',
                keywords: ['HTTP', 'status code', '200', '404', '500', 'response'],
                tips: ['Categorize by number range', 'Mention common codes in your experience']
            },
            {
                questionText: 'What is the difference between synchronous and asynchronous code?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'Synchronous code executes line by line, blocking until each operation completes. Asynchronous code starts operations but doesn\'t wait, continuing with other tasks. Callbacks/promises handle results.',
                keywords: ['synchronous', 'asynchronous', 'blocking', 'callback', 'non-blocking'],
                tips: ['Give examples with setTimeout', 'Mention async/await']
            },
            {
                questionText: 'What are React hooks and how do you use them?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'Hooks allow using state and React features in functional components. useState for state, useEffect for side effects, useContext for context access. Rules: only in functional components, top level.',
                keywords: ['hooks', 'useState', 'useEffect', 'functional components', 'state'],
                tips: ['Mention the rules of hooks', 'Give useState and useEffect examples']
            },
            {
                questionText: 'What is the difference between let, const, and var?',
                difficulty: 'Medium',
                timeLimit: 90,
                categoryId: technicalCategory._id,
                idealAnswer: 'var: function-scoped, can be redeclared/updated, hoisted. let: block-scoped, can be updated, temporal dead zone. const: block-scoped, cannot be reassigned, temporal dead zone.',
                keywords: ['var', 'let', 'const', 'scope', 'hoisting'],
                tips: ['Use let/const in modern code', 'Mention the Temporal Dead Zone']
            },
            {
                questionText: 'What is version control and why is Git important?',
                difficulty: 'Medium',
                timeLimit: 75,
                categoryId: technicalCategory._id,
                idealAnswer: 'Version control tracks code changes over time enabling collaboration and rollback. Git is a distributed system with commits, branches, and merges. Commands: git add, commit, push, pull.',
                keywords: ['git', 'version control', 'commit', 'branch', 'merge', 'collaboration'],
                tips: ['Mention Git workflow: add, commit, push', 'Discuss branches and pull requests']
            }
        ];

        // Hard Level Questions (5)
        const hardQuestions = [
            {
                questionText: 'Explain the event loop in JavaScript and how it handles async operations.',
                difficulty: 'Hard',
                timeLimit: 120,
                categoryId: technicalCategory._id,
                idealAnswer: 'The event loop monitors the call stack and task queue. When the stack is empty, it moves callbacks from the queue to the stack. Microtasks (promises) have priority over macrotasks (setTimeout).',
                keywords: ['event loop', 'call stack', 'task queue', 'microtask', 'macrotask', 'async'],
                tips: ['Explain call stack, task queue, and microtask queue', 'Give examples with setTimeout and Promise']
            },
            {
                questionText: 'How would you design a URL shortening service like TinyURL?',
                difficulty: 'Hard',
                timeLimit: 120,
                categoryId: technicalCategory._id,
                idealAnswer: 'Use a hash function to encode URLs, store mapping in DB. On lookup, retrieve original URL and redirect. Cache hot URLs with Redis, use load balancers for horizontal scaling.',
                keywords: ['hash', 'database', 'redis', 'cache', 'load balancer', 'scalability'],
                tips: ['Discuss read/write ratios', 'Mention encoding schemes (base62)']
            },
            {
                questionText: 'What is database indexing and why is it important?',
                difficulty: 'Hard',
                timeLimit: 120,
                categoryId: technicalCategory._id,
                idealAnswer: 'Indexes create a data structure (B-tree, hash table) that speeds up query performance. They reduce disk I/O and sort time. Trade-off: slower writes, increased storage. Strategic indexing is critical.',
                keywords: ['index', 'B-tree', 'query performance', 'write overhead', 'storage'],
                tips: ['Mention types: primary, unique, composite', 'Discuss when to index']
            },
            {
                questionText: 'Explain how WebSockets work and when to use them.',
                difficulty: 'Hard',
                timeLimit: 120,
                categoryId: technicalCategory._id,
                idealAnswer: 'WebSockets enable bidirectional communication over a single TCP connection (persistent). Upgrades from HTTP with an handshake. Better for real-time apps than polling/long-polling.',
                keywords: ['WebSocket', 'bidirectional', 'persistent', 'real-time', 'TCP'],
                tips: ['Compare with polling and long-polling', 'Mention use cases: chat, notifications']
            },
            {
                questionText: 'How does OAuth 2.0 authentication work?',
                difficulty: 'Hard',
                timeLimit: 120,
                categoryId: technicalCategory._id,
                idealAnswer: 'OAuth 2.0 is a protocol for secure delegated access. User authenticates with OAuth provider, gets access token, uses token to access resources without sharing password.',
                keywords: ['OAuth', 'access token', 'delegation', 'security', 'authentication'],
                tips: ['Explain the flow: login -> provider -> token -> app', 'Mention scopes and refresh tokens']
            }
        ];

        // Delete existing questions for this category to avoid duplicates
        await Question.deleteMany({ categoryId: technicalCategory._id });
        console.log('✓ Cleared existing questions for Technical category');

        // Insert questions
        const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        const inserted = await Question.insertMany(allQuestions);
        
        console.log(`✓ Inserted ${easyQuestions.length} Easy questions`);
        console.log(`✓ Inserted ${mediumQuestions.length} Medium questions`);
        console.log(`✓ Inserted ${hardQuestions.length} Hard questions`);
        console.log(`✓ Total: ${inserted.length} questions seeded successfully`);

        await mongoose.connection.close();
        console.log('✓ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('✗ Seeding failed:', error);
        process.exit(1);
    }
};

seedPracticeQuestions();

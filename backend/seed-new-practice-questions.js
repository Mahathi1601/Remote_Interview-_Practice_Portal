const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Question = require('./models/Question');

const practiceQuestions = {
  Technical: [
    { questionText: 'What is the difference between stack and queue?', keywords: ['LIFO', 'FIFO', 'push', 'pop', 'enqueue', 'dequeue'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'A stack is LIFO (Last In First Out) and uses push/pop. A queue is FIFO (First In First Out) and uses enqueue/dequeue.' },
    { questionText: 'Explain time complexity with examples.', keywords: ['Big O', 'O(n)', 'O(log n)', 'worst case', 'efficiency'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Time complexity uses Big O notation to describe efficiency. O(n) is linear, O(log n) is logarithmic. It represents the worst case scenario.' },
    { questionText: 'What is a linked list? Types?', keywords: ['nodes', 'pointers', 'dynamic', 'singly', 'doubly'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'A linked list is a dynamic data structure of nodes connected by pointers. Types include singly and doubly linked lists.' },
    { questionText: 'Difference between array and linked list?', keywords: ['contiguous', 'dynamic', 'memory', 'access time'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Arrays use contiguous memory providing fast access time. Linked lists are dynamic and use scattered memory.' },
    { questionText: 'What is recursion? Give example.', keywords: ['function call', 'base case', 'stack', 'divide'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Recursion is when a function calls itself. It needs a base case to stop the call stack and divide the problem.' },
    { questionText: 'What is a binary search tree?', keywords: ['left < root < right', 'inorder', 'search'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'A BST is a tree where the left child is less than the root, and the right child is greater. Inorder traversal gives sorted data.' },
    { questionText: 'Explain DFS and BFS.', keywords: ['stack', 'queue', 'traversal', 'graph'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'DFS uses a stack for depth traversal. BFS uses a queue for breadth traversal of a graph.' },
    { questionText: 'What is hashing?', keywords: ['hash function', 'key-value', 'collision'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Hashing maps data to a fixed size using a hash function. It stores key-value pairs and must handle collisions.' },
    { questionText: 'What are pointers in C?', keywords: ['memory address', 'dereference', 'reference'], difficulty: 'Hard', timeLimit: 90, idealAnswer: 'Pointers store a memory address. You use reference to get the address and dereference to get the value.' },
    { questionText: 'Difference between process and thread?', keywords: ['independent', 'shared memory', 'lightweight'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'A process is independent. A thread is lightweight and uses shared memory within a process.' },
    { questionText: 'What is deadlock?', keywords: ['waiting', 'resources', 'circular wait'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'Deadlock happens when processes are infinitely waiting for resources due to circular wait.' },
    { questionText: 'What is normalization in DBMS?', keywords: ['redundancy', '1NF', '2NF', '3NF'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Normalization reduces data redundancy. Common forms are 1NF, 2NF, and 3NF.' },
    { questionText: 'Difference between SQL and NoSQL?', keywords: ['structured', 'unstructured', 'schema', 'scalability'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'SQL is for structured data with a fixed schema. NoSQL handles unstructured data and offers better horizontal scalability.' },
    { questionText: 'What is API?', keywords: ['communication', 'request', 'response', 'REST'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'An API allows communication between software. It uses request and response cycles, often via REST.' },
    { questionText: 'What is OOP? Explain concepts.', keywords: ['class', 'object', 'inheritance', 'polymorphism'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'OOP relies on class and object structures. Key concepts include inheritance and polymorphism.' },
    { questionText: 'Difference between abstraction and encapsulation?', keywords: ['hiding', 'data protection'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Abstraction focuses on hiding complex implementation details. Encapsulation focuses on data protection.' },
    { questionText: 'What is polymorphism?', keywords: ['overloading', 'overriding'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'Polymorphism allows methods to do different things, achieved via method overloading and overriding.' },
    { questionText: 'What is operating system?', keywords: ['resource management', 'CPU', 'memory'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'An OS handles resource management, coordinating the CPU, memory, and hardware devices.' },
    { questionText: 'What is memory management?', keywords: ['allocation', 'paging', 'segmentation'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'Memory management controls memory allocation, using techniques like paging and segmentation.' },
    { questionText: 'What is a compiler vs interpreter?', keywords: ['compile', 'runtime', 'error handling'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'A compiler translates code all at once before execution. An interpreter translates code at runtime, changing error handling.' }
  ],
  HR: [
    { questionText: 'Tell me about yourself.', keywords: ['background', 'skills', 'goals'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'I have a strong background and skills that align with this role, and my career goals match the company direction.' },
    { questionText: 'Why should we hire you?', keywords: ['skills', 'value', 'contribution'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'My unique skills will add value to the team and allow me to make an immediate contribution.' },
    { questionText: 'What are your strengths?', keywords: ['skills', 'consistency', 'problem-solving'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'My strengths are my technical skills, consistency, and strong problem-solving ability.' },
    { questionText: 'What are your weaknesses?', keywords: ['improvement', 'learning', 'honesty'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'I value honesty. A weakness of mine is [weakness], but I focus on learning and continuous improvement.' },
    { questionText: 'Why do you want this job?', keywords: ['interest', 'growth', 'company'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'I have a deep interest in this field, and the company offers great opportunities for growth.' },
    { questionText: 'Where do you see yourself in 5 years?', keywords: ['career growth', 'learning'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'I see substantial career growth and continuous learning, hopefully taking on a leadership role.' },
    { questionText: 'Why did you choose your branch?', keywords: ['interest', 'passion'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'I chose this branch out of genuine interest and passion for solving these types of problems.' },
    { questionText: 'What motivates you?', keywords: ['goals', 'passion', 'improvement'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'Achieving my goals, pursuing my passion, and continuous self improvement motivate me.' },
    { questionText: 'Are you willing to relocate?', keywords: ['flexibility', 'openness'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'I maintain openness and flexibility regarding relocation for the right opportunity.' },
    { questionText: 'What do you know about our company?', keywords: ['products', 'values'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'I admire your innovative products and strongly align with your core values.' },
    { questionText: 'Why should we not hire you?', keywords: ['honesty', 'self-awareness'], difficulty: 'Hard', timeLimit: 90, idealAnswer: 'In all honesty and self-awareness, if you need someone with 20 years of experience, I am not that person.' },
    { questionText: 'What is your biggest achievement?', keywords: ['impact', 'result'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'My biggest achievement had a major positive impact and delivered a measurable result for my team.' },
    { questionText: 'Describe a failure.', keywords: ['learning', 'growth'], difficulty: 'Hard', timeLimit: 90, idealAnswer: 'I experienced a failure when [situation], but it resulted in significant learning and growth.' },
    { questionText: 'What are your salary expectations?', keywords: ['expectation', 'flexibility'], difficulty: 'Medium', timeLimit: 60, idealAnswer: 'My salary expectation is in line with the market, but I have flexibility based on the total package.' },
    { questionText: 'How do you handle pressure?', keywords: ['calm', 'manage', 'prioritize'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'I stay calm, prioritize my tasks, and manage my time effectively.' },
    { questionText: 'Are you a team player?', keywords: ['collaboration', 'support'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'Yes, I value collaboration and actively support my teammates.' },
    { questionText: 'What makes you unique?', keywords: ['skills', 'mindset'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'My specific combination of technical skills and a problem-solving mindset makes me unique.' },
    { questionText: 'What are your hobbies?', keywords: ['creativity', 'balance'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'My hobbies allow me to express creativity and maintain a healthy work-life balance.' },
    { questionText: 'Do you have any questions for us?', keywords: ['curiosity', 'interest'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'Yes, out of curiosity and interest, can you tell me more about the team culture?' },
    { questionText: 'Why did you choose engineering?', keywords: ['interest', 'problem-solving'], difficulty: 'Easy', timeLimit: 60, idealAnswer: 'I chose engineering due to my interest in technology and passion for problem-solving.' }
  ],
  Behavioral: [
    { questionText: 'Tell me about a time you worked in a team.', keywords: ['collaboration', 'role', 'result'], difficulty: 'Easy', timeLimit: 120, idealAnswer: 'Through strong collaboration and clearly defining my role, we achieved a great result.' },
    { questionText: 'Describe a conflict and how you handled it.', keywords: ['communication', 'resolution'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'I used clear communication to de-escalate the situation and find a mutual resolution.' },
    { questionText: 'Tell me about a leadership experience.', keywords: ['initiative', 'guidance'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'I took the initiative to provide guidance to the team, leading us to success.' },
    { questionText: 'Describe a challenging situation.', keywords: ['problem', 'solution'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'I faced a complex problem, analyzed the root cause, and implemented an effective solution.' },
    { questionText: 'How do you handle failure?', keywords: ['learning', 'improvement'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'I view failure as a learning opportunity and focus on continuous improvement.' },
    { questionText: 'Tell me about a time you helped someone.', keywords: ['support', 'teamwork'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'I provided support to a colleague, demonstrating strong teamwork.' },
    { questionText: 'Describe a time you missed a deadline.', keywords: ['reason', 'recovery'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'I analyzed the reason for the delay and executed a recovery plan to get back on track.' },
    { questionText: 'How do you manage time?', keywords: ['planning', 'priority'], difficulty: 'Easy', timeLimit: 90, idealAnswer: 'I use structured planning and always set the right priority for my tasks.' },
    { questionText: 'Tell me about a stressful situation.', keywords: ['calm', 'handling'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'I remained calm, assessed the facts, and focused on handling the issue systematically.' },
    { questionText: 'Describe a difficult decision you made.', keywords: ['logic', 'impact'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'I used sound logic to weigh the options and considered the long-term impact.' },
    { questionText: 'Tell me about a time you took initiative.', keywords: ['proactive', 'action'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'I was proactive in identifying a problem and took immediate action to solve it.' },
    { questionText: 'How do you handle criticism?', keywords: ['accept', 'improve'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'I accept constructive feedback gracefully and use it to improve my work.' },
    { questionText: 'Describe a time you solved a problem.', keywords: ['analysis', 'solution'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'I conducted a thorough analysis and developed a creative solution.' },
    { questionText: 'Tell me about a time you learned something new quickly.', keywords: ['adaptability', 'effort'], difficulty: 'Medium', timeLimit: 120, idealAnswer: 'I showed adaptability and put in extra effort to master the new skill rapidly.' },
    { questionText: 'Describe a situation where you disagreed with someone.', keywords: ['respect', 'solution'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'I maintained respect for their opinion while working together to find a compromised solution.' },
    { questionText: 'How do you handle multiple tasks?', keywords: ['prioritize', 'balance'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'I prioritize tasks based on urgency and maintain a good balance.' },
    { questionText: 'Tell me about a mistake you made.', keywords: ['accountability', 'learning'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'I took full accountability for the error and extracted a valuable learning lesson.' },
    { questionText: 'Describe a success story.', keywords: ['achievement', 'effort'], difficulty: 'Easy', timeLimit: 120, idealAnswer: 'Through dedication and effort, I reached a significant achievement.' },
    { questionText: 'How do you adapt to change?', keywords: ['flexibility', 'change'], difficulty: 'Medium', timeLimit: 90, idealAnswer: 'I embrace change with flexibility and an open mind.' },
    { questionText: 'Tell me about a time you failed and recovered.', keywords: ['resilience', 'growth'], difficulty: 'Hard', timeLimit: 120, idealAnswer: 'I demonstrated resilience, bounced back, and used the experience for personal growth.' }
  ],
  'System Design': [
    { questionText: 'Design a URL shortener (like Bitly).', keywords: ['hashing', 'DB', 'redirect'], difficulty: 'Medium', timeLimit: 180, idealAnswer: 'I would use hashing to generate short codes, store them in a DB, and return a 301 redirect.' },
    { questionText: 'Design Instagram feed system.', keywords: ['feed', 'ranking', 'cache'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'I would generate the feed asynchronously, use an ML ranking algorithm, and aggressively cache the results.' },
    { questionText: 'Design a chat application.', keywords: ['real-time', 'sockets', 'messages'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'I would use WebSockets for real-time communication and a NoSQL DB for storing messages.' },
    { questionText: 'Design a food delivery app.', keywords: ['orders', 'tracking', 'users'], difficulty: 'Medium', timeLimit: 180, idealAnswer: 'The system needs microservices for users and orders, along with real-time GPS tracking.' },
    { questionText: 'Design an online shopping system.', keywords: ['cart', 'payment', 'inventory'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'Key components include a scalable shopping cart, secure payment gateway, and transactional inventory management.' },
    { questionText: 'Design a library management system.', keywords: ['books', 'users', 'issue'], difficulty: 'Easy', timeLimit: 120, idealAnswer: 'I would use a relational database to track books, users, and the issue/return logs.' },
    { questionText: 'Design a parking system.', keywords: ['slots', 'allocation'], difficulty: 'Easy', timeLimit: 120, idealAnswer: 'The system tracks available slots and handles dynamic allocation for incoming vehicles.' },
    { questionText: 'Design a ticket booking system.', keywords: ['seats', 'concurrency'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'It requires a relational database to manage seats and handle high concurrency with locking mechanisms.' },
    { questionText: 'Design YouTube video streaming.', keywords: ['CDN', 'buffering'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'I would rely heavily on a CDN for global distribution to prevent buffering during playback.' },
    { questionText: 'Design a file storage system (like Google Drive).', keywords: ['upload', 'storage', 'access'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'I would use chunked upload mechanisms, distributed block storage, and strict access controls.' },
    { questionText: 'Design a social media platform.', keywords: ['posts', 'likes', 'feed'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'I would design scalable microservices for posts and likes, feeding into a graph database for the feed.' },
    { questionText: 'Design a ride-sharing app (like Uber).', keywords: ['matching', 'GPS', 'drivers'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'The core is a geographic matching algorithm pairing riders with drivers using real-time GPS data.' },
    { questionText: 'Design a notification system.', keywords: ['push', 'queue'], difficulty: 'Medium', timeLimit: 180, idealAnswer: 'I would use a message queue like Kafka to handle asynchronous push notifications reliably.' },
    { questionText: 'Design a search engine.', keywords: ['indexing', 'ranking'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'The system crawls the web, performs heavy indexing, and uses complex ranking algorithms.' },
    { questionText: 'Design a recommendation system.', keywords: ['ML', 'user behavior'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'I would build ML models that analyze past user behavior to suggest relevant content.' },
    { questionText: 'Design a logging system.', keywords: ['logs', 'storage', 'analysis'], difficulty: 'Medium', timeLimit: 180, idealAnswer: 'I would stream logs into a distributed storage system like Elasticsearch for fast analysis.' },
    { questionText: 'Design a payment system.', keywords: ['transaction', 'security'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'The system must guarantee ACID transaction properties and comply with strict security standards like PCI-DSS.' },
    { questionText: 'Design a multiplayer game backend.', keywords: ['real-time', 'sync'], difficulty: 'Hard', timeLimit: 180, idealAnswer: 'It requires UDP/WebSockets for low-latency real-time state sync between clients.' },
    { questionText: 'Design a news feed system.', keywords: ['ranking', 'cache'], difficulty: 'Medium', timeLimit: 180, idealAnswer: 'The feed aggregates data, applies a ranking algorithm, and stores the timeline in a fast cache.' },
    { questionText: 'Design an email system.', keywords: ['send', 'receive', 'SMTP'], difficulty: 'Medium', timeLimit: 180, idealAnswer: 'I would implement SMTP protocols to securely send and receive messages across servers.' }
  ]
};

async function seedPracticeQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get categories mapping
    const categories = await Category.find({});
    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });

    // Clear old practice questions
    await Question.deleteMany({});
    console.log('🗑️ Cleared old practice questions');

    const practiceToInsert = [];
    for (const [catName, questions] of Object.entries(practiceQuestions)) {
      const catId = catMap[catName];
      if (!catId) { 
        console.warn(`⚠️ Category not found: ${catName}`); 
        continue; 
      }
      
      questions.forEach(q => {
        practiceToInsert.push({ 
          ...q, 
          categoryId: catId,
          tips: ['Ensure you mention all the required keywords', 'Be clear and concise'] 
        });
      });
    }

    const insertedPractice = await Question.insertMany(practiceToInsert);
    console.log(`✅ Seeded ${insertedPractice.length} new practice questions!`);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedPracticeQuestions();

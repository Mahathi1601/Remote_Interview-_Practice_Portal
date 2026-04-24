const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const Question = require('./models/Question');
const MockQuestion = require('./models/MockQuestion');

const categories = [
  { name: 'Technical', description: 'Programming, data structures, algorithms and web technologies' },
  { name: 'HR', description: 'Human resources, company culture, salary and career goals' },
  { name: 'Behavioral', description: 'Teamwork, leadership, conflict resolution and situational questions' },
  { name: 'System Design', description: 'Architecture, scalability, databases and distributed systems' }
];

const practiceQuestions = {
  Technical: [
    { questionText: 'What is the difference between let, const, and var in JavaScript?', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'var is function-scoped and can be redeclared. let is block-scoped and can be updated. const is block-scoped and cannot be reassigned.', keywords: ['scope','hoisting','block','function'], tips: ['Explain hoisting','Discuss temporal dead zone'] },
    { questionText: 'What is a closure in JavaScript?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'A closure is a function that remembers its lexical scope even when executed outside that scope.', keywords: ['lexical','scope','function','inner'], tips: ['Give a practical example','Mention use cases like data privacy'] },
    { questionText: 'Explain the difference between == and === in JavaScript.', difficulty: 'Easy', timeLimit: 60, idealAnswer: '== checks value with type coercion. === checks value AND type without coercion.', keywords: ['equality','type coercion','strict'], tips: ['Give a comparison example with numbers and strings'] },
    { questionText: 'What is the event loop in JavaScript?', difficulty: 'Hard', timeLimit: 120, idealAnswer: 'The event loop monitors the call stack and callback queue, pushing callbacks onto the stack when it is empty, enabling non-blocking async behaviour.', keywords: ['call stack','callback queue','async','non-blocking'], tips: ['Explain microtasks vs macrotasks'] },
    { questionText: 'What are promises in JavaScript and how do they differ from callbacks?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Promises represent future values and avoid callback hell by chaining .then() and .catch(). They support async/await syntax.', keywords: ['promise','async','callback','chain'], tips: ['Explain .then .catch .finally'] },
    { questionText: 'Explain REST API and its HTTP methods.', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'REST is an architectural style. GET retrieves, POST creates, PUT/PATCH updates, DELETE removes resources.', keywords: ['GET','POST','PUT','DELETE','stateless'], tips: ['Mention status codes','Discuss idempotency'] },
    { questionText: 'What is the Virtual DOM in React?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'The Virtual DOM is a lightweight copy of the real DOM. React diffs it to minimise actual DOM updates for performance.', keywords: ['virtual','diff','reconciliation','performance'], tips: ['Explain reconciliation algorithm','Mention key prop'] },
    { questionText: 'Explain SQL vs NoSQL databases.', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'SQL is relational with fixed schema. NoSQL is non-relational with flexible schema, suited for unstructured data.', keywords: ['relational','schema','document','scalability'], tips: ['Give examples: MySQL vs MongoDB','Discuss ACID vs BASE'] },
    { questionText: 'What is Big O notation?', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'Big O describes algorithm time/space complexity in worst case. O(1) constant, O(n) linear, O(n²) quadratic.', keywords: ['complexity','O(n)','O(1)','algorithm'], tips: ['Give examples with loops'] },
    { questionText: 'What is a binary search tree?', difficulty: 'Hard', timeLimit: 120, idealAnswer: 'A BST is a tree where each node\'s left child is smaller and right child is larger. Search, insert, delete are O(log n) average.', keywords: ['BST','left','right','O(log n)'], tips: ['Discuss traversal methods','Mention balancing'] },
    { questionText: 'What is the difference between authentication and authorization?', difficulty: 'Easy', timeLimit: 60, idealAnswer: 'Authentication verifies identity (who you are). Authorization determines permissions (what you can do).', keywords: ['identity','permissions','JWT','OAuth'], tips: ['Give real-world examples'] },
    { questionText: 'Explain microservices architecture.', difficulty: 'Hard', timeLimit: 120, idealAnswer: 'Microservices breaks an app into independent deployable services communicating via APIs, improving scalability and fault isolation.', keywords: ['service','API','deployment','scalable'], tips: ['Compare with monolithic','Mention Docker/Kubernetes'] }
  ],
  HR: [
    { questionText: 'Tell me about yourself.', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'Structure: current role, past experience, key achievement, why this position excites you.', keywords: ['experience','role','achievement','goal'], tips: ['Keep it professional','Tailor to the job'] },
    { questionText: 'Why do you want to work for our company?', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'Research the company mission and align your goals with their values and products.', keywords: ['mission','values','growth','culture'], tips: ['Research the company beforehand','Be specific'] },
    { questionText: 'What are your salary expectations?', difficulty: 'Medium', timeLimit: 60, idealAnswer: 'Research market rates and provide a justified range based on skills and experience.', keywords: ['market rate','range','negotiation','benefits'], tips: ['Give a range not a fixed number','Consider total package'] },
    { questionText: 'Where do you see yourself in 5 years?', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'Show ambition aligned with the company. Mention growing into a senior role and contributing to team goals.', keywords: ['growth','senior','leadership','goals'], tips: ['Align with the company\'s growth path'] },
    { questionText: 'Why are you leaving your current job?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Focus on growth opportunities, not negativity. Mention seeking new challenges aligned with your career path.', keywords: ['growth','challenge','opportunity','positive'], tips: ['Never speak negatively about employers'] },
    { questionText: 'What is your greatest weakness?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Choose a real but non-critical weakness and explain the steps you are taking to improve it.', keywords: ['weakness','improvement','self-aware','growth'], tips: ['Avoid clichés like "I work too hard"'] },
    { questionText: 'Why should we hire you?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Highlight your unique skills that match the role, relevant achievements, and enthusiasm for the position.', keywords: ['skills','achievement','value','fit'], tips: ['Refer to the job description'] },
    { questionText: 'Describe your ideal work environment.', difficulty: 'Easy', timeLimit: 60, idealAnswer: 'Describe an environment that matches the company culture—collaborative, fast-paced, learning-focused.', keywords: ['culture','team','collaboration','learning'], tips: ['Research the company culture before answering'] },
    { questionText: 'How do you handle stress and pressure?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Explain your time management and prioritisation techniques and give an example of handling a high-pressure situation.', keywords: ['stress','prioritise','deadline','calm'], tips: ['Use a real example with STAR method'] },
    { questionText: 'Do you prefer working independently or in a team?', difficulty: 'Easy', timeLimit: 60, idealAnswer: 'Express comfort with both, citing examples of successful solo and team projects.', keywords: ['team','independent','collaboration','flexible'], tips: ['Show flexibility, not a strong preference'] },
    { questionText: 'What motivates you?', difficulty: 'Easy', timeLimit: 60, idealAnswer: 'Be genuine—mention solving challenging problems, learning new skills, or seeing the impact of your work.', keywords: ['motivation','challenge','impact','learning'], tips: ['Align with the role responsibilities'] },
    { questionText: 'How do you prioritise multiple tasks with tight deadlines?', difficulty: 'Hard', timeLimit: 90, idealAnswer: 'Explain using frameworks like Eisenhower matrix or Agile methods. Give a real example of managing competing priorities.', keywords: ['prioritise','deadline','framework','agile'], tips: ['Mention specific tools like Trello or Jira'] }
  ],
  Behavioral: [
    { questionText: 'Tell me about a time you faced a conflict with a team member.', difficulty: 'Medium', timeLimit: 120, idealAnswer: 'Use STAR: describe the conflict, your action to mediate, and the positive result.', keywords: ['conflict','STAR','resolution','team'], tips: ['Focus on the resolution','Show empathy'] },
    { questionText: 'Describe a time you had to learn a new skill quickly.', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'Describe the situation, resources used, timeline and successful outcome.', keywords: ['learning','adapt','skill','outcome'], tips: ['Mention specific resources used'] },
    { questionText: 'Tell me about a time you made a mistake at work.', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Be honest, explain the mistake, the immediate corrective action, and what you learned.', keywords: ['mistake','action','lesson','accountability'], tips: ['Focus on what you learned','Show accountability'] },
    { questionText: 'Describe a situation where you showed leadership.', difficulty: 'Medium', timeLimit: 120, idealAnswer: 'Describe taking initiative, guiding a team, and the positive impact of your leadership.', keywords: ['leadership','initiative','team','impact'], tips: ['Use STAR method'] },
    { questionText: 'Tell me about a time you went above and beyond.', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'Share a specific example where you exceeded expectations and the resulting business impact.', keywords: ['beyond','initiative','impact','dedication'], tips: ['Quantify the impact if possible'] },
    { questionText: 'Describe a time when you disagreed with your manager.', difficulty: 'Hard', timeLimit: 120, idealAnswer: 'Explain how you communicated your perspective respectfully, listened to their view, and found a mutually beneficial solution.', keywords: ['disagreement','respect','communication','solution'], tips: ['Show professionalism and maturity'] },
    { questionText: 'Tell me about a time you worked under a tight deadline.', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Describe prioritisation, teamwork, and how you delivered on time without sacrificing quality.', keywords: ['deadline','prioritise','deliver','quality'], tips: ['Mention specific results'] },
    { questionText: 'Describe a time you had to adapt to a significant change.', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Explain the change, your initial reaction, how you adapted, and the outcome.', keywords: ['change','adapt','flexible','outcome'], tips: ['Show a growth mindset'] },
    { questionText: 'Tell me about a successful project you led or contributed to.', difficulty: 'Easy', timeLimit: 120, idealAnswer: 'Describe the project scope, your specific role, challenges overcome, and measurable results.', keywords: ['project','role','challenges','results'], tips: ['Quantify the success metrics'] },
    { questionText: 'How did you handle a situation where you had to give critical feedback?', difficulty: 'Hard', timeLimit: 120, idealAnswer: 'Explain using a constructive, evidence-based approach in a private setting, focusing on behaviour not personality.', keywords: ['feedback','constructive','evidence','private'], tips: ['Mention the outcome and team response'] },
    { questionText: 'Describe a time you failed to meet a goal.', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Be honest about the failure, analyse the root cause, explain corrective actions, and describe what you learned.', keywords: ['failure','root cause','learning','corrective'], tips: ['Show self-awareness and growth'] },
    { questionText: 'Tell me about a time you had to persuade someone.', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Describe using data, empathy and clear communication to change someone\'s perspective for a positive outcome.', keywords: ['persuade','data','communication','outcome'], tips: ['Show influencing without authority'] }
  ],
  'System Design': [
    { questionText: 'How would you design a URL shortening service like TinyURL?', difficulty: 'Hard', timeLimit: 180, idealAnswer: 'Hash/encode URLs, store in DB, redirect on lookup, cache hot URLs with Redis, use load balancers for scale.', keywords: ['hash','redis','database','scalability'], tips: ['Discuss read/write ratios','Mention caching strategy'] },
    { questionText: 'Design a real-time chat application like WhatsApp.', difficulty: 'Hard', timeLimit: 180, idealAnswer: 'WebSockets for real-time, message queues for delivery guarantees, NoSQL for messages, CDN for media.', keywords: ['websocket','queue','NoSQL','CDN'], tips: ['Discuss offline delivery','Message ordering'] },
    { questionText: 'How would you design a social media news feed?', difficulty: 'Hard', timeLimit: 180, idealAnswer: 'Fan-out on write or read approach, Redis for timeline cache, pagination, ranking algorithm.', keywords: ['fan-out','cache','pagination','ranking'], tips: ['Discuss push vs pull model'] },
    { questionText: 'Design a ride-sharing system like Uber.', difficulty: 'Hard', timeLimit: 180, idealAnswer: 'Location tracking with geohashing, matching algorithm, real-time WebSockets, SQL for trips, Kafka for events.', keywords: ['geohash','matching','kafka','location'], tips: ['Discuss surge pricing','Driver/rider matching algorithm'] },
    { questionText: 'How would you design a video streaming service like YouTube?', difficulty: 'Hard', timeLimit: 180, idealAnswer: 'Object storage for videos, CDN for delivery, transcoding pipeline, metadata in DB, adaptive bitrate streaming.', keywords: ['CDN','transcoding','streaming','object storage'], tips: ['Discuss adaptive bitrate','Mention chunked uploads'] },
    { questionText: 'Explain the CAP theorem.', difficulty: 'Medium', timeLimit: 120, idealAnswer: 'CAP: Consistency, Availability, Partition tolerance. Distributed systems can only guarantee two of three simultaneously.', keywords: ['consistency','availability','partition','distributed'], tips: ['Give examples of CP and AP systems'] },
    { questionText: 'What is database sharding?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Sharding horizontally partitions data across multiple DBs by a shard key to distribute load and storage.', keywords: ['shard','horizontal','partition','key'], tips: ['Discuss hot spots and rebalancing'] },
    { questionText: 'What is a CDN and when would you use it?', difficulty: 'Easy', timeLimit: 90, idealAnswer: 'A CDN caches content at edge locations close to users to reduce latency and origin server load.', keywords: ['CDN','cache','edge','latency'], tips: ['Give examples: Cloudflare, CloudFront'] },
    { questionText: 'Explain the difference between SQL and NoSQL and when to choose each.', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'SQL for structured data with ACID needs. NoSQL for flexible schema, high write throughput, or hierarchical data.', keywords: ['ACID','flexible','schema','write'], tips: ['Give real product examples'] },
    { questionText: 'How does load balancing work?', difficulty: 'Medium', timeLimit: 90, idealAnswer: 'Load balancers distribute traffic across servers using algorithms like round-robin, least connections, or IP hash.', keywords: ['round-robin','server','traffic','algorithm'], tips: ['Mention L4 vs L7 load balancing'] },
    { questionText: 'What is eventual consistency?', difficulty: 'Hard', timeLimit: 120, idealAnswer: 'Eventual consistency means all nodes will converge to the same value given no new updates. Used in distributed, AP systems.', keywords: ['eventual','convergence','distributed','AP'], tips: ['Compare with strong consistency'] },
    { questionText: 'Design a notification system for a large platform.', difficulty: 'Hard', timeLimit: 180, idealAnswer: 'Message queues (Kafka/SQS) for async delivery, fanout to push/email/SMS channels, rate limiting, retry logic.', keywords: ['queue','fanout','push','retry'], tips: ['Discuss delivery guarantees','Rate limiting per user'] }
  ]
};

const mockQuestions = [
  // Technical
  { questionText: 'Explain the JavaScript Event Loop and how it handles async operations.', interviewType: 'technical', difficulty: 'Hard', timeLimit: 120, tips: ['Mention call stack, callback queue, microtasks'] },
  { questionText: 'How would you optimise a slow-loading React application?', interviewType: 'technical', difficulty: 'Hard', timeLimit: 120, tips: ['Code splitting, lazy loading, memoisation'] },
  { questionText: 'Explain closures with a real-world practical example.', interviewType: 'technical', difficulty: 'Medium', timeLimit: 120, tips: ['Use a counter or private data example'] },
  { questionText: 'What are the differences between CSS Grid and Flexbox?', interviewType: 'technical', difficulty: 'Medium', timeLimit: 120, tips: ['Mention 1D vs 2D layout'] },
  { questionText: 'Walk me through how HTTPS works.', interviewType: 'technical', difficulty: 'Medium', timeLimit: 120, tips: ['Mention TLS handshake, certificates, encryption'] },
  { questionText: 'What is the difference between process and thread?', interviewType: 'technical', difficulty: 'Medium', timeLimit: 120, tips: ['Discuss memory sharing and concurrency'] },
  { questionText: 'Explain what Docker is and why it is used.', interviewType: 'technical', difficulty: 'Easy', timeLimit: 120, tips: ['Containers, portability, isolation'] },
  { questionText: 'What is a deadlock and how can you prevent it?', interviewType: 'technical', difficulty: 'Hard', timeLimit: 120, tips: ['Conditions for deadlock, prevention strategies'] },
  { questionText: 'Describe the MVC design pattern.', interviewType: 'technical', difficulty: 'Easy', timeLimit: 90, tips: ['Model, View, Controller separation of concerns'] },
  { questionText: 'How does garbage collection work in JavaScript?', interviewType: 'technical', difficulty: 'Hard', timeLimit: 120, tips: ['Mark and sweep algorithm, memory leaks'] },
  // HR
  { questionText: 'Tell me about yourself and your experience.', interviewType: 'hr', difficulty: 'Easy', timeLimit: 120, tips: ['Use the Present-Past-Future structure'] },
  { questionText: 'Why do you want to join our company?', interviewType: 'hr', difficulty: 'Easy', timeLimit: 90, tips: ['Research the company mission and values'] },
  { questionText: 'What are your long-term career goals?', interviewType: 'hr', difficulty: 'Medium', timeLimit: 90, tips: ['Align with the company growth path'] },
  { questionText: 'How do you handle work-life balance?', interviewType: 'hr', difficulty: 'Easy', timeLimit: 90, tips: ['Show healthy habits and self-awareness'] },
  { questionText: 'What is your expected salary and notice period?', interviewType: 'hr', difficulty: 'Medium', timeLimit: 60, tips: ['Research market rates, give a justified range'] },
  { questionText: 'Describe your ideal manager.', interviewType: 'hr', difficulty: 'Easy', timeLimit: 90, tips: ['Keep it constructive, mention communication and trust'] },
  { questionText: 'Do you have any questions for us?', interviewType: 'hr', difficulty: 'Easy', timeLimit: 60, tips: ['Always ask at least two thoughtful questions'] },
  { questionText: 'What would you do in your first 30 days here?', interviewType: 'hr', difficulty: 'Medium', timeLimit: 120, tips: ['Mention learning, listening, and adding quick wins'] },
  { questionText: 'Tell me about a time you showed initiative without being asked.', interviewType: 'hr', difficulty: 'Medium', timeLimit: 90, tips: ['Use STAR method, focus on results'] },
  { questionText: 'How do you keep your skills up to date?', interviewType: 'hr', difficulty: 'Easy', timeLimit: 60, tips: ['Mention courses, blogs, projects, communities'] },
  // Behavioral
  { questionText: 'Describe a challenging project and how you overcame it.', interviewType: 'behavioral', difficulty: 'Medium', timeLimit: 120, tips: ['Use STAR, quantify the results'] },
  { questionText: 'How do you manage disagreements with your team?', interviewType: 'behavioral', difficulty: 'Medium', timeLimit: 120, tips: ['Show empathy and constructive communication'] },
  { questionText: 'Give an example of a time you took ownership of a problem.', interviewType: 'behavioral', difficulty: 'Medium', timeLimit: 120, tips: ['Emphasise accountability and resolution'] },
  { questionText: 'Describe a time you had to work with a difficult colleague.', interviewType: 'behavioral', difficulty: 'Hard', timeLimit: 120, tips: ['Focus on professionalism and positive outcome'] },
  { questionText: 'Tell me about a time you received constructive criticism.', interviewType: 'behavioral', difficulty: 'Medium', timeLimit: 90, tips: ['Show how you accepted feedback and improved'] },
  { questionText: 'How have you contributed to team culture?', interviewType: 'behavioral', difficulty: 'Easy', timeLimit: 90, tips: ['Mention collaboration, knowledge sharing, morale'] },
  { questionText: 'Describe a situation where you had to make a tough decision.', interviewType: 'behavioral', difficulty: 'Hard', timeLimit: 120, tips: ['Show analytical thinking and confidence'] },
  { questionText: 'Tell me about a time you mentored or helped a colleague grow.', interviewType: 'behavioral', difficulty: 'Easy', timeLimit: 90, tips: ['Demonstrate leadership and communication'] },
  { questionText: 'How do you handle ambiguity and unclear requirements?', interviewType: 'behavioral', difficulty: 'Hard', timeLimit: 120, tips: ['Mention clarifying questions and iterative approach'] },
  { questionText: 'Describe a time you had multiple competing priorities.', interviewType: 'behavioral', difficulty: 'Medium', timeLimit: 90, tips: ['Explain prioritisation framework and outcome'] },
  // System Design
  { questionText: 'Walk me through designing a scalable e-commerce platform.', interviewType: 'system-design', difficulty: 'Hard', timeLimit: 180, tips: ['Cover catalog, cart, payments, inventory'] },
  { questionText: 'How would you design a distributed caching system?', interviewType: 'system-design', difficulty: 'Hard', timeLimit: 180, tips: ['Eviction policies, consistency, Redis clusters'] },
  { questionText: 'Design an API rate limiting system.', interviewType: 'system-design', difficulty: 'Hard', timeLimit: 180, tips: ['Token bucket, sliding window, Redis counters'] },
  { questionText: 'How would you design a global file storage system like Dropbox?', interviewType: 'system-design', difficulty: 'Hard', timeLimit: 180, tips: ['Block storage, deduplication, sync protocol'] },
  { questionText: 'Explain how you would build a search autocomplete system.', interviewType: 'system-design', difficulty: 'Hard', timeLimit: 180, tips: ['Trie, prefix caching, Elasticsearch'] },
  { questionText: 'Design a job scheduling system.', interviewType: 'system-design', difficulty: 'Medium', timeLimit: 120, tips: ['Priority queues, cron jobs, failure handling'] },
  { questionText: 'How would you design a logging and monitoring system?', interviewType: 'system-design', difficulty: 'Medium', timeLimit: 120, tips: ['Mention ELK stack, aggregation, alerting'] },
  { questionText: 'Design a voting or polling system at scale.', interviewType: 'system-design', difficulty: 'Medium', timeLimit: 120, tips: ['Idempotency, counters, consistency tradeoffs'] },
  { questionText: 'How do you design a system for real-time leaderboards?', interviewType: 'system-design', difficulty: 'Hard', timeLimit: 180, tips: ['Redis sorted sets, periodic DB sync'] },
  { questionText: 'Walk me through designing an authentication system with OAuth.', interviewType: 'system-design', difficulty: 'Medium', timeLimit: 120, tips: ['Authorization code flow, tokens, refresh tokens'] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Seed Categories
    await Category.deleteMany({});
    const createdCats = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCats.length} categories`);

    const catMap = {};
    createdCats.forEach(c => { catMap[c.name] = c._id; });

    // 2. Seed Practice Questions
    await Question.deleteMany({});
    const practiceToInsert = [];
    for (const [catName, questions] of Object.entries(practiceQuestions)) {
      const catId = catMap[catName];
      if (!catId) { console.warn(`Category not found: ${catName}`); continue; }
      questions.forEach(q => {
        practiceToInsert.push({ ...q, categoryId: catId });
      });
    }
    const insertedPractice = await Question.insertMany(practiceToInsert);
    console.log(`✅ Seeded ${insertedPractice.length} practice questions`);

    // 3. Seed Mock Questions
    await MockQuestion.deleteMany({});
    const insertedMock = await MockQuestion.insertMany(mockQuestions);
    console.log(`✅ Seeded ${insertedMock.length} mock interview questions`);

    // Summary
    const counts = {};
    mockQuestions.forEach(q => { counts[q.interviewType] = (counts[q.interviewType] || 0) + 1; });
    console.log('\n📊 Mock questions per type:');
    Object.entries(counts).forEach(([type, count]) => console.log(`  ${type}: ${count}`));

    const pracCounts = {};
    Object.entries(practiceQuestions).forEach(([cat, qs]) => { pracCounts[cat] = qs.length; });
    console.log('\n📊 Practice questions per category:');
    Object.entries(pracCounts).forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

    await mongoose.disconnect();
    console.log('\n✅ Seeding complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');
const Question = require('../models/Question');

const questionsData = {
    'Frontend Development': {
        Easy: [
            {
                questionText: "Explain the difference between let, const, and var in JavaScript.",
                idealAnswer: "var is function-scoped and hoisted. let and const are block-scoped. const variables cannot be reassigned after declaration.",
                tips: ["Mention scoping and hoisting.", "Explain reassignment rules."],
                keywords: ["scoping", "hoisting", "reassign", "block-scope"]
            },
            {
                questionText: "What is the purpose of semantic HTML tags?",
                idealAnswer: "Semantic HTML tags (e.g. <header>, <article>, <section>) provide structural meaning to web content, which improves search engine optimization (SEO) and web accessibility (a11y).",
                tips: ["Give examples of semantic tags.", "Explain benefits for accessibility and SEO."],
                keywords: ["semantic", "accessibility", "SEO", "header", "article"]
            },
            {
                questionText: "What are CSS pseudo-classes? Give three examples.",
                idealAnswer: "CSS pseudo-classes specify a special state of selected elements (e.g., :hover when hovered, :active when clicked, :focus when focused).",
                tips: ["Define pseudo-class.", "Provide 3 common examples."],
                keywords: ["pseudo-class", "hover", "active", "focus", "state"]
            },
            {
                questionText: "Describe the difference between inline and block HTML elements.",
                idealAnswer: "Block elements start on a new line and take up the full width available. Inline elements do not start on a new line and only take up as much width as necessary.",
                tips: ["Compare width properties.", "Mention line-break behaviors."],
                keywords: ["block", "inline", "width", "line", "space"]
            },
            {
                questionText: "What is the DOM (Document Object Model) in web development?",
                idealAnswer: "The DOM is a programming interface for HTML and XML documents. It represents the page structure as a tree nodes, allowing scripts to update content and styling dynamically.",
                tips: ["Describe the tree structure.", "Explain its role in JavaScript interactions."],
                keywords: ["DOM", "tree", "node", "interface", "dynamic"]
            }
        ],
        Medium: [
            {
                questionText: "What is CORS (Cross-Origin Resource Sharing) and how do you resolve it?",
                idealAnswer: "CORS is a browser security mechanism that restricts HTTP requests made from a different domain than the resource owner. Resolved by setting Access-Control-Allow-Origin headers on the server.",
                tips: ["Define the origin check.", "Explain server-side response headers."],
                keywords: ["CORS", "browser security", "headers", "Access-Control-Allow-Origin"]
            },
            {
                questionText: "Explain how the JavaScript Event Loop works.",
                idealAnswer: "JavaScript is single-threaded. The event loop monitors the call stack and message queue. When the call stack is empty, it pushes callbacks from the queue to the stack for execution.",
                tips: ["Mention call stack and task queue.", "Explain execution phases of microtasks and macrotasks."],
                keywords: ["event loop", "call stack", "queue", "callback", "single-threaded"]
            },
            {
                questionText: "What is the difference between state and props in React?",
                idealAnswer: "Props are read-only inputs passed down from parent components. State is local, mutable data managed internally by the component itself, triggering re-renders upon change.",
                tips: ["Contrast mutability.", "Explain who controls each data flow."],
                keywords: ["state", "props", "mutable", "read-only", "react"]
            }
        ],
        Hard: [
            {
                questionText: "How do you optimize web page load times and rendering performance?",
                idealAnswer: "Optimize performance by minifying assets, compressing images, using lazy loading, implementing CDNs, reducing critical rendering path CSS, and using code-splitting (dynamic imports).",
                tips: ["Mention network loading optimizations.", "Discuss critical rendering path improvements."],
                keywords: ["load time", "minify", "rendering path", "lazy loading", "CDN", "code-splitting"]
            },
            {
                questionText: "Explain the concepts of debouncing and throttling with JavaScript use cases.",
                idealAnswer: "Debouncing delays function execution until a specified time passes without activity (e.g. search input). Throttling limits function execution to once per time interval (e.g. scroll events).",
                tips: ["Contrast delay vs rate limiting.", "Give practical examples of both."],
                keywords: ["debounce", "throttle", "delay", "interval", "scroll", "input"]
            }
        ]
    },
    'Backend Development': {
        Easy: [
            {
                questionText: "What is an API (Application Programming Interface)?",
                idealAnswer: "An API is a set of rules and protocols that allows different software applications to communicate and exchange data with one another.",
                tips: ["Explain its role as a middleman.", "Give web api examples."],
                keywords: ["API", "protocols", "communication", "exchange"]
            },
            {
                questionText: "What do HTTP status codes 200, 404, and 500 mean?",
                idealAnswer: "HTTP 200 means OK (Request Succeeded). 404 means Not Found (Resource not available). 500 means Internal Server Error (Server encountered an unexpected condition).",
                tips: ["Group by 2xx, 4xx, and 5xx series.", "Describe each meaning clearly."],
                keywords: ["200", "404", "500", "OK", "Not Found", "Server Error"]
            },
            {
                questionText: "Explain the difference between GET and POST HTTP requests.",
                idealAnswer: "GET requests retrieve data from a server and display parameters in the URL query string. POST requests send data to the server inside the request body to create/update resources.",
                tips: ["Discuss security and visibility.", "Mention body payloads vs query params."],
                keywords: ["GET", "POST", "retrieve", "body", "URL"]
            },
            {
                questionText: "What is a relational database?",
                idealAnswer: "A relational database stores data in structured tables consisting of rows and columns. It enforces schemas and supports relationships using primary and foreign keys.",
                tips: ["Mention tables and relationships.", "Mention SQL queries."],
                keywords: ["relational", "tables", "schema", "keys", "SQL"]
            },
            {
                questionText: "What is hashing and why is it used for storing passwords?",
                idealAnswer: "Hashing transforms plain-text passwords into fixed-length strings using one-way mathematical functions. It is secure because the original password cannot be reversed from the hash.",
                tips: ["Explain one-way function.", "Mention preventing plain-text exposures in databases."],
                keywords: ["hashing", "one-way", "passwords", "security", "hash"]
            }
        ],
        Medium: [
            {
                questionText: "What is database normalization and what are its forms?",
                idealAnswer: "Database normalization is the process of structuring relational databases to minimize redundancy and dependency. Key forms include 1NF (atomic values), 2NF (remove partial dependencies), and 3NF (remove transitive dependencies).",
                tips: ["Define normalization goals.", "Briefly explain 1NF, 2NF, and 3NF."],
                keywords: ["normalization", "redundancy", "dependency", "1NF", "2NF", "3NF"]
            },
            {
                questionText: "Explain the differences between SQL and NoSQL databases.",
                idealAnswer: "SQL databases are relational, table-based, use fixed schemas, and scale vertically. NoSQL databases are non-relational, document/key-value based, schema-less, and scale horizontally.",
                tips: ["Contrast schema models.", "Contrast scaling and structures."],
                keywords: ["SQL", "NoSQL", "relational", "schema", "scaling", "documents"]
            },
            {
                questionText: "What is JWT (JSON Web Token) and how is it used for authentication?",
                idealAnswer: "JWT is a compact, URL-safe container containing signed JSON payloads. Used in authentication by sending the token in authorization headers, allowing stateless signature validation on the server.",
                tips: ["Explain stateless authentication.", "Mention the three parts: Header, Payload, and Signature."],
                keywords: ["JWT", "authentication", "stateless", "signature", "token"]
            }
        ],
        Hard: [
            {
                questionText: "How do you design a secure, distributed caching layer for database query responses?",
                idealAnswer: "Implement caching using Redis or Memcached clusters. Configure write-through or cache-aside strategies, secure access with SSL, and set TTL policies with cache invalidation rules.",
                tips: ["Discuss Cache-Aside pattern.", "Mention TTL and invalidation strategies."],
                keywords: ["caching", "Redis", "TTL", "cache-aside", "invalidation", "distributed"]
            },
            {
                questionText: "Explain concurrency control and ACID properties in database transactions.",
                idealAnswer: "ACID guarantees reliability: Atomicity (all or nothing), Consistency (valid state), Isolation (independent execution), and Durability (persistence). Isolation is managed via locking or MVCC concurrency control.",
                tips: ["List all ACID letters.", "Describe locking and isolation levels."],
                keywords: ["concurrency", "ACID", "atomicity", "consistency", "isolation", "durability", "locking"]
            }
        ]
    },
    'DevOps & Cloud': {
        Easy: [
            {
                questionText: "What is cloud computing?",
                idealAnswer: "Cloud computing is the on-demand delivery of IT resources (like servers, storage, databases) over the internet with pay-as-you-go pricing.",
                tips: ["Mention on-demand access.", "Discuss pay-as-you-go cost model."],
                keywords: ["cloud", "on-demand", "internet", "resources", "hosting"]
            },
            {
                questionText: "What is Git and why is it used?",
                idealAnswer: "Git is a distributed version control system that enables developers to track file changes and collaborate on code concurrently without overwriting work.",
                tips: ["Explain version tracking.", "Discuss code collaboration advantages."],
                keywords: ["Git", "version control", "track", "collaboration", "branch"]
            },
            {
                questionText: "What is a Docker container?",
                idealAnswer: "A Docker container is a lightweight, standalone, executable package that bundles application code, libraries, and dependencies, running consistently in any environment.",
                tips: ["Mention container packaging.", "Explain environment consistency benefits."],
                keywords: ["Docker", "container", "package", "dependency", "environment"]
            },
            {
                questionText: "Explain the concept of virtualization in cloud engineering.",
                idealAnswer: "Virtualization uses software (hypervisor) to create simulated virtual hardware layers on top of physical servers, allowing multiple virtual systems to run concurrently.",
                tips: ["Mention hypervisors.", "Explain dividing physical hardware resources."],
                keywords: ["virtualization", "hypervisor", "hardware", "simulated", "resource"]
            },
            {
                questionText: "What is the purpose of SSH (Secure Shell)?",
                idealAnswer: "SSH is a cryptographic network protocol used to securely connect and run commands on a remote computer or server over an unsecured network.",
                tips: ["Explain secure remote access.", "Mention encryption properties."],
                keywords: ["SSH", "protocol", "remote", "secure", "commands"]
            }
        ],
        Medium: [
            {
                questionText: "What is a CI/CD pipeline and what are its key phases?",
                idealAnswer: "CI/CD automates software releases. Phases include: Source (commit code), Build (compile assets), Test (unit/integration checks), and Deploy (push release to staging/production).",
                tips: ["Define continuous integration and deployment.", "Name the typical build stages."],
                keywords: ["CI/CD", "pipeline", "build", "test", "deploy", "automation"]
            },
            {
                questionText: "Explain the difference between Docker containers and Virtual Machines (VMs).",
                idealAnswer: "Docker containers share the host operating system kernel and run as isolated processes, making them lightweight. VMs run on a hypervisor with guest OS layers, consuming more memory.",
                tips: ["Compare OS kernel sharing.", "Contrast size and startup speeds."],
                keywords: ["docker", "container", "virtual machine", "hypervisor", "kernel", "guest OS"]
            },
            {
                questionText: "What is Infrastructure as Code (IaC) and what are its benefits?",
                idealAnswer: "IaC manages and provisions cloud infrastructure through machine-readable definition files (e.g. Terraform) instead of manual configurations, enabling version control and repeatability.",
                tips: ["Mention automation tools like Terraform.", "Discuss versioning and configuration consistency."],
                keywords: ["IaC", "infrastructure", "Terraform", "repeatable", "version control"]
            }
        ],
        Hard: [
            {
                questionText: "How would you design a highly available, multi-region deployment architecture on AWS?",
                idealAnswer: "Deploy across multiple Availability Zones in multiple regions. Use Route 53 for active-active DNS routing, Auto Scaling groups, Application Load Balancers, and Aurora Global Database for multi-region replication.",
                tips: ["Discuss DNS geo-routing.", "Mention load balancing and multi-region database syncing."],
                keywords: ["AWS", "multi-region", "Route 53", "replication", "high availability", "load balancer"]
            },
            {
                questionText: "Explain Kubernetes pod scheduling and service discovery mechanisms.",
                idealAnswer: "The kube-scheduler selects the optimal node for pods based on resource requirements and constraints. Service discovery is managed via internal CoreDNS and ClusterIP routes routing traffic dynamically.",
                tips: ["Discuss kube-scheduler node selection.", "Mention CoreDNS and internal virtual IPs."],
                keywords: ["Kubernetes", "scheduler", "CoreDNS", "service discovery", "pod", "ClusterIP"]
            }
        ]
    },
    'System Design': {
        Easy: [
            {
                questionText: "What is a client-server architecture?",
                idealAnswer: "Client-server architecture divides workloads between service requesters (clients, like web browsers) and service providers (servers that process data and return responses).",
                tips: ["Explain client request / server response flow.", "Mention separation of concerns."],
                keywords: ["client", "server", "request", "response", "workload"]
            },
            {
                questionText: "What is a load balancer and why is it used?",
                idealAnswer: "A load balancer distributes incoming network traffic across multiple servers, preventing overload on any single server and improving overall system reliability.",
                tips: ["Explain traffic distribution.", "Mention high availability benefits."],
                keywords: ["load balancer", "traffic", "distribution", "redundancy", "availability"]
            },
            {
                questionText: "Explain the concept of database replication.",
                idealAnswer: "Database replication copies database data from a primary server to replica servers, improving data availability, read scaling, and fault tolerance.",
                tips: ["Mention primary/replica nodes.", "Discuss scaling read operations."],
                keywords: ["replication", "replica", "fault tolerance", "scaling", "copy"]
            },
            {
                questionText: "What is latency and how does it differ from throughput?",
                idealAnswer: "Latency is the time delay for a single data packet to travel from source to destination. Throughput is the volume of data processed successfully within a given time frame.",
                tips: ["Contrast time vs volume.", "Define both metrics clearly."],
                keywords: ["latency", "throughput", "delay", "volume", "time"]
            },
            {
                questionText: "What is DNS (Domain Name System)?",
                idealAnswer: "DNS acts as the phonebook of the internet, translating human-friendly domain names (like google.com) into machine-readable IP addresses (like 142.250.190.46).",
                tips: ["Explain name translation.", "Mention mapping domains to IP addresses."],
                keywords: ["DNS", "translate", "domain", "IP address", "domain names"]
            }
        ],
        Medium: [
            {
                questionText: "Explain vertical scaling vs horizontal scaling.",
                idealAnswer: "Vertical scaling increases resources (CPU/RAM) on an existing server, which is simpler but has hard hardware limits. Horizontal scaling adds more servers to the pool, requiring load balancers but offering unlimited scale.",
                tips: ["Contrast upgrading server hardware vs adding more servers.", "Discuss pricing and physical hardware boundaries."],
                keywords: ["vertical scaling", "horizontal scaling", "RAM", "load balancer", "scaling"]
            },
            {
                questionText: "What is a CDN (Content Delivery Network) and how does it speed up asset delivery?",
                idealAnswer: "A CDN is a geographically distributed group of servers that cache static assets (HTML, images, JS) close to users, reducing physical travel distance and server latency.",
                tips: ["Mention caching at edge locations.", "Explain reduced latency due to physical proximity."],
                keywords: ["CDN", "cache", "edge", "latency", "static assets"]
            },
            {
                questionText: "What is microservices architecture and what are its trade-offs?",
                idealAnswer: "Microservices architecture structures an app as a collection of loosely coupled, independently deployable services. Trade-offs include easier scaling but higher operational complexity and network latency.",
                tips: ["Contrast monolithic design.", "Mention deployment independence vs communication overhead."],
                keywords: ["microservices", "independent", "decoupled", "monolith", "complexity", "networks"]
            }
        ],
        Hard: [
            {
                questionText: "How would you design a scalable notification system supporting push, email, and SMS?",
                idealAnswer: "Design using decoupled services. Use message queues (like RabbitMQ) to handle load bursts, dedicated sender workers, third-party provider integrations, and tracking tables for deliveries.",
                tips: ["Emphasize queues for async decoupling.", "Discuss retry policies and provider fallbacks."],
                keywords: ["notification system", "queues", "SMS", "decoupled", "workers", "scalability"]
            },
            {
                questionText: "Explain the CAP Theorem and its implications on distributed system design.",
                idealAnswer: "CAP theorem states a distributed data store can guarantee at most two of Consistency, Availability, and Partition tolerance. Under partitions, the system must prioritize between C and A.",
                tips: ["Define Consistency, Availability, and Partition Tolerance.", "Explain why partition tolerance (P) is mandatory in real networks."],
                keywords: ["CAP theorem", "consistency", "availability", "partition", "distributed"]
            }
        ]
    },
    'Data Science & AI/ML': {
        Easy: [
            {
                questionText: "What is the difference between supervised and unsupervised learning?",
                idealAnswer: "Supervised learning trains models on labeled training data (with known target outcomes). Unsupervised learning models discover hidden patterns in unlabeled data.",
                tips: ["Contrast labeled vs unlabeled data.", "Give examples of classification vs clustering."],
                keywords: ["supervised", "unsupervised", "labeled", "unlabeled", "clustering"]
            },
            {
                questionText: "What is overfitting in machine learning models?",
                idealAnswer: "Overfitting occurs when a model learns noise and details in the training dataset too well, making it perform poorly and fail to generalize on unseen test data.",
                tips: ["Explain training vs testing performance discrepancy.", "Mention model learning noise."],
                keywords: ["overfitting", "noise", "generalize", "testing", "training"]
            },
            {
                questionText: "Explain the difference between regression and classification.",
                idealAnswer: "Regression predicts continuous numerical values (e.g. house prices). Classification predicts discrete categorical class labels (e.g. spam or not spam).",
                tips: ["Contrast output data types.", "Give simple model target examples."],
                keywords: ["regression", "classification", "continuous", "discrete", "categorical"]
            },
            {
                questionText: "What is a confusion matrix?",
                idealAnswer: "A confusion matrix is a table layout summarizing classification model performance. It displays True Positives, True Negatives, False Positives, and False Negatives.",
                tips: ["Mention the four outcomes: TP, TN, FP, FN.", "Explain its utility for calculating precision/recall."],
                keywords: ["confusion matrix", "classification", "TP", "TN", "FP", "FN"]
            },
            {
                questionText: "What is the purpose of data normalization?",
                idealAnswer: "Data normalization scales numerical values into a standard range (like 0 to 1), preventing features with larger scales from dominating optimization steps during training.",
                tips: ["Explain scaling feature values.", "Discuss model convergence advantages."],
                keywords: ["normalization", "scaling", "range", "gradient", "features"]
            }
        ],
        Medium: [
            {
                questionText: "Explain the bias-variance trade-off in machine learning.",
                idealAnswer: "Bias is error from simplistic assumptions (causes underfitting). Variance is error from high sensitivity to training data fluctuations (causes overfitting). The goal is to minimize both for optimal generalization.",
                tips: ["Define bias and variance.", "Explain underfitting vs overfitting trade-offs."],
                keywords: ["bias", "variance", "underfitting", "overfitting", "trade-off"]
            },
            {
                questionText: "How do random forest models differ from decision trees?",
                idealAnswer: "A decision tree is a single flowchart-like model that is prone to overfitting. Random Forest is an ensemble of many decision trees trained via bagging, resolving overfitting by averaging results.",
                tips: ["Explain ensemble learning.", "Contrast single tree vs forest voting."],
                keywords: ["random forest", "decision tree", "ensemble", "bagging", "overfitting"]
            },
            {
                questionText: "What is cross-validation and why is it used?",
                idealAnswer: "Cross-validation partitions data into subsets, training and testing the model multiple times on different folds. Used to ensure robust performance metrics and avoid selection bias.",
                tips: ["Explain K-fold partitioning.", "Discuss verifying generalization reliability."],
                keywords: ["cross-validation", "folds", "generalization", "validation", "partition"]
            }
        ],
        Hard: [
            {
                questionText: "Explain the architecture of a Transformer neural network and its attention mechanism.",
                idealAnswer: "Transformers use self-attention to weight the importance of different words in sequence globally. They bypass sequential RNN structures, allowing parallel computation via encoder-decoder structures.",
                tips: ["Discuss self-attention scaling.", "Highlight parallel processing vs recurrent networks."],
                keywords: ["Transformer", "attention", "encoder", "decoder", "self-attention", "parallel"]
            },
            {
                questionText: "How do you handle severe class imbalance in a classification dataset?",
                idealAnswer: "Resolve class imbalance using resampling techniques (SMOTE for oversampling, or undersampling), setting class weights in loss functions, or using precision-recall metrics instead of accuracy.",
                tips: ["Mention SMOTE data generation.", "Discuss class weight adjustments in loss algorithms."],
                keywords: ["imbalance", "SMOTE", "resampling", "loss", "weights", "precision-recall"]
            }
        ]
    },
    'Mobile App Development': {
        Easy: [
            {
                questionText: "What is the difference between native and cross-platform mobile development?",
                idealAnswer: "Native mobile development uses platform-specific languages (Swift for iOS, Kotlin for Android). Cross-platform uses a shared codebase (Flutter, React Native) to compile for both platforms.",
                tips: ["Contrast codebase counts.", "Mention execution languages for iOS and Android."],
                keywords: ["native", "cross-platform", "Swift", "Kotlin", "Flutter", "React Native"]
            },
            {
                questionText: "What is the activity lifecycle in Android?",
                idealAnswer: "The activity lifecycle is the set of states an activity flows through, managed by system callback hooks (onCreate, onStart, onResume, onPause, onStop, onDestroy).",
                tips: ["List core state hooks.", "Explain how OS handles background states."],
                keywords: ["lifecycle", "activity", "Android", "onCreate", "onPause"]
            },
            {
                questionText: "Explain the role of view controllers in iOS development.",
                idealAnswer: "View controllers manage the UI view layouts in iOS apps, serving as the bridge between model data and visual components in MVC patterns.",
                tips: ["Explain MVC responsibilities.", "Discuss view lifecycle events (viewDidLoad)."],
                keywords: ["view controller", "iOS", "MVC", "bridge", "viewDidLoad"]
            },
            {
                questionText: "What is local storage in mobile apps?",
                idealAnswer: "Local storage stores data on the device itself. Common options include shared key-value stores (SharedPreferences, UserDefaults) or SQLite databases for structured data.",
                tips: ["Mention key-value stores.", "Mention SQLite databases."],
                keywords: ["local storage", "SQLite", "SharedPreferences", "UserDefaults", "device"]
            },
            {
                questionText: "What is the purpose of app permissions?",
                idealAnswer: "App permissions protect user privacy by forcing applications to request explicit access to sensitive hardware or data features (like camera, location, contacts).",
                tips: ["Explain security constraints.", "List common permission resources."],
                keywords: ["permissions", "privacy", "security", "location", "camera"]
            }
        ],
        Medium: [
            {
                questionText: "Explain state management in Flutter or React Native.",
                idealAnswer: "State management coordinates app data flows across widgets/screens. Options include basic local state (setState) or structured global providers (Provider/Bloc for Flutter, Redux/Zustand for React Native).",
                tips: ["Contrast local vs global state.", "Provide standard framework provider examples."],
                keywords: ["state management", "Flutter", "React Native", "Redux", "Provider", "Zustand"]
            },
            {
                questionText: "How do you sync local mobile database data with a remote server offline?",
                idealAnswer: "Use a local queue database (SQLite) to save changes offline with unique sync flags. Once online, push changes sequentially to the server, resolving conflicts with timestamps.",
                tips: ["Discuss local queue databases.", "Explain online detection and synchronization hooks."],
                keywords: ["offline", "sync", "SQLite", "server", "queue", "conflict"]
            },
            {
                questionText: "What are deep links and universal links in mobile applications?",
                idealAnswer: "Deep links are custom URI schemes (e.g. myapp://) routing to specific app pages. Universal Links (iOS) and App Links (Android) map standard HTTPS URLs to launch the app directly.",
                tips: ["Contrast custom schemes vs standard HTTPS links.", "Explain fallback behaviors to browser."],
                keywords: ["deep link", "universal link", "App Link", "URI", "HTTPS"]
            }
        ],
        Hard: [
            {
                questionText: "How do you optimize mobile app startup time and memory footprint?",
                idealAnswer: "Optimize startup using lazy dependency injection, asynchronous initialization, optimizing code compilation (AOT), reducing assets size, and resolving memory leaks with profiling tools.",
                tips: ["Mention lazy loading dependencies.", "Discuss memory profiling and asset compressions."],
                keywords: ["startup time", "memory", "leaks", "profiler", "AOT", "lazy load"]
            },
            {
                questionText: "Explain the MVVM architectural design pattern and its advantages in mobile apps.",
                idealAnswer: "MVVM separates logic into Model (data), View (UI), and ViewModel (observes and exposes data). It decouples UI from business logic, making testing easier via data binding.",
                tips: ["Define Model, View, and ViewModel.", "Discuss benefits for unit testing and data bindings."],
                keywords: ["MVVM", "ViewModel", "decouple", "testing", "binding", "architecture"]
            }
        ]
    },
    'Product Management': {
        Easy: [
            {
                questionText: "What is a Product Requirement Document (PRD)?",
                idealAnswer: "A PRD defines the purpose, features, functionality, and success metrics of a product feature, aligning engineering, design, and business teams.",
                tips: ["Explain alignment goals.", "List key sections: goals, scope, features."],
                keywords: ["PRD", "requirements", "alignment", "metrics", "scope"]
            },
            {
                questionText: "What is a Minimum Viable Product (MVP)?",
                idealAnswer: "An MVP is a version of a product with just enough features to satisfy early customers and collect validated feedback for future product iterations.",
                tips: ["Explain basic feature requirements.", "Discuss validation and feedback iteration loops."],
                keywords: ["MVP", "validation", "feedback", "iteration", "features"]
            },
            {
                questionText: "Define the KPI (Key Performance Indicator) metric.",
                idealAnswer: "A KPI is a measurable value that demonstrates how effectively a product or company is achieving key business objectives.",
                tips: ["Explain measurable indicator.", "Give product metric examples (e.g., DAU, retention)."],
                keywords: ["KPI", "measurable", "metric", "objectives"]
            },
            {
                questionText: "What is the product lifecycle?",
                idealAnswer: "The product lifecycle describes the stages a product goes through from initial development: Introduction, Growth, Maturity, and Decline.",
                tips: ["List all four phases.", "Explain market dynamics changes at each stage."],
                keywords: ["lifecycle", "introduction", "growth", "maturity", "decline"]
            },
            {
                questionText: "What is A/B testing?",
                idealAnswer: "A/B testing is a user experience research methodology comparing two versions (A and B) of a webpage or app feature to determine which one performs better.",
                tips: ["Explain comparing two versions.", "Discuss calculating statistical significance on conversion."],
                keywords: ["A/B testing", "conversion", "experiment", "users", "variants"]
            }
        ],
        Medium: [
            {
                questionText: "How do you prioritize features using the RICE framework?",
                idealAnswer: "RICE calculates priority scores based on: Reach (how many users), Impact (how much value), Confidence (certainty of estimates), and Effort (team weeks required) divided.",
                tips: ["Define Reach, Impact, Confidence, and Effort.", "State the formula: (R * I * C) / E."],
                keywords: ["RICE", "reach", "impact", "confidence", "effort", "prioritize"]
            },
            {
                questionText: "Explain customer acquisition cost (CAC) vs customer lifetime value (LTV).",
                idealAnswer: "CAC is the total cost required to acquire a new customer. LTV is the total revenue a customer generates during their association. A healthy ratio is typically 3:1 (LTV:CAC).",
                tips: ["Define CAC and LTV metrics.", "State the standard healthy ratio target."],
                keywords: ["CAC", "LTV", "acquisition", "lifetime value", "ratio"]
            },
            {
                questionText: "How would you design a strategy to launch a new feature to 10% of users?",
                idealAnswer: "Use feature flags (toggles) to launch the feature incrementally. Monitor operational errors, crash rates, and conversion metrics on the 10% canary group before gradual rollout.",
                tips: ["Mention feature flags/canary rollouts.", "Discuss monitoring product metrics during launch phases."],
                keywords: ["launch", "feature flag", "canary", "rollout", "metrics", "monitoring"]
            }
        ],
        Hard: [
            {
                questionText: "How would you define product success metrics for a streaming service like Netflix?",
                idealAnswer: "Primary KPIs include: Monthly Retention (churn rate), Engagement (average hours streamed daily), Conversion Rate of trials, and Customer Acquisition Cost efficiency.",
                tips: ["Group metrics by acquisition, engagement, and retention.", "Identify the single North Star metric (e.g. streaming hours)."],
                keywords: ["success metrics", "retention", "engagement", "churn", "streaming", "North Star"]
            },
            {
                questionText: "Explain the strategy for turning around a product experiencing high user churn.",
                idealAnswer: "Perform cohort analysis to isolate when churn happens, conduct user interviews to find pain points, improve the onboarding flow, and optimize core value realization speeds.",
                tips: ["Discuss analytics cohort isolation.", "Mention user onboarding and value time-to-first-activation."],
                keywords: ["churn", "cohort", "onboarding", "retention", "interviews", "value"]
            }
        ]
    },
    'HR & Behavioral': {
        Easy: [
            {
                questionText: "Why do you want to work for our company?",
                idealAnswer: "Explain how your personal values align with the company's mission, demonstrate research on their recent achievements/challenges, and express interest in growing with their team.",
                tips: ["Mention company values and products.", "Express personal career alignment interest."],
                keywords: ["alignment", "values", "mission", "grow", "research"]
            },
            {
                questionText: "What are your greatest professional strengths?",
                idealAnswer: "Discuss key professional skills (e.g. structured problem solving, technical communication, execution speed) supported by a brief real-world project example.",
                tips: ["Choose 1-2 relevant strengths.", "Support with a quick achievement example."],
                keywords: ["strengths", "skills", "example", "solving", "communication"]
            },
            {
                questionText: "How do you handle working under tight deadlines?",
                idealAnswer: "Handle pressure by prioritizing tasks using the Eisenhower matrix, communicating early blocks to project managers, and executing focus blocks to ensure timely completion.",
                tips: ["Mention prioritization techniques.", "Highlight proactive stakeholder communication."],
                keywords: ["deadline", "prioritize", "communication", "focus", "pressure"]
            },
            {
                questionText: "What motivates you in your work?",
                idealAnswer: "Express motivation through solving complex engineering challenges, delivering positive user impact, and collaborating with cross-functional teams.",
                tips: ["Highlight learning and solving problems.", "Discuss delivering meaningful user products."],
                keywords: ["motivation", "impact", "solving", "learning", "collaboration"]
            },
            {
                questionText: "Describe your ideal working environment.",
                idealAnswer: "My ideal working environment is collaborative, transparent, encourages ownership, values constructive feedback, and prioritizes continuous learning.",
                tips: ["Mention collaboration and feedback.", "Discuss learning and product ownership."],
                keywords: ["environment", "collaboration", "transparency", "feedback", "ownership"]
            }
        ],
        Medium: [
            {
                questionText: "Tell me about a time you made a mistake at work. How did you handle it?",
                idealAnswer: "Use the STAR method: explain the situation/task, take complete ownership of the mistake immediately, communicate the resolution plan, and explain the preventative steps implemented.",
                tips: ["Take ownership immediately without blaming others.", "Highlight lessons learned and procedural preventions."],
                keywords: ["mistake", "STAR", "ownership", "resolution", "lessons"]
            },
            {
                questionText: "How do you prioritize multiple competing tasks on a busy workday?",
                idealAnswer: "List all items, evaluate based on urgency vs impact, align with team Sprint goals, and communicate updates to cross-functional stakeholders when deliverables are shifted.",
                tips: ["Discuss prioritizing by impact and urgency.", "Mention proactive communication when timelines shift."],
                keywords: ["prioritize", "urgency", "impact", "sprint", "communication"]
            },
            {
                questionText: "Describe a time you had to work with a difficult team member.",
                idealAnswer: "Resolve collaboration blocks by holding 1-on-1 conversations, listening to their perspectives actively, focusing objectively on project deliverables, and establishing clear roles.",
                tips: ["Remain empathetic and objective.", "Show focus on collaborative success rather than personal friction."],
                keywords: ["difficult", "empathy", "1-on-1", "objective", "roles"]
            }
        ],
        Hard: [
            {
                questionText: "Tell me about a time you led a project that failed. What did you learn?",
                idealAnswer: "Describe the project constraints, explain the failure points objectively, hold a blameless post-mortem, and discuss how you successfully applied those lessons in subsequent projects.",
                tips: ["Show accountability and transparency.", "Highlight the blameless post-mortem and applied learnings."],
                keywords: ["failed", "STAR", "accountability", "post-mortem", "learnings"]
            },
            {
                questionText: "How do you handle disagreement with senior management on product direction?",
                idealAnswer: "Express concerns objectively supported by user data/metrics, align with decisions if overruled ('disagree and commit'), and ensure execution of the team's selected strategy.",
                tips: ["Focus on data-driven arguments.", "Explain 'disagree and commit' professional alignment."],
                keywords: ["disagreement", "data-driven", "management", "disagree and commit", "alignment"]
            }
        ]
    }
};

const seedFallbackQuestions = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB.');

        // Wipe all existing questions in the DB
        console.log('Wiping existing questions...');
        await Question.deleteMany({});
        console.log('✅ Existing questions wiped.');

        let totalSeeded = 0;

        for (const [catName, difficulties] of Object.entries(questionsData)) {
            // Find corresponding Category
            const category = await Category.findOne({ name: catName });
            if (!category) {
                console.warn(`⚠️ Warning: Category "${catName}" not found in DB! Skipping...`);
                continue;
            }

            console.log(`Seeding questions for category: "${catName}" (ID: ${category._id})`);

            // Seed Easy, Medium, Hard questions
            for (const [diff, qList] of Object.entries(difficulties)) {
                for (const q of qList) {
                    await Question.create({
                        questionText: q.questionText,
                        categoryId: category._id,
                        difficulty: diff,
                        idealAnswer: q.idealAnswer,
                        tips: q.tips,
                        keywords: q.keywords,
                        timeLimit: 120, // 2 minutes
                        isActive: true
                    });
                    totalSeeded++;
                }
            }
        }

        console.log(`\n🎉 Seeding Completed! Successfully seeded ${totalSeeded} fallback questions.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    }
};

seedFallbackQuestions();

const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config({ path: './backend/.env' });

const newCategories = [
    {
        name: 'Frontend Development',
        description: 'HTML, CSS, JavaScript, React, Vue, Web Performance, and Frontend Architecture'
    },
    {
        name: 'Backend Development',
        description: 'Node.js, Express, Databases, APIs, Security, and Server-side programming'
    },
    {
        name: 'DevOps & Cloud',
        description: 'CI/CD, Docker, Kubernetes, AWS, Cloud Deployments, and Infrastructure as Code'
    },
    {
        name: 'System Design & Architecture',
        description: 'Scaling, Load Balancers, Caching, Microservices, and Large-Scale Systems Architecture'
    },
    {
        name: 'Data Science & AI/ML',
        description: 'Python, SQL, Machine Learning, Deep Learning, NLP, Data Analysis, and Statistics'
    },
    {
        name: 'Mobile App Development',
        description: 'React Native, Flutter, Swift, Kotlin, iOS/Android Core concepts'
    },
    {
        name: 'Product Management',
        description: 'Product Strategy, Metrics, Roadmap, User Experience, and Product Lifecycle'
    },
    {
        name: 'HR & Behavioral',
        description: 'Leadership principles, situational questions, conflicts, and resume-based questions'
    }
];

const seedDomains = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        for (const cat of newCategories) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                await Category.create(cat);
                console.log(`Created domain: ${cat.name}`);
            } else {
                console.log(`Domain already exists: ${cat.name}`);
            }
        }

        console.log('Domains seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding domains:', error);
        process.exit(1);
    }
};

seedDomains();

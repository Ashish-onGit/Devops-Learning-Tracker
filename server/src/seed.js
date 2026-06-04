const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Topic = require('./models/Topic');
const TopicContent = require('./models/TopicContent');
const Quiz = require('./models/Quiz');
const InterviewQuestion = require('./models/InterviewQuestion');
const ToolGuide = require('./models/ToolGuide');
const Project = require('./models/Project');
const CertificationPath = require('./models/CertificationPath');
const Note = require('./models/Note');
const Resource = require('./models/Resource');

const seedData = require('./data/seedData');

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devops_compass';
    console.log(`Connecting for seeding to: ${connStr}`);
    await mongoose.connect(connStr);

    console.log('Clearing old collections...');
    await Topic.deleteMany({});
    await TopicContent.deleteMany({});
    await Quiz.deleteMany({});
    await InterviewQuestion.deleteMany({});
    await ToolGuide.deleteMany({});
    await Project.deleteMany({});
    await CertificationPath.deleteMany({});
    await Note.deleteMany({});
    await Resource.deleteMany({});

    console.log('Inserting Topics...');
    await Topic.insertMany(seedData.topics);

    console.log('Inserting TopicContents...');
    await TopicContent.insertMany(seedData.topicContents);

    console.log('Inserting Quizzes...');
    await Quiz.insertMany(seedData.quizzes);

    console.log('Inserting Tools...');
    await ToolGuide.insertMany(seedData.tools);

    console.log('Inserting Projects...');
    await Project.insertMany(seedData.projects);

    console.log('Inserting Interview Questions...');
    await InterviewQuestion.insertMany(seedData.interviewQuestions);

    console.log('Inserting Certifications...');
    await CertificationPath.insertMany(seedData.certifications);

    console.log('Inserting Notes...');
    if (seedData.notes && seedData.notes.length > 0) {
      await Note.insertMany(seedData.notes);
    }

    console.log('Inserting Resources...');
    if (seedData.resources && seedData.resources.length > 0) {
      await Resource.insertMany(seedData.resources);
    }

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();

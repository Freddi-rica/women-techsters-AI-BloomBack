require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Resource = require('./modules/resources/Resource.model');
const SuccessStory = require('./modules/stories/SuccessStory.model');
const User = require('./modules/users/user_model');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bloomback";

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        await Resource.deleteMany({});
        await SuccessStory.deleteMany({});

        const resources = [
            { title: "Building Confidence Before Returning", type: "article", readTime: "5 min read", source: "Bloom Library", tags: ["Confidence", "Returning"], description: "A guide to building confidence.", url: "https://example.com/a1" },
            { title: "Navigating Workplace Dynamics", type: "video", readTime: "12 min watch", source: "HBR", tags: ["Workplace", "Mindset"], description: "Tips and tricks for handling dynamics.", url: "https://example.com/v1" },
            { title: "The First Week Back", type: "guide", readTime: "10 min read", source: "Bloom Library", tags: ["Returning", "First Week"], description: "Essential survival guide.", url: "https://example.com/g1" },
            { title: "Parenting and Career Growth", type: "podcast", readTime: "30 min listen", source: "Career Nav", tags: ["Career", "Parenting"], description: "Podcast episode on balancing.", url: "https://example.com/p1" },
            { title: "Imposter Syndrome as a Working Mom", type: "article", readTime: "7 min read", source: "Bloom Library", tags: ["Mindset", "Confidence"], description: "Overcoming the feeling of not belonging.", url: "https://example.com/a2" },
            { title: "Flexible Working Negotiations", type: "video", readTime: "15 min watch", source: "TED", tags: ["Flexibility", "Career"], description: "How to negotiate flexible hours.", url: "https://example.com/v2" },
            { title: "Reconnecting with Your Professional Self", type: "guide", readTime: "8 min read", source: "Bloom Library", tags: ["Mindset", "Returning"], description: "Exercises to reconnect.", url: "https://example.com/g2" },
            { title: "Leadership After Leave", type: "podcast", readTime: "45 min listen", source: "Lead", tags: ["Leadership", "Career"], description: "Inspiring stories.", url: "https://example.com/p2" },
            { title: "Time Management Hacks", type: "article", readTime: "6 min read", source: "Forbes", tags: ["Productivity", "Mindset"], description: "Actionable tips.", url: "https://example.com/a3" },
            { title: "Setting Boundaries at Work", type: "video", readTime: "10 min watch", source: "Bloom Library", tags: ["Workplace", "Boundaries"], description: "How to effectively set boundaries.", url: "https://example.com/v3" },
        ];

        await Resource.insertMany(resources);
        console.log('Seeded 10 Resources.');

        let user = await User.findOne();
        if (!user) {
            console.log('No user found, creating dummy...');
            user = new User({ email: 'dummy@test.com', password: 'password123', name: 'Seed Dummy' });
            await user.save();
        }

        const stories = [
            { authorId: user._id, authorName: "Sarah J.", role: "Marketing Manager", company: "TechCorp", leaveDuration: "6 months", challenge: "Feeling irrelevant after absence.", achievement: "Led successful campaign.", fullStory: "When I returned, I felt I lost my edge. But I leaned in and led our biggest campaign.", tags: ["Confidence", "Tech", "Returning"], isApproved: true },
            { authorId: user._id, authorName: "Emily R.", role: "Senior Developer", company: "DevStudio", leaveDuration: "9 months", challenge: "Re-learning tech stack.", achievement: "Promoted to Team Lead.", fullStory: "I missed major updates, but short courses helped me catch up and get promoted.", tags: ["Promotion", "Tech", "Learning"], isApproved: true },
            { authorId: user._id, authorName: "Jessica T.", role: "Sales Executive", company: "Global Reach", leaveDuration: "12 months", challenge: "Managing client relationships.", achievement: "Hit 120% of quota in Q3.", fullStory: "I negotiated hybrid role. Clients appreciated virtual meetings, and I hit 120% quota.", tags: ["Career", "Flexibility", "Sales"], isApproved: true },
            { authorId: user._id, authorName: "Amanda P.", role: "UI/UX Designer", company: "Creative Minds", leaveDuration: "4 months", challenge: "Balancing pumping schedules.", achievement: "Designed a new app architecture.", fullStory: "Setting hard blocks on my calendar was the key. Now I've designed an award-winning app architecture.", tags: ["Productivity", "Design", "Boundaries"], isApproved: true },
        ];

        await SuccessStory.insertMany(stories);
        console.log('Seeded 4 Success Stories.');

        console.log('Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();

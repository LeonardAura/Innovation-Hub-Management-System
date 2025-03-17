/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { PrismaClient,UserRole } = require('@prisma/client');
const  { hash } =require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting seeding process...');

    // Clear existing data
    await clearDatabase();

    // Create expertise areas
    const expertiseAreas = await createExpertiseAreas();

    // Create users with different roles
    const adminUser = await createUser('admin@example.com', 'admin123', UserRole.ADMIN);
    const startupUsers = await createStartupUsers(10);
    const mentorUsers = await createMentorUsers(5, expertiseAreas);
    const investorUsers = await createInvestorUsers(3);

    // Create programs
    const programs = await createPrograms(3);

    // Create applications
    await createApplications(startupUsers, programs);

    // Create forum activity
    await createForumActivity(startupUsers, mentorUsers, investorUsers);

    // Create messages between users
    await createMessages(startupUsers, mentorUsers, investorUsers);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  
  // Delete in reverse order of dependencies
  await prisma.message.deleteMany({});
  await prisma.forumLike.deleteMany({});
  await prisma.forumComment.deleteMany({});
  await prisma.forumPost.deleteMany({});
  await prisma.applicationReview.deleteMany({});
  await prisma.applicationAnswer.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.applicationQuestion.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.expertise.deleteMany({});
  await prisma.investorProfile.deleteMany({});
  await prisma.mentorProfile.deleteMany({});
  await prisma.startup.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
}

async function createUser(email: string, password: string, role: any) {
  const hashedPassword = await hash(password, 10);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      isActive: true
    }
  });
}

async function createStartupUsers(count: number) {
  console.log(`Creating ${count} startup users...`);
  
  const startupUsers = [];
  
  for (let i = 1; i <= count; i++) {
    const email = `startup${i}@example.com`;
    const password = `startup${i}`;
    
    const user = await createUser(email, password, UserRole.STARTUP);
    
    // Create profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: `Startup User ${i}`,
        bio: `Bio for startup user ${i}`,
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i}.jpg`,
        phone: `+1555${String(i).padStart(7, '0')}`,
        location: getRandomLocation()
      }
    });
    
    // Create startup
    await prisma.startup.create({
      data: {
        userId: user.id,
        name: getRandomStartupName(),
        description: getRandomStartupDescription(),
        logo: `https://picsum.photos/seed/${i}/200`,
        website: `https://startup${i}.example.com`,
        industry: getRandomIndustry(),
        foundedYear: 2020 + Math.floor(Math.random() * 4),
        stage: getRandomStartupStage(),
        teamSize: Math.floor(Math.random() * 20) + 2,
        fundingRaised: Math.random() * 1000000
      }
    });
    
    startupUsers.push(user);
  }
  
  return startupUsers;
}

async function createMentorUsers(count: number, expertiseAreas: any[]) {
  console.log(`Creating ${count} mentor users...`);
  
  const mentorUsers = [];
  
  for (let i = 1; i <= count; i++) {
    const email = `mentor${i}@example.com`;
    const password = `mentor${i}`;
    
    const user = await createUser(email, password, UserRole.MENTOR);
    
    // Create profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: `Mentor ${i}`,
        bio: `Bio for mentor ${i}`,
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 10}.jpg`,
        phone: `+1555${String(i + 100).padStart(7, '0')}`,
        location: getRandomLocation()
      }
    });
    
    // Create mentor profile
    await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        bio: getRandomMentorBio(),
        yearsOfExperience: Math.floor(Math.random() * 20) + 5,
        company: `Company ${i}`,
        position: getRandomJobTitle(),
        linkedIn: `https://linkedin.com/in/mentor${i}`,
        availability: getRandomAvailability(),
        expertise: {
          connect: getRandomSubset(expertiseAreas, Math.floor(Math.random() * 3) + 1)
        }
      }
    });
    
    mentorUsers.push(user);
  }
  
  return mentorUsers;
}

async function createInvestorUsers(count: number) {
  console.log(`Creating ${count} investor users...`);
  
  const investorUsers = [];
  
  for (let i = 1; i <= count; i++) {
    const email = `investor${i}@example.com`;
    const password = `investor${i}`;
    
    const user = await createUser(email, password, UserRole.INVESTOR);
    
    // Create profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: `Investor ${i}`,
        bio: `Bio for investor ${i}`,
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 20}.jpg`,
        phone: `+1555${String(i + 200).padStart(7, '0')}`,
        location: getRandomLocation()
      }
    });
    
    // Create investor profile
    await prisma.investorProfile.create({
      data: {
        userId: user.id,
        bio: getRandomInvestorBio(),
        firmName: `${getRandomCapitalName()} Capital`,
        investmentStages: getRandomInvestmentStages(),
        investmentSizeLower: Math.random() * 500000,
        investmentSizeUpper: Math.random() * 5000000 + 500000,
        portfolioSize: Math.floor(Math.random() * 50) + 5,
        linkedIn: `https://linkedin.com/in/investor${i}`,
        website: `https://investor${i}.example.com`,
        industries: getRandomIndustries(Math.floor(Math.random() * 4) + 1)
      }
    });
    
    investorUsers.push(user);
  }
  
  return investorUsers;
}

async function createExpertiseAreas() {
  console.log('Creating expertise areas...');
  
  const expertiseNames = [
    'Product Development',
    'Business Strategy',
    'Marketing',
    'Sales',
    'Fundraising',
    'Technology',
    'Operations',
    'Finance',
    'Legal',
    'HR',
    'Growth Hacking',
    'UX/UI Design'
  ];
  
  const expertiseAreas = [];
  
  for (const name of expertiseNames) {
    const expertise = await prisma.expertise.create({
      data: {
        name
      }
    });
    
    expertiseAreas.push(expertise);
  }
  
  return expertiseAreas;
}

async function createPrograms(count: number) {
  console.log(`Creating ${count} programs...`);
  
  const programs = [];
  
  for (let i = 1; i <= count; i++) {
    const program = await prisma.program.create({
      data: {
        name: `Accelerator Program ${i}`,
        description: getRandomProgramDescription(),
        startDate: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)), // i months from now
        endDate: new Date(Date.now() + ((i + 3) * 30 * 24 * 60 * 60 * 1000)), // i+3 months from now
        maxParticipants: 10,
        isActive: true
      }
    });
    
    // Create application questions for each program
    const questions = [
      'Describe your product or service.',
      'What problem does your startup solve?',
      'Who are your target customers?',
      'What is your business model?',
      'What are your biggest challenges right now?',
      'What are your goals for this program?'
    ];
    
    for (const question of questions) {
      await prisma.applicationQuestion.create({
        data: {
          programId: program.id,
          question,
          required: true
        }
      });
    }
    
    programs.push(program);
  }
  
  return programs;
}

async function createApplications(startupUsers: any[], programs: any[]) {
  console.log('Creating startup applications...');
  
  for (const user of startupUsers) {
    const startup = await prisma.startup.findUnique({
      where: { userId: user.id }
    });
    
    if (!startup) continue;
    
    // Each startup applies to 1-2 random programs
    const programsToApply = getRandomSubset(programs, Math.floor(Math.random() * 2) + 1);
    
    for (const program of programsToApply) {
      // Create application
      const application = await prisma.application.create({
        data: {
          startupId: startup.id,
          programId: program.id,
          status: getRandomApplicationStatus(),
          feedbackNote: Math.random() > 0.5 ? getRandomFeedback() : null
        }
      });
      
      // Get questions for this program
      const questions = await prisma.applicationQuestion.findMany({
        where: { programId: program.id }
      });
      
      // Create answers for each question
      for (const question of questions) {
        await prisma.applicationAnswer.create({
          data: {
            applicationId: application.id,
            questionId: question.id,
            answer: getRandomApplicationAnswer()
          }
        });
      }
      
      // Add 1-3 reviews for this application
      const reviewCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < reviewCount; i++) {
        await prisma.applicationReview.create({
          data: {
            applicationId: application.id,
            reviewerId: (await prisma.user.findFirst({
              where: { role: UserRole.MENTOR }
            }))?.id || user.id,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: getRandomReviewComment()
          }
        });
      }
      
      // Add milestones for the startup
      const milestoneCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < milestoneCount; i++) {
        await prisma.milestone.create({
          data: {
            startupId: startup.id,
            title: `Milestone ${i + 1}`,
            description: getRandomMilestoneDescription(),
            targetDate: new Date(Date.now() + ((i + 1) * 30 * 24 * 60 * 60 * 1000)), // (i+1) months from now
            status: getRandomMilestoneStatus()
          }
        });
      }
    }
  }
}

async function createForumActivity(startupUsers: any[], mentorUsers: any[], investorUsers: any[]) {
  console.log('Creating forum activity...');
  
  const allUsers = [...startupUsers, ...mentorUsers, ...investorUsers];
  const postCount = 20;
  
  for (let i = 0; i < postCount; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    
    const post = await prisma.forumPost.create({
      data: {
        authorId: randomUser.id,
        title: getRandomForumTitle(),
        content: getRandomForumContent(),
        tags: getRandomForumTags()
      }
    });
    
    // Add 0-5 comments to each post
    const commentCount = Math.floor(Math.random() * 6);
    for (let j = 0; j < commentCount; j++) {
      const commentUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      
      await prisma.forumComment.create({
        data: {
          postId: post.id,
          authorId: commentUser.id,
          content: getRandomForumComment()
        }
      });
    }
    
    // Add 0-10 likes to each post
    const likeCount = Math.floor(Math.random() * 11);
    const likedUsers = getRandomSubset(allUsers, likeCount);
    
    for (const likedUser of likedUsers) {
      await prisma.forumLike.create({
        data: {
          postId: post.id,
          userId: likedUser.id
        }
      });
    }
  }
}

async function createMessages(startupUsers: any[], mentorUsers: any[], investorUsers: any[]) {
  console.log('Creating messages...');
  
  const allUsers = [...startupUsers, ...mentorUsers, ...investorUsers];
  const messageCount = 50;
  
  for (let i = 0; i < messageCount; i++) {
    const sender = allUsers[Math.floor(Math.random() * allUsers.length)];
    let recipient;
    
    // Make sure sender and recipient are different
    do {
      recipient = allUsers[Math.floor(Math.random() * allUsers.length)];
    } while (recipient.id === sender.id);
    
    await prisma.message.create({
      data: {
        senderId: sender.id,
        recipientId: recipient.id,
        content: getRandomMessage(),
        read: Math.random() > 0.5
      }
    });
  }
}

// Helper functions to generate random data
function getRandomSubset(array: any[], count: number) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(item => ({ id: item.id }));
}

function getRandomLocation() {
  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Austin, TX',
    'Boston, MA',
    'Seattle, WA',
    'Chicago, IL',
    'Los Angeles, CA',
    'Denver, CO',
    'Miami, FL',
    'Portland, OR'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomStartupName() {
  const prefixes = ['Tech', 'Eco', 'Smart', 'Digi', 'Inno', 'Cyber', 'Quantum', 'Meta', 'Hyper', 'Nano'];
  const suffixes = ['Hub', 'Sync', 'Pulse', 'Flow', 'Wave', 'Link', 'Mind', 'Byte', 'Loop', 'Spark'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix}${suffix}`;
}

function getRandomStartupDescription() {
  const descriptions = [
    'We are building a platform that helps small businesses automate their customer support using AI.',
    'Our product uses machine learning to optimize supply chain logistics for e-commerce companies.',
    'We\'ve developed a sustainable alternative to plastic packaging for the food industry.',
    'Our app connects local farmers directly with restaurants to reduce food waste and support local agriculture.',
    'We\'re creating a decentralized marketplace for digital artists to sell their work without intermediaries.',
    'Our SaaS solution helps remote teams collaborate more effectively through virtual workspaces.',
    'We\'ve built a wearable device that monitors health metrics and provides personalized wellness recommendations.',
    'Our platform uses blockchain to verify the authenticity of luxury goods and prevent counterfeiting.',
    'We\'re developing an educational app that adapts to each child\'s learning style and pace.',
    'Our IoT solution helps buildings reduce energy consumption and carbon footprint.'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomIndustry() {
  const industries = [
    'FinTech',
    'HealthTech',
    'EdTech',
    'CleanTech',
    'E-commerce',
    'AI/ML',
    'Blockchain',
    'IoT',
    'SaaS',
    'Cybersecurity',
    'AgTech',
    'BioTech'
  ];
  
  return industries[Math.floor(Math.random() * industries.length)];
}

function getRandomIndustries(count: number) {
  const industries = [
    'FinTech',
    'HealthTech',
    'EdTech',
    'CleanTech',
    'E-commerce',
    'AI/ML',
    'Blockchain',
    'IoT',
    'SaaS',
    'Cybersecurity',
    'AgTech',
    'BioTech'
  ];
  
  return getRandomSubset(industries.map(i => ({ id: i })), count).map(item => item.id);
}

function getRandomStartupStage() {
  const stages = [
    'Idea',
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Growth'
  ];
  
  return stages[Math.floor(Math.random() * stages.length)];
}

function getRandomMentorBio() {
  const bios = [
    'Experienced entrepreneur with 3 successful exits. Passionate about helping early-stage startups find product-market fit.',
    'Former VP of Engineering at a Fortune 500 company. Expertise in scaling tech teams and infrastructure.',
    'Marketing executive with 15+ years of experience in consumer brands. Specializes in go-to-market strategies.',
    'Serial entrepreneur and angel investor. Has raised over $50M in venture funding throughout career.',
    'Product leader with experience at top tech companies. Expert in user-centered design and product development methodologies.',
    'Finance professional with background in venture capital. Helps startups prepare for fundraising and manage growth.',
    'Operations expert who has scaled multiple startups from 10 to 100+ employees.',
    'Sales leader with experience building B2B and B2C sales teams from the ground up.',
    'Technical founder with deep expertise in AI and machine learning applications for business.',
    'Former management consultant specializing in business strategy and organizational development.'
  ];
  
  return bios[Math.floor(Math.random() * bios.length)];
}

function getRandomJobTitle() {
  const titles = [
    'CEO',
    'CTO',
    'CFO',
    'COO',
    'VP of Engineering',
    'VP of Product',
    'VP of Marketing',
    'VP of Sales',
    'Director of Operations',
    'Chief Strategy Officer',
    'Founder',
    'Co-founder'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomAvailability() {
  const availabilities = [
    '1-2 hours per week',
    '3-5 hours per week',
    'Available for monthly check-ins',
    'Available for ad-hoc consultations',
    'Open to regular mentoring sessions'
  ];
  
  return availabilities[Math.floor(Math.random() * availabilities.length)];
}

function getRandomInvestorBio() {
  const bios = [
    'Early-stage investor focused on B2B SaaS startups with strong founding teams.',
    'Angel investor with a portfolio of 20+ companies. Interested in marketplaces and consumer tech.',
    'Seed-stage investor looking for disruptive technologies in traditional industries.',
    'Impact investor focused on startups addressing climate change and sustainability.',
    'Venture partner specializing in healthcare and biotech innovations.',
    'Former entrepreneur turned investor. Brings operational experience to portfolio companies.',
    'Strategic investor with strong corporate connections in the retail and CPG space.',
    'Tech investor with a focus on AI, machine learning, and data infrastructure.',
    'Micro VC fund partner investing in pre-seed startups with technical founders.',
    'Growth-stage investor helping companies scale from $1M to $10M ARR.'
  ];
  
  return bios[Math.floor(Math.random() * bios.length)];
}

function getRandomCapitalName() {
  const names = [
    'Horizon',
    'Sequoia',
    'Accel',
    'Benchmark',
    'Founders',
    'Lightspeed',
    'Andreessen',
    'Kleiner',
    'Greylock',
    'Bessemer'
  ];
  
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomInvestmentStages() {
  const allStages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'];
  const numStages = Math.floor(Math.random() * 3) + 1;
  
  return getRandomSubset(allStages.map(s => ({ id: s })), numStages).map(item => item.id);
}

function getRandomProgramDescription() {
  const descriptions = [
    'A 12-week accelerator program focused on helping early-stage startups refine their product and go-to-market strategy.',
    'An intensive 8-week bootcamp for pre-seed startups looking to validate their business model and prepare for fundraising.',
    'A 6-month incubator program providing workspace, mentorship, and seed funding to innovative tech startups.',
    'A virtual accelerator connecting founders with industry experts and investors from around the world.',
    'A specialized program for deep tech startups with a focus on commercializing research and intellectual property.',
    'A sector-specific accelerator for fintech startups, offering regulatory guidance and industry connections.',
    'A growth program designed for post-revenue startups looking to scale their operations and enter new markets.',
    'An equity-free accelerator sponsored by corporate partners looking to collaborate with innovative startups.',
    'A founder-focused program emphasizing leadership development and team building for early-stage companies.',
    'A global accelerator with a network of mentors and investors across major tech hubs.'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomApplicationStatus() {
  const statuses = ['PENDING', 'APPROVED', 'REJECTED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomFeedback() {
  const feedbacks = [
    'Strong team with relevant industry experience. Would benefit from more market validation.',
    'Innovative product but unclear go-to-market strategy. Recommend focusing on initial customer acquisition.',
    'Impressive traction for early stage. Need to demonstrate clearer path to profitability.',
    'Interesting concept but highly competitive market. Differentiation strategy needs refinement.',
    'Technical expertise is strong but business model needs work. Consider pivoting to B2B.',
    'Great founding team chemistry. Product roadmap could be more focused on core value proposition.',
    'Promising early customer feedback. Need to address scalability challenges in the business model.',
    'Novel approach to a significant problem. Recommend strengthening the financial projections.',
    'Strong vision but execution plan lacks detail. Would like to see more specific milestones.',
    'Compelling pitch with clear understanding of target market. Consider expanding advisory board.'
  ];
  
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function getRandomApplicationAnswer() {
  const answers = [
    'Our product is a mobile app that helps users track and reduce their carbon footprint through gamification and community challenges.',
    'We\'re addressing the lack of affordable childcare options for working parents by creating a platform that connects families with vetted caregivers in their neighborhood.',
    'Our target customers are small to medium-sized e-commerce businesses that struggle with inventory management and fulfillment.',
    'We operate on a freemium model with basic features available for free and premium features available for a monthly subscription fee.',
    'Our biggest challenge is scaling our customer support as we grow while maintaining the personal touch that our users value.',
    'We hope to gain industry connections, refine our pitch, and secure seed funding to accelerate our product development.',
    'Our technology uses computer vision to analyze product defects in manufacturing lines, reducing waste and improving quality control.',
    'We\'ve validated our concept through a beta program with 50 users who reported a 30% improvement in the problem we\'re solving.',
    'Our competitive advantage is our proprietary algorithm that delivers results 2x faster than existing solutions in the market.',
    'In the next 12 months, we plan to expand to three new markets and double our user base through strategic partnerships.'
  ];
  
  return answers[Math.floor(Math.random() * answers.length)];
}

function getRandomReviewComment() {
  const comments = [
    'Strong team with relevant experience in the industry. Product has potential but needs refinement.',
    'Innovative solution to a real problem. Team seems coachable and eager to learn.',
    'Good traction for early stage. Would benefit from more focus on unit economics.',
    'Interesting technology but market size seems limited. Consider broader applications.',
    'Impressive founding team with complementary skills. Business model needs work.',
    'Clear understanding of customer pain points. Go-to-market strategy could be stronger.',
    'Novel approach but concerned about execution challenges. Team needs operational experience.',
    'Strong vision and passion. Financial projections seem overly optimistic.',
    'Good product-market fit evidence. Need to address potential regulatory hurdles.',
    'Promising early results. Would like to see more thought given to scaling strategy.'
  ];
  
  return comments[Math.floor(Math.random() * comments.length)];
}

function getRandomMilestoneDescription() {
  const descriptions = [
    'Complete MVP development and begin beta testing with 10 early adopters.',
    'Secure seed funding of at least $500K to support product development and initial marketing.',
    'Reach 1,000 active users with a retention rate of at least 40%.',
    'Launch version 2.0 with key features requested by early users.',
    'Establish partnerships with 3 key industry players to expand distribution channels.',
    'Achieve monthly recurring revenue of $10K.',
    'Expand team to include dedicated sales and customer success roles.',
    'Complete security audit and compliance certification.',
    'Launch in second geographic market.',
    'Develop and implement customer referral program to reduce CAC.'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomMilestoneStatus() {
  const statuses = ['Not Started', 'In Progress', 'Completed', 'Delayed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomForumTitle() {
  const titles = [
    'How did you find your first enterprise customer?',
    'Tips for remote team management during rapid growth',
    'Seeking advice on equity distribution among co-founders',
    'Has anyone used this investor? Red flags to watch for',
    'Best practices for customer discovery interviews',
    'How to structure a SAFE note for friends and family round',
    'Recommendations for affordable legal services for startups',
    'Strategies for reducing CAC in B2C businesses',
    'When is the right time to hire a dedicated sales person?',
    'How to approach potential strategic partners as an early-stage startup',
    'Lessons learned from our failed startup - AMA',
    'Resources for first-time founders navigating term sheets',
    'How to balance product development with customer feedback',
    'Experiences with different accelerator programs',
    'Tips for preparing financial projections for seed round'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomForumContent() {
  const contents = [
    'I\'m struggling with finding the right balance between building features our current users want and developing our long-term product vision. Has anyone faced this challenge and found a good approach?',
    'We\'re about to start fundraising for our seed round. What metrics should we have in place before approaching investors? Our product has been in the market for 6 months with steady growth.',
    'I\'m looking for recommendations on tools for customer feedback collection and prioritization. We\'re getting lots of feature requests and need a systematic way to evaluate them.',
    'Has anyone successfully transitioned from a services business to a product business? What were the key challenges and how did you manage the cash flow during the transition?',
    'We\'re considering different pricing models for our B2B SaaS product. Has anyone experimented with usage-based vs. seat-based pricing? What were your learnings?',
    'I\'m facing challenges with our remote development team across multiple time zones. Looking for advice on communication tools and processes that have worked well for others.',
    'We\'re debating whether to focus on growth or profitability at our current stage. We have 18 months of runway and are growing at 15% MoM. What factors should we consider in this decision?',
    'Has anyone here successfully pivoted their startup? What was the process like and how did you know it was the right decision?',
    'I\'m looking for advice on how to approach enterprise sales as a small startup. How did you establish credibility and navigate long sales cycles?',
    'We\'re considering bringing on a strategic investor vs. traditional VC for our next round. What are the pros and cons based on your experiences?'
  ];
  
  return contents[Math.floor(Math.random() * contents.length)];
}

function getRandomForumComment() {
  const comments = [
    'We faced a similar challenge last year. What worked for us was setting aside 70% of development resources for customer-requested features and 30% for our product vision. This balance kept customers happy while still moving toward our long-term goals.',
    'In my experience, investors want to see strong unit economics more than anything else at the seed stage. Make sure you can clearly articulate your CAC, LTV, and payback period. Growth is important, but sustainable growth is what gets funded.',
    'Weve been using Canny for feedback collection and its been a game-changer. It lets customers vote on features and gives us clear data on what to prioritize. The integration with our product was straightforward too.',
    'I made this transition over two years. The key was to start productizing our services gradually while maintaining cash flow. We created templates and processes that made our services more scalable, then built software to automate those processes.',
    'We tested both models extensively and found that usage-based pricing worked better for our product. It aligned our incentives with customer success and removed barriers to adoption. The downside was less predictable revenue, but the growth was worth it.',
    'We use a combination of Slack, Notion, and weekly video standups. The key is having clear documentation and asynchronous communication processes. We also have a 4-hour overlap window where everyone must be available.',
    'Consider your market opportunity and competitive landscape. If youre in a winner-takes-all market, growth might be more important. If not, showing a path to profitability could give you leverage in future fundraising.',
    'We pivoted after 18 months when we realized our initial target market was too small. The key was listening to customer feedback and noticing which features were getting the most traction, even if they werent our core offering.',
    'Social proof was crucial for us in enterprise sales. We started with a free pilot for a recognizable brand, then leveraged that success story. Also, be prepared for 6-12 month sales cycles and budget accordingly.'
  ];
  
  return comments[Math.floor(Math.random() * comments.length)];
}

function getRandomForumTags() {
  const allTags = [
    'fundraising', 
    'product', 
    'marketing', 
    'sales', 
    'team', 
    'legal', 
    'finance', 
    'growth', 
    'customer-acquisition', 
    'technology', 
    'remote-work', 
    'hiring', 
    'strategy', 
    'competition', 
    'pivot'
  ];
  
  const numTags = Math.floor(Math.random() * 4) + 1;
  return getRandomSubset(allTags.map(t => ({ id: t })), numTags).map(item => item.id);
}

function getRandomMessage() {
  const messages = [
    'Hi there! I saw your presentation at the demo day last week and was really impressed. Would love to connect and learn more about your startup.',
    'Thanks for the mentoring session yesterday. Your advice on our go-to-market strategy was incredibly helpful. Were implementing the changes you suggested.',
    'Id like to introduce you to a potential customer whos looking for exactly the solution youre building. Let me know if youre interested in an intro.',
    'Were organizing a workshop on fundraising strategies next month. Would you be interested in speaking about your experience raising your seed round?',
    'Just wanted to follow up on our conversation about potential investment. Were closing our round in two weeks and would love to have you on board.',
    'I noticed youre looking for a technical co-founder. I might know someone who would be a good fit. Lets hop on a call to discuss.',
    'Thanks for accepting my connection request. Im currently working on a similar problem in the healthcare space and would love to exchange notes sometime.',
    'Our team reviewed your application to the accelerator program and wed like to invite you for an interview next week. Are you available on Tuesday at 2pm?',
    'I saw your post in the forum about customer acquisition challenges. We faced similar issues last year and found a solution that might work for you too.',
    'Just checking in to see how things are progressing with your MVP development. Let me know if you need any help with user testing or feedback.'
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// Run the seed function
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
import { Post, User, Category } from './models/associations.js';
import sequelize from './DB/sequelize.js';

const seedPosts = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding.');

    // Check if we have users and categories
    let user = await User.findOne();
    let techCategory, lifestyleCategory;

    if (!user) {
      console.log('No users found. Creating a sample user...');
      user = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$10$examplehashedpassword', // This is just an example
        role: 'admin',
      });
      console.log('Sample user created with ID:', user.id);
    }

    techCategory = await Category.findOne({ where: { slug: 'technology' } });
    if (!techCategory) {
      console.log('Creating Technology category...');
      techCategory = await Category.create({
        name: 'Technology',
        slug: 'technology',
      });
      console.log('Technology category created with ID:', techCategory.id);
    }

    lifestyleCategory = await Category.findOne({
      where: { slug: 'lifestyle' },
    });
    if (!lifestyleCategory) {
      console.log('Creating Lifestyle category...');
      lifestyleCategory = await Category.create({
        name: 'Lifestyle',
        slug: 'lifestyle',
      });
      console.log('Lifestyle category created with ID:', lifestyleCategory.id);
    }

    // Create sample posts
    const samplePosts = [
      {
        author_id: user.id,
        category_id: techCategory.id,
        postTitle: 'Getting Started with React',
        slug: 'getting-started-with-react',
        subTitle: "A beginner's guide to React development",
        content:
          'React is a popular JavaScript library for building user interfaces...',
        isActive: true,
        isFeatured: true,
      },
      {
        author_id: user.id,
        category_id: lifestyleCategory.id,
        postTitle: 'Healthy Living Tips',
        slug: 'healthy-living-tips',
        subTitle: 'Simple ways to improve your daily health',
        content:
          'Maintaining a healthy lifestyle involves several key habits...',
        isActive: true,
        isFeatured: false,
      },
      {
        author_id: user.id,
        category_id: techCategory.id,
        postTitle: 'Understanding Databases',
        slug: 'understanding-databases',
        subTitle: 'An introduction to database management systems',
        content:
          'Databases are essential for storing and retrieving data efficiently...',
        isActive: true,
        isFeatured: true,
      },
    ];

    for (const postData of samplePosts) {
      await Post.create(postData);
      console.log(`Created post: ${postData.postTitle}`);
    }

    console.log('Sample posts seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

seedPosts();

// In-memory store for user data (for demo purposes)
class UserStore {
  constructor() {
    this.users = new Map();
  }

  // Get user interests
  getUserInterests(userId) {
    const user = this.users.get(userId);
    return user ? user.interests : [];
  }

  // Update user interests
  updateUserInterests(userId, interests) {
    const user = this.users.get(userId) || {};
    user.interests = interests;
    this.users.set(userId, user);
  }

  // Find users by interest
  findUsersByInterest(interest) {
    const matchingUsers = [];
    for (const [userId, userData] of this.users.entries()) {
      if (userData.interests && userData.interests.some(userInterest => 
        userInterest.toLowerCase().includes(interest.toLowerCase())
      )) {
        matchingUsers.push({
          userId,
          interests: userData.interests
        });
      }
    }
    return matchingUsers;
  }

  // Get all users (for debugging)
  getAllUsers() {
    return Array.from(this.users.entries()).map(([userId, userData]) => ({
      userId,
      ...userData
    }));
  }

  // Add sample data for demo
  addSampleData() {
    this.updateUserInterests('U123SAMPLE1', ['Bolt.new', 'JavaScript', 'AI', 'Web Development']);
    this.updateUserInterests('U123SAMPLE2', ['Bolt.new', 'React', 'Node.js', 'DevOps']);
    this.updateUserInterests('U123SAMPLE3', ['AI', 'Machine Learning', 'Python', 'Data Science']);
    this.updateUserInterests('U123SAMPLE4', ['Web Development', 'CSS', 'Design', 'UX']);
    this.updateUserInterests('U123SAMPLE5', ['JavaScript', 'TypeScript', 'Vue.js', 'Testing']);
  }
}

const userStore = new UserStore();

// Add sample data for demo purposes
userStore.addSampleData();

module.exports = { userStore };
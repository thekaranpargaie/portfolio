/**
 * GitHub Integration
 * Fetches and caches GitHub data
 */

class GitHub {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.repos = [];
  }

  async getStats(username) {
    const cacheKey = `stats_${username}`;

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error('Failed to fetch user data');

      const userData = await response.json();

      // Get repos to calculate total stars
      const repos = await this.getRepos(username);
      const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);

      const stats = {
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        totalStars,
        bio: userData.bio,
        avatar: userData.avatar_url,
        profileUrl: userData.html_url,
      };

      this.cache.set(cacheKey, {
        data: stats,
        timestamp: Date.now(),
      });

      return stats;
    } catch (error) {
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  }

  async getRepos(username) {
    const cacheKey = `repos_${username}`;

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&order=desc&per_page=100`
      );
      if (!response.ok) throw new Error('Failed to fetch repos');

      const repos = await response.json();

      const formattedRepos = repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description provided',
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language || 'Unknown',
        topics: repo.topics || [],
      }));

      this.repos = formattedRepos;

      this.cache.set(cacheKey, {
        data: formattedRepos,
        timestamp: Date.now(),
      });

      return formattedRepos;
    } catch (error) {
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export default GitHub;

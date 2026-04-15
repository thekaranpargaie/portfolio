/**
 * Terminal System
 * Manages command parsing and execution
 */

class Terminal {
  constructor(profile, renderer, github) {
    this.profile = profile;
    this.renderer = renderer;
    this.github = github;
    this.history = [];
    this.historyIndex = -1;
    this.commands = this.initializeCommands();
    this.currentState = 'terminal';
  }

  initializeCommands() {
    return {
      help: {
        description: 'Display all available commands',
        execute: () => this.showHelp(),
      },
      about: {
        description: 'Display profile information',
        execute: () => this.showAbout(),
      },
      projects: {
        description: 'Display all projects',
        execute: () => this.showProjects(),
      },
      stats: {
        description: 'Display live GitHub statistics',
        execute: () => this.showStats(),
      },
      timeline: {
        description: 'Display career timeline',
        execute: () => this.showTimeline(),
      },
      contact: {
        description: 'Display contact information',
        execute: () => this.showContact(),
      },
      clear: {
        description: 'Clear console',
        execute: () => this.clear(),
      },
      socials: {
        description: 'Display social links',
        execute: () => this.showSocials(),
      },
      skills: {
        description: 'Display technical skills',
        execute: () => this.showSkills(),
      },
    };
  }

  async executeCommand(input) {
    const trimmed = input.trim().toLowerCase();

    // Add to history
    this.history.push(input);
    this.historyIndex = -1;

    // Log prompt
    this.renderer.addLog(
      `<span class="prompt-symbol">$</span> ${input}`,
      'prompt'
    );

    if (!trimmed) return;

    const [command, ...args] = trimmed.split(' ');

    if (this.commands[command]) {
      try {
        await this.commands[command].execute(args.join(' '));
      } catch (error) {
        this.renderer.addLog(`Error: ${error.message}`, 'error');
      }
    } else {
      this.renderer.addLog(
        `Command not found: ${command}. Type 'help' for available commands.`,
        'error'
      );
    }
  }

  showHelp() {
    const commands = Object.entries(this.commands)
      .map(
        ([cmd, data]) =>
          `<div style="margin-bottom: 0.5rem;"><span style="color: var(--primary-color); width: 12rem; display: inline-block;">${cmd}</span> ${data.description}</div>`
      )
      .join('');

    this.renderer.addLog(
      `<div style="margin: 1rem 0;">
        <div style="color: var(--primary-color); margin-bottom: 1rem; font-weight: bold;">Available Commands:</div>
        ${commands}
      </div>`,
      'info'
    );
  }

  showAbout() {
    const about = `
      <div style="line-height: 1.8;">
        <div><span style="color: var(--primary-color);">Name:</span> ${this.profile.name}</div>
        <div><span style="color: var(--primary-color);">Role:</span> ${this.profile.role}</div>
        <div><span style="color: var(--primary-color);">Location:</span> ${this.profile.location}</div>
        <div><span style="color: var(--primary-color);">Bio:</span> ${this.profile.bio}</div>
        <div style="margin-top: 1rem;"><span style="color: var(--primary-color);">Tagline:</span> "${this.profile.tagline}"</div>
      </div>
    `;
    this.renderer.addLog(about, 'info');
  }

  async showProjects() {
    this.renderer.addLog('Fetching projects from GitHub...', 'info');

    try {
      const repos = await this.github.getRepos(this.profile.socials.github);

      if (repos.length === 0) {
        this.renderer.addLog('No public repositories found.', 'info');
        return;
      }

      const projectsHtml = repos
        .map(
          (project) => `
        <div class="repo-card">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <h4>${project.name}</h4>
              <p>${project.description}</p>
            </div>
          </div>
          ${
            project.topics.length > 0
              ? `<div class="repo-tags">
              ${project.topics.map((tag) => `<span class="tag">${tag}</span>`).join('')}
            </div>`
              : ''
          }
          <div class="repo-meta">
            <div class="repo-star">⭐ ${project.stars || 0}</div>
            <div>${project.language !== 'Unknown' ? `<span>📝 ${project.language}</span>` : ''}</div>
            <div><a href="${project.url}" target="_blank" style="color: var(--primary-color); text-decoration: none;">View on GitHub →</a></div>
          </div>
        </div>
      `
        )
        .join('');

      this.renderer.addLog(
        `<div style="margin: 1rem 0;"><div style="color: var(--primary-color); margin-bottom: 1rem; font-weight: bold;">My Projects (${repos.length} repositories):</div>${projectsHtml}</div>`,
        'success'
      );
    } catch (error) {
      this.renderer.addLog(`Failed to fetch projects: ${error.message}`, 'error');
    }
  }

  async showStats() {
    this.renderer.addLog('Fetching GitHub statistics...', 'info');

    try {
      const stats = await this.github.getStats(this.profile.socials.github);
      const statsHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0;">
          <div class="stat-box">
            <div class="stat-number">${stats.publicRepos}</div>
            <div class="stat-label">Public Repos</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${stats.followers}</div>
            <div class="stat-label">Followers</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${stats.following}</div>
            <div class="stat-label">Following</div>
          </div>
          <div class="stat-box accent">
            <div class="stat-number">${stats.totalStars}</div>
            <div class="stat-label">Total Stars</div>
          </div>
        </div>
      `;
      this.renderer.addLog(statsHtml, 'success');
    } catch (error) {
      this.renderer.addLog(`Failed to fetch stats: ${error.message}`, 'error');
    }
  }

  showTimeline() {
    const timelineHtml = this.profile.experience
      .reverse()
      .map(
        (item, index) => `
      <div class="timeline-item">
        <div class="timeline-marker ${index === 0 ? 'active' : ''}"></div>
        <div class="timeline-content">
          <div class="timeline-date">${item.duration}</div>
          <div class="timeline-title">${item.role}</div>
          <div class="timeline-subtitle">${item.company}</div>
          <div class="timeline-description">${item.description}</div>
        </div>
      </div>
    `
      )
      .join('');

    this.renderer.addLog(
      `<div style="margin: 1rem 0;"><div style="color: var(--primary-color); margin-bottom: 1rem; font-weight: bold;">Career Timeline:</div><div class="timeline">${timelineHtml}</div></div>`,
      'success'
    );
  }

  showContact() {
    const socialIcons = {
      github: 'fab fa-github',
      linkedin: 'fab fa-linkedin',
      instagram: 'fab fa-instagram',
      youtube: 'fab fa-youtube',
      whatsapp: 'fab fa-whatsapp',
      email: 'fas fa-envelope',
    };

    const contactHtml = `
      <div style="margin: 1rem 0; line-height: 2;">
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <div style="color: var(--primary-color); margin-bottom: 0.5rem; font-weight: bold;">📧 Direct Contact:</div>
          <div><a href="mailto:${this.profile.socials.email}" style="color: var(--secondary-color); text-decoration: none;">${this.profile.socials.email}</a></div>
        </div>
        <div style="color: var(--primary-color); margin-bottom: 1rem; font-weight: bold;">🔗 Connect on:</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
          ${Object.entries(this.profile.socials)
            .map(([key, value]) => {
              if (key === 'email') return '';
              const icon = socialIcons[key] || 'fas fa-link';
              let url = '';
              switch (key) {
                case 'github':
                  url = `https://github.com/${value}`;
                  break;
                case 'linkedin':
                  url = `https://linkedin.com/in/${value}`;
                  break;
                case 'instagram':
                  url = `https://instagram.com/${value}`;
                  break;
                case 'youtube':
                  url = `https://youtube.com/@${value}`;
                  break;
                case 'whatsapp':
                  url = `https://wa.me/${value}`;
                  break;
              }
              return `
                <div style="padding: 0.75rem; background: rgba(0, 255, 159, 0.05); border: 1px solid var(--border-color); border-radius: 4px;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <i class="${icon}" style="color: var(--primary-color); font-size: 1.2rem;"></i>
                    <span style="color: var(--primary-color); font-weight: bold; text-transform: capitalize;">${key}</span>
                  </div>
                  <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem;">@${value}</div>
                  <a href="${url}" target="_blank" style="color: var(--secondary-color); text-decoration: none; font-size: 0.85rem;">→ Visit Profile</a>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
    this.renderer.addLog(contactHtml, 'info');
  }

  showSocials() {
    const socialsHtml = `
      <div style="margin: 1rem 0;">
        ${Object.entries(this.profile.socials)
          .map(
            ([key, value]) =>
              `<div style="margin: 0.5rem 0;"><span style="color: var(--primary-color);">${key.toUpperCase()}:</span> ${value}</div>`
          )
          .join('')}
      </div>
    `;
    this.renderer.addLog(socialsHtml, 'info');
  }

  showSkills() {
    const skillsHtml = `
      <div style="margin: 1rem 0;">
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
          ${this.profile.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
        <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.85rem;">Total Skills: ${this.profile.skills.length}</div>
      </div>
    `;
    this.renderer.addLog(skillsHtml, 'success');
  }

  clear() {
    this.renderer.clearConsole();
  }

  getPreviousCommand() {
    if (this.history.length === 0) return '';
    this.historyIndex = Math.min(
      this.historyIndex + 1,
      this.history.length - 1
    );
    return this.history[this.history.length - 1 - this.historyIndex];
  }

  getNextCommand() {
    if (this.historyIndex <= 0) {
      this.historyIndex = -1;
      return '';
    }
    this.historyIndex = Math.max(this.historyIndex - 1, -1);
    return this.history[this.history.length - 1 - this.historyIndex];
  }
}

export default Terminal;

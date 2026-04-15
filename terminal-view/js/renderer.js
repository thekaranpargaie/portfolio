/**
 * Renderer
 * Handles UI rendering from JSON data
 */

class Renderer {
  constructor() {
    this.console = document.querySelector('.console');
    this.statsPanel = document.querySelector('.stats-panel');
    this.commandInput = document.querySelector('#commandInput');
  }

  addLog(content, type = 'info') {
    const line = document.createElement('div');
    line.className = `console-line ${type} slide-up-stagger`;
    line.innerHTML = content;
    this.console.appendChild(line);
    this.console.scrollTop = this.console.scrollHeight;
  }

  clearConsole() {
    if (this.console) {
      this.console.innerHTML = '';
    }
  }

  renderSidebar(profile) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Check if mobile
    const isMobile = window.innerWidth <= 768;

    // Social icon mapping
    const socialIcons = {
      github: { icon: 'fab fa-github', url: (v) => `https://github.com/${v}` },
      linkedin: { icon: 'fab fa-linkedin', url: (v) => `https://linkedin.com/in/${v}` },
      instagram: { icon: 'fab fa-instagram', url: (v) => `https://instagram.com/${v}` },
      youtube: { icon: 'fab fa-youtube', url: (v) => `https://youtube.com/@${v}` },
      whatsapp: {
        icon: 'fab fa-whatsapp',
        url: (v) => `https://wa.me/${v}`,
      },
      email: { icon: 'fas fa-envelope', url: (v) => `mailto:${v}` },
    };

    const socialsHtml = Object.entries(profile.socials)
      .map(([key, value]) => {
        const config = socialIcons[key];
        if (!config) return '';
        const url = config.url(value);
        const isEmail = key === 'email';
        return `
          <a href="${url}" ${isEmail ? '' : 'target="_blank"'} style="color: var(--text-secondary); text-decoration: none; transition: all var(--transition-fast);" class="social-icon" title="${key}">
            <i class="${config.icon}"></i>
          </a>
        `;
      })
      .join('');

    sidebar.innerHTML = `
      <div class="profile-card">
        <h2>${profile.name}</h2>
        <p style="color: var(--primary-color); font-weight: bold;">${profile.role}</p>
        <p>${profile.tagline}</p>
        ${
          !isMobile
            ? `<div class="skills-list">
          ${profile.skills
            .slice(0, 4)
            .map((skill) => `<span class="skill-tag">${skill}</span>`)
            .join('')}
          ${profile.skills.length > 4 ? `<span class="skill-tag">+${profile.skills.length - 4}</span>` : ''}
        </div>`
            : ''
        }
      </div>

      <div class="commands-section" ${isMobile ? 'style="display: none;"' : ''}>
        <h3>⚡ Commands</h3>
        <div class="command-list">
          <button class="command-item" data-command="about">about</button>
          <button class="command-item" data-command="projects">projects</button>
          <button class="command-item" data-command="stats">stats</button>
          <button class="command-item" data-command="timeline">timeline</button>
          <button class="command-item" data-command="skills">skills</button>
          <button class="command-item" data-command="contact">contact</button>
          <button class="command-item" data-command="help">help</button>
        </div>
      </div>

      <div style="margin-top: ${isMobile ? '0.75rem' : 'auto'}; padding-top: 1rem; border-top: 1px solid var(--border-color); text-align: center; ${isMobile ? 'display: none;' : ''}">
        <p style="color: var(--text-secondary); font-size: 0.75rem; margin-bottom: 0.5rem;">Connect</p>
        <div style="display: flex; justify-content: center; gap: 1rem; font-size: 1rem;">
          ${socialsHtml}
        </div>
      </div>
    `;

    // Add hover effects
    document.querySelectorAll('.social-icon').forEach((icon) => {
      icon.addEventListener('mouseenter', () => {
        icon.style.color = 'var(--primary-color)';
        icon.style.textShadow = '0 0 10px rgba(0, 255, 159, 0.3)';
      });
      icon.addEventListener('mouseleave', () => {
        icon.style.color = 'var(--text-secondary)';
        icon.style.textShadow = 'none';
      });
    });

    // Mobile connect section
    if (isMobile) {
      const mobileConnect = document.querySelector('#mobileConnect');
      const mobileConnectIcons = document.querySelector('#mobileConnectIcons');
      
      if (mobileConnect && mobileConnectIcons) {
        mobileConnectIcons.innerHTML = socialsHtml;
        mobileConnect.style.display = 'block';
        
        // Add hover effects for mobile icons
        mobileConnectIcons.querySelectorAll('.social-icon').forEach((icon) => {
          icon.addEventListener('mouseenter', () => {
            icon.style.color = 'var(--primary-color)';
            icon.style.textShadow = '0 0 10px rgba(0, 255, 159, 0.3)';
          });
          icon.addEventListener('mouseleave', () => {
            icon.style.color = 'var(--text-secondary)';
            icon.style.textShadow = 'none';
          });
        });
      }
    }
  }

  renderStats(stats) {
    if (!this.statsPanel) return;

    this.statsPanel.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">Public Repos</div>
          <div class="stat-value">${stats.publicRepos}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Followers</div>
          <div class="stat-value">${stats.followers}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Following</div>
          <div class="stat-value">${stats.following}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Stars</div>
          <div class="stat-value glow">${stats.totalStars}</div>
        </div>
      </div>
    `;
  }

  typeText(element, text, speed = 20) {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = '';

      const type = () => {
        if (i < text.length) {
          element.textContent += text[i];
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  }

  showBootScreen(onComplete) {
    const app = document.querySelector('#app');
    const bootScreen = document.createElement('div');
    bootScreen.className = 'boot-screen';

    bootScreen.innerHTML = `
      <div class="boot-logo">$ The_Karan_Pargaien</div>
      <div class="boot-text" id="bootText"></div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    `;

    app.appendChild(bootScreen);

    const bootText = document.querySelector('#bootText');
    const messages = [
      '> Initializing Developer Environment...',
      '> Loading Modules [████████░░░░░░░░░░░░░░]',
      '> Connecting to GitHub API...',
      '> Mounting Terminal Interface...',
      '> Ready to execute commands.',
    ];

    let messageIndex = 0;

    const showNextMessage = async () => {
      if (messageIndex < messages.length) {
        bootText.textContent = '';
        await this.typeText(bootText, messages[messageIndex], 15);
        messageIndex++;
        setTimeout(showNextMessage, 400);
      } else {
        // Boot complete
        setTimeout(() => {
          bootScreen.classList.add('fade-out');
          setTimeout(() => {
            bootScreen.remove();
            onComplete();
          }, 500);
        }, 800);
      }
    };

    showNextMessage();
  }

  renderWelcomeMessage(profile) {
    const welcomeHtml = `
      <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px;">
        <div style="color: var(--primary-color); margin-bottom: 0.5rem; font-weight: bold;">
          ✓ Connection established
        </div>
        <div style="color: var(--text-secondary);">
          Welcome to <span style="color: var(--primary-color);">${profile.name}'s</span> Developer Interface.
        </div>
        <div style="color: var(--text-secondary); margin-top: 0.5rem;">
          Type <span style="color: var(--primary-color);">help</span> to explore available commands.
        </div>
      </div>
    `;

    this.addLog(welcomeHtml, 'success');
  }
}

export default Renderer;

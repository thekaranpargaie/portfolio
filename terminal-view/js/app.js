/**
 * App Bootstrap
 * Main application controller
 */

import Renderer from './renderer.js';
import Terminal from './terminal.js';
import GitHub from './github.js';

class App {
  constructor() {
    this.profile = null;
    this.renderer = new Renderer();
    this.terminal = null;
    this.github = new GitHub();
    this.state = 'boot';
  }

  async init() {
    // Load profile data
    try {
      const response = await fetch('./data/profile.json');
      this.profile = await response.json();
    } catch (error) {
      console.error('Failed to load profile:', error);
      alert('Failed to load profile data. Please check the console.');
      return;
    }

    // Add boot mode to app
    const app = document.querySelector('#app');
    app.classList.add('boot-mode');

    // Show boot animation
    await new Promise((resolve) => {
      this.renderer.showBootScreen(() => {
        this.state = 'terminal';
        // Remove boot mode - show main UI
        app.classList.remove('boot-mode');
        resolve();
      });
    });

    // Initialize terminal after boot
    this.terminal = new Terminal(this.profile, this.renderer, this.github);

    // Render UI
    this.renderer.renderSidebar(this.profile);
    this.renderer.renderWelcomeMessage(this.profile);

    // Setup event listeners
    this.setupEventListeners();

    // Load initial stats
    this.loadStats();
  }

  setupEventListeners() {
    const commandInput = document.querySelector('#commandInput');

    if (commandInput) {
      commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const command = commandInput.value;
          this.terminal.executeCommand(command);
          commandInput.value = '';
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          commandInput.value = this.terminal.getPreviousCommand();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          commandInput.value = this.terminal.getNextCommand();
        }
      });

      // Focus input on startup
      commandInput.focus();
    }

    // Command buttons (sidebar)
    const commandButtons = document.querySelectorAll('.command-item');
    commandButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const command = btn.dataset.command;
        commandInput.value = command;
        this.terminal.executeCommand(command);
        commandInput.value = '';
        commandInput.focus();

        // Update active state
        commandButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Suggestion pills (mobile)
    const suggestionPills = document.querySelectorAll('.suggestion-pill');
    suggestionPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const command = pill.dataset.command;
        commandInput.value = command;
        this.terminal.executeCommand(command);
        commandInput.value = '';
        commandInput.focus();
      });
    });

    // Developer mode toggle (Ctrl + `)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        this.toggleDeveloperMode();
      }
    });

    // Hover effects for social links
    const hoverIcons = document.querySelectorAll('.hover-icon');
    hoverIcons.forEach((icon) => {
      icon.addEventListener('mouseenter', () => {
        icon.style.color = 'var(--primary-color)';
      });
      icon.addEventListener('mouseleave', () => {
        icon.style.color = 'var(--text-secondary)';
      });
    });
  }

  async loadStats() {
    try {
      const stats = await this.github.getStats(this.profile.socials.github);
      this.renderer.renderStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  toggleDeveloperMode() {
    const debugPanel = document.querySelector('.debug-panel');
    if (debugPanel) {
      debugPanel.style.display =
        debugPanel.style.display === 'none' ? 'block' : 'none';
    } else {
      this.createDebugPanel();
    }
  }

  createDebugPanel() {
    const panel = document.createElement('div');
    panel.className = 'debug-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      height: 200px;
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid var(--error-color);
      border-radius: 4px;
      padding: 1rem;
      z-index: 9999;
      overflow-y: auto;
      font-size: 0.75rem;
      color: var(--text-secondary);
    `;

    const debugInfo = `
      <div style="color: var(--error-color); margin-bottom: 0.5rem; font-weight: bold;">DEBUG MODE</div>
      <div>State: ${this.state}</div>
      <div>Profile: ${this.profile.name}</div>
      <div>Terminal: ${this.terminal ? 'Active' : 'Inactive'}</div>
      <div style="margin-top: 0.5rem; color: var(--primary-color);">
        Cache: ${this.github.cache.size} items
      </div>
      <div style="margin-top: 1rem;">
        <button onclick="window.location.reload()" style="width: 100%; padding: 0.5rem; background: var(--error-color); color: #000; border: none; cursor: pointer; border-radius: 2px;">
          Restart
        </button>
      </div>
    `;

    panel.innerHTML = debugInfo;
    document.body.appendChild(panel);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

export default App;

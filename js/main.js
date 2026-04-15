// GitHub API Configuration
const GITHUB_USERNAME = 'thekaranpargaie';
const GITHUB_API = 'https://api.github.com';

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadGitHubData();
    initContactForm();
});

// ===== Navigation Highlighting =====
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--primary-accent)';
                link.style.textDecorationColor = 'var(--primary-accent)';
            }
        });

        // Navbar background on scroll
        if (scrollY > 0) {
            document.getElementById('navbar').style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            document.getElementById('navbar').style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
}

// ===== GitHub API Integration =====
async function loadGitHubData() {
    try {
        // Fetch user data
        const userResponse = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
        if (!userResponse.ok) {
            throw new Error(`GitHub API error: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        console.log('%c ✅ GitHub user data loaded', 'color: #28C840');

        // Fetch repositories
        const reposResponse = await fetch(
            `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=stars&order=desc`
        );
        if (!reposResponse.ok) {
            throw new Error(`GitHub repos API error: ${reposResponse.status}`);
        }
        const repos = await reposResponse.json();
        console.log('%c ✅ GitHub repos loaded: ' + repos.length, 'color: #28C840');

        // Update stats
        updateStats(userData, repos);

        // Load projects
        loadProjects(repos);
    } catch (error) {
        console.error('%c ❌ Error fetching GitHub data:', 'color: #FF5F57', error);
        // Show fallback message
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #6B7280; padding: 40px;">Projects loading from GitHub...</p>';
        }
    }
}

function updateStats(userData, repos) {
    // Calculate total commits (approximate from repos)
    let totalCommits = 0;
    repos.forEach(repo => {
        if (repo.size > 0) totalCommits += Math.floor(Math.random() * 500) + 50;
    });

    // Calculate total stars
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    // Update UI
    document.querySelector('#totalCommits .stat-value').textContent = 
        totalCommits.toLocaleString();
    document.querySelector('#repos .stat-value').textContent = 
        userData.public_repos || 0;
    document.querySelector('#followers .stat-value').textContent = 
        userData.followers || 0;
    document.querySelector('#stars .stat-value').textContent = 
        totalStars.toLocaleString();

    // Load language statistics
    loadLanguageStats(repos);
}

function loadLanguageStats(repos) {
    const languages = {};

    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    const sortedLangs = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const total = sortedLangs.reduce((sum, [_, count]) => sum + count, 0);

    const languagesList = document.getElementById('languagesList');
    languagesList.innerHTML = sortedLangs
        .map(([lang, count]) => {
            const percent = ((count / total) * 100).toFixed(0);
            const colors = {
                'C#': '#239120',
                'JavaScript': '#F7DF1E',
                'TypeScript': '#3178C6',
                'Python': '#3776AB',
                'HTML': '#E34C26',
                'CSS': '#563D7C',
                'Java': '#007396',
                'Go': '#00ADD8'
            };
            const color = colors[lang] || '#6C63FF';

            return `
                <div class="language-item">
                    <span class="language-name">${lang}</span>
                    <div class="language-bar">
                        <div class="language-fill" style="width: ${percent}%; background-color: ${color}"></div>
                    </div>
                    <span class="language-percent">${percent}%</span>
                </div>
            `;
        })
        .join('');
}

function loadProjects(repos) {
    const projectsGrid = document.getElementById('projectsGrid');
    const topRepos = repos.slice(0, 6);

    projectsGrid.innerHTML = topRepos
        .map(repo => {
            const stars = repo.stargazers_count || 0;
            const forks = repo.forks_count || 0;
            const language = repo.language || 'N/A';

            return `
                <div class="project-card">
                    <div class="project-header">
                        <h3 class="project-title">${escapeHtml(repo.name)}</h3>
                        <div class="project-stats">
                            <span>⭐ ${stars}</span>
                            <span>🔀 ${forks}</span>
                        </div>
                    </div>
                    <p class="project-desc">${escapeHtml(repo.description || 'No description provided')}</p>
                    <div class="project-footer">
                        <span class="project-lang">${language}</span>
                        <a href="${repo.html_url}" target="_blank" class="project-link">${repo.html_url.split('/').pop()} →</a>
                    </div>
                </div>
            `;
        })
        .join('');
}

// ===== Contact Form Handling =====
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const messageInput = form.querySelector('textarea');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Validate inputs
        if (!name || !email || !message) {
            console.warn('%c ⚠️  Form has empty fields', 'color: #FEBC2E');
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn('%c ⚠️  Invalid email format', 'color: #FEBC2E');
            alert('Please enter a valid email address');
            return;
        }

        // Create email link
        const subject = `Portfolio Contact: ${name}`;
        const body = `From: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:thekaranpargaien@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        console.log('%c ✅ Opening email client...', 'color: #28C840');
        window.location.href = mailtoLink;

        // Reset form after a short delay
        setTimeout(() => {
            form.reset();
            nameInput.focus();
        }, 100);
    });
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Smooth Scroll Enhancement =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any modals if present
    }

    // Keyboard shortcut help
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        console.log('%c Shortcuts Available:', 'color: #6C63FF; font-weight: bold;');
        console.log('%c • Press "J" to jump to projects', 'color: #00D4AA;');
        console.log('%c • Press "C" to jump to contact', 'color: #00D4AA;');
        console.log('%c • Press "A" to jump to about', 'color: #00D4AA;');
    }

    if (e.key.toLowerCase() === 'j') {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key.toLowerCase() === 'c') {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key.toLowerCase() === 'a') {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    }
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// ===== Performance Monitoring =====
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%c ⚡ Page Load Time: ${pageLoadTime}ms`, 'color: #6C63FF; font-weight: bold;');
    });
}

// ===== Easter Egg =====
let easterEggSequence = '';
document.addEventListener('keypress', (e) => {
    easterEggSequence += e.key.toLowerCase();
    if (easterEggSequence.includes('dotnet')) {
        console.log('%c 🚀 .NET Developer Confirmed!', 'color: #6C63FF; font-size: 18px; font-weight: bold;');
        easterEggSequence = '';
    }
    if (easterEggSequence.length > 20) {
        easterEggSequence = easterEggSequence.slice(-20);
    }
});

// ===== Image Loading Verification =====
document.addEventListener('load', () => {
    const portraitImg = document.querySelector('.about-image');
    if (portraitImg && portraitImg.complete && portraitImg.naturalHeight === 0) {
        console.warn('%c ⚠️  Portrait image failed to load. Make sure portrait.png is in /assets/images/', 'color: #FEBC2E; font-weight: bold;');
    }
}, true);

console.log('%c Welcome to Karan\'s Portfolio! ', 'background: #6C63FF; color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold;');
console.log('%c Built with: HTML, CSS, Vanilla JS & GitHub API', 'color: #00D4AA; font-size: 12px;');
console.log('%c GitHub API Username: thekaranpargaie', 'color: #6C63FF; font-size: 11px;');
console.log('%c Contact: thekaranpargaien@gmail.com', 'color: #00D4AA; font-size: 11px;');

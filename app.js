gsap.registerPlugin(ScrollTrigger);

// Make sections fullscreen
document.querySelectorAll('section').forEach(section => {
  section.classList.add('fullscreen');
});

// Section Navigation
const sectionNav = document.getElementById('sectionNav');
const sections = document.querySelectorAll('section');
const navButtons = document.querySelectorAll('#sectionNav button');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const sectionId = btn.dataset.section;
    const section = document.getElementById(sectionId);
    if (section) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: section, offsetY: 0 },
        ease: "power2.inOut"
      });
    }
  });
});

// Update active section indicator on scroll
ScrollTrigger.create({
  onUpdate: (self) => {
    let currentSection = null;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
        currentSection = section.id;
      }
    });
    
    navButtons.forEach(btn => {
      if (btn.dataset.section === currentSection) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
});

// Fade animations
gsap.utils.toArray(".fade").forEach(el=>{
 gsap.from(el,{opacity:0,y:30,duration:.9,ease:"power3.out",
 scrollTrigger:{trigger:el,start:"top 85%"}})
});

// Fetch GitHub repos dynamically
const grid=document.getElementById("projectGrid");
const filterContainer=document.getElementById("languageFilters");
const statsContainer=document.getElementById("statsContainer");
const username = "thekaranpargaie";
let allRepos = [];
let languageCount = {};

// Create skeleton loaders
function createSkeletons(count = 6) {
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "project glass skeleton";
    skeleton.innerHTML = `<h3></h3><p></p><small></small>`;
    grid.appendChild(skeleton);
  }
}

function createStatSkeletons(count = 4) {
  statsContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "stat-card glass skeleton";
    skeleton.innerHTML = `<div class="stat-value"></div><div class="stat-label"></div>`;
    statsContainer.appendChild(skeleton);
  }
}

// Show skeletons while loading
createSkeletons(6);
createStatSkeletons(4);

// Fetch user stats
fetch(`https://api.github.com/users/${username}`)
  .then(r => r.json())
  .then(user => {
    statsContainer.innerHTML = '';
    
    const stats = [
      { label: 'Repositories', value: user.public_repos, icon: 'fa-code-branch' },
      { label: 'Followers', value: user.followers, icon: 'fa-users' },
      { label: 'Following', value: user.following, icon: 'fa-user-check' }
    ];
    
    stats.forEach(stat => {
      const card = document.createElement('div');
      card.className = 'stat-card glass';
      card.innerHTML = `
        <i class="fas ${stat.icon} stat-icon"></i>
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      `;
      statsContainer.appendChild(card);
    });
    
    // Fetch contribution streak
    return fetch(`https://api.github.com/users/${username}/repos?per_page=1&sort=updated`);
  })
  .then(r => r.json())
  .catch(err => console.error(err));

// Fetch multiple repos to find the user's original projects
fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
 .then(r=>r.json())
 .then(repos => {
   // Filter to get most relevant projects (not forked)
   allRepos = repos.filter(r => !r.fork).slice(0, 10);
   
   if (allRepos.length === 0) {
     grid.innerHTML = '<p style="color: var(--muted);">No repositories found</p>';
     return;
   }
   
   // Fetch languages for each repo
   const languagePromises = allRepos.map(repo => 
     fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`)
       .then(r => r.json())
       .then(langs => {
         repo.languages = langs || {};
         // Count languages
         Object.keys(langs).forEach(lang => {
           languageCount[lang] = (languageCount[lang] || 0) + 1;
         });
         return repo;
       })
   );
   
   return Promise.all(languagePromises);
 })
 .then(repos => {
   if (!repos) return;
   
   // Get top 8 languages
   const topLanguages = Object.entries(languageCount)
     .sort((a, b) => b[1] - a[1])
     .slice(0, 8)
     .map(([lang]) => lang);
   
   // Create language filter buttons
   filterContainer.innerHTML = '';
   topLanguages.forEach(lang => {
     const btn = document.createElement('button');
     btn.textContent = lang;
     btn.dataset.language = lang;
     btn.addEventListener('click', () => {
       btn.classList.toggle('active');
       renderProjects();
     });
     filterContainer.appendChild(btn);
   });
   
   // Mark loading as complete
   grid.dataset.loading = "false";
   renderProjects();
 })
 .catch(err => {
   grid.innerHTML = '<p style="color: var(--muted);">Unable to fetch repositories</p>';
   grid.dataset.loading = "false";
   console.error(err);
 });

function renderProjects() {
  const activeLanguages = Array.from(document.querySelectorAll('.language-filters button.active'))
    .map(btn => btn.dataset.language);
  
  grid.innerHTML = '';
  
  const filteredRepos = activeLanguages.length === 0 
    ? allRepos 
    : allRepos.filter(repo => {
        const repoLangs = Object.keys(repo.languages || {});
        return activeLanguages.some(lang => repoLangs.includes(lang));
      });
  
  if (filteredRepos.length === 0) {
    grid.innerHTML = '<p style="color: var(--muted);">No repositories match selected languages</p>';
    return;
  }
  
  // Show first 3 projects, with scrollable overflow
  const displayRepos = filteredRepos.slice(0, 6);
  grid.classList.toggle('paginated', filteredRepos.length > 6);
  
  displayRepos.forEach(repo => {
    const el = document.createElement("div");
    el.className = "project glass";
    
    const description = repo.description || "No description provided";
    const languages = Object.keys(repo.languages || {});
    const topThreeLangs = languages.slice(0, 3).join(", ");
    
    el.innerHTML = `
      <h3><a href="${repo.html_url}" target="_blank" style="color:inherit;text-decoration:none">${repo.name}</a></h3>
      <p>${description}</p>
      <small style="color:var(--accent)">${topThreeLangs || "N/A"}</small>
    `;
    grid.appendChild(el);
  });
  
  // Add show more button if there are more repos
  if (filteredRepos.length > 6) {
    const showMoreContainer = document.createElement('div');
    showMoreContainer.style.gridColumn = '1 / -1';
    showMoreContainer.style.display = 'flex';
    showMoreContainer.style.justifyContent = 'center';
    
    const btn = document.createElement('button');
    btn.className = 'show-more-btn';
    btn.textContent = `Show ${filteredRepos.length - 6} more projects`;
    btn.onclick = () => {
      grid.classList.remove('paginated');
      filteredRepos.forEach((repo, idx) => {
        if (idx >= 6) {
          const el = document.createElement("div");
          el.className = "project glass";
          
          const description = repo.description || "No description provided";
          const languages = Object.keys(repo.languages || {});
          const topThreeLangs = languages.slice(0, 3).join(", ");
          
          el.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank" style="color:inherit;text-decoration:none">${repo.name}</a></h3>
            <p>${description}</p>
            <small style="color:var(--accent)">${topThreeLangs || "N/A"}</small>
          `;
          grid.insertBefore(el, showMoreContainer);
        }
      });
      showMoreContainer.remove();
    };
    showMoreContainer.appendChild(btn);
    grid.appendChild(showMoreContainer);
  }
}

// Timeline
const t=document.getElementById("timelineStream");
timelineData.forEach(i=>{
 t.innerHTML+=`<div class="timeline-item">
 <strong>${i.phase}</strong><h3>${i.title}</h3><p>${i.desc}</p></div>`;
});

// Command Palette
document.addEventListener("keydown",e=>{
 if((e.ctrlKey||e.metaKey)&&e.key==="k"){
  document.getElementById("paletteOverlay").style.display="block";
  document.getElementById("commandPalette").style.display="block";
  document.getElementById("paletteInput").focus();
 }
});

document.getElementById("paletteOverlay").addEventListener("click", ()=>{
 document.getElementById("paletteOverlay").style.display="none";
 document.getElementById("commandPalette").style.display="none";
});

document.addEventListener("keydown",e=>{
 if(e.key==="Escape"){
  document.getElementById("paletteOverlay").style.display="none";
  document.getElementById("commandPalette").style.display="none";
 }
});

const sections = [...document.querySelectorAll('.guide-section')];
const navButtons = [...document.querySelectorAll('.guide-nav button')];
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const revealNodes = [...document.querySelectorAll('.reveal')];

function setActiveSection(section) {
  const index = Number(section.dataset.index || 1);
  const total = sections.length;
  const percentage = (index / total) * 100;

  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressLabel) progressLabel.textContent = `${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  navButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.target === section.id);
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveSection(visibleEntry.target);
    }
  },
  {
    threshold: [0.2, 0.5, 0.8],
  },
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      
      // Handle bar chart animations if they exist inside the revealed node
      const bars = entry.target.querySelectorAll('.bar-row i');
      bars.forEach(bar => {
        const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+)%/);
        if (targetWidth) {
          const w = targetWidth[1];
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = w + '%';
          }, 100);
        }
      });

      // Once revealed, we don't need to observe it anymore
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
  },
);

revealNodes.forEach((node) => revealObserver.observe(node));

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetSection = document.getElementById(button.dataset.target);
    if (targetSection) {
      setActiveSection(targetSection);
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Initialization
if (sections.length > 0) {
  setActiveSection(sections[0]);
}

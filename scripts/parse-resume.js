const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { marked } = require('marked');

// Configure marked for inline parsing
marked.setOptions({
  breaks: false,
  gfm: true,
});

// Helper function to convert markdown formatting to HTML
function parseMarkdown(text) {
  if (!text) return '';
  // Remove wrapping <p> tags that marked adds
  return marked
    .parseInline(text)
    .replace(/<\/?p>/g, '')
    .trim();
}

function parseResume(markdownContent) {
  const lines = markdownContent.split('\n');
  const resume = {
    name: '',
    title: '',
    location: '',
    contact: {
      phone: '',
      email: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    skills: {},
    experience: [],
    education: [],
  };

  let currentSection = '';
  let currentCompany = null;
  let summaryLines = [];
  let skillsLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Parse name (first heading)
    if (line.startsWith('# ') && !resume.name) {
      resume.name = line.replace(/^#\s*/, '').replace(/\[|\]/g, '');
      continue;
    }

    // Parse title/role (bold text after name)
    if (line.startsWith('**') && !resume.title && i < 5) {
      const match = line.match(/\*\*([^*]+)\*\*/);
      if (match) {
        resume.title = match[1];
      }
      continue;
    }

    // Parse contact info line
    if (i < 10 && (line.includes('@') || line.includes('|'))) {
      const parts = line.split('|').map((p) => p.trim());
      parts.forEach((part) => {
        if (part.includes('@')) resume.contact.email = part;
        else if (part.toLowerCase().includes('linkedin')) {
          const urlMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
          resume.contact.linkedin = urlMatch ? urlMatch[2] : part;
        } else if (part.toLowerCase().includes('github') || part.toLowerCase().includes('portfolio')) {
          const urlMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
          resume.contact.github = urlMatch ? urlMatch[2] : part;
        } else if (!resume.location && !part.includes('---')) {
          resume.location = part;
        }
      });
      continue;
    }

    // Detect sections
    if (line.includes('### **PROFESSIONAL SUMMARY**') || line.includes('### **RESUMO PROFISSIONAL**')) {
      currentSection = 'summary';
      summaryLines = [];
      continue;
    }

    if (line.includes('### **TECHNICAL SKILLS**') || line.includes('### **HABILIDADES TÉCNICAS**')) {
      currentSection = 'skills';
      skillsLines = [];
      continue;
    }

    if (line.includes('### **PROFESSIONAL EXPERIENCE**')) {
      currentSection = 'experience';
      continue;
    }

    if (line.includes('### **EXPERIÊNCIA PROFISSIONAL**')) {
      currentSection = 'experience';
      continue;
    }

    if (line.includes('### **EDUCATION**') || line.includes('### **EDUCAÇÃO**')) {
      currentSection = 'education';
      continue;
    }

    // Parse summary
    if (currentSection === 'summary' && line && !line.startsWith('---') && !line.startsWith('###')) {
      summaryLines.push(line);
    }

    // Parse skills
    if (currentSection === 'skills' && line.startsWith('- **')) {
      const match = line.match(/- \*\*([^:]+):\*\*\s*(.+)/);
      if (match) {
        const category = match[1].trim();
        const items = match[2].split(',').map((s) => s.trim().replace(/\.$/, ''));
        resume.skills[category] = items;
      }
    }

    // Parse experience - company header
    if (currentSection === 'experience' && line.includes('**') && line.includes('|')) {
      if (currentCompany) {
        resume.experience.push(currentCompany);
      }

      // Format: **Company** | **Role** _Dates_
      const parts = line.split('|').map((p) => p.trim());
      const companyName = parts[0].replace(/\*\*/g, '').trim();
      const rolePart = parts[1] || '';

      const roleMatch = rolePart.match(/\*\*([^*]+)\*\*/);
      const dateMatch = rolePart.match(/_([^_]+)_/);

      currentCompany = {
        company: companyName,
        role: roleMatch ? roleMatch[1].trim() : '',
        dates: dateMatch ? dateMatch[1].trim() : '',
        achievements: [],
      };
      continue;
    }

    // Parse experience bullets
    if (currentSection === 'experience' && line.startsWith('- **') && currentCompany) {
      const bulletMatch = line.match(/- \*\*([^:]+):\*\*\s*(.+)/);
      if (bulletMatch) {
        currentCompany.achievements.push({
          title: bulletMatch[1].trim(),
          description: bulletMatch[2].trim(),
        });
      }
    }

    // Parse education entries
    // Format: - **Degree** | Institution | Year
    if (currentSection === 'education' && line.startsWith('- **')) {
      const eduMatch = line.match(/- \*\*([^*]+)\*\*\s*\|\s*([^|]+)\s*\|\s*(.+)/);
      if (eduMatch) {
        resume.education.push({
          degree: eduMatch[1].trim(),
          institution: eduMatch[2].trim(),
          year: eduMatch[3].trim(),
        });
      }
    }
  }

  // Add last company
  if (currentCompany) {
    resume.experience.push(currentCompany);
  }

  // Join summary lines and convert markdown
  resume.summary = parseMarkdown(summaryLines.join(' ').trim());

  // Convert markdown in all text fields
  resume.experience.forEach((job) => {
    job.achievements.forEach((achievement) => {
      achievement.title = parseMarkdown(achievement.title);
      achievement.description = parseMarkdown(achievement.description);
    });
  });

  return resume;
}

// Language configuration
const languages = [
  { code: 'en', file: 'RESUME.md', name: 'English', output: 'resume.yml' },
  { code: 'pt-BR', file: 'RESUME.pt-BR.md', name: 'Português', output: 'resume-pt-br.yml' },
];

// Main execution
try {
  // Create _data directory if it doesn't exist
  const dataDir = path.join(__dirname, '..', '_data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const processedLanguages = [];

  // Process each language
  languages.forEach((lang) => {
    const resumePath = path.join(__dirname, '..', lang.file);
    const outputPath = path.join(__dirname, '..', '_data', lang.output);

    // Check if file exists
    if (!fs.existsSync(resumePath)) {
      console.log(`⊘ Skipping ${lang.name} (${lang.file} not found)`);
      return;
    }

    // Read and parse resume
    const markdownContent = fs.readFileSync(resumePath, 'utf8');
    const resumeData = parseResume(markdownContent);

    // Write YAML file
    const yamlContent = yaml.dump(resumeData, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    fs.writeFileSync(outputPath, yamlContent, 'utf8');
    console.log(`✓ Resume parsed successfully (${lang.name}): _data/${lang.output}`);

    processedLanguages.push({
      code: lang.code,
      name: lang.name,
      exists: true,
    });
  });

  // Write languages metadata
  const languagesMetadata = {
    available: processedLanguages,
    default: 'en',
  };

  const metadataPath = path.join(__dirname, '..', '_data', 'languages.yml');
  fs.writeFileSync(metadataPath, yaml.dump(languagesMetadata), 'utf8');
  console.log(`✓ Languages metadata: _data/languages.yml`);

  if (processedLanguages.length === 0) {
    console.error('Error: No resume files found');
    process.exit(1);
  }
} catch (error) {
  console.error('Error parsing resume:', error.message);
  process.exit(1);
}

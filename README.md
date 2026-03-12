# Jekyll Resume Builder

A modern, ATS-compatible resume builder powered by Jekyll with PDF export functionality. Keep your resume up-to-date in a single markdown file (`RESUME.md`) and automatically generate a professional web page with PDF export capability.

## Features

- 📝 **Single Source of Truth**: Maintain your resume in `RESUME.md` with markdown formatting
- 🎨 **ATS-Compatible**: Clean, professional styling that works with Applicant Tracking Systems
- 📄 **Clean PDF Export**: Generate PDFs without browser headers/footers using html2pdf.js
- ✨ **Markdown Support**: Use bold, italic, and other markdown formatting in your resume
- 🚀 **Auto-Deploy**: Automatically builds and deploys to GitHub Pages when you update `RESUME.md`
- 🐳 **Docker Support**: Easy local development with Docker
- 🔄 **Live Reload**: See changes instantly during development

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd resume
   ```

2. **Start the development server**

   ```bash
   docker-compose up
   ```

3. **View your resume**
   Open [http://localhost:4000](http://localhost:4000) in your browser

### Option 2: Local Setup

#### Prerequisites

- Ruby 3.2+ ([Installation Guide](https://www.ruby-lang.org/en/documentation/installation/))
- Node.js 20+ ([Installation Guide](https://nodejs.org/))
- Bundler: `gem install bundler`

#### Setup

1. **Install dependencies**

   ```bash
   bundle install
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run serve
   ```

3. **View your resume**
   Open [http://localhost:4000](http://localhost:4000) in your browser

## Updating Your Resume

### English Version (Default)

1. **Edit RESUME.md**

   Update your resume information in the `RESUME.md` file. The parser will automatically extract:
   - Name and title
   - Contact information
   - Professional summary
   - Technical skills
   - Professional experience

### Adding Additional Languages

The resume builder supports multiple languages. To add a new language version:

1. **Create a language-specific file**

   For Portuguese (Brazil):

   ```bash
   cp RESUME.md RESUME.pt-BR.md
   ```

   For other languages, use appropriate language codes:
   - Spanish: `RESUME.es.md`
   - French: `RESUME.fr.md`
   - German: `RESUME.de.md`

2. **Translate the content**

   Edit your new language file and translate all content while keeping the same markdown structure.

3. **Update the parser configuration**

   Edit `scripts/parse-resume.js` and add your language to the `languages` array:

   ```javascript
   const languages = [
     { code: 'en', file: 'RESUME.md', name: 'English', output: 'resume.yml' },
     { code: 'pt-BR', file: 'RESUME.pt-BR.md', name: 'Português', output: 'resume-pt-br.yml' },
     // Add your language here
   ];
   ```

4. **Create a page for the new language**

   Copy `pt-br.html` and adjust the language code and data file reference.

### Language Switcher

- The language switcher appears automatically when multiple language files are detected
- It's visible on the web page but **hidden in PDF exports**
- Users can switch between languages seamlessly

2. **Preview changes**

   If using Docker:

   ```bash
   docker-compose up
   ```

   Or locally:

   ```bash
   npm run serve
   ```

3. **Commit and push**

   ```bash
   git add RESUME.md
   git commit -m "Update resume"
   git push
   ```

   The site will automatically rebuild and deploy via GitHub Actions.

## Exporting to PDF

The resume uses **html2pdf.js** to generate clean, professional PDFs without browser headers or footers.

### From the Web Interface

1. Visit your resume page
2. Click the **"Export to PDF"** button
3. The PDF will automatically download with no browser headers/footers

### Keyboard Shortcut

Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac) to trigger the PDF export.

### PDF Features

- ✅ No browser headers or footers
- ✅ Professional formatting
- ✅ ATS-compatible output
- ✅ Automatic filename based on your name
- ✅ Optimized for letter-size pages

## Page View Analytics

The resume includes hidden page view counters that track how many times each language version has been viewed. The counters are completely invisible to visitors, maintaining a professional appearance.

### Viewing Page Counts

Check your page view statistics at any time:

**English Resume:**

```
https://hits.sh/studiojms.github.io/resume.svg?label=Views&style=flat
```

**Portuguese Resume:**

```
https://hits.sh/studiojms.github.io/resume/pt-br.svg?label=Views&style=flat
```

### How It Works

- Each language version tracks visits separately
- Counters are hidden from visitors (no visual impact on the resume)
- The count starts from deployment and increments with each page load
- View the badge URLs above anytime to see current counts
- No configuration or API keys required

### Optional: Display Counters Publicly

If you want to show the view count on your resume, you can make the counters visible by:

1. Open the HTML file (`index.html` or `pt-br.html`)
2. Find the page view counter `<img>` tag near the bottom
3. Remove the `style="display:none;"` attribute

The view counter will then appear as a small badge on the page.

## Deploying to GitHub Pages

### Initial Setup

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "GitHub Actions"

2. **Update \_config.yml**

   Edit `_config.yml` and set your URL and baseurl:

   ```yaml
   url: 'https://yourusername.github.io'
   baseurl: '/resume' # Only if using a project page
   ```

3. **Push to main branch**
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will automatically build and deploy your resume.

### Accessing Your Resume

Your resume will be available at:

- User page: `https://yourusername.github.io`
- Project page: `https://yourusername.github.io/resume`
- Portuguese version: `https://yourusername.github.io/pt-br` (or `/resume/pt-br`)

## Project Structure

```
resume/
├── RESUME.md                    # English resume (default)
├── RESUME.pt-BR.md              # Portuguese resume (optional)
├── _config.yml                  # Jekyll configuration
├── _data/
│   ├── resume.yml              # Auto-generated English data
│   ├── resume-pt-br.yml        # Auto-generated Portuguese data
│   └── languages.yml           # Language metadata
├── _includes/
│   └── language-switcher.html  # Language switcher component
├── _layouts/
│   └── default.html            # HTML layout
├── assets/
│   ├── css/
│   │   └── style.css           # ATS-compatible styles
│   └── js/
│       └── pdf-export.js       # PDF export functionality
├── scripts/
│   └── parse-resume.js         # Multi-language resume parser
├── index.html                   # English resume page
├── pt-br.html                   # Portuguese resume page
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose configuration
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions workflow
├── \_layouts/
│ └── default.html # HTML layout
├── assets/
│ ├── css/
│ │ └── style.css # ATS-compatible styles
│ └── js/
│ └── pdf-export.js # PDF export functionality
├── scripts/
│ └── parse-resume.js # Resume parser
├── index.html # Main resume page
├── Dockerfile # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── .github/
└── workflows/
└── deploy.yml # GitHub Actions workflow

```

## Development

### NPM Scripts

- `npm run parse` - Parse RESUME.md into structured YAML
- `npm run build` - Build the Jekyll site
- `npm run serve` - Start development server with live reload
- `npm run deploy` - Build for production

### Docker Commands

- `docker-compose up` - Start development server
- `docker-compose up --build` - Rebuild and start
- `docker-compose down` - Stop server

### Manual Build

```bash
npm run parse
bundle exec jekyll build
```

The generated site will be in the `_site` directory.

## Customization

### Styling

Edit `assets/css/style.css` to customize the appearance. The current styles are optimized for:

- ATS compatibility (clean, semantic HTML)
- Print/PDF export (proper page breaks, margins)
- Professional appearance

### Resume Parser

The parser (`scripts/parse-resume.js`) converts `RESUME.md` into structured YAML. Modify this file if you need to parse additional sections or change the data structure.

### Layout

Edit `index.html` and `_layouts/default.html` to change the resume structure and layout.

## Troubleshooting

### Resume not updating

Run the parser manually:

```bash
npm run parse
```

Check `_data/resume.yml` to verify the data was extracted correctly.

### Docker build fails

Rebuild the container:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### GitHub Actions deployment fails

1. Ensure GitHub Pages is enabled in repository settings
2. Check that the Actions have write permissions
3. Review the workflow logs in the "Actions" tab

### PDF export issues

- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check print preview before saving
- Adjust print settings if needed (margins, scale)

## ATS Compatibility

This resume builder is designed to be ATS-friendly:

- ✅ Semantic HTML structure
- ✅ Standard fonts (system fonts)
- ✅ Clear heading hierarchy
- ✅ No tables for layout
- ✅ Clean, readable text
- ✅ Proper spacing and margins
- ✅ No complex CSS that might break parsing

## License

MIT License - feel free to use this for your own resume!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

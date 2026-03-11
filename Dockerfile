FROM ruby:3.2-slim

# Install Node.js and system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency files
COPY Gemfile* ./
COPY package*.json ./

# Install Ruby and Node dependencies
RUN bundle install
RUN npm install

# Copy project files
COPY . .

# Parse resume and build site
RUN npm run parse
RUN bundle exec jekyll build

# Expose Jekyll default port
EXPOSE 4000

# Start Jekyll server with live reload
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]

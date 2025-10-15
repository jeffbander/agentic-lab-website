#!/usr/bin/env node

/**
 * Interactive CLI setup tool for Video Generator
 * Sets up Replicate API (works with any cloud provider)
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function printHeader() {
  console.log('\n' + '='.repeat(60));
  console.log('🎬 Mount Sinai Video Generator Setup');
  console.log('='.repeat(60) + '\n');
}

function printSection(title) {
  console.log('\n' + '-'.repeat(60));
  console.log(`  ${title}`);
  console.log('-'.repeat(60) + '\n');
}

async function main() {
  printHeader();

  console.log('This tool will help you set up AI video generation using Replicate API.');
  console.log('Replicate works with ANY cloud provider (GCP, AWS, Azure, or none!).\n');

  // Step 1: Check if they have a Replicate account
  printSection('Step 1: Replicate Account');
  console.log('Do you have a Replicate account?');
  console.log('  Yes: Type "yes"');
  console.log('  No:  Type "no" (we\'ll guide you through creating one)\n');

  const hasAccount = await question('Your answer: ');

  if (hasAccount.toLowerCase() !== 'yes') {
    console.log('\n📝 Creating a Replicate Account:\n');
    console.log('1. Go to: https://replicate.com');
    console.log('2. Click "Sign up" (can use Google/GitHub)');
    console.log('3. Confirm your email');
    console.log('4. You get FREE credits to start!\n');

    const ready = await question('Press Enter when you\'ve created your account...');
  }

  // Step 2: Get API token
  printSection('Step 2: Get Your Replicate API Token');
  console.log('1. Go to: https://replicate.com/account/api-tokens');
  console.log('2. Click "Create token"');
  console.log('3. Give it a name: "Mount Sinai Video Generator"');
  console.log('4. Copy the token (starts with "r8_...")\n');

  const apiToken = await question('Paste your Replicate API token here: ');

  if (!apiToken || !apiToken.startsWith('r8_')) {
    console.log('\n❌ Error: That doesn\'t look like a valid Replicate token.');
    console.log('Tokens should start with "r8_"');
    console.log('Please run this script again.\n');
    rl.close();
    return;
  }

  // Step 3: Choose environment
  printSection('Step 3: Where to Configure');
  console.log('Where do you want to configure the API token?');
  console.log('  1. Local development (.env file)');
  console.log('  2. Netlify production');
  console.log('  3. Both\n');

  const envChoice = await question('Your choice (1, 2, or 3): ');

  // Create .env file if local
  if (envChoice === '1' || envChoice === '3') {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = `# Replicate API Configuration
REPLICATE_API_TOKEN=${apiToken}

# Google Analytics (optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
`;

    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Created .env file with your Replicate API token');

    // Check .gitignore
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      if (!gitignoreContent.includes('.env')) {
        fs.appendFileSync(gitignorePath, '\n.env\n');
        console.log('✅ Added .env to .gitignore (keeping your token secure)');
      }
    }
  }

  // Netlify instructions
  if (envChoice === '2' || envChoice === '3') {
    printSection('Netlify Configuration');
    console.log('To configure Netlify (production):');
    console.log('\n1. Go to: https://app.netlify.com');
    console.log('2. Select your site');
    console.log('3. Go to: Site settings > Environment variables');
    console.log('4. Click "Add a variable"');
    console.log('5. Add this variable:');
    console.log(`   Name:  REPLICATE_API_TOKEN`);
    console.log(`   Value: ${apiToken.substring(0, 10)}... (your full token)`);
    console.log('6. Click "Save"\n');

    await question('Press Enter when you\'ve configured Netlify...');
  }

  // Step 4: Cost estimation
  printSection('Step 4: Cost Estimation');
  console.log('Replicate Sora 2 Pricing:');
  console.log('  • 720p (Standard):  $0.10 per second  ($1.20 for 12-second video)');
  console.log('  • 1080p (Pro):      $0.50 per second  ($6.00 for 12-second video)');
  console.log('\nYou get FREE credits to start testing!');
  console.log('Typical usage: 10-20 videos = $12-120 depending on length/quality\n');

  // Step 5: Test connection
  printSection('Step 5: Test Your Setup');
  console.log('Let\'s test your Replicate API connection...\n');

  try {
    const testResponse = await fetch('https://api.replicate.com/v1/models', {
      headers: {
        'Authorization': `Token ${apiToken}`
      }
    });

    if (testResponse.ok) {
      console.log('✅ SUCCESS! Your Replicate API connection works!\n');
    } else {
      console.log('⚠️  Warning: API test returned status', testResponse.status);
      console.log('Your token is saved, but you may need to check your account.\n');
    }
  } catch (error) {
    console.log('⚠️  Could not test connection (network issue)');
    console.log('Your token is saved and should work once deployed.\n');
  }

  // Final instructions
  printSection('✅ Setup Complete!');
  console.log('Next steps:');
  console.log('\n1. Start your dev server:');
  console.log('   npm run dev');
  console.log('\n2. Navigate to:');
  console.log('   http://localhost:5173/#video-generator');
  console.log('\n3. Click a preset prompt and generate your first video!');
  console.log('\n4. To deploy to production:');
  console.log('   git push (Netlify will auto-deploy)');

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Happy video generating!');
  console.log('='.repeat(60) + '\n');

  console.log('Useful links:');
  console.log('  • Replicate Dashboard: https://replicate.com/account');
  console.log('  • Sora 2 Model: https://replicate.com/openai/sora-2');
  console.log('  • Documentation: VIDEO_GENERATOR_SETUP.md\n');

  rl.close();
}

main().catch(error => {
  console.error('\n❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});

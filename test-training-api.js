// Test script for training API endpoints
const BASE_URL = 'http://localhost:3000/api';

// Admin credentials for testing
const adminCredentials = {
  email: 'admin@drinsurance.com',
  password: 'AdminDR2024!'
};

let authToken = null;

async function login() {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminCredentials)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    // Extract cookie from response
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      const tokenMatch = cookies.match(/token=([^;]+)/);
      if (tokenMatch) {
        authToken = tokenMatch[1];
      }
    }
    
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login error:', error);
    return false;
  }
}

async function testGetSections() {
  console.log('\n📋 Testing GET /training/sections...');
  
  try {
    const response = await fetch(`${BASE_URL}/training/sections`, {
      headers: {
        'Cookie': `token=${authToken}`
      }
    });
    
    const data = await response.json();
    console.log('✅ Sections retrieved:', data.length, 'sections');
    console.log('Sample:', data[0]);
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

async function testGetTree() {
  console.log('\n🌳 Testing GET /training/tree...');
  
  try {
    const response = await fetch(`${BASE_URL}/training/tree`, {
      headers: {
        'Cookie': `token=${authToken}`
      }
    });
    
    const data = await response.json();
    console.log('✅ Tree retrieved');
    console.log('Stats:', data.stats);
    console.log('Root sections:', data.tree.length);
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

async function testValidateUrl() {
  console.log('\n🔗 Testing POST /training/validate-url...');
  
  const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://vimeo.com/123456789',
    'https://drive.google.com/file/d/1234567890abcdef/view',
    'https://example.com/document.pdf'
  ];
  
  for (const url of testUrls) {
    try {
      const response = await fetch(`${BASE_URL}/training/validate-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${authToken}`
        },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      console.log(`✅ ${url.substring(0, 30)}...`);
      console.log(`   Type: ${data.resourceType}, Platform: ${data.platform}`);
    } catch (error) {
      console.error(`❌ Error validating ${url}:`, error);
    }
  }
  
  return true;
}

async function testCreateSection() {
  console.log('\n➕ Testing POST /training/sections...');
  
  try {
    const response = await fetch(`${BASE_URL}/training/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${authToken}`
      },
      body: JSON.stringify({
        name: 'Test Section',
        description: 'This is a test section created via API',
        order: 99
      })
    });
    
    const data = await response.json();
    console.log('✅ Section created:', data);
    return data.id;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Training API Tests...\n');
  
  // Login first
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('Cannot proceed without authentication');
    return;
  }
  
  // Run tests
  await testGetSections();
  await testGetTree();
  await testValidateUrl();
  const newSectionId = await testCreateSection();
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}
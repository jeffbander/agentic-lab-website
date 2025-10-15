// Test the video generation function endpoint

async function testVideoFunction() {
  console.log('🧪 Testing Video Generation Function...\n');

  const testPayload = {
    prompt: "A cinematic aerial shot of Mount Sinai West Hospital in New York City",
    width: 1920,
    height: 1080,
    duration: 10
  };

  try {
    console.log('📤 Sending request to http://localhost:8888/api/generate-video');
    console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));

    const response = await fetch('http://localhost:8888/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log('\n📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('\n✅ Response data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n🎉 SUCCESS! Video generation started');
      console.log('🎬 Video URL will be:', data.videoUrl || 'pending...');
    } else {
      console.log('\n⚠️  Request completed but not successful');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testVideoFunction();

// Test script for voice complaint functionality
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Test endpoint for voice complaints
app.post('/api/test-voice', (req, res) => {
  const { transcript } = req.body;
  
  console.log('Voice transcript received:', transcript);
  
  // Simulate complaint parsing
  const parsedComplaint = parseVoiceComplaint(transcript);
  
  res.json({
    success: true,
    parsed: parsedComplaint,
    message: 'Voice complaint processed successfully'
  });
});

// Parse voice input to extract complaint components
function parseVoiceComplaint(transcript) {
  const complaint = {
    summary: '',
    fullText: transcript,
    category: 'General'
  };

  // Extract summary (first sentence or key phrases)
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim());
  if (sentences.length > 0) {
    complaint.summary = sentences[0].trim();
  }

  // Detect category based on keywords
  const lowerTranscript = transcript.toLowerCase();
  
  if (lowerTranscript.includes('technical') || lowerTranscript.includes('bug') || lowerTranscript.includes('error')) {
    complaint.category = 'Technical';
  } else if (lowerTranscript.includes('service') || lowerTranscript.includes('customer') || lowerTranscript.includes('support')) {
    complaint.category = 'Customer Service';
  } else if (lowerTranscript.includes('billing') || lowerTranscript.includes('payment') || lowerTranscript.includes('charge')) {
    complaint.category = 'Billing';
  } else if (lowerTranscript.includes('product') || lowerTranscript.includes('quality') || lowerTranscript.includes('defect')) {
    complaint.category = 'Product';
  } else if (lowerTranscript.includes('website') || lowerTranscript.includes('app') || lowerTranscript.includes('interface')) {
    complaint.category = 'User Interface';
  }

  return complaint;
}

// Serve test page
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Voice Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        button { padding: 10px 20px; margin: 10px; font-size: 16px; }
        #output { margin-top: 20px; padding: 10px; border: 1px solid #ccc; min-height: 100px; }
      </style>
    </head>
    <body>
      <h1>Voice Complaint Test</h1>
      <button onclick="startVoiceTest()">🎤 Test Voice Recognition</button>
      <button onclick="testParsing()">🧪 Test Complaint Parsing</button>
      <div id="output"></div>
      
      <script>
        function startVoiceTest() {
          if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            document.getElementById('output').innerHTML = 'Speech recognition not supported';
            return;
          }

          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          
          recognition.onstart = () => {
            document.getElementById('output').innerHTML = 'Listening... Speak your complaint';
          };
          
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('output').innerHTML = 'Transcript: ' + transcript;
            
            // Test the parsing
            fetch('/api/test-voice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transcript })
            })
            .then(res => res.json())
            .then(data => {
              document.getElementById('output').innerHTML += '<br><br>Parsed: ' + JSON.stringify(data.parsed, null, 2);
            });
          };
          
          recognition.onerror = (event) => {
            document.getElementById('output').innerHTML = 'Error: ' + event.error;
          };
          
          recognition.start();
        }
        
        function testParsing() {
          const testTranscripts = [
            'I have a technical issue with the website crashing',
            'The customer service was terrible yesterday',
            'I was charged twice for my billing this month',
            'The product quality is not what I expected',
            'The app interface is confusing to use'
          ];
          
          const randomTranscript = testTranscripts[Math.floor(Math.random() * testTranscripts.length)];
          
          fetch('/api/test-voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: randomTranscript })
          })
          .then(res => res.json())
          .then(data => {
            document.getElementById('output').innerHTML = 'Test Transcript: ' + randomTranscript + '<br><br>Parsed: ' + JSON.stringify(data.parsed, null, 2);
          });
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(5001, () => {
  console.log('Voice test server running on http://localhost:5001/test');
}); 
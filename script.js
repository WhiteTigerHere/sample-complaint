// Global variables for Omnidim integration
let omnidimWidget = null;
let isListening = false;
let isRecording = false;
let currentRecording = null;
let recordingChunks = [];
let mediaRecorder = null;

// Initialize Omnidim widget when it loads
function initializeOmnidim() {
  // Wait for Omnidim widget to be available
  if (typeof window.OmnidimWidget !== 'undefined') {
    omnidimWidget = window.OmnidimWidget;
    setupVoiceComplaintHandling();
    updateUI('Voice agent ready! Click the voice button to start.');
  } else {
    // Check if the script has loaded
    const script = document.getElementById('omnidimension-web-widget');
    if (script && script.complete) {
      // Script loaded but widget not available, retry
      setTimeout(initializeOmnidim, 1000);
    } else {
      // Script still loading, wait longer
      setTimeout(initializeOmnidim, 2000);
    }
  }
}

// Setup voice complaint handling
function setupVoiceComplaintHandling() {
  if (!omnidimWidget) return;

  // Listen for voice input events
  omnidimWidget.on('voiceInput', handleVoiceInput);
  omnidimWidget.on('voiceStart', () => {
    isListening = true;
    updateUI('Listening... Speak your complaint');
    showListeningIndicator(true);
  });
  
  omnidimWidget.on('voiceEnd', () => {
    isListening = false;
    updateUI('Processing your complaint...');
    showListeningIndicator(false);
  });

  // Handle complaint submission from voice
  omnidimWidget.on('complaintSubmitted', handleComplaintSubmission);
  
  // Handle voice analysis from Omnidim
  omnidimWidget.on('voiceAnalysis', handleVoiceAnalysis);
}

// Handle voice analysis from Omnidim
function handleVoiceAnalysis(analysis) {
  console.log('Omnidim voice analysis received:', analysis);
  
  // Extract sentiment, intent, and other analysis data
  const { sentiment, intent, confidence, entities, transcript } = analysis;
  
  // Update UI with analysis results
  updateVoiceAnalysis(analysis);
  
  // Use the analysis to enhance complaint parsing
  if (transcript) {
    const enhancedComplaint = parseVoiceComplaintWithAnalysis(transcript, analysis);
    updateFormWithEnhancedData(enhancedComplaint);
  }
}

// Parse voice input with Omnidim analysis
function parseVoiceComplaintWithAnalysis(transcript, analysis) {
  const complaint = {
    summary: '',
    fullText: transcript,
    category: 'General',
    sentiment: analysis.sentiment || 'neutral',
    confidence: analysis.confidence || 0,
    intent: analysis.intent || 'complaint',
    entities: analysis.entities || []
  };

  // Extract summary (first sentence or key phrases)
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim());
  if (sentences.length > 0) {
    complaint.summary = sentences[0].trim();
  }

  // Use Omnidim analysis to determine category
  if (analysis.intent) {
    switch (analysis.intent.toLowerCase()) {
      case 'technical_issue':
      case 'bug_report':
        complaint.category = 'Technical';
        break;
      case 'customer_service':
      case 'support_request':
        complaint.category = 'Customer Service';
        break;
      case 'billing_issue':
      case 'payment_problem':
        complaint.category = 'Billing';
        break;
      case 'product_quality':
      case 'defect_report':
        complaint.category = 'Product';
        break;
      case 'ui_issue':
      case 'interface_problem':
        complaint.category = 'User Interface';
        break;
    }
  }

  // Fallback to keyword-based categorization
  if (complaint.category === 'General') {
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
  }

  return complaint;
}

// Update form with enhanced data from Omnidim analysis
function updateFormWithEnhancedData(complaint) {
  if (complaint.summary) {
    document.getElementById('summary').value = complaint.summary;
  }
  if (complaint.fullText) {
    document.getElementById('fullText').value = complaint.fullText;
  }
  if (complaint.category) {
    document.getElementById('category').value = complaint.category;
  }
  
  // Add sentiment indicator
  updateSentimentIndicator(complaint.sentiment);
  
  updateUI('Complaint analyzed and parsed. Review and submit.');
}

// Update sentiment indicator
function updateSentimentIndicator(sentiment) {
  let sentimentDiv = document.getElementById('sentimentIndicator');
  if (!sentimentDiv) {
    sentimentDiv = document.createElement('div');
    sentimentDiv.id = 'sentimentIndicator';
    sentimentDiv.style.cssText = `
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      font-weight: bold;
    `;
    document.querySelector('.voice-section').appendChild(sentimentDiv);
  }
  
  const sentimentColors = {
    positive: '#4CAF50',
    negative: '#f44336',
    neutral: '#2196F3'
  };
  
  sentimentDiv.style.backgroundColor = sentimentColors[sentiment] || sentimentColors.neutral;
  sentimentDiv.style.color = 'white';
  sentimentDiv.textContent = `Sentiment: ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}`;
}

// Update voice analysis display
function updateVoiceAnalysis(analysis) {
  let analysisDiv = document.getElementById('voiceAnalysis');
  if (!analysisDiv) {
    analysisDiv = document.createElement('div');
    analysisDiv.id = 'voiceAnalysis';
    analysisDiv.style.cssText = `
      background: #f5f5f5;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      border-left: 4px solid #2196F3;
    `;
    document.querySelector('.voice-section').appendChild(analysisDiv);
  }
  
  analysisDiv.innerHTML = `
    <h4>🎤 Voice Analysis Results:</h4>
    <p><strong>Confidence:</strong> ${(analysis.confidence * 100).toFixed(1)}%</p>
    <p><strong>Intent:</strong> ${analysis.intent || 'Not detected'}</p>
    <p><strong>Sentiment:</strong> ${analysis.sentiment || 'Neutral'}</p>
    ${analysis.entities ? `<p><strong>Entities:</strong> ${analysis.entities.join(', ')}</p>` : ''}
  `;
}

// Handle voice input and parse complaint
function handleVoiceInput(transcript) {
  console.log('Voice input received:', transcript);
  
  // Parse the voice input to extract complaint details
  const parsedComplaint = parseVoiceComplaint(transcript);
  
  // Update form fields with parsed data
  if (parsedComplaint.summary) {
    document.getElementById('summary').value = parsedComplaint.summary;
  }
  if (parsedComplaint.fullText) {
    document.getElementById('fullText').value = parsedComplaint.fullText;
  }
  if (parsedComplaint.category) {
    document.getElementById('category').value = parsedComplaint.category;
  }
  
  updateUI('Complaint parsed from voice. Review and submit.');
}

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

// Handle complaint submission from voice agent
function handleComplaintSubmission(complaintData) {
  console.log('Complaint submitted via voice:', complaintData);
  
  // Submit the complaint to the server
  submitComplaintFromVoice(complaintData);
}

// Submit complaint from voice input
function submitComplaintFromVoice(complaintData) {
  const { summary, fullText, category } = complaintData;
  
  fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      summary: summary || 'Voice Complaint', 
      full_text: fullText, 
      category: category || 'General' 
    })
  })
  .then(res => res.json())
  .then(data => {
    updateUI('Voice complaint submitted successfully!');
    clearForm();
  })
  .catch(err => {
    console.error('Error submitting voice complaint:', err);
    updateUI('Error submitting voice complaint');
  });
}

// Enhanced voice recording functions
async function startVoiceRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordingChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      recordingChunks.push(event.data);
    };
    
    mediaRecorder.onstart = () => {
      isRecording = true;
      updateRecordingUI();
      updateUI('Recording started. Speak your complaint.');
    };
    
    mediaRecorder.onstop = () => {
      isRecording = false;
      updateRecordingUI();
      const audioBlob = new Blob(recordingChunks, { type: 'audio/wav' });
      currentRecording = URL.createObjectURL(audioBlob);
      updateUI('Recording completed. You can play, pause, or submit.');
    };
    
    mediaRecorder.start();
    updateRecordingControls();
    
  } catch (error) {
    console.error('Error starting recording:', error);
    updateUI('Error accessing microphone. Please check permissions.');
  }
}

function pauseVoiceRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.pause();
    updateUI('Recording paused.');
  }
}

function resumeVoiceRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.resume();
    updateUI('Recording resumed.');
  }
}

function stopVoiceRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
}

function playRecording() {
  if (currentRecording) {
    const audio = new Audio(currentRecording);
    audio.play();
    updateUI('Playing recording...');
  }
}

function submitRecording() {
  if (currentRecording) {
    // Convert audio to text using Web Speech API or send to server
    updateUI('Processing recording for text extraction...');
    
    // For now, we'll use the fallback voice recognition
    startFallbackVoiceInput();
  } else {
    updateUI('No recording available to submit.');
  }
}

function updateRecordingUI() {
  const recordBtn = document.getElementById('recordBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const stopBtn = document.getElementById('stopBtn');
  const playBtn = document.getElementById('playBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  if (isRecording) {
    recordBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    resumeBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    playBtn.style.display = 'none';
    submitBtn.style.display = 'none';
  } else {
    recordBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    if (currentRecording) {
      playBtn.style.display = 'inline-block';
      submitBtn.style.display = 'inline-block';
    }
  }
}

function updateRecordingControls() {
  const voiceSection = document.querySelector('.voice-section');
  
  // Remove existing controls if any
  const existingControls = document.getElementById('recordingControls');
  if (existingControls) {
    existingControls.remove();
  }
  
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'recordingControls';
  controlsDiv.style.cssText = `
    margin-top: 15px;
    padding: 15px;
    background: #e8f5e8;
    border-radius: 8px;
    border: 2px solid #4CAF50;
  `;
  
  controlsDiv.innerHTML = `
    <h4>🎙️ Recording Controls:</h4>
    <button id="recordBtn" onclick="startVoiceRecording()" style="background: #f44336;">🔴 Start Recording</button>
    <button id="pauseBtn" onclick="pauseVoiceRecording()" style="background: #ff9800; display: none;">⏸️ Pause</button>
    <button id="resumeBtn" onclick="resumeVoiceRecording()" style="background: #ff9800; display: none;">▶️ Resume</button>
    <button id="stopBtn" onclick="stopVoiceRecording()" style="background: #2196F3; display: none;">⏹️ Stop</button>
    <button id="playBtn" onclick="playRecording()" style="background: #4CAF50; display: none;">🔊 Play</button>
    <button id="submitBtn" onclick="submitRecording()" style="background: #9C27B0; display: none;">📤 Submit Recording</button>
  `;
  
  voiceSection.appendChild(controlsDiv);
}

// Update UI with status messages
function updateUI(message) {
  const statusDiv = document.getElementById('status') || createStatusDiv();
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}

// Create status div if it doesn't exist
function createStatusDiv() {
  const statusDiv = document.createElement('div');
  statusDiv.id = 'status';
  statusDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px;
    border-radius: 5px;
    z-index: 1000;
    display: none;
  `;
  document.body.appendChild(statusDiv);
  return statusDiv;
}

// Clear form fields
function clearForm() {
  document.getElementById('summary').value = '';
  document.getElementById('fullText').value = '';
  document.getElementById('category').value = '';
  
  // Clear analysis displays
  const sentimentDiv = document.getElementById('sentimentIndicator');
  const analysisDiv = document.getElementById('voiceAnalysis');
  if (sentimentDiv) sentimentDiv.remove();
  if (analysisDiv) analysisDiv.remove();
  
  // Clear recording
  currentRecording = null;
  updateRecordingUI();
}

// Original submitComplaint function
function submitComplaint() {
  const summary = document.getElementById('summary').value;
  const fullText = document.getElementById('fullText').value;
  const category = document.getElementById('category').value;

  if (!summary || !fullText) {
    updateUI('Please fill in all required fields');
    return;
  }

  fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary, full_text: fullText, category })
  })
  .then(res => res.json())
  .then(data => {
    updateUI(data.message || 'Complaint submitted!');
    clearForm();
  })
  .catch(err => {
    console.error(err);
    updateUI('Error submitting complaint');
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Omnidim integration
  initializeOmnidim();
  
  // Add recording controls
  updateRecordingControls();
});

// Show/hide listening indicator
function showListeningIndicator(show) {
  const indicator = document.getElementById('listeningIndicator');
  if (indicator) {
    if (show) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  }
}

// Start voice complaint
function startVoiceComplaint() {
  if (omnidimWidget) {
    omnidimWidget.startVoiceInput();
  } else {
    // Fallback to Web Speech API
    startFallbackVoiceInput();
  }
}

// Fallback voice input using Web Speech API
function startFallbackVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    updateUI('Voice recognition not supported in this browser. Please use manual input.');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    showListeningIndicator(true);
    updateUI('Listening... Speak your complaint');
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    handleVoiceInput(transcript);
    showListeningIndicator(false);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    updateUI('Voice recognition error. Please try again or use manual input.');
    showListeningIndicator(false);
  };
  
  recognition.onend = () => {
    showListeningIndicator(false);
  };
  
  recognition.start();
}

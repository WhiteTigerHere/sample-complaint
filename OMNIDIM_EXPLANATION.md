# Omnidim Voice Agent Integration Explanation

## How Omnidim Works in Your ConnectiZen System

### 🔍 **What is Omnidim?**

Omnidim is an AI-powered voice agent that provides:
- **Real-time voice recognition** and transcription
- **Natural language processing** (NLP) for intent detection
- **Sentiment analysis** of voice input
- **Entity extraction** from speech
- **Confidence scoring** for accuracy assessment

### 🎯 **Current Integration Status**

In your ConnectiZen system, Omnidim is integrated through:

```html
<script
  id="omnidimension-web-widget"
  async
  src="https://backend.omnidim.io/web_widget.js?secret_key=1eb03deb8bcb130127c84c5dacbb3542">
</script>
```

### 📊 **What Omnidim Returns**

When you speak a complaint, Omnidim analyzes your voice and returns:

```javascript
{
  "transcript": "I have a technical issue with the website crashing",
  "sentiment": "negative",
  "intent": "technical_issue",
  "confidence": 0.95,
  "entities": ["website", "crashing"],
  "language": "en-US",
  "duration": 3.2
}
```

### 🔧 **How the Integration Works**

#### 1. **Initialization Process**
```javascript
function initializeOmnidim() {
  if (typeof window.OmnidimWidget !== 'undefined') {
    omnidimWidget = window.OmnidimWidget;
    setupVoiceComplaintHandling();
  }
}
```

#### 2. **Event Handling**
The system listens for these Omnidim events:
- `voiceInput`: Raw transcript from speech
- `voiceStart`: Recording begins
- `voiceEnd`: Recording stops
- `voiceAnalysis`: Detailed analysis results
- `complaintSubmitted`: Direct complaint submission

#### 3. **Analysis Processing**
```javascript
function handleVoiceAnalysis(analysis) {
  const { sentiment, intent, confidence, entities, transcript } = analysis;
  
  // Update UI with analysis results
  updateVoiceAnalysis(analysis);
  
  // Enhanced complaint parsing
  const enhancedComplaint = parseVoiceComplaintWithAnalysis(transcript, analysis);
  updateFormWithEnhancedData(enhancedComplaint);
}
```

### 🎤 **Voice Analysis Features**

#### **Sentiment Analysis**
- **Positive**: Happy, satisfied, grateful
- **Negative**: Angry, frustrated, disappointed
- **Neutral**: Factual, calm, indifferent

#### **Intent Detection**
- `technical_issue`: Bug reports, system problems
- `customer_service`: Support requests, service complaints
- `billing_issue`: Payment problems, charges
- `product_quality`: Quality complaints, defects
- `ui_issue`: Interface problems, usability

#### **Entity Extraction**
- Identifies key terms: "website", "payment", "customer service"
- Extracts product names, error codes, dates
- Recognizes company names, locations

### 🚀 **Enhanced Features Added**

#### **1. Recording Controls**
- **Start Recording**: Begin voice capture
- **Pause/Resume**: Control recording flow
- **Stop Recording**: End capture
- **Play Recording**: Review what was recorded
- **Submit Recording**: Process for analysis

#### **2. Visual Feedback**
- **Sentiment Indicator**: Color-coded mood display
- **Analysis Results**: Detailed breakdown
- **Confidence Score**: Accuracy percentage
- **Intent Display**: Detected purpose

#### **3. Smart Categorization**
```javascript
// Uses Omnidim intent for better categorization
if (analysis.intent) {
  switch (analysis.intent.toLowerCase()) {
    case 'technical_issue':
      complaint.category = 'Technical';
      break;
    case 'customer_service':
      complaint.category = 'Customer Service';
      break;
    // ... more cases
  }
}
```

### 🔄 **Fallback System**

If Omnidim is unavailable, the system automatically falls back to:

1. **Web Speech API**: Browser's built-in speech recognition
2. **Manual Input**: Traditional form entry
3. **Recording Playback**: Review recorded audio

### 📈 **Benefits of Omnidim Integration**

#### **For Users:**
- **Natural Interaction**: Speak naturally, no training needed
- **Instant Feedback**: Real-time analysis and categorization
- **Better Accuracy**: AI-powered intent detection
- **Emotion Recognition**: Sentiment analysis for priority

#### **For System:**
- **Automated Categorization**: Reduces manual sorting
- **Priority Detection**: Sentiment-based urgency
- **Quality Assurance**: Confidence scoring
- **Data Enrichment**: Entity extraction for better insights

### 🛠 **Technical Implementation**

#### **Event Flow:**
1. User clicks "Start Voice Complaint"
2. Omnidim widget initializes
3. User speaks complaint
4. Omnidim processes audio in real-time
5. Analysis results returned
6. Form auto-filled with parsed data
7. User reviews and submits

#### **Data Processing:**
```javascript
// Enhanced parsing with Omnidim analysis
function parseVoiceComplaintWithAnalysis(transcript, analysis) {
  return {
    summary: extractSummary(transcript),
    fullText: transcript,
    category: determineCategory(analysis.intent),
    sentiment: analysis.sentiment,
    confidence: analysis.confidence,
    entities: analysis.entities
  };
}
```

### 🔍 **Debugging Omnidim**

#### **Check if Omnidim is Working:**
1. Open browser console
2. Look for "Omnidim voice analysis received" messages
3. Check for widget initialization logs
4. Verify network requests to Omnidim servers

#### **Common Issues:**
- **Network Problems**: Check internet connection
- **API Key Issues**: Verify secret key is valid
- **Browser Compatibility**: Ensure modern browser
- **Microphone Permissions**: Allow microphone access

### 📊 **Performance Metrics**

Omnidim typically provides:
- **Accuracy**: 95%+ transcription accuracy
- **Speed**: Real-time processing (< 1 second)
- **Languages**: Multiple language support
- **Confidence**: 0.0-1.0 scoring system

### 🎯 **Future Enhancements**

#### **Planned Features:**
1. **Multi-language Support**: Automatic language detection
2. **Voice Biometrics**: Speaker identification
3. **Emotion Tracking**: Real-time mood analysis
4. **Context Awareness**: Previous complaint memory
5. **Smart Routing**: Automatic department assignment

### 📝 **Configuration Options**

#### **Omnidim Settings:**
```javascript
// Available configuration options
const omnidimConfig = {
  language: 'en-US',
  confidenceThreshold: 0.7,
  enableSentiment: true,
  enableEntities: true,
  enableIntent: true,
  maxRecordingTime: 60 // seconds
};
```

This integration transforms your complaint system from a simple form into an intelligent, voice-powered complaint management platform with advanced AI analysis capabilities. 
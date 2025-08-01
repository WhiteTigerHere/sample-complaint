# ConnectiZen Complaint Portal

A modern complaint management system with voice-enabled complaint submission using Omnidim voice agent.

## Features

- 🎤 **Voice Complaint Submission**: Speak your complaints using the Omnidim voice agent
- 📝 **Manual Complaint Entry**: Traditional form-based complaint submission
- 🗄️ **Database Storage**: MySQL database for complaint persistence
- 🎨 **Modern UI**: Beautiful, responsive interface
- 🔄 **Auto-categorization**: Automatic complaint categorization based on voice input
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Database Setup

First, set up your MySQL database:

```sql
-- Run the mysql_script.sql file to create the database and tables
mysql -u your_username -p < mysql_script.sql
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password

# Server Configuration
PORT=5000

# Omnidim Configuration
OMNIDIM_SECRET_KEY=1eb03deb8bcb130127c84c5dacbb3542
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
node server.js
```

The application will be available at `http://localhost:5000`

## Voice Complaint Features

### How Voice Complaints Work

#### **Option 1: Direct Voice Input**
1. **Click the Voice Button**: Click "🎤 Start Voice Complaint" to begin
2. **Speak Your Complaint**: Clearly describe your issue when prompted
3. **Auto-Parsing**: The system automatically:
   - Extracts a summary from your speech
   - Categorizes the complaint based on keywords
   - Fills in the form fields
4. **Review & Submit**: Review the parsed information and submit

#### **Option 2: Recording Controls**
1. **Start Recording**: Click "🔴 Start Recording" to begin voice capture
2. **Control Recording**: Use pause/resume/stop buttons as needed
3. **Play Recording**: Review your recorded complaint
4. **Submit Recording**: Process the recording for text extraction and analysis
5. **Review Results**: Check the parsed complaint and submit

### Voice Analysis Features

The system provides advanced voice analysis including:
- **Sentiment Analysis**: Detects emotional tone (positive/negative/neutral)
- **Intent Detection**: Identifies the purpose of the complaint
- **Confidence Scoring**: Shows accuracy of voice recognition
- **Entity Extraction**: Identifies key terms and concepts
- **Smart Categorization**: Automatically assigns complaint categories

### Supported Categories

The system automatically detects these categories based on voice input:
- **Technical**: Contains words like "bug", "error", "technical"
- **Customer Service**: Contains words like "service", "customer", "support"
- **Billing**: Contains words like "billing", "payment", "charge"
- **Product**: Contains words like "product", "quality", "defect"
- **User Interface**: Contains words like "website", "app", "interface"
- **General**: Default category for other complaints

### Fallback Voice Recognition

If the Omnidim voice agent is not available, the system automatically falls back to the Web Speech API for voice recognition.

## API Endpoints

### POST /api/complaints

Submit a new complaint:

```json
{
  "summary": "Brief summary",
  "full_text": "Detailed description",
  "category": "Technical"
}
```

Response:
```json
{
  "message": "Complaint submitted"
}
```

## Database Schema

The `complaints` table includes:
- `id`: Auto-incrementing primary key
- `summary`: Brief complaint summary
- `full_text`: Detailed complaint description
- `category`: Complaint category
- `priority`: Priority level (High, Medium, Low)
- `group_id`: Grouping identifier
- `upvotes`: Number of upvotes
- `status`: Complaint status (Open, In Progress, Closed)
- `created_at`: Timestamp

## Troubleshooting

### Voice Recognition Issues

1. **Browser Compatibility**: Ensure you're using a modern browser with speech recognition support
2. **Microphone Permissions**: Allow microphone access when prompted
3. **Network Issues**: Check your internet connection for Omnidim voice agent
4. **Fallback Mode**: The system will automatically use Web Speech API if Omnidim is unavailable

### Database Connection Issues

1. **Check Environment Variables**: Ensure your `.env` file is properly configured
2. **MySQL Service**: Make sure MySQL is running
3. **Database Permissions**: Verify your MySQL user has proper permissions

## Development

### Adding New Categories

To add new complaint categories, update the `parseVoiceComplaint` function in `script.js`:

```javascript
if (lowerTranscript.includes('your_keyword')) {
  complaint.category = 'Your Category';
}
```

### Customizing Voice Recognition

The system supports both Omnidim voice agent and Web Speech API. You can customize the fallback behavior in the `startFallbackVoiceInput` function.

## License

This project is licensed under the MIT License. 
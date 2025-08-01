CREATE DATABASE IF NOT EXISTS connectizen;
USE connectizen;

CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  summary TEXT,
  full_text TEXT,
  category VARCHAR(100),
  priority ENUM('High', 'Medium', 'Low'),
  group_id BIGINT,
  upvotes INT DEFAULT 0,
  status ENUM('Open', 'In Progress', 'Closed') DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FULLTEXT(summary)
);
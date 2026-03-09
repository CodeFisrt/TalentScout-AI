-- TalentScout AI - Initial Schema
-- Run in phpMyAdmin: first 000_create_database.sql (if needed), then this file.
-- Or create database manually: CREATE DATABASE talentscout_ai;

USE talentscout_ai;

-- Users (login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Jobs (scraped / manual)
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  skills TEXT DEFAULT NULL,
  experience VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  job_link VARCHAR(1000) DEFAULT NULL,
  posted_date DATE DEFAULT NULL,
  source VARCHAR(50) DEFAULT 'linkedin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_job_link (job_link(255)),
  INDEX idx_posted_date (posted_date),
  INDEX idx_company (company),
  FULLTEXT idx_search (title, company, skills, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  skills TEXT DEFAULT NULL,
  experience VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  resume_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Applications (with AI match score)
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('job_found','applied','interview','offer') DEFAULT 'applied',
  applied_date DATETIME DEFAULT NULL,
  match_score INT DEFAULT NULL COMMENT 'AI match 0-100',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_candidate (candidate_id),
  INDEX idx_job (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Recruiters (leads from job postings)
CREATE TABLE IF NOT EXISTS recruiters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) DEFAULT NULL,
  linkedin_url VARCHAR(500) DEFAULT NULL,
  job_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
  INDEX idx_job (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

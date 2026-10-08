import express from 'express'
import multer from 'multer'
import pdfParse from 'pdf-parse'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ─── Gemini Client ───────────────────────────────────────────
const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
const genAI = hasApiKey ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null

// ─── Multer Config (memory storage) ──────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  },
})

// ─── Gemini Prompt ───────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert career advisor and tech industry mentor. Analyze the given resume text and return a structured career roadmap.

STRICT RULES:
- Return ONLY valid JSON. No markdown backticks, no code blocks, no extra text.
- The JSON must follow this exact schema:

{
  "user_summary": "Short 2-sentence summary of the user's current background",
  "current_skills": ["skill1", "skill2"],
  "missing_skills": [
    {
      "skill": "React",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "React JS complete course for beginners hindi",
        "url": "https://www.youtube.com/results?search_query=React+JS+complete+course+for+beginners"
      }
    }
  ],
  "roadmap_nodes": [
    {
      "id": "1",
      "title": "Current Status / Base Skill",
      "status": "completed",
      "description": "Short explanation of what they already know",
      "expected_salary": "₹3 - ₹6 LPA",
      "future_scope": "Stable demand - Foundation for all tech careers",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "C programming complete course hindi",
        "url": "https://www.youtube.com/results?search_query=C+programming+complete+course+hindi"
      }
    },
    {
      "id": "2",
      "title": "Next Skill Target",
      "status": "in-progress",
      "description": "What skill to learn next",
      "expected_salary": "₹6 - ₹12 LPA",
      "future_scope": "High Growth (+22%) - Strong demand in AI & Full Stack",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "React JS complete course for beginners hindi",
        "url": "https://www.youtube.com/results?search_query=React+JS+complete+course+for+beginners"
      }
    },
    {
      "id": "3",
      "title": "Target Role / Dream Job",
      "status": "upcoming",
      "description": "Final goal position",
      "expected_salary": "₹15 - ₹30 LPA",
      "future_scope": "Very High Growth (+35%) - Leadership & Architecture roles",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "full stack developer roadmap 2025 hindi",
        "url": "https://www.youtube.com/results?search_query=full+stack+developer+roadmap+2025+hindi"
      }
    }
  ],
  "recommended_micro_projects": [
    {
      "title": "Project Name",
      "for_skill": "Target Missing Skill",
      "difficulty": "Beginner/Intermediate",
      "description": "1-2 sentence description of a practical project to build"
    }
  ],
  "recommended_hackathons": [
    {
      "title": "Hackathon / Event Name",
      "eligibility": "Beginner Friendly / Freshers",
      "relevant_skills": ["Skill1", "Skill2"],
      "description": "Short 1-2 sentence overview of the event theme and why it fits their current learning roadmap",
      "location_type": "Online / Hybrid / Local (Noida/Delhi NCR)",
      "registration_url": "https://unstop.com/hackathons"
    }
  ]
}

- roadmap_nodes should have 3-5 nodes showing a clear progression path.
- Each roadmap_node MUST include expected_salary (e.g., "₹6 - ₹12 LPA" or "$80k - $120k"), future_scope (e.g., "High Growth (+22%) - Strong demand in AI & Full Stack development"), and a learning_resource object.
- Each missing_skills item MUST be an object with "skill" (string) and "learning_resource" (object with platform/search_query/url).
- Every learning_resource MUST have platform "YouTube", a beginner-friendly search_query (prefer Hindi/English mixed tutorials), and a valid url in format: https://www.youtube.com/results?search_query=URL+ENCODED+QUERY
- recommended_micro_projects should have 2-4 projects targeting the missing skills.
- recommended_hackathons should have 2-4 hackathons/events that match the user's current skills and learning stage.
- Each recommended_hackathons item MUST include a registration_url field with a realistic official URL.
- For well-known hackathons use their official portals: Smart India Hackathon -> https://sih.gov.in, Unstop events -> https://unstop.com/hackathons, Devfolio -> https://devfolio.co/hackathons, MLH -> https://mlh.io/seasons, Hacktoberfest -> https://hacktoberfest.com, Google Solution Challenge -> https://developers.google.com/community/gdsc-solution-challenge.
- For any general or lesser-known recommendation, fall back to a valid portal link such as https://unstop.com/hackathons.
- Never invent fake domains - only use well-known official URLs listed above or the fallback portal.
- Be specific and practical in your recommendations.
- Base everything on the actual resume content provided.`

// ─── Mock Response (fallback) ────────────────────────────────
function generateMockResponse(resumeText) {
  const text = resumeText.toLowerCase()
  const hasWebSkills = text.includes('html') || text.includes('css') || text.includes('javascript') || text.includes('react')
  const hasBackendSkills = text.includes('node') || text.includes('python') || text.includes('java') || text.includes('express')
  const hasDbSkills = text.includes('sql') || text.includes('mongodb') || text.includes('database')
  const hasInternship = text.includes('intern') || text.includes('internship')

  const currentSkills = []
  if (hasWebSkills) currentSkills.push('HTML/CSS', 'JavaScript', 'React')
  if (hasBackendSkills) currentSkills.push('Node.js', 'Express', 'REST APIs')
  if (hasDbSkills) currentSkills.push('MongoDB', 'SQL')
  if (currentSkills.length === 0) currentSkills.push('Programming Fundamentals', 'Problem Solving')

  const missingSkills = []
  if (!hasWebSkills) missingSkills.push('React', 'Tailwind CSS')
  if (!hasBackendSkills) missingSkills.push('Node.js', 'Express.js')
  if (!hasDbSkills) missingSkills.push('MongoDB', 'PostgreSQL')
  if (missingSkills.length === 0) missingSkills.push('System Design', 'Cloud Deployment', 'Docker')

  const ytResource = (query) => ({
    platform: 'YouTube',
    search_query: query,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  })

  return {
    user_summary: hasInternship
      ? 'A motivated computer science student with internship experience and solid foundational skills in software development. Looking to specialize in full-stack development and secure a product-based role.'
      : 'An aspiring software developer with foundational programming knowledge and a strong interest in building scalable web applications. Ready to bridge the gap between academic learning and industry requirements.',
    current_skills: currentSkills.slice(0, 4),
    missing_skills: missingSkills.slice(0, 4).map((skill) => ({
      skill,
      learning_resource: ytResource(`${skill} complete course for beginners hindi`),
    })),
    roadmap_nodes: [
      {
        id: '1',
        title: 'Foundation & Core Skills',
        status: 'completed',
        description: 'Strong grasp of programming fundamentals, data structures, and basic web technologies.',
        expected_salary: '₹3 - ₹6 LPA',
        future_scope: 'Stable demand - Foundation for all tech careers',
        learning_resource: ytResource('C programming complete course hindi'),
      },
      {
        id: '2',
        title: 'Full-Stack Development',
        status: 'in-progress',
        description: 'Building proficiency in React for frontend and Node.js/Express for backend development.',
        expected_salary: '₹8 - ₹15 LPA',
        future_scope: 'High Growth (+22%) - Strong demand in AI & Full Stack',
        learning_resource: ytResource('React JS full stack development course hindi'),
      },
      {
        id: '3',
        title: 'Database & Cloud Integration',
        status: 'upcoming',
        description: 'Learning MongoDB/PostgreSQL for data persistence and deploying applications on cloud platforms.',
        expected_salary: '₹12 - ₹20 LPA',
        future_scope: 'Very High Growth (+30%) - Cloud & DevOps skills in high demand',
        learning_resource: ytResource('MongoDB and cloud deployment tutorial hindi'),
      },
      {
        id: '4',
        title: 'SDE Intern / Junior Developer',
        status: 'upcoming',
        description: 'Target role: Software Development Engineer intern at a product-based company.',
        expected_salary: '₹15 - ₹30 LPA',
        future_scope: 'Excellent Growth (+35%) - Leadership & Architecture roles',
        learning_resource: ytResource('SDE interview preparation roadmap hindi'),
      }
    ],
    recommended_micro_projects: [
      {
        title: 'Personal Portfolio Website',
        for_skill: 'React',
        difficulty: 'Beginner',
        description: 'Build a responsive portfolio site with React, showcasing your projects and skills with smooth animations.'
      },
      {
        title: 'REST API Task Manager',
        for_skill: 'Node.js',
        difficulty: 'Intermediate',
        description: 'Create a full CRUD task management API with Express, JWT authentication, and MongoDB integration.'
      },
      {
        title: 'Real-time Chat Application',
        for_skill: 'WebSocket',
        difficulty: 'Intermediate',
        description: 'Develop a real-time chat app using Socket.io, React, and Node.js with room-based messaging.'
      },
      {
        title: 'E-commerce Dashboard',
        for_skill: 'Full-Stack',
        difficulty: 'Intermediate',
        description: 'Build an admin dashboard with React frontend, Express backend, and MongoDB for product/order management.'
      }
    ],
    recommended_hackathons: [
      {
        title: 'Smart India Hackathon (SIH)',
        eligibility: 'College Students (All Years)',
        relevant_skills: ['React', 'Node.js', 'AI/ML'],
        description: 'India\'s premier national hackathon focused on solving real-world problems using technology. Great for full-stack developers.',
        location_type: 'Hybrid / All India',
        registration_url: 'https://sih.gov.in'
      },
      {
        title: 'Hacktoberfest',
        eligibility: 'Freshers Welcome',
        relevant_skills: ['Git', 'Open Source', 'Any Language'],
        description: 'Global open-source contribution event. Perfect for beginners to start their open-source journey.',
        location_type: 'Online',
        registration_url: 'https://hacktoberfest.com'
      },
      {
        title: 'Google Solution Challenge',
        eligibility: 'Beginner Friendly',
        relevant_skills: ['Flutter', 'Firebase', 'Google Cloud'],
        description: 'Build solutions for UN Sustainable Development Goals using Google technologies.',
        location_type: 'Online',
        registration_url: 'https://developers.google.com/community/gdsc-solution-challenge'
      },
      {
        title: 'Devfolio Community Hackathons',
        eligibility: 'All Levels',
        relevant_skills: ['Web Dev', 'AI/ML', 'Blockchain'],
        description: 'Browse 500+ ongoing hackathons with diverse problem statements, prizes and mentorship.',
        location_type: 'Hybrid',
        registration_url: 'https://devfolio.co/hackathons'
      }
    ]
  }
}

// ─── Helper: Clean & Parse Gemini JSON Response ──────────────
function parseGeminiResponse(text) {
  let cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/```/g, '')
    .trim()

  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('No valid JSON found in Gemini response')
  }

  cleaned = cleaned.slice(firstBrace, lastBrace + 1)
  return JSON.parse(cleaned)
}

// ─── Helper: Call Gemini with Retry ──────────────────────────
async function callGemini(prompt) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout')), 5000)
  )

  const result = await Promise.race([
    genAI.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
    timeoutPromise,
  ])
  return result.text
}

// ─── Route: Health Check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PathPilot API is running',
    mode: hasApiKey ? 'live (Gemini API)' : 'demo (mock data)',
  })
})

// ─── Route: Analyze Resume ───────────────────────────────────
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded. Use field name "resume".' })
    }

    console.log(`[PathPilot] Processing resume: ${req.file.originalname} (${req.file.size} bytes)`)

    // Step 1: Extract text from PDF
    let resumeText
    try {
      const pdfData = await pdfParse(req.file.buffer)
      resumeText = pdfData.text
    } catch (pdfError) {
      console.error('[PathPilot] PDF parsing error:', pdfError.message)
      return res.status(400).json({ error: 'Failed to parse PDF. Please ensure the file is a valid, non-corrupted PDF.' })
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'PDF appears to be empty or contains too little text to analyze.' })
    }

    console.log(`[PathPilot] Extracted ${resumeText.length} characters from PDF`)

    // Step 2: Check if API key is configured
    if (!hasApiKey) {
      console.log('[PathPilot] No Gemini API key found — returning mock data (demo mode)')
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockData = generateMockResponse(resumeText)
      return res.status(200).json(mockData)
    }

    // Step 3: Send to Gemini API with retry
    const prompt = `${SYSTEM_PROMPT}\n\n--- RESUME CONTENT ---\n${resumeText}\n--- END RESUME ---`

    let geminiResponse
    try {
      geminiResponse = await callGemini(prompt)
    } catch (apiError) {
      console.error('[PathPilot] Gemini API failed:', apiError.message)
      console.log('[PathPilot] Falling back to mock data')
      const mockData = generateMockResponse(resumeText)
      return res.status(200).json(mockData)
    }

    console.log('[PathPilot] Raw Gemini response received')

    // Step 4: Parse JSON response
    let parsedData
    try {
      parsedData = parseGeminiResponse(geminiResponse)
    } catch (parseError) {
      console.error('[PathPilot] JSON parsing error:', parseError.message)
      console.error('[PathPilot] Raw response:', geminiResponse)
      return res.status(500).json({ error: 'Failed to parse AI response. Please try again.' })
    }

    // Step 5: Validate required fields
    const requiredFields = ['user_summary', 'current_skills', 'missing_skills', 'roadmap_nodes', 'recommended_micro_projects']
    for (const field of requiredFields) {
      if (!parsedData[field]) {
        return res.status(500).json({ error: `AI response missing required field: ${field}` })
      }
    }

    console.log(`[PathPilot] Analysis complete — ${parsedData.roadmap_nodes.length} roadmap nodes, ${parsedData.recommended_micro_projects.length} projects`)

    res.status(200).json(parsedData)

  } catch (error) {
    console.error('[PathPilot] Unexpected error:', error.message)
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' })
  }
})

// ─── Route: Direct Role Search Roadmap ───────────────────────
const ROLE_PROMPT = `You are an expert career advisor and tech industry mentor. Generate a complete step-by-step career roadmap for the given target role.

STRICT RULES:
- Return ONLY valid JSON. No markdown backticks, no code blocks, no extra text.
- The JSON must follow this exact schema (same as our resume roadmap):

{
  "user_summary": "Short 2-sentence summary of what this role involves and who it suits",
  "current_skills": ["skill1", "skill2"],
  "missing_skills": [
    {
      "skill": "React",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "React JS complete course for beginners hindi",
        "url": "https://www.youtube.com/results?search_query=React+JS+complete+course+for+beginners"
      }
    }
  ],
  "roadmap_nodes": [
    {
      "id": "1",
      "title": "Foundation Step",
      "status": "completed",
      "description": "What a beginner already knows or should start with",
      "expected_salary": "₹3 - ₹6 LPA",
      "future_scope": "Stable demand - Foundation skill",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "step one tutorial hindi",
        "url": "https://www.youtube.com/results?search_query=step+one+tutorial+hindi"
      }
    },
    {
      "id": "2",
      "title": "Core Skill Target",
      "status": "in-progress",
      "description": "The main skill to learn for this role",
      "expected_salary": "₹6 - ₹12 LPA",
      "future_scope": "High Growth (+22%) - Strong industry demand",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "core skill tutorial hindi",
        "url": "https://www.youtube.com/results?search_query=core+skill+tutorial+hindi"
      }
    },
    {
      "id": "3",
      "title": "Target Role",
      "status": "upcoming",
      "description": "Final goal position for this career path",
      "expected_salary": "₹15 - ₹30 LPA",
      "future_scope": "Very High Growth (+35%)",
      "learning_resource": {
        "platform": "YouTube",
        "search_query": "role roadmap tutorial hindi",
        "url": "https://www.youtube.com/results?search_query=role+roadmap+tutorial+hindi"
      }
    }
  ],
  "recommended_micro_projects": [
    {
      "title": "Project Name",
      "for_skill": "Target Missing Skill",
      "difficulty": "Beginner/Intermediate",
      "description": "1-2 sentence description of a practical project to build"
    }
  ],
  "recommended_hackathons": [
    {
      "title": "Hackathon / Event Name",
      "eligibility": "Beginner Friendly / Freshers",
      "relevant_skills": ["Skill1", "Skill2"],
      "description": "Short 1-2 sentence overview of the event theme",
      "location_type": "Online / Hybrid / Local (Noida/Delhi NCR)",
      "registration_url": "https://unstop.com/hackathons"
    }
  ]
}

- roadmap_nodes should have 4-5 nodes showing a clear beginner-to-role progression path.
- current_skills = skills a typical fresher may already have; missing_skills = skills required for this target role (2-5 items).
- Each missing_skills item MUST be an object with "skill" and "learning_resource" (platform "YouTube", valid url format: https://www.youtube.com/results?search_query=URL+ENCODED+QUERY).
- Each roadmap_node MUST include expected_salary (₹ LPA ranges), future_scope (growth %), and learning_resource.
- recommended_micro_projects should have 2-4 projects targeting the missing skills.
- recommended_hackathons should have 2-4 hackathons with realistic registration_url (official portals like https://sih.gov.in, https://unstop.com/hackathons, https://devfolio.co/hackathons; fallback https://unstop.com/hackathons).
- Be specific and practical. Only well-known official URLs, never fake domains.`

// Role-based mock fallback
function generateRoleMockResponse(targetRole) {
  const role = targetRole.trim()
  const ytResource = (query) => ({
    platform: 'YouTube',
    search_query: query,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  })

  return {
    user_summary: `This roadmap outlines a clear path to becoming a ${role}. It covers the essential skills, practical projects, and milestones needed to reach this career goal.`,
    current_skills: ['Programming Fundamentals', 'Problem Solving', 'Basic Computer Science'],
    missing_skills: [
      { skill: role, learning_resource: ytResource(`${role} complete course for beginners hindi`) },
      { skill: 'System Design', learning_resource: ytResource('system design complete course hindi') },
      { skill: 'Portfolio Projects', learning_resource: ytResource(`${role} portfolio projects tutorial`) },
      { skill: 'Interview Preparation', learning_resource: ytResource(`${role} interview preparation hindi`) },
    ],
    roadmap_nodes: [
      {
        id: '1',
        title: 'Foundation & Core Concepts',
        status: 'completed',
        description: 'Strong grip on programming fundamentals, data structures and problem solving.',
        expected_salary: '₹3 - ₹6 LPA',
        future_scope: 'Stable demand - Universal foundation for all tech roles',
        learning_resource: ytResource('programming fundamentals and DSA complete course hindi'),
      },
      {
        id: '2',
        title: `${role} Core Skills`,
        status: 'in-progress',
        description: `Deep dive into the core technologies and tools required for ${role}.`,
        expected_salary: '₹8 - ₹15 LPA',
        future_scope: 'High Growth (+25%) - Strong demand for skilled professionals',
        learning_resource: ytResource(`${role} complete course for beginners hindi`),
        progress: 45,
      },
      {
        id: '3',
        title: 'Practical Projects & Portfolio',
        status: 'upcoming',
        description: 'Build 3-4 real-world projects to demonstrate practical skills to recruiters.',
        expected_salary: '₹12 - ₹20 LPA',
        future_scope: 'Very High Growth (+30%) - Portfolio-driven hiring is the norm',
        learning_resource: ytResource(`${role} projects for portfolio tutorial`),
      },
      {
        id: '4',
        title: 'Internships & Open Source',
        status: 'upcoming',
        description: 'Gain real industry experience through internships and open-source contributions.',
        expected_salary: '₹15 - ₹25 LPA',
        future_scope: 'High Growth (+28%) - Experience accelerates career growth',
        learning_resource: ytResource('how to get internship as a student hindi'),
      },
      {
        id: '5',
        title: `Job Ready ${role}`,
        status: 'upcoming',
        description: `Crack interviews and land a ${role} role at a product-based company.`,
        expected_salary: '₹18 - ₹35 LPA',
        future_scope: 'Excellent Growth (+35%) - Leadership & senior roles ahead',
        learning_resource: ytResource(`${role} interview preparation roadmap hindi`),
      },
    ],
    recommended_micro_projects: [
      {
        title: `${role} Starter Project`,
        for_skill: role,
        difficulty: 'Beginner',
        description: `A foundational project that covers the core concepts of ${role} with best practices.`,
      },
      {
        title: 'Full-Stack Portfolio App',
        for_skill: 'Full-Stack',
        difficulty: 'Intermediate',
        description: 'Build a complete CRUD application with authentication, deployment and documentation.',
      },
      {
        title: 'Real-time Integration Project',
        for_skill: 'API Integration',
        difficulty: 'Intermediate',
        description: 'Integrate third-party APIs, handle websockets and deploy to the cloud.',
      },
    ],
    recommended_hackathons: [
      {
        title: 'Smart India Hackathon (SIH)',
        eligibility: 'College Students (All Years)',
        relevant_skills: ['Problem Solving', 'Web Dev', 'AI/ML'],
        description: 'National level hackathon to solve real-world problems with mentorship.',
        location_type: 'Hybrid / All India',
        registration_url: 'https://sih.gov.in',
      },
      {
        title: 'Devfolio Community Hackathons',
        eligibility: 'All Levels',
        relevant_skills: ['Web Dev', 'AI/ML', 'Blockchain'],
        description: 'Browse 500+ ongoing hackathons with prizes and mentorship.',
        location_type: 'Hybrid',
        registration_url: 'https://devfolio.co/hackathons',
      },
      {
        title: 'Unstop Hackathons',
        eligibility: 'Beginner Friendly',
        relevant_skills: ['Any Tech Skill', 'Problem Solving'],
        description: 'India\'s largest hackathon platform with diverse problem statements.',
        location_type: 'Online',
        registration_url: 'https://unstop.com/hackathons',
      },
    ],
  }
}

app.post('/api/generate-role-roadmap', async (req, res) => {
  try {
    const { target_role } = req.body || {}

    if (!target_role || typeof target_role !== 'string' || target_role.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid target_role (min 2 characters).' })
    }

    const role = target_role.trim().slice(0, 80)
    console.log(`[PathPilot] Role roadmap requested: ${role}`)

    // No API key -> instant mock
    if (!hasApiKey) {
      console.log('[PathPilot] No Gemini API key — returning role mock data')
      return res.status(200).json(generateRoleMockResponse(role))
    }

    // Call Gemini
    let geminiResponse
    try {
      geminiResponse = await callGemini(`${ROLE_PROMPT}\n\n--- TARGET ROLE ---\n${role}\n--- END ---`)
    } catch (apiError) {
      console.error('[PathPilot] Gemini API failed for role roadmap:', apiError.message)
      console.log('[PathPilot] Falling back to role mock data')
      return res.status(200).json(generateRoleMockResponse(role))
    }

    // Parse JSON
    let parsedData
    try {
      parsedData = parseGeminiResponse(geminiResponse)
    } catch (parseError) {
      console.error('[PathPilot] Role JSON parsing error:', parseError.message)
      return res.status(200).json(generateRoleMockResponse(role))
    }

    // Validate required fields
    const requiredFields = ['user_summary', 'current_skills', 'missing_skills', 'roadmap_nodes', 'recommended_micro_projects']
    for (const field of requiredFields) {
      if (!parsedData[field]) {
        console.log(`[PathPilot] Role response missing ${field} — using mock`)
        return res.status(200).json(generateRoleMockResponse(role))
      }
    }

    console.log(`[PathPilot] Role roadmap complete — ${parsedData.roadmap_nodes.length} nodes`)
    res.status(200).json(parsedData)

  } catch (error) {
    console.error('[PathPilot] Role roadmap unexpected error:', error.message)
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' })
  }
})

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
    }
    return res.status(400).json({ error: err.message })
  }
  console.error('[PathPilot] Unhandled error:', err.message)
  res.status(500).json({ error: 'Internal server error.' })
})

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 PathPilot API Server running on http://localhost:${PORT}`)
  console.log(`  📡 Health check: http://localhost:${PORT}/api/health`)
  console.log(`  📄 Analyze endpoint: POST http://localhost:${PORT}/api/analyze-resume`)
  console.log(`  🔑 Mode: ${hasApiKey ? 'LIVE (Gemini API)' : 'DEMO (mock data — add GEMINI_API_KEY to .env for live AI)'}\n`)
})

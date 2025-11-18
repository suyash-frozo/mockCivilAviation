// PDF extraction moved to API route to avoid SSR issues

export interface ExtractedQuestion {
  questionText: string
  options: string[]
  correctAnswer?: string
  explanation?: string
  section?: string
}

/**
 * Parse questions from PDF text
 * Handles various PDF formats including headers, titles, and mixed content
 */
export function parseQuestionsFromText(text: string, source?: string): ExtractedQuestion[] {
  const questions: ExtractedQuestion[] = []
  
  // Clean up text - remove excessive whitespace and normalize
  let cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  // Find the first actual question (starts with number followed by text)
  // Skip headers, table of contents, etc.
  let startIndex = 0
  const firstQuestionMatch = cleanedText.match(/(\d+)[\.\)]\s+[A-Z][^\d]{20,}/)
  if (firstQuestionMatch && firstQuestionMatch.index !== undefined) {
    // Start from a bit before the first question to catch any context
    startIndex = Math.max(0, firstQuestionMatch.index - 100)
  }
  
  cleanedText = cleanedText.substring(startIndex)
  
  // Split text into potential question blocks
  // Look for patterns like: "1. Question text... A) Option... B) Option..."
  const questionBlockPattern = /(\d+)[\.\)]\s+([^\d]+?)(?=\d+[\.\)]\s+|$)/gs
  
  const blocks: string[] = []
  let match
  while ((match = questionBlockPattern.exec(cleanedText)) !== null) {
    blocks.push(match[0])
  }
  
  // If no blocks found with numbered pattern, try splitting by double newlines
  if (blocks.length === 0) {
    blocks.push(...cleanedText.split(/\n\s*\n\s*(?=\d+[\.\)])/))
  }
  
  for (const block of blocks) {
    try {
      // Skip blocks that are too short or look like headers/footers
      if (block.trim().length < 50) continue
      
      // Skip blocks that are mostly numbers or special characters
      const textRatio = (block.match(/[a-zA-Z]/g) || []).length / block.length
      if (textRatio < 0.3) continue
      
      // Extract question number and text
      const questionMatch = block.match(/(\d+)[\.\)]\s+(.+?)(?=\s*[A-D][\.\)\:]|\s*\([A-D]\)|Answer|Correct|Solution|$)/is)
      
      if (!questionMatch) continue
      
      let questionText = questionMatch[2]?.trim()
      if (!questionText || questionText.length < 15) continue
      
      // Clean question text
      questionText = questionText
        .replace(/\s+/g, ' ')
        .replace(/^\d+[\.\)]\s*/, '')
        .trim()
      
      // Skip if question text looks like a header/title
      if (questionText.length > 200 && !questionText.includes('?')) continue
      if (/^(TABLE|CONTENTS|PAGE|CHAPTER|SECTION)/i.test(questionText)) continue
      
      // Extract options - multiple patterns
      const options: string[] = []
      
      // Pattern 1: A), B), C), D)
      let optionMatches = block.matchAll(/([A-D])[\.\)\:]\s*([^\n]+?)(?=\n\s*[A-D][\.\)\:]|\n\s*Answer|\n\s*Correct|$)/gi)
      for (const match of optionMatches) {
        const optionText = match[2]?.trim()
        if (optionText && optionText.length > 1 && optionText.length < 500) {
          options.push(optionText)
        }
      }
      
      // Pattern 2: (A), (B), (C), (D)
      if (options.length < 2) {
        optionMatches = block.matchAll(/\(([A-D])\)\s*([^\n]+?)(?=\n\s*\([A-D]\)|\n\s*Answer|$)/gi)
        for (const match of optionMatches) {
          const optionText = match[2]?.trim()
          if (optionText && optionText.length > 1 && optionText.length < 500) {
            options.push(optionText)
          }
        }
      }
      
      // Pattern 3: a. b. c. d. (lowercase)
      if (options.length < 2) {
        optionMatches = block.matchAll(/([a-d])[\.\)]\s*([^\n]+?)(?=\n\s*[a-d][\.\)]|$)/gi)
        for (const match of optionMatches) {
          const optionText = match[2]?.trim()
          if (optionText && optionText.length > 1 && optionText.length < 500) {
            options.push(optionText)
          }
        }
      }
      
      // Need at least 2 options to be a valid question
      if (options.length < 2) continue
      
      // Remove duplicates and limit to 4 options
      const uniqueOptions = Array.from(new Set(options)).slice(0, 4)
      if (uniqueOptions.length < 2) continue
      
      // Extract correct answer if mentioned
      let correctAnswer: string | undefined
      const answerPatterns = [
        /(?:Answer|Correct|Solution|Ans)[:\s]+([A-D])/i,
        /(?:Answer|Correct|Solution|Ans)[:\s]+([a-d])/i,
        /^([A-D])[\.\)]\s*(?:Answer|Correct)/i,
      ]
      
      for (const pattern of answerPatterns) {
        const answerMatch = block.match(pattern)
        if (answerMatch) {
          correctAnswer = answerMatch[1].toUpperCase()
          break
        }
      }
      
      // Extract explanation if present
      const explanationPatterns = [
        /(?:Explanation|Reason|Note)[:\s]+(.+?)(?=\d+[\.\)]|Answer|Correct|$)/is,
        /Explanation[:\s]+(.+?)(?=\n\n|\d+[\.\)]|$)/is,
      ]
      
      let explanation: string | undefined
      for (const pattern of explanationPatterns) {
        const explanationMatch = block.match(pattern)
        if (explanationMatch) {
          explanation = explanationMatch[1]?.trim()
          if (explanation && explanation.length > 5 && explanation.length < 1000) {
            break
          }
        }
      }
      
      questions.push({
        questionText,
        options: uniqueOptions,
        correctAnswer,
        explanation,
        section: source,
      })
    } catch (error) {
      // Silently skip problematic blocks
      continue
    }
  }
  
  // Filter out questions that are too similar (likely duplicates)
  const uniqueQuestions = questions.filter((q, index, self) => {
    return index === self.findIndex((t) => 
      t.questionText.substring(0, 50) === q.questionText.substring(0, 50)
    )
  })
  
  return uniqueQuestions
}

/**
 * Classify question into a section based on keywords
 */
export function classifyQuestion(questionText: string, options: string[]): string {
  const text = (questionText + ' ' + options.join(' ')).toLowerCase()
  
  // Keyword mapping for each section
  const sectionKeywords: Record<string, string[]> = {
    air_law: [
      'icao', 'easa', 'regulation', 'airspace', 'atc', 'clearance', 'flight plan',
      'certificate', 'license', 'authority', 'violation', 'rule', 'law', 'legal',
      'annex', 'faa', 'caa', 'authorization', 'permit'
    ],
    meteorology: [
      'weather', 'cloud', 'wind', 'temperature', 'pressure', 'front', 'fog', 'rain',
      'meteorology', 'atmosphere', 'humidity', 'precipitation', 'storm', 'turbulence',
      'visibility', 'ceiling', 'isobar', 'isotherm', 'metar', 'taf'
    ],
    principles_of_flight: [
      'lift', 'drag', 'thrust', 'weight', 'aerodynamic', 'angle of attack', 'stall',
      'airspeed', 'climb', 'descent', 'glide', 'pitch', 'roll', 'yaw', 'aileron',
      'elevator', 'rudder', 'flap', 'spoiler', 'coefficient', 'bernoulli'
    ],
    aircraft_general: [
      'engine', 'propeller', 'fuel', 'oil', 'electrical', 'battery', 'generator',
      'alternator', 'hydraulic', 'brake', 'landing gear', 'cockpit', 'instrument',
      'gyro', 'compass', 'altimeter', 'airspeed indicator', 'system', 'component'
    ],
    human_performance: [
      'human', 'physiology', 'hypoxia', 'fatigue', 'stress', 'vision', 'hearing',
      'decision', 'judgment', 'situational awareness', 'workload', 'crew resource',
      'medical', 'health', 'limitation', 'performance', 'cognitive'
    ],
    operational_procedures: [
      'procedure', 'checklist', 'emergency', 'normal', 'abnormal', 'sop', 'standard',
      'operation', 'preflight', 'postflight', 'inspection', 'maintenance', 'safety',
      'risk', 'hazard', 'incident', 'accident', 'report'
    ],
    navigation: [
      'navigation', 'vor', 'ndb', 'gps', 'chart', 'waypoint', 'heading', 'bearing',
      'track', 'course', 'deviation', 'variation', 'magnetic', 'true', 'compass',
      'dead reckoning', 'pilotage', 'radio navigation', 'ils', 'approach'
    ],
    communication: [
      'communication', 'radio', 'frequency', 'phraseology', 'icao', 'call sign',
      'transponder', 'squawk', 'mayday', 'pan-pan', 'clearance', 'readback',
      'transmission', 'reception', 'atc', 'unicom', 'ctaf'
    ],
  }
  
  // Count keyword matches for each section
  const scores: Record<string, number> = {}
  
  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    scores[section] = keywords.reduce((count, keyword) => {
      return count + (text.includes(keyword) ? 1 : 0)
    }, 0)
  }
  
  // Return section with highest score, default to air_law if no match
  const bestSection = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )
  
  return bestSection[1] > 0 ? bestSection[0] : 'air_law'
}

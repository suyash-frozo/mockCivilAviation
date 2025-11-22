import OpenAI from 'openai'

export interface AIExtractedQuestion {
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD?: string
  correctAnswer: string
  explanation?: string
  suggestedSection: string
  confidence: number
}

/**
 * Extract questions from PDF text using OpenAI GPT
 */
export async function extractQuestionsWithAI(
  pdfText: string,
  apiKey: string
): Promise<AIExtractedQuestion[]> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required')
  }

  const openai = new OpenAI({ apiKey })

  const prompt = `You are an expert at extracting aviation exam questions from PDF text. 

Extract ALL multiple-choice questions from the following text. For each question, provide:
1. The complete question text
2. All answer options (A, B, C, and D if present)
3. The correct answer (A, B, C, or D)
4. An explanation of why the answer is correct (if available in the text)
5. The most appropriate section from these options:
   - air_law (regulations, ICAO, EASA, legal, airspace rules)
   - meteorology (weather, clouds, wind, temperature, pressure)
   - principles_of_flight (aerodynamics, lift, drag, thrust, stall)
   - aircraft_general (engines, systems, instruments, fuel)
   - human_performance (physiology, fatigue, decision making, crew resource)
   - operational_procedures (checklists, emergency, SOPs, safety)
   - navigation (VOR, GPS, charts, waypoints, heading)
   - communication (radio, phraseology, ATC, transponder)
6. Your confidence level (0-100) in the accuracy of this extraction

Format your response as a JSON array of objects with this exact structure:
[
  {
    "questionText": "full question text",
    "optionA": "option A text",
    "optionB": "option B text",
    "optionC": "option C text",
    "optionD": "option D text or null if not present",
    "correctAnswer": "A or B or C or D",
    "explanation": "explanation text or null",
    "suggestedSection": "one of the section IDs above",
    "confidence": 95
  }
]

IMPORTANT RULES:
- Extract EVERY question you find
- Ensure all options are complete sentences or phrases
- Mark optionD as null if only 3 options exist
- correctAnswer must be exactly "A", "B", "C", or "D"
- suggestedSection must be one of the 8 section IDs listed above
- confidence should reflect how certain you are about the extraction
- If you cannot extract a question clearly, set confidence below 70
- DO NOT make up questions - only extract what's actually in the text

PDF TEXT:
${pdfText}

Return ONLY the JSON array, no additional text.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using GPT-4 for better accuracy
      messages: [
        {
          role: 'system',
          content: 'You are an expert at extracting structured data from aviation exam PDFs. You always return valid JSON arrays.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for more consistent extraction
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid JSON response from OpenAI')
    }

    // Handle both array and object responses
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || []

    // Validate and clean the extracted questions
    const validQuestions: AIExtractedQuestion[] = []
    for (const q of questions) {
      // Validate required fields
      if (
        !q.questionText ||
        !q.optionA ||
        !q.optionB ||
        !q.optionC ||
        !q.correctAnswer ||
        !q.suggestedSection
      ) {
        console.warn('Skipping invalid question:', q)
        continue
      }

      // Validate correctAnswer
      if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer.toUpperCase())) {
        console.warn('Invalid correct answer:', q.correctAnswer)
        continue
      }

      // Validate section
      const validSections = [
        'air_law',
        'meteorology',
        'principles_of_flight',
        'aircraft_general',
        'human_performance',
        'operational_procedures',
        'navigation',
        'communication',
      ]
      if (!validSections.includes(q.suggestedSection)) {
        console.warn('Invalid section:', q.suggestedSection)
        q.suggestedSection = 'air_law' // Default fallback
      }

      validQuestions.push({
        questionText: q.questionText.trim(),
        optionA: q.optionA.trim(),
        optionB: q.optionB.trim(),
        optionC: q.optionC.trim(),
        optionD: q.optionD ? q.optionD.trim() : null,
        correctAnswer: q.correctAnswer.toUpperCase(),
        explanation: q.explanation ? q.explanation.trim() : null,
        suggestedSection: q.suggestedSection,
        confidence: q.confidence || 80,
      })
    }

    return validQuestions
  } catch (error: any) {
    console.error('OpenAI extraction error:', error)
    throw new Error(`Failed to extract questions with AI: ${error.message}`)
  }
}


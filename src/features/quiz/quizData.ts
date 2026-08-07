/**
 * Quiz questions for the pre/post assessment.
 * Correct answers are included here for client-side checking,
 * but also validated server-side on submission.
 *
 * Kept intentionally short (6 questions — two per topic) so the
 * pre-assessment is quick for older learners. IDs match the server
 * question bank so server-side grading still lines up.
 */
export interface QuizQuestion {
  id: number;
  topic: 'phishing' | 'passwords' | 'social-engineering';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    topic: 'phishing',
    question: 'You receive an email from "amaz0n-security@gmail.com" saying your account has been compromised. What should you do?',
    options: [
      'Click the link in the email to secure your account immediately',
      'Reply to the email asking for more details',
      "Go directly to Amazon's website by typing the address in your browser",
      'Forward the email to your friends to warn them',
    ],
    correctAnswer: 2,
    explanation: 'Always go directly to a website by typing the address yourself rather than clicking links in emails. Legitimate companies will never use Gmail addresses for security alerts.',
  },
  {
    id: 6,
    topic: 'passwords',
    question: 'Which of these passwords would take the LONGEST for a hacker to crack?',
    options: [
      'P@ssw0rd!',
      'correct-horse-battery-staple',
      'John1985!',
      'qwerty123456',
    ],
    correctAnswer: 1,
    explanation: 'Long passphrases made of random words are extremely strong because their length makes them nearly impossible to brute-force, while still being memorable.',
  },
  {
    id: 10,
    topic: 'social-engineering',
    question: 'You receive a phone call from someone claiming to be from your bank, asking you to confirm your account number. What should you do?',
    options: [
      'Give them the information since they called from the bank',
      'Ask them to prove they are from the bank by telling you your balance',
      'Hang up and call your bank directly using the number on your card or statement',
      'Give them only part of your account number for security',
    ],
    correctAnswer: 2,
    explanation: 'Never give personal information to someone who contacts you. Always hang up and call the organisation directly using a number you trust.',
  },
];

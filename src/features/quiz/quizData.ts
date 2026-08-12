/**
 * Quiz questions for the pre/post assessment.
 * Correct answers are included here for client-side checking,
 * but also validated server-side on submission.
 *
 * Kept to 7 questions (three phishing, two passwords, two social
 * engineering) so the pre-assessment is quick for older learners.
 * IDs match the server question bank so server-side grading lines up.
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
      'Go directly to Amazon\'s website by typing the address in your browser',
      'Forward the email to your friends to warn them',
    ],
    correctAnswer: 2,
    explanation: 'Always go directly to a website by typing the address yourself rather than clicking links in emails. Legitimate companies will never use Gmail addresses for security alerts.',
  },
  {
    id: 3,
    topic: 'phishing',
    question: 'An email says "Your account will be deleted in 24 hours unless you verify your details NOW." This is likely:',
    options: [
      'A genuine warning you should act on quickly',
      'A phishing attempt using urgency to pressure you',
      'A routine security check from the company',
      'An automated system message that can be ignored',
    ],
    correctAnswer: 1,
    explanation: 'Creating a false sense of urgency is one of the most common phishing tactics. Legitimate companies rarely threaten immediate account deletion and will never pressure you to act within hours.',
  },
  {
    id: 4,
    topic: 'phishing',
    question: 'You hover over a link in an email and see it leads to "http://bankofireland.secure-login.xyz". Is this safe?',
    options: [
      'Yes, because it contains "bankofireland" in the address',
      'Yes, because it says "secure" in the address',
      'No, because the actual domain is "secure-login.xyz", not Bank of Ireland',
      'No, because it uses "http" instead of "https"',
    ],
    correctAnswer: 2,
    explanation: 'The actual domain is determined by what comes just before the first slash. Here, "secure-login.xyz" is the real domain, and "bankofireland" is just a subdomain used to trick you.',
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
    id: 8,
    topic: 'passwords',
    question: 'What is the main benefit of using a password manager?',
    options: [
      'It makes your computer run faster',
      'It lets you use one strong unique password for every account without memorising them all',
      'It prevents all types of hacking',
      'It automatically changes your passwords every day',
    ],
    correctAnswer: 1,
    explanation: 'A password manager stores unique, strong passwords for every account so you only need to remember one master password.',
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
  {
    id: 11,
    topic: 'social-engineering',
    question: 'A text message says "Hi Gran, I\'ve lost my phone and I\'m using a friend\'s. Can you send me €200 for an emergency?" What is the safest response?',
    options: [
      'Send the money immediately because your grandchild might be in danger',
      'Ask them a personal question only your real grandchild would know',
      'Call your grandchild on their usual number to verify the message',
      'Reply asking what the emergency is',
    ],
    correctAnswer: 2,
    explanation: 'The safest approach is always to verify through a separate, trusted channel. Call your grandchild on their normal number.',
  },
];

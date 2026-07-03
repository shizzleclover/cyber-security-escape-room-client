/**
 * Quiz questions for the pre/post assessment.
 * Correct answers are included here for client-side checking,
 * but also validated server-side on submission.
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
    id: 2,
    topic: 'phishing',
    question: 'Which of the following is the MOST reliable way to check if an email is genuine?',
    options: [
      'The email has the company logo in it',
      'The email addresses you by your first name',
      'The sender\'s email address matches the company\'s official domain',
      'The email does not contain any spelling mistakes',
    ],
    correctAnswer: 2,
    explanation: 'Checking the sender\'s actual email address (not just the display name) is the most reliable indicator. Scammers can easily copy logos, use your name from data breaches, and write well-crafted messages.',
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
    id: 5,
    topic: 'phishing',
    question: 'You receive an invoice for a service you never purchased with an attached PDF. What is the safest action?',
    options: [
      'Open the PDF to see what it is about',
      'Reply and tell them you did not order it',
      'Delete the email immediately without opening the attachment',
      'Forward the email to your bank',
    ],
    correctAnswer: 2,
    explanation: 'Never open unexpected attachments, especially from unknown senders. PDFs and Word documents can contain malicious macros that infect your computer the moment they are opened.',
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
    id: 7,
    topic: 'passwords',
    question: 'You use the same password for your email, online banking, and social media. If one account is hacked, what happens?',
    options: [
      'Only that one account is at risk',
      'All accounts using that password are now at risk',
      'Nothing, because the other sites have their own security',
      'Only accounts on the same website are affected',
    ],
    correctAnswer: 1,
    explanation: 'When you reuse passwords, a breach on one site gives attackers access to all your other accounts. This is called "credential stuffing."',
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
    id: 9,
    topic: 'passwords',
    question: 'Why is it highly recommended to use Two-Factor Authentication (2FA) in addition to a password?',
    options: [
      'It stops websites from tracking you',
      'It speeds up the login process',
      'It adds a second layer of security in case your password is stolen',
      'It encrypts your hard drive automatically',
    ],
    correctAnswer: 2,
    explanation: '2FA requires a second proof of identity (like a code on your phone). Even if a hacker steals your password, they still cannot access your account without your phone.',
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
    question: 'A text message says "Hi Gran, I\'ve lost my phone and I\'m using a friend\'s. Can you send me £200 for an emergency?" What is the safest response?',
    options: [
      'Send the money immediately because your grandchild might be in danger',
      'Ask them a personal question only your real grandchild would know',
      'Call your grandchild on their usual number to verify the message',
      'Reply asking what the emergency is',
    ],
    correctAnswer: 2,
    explanation: 'The safest approach is always to verify through a separate, trusted channel. Call your grandchild on their normal number.',
  },
  {
    id: 12,
    topic: 'social-engineering',
    question: 'You receive a message saying you have won a prize in a competition. To claim it, you need to pay a "processing fee" of £50. This is most likely:',
    options: [
      'A legitimate prize that requires a standard fee',
      'A scam, because real prizes never require payment to claim',
      'Genuine if the company name looks familiar',
      'Safe if they only ask for a small amount',
    ],
    correctAnswer: 1,
    explanation: 'Legitimate competitions never ask winners to pay fees to receive prizes. If you did not enter a competition, you cannot have won one.',
  },
  {
    id: 13,
    topic: 'social-engineering',
    question: 'A person in a high-vis jacket arrives at your office claiming to be from "IT Support" to fix your router, but you didn\'t call them. What is the best action?',
    options: [
      'Let them in immediately to fix the issue',
      'Ask to see their ID and verify their visit with your manager or actual IT department',
      'Leave them alone in the server room',
      'Give them your login credentials so they can test the network',
    ],
    correctAnswer: 1,
    explanation: 'Physical social engineering is a major threat. Always verify the identity of unexpected visitors with a trusted internal authority before granting them access.',
  },
  {
    id: 14,
    topic: 'phishing',
    question: 'Which of the following is an example of "Spear Phishing"?',
    options: [
      'A generic email sent to millions of people claiming they won the lottery',
      'A highly targeted email addressing you by name and referencing your specific job title',
      'A text message with a malicious link',
      'A phone call from a fake tech support agent',
    ],
    correctAnswer: 1,
    explanation: 'Spear phishing targets specific individuals using personalized information (like name, job, or recent purchases) to make the attack seem highly credible.',
  },
  {
    id: 15,
    topic: 'passwords',
    question: 'How often should you ideally change a strong, unique password if you use a password manager?',
    options: [
      'Every 30 days without exception',
      'Every time you log in',
      'Only if you suspect it has been compromised in a data breach',
      'Once a week',
    ],
    correctAnswer: 2,
    explanation: 'Modern security guidelines state you only need to change strong, unique passwords if there is evidence of a breach. Forcing frequent changes often leads to weaker, predictable passwords.',
  }
];

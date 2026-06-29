import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config.js';
import { inMemoryDb } from '../db/inMemoryDb.js';

// Seeded high-quality responses for simulation when API key is missing
const FALLBACK_RESPONSES = {
  worker: {
    Hindi: {
      room: "बेंगलुरु में कामगारों के लिए केंटोनमेंट, पीण्या और बोम्मसंद्रा क्षेत्रों में किफायती किराए के कमरे उपलब्ध हैं। आप अपने स्थानीय ठेकेदार या साथी कामगारों से भी सुरक्षित कमरों की मदद ले सकते हैं।",
      language: "कन्नड़ में नमस्ते को 'नमस्कागळु' (Namaskara) और धन्यवाद को 'धन्यवादगळु' (Dhanyavadagalu) कहते हैं। थोड़ा कन्नड़ सीखने से आपको स्थानीय लोगों के साथ बातचीत में बहुत आसानी होगी।",
      remittance: "घर पैसे भेजने के लिए योनो (YONO) एप का उपयोग करें। यह बहुत सुरक्षित है और इसमें कोई अतिरिक्त शुल्क नहीं लगता। आप अपने बैंक खाते से सीधे अपने परिवार के खाते में हर महीने पैसे भेजने का शेड्यूल भी सेट कर सकते हैं।",
      general: "नमस्ते रमेश जी, बेंगलुरु में आपका स्वागत है। मैं आपका एसबीआई साथी हूँ। मैं आपके नए शहर में बैंकिंग और स्थानीय जानकारी के लिए आपकी सहायता करूँगा। आप मुझसे किराए के कमरे, कन्नड़ भाषा, या पैसे सुरक्षित घर भेजने के बारे में पूछ सकते हैं।"
    },
    Kannada: {
      room: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕಾರ್ಮಿಕರಿಗಾಗಿ ಪೀಣ್ಯ, ಬೊಮ್ಮಸಂದ್ರ ಮತ್ತು ಕೆಂಗೇರಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕೈಗೆಟುಕುವ ದರದಲ್ಲಿ ಬಾಡಿಗೆ ಕೊಠಡಿಗಳು ಲಭ್ಯವಿವೆ.",
      language: "ಕನ್ನಡದಲ್ಲಿ ಶುಭಾಶಯಗಳನ್ನು ತಿಳಿಸಲು 'ನಮಸ್ಕಾರ' ಮತ್ತು ಧನ್ಯವಾದ ಹೇಳಲು 'ಧನ್ಯವಾದಗಳು' ಎಂದು ಬಳಸಿ.",
      remittance: "ಮನೆಗೆ ಹಣ ಕಳುಹಿಸಲು ಯೋನೋ ಆಪ್ ಬಳಸಿ. ಇದು ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತ ಮತ್ತು ಉಚಿತವಾಗಿದೆ.",
      general: "ನಮಸ್ತೆ ಅನಿಲ್ ಅವರೇ, ಬೆಂಗಳೂರಿಗೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮ್ಮ ಎಸ್ಬಿಐ ಸಾಥಿ. ಹೊಸ ನಗರದಲ್ಲಿ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಸ್ಥಳೀಯ ಮಾಹಿತಿಗಾಗಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ."
    },
    English: {
      room: "In Bengaluru, affordable rental rooms for workers are available near industrial areas like Peenya, Bommasandra, and Kengeri.",
      language: "To greet in Kannada say 'Namaskara' and for Thank You say 'Dhanyavadagalu'. Learning simple words will help you communicate locally.",
      remittance: "To send money home safely, use the YONO SBI App. It is free and highly secure. You can also schedule recurring transfers.",
      general: "Hello, welcome to Bengaluru. I am your SBI Saathi assistant. I can guide you through banking and local city tips. Ask me about rooms, local language, or money transfers."
    }
  },
  student: {
    English: {
      room: "In Pune, popular and affordable student accommodations (PGs and hostels) are located in Kothrud, Katraj, Viman Nagar, and Hinjewadi. Always check for security features and student reviews before paying deposit.",
      language: "In Pune, Marathi is widely spoken. To say Hello say 'Namaskar', to ask 'How much?' say 'Kiti?', and to say Thank You say 'Aabhari aahe'.",
      remittance: "You can easily request pocket money from your parents via YONO UPI request. You can also view monthly spending charts on your student dashboard.",
      loan: "SBI offers pre-approved Scholar Education Loans for top institutions in Pune at special interest rates. You can apply digitally directly within the app without branch visits.",
      general: "Hi Priya, welcome to Pune. I am your SBI Saathi assistant. I am here to help you navigate your new student life. Ask me about student housing, Marathi words, pocket money, or education loans."
    },
    Hindi: {
      room: "पुणे में छात्रों के लिए कोथरुड, कात्रज और विमान नगर में अच्छे और किफायती पीजी (PG) उपलब्ध हैं। बुकिंग करने से पहले सुरक्षा की जांच अवश्य करें।",
      language: "पुणे में मराठी भाषा बोली जाती है। नमस्ते को 'नमस्कार' और धन्यवाद को 'आभारी आहे' कहते हैं।",
      remittance: "आप योनो एप के माध्यम से अपने माता-पिता से पॉकेट मनी का अनुरोध सीधे उनके यूपीआई (UPI) पर भेज सकते हैं।",
      loan: "एसबीआई छात्रों के लिए आकर्षक ब्याज दरों पर प्री-अप्रूव्ड स्कॉलर एजुकेशन लोन प्रदान करता है। इसे आप सीधे एप से अप्लाई कर सकते हैं।",
      general: "नमस्ते प्रिया, पुणे में आपका स्वागत है। मैं आपका एसबीआई साथी हूँ। पढ़ाई के इस नए सफर में मैं आपकी मदद करूँगा। कृपया छात्र आवास, मराठी भाषा, या शिक्षा ऋण के बारे में पूछें।"
    }
  }
};

export const saathiService = {
  /**
   * Generates a conversational response to guide a relocated user
   * @param {Object} user - User database object
   * @param {string} message - User query message
   * @returns {Promise<string>} - Bot response string
   */
  chat: async (user, message) => {
    const { name, segment, preferredLanguage, currentCity, homeCity } = user;
    const query = message.toLowerCase();

    inMemoryDb.logEvent('SAATHI_CHAT_REQUEST', `SBI Saathi received query from ${name}: "${message}"`);

    // If Gemini API Key is available, use GenAI
    if (config.geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
          You are SBI Saathi (SBI Companion), a warm, helpful, and empathetic AI assistant for State Bank of India.
          Your purpose is to help relocated internal migrants or college students adjust to their new city and manage their banking.
          
          User Profile:
          - Name: ${name}
          - Category: ${segment === 'worker' ? 'Blue-collar migrant worker' : 'College student'}
          - Home City: ${homeCity}
          - Relocated/Current City: ${currentCity}
          - Preferred Language for communication: ${preferredLanguage}
          
          Guidelines:
          1. Answer their query: "${message}" in their preferred language (${preferredLanguage}) using clean, natural, and helpful words.
          2. Tone should be respectful and warm (e.g. in Hindi, address them respectfully using "जी" and "आप").
          3. Offer practical local city tips (like local transport, local PG areas, simple local language greetings) and direct banking tips (remittance, UPI QR, student account, or loan pre-approvals) that fit their profile.
          4. IMPORTANT: Do not use any emojis in your response. Strictly return plain text only. No smileys, no icons.
          5. Keep the response concise, under 350 characters.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        inMemoryDb.logEvent('SAATHI_CHAT_RESPONSE', `Gemini generated Saathi response for ${name}`, { response: text });
        return text;
      } catch (error) {
        inMemoryDb.logEvent('SAATHI_CHAT_ERROR', `Gemini API error in Saathi, falling back. Error: ${error.message}`);
      }
    }

    // Fallback logic
    const segmentTemplates = FALLBACK_RESPONSES[segment] || FALLBACK_RESPONSES['worker'];
    const languageTemplates = segmentTemplates[preferredLanguage] || segmentTemplates['English'] || FALLBACK_RESPONSES['worker']['English'];

    let responseText = "";

    if (query.includes('room') || query.includes('pg') || query.includes('hostel') || query.includes('किराया') || query.includes('कमरा') || query.includes('आवास')) {
      responseText = languageTemplates.room;
    } else if (query.includes('language') || query.includes('speak') || query.includes('learn') || query.includes('कन्नड़') || query.includes('मराठी') || query.includes('भाषा') || query.includes('बोले')) {
      responseText = languageTemplates.language;
    } else if (query.includes('remit') || query.includes('money') || query.includes('send') || query.includes('transfer') || query.includes('पैसा') || query.includes('तबादला') || query.includes('भेजें')) {
      responseText = languageTemplates.remittance;
    } else if ((segment === 'student') && (query.includes('loan') || query.includes('scholar') || query.includes('ऋण') || query.includes('लोन'))) {
      responseText = languageTemplates.loan;
    } else {
      responseText = languageTemplates.general;
    }

    inMemoryDb.logEvent('SAATHI_CHAT_RESPONSE', `Generated fallback Saathi response for ${name}`);
    return responseText;
  }
};

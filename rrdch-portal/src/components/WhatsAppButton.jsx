import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ 
  phone, 
  token, 
  department, 
  departmentKannada,
  date, 
  lang = 'en',
  time = '9:00 AM'
}) {
  // Generate bilingual WhatsApp message as per Feature 3 spec
  const generateWhatsAppMessage = () => {
    // Clean phone number - remove leading zero if present
    const safePhone = phone || '';
    const cleanPhone = safePhone.startsWith('0') ? safePhone.slice(1) : safePhone;
    
    const english = `*RRDCH Appointment Reminder*

Hello ${cleanPhone},

📅 Date: ${date}
⏰ Time: ${time}
🏥 Department: ${department}
🎫 Token: ${token}

Please arrive 10 minutes early with a valid ID.
📍 RRDCH, Mysore Road, Kumbalgodu
5 min auto from Kumbalgodu bus stop
📞 080-28437150`;

    const kannada = `*RRDCH ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ನೆನಪಿಕೆ*

ನಮಸ್ಕಾರ ${cleanPhone} ಅವರೇ,

📅 ದಿನಾಂಕ: ${date}
⏰ ಸಮಯ: ${time}
🏥 ವಿಭಾಗ: ${departmentKannada || department}
🎫 ಟೋಕನ್: ${token}

10 ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ಬನ್ನಿ.`;

    return encodeURIComponent(`${english}\n\n---\n\n${kannada}`);
  };

  // Clean phone for wa.me URL (must include country code, without +)
  const safePhone = phone || '';
  const cleanPhoneForUrl = safePhone.startsWith('0') ? safePhone.slice(1) : safePhone;
  const whatsappUrl = `https://wa.me/91${cleanPhoneForUrl}?text=${generateWhatsAppMessage()}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 hover:opacity-90"
      style={{ backgroundColor: '#25D366', color: 'white' }}
    >
      <MessageCircle size={20} />
      {lang === 'kn' ? 'WhatsApp ಜ್ಞಾಪನೆ ಕಳುಹಿಸಿ' : 'Send WhatsApp Reminder'}
    </a>
  );
}

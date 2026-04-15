export const SYMPTOMS = [
  {
    id: 'tooth-pain',
    label: 'Tooth Pain',
    labelKn: 'ಹಲ್ಲು ನೋವು',
    icon: 'tooth',
    department: 'conservative-dentistry'
  },
  {
    id: 'bleeding-gums',
    label: 'Bleeding Gums',
    labelKn: 'ವಸಡು ರಕ್ತಸ್ರಾವ',
    icon: 'droplets',
    department: 'periodontology'
  },
  {
    id: 'child-teeth',
    label: "Child's Teeth",
    labelKn: 'ಮಕ್ಕಳ ಹಲ್ಲು',
    icon: 'baby',
    department: 'pedodontics'
  },
  {
    id: 'braces',
    label: 'Braces / Alignment',
    labelKn: 'ಹಲ್ಲು ಸರಳಗೊಳಿಸುವಿಕೆ',
    icon: 'smile',
    department: 'orthodontics'
  },
  {
    id: 'cleaning',
    label: 'Cleaning & Checkup',
    labelKn: 'ಸ್ವಚ್ಛತೆ ಮತ್ತು ತಪಾಸಣೆ',
    icon: 'shield-check',
    department: 'oral-medicine'
  },
  {
    id: 'jaw-surgery',
    label: 'Jaw / Surgery',
    labelKn: 'ದವಡೆ / ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ',
    icon: 'scissors',
    department: 'oral-surgery'
  },
  {
    id: 'mouth-ulcer',
    label: 'Mouth Ulcer / Wound',
    labelKn: 'ಬಾಯಿ ಹುಣ್ಣು',
    icon: 'alert-circle',
    department: 'oral-medicine'
  },
  {
    id: 'missing-teeth',
    label: 'Missing / Broken Teeth',
    labelKn: 'ಬಿದ್ದ / ಮುರಿದ ಹಲ್ಲು',
    icon: 'minus-circle',
    department: 'prosthetics'
  },
  {
    id: 'other',
    label: 'Not Sure / Other',
    labelKn: 'ಗೊತ್ತಿಲ್ಲ / ಇತರ',
    icon: 'help-circle',
    department: 'oral-medicine'
  }
];

export const getSymptomById = (id) => SYMPTOMS.find(s => s.id === id);

export const getDepartmentBySymptom = (symptomId) => {
  const symptom = getSymptomById(symptomId);
  return symptom ? symptom.department : 'oral-medicine';
};

export const DEPARTMENTS = {
  'oral-medicine': {
    name: 'Oral Medicine & Radiology',
    nameKn: 'ಮೌಖಿಕ ವೈದ್ಯಕೀಯ ಮತ್ತು ವಿಕಿರಣ ಶಾಸ್ತ್ರ',
    treats: ['Mouth ulcers', 'Jaw pain', 'Oral cancer screening', 'General assessment'],
    avgTimePerPatient: 12,
    description: 'Comprehensive oral health assessment, diagnosis of oral diseases, and imaging services.'
  },
  'conservative-dentistry': {
    name: 'Conservative Dentistry & Endodontics',
    nameKn: 'ಸಂರಕ್ಷಣಾ ದಂತ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಎಂಡೋಡಾಂಟಿಕ್ಸ್',
    treats: ['Tooth decay', 'Cavities', 'Root canal', 'Tooth sensitivity'],
    avgTimePerPatient: 15,
    description: 'Tooth preservation through fillings, root canal treatments, and restorative procedures.'
  },
  'periodontology': {
    name: 'Periodontology',
    nameKn: 'ಪೀರಿಯೊಡಾಂಟಾಲಜಿ',
    treats: ['Bleeding gums', 'Gum disease', 'Loose teeth', 'Bad breath'],
    avgTimePerPatient: 12,
    description: 'Diagnosis and treatment of gum diseases, scaling, and periodontal surgery.'
  },
  'pedodontics': {
    name: 'Pedodontics & Preventive Dentistry',
    nameKn: 'ಮಕ್ಕಳ ದಂತ ಚಿಕಿತ್ಸೆ ಮತ್ತು ತಡೆಗಟ್ಟುವ ದಂತ ವಿಜ್ಞಾನ',
    treats: ["Children's tooth problems", 'Milk teeth', 'Fluoride treatment', 'Dental habits'],
    avgTimePerPatient: 12,
    description: 'Specialized dental care for children including preventive treatments and habit counseling.'
  },
  'orthodontics': {
    name: 'Orthodontics & Dentofacial Orthopedics',
    nameKn: 'ಆರ್ಥೋಡಾಂಟಿಕ್ಸ್ ಮತ್ತು ಡೆಂಟೊಫೇಷಿಯಲ್ ಆರ್ಥೋಪೆಡಿಕ್ಸ್',
    treats: ['Crooked teeth', 'Braces', 'Jaw alignment', 'Spacing issues'],
    avgTimePerPatient: 15,
    description: 'Correction of misaligned teeth and jaws using braces, aligners, and other appliances.'
  },
  'oral-surgery': {
    name: 'Oral & Maxillofacial Surgery',
    nameKn: 'ಮೌಖಿಕ ಮತ್ತು ಮ್ಯಾಕ್ಸಿಲ್ಲೋಫೇಷಿಯಲ್ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ',
    treats: ['Tooth extraction', 'Wisdom teeth', 'Jaw surgery', 'Facial trauma'],
    avgTimePerPatient: 20,
    description: 'Surgical procedures including extractions, wisdom tooth removal, and jaw corrections.'
  },
  'prosthetics': {
    name: 'Prosthetics & Crown and Bridge',
    nameKn: 'ಕೃತಕ ದಂತ ಮತ್ತು ಕ್ರೌನ್ ಬ್ರಿಡ್ಜ್',
    treats: ['Dentures', 'Crowns', 'Bridges', 'Missing teeth replacement'],
    avgTimePerPatient: 18,
    description: 'Replacement of missing teeth with crowns, bridges, dentures, and implants.'
  },
  'public-health': {
    name: 'Public Health Dentistry',
    nameKn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ದಂತ ವಿಜ್ಞಾನ',
    treats: ['Community dental health', 'Preventive care', 'Dental camps'],
    avgTimePerPatient: 10,
    description: 'Community-based dental health programs, screening camps, and preventive education.'
  },
  'oral-pathology': {
    name: 'Oral & Maxillofacial Pathology',
    nameKn: 'ಮೌಖಿಕ ರೋಗ ವಿಜ್ಞಾನ',
    treats: ['Oral lesions', 'Biopsy', 'Oral cancer detection'],
    avgTimePerPatient: 15,
    description: 'Laboratory diagnosis of oral diseases, biopsies, and histopathological examinations.'
  },
  'implantology': {
    name: 'Implantology',
    nameKn: 'ಇಂಪ್ಲಾಂಟಾಲಜಿ',
    treats: ['Dental implants', 'Bone grafting', 'Implant-supported dentures'],
    avgTimePerPatient: 25,
    description: 'Advanced tooth replacement solutions using dental implants and bone augmentation.'
  }
};

export const DEPARTMENT_CODES = Object.keys(DEPARTMENTS);

export const getDepartmentName = (code, lang = 'en') => {
  const dept = DEPARTMENTS[code];
  if (!dept) return '';
  return lang === 'kn' ? dept.nameKn : dept.name;
};

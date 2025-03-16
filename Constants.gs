// Create a namespace to avoid redeclarations
var NepaliCalendar = {};

// BS Calendar data - days in each month for each year
NepaliCalendar.CALENDAR_DATA = {
  2079: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 30, 30],
  2081: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2082: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]
};

// Nepali month names
NepaliCalendar.MONTHS = [
  "Baishakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

// Reference dates for conversion
NepaliCalendar.REF_DATE_AD = new Date(2022, 3, 14); // April 14, 2022 (0-indexed month)
NepaliCalendar.REF_DATE_BS = { year: 2079, month: 1, day: 1 }; // Baishakh 1, 2079 BS
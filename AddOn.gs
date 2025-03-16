/**
 * Creates a card for the add-on homepage - shows monthly calendar
 */
function onHomepage(e) {
  var nepaliDate = getCurrentNepaliDate();
  return createCalendarCard(nepaliDate.year, nepaliDate.month);
}

/**
 * Handles event updates if needed
 */
function onEventUpdate(e) {
  return null;
}

/**
 * Creates a weekly view card
 */
function createWeeklyCard() {
  var today = new Date();
  var nepaliDate = getCurrentNepaliDate();
  
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Nepali Calendar - Weekly View')
      .setSubtitle('Today in BS: ' + nepaliDate.day + ' ' + nepaliDate.monthName + ' ' + nepaliDate.year));
  
  // Create section for this week's dates
  var weekSection = CardService.newCardSection();
  
  // Days of week
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Show dates for 2 days before today through 2 days after (5 days total)
  for (var i = -2; i <= 2; i++) {
    var date = new Date(today);
    date.setDate(today.getDate() + i);
    
    var bsDate = convertGregorianToBS(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    
    var dateLabel = "";
    
    if (i === 0) {
      dateLabel = "Today";
    } else if (i === -1) {
      dateLabel = "Yesterday";
    } else if (i === 1) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = dayNames[date.getDay()];
    }
    
    // Format date text
    var dateText = dateLabel + " (" + (date.getMonth() + 1) + "/" + date.getDate() + "): " + 
                  bsDate.day + " " + bsDate.monthName + " " + bsDate.year;
    
    weekSection.addWidget(CardService.newTextParagraph().setText(dateText));
    
    // Add a separator after each date except the last one
    if (i < 2) {
      weekSection.addWidget(CardService.newDivider());
    }
  }
  
  // Add button for monthly calendar view
  var buttonsSection = CardService.newCardSection()
    .addWidget(CardService.newTextButton()
      .setText('Return to Monthly View')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('showNepaliCalendar')));
  
  // Add sections to card
  card.addSection(weekSection);
  card.addSection(buttonsSection);
  
  return card.build();
}

/**
 * Shows weekly view when requested
 */
function showWeeklyView(e) {
  var card = createWeeklyCard();
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

/**
 * Shows the Nepali calendar (monthly view)
 */
function showNepaliCalendar(e) {
  var nepaliDate = getCurrentNepaliDate();
  var card = createCalendarCard(nepaliDate.year, nepaliDate.month);
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

/**
 * Creates a calendar card for the given year and month
 */
function createCalendarCard(year, month) {
  // Get the month data
  var monthData = getMonthData(year, month);
  var currentDate = getCurrentNepaliDate();
  
  // Build section for calendar navigation
  var headerSection = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("📅 BS Calendar: " + 
      NepaliCalendar.MONTHS[month-1] + " " + year));
  
  // Add navigation buttons  
  headerSection.addWidget(CardService.newButtonSet()
    .addButton(CardService.newTextButton()
      .setText("◀ Previous")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("navigateMonth")
        .setParameters({year: String(year), month: String(month), direction: "prev"})))
    .addButton(CardService.newTextButton()
      .setText("Next ▶")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("navigateMonth")
        .setParameters({year: String(year), month: String(month), direction: "next"}))));
        
  headerSection.addWidget(CardService.newDivider());
  
  // Create day list section
  var daysSection = CardService.newCardSection()
    .setHeader("Days in " + NepaliCalendar.MONTHS[month-1] + " " + year);
  
  // Get days of week and month names
  var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Generate a list of days
  for (var day = 1; day <= monthData.daysInMonth; day++) {
    // Convert BS date to Gregorian
    var gregDate = convertBSToGregorian(year, month, day);
    var dayDate = new Date(gregDate.year, gregDate.month - 1, gregDate.day);
    var dayOfWeek = daysOfWeek[dayDate.getDay()];
    
    // Check if this is today
    var isToday = (day === currentDate.day && 
                  month === currentDate.month && 
                  year === currentDate.year);
    
    // Format day string
    var dayString = day + " " + NepaliCalendar.MONTHS[month-1] + " / " + 
                   gregDate.day + " " + monthNames[gregDate.month-1] + " / " + 
                   dayOfWeek.substring(0, 3);
    
    if (isToday) {
      dayString = "➡️ " + dayString;
    }
    
    daysSection.addWidget(CardService.newTextParagraph().setText(dayString));
    
    // Add a divider after every 7 days
    if (day % 7 === 0 && day < monthData.daysInMonth) {
      daysSection.addWidget(CardService.newDivider());
    }
  }
  
  // Add current date information and weekly view button
  var dateInfoSection = CardService.newCardSection();
  
  // Get Gregorian date for today's Nepali date
  var todayGreg = convertBSToGregorian(currentDate.year, currentDate.month, currentDate.day);
  var today = new Date();
  var todayDayOfWeek = daysOfWeek[today.getDay()].substring(0, 3);
  
  dateInfoSection.addWidget(CardService.newTextParagraph().setText(
    "📌 Today: " + currentDate.day + " " + currentDate.monthName + " / " + 
    todayGreg.day + " " + monthNames[todayGreg.month-1] + " / " + todayDayOfWeek
  ));

  dateInfoSection.addWidget(CardService.newTextButton()
    .setText("📅 Show Weekly View")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("showWeeklyView")));
  
  // Build and return the complete card
  return CardService.newCardBuilder()
    .addSection(headerSection)
    .addSection(daysSection)
    .addSection(dateInfoSection)
    .build();
}

/**
 * Navigate to previous or next month
 */
function navigateMonth(e) {
  var year = parseInt(e.parameters.year);
  var month = parseInt(e.parameters.month);
  var direction = e.parameters.direction;
  
  if (direction === "prev") {
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
  } else {
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  
  // Check if we have data for this year
  if (!NepaliCalendar.CALENDAR_DATA[year]) {
    var availableYears = Object.keys(NepaliCalendar.CALENDAR_DATA);
    year = parseInt(availableYears[0]);
  }
  
  var card = createCalendarCard(year, month);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

/**
 * Handles add-on initialization
 */
function onOpen(e) {
  var ui = CalendarApp.getUi();
  ui.createAddonMenu()
    .addItem('Show Nepali Calendar', 'showNepaliCalendar')
    .addToUi();
}
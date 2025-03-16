# Nepali Calendar Add-on for Google Calendar

A Google Calendar Add-on that integrates the Bikram Sambat (BS) calendar system used in Nepal with Google Calendar.

## Features

- View monthly Nepali (Bikram Sambat) calendar
- See Nepali dates with their corresponding Gregorian dates
- Navigate between months
- Instant conversion between Nepali and Gregorian dates
- Create Google Calendar events using Nepali dates (in progress)

## Installation

### For Testing/Development
1. Visit [script.google.com](https://script.google.com/) and create a new project
2. Copy each file from this repository into your project
3. Enable the Google Calendar API in your Apps Script project
4. Deploy the project as a test deployment
5. Open Google Calendar and test the add-on

### For Users
1. (Once published) Install from the Google Workspace Marketplace
2. Open Google Calendar
3. Find the add-on in the side panel
4. Click to open the Nepali Calendar

## Files
- `AddOn.gs` - Main functionality, date conversion, and UI code
- `Constants.gs` - Calendar data and reference dates
- `appsscript.json` - Project manifest and configuration

## Permissions
This add-on requires the following permissions:
- Calendar access (to create events)
- Calendar add-on execution (to run as an add-on)


## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

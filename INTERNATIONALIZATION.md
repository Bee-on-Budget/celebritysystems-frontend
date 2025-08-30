# Internationalization (i18n) Setup

This project now supports multiple languages with a focus on English and Arabic. The internationalization system is built using `react-i18next` and provides comprehensive translation support for the ticket management system.

## Features

- **Multi-language Support**: English and Arabic
- **RTL Support**: Full right-to-left layout support for Arabic
- **Dynamic Language Switching**: Switch languages on the fly
- **Comprehensive Translations**: All ticket-related content is translated
- **Automatic Language Detection**: Detects user's preferred language

## Languages Supported

### English (en)
- Default language
- Left-to-right (LTR) layout
- All UI text in English

### Arabic (العربية)
- Full Arabic translation
- Right-to-left (RTL) layout
- Culturally appropriate translations

## How to Use

### 1. Language Switcher
The language switcher is located in the header of the application. Users can click on either "English" or "العربية" to switch languages.

### 2. Using Translations in Components

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('tickets.createTicket')}</h1>
      <p>{t('tickets.ticketForm.description')}</p>
    </div>
  );
};
```

### 3. Translation Keys Structure

The translation files are organized hierarchically:

```json
{
  "common": {
    "create": "Create",
    "update": "Update",
    "delete": "Delete"
  },
  "tickets": {
    "title": "Tickets",
    "createTicket": "Create Ticket",
    "ticketForm": {
      "title": "Title",
      "description": "Description"
    }
  }
}
```

## Adding New Translations

### 1. Add to English File
Add new translation keys to `src/i18n/locales/en.json`:

```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### 2. Add to Arabic File
Add corresponding Arabic translations to `src/i18n/locales/ar.json`:

```json
{
  "newFeature": {
    "title": "ميزة جديدة",
    "description": "هذه ميزة جديدة"
  }
}
```

### 3. Use in Component
Use the translation in your component:

```jsx
const { t } = useTranslation();
<h1>{t('newFeature.title')}</h1>
```

## RTL Support

The system automatically handles RTL layout when Arabic is selected:

- Text alignment switches to right-to-left
- Margins and paddings are automatically adjusted
- Icons and layouts are mirrored appropriately

## Demo Page

Visit `/language-demo` to see the internationalization system in action. This page showcases:

- Language switching functionality
- Ticket form translations
- Ticket list translations
- Common UI elements
- Navigation translations

## File Structure

```
src/
├── i18n/
│   ├── index.js              # i18n configuration
│   └── locales/
│       ├── en.json           # English translations
│       └── ar.json           # Arabic translations
├── components/
│   └── LanguageSwitcher.jsx  # Language switcher component
└── features/
    └── demo/
        └── LanguageDemo.jsx   # Demo page
```

## Configuration

The i18n system is configured in `src/i18n/index.js` with:

- Automatic language detection
- Fallback to English
- Local storage persistence
- HTML lang attribute updates
- RTL direction support

## Best Practices

1. **Use Translation Keys**: Always use translation keys instead of hardcoded text
2. **Nested Structure**: Organize translations in logical, nested structures
3. **Consistent Naming**: Use consistent naming conventions for translation keys
4. **Context**: Provide context for translators in comments if needed
5. **Testing**: Test both languages thoroughly, especially RTL layout

## Adding New Languages

To add a new language:

1. Create a new translation file in `src/i18n/locales/`
2. Add the language to the resources in `src/i18n/index.js`
3. Update the LanguageSwitcher component
4. Add RTL support if the language requires it

## Troubleshooting

### Language Not Switching
- Check browser console for errors
- Verify translation files are properly imported
- Check that the language switcher is properly connected

### RTL Layout Issues
- Ensure CSS RTL classes are properly defined
- Check that the HTML dir attribute is being set
- Verify Tailwind RTL utilities are working

### Missing Translations
- Check that all translation keys exist in both language files
- Verify the translation key structure matches between files
- Use the `t()` function with the correct key path

## Dependencies

- `react-i18next`: React integration for i18next
- `i18next`: Core internationalization framework
- `i18next-browser-languagedetector`: Automatic language detection

## Future Enhancements

- [ ] Add more languages (French, Spanish, etc.)
- [ ] Implement pluralization rules
- [ ] Add date and number formatting
- [ ] Implement translation memory
- [ ] Add translation management interface



const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['en', 'pt-BR'],
    localeDetection: false, // Disable automatic locale detection for now
  },
  localePath: path.resolve('./public/locales'),
};
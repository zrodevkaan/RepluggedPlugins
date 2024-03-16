export default [
  {
    find: ".USER_SETTINGS_PROFILE_THEME_ACCENT",
    replacements: [
      {
        match: /RESET_PROFILE_THEME}\)(?<=color:(\w+),.{0,500}?color:(\w+),.{0,500}?)/,
        replace: '$&,replugged.plugins.getExports("dev.kaan.FakeProfileThemes").owo({primary:$1,accent:$2})'
      },
    ],
  },
];

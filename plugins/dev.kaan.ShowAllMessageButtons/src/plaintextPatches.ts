export default [
  {
    find: "showMessageRemindersActions:",
    replacements: [
      {
        match: /isExpanded:(.+?),/,
        replace: `isExpanded:true,`,
      },
    ],
  },
];

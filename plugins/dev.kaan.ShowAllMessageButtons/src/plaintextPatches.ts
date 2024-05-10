export default [
  {
    find: "showMessageRemindersActions:",
    replacements: [
      {
        match: /isExpanded:.{10,30}(?=.*&&),/,
        replace: `isExpanded:true,`,
      },
    ],
  },
];

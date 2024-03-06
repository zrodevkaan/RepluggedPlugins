export default [
  {
    find: "showMessageRemindersActions:",
    replacements: [
      {
        match: /isExpanded:.{10,20}?,/,
        replace: `isExpanded:true,`,
      },
    ],
  },
];

  {
    find: ".default.Messages.ACCOUNT_A11Y_LABEL",
    replacements: [
      {
        match: /(\.default\.Messages\.ACCOUNT_A11Y_LABEL,children:\[.+?\.default,{}\))]/,
        replace: `$&replugged.plugins.getExports('dev.replugged.CakeDay')?.addPanelButton?.()??null,`,
      },
    ],
  },
]

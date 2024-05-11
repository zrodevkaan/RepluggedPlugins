export default [
  {
    find: ".Messages.USER_PROFILE_MODAL,children:[",
    replacements: [
      {
        match: /.Messages\.BOTS_DATA_ACCESS_TAB}\):null/,
        replace: (prefix: string) =>
          `${prefix},replugged.plugins.getExports('dev.kaan.mutualGroups').default()`,
      },
    ],
  },
]

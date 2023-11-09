export default {
  find: "this.trackMemberListViewed()",
  replacements: [
    {
      match: /=\w+\.memo\(\w+=>{let{colorRoleId:/,
      replace: (suffix: string): string =>
        `=window[Symbol.for("dev.replugged.CakeDay")]${suffix}`,
    },
  ],
}

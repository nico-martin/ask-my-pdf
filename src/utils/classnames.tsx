const cn = (...classes: Array<Record<string, boolean> | string>): string =>
  classes
    .map((entry) =>
      typeof entry === 'string'
        ? entry
        : Object.entries(entry || {})
            .filter(([, append]) => append)
            .map(([cl]) => cl)
            .join(' ')
    )
    .filter((e) => e !== '')
    .join(' ');

export default cn;

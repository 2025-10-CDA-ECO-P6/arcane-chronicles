export interface QuantityLabels {
  singular: string;
  plural: string;
  none: string;
}

export const formatQuantity = (count: number, { singular, plural, none }: QuantityLabels) => {
  if (count === 0) {
    return `${none} ${singular}`;
  }
  return `${count} ${count === 1 ? singular : plural}`;
};

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

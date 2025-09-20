
export interface ConversionResult {
  phpCode: string;
  sqlCode: string;
  feedback: string;
}

export enum ViewType {
  PHP = 'PHP',
  SQL = 'SQL',
  Feedback = 'Feedback',
  HTML = 'HTML',
  CSS = 'CSS',
  Preview = 'Preview',
}

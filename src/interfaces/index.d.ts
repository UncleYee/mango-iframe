interface LabelValue<T = string> {
  label: string
  value: T
}

interface Module {
  component?: any;
  moduleID: number;
  moduleData: any;
}
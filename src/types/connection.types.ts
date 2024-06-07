export interface ConnectionContextProps {
  data: DataProps[];
  setData: React.Dispatch<React.SetStateAction<DataProps[]>>;
  connectToCharacteristic: (
    peripheralId: string,
    service: string,
    characteristic: string
  ) => Promise<void>;
  writeToCharacteristic: (
    peripheralId: string,
    service: string,
    characteristic: string,
    data: string
  ) => Promise<void>;
  clearLog: () => void;
}

export interface DataProps {
  message: string;
  timestamp: number;
  isCommand: boolean;
}

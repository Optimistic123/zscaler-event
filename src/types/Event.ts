export interface Event {
  id: string;
  type: string;
  severity: string;
  kill_chain_phase: string;
  timestamp: string;
  'attacker.id': string;
  'attacker.ip': string;
  'attacker.name': string;
  'attacker.port': number;
  'decoy.id': number;
  'decoy.name': string;
  'decoy.group': string;
  'decoy.ip': string;
  'decoy.port': number;
  'decoy.type': string;
}

export interface TableColumn {
  key: string;
  label: string;
  visible: boolean;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  value: string;
}


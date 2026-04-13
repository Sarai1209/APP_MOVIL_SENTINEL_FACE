import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Employee {
  employee_id:   number;
  full_name:     string;
  document_id:   string;
  is_active:     boolean;
  registered_by: string;
  created_at:    string;
  photoUri?:     string;
}

export interface AccessLog {
  log_id:        number;
  full_name:     string | null;
  access_result: 'GRANTED' | 'DENIED';
  liveness:      'REAL' | 'SPOOFING' | 'UNKNOWN';
  confidence:    number;
  event_time:    string;
  snapshot_color: string;
}

export interface SecurityAlert {
  alert_id:    number;
  alert_type:  string;
  severity:    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  resolved:    boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at:  string;
  log_id:      number;
}

export interface AuditEntry {
  audit_id:    number;
  action:      string;
  target_table: string;
  admin_name:  string;
  created_at:  string;
}

function daysAgo(n: number, hour = 9, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function minsAgo(n: number) {
  return new Date(Date.now() - n * 60000).toISOString();
}

const SEED_EMPLOYEES: Employee[] = [
  { employee_id: 1, full_name: 'Sarai Díaz',      document_id: '1023456789', is_active: true,  registered_by: 'Admin Sentinel', created_at: daysAgo(30) },
  { employee_id: 2, full_name: 'Carlos López',    document_id: '1034567890', is_active: true,  registered_by: 'Admin Sentinel', created_at: daysAgo(25) },
  { employee_id: 3, full_name: 'María Torres',    document_id: '1045678901', is_active: true,  registered_by: 'Admin Sentinel', created_at: daysAgo(20) },
  { employee_id: 4, full_name: 'Juan Herrera',    document_id: '1056789012', is_active: false, registered_by: 'Admin Sentinel', created_at: daysAgo(15) },
  { employee_id: 5, full_name: 'Ana Martínez',    document_id: '1067890123', is_active: true,  registered_by: 'Admin Sentinel', created_at: daysAgo(10) },
  { employee_id: 6, full_name: 'Pedro Ramírez',   document_id: '1078901234', is_active: true,  registered_by: 'Director General', created_at: daysAgo(7) },
  { employee_id: 7, full_name: 'Laura Jiménez',   document_id: '1089012345', is_active: true,  registered_by: 'Director General', created_at: daysAgo(3) },
  { employee_id: 8, full_name: 'Andrés Castillo', document_id: '1090123456', is_active: true,  registered_by: 'Admin Sentinel', created_at: daysAgo(1) },
];

const SNAPSHOT_COLORS = ['#1A2E45','#2E1A45','#1A452E','#45331A','#1A3545','#451A2E'];

const SEED_LOGS: AccessLog[] = [
  { log_id: 1,  full_name: 'Sarai Díaz',      access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.94, event_time: minsAgo(5),   snapshot_color: SNAPSHOT_COLORS[0] },
  { log_id: 2,  full_name: 'Carlos López',    access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.89, event_time: minsAgo(22),  snapshot_color: SNAPSHOT_COLORS[1] },
  { log_id: 3,  full_name: null,              access_result: 'DENIED',  liveness: 'SPOOFING', confidence: 0.0,  event_time: minsAgo(45),  snapshot_color: SNAPSHOT_COLORS[2] },
  { log_id: 4,  full_name: 'María Torres',    access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.91, event_time: minsAgo(60),  snapshot_color: SNAPSHOT_COLORS[3] },
  { log_id: 5,  full_name: null,              access_result: 'DENIED',  liveness: 'UNKNOWN',  confidence: 0.0,  event_time: minsAgo(95),  snapshot_color: SNAPSHOT_COLORS[4] },
  { log_id: 6,  full_name: 'Ana Martínez',    access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.87, event_time: minsAgo(130), snapshot_color: SNAPSHOT_COLORS[5] },
  { log_id: 7,  full_name: 'Pedro Ramírez',   access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.92, event_time: daysAgo(0, 8, 30), snapshot_color: SNAPSHOT_COLORS[0] },
  { log_id: 8,  full_name: null,              access_result: 'DENIED',  liveness: 'SPOOFING', confidence: 0.0,  event_time: daysAgo(0, 7, 45), snapshot_color: SNAPSHOT_COLORS[1] },
  { log_id: 9,  full_name: 'Laura Jiménez',   access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.96, event_time: daysAgo(1, 17, 10), snapshot_color: SNAPSHOT_COLORS[2] },
  { log_id: 10, full_name: 'Andrés Castillo', access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.88, event_time: daysAgo(1, 9, 5),  snapshot_color: SNAPSHOT_COLORS[3] },
  { log_id: 11, full_name: 'Juan Herrera',    access_result: 'DENIED',  liveness: 'REAL',     confidence: 0.31, event_time: daysAgo(1, 8, 20), snapshot_color: SNAPSHOT_COLORS[4] },
  { log_id: 12, full_name: 'Sarai Díaz',      access_result: 'GRANTED', liveness: 'REAL',     confidence: 0.93, event_time: daysAgo(2, 16, 0),  snapshot_color: SNAPSHOT_COLORS[5] },
];

const SEED_ALERTS: SecurityAlert[] = [
  { alert_id: 1, alert_type: 'SPOOFING_ATTEMPT', severity: 'CRITICAL', description: 'Se detectó un intento de acceso usando una fotografía estática en la Entrada Principal. El modelo MiniFASNetV2 detectó artefactos de impresión.', resolved: false, resolved_by: null, resolved_at: null, created_at: minsAgo(45), log_id: 3 },
  { alert_id: 2, alert_type: 'UNKNOWN_FACE',     severity: 'HIGH',     description: 'Persona no registrada intentó acceder por la Puerta Trasera. No se encontró coincidencia en la base de empleados activos.', resolved: false, resolved_by: null, resolved_at: null, created_at: minsAgo(95), log_id: 5 },
  { alert_id: 3, alert_type: 'SPOOFING_ATTEMPT', severity: 'CRITICAL', description: 'Segundo intento de spoofing detectado en menos de 2 horas. Posible amenaza persistente en el perímetro.', resolved: false, resolved_by: null, resolved_at: null, created_at: daysAgo(0, 7, 45), log_id: 8 },
  { alert_id: 4, alert_type: 'ACCESS_DENIED',    severity: 'MEDIUM',   description: 'Empleado Juan Herrera intentó acceso con baja confianza (31%). Estado de cuenta: Inactivo.', resolved: true, resolved_by: 'Admin Sentinel', resolved_at: daysAgo(1, 10, 0), created_at: daysAgo(1, 8, 20), log_id: 11 },
  { alert_id: 5, alert_type: 'UNKNOWN_FACE',     severity: 'LOW',      description: 'Rostro no identificado detectado en zona de acceso secundario. Posiblemente visitante no registrado.', resolved: true, resolved_by: 'Director General', resolved_at: daysAgo(2, 11, 30), created_at: daysAgo(2, 9, 0), log_id: 5 },
];

const SEED_AUDIT: AuditEntry[] = [
  { audit_id: 1, action: 'CREATE_EMPLOYEE', target_table: 'employees', admin_name: 'Admin Sentinel',  created_at: daysAgo(1) },
  { audit_id: 2, action: 'RESOLVE_ALERT',   target_table: 'alerts',    admin_name: 'Admin Sentinel',  created_at: daysAgo(1, 10, 0) },
  { audit_id: 3, action: 'RESOLVE_ALERT',   target_table: 'alerts',    admin_name: 'Director General', created_at: daysAgo(2, 11, 30) },
  { audit_id: 4, action: 'DELETE_EMPLOYEE', target_table: 'employees', admin_name: 'Admin Sentinel',  created_at: daysAgo(3) },
  { audit_id: 5, action: 'CREATE_EMPLOYEE', target_table: 'employees', admin_name: 'Director General', created_at: daysAgo(7) },
];

interface MockDataContextType {
  employees:    Employee[];
  logs:         AccessLog[];
  alerts:       SecurityAlert[];
  audit:        AuditEntry[];
  addEmployee:  (emp: Omit<Employee, 'employee_id' | 'created_at'>) => void;
  deleteEmployee: (id: number, adminName: string) => void;
  resolveAlert: (id: number, adminName: string) => void;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(SEED_EMPLOYEES);
  const [logs]                    = useState<AccessLog[]>(SEED_LOGS);
  const [alerts,    setAlerts]    = useState<SecurityAlert[]>(SEED_ALERTS);
  const [audit,     setAudit]     = useState<AuditEntry[]>(SEED_AUDIT);

  const addEmployee = (emp: Omit<Employee, 'employee_id' | 'created_at'>) => {
    const newEmp: Employee = {
      ...emp,
      employee_id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setEmployees(prev => [newEmp, ...prev]);
    setAudit(prev => [{
      audit_id: Date.now(), action: 'CREATE_EMPLOYEE',
      target_table: 'employees', admin_name: emp.registered_by,
      created_at: new Date().toISOString(),
    }, ...prev]);
  };

  const deleteEmployee = (id: number, adminName: string) => {
    const emp = employees.find(e => e.employee_id === id);
    setEmployees(prev => prev.filter(e => e.employee_id !== id));
    setAudit(prev => [{
      audit_id: Date.now(), action: 'DELETE_EMPLOYEE',
      target_table: 'employees', admin_name: adminName,
      created_at: new Date().toISOString(),
    }, ...prev]);
  };

  const resolveAlert = (id: number, adminName: string) => {
    setAlerts(prev => prev.map(a =>
      a.alert_id === id
        ? { ...a, resolved: true, resolved_by: adminName, resolved_at: new Date().toISOString() }
        : a
    ));
    setAudit(prev => [{
      audit_id: Date.now(), action: 'RESOLVE_ALERT',
      target_table: 'alerts', admin_name: adminName,
      created_at: new Date().toISOString(),
    }, ...prev]);
  };

  return (
    <MockDataContext.Provider value={{ employees, logs, alerts, audit, addEmployee, deleteEmployee, resolveAlert }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const ctx = useContext(MockDataContext);
  if (!ctx) throw new Error('useMockData debe usarse dentro de MockDataProvider');
  return ctx;
}

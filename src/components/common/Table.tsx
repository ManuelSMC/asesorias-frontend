interface TableProps<T> {
  data: T[];
  columns: { key: keyof T | string; header: string }[];
  actions?: (item: T) => React.ReactNode;
}

const Table = <T extends { idDivision?: number; idProgramaEducativo?: number }>({ data, columns, actions }: TableProps<T>) => (
  <div className="table-container card">
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
          {actions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.idDivision || item.idProgramaEducativo}>
            {columns.map(col => (
              <td key={String(col.key)}>
                {typeof col.key === 'string' && col.key.includes('.') ? 
                  (() => {
                    const [parent, child] = col.key.split('.');
                    const parentObj = (item as Record<string, unknown>)[parent];
                    return String(parentObj && typeof parentObj === 'object' ? (parentObj as Record<string, unknown>)[child] : '');
                  })() : 
                  String(item[col.key as keyof T])
                }
              </td>
            ))}
            {actions && <td>{actions(item)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
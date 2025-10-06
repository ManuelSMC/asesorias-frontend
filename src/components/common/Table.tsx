interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; header: string }[];
  actions?: (item: T) => React.ReactNode;
}

const Table = <T extends { idDivision?: number; idProgramaEducativo?: number }>({ data, columns, actions }: TableProps<T>) => (
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100">
        {columns.map(col => <th key={String(col.key)} className="p-2 text-left">{col.header}</th>)}
        {actions && <th className="p-2">Acciones</th>}
      </tr>
    </thead>
    <tbody>
      {data.map(item => (
        <tr key={item.idDivision || item.idProgramaEducativo} className="border-b">
          {columns.map(col => <td key={String(col.key)} className="p-2">{String(item[col.key])}</td>)}
          {actions && <td className="p-2">{actions(item)}</td>}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
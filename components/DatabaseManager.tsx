
import React, { useState, useEffect } from 'react';
import { DBTable, TableColumn } from '../types';
import { getAIResponse } from '../services/geminiService';

const INITIAL_TABLES: DBTable[] = [
  {
    name: 'usuarios',
    columns: [
      { name: 'id', type: 'INT', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'usuario', type: 'VARCHAR(50)' },
      { name: 'email', type: 'VARCHAR(100)' }
    ]
  }
];

export const DatabaseManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tables, setTables] = useState<DBTable[]>(INITIAL_TABLES);
  const [selectedTableIndex, setSelectedTableIndex] = useState(0);
  const [sqlCode, setSqlCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTableName, setNewTableName] = useState('');

  const selectedTable = tables[selectedTableIndex];

  useEffect(() => {
    generateSQL();
  }, [tables]);

  const generateSQL = () => {
    let code = `CREATE DATABASE IF NOT EXISTS menta_verde_portal;\nUSE menta_verde_portal;\n\n`;
    tables.forEach(table => {
      code += `CREATE TABLE ${table.name} (\n`;
      const cols = table.columns.map(col => {
        let line = `  ${col.name} ${col.type}`;
        if (col.key === 'PRI') line += ' PRIMARY KEY';
        if (col.extra) line += ` ${col.extra}`;
        return line;
      });
      code += cols.join(',\n');
      code += `\n);\n\n`;
    });
    setSqlCode(code);
  };

  const askAI = async () => {
    setIsGenerating(true);
    const prompt = `Basado en estas tablas: ${JSON.stringify(tables)}, sugiere una nueva tabla que mejoraría la base de datos para un portal empresarial. Proporciona solo el script SQL CREATE TABLE en español.`;
    const response = await getAIResponse(prompt, 'sql');
    setSqlCode(prev => prev + "\n-- SUGERENCIA DE IA --\n" + response);
    setIsGenerating(false);
  };

  const addTable = () => {
    if (!newTableName.trim()) return;
    const newTable: DBTable = {
      name: newTableName.toLowerCase().replace(/\s+/g, '_'),
      columns: [{ name: 'id', type: 'INT', key: 'PRI', extra: 'AUTO_INCREMENT' }]
    };
    setTables([...tables, newTable]);
    setNewTableName('');
    setSelectedTableIndex(tables.length);
  };

  const addColumn = () => {
    const updatedTables = [...tables];
    updatedTables[selectedTableIndex].columns.push({
      name: `columna_${selectedTable.columns.length + 1}`,
      type: 'VARCHAR(255)'
    });
    setTables(updatedTables);
  };

  const updateColumn = (colIndex: number, field: keyof TableColumn, value: string) => {
    const updatedTables = [...tables];
    const col = updatedTables[selectedTableIndex].columns[colIndex];
    if (field === 'key') {
      col[field] = value as 'PRI' | 'FOR' | undefined;
    } else {
      (col[field] as string) = value;
    }
    setTables(updatedTables);
  };

  const deleteColumn = (colIndex: number) => {
    const updatedTables = [...tables];
    updatedTables[selectedTableIndex].columns.splice(colIndex, 1);
    setTables(updatedTables);
  };

  const deleteTable = (idx: number) => {
    if (tables.length <= 1) return;
    const updatedTables = tables.filter((_, i) => i !== idx);
    setTables(updatedTables);
    setSelectedTableIndex(0);
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-zinc-200/50 animate-fade-in w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <h2 className="text-xl font-bold text-zinc-900">Diseñador MySQL</h2>
        </div>
        <div className="flex flex-wrap gap-2">
            <button 
                onClick={askAI}
                disabled={isGenerating}
                className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-[11px] px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-2"
            >
                {isGenerating ? 'Analizando...' : 'Optimización IA'}
            </button>
            <button 
                onClick={() => navigator.clipboard.writeText(sqlCode)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] px-3 py-1.5 rounded-lg transition-all font-semibold shadow-sm"
            >
                Copiar SQL
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tablas</p>
            </div>
            <div className="space-y-2">
                {tables.map((table, idx) => (
                    <div key={idx} className="group relative">
                        <button 
                            onClick={() => setSelectedTableIndex(idx)}
                            className={`w-full text-left p-3 rounded-xl border transition-all text-sm flex items-center justify-between ${
                                selectedTableIndex === idx 
                                ? 'bg-zinc-800 border-zinc-800 text-white' 
                                : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-600'
                            }`}
                        >
                            <span className="truncate pr-6 font-medium">{table.name}</span>
                        </button>
                        {tables.length > 1 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteTable(idx); }}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all p-1 ${
                                    selectedTableIndex === idx ? 'text-white/60 hover:text-white' : 'text-zinc-400 hover:text-red-500'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="pt-4 border-t border-zinc-100">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newTableName}
                        onChange={(e) => setNewTableName(e.target.value)}
                        placeholder="Nueva tabla..."
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-800 outline-none text-zinc-900"
                    />
                    <button 
                        onClick={addTable}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Columnas: {selectedTable.name}</p>
                <button 
                    onClick={addColumn}
                    className="text-[10px] text-zinc-800 hover:text-black font-bold uppercase tracking-tighter underline underline-offset-2"
                >
                    + Añadir Columna
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {selectedTable.columns.map((col, cIdx) => (
                    <div key={cIdx} className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex flex-col gap-3 group shadow-sm">
                        <div className="flex gap-2 items-center">
                            <input 
                                value={col.name}
                                onChange={(e) => updateColumn(cIdx, 'name', e.target.value)}
                                className="bg-transparent border-none text-sm font-bold text-zinc-900 focus:ring-0 outline-none w-1/2"
                                placeholder="nombre"
                            />
                            <select 
                                value={col.type}
                                onChange={(e) => updateColumn(cIdx, 'type', e.target.value)}
                                className="bg-white border border-zinc-200 rounded px-2 py-1 text-[10px] flex-1 outline-none text-zinc-700"
                            >
                                <option value="INT">INT</option>
                                <option value="VARCHAR(50)">VARCHAR(50)</option>
                                <option value="VARCHAR(255)">VARCHAR(255)</option>
                                <option value="TEXT">TEXT</option>
                                <option value="DATETIME">DATETIME</option>
                                <option value="BOOLEAN">BOOLEAN</option>
                            </select>
                            <button onClick={() => deleteColumn(cIdx)} className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={col.key === 'PRI'}
                                    onChange={(e) => updateColumn(cIdx, 'key', e.target.checked ? 'PRI' : '')}
                                    className="w-3 h-3 rounded bg-white text-zinc-800 border-zinc-300"
                                />
                                <span className="text-[9px] text-zinc-500 uppercase font-bold">Primaria</span>
                            </label>
                            <input 
                                value={col.extra || ''}
                                onChange={(e) => updateColumn(cIdx, 'extra', e.target.value)}
                                placeholder="Extra (ej. AUTO_INCREMENT)"
                                className="bg-transparent border-none text-[9px] text-zinc-400 focus:ring-0 outline-none flex-1 italic"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Salida SQL en Vivo</p>
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden h-full flex flex-col">
                <pre className="p-4 text-[11px] font-mono text-zinc-300 overflow-auto flex-1 whitespace-pre-wrap selection:bg-zinc-700">
                    {sqlCode}
                </pre>
            </div>
        </div>
      </div>
    </div>
  );
};

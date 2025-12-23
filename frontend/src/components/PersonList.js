import React, { useEffect, useState } from 'react';
import api, { fetchPersons } from '../api';
import toast from 'react-hot-toast'; // Usando a lib de notificação bonita

const PersonList = ({ onEdit, refreshTrigger }) => {
  const [persons, setPersons] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Paginação
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);

  // Filtros e Ordenação (Passo 3: State de Ordenação)
  const [filters, setFilters] = useState({ start_date: '', end_date: '' });
  const [ordering, setOrdering] = useState('-created_date'); // Padrão: Data decrescente

  // Estatísticas
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // --- FUNÇÃO DE CARREGAMENTO (Atualizada com Ordenação) ---
  const loadData = async (url = null) => {
    try {
      let res;
      if (url) {
        // Se for paginação (url direta), usa ela
        res = await api.get(url);
      } else {
        // Se for carga inicial ou filtro, monta os parâmetros
        // Aqui enviamos o 'ordering' para o Backend
        const params = new URLSearchParams({ 
            ...filters, 
            ordering: ordering 
        }).toString();
        res = await api.get(`/persons/?${params}`);
      }
      
      setPersons(res.data.results || []);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setCount(res.data.count);

    } catch (e) { 
      console.error("Erro ao carregar:", e); 
      toast.error("Erro de conexão com o servidor.");
    }
  };

  // Recarrega quando: Trigger externo, Filtros mudam OU Ordenação muda
  useEffect(() => { loadData(); }, [refreshTrigger, filters, ordering]);

  // --- LÓGICA DE ORDENAÇÃO (Passo 3) ---
  const handleSort = (field) => {
    // Se já está ordenado por esse campo (ex: 'age'), inverte para decrescente ('-age')
    if (ordering === field) {
        setOrdering(`-${field}`);
    } else {
        // Se não, define como ascendente
        setOrdering(field);
    }
  };

  // Função auxiliar para mostrar a setinha (⬆️ ou ⬇️)
  const renderSortIcon = (field) => {
    if (ordering === field) return ' ⬆️';
    if (ordering === `-${field}`) return ' ⬇️';
    return null; // Sem ícone se não estiver ordenado por aqui
  };

  // --- SELEÇÃO E EXCLUSÃO ---
  const toggleSelectAll = (e) => setSelectedIds(e.target.checked ? persons.map(p=>p.id) : []);
  const toggleOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev, id]);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir ${selectedIds.length} itens selecionados?`)) return;
    
    try {
      for (const id of selectedIds) {
        await api.delete(`/persons/${id}/`);
      }
      setSelectedIds([]); 
      await loadData();
      toast.success('Itens excluídos com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir alguns itens.');
    }
  };

  // --- ESTATÍSTICAS ASSÍNCRONAS (Celery) ---
  const handleStats = async () => {
    setLoadingStats(true); setStats(null);
    try {
      const { data } = await api.post('/persons/calculate-stats/');
      const interval = setInterval(async () => {
        try {
          const res = await api.get(`/long-task/${data.task_id}/`);
          if(res.data.status === 'SUCCESS') {
            setStats(res.data.result);
            clearInterval(interval);
            setLoadingStats(false);
            toast.success("Relatório gerado!");
          } else if (res.data.status === 'FAILURE') {
            clearInterval(interval);
            toast.error('Erro no processamento da tarefa.');
            setLoadingStats(false);
          }
        } catch (err) {
            clearInterval(interval);
            setLoadingStats(false);
        }
      }, 1000);
    } catch(e) { 
      toast.error('Erro ao iniciar tarefa (Backend 500)'); 
      setLoadingStats(false); 
    }
  };

  return (
    <div style={{background:'white', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)', overflow:'hidden', paddingBottom: '20px'}}>
      
      {/* Barra de Ferramentas */}
      <div style={{padding:'15px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'10px'}}>
         <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
           <span style={{fontSize:'13px', fontWeight:'bold', color:'#555'}}>Filtros:</span>
           <input type="date" onChange={e=>setFilters({...filters, start_date:e.target.value})} style={{padding:'5px', border:'1px solid #ddd', borderRadius:'4px'}}/>
           <input type="date" onChange={e=>setFilters({...filters, end_date:e.target.value})} style={{padding:'5px', border:'1px solid #ddd', borderRadius:'4px'}}/>
         </div>
         <div style={{display:'flex', gap:'10px'}}>
           {selectedIds.length > 0 && <button onClick={handleBulkDelete} style={{background:'#dc2626', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>Excluir ({selectedIds.length})</button>}
           <button onClick={handleStats} disabled={loadingStats} style={{background:'#7c3aed', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>
              {loadingStats ? 'Calculando...' : '📊 Relatório Estatístico'}
           </button>
         </div>
      </div>

      {/* Resultado Estatística */}
      {stats && <div style={{background:'#ecfdf5', color:'#065f46', padding:'10px', textAlign:'center', borderBottom:'1px solid #d1fae5'}}>
         <strong>Resultado:</strong> Média Idade: {stats.media_idade} | Desvio: {stats.desvio_padrao} | Total: {stats.total}
      </div>}

      {/* --- AQUI ESTÁ A LÓGICA DO EMPTY STATE --- */}
      {persons.length === 0 ? (
        <div style={{padding: '40px', textAlign: 'center', color: '#9ca3af'}}>
            <div style={{fontSize: '40px', marginBottom: '10px'}}>📭</div>
            <h3 style={{margin:0, color: '#374151'}}>Nenhum registro encontrado</h3>
            <p style={{fontSize: '14px'}}>Cadastre uma nova pessoa ou ajuste os filtros de data.</p>
        </div>
      ) : (
        /* Se houver pessoas, mostra a tabela */
        <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
            <tr style={{background:'#f9fafb', textAlign:'left'}}>
                <th style={{padding:'12px'}}>
                    <input type="checkbox" checked={selectedIds.length === persons.length} onChange={toggleSelectAll} />
                </th>
                
                {/* --- CABEÇALHOS CLICÁVEIS PARA ORDENAÇÃO --- */}
                <th 
                    style={{padding:'12px', cursor:'pointer', userSelect:'none'}} 
                    onClick={() => handleSort('person_name')}
                >
                    Nome {renderSortIcon('person_name')}
                </th>
                <th 
                    style={{padding:'12px', cursor:'pointer', userSelect:'none'}} 
                    onClick={() => handleSort('age')}
                >
                    Idade {renderSortIcon('age')}
                </th>
                <th style={{padding:'12px'}}>Hobbies</th>
                <th style={{padding:'12px'}}>Ações</th>
            </tr>
            </thead>
            <tbody>
            {persons.map(p => (
                <tr key={p.id} style={{borderTop:'1px solid #eee'}}>
                <td style={{padding:'12px'}}><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={()=>toggleOne(p.id)}/></td>
                <td style={{padding:'12px'}}>{p.person_name}</td>
                <td style={{padding:'12px'}}>{p.age} anos</td>
                <td style={{padding:'12px'}}>{p.hobbies?.map(h=><span key={h} style={{background:'#e0f2fe', color:'#0369a1', padding:'2px 8px', borderRadius:'12px', fontSize:'12px', marginRight:'5px'}}>{h}</span>)}</td>
                <td style={{padding:'12px'}}><button onClick={()=>onEdit(p)} style={{background:'white', border:'1px solid #d1d5db', padding:'4px 8px', borderRadius:'4px', cursor:'pointer'}}>Editar</button></td>
                </tr>
            ))}
            </tbody>
        </table>
      )}

      {/* Paginação (Só mostra se houver dados ou filtros ativos) */}
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'15px', marginTop:'20px'}}>
          <button 
            disabled={!prevPage} 
            onClick={() => loadData(prevPage)}
            style={{padding: '8px 16px', background: prevPage ? '#2563eb' : '#e5e7eb', color: prevPage ? 'white' : '#9ca3af', border: 'none', borderRadius: '4px', cursor: prevPage ? 'pointer' : 'not-allowed'}}
          >
            ← Anterior
          </button>
          
          <span style={{color: '#666', fontSize: '14px'}}>
              Total: {count} registros
          </span>

          <button 
            disabled={!nextPage} 
            onClick={() => loadData(nextPage)}
            style={{padding: '8px 16px', background: nextPage ? '#2563eb' : '#e5e7eb', color: nextPage ? 'white' : '#9ca3af', border: 'none', borderRadius: '4px', cursor: nextPage ? 'pointer' : 'not-allowed'}}
          >
            Próxima →
          </button>
      </div>

    </div>
  );
};

export default PersonList;
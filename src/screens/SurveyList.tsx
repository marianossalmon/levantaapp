import { useNavigate } from 'react-router';
import { Plus, Clock, FileText } from 'lucide-react';

export default function SurveyList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-xl font-bold tracking-widest uppercase">Levantamientos</h1>
          <button 
            onClick={() => navigate('/new')}
            className="bg-[#00FF00] hover:bg-green-400 text-black font-bold px-6 py-3 rounded text-sm uppercase flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nuevo Levantamiento</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-[#151619] border border-[#333] rounded px-6 py-5 hover:border-[#00FF00] transition-colors cursor-pointer relative overflow-hidden" onClick={() => navigate('/canvas')}>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF00]"></div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-2 uppercase">Acme Corp <span className="text-gray-500 font-normal">/ Oficina Principal</span></h2>
                <div className="flex items-center gap-4 text-gray-400 text-xs font-mono uppercase">
                  <span className="flex items-center gap-1"><Clock size={14}/> Hoy, 10:30 AM</span>
                  <span className="flex items-center gap-1"><FileText size={14}/> Oficina Abierta</span>
                </div>
              </div>
              <div className="bg-[#222] text-[#00FF00] border border-[#00FF00] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                Borrador
              </div>
            </div>
          </div>
          
          {/* Placeholder for no items */}
          <div className="text-center py-16 border border-dashed border-[#444] rounded bg-[#111] text-gray-500 text-xs font-bold uppercase tracking-widest">
            No hay más levantamientos recientes.
          </div>
        </div>
      </div>
    </div>
  );
}

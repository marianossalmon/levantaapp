import { useNavigate } from 'react-router';

export default function NewSurvey() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/canvas');
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-white p-6 flex flex-col justify-center font-sans">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold tracking-widest uppercase mb-8">Nuevo Levantamiento</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cliente / Empresa</label>
            <input 
              required
              type="text" 
              placeholder="Ej. Acme Corp" 
              className="w-full bg-[#151619] border border-[#333] rounded px-4 py-4 focus:outline-none focus:border-[#00FF00] transition-colors font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de Espacio</label>
            <select 
              required
              className="w-full bg-[#151619] border border-[#333] rounded px-4 py-4 focus:outline-none focus:border-[#00FF00] transition-colors appearance-none font-mono"
            >
              <option value="">Selecciona...</option>
              <option value="oficina_abierta">Oficina Abierta</option>
              <option value="sala_juntas">Sala de Juntas</option>
              <option value="recepcion">Recepción</option>
              <option value="cafeteria">Cafetería</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#00FF00] text-black font-bold text-sm uppercase rounded py-4 mt-8 hover:bg-green-400 transition-colors"
          >
            Comenzar Dibujo
          </button>
        </form>
      </div>
    </div>
  );
}

import { 
  Square, 
  DoorOpen, 
  Columns, 
  BoxSelect, 
  AlignEndHorizontal,
  Type,
  Users
} from 'lucide-react';
import { SpecialElementType } from '../types/survey';

const tools: { type: SpecialElementType, icon: React.FC<any>, label: string }[] = [
  { type: 'column', icon: Square, label: 'Columna' },
  { type: 'door', icon: DoorOpen, label: 'Puerta' },
  { type: 'window', icon: Columns, label: 'Ventana' },
  { type: 'bar', icon: BoxSelect, label: 'Barra' },
  { type: 'step', icon: AlignEndHorizontal, label: 'Escalón' },
  { type: 'text', icon: Type, label: 'Nota' },
  { type: 'users', icon: Users, label: 'Usuarios' },
];

export default function Toolbar({ 
  onSelectElement 
}: { 
  onSelectElement: (type: SpecialElementType) => void 
}) {
  return (
    <div className="fixed left-0 top-16 bottom-0 w-20 bg-[#151619] border-r border-[#333] flex flex-col items-center py-4 gap-3 z-40">
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.type}
            onClick={() => onSelectElement(tool.type)}
            className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors border ${index === 0 ? 'bg-[#00FF00] text-black border-[#00FF00]' : 'bg-[#222] text-[#8E9299] border-[#444] hover:bg-[#333] hover:text-white'}`}
            title={tool.label}
          >
            <Icon size={24} />
          </button>
        );
      })}
    </div>
  );
}

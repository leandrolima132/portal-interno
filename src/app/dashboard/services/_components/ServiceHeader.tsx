interface ServiceHeaderProps {
  title: string;
  description: string;
  onAddService: () => void;
}

export function ServiceHeader({ title, description, onAddService }: ServiceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={onAddService}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Adicionar Serviço
        </button>
      </div>
    </div>
  );
}

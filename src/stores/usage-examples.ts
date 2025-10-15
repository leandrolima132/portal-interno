// Exemplos de uso do store genérico

import { createGenericStore } from './appStore';

// Exemplo 1: Store de Produtos
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const useProductStore = createGenericStore<Product>('products');

// Exemplo 2: Store de Usuários
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const useUserStore = createGenericStore<User>('users');

// Exemplo 3: Store de Tarefas
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const useTaskStore = createGenericStore<Task>('tasks');

// Exemplo 4: Store de Serviços (para o portal atual)
interface Service {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  lastModified: string;
}

const useServiceStore = createGenericStore<Service>('services');

// Exemplo de uso em componentes:

// Componente de Produtos
function ProductComponent() {
  const { items, add, remove, update, findById } = useProductStore();
  
  const handleAddProduct = () => {
    add({
      id: Date.now().toString(),
      name: 'Novo Produto',
      price: 99.99,
      category: 'Eletrônicos',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };
  
  return (
    <div>
      <h2>Produtos ({items.length})</h2>
      <button onClick={handleAddProduct}>Adicionar Produto</button>
      {items.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>R$ {product.price}</p>
          <button onClick={() => remove(product.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}

// Componente de Tarefas
function TaskComponent() {
  const { items, add, remove, update, findBy } = useTaskStore();
  
  const completedTasks = findBy(task => task.completed);
  const pendingTasks = findBy(task => !task.completed);
  
  const handleToggleTask = (id: string) => {
    const task = items.find(t => t.id === id);
    if (task) {
      update(id, { completed: !task.completed });
    }
  };
  
  return (
    <div>
      <h2>Tarefas Pendentes ({pendingTasks.length})</h2>
      <h2>Tarefas Concluídas ({completedTasks.length})</h2>
      {items.map(task => (
        <div key={task.id}>
          <input 
            type="checkbox" 
            checked={task.completed}
            onChange={() => handleToggleTask(task.id)}
          />
          <span>{task.title}</span>
          <button onClick={() => remove(task.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}

// Componente de Serviços (Portal DM Conta)
function ServiceComponent() {
  const { items, add, remove, update } = useServiceStore();
  
  const handleToggleService = (id: string) => {
    const service = items.find(s => s.id === id);
    if (service) {
      update(id, { 
        enabled: !service.enabled,
        lastModified: new Date().toISOString()
      });
    }
  };
  
  return (
    <div>
      <h2>Serviços ({items.length})</h2>
      {items.map(service => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <span>Status: {service.enabled ? 'Ativo' : 'Inativo'}</span>
          <button onClick={() => handleToggleService(service.id)}>
            {service.enabled ? 'Desativar' : 'Ativar'}
          </button>
          <button onClick={() => remove(service.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}

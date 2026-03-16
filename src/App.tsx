import { useState, useEffect, KeyboardEvent } from 'react';
import { Plus, Check, RotateCcw, Trash2 } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  // 从本地存储加载数据
  useEffect(() => {
    const savedTodos = localStorage.getItem('minimal-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('minimal-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-md">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">每日待办</h1>
          <p className="text-sm text-gray-500 italic">保持简单，保持专注。</p>
        </header>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入待办事项..."
            className="flex-1 border-b border-black py-2 px-1 focus:outline-none focus:border-gray-400 transition-colors bg-transparent"
            id="todo-input"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-all active:scale-95 flex items-center gap-1 text-sm font-medium"
            id="add-button"
          >
            <Plus size={16} />
            添加
          </button>
        </div>

        <ul className="space-y-4" id="todo-list">
          {todos.length === 0 ? (
            <li className="text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded-lg">
              暂无待办事项
            </li>
          ) : (
            todos.map((todo, index) => (
              <li
                key={todo.id}
                className="flex items-center justify-between group py-2 border-b border-gray-100"
              >
                <div className="flex items-center flex-1 mr-4 overflow-hidden">
                  <span className="text-[11px] font-mono text-gray-400 mr-3 w-5 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span
                    className={`truncate transition-all duration-300 ${
                      todo.completed
                        ? 'text-gray-400 line-through'
                        : 'text-black'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`p-1 transition-colors ${
                      todo.completed
                        ? 'text-gray-400 hover:text-black'
                        : 'text-black hover:text-gray-400'
                    }`}
                    title={todo.completed ? "标记为未完成" : "标记为完成"}
                  >
                    {todo.completed ? <RotateCcw size={18} /> : <Check size={18} />}
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1 text-gray-300 hover:text-black transition-colors"
                    title="删除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {todos.length > 0 && (
          <footer className="mt-12 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
            <span>共 {todos.length} 项</span>
            <span>{todos.filter(t => t.completed).length} 已完成</span>
          </footer>
        )}
      </div>
    </div>
  );
}

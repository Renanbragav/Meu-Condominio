import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { TaskProposal, ResidentProfile, UrgencyLevel, TaskStatus } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: TaskProposal[];
  currentResident: ResidentProfile;
  residents: Record<string, ResidentProfile>;
  onToggleVote: (taskId: string) => void;
  onAddComment: (taskId: string, text: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTask: () => void;
  onOpenAssemblyReport: () => void;
}

type TabFilter = 'all' | 'my_voted' | 'my_proposed';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentResident,
  residents,
  onToggleVote,
  onAddComment,
  onUpdateStatus,
  onDeleteTask,
  onOpenNewTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'urgency' | 'recent'>('votes');
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (activeTab === 'my_voted') {
          if (!task.votes.some((v) => v.residentId === currentResident.id)) return false;
        } else if (activeTab === 'my_proposed') {
          if (task.createdByResidentId !== currentResident.id) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc = task.description.toLowerCase().includes(q);
          const matchesLoc = task.location?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
        }

        if (selectedCategory !== 'all' && task.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'votes') {
          return b.votes.length - a.votes.length;
        } else if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'urgency') {
          const urgencyWeight: Record<UrgencyLevel, number> = {
            urgente: 4,
            alta: 3,
            media: 2,
            baixa: 1,
          };
          return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
        }
        return 0;
      });
  }, [tasks, activeTab, searchQuery, selectedCategory, sortBy, currentResident.id]);

  return (
    <section id="prioridades" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Clean Single-Row Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E5E2DC]">
        {/* Interactive Segmented Control Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#EAE7E1] rounded-lg self-start">
          <button
            id="tab-all-tasks"
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#1E2430] shadow-xs'
                : 'text-[#5C6474] hover:text-[#1E2430]'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            id="tab-my-voted"
            type="button"
            onClick={() => setActiveTab('my_voted')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'my_voted'
                ? 'bg-white text-[#1E2430] shadow-xs'
                : 'text-[#5C6474] hover:text-[#1E2430]'
            }`}
          >
            Meus Votos
          </button>
          <button
            id="tab-my-proposed"
            type="button"
            onClick={() => setActiveTab('my_proposed')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'my_proposed'
                ? 'bg-white text-[#1E2430] shadow-xs'
                : 'text-[#5C6474] hover:text-[#1E2430]'
            }`}
          >
            Minhas Propostas
          </button>
        </div>

        {/* Compact Search, Category & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#8C877E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-tasks"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proposta..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#D8D4CC] text-xs sm:text-sm text-[#1E2430] focus:outline-none focus:border-[#3B5284]"
            />
          </div>

          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-[#D8D4CC] text-xs sm:text-sm text-[#3A4252] focus:outline-none focus:border-[#3B5284]"
          >
            <option value="all">Todas as Áreas</option>
            {Object.entries(CATEGORY_DETAILS).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            id="select-sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'votes' | 'urgency' | 'recent')}
            className="px-3 py-2 rounded-lg bg-white border border-[#D8D4CC] text-xs sm:text-sm text-[#3A4252] focus:outline-none focus:border-[#3B5284]"
          >
            <option value="votes">Mais Votadas</option>
            <option value="urgency">Mais Urgentes</option>
            <option value="recent">Mais Recentes</option>
          </select>
        </div>
      </div>

      {/* Task Cards Feed */}
      <div className="mt-6">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E2DC] p-12 text-center">
            <h4 className="font-display text-base font-bold text-[#1E2430]">
              Nenhuma proposta encontrada
            </h4>
            <p className="text-sm text-[#687082] mt-1 max-w-md mx-auto">
              Altere os filtros de busca ou cadastre uma nova sugestão de melhoria para o condomínio.
            </p>
            <button
              type="button"
              onClick={onOpenNewTask}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A64B3A] text-white font-semibold text-xs sm:text-sm hover:bg-[#8E3D2E] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Proposta</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                rankIndex={index}
                currentResident={currentResident}
                residents={residents}
                onToggleVote={onToggleVote}
                onAddComment={onAddComment}
                onUpdateStatus={onUpdateStatus}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TaskProposal, ResidentProfile, TaskCategory, UrgencyLevel } from '../types';
import { CATEGORY_DETAILS, URGENCY_DETAILS } from '../data/initialData';
import { ResidentAvatar } from './ResidentAvatar';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResident: ResidentProfile;
  onCreateTask: (
    newTask: Omit<TaskProposal, 'id' | 'createdAt' | 'votes' | 'comments'>,
    autoVote: boolean
  ) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  currentResident,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('seguranca');
  const [urgency, setUrgency] = useState<UrgencyLevel>('media');
  const [location, setLocation] = useState('');
  const [estimatedCostRange, setEstimatedCostRange] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onCreateTask(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        urgency,
        status: 'em_votacao',
        location: location.trim() || 'Áreas Comuns',
        estimatedCostRange: estimatedCostRange.trim() || undefined,
        createdByResidentId: currentResident.id,
        createdByName:
          currentResident.residentName || `Morador Apto ${currentResident.apartmentNumber}`,
        createdByBlock: currentResident.block,
        createdByApartment: currentResident.apartmentNumber,
      },
      true
    );

    setTitle('');
    setDescription('');
    setLocation('');
    setEstimatedCostRange('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#141C2B]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-[#E5E2DC]">
        {/* Header */}
        <div className="bg-[#24324F] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Nova Proposta de Melhoria
            </h3>
            <p className="text-xs text-white/75">
              Visível para votação dos 96 apartamentos
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Author Tag */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F6F2] border border-[#E5E2DC] text-xs">
            <ResidentAvatar
              name={currentResident.residentName}
              block={currentResident.block}
              apartmentNumber={currentResident.apartmentNumber}
              avatarUrl={currentResident.avatarUrl}
              size="sm"
            />
            <div>
              <span className="text-[#687082] block">Proponente</span>
              <span className="font-semibold text-[#1E2430]">
                {currentResident.residentName || 'Morador'} · Bloco {currentResident.block} - Apto{' '}
                {currentResident.apartmentNumber}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
              Título da Proposta *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reforma da iluminação do hall de entrada"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-[#D8D4CC] focus:outline-none focus:border-[#3B5284]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
                Área / Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-[#D8D4CC] bg-white focus:outline-none focus:border-[#3B5284]"
              >
                {Object.entries(CATEGORY_DETAILS).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
                Prioridade / Urgência
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-[#D8D4CC] bg-white focus:outline-none focus:border-[#3B5284]"
              >
                {Object.entries(URGENCY_DETAILS).map(([key, urg]) => (
                  <option key={key} value={key}>
                    {urg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
                Local (Opcional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Bloco A, Garagem..."
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-[#D8D4CC] focus:outline-none focus:border-[#3B5284]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
                Valor Estimado (Opcional)
              </label>
              <input
                type="text"
                value={estimatedCostRange}
                onChange={(e) => setEstimatedCostRange(e.target.value)}
                placeholder="Ex: R$ 3.500"
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-[#D8D4CC] focus:outline-none focus:border-[#3B5284]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
              Resumo da Melhoria *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique de forma objetiva o que precisa ser feito..."
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-[#D8D4CC] focus:outline-none focus:border-[#3B5284]"
            />
          </div>

          <div className="pt-3 border-t border-[#ECE9E2] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#5C6474] hover:text-[#1E2430] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#A64B3A] hover:bg-[#8E3D2E] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Publicar Proposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

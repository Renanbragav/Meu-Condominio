import React, { useState } from 'react';
import {
  Check,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskProposal, ResidentProfile, TaskStatus } from '../types';
import { CATEGORY_DETAILS, URGENCY_DETAILS, STATUS_DETAILS } from '../data/initialData';
import { ResidentAvatar } from './ResidentAvatar';

interface TaskCardProps {
  task: TaskProposal;
  rankIndex: number;
  currentResident: ResidentProfile;
  residents: Record<string, ResidentProfile>;
  onToggleVote: (taskId: string) => void;
  onAddComment: (taskId: string, text: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  rankIndex,
  currentResident,
  residents,
  onToggleVote,
  onAddComment,
  onUpdateStatus,
  onDeleteTask,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const category = CATEGORY_DETAILS[task.category] || CATEGORY_DETAILS.outros;
  const urgency = URGENCY_DETAILS[task.urgency] || URGENCY_DETAILS.media;
  const status = STATUS_DETAILS[task.status] || STATUS_DETAILS.em_votacao;

  const hasVoted = task.votes.some((v) => v.residentId === currentResident.id);
  const totalVotes = task.votes.length;
  const totalApartments = 96;
  const quorumPercentage = Math.min(100, Math.round((totalVotes / totalApartments) * 100));

  const authorProfile = residents[task.createdByResidentId];
  const authorAvatar = authorProfile?.avatarUrl;
  const isAuthor = task.createdByResidentId === currentResident.id;

  const handleVoteClick = () => {
    if (!hasVoted) {
      try {
        confetti({
          particleCount: 28,
          spread: 55,
          origin: { y: 0.75 },
          colors: ['#3B5284', '#A64B3A', '#D97706'],
        });
      } catch (e) {
        // ignore in restricted environments
      }
    }
    onToggleVote(task.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(task.id, newCommentText.trim());
    setNewCommentText('');
  };

  const formattedRank = String(rankIndex + 1).padStart(2, '0');

  return (
    <article
      id={`task-card-${task.id}`}
      className={`bg-white rounded-xl border transition-colors duration-150 ${
        hasVoted ? 'border-[#3B5284]/60' : 'border-[#E5E2DC] hover:border-[#CFCAC0]'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#687082]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-semibold text-[#A64B3A] tabular-nums">
              {formattedRank}.
            </span>
            <span className="font-medium text-[#3A4252]">{category.label}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                task.urgency === 'urgente'
                  ? 'text-[#DC2626] font-medium'
                  : task.urgency === 'alta'
                  ? 'text-[#D97706] font-medium'
                  : 'text-[#687082]'
              }
            >
              {urgency.label}
            </span>
            {task.location && (
              <>
                <span aria-hidden="true">·</span>
                <span>{task.location}</span>
              </>
            )}
          </div>

          <span className="text-xs font-medium text-[#3B5284]">{status.label}</span>
        </div>

        {/* Main Content Split: Title/Description on Left, Vote Action on Right */}
        <div className="mt-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-[#1E2430] leading-snug">
              {task.title}
            </h3>
            <p className="text-sm text-[#5C6474] mt-1.5 leading-relaxed">
              {task.description}
            </p>

            {/* Author with Profile Photo & Secondary Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#687082]">
              <div className="flex items-center gap-2">
                <ResidentAvatar
                  name={task.createdByName}
                  block={task.createdByBlock}
                  apartmentNumber={task.createdByApartment}
                  avatarUrl={authorAvatar}
                  size="xs"
                />
                <span>
                  Proposto por <strong className="font-medium text-[#3A4252]">{task.createdByName}</strong>{' '}
                  <span className="tabular-nums">({task.createdByBlock}-{task.createdByApartment})</span>
                </span>
              </div>

              {task.estimatedCostRange && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Estimativa: {task.estimatedCostRange}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Vote Button & Tabular Counter */}
          <div className="sm:w-48 shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#ECE9E2]">
            <button
              id={`btn-vote-${task.id}`}
              type="button"
              onClick={handleVoteClick}
              className={`px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer w-full sm:w-auto ${
                hasVoted
                  ? 'bg-[#2B3C60] text-white hover:bg-[#1E2B48]'
                  : 'bg-[#A64B3A] text-white hover:bg-[#8E3D2E]'
              }`}
            >
              {hasVoted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Voto Registrado</span>
                </>
              ) : (
                <span>Votar na Proposta</span>
              )}
            </button>

            <div className="text-right">
              <div className="flex items-center sm:justify-end gap-2">
                {/* Voter Avatars Stack */}
                {totalVotes > 0 && (
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {task.votes.slice(0, 4).map((v) => {
                      const voterProf = residents[v.residentId];
                      return (
                        <ResidentAvatar
                          key={v.residentId}
                          name={v.residentName}
                          block={v.block}
                          apartmentNumber={v.apartmentNumber}
                          avatarUrl={voterProf?.avatarUrl || v.avatarUrl}
                          size="xs"
                          className="ring-2 ring-white"
                        />
                      );
                    })}
                  </div>
                )}
                <span className="font-mono text-sm font-semibold text-[#1E2430] tabular-nums">
                  {totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}
                </span>
              </div>
              <div className="text-[11px] text-[#687082] tabular-nums mt-0.5">
                {quorumPercentage}% dos 96 aptos
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Progress Line & Expandable Footer */}
        <div className="mt-4 pt-3 border-t border-[#F0EDE6] flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xs bg-[#ECE9E2] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                hasVoted ? 'bg-[#3B5284]' : 'bg-[#A64B3A]'
              }`}
              style={{ width: `${Math.max(3, quorumPercentage)}%` }}
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-[#687082]">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="hover:text-[#1E2430] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="tabular-nums">
                Detalhes e Comentários ({task.comments.length})
              </span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {isAuthor && onDeleteTask && (
              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                title="Excluir minha proposta"
                className="text-[#8C877E] hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded Section: Voters List, Status Control, and Comments with Profile Photos */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#ECE9E2] space-y-5">
            {/* Voters List with Avatars */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#5C6474] mb-2">
                <span className="font-semibold text-[#1E2430]">
                  Unidades que já votaram ({totalVotes})
                </span>
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <select
                    id={`btn-status-${task.id}`}
                    value={task.status}
                    onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                    className="text-xs bg-[#F7F6F2] border border-[#D8D4CC] rounded px-2 py-1 text-[#1E2430] focus:outline-none"
                  >
                    {(Object.keys(STATUS_DETAILS) as TaskStatus[]).map((st) => (
                      <option key={st} value={st}>
                        {STATUS_DETAILS[st].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {totalVotes === 0 ? (
                <p className="text-xs text-[#687082]">
                  Nenhum voto registrado ainda.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {task.votes.map((v) => {
                    const voterProf = residents[v.residentId];
                    return (
                      <div
                        key={v.residentId}
                        className="flex items-center gap-1.5 pr-2.5 pl-1 py-1 rounded-full bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                      >
                        <ResidentAvatar
                          name={v.residentName}
                          block={v.block}
                          apartmentNumber={v.apartmentNumber}
                          avatarUrl={voterProf?.avatarUrl || v.avatarUrl}
                          size="xs"
                        />
                        <span className="font-semibold text-[#1E2430] tabular-nums">
                          {v.block}-{v.apartmentNumber}
                        </span>
                        <span className="text-[#687082] truncate max-w-[90px]">
                          {v.residentName.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#1E2430]">
                Comentários dos Moradores ({task.comments.length})
              </div>

              {task.comments.length > 0 && (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {task.comments.map((comment) => {
                    const commenterProf = residents[comment.residentId];
                    return (
                      <div
                        key={comment.id}
                        className="p-3 rounded-lg bg-[#F7F6F2] border border-[#E5E2DC] text-xs flex items-start gap-2.5"
                      >
                        <ResidentAvatar
                          name={comment.residentName}
                          block={comment.block}
                          apartmentNumber={comment.apartmentNumber}
                          avatarUrl={commenterProf?.avatarUrl || comment.avatarUrl}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 text-[#687082]">
                            <span className="font-semibold text-[#1E2430]">
                              {comment.residentName}{' '}
                              <span className="font-normal text-[#687082] tabular-nums">
                                ({comment.block}-{comment.apartmentNumber})
                              </span>
                            </span>
                            <span className="tabular-nums text-[11px]">
                              {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-[#3A4252] mt-1 leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Comentar como ${currentResident.residentName || `Apto ${currentResident.block}-${currentResident.apartmentNumber}`}...`}
                  className="flex-1 text-xs px-3 py-2 rounded-lg bg-white border border-[#D8D4CC] focus:outline-none focus:border-[#3B5284]"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-3.5 py-2 bg-[#3B5284] text-white rounded-lg hover:bg-[#2B3C60] disabled:opacity-40 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

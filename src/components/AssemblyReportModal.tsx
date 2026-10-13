import React from 'react';
import { X, Printer } from 'lucide-react';
import { TaskProposal } from '../types';
import { CATEGORY_DETAILS, URGENCY_DETAILS, STATUS_DETAILS } from '../data/initialData';

interface AssemblyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskProposal[];
}

export const AssemblyReportModal: React.FC<AssemblyReportModalProps> = ({
  isOpen,
  onClose,
  tasks,
}) => {
  if (!isOpen) return null;

  const sortedTasks = [...tasks].sort((a, b) => b.votes.length - a.votes.length);
  const totalCondoUnits = 96;
  const totalVotesCast = tasks.reduce((sum, t) => sum + t.votes.length, 0);

  const participatingApartments = new Set<string>();
  tasks.forEach((t) => {
    t.votes.forEach((v) => participatingApartments.add(v.residentId));
  });

  const participationRate = Math.round(
    (participatingApartments.size / totalCondoUnits) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#141C2B]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E2DC] print:border-none print:shadow-none print:max-h-full print:rounded-none">
        {/* Header */}
        <div className="bg-[#24324F] text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Pauta para Assembleia Geral
            </h3>
            <p className="text-xs text-white/75 tabular-nums">
              Relatório consolidado · 96 Apartamentos (Blocos A e B)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#A64B3A] hover:bg-[#8E3D2E] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-[#1E2430] bg-white">
          <div className="border-b border-[#D8D4CC] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#A64B3A]">
                Condomínio Residencial Parque das Torres
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E2430] mt-0.5">
                Relatório de Prioridades dos Moradores
              </h2>
              <p className="text-xs text-[#687082] mt-0.5 tabular-nums">
                Blocos A e B · 12 Andares · 96 Unidades (101 a 1204)
              </p>
            </div>

            <div className="text-xs text-[#687082] tabular-nums">
              Emissão: {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F7F6F2] rounded-xl border border-[#E5E2DC] text-xs">
            <div>
              <span className="text-[#687082] block">Total do Condomínio</span>
              <span className="font-mono text-base font-semibold text-[#1E2430] tabular-nums">
                96 Unidades
              </span>
            </div>
            <div>
              <span className="text-[#687082] block">Unidades Votantes</span>
              <span className="font-mono text-base font-semibold text-[#3B5284] tabular-nums">
                {participatingApartments.size} ({participationRate}%)
              </span>
            </div>
            <div>
              <span className="text-[#687082] block">Total de Votos</span>
              <span className="font-mono text-base font-semibold text-[#A64B3A] tabular-nums">
                {totalVotesCast} apoios
              </span>
            </div>
            <div>
              <span className="text-[#687082] block">Propostas em Pauta</span>
              <span className="font-mono text-base font-semibold text-[#1E2430] tabular-nums">
                {tasks.length} itens
              </span>
            </div>
          </div>

          {/* Priority Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E5E2DC] rounded-lg overflow-hidden">
              <thead className="bg-[#F7F6F2] text-[#3A4252] font-semibold border-b border-[#E5E2DC]">
                <tr>
                  <th className="py-2.5 px-3">Posição</th>
                  <th className="py-2.5 px-3">Proposta</th>
                  <th className="py-2.5 px-3">Área</th>
                  <th className="py-2.5 px-3">Urgência</th>
                  <th className="py-2.5 px-3 text-right">Votos</th>
                  <th className="py-2.5 px-3">Andamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE9E2]">
                {sortedTasks.map((t, idx) => {
                  const cat = CATEGORY_DETAILS[t.category] || CATEGORY_DETAILS.outros;
                  const urg = URGENCY_DETAILS[t.urgency] || URGENCY_DETAILS.media;
                  const st = STATUS_DETAILS[t.status] || STATUS_DETAILS.em_votacao;
                  const perc = Math.round((t.votes.length / totalCondoUnits) * 100);

                  return (
                    <tr key={t.id} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-3 font-mono font-semibold text-[#A64B3A] tabular-nums whitespace-nowrap">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#1E2430]">{t.title}</div>
                        {t.estimatedCostRange && (
                          <div className="text-[#687082] text-[11px] tabular-nums mt-0.5">
                            Estimativa: {t.estimatedCostRange}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-[#3A4252]">
                        {cat.label}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-[#3A4252]">
                        {urg.label}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <span className="font-semibold text-[#1E2430]">{t.votes.length}</span>{' '}
                        <span className="text-[#687082]">({perc}%)</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-[#3B5284] font-medium">
                        {st.label}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

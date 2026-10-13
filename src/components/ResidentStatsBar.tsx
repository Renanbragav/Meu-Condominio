import React, { useState } from 'react';
import { Camera, Building2 } from 'lucide-react';
import { TaskProposal, ResidentProfile } from '../types';
import { BUILDING_FACADE_IMAGE } from '../data/initialData';
import { ResidentAvatar } from './ResidentAvatar';

interface ResidentStatsBarProps {
  tasks: TaskProposal[];
  currentResident: ResidentProfile;
  onOpenRegistration: () => void;
  onOpenApartmentSelector: () => void;
  onOpenLoginScreen?: () => void;
}

export const ResidentStatsBar: React.FC<ResidentStatsBarProps> = ({
  tasks,
  currentResident,
  onOpenRegistration,
  onOpenApartmentSelector,
  onOpenLoginScreen,
}) => {
  const [imgError, setImgError] = useState(false);

  const totalTasks = tasks.length;
  const totalVotesAcrossCondo = tasks.reduce((sum, task) => sum + task.votes.length, 0);
  const myVotesCount = tasks.filter((task) =>
    task.votes.some((v) => v.residentId === currentResident.id)
  ).length;

  return (
    <section className="border-b border-[#E5E2DC] bg-white print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 8 Columns: Active Resident Profile + Clean Condominium Summary */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#687082]">
                <span>Blocos A e B</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">96 Apartamentos (101 a 1204)</span>
                <span aria-hidden="true">·</span>
                <span>1 Voto por Unidade</span>
              </div>

              <h1
                className="font-display text-2xl sm:text-3xl font-bold text-[#1E2430] mt-2 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Prioridades e Melhorias do Condomínio
              </h1>
              <p className="text-sm text-[#5C6474] mt-1.5 max-w-xl leading-relaxed">
                Vote nas demandas mais importantes para o nosso prédio ou apresente uma nova sugestão para a pauta da assembleia.
              </p>
            </div>

            {/* Active Resident Bar with Profile Photo */}
            <div className="pt-5 border-t border-[#ECE9E2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={onOpenRegistration}
                  className="relative group cursor-pointer"
                  title="Alterar foto de perfil e dados"
                >
                  <ResidentAvatar
                    name={currentResident.residentName}
                    block={currentResident.block}
                    apartmentNumber={currentResident.apartmentNumber}
                    avatarUrl={currentResident.avatarUrl}
                    size="lg"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#3B5284] text-white flex items-center justify-center shadow-xs group-hover:bg-[#A64B3A] transition-colors">
                    <Camera className="w-3 h-3" />
                  </span>
                </button>

                <div>
                  <div className="flex items-center gap-2 text-xs text-[#687082]">
                    <span className="font-semibold text-[#3B5284] tabular-nums">
                      Bloco {currentResident.block} · Apto {currentResident.apartmentNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{myVotesCount} votos seus</span>
                  </div>

                  <div className="text-base font-bold text-[#1E2430] mt-0.5">
                    {currentResident.residentName || `Morador ${currentResident.block}-${currentResident.apartmentNumber}`}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-medium">
                    <button
                      id="btn-edit-registration-banner"
                      type="button"
                      onClick={onOpenRegistration}
                      className="text-[#A64B3A] hover:underline underline-offset-2 cursor-pointer whitespace-nowrap"
                    >
                      Editar perfil e foto
                    </button>
                    <span className="text-[#D0CCC4]" aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={onOpenApartmentSelector}
                      className="text-[#3B5284] hover:underline underline-offset-2 cursor-pointer whitespace-nowrap"
                    >
                      Trocar apartamento
                    </button>
                    {onOpenLoginScreen && (
                      <>
                        <span className="text-[#D0CCC4]" aria-hidden="true">·</span>
                        <button
                          type="button"
                          onClick={onOpenLoginScreen}
                          className="text-[#5C6474] hover:text-[#1E2430] hover:underline underline-offset-2 cursor-pointer whitespace-nowrap"
                        >
                          Tela de login
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Clean Tabular Metrics */}
              <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-[#ECE9E2]">
                <div>
                  <div className="font-mono text-xl font-semibold text-[#1E2430] tabular-nums">
                    {totalTasks}
                  </div>
                  <div className="text-xs text-[#687082]">Propostas</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-semibold text-[#3B5284] tabular-nums">
                    {totalVotesAcrossCondo}
                  </div>
                  <div className="text-xs text-[#687082]">Votos totais</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-semibold text-[#A64B3A] tabular-nums">
                    96
                  </div>
                  <div className="text-xs text-[#687082]">Unidades</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Condominium Building Facade Photo */}
          <div className="lg:col-span-4">
            <div
              onClick={onOpenLoginScreen}
              title="Ver tela de boas-vindas do condomínio"
              className="relative h-48 lg:h-full min-h-[180px] rounded-xl overflow-hidden border border-[#E5E2DC] bg-[#24324F] group cursor-pointer"
            >
              {!imgError ? (
                <img
                  src={BUILDING_FACADE_IMAGE}
                  alt="Fachada do Condomínio Residencial Parque das Torres"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2B3C60] via-[#4A6294] to-[#9E4738] flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141C2B]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between text-white">
                <div>
                  <div className="text-xs font-semibold">Parque das Torres</div>
                  <div className="text-[11px] text-white/80 tabular-nums">
                    12 Andares · 4 Aptos por Andar
                  </div>
                </div>
                <span className="text-[11px] text-white/90 underline underline-offset-2">
                  Ver capa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

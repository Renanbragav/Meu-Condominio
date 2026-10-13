import React from 'react';
import { ResidentProfile } from '../types';

interface HeaderProps {
  currentResident: ResidentProfile;
  onOpenRegistration: () => void;
  onOpenApartmentSelector: () => void;
  onOpenNewTask: () => void;
  onOpenAssemblyReport: () => void;
  onOpenLoginScreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegistration,
  onOpenApartmentSelector,
  onOpenNewTask,
  onOpenAssemblyReport,
  onOpenLoginScreen,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#E5E2DC] print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={onOpenLoginScreen}
          className="font-display text-lg font-bold tracking-tight text-[#24324F] hover:text-[#3B5284] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
        >
          Residencial Parque das Torres
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5C6474]">
          <a
            href="#prioridades"
            className="hover:text-[#1E2430] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Prioridades
          </a>
          <button
            id="btn-switch-apartment"
            type="button"
            onClick={onOpenApartmentSelector}
            className="hover:text-[#1E2430] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Unidades
          </button>
          <button
            id="btn-assembly-report"
            type="button"
            onClick={onOpenAssemblyReport}
            className="hover:text-[#1E2430] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Assembleia
          </button>
          <button
            id="btn-current-resident-badge"
            type="button"
            onClick={onOpenRegistration}
            className="hover:text-[#1E2430] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Meu Perfil
          </button>
          {onOpenLoginScreen && (
            <button
              type="button"
              onClick={onOpenLoginScreen}
              className="hover:text-[#A64B3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Acesso
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            id="btn-new-task-header"
            type="button"
            onClick={onOpenNewTask}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#A64B3A] hover:bg-[#8E3D2E] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Nova Proposta
          </button>
        </div>
      </div>
    </header>
  );
};

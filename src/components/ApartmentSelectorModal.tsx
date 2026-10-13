import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { BlockType, ResidentProfile, TaskProposal } from '../types';
import { generateApartmentList } from '../data/initialData';
import { ResidentAvatar } from './ResidentAvatar';

interface ApartmentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResident: ResidentProfile;
  onSelectApartment: (block: BlockType, apartmentNumber: string) => void;
  residents: Record<string, ResidentProfile>;
  tasks: TaskProposal[];
}

export const ApartmentSelectorModal: React.FC<ApartmentSelectorModalProps> = ({
  isOpen,
  onClose,
  currentResident,
  onSelectApartment,
  residents,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>(currentResident.block);
  const [searchFilter, setSearchFilter] = useState('');

  const allApartments = useMemo(() => generateApartmentList(), []);

  const blockApartments = useMemo(
    () => allApartments.filter((apt) => apt.block === selectedBlock),
    [allApartments, selectedBlock]
  );

  // Group by floor (12 down to 1)
  const floorGroups = useMemo(() => {
    const groups: Record<number, typeof blockApartments> = {};
    blockApartments.forEach((apt) => {
      if (!groups[apt.floor]) groups[apt.floor] = [];
      groups[apt.floor].push(apt);
    });
    return groups;
  }, [blockApartments]);

  const sortedFloors = useMemo(
    () =>
      Object.keys(floorGroups)
        .map(Number)
        .sort((a, b) => b - a),
    [floorGroups]
  );

  const searchResults = useMemo(() => {
    if (!searchFilter.trim()) return null;
    const query = searchFilter.toLowerCase();
    return allApartments.filter((apt) => {
      const profile = residents[apt.id];
      return (
        apt.apartmentNumber.toLowerCase().includes(query) ||
        apt.label.toLowerCase().includes(query) ||
        (profile && profile.residentName.toLowerCase().includes(query))
      );
    });
  }, [searchFilter, allApartments, residents]);

  const handleSelect = (block: BlockType, aptNumber: string) => {
    onSelectApartment(block, aptNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#141C2B]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#E5E2DC]">
        {/* Header */}
        <div className="bg-[#24324F] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Selecionar Apartamento
            </h3>
            <p className="text-xs text-white/75 tabular-nums">
              Blocos A e B · 12 Andares · 96 Unidades (101 a 1204)
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

        {/* Subheader: Block Switcher & Search */}
        <div className="px-6 py-3.5 bg-[#F7F6F2] border-b border-[#E5E2DC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#EAE7E1] rounded-lg w-full sm:w-auto">
            {(['A', 'B'] as BlockType[]).map((blk) => (
              <button
                key={blk}
                type="button"
                onClick={() => {
                  setSelectedBlock(blk);
                  setSearchFilter('');
                }}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedBlock === blk && !searchFilter
                    ? 'bg-white text-[#1E2430] shadow-xs'
                    : 'text-[#5C6474] hover:text-[#1E2430]'
                }`}
              >
                Bloco {blk} (48 Aptos)
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8C877E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar número ou morador..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-[#D8D4CC] bg-white focus:outline-none focus:border-[#3B5284]"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-white">
          {searchResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {searchResults.map((apt) => {
                const profile = residents[apt.id];
                const isCurrent =
                  currentResident.block === apt.block &&
                  currentResident.apartmentNumber === apt.apartmentNumber;

                return (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => handleSelect(apt.block, apt.apartmentNumber)}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#24324F] text-white border-[#24324F]'
                        : 'bg-[#F7F6F2] hover:bg-[#EFECE6] border-[#E5E2DC] text-[#1E2430]'
                    }`}
                  >
                    <ResidentAvatar
                      name={profile?.residentName}
                      block={apt.block}
                      apartmentNumber={apt.apartmentNumber}
                      avatarUrl={profile?.avatarUrl}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-semibold tabular-nums">
                        Bloco {apt.block} · {apt.apartmentNumber}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          isCurrent ? 'text-white/80' : 'text-[#687082]'
                        }`}
                      >
                        {profile?.residentName || 'Selecionar unidade'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedFloors.map((floor) => {
                const floorApts = floorGroups[floor] || [];
                return (
                  <div
                    key={floor}
                    className="flex flex-col sm:flex-row sm:items-center gap-2.5 py-2 border-b border-[#F0EDE6] last:border-b-0"
                  >
                    <div className="sm:w-20 shrink-0 font-mono text-xs font-semibold text-[#687082] tabular-nums">
                      {floor}º Andar
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                      {floorApts.map((apt) => {
                        const profile = residents[apt.id];
                        const isCurrent =
                          currentResident.block === apt.block &&
                          currentResident.apartmentNumber === apt.apartmentNumber;

                        return (
                          <button
                            key={apt.id}
                            type="button"
                            onClick={() => handleSelect(apt.block, apt.apartmentNumber)}
                            className={`px-3 py-2 rounded-lg border text-left transition-colors flex items-center gap-2 cursor-pointer ${
                              isCurrent
                                ? 'bg-[#3B5284] text-white border-[#3B5284]'
                                : profile?.residentName
                                ? 'bg-[#F7F6F2] hover:bg-[#ECE9E2] border-[#D8D4CC] text-[#1E2430]'
                                : 'bg-white hover:bg-[#F7F6F2] border-[#E5E2DC] text-[#3A4252]'
                            }`}
                          >
                            <ResidentAvatar
                              name={profile?.residentName}
                              block={apt.block}
                              apartmentNumber={apt.apartmentNumber}
                              avatarUrl={profile?.avatarUrl}
                              size="xs"
                            />
                            <div className="min-w-0">
                              <div className="font-mono text-xs font-semibold tabular-nums">
                                {apt.apartmentNumber}
                              </div>
                              <div
                                className={`text-[11px] truncate ${
                                  isCurrent
                                    ? 'text-white/85'
                                    : profile?.residentName
                                    ? 'text-[#3A4252] font-medium'
                                    : 'text-[#8C877E]'
                                }`}
                              >
                                {profile?.residentName
                                  ? profile.residentName.split(' ')[0]
                                  : 'Livre'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

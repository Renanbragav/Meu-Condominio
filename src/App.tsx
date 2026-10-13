import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResidentStatsBar } from './components/ResidentStatsBar';
import { TaskList } from './components/TaskList';
import { ResidentRegistrationModal } from './components/ResidentRegistrationModal';
import { ApartmentSelectorModal } from './components/ApartmentSelectorModal';
import { NewTaskModal } from './components/NewTaskModal';
import { AssemblyReportModal } from './components/AssemblyReportModal';
import { LoginPage } from './components/LoginPage';
import { ResidentProfile, TaskProposal, BlockType, TaskStatus, TaskVote, TaskComment } from './types';
import { INITIAL_RESIDENTS, INITIAL_TASKS } from './data/initialData';

const STORAGE_KEY_RESIDENTS = 'condo_residents_v2';
const STORAGE_KEY_TASKS = 'condo_tasks_v2';
const STORAGE_KEY_ACTIVE_RESIDENT = 'condo_active_resident_id_v2';

export default function App() {
  const [residents, setResidents] = useState<Record<string, ResidentProfile>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESIDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading residents from storage', e);
    }
    return INITIAL_RESIDENTS;
  });

  const [activeResidentId, setActiveResidentId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_RESIDENT);
      if (saved && (saved in INITIAL_RESIDENTS || saved.includes('-'))) return saved;
    } catch (e) {}
    return 'A-101';
  });

  const [tasks, setTasks] = useState<TaskProposal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading tasks from storage', e);
    }
    return INITIAL_TASKS;
  });

  // Show Login Page initially so the user immediately sees the login screen with the building photo
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(true);

  // Modals state
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isApartmentSelectorOpen, setIsApartmentSelectorOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isAssemblyReportOpen, setIsAssemblyReportOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESIDENTS, JSON.stringify(residents));
    } catch (e) {}
  }, [residents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_RESIDENT, activeResidentId);
    } catch (e) {}
  }, [activeResidentId]);

  const currentResident: ResidentProfile = residents[activeResidentId] || {
    id: activeResidentId,
    block: activeResidentId.startsWith('B') ? 'B' : 'A',
    apartmentNumber: activeResidentId.split('-')[1] || '101',
    floor: parseInt(
      activeResidentId.split('-')[1]?.substring(0, activeResidentId.split('-')[1].length - 2) || '1',
      10
    ),
    residentName: `Morador ${activeResidentId}`,
    phone: '',
    email: '',
    occupancyType: 'proprietario_residente',
    registeredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleLogin = (
    block: BlockType,
    apartmentNumber: string,
    name: string,
    avatarUrl?: string
  ) => {
    const unitId = `${block}-${apartmentNumber}`;
    const existing = residents[unitId];
    const updatedProfile: ResidentProfile = {
      id: unitId,
      block,
      apartmentNumber,
      floor: parseInt(apartmentNumber.substring(0, apartmentNumber.length - 2) || '1', 10),
      residentName: name || existing?.residentName || `Morador ${unitId}`,
      phone: existing?.phone || '',
      email: existing?.email || '',
      occupancyType: existing?.occupancyType || 'proprietario_residente',
      avatarUrl: avatarUrl !== undefined ? avatarUrl : existing?.avatarUrl,
      registeredAt: existing?.registeredAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setResidents((prev) => ({
      ...prev,
      [unitId]: updatedProfile,
    }));
    setActiveResidentId(unitId);
    setShowLoginScreen(false);
  };

  const handleSelectApartment = (block: BlockType, apartmentNumber: string) => {
    const newId = `${block}-${apartmentNumber}`;
    if (!residents[newId]) {
      const newProfile: ResidentProfile = {
        id: newId,
        block,
        apartmentNumber,
        floor: parseInt(apartmentNumber.substring(0, apartmentNumber.length - 2) || '1', 10),
        residentName: '',
        phone: '',
        email: '',
        occupancyType: 'proprietario_residente',
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setResidents((prev) => ({ ...prev, [newId]: newProfile }));
    }
    setActiveResidentId(newId);
  };

  const handleSaveResident = (updatedProfile: ResidentProfile) => {
    setResidents((prev) => ({
      ...prev,
      [updatedProfile.id]: updatedProfile,
    }));
  };

  const handleToggleVote = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        const hasVoted = task.votes.some((v) => v.residentId === currentResident.id);
        let updatedVotes: TaskVote[];

        if (hasVoted) {
          updatedVotes = task.votes.filter((v) => v.residentId !== currentResident.id);
        } else {
          const newVote: TaskVote = {
            residentId: currentResident.id,
            residentName:
              currentResident.residentName || `Morador Apto ${currentResident.apartmentNumber}`,
            block: currentResident.block,
            apartmentNumber: currentResident.apartmentNumber,
            avatarUrl: currentResident.avatarUrl,
            votedAt: new Date().toISOString(),
          };
          updatedVotes = [...task.votes, newVote];
        }

        return {
          ...task,
          votes: updatedVotes,
        };
      })
    );
  };

  const handleAddComment = (taskId: string, text: string) => {
    const newComment: TaskComment = {
      id: `comment-${Date.now()}`,
      residentId: currentResident.id,
      residentName:
        currentResident.residentName || `Morador Apto ${currentResident.apartmentNumber}`,
      block: currentResident.block,
      apartmentNumber: currentResident.apartmentNumber,
      avatarUrl: currentResident.avatarUrl,
      text,
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          comments: [...t.comments, newComment],
        };
      })
    );
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: newStatus,
        };
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = (
    newTaskData: Omit<TaskProposal, 'id' | 'createdAt' | 'votes' | 'comments'>,
    autoVote: boolean
  ) => {
    const taskId = `task-${Date.now()}`;
    const initialVotes: TaskVote[] = autoVote
      ? [
          {
            residentId: currentResident.id,
            residentName:
              currentResident.residentName || `Morador Apto ${currentResident.apartmentNumber}`,
            block: currentResident.block,
            apartmentNumber: currentResident.apartmentNumber,
            avatarUrl: currentResident.avatarUrl,
            votedAt: new Date().toISOString(),
          },
        ]
      : [];

    const createdTask: TaskProposal = {
      ...newTaskData,
      id: taskId,
      createdAt: new Date().toISOString(),
      votes: initialVotes,
      comments: [],
    };

    setTasks((prev) => [createdTask, ...prev]);
  };

  if (showLoginScreen) {
    return (
      <LoginPage
        residents={residents}
        currentResident={currentResident}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1E2430] flex flex-col antialiased selection:bg-[#3B5284] selection:text-white">
      <Header
        currentResident={currentResident}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenApartmentSelector={() => setIsApartmentSelectorOpen(true)}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onOpenAssemblyReport={() => setIsAssemblyReportOpen(true)}
        onOpenLoginScreen={() => setShowLoginScreen(true)}
      />

      <ResidentStatsBar
        tasks={tasks}
        currentResident={currentResident}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenApartmentSelector={() => setIsApartmentSelectorOpen(true)}
        onOpenLoginScreen={() => setShowLoginScreen(true)}
      />

      <main className="flex-1">
        <TaskList
          tasks={tasks}
          currentResident={currentResident}
          residents={residents}
          onToggleVote={handleToggleVote}
          onAddComment={handleAddComment}
          onUpdateStatus={handleUpdateStatus}
          onDeleteTask={handleDeleteTask}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
          onOpenAssemblyReport={() => setIsAssemblyReportOpen(true)}
        />
      </main>

      <footer className="border-t border-[#E5E2DC] bg-white text-[#687082] text-xs py-6 px-4 sm:px-6 lg:px-8 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-[#1E2430]">
              Condomínio Residencial Parque das Torres
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="tabular-nums">Blocos A e B (96 Apartamentos · 101 a 1204)</span>
          </div>

          <div>
            <span>Portal de Prioridades</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>1 Voto por Unidade</span>
          </div>
        </div>
      </footer>

      <ResidentRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        currentResident={currentResident}
        onSaveResident={handleSaveResident}
        tasks={tasks}
      />

      <ApartmentSelectorModal
        isOpen={isApartmentSelectorOpen}
        onClose={() => setIsApartmentSelectorOpen(false)}
        currentResident={currentResident}
        onSelectApartment={handleSelectApartment}
        residents={residents}
        tasks={tasks}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        currentResident={currentResident}
        onCreateTask={handleCreateTask}
      />

      <AssemblyReportModal
        isOpen={isAssemblyReportOpen}
        onClose={() => setIsAssemblyReportOpen(false)}
        tasks={tasks}
      />
    </div>
  );
}

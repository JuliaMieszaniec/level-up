<template>
  <div class="team-dashboard container py-4" v-if="!loading">
    <h1 class="neon-text mb-4">Zespół: {{ team.name }}</h1>

    <!-- Górny wiersz z kafelkami -->
    <div class="top-tiles-row mb-4">
      <div class="row g-4">
        <div class="col-md-4">
          <GoalsTile
            :goals="team.goals"
            :isOwner="isOwner()"
            v-model:newGoalText="newGoalText"
            @add-goal="addGoal"
            @remove-goal="removeGoal"
            @update-goals="updateGoals"
            :adding="addingGoal"
          />
        </div>
        <div class="col-md-4">
          <SkillsTile
            :skills="team.skills"
            :isOwner="isOwner()"
            @add-skill="addSkill"
            @remove-skill="removeSkill"
            @toggle-skill="toggleSkill"
            :adding="addingSkill"
          />
        </div>
        <div class="col-md-4">
          <NotesTile
            :initialNotes="team.notes || []"
            @updateNotes="updateNotes"
          />
        </div>
      </div>
    </div>

    <!-- Tablica Kanban na pełną szerokość -->
    <div class="kanban-full-width mb-4">
      <KanbanTile
        :kanbanData="team.kanban || {}"
        @updateKanban="updateKanban"
      />
    </div>

    <!-- Członkowie zespołu -->
    <div class="members-section">
      <MembersTile
        :members="team.members"
        :ownerEmail="team.ownerEmail"
        :currentUserEmail="currentUserEmail"
        :isOwner="isOwner()"
        @add-member="addMember"
        @remove-member="removeMember"
        :adding="addingMember"
      />
    </div>
  </div>

  <div v-else class="text-center py-5 text-muted">
    Ładowanie danych zespołu...
  </div>

  <div v-if="errorMessage && !loading" class="text-danger text-center py-4">
    {{ errorMessage }}
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/composables/useAuth'
import MembersTile from '@/components/team/MembersTile.vue'
import GoalsTile from '@/components/team/GoalsTile.vue'
import SkillsTile from '@/components/team/SkillsTile.vue'
import KanbanTile from '@/components/team/KanbanBoardTile.vue'
import NotesTile from '@/components/team/NotesTile.vue'

const route = useRoute()
const { user } = useAuth()

const teamId = route.params.id
const currentUserEmail = user?.email || ''

const team = ref(null)
const loading = ref(true)
const errorMessage = ref('')

// Członkowie
const newMemberEmail = ref('')
const addingMember = ref(false)

// Cele
const newGoalText = ref('')
const addingGoal = ref(false)

// Umiejętności
const addingSkill = ref(false)

const isOwner = () => team.value?.ownerEmail === currentUserEmail

const fetchTeam = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const teamRef = doc(db, 'teams', teamId)
    const teamSnap = await getDoc(teamRef)
    if (!teamSnap.exists()) {
      errorMessage.value = 'Zespół nie istnieje'
      return
    }
    const data = teamSnap.data()
    team.value = {
      ...data,
      goals: data.goals || [],
      skills: data.skills || [],
    }
  } catch (e) {
    console.error('Błąd pobierania zespołu:', e)
    errorMessage.value = 'Nie udało się pobrać danych zespołu.'
  } finally {
    loading.value = false
  }
}

const updateTeamField = async (field, value) => {
  if (!team.value) return
  try {
    const teamRef = doc(db, 'teams', teamId)
    await updateDoc(teamRef, {
      [field]: value
    })
    team.value[field] = value
  } catch (e) {
    console.error(`Błąd aktualizacji ${field}:`, e)
    errorMessage.value = `Nie udało się zaktualizować ${field}.`
  }
}

// Członkowie
const addMember = async (email) => {
  if (!email.trim()) return
  const emailToAdd = email.trim().toLowerCase()
  if (team.value.members.includes(emailToAdd)) {
    errorMessage.value = 'Ten użytkownik jest już w zespole.'
    return
  }
  addingMember.value = true
  errorMessage.value = ''
  try {
    const updatedMembers = [...team.value.members, emailToAdd]
    await updateTeamField('members', updatedMembers)
  } catch {
    errorMessage.value = 'Nie udało się dodać członka.'
  } finally {
    addingMember.value = false
  }
}

const removeMember = async (memberEmail) => {
  if (!confirm(`Czy na pewno chcesz usunąć ${memberEmail} z zespołu?`)) return
  errorMessage.value = ''
  try {
    const updatedMembers = team.value.members.filter(m => m !== memberEmail)
    await updateTeamField('members', updatedMembers)
  } catch {
    errorMessage.value = 'Nie udało się usunąć członka.'
  }
}

// Cele
const addGoal = async () => {
  if (!newGoalText.value.trim()) return
  addingGoal.value = true
  errorMessage.value = ''
  try {
    const updatedGoals = [...team.value.goals, { text: newGoalText.value.trim(), completed: false }]
    await updateTeamField('goals', updatedGoals)
    newGoalText.value = ''
  } catch {
    errorMessage.value = 'Nie udało się dodać celu.'
  } finally {
    addingGoal.value = false
  }
}

const removeGoal = async (index) => {
  errorMessage.value = ''
  try {
    const updatedGoals = [...team.value.goals]
    updatedGoals.splice(index, 1)
    await updateTeamField('goals', updatedGoals)
  } catch {
    errorMessage.value = 'Nie udało się usunąć celu.'
  }
}

const updateGoals = async () => {
  errorMessage.value = ''
  try {
    await updateTeamField('goals', team.value.goals)
  } catch {
    errorMessage.value = 'Nie udało się zaktualizować celów.'
  }
}

// Umiejętności
const addSkill = async (skillText) => {
  if (!skillText.trim()) return
  addingSkill.value = true
  errorMessage.value = ''
  try {
    const newSkill = { text: skillText.trim(), completed: false }
    const updatedSkills = [...team.value.skills, newSkill]
    await updateTeamField('skills', updatedSkills)
  } catch {
    errorMessage.value = 'Nie udało się dodać umiejętności.'
  } finally {
    addingSkill.value = false
  }
}

const removeSkill = async (index) => {
  errorMessage.value = ''
  try {
    const updatedSkills = [...team.value.skills]
    updatedSkills.splice(index, 1)
    await updateTeamField('skills', updatedSkills)
  } catch {
    errorMessage.value = 'Nie udało się usunąć umiejętności.'
  }
}

const toggleSkill = async ({ index, completed }) => {
  errorMessage.value = ''
  try {
    const updatedSkills = [...team.value.skills]
    updatedSkills[index].completed = completed
    await updateTeamField('skills', updatedSkills)
  } catch {
    errorMessage.value = 'Nie udało się zaktualizować umiejętności.'
  }
}

// Notatki
const updateNotes = async (newNotes) => {
  errorMessage.value = ''
  try {
    await updateTeamField('notes', newNotes)
  } catch {
    errorMessage.value = 'Nie udało się zaktualizować notatek.'
  }
}

// Kanban
const updateKanban = async (newKanbanData) => {
  errorMessage.value = ''
  try {
    await updateTeamField('kanban', newKanbanData)
  } catch {
    errorMessage.value = 'Nie udało się zaktualizować kanbana.'
  }
}

watchEffect(() => {
  fetchTeam()
})
</script>

<style scoped>
.team-dashboard {
  color: #eee;
}

.neon-text {
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.top-tiles-row {
  margin-bottom: 2rem;
}

.kanban-full-width {
  width: 100%;
  margin-bottom: 2rem;
}

.members-section {
  margin-top: 2rem;
}

.tile {
  background: rgba(25, 19, 46, 0.85);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 12px #b983ff66;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.list-group-item {
  background: transparent;
  border-color: rgba(185, 131, 255, 0.2);
  color: #eee;
  user-select: none;
}

.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px #b983ffaa;
  transition: 0.3s ease;
  user-select: none;
}

.btn-glow:hover:not(:disabled) {
  box-shadow: 0 0 15px #b983ffdd;
}

textarea.form-control {
  background: rgba(50, 41, 81, 0.8);
  color: #eee;
  border: none;
  border-radius: 8px;
  resize: vertical;
}
</style>
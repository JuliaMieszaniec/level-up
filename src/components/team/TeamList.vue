<template>
  <div class="team-list">
    <RouterLink
        v-for="team in teams"
        :key="team.id"
        :to="`/team/${team.id}`"
        class="team-card-link text-decoration-none"
        custom
        v-slot="{ navigate, isActive }"
        >
        <div
            class="team-card glassy p-3 mb-4 rounded shadow"
            :class="{ active: isActive }"
            @click="() => { console.log('Kliknięto kartę', team.id); navigate(); }"
        >
            <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="team-name neon-text mb-0">{{ team.name }}</h3>
            <small class="text-muted fst-italic">Właściciel: {{ team.ownerEmail }}</small>
            </div>

            <!-- Członkowie -->
            <div class="mb-3">
            <h5 class="mb-2">Członkowie ({{ team.members.length }})</h5>
            <div class="d-flex flex-wrap gap-2 align-items-center">
                <div
                v-for="member in team.members"
                :key="member"
                class="member-item d-flex align-items-center gap-2 px-2 py-1 rounded"
                :class="{ owner: member === team.ownerEmail }"
                >
                <div class="avatar-placeholder" :title="member">
                    {{ getInitials(member) }}
                </div>
                <span>{{ member }}</span>

                <!-- Usuwanie członka, tylko właściciel i nie siebie -->
                <button
                    v-if="isOwner(team) && member !== currentUserEmail"
                    class="btn btn-sm btn-outline-danger ms-2"
                    @click.stop.prevent="removeMember(team.id, member)"
                    title="Usuń członka"
                >
                    &times;
                </button>
                </div>
            </div>
            </div>

            <!-- Dodawanie członka, tylko właściciel -->
            <form
            v-if="isOwner(team)"
            @submit.prevent.stop="addMember(team.id)"
            class="d-flex gap-2 align-items-center flex-wrap"
            >
            <input
                v-model="newMemberEmail[team.id]"
                type="email"
                placeholder="Dodaj członka (email)"
                class="form-control form-control-sm"
                :disabled="addingMember[team.id]"
                required
            />
            <button
                type="submit"
                class="btn btn-sm btn-glow"
                :disabled="addingMember[team.id]"
            >
                {{ addingMember[team.id] ? 'Dodaję...' : 'Dodaj' }}
            </button>
            </form>

            <!-- Błędy dla tego zespołu -->
            <div v-if="errorMessages[team.id]" class="text-danger mt-2">
            {{ errorMessages[team.id] }}
            </div>
        </div>
        </RouterLink>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  currentUserEmail: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(['updateTeams'])

const newMemberEmail = reactive({})
const addingMember = reactive({})
const errorMessages = reactive({})

const isOwner = (team) => team.ownerEmail === props.currentUserEmail

const getInitials = (email) => {
  const namePart = email.split('@')[0]
  const parts = namePart.split(/[._]/)
  return parts.map(p => p[0]?.toUpperCase() || '').join('').slice(0, 2)
}

const addMember = async (teamId) => {
  if (!newMemberEmail[teamId]?.trim()) return
  const emailToAdd = newMemberEmail[teamId].trim().toLowerCase()
  errorMessages[teamId] = ''
  addingMember[teamId] = true

  try {
    const teamRef = doc(db, 'teams', teamId)
    const teamSnap = await getDoc(teamRef)
    if (!teamSnap.exists()) throw new Error('Zespół nie istnieje')

    const teamData = teamSnap.data()
    if (teamData.members.includes(emailToAdd)) {
      errorMessages[teamId] = 'Ten użytkownik jest już w zespole.'
      addingMember[teamId] = false
      return
    }

    await updateDoc(teamRef, {
      members: arrayUnion(emailToAdd)
    })

    newMemberEmail[teamId] = ''
    emit('updateTeams')
  } catch (e) {
    console.error('Błąd dodawania członka:', e)
    errorMessages[teamId] = 'Nie udało się dodać członka.'
  } finally {
    addingMember[teamId] = false
  }
}

const removeMember = async (teamId, memberEmail) => {
  if (!confirm(`Czy na pewno chcesz usunąć ${memberEmail} z zespołu?`)) return
  errorMessages[teamId] = ''
  addingMember[teamId] = true

  try {
    const teamRef = doc(db, 'teams', teamId)
    await updateDoc(teamRef, {
      members: arrayRemove(memberEmail)
    })
    emit('updateTeams')
  } catch (e) {
    console.error('Błąd usuwania członka:', e)
    errorMessages[teamId] = 'Nie udało się usunąć członka.'
  } finally {
    addingMember[teamId] = false
  }
}
</script>

<style scoped>
.team-card {
  background: rgba(25, 19, 46, 0.85);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 10px #b983ff55;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.team-card:hover {
  box-shadow: 0 0 20px #b983ffbb;
}

.team-card.active {
  box-shadow: 0 0 25px #b983fff0;
}

.neon-text {
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.member-item {
  background: rgba(185, 131, 255, 0.15);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.3s ease;
}

.member-item.owner {
  background: rgba(255, 215, 0, 0.3);
  font-weight: 700;
}

.avatar-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9f6eff, #b983ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  user-select: none;
  text-transform: uppercase;
}

input.form-control-sm {
  max-width: 200px;
}

.btn-glow {
  background: linear-gradient(90deg, #9f6eff, #b983ff);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px #b983ffaa;
  transition: 0.3s ease;
}
.btn-glow:hover:not(:disabled) {
  box-shadow: 0 0 15px #b983ffdd;
}
</style>

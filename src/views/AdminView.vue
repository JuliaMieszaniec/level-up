<template>
  <div class="admin-panel container py-4">
    <h2 class="mb-4 text-gradient">Panel Administratora</h2>

    <div class="table-responsive">
      <table class="table admin-table table-striped table-hover align-middle mb-0">
        <thead class="table-dark">
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Nazwa</th>
            <th scope="col">Rola</th>
            <th scope="col" class="text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.uid">
            <td>{{ user.email }}</td>
            <td>{{ user.name || '-' }}</td>
            <td>
              <select v-model="user.role" @change="updateUserRole(user)" class="form-select form-select-sm">
                <option value="member">Członek</option>
                <option value="leader">Lider</option>
                <option value="board">Zarząd</option>
                <option value="admin">Administrator</option>
              </select>
            </td>
            <td class="text-center">
              <button @click="removeUser(user.uid)" class="btn btn-outline-danger btn-sm">
                Usuń
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="text-center text-muted">Brak użytkowników</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const users = ref([])

const fetchUsers = async () => {
  const usersCol = collection(db, 'users')
  const usersSnapshot = await getDocs(usersCol)
  users.value = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
}

const updateUserRole = async (user) => {
  const userRef = doc(db, 'users', user.uid)
  await updateDoc(userRef, { role: user.role })
  alert(`Rola użytkownika ${user.name || user.email} została zaktualizowana.`)
}

const removeUser = async (uid) => {
  if (!confirm('Na pewno usunąć tego użytkownika?')) return
  await deleteDoc(doc(db, 'users', uid))
  users.value = users.value.filter(u => u.uid !== uid)
}

onMounted(fetchUsers)
</script>

<style scoped>
.admin-panel {
  background: rgba(25, 19, 46, 0.9);
  border-radius: 1rem;
  padding: 2rem;
}

/* RESPONSYWNOŚĆ - poziomy scroll na małych ekranach */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Zapobiega łamaniu tekstu i rozjechaniu tabeli */
.admin-table th,
.admin-table td {
  white-space: nowrap;
}

.text-gradient {
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.admin-table {
  background: rgba(40, 34, 64, 0.85);
  border-radius: 0.75rem;
  overflow: hidden;
}

.admin-table thead tr {
  background: linear-gradient(90deg, #7f5af0, #b983ff);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
}

.admin-table tbody tr:hover {
  background: rgba(185, 131, 255, 0.15);
  cursor: pointer;
}

.form-select {
  background: rgba(75, 60, 130, 0.7);
  color: rgb(255, 252, 252);
  border: 1px solid #b983ffaa;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  min-width: 120px; /* poprawia czytelność na małych ekranach */
}

.form-select:focus {
  background: rgba(75, 60, 130, 0.9);
  border-color: #b983ff;
  box-shadow: 0 0 8px #b983ffaa;
  color: rgb(251, 250, 250);
}

.btn-outline-danger {
  border-color: rgba(255, 85, 85, 0.6);
  color: #ff6b6b;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background: rgba(255, 85, 85, 0.15);
  color: #ff4c4c;
}

/* 
Opcjonalnie: tabela zmienia się w karty na bardzo wąskich ekranach (np. telefonach) 
Jeśli chcesz użyć, odkomentuj poniższy blok i dodaj do każdego <td> atrybut data-label="Nagłówek"

Przykład w template: 
<td data-label="Email">{{ user.email }}</td>
<td data-label="Nazwa">{{ user.name || '-' }}</td>
<td data-label="Rola">...</td>
<td data-label="Akcje">...</td>
*/

 /*
@media (max-width: 575.98px) {
  .admin-table thead {
    display: none;
  }
  .admin-table tbody tr {
    display: block;
    margin-bottom: 1rem;
    background: rgba(40, 34, 64, 0.75);
    border-radius: 0.75rem;
    padding: 1rem;
  }
  .admin-table tbody tr:hover {
    background: rgba(185, 131, 255, 0.2);
  }
  .admin-table tbody tr td {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    white-space: normal;
  }
  .admin-table tbody tr td.text-center {
    justify-content: flex-end;
  }
  .admin-table tbody tr td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #b983ff;
  }
}
*/
</style>

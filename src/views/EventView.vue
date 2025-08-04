<template>
    <div class="event-view container-fluid py-4">
      <div class="row g-4">
        <!-- Lewa kolumna: Kalendarz + Lista wydarzeń -->
        <div class="col-md-7">
          <div class="glassy p-3 rounded-4 mb-4 shadow">
            <h5 class="text-light mb-3">🗓️ Kalendarz wydarzeń</h5>
            <CalendarCard :events="events" @select-date="handleSelectDate" />
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div class="event-list d-flex flex-column gap-3">
            <div v-if="filteredEvents.length === 0" class="text-light text-center py-3">
              Brak wydarzeń do wyświetlenia
            </div>
            <div
              v-for="event in filteredEvents"
              :key="event.id"
              class="event-card p-3 rounded-4 shadow-sm d-flex flex-column gap-1"
            >
              <h6 class="text-light fw-bold">{{ event.title }}</h6>
              <p class="text-light small mb-1">{{ event.description }}</p>
              <p class="text-info small mb-1">📅 {{ formatDate(event.date) }}</p>
              <p class="text-warning small mb-1">
                🡭 Wolne miejsca: {{ event.limit ? event.limit - (event.attendees?.length || 0) : 'nielimitowane' }}
              </p>

              <div class="d-flex justify-content-end gap-2 mt-2">
                <button class="btn btn-glow btn-sm">Zapisz się</button>
                <button class="btn btn-sm btn-outline-light" @click="startEditing(event)">Edytuj</button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.id)">Usuń</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Prawa kolumna: Formularz wydarzenia -->
        <div class="col-md-5">
          <div class="glassy p-4 rounded-4 shadow">
            <h5 class="text-light mb-3">{{ editingEventId ? '✏️ Edytuj wydarzenie' : '➕ Dodaj nowe wydarzenie' }}</h5>
            <form @submit.prevent="editingEventId ? updateEvent() : addEvent()">
              <div class="mb-3">
                <label class="form-label text-light">Nazwa wydarzenia</label>
                <input v-model="newEvent.title" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label text-light">Opis</label>
                <textarea v-model="newEvent.description" class="form-control"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label text-light">Termin</label>
                <input v-model="newEvent.date" type="date" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label text-light">Limit miejsc (opcjonalnie)</label>
                <input v-model.number="newEvent.limit" type="number" class="form-control" min="0" />
              </div>
              <div class="mb-3">
                <label class="form-label text-light">Link do wydarzenia (opcjonalnie)</label>
                <input v-model="newEvent.link" type="url" class="form-control" />
              </div>
              <button type="submit" class="btn btn-glow w-100">{{ editingEventId ? 'Zapisz zmiany' : 'Dodaj wydarzenie' }}</button>
              <button v-if="editingEventId" type="button" class="btn btn-outline-light w-100 mt-2" @click="cancelEditing">Anuluj</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>  
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { db } from '@/firebase'
  import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp
  } from 'firebase/firestore'
  
  import CalendarCard from '@/components/CalendarCard.vue'
  
  const events = ref([])
  const selectedDate = ref(null)
  const error = ref(null)
  
  const newEvent = ref({
    title: '',
    description: '',
    date: '',
    limit: null,
    link: ''
  })
  
  // Pobieranie wydarzeń z Firestore
  const fetchEvents = async () => {
    try {
      error.value = null
      const querySnapshot = await getDocs(collection(db, 'events'))
      events.value = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString().split('T')[0] : doc.data().date
      }))
    } catch (err) {
      error.value = 'Wystąpił błąd podczas pobierania wydarzeń: ' + err.message
      console.error(err)
    }
  }
  
  // Dodawanie nowego wydarzenia
  const addEvent = async () => {
    if (!newEvent.value.title || !newEvent.value.date) return
    
    try {
      error.value = null
      const eventToAdd = {
        ...newEvent.value,
        attendees: [],
        createdAt: serverTimestamp()
      }
      
      await addDoc(collection(db, 'events'), eventToAdd)
      newEvent.value = { title: '', description: '', date: '', limit: null, link: '' }
      await fetchEvents()
    } catch (err) {
      error.value = 'Wystąpił błąd podczas dodawania wydarzenia: ' + err.message
      console.error(err)
    }
  }
  
  // Usuwanie wydarzenia
  const deleteEvent = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć to wydarzenie?')) return
    
    try {
      error.value = null
      await deleteDoc(doc(db, 'events', id))
      await fetchEvents()
    } catch (err) {
      error.value = 'Wystąpił błąd podczas usuwania wydarzenia: ' + err.message
      console.error(err)
    }
  }
  
  // Formatowanie daty do wyświetlania
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('pl-PL', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    } catch (e) {
      return dateStr
    }
  }
  
  // Filtrowanie wydarzeń po wybranej dacie z kalendarza
  const filteredEvents = computed(() => {
    if (!selectedDate.value) return events.value
    
    return events.value.filter(e => {
      if (!e.date) return false
      
      const eventDate = new Date(e.date)
      return (
        eventDate.getFullYear() === selectedDate.value.getFullYear() &&
        eventDate.getMonth() === selectedDate.value.getMonth() &&
        eventDate.getDate() === selectedDate.value.getDate()
      )
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  })
  
  // Obsługa kliknięcia w datę w kalendarzu
  function handleSelectDate(date) {
    selectedDate.value = date
  }

  const editingEventId = ref(null)

  const startEditing = (event) => {
    editingEventId.value = event.id
    newEvent.value = { 
      title: event.title,
      description: event.description,
      date: event.date,
      limit: event.limit,
      link: event.link
    }
  }

  const cancelEditing = () => {
    editingEventId.value = null
    newEvent.value = { title: '', description: '', date: '', limit: null, link: '' }
  }

  const updateEvent = async () => {
    if (!editingEventId.value || !newEvent.value.title || !newEvent.value.date) return
    
    try {
      error.value = null
      await updateDoc(doc(db, 'events', editingEventId.value), {
        title: newEvent.value.title,
        description: newEvent.value.description,
        date: newEvent.value.date,
        limit: newEvent.value.limit,
        link: newEvent.value.link
      })

      editingEventId.value = null
      newEvent.value = { title: '', description: '', date: '', limit: null, link: '' }
      await fetchEvents()
    } catch (err) {
      error.value = 'Wystąpił błąd podczas aktualizacji wydarzenia: ' + err.message
      console.error(err)
    }
  }
  
  onMounted(fetchEvents)
  </script>
  
  
  <style scoped>
    .event-view {
    color: #f5f5f5;
    }

    .glassy {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 12px rgba(185, 131, 255, 0.2);
    }

    .btn-glow {
      background: linear-gradient(90deg, #fbcf33, #f5b400);
      color: #000;
      font-weight: bold;
      border: none;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
      transition: transform 0.2s ease;
    }
    .btn-glow:hover {
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(255, 230, 100, 0.8);
    }

    .event-card {
    background: linear-gradient(135deg, #1f1d2e, #2e264d, #1a1d33);
    border: 1px solid rgba(255, 255, 255, 0.07);
    padding: 1.2rem;
    border-radius: 1.2rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 0 16px rgba(185, 131, 255, 0.15);
    position: relative;
    overflow: hidden;
  }
  .event-card:hover {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(185, 131, 255, 0.35);
  }


    .text-light {
    color: #eee;
    }
    .text-muted {
    color: #aaa;
    }
    .text-warning {
    color: #ffc107;
    }
    .text-info {
    color: #5bc0de;
    }
    </style>
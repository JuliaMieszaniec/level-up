<!-- CalendarCard.vue -->
<template>
    <div class="calendar rounded-4 p-3 shadow bg-dark text-light">
      <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
        <button @click="prevMonth" class="btn btn-sm btn-outline-light">&lt;</button>
        <h5 class="m-0">{{ monthYear }}</h5>
        <button @click="nextMonth" class="btn btn-sm btn-outline-light">&gt;</button>
      </div>
  
      <div class="calendar-weekdays d-flex justify-content-between text-center fw-bold mb-2">
        <div v-for="day in weekdays" :key="day" class="calendar-weekday" style="width: 14.28%;">{{ day }}</div>
      </div>
  
      <div class="calendar-days d-flex flex-wrap">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-day text-center position-relative"
          :class="{
            'text-muted': !day.inCurrentMonth,
            'bg-primary rounded-circle text-white': isToday(day.date),
            'selected-date': isSelectedDate(day.date)
          }"
          style="width: 14.28%; cursor: pointer;"
          @click="selectDate(day.date)"
          :title="formatDate(day.date)"
        >
          {{ day.day }}
  
          <!-- Kropka oznaczająca, że w tym dniu jest wydarzenie -->
          <span
            v-if="day.hasEvent"
            class="event-dot position-absolute bottom-1 start-50 translate-middle-x rounded-circle"
            aria-label="Dzień z wydarzeniem"
          ></span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, defineEmits, defineProps } from 'vue'

  const props = defineProps({
    events: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['select-date'])

  const today = new Date()
  const currentYear = ref(today.getFullYear())
  const currentMonth = ref(today.getMonth()) // 0-11
  const selectedDate = ref(null)

  const weekdays = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb']

  const monthYear = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value)
    return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' })
  })

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
  }

  function firstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay() // 0=Nd ... 6=Sb
  }

  function isSameDate(d1, d2) {
    if (!d1 || !d2) return false
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear()
  }

  const calendarDays = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value

    const firstDay = firstDayOfMonth(year, month)
    const totalDays = daysInMonth(year, month)

    const prefixDays = firstDay === 0 ? 0 : firstDay

    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const prevMonthDaysCount = daysInMonth(prevYear, prevMonth)

    const days = []

    // Dni z poprzedniego miesiąca
    for (let i = prefixDays - 1; i >= 0; i--) {
      const date = new Date(prevYear, prevMonth, prevMonthDaysCount - i)
      days.push({
        day: prevMonthDaysCount - i,
        inCurrentMonth: false,
        date,
        hasEvent: hasEventOnDate(date)
      })
    }

    // Dni z bieżącego miesiąca
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i)
      days.push({
        day: i,
        inCurrentMonth: true,
        date,
        hasEvent: hasEventOnDate(date)
      })
    }

    // Dni z następnego miesiąca
    const nextMonth = (month + 1) % 12
    const nextYear = month === 11 ? year + 1 : year
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(nextYear, nextMonth, i)
      days.push({
        day: i,
        inCurrentMonth: false,
        date,
        hasEvent: hasEventOnDate(date)
      })
    }

    return days
  })

  function hasEventOnDate(date) {
    if (!props.events || props.events.length === 0) return false
    
    return props.events.some(event => {
      if (!event.date) return false
      
      try {
        const eventDate = new Date(event.date)
        return isSameDate(eventDate, date)
      } catch (e) {
        return false
      }
    })
  }

  function prevMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function isToday(date) {
    const now = new Date()
    return isSameDate(date, now)
  }

  function isSelectedDate(date) {
    return selectedDate.value ? isSameDate(date, selectedDate.value) : false
  }

  function formatDate(date) {
    return date.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  function selectDate(date) {
    selectedDate.value = date
    emit('select-date', date)
  }
  </script>

  <style scoped>
  .calendar {
    background: linear-gradient(135deg, #2b2b3d, #1f1f2e);
    border: 1px solid #3c3c5a;
    padding: 1rem;
    user-select: none;
    max-width: 350px;
  }
  
  .calendar-header button {
    width: 36px;
  }
  
  .calendar-weekday {
    font-size: 0.85rem;
    color: #b983ff;
  }
  
  .calendar-day {
    padding: 8px 0;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    position: relative;
    height: 36px;
  }
  
  .calendar-day:hover {
    background-color: rgba(185, 131, 255, 0.3);
  }
  
  .text-muted {
    color: #6c757d !important;
  }
  
  .bg-primary {
    background-color: #b983ff !important;
  }
  
  .selected-date {
    background-color: rgba(185, 131, 255, 0.5) !important;
    border-radius: 50%;
  }
  
  .event-dot {
    width: 6px;
    height: 6px;
    background-color: #fbcf33;
    display: block;
  }
  </style>
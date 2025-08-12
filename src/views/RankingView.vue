<template>
  <div class="ranking-container container py-3 py-md-4">
    <h1 class="text-center mb-3 mb-md-4 neon-text fw-bold display-5 display-md-4">
      🏆 Ranking Graczy
    </h1>

    <!-- Tabela rankingu -->
    <div class="ranking-table shadow-lg p-3 p-md-4 rounded mb-3 mb-md-4 glassy">
      <div class="table-responsive">
        <table class="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="text-nowrap">Miejsce</th>
              <th>Gracz</th>
              <th class="text-nowrap">XP</th>
              <th class="text-nowrap">Poziom</th>
              <th class="text-nowrap">Postęp</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in ranking"
              :key="user.id"
              :class="{ 'top-user': index < 3 }"
              class="fade-in-up"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <td class="fw-bold place-cell text-nowrap">
                <span v-if="index === 0" class="crown">👑</span>
                <span v-else-if="index === 1" class="silver-medal">🥈</span>
                <span v-else-if="index === 2" class="bronze-medal">🥉</span>
                {{ index + 1 }}
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <img
                    :src="user.avatarUrl || defaultAvatar"
                    alt="avatar"
                    class="rounded-circle me-2 border border-light avatar"
                  />
                  <div class="text-truncate">
                    <div class="fw-bold neon-text text-truncate">{{ user.name || 'Anonim' }}</div>
                    <small class="text-muted text-truncate">{{ user.name || '' }}</small>
                  </div>
                </div>
              </td>
              <td class="fw-bold text-info text-nowrap">{{ user.xp }}</td>
              <td class="fw-bold text-warning text-nowrap">{{ getLevel(user.xp) }}</td>
              <td>
                <div class="d-flex flex-column flex-md-row align-items-center">
                  <div class="progress bg-secondary rounded-pill me-0 me-md-2 mb-1 mb-md-0" style="height: 14px; min-width: 120px;">
                    <div
                      class="progress-bar progress-glow rounded-pill"
                      role="progressbar"
                      :style="{ width: getProgress(user.xp) + '%' }"
                    ></div>
                  </div>
                  <small class="text-muted text-nowrap">{{ getProgress(user.xp) }}%</small>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Wykresy w układzie kolumnowym na mobile -->
    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <div class="chart-card mb-3 mb-md-4 p-3 p-md-4 rounded shadow-lg glassy">
          <canvas ref="xpChart" class="chart-canvas"></canvas>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="chart-card p-3 p-md-4 rounded shadow-lg glassy">
          <canvas ref="levelChart" class="chart-canvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const db = getFirestore()
const ranking = ref([])
const defaultAvatar = 'https://img.freepik.com/darmowe-wektory/awatar-postaci-biznesmen-na-bialym-tle_24877-60111.jpg?t=st=1734351587~exp=1734355187~hmac=7f3f29198ca151a6f1daece81575d4925299ba4e8e85296b61ff94e54bc5d49b'

const xpChart = ref(null)
const levelChart = ref(null)
let xpChartInstance = null
let levelChartInstance = null

// Poziom i postęp
const getLevel = (xp) => Math.floor(xp / 1000) + 1
const getProgress = (xp) => Math.floor(((xp % 1000) / 1000) * 100)

const fetchRanking = async () => {
  try {
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'))
    const querySnapshot = await getDocs(q)
    ranking.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Błąd pobierania rankingu:', error)
  }
}

const renderXpChart = () => {
  if (xpChartInstance) {
    xpChartInstance.destroy()
  }
  const ctx = xpChart.value.getContext('2d')
  const top5 = ranking.value.slice(0, 5)
  xpChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top5.map(u => u.name || 'Anonim'),
      datasets: [{
        label: 'XP',
        data: top5.map(u => u.xp),
        backgroundColor: [
          'rgba(185, 131, 255, 0.85)',
          'rgba(147, 112, 219, 0.85)',
          'rgba(123, 104, 238, 0.85)',
          'rgba(138, 43, 226, 0.85)',
          'rgba(106, 90, 205, 0.85)'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#b983ff',
            font: { weight: 'bold', size: 14 }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(185, 131, 255, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#b983ff',
            font: { weight: 'bold', size: 14 }
          },
          grid: {
            color: 'rgba(185, 131, 255, 0.2)'
          }
        },
        x: {
          ticks: {
            color: '#b983ff',
            font: { weight: 'bold', size: 14 }
          },
          grid: {
            color: 'transparent'
          }
        }
      }
    }
  })
}

const renderLevelChart = () => {
  if (levelChartInstance) {
    levelChartInstance.destroy()
  }
  const ctx = levelChart.value.getContext('2d')
  const top5 = ranking.value.slice(0, 5)
  levelChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top5.map(u => u.name || 'Anonim'),
      datasets: [{
        label: 'Poziom',
        data: top5.map(u => getLevel(u.xp)),
        backgroundColor: [
          'rgba(255, 215, 0, 0.85)',
          'rgba(192, 192, 192, 0.85)',
          'rgba(205, 127, 50, 0.85)',
          'rgba(138, 43, 226, 0.85)',
          'rgba(106, 90, 205, 0.85)'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#b983ff',
            font: { weight: 'bold', size: 14 }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(185, 131, 255, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#b983ff',
            font: { weight: 'bold', size: 14 }
          },
          grid: {
            color: 'rgba(185, 131, 255, 0.2)'
          }
        },
        x: {
          ticks: {
            color: '#b983ff',
            font: { weight: 'bold', size: 14 }
          },
          grid: {
            color: 'transparent'
          }
        }
      }
    }
  })
}

onMounted(async () => {
  await fetchRanking()
  await nextTick()
  renderXpChart()
  renderLevelChart()
})

// Re-render wykresów, gdy ranking się zmieni (np. w przyszłości)
watch(ranking, () => {
  renderXpChart()
  renderLevelChart()
})
</script>

<style scoped>
/* Glassy container */
.ranking-container {
  color: #eee;
  background: linear-gradient(135deg, #14111c, #1d1530);
  border-radius: 16px;
  animation: fadeIn 0.5s ease forwards;
}

/* Neonowy tekst */
.neon-text {
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

/* Karty wykresów */
.chart-card {
  background: rgba(33, 27, 56, 0.9);
  box-shadow: 0 4px 12px rgba(185, 131, 255, 0.5);
  border-radius: 16px;
  height: 300px;
  position: relative;
}

/* canvas wykresów, by były responsywne */
.chart-canvas {
  width: 100% !important;
  height: 100% !important;
  max-height: 100%;
}

/* Tabela */
.ranking-table {
  background: rgba(25, 19, 46, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(185, 131, 255, 0.3);
  overflow: hidden;
}

/* Najlepsi użytkownicy - podświetlenie */
.top-user {
  background: rgba(185, 131, 255, 0.15);
  font-weight: 700;
}

/* Animacja fade-in */
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.4s ease forwards;
}

/* Specjalne ikony */
.place-cell {
  font-weight: 700;
  font-size: 1.1rem;
}

.crown {
  color: #ffcc00;
  text-shadow:
    0 0 8px #fff200,
    0 0 15px #ffcc00;
}

.silver-medal {
  color: #c0c0c0;
  text-shadow:
    0 0 5px #e0e0e0;
}

.bronze-medal {
  color: #cd7f32;
  text-shadow:
    0 0 5px #d1a35f;
}

/* Avatar w tabeli */
.avatar {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border: 2px solid #b983ff;
  box-shadow: 0 0 8px #b983ff;
  transition: transform 0.3s ease;
}
.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 14px #d77eff;
}

/* Pasek postępu */
.progress-glow {
  background: linear-gradient(90deg, #b983ff, #7f5af0);
  box-shadow:
    0 0 8px #b983ff,
    0 0 12px #7f5af0;
  transition: width 0.6s ease;
  height: 100%;
  border-radius: 14px;
}

.progress {
  box-shadow:
    inset 0 0 8px rgba(255, 255, 255, 0.1);
  border-radius: 14px;
}

/* Animacja fade */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Glassy card style */
.glassy {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(185, 131, 255, 0.3);
  box-shadow: 0 0 10px rgba(185, 131, 255, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(5px);
}

/* Responsywne dostosowania */
@media (max-width: 767.98px) {
  .ranking-container {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .avatar {
    width: 32px;
    height: 32px;
  }
  
  .place-cell {
    font-size: 1rem;
  }
  
  .chart-card {
    height: 250px;
  }
}
</style>
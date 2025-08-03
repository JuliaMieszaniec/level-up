import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const user = ref(null)

export function useAuth() {
  const fetchUser = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        user.value = { uid: firebaseUser.uid, ...userDoc.data() }
      } else {
        user.value = { uid: firebaseUser.uid }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania użytkownika:', error)
      user.value = null
    }
  }

  onMounted(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUser(firebaseUser)
      } else {
        user.value = null
      }
    })
  })

  const logoutUser = async () => {
    try {
      await signOut(auth)
      user.value = null
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error)
    }
  }

  return { user, logoutUser }
}

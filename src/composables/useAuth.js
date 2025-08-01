import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const user = ref(null)

export function useAuth() {
  onMounted(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        user.value = userDoc.data()
      } else {
        user.value = null
      }
    })
  })

  return { user }
}

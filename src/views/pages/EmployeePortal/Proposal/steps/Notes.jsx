import React, { useState } from 'react'
import {
  CFormTextarea,
} from '@coreui/react'

    
function Notes({notes,setNotes}) {
  
  return (
    <>
  <h4>Notes</h4>
  <CFormTextarea
    rows={5}
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    placeholder="Enter notes here..."
  />
</>
  )
}

export default Notes
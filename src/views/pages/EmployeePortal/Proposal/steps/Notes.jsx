import React, { useState } from 'react'
import {
  CFormTextarea,
} from '@coreui/react'

function Notes() {
    const [notes, setNotes] = useState(
  `• This package license for one year and visa for 2 years, Medical & Work Protection Insurance is not included.
• Package renewal AED 21150/- VISA FREE FOR LIFE, as long as license valid.
• In case of any rejection by government, free zone refund money after deduction of specific amount.
• EWBS will not be responsible in case of any delay or change by government.`
)

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
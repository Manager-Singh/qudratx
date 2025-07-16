import React, { useEffect, useState, useRef } from 'react'
import Select from 'react-select'
import { useDispatch } from 'react-redux'
import { FaTimes } from 'react-icons/fa'
import { getBusinessActivityByAuthorityId } from '../../../../../store/admin/businessActivitySlice'
import CardSelector from '../CardSelector/CardSelector'


const PAGE_SIZE = 20

const BusinessActivityStepSelector = ({ step, authority_id }) => {
  const dispatch = useDispatch()

  const [businessActivities, setBusinessActivities] = useState([])
  const [selectedActivities, setSelectedActivities] = useState([])
  const [activityOptions, setActivityOptions] = useState([])

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loader = useRef(null)

  // Fetch activities on page change
  const fetchActivities = async (pageNum) => {
    setLoading(true)
    try {
      const res = await dispatch(
        getBusinessActivityByAuthorityId({ authority_id, page: pageNum, PAGE_SIZE })
      )
      const data = res.payload?.data || []

      if (data.length < PAGE_SIZE) setHasMore(false)

      // Update activity list (avoid duplicates)
      setBusinessActivities((prev) => {
        const newItems = data.filter(
          (item) => !prev.some((existing) => existing.id === item.id)
        )
        return [...prev, ...newItems]
      })

      // Update select options
     const newOptions = data.map((item) => ({
  value: item.id,
  label: `(${item.activity_code}) ${item.activity_name} `,
  code: item.activity_code, // 👈 Needed for custom search
}))
      setActivityOptions((prev) => {
        const all = [...prev, ...newOptions]
        const unique = Array.from(new Map(all.map((o) => [o.value, o])).values())
        return unique
      })
    } catch (error) {
      console.error('Error fetching business activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (step === 3) {
      fetchActivities(page)
    }
  }, [page, step])

  // Observe scroll to load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && step === 3) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1 }
    )

    if (loader.current) observer.observe(loader.current)
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [loader, hasMore, loading, step])

  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleActivityChange = (selected) => {
    setSelectedActivities(selected.map((item) => item.value))
  }

  if (step !== 3) return null

  return (
    <>
     <div className="d-flex flex-column" style={{ height: '60vh' }}>
  {/* Header + select */}
  <div>
    <h4>Select Business Activities</h4>
<Select
  isMulti
  options={activityOptions}
  value={activityOptions.filter((opt) =>
    selectedActivities.includes(opt.value)
  )}
  onChange={handleActivityChange}
  placeholder="Search by name or code..."
  className="mb-3"
  components={{ MultiValue: () => null }}
  filterOption={(option, inputValue) => {
    const label = option.label?.toLowerCase() || ''
    const code = activityOptions.find((a) => a.value === option.value)?.code?.toLowerCase() || ''
    const input = inputValue.toLowerCase()
    return label.includes(input) || code.includes(input)
  }}
/>

    {/* Selected badges */}
    <div className="mb-3 d-flex flex-wrap gap-2">
      {activityOptions
        .filter((opt) => selectedActivities.includes(opt.value))
        .map((opt) => (
          <span
            key={opt.value}
            className="badge bg-primary d-flex align-items-center"
            style={{ padding: '0.5rem 0.75rem', borderRadius: '20px' }}
          >
            {opt.label}
            <FaTimes
              onClick={() =>
                setSelectedActivities((prev) =>
                  prev.filter((id) => id !== opt.value)
                )
              }
              style={{
                marginLeft: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            />
          </span>
        ))}
    </div>
  </div>

  {/* Scrollable activity grid area */}
  <div
    style={{
      flexGrow: 1,
      overflowY: 'auto',
      paddingRight: '10px',
      position: 'relative',
    }}
  >
    <div className="row">
      {businessActivities.map((item) => {
        const isSelected = selectedActivities.includes(item.id)
        return (
          <div key={item.id} className="col-3 p-2">
            <CardSelector
              title={item.activity_name}
              activity_code = {item.activity_code}
              selected={isSelected}
              onClick={() => handleActivityToggle(item.id)}
              name="activity_group"
            />
          </div>
        )
      })}
    </div>

    {/* Loader inside scrollable container */}
    <div ref={loader} style={{ height: '5px', marginTop: '100px' }} />
    {loading && <div className="text-center py-3">Loading...</div>}
    {!hasMore && (
      <div className="text-center text-muted py-3">No more activities.</div>
    )}
  </div>
  </div>
    </>
  )
}

export default BusinessActivityStepSelector
